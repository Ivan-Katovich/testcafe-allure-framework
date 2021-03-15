import { CustomLogger } from '../../support/utils/log';
import * as records from './collections/records';
import * as templates from './collections/templates';
import BaseAPI from '../baseApi';
import infrastructureService from '../../services/entries/infrastructureService';

export default class CombinedFunctionality extends BaseAPI {

    public async createRecord(type: string, content: string, isUpdDataNecessary: boolean = false, modifier?: (b: any) => any): Promise<{reqData: any, respData: any, updateData: any}> {
        type = type.toLowerCase().replace(/\d/, '');
        content = content.toLowerCase();
        let body = infrastructureService.clone(records[type]()[content]);
        if (modifier) {
            body = modifier(body);
        }
        try {
            const resp = await this.post('/Records/records', body);
            let respData;
            let updateData;
            if (type === 'party') {
                let code;
                let partyTypeId;
                resp.data.ActiveChildRecord.Data[0].Properties.forEach((prop) => {
                    if (prop.ColumnName && prop.ColumnName === 'CODE') {
                        code = prop.Value;
                    }
                    if (prop.ColumnName && prop.ColumnName === 'PARTYTYPEID') {
                        partyTypeId = prop.Value;
                    }
                });
                respData = {
                    Code: code,
                    PartyTypeId: partyTypeId,
                    PartyDetailId: resp.data.FilingSectionDefinition.RecordId
                };
            } else {
                respData = {
                    Record: {
                        IpType: resp.data.FilingSectionDefinition.IpType,
                        MasterId: resp.data.FilingSectionDefinition.RecordId
                    },
                    ResourceId: body.dataEntryFormTemplateResourceId
                };
                if (isUpdDataNecessary) {
                    updateData = resp.data.FilingSectionDefinition.Properties
                        .reduce((data, prop) => {
                            if (prop.ColumnName.toLowerCase() === 'createuser') {
                                data.createUser = prop.Value;
                            } else if (prop.ColumnName.toLowerCase() === 'createdate') {
                                data.createDate = prop.Value;
                            } else if (prop.ColumnName.toLowerCase() === 'updateuser') {
                                data.updateUser = prop.Value;
                            } else if (prop.ColumnName.toLowerCase() === 'updatedate') {
                                data.updateDate = prop.Value;
                            }
                            return data;
                        }, {});
                }
            }
            const reqData = {
                dataEntryFormTemplateResourceId: body.dataEntryFormTemplateResourceId,
                recordName: body.filingObjectDefinition.Properties.filter((prop) => {
                    let value;
                    if (prop.Value && typeof prop.Value === 'string') {
                        value = prop.Value.toLowerCase();
                        if (value.includes(type) && value.includes(content)) {
                            return prop.Value;
                        }
                    }
                })[0].Value
            };
            return {
                updateData,
                reqData,
                respData
            };
        } catch (err) {
            CustomLogger.logger.log('WARN', `createRecord request is completed with Error: ${err}`);
            return null;
        }
    }

    public async createTemplate(type: string, name: string, contentGroupId?: number, modifier?: (any) => any): Promise<any> {
        type = type.toLowerCase().replace(' ', '');
        const urls = {
            email: `/AdminPortal/EmailTemplates/save`,
            externalweblink: `/AdminPortal/saveExternalWebLink`,
            partyformletter: `/AdminPortal/FormLetters/save`,
            report: `/AdminPortal/Reports/save`,
            variableweblinks: `/AdminPortal/VariableHyperLinks/save`,
            patentformletter: `/AdminPortal/FormLetters/save`,
            globalchangetemplate: `/AdminPortal/GlobalChangeTemplates/save`
        };
        let body = templates[type].create(name, contentGroupId);
        if (modifier) {
            body = modifier(body);
        }
        const resp = await this.post(urls[type], body);
        CustomLogger.logger.log('method', `${type} with name ${name} was created`);
        return resp.data;
    }

    public async deleteRecords(recordsArray: object[], recordType: string = 'query record'): Promise<void> {
        CustomLogger.logger.log('method', `Records with type '${recordType}' to delete: ${JSON.stringify(recordsArray)}`);
        recordType = recordType.toLowerCase();
        const urls = {
            'query record': '/Records/records/deletequeryrecords/',
            'party': '/Common/parties/delete/',
            'code': '/AdminPortal/Codes/deleteMultiple',
            'content group': '/AdminPortal/ContentGroupAdmin/deleteAll',
            'query group': '/AdminPortal/QueryGroups/deleteMultiple',
            'display configuration': '/AdminPortal/DisplayConfiguration/deleteAll',
            'email template': '/AdminPortal/EmailTemplates/deleteAll',
            'auto update': '/RulesManagement/delete/',
            'global change template': '/AdminPortal/GlobalChangeTemplates/deleteMultiple'
        };
        if (!Object.keys(urls).includes(recordType)) {
            throw new Error(`Wrong Record type '${recordType}' should be one of ${Object.keys(urls)}`);
        }
        CustomLogger.logger.log('method', `URL '${urls[recordType]}'`);
        await this.post(urls[recordType], recordsArray);
    }
}
