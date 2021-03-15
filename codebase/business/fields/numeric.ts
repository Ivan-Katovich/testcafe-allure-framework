import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Numeric extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'numeric';
        this.arrowUp = this.container.find('.k-link-increase');
        this.arrowDown = this.container.find('.k-link-decrease');
    }

    // Elements
    protected arrowUp: Selector;
    protected arrowDown: Selector;

    // Methods
    public async increase(times: number = 1) {
        for (let i = 0; i < times; i++) {
            await this.click('arrowUp');
        }
    }

    public async decrease(times: number = 1) {
        for (let i = 0; i < times; i++) {
            await this.click('arrowDown');
        }
    }
}
