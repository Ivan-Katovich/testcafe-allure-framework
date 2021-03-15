import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import QueryResultsGrid from './queryResultsGrid';
import { CustomLogger } from '../../support/utils/log';
import Treeview from '../elements/treeview';
import Searchbox from '../fields/searchbox';

export default class SideBar extends BaseObject {
    public name = 'SideBar';
    protected container = Selector('.ca-sidebar__container', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.ca-administration__header');
    protected tabs = this.container.find('.ca-tab-button');
    protected cross = this.container.find('#closeButton');
    protected searchBox = this.container.find('.ca-search');

    // Getters
    get grid() {
        return this.createGetter(QueryResultsGrid, true, 1);
    }

    get designer() {
        return this.createGetter(TemplateDesigner);
    }

    get nodeTreeview() {
        return this.createGetter(Treeview, 'node');
    }

    // Methods
    public async selectTab(tabName) {
        await this.click('tabs', tabName);
    }

    public async close() {
        await this.click('cross');
    }

    public async search(entry: string) {
        await new Searchbox(this.searchBox).search(entry);
    }
}

class TemplateDesigner extends BaseObject {
    public name = 'TemplateDesigner';
    protected container = Selector('data-entry-template-design', { visibilityCheck: true });

    // Elements
    protected childItems = this.container.find('.child-list__item');

    // Methods
    public async closeChildItem(nameOrNumber) {
        if (typeof nameOrNumber === 'string') {
            await t.click(this.childItems.withText(nameOrNumber).find('.child-list__button'));
        } else {
            await t.click(this.childItems.nth(nameOrNumber).find('.child-list__button'));
        }
        CustomLogger.logger.log('method', `User closed '${nameOrNumber}' Child Item`);
    }
}
