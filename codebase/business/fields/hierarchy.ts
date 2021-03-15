import BaseField from './baseField';
import HierarchyModal from '../modals/hierarchyModal';
import { CustomLogger } from '../../support/utils/log';
import {Selector, t} from 'testcafe';
import {Options} from '../../interfaces';

export default class Hierarchy extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'hierarchy';
        this.input = this.container.find('.ca-hierarchy__input');
        this.searchButton = this.container.find('.ca-hierarchy__actions,.ca-hierarchy__grid-search-button');
        this.managementControlButton = this.container.find('.management-control__icon');
        this.clearButton = this.container.find('.ca-search__clear-button .fa-times');
        this.inputBox = this.container.find('.ca-hierarchy');
        this.pencilIcon = this.managementControlButton.find('.fa-pencil');
    }

    // Elements
    protected input: Selector;
    protected searchButton: Selector;
    protected managementControlButton: Selector;
    protected clearButton: Selector;
    protected inputBox: Selector;
    protected pencilIcon: Selector;

    // Getters
    get modal() {
        return new HierarchyModal();
    }

    // Method
    public async clear() {
        await this.click('container');
        if (await this.isPresent('clearButton') === true) {
            CustomLogger.logger.log('method', `Clear '${this.name}' field by clearButton`);
            await this.click('clearButton');
        } else {
            CustomLogger.logger.log('method', `Clear '${this.name}' field by deleting value`);
            await super.clear();
        }
    }

    protected async clickSearch() {
        await this.click('searchButton');
    }

    public async fillThroughTreeview(path: string) {
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${path}'`);
        await this.click('container');
        await this.clickSearch();
        await this.waitLoading();
        let modal = new HierarchyModal();
        await modal.kendoTreeview.open(path);
        await modal.add();
    }

    public async fillThroughSearch(value: string, options?: Options) {
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${value}'`);
        await this.click('container');
        await this.clickSearch();
        await this.waitLoading();
        let modal = new HierarchyModal();
        await modal.searchBox.search(value, options);
        await modal.kendoTreeview.selectHighlightedItem();
        await modal.add();
    }

    public async fill(value: string, options?: Options) {
        if (value.includes('>')) {
            await this.fillThroughTreeview(value);
        } else {
            await this.fillThroughSearch(value, options);
        }
    }

}
