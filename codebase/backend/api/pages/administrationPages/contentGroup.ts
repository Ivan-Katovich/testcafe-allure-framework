import { CustomLogger } from '../../../../support/utils/log';
import BasePage from '../basePage';
import infrastructureService from '../../../../services/entries/infrastructureService';
import moment = require('moment');
import nodeService from '../../../../services/entries/nodeService';

export default class ContentGroup extends BasePage {

    private allContentGroups: any;
    private groupId: number;
    private groupName: string;
    private groupData: any;
    private permissionsAndResources: any[];
    private applicationSecurity: any[];
    private contentGroupCache: { [index: string]: { contentGroupData: any, permissionAndResources: any, applicationSecurity: any } } = {};

    public async openContentGroup(groupName: string, force: boolean = false): Promise<void> {
        CustomLogger.logger.log('method', `Open the '${groupName}' content group (API)`);
        if (!this.allContentGroups) {
            await this.getAllContentGroups();
        }
        this.groupName = groupName;
        if (this.contentGroupCache[groupName] && !force) {
            this.groupId = this.contentGroupCache[groupName].contentGroupData.ContentGroupId;
            this.groupData = this.contentGroupCache[groupName].contentGroupData;
            this.permissionsAndResources = this.contentGroupCache[groupName].permissionAndResources;
            this.applicationSecurity = this.contentGroupCache[groupName].applicationSecurity;
        } else {
            this.groupId = this.allContentGroups.Items.find((x) => x.ContentGroupName === groupName).ContentGroupId;
            this.groupData = (await this.get('/AdminPortal/ContentGroupAdmin/get', { id: this.groupId }, {retry: true})).data;
            this.contentGroupCache[this.groupName] = { contentGroupData: null, permissionAndResources: null, applicationSecurity: null };
            this.contentGroupCache[this.groupName].contentGroupData = { ...this.groupData };
            await this.getPermissionsAndResources();
            this.applicationSecurity = null;
        }
    }

    public async getContentGroupIdByName(groupName: string): Promise<number> {
        if (!this.allContentGroups) {
            await this.getAllContentGroups();
        }
        this.groupName = groupName;
        let id: number;
        if (this.contentGroupCache[groupName]) {
            id = this.contentGroupCache[groupName].contentGroupData.ContentGroupId;
        } else {
            id = this.allContentGroups.Items.find((x) => x.ContentGroupName === groupName).ContentGroupId;
        }
        CustomLogger.logger.log('method', `ID of '${groupName}' CG is ${id} (API)`);
        return id;
    }

    public setActive(status: boolean): void {
        CustomLogger.logger.log('method', `Set active to ${status} (API)`);
        this.groupData.Status = status;
    }

    public setPermission(nameOrPath: string, permissionValue: boolean): void {
        CustomLogger.logger.log('method', `Set permission ${nameOrPath} to ${permissionValue} (API)`);
        const permissionsToChange = nodeService.getAllLastNodesUnderPath(this.permissionsAndResources, nameOrPath, 'DisplayText', 'ResourceListItems');
        permissionsToChange.forEach((x) => x.Selected = permissionValue);
    }

    public async setPermissionForIpType(nameOrPath: string, ipType: string, permissionValue: boolean): Promise<void> {
        CustomLogger.logger.log('method', `Set permission ${nameOrPath} to ${permissionValue} (API)`);
        const ipTypeId = (await this.common.getIpTypes()).find((x) => x.Description === ipType).IpTypeId;
        const permissionsToChange = nodeService.getAllLastNodesUnderPath(this.permissionsAndResources, nameOrPath, 'DisplayText', 'ResourceListItems')
            .filter((x) => x.IpType === ipTypeId);
        permissionsToChange.forEach((x) => x.Selected = permissionValue);
    }

    public async getPermissionsChildrenNamesForIpType(nameOrPath: string, ipType: string): Promise<string[]> {
        const ipTypeId = (await this.common.getIpTypes()).find((x) => x.Description === ipType).IpTypeId;
        const permissionsNames = nodeService.getAllLastNodesUnderPath(this.permissionsAndResources, nameOrPath, 'DisplayText', 'ResourceListItems')
            .filter((x) => x.IpType === ipTypeId);
        return permissionsNames.map((x) => x.DisplayText);
    }

    public async setPermissionDefaults() {
        CustomLogger.logger.log('method', `Set permission defaults (API)`);
        const disableOptions: any[] = [];
        let iterator = infrastructureService.propertiesGenerator(this.permissionsAndResources, 'ResourceListItems');
        let property = iterator.next();
        while (!property.done) {
            if (property.value.DisplayText === 'Disable Options') {
                disableOptions.push(property.value);
            }
            property.value.Selected = true;
            property = iterator.next();
        }
        iterator = infrastructureService.propertiesGenerator(disableOptions, 'ResourceListItems');
        property = iterator.next();
        while (!property.done) {
            property.value.Selected = false;
            property = iterator.next();
        }
    }

