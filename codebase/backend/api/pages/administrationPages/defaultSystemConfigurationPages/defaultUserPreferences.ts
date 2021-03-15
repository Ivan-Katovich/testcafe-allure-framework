import BaseSystemConfigurationPage from './baseSysConfigPage';

export default class DefaultUserPreferences extends BaseSystemConfigurationPage {

    public async setDefaultCulture(value: string): Promise<void> {
        this.setValue('DEFAULTCULTURE', value);
        const dateFormat = await this.getDateValue(value);
        this.changes.push(dateFormat);
    }

    public async setDefaultDateFormat(value: string): Promise<void> {
        let dateFormat = this.changes.find((x) => x.Type === 'CustomFormatTypes');
        if (!dateFormat) {
            dateFormat = await this.getDateValue(value);
            this.changes.push(dateFormat);
        }
        const jsonValue = JSON.parse(dateFormat.Value);
        jsonValue.defaultdateformat = value;
        dateFormat.Value = JSON.stringify(jsonValue);
    }

    public setRecordsPerPage(value: number): void {
        this.setValue('RECORDS_PER_PAGE', value.toString());
    }

    public setRecordsPerPageLocked(value: boolean): void {
        this.setValue('RecordsReturnedLocked', value.toString());
    }

    public setPortalDefaultLocked(value: boolean): void {
        this.setValue('PortalDefaultLocked', value.toString());
    }

    public async setPortalDefault(value: string): Promise<void> {
        const portals = await this.getPortals();
        const id = portals.Items.find((x) => x.Name === value).Id;
        this.setValue('PORTAL_DEFAULT', id);
    }

    public getDefaultCulture(): string {
        return this.getValue('DEFAULTCULTURE');
    }

    public async getDefaultDateFormatForCulture(culture: string): Promise<string> {
        const value = (await this.getDateValue(culture)).Value;
        return JSON.parse(value).defaultdateformat;
    }

    public async getPortalDefault(): Promise<string> {
        const portals = await this.getPortals();
        const value = this.getValue('PORTAL_DEFAULT');
        return portals.Items.find((x) => x.Id === value).Name;
    }

    public setCultureLocked(value: boolean): void {
        this.setValue('CultureLocked', value.toString());
    }

    public setDateFormatLocked(value: boolean): void {
        this.setValue('DateFormatLocked', value.toString());
    }

    public setUseBaseCurrency(value: boolean): void {
        this.setValue('USEBASECURRENCY', value.toString());
    }

    public setUseBaseCurrencyLocked(value: boolean): void {
        this.setValue('UseBaseCurrencyLocked', value.toString());
    }

    public setRecordsReturnedLocked(value: boolean): void {
        this.setValue('RecordsReturnedLocked', value.toString());
    }

    public setThemeLocked(value: boolean): void {
        this.setValue('ThemeLocked', value.toString());
    }

    private async getDateValue(culture: string): Promise<any> {
        return (await this.get('/Integration//systemConfig/GetDateValue', { culture })).data;
    }

    private async getPortals(): Promise<any> {
        return (await this.get('/AdminPortal/DefaultSystemConfigurations/getPortals/')).data;
    }
}
