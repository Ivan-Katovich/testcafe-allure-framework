import nodeService from '../../../../services/entries/nodeService';
import { CustomLogger } from '../../../../support/utils/log';
import BasePage from '../basePage';

export default class QueryGroups extends BasePage {

    private allRecords: any;
    private currentRecord: any;
    private hierarchy: any;

    public async getAll(): Promise<any> {
        this.allRecords = (await this.get(`/AdminPortal/QueryGroups/getAllGroups`)).data;
        return this.allRecords;
    }

    public async open(name: string): Promise<void> {
        CustomLogger.logger.log('method', `Open query group ${name} (API)`);
        if (!this.allRecords) {
            await this.getAll();
        }

        const id = this.allRecords.Items.find((x) => x.CustomCategoryName === name).CategoryId;
        this.currentRecord = (await this.get(`/AdminPortal/QueryGroups/getGroupById`, { id })).data;
        this.hierarchy = (await this.get('/AdminPortal/QueryGroups/getHierarchy/')).data;
    }

    public setLocation(parentName: string): void {
        CustomLogger.logger.log('method', `Set Location to ${parentName} (API)`);
        const id = nodeService.getCurrentNode(this.hierarchy, parentName, 'Name', 'Children').Id;
        this.currentRecord.ParentId = id;
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save query group (API)`);
        await this.post('/AdminPortal/QueryGroups/update', this.currentRecord);
        await this.clearCache();
    }

    public async getQueryGroupId(path: string): Promise<void> {
        this.hierarchy = (await this.get('/AdminPortal/QueryGroups/getHierarchy/')).data;
        return nodeService.getCurrentNode(this.hierarchy, path, 'Name', 'Children').Id;
    }
}
