import DataEntryForm from './api/pages/dataEntryForm';
import Party from './api/pages/party';
import PartyQuery from './api/pages/partyQuery';
import Administration from './api/pages/administration';
import CombinedFunctionality from './api/combinedFunctionality';
import UserPreferences from './api/pages/userPreferences';
import Collaboration from './api/pages/collaboration';
import Query from './api/pages/query';
import BasePage from './api/pages/basePage';
import DeletionManagementQuery from './api/pages/deletionManagementQuery';
import QueryManagement from './api/pages/queryManagement';
import GlobalSearch from './api/pages/globalSearch';
import AuditLogQuery from './api/pages/auditLogQuery';
import GlobalChangeLogQuery from './api/pages/globalChangeLogQuery';
import MessageCenterQuery from './api/pages/messageCenterQuery';

export default class Api extends BasePage {
    constructor(cookieProvider) {
        super(cookieProvider);
    }
    public name = 'Api';

    // Getters

    get dataEntryForm() {
        return this.createGetter(DataEntryForm, this.cookieProvider);
    }

    get party() {
        return this.createGetter(Party, this.cookieProvider);
    }

    get partyQuery() {
        return this.createGetter(PartyQuery, this.cookieProvider);
    }

    get administration() {
        return this.createGetter(Administration, this.cookieProvider);
    }

    get combinedFunctionality() {
        return this.createGetter(CombinedFunctionality, this.cookieProvider);
    }

    get userPreferences() {
        return this.createGetter(UserPreferences, this.cookieProvider);
    }

    get collaboration() {
        return this.createGetter(Collaboration, this.cookieProvider);
    }

    get query() {
        return this.createGetter(Query, this.cookieProvider);
    }

    get deletionManagementQuery() {
        return this.createGetter(DeletionManagementQuery, this.cookieProvider);
    }

    get queryManagement() {
        return this.createGetter(QueryManagement, this.cookieProvider);
    }

    get globalSearch() {
        return this.createGetter(GlobalSearch, this.cookieProvider);
    }

    get auditLogQuery() {
        return this.createGetter(AuditLogQuery, this.cookieProvider);
    }

    get globalChangeLogQuery() {
        return this.createGetter(GlobalChangeLogQuery, this.cookieProvider);
    }

    get messageCenterQuery() {
        return this.createGetter(MessageCenterQuery, this.cookieProvider);
    }

    public async addChildRecords(recordId: number, templateNameOrId: any, childs: Array<{childName: string,
            rows: Array < { properties: Array<{name: string, value: string}> } > }>): Promise<void> {
        if (typeof (templateNameOrId) === 'string') {
            templateNameOrId = (await this.administration.getAllDataEntryTemplates()).Items.find((x) => x.CustomResourceName === templateNameOrId).ResourceId;
        }
        await this.dataEntryForm.openRecord(recordId, templateNameOrId);
        for (const child of childs) {
            await this.dataEntryForm.openChild(child.childName);
            for (const row of child.rows) {
                this.dataEntryForm.addChildRecord();
                for (const property of row.properties) {
                    await this.dataEntryForm.setChildValue(property.name, property.value);
                }
            }
        }

        await this.dataEntryForm.save();
    }

    public async removeAllChildRecords(recordId: number, templateNameOrId: any, childName: string): Promise<void> {
        if (typeof (templateNameOrId) === 'string') {
            templateNameOrId = (await this.administration.getAllDataEntryTemplates()).Items.find((x) => x.CustomResourceName === templateNameOrId).ResourceId;
        }
        await this.dataEntryForm.openRecord(recordId, templateNameOrId);
        await this.dataEntryForm.openChild(childName);
        for (let i = 0; i < this.dataEntryForm.getChildRecordsCount(); i++ ) {
            this.dataEntryForm.deleteChildRecord(i);
        }
        await this.dataEntryForm.save();
    }

    public async changeValuesForRecord(recordId: number, templateNameOrId: any,
                                       changes: Array<{name: string, value: any}> = null,
                                       saveAndValidate: boolean = false): Promise<void> {
        if (typeof (templateNameOrId) === 'string') {
            templateNameOrId = (await this.administration.getAllDataEntryTemplates()).Items.find((x) => x.CustomResourceName === templateNameOrId).ResourceId;
        }
        await this.dataEntryForm.openRecord(recordId, templateNameOrId);
        for (let change of changes) {
            await this.dataEntryForm.setValue(change.name, change.value);
        }
        await this.dataEntryForm.save(saveAndValidate);
    }

