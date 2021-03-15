import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';

export default class GlobalChangeModal extends ModalWindow {
    public name = 'GlobalChangeModal';
    protected container = Selector('.global-change-detail__modal-body', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.global-change-detail__header');
    protected info = this.container.find('.global-change-detail__record-info');
    protected grid = this.container.find('kendo-grid');
    protected mainButton = this.container.find('.dp-button--secondary--modal');
    protected cross = this.container.find('#closeButton');

    // Methods
    public async create() {
        await this.click('headerButtons', 'Create');
    }

    public async getInfo() {
        return (await this.info.textContent).trim();
    }
}
