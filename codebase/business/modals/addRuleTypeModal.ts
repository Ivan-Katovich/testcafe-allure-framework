import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';

export default class AddRuleTypeModal extends ModalWindow {
    public name = 'AddRuleTypeModal';
    protected container = Selector('.ca-modal__window--medium', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.ca-add-rules-type__header');
    protected mainButton = this.container.find('.ca-button--mini-primary');
    protected cross = this.container.find('#closeButton');
    protected fields = this.container.find('.ca-add-rules-type__input-field');
    protected infoMessage = this.container.find('.ca-add-rules-type__info-message');

    // Methods
    public async getRuleTypeId() {
        const text = await this.getText('infoMessage');
        const id = text.match(/\d+/)[0];
        CustomLogger.logger.log('method', `A new Rule Type ID is: ${id}`);
        return id;
    }

    public async save() {
        await this.click('mainButton');
    }

}
