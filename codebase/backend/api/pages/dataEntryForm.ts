import moment = require('moment');
import Common from './common';
import { CustomLogger } from '../../../support/utils/log';
import Administration from './administration';
import BasePage from './basePage';
import infrastructureService from '../../../services/entries/infrastructureService';
import UserPreferences from './userPreferences';

export default class DataEntryForm extends BasePage {

    private recordId: number;
    private resourceId: number;
    private recordData: any;
    private form: any;
    private currentChildName: any;
    private currentChildForm: any;
    private currentChild: any;
    private childrenCache: { [index: string]: any } = {};

    get administration() {
        return this.createGetter(Administration, this.cookieProvider);
    }

    get common() {
        return this.createGetter(Common, this.cookieProvider);
    }

    public async openRecord(recordId: number, templateNameOrId: any): Promise<void> {
        CustomLogger.logger.log('method', `Open the data entry form record with id = ${recordId} (API)`);
        if (typeof templateNameOrId === 'string') {
            templateNameOrId = (await this.administration.getAllDataEntryTemplates()).Items.find((x) => x.CustomResourceName === templateNameOrId).ResourceId;
        }

        this.recordId = recordId;
        this.resourceId = templateNameOrId;
        const params = {
            masterId: recordId,
            resourceId: templateNameOrId
        };
        this.recordData = (await this.get('/Records//records', params)).data.RecordData;
        this.form = (await this.get(`/Records/forms/${this.resourceId}`, { isNew: false })).data;
        this.childrenCache = {};
        this.currentChild = null;
        this.currentChildForm = null;
        this.currentChildName = null;
    }

    public async setValue(name: string, value: any): Promise<void> {
        CustomLogger.logger.log('method', `Set the ${name} field to ${value} (API)`);
        let field = this.form.FilingSection.Fields.find((x) => x.DisplayConfiguredName === name);
        let fieldValue = await this.getFieldValue(field, value);
        this.recordData.Properties.find((x) => x.DataDictionaryId === field.DataDictionaryId).Value = fieldValue;
    }

    public async getValue(name: string): Promise<any> {
        const field = this.form.FilingSection.Fields.find((y) => y.DisplayConfiguredName === name);
        const fieldProperty = this.recordData.Properties.find((x) => x.DataDictionaryId === field.DataDictionaryId);
        return await this.getUIFieldValue(field, fieldProperty.Value);
    }

    public async save(validate: boolean = false): Promise<void> {
        CustomLogger.logger.log('method', `Save data entry record (API)`);
        let body = {
            activeChildSectionCriteria: null,
            changedChildRecords: this.getChangedChildRecords(),
            dataEntryFormTemplateResourceId: this.resourceId,
            filingObjectDefinition: this.recordData,
            isBypassConcurrencyChecks: false,
            withValidation: validate
        };
        await this.put(`/Records/records/${this.recordId}`, body);
    }

    public async getFieldAllPossibleValues(name: string): Promise<string[]> {
        CustomLogger.logger.log('method', `Get all possible values for the '${name}' lookup field on a DEF (API)`);
        const field = this.form.FilingSection.Fields.find((y) => y.DisplayConfiguredName === name);
        let array = [];
        if (field.LookupSource === 'CODES') {
            array = (await this.common.getCodesForType(field.LookupSourceType)).Data.map((x) => x.Description);
        } else if (field.LookupSource === 'PARTIES') {
            array = (await this.common.getPartyLookupsForType(field.LookupSourceType)).Data.map((x) => x.DisplayName);
        } else if (field.LookupSource === 'COUNTRIES') {
            array = (await this.common.getCountriesForIPType(this.form.FilingSection.IpType)).Data.map((x) => x.Name);
        }
        return array;
    }

    //#region Child

    public addChildRecord(): void {
        CustomLogger.logger.log('method', 'Add new child record (API)');
        const row = infrastructureService.clone(this.currentChild.TypeDefinition);
        row.isNew = true;
        this.currentChild.Data.unshift(row);
    }

    public getChildRecordsCount(): number {
        return this.currentChild.Data.length;
    }

