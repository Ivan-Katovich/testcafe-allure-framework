import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Radiobutton extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'radiobutton';
        this.inputs = this.container.find('.ca-radiobutton__input');
        this.inputLabels = this.container.find('.ca-radiobutton__label');
    }

    // Elements
    protected inputs: Selector;
    protected inputLabels: Selector;

    // Methods
    public async fill(value: string) {
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${value}'`);
        await this.click('inputLabels', value);
    }

    public async check(value: string) {
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${value}'`);
        await this.click('inputLabels', value);
    }

    public async isSelected(inputLabelName: string) {
        const is = await this.inputLabels.withText(inputLabelName).sibling('input').checked;
        CustomLogger.logger.log('method', `'${this.name}' ${this.fieldType} '${inputLabelName}' is ${is ? 'checked' : 'not checked'}`);
        return is;
    }

    public async getPossibleValues(): Promise<string[]> {
        const array: string[] = [];
        for (let index = 0; index < await this.inputLabels.count; index++) {
            array.push(await this.inputLabels.nth(index).innerText);
        }

        return array;
    }

    public async getValue() {
        const possibleValues = await this.getPossibleValues();
        for (let label of possibleValues) {
            if (await this.isSelected(label)) {
                CustomLogger.logger.log('method', `The selected item in '${this.name}' ${this.fieldType} is '${label}'`);
                return label;
            }
        }
        return '';
    }
}
