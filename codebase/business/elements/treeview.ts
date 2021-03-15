import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import timeService from '../../services/entries/timeService';
import { CustomLogger } from '../../support/utils/log';

export default class Treeview extends BaseObject {
    constructor(treeType: string = 'kendo') {
        treeType = treeType.toLowerCase();
        if (treeType !== 'kendo' && treeType !== 'node') {
            throw new Error(`Wrong type of tree - '${treeType}' should be 'kendo' or 'node'`);
        }
        super();
        this.treeType = treeType;
        this.name = `${treeType.charAt(0).toUpperCase() + treeType.slice(1)}Treeview`;
        const selector = treeType === 'kendo' ? 'kendo-treeview' : '.ca-new-tree-view';
        this.container = Selector(selector, { visibilityCheck: true });
        this.highlightedItems = this.container.find('.search-highlight');
        this.items = this.container.find(treeType === 'kendo' ? '.k-treeview-item' : '[class*="tree-node-level-"]');
        this.selectedItem = this.container.find(treeType === 'kendo' ? '.ca-tree-view__item--selected' : '[ng-reflect-model="true"]');
        this.itemNames = this.items
            .child(treeType === 'kendo' ? '.k-mid' : 'tree-node-wrapper')
            .find(treeType === 'kendo' ? '.k-in' : '.ca-new-tree-view__item');
    }

    protected treeType: string;

    // Elements
    protected highlightedItems: Selector;
    protected items: Selector;
    protected itemNames: Selector;
    protected selectedItem: Selector;

    // Methods
    private async findItem(path: string): Promise<Selector> { // path should be written in format name>subname>...
        let pathArray = path.split('>');
        const getTargetSelector = async (el: Selector, pathArr: string[], level: number) => {
            let nextElement: Selector;
            let item = pathArr.shift();
            if (this.treeType === 'kendo') {
                nextElement = el.find(`.k-treeview-item[aria-level='${level}']`)
                    .child('.k-mid')
                    .find('.k-in');
                if (item.match(/^[Ii][Dd]: ?(.+)$/)) {
                    nextElement = nextElement.withText(item.replace(/^[Ii][Dd]: ?(.+)$/, '$1'))
                        .parent(`.k-treeview-item[aria-level='${level}']`);
                } else {
                    nextElement = nextElement.withExactText(item)
                        .parent(`.k-treeview-item[aria-level='${level}']`);
                }
            } else {
                nextElement = el.find(`.tree-node.tree-node-level-${level}`)
                    .child('tree-node-wrapper')
                    .find('.ca-new-tree-view__item');
                if (item.match(/^[Ii][Dd]: ?(.+)$/)) {
                    nextElement = nextElement.withText(item.replace(/^[Ii][Dd]: ?(.+)$/, '$1'))
                        .parent(`.tree-node.tree-node-level-${level}`);
                } else {
                    nextElement = nextElement.withExactText(item)
                        .parent(`.tree-node.tree-node-level-${level}`);
                }
            }
            if (pathArr.length) {
                const toggle = this.treeType === 'kendo' ? '.k-icon' : '.toggle-children-wrapper';
                const expander = this.treeType === 'kendo' ? '.k-i-expand' : '.toggle-children-wrapper-collapsed';
                const isAvailable = await timeService.wait(async () => {
                    const count = await nextElement.find(toggle).count;
                    return count > 0;
                }, {timeout: 2000, interval: 200});
                if (!isAvailable) {
                    throw new Error(`There is no toggle with selector '${toggle}' for not last element in path '${path}'`);
                }
                const count = await nextElement.find(expander).count;
                if (count) {
                    await t.click(nextElement.find(expander));
                }
                return getTargetSelector(nextElement, pathArr, level + 1);
            } else {
                return nextElement;
            }
        };
        return getTargetSelector(this.container, pathArray, 1);
    }

    public async expand(path: string) {
        const target = await this.findItem(path);
        const expanderSelector = this.treeType === 'kendo' ? '.k-i-expand .k-mid' : '.toggle-children-wrapper-collapsed';
        const expander = target.find(expanderSelector);
        const count = await expander.count;
        if (count) {
            CustomLogger.logger.log('method', `Expand ${this.treeType}Treeview item with path '${path}'`);
            await this.click(expander);
        } else {
            CustomLogger.logger.log('WARN', `${this.treeType}Treeview item with path '${path}' can not be expanded`);
        }
    }

