import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';

export default class ErrorModal extends ModalWindow {
    public name = 'ErrorModal';
    protected container = Selector('ca-modal-error,ca-modal-alert').find('.ca-modal__window');

    // Elements
    protected title = this.container.find('.ca-modal-message__header--title,.ca-modal-alert__title');
    protected infoList = this.container.find('.ca-modal-message__content--text-item');
    protected infoListItem = this.container.find('.ng-star-inserted');
    protected cross = this.container.find('.fa-times');
    protected mainButton = this.container.find('.ca-button--mini-primary');
    protected errorMessage = this.container.find('.ca-modal-error__message,.ca-modal-alert__message');
    protected errorMessageList = this.container.find('.ca-modal-alert__text-list__bulleted-lists');

    // Methods
}
