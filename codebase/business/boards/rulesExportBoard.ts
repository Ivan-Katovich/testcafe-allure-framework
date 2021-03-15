import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';
import Input from '../fields/input';
import timeService from '../../services/entries/timeService';
import {Options} from '../../interfaces';
declare const globalConfig: any;

export default class RulesExportBoard extends BaseObject {
    public name = 'RulesExportBoard';
    protected container = Selector('.ip-rules-export', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.ip-rules-export__title');
    protected fields = this.container.find('.ip-rules-export__cell');
    protected exportButton = this.container.find('.ip-rules-export__button');
    protected processingSpinner = this.container.find('.fa-pulse');
    protected downloadLink = this.container.find('.ip-rules-export__download a');

    // Methods
    public getField(name: string, type: string = 'input', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${name}'`);
        const constructors = {
            input: Input
        };
        return new constructors[type](this.fields, name, options);
    }

    public async export() {
        await this.click('exportButton');
    }

    public async download() {
        await t.wait(1000);
        await this.click('downloadLink');
    }

    public async getTitle() {
        let title: string;
        await timeService.wait(async () => {
            title = await this.getText('title');
            return title.length > 0;
        }, {timeout: 5000, interval: 300});
        return title;
    }

    public async waitExportProcessing(timeout) {
        CustomLogger.logger.log('method', `Wait for Processing is completed`);
        await timeService.wait(async () => {
            return (await this.processingSpinner.count) > 0;
        }, {timeout: 3000, interval: 200});
        const isDisappeared = await timeService.wait(async () => {
            return (await this.processingSpinner.count) === 0;
        }, {timeout, interval: 1000});
        if (!isDisappeared) {
            throw new Error(`Processing spinner is still appeared after timeout`);
        }
        CustomLogger.logger.log('method', `Processing is completed`);
    }

}
