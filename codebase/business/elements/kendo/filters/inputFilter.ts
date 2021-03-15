import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../../../support/utils/log';
import KendoPopup from '../kendoPopup';
import BaseFilter from './baseFilter';
import Input from '../../../fields/input';
import Autocomplete from '../../../fields/autocomplete';
import Datepicker from '../../../fields/datepicker';
import Dropdown from '../../../fields/dropdown';
import Numeric from '../../../fields/numeric';

export default class InputFilter extends BaseFilter {
    constructor(container) {
        super(container);
        this.name = 'InputFilter';
        this.methodDropdown = this.container.find('ca-filter-method-select');
        this.criteriaInput = this.container.find('input');
        this.criteriaField = this.methodDropdown.nextSibling();
        this.numericField = this.container.find('kendo-numerictextbox');
        this.textField = this.container.find('.ca-single-text-filter__text-value');
        this.dateField = this.container.find('ca-datepicker');
    }

    // Elements
    protected methodDropdown: Selector;
    protected criteriaInput: Selector;
    protected criteriaField: Selector;
    protected numericField: Selector;
    protected textField: Selector;
    protected dateField: Selector;

    // Getters
    get child() {
        return new KendoPopup(1);
    }

    // Methods

    public async openMethodDropdown(): Promise<void> {
        await this.click('methodDropdown');
    }

    public async selectMethod(filterMethod: string) {
        if (!await this.child.isPresent()) {
            await this.click('methodDropdown');
        }
        await this.child.selectItem(filterMethod);
    }

    public async addCriteria(filterCriteria: string) {
        await this.type('criteriaInput', filterCriteria);
    }

    public async apply(method: string, criteria?: string) {
        await this.selectMethod(method);
        if (criteria) {
            await this.addCriteria(criteria);
        }
        await this.confirm();
        CustomLogger.logger.log('method', `Filter with method = ${method} and criteria = ${criteria} is applied for the column`);
    }

    public async getDefaultValue() {
        const value = this.criteriaInput.value;
        CustomLogger.logger.log('method', `Filter's input contains default value: ${value}`);
    }

    public async getMethodValue(): Promise<string> {
        const value = await this.methodDropdown.innerText;
        CustomLogger.logger.log('method', `Filter Method value is ${value}`);
        return value;
    }

    public async getCriteriaValue(): Promise<string> {
        const value = this.criteriaInput.value;
        CustomLogger.logger.log('method', `Filter Critera value is ${value}`);
        return value;
    }

    public getCriteriaField(type: string = 'input') {
        const constructors = {
            input: Input,
            autocomplete: Autocomplete,
            datepicker: Datepicker,
            dropdown: Dropdown,
            numeric: Numeric
        };
        return new constructors[type](this.criteriaField);
    }

    public async getInputType(): Promise<string> {
        let type: string;
        if (await this.textField.count) { type = 'text'; }
        if (await this.numericField.count) { type = 'numeric'; }
        if (await this.dateField.count) { type = 'date'; }
        if (type) {
            CustomLogger.logger.log('method', `Filter contains ${type} Input`);
            return type;
        } else {
            CustomLogger.logger.log('WARN', `Filter doesn't contain any type of Inputs`);
            return null;
        }
    }
}
