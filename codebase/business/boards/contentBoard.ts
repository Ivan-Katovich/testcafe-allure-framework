import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import ChildRecord from '../controls/childRecord';
import { CustomLogger } from '../../support/utils/log';

export default class ContentBoard extends BaseObject {
    public name = 'ContentBoard';
    protected container = Selector('.data-entry-form__content', { visibilityCheck: true });

    // Elements
    protected childRecords = this.container.find('.def-child-records__item');
    protected infoCells = this.container.find('.filing-section__cell');
    protected tabButton = this.container.find('.ca-tab-button');

    // Getters
    get childRecord() {
        return this.createGetter(ChildRecord);
    }

    // Methods
    private getCell(cellName: string) {
        return this.infoCells.find('.rendered-form__label').withText(cellName).parent();
    }

    public async selectChildRecord(childRecordName: string) {
        await this.click('childRecords', childRecordName);
    }

    public async getValue(cellName: string) {
        const value = (await this.getCell(cellName).find('.rendered-form__readonly-field').textContent).trim();
        CustomLogger.logger.log('method', `The Value of ${cellName} field is ${value}`);
        return value;
    }

}
