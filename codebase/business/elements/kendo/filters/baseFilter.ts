import { Selector, t } from 'testcafe';
import timeService from '../../../../services/entries/timeService';
import BaseObject from '../../../baseObject';
import KendoPopup from '../kendoPopup';

export default class BaseFilter extends BaseObject {
    constructor(container) {
        super();
        this.container = container;
        this.applyShell = this.container.find('.apply-filter-button');
        this.applyButton = this.container.find('.apply-filter-button button');
        this.buttons = this.container.find('button');
    }

    // Elements
    protected applyButton: Selector;
    protected applyShell: Selector;
    protected buttons: Selector;

    // Getters
    get child() {
        return new KendoPopup(1);
    }

    // Methods

    public async confirm() {
        // await timeService.sleep(300); // Hardcoded sleep cause of hardcoded sleep 250 ms on frontend
        await this.click('applyButton');
    }
}
