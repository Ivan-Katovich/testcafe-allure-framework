import moment = require('moment');
import sortingService from '../../../../services/entries/sortingService';
import { CustomLogger } from '../../../../support/utils/log';
import BasePage from '../basePage';

export default class CurrencyExchangeRates extends BasePage {

    private recordId: number;
    private recordData: any;
    private allRecords: any;

    public async open(name: string): Promise<any> {
        CustomLogger.logger.log('method', `Open the ${name} currency (API)`);
        if (!this.allRecords) {
            this.allRecords = await this.getAll();
        }
        this.recordId = this.allRecords.Items.find((x) => x.Code === name).CurrencyId;
        this.recordData = (await this.get('/AdminPortal/CurrencyExchangeRates/getSingleCurrency/', { id: this.recordId })).data;
        return this.recordData;
    }

    public getExchangeRates(): Array<{ rate: number, date: moment.Moment }> {
        return this.recordData.CurrencyExchangeRate.map((x) => {
            return { rate: x.Rate, date: moment(x.StartDate) };
        });
    }

    public getLatestExchangeRate(): number {
        const rates = sortingService.sortBy<any>(this.recordData.CurrencyExchangeRate, 'StartDate');
        return rates.pop().Rate;
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save code (API)`);
        await this.post('/AdminPortal/Codes/update', this.recordData);
    }

    public async getAll(): Promise<any> {
        this.allRecords = (await this.get('/AdminPortal/CurrencyExchangeRates/getAll')).data;
        return this.allRecords;
    }
}
