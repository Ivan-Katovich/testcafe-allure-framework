import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import BaseObject from '../baseObject';
import regexService from '../../services/entries/regexService';
declare const globalConfig: any;

export default class ReportPage extends BaseObject {
    public name = 'ReportPage';

    // Elements (Print report)
    protected printViewer = Selector('#MyCasePrint', {timeout: globalConfig.timeout.loading, visibilityCheck: true});
    protected tableNames = this.printViewer.find('#MyCasePrint h2');
    protected tables = this.printViewer.find('#MyCasePrint table');

    // Elements (Cristal Viewer Report)
    protected crReportViewer = Selector('#crReportViewer', {timeout: globalConfig.timeout.loading, visibilityCheck: true});
    protected iframe = this.crReportViewer.find('[id*="_iframe"]');
    protected docketNumberValue = Selector('#PAMDOCKETNUMBER1');
    protected firstFieldTitleValue = Selector('#Field1');

    // Methods
    public async getFirstParagraphText() {
        const text = (await this.tables.nth(0).textContent).trim();
        CustomLogger.logger.log('method', `The first paragraph text is '${text.substring(0, 15)}'`);
        return text;
    }

    public async getTaRepForPatentsDocketNumberFromIframe() {
        await t.switchToIframe(this.iframe);
        const text = regexService.replaceNbspWithSpace(await this.getText('docketNumberValue'));
        await t.switchToMainWindow();
        return text;
    }

    public async get30DayReportTitleFromIframe() {
        await t.switchToIframe(this.iframe);
        const text = await this.getText('firstFieldTitleValue');
        await t.switchToMainWindow();
        return text;
    }

    public async getReportTitleFromIframe() {
        await t.switchToIframe(this.iframe);
        const text = regexService.replaceNbspWithSpace(await this.getText('firstFieldTitleValue'));
        await t.switchToMainWindow();
        return text;
    }
}
