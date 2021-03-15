import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import Input from '../fields/input';

export default class AuditInfo extends BaseObject {
    public name = 'AuditInfo';
    protected container = Selector('.ca-list-detail-audit-info-container', { visibilityCheck: true });

    // elements
    protected cells = this.container.find('.ca-list-detail-audit-info-cell');
    protected labels = this.container.find('.ca-list-detail-audit-info-cell__label');

    // methods

    public async getValue(auditInfoName: string): Promise<string> {
        return await this.labels.withText(auditInfoName).nextSibling().innerText;
    }

    public async isReadOnly(name: string): Promise<boolean> {
        const field = new Input(this.cells, name);
        return field.isLocked();
    }
}