    public getChildValue(name: string, index: number = 0): any {
        const row = this.currentChild.Data[index];
        const field = this.currentChildForm.Fields.find((y) => y.DisplayConfiguredName === name);
        const fieldProperty = row.Properties.find((y) => y.ColumnName.toLowerCase() === field.FieldName.toLowerCase());
        return fieldProperty.Value;
    }

    public getChildRecordId(index: number = 0): number {
        return this.currentChild.Data[index].RecordId;
    }

    public async openChild(childName: string): Promise<void> {
        CustomLogger.logger.log('method', `Open the ${childName} child (API)`);
        this.currentChildForm = this.form.ChildSections.find((x) => x.DisplayConfiguredName === childName);
        const childTableName = this.currentChildForm.TableName;
        if (!this.childrenCache.hasOwnProperty(childName)) {
            this.childrenCache[childName] = (await this.get(`/Records/records/${this.recordId}/child/`, {
                resourceId: this.resourceId,
                childTableName,
                isDeletedMasterRecord: false
            })).data;
        }
        this.currentChild = this.childrenCache[childName];
        this.currentChildName = childName;
    }

    public async addRelatedRecord(records: number[], relationship: string): Promise<void> {
        const relationshipCodeId = (await this.common.getCodesForType('RSH')).Data.find((x) => x.Code === relationship || x.Description === relationship).CodeId;
        const body = {
            MasterId: this.recordId,
            MasterIdsToRelate: records,
            MasterTableName: this.recordData.TableName,
            RelatedMasterTableName: this.recordData.TableName,
            Relationship: relationshipCodeId
        };
        await this.post('/Records/relatedrecords/create', body);
    }

    public async setChildValue(name: string, value: any, index: number = 0): Promise<void> {
        CustomLogger.logger.log('method', `Set the ${name} field was set to ${value} in the child (API)`);
        const row = this.currentChild.Data[index];
        const field = this.currentChildForm.Fields.find((y) => y.DisplayConfiguredName === name);
        const fieldProperty = row.Properties.find((y) => y.ColumnName.toLowerCase() === field.FieldName.toLowerCase());
        fieldProperty.Value = await this.getFieldValue(field, value, row);
        if (!row.isNew) {
            row.isDirty = true;
        }
    }

    public deleteChildRecord(index: number = 0): void {
        CustomLogger.logger.log('method', `Delete record with the index = ${index} (API)`);
        const row = this.currentChild.Data[index];
        row.IsDeleted = true;
    }

    public async getChildAllPossibleValues(column: string): Promise<any[]> {
        CustomLogger.logger.log('method', `Get all possible dropdown values for the '${column}' column in the child (API)`);
        const field = this.currentChildForm.Fields.find((y) => y.DisplayConfiguredName === column);
        let array = [];
        if (field.LookupSource === 'CODES') {
            array = (await this.common.getCodesForType(field.LookupSourceType)).Data.map((x) => x.Description);
        } else if (field.LookupSource === 'PARTIES') {
            array = (await this.common.getPartyLookupsForType(field.LookupSourceType)).Data.map((x) => x.DisplayName);
        } else if (field.LookupSource === 'COUNTRIES') {
            array = (await this.common.getCountries()).Data.map((x) => x.Name);
        }
        return array;
    }

    //#endregion

    //#region private

    private getChangedChildRecords(): any[] {
        const changedChildRecords = [];
        for (const child in this.childrenCache) {
            for (const record of this.childrenCache[child].Data) {
                if (record.isDirty || record.isNew || record.IsDeleted) {
                    changedChildRecords.push(record);
                }
            }
        }
        return changedChildRecords;
    }

    private async getUIFieldValue(field: any, value: any): Promise<any> {
        let fieldValue = value;
        if (field.LookupSource === 'CODES') {
            fieldValue = (await this.common.getCodesForType(field.LookupSourceType)).Data.find((x) => x.CodeId === fieldValue).Description;
        } else if (field.LookupSource === 'PARTIES') {
            fieldValue = (await this.common.getPartyLookupsForType(field.LookupSourceType)).Data.find((x) => x.PartyId === fieldValue).DisplayName;
        } else if (field.LookupSource === 'COUNTRIES') {
            fieldValue = (await this.common.getCountries()).Data.find((x) => x.Id === Number(fieldValue)).Name;
        }

        return fieldValue;
    }

