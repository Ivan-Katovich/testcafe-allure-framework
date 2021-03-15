import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';

export default class AuditHistoryModal extends ModalWindow {
    public name = 'AuditHistoryModal';
    protected container = Selector('.ca-audit-history-dialog__modal-body', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.ca-audit-history-dialog__title');
    protected grid = this.container.find('kendo-grid');
    protected mainButton = this.container.find('.dp-button--primary--modal');
    protected cross = this.container.find('#closeButton');

    // Methods
    public async create() {
        await this.click('headerButtons', 'Create');
    }
}
