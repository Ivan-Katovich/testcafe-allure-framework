import BaseField from './baseField';
import HierarchyModal from '../modals/hierarchyModal';
import { CustomLogger } from '../../support/utils/log';
import {t} from 'testcafe';
import ExternalFilesModal from '../modals/externalFilesModal';
import {Options} from '../../interfaces';

export default class LinkedFile extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'linkedFile';
        this.input = this.container.find('.ca-hierarchy__input');
        this.addLink = this.container.find('.linked-column__add');
        this.linkableValue = this.container.find('linkable-value');
        this.editButton = this.container.find('.linked-column__edit');
    }

    // Elements
    protected input: Selector;
    protected addLink: Selector;
    protected linkableValue: Selector;
    protected editButton: Selector;

    // Method
    public async fill(value: string) {
        CustomLogger.logger.log('method', `Fill ${this.fieldType} '${this.name}' with value '${value}'`);
        if (await this.isPresent('editButton')) {
            await t.click(this.editButton);
        } else {
            await t.click(this.addLink);
        }
        const externalFilesModal = new ExternalFilesModal();
        await externalFilesModal.openTab('File');
        await externalFilesModal.uploadFile(value);
        await externalFilesModal.add();
    }

    public async getValue() {
        let value = '';
        if (await this.isPresent('linkableValue')) {
            value = await this.linkableValue.innerText;
        }
        CustomLogger.logger.log('method', `Value of ${this.fieldType} '${this.name}' is '${value}'`);
        return value;
    }

    public async editValue(value: string) {
        CustomLogger.logger.log('method', `Change value of ${this.fieldType} '${this.name}' to '${value}'`);
        await t.click(this.editButton);
        const externalFilesModal = new ExternalFilesModal();
        await externalFilesModal.openTab('File');
        await externalFilesModal.uploadFile(value);
        await externalFilesModal.add();
    }
}