    private async getFieldValue(field: any, value: any, row: any = null): Promise<any> {
        let fieldValue = value;
        if (field.LookupSource === 'CODES') {
            fieldValue = (await this.common.getCodesForType(field.LookupSourceType)).Data.find((x) => x.Description === fieldValue).CodeId;
        } else if (field.LookupSource === 'PARTIES') {
            fieldValue = (await this.common.getPartyLookupsForType(field.LookupSourceType)).Data.find((x) => x.DisplayName === fieldValue).PartyId;
        } else if (field.LookupSource === 'COUNTRIES') {
            fieldValue = (await this.common.getCountries()).Data.find((x) => x.Name === fieldValue).Id;
        } else if (field.DataTypeName === 'datetime' || field.DataTypeName === 'date') {
            const dateFormat = (await new UserPreferences(this.cookieProvider).getUserPreferences()).Preferences.DateFormat.Value.toUpperCase();
            fieldValue = moment(fieldValue, dateFormat).toISOString(true);
        } else if (field.DataTypeName === 'BITTYPE') {
            if (fieldValue === 'check' || fieldValue === true) {
                fieldValue = true;
            } else if (fieldValue === 'uncheck' || fieldValue === false) {
                fieldValue = false;
            } else {
                throw new Error(`Wrong value '${fieldValue}' for checkbox field`);
            }
        } else if (field.FieldName.includes('LINKEDFILE')) {
            fieldValue = await this.getExternalFileId(value);
            if (fieldValue === null && row !== null) {
                const tempValue = await this.addLinkToExternalFiles(value);
                row.Properties.push({
                    ColumnName: `TEMPFILEID_${field.FieldName}`,
                    MemberName: `TEMPFILEID_${field.FieldName}`,
                    Alias: `TEMPFILEID_${field.FieldName}`,
                    Value: tempValue,
                    TypeName: 'System.Int32'
                });
            }
        }

        return fieldValue;
    }

    private async getExternalFileId(value: string): Promise<number> {
        const currentChild = this.currentChildName;
        await this.openChild('External Files');
        for (let i = 0; i < this.getChildRecordsCount(); i++) {
            if (await this.getChildValue('External File Location', i) === value) {
                const recordId = this.getChildRecordId(i);
                await this.openChild(currentChild);
                return recordId;
            }
        }
        return null;
    }

    private async addLinkToExternalFiles(value: string): Promise<number> {
        const tempValue = -1;
        const childTableForm = this.form.ChildSections.find((x) => x.DisplayConfiguredName === 'External Files');
        const childTableName = childTableForm.TableName;
        const fields = childTableForm.Fields;
        const child = (await this.get(`/Records/records/${this.recordId}/child/`, {
            resourceId: this.resourceId,
            childTableName,
            isDeletedMasterRecord: false
        })).data;

        const childTypeDefinition = child.TypeDefinition;
        const childRow = infrastructureService.clone(childTypeDefinition);

        let field = fields.find((y) => y.DisplayConfiguredName === 'External File Location');
        let fieldProperty = childRow.Properties.find((y) => y.ColumnName === field.FieldName);
        fieldProperty.Value = await this.getFieldValue(field, value, childRow);

        field = fields.find((y) => y.DisplayConfiguredName === 'Link Type');
        fieldProperty = childRow.Properties.find((y) => y.ColumnName === field.FieldName);
        fieldProperty.Value = await this.getFieldValue(field, 'URL - (URL)', childRow);

        childRow.isNew = true;
        childRow.Properties.push({
            ColumnName: 'TEMPFILEID',
            MemberName: 'TEMPFILEID',
            Alias: 'TEMPFILEID',
            Value: tempValue,
            TypeName: 'System.Int32'
        });
        child.Data.push(childRow);

        this.childrenCache['External Files'] = child;
        return tempValue;
    }

    //#endregion
}
