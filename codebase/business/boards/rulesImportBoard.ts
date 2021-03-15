import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';
import Checkbox from '../fields/checkbox';
declare const globalConfig: any;

export default class RulesImportBoard extends BaseObject {
    public name = 'RulesImportBoard';
    protected container = Selector('.ip-rules-import', { visibilityCheck: true });

    // Elements
    protected header = this.container.find('.ip-rules-import__header');
    protected headerButtons = this.header.find('button');
    protected items = this.container.find('.ip-rules-import__item');
    protected itemNames = this.items.find('.ip-rules-import__item-name');
    protected fileInput = Selector('.k-upload-button input', { visibilityCheck: false });
    protected importButton = this.container.find('.ca-button--mini-primary');
    protected dropZone = this.container.find('.k-dropzone');
    protected selectButton = this.dropZone.find('.k-upload-button');

    // Methods
    public getItem(nameOrNumber) {
        return new RuleImportItem(this.items, nameOrNumber);
    }

    public async import(fileName) {
        await t.setFilesToUpload(this.fileInput, `${process.env.USERPROFILE}\\Downloads\\${fileName}`);
        CustomLogger.logger.log('method', `File ${fileName} is ready for import`);
        await this.click('importButton');
    }

    public async isItemExists(itemName: string) {
        const count = await this.itemNames.withText(itemName).count;
        CustomLogger.logger.log('method', `${itemName} rule import item is ${count > 0 ? 'present' : 'not present'} in the list`);
        return count > 0;
    }

    public async selectItemsByRegex(regex) {
        const count = await this.getCount('items');
        for (let i = 0; i < count; i++) {
            const item = this.getItem(i);
            const name = await item.getName();
            if (name.match(regex)) {
                await item.checkbox.check();
            }
        }
    }

    public async itemsWithRegexCount(regex) {
        let total = 0;
        const count = await this.getCount('items');
        for (let i = 0; i < count; i++) {
            const item = this.getItem(i);
            const name = await item.getName();
            if (name.match(regex)) {
                total ++;
            }
        }
        return total;
    }

    public async delete() {
        await this.click('headerButtons', 'Delete');
    }
}

class RuleImportItem extends BaseObject {
    constructor(root: Selector, nameOrNumber) {
        super();
        if (typeof nameOrNumber === 'string') {
            this.container = root.find('.ip-rules-import__item-name')
                .withText(nameOrNumber)
                .parent(0);
            this.name = nameOrNumber;
        } else {
            this.container = root.nth(nameOrNumber);
            this.number = nameOrNumber;
        }

        this.itemName = this.container.find('.ip-rules-import__item-name');
        this.status = this.container.find('.ip-rules-import__item-field').nth(2);
    }

    public number: number;

    // Elements
    protected itemName: Selector;
    protected status: Selector;

    // Getters
    get checkbox() {
        return new Checkbox(this.container.find('.ca-checkbox'));
    }

    public getName() {
        return this.getText('itemName');
    }
}
