import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';

export default class BaseGrid extends BaseObject {
    constructor() {
        super();
    }

    protected columnNamesArray: Array<{ text: string, index: number }>;

    // Elements
    protected header: Selector;
    protected columnTitles: Selector;
    protected firstColumnValues: Selector;

    // Getters

    // Methods
    public async getColumnsNamesArray() {
        const count = await this.getCount('columnTitles');
        const array = [];
        for (let i = 0; i < count; i++) {
            array.push({ text: await this.columnTitles.nth(i).find('div,[title],[class*="grid-header"]').innerText, index: i });
        }
        if (array[0].text === '') {
            array[0].text = 'checkbox';
        }

        this.columnNamesArray = array;
        return this.columnNamesArray;
    }

    public async getColumnCount(): Promise<number> {
        return await this.getCount(this.columnTitles);
    }

    public async isFirstColumnImage() {
        const columns = await this.getColumnsNamesArray();
        const is = columns[1].text.toLowerCase().includes('image');
        CustomLogger.logger.log('method', `Image in first column are ${is ? 'present' : 'absent'}`);
        return is;
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

    public async getColumnIndex(columnName: string) {
        await this.getColumnsNamesArray();
        const value = this.columnNamesArray.find((x) => x.text === columnName).index;
        CustomLogger.logger.log('method', `Index of the ${columnName} is ${value}`);
        return value;
    }
}
