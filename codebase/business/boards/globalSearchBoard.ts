import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';
import Checkbox from '../fields/checkbox';
import Autocomplete from '../fields/autocomplete';
import Input from '../fields/input';
import KendoPopup from '../elements/kendo/kendoPopup';

export default class GlobalSearchBoard extends BaseObject {
    public name = 'GlobalSearchBoard';
    protected container = Selector('global-search', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.ca-global-search__title');
    protected header = this.container.find('.ca-global-search-header');
    protected searchIn = this.header.find('.ca-global-search-header__ip-list');
    protected searchInLabel = this.header.find('.ca-global-search-header__search');
    protected searchInValue = this.searchInLabel.nextSibling();
    protected recordsCountInfo = this.header.find('.ca-global-search-header__record-count');
    protected headerButtons = this.header.find('.dp-button--primary');
    protected globalSearchResults = this.container.find('.ca-global-search-result');
    protected auditKeys = this.container.find('.ca-global-search-result__audit-key');
    protected showMoreLink = this.container.find('.ca-global-search__show-more a');
    protected selectAllCheckbox = this.header.find('ca-checkbox');

    // Getters
    get filterBox(): Filter {
        let obj;
        if (this.currentObject && this.currentObject.constructor === Filter) {
            obj = this.currentObject;
        } else {
            obj = this.objectsArray.find((obj) => obj.constructor === Filter);
            this.currentObject = obj;
        }
        if (!obj) {
            obj = new Filter();
            this.objectsArray.push(obj);
            this.currentObject = obj;
        }
        return obj;
    }

    // Methods
    public getResult(nameOrNumber) {
        return new SearchResult(this.globalSearchResults, nameOrNumber);
    }

    public async getRecordCount(): Promise<number> {
        return await this.globalSearchResults.count;
    }

    public async getTotalCount() {
        const text = await this.getText('recordsCountInfo');
        const count = parseInt(text.match(/\d+/)[0]);
        CustomLogger.logger.log('method', `Total records count is '${count}'`);
        return count;
    }

    public async getAllRecordNames(): Promise<string[]> {
        const array = [];
        const count = await this.getCount('globalSearchResults');
        for (let i = 0; i < count; i++) {
            const value = await this.globalSearchResults.nth(i).find('.ca-global-search-result__audit-key--hyperlink').innerText;
            array.push(value);
        }
        return array;
    }

    public async getAllRecordResults(): Promise<Array<{name: string, rows: object[]}>> {
        const array = [];
        const count = await this.getCount('globalSearchResults');
        for (let i = 0; i < count; i++) {
            const name = await this.globalSearchResults.nth(i).find('.ca-global-search-result__audit-key--hyperlink').innerText;
            const rows = await this.getResult(name).getAllSearchResultTableValues();
            array.push({
                name,
                rows
            });
        }
        return array;
    }

    public async getAllRowValues(name: string) {
        const valuesArray = [];
        const count = await this.getCount('globalSearchResults');
        for (let i = 0; i < count; i++) {
            const value = await new SearchResult(this.globalSearchResults, i).getRowValue(name);
            valuesArray.push(value);
        }
        return valuesArray;
    }

    public async selectSearchIn(value: string): Promise<void> {
        await this.click(this.searchIn);
        const popup = new KendoPopup();
        await popup.selectItem(value);
    }
}

class SearchResult extends  BaseObject {
    constructor(root: Selector, nameOrNumber) {
        super();
        if (typeof nameOrNumber === 'string') {
            this.container = root.find('.linkable-value')
                .withText(nameOrNumber)
                .parent(1);
            this.name = nameOrNumber;
        } else {
            this.container = root.nth(nameOrNumber);
            this.number = nameOrNumber;
        }

        this.checkboxEl = this.container.find('.ca-checkbox');
        this.infoRows = this.container.find('.ca-global-search-result__hit');
        this.auditKey = this.container.find('.ca-global-search-result__audit-key');
    }

    public number: number;

