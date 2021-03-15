import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';

export default class InfoModal extends ModalWindow {
    public name = 'InfoModal';

    // Elements
    protected title = this.container.find('.ca-modal__header__content');
    protected infoList = this.container.find('.ca-modal-information__text-list');
    protected infoItems = this.infoList.find('.ca-modal-information__text');
    protected cross = this.container.find('.ca-modal__header__close');
    protected mainButton = this.container.find('.ca-button--primary');
    protected confirmationMessage = this.container.find('.ca-modal-confirmation__message');

    // Methods
}
