import { CustomLogger } from '../../../../support/utils/log';
import BasePage from '../basePage';

export default class CountryRegionManagement extends BasePage {

    private countryId: number;
    private countryData: any;
    private allCountries: any;

    public async openCountry(name: string): Promise<any> {
        CustomLogger.logger.log('method', `Open the ${name} country (API)`);
        if (!this.allCountries) {
            this.allCountries = await this.common.getCountries();
        }

        this.countryId = this.allCountries.Data.find((x) => x.Name === name).Id;
        this.countryData = (await this.get('/AdminPortal/CountryRegions/get/', { id: this.countryId })).data;
        return this.countryData;
    }

    public async removeIPType(name: string): Promise<void> {
        CustomLogger.logger.log('method', `Remove ip type ${name} from IP Types of the ${name} country (API)`);
        const ipTypes = await this.common.getIpTypes();
        const ipTypeId = ipTypes.find((x) => x.Name === name).IpTypeId;
        this.countryData.ipTypes = this.countryData.ipTypes.filter((x) => x !== ipTypeId);
    }

    public async getIPTypes(): Promise<string[]> {
        const ipTypes = await this.common.getIpTypes();
        return ipTypes.filter((x) => this.countryData.ipTypes.includes(x.IpTypeId)).map((x) => x.Name);
    }

    public async addIPType(name: string): Promise<void> {
        CustomLogger.logger.log('method', `Remove ip type ${name} from IP Types of the ${name} country (API)`);
        const ipTypeId = (await this.common.getIpTypes()).find((x) => x.Name === name).IpTypeId;
        this.countryData.ipTypes.push(ipTypeId);
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save country (API)`);
        const ipTypes = await this.common.getIpTypes();
        this.countryData.ipTypesModel = ipTypes.filter((x) => this.countryData.ipTypes.includes(x.IpTypeId));
        await this.post('/AdminPortal/CountryRegions/update', this.countryData);
    }
}
