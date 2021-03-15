import { CustomLogger } from '../../support/utils/log';
import BaseGrid from '../controls/baseGrid';
import Input from './input';
import Autocomplete from './autocomplete';
import Datepicker from './datepicker';
import Checkbox from './checkbox';
import Hierarchy from './hierarchy';
import Dropdown from './dropdown';
import Numeric from './numeric';
import LinkedFile from './linkedFile';
import Multiline from './multiline';
import {Options} from '../../interfaces';

export default class TableGrid extends BaseGrid {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super();
        this.name = name;
        if (name) {
            if (options && options.isTextExact) {
                this.container = rootSelector.withExactText(name);
            } else {
                this.container = rootSelector.withText(name);
            }
        } else {
            this.name = 'Unidentified';
            this.container = rootSelector;
        }
        this.table = this.container.find('.k-grid');
        this.header = this.container.find('.k-grid-header');
        this.columnTitles = this.header.find('.k-header');
        this.rows = this.table.find('tbody tr');
    }

    // Elements

    // Methods
    protected table: Selector;
    protected rows: Selector;

    public async getField(columnName: string, type: string, rowIndex: number = 0, options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${columnName}' in the row = ${rowIndex}`);
        const columnIndex = await this.getColumnIndex(columnName);
        const cell = this.rows.nth(rowIndex).find('td').nth(columnIndex);
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
        return new constructors[type](cell, null, options);
    }

    public async getColumnsNamesArray() {
        const count = await this.getCount('columnTitles');
        const array = [];
        for (let i = 0; i < count; i++) {
            array.push({ text: await this.columnTitles.nth(i).innerText, index: i });
        }

        this.columnNamesArray = array;
        return this.columnNamesArray;
    }

    public async getRecordCount(): Promise<number> {
        return await this.rows.count;
    }

    public async getColumnValues(column: string): Promise<any[]> {
        const columnIndex = await this.getColumnIndex(column);
        const count = await this.getRecordCount();
        const array = [];
        for (let i = 0; i < count; i++) {
            const cell = this.rows.nth(i).find('td').nth(columnIndex);
            let value: any;
            if (await cell.find('input').count > 0) {
                value = await cell.find('input').value;
                value = value === 'undefined' ? '' : value;
            } else {
                value = (await cell.innerText);
            }
            array.push(value);
        }
        CustomLogger.logger.log('method', `Values in column '${column}' are ${JSON.stringify(array)}`);
        return array;
    }
}
