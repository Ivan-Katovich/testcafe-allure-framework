import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import KendoPopup from '../elements/kendo/kendoPopup';
import timeService from '../../services/entries/timeService';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Datepicker extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'datepicker';
        this.calendarButton = this.container.find('.ca-datepicker__calendar-button,.ca-date-value-wrapper__calendar-button');
        this.slidersButton = this.container.find('.ca-date-functions__sliders-button,.ca-date-value-wrapper__sliders-button');
        this.calendar = this.container.find('kendo-calendar');
        this.dateFunctionsPopup = this.container.find('ca-date-functions-popup');
        this.field = this.container.find('ca-datepicker');
    }

    // Elements
    protected calendarButton: Selector;
    protected slidersButton: Selector;
    protected calendar: Selector;
    protected dateFunctionsPopup: Selector;
    protected field: Selector;

    // Methods
    public async fill(value: string, options?: Options) {
        if (value === 'today') {
            value = timeService.getDate();
        }
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${value}'`);
        await this.click('container');
        await this.type('input', value, options);
    }

    public async getValue(): Promise<any> {
        const value = await this.input.value;
        CustomLogger.logger.log('method', `The value in '${this.name}' ${this.fieldType} is '${value}'`);
        return value;
    }

    public async verifyValue(expectedValue): Promise<any> {
        if (expectedValue === 'today') {
            expectedValue = timeService.getDate();
        }
        const value = await this.input.value;
        CustomLogger.logger.log('method', `The the status of verification for value in '${this.name}' ${this.fieldType} is '${value === expectedValue}'`);
        return value === expectedValue;
    }

    public async expand() {
        CustomLogger.logger.log('method', `Expand '${this.name}' datepicker`);
        await this.click('container');
        return this.click('calendarButton');
    }

    public async selectDate(date: string) {
        return new KendoPopup().selectDate(date);
    }

    public async selectToday() {
        return new KendoPopup().selectToday();
    }

}
