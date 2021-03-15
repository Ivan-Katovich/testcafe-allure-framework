import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import KendoPopup from '../elements/kendo/kendoPopup';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Multiselect extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'multiselect';
        this.searchBar = this.container.find('kendo-searchbar');
        this.selectedItems = this.container.find('.k-button');
        this.input = this.container.find('.k-input');
        this.resizeSensor = this.container.find('kendo-resize-sensor');

    }

    // Elements
    protected searchBar: Selector;
    protected selectedItems: Selector;
    protected input: Selector;
    protected resizeSensor: Selector;

    // Methods
    public async fill(value: string) {
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${value}'`);
        await this.expand();
        await this.selectRow(value);
    }

    public async expand() {
        CustomLogger.logger.log('method', `Expand '${this.name}' multiselect`);
        return this.click('searchBar');
    }

    public async selectRow(name: string) {
        return new KendoPopup().selectItem(name);
    }

    public async getSelectedItems() {
        const count = await this.getCount('selectedItems');
        const items = [];
        for (let i = 0; i < count; i++) {
            let text = await this.selectedItems.nth(i).textContent;
            text = text.trim();
            CustomLogger.logger.log('method', `Multiselect ${this.name} contains selected item ${text}`);
            items.push(text);
        }
        return items;
    }

    public async removeItem(name: string) {
        CustomLogger.logger.log('method', `Remove '${name}' multiselect`);
        await t.click(this.selectedItems.withText(name).find('.k-i-close'));
    }

    public async isFocused(elementName: string = 'input') {
        const count = await this.getCount('resizeSensor');
        return count > 0;
    }

    public async getAllDisplayedOptions() {
        const kendo = new KendoPopup();
        return kendo.getAllItemsText('simpleItems');
    }

    public async selectTop() {
        const kendo = new KendoPopup();
        return kendo.selectTop();
    }

    public async getValue() {
        const count = await this.getCount('selectedItems');
        const items = [];
        for (let i = 0; i < count; i++) {
            const text = await this.selectedItems.nth(i).textContent;
            CustomLogger.logger.log('method', `Multiselect ${this.name} contains selected item ${text}`);
            items.push(text);
        }
        return items;
    }

    public async verifyValue(expectedItems: string[]) {
        const count = await this.getCount('selectedItems');
        const items = [];
        for (let i = 0; i < count; i++) {
            const text = await this.selectedItems.nth(i).textContent;
            CustomLogger.logger.log('method', `Multiselect ${this.name} contains selected item ${text}`);
            items.push(text);
        }
        const status = expectedItems.reduce((status, item) => {
            if (!items.includes(item)) {
                return false;
            }
        }, true);
        CustomLogger.logger.log('method', `The the status of verification for value in '${this.name}' ${this.fieldType} is '${status}'`);
        return status;
    }
}
