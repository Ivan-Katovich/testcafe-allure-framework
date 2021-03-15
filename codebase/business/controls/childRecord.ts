import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import QueryResultsGrid from './queryResultsGrid';
import { CustomLogger } from '../../support/utils/log';

export default class ChildRecord extends BaseObject {
    public name = 'ChildRecord';
    protected container = Selector('.data-entry-form__child-record-section', { visibilityCheck: true });

    // Elements
    protected addNewButton = this.container.find('.ca-button--mini-primary');
    protected cross = this.container.find('.child-record__close-button');
    protected menu = this.container.find('.child-record__menu');
    protected total = this.container.find('.ca-grid__total-records');
    protected resetButton = this.menu.find('[title="Reset changes"] button');
    protected deleteRowButton = this.container.find('[title="Delete row"] button');
    protected emailButton = this.container.find('.action-email button');
    protected editRowButton = this.container.find('[title="Edit row"] button');

    // Getters
    get grid() {
        return this.createGetter(QueryResultsGrid, true);
    }

    public async getTotalCount() {
        const text = await this.getText('total');
        const count = parseInt(text.match(/\d+/)[0]);
        CustomLogger.logger.log('method', `Total records count is '${count}'`);
        return count;
    }

    public async addNew() {
        await this.click('addNewButton');
    }

    public async resetChanges() {
        await this.click('resetButton');
        CustomLogger.logger.log('method', `The reset button on the child was clicked`);
    }

    public async delete() {
        await this.click('deleteRowButton');
        CustomLogger.logger.log('method', `The delete button was clicked.`);
    }
}
