import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';

export default class ClearCacheBoard extends BaseObject {
    public name = 'ClearCacheBoard';
    protected container = Selector('clear-cache', { visibilityCheck: true });

    // Elements
    protected clearCacheRows = this.container.find('#clear-cache-table>tr');

    // Getters

    // Methods
    public async clearEverythingForEveryone() {
        const target = this.clearCacheRows.withText('EVERYTHING').find('button').withText('Clear for everyone');
        await this.click(target);
        CustomLogger.logger.log('method', `Cache for everything for everyone is cleared`);
    }
}
