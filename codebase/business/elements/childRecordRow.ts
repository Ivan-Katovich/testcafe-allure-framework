import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import QueryResultsRow from './queryResultsRow';
import { CustomLogger  } from '../../support/utils/log';
import Input from '../fields/input';
import Autocomplete from '../fields/autocomplete';
import Datepicker from '../fields/datepicker';
import Checkbox from '../fields/checkbox';
import Hierarchy from '../fields/hierarchy';
import Dropdown from '../fields/dropdown';
import Numeric from '../fields/numeric';
import LinkedFile from '../fields/linkedFile';
import Multiline from '../fields/multiline';
import {Options} from '../../interfaces';

export default class ChildRecordRow extends QueryResultsRow {
    constructor(position: number, columns: Array<{text: string, index: number}>) {
        super(position, columns);
        this.row = Selector('.k-grid-table tr').nth(position);
    }

    // Elements
    protected row: Selector;
    // protected cellInput = this.cell.find('input');

    // Methods
    protected getPositionInRow(value: string, options: Options = {}) {
        let position;
        if (options.isTextExact) {
            position = this.columns.filter((column) => {
                return column.text.toLowerCase() === value.toLowerCase();
            })[0].index;
        } else {
            position = this.columns.filter((column) => {
                return column.text.toLowerCase().includes(value.toLowerCase());
            })[0].index;
        }
        return position;
    }

    protected getCell(valueName: string, options: Options = {}) {
        const cellPosition = this.getPositionInRow(valueName, options);
        this.cell = this.row.find('td').nth(cellPosition);
        return this.cell;
    }

    public async getValue(columnName: string, options: Options = {}) {
        this.getCell(columnName, options);
        let value;
        if (options.readOnlyMode || await this.isFieldReadOnly(columnName, options)) {
            if (await this.cell.find('.fa-check,.fa-check-square-o').count > 0) {
                value = 'check';
            } else {
                value = await this.cell.innerText;
            }
        } else {
            await t.click(this.cell);
            value = await this.cell.find('input,textarea').value;
        }
        CustomLogger.logger.log('method', `Value in ${this.position} row, in '${columnName}' cell is: '${value}'`);
        return value;
    }

    public getField(columnName: string, type: string = 'autocomplete', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${columnName}'`);
        this.getCell(columnName, options || {});
        const constructors = {
            input: Input,
            autocomplete: Autocomplete,
            datepicker: Datepicker,
            checkbox: Checkbox,
            hierarchy: Hierarchy,
            dropdown: Dropdown,
            numeric: Numeric,
            linkedfile: LinkedFile,
            multiline: Multiline
        };
        return new constructors[type](this.cell, null, options);
    }

    public async isFieldReadOnly(columnName: string, options: Options = {}) {
        this.getCell(columnName, options);
        if (await this.cell.find('.linked-column__add,.linked-column__edit').count > 0) {
            CustomLogger.logger.log('method', `The '${columnName}' column is 'editable'}`);
            return false;
        } else if (await this.cell.find('linkable-value').count > 0) {
            return true;
        }
        await t.click(this.cell);
        const value = await this.cell.find('input,textarea').count === 0;
        CustomLogger.logger.log('method', `The '${columnName}' column is ${value ? 'read-only' : 'editable'}`);
        return value;
    }

    public async isCellFocused(columnName: string, options: Options = {}) {
        this.getCell(columnName, options);
        return (await this.cell.getAttribute('class')).includes('k-state-focused');
    }

    public async isRowHighlighted(): Promise<boolean> {
        const is = await this.row.hasClass('highlighted-row');
        CustomLogger.logger.log('method', `The row is ${is ? 'highlighted' : 'not highlighted'}`);
        return is;
    }

    public async verifyFieldsValues(fields: Array<{name: string, value?: string}>): Promise<boolean[]> {
        let fieldsStatusArr = [];
        for (const field of fields) {
            let status = await this.getField(field.name).getValue() === field.value;
            fieldsStatusArr.push(status);
        }
        CustomLogger.logger.log('method', `Status of verification for child grid fields ${JSON.stringify(fields)} is ${fieldsStatusArr}`);
        return fieldsStatusArr;
    }
}
