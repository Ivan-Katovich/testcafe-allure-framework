import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import BaseObject from '../baseObject';
import {Options} from '../../interfaces';

export default class Searchbox extends BaseObject {
    constructor(rootSelector: Selector) {
        super();
        this.container = rootSelector;
        this.searchBoxInput = this.container.find('input');
        this.searchButton = this.container.find('.ca-search__search-button');
        this.clearSearchButton = this.container.find('.ca-search__clear-button');
    }

    // Elements
    protected searchBoxInput: Selector;
    protected searchButton: Selector;
    protected clearSearchButton: Selector;

    // Methods
    public async search(entry: string, options?: Options) {
        await this.type('searchBoxInput', entry, options);
        await this.click('searchButton');
    }

    public async clear() {
        await this.click('clearSearchButton');
    }
}
