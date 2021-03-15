import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';
import Input from '../fields/input';
import Autocomplete from '../fields/autocomplete';
import Datepicker from '../fields/datepicker';
import Checkbox from '../fields/checkbox';
import Multiselect from '../fields/multiselect';
import Dropdown from '../fields/dropdown';
import Toggle from '../fields/toggle';
import {Options} from '../../interfaces';

export default class ProcessDesignerModal extends ModalWindow {
    public name = 'ProcessDesignerModal';
    protected container = Selector('.process-designer__body', { visibilityCheck: true });

    // Elements
    protected fields = this.container.find('.ca-administration-control');
    protected buttons = this.container.find('.process-designer__btn-group button');
    protected cross = Selector('#closeButton');
    protected blueprint = this.container.find('#process-blueprint-svg');
    protected items = this.blueprint.find('.ipms-diagram-node');

    // Methods
    public async save() {
        await this.click('buttons', 'Save');
    }

    public getField(name: string, type: string = 'input', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${name}'`);
        const constructors = {
            input: Input,
            dropdown: Dropdown,
            multiselect: Multiselect,
            toggle: Toggle,
            autocomplete: Autocomplete,
            datepicker: Datepicker,
            checkbox: Checkbox
        };
        return new constructors[type](this.fields, name, options);
    }

    public async clickButton(name) {
        await this.click('buttons', name);
    }

    public async selectItem(name) {
        const count = await this.items.count;
        for (let i = 0; i < count; i++) {
            const text = await this.items.nth(i).textContent;
            if (text.includes(name)) {
                await t.click(this.items.nth(i).find('circle'));
            }
        }

    }
}
