import { CustomLogger } from '../../../../support/utils/log';
import BasePage from '../basePage';

export default class CodeManagement extends BasePage {

    private codeId: number;
    private codeTypeId: any;
    private codeData: any;
    private allCodes: any;

    public activate(value: boolean = true): void {
        CustomLogger.logger.log('method', `Set active to ${value} (API)`);
        this.codeData.isActive = value;
        this.codeData.Active = value;
        this.codeData.CodesCodeTypeId = this.codeTypeId;
    }

    public async openCode(name: string, type: string): Promise<any> {
        CustomLogger.logger.log('method', `Open the ${name} code with the ${type} type (API)`);
        if (!this.allCodes) {
            this.allCodes = await this.common.getAllCodes();
        }
        this.codeTypeId = type;
        this.codeId = (await this.common.getCodesForType(type)).Data.find((x) => x.Code === name || x.Description === name).CodeId;
        this.codeData = (await this.get('/AdminPortal/Codes/getById/', { id: this.codeId })).data;
        return this.codeData;
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save code (API)`);
        await this.post('/AdminPortal/Codes/update', this.codeData);
    }
}
