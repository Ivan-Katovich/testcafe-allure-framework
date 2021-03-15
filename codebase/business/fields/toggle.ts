import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Toggle extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'toggle';
        this.toggle = this.container.find('kendo-switch');
    }

    // Elements
    protected toggle: Selector;

    // Methods
    public async on() {
        const attributeOn = (await this.getAttribute('toggle', 'class')).includes('k-switch-on');
        if (!attributeOn) {
            await this.click('toggle');
        } else {
            CustomLogger.logger.log('WARN', `Toggle is already in "ON" state`);
        }
    }

    public async off() {
        const attributeOff = (await this.getAttribute('toggle', 'class')).includes('k-switch-off');
        if (!attributeOff) {
            await this.click('toggle');
        } else {
            CustomLogger.logger.log('WARN', `Toggle is already in "OFF" state`);
        }
    }

    public async fill(state: string) {
        state = state.toLowerCase();
        if (state === 'on') {
            await this.on();
        } else if (state === 'off') {
            await this.off();
        } else {
            throw new Error('Wrong type of state, should be "on" or "off"');
        }
    }

    public async isOn(): Promise<boolean> {
        const attributeOn = (await this.getAttribute('toggle', 'class')).includes('k-switch-on');
        CustomLogger.logger.log('method', `Toggle is in ${attributeOn ? 'ON' : 'OFF'} state`);
        return attributeOn;
    }

    public async getValue() {
        const attributeOn = (await this.getAttribute('toggle', 'class')).includes('k-switch-on');
        let state = '';
        if (attributeOn) {
            state = (await this.toggle.find('.k-switch-label-on').innerText);
        } else if (!attributeOn) {
            state = (await this.toggle.find('.k-switch-label-off').innerText);
        }
        CustomLogger.logger.log('method', `The state of '${this.name}' ${this.fieldType} is '${state}'`);
        return state;
    }
}
