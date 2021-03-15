import { CustomLogger } from '../../../../../support/utils/log';
import BasePage from '../../basePage';

export default class BaseSystemConfigurationPage extends BasePage {
    protected pageName: string;
    protected currentSection: any;
    protected changes = [];

    constructor(sectionData: any, cookieProvider) {
        super(cookieProvider);
        this.currentSection = sectionData;
    }

    public setValue(name: string, value: string): void {
        CustomLogger.logger.log('method', `Set ${name} to '${value}'`);
        const change = this.currentSection.find((x) => x.Code === name);
        change.Value = value;
        this.changes.push(change);
    }

    public getValue(name: string): any {
        const value = this.currentSection.find((x) => x.Code.toLowerCase() === name.toLowerCase()).Value;
        CustomLogger.logger.log('method', `The value of the ${name} is ${value}`);
        return value;
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save Default System Configuration (API)`);
        const response = await this.post('/AdminPortal/DefaultSystemConfigurations/save', this.changes);
        if (response && response.status === 200) {
            this.changes = [];
        }
        await this.clearCache();
    }
}
