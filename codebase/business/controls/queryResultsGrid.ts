import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import QueryResultsRow from '../elements/queryResultsRow';
import ChildRecordRow from '../elements/childRecordRow';
import Checkbox from '../fields/checkbox';
import KendoPopup from '../elements/kendo/kendoPopup';
import { CustomLogger } from '../../support/utils/log';

export default class QueryResultsGrid extends BaseObject {
    constructor(isChild: boolean = false, position: number = 0) {
        super();
        this.name = 'QueryResultsGrid';
        this.isChild = isChild;
        this.container = Selector('kendo-grid').nth(position);

        this.list = this.container.find('kendo-grid-list');
        this.header = this.container.find('.k-grid-header');
        this.columnTitles = this.header.find('.k-header');
        this.leftPart = this.list.find('.k-grid-content-locked');
        this.leftPartRow = this.leftPart.find('tr');
        this.rightPart = this.list.find('.k-virtual-content');
        this.firstColumnValues = isChild ? this.list.find('td[aria-colindex="2"]') : this.leftPart.find('td[aria-colindex="2"]');
        this.checkboxes = isChild ? this.list.find('td[aria-colindex="1"]') : this.leftPart.find('td[aria-colindex="1"]');
        this.RowConstructor = isChild ? ChildRecordRow : QueryResultsRow;
        this.noRecordsGrid = isChild ? this.container.find('.k-grid-norecords') : this.rightPart.find('.k-grid-norecords');
        this.filterRow = this.container.find('.k-filter-row');
        this.filters = this.filterRow.find('td');
        this.filterButtons = this.filterRow.find('.filter-container__filter-button');
        this.selectAllCheckbox = this.container.find('.ca-grid__select-all-checkbox');
        this.columnWithSorting = this.header.find('.k-header[aria-sort] span');
        this.kendoPopup = this.container.find('kendo-popup');
        this.kendoPager = this.container.find('kendo-pager');
        this.kendoPagerNextPageButton = this.kendoPager.find('.k-i-arrow-e');
        this.kendoPagerLastPageButton = this.kendoPager.find('.k-pager-last');
        this.kendoPagerNumericButtonsPanel = this.kendoPager.find('kendo-pager-numeric-buttons');
        this.kendoPagerSelectedPage = this.kendoPagerNumericButtonsPanel.find('.k-state-selected');
        this.kendoPagerNumericButtons = this.kendoPagerNumericButtonsPanel.find('.k-link');
    }

    private columnNamesArray: Array<{text: string, index: number}>;
    private readonly RowConstructor;
    private isChild: boolean;

    // Elements
    protected list: Selector;
    protected header: Selector;
    protected columnTitles: Selector;
    protected leftPart: Selector;
    protected leftPartRow: Selector;
    protected rightPart: Selector;
    protected firstColumnValues: Selector;
    protected checkboxes: Selector;
    protected noRecordsGrid: Selector;
    protected filterRow: Selector;
    protected filters: Selector;
    protected filterButtons: Selector;
    protected selectAllCheckbox: Selector;
    protected columnWithSorting: Selector;
    protected kendoPopup: Selector;
    protected kendoPager: Selector;
    protected kendoPagerNextPageButton: Selector;
    protected kendoPagerLastPageButton: Selector;
    protected kendoPagerNumericButtonsPanel: Selector;
    protected kendoPagerNumericButtons: Selector;
    protected kendoPagerSelectedPage: Selector;
    public sortDirection = SortDirection;

    // Getters

    // Methods
    public async getColumnsNamesArray() {
        const count = await this.getCount('columnTitles');
        const array = [];
        for (let i = 0; i < count; i++) {
            array.push({text: await this.columnTitles.nth(i).find('div,[title],[class*="grid-header"]').innerText, index: i});
        }
        if (array[0].text === '') {
            array[0].text = 'checkbox';
        }

        this.columnNamesArray = array;
        return this.columnNamesArray;
    }

