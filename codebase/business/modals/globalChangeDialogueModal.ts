import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import ModalWindow from './modalWindow';
import Input from '../fields/input';
import Autocomplete from '../fields/autocomplete';
import Datepicker from '../fields/datepicker';
import Checkbox from '../fields/checkbox';
import Dropdown from '../fields/dropdown';
import Multiselect from '../fields/multiselect';
import {Options} from '../../interfaces';

export default class GlobalChangeDialog extends ModalWindow {
    public name = 'GlobalChangeDialog';
    protected container = Selector('.ca-global-change-dialog .ca-modal__window');

    // Elements
    protected title = this.container.find('.ca-global-change-dialog__heading');
    protected queryInfo = this.container.find('.ca-global-change-dialog__query-info');
    protected mainButton = this.container.find('.dp-button--primary--modal').nth(1);
    protected cross = this.container.find('#closeButton');
    protected footer = this.container.find('.ca-global-change-dialog__footer');
    protected footerButtons = this.footer.find('button');
    protected fields = this.container.find('.ca-administration-control');

    // Methods
    public getField(name: string, type: string = 'input', options?: Options) {
        CustomLogger.logger.log('method', `Get ${type} '${name}'`);
        const constructors = {
            input: Input,
            autocomplete: Autocomplete,
            datepicker: Datepicker,
            checkbox: Checkbox,
            dropdown: Dropdown,
            multiselect: Multiselect
        };
        return new constructors[type](this.fields, name, options);
    }

    public async preview() {
        await this.click('footerButtons', 'Preview');
    }

    public async execute() {
        await this.click('footerButtons', 'Execute');
    }
}
