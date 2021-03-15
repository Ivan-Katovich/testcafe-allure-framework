import ModalWindow from './modalWindow';
import AuditInfo from '../controls/auditInfo';

export default class CodeManagementModal extends ModalWindow {
    public name = 'CodeManagementModal';

    // Elements
    protected help = this.container.find('ngx-help');
    protected helpLink = this.help.find('a');
    protected fields = this.container.find('.ca-administration-control');

    get auditInfo() {
        return this.createGetter(AuditInfo);
    }

    public async save(): Promise<void> {
        await this.click('buttons', 'Save');
    }

    public async close(): Promise<void> {
        await this.click('buttons', 'Close');
    }

    public async reset(): Promise<void> {
        await this.click('buttons', 'Reset');
    }

    public async addNew() {
        await this.click('buttons', 'Add New');
    }

    public async getValue(fieldName: string): Promise<string> {
        const field = this.getField(fieldName);
        if (await field.isLocked()) {
            return await field.getText('labels', 1);
        } else {
            return await field.getValue();
        }
    }
}