    public async getRecord(positionOrFirstColumnValue) {
        let position: number;
        const columns = await this.getColumnsNamesArray();
        if (typeof positionOrFirstColumnValue === 'string') {
            const count = await this.firstColumnValues.count;
            for (let i = 0; i < count; i++) {
                const currentDocketNumber = await this.firstColumnValues.nth(i).textContent;
                if (currentDocketNumber.toLowerCase().includes(positionOrFirstColumnValue.toLowerCase())) {
                    CustomLogger.logger.log('method', `Row with First column value '${positionOrFirstColumnValue}' has position '${i}'`);
                    position = i;
                    break;
                }
            }
        } else if (typeof positionOrFirstColumnValue === 'number') {
            position = positionOrFirstColumnValue;
        }
        if (typeof position === 'undefined') {
            throw new Error(`'${positionOrFirstColumnValue}' is a wrong first column value or Position for any row`);
        }
        return new this.RowConstructor(position, columns);
    }

    public async openRecord(positionOrFirstColumnValue) {
        const cell = typeof positionOrFirstColumnValue === 'number' ?
            this.firstColumnValues.nth(positionOrFirstColumnValue) :
            this.firstColumnValues.withExactText(positionOrFirstColumnValue);
        let isVisible = (await cell.find('a').count) > 0;
        if (isVisible) {
            isVisible = await cell.find('a').visible;
        }
        if (isVisible) {
            await t.click(cell.find('a'));
        } else {
            await t.click(cell.find('span,div'));
        }
        const messagePart = typeof positionOrFirstColumnValue === 'number' ? 'position' : 'first column value';
        CustomLogger.logger.log('method', `Record with ${messagePart} '${positionOrFirstColumnValue}' is opened`);
    }

    public async openRecordByValueInColumn(columnName: string, columnValue: string) {
        let column = this.columnTitles.withExactText(columnName);
        let columnIndex = await column.getAttribute('aria-colindex');
        let cell = this.list.find(`td[aria-colindex="${columnIndex}"]`).withExactText(columnValue);
        let rowIndex = await cell.parent('tr').getAttribute('aria-rowindex');
        await this.openRecord(Number(rowIndex) - 2);
    }

    public getCheckbox(positionOrFirstColumnValue) {
        const checkboxField = typeof positionOrFirstColumnValue === 'number' ? this.checkboxes.nth(positionOrFirstColumnValue) : this.firstColumnValues.withExactText(positionOrFirstColumnValue).prevSibling();
        return new Checkbox(checkboxField);
    }

    public async isRecordPresent(recordName: string) {
        return this.isVisible('firstColumnValues', recordName, {isTextExact: true});
    }

    public async isRecordAbsent(recordName: string) {
        const count = await this.firstColumnValues.withExactText(recordName).count;
        CustomLogger.logger.log('method', `Record with first column value '${recordName}' is ${count === 0 ? 'absent' : 'present'}`);
        return count === 0;
    }

    public async getFirstColumnValues() {
        const count = await this.getCount('firstColumnValues');
        const array = [];
        for (let i = 0; i < count; i++) {
            const value = (await this.firstColumnValues.nth(i).textContent).trim();
            array.push(value);
        }
        return array;
    }

    public async getColumnValues(column: string): Promise<any[]> {
        const columnIndex = await this.getColumnIndex(column);
        const columnCells = this.list.find(`td[aria-colindex="${columnIndex + 1}"]`);
        const count = await columnCells.count;
        const array = [];
        for (let i = 0; i < count; i++) {
            let value: any;
            if (await columnCells.nth(i).find('input').count > 0) {
                value = await columnCells.nth(i).find('input').value;
                value = value === 'undefined' ? '' : value;
            } else {
                value = (await columnCells.nth(i).textContent).trim();
            }
            if (!value) {
                const html = await this.getElementHtml(columnCells.nth(i));
                if (html.includes('<ca-checkbox ')) {
                    value = await new Checkbox(columnCells.nth(i)).isChecked();
                }
                if (html.includes('<i ')) {
                    value = (await this.getAttribute(columnCells.nth(i).find('i'), 'class')).includes('fa-check');
                }
            }
            array.push(value);
        }
        CustomLogger.logger.log('method', `Values in column '${column}' are ${JSON.stringify(array)}`);
        return array;
    }

    public async getRecordsCount() {
        const count = await this.getCount('firstColumnValues');
        return count;
    }

    public async getRecordFirstColumnValue(position: number) {
        const value = (await this.firstColumnValues.nth(position).textContent).trim();
        CustomLogger.logger.log('method', `The value of ${position} position Record is '${value}'`);
        return value;
    }

