import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';
import Input from '../fields/input';
import Autocomplete from '../fields/autocomplete';
import Datepicker from '../fields/datepicker';
import Checkbox from '../fields/checkbox';
import Dropdown from '../fields/dropdown';
import Hierarchy from '../fields/hierarchy';
import Numeric from '../fields/numeric';
import {Options} from '../../interfaces';

export default class CriteriaBuilder extends BaseObject {
    public name = 'CriteriaBuilder';
    protected container = Selector('[class*="__criteria-builder"],.query-build-criteria__builder', { visibilityCheck: true });

    // Elements
    protected row = this.container.find('.ca-criteria-builder-row');
    protected headerItems = this.container.find('.ca-query-results__query-header span, [class*="__query-builder"] span');
    protected showResultsButton = this.container.find('.ca-query-criteria-builder__results-button');
    protected resetButton = this.container.find('.dp-button--tertiary');
    protected queryBuilderLabel = this.container.find('.ca-query-results__query-builder, [class*="__query-builder"]');
    protected queryBuilderName = this.container.find('.ca-query-results__query-name, [class*="__query-name"]');

    // Methods
    public getRow(position: number): CriteriaBuilderRow {
        return new CriteriaBuilderRow(position);
    }

    public async getRowCount(): Promise<number> {
        return await this.row.count;
    }

    public showResults(): Promise<void> {
        return this.click('showResultsButton');
    }

    public reset(): Promise<void> {
        return this.click('resetButton');
    }

}

class CriteriaBuilderRow extends BaseObject {
    constructor(position: number) {
        super();
        this.row = Selector('.ca-criteria-builder-row').nth(position);
        this.compare = this.row.find('.ca-criteria-builder-row__field-comparison');
        this.fieldname = this.row.find('.ca-criteria-builder-row__field-name');
        this.operator = this.row.find('.ca-criteria-builder-row__operator');
        this.value = this.row.find('.ca-criteria-builder-row__value');
        this.conjunction = this.row.find('.ca-criteria-builder-row__logical-operator');
        this.add = this.row.find('.ca-criteria-builder-row__add-remove').nth(0).find('button');
        this.remove = this.row.find('.ca-criteria-builder-row__add-remove').nth(1).find('button');
        this.parentheses = this.row.find('ca-criteria-builder-parenthesis');
        this.leftParenthesis = this.parentheses.nth(0);
        this.rightParenthesis = this.parentheses.nth(1);
        this.activeParentheses = this.row.find('.ca-criteria-builder__parenthesis--active');
        this.valueFields = this.value.find('input');
    }

    // Elements
    protected row: Selector;
    protected compare: Selector;
    protected fieldname: Selector;
    protected operator: Selector;
    protected value: Selector;
    protected conjunction: Selector;
    protected add: Selector;
    protected remove: Selector;
    protected parentheses: Selector;
    protected leftParenthesis: Selector;
    protected rightParenthesis: Selector;
    protected activeParentheses: Selector;
    protected valueFields: Selector;

    // Methods
    public getField(columnName: string, type: string = 'autocomplete', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${columnName}'`);
        const identifier = columnName.toLowerCase().replace(' ', '');
        const cell = this[identifier];
        const constructors = {
            input: Input,
            autocomplete: Autocomplete,
            datepicker: Datepicker,
            checkbox: Checkbox,
            dropdown: Dropdown,
            hierarchy: Hierarchy,
            numeric: Numeric
        };
        return new constructors[type](cell, null, options);
    }

    public getValueField(type: string = 'input', index: number = 0) {
        let cell = this.value;
        const range = this.value.find('.ca-criteria-builder-value--range');
        if (this.isPresent(range)) {
            cell = range.child(index);
        }

        const constructors = {
            input: Input,
            autocomplete: Autocomplete,
            datepicker: Datepicker,
            checkbox: Checkbox,
            dropdown: Dropdown,
            hierarchy: Hierarchy,
            numeric: Numeric
        };
        return new constructors[type](cell);
    }

    public async getFieldType(columnName: string): Promise<string> {
        const identifier = columnName.toLowerCase().replace(' ', '');
        const html = await this.getElementHtml(identifier);
        if (html.includes('kendo-combobox')) {
            return 'autocomplete';
        } else if (html.includes('ca-datepicker')) {
            return 'datepicker';
        } else if (html.includes('ca-textbox')) {
            return 'input';
        } else if (html.includes('ca-hierarchy')) {
            return 'hierarchy';
        } else if (html.includes('ca-dropdownlist')) {
            return 'dropdown';
        } else if (html.includes('ca-numerictext')) {
            return 'numeric';
        } else {
            return 'not displayed';
        }
    }

}
