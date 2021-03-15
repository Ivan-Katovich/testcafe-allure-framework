import { Selector, t } from 'testcafe';
import BaseField from './baseField';
import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';

export default class Multiline extends BaseField {
    constructor(rootSelector: Selector, name: string = null, options?: Options) {
        super(rootSelector, name, options);
        this.fieldType = 'multiline';
        this.input = this.container.find('textarea');
        this.resizeHandler = this.container.find('.ca-resize-handler');
    }

    // Elements
    protected resizeHandler: Selector;

    // Methods
}
