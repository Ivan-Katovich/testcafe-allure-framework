import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import Radiobutton from '../fields/radiobutton';
import Dropdown from '../fields/dropdown';
import Checkbox from '../fields/checkbox';
import timeService from '../../services/entries/timeService';
import { CustomLogger } from '../../support/utils/log';
import Treeview from '../elements/treeview';
import Autocomplete from '../fields/autocomplete';
import TableGrid from '../fields/tableGrid';
import Input from '../fields/input';
import Toggle from '../fields/toggle';
import {Options} from '../../interfaces';

export default class UserPreferencesBoard extends BaseObject {
    public name = 'UserPreferencesBoard';
    protected container = Selector('user-preferences', { visibilityCheck: true });

    // Elements
    protected fields = this.container.find('.user-preferences__sections-fields');
    protected preferencesButtons = this.container.find('.user-preferences__buttons-item');
    protected sectionTitles = this.container.find('.user-preferences__sections-title');
    protected title = this.container.find('.user-preferences__title');
    protected sectionLinks = this.container.find('.user-preferences__sections-anchors-item');

    // Getters
    get nodeTreeview() {
        return this.createGetter(Treeview, 'node');
    }

    // Methods
    public getField(name: string, type: string = 'input', options?: Options) {
        type = type.toLowerCase();
        CustomLogger.logger.log('method', `Get ${type} '${name}'`);
        const constructors = {
            input: Input,
            radiobutton: Radiobutton,
            dropdown: Dropdown,
            checkbox: Checkbox,
            autocomplete: Autocomplete,
            tablegrid: TableGrid,
            toggle: Toggle
        };
        return new constructors[type](this.fields, name, options);
    }

    public async save() {
        const isEnabled = await timeService.wait(async () => {
            const is = await this.preferencesButtons.withText('Save').hasAttribute('disabled');
            return !is;
        }, {timeout: 3000, interval: 200});
        if (!isEnabled) {
            throw new Error(`Save button is not enabled`);
        }
        await this.click('preferencesButtons', 'Save');
    }

    public async reset() {
        const isEnabled = await timeService.wait(async () => {
            const is = await this.preferencesButtons.withText('Reset').hasAttribute('disabled');
            return !is;
        }, {timeout: 2000, interval: 200});
        if (!isEnabled) {
            throw new Error(`Reset button is not enabled`);
        }
        await this.click('preferencesButtons', 'Reset');
    }
}
