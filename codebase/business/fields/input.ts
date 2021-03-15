import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Input extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'input';
        this.clearButton = this.container.find('.k-clear-value, .ca-global-search-filter__clear-button');
    }

    // Elements
    protected clearButton: Selector;

    // Methods
}
