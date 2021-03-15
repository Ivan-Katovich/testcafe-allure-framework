import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';

export default class NavigationBar extends BaseObject {
    public name = 'NavigationBar';
    protected container = Selector('ngx-navigation-bar', { visibilityCheck: true });

    // Elements
    protected brand = this.container.find('navbar__brand');
    protected links = this.container.find('.main-section__link,.collaboration-section__link');
    protected activeLink = this.container.find('.main-section__item--active, .collaboration-section__item--active');
}
