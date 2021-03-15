import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import { CustomLogger  } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Checkbox extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'checkbox';
        this.inputLabel = this.container.find('.ca-checkbox__label');
        this.box = this.container.find('div.ng-star-inserted');
        this.textOnTheTop = this.inputLabel.parent().prevSibling();
    }

    // Elements
    protected textOnTheTop: Selector;
    protected inputLabel: Selector;
    protected box: Selector;

    // Methods
    public async fill(value: string) {
        value = value.toLowerCase();
        if (value === 'check') {
            await this.check();
        } else if (value === 'uncheck') {
            await this.uncheck();
        } else {
            throw new Error(`Wrong value '${value}' for checkbox field`);
        }
    }

    public async check() {
        CustomLogger.logger.log('method', `Check '${this.name}' checkbox`);
        if (!(await this.input.checked)) {
            if (await this.inputLabel.visible) {
                await this.click('inputLabel');
            } else if ((await this.box.count) > 0 && (await this.box.visible)) {
                await this.click('box', null, {offsetX: 8, offsetY: 8});
            } else {
                await this.click('input');
            }
        }
    }

    public async uncheck() {
        CustomLogger.logger.log('method', `Uncheck '${this.name}' checkbox`);
        if (await this.input.checked) {
            if (await this.inputLabel.visible) {
                await this.click('inputLabel');
            } else if ((await this.box.count) > 0 && (await this.box.visible)) {
                await this.click('box', null, {offsetX: 8, offsetY: 8});
            } else {
                await this.click('input');
            }
        }
    }

    public async clear() {
        await this.uncheck();
    }

    public async isChecked() {
        const is = await this.input.checked;
        CustomLogger.logger.log('method', `'${this.name}' checkbox is ${is ? 'checked' : 'not checked'}`);
        return is;
    }

    public async getValue() {
        const isCheckedState = await this.isChecked();
        return isCheckedState ? 'check' : 'uncheck';
    }

    public async verifyValue(expectedValue) {
        const isCheckedState = await this.isChecked();
        const value = isCheckedState ? 'check' : 'uncheck';
        return value === expectedValue;
    }
}
