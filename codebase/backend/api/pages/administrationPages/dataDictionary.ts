import { CustomLogger } from '../../../../support/utils/log';
import BasePage from '../basePage';

export default class DataDictionary extends BasePage {

    private allRecords: any;
    private currentRecord: any;

    public async open(name: string, ipTypeName: string): Promise<any> {
        CustomLogger.logger.log('method', `Open ${name} in Data Dictionary (API)`);
        if (!this.allRecords) {
            await this.getAll();
        }
        const id = this.allRecords.Items.find((x) => x.CustomValue === name && x.IPTypeName === ipTypeName).ApplicationTableId;
        this.currentRecord = (await this.get('/AdminPortal/DataDictionary/get', { id })).data;
        return this.currentRecord;
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save changes for ${this.currentRecord.CustomValue} in Data Dictionary (API)`);
        await this.post('/AdminPortal/DataDictionary/update', this.currentRecord);
    }

    public async getAll(): Promise<any> {
        this.allRecords = (await this.get('/AdminPortal/DataDictionary/getAll')).data;
        return this.allRecords;
    }
}
