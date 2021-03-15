import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import Treeview from '../elements/treeview';
import QueryResultsGrid from '../controls/queryResultsGrid';
import { CustomLogger } from '../../support/utils/log';
import CriteriaBuilder from '../controls/criteriaBuilder';
import {Options} from '../../interfaces';

export default class QueryBoard extends BaseObject {
    public name = 'QueryBoard';
    protected container = Selector('.app__content', { visibilityCheck: true });

    // Elements
    protected menu = this.container.find('query-results-menu');
    protected menuItems = this.container.find('.ca-menu-list__list-item');
    protected total = this.menu.find('h4');
    protected searchBox = this.container.find('.ca-query-list__search');
    protected searchBoxInput = this.searchBox.find('input');
    protected searchButton = this.searchBox.find('.ca-search__search-button');
    protected clearSearchButton = this.searchBox.find('.ca-search__clear-button');
    protected splitter = this.container.find('.ca-splitter__gutter--clickable');
    protected chevronLeft = this.splitter.find('.fa-chevron-left');
    protected chevronRight = this.splitter.find('.fa-chevron-right');
    protected boardName = this.container.find('[class*="__query-results"]');
    protected queryName = this.container.find('[class*="__query-name"]');
    protected resultsHeaderItems = this.container.find('[class*="__query-header"] span');
    protected createNewQueryButton = this.container.find('.ca-query-list__create-button');
    protected openInBrowserButton = this.menu.find('query-results-open-in-browser button');
    protected unauthorized = this.container.find('.unauthorized__message');
    protected securityError = this.container.find('.ca-query-run-security-error, [class*="run-security-error"]');
    protected errorHeader = this.securityError.find('.ca-query-run-security-error__error-header, [class*="run-security-error__error-header"]');
    protected errorBody = this.securityError.find('.ca-query-run-security-error__error-body, [class*="run-security-error__error-body"]');
    protected errorContactAdmin = this.securityError.find('.ca-query-run-security-error__contact-admin, [class*="run-security-error__contact-admin"]');
    protected complexQueriesLink = this.container.find('.ca-query-results__builder-message, [class*="results__builder-message"]');
    protected questionCircle = this.container.find('.fa-question-circle');
    protected emptyPlaceholder = this.container.find('.ca-query-results-placeholder, [class*="results-placeholder"]');
    protected queriesNotFoundText = this.container.find('.ca-query-list__queries-not-found');
    protected viewInDropdown = this.menu.find('#viewRecordInDropdown');
    protected queryList = this.container.find('.ca-query-list');

    // Getters
    get kendoTreeview() {
        return this.createGetter(Treeview, 'kendo');
    }

    get queryResultsGrid() {
        return this.createGetter(QueryResultsGrid);
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

    public async createNewQuery() {
        await this.click('createNewQueryButton');
    }

    public getCurrentQueryName() {
        return this.getText('queryName');
    }
}
