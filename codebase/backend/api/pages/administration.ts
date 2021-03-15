import BaseAPI from '../../baseApi';
import DisplayConfiguration from './administrationPages/displayConfiguration';
import ContentGroup from './administrationPages/contentGroup';
import CodeManagement from './administrationPages/codeManagement';
import * as queryGroups from '../collections/queryGroups';
import BasePage from './basePage';
import ProcessDesigner from './administrationPages/processDesigner';
import CountryRegionManagement from './administrationPages/countryRegionManagement';
import DefaultSystemConfiguration from './administrationPages/defaultSystemConfiguration';
import DataDictionary from './administrationPages/dataDictionary';
import DataEntryTemplates from './administrationPages/dataEntryTemplates';
import QueryGroups from './administrationPages/queryGroups';
import CurrencyExchangeRates from './administrationPages/currencyExchangeRates';

export default class Administration extends BasePage {

    get contentGroup(): ContentGroup {
        return this.createGetter(ContentGroup, this.cookieProvider);
    }

    get displayConfiguration(): DisplayConfiguration {
        return this.createGetter(DisplayConfiguration, this.cookieProvider);
    }

    get codeManagement(): CodeManagement {
        return this.createGetter(CodeManagement, this.cookieProvider);
    }
    get countryRegionManagement(): CountryRegionManagement {
        return this.createGetter(CountryRegionManagement, this.cookieProvider);
    }

    get processDesigner(): ProcessDesigner {
        return this.createGetter(ProcessDesigner, this.cookieProvider);
    }

    get defaultSystemConfiguration(): DefaultSystemConfiguration {
        return this.createGetter(DefaultSystemConfiguration, this.cookieProvider);
    }

    get dataDictionary(): DataDictionary {
        return this.createGetter(DataDictionary, this.cookieProvider);
    }

    get dataEntryTemplates(): DataEntryTemplates {
        return this.createGetter(DataEntryTemplates, this.cookieProvider);
    }

    get groupQuery(): QueryGroups {
        return this.createGetter(QueryGroups, this.cookieProvider);
    }

    get currencyExchangeRates(): CurrencyExchangeRates {
        return this.createGetter(CurrencyExchangeRates, this.cookieProvider);
    }

    public async createQueryGroup(queryName: string): Promise<any> {
        return (await this.post('/AdminPortal/QueryGroups/save', queryGroups[queryName])).data;
    }

    public async getAllDataEntryTemplates(): Promise<any> {
        return (await this.get('/AdminPortal/DataEntryTemplates/getAll')).data;
    }

    public async getAllCountryRegion(): Promise<any> {
        return (await this.get('/AdminPortal/CountryRegions/getAll')).data;
    }

    public async getControlTypes(): Promise<{Count: number, Items: any[]}> {
        return (await this.get('/AdminPortal/Lookups/getHierarchyById/?codeTypeId=EDT')).data;
    }
}
