import { Selector, t, ClientFunction } from 'testcafe';
import { CustomLogger } from '../support/utils/log';
import timeService from '../services/entries/timeService';
import { Options } from '../interfaces';

declare const globalConfig: any;

export default class BaseObject {
    public name: string;
    protected container: Selector;
    protected spinner = Selector('.spinner-image');
    protected errorMessage = Selector('.ca-modal-error__message,.ca-modal-alert__message');
    protected browserTabTitle = Selector('head > title');

    protected objectsArray = [];
    protected currentObject = null;

    // Methods
    // Internal
    private getElement(element: string | Selector, textOrNumber?: string | number, isTextExact: boolean = false): Selector {
        let finalElement: Selector;
        if (typeof element === 'string') {
            if (textOrNumber) {
                if (typeof textOrNumber === 'string') {
                    finalElement = isTextExact ? this[element].withExactText(textOrNumber) : this[element].withText(textOrNumber);
                } else {
                    finalElement = this[element].nth(textOrNumber);
                }
            } else {
                finalElement = this[element];
            }
        } else {
            finalElement = element;
        }
        return finalElement;
    }

    protected scrollIntoViewIfNeeded = ClientFunction((selector: Selector) => {
        return new Promise( (resolve) => {
            const element: any = selector();
            if (element && element.scrollIntoViewIfNeeded) {
                element.scrollIntoViewIfNeeded();
            }
            resolve();
        });
    });

    protected createGetter<T>(Constructor: new(...args: any[]) => T, ...params: any[]): T {
        let obj;
        if (this.currentObject && this.currentObject.constructor === Constructor) {
            obj = this.currentObject;
        } else {
            obj = this.objectsArray.find((obj) => obj.constructor === Constructor);
            this.currentObject = obj;
        }
        if (!obj) {
            obj = new Constructor(...params);
            this.objectsArray.push(obj);
            this.currentObject = obj;
        }
        return obj;
    }

    // Actions
    public async scrollTo(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<void> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        await this.scrollIntoViewIfNeeded(selector);
    }

    public async click(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<void> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        CustomLogger.logger.log('method', `User clicked on '${typeof element === 'string' ? element : 'given element'}' in '${this.name || 'given control'}'`);
        if (textOrNumber) {
            CustomLogger.logger.log('method', `with text or number '${textOrNumber}'`);
        }
        await this.scrollIntoViewIfNeeded(selector);
        await t.click(selector, options);
    }

    public async hover(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<void> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        CustomLogger.logger.log('method', `User hovered '${typeof element === 'string' ? element : 'given element'}' in '${this.name || 'given control'}'`);
        if (textOrNumber) {
            CustomLogger.logger.log('method', `with text or number '${textOrNumber}'`);
        }
        await t.hover(selector);
    }

    public async type(input: string | Selector = 'container', value: string, options: Options = {}): Promise<void> {
        options.isReplace = options.isReplace === undefined ? true : options.isReplace;
        const selector = this.getElement(input);
        CustomLogger.logger.log('method', `User typed in '${typeof input === 'string' ? input : 'given element'}' text '${value}' in '${this.name || 'given control'}'`);
        await t.typeText(selector, value, { replace: options.isReplace,  paste: options.isPaste });
    }

    public async pressKey(key: string, count: number = 1): Promise<void> {
        CustomLogger.logger.log('method', `User pressed '${key}' key(s) ${count} time(s)`);
        for (let i = 0; i < count; i++) {
            await t.pressKey(key);
        }
    }

    public async dragAndDrop(element: string | Selector = 'container', options: Options = {}): Promise<void> {
        options.offsetY = options.offsetY === undefined ? 0 : options.offsetY;
        options.offsetX = options.offsetX === undefined ? 0 : options.offsetX;
        const selector = this.getElement(element);
        await t.drag(selector, options.offsetX, options.offsetY);
        CustomLogger.logger.log('method', `Drag element ${typeof element === 'string' ? element : 'given element'} with offset x = ${options.offsetX} and offset y = ${options.offsetY}`);
    }