    // Elements
    protected checkboxEl: Selector;
    protected infoRows: Selector;
    protected auditKey: Selector;

    // Getters
    get checkbox() {
        return new Checkbox(this.checkboxEl);
    }

    // Methods
    private getRow(nameOrNumber) {
        if (typeof nameOrNumber === 'number') {
            return this.infoRows.nth(nameOrNumber);
        } else {
            return this.infoRows.withText(nameOrNumber);
        }
    }

    public async getRowValue(nameOrNumber) {
        const value = (await this.getRow(nameOrNumber)
            .find('.ca-global-search-result__hit-field-name')
            .nextSibling().textContent).trim();
        CustomLogger.logger.log('method', `The ${nameOrNumber} field value is '${value}'`);
        return value;
    }

    public async getHighlightedText(nameOrNumber: string | number): Promise<string[]> {
        const array = [];
        const highlightedText = this.getRow(nameOrNumber)
            .find('.ca-global-search-result__hit-field-name')
            .nextSibling().find('.search-highlight');
        const count = await highlightedText.count;
        for (let i = 0; i < count; i++) {
            const value = await highlightedText.nth(i).innerText;
            array.push(value);
        }
        return array;
    }

    public async getAllSearchResultValues(): Promise<string[]> {
        const array = [];
        const count = await this.infoRows.count;
        for (let i = 0; i < count; i++) {
            const value = await this.getRow(i)
                .find('.ca-global-search-result__hit-field-name')
                .nextSibling().innerText;
            array.push(value);
        }
        return array;
    }

    public async getAllSearchResultTableValues(): Promise<Array<{ table: string, field: string, value: string }>> {
        const array = [];
        const count = await this.infoRows.count;
        for (let i = 0; i < count; i++) {
            const fieldName = this.getRow(i)
                .find('.ca-global-search-result__hit-field-name');
            const fieldNameString = await fieldName.innerText;
            const matches = (fieldNameString).match(/(.*) - (.*):/);
            const value = {
                table: matches[1],
                field: matches[2],
                value: await fieldName.nextSibling().innerText
            };
            array.push(value);
        }
        return array;
    }

    public getAuditKeyValue() {
        return this.getText('auditKey', 0, { asDisplayed: true});
    }

    public async open() {
        await this.click('auditKey');
    }
}

class Filter extends BaseObject {
    public name = 'Filter';
    protected container = Selector('ca-global-search-filter', { visibilityCheck: true });
    private fieldConstructors = {
        input: Input,
        autocomplete: Autocomplete
    };

    // Elements
    protected labels = this.container.find('label.ca-global-search-filter__row');
    protected fields = this.container.find('div.ca-global-search-filter__row');
    protected buttons = this.container.find('.ca-global-search-filter__action');

    // Methods
    public async getRowLabels(): Promise<Array<{ text: string, index: number }>> {
        const labelsArray = [];
        const count = await this.labels.count;
        for (let i = 0; i < count; i++) {
            labelsArray.push({text: (await this.labels.nth(i).textContent).trim(), index: i});
        }
        return labelsArray;
    }

    public async fillFieldWithValue(fieldName: string, fieldType: string, value: string) {
        await (await this.getField(fieldName, fieldType)).fill(value);
    }

    public async getField(fieldName: string, fieldType): Promise<any> {
        const field = await this.getFieldElement(fieldName);
        return new this.fieldConstructors[fieldType](field);
    }

    public async getFieldType(fieldName: string): Promise<string> {
        const fieldClasses = await (await this.getFieldElement(fieldName)).child().classNames;
        return fieldClasses.includes('ca-combobox') ? 'dropdown' : fieldClasses.includes('ca-textbox') ? 'input' : undefined;
    }

    private async getFieldElement(fieldName: string): Promise<any> {
        const labelsArray = await this.getRowLabels();
        const fieldPosition = labelsArray.filter((label) => {
            return label.text.toLowerCase() === fieldName.toLowerCase();
        })[0].index;
        return this.fields.nth(fieldPosition);
    }
}
