import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';

export default class ExportGlobalSearchPage extends BaseObject {
    public name = 'ExportGlobalSearchPage';

    // Elements
    protected rows = Selector('tr');
    protected tables = Selector('table');
    protected recordTitles = Selector('b');

    public async getResults(): Promise<Record[]> {
        const array: Record[] = [];
        for (let i = 0; i < await this.recordTitles.count; i++) {
            const result = new Record(i > 0 ? this.recordTitles.nth(i) : this.recordTitles.nth(i).parent('table'));
            array.push(result);
        }
        return array;
    }

    public async getResult(index: number): Promise<Record> {
        const result = new Record(index > 0 ? this.recordTitles.nth(index) : this.recordTitles.nth(index).parent('table'));
        return result;
    }
}

class Record extends BaseObject {
    public name = 'Result';

    constructor(element: Selector) {
        super();
        this.title = element;
        this.table = element.nextSibling('table').nth(0);
        this.rows = this.table.find('tr');
    }

    protected title: Selector;
    protected table: Selector;
    protected rows: Selector;

    public async getTitle(): Promise<string> {
        return await this.title.innerText;
    }

    public async getResults(): Promise<string[]> {
        const array = [];
        for (let i = 0; i < await this.rows.count; i++) {
            const line = await this.rows.nth(i).innerText;
            array.push(line);
        }
        return array;
    }
}
