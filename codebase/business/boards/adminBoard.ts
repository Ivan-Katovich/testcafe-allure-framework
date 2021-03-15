import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';
import QueryResultsGrid from '../controls/queryResultsGrid';
import Input from '../fields/input';
import Autocomplete from '../fields/autocomplete';
import Datepicker from '../fields/datepicker';
import Checkbox from '../fields/checkbox';
import SideBar from '../controls/sideBar';
import Treeview from '../elements/treeview';
import Multiselect from '../fields/multiselect';
import Dropdown from '../fields/dropdown';
import Searchbox from '../fields/searchbox';
import Toggle from '../fields/toggle';
import AuditInfo from '../controls/auditInfo';
import {Options} from '../../interfaces';

export default class AdminBoard extends BaseObject {
    public name = 'AdminBoard';
    protected container = Selector('.app__content', { visibilityCheck: true });

    // Elements
    protected header = this.container.find('.ca-splitted-layout__header,.splitted-layout__header-container');
    protected menuButtons = this.header.find('.ca-button--tertiary');
    protected title = this.header.find('.ca-splitted-layout-header__title,.splitted-layout__header');
    protected fields = this.container.find('.ca-administration-control,.ca-auto-update-details__field');
    protected searchBox = this.container.find('.ca-grid__search');
    protected administrationControl = this.container.find('.ca-administration__text-link');

    // Getters
    get grid() {
        return this.createGetter(QueryResultsGrid, true);
    }

    get sideBar() {
        return this.createGetter(SideBar);
    }

    get kendoTreeview() {
        return this.createGetter(Treeview, 'kendo');
    }

    get auditInfo() {
        return this.createGetter(AuditInfo);
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