    public async expandAll() {
        const selector = this.treeType === 'kendo' ? `.k-treeview-item[ng-reflect-expandable='true'][ng-reflect-is-expanded='false']` : '.toggle-children-wrapper-collapsed';
        let expanders = this.container.find(selector);
        while (await expanders.count > 0) {
            for (let index = 0; index < await expanders.count; index++) {
                await this.click(expanders.nth(index));
            }
        }
    }

    public async open(path: string) {
        const target = await this.findItem(path);
        CustomLogger.logger.log('method', `Open ${this.treeType}Treeview item with path '${path}'`);
        await t.click(target);
    }

    public async select(path: string) {
        const target = await this.findItem(path);
        CustomLogger.logger.log('method', `Select ${this.treeType}Treeview item with path '${path}'`);
        await t.click(target.child('.k-mid').find('ca-radiobutton'));
    }

    public async modify(path: string) {
        const target = await this.findItem(path);
        CustomLogger.logger.log('method', `Modify ${this.treeType}Treeview item with path '${path}'`);
        await t.hover(target);
        await t.click(target.find('.fa-pencil'));
    }

    public async check(path: string) {
        const target = await this.findItem(path);
        CustomLogger.logger.log('method', `Check ${this.treeType}Treeview item with path '${path}'`);
        await t.click(target.child('tree-node-wrapper').find('.ca-checkbox__label'));
    }

    public async clickCheckbox(path: string): Promise<void> {
        const target = await this.findItem(path);
        CustomLogger.logger.log('method', `Check '${path}' by clicking checkbox`);
        await t.click(target.child('tree-node-wrapper').find('ca-checkbox'));
    }

    public async clickCheckboxLabel(path: string): Promise<void> {
        const target = await this.findItem(path);
        CustomLogger.logger.log('method', `Check '${path}' by clicking checkbox label`);
        await t.click(target.child('tree-node-wrapper').find('ca-checkbox').nextSibling('span'));
    }

    public async isItemVisible(path: string): Promise<boolean> {
        let is: boolean;
        try {
            const target = await this.findItem(path);
            is = await target.visible;
        } catch (err) {
            is = false;
        }
        CustomLogger.logger.log('method', `Item in ${this.treeType}Treeview with path '${path}' is ${is ? 'visible' : 'not visible'}`);
        return is;
    }

    public async isItemPresent(path: string): Promise<boolean> {
        let is: boolean;
        const parentPath = path.replace(/(.+)>([^>]+)/, '$1');
        const item = path.replace(/(.+)>([^>]+)/, '$2');
        let itemsToCompare: string[];
        if (parentPath === item) {
            itemsToCompare = await this.getItemNamesByLevel(1);
        } else {
            itemsToCompare = await this.getSubItems(parentPath);
        }
        is = itemsToCompare.includes(item);
        CustomLogger.logger.log('method', `Item in ${this.treeType}Treeview with path '${path}' is ${is ? 'present' : 'not present'}`);
        return is;
    }

    public getSelectedItemName() {
        return this.getText('selectedItem'); // not for node treeview
    }

    public async getAllSelectedItemsNames(itemType: string = 'selectedItem') {
        let textArray = [];
        const count = await this.getCount(itemType);
        for (let i = 0; i < count; i++) {
            let text = await this.items.find('[ng-reflect-model="true"] + [class*="node-display-text"]').nth(i).innerText;
            textArray.push(text);
            }
        CustomLogger.logger.log('method', textArray.length > 0 ? `${textArray.join(', ')} are selected in ${this.treeType}Treeview` : `No selected items in ${this.treeType}Treeview`);
        return textArray;
    }

    public async isItemPrivate(path: string): Promise<boolean> {
        let is: boolean;
        try {
            const target = await this.findItem(path);
            is = await this.isPresent(target.child('.k-mid').find('.ca-query-list__private-query-icon'));
        } catch (err) {
            is = false;
        }
        CustomLogger.logger.log('method', `Item in ${this.treeType}Treeview with path '${path}' is ${is ? 'private' : 'not private'}`);
        return is;
    }

    public async isItemEnabled(path: string): Promise<boolean> {
        let is: boolean;
        const target = await this.findItem(path);
        const element = target.find('.ca-tree-view__item');
        is = !(await element.hasAttribute('disabled') || (await element.getAttribute('class')).includes('inactive'));
        CustomLogger.logger.log('method', `Item in ${this.treeType}Treeview with path '${path}' is ${is ? 'enabled' : 'disabled'}`);
        return is;
    }