    public async createRecordWithValues(type: string, content: string, values: Array<{name: string, value: string}>): Promise<any> {
        const recordData = await this.combinedFunctionality.createRecord(type, content);
        await this.dataEntryForm.openRecord(recordData.respData.Record.MasterId,
            recordData.reqData.dataEntryFormTemplateResourceId);
        for (let value of values) {
            await this.dataEntryForm.setValue(value.name, value.value);
        }
        await this.dataEntryForm.save();
        return recordData;
    }

    public async changePermissionsInContentGroup(contentGroupName: string, permissions: Array<{name: string, check: boolean}>): Promise<void> {
        await this.administration.contentGroup.openContentGroup(contentGroupName);
        permissions.forEach((permission) => this.administration.contentGroup.setPermission(permission.name, permission.check));
        await this.administration.contentGroup.save();
        await this.administration.clearCache();
    }

    public async changeApplicationSecurityInContentGroup(contentGroupName: string, changesArray: any[]): Promise<void> {
        await this.administration.contentGroup.openContentGroup(contentGroupName);
        for (const change of changesArray) {
            await this.administration.contentGroup.setApplicationSecurity(change.Path,
                    { editPermission: change.EditPermission,
                    visiblePermission: change.VisiblePermission,
                    deletePermission: change.DeletePermission},
                    change.isOnly);
        }
        await this.administration.contentGroup.save();
        await this.administration.clearCache();
    }

    public async setContentGroupDefaults(contentGroupName: string) {
        await this.administration.contentGroup.openContentGroup(contentGroupName);
        await this.administration.contentGroup.setAppSecurityDefaults();
        await this.administration.contentGroup.setPermissionDefaults();
        await this.administration.contentGroup.save();
        await this.administration.clearCache();
    }

    public async changeDisplayConfigurationForUser(displayConfiguration: string, userName: string): Promise<void> {
        await this.administration.displayConfiguration.openDisplayConfiguration(displayConfiguration);
        await this.administration.displayConfiguration.addUser(userName);
        await this.administration.displayConfiguration.save();
    }

    public async activatePartyCode(codeName: string, partyType: string, isActive: boolean = true): Promise<void> {
        let queryPath = 'Party>Party Query';
        await this.partyQuery.openQuery(queryPath);
        await this.partyQuery.addCriteria('CODE', codeName);
        await this.partyQuery.addCriteria('Party Type', partyType);
        await this.partyQuery.runQuery();
        const records = await this.partyQuery.getRecordIdsFromResults();
        // const resourceId = (await this.administration.getAllDataEntryTemplates()).Items.find((x) => x.CustomResourceName === 'New Party').ResourceId;
        for (const record of records) {
            await this.party.openRecord(record, 606);
            await this.party.openRelatedParties();
            for (let i = 0; i < this.party.getChildRecordsCount(); i++) {
                if (this.party.getChildValue('CODE', i) === codeName && this.party.getChildValue('Party Type', i).includes(partyType)) {
                    await this.party.setChildValue('ACTIVE', isActive, i);
                }
            }
            await this.party.save();
        }
    }

    public async activatePartyCodeByValue(value: string, partyType: string, isActive: boolean = true): Promise<void> {
        const code = (await this.common.getPartyLookupsForType(partyType)).Data.find((x) => x.DisplayName === value);
        // const resourceId = (await this.administration.getAllDataEntryTemplates()).Items.find((x) => x.CustomResourceName === 'New Party').ResourceId;
        await this.party.openRecord(code.PartyDetailId, 606);
        await this.party.openRelatedParties();
        for (let i = 0; i < this.party.getChildRecordsCount(); i++) {
            if (this.party.getChildValue('PARTYID', i) === code.PartyId) {
                await this.party.setChildValue('ACTIVE', isActive, i);
            }
        }
        await this.party.save();
    }

    public async setContentGroupActivity(contentGroupName: string, status: boolean): Promise<void> {
        await this.administration.contentGroup.openContentGroup(contentGroupName);
        this.administration.contentGroup.setActive(status);
        await this.administration.contentGroup.save();
    }
}