    // Information Getters
    // Boolean
    public async isEnabled(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<boolean> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const isEnabled = !(await selector.hasAttribute('disabled')
            || ((await selector.getAttribute('class')) && (await selector.getAttribute('class')).includes('disabled'))
            || (await selector.getAttribute('ng-reflect-disabled') === 'true'));
        CustomLogger.logger.log('method', `The '${typeof element === 'string' ? element : 'given element'}'${textOrNumber ? ' with text or number ' : ''}${textOrNumber ? textOrNumber : ''} is '${isEnabled ? 'enabled' : 'disabled'}'`);
        return isEnabled;
    }

    public async isVisible(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<boolean> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        let visibility: boolean = null;
        try {
            visibility = await selector.visible;
        } catch (err) {
            visibility = false;
        }
        CustomLogger.logger.log('method', `The '${typeof element === 'string' ? element : 'given element'}'${textOrNumber ? ' with text or number' : ''} ${textOrNumber ? textOrNumber : ''} is '${visibility ? 'visible' : 'invisible'}'`);
        return visibility;
    }

    public async isInView(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<boolean> {
        const elementRectangle = await this.getElement(element, textOrNumber, options.isTextExact).nth(0).boundingClientRect;
        const headerRect = await Selector('.app__header').boundingClientRect;

        const windowHeight = await ClientFunction(() => window.innerHeight)();
        const windowWidth = await ClientFunction(() => window.innerWidth)();
        return (elementRectangle.bottom > 0
            && elementRectangle.right > 0
            && elementRectangle.left < windowWidth
            && elementRectangle.top < windowHeight) && headerRect.bottom < elementRectangle.bottom;
    }

    public async isPresent(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<boolean> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const count = await selector.count;
        CustomLogger.logger.log('method', `Existence status of '${typeof element === 'string' ? element : 'given element'}'${textOrNumber ? 'with text or number ' : ''}${textOrNumber ? textOrNumber : ''} in '${this.name || 'given control'}' is '${count > 0}'`);
        return count > 0;
    }

    public async waitTillElementNotPresent(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<boolean> {
        let visibility: boolean;
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        visibility = await timeService.wait(async () => {
            return (await selector.count) === 0;
        }, {timeout: options.timeout || 3000, interval: options.interval || 300});
        CustomLogger.logger.log('method', `Visibility status of '${typeof element === 'string' ? element : 'given element'}'${textOrNumber ? 'with text ' : ''}${textOrNumber ? textOrNumber : ''} in '${this.name || 'given control'}' is '${!visibility}'`);
        return visibility;
    }

    public async waitTillElementPresent(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<boolean> {
        let visibility: boolean;
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        visibility = await timeService.wait(async () => {
            return await selector.count;
        }, {timeout: options.timeout || 3000, interval: options.interval || 300});
        CustomLogger.logger.log('method', `Visibility status of '${typeof element === 'string' ? element : 'given element'}'${textOrNumber ? 'with text ' : ''}${textOrNumber ? textOrNumber : ''} in '${this.name || 'given control'}' is '${!visibility}'`);
        return visibility;
    }

    public async hasAttribute(element: string | Selector = 'container', attributeName: string, textOrNumber?: string | number, options: Options = {}): Promise<boolean> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const isPresent = await selector.hasAttribute(attributeName);
        CustomLogger.logger.log('method', `Attribute '${attributeName}' in '${typeof element === 'string' ? element : 'given element'}' in '${this.name || 'given control'}' ${isPresent ? 'exists' : 'is absent'}`);
        return isPresent;
    }

    public async isFocused(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<boolean> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const isFocused = await selector.focused;
        CustomLogger.logger.log('method', `The '${typeof element === 'string' ? element : 'given element'}'${textOrNumber ? ' with text ' : ''}${textOrNumber ? textOrNumber : ''} is '${isFocused ? 'focused' : 'unfocused'}'`);
        return isFocused;
    }

    // Numbers
    public async getCount(element: string | Selector = 'container', options: Options = {}): Promise<number> {
        const selector = this.getElement(element);
        const count = await selector.count;
        if (!options.skipLogging) {
            CustomLogger.logger.log('method', `Count of '${typeof element === 'string' ? element : 'given element'}' in '${this.name || 'given control'}' is '${count}'`);
        }
        return count;
    }

    public async getElementWidth(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<number> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const value = await selector.clientWidth;
        CustomLogger.logger.log('method', `The width of the ${typeof element === 'string' ? element : 'given element'} is ${value}`);
        return value;
    }

    public async getElementHeight(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<number> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const value = await selector.clientHeight;
        CustomLogger.logger.log('method', `The height of the ${typeof element === 'string' ? element : 'given element'} is ${value}`);
        return value;
    }

    public async getElementLeft(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<number> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const value = await selector.offsetLeft;
        CustomLogger.logger.log('method', `The left border of the ${typeof element === 'string' ? element : 'given element'} is ${value}`);
        return value;
    }

    public async getElementTop(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<number> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const value = await selector.offsetTop;
        CustomLogger.logger.log('method', `The top border of the ${typeof element === 'string' ? element : 'given element'} is ${value}`);
        return value;
    }

    // String
    public async getText(element: string | Selector = 'container', position: number = -1, options: Options = {}): Promise<string> {
        const selector = this.getElement(element);
        let text: string;
        const attribute = options.asDisplayed ? 'innerText' : 'textContent';
        if (position === -1) {
            text = (await selector[attribute]).trim();
            CustomLogger.logger.log('method', `Text in '${typeof element === 'string' ? element : 'given element'}' in '${this.name || 'given control'}' is '${text}'`);
        } else {
            text = (await selector.nth(position)[attribute]).trim();
            CustomLogger.logger.log('method', `Text in ${position} of '${typeof element === 'string' ? element : 'given element'}' in '${this.name || 'given control'}' is '${text}'`);
        }
        return text;
    }

    public async getAttribute(element: string | Selector = 'container', attributeName: string, textOrNumber?: string | number, options: Options = {}): Promise<string> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const attributeValue = await selector.getAttribute(attributeName);
        CustomLogger.logger.log('method', `Attribute '${attributeName}' in '${typeof element === 'string' ? element : 'given element'}' in '${this.name || 'given control'}' is '${attributeValue}'`);
        return attributeValue;
    }

    public async getStyleProperty(element: string | Selector = 'container', stylePropertyName: string, textOrNumber?: string | number, options: Options = {}): Promise<string> {
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const stylePropertyValue = await selector.getStyleProperty(stylePropertyName);
        CustomLogger.logger.log('method', `Stype property '${stylePropertyName}' in '${typeof element === 'string' ? element : 'given element'}' in '${this.name || 'given control'}' is '${stylePropertyValue}'`);
        return stylePropertyValue;
    }

    public async getElementHtml(element: string | Selector = 'container', textOrNumber?: string | number, options: Options = {}): Promise<string> {
        let elem: any;
        const selector = this.getElement(element, textOrNumber, options.isTextExact);
        const html = await (ClientFunction(() => elem().innerHTML, {
            dependencies: { elem: selector }
        }))();
        CustomLogger.logger.log('method', `InnerHTML of element ${typeof element === 'string' ? element : ''} is received`);
        return html;
    }

    public async waitLoading(options: Options = {}) {
        CustomLogger.logger.log('method', `Wait for Loading is completed`);
        await timeService.wait(async () => {
            return (await this.spinner.count) > 0;
        }, {timeout: 2000, interval: 100});
        const isDisappeared = await timeService.wait(async () => {
            return (await this.spinner.count) === 0 || !(await this.noErrors(true));
        }, {timeout: globalConfig.timeout.loading, interval: 1000});
        if (!isDisappeared) {
            throw new Error(`Loading spinner is still appeared after timeout or System error thrown`);
        }
        CustomLogger.logger.log('method', `Loading is completed`);
        if (options.checkErrors) {
            if (!(await this.noErrors())) {
                throw new Error('A System Error thrown after loading');
            }
        }
    }

    public async checkSpinner() {
        const count = await this.spinner.count;
        CustomLogger.logger.log('method', `Spinners count is "${count}"`);
        return count > 0;
    }

    public async noErrors(skipLogging: boolean = false) {
        const count = await this.getCount('errorMessage', {skipLogging});
        return count === 0;
    }

}
