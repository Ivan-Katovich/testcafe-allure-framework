import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';
import CriteriaBuilder from '../controls/criteriaBuilder';
import QueryResultsGrid from '../controls/queryResultsGrid';
import Treeview from '../elements/treeview';
import KendoPopup from '../elements/kendo/kendoPopup';
import app from '../../app';
import {Options} from '../../interfaces';

export default class AddRelationshipsModal extends ModalWindow {
    public name = 'AddRelationshipsModal';

    // Elements
    protected menu = this.container.find('query-results-menu');
    protected title = this.container.find('.related-records-modal__title');
    protected total = this.menu.find('h4');
    protected searchBox = this.container.find('.ca-query-list__search');
    protected searchBoxInput = this.searchBox.find('input');
    protected searchButton = this.searchBox.find('.ca-search__search-button');
    protected clearSearchButton = this.searchBox.find('.ca-search__clear-button');
    protected splitter = this.container.find('.ca-splitter__gutter--clickable');
    protected chevronLeft = this.splitter.find('.fa-chevron-left');
    protected chevronRight = this.splitter.find('.fa-chevron-right');
    protected queryName = this.container.find('[class*="__query-name"]');
    protected resultsHeaderItems = this.container.find('[class*="__query-header"] span');
    protected complexQueriesLink = this.container.find('[class*="query-results__builder-message-text"]');
    protected securityError = this.container.find('.ca-query-run-security-error, [class*="run-security-error"]');
    protected errorHeader = this.securityError.find('.ca-query-run-security-error__error-header, [class*="run-security-error__error-header"]');
    protected errorBody = this.securityError.find('.ca-query-run-security-error__error-body, [class*="run-security-error__error-body"]');
    protected errorContactAdmin = this.securityError.find('.ca-query-run-security-error__contact-admin, [class*="run-security-error__contact-admin"]');

    // Getters
    get kendoTreeview() {
        return this.createGetter(Treeview, 'kendo');
    }

    get kendoPopup() {
        return this.createGetter(KendoPopup);
    }

    get queryResultsGrid() {
        return this.createGetter(QueryResultsGrid, false, 1);
    }

    get criteriaBuilder() {
        return this.createGetter(CriteriaBuilder);
    }

    // Methods
    public async searchQuery(entry: string) {
        await this.type('searchBoxInput', entry);
        await this.click('searchButton');
    }

    public async clearSearch() {
        await this.click('clearSearchButton');
    }

    public async hideTree() {
        const count = await this.chevronLeft.count;
        if (count) {
            await this.click('chevronLeft');
        }
    }

    public async openTree() {
        const count = await this.chevronRight.count;
        if (count) {
            await this.click('chevronRight');
        }
    }

    public async getMenuTotalCount(options: Options = {}): Promise<string | number> {
        const text = await this.getText('total');
        if (options.isNumber) {
            return parseInt(text.match(/\d+/)[0]);
        }
        return text;
    }

    public async buildComplexQueries() {
        return this.click('resultsHeaderItems', 'Build complex queries');
    }

    public async clickAddAs() {
        await this.click('buttons', 'Add as');
    }

    public async addAsRelationship(relationship: string = 'Other') {
        CustomLogger.logger.log('method', `Add selected record(s) as related with ${relationship} relationship`);
        await this.clickAddAs();
        await this.kendoPopup.selectItem(relationship);
        await app.ui.waitLoading();
    }

}
