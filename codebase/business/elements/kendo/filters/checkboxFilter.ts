import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../../../support/utils/log';
import timeService from '../../../../services/entries/timeService';
import Checkbox from '../../../fields/checkbox';
import BaseFilter from './baseFilter';

export default class CheckboxFilter extends BaseFilter {
    constructor(container) {
        super(container);
        this.container = container;
        this.name = 'CheckboxFilter';
        this.searchInput = this.container.find('.ca-textbox__input');
        this.clearSearchButton = this.container.find('.ca-button--icon');
        this.selectAllCheckbox = this.container.find('.selectable-list__select-all');
        this.checkboxes = this.container.find('ca-checkbox');
        this.countLabel = this.container.find('.selectable-list__info-label');
    }

    // Elements
    protected searchInput: Selector;
    protected clearSearchButton: Selector;
    protected selectAllCheckbox: Selector;
    protected checkboxes: Selector;
    protected countLabel: Selector;

    // Methods

    public async getAllCheckboxLabels() {
        const count = await this.checkboxes.count;
        let labels = [];
        for (let i = 0; i < count; i++) {
            labels.push(await this.checkboxes.nth(i).innerText);
        }
        CustomLogger.logger.log('method', `Filter contains checkboxes: ${JSON.stringify(labels)}`);
        return labels;
    }

    public async getAllCheckboxLabelsWithValues(): Promise<Array<{name: string, value: boolean}>> {
        const count = await this.checkboxes.count;
        let labels = [];
        for (let i = 0; i < count; i++) {
            labels.push({
                name: await this.checkboxes.nth(i).innerText,
                value: await this.checkboxes.nth(i).find('input').checked
            });
        }
        CustomLogger.logger.log('method', `Filter contains checkboxes with values: ${JSON.stringify(labels)}`);
        return labels;
    }

    public getCheckbox(checkbox): Checkbox {
        return typeof checkbox === 'string' ? new Checkbox(this.checkboxes, checkbox) : new Checkbox(this.checkboxes.nth(checkbox));
    }

    public async apply(checkboxes: string[]) {
        for (let checkbox of checkboxes) {
            await this.getCheckbox(checkbox).check();
        }
        await this.confirm();
        CustomLogger.logger.log('method', `Filter with ${JSON.stringify(checkboxes)} checkboxes is applied for the column`);
    }

    public async search(text: string) {
        await this.type('searchInput', text);
        await timeService.sleep(300); // Hardcoded sleep cause of hardcoded sleep 250 ms on frontend
    }

    public async clearSearch() {
        await this.click('clearSearchButton');
    }
}
