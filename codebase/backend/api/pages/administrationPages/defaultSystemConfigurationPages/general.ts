import BaseSystemConfigurationPage from './baseSysConfigPage';
import * as fs from 'fs';

export default class General extends BaseSystemConfigurationPage {

    public async addLicenseFile(licenseFileName: string): Promise<void> {
        const content = fs.readFileSync(licenseFileName).toString('base64');
        const body = {
            FileContent: content,
            FileName: licenseFileName.split('\\').pop()
        };

        await this.post('/AdminPortal/DefaultSystemConfigurations/processLicenseFileandApplyLicense', body);
        await this.clearCache();
    }

    public async setCurrencyType(value: string): Promise<void> {
        const currencies = await this.getCurrencies();
        const currencyItem = currencies.Items.find((x) => x.Description === value);
        this.setValue('CurrencyType', currencyItem.Id);
    }

    public setDisplayOptions(name: string, value: string): void {
        const id = DisplayOption[value] - 1;
        if (name === 'Country / Region Display') {
            this.setValue('COUNTRY_DISPLAY', id.toString());
        } else if (name === 'Party Display') {
            this.setValue('PARTY_DISPLAY', id.toString());
        } else if (name === 'Codes Display') {
            this.setValue('CODE_DISPLAY', id.toString());
        }
    }

    public async getDefaultCountry(ipType: string, userPreferenceDisplay: boolean = false): Promise<string> {
        const id = Number(this.getValue(ipType));
        let value;
        if (userPreferenceDisplay) {
            value = (await this.common.getCountries()).Data.find((x) => x.Id === id).Name;
        } else {
            value = (await this.getCountryRegion()).Items.find((x) => x.CountryId === id).CountryName;
        }
        return value;
    }

    public getDisplayOption(name: string): string {
        let value;
        if (name === 'Country / Region Display') {
            value = this.getValue('COUNTRY_DISPLAY');
        } else if (name === 'Party Display') {
            value = this.getValue('PARTY_DISPLAY');
        } else if (name === 'Codes Display') {
            value = this.getValue('CODE_DISPLAY');
        }

        return DisplayOption[value];
    }

    private async getCurrencies(): Promise<any> {
        return (await this.get('/AdminPortal/DefaultSystemConfigurations/getCurrencies/')).data;
    }

    private async getCountryRegion(): Promise<any> {
        return (await this.get('/AdminPortal/DefaultSystemConfigurations/getCountryregion/')).data;
    }
}

enum DisplayOption {
    'Codes' = 1,
    'Description' = 2,
    'WIPO Codes' = 3
}
