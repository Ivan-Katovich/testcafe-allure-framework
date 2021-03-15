import { Selector, t } from 'testcafe';
import ModalWindow from './modalWindow';

export default class FormLetter extends ModalWindow {
    public name = 'FormLetter';
    protected container = Selector('.ca-form-letter-preview__modal-body', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.ca-form-letter-preview-detail__header');
    protected buttons = this.container.find('.collaboration-form-letter__footer button');
    protected cross = this.container.find('#closeButton');
    protected taskControls = this.container.find('.ca-flyout-menu-container');
    protected previewList = this.container.find('.ca-form-letter-preview-list');
    protected previewItems = this.previewList.find('.ca-form-letter-preview-list__item');
    protected errorContainer = this.container.find('ca-inline-error');
    protected errorTitle = this.errorContainer.find('.ca-error-message__title');
    protected errorListTitle = this.errorContainer.find('.ca-error-message__bulleted-list-title');
    protected errorList = this.errorContainer.find('.ca-error-message__message-item');

    // Methods

    public async getSelectedRecord(): Promise<string> {
        return await this.previewList.find('.ca-form-letter-preview-list__item--selected').innerText;
    }

    public async getPreviewListItems(): Promise<string[]> {
        const list = [];
        for (let i = 0; i < await this.previewItems.count; i++) {
            list.push(await this.previewItems.nth(i).innerText);
        }
        return list;
    }
}
