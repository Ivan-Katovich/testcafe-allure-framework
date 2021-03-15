import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';
import { Options} from '../../interfaces';

export default class BaseField extends BaseObject {

    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super();
        this.name = name;
        if (name) {
            if (options && options.isTextExact) {
                this.container = rootSelector.withExactText(name);
            } else {
                this.container = rootSelector.withText(name);
            }
        } else {
            this.name = 'Unidentified';
            this.container = rootSelector;
        }

        this.required = this.container.find('.rendered-form__label--required');
        this.label = this.container.find('.rendered-form__label,.user-preferences__sections-fields-name,.ca-administration-control__label');
        this.input = this.container.find('input,textarea');
        this.span = this.container.find('span');
        this.readOnlyTrigger = this.container.find('.rendered-form__readonly-field, :disabled');
        this.labels = this.container.find('label');
    }

    protected fieldType: string;

    // Elements
    protected required: Selector;
    protected label: Selector;
    protected input: Selector;
    protected span: Selector;
    protected readOnlyTrigger: Selector;
    protected labels: Selector;

    // Methods
    public async fill(value: string, options?: Options) {
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${value}'`);
        await this.click('container');
        await this.type(this.input, value, options);
    }

    public async getValue(): Promise<any> {
        await t.click(this.container);
        const value = await this.input.value;
        CustomLogger.logger.log('method', `The value in '${this.name}' ${this.fieldType} is '${value}'`);
        return value;
    }

    public async verifyValue(expectedValue): Promise<any> {
        const value = await this.input.value;
        const status = value === expectedValue;
        CustomLogger.logger.log('method', `The status of verification for value in '${this.name}' ${this.fieldType} is '${status}'`);
        CustomLogger.logger.log('method', `The value in field '${value}' is '${status ? 'equal' : 'not equal'} to expected '${expectedValue}'`);
        return status;
    }

    public async getLockedValue() {
        let value = await this.container
            .find('label[for],.rendered-form__readonly-field,.child-record__ellipsis-cell,span[cashowtooltip]')
            .textContent;
        value = value.trim();
        CustomLogger.logger.log('method', `The locked value in '${this.name}' ${this.fieldType} is '${value}'`);
        return value;
    }

    public async isLocked() {
        const count = await this.getCount('input');
        CustomLogger.logger.log('method', `The '${this.name}' ${this.fieldType} is ${count === 0 ? 'locked' : 'not locked'}`);
        return count === 0;
    }

    public async isRequired() {
        const count = await this.getCount('required');
        CustomLogger.logger.log('method', `'${this.name}' ${this.fieldType} has required status is ${count > 0}`);
        return count > 0;
    }

    public async getLabel() {
        const label = (await this.getText('label')).trim();
        CustomLogger.logger.log('method', `Field label is ${label}`);
        return label;
    }

    public async isReadOnly() {
        return this.isVisible('readOnlyTrigger');
    }

    public async clear() {
        await t
            .selectText(this.input)
            .pressKey('delete');
        CustomLogger.logger.log('method', `'${this.name}' field value is deleted`);
    }

    public async typeText(value: string, options: Options) {
        await this.type('input', value, options);
    }

}