    public async setApplicationSecurity(nameOrPath: string, permissions: { editPermission?: boolean, visiblePermission?: boolean, deletePermission?: boolean}, isOnly: boolean = false ): Promise<void> {
        if (!this.applicationSecurity) {
            await this.getApplicationSecurity();
        }
        let applicationSecurityNodes;
        if (isOnly) {
            applicationSecurityNodes = [nodeService.getCurrentNode(this.applicationSecurity, nameOrPath, 'Name', 'ChildItems')];
        } else {
            applicationSecurityNodes = nodeService.getAllLastNodesUnderPathWithParents(this.applicationSecurity, nameOrPath, 'Name', 'ChildItems');
        }
        if (permissions.editPermission !== undefined) {
            applicationSecurityNodes.forEach((x) => {
                x.EditPermission = permissions.editPermission;
                x.EditConditionId = 0;
                x.EditManagedConditionName = null;
            });
            CustomLogger.logger.log('method', `Set the application security edit permission under path '${nameOrPath}' to ${permissions.editPermission} (API)`);
        }
        if (permissions.visiblePermission !== undefined) {
            applicationSecurityNodes.forEach((x) => {
                x.VisiblePermission = permissions.visiblePermission;
                x.VisibleConditionId = 0;
                x.VisibleManagedConditionName = null;
            });
            CustomLogger.logger.log('method', `Set the application security visible permission under path '${nameOrPath}' to ${permissions.visiblePermission} (API)`);
        }
        if (permissions.deletePermission !== undefined) {
            applicationSecurityNodes.forEach((x) => {
                x.DeletePermission = permissions.deletePermission;
                x.DeleteConditionId = 0;
                x.DeleteManagedConditionName = null;
            });
            CustomLogger.logger.log('method', `Set the application security delete permission under path '${nameOrPath}' to ${permissions.deletePermission} (API)`);
        }
    }

    public async setAppSecurityDefaults() {
        CustomLogger.logger.log('method', `Set application security defaults defaults (API)`);
        if (!this.applicationSecurity) {
            await this.getApplicationSecurity();
        }
        const iterator = infrastructureService.propertiesGenerator(this.applicationSecurity, 'ChildItems');
        let property = iterator.next();
        while (!property.done) {
            property.value.VisiblePermission = true;
            property.value.VisibleConditionId = 0;
            property.value.VisibleManagedConditionName = null;
            property.value.EditPermission = true;
            property.value.EditConditionId = 0;
            property.value.EditManagedConditionName = null;
            property.value.DeletePermission = true;
            property.value.DeleteConditionId = 0;
            property.value.DeleteManagedConditionName = null;
            property = iterator.next();
        }
    }

