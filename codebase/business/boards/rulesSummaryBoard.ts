import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';
import QueryResultsGrid from '../controls/queryResultsGrid';
import Input from '../fields/input';
import Autocomplete from '../fields/autocomplete';
import Datepicker from '../fields/datepicker';
import Checkbox from '../fields/checkbox';
import Treeview from '../elements/treeview';
import Multiselect from '../fields/multiselect';
import Dropdown from '../fields/dropdown';
import Searchbox from '../fields/searchbox';
import Toggle from '../fields/toggle';
import {Options} from '../../interfaces';

export default class RulesSummaryBoard extends BaseObject {
    public name = 'RulesSummaryBoard';
    protected container = Selector('.ip-rules-summary', { visibilityCheck: true });

    // Elements
    protected header = this.container.find('.ip-rules-summary__header');
    protected menuButtons = this.header.find('.ip-rules-summary__status-button');
    protected title = this.header.find('.ip-rules-summary__title');
    protected fields = this.container.find('.ip-rules-summary-details-field');
    protected searchBox = this.container.find('.ip-rules-summary__search');
    protected summaryDetails = this.container.find('.ip-rules-summary-details');
    protected detailsTitle = this.summaryDetails.find('.ip-rules-summary__title').nth(0);

    // Getters
    get nodeTreeview() {
        return this.createGetter(Treeview, 'node');
    }

    get grid() {
        return this.createGetter(QueryResultsGrid);
    }

    // Methods
    public getField(name: string, type: string = 'input', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${name}'`);
        const constructors = {
            input: Input,
            autocomplete: Autocomplete,
            dropdown: Dropdown,
            multiselect: Multiselect,
            toggle: Toggle,
            datepicker: Datepicker,
            checkbox: Checkbox
        };
        return new constructors[type](this.fields, name, options);
    }

    public clickButton(name) {
        return this.click('menuButtons', name);
    }

    public getTitle() {
        return this.getText('title');
    }

    public save() {
        return this.clickButton('Save');
    }

    public async searchItem(entry: string) {
        await new Searchbox(this.searchBox).search(entry);
    }

    public async clearSearch() {
        await new Searchbox(this.searchBox).clear();
    }

}