    public async isFirstColumnHyperlink() {
        const count = await this.firstColumnValues.find('a').count;
        CustomLogger.logger.log('method', `Links in first column are ${count === 0 ? 'absent' : 'present'}`);
        return count !== 0;
    }

    public async isFirstColumnImage() {
        const columns = await this.getColumnsNamesArray();
        const is = columns[1].text.toLowerCase().includes('image');
        CustomLogger.logger.log('method', `Image in first column are ${is ? 'present' : 'absent'}`);
        return is;
    }

    public async openFilter(column) {
        let position: number;
        if (typeof column === 'number') {
            position = column;
        } else {
            position = await this.getColumnIndex(column);
        }
        const filterCell = this.filters.nth(position);
        const isFilterOpened = await filterCell.find(' kendo-popup').count > 0;
        if (isFilterOpened) {
            CustomLogger.logger.log('WARN', `Filter has been already opened for the '${column}' column`);
        } else {
            const selector = filterCell.find('.filter-container__filter-button');
            await this.scrollIntoViewIfNeeded(selector);
            await t.click(selector);
            CustomLogger.logger.log('method', `Popup with filter is opened for the '${column}' column`);
        }
        const kendo = new KendoPopup();
        const count = await kendo.getCount('checkboxes');
        const type =  count > 0 ? 'checkbox' : 'input';
        const filter = kendo.getFilter(type);
        CustomLogger.logger.log('method', `New ${filter.name} created`);
        return filter;
    }

    public async closeFilter() {
        const isFilterOpened = await this.kendoPopup.count > 0;
        if (isFilterOpened) {
            await t.click(this.kendoPopup.parent('filter-container').find('.filter-container__filter-button'));
            CustomLogger.logger.log('method', `Popup with filter is closed`);
        } else {
            CustomLogger.logger.log('WARN', `There are no filters opened`);
        }
    }

    public async removeFilter(column) {
        let position: number;
        if (typeof column === 'number') {
            position = column;
        } else {
            position = await this.getColumnIndex(column);
        }
        const filterCell = this.filters.nth(position);
        const selector = filterCell.find('.filter-container__clear-button');
        await this.scrollIntoViewIfNeeded(selector);
        await t.click(selector);
        CustomLogger.logger.log('method', `The filter for the '${column}' column is removed`);
    }

    public async isFilterActive(column) {
        let position: number;
        if (typeof column === 'number') {
            position = column;
        } else {
            position = await this.getColumnIndex(column);
        }
        const filterCell = this.filters.nth(position);
        const count = await filterCell.find('.filter-container__clear-button').count;
        CustomLogger.logger.log('method', `The filter for the '${column}' is active`);
        return count === 1;
    }

    public async isClearFilterDisplayed(column) {
        let position: number;
        position = await this.getColumnIndex(column);
        const filterCell = this.filters.nth(position);
        return await this.isPresent(filterCell.find('.filter-container__clear-button'));
    }

    public async selectAllRecords() {
        const checkbox = new Checkbox(this.selectAllCheckbox);
        await checkbox.check();
        CustomLogger.logger.log('method', `All records in the grid are selected in the child`);
    }

    public async deselectAllRecords() {
        const checkbox = new Checkbox(this.selectAllCheckbox);
        await checkbox.uncheck();
        CustomLogger.logger.log('method', `All records in the grid are unselected in the child`);
    }

    public async clickHeader(column) {
        const header = typeof column === 'string' ? this.columnTitles.withText(column).find('span') : this.columnTitles.nth(column).find('span');
        if (await header.visible) {
            await this.click(header);
        } else {
            await this.click(header.find('span'));
        }
        CustomLogger.logger.log('method', `The '${column}' is clicked`);
    }

    public async sort(columnName: string, direction: SortDirection): Promise<void> {
        CustomLogger.logger.log('method', `Sort column '${columnName}' ${direction.toString()}`);
        const header = this.columnTitles.withText(columnName);
        for (let sort of Object.values(SortDirection)) {
            const currentSortStatus = await header.getAttribute('aria-sort');
            if (currentSortStatus !== direction.toString() && !(direction.toString() === SortDirection.none.toString() && !currentSortStatus)) {
                await this.click(header.find('span'));
            }
            await this.waitLoading();
        }
    }

