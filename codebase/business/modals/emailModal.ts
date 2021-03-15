import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';
import Input from '../fields/input';
import QueryResultsGrid from '../controls/queryResultsGrid';
import {Options} from '../../interfaces';

export default class EmailModal extends ModalWindow {
    public name = 'EmailModal';
    protected container = Selector('.ca-email-preview__modal-body', { visibilityCheck: true });

    // Elements
    protected title = this.container.find('.ca-email-preview-detail__header');
    protected fields = this.container.find('.ca-email-preview-detail__field');
    protected labels = this.container.find('.ca-email-preview-detail__label-text');
    protected buttons = this.container.find('.ca-email-preview-detail__footer button');
    protected partyButtons = this.container.find('.ca-email-parties-detail__footer button');
    protected cross = Selector('#closeButton');
    protected taskControls = this.container.find('.ca-flyout-menu-container');
    protected previewList = this.container.find('.ca-email-preview-list');
    protected previewItems = this.previewList.find('.ca-email-preview-list__item');
    protected errorContainer = this.container.find('ca-inline-error');
    protected errorTitle = this.errorContainer.find('.ca-error-message__title');
    protected errorListTitle = this.errorContainer.find('.ca-error-message__bulleted-list-title');
    protected errorList = this.errorContainer.find('.ca-error-message__message-item');
    protected addPartyToTo = this.container.find('#addPartiesToTo');
    protected addPartyToCc = this.container.find('#addPartiesToCc');
    protected addPartyToBcc = this.container.find('#addPartiesToBcc');

    // Getters
    get grid() {
        return this.createGetter(QueryResultsGrid, true, 1);
    }

    // Methods
    public async send() {
        await this.click('buttons', 'Send');
    }

    public getField(name: string, type: string = 'input', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${name}'`);
        name = name.toLowerCase();
        const matcher = {
            'to': 0,
            'cc': 1,
            'bcc': 2,
            'from': 3,
            'reply to': 4,
            'subject': 5,
            'message': 6,
            'drop box': 7
        };
        const constructors = {
            input: Input
        };
        return new constructors[type](this.fields.nth(matcher[name]), null, options);
    }

    public async getSelectedRecord(): Promise<string> {
        return await this.previewList.find('.ca-email-preview-list__item--selected').innerText;
    }

    public async getPreviewListItems(): Promise<string[]> {
        const list = [];
        for (let i = 0; i < await this.previewItems.count; i++) {
            list.push(await this.previewItems.nth(i).innerText);
        }
        return list;
    }
}
