import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import Input from '../fields/input';
import Autocomplete from '../fields/autocomplete';
import ChildRecord from '../controls/childRecord';
import Datepicker from '../fields/datepicker';
import Checkbox from '../fields/checkbox';
import Dropdown from '../fields/dropdown';
import Hierarchy from '../fields/hierarchy';
import Numeric from '../fields/numeric';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class DataEntryBoard extends BaseObject {
    public name = 'DataEntryBoard';
    protected container = Selector('.data-entry-form', { visibilityCheck: true });

    // Elements
    protected childRecords = this.container.find('.def-child-records__item');
    protected menuButtons = this.container.find('data-entry-form-menu button');
    protected fields = this.container.find('.filing-section__cell');
    protected tabButton = this.container.find('.ca-tab-button');
    protected tabs = this.container.find('.ca-tab-button');
    protected tabNotes = this.container.find('.filing-section__note');
    protected recordIdRow = this.container.find('.data-entry-form__id');
    protected recordCount = this.container.find('.navigation__results');

    // Getters
    get childRecord() {
        return this.createGetter(ChildRecord);
    }

    // Methods
    public getField(name: string, type: string = 'input', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${name}'`);
        const constructors = {
            input: Input,
            autocomplete: Autocomplete,
            datepicker: Datepicker,
            checkbox: Checkbox,
            dropdown: Dropdown,
            hierarchy: Hierarchy,
            numeric: Numeric
        };
        return new constructors[type](this.fields, name, options);
    }

    public async selectChildRecord(childRecordName: string) {
        const classes = await this.childRecords.withText(childRecordName).getAttribute('class');
        if (!classes.includes('item--active')) {
            await this.click('childRecords', childRecordName);
        } else {
            CustomLogger.logger.log('WARN', `Child record ${childRecordName} has been already selected`);
        }
    }

    public async isChildRecordSelected(childRecordName: string) {
        const classes = await this.childRecords.withText(childRecordName).getAttribute('class');
        let status = classes.includes('item--active');
        CustomLogger.logger.log('method', `Child tab '${childRecordName}' is ${status ? 'selected' : 'not selected'}`);
        return status;
    }

    public async unselectChildRecord(childRecordName: string) {
        const classes = await this.childRecords.withText(childRecordName).getAttribute('class');
        if (classes.includes('item--active')) {
            await this.click('childRecords', childRecordName);
        } else {
            CustomLogger.logger.log('WARN', `Child record ${childRecordName} is not active`);
        }
    }

    public async getFilingTabsArray(): Promise<string[]> {
        const count = await this.getCount('tabs');
        const array = [];
        for (let i = 0; i < count; i++) {
            array.push(await this.tabs.nth(i).innerText);
        }
        CustomLogger.logger.log('method', `Filing section tabs are: ${array}`);
        return array;
    }

    public async selectFilingTab(nameOrPosition: string | number): Promise<void> {
        const tabNames = await this.getFilingTabsArray();
        if (typeof nameOrPosition === 'string') {
            await this.click('tabs', nameOrPosition);
        } else if (typeof nameOrPosition === 'number') {
            await this.click('tabs', tabNames[nameOrPosition]);
        }
    }

    public async isFilingTabSelected(nameOrPosition: string | number): Promise<boolean> {
        const tabNames = await this.getFilingTabsArray();
        let name;
        if (typeof nameOrPosition === 'string') {
            name = nameOrPosition;
        } else if (typeof nameOrPosition === 'number') {
            name = tabNames[nameOrPosition];
        }
        const classes = await this.tabs.withText(name).getAttribute('class');
        let status = classes.includes('selected');
        CustomLogger.logger.log('method', `Filing section tab '${nameOrPosition}' is ${status ? 'selected' : 'not selected'}`);
        return status;
    }

    public async save() {
        CustomLogger.logger.log('method', `User click on 'Save' button in 'Menu'`);
        await t.click(this.menuButtons.withExactText('Save'));
    }

    public async saveValidate() {
        CustomLogger.logger.log('method', `User click on 'Save & Validate' button in 'Menu'`);
        await t.click(this.menuButtons.withText('Save & Validate'));
    }

    public async reset() {
        CustomLogger.logger.log('method', `User click on 'Reset' button in 'Menu'`);
        await t.click(this.menuButtons.withExactText('Reset'));
    }

    public getRecordIdentifier() {
        return this.getText('recordIdRow');
    }

    public getRecordCounter() {
        return this.getText('recordCount');
    }

    public async areFieldsVisible(fields: string[]) {
        const fieldsVisibilityArr: boolean[] = [];
        for (let field of fields) {
            fieldsVisibilityArr.push(await this.isVisible('fields', field));
        }
        CustomLogger.logger.log('method', `Visibility status of fields ${fields} is ${fieldsVisibilityArr}`);
        return fieldsVisibilityArr;
    }

    public async clearFields(fields: Array<{name: string, type?: string}>) {
        for (let field of fields) {
            await this.getField(field.name, field.type).clear();
        }
    }

    public async fillFieldsWithValue(fields: Array<{name: string, type?: string, value: string}>) {
        for (let field of fields) {
            await this.getField(field.name, field.type).fill(field.value);
        }
    }

    public async getFieldsValues(fields: Array<{name: string, type?: string}>): Promise<any[]> {
        const promiseArr = fields.map((field) => {
            return this.getField(field.name, field.type).getValue();
        });
        const fieldsValuesArr = await Promise.all(promiseArr);
        CustomLogger.logger.log('method', `Values of fields ${JSON.stringify(fields)} is ${fieldsValuesArr}`);
        return fieldsValuesArr;
    }

    public async verifyFieldsValues(fields: Array<{name: string, type?: string, value?: string}>) {
        const promiseArr = fields.map((field) => {
            return this.getField(field.name, field.type).verifyValue(field.value);
        });
        const fieldsValuesArr = await Promise.all(promiseArr);
        CustomLogger.logger.log('method', `Status of verification for fields ${JSON.stringify(fields)} is ${fieldsValuesArr}`);
        return fieldsValuesArr;
    }

    public async getChildRecordsNames() {
        const count = await this.getCount('childRecords');
        const children = [];
        for (let i = 0; i < count; i++) {
            const text = await this.childRecords.nth(i).textContent;
            children.push(text.trim());
        }
        CustomLogger.logger.log('method', `Child records names: ${JSON.stringify(children)}`);
        return children;
    }

    public async areNoInputsInFields() {
        const count = await this.fields.find('input').count;
        CustomLogger.logger.log('method', `There are ${count === 0 ? 'no ' : ''}inputs in the fields`);
        return count === 0;
    }

}
