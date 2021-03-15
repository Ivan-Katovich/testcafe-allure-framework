import BasePage from '../basePage';

export default class DataEntryTemplates extends BasePage {
    private allRecords: any;

    public async getAll(): Promise<any> {
        this.allRecords = (await this.get('/AdminPortal/DataEntryTemplates/getAll')).data;
        return this.allRecords;
    }
}
