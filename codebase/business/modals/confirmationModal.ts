import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';

export default class ConfirmationModal extends ModalWindow {
    public name = 'ConfirmationModal';
    protected container = Selector('ca-modal-confirmation').find('.ca-modal__window');

    // Elements
    protected title = this.container.find('.ca-modal__header__content');
    protected infoList = this.container.find('.ca-modal-information__text-list');
    protected infoItems = this.infoList.find('.ca-modal-information__text');
    protected cross = this.container.find('.ca-modal__header__close');
    protected mainButton = this.container.find('.ca-button--primary');
    protected confirmationMessage = this.container.find('.ca-modal-confirmation__message');
    protected buttons = this.container.find('button');

    // Methods
}
