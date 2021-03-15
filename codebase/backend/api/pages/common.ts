import BasePage from './basePage';
import UserPreferences from './userPreferences';

export default class Common extends BasePage {

    public async getAllCodes(): Promise<any> {
        return (await this.get('Common/Codes/getAll')).data;
    }

    public async getCodesForType(type: string): Promise<any> {
        return (await this.get(`/Common/codes/bytype/`, {
            type,
            displaySetting: 2
        })).data;
    }

    public async getCodesByTypeHierarchy(type: string): Promise<any> {
        return (await this.get(`/Common/codes/bytype/hierarchy/`, {
            type,
            displaySetting: 2
        })).data;
    }

    public async getCountries(): Promise<any> {
        const displaySetting = (await new UserPreferences(this.cookieProvider).getUserPreferences()).Preferences.CountryDisplaySetting;
        return (await this.get('Common/countries', {
            displaySetting
        })).data;
    }

    public async getCountryId(name: string): Promise<number> {
        return (await this.getCountries()).Data.find((x) => x.Name === name).Id;
    }

    public async getCountriesForIPType(ipType: string | number): Promise<any> {
        let id: number;
        if (typeof ipType === 'number') {
            id = ipType;
        } else if (typeof ipType === 'string') {
            id = (await this.getIpTypes()).find((x) => x.Name === ipType).IpTypeId;
        }
        return (await this.get('Common/countries', {
            ipType: id,
            displaySetting: 2
        })).data;
    }

    public async getPartyLookupsForType(type: string): Promise<any> {
        return (await this.get(`/Common/party-lookups/bytype/`, {
            type,
            displaySetting: 2
        })).data;
    }

    public async getIpTypes(): Promise<any> {
        return (await this.get(`/Common/ipTypesWithParties/`)).data;
    }

    public async getIpTypeId(ipType: string): Promise<number> {
        return (await this.getIpTypes()).find((x) => x.Name === ipType).IpTypeId;
    }
}
