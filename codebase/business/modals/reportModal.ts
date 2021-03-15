import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';
import Treeview from '../elements/treeview';

export default class ReportModal extends ModalWindow {
    public name = 'ReportModal';
    protected container = Selector('.report-modal__modal-body', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.report-modal__title');
    protected searchBox = this.container.find('.ca-reports__search');
    protected buttons = this.container.find('.report-modal__action-button');
    protected cross = Selector('#closeButton');

    // Getters
    get kendoTreeview() {
        return this.createGetter(Treeview, 'kendo');
    }
}
