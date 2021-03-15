import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';

export default class MainHeader extends BaseObject {
    public name = 'MainHeader';
    protected container = Selector('.header-bar', { visibilityCheck: true });

    // Elements
    protected mainLogo = this.container.find('.header-bar__main-logo');
    protected customLogo = this.container.find('.header-bar__custom-logo');
    protected helpIcon = this.container.find('ngx-help');
    protected userIcon = this.container.find('ngx-user-icon');
    protected globalSearch = this.container.find('ca-global-search-field');
    protected globalSearchInput = this.globalSearch.find('input');
    protected globalSearchButton = this.globalSearch.find('.ca-search__search-button');
    protected globalSearchOptionsButton = this.globalSearch.find('.global-search-field__options-button');
    protected externalWebLinks = this.container.find('external-web-links');
    protected appSwitcher = this.container.find('ca-app-switcher-icon');
    protected notificationIcon = this.container.find('ca-notification-icon');

    // Methods
    public async searchGlobally(term: string) {
        CustomLogger.logger.log('method', `Find ${term} through Global Search`);
        await t.typeText(this.globalSearch.find('input'), term, { replace: true });
        await t.click(this.globalSearch.find('.ca-search__search-button'));
    }

    public async setGlobalSearch(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set ${value} to Global Search field`);
        await t.typeText(this.globalSearchInput, value, { replace: true });
    }
}