    public async isItemChecked(path: string): Promise<boolean> {
        const target = await this.findItem(path);
        const element = target.find('ca-checkbox');
        const is = Boolean(await element.getAttribute('ng-reflect-model'));
        CustomLogger.logger.log('method', `Item in ${this.treeType}Treeview with path '${path}' is ${is ? 'checked' : 'unchecked'}`);
        return is;
    }

    public async getItemsNumberByLevel(level: number) {
        const count = await this.container.find(`.k-treeview-item[aria-level='${level}']`).count;
        CustomLogger.logger.log('method', `The number of ${level} level items is ${count}`);
        return count;
    }

    public async getSelectableItemsNumber() {
        const count = await this.container.find(`.k-treeview-item[ng-reflect-expandable='false']`).count;
        CustomLogger.logger.log('method', `The number of items is ${count}`);
        return count;
    }

    public async getSelectableItemsNames() {
        const array: string[] = [];
        const items = this.container.find(`.k-treeview-item[ng-reflect-expandable='false']`);
        const count = await items.count;
        for (let index = 0; index < count; index++) {
            array.push(await items.nth(index).innerText);
        }
        return array;
    }

    public async getExpandableItemsNames() {
        const array: string[] = [];
        const elements = this.container.find(`.toggle-children-wrapper`).parent().nextSibling('.node-content-wrapper');
        const count = await elements.count;
        for (let index = 0; index < count; index++) {
            array.push(await elements.nth(index).innerText);
        }
        return array;
    }

    public async getItemNamesByLevel(level: number) {
        let textArray = [];
        const selector = this.treeType === 'kendo' ? `.k-treeview-item[aria-level='${level}']>.k-mid` : `.tree-node-level-${level}>tree-node-wrapper tree-node-content`;
        let controls = this.container.find(selector);
        let count = await controls.count;
        for (let i = 0; i < count; i++) {
            textArray.push((await controls.nth(i).textContent).trim());
        }
        return textArray;
    }

    public async hoverItem(path: string) {
        const target = await this.findItem(path);
        await t.hover(target);
    }

    public async selectHighlightedItem(position: number = 0) {
        await t.click(this.highlightedItems.nth(position));
        CustomLogger.logger.log('method', `User selected highlighted item with position ${position}`);
    }

    public async getNShownValues(n: number) {
        const items = [];
        const count = await this.itemNames.count;
        n = n <= count ? n : count;
        for (let i = 0; i < n;) {
            items.push(await this.getText(this.itemNames.nth(i++)));
        }
        CustomLogger.logger.log('method', `First ${n} shown items in the tree are ${items}`);
        return items;
    }

    public async getSubItems(path: string): Promise<string[]> {
        const target = await this.findItem(path);
        const selector = this.treeType === 'kendo' ? '.k-treeview-item>.k-mid' : '.tree-children tree-node-content';
        const subItems = target.find(selector);
        const count = await this.getCount(subItems);
        let textArray = [];
        for (let i = 0; i < count; i++) {
            textArray.push((await subItems.nth(i).textContent).trim());
        }
        return textArray;
    }

    public async eachItemHasCheckbox(): Promise<boolean> {
        const count = await this.items.count;
        for (let index = 0; index < count; index++) {
            const checkbox = this.items.nth(index).find('ca-checkbox');
            if (await checkbox.count === 0) {
                return false;
            }
        }
        return true;
    }

    public async getAllElementsPaths(): Promise<string[]> {
        const array: string[] = [];
        const firstLevelItems = await this.getItemNamesByLevel(1);
        for (const item of firstLevelItems) {
            const descendants = await this.getAllChildrenPaths(item);
            array.push(...descendants);
        }
        return array;
    }

    public async getAllChildrenPaths(item: string): Promise<string[]> {
        const array: string[] = [];
        const children = await this.getChildrenItems(item);
        if (children.length > 0) {
            for (const child of children) {
                const parentPath = item + '>' + child;
                const items = await this.getAllChildrenPaths(parentPath);
                items.forEach((x) => array.push(x));
            }
        } else {
            array.push(item);
        }

        return array;
    }

    public async getChildrenItems(path: string): Promise<string[]> {
        const level = path.split('>').length + 1;
        const target = await this.findItem(path);
        const selector = this.treeType === 'kendo' ? `.k-treeview-item[aria-level='${level}']>.k-mid` : `.tree-node-level-${level}>tree-node-wrapper tree-node-content`;
        const subItems = target.find(selector);
        const count = await this.getCount(subItems);
        let textArray = [];
        for (let i = 0; i < count; i++) {
            textArray.push((await subItems.nth(i).textContent).trim());
        }
        return textArray;
    }
}
