import { CustomLogger } from '../../../../../support/utils/log';
import BaseSystemConfigurationPage from './baseSysConfigPage';

export default class IpTypeSection extends BaseSystemConfigurationPage {
    private ipTypeId: number;

    constructor(sectionData: string, ipTypeId: number, cookieProvider) {
        super(sectionData, cookieProvider);
        this.ipTypeId = ipTypeId;
    }

    public async getAuditFields(): Promise<string[]> {
        const fieldsIds = this.currentSection.find((x) => x.Code === 'AuditFields').Value.split(',').map((x) => Number(x));
        const ipTypeFields = (await this.get('/Integration//systemConfig/GetFields', { id: this.ipTypeId })).data;
        const array = ipTypeFields.filter((x) => fieldsIds.includes(x.Id)).map((x) => x.Name);
        CustomLogger.logger.log('method', `The Audit Fields of the current ip type are ${JSON.stringify(array)}`);
        return array;
    }
}