    public async getSortedColumn() {
        const column = await this.columnWithSorting.innerText;
        CustomLogger.logger.log('method', `The grid is sorted by the '${column}' column`);
        return column;
    }

    public async getFilteredColumns() {
        await this.getColumnsNamesArray();
        const count = await this.filters.count;
        const array = [];
        for (let i = 0; i < count; i++) {
            const clearButton = this.filters.nth(i).find('.filter-container__clear-button');
            if ((await clearButton.count) > 0) {
                array.push(this.columnNamesArray.find((x) => x.index === i).text);
            }
        }
        return array;
    }

    public async resizeColumn(columnName: string, offset: number) {
        await this.getColumnsNamesArray();
        const index = this.columnNamesArray.find((x) => x.text === columnName).index;
        const resizer = this.columnTitles.nth(index).find('.k-column-resizer');
        const headerCenter = Math.round(await this.columnTitles.nth(index).clientHeight / 2);
        await t.drag(resizer, offset, 0, { offsetY: headerCenter, speed: 0.5 });
        CustomLogger.logger.log('method', `The '${columnName} is resized by offset = ${offset}`);
    }

    public async getColumnWidth(columnName: string) {
        await this.getColumnsNamesArray();
        const index = this.columnNamesArray.find((x) => x.text === columnName).index;
        const value = await this.columnTitles.nth(index).clientWidth;
        CustomLogger.logger.log('method', `The width of the ${columnName} column is ${value}`);
        return value;
    }

    public async dragColumn(columnToDrag: string, columnToDragTo: string) {
        await this.getColumnsNamesArray();
        const indexOfColumnToDrag = this.columnNamesArray.find((x) => x.text === columnToDrag).index;
        const indexOfDestinationColumn = this.columnNamesArray.find((x) => x.text === columnToDragTo).index;
        const column = this.columnTitles.nth(indexOfColumnToDrag);
        const destinationColumn = this.columnTitles.nth(indexOfDestinationColumn);
        await t
            .drag(column, 10, 0)
            .dragToElement(column, destinationColumn, { speed: 0.5 });
        CustomLogger.logger.log('method', `The '${columnToDrag}' column dragged to the '${columnToDragTo}' column`);
    }

    public async getColumnIndex(columnName: string) {
        await this.getColumnsNamesArray();
        const value = this.columnNamesArray.find((x) => x.text === columnName).index;
        CustomLogger.logger.log('method', `Index of the ${columnName} is ${value}`);
        return value;
    }

    public async getColumnSortingStatus(column): Promise<{isPresent: boolean, direction: string}> {
        const columnHeader = typeof column === 'string' ? this.columnTitles.withText(column) : this.columnTitles.nth(column);
        const status = {
            isPresent: await columnHeader.hasAttribute('aria-sort'),
            direction: null
        };
        if (status.isPresent) {
            status.direction = await columnHeader.getAttribute('aria-sort');
        }
        CustomLogger.logger.log('method', `The column ${column} is ${status.isPresent ? `sorted with ${status.direction} direction` : 'unsorted'}`);
        return status;
    }

    public async getRowIndexByColumnValue(columnName: string, columnValue: string) {
        const columnValues = (await this.getColumnValues(columnName)).map((x, index) => {
            return { value: x, index };
        });
        return columnValues.find((x) => x.value === columnValue).index;
    }

    public async navigateToTheNextPage(): Promise<void> {
        CustomLogger.logger.log('method', `Navigate query results to the next page`);
        await this.click(this.kendoPagerNextPageButton);
    }

    public async navigateToTheLastPage(): Promise<void> {
        CustomLogger.logger.log('method', `Navigate query results to the last page`);
        await this.click(this.kendoPagerLastPageButton);
    }

    public async getCurrentPage(): Promise<number> {
        return Number(await this.kendoPagerSelectedPage.innerText);
    }

    public async getPagerNumbers(): Promise<string[]> {
        const count = await this.kendoPagerNumericButtons.count;
        const array = [];
        for (let i = 0; i < count; i++) {
            array.push(this.kendoPagerNumericButtons.nth(i).innerText);
        }

        return array;
    }
}

export enum SortDirection {
    'none' = 'none',
    'ascending' = 'ascending',
    'descending' = 'descending'
}
