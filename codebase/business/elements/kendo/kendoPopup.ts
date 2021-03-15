import { Selector, t } from 'testcafe';
import BaseObject from '../../baseObject';
import { CustomLogger } from '../../../support/utils/log';
import timeService from '../../../services/entries/timeService';
import InputFilter from './filters/inputFilter';
import CheckboxFilter from './filters/checkboxFilter';
import {Options} from '../../../interfaces';
import Input from '../../fields/input';
import Autocomplete from '../../fields/autocomplete';
import Datepicker from '../../fields/datepicker';
import Checkbox from '../../fields/checkbox';
import Dropdown from '../../fields/dropdown';
import Multiselect from '../../fields/multiselect';
import Numeric from '../../fields/numeric';

export default class KendoPopup extends BaseObject {
    constructor(position: number = 0) {
        super();
        this.container = Selector('kendo-popup', { visibilityCheck: true }).nth(position);
        this.name = position ? `KendoPopup${position}` : 'KendoPopup';
        this.simpleItems = this.container.find('.ca-flyout-menu__item,.k-item,[kendodropdownsselectable]');
        this.checkboxItems = this.container.find('[class*="field-popup__option"]');
        this.simpleIcons = this.simpleItems.find('.ca-flyout-menu__label>i.fa');
        this.simpleItemNames = this.simpleItems.find('.ca-flyout-menu__label>span');
        this.navigationItems = this.container.find('.pop-navigation-list__item a');
        this.dates = this.container.find('kendo-virtualization tr td');
        this.userName = this.container.find('.popup-content__username-text');
        this.signOutLink = this.container.find('.popup-content__link');
        this.contentLinks = this.container.find('.popup-content__link');
        this.webLinks = this.container.find('.external-web-links-popup-menu-item');
        this.appLinks = this.container.find('.app-switcher-popup-menu-item');
        this.tooltip = this.container.find('.k-tooltip');
        this.busyIndicator = this.container.find('.busy-indicator');
        this.noDataInfo = this.container.find('.k-nodata');
        this.applyFilterButton = this.container.find('.apply-filter-button button');
        this.filterMethodDropdown = this.container.find('ca-filter-method-select');
        this.filterCriteriaInput = this.container.find('.ca-single-text-filter__text-value');
        this.showMoreLink = this.container.find('.show-more');
        this.checkboxes = this.container.find('ca-checkbox');
        this.fields = this.container.find('.ca-date-functions-popup__line, [class*="field-popup__option"]');
        this.buttons = this.container.find('.dp-button--mini-tertiary');
    }

    // Elements
    protected simpleItems: Selector;
    protected chackboxItems: Selector;
    protected simpleIcons: Selector;
    protected simpleItemNames: Selector;
    protected navigationItems: Selector;
    protected dates: Selector;
    protected userName: Selector;
    protected signOutLink: Selector;
    protected contentLinks: Selector;
    protected webLinks: Selector;
    protected appLinks: Selector;
    protected tooltip: Selector;
    protected busyIndicator: Selector;
    protected noDataInfo: Selector;
    protected checkboxItems: Selector;
    protected applyFilterButton: Selector;
    protected filterMethodDropdown: Selector;
    protected filterCriteriaInput: Selector;
    protected showMoreLink: Selector;
    protected checkboxes: Selector;
    protected fields: Selector;
    protected buttons: Selector;

    // Getters
    get child() {
        return new KendoPopup(1);
    }

    // Methods

    public getFilter(type: string) {
        const filters = {
            input: InputFilter,
            checkbox: CheckboxFilter
        };
        return new filters[type](this.container);
    }

    public getField(name: string, type: string = 'input', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${name}'`);
        const constructors = {
            input: Input,
            autocomplete: Autocomplete,
            datepicker: Datepicker,
            checkbox: Checkbox,
            dropdown: Dropdown,
            multiselect: Multiselect,
            numeric: Numeric
        };
        return new constructors[type](this.fields, name, options);
    }

    public async selectItem(nameOrNumber: string | number, options?: Options) {
        CustomLogger.logger.log('method', `Select '${nameOrNumber}'`);
        if (typeof nameOrNumber === 'string') {
            await this.click('simpleItems', nameOrNumber, options);
        } else {
            await this.click(this.simpleItems.nth(nameOrNumber));
        }
    }

