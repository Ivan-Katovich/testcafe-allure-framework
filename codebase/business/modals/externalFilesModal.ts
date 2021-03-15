import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';
import QueryResultsGrid from '../controls/queryResultsGrid';

export default class ExternalFilesModal extends ModalWindow {
    public name = 'ExternalFilesModal';
    protected container = Selector('ca-external-files-modal div.ca-modal__window', { visibilityCheck: true });

    // Elements
    protected fields = this.container.find('.ca-external-files-modal__field');
    protected title = this.container.find('.ca-external-files-modal__title');
    protected tadlist = this.container.find('ca-tab-selection');
    protected tabs = this.container.find('.ca-tab-button');
    protected uploadContainer = this.container.find('kendo-upload');
    protected uploadInput = this.uploadContainer.find('input');
    protected uploadButton = this.uploadContainer.find('.k-upload-button');
    protected buttons = this.container.find('.ca-tab--visible button');

    // Getters
    get grid() {
        return this.createGetter(QueryResultsGrid, true, 1);
    }

    // Methods
    public async add() {
        await this.click('buttons', 'Add');
        CustomLogger.logger.log('method', `The add button was clicked on the External Files modal`);
    }

    public async edit() {
        await this.click('buttons', 'Edit');
        CustomLogger.logger.log('method', `The edit button was clicked on the External Files modal`);
    }

    public async close() {
        await this.click('buttons', 'Close');
        CustomLogger.logger.log('method', `The External Files modal was closed`);
    }

    public async openTab(tabName: string) {
        await this.click('tabs', tabName);
        CustomLogger.logger.log('method', `The '${tabName}' tab was opened`);
    }

    public async uploadFile(filePath: string) {
        await t.setFilesToUpload(this.uploadInput, filePath)
                .click(this.uploadButton);
        CustomLogger.logger.log('method', `The file '${filePath}' was uploaded`);
    }
}
