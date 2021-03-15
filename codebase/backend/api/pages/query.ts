import * as queries from '../collections/queries';
import { CustomLogger } from '../../../support/utils/log';
import BaseQuery from './baseQuery';

export default class Query extends BaseQuery {

    protected queryPageName = 'Queries';

    public async createPreconditionQuery(type: string, name: string, contentGroup: {id: number, name?: string} = null, queryGroupId: number = null, modifier?: (b: any) => any): Promise<any> {
        try {
            type = type.toLowerCase();
            let body = queries[type].create(name, contentGroup, queryGroupId);
            if (modifier) {
                body = modifier(body);
            }
            const data = (await this.post('/Queries/querymanagement/save', body)).data;
            CustomLogger.logger.log('method', `Create query with name '${name}' and ID '${data.ResourceId}' for content group '${contentGroup ? contentGroup.name : 'private'}' (API)`);
            return data;
        } catch (error) {
            CustomLogger.logger.log('WARN', `createPreconditionQuery request is completed with error: ${error.message}`);
            return null;
        }
    }

    public async deleteQuery(queryId: number = null): Promise<any> {
        CustomLogger.logger.log('method', `Delete query with id = ${queryId} (API)`);
        if (queryId) {
            await this.delete(`/Queries/querymanagement/${queryId}`);
        }
    }

    public async openQueryManagement(queryName: string = null): Promise<any> {
        if (queryName) {
            await this.openQuery(queryName);
        }
        CustomLogger.logger.log('method', `Open Query Management for query with id ${this.currentQueryId} (API)`);
        this.queryManagementResults = (await this.get(`/Queries/querymanagement/${this.currentQueryId}`, this.queryData)).data;
        return this.queryManagementResults;
    }

    public async setQueryOptions(type: string, specific: string): Promise<void> {
        type = type.toLowerCase();
        specific = specific.toLowerCase();
        await this.post('/Queries/querymanagement/save', queries[type].change[specific]);
    }

    public enableDataModification(value: boolean = true): void {
        this.queryManagementResults.QueryMetadata.DataModificationFormApplicable = value;
    }

    public removeResultField(fieldName: string): void {
        this.queryManagementResults.QueryMetadata.ResultFields = this.queryManagementResults.QueryMetadata.ResultFields.filter((x) => x.Display !== fieldName);
    }

    public addResultField(fieldName: string): void {
        const fieldInfo = this.queryManagementResults.QueryMetadata.FieldMetadata.find((x) => x.CustomValue === fieldName);
        this.queryManagementResults.QueryMetadata.ResultFields
            .push({
                DataInfo: fieldInfo,
                Display: fieldInfo.CustomValue,
                Value: this.queryManagementResults.QueryMetadata.From + '.' + fieldInfo.FieldAliasName
            });
    }

    public async save(): Promise<void> {
        this.queryManagementResults.QueryMetadata.AdditionalFilters.forEach((x) => {
            x.Field = this.queryManagementResults.QueryMetadata.FieldMetadata.find((y) => y.FieldAliasName === x.FieldAlias);
        });
        await this.post('/Queries/querymanagement/save', this.queryManagementResults);
    }

    public async getSourceInfo(source: string): Promise<any> {
        return (await this.get(`/Queries/querymanagement/sourcesinfo/${source}`)).data;
    }

    public async collaborateRecords(processName: string, recordNumber: number): Promise<void> {
        const collaborationItems = (await this.getAllRecordActions()).find((x) => x.RecordActionType === 'Collaboration').Items;
        const processId = collaborationItems.find((x) => x.ResourceName === processName).ResourceId;
        const masterIdIndex = this.queryResults.FieldNames.findIndex((x) => x === this.queryMetadata.MasterIdFieldAliasName);
        const masterIds = this.queryResults.Rows.filter((x, i) => i < recordNumber).map((x) => x[masterIdIndex]);
        const body = {
            MasterIds: masterIds,
            WorkflowResourceId: processId
        };
        await this.post('/Integration/collaborate/selected/', body);
    }

    public async collaborateRecordsWithIds(processName: string, recordIds: number[]): Promise<void> {
        const collaborationItems = (await this.getAllRecordActions()).find((x) => x.RecordActionType === 'Collaboration').Items;
        const processId = collaborationItems.find((x) => x.ResourceName === processName).ResourceId;
        const body = {
            MasterIds: recordIds,
            WorkflowResourceId: processId
        };
        await this.post('/Integration/collaborate/selected/', body);
    }

    private async getAllRecordActions(): Promise<any> {
        return (await this.get('/UsersManagement/UserResources/recordactions/')).data;
    }
}
