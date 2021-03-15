import { Selector, t } from 'testcafe';
import ModalWindow from './modalWindow';
import Treeview from '../elements/treeview';
import Searchbox from '../fields/searchbox';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class HierarchyModal extends ModalWindow {
    public name = 'HierarchyModal';
    protected contaner = Selector('ca-hierarchy-modal-window').find('.ca-modal__window');

    // Elements
    protected searchBoxSelector = this.container.find('.ca-hierarchy-modal__search');
    protected dataBox = this.contaner.find('.ca-hierarchy-modal__data');
    protected mainButton = this.contaner.find('.ca-button--mini-primary');

    // Getters
    get kendoTreeview() {
        return this.createGetter(Treeview, 'kendo');
    }

    get searchBox() {
        return new Searchbox(this.searchBoxSelector);
    }

    // Methods
    public async searchItem(entry: string) {
        await new Searchbox(this.searchBoxSelector).search(entry);
    }

    public async clearSearch() {
        await new Searchbox(this.searchBoxSelector).clear();
    }

    public async add() {
        await this.confirm();
    }

    public async pickThroughTreeview(path: string) {
        CustomLogger.logger.log('method', `Pick item in '${this.name}' with value '${path}'`);
        await this.kendoTreeview.open(path);
        await this.add();
    }

    public async pickThroughSearch(value: string, options?: Options) {
        CustomLogger.logger.log('method', `Pick item in '${this.name}' with value '${value}'`);
        await this.searchBox.search(value, options);
        await this.kendoTreeview.selectHighlightedItem();
        await this.add();
    }

    public async pick(value: string, options?: Options) {
        if (value.includes('>')) {
            await this.pickThroughTreeview(value);
        } else {
            await this.pickThroughSearch(value, options);
        }
    }
}
