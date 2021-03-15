import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';

export default class DuplicationModal extends ModalWindow {
    public name = 'DuplicationModal';
    protected container = Selector('.duplicate-modal__modal-body', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.duplicate-modal__record-identifier');
    protected fields = this.container.find('.duplicate-form__cell,.duplicate-modal__row');
    protected buttons = this.container.find('.duplicate-modal__button');
    protected cross = Selector('.duplicate-modal #closeButton');

    // Methods
    public async create() {
        await this.click('buttons', 'Create');
    }
}
