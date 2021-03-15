import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import KendoPopup from '../elements/kendo/kendoPopup';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Dropdown extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'dropdown';
        this.chevron = this.container.find('.k-select');
        this.input = this.container.find('.k-input');
        this.managementControlButton = this.container.find('.management-control__icon');
        this.pencilIcon = this.managementControlButton.find('.fa-pencil');
        this.clearButton = this.container.find('.k-clear-value');
        this.dropdownList = this.container.find('ca-dropdownlist');
    }

    // Elements
    protected chevron: Selector;
    protected input: Selector;
    protected managementControlButton: Selector;
    protected clearButton: Selector;
    protected pencilIcon: Selector;
    protected dropdownList: Selector;

    // Methods
    public async fill(value: string) {
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${value}'`);
        if (!await this.isPresent('input')) {
            await t.click(this.container);
        }
        await this.expand();
        if ((await this.getPossibleValues()).includes(value)) {
            await this.selectRow(value);
        } else {
            await super.fill(value);
            const popup = new KendoPopup();
            await popup.waitLoading();
            await popup.selectTop();
        }
    }

    public async expand() {
        CustomLogger.logger.log('method', `Expand '${this.name}' dropdown`);
        await this.click('chevron');
        await new KendoPopup().waitLoading();
    }

    public async expandWholeList() {
        CustomLogger.logger.log('method', `Expand the whole list in '${this.name}' dropdown`);
        await this.click('chevron');
        const popup = new KendoPopup();
        await popup.waitLoading();
        while (await popup.isPresent('showMoreLink')) {
            await popup.showMore();
        }
    }

    public async selectRow(name: string) {
        return new KendoPopup().selectItem(name);
    }

    public async getPossibleValues() {
        return new KendoPopup().getAllItemsText('simpleItems');
    }

    public async getValue() {
        let value: string;
        if (await this.input.tagName === 'input') {
            value = await this.input.value;
        } else {
            value = await this.input.innerText;
        }
        CustomLogger.logger.log('method', `The value in '${this.name}' ${this.fieldType} is '${value}'`);
        return value;
    }

    public async verifyValue(expectedValue: string) {
        const value = (await this.input.textContent).trim();
        CustomLogger.logger.log('method', `The the status of verification for value in '${this.name}' ${this.fieldType} is '${value === expectedValue}'`);
        return value === expectedValue;
    }

    public async clear() {
        CustomLogger.logger.log('method', `Clear '${this.name}' dropdown`);
        if (await this.clearButton.count > 0) {
            await this.click('clearButton');
        } else {
            await super.clear();
        }
    }
}
