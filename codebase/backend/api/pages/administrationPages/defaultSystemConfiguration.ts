import { CustomLogger } from '../../../../support/utils/log';
import BasePage from '../basePage';
import DefaultUserPreferences from './defaultSystemConfigurationPages/defaultUserPreferences';
import General from './defaultSystemConfigurationPages/general';
import IpTypeSection from './defaultSystemConfigurationPages/ipTypeSection';

export default class DefaultSystemConfiguration extends BasePage {
    public async openIPType(name: string): Promise<IpTypeSection> {
        CustomLogger.logger.log('method', `Open ip type ${name} in Default System Configuration`);
        const ipTypeData = (await this.get('/Integration//systemConfig/GetLicensedIpTypesSection', { ipTypeName: name })).data;
        const ipTypeId = (await this.common.getIpTypes()).find((x) => x.Name === name).IpTypeId;
        return new IpTypeSection(ipTypeData, ipTypeId, this.cookieProvider);
    }

    public async openGeneralSection(): Promise<General> {
        CustomLogger.logger.log('method', `Open General section in Default System Configuration`);
        const sectionData = (await this.get('/Integration/systemConfig/GetGeneralSection/')).data;
        return new General(sectionData, this.cookieProvider);
    }

    public async openUserPreferencesSection(): Promise<DefaultUserPreferences> {
        CustomLogger.logger.log('method', `Open Default User Preferences section in Default System Configuration`);
        const sectionData = (await this.get('/Integration/systemConfig/GetDefaultUserPreferenceSection/')).data;
        return new DefaultUserPreferences(sectionData, this.cookieProvider);
    }
}
