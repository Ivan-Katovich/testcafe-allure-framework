import { user } from '../collections/preferences';
import BasePage from './basePage';
import Services from '../../../services/services';
const services = new Services();

export default class UserPreferences extends BasePage {

    public async getUserPreferences(): Promise<any> {
        return (await this.get('/UsersManagement/Users/current/')).data;
    }

    public async resetUserPreferences(changes: Array<{property: string, value: any}> = null): Promise<void> {
        const data = services.infra.clone(user.default);
        if (changes) {
            changes.forEach((change) => services.infra.changeProperty(data, change.property, change.value));
        }
        await this.post('/UsersManagement/UserPreferences/', data);
        await this.clearCache();
    }

    public getDefaultValue(property: string) {
        return services.infra.getProperty(user.default, property);
    }

    public async getCurrentDefaultDEFTemplate(ipTypeName: string): Promise<number> {
        const currentPreferences = await this.getUserPreferences();
        const id = (await this.common.getIpTypes()).find((x) => x.Name === ipTypeName).IpTypeId;
        return currentPreferences.Preferences.DefaultDmForms[id];
    }

    public async setDefaultCountry(ipType: string, value: string): Promise<void> {
        const data = services.infra.clone(user.default);
        const ipTypeId = await this.common.getIpTypeId(ipType);
        const countryId = await this.common.getCountryId(value);
        data.DefaultCountries[ipTypeId] = countryId;
        await this.post('/UsersManagement/UserPreferences/', data);
        await this.clearCache();
    }

    public async setDefaultPortal(value: string): Promise<void> {
        const data = services.infra.clone(user.default);
        const portalCode = (await this.get('/AdminPortal/DefaultSystemConfigurations/getPortals/')).data.Items.find((x) => x.Name === value). Id;
        data.DefaultPortal.Value = portalCode;
        await this.post('/UsersManagement/UserPreferences/', data);
        await this.clearCache();
    }
}
