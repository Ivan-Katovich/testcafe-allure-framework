import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';
import Input from '../fields/input';
import Autocomplete from '../fields/autocomplete';
import Datepicker from '../fields/datepicker';
import Checkbox from '../fields/checkbox';
import CriteriaBuilder from '../controls/criteriaBuilder';
import Multiselect from '../fields/multiselect';
import Dropdown from '../fields/dropdown';
import QueryResultsGrid from '../controls/queryResultsGrid';
import {Options} from '../../interfaces';

export default class QueryManagementModal extends ModalWindow {
    public name = 'QueryManagementModal';

    // Elements
    protected steps = this.container.find('.query-management-navigator__step');
    protected fieldLabels = this.container.find('label, .query-sort-results__label');
    protected cross = this.container.find('#closeButton');
    protected sortableItems = this.container.find('.sortable-item');
    protected buttons = this.container.find('.query-management__actions button');
    protected modalToast = this.container.find('.modal-toast__container');
    protected showQueryResultsLink = this.container.find('.ca-preview-results__message');
    protected syntaxValidationMessage = this.container.find('.query-build-criteria__invalid-syntax-validation-message');
    protected invalidStep = this.container.find('.query-management-navigator__button--invalid');

    // Getters
    get criteriaBuilder() {
        return this.createGetter(CriteriaBuilder);
    }

    get queryResultsGrid() {
        return this.createGetter(QueryResultsGrid, true);
    }

    // Methods
    public getField(name: string, type: string = 'input', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${name}'`);
        const target = this.fieldLabels.withText(name).nextSibling();
        const constructors = {
            input: Input,
            autocomplete: Autocomplete,
            datepicker: Datepicker,
            checkbox: Checkbox,
            multiselect: Multiselect,
            dropdown: Dropdown
        };
        return new constructors[type](target, null, options);
    }

    public async getQueryDefinitionValue(name: string): Promise<string> {
        const row = this.container.find('.query-preview__subtitle, .query-preview__description').withText(name);
        return await row.nextSibling('.query-preview__fields-container').innerText;
    }

    public async selectStep(nameOrNumber) {
        nameOrNumber = nameOrNumber.toString();
        await this.click('steps', nameOrNumber);
    }

    public async getSortFields(): Promise<string[]> {
        const textArray = [];
        const count = await this.getCount(this.sortableItems);
        for (let i = 0; i < count; i++) {
            const text = await this.getText(this.sortableItems, i);
            textArray.push(text);
        }
        return textArray;
    }

    public async sortFields(fielsName: string, positionsNumber: number, direction: string) {
        let yOffset = direction === 'down' ? positionsNumber * 30.6 : positionsNumber * -30.6;
        yOffset = Math.round(yOffset);
        CustomLogger.logger.log('method', `Move ${fielsName} on ${positionsNumber} positions ${direction}`);
        await t.drag(this.sortableItems.withText(fielsName), 0, yOffset);
    }

    public async save() {
        await this.click('buttons', 'Save');
    }

    public async close() {
        await this.click('buttons', 'Close');
    }

    public async getNotificationMessage() {
        const message = (await this.modalToast.textContent).trim();
        CustomLogger.logger.log('method', `Notification message is '${message}'`);
        return message;
    }

    public async delete() {
        await this.click('buttons', 'Delete');
    }
}
