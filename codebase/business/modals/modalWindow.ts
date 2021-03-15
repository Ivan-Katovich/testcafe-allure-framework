import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';
import Input from '../fields/input';
import Autocomplete from '../fields/autocomplete';
import Datepicker from '../fields/datepicker';
import Checkbox from '../fields/checkbox';
import Dropdown from '../fields/dropdown';
import Multiselect from '../fields/multiselect';
import {Options} from '../../interfaces';

export default class ModalWindow extends BaseObject {
    public name = 'ModalWindow';
    protected container = Selector('.ca-modal__window', { visibilityCheck: true });

    // Elements
    protected buttons = this.container.find('button');
    protected cross = this.container.find('#closeButton');
    protected viewPort = Selector('ca-modal>div');
    protected window = Selector('ca-modal>div>div');
    protected help = Selector('ca-modal .help');
    protected fields: Selector;
    protected mainButton: Selector;

    // Methods
    public async cancel() {
        await this.click('buttons', 'Cancel');
    }

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

    public getTitle() {
        return this.getText('title');
    }

    public async confirm() {
        await this.click('mainButton');
    }

    public async close() {
        await this.click('cross');
    }
}
