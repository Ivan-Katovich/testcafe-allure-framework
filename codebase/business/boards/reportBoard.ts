import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import Treeview from '../elements/treeview';
import BaseObject from '../baseObject';

export default class ReportBoard extends BaseObject {
    public name = 'ReportBoard';
    protected container = Selector('.ca-reports', { visibilityCheck: true });

    // Elements
    protected searchBox = this.container.find('.ca-reports__search');

    // Getters
    get kendoTreeview() {
        return this.createGetter(Treeview, 'kendo');
    }
}
