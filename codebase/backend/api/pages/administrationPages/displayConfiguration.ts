import arrayService from '../../../../services/entries/arrayService';
import { CustomLogger } from '../../../../support/utils/log';
import * as configurations from '../../collections/configurations';
import BasePage from '../basePage';

export default class DisplayConfiguration extends BasePage {
    private allDisplayConfigurations: any;
    private configId: number;
    private configData: any;
    private currentSettingData: any;

    public async openDisplayConfiguration(name: string): Promise<void> {
        CustomLogger.logger.log('method', `Open the ${name} display configuration (API)`);
        if (!this.allDisplayConfigurations) {
            await this.getAllDisplayConfigurations();
        }
        this.configId = this.allDisplayConfigurations.Items.find((item) => item.DisplaySettingName === name).DisplaySettingId;
        this.configData = await this.getDisplayConfigurationData();
        const users = (await this.getAllUsers()).filter((x) => x.DisplaySettingId === this.configId);
        this.configData.DisplayConfigurationDelta = [];
        this.configData.SelectedUsers = users;
    }

    public async openCountrySettings(): Promise<void> {
        this.currentSettingData = (await this.get('/AdminPortal/DisplayConfiguration/getDcCountry', { id: this.configId })).data;
    }

    public async openCodeSettings(): Promise<void> {
        this.currentSettingData = (await this.get('/AdminPortal/DisplayConfiguration/getDcCode', { id: this.configId })).data;
    }

    public async openFieldsTooltips(): Promise<void> {
        this.currentSettingData = (await this.get('/AdminPortal/DisplayConfiguration/getDcFieldTip', { id: this.configId })).data;
    }

    public async openIPType(): Promise<void> {
        this.currentSettingData = (await this.get('/AdminPortal/DisplayConfiguration/getDcIPType', { id: this.configId })).data;
    }

    public async openResources(): Promise<void> {
        this.currentSettingData = (await this.get('/AdminPortal/DisplayConfiguration/getDcResource', { id: this.configId })).data;
    }

    public async openTables(): Promise<void> {
        this.currentSettingData = (await this.get('/AdminPortal/DisplayConfiguration/getDcAppTable', { id: this.configId })).data;
    }

    public getEditValues(): string[] {
        return this.currentSettingData.map((x) => x.EditData1);
    }

    public getEditValue(type: string, defaultValue: string): string {
        let record;
        if (type) {
            record = this.currentSettingData.find((x) => x.TypeHeader === type && x.ColumnHeader1 === defaultValue);
        } else {
            record = this.currentSettingData.find((x) => x.ColumnHeader1 === defaultValue);
        }

        return record.EditData1;
    }

    public getEditValueByID(id: number): string {
        const record = this.currentSettingData.find((x) => x.ElementId === id);
        return record.EditData1;
    }

    public async setEditValue(type: string = null, defaultValue: string, editValue: string): Promise<void> {
        let settings = this.currentSettingData;
        const record = settings.find((x) => (!type || x.TypeHeader === type) && x.ColumnHeader1 === defaultValue);
        record.EditData1 = editValue;
        record.IsModified = true;
        this.configData.DisplayConfigurationDelta.push(record);
    }

    public getTypes(): string[] {
        return arrayService.removeDuplicates(this.currentSettingData.map((x) => x.TypeHeader));
    }

    public getDefaultValues(type: string = null): string[] {
        let settings = this.currentSettingData;
        if (type) {
            settings = settings.filter((x) => x.TypeHeader === type);
        }
        return settings.map((x) => x.ColumnHeader1);
    }

    public getDisplayedValues(type: string = null): string[] {
        let settings = this.currentSettingData;
        if (type) {
            settings = settings.filter((x) => x.TypeHeader === type);
        }
        return settings.map((x) => {
            if (x.EditData1) {
                return x.EditData1;
            }
            return x.ColumnHeader1;
        });
    }

    public getDisplayedValue(resourceHeader: string = null, defaultValue: string): string {
        let settings = this.currentSettingData;
        if (resourceHeader) {
            settings = settings.filter((x) => x.ResourceHeader === resourceHeader);
        }
        settings = settings.find((x) => x.ColumnHeader1 === defaultValue);
        if (settings.EditData1) {
            return settings.EditData1;
        }
        return settings.ColumnHeader1;
    }

    public async addUser(userName: string): Promise<void> {
        CustomLogger.logger.log('method', `Add user ${userName} to display configuration (API)`);
        const users = (await this.getAllUsers()).filter((x) => x.UserName === userName || x.DisplaySettingId === this.configId);
        this.configData.DisplayConfigurationDelta = [];
        this.configData.SelectedUsers = users;
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save display configuration (API)`);
        await this.post('/AdminPortal/DisplayConfiguration/update', this.configData);
    }

    public async createDisplayConfig(type: string = 'display'): Promise<any> {
        type = type.toLowerCase();
        return (await this.post('/AdminPortal/DisplayConfiguration/save', configurations[type].default)).data;
    }

    //#region private

    private async getAllDisplayConfigurations(): Promise<any> {
        this.allDisplayConfigurations = (await this.get('/AdminPortal/DisplayConfiguration/getAll')).data;
        return this.allDisplayConfigurations;
    }

    public async getDisplayConfigurationData(): Promise<any> {
        return (await this.get(`/AdminPortal/DisplayConfiguration/getDisplayById/`, {id: this.configId })).data;
    }

    public async getAllUsers(): Promise<any> {
        return (await this.get('/AdminPortal/DisplayConfiguration/getAllUserDisplaySettingList/')).data;
    }

    //#endregion
}