    public async setApplicationSecurityWithCondition(nameOrPath: string, conditions: { editCondition?: string, visibleCondition?: string, deleteCondition?: string}): Promise<void> {
        if (!this.applicationSecurity) {
            await this.getApplicationSecurity();
        }

        const applicationSecurityNode = nodeService.getCurrentNode(this.applicationSecurity, nameOrPath, 'Name', 'ChildItems');
        const id = applicationSecurityNode.AppTableId ? applicationSecurityNode.AppTableId : applicationSecurityNode.Id;
        if (conditions.editCondition) {
            CustomLogger.logger.log('method', `Set conditional edit permission under path '${nameOrPath}' to ${conditions.editCondition} (API)`);
            const condition = (await this.getAllManagedConditions(id)).Items.find((x) => x.ConditionName === conditions.editCondition);
            applicationSecurityNode.EditConditionId = condition.ConditionId;
            applicationSecurityNode.EditManagedConditionName = condition.ConditionName;
        }
        if (conditions.visibleCondition) {
            CustomLogger.logger.log('method', `Set conditional visible permission under path '${nameOrPath}' to ${conditions.visibleCondition} (API)`);
            const condition = (await this.getAllManagedConditions(id)).Items.find((x) => x.ConditionName === conditions.visibleCondition);
            applicationSecurityNode.VisibleConditionId = condition.ConditionId;
            applicationSecurityNode.VisibleManagedConditionName = condition.ConditionName;
        }
        if (conditions.deleteCondition) {
            CustomLogger.logger.log('method', `Set conditional delete permission under path '${nameOrPath}' to ${conditions.deleteCondition} (API)`);
            const condition = (await this.getAllManagedConditions(id)).Items.find((x) => x.ConditionName === conditions.deleteCondition);
            applicationSecurityNode.DeleteConditionId = condition.ConditionId;
            applicationSecurityNode.DeleteManagedConditionName = condition.ConditionName;
        }
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save content group (API)`);
        const permissions = nodeService.getAllLastNodes(this.permissionsAndResources, 'ResourceListItems');
        const categoryList = permissions.filter((x) => x.Selected === true && x.NodeType === 'Category').map((x) => {
            return x.Id;
        });
        const permissionsList = permissions.filter((x) => x.Selected === true && x.NodeType === 'Resource')
            .map((x) => {
                return {
                    DisplayText: x.DisplayText,
                    Id: x.Id,
                    ParentCategoryId: x.ParentCategoryId,
                    OriginalName: x.OriginalName,
                    ResourceType: x.ResourceType
                };
            });

        this.groupData.PermissionsList = permissionsList;
        this.groupData.CategoryList = categoryList;
        this.groupData.ApplicationSecuritySource = this.applicationSecurity;
        this.groupData.UpdateDate = moment().toISOString(true);
        const response = await this.post('/AdminPortal/ContentGroupAdmin/update', this.groupData);
        if (response && response.status === 200) {
            this.saveCurrentGroupInCache();
        }
        await this.clearCache();
    }

    public async addUser(value: string): Promise<void> {
        const user = (await this.getContentGroupUsers()).Items.find((x) => x.Name === value);
        if (!this.groupData.UserContentGroupPool) {
            this.groupData.UserContentGroupPool = [];
        }
        user.IsUserSelected = true;
        this.groupData.UserContentGroupPool.push(user);
    }

    public async removeUser(value: string): Promise<void> {
        const user = (await this.getContentGroupUsers()).Items.find((x) => x.Name === value);
        if (!this.groupData.UserContentGroupPool) {
            this.groupData.UserContentGroupPool = [];
        }
        user.IsUserSelected = false;
        this.groupData.UserContentGroupPool.push(user);
    }

    public getPermissionNodeChildrenNames(nodePath: string): string[] {
        const permissionsNames = nodeService.getCurrentNode(this.permissionsAndResources, nodePath, 'DisplayText', 'ResourceListItems');
        return permissionsNames.ResourceListItems.map((x) => x.DisplayText);
    }

    public getNodeChildrenNames(nodePath: string): string[] {
        const applicationSecurityNode = nodeService.getCurrentNode(this.applicationSecurity, nodePath, 'Name', 'ChildItems');
        return applicationSecurityNode.ChildItems.map((x) => x.Name);
    }

    public async getAllContentGroups(): Promise<any> {
        this.allContentGroups = (await this.get('/AdminPortal/GetAllContentGroupAdmin')).data;
        return this.allContentGroups;
    }

    public async getApplicationSecurity(): Promise<any> {
        this.applicationSecurity = (await this.get('/AdminPortal/ContentGroupAdmin/getApplicationSecurity', {id: this.groupId })).data;
        this.contentGroupCache[this.groupName].applicationSecurity = [ ...this.applicationSecurity ];
        return this.applicationSecurity;
    }

    public async getPermissionsAndResources(groupName?: string): Promise<any> {
        if (groupName) {
            this.groupName = groupName;
            if (this.contentGroupCache[groupName]) {
                this.groupId = this.contentGroupCache[groupName].contentGroupData.ContentGroupId;
            } else {
                if (!this.allContentGroups) {
                    await this.getAllContentGroups();
                }
                this.groupId = this.allContentGroups.Items.find((x) => x.ContentGroupName === groupName).ContentGroupId;
            }
        }
        const responseData = (await this.get('/AdminPortal/ContentGroupAdmin/getPermissionsAndResources', { id: this.groupId })).data;
        this.permissionsAndResources = responseData.ListOfPermissions.concat(responseData.ListOfResources);
        this.contentGroupCache[this.groupName].permissionAndResources = [ ... this.permissionsAndResources ];
        CustomLogger.logger.log('method', `Permission and Resources was updated for ${this.groupName} (API)`);
        return responseData;
    }

    public async getAllManagedConditions(tableId: number): Promise<any> {
        return (await this.get(`/AdminPortal/GetAllManagedConditions/${tableId}`)).data;
    }

    public async getContentGroupUsers(): Promise<any> {
        return (await this.get(`/AdminPortal//ContentGroupAdmin/getUsers/${this.groupId}`)).data;
    }

    // Private

    private saveCurrentGroupInCache() {
        const group = this.contentGroupCache[this.groupName];
        group.contentGroupData = infrastructureService.clone(this.groupData);
        group.applicationSecurity = this.applicationSecurity ? [ ...this.applicationSecurity ] : null;
        group.permissionAndResources = [ ... this.permissionsAndResources ];
    }
}
