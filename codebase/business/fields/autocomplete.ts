import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import KendoPopup from '../elements/kendo/kendoPopup';
import timeService from '../../services/entries/timeService';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Autocomplete extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'autocomplete';
        this.input = this.container.find('input');
        this.chevron = this.container.find('.k-select');
        this.clearCross = this.container.find('.k-clear-value, .ca-global-search-filter__clear-button');
    }

    // Elements
    protected chevron: Selector;
    protected clearCross: Selector;

    // Getters
    get kendo() {
        return this.createGetter(KendoPopup);
    }

    // Methods
    public async fill(value: string, options: Options = {}) {
        await t.click(this.container);
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${value}'`);
        const aria = await this.input.getAttribute('aria-activedescendant');
        await this.type('input', value, options);
        await t.hover(this.chevron);
        await timeService.wait(async () => {
            const currentArea = await this.input.getAttribute('aria-activedescendant');
            return currentArea !== aria;
        }, {timeout: 3000, interval: 200});
        options.isTextExact = options.isTextExact !== false;
        await this.kendo.selectItem(value, options);
    }

    public async expand() {
        CustomLogger.logger.log('method', `Expand '${this.name}' autocomplete`);
        return this.click('chevron');
    }

    public async selectRow(name: string) {
        return this.kendo.selectItem(name);
    }

    public showMore() {
        return this.kendo.showMore();
    }

    public async expandWholeList() {
        CustomLogger.logger.log('method', `Expand the whole list in '${this.name}' autocomplete`);
        await this.click('chevron');
        await this.kendo.waitLoading();
        while (await this.kendo.isPresent('showMoreLink')) {
            await this.kendo.showMore();
        }
    }

    public async getAllDisplayedOptions() {
        await this.kendo.waitLoading();
        return this.kendo.getAllItemsText('simpleItems');
    }

    public async selectTop(options: Options = {wait: true, waitSpinner: 500}) {
        if (options.wait) {
            await this.waitLoading(options);
        }
        await this.pressKey('up');
        await this.pressKey('enter');
    }

    public async clear() {
        await t
            .selectText(this.input)
            .pressKey('delete')
            .pressKey('tab');
        CustomLogger.logger.log('method', `'${this.name}' field value is deleted`);
    }
}