    public async getItemIconClass(name: string) {
        const item = this.simpleItems.withText(name).find('.ca-flyout-menu__label>i.fa');
        const cls = await this.getAttribute(item, 'class');
        CustomLogger.logger.log('method', `Icon class of the '${name}' item is '${cls}'`);
        return cls;
    }

    public async selectTop(options: Options = {wait: true, waitSpinner: 500}) {
        if (options.wait) {
            await this.waitLoading(options);
        }
        CustomLogger.logger.log('method', `Select top option`);
        await t.click(this.simpleItems.nth(0));
    }

    public async selectWebLink(name: string) {
        CustomLogger.logger.log('method', `Select web link '${name}'`);
        await this.click('webLinks', name);
    }

    public async waitLoading(options: Options = {}) {
        await timeService.wait(async () => {
            return (await this.busyIndicator.count) > 0;
        }, {timeout: options.waitSpinner ? options.waitSpinner : 1000, interval: options.interval ? options.interval : 100});
        const isDisappeared = await timeService.wait(async () => {
            return (await this.busyIndicator.count) === 0;
        }, options);
        if (!isDisappeared) {
            throw new Error(`Busy Indicator is still appeared after timeout`);
        }
        CustomLogger.logger.log('method', `Popup is loaded`);
    }

    public async selectApp(name: string) {
        CustomLogger.logger.log('method', `Select web link '${name}'`);
        await this.click('appLinks', name);
    }

    public async selectContentLink(name: string) {
        CustomLogger.logger.log('method', `Select content link '${name}'`);
        await this.click('contentLinks', name);
    }

    public async selectDate(date: string) {
        CustomLogger.logger.log('method', `Select date '${date.toString()}'`);
        const dateElement = this.dates.withAttribute('title', date);
        await t.hover(dateElement)
            .click(dateElement);
    }

    public async selectToday() {
        CustomLogger.logger.log('method', `Select date 'today'`);
        await t.click(this.dates.withAttribute('class', /k-today/));
    }

    public async selectNavigationItem(name: string) {
        CustomLogger.logger.log('method', `Navigate to '${name}'`);
        await this.click('navigationItems', name);
    }

    public async getAllItemsText(itemType: string = 'simpleItems') {
        const textArray = [];
        const count = await this.getCount(itemType);
        for (let i = 0; i < count; i++) {
            const text = await this.getText(itemType, i);
            textArray.push(text);
        }
        return textArray;
    }

    public async verifyTextHighlightedInList(text: string) {
        for (let i = 0; i < await this.simpleItems.count; i++) {
            const hightlightedText = this.simpleItems.nth(i).find('.search-highlight');
            for (let j = 0; j < await hightlightedText.count; j++) {
                if (await hightlightedText.nth(j).innerText !== text) {
                    return false;
                }
            }
        }

        return true;
    }

    public async showMore() {
        await this.click('showMoreLink');
    }

    public async isItemWithArrow(nameOrNumber: string | number, itemType: string = 'simpleItems') {
        let target: Selector;
        if (typeof nameOrNumber === 'string') {
            target = this[itemType].withText(nameOrNumber);
        } else {
            target = this[itemType].nth(nameOrNumber);
        }
        const count = await target.find('.fa-angle-right').count;
        CustomLogger.logger.log('method', `The item '${nameOrNumber}' ${count > 0 ? 'has' : 'doesn\'t have'} an arrow`);
        return count > 0;
    }

    public async isItemWithIcon(nameOrNumber: string | number, itemType: string = 'simpleItems') {
        let target: Selector;
        if (typeof nameOrNumber === 'string') {
            target = this[itemType].withText(nameOrNumber);
        } else {
            target = this[itemType].nth(nameOrNumber);
        }
        const count = await target.find('.ca-flyout-menu__label>i.fa').count;
        CustomLogger.logger.log('method', `The item '${nameOrNumber}' ${count > 0 ? 'has' : 'doesn\'t have'} an icon`);
        return count > 0;
    }

    public async getItemWidth(nameOrNumber: string | number, itemType: string = 'simpleItems') {
        let target: Selector;
        if (typeof nameOrNumber === 'string') {
            target = this[itemType].withText(nameOrNumber).find('.ca-flyout-menu__label');
        } else {
            target = this[itemType].nth(nameOrNumber).find('.ca-flyout-menu__label');
        }
        return await this.getElementWidth(target);
    }

}
