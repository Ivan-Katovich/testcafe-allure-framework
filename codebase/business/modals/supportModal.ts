import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';

export default class SupportModal extends ModalWindow {
    public name = 'SupportModal';

    // Elements
    protected title = this.container.find('.support-modal__title');
    protected infoRows = this.container.find('.support-modal-row');
    protected contentGroups = this.container.find('.support-modal-content-group');

    // Methods
    private getInfoRow(nameOrNumber: string|number) {
        if (typeof nameOrNumber === 'number') {
            CustomLogger.logger.log('method', `Get row with number ${nameOrNumber}`);
            return this.infoRows.nth(nameOrNumber);
        } else {
            CustomLogger.logger.log('method', `Get row with name ${nameOrNumber}`);
            return this.infoRows.withText(nameOrNumber);
        }
    }

    public async getInfoRowLabel(rowNumber: number) {
        const row = this.getInfoRow(rowNumber);
        const label = (await row.find('.support-modal-row__label').textContent).trim();
        CustomLogger.logger.log('method', `The label of the row ${rowNumber} is ${label}`);
        return label;
    }

    public async getInfoRowValue(nameOrNumber: string|number) {
        const row = this.getInfoRow(nameOrNumber);
        const label = (await row.find('.support-modal-row__value').textContent).trim();
        CustomLogger.logger.log('method', `The label of the row ${nameOrNumber} is ${label}`);
        return label;
    }
}
