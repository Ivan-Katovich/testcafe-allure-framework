import { Selector } from 'testcafe';
import BaseObject from '../baseObject';

export default class ExportHtmlPage extends BaseObject {
    public name = 'ExportHtmlPage';

    // Elements
    protected rows = Selector('tr');
    protected tables = Selector('table');
    protected recordTitles = Selector('b');

    public async getRowValues(index: number): Promise<string[]> {
        const array: string[] = [];
        const cells = this.rows.nth(index).find('td');
        const count = await cells.count;
        for (let index = 0; index < count; index++) {
            array.push(await cells.nth(index).innerText);
        }

        return array;
    }
}
