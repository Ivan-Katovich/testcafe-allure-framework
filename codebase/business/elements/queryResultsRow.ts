import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger  } from '../../support/utils/log';

export default class QueryResultsRow extends BaseObject {
    constructor(position: number, columns: Array<{text: string, index: number}>) {
        super();
        this.position = position;
        this.columns = columns;
        this.leftRow = this.leftPart.find('tr').nth(position);
        this.mainCell = this.leftRow.find('[aria-colindex="2"]');
        this.rightRow = this.rightPart.find('tr').nth(position);

    }
    public position: number;
    protected columns: Array<{text: string, index: number}>;
    protected cell: Selector;

    // Elements
    protected leftPart = Selector('.k-grid-content-locked', { visibilityCheck: true });
    protected leftRow: Selector;
    protected mainCell: Selector;
    protected checkbox: Selector;
    protected rightPart = Selector('.k-grid-content-locked + .k-virtual-content', { visibilityCheck: true });
    protected rightRow: Selector;

    // Methods
    protected getPositionInRow(value: string) {
        const position = this.columns.filter((column) => {
            return column.text.toLowerCase() === value.toLowerCase();
        })[0].index;
        return position;
    }
    protected getCell(valueName: string) {
        const cellPosition = this.getPositionInRow(valueName);
        if (cellPosition < 2) {
            this.cell = this.leftRow.find('td').nth(cellPosition);
        } else {
            this.cell = this.rightRow.find('td').nth(cellPosition - 2);
        }
        return this.cell;
    }

    protected setColumns(columns: Array<{text: string, index: number}>) {
        this.columns = columns;
    }

    public async getValue(valueName: string) {
        let text: string;
        const cell = this.getCell(valueName);
        if (await cell.find('.fa-check-square-o').count > 0) {
            text = 'check';
        } else {
            text = (await cell.textContent).trim();
        }

        CustomLogger.logger.log('method', `Text in ${this.position} row, in '${valueName}' cell is: '${text}'`);
        return text;
    }

    public async open() {
        await this.click('mainCell');
    }
}
