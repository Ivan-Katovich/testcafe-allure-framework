import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';

export default class AdminMenu extends BaseObject {
    public name = 'AdminMenu';
    protected container = Selector('.administration-grid', { visibilityCheck: true });

    // Elements
    protected cards = this.container.find('.administration-grid-card');
    protected cardTitles = this.container.find('.administration-grid-card__title');

    // Methods
    public getCard(nameOrNumber) {
        return new Card(this.cards, nameOrNumber);
    }

    public async getAllCardNames() {
        const namesArray = [];
        const count = await this.getCount('cardTitles');
        for (let i = 0; i < count; i++) {
            const name = await this.getText('cardTitles', i);
            namesArray.push(name);
        }
        return namesArray;
    }

}

class Card extends  BaseObject {
    constructor(root: Selector, nameOrNumber) {
        super();
        if (typeof nameOrNumber === 'string') {
            this.container = root.find('.administration-grid-card__title')
                .withText(nameOrNumber)
                .parent(0);
            this.name = nameOrNumber;
        } else {
            this.container = root.nth(nameOrNumber);
            this.number = nameOrNumber;
        }

        this.items = this.container.find('.administration-grid-card__list-item');
    }

    public number: number;

    // Elements
    protected items: Selector;

    // Methods
    public open(itemName) {
        return this.click('items', itemName);
    }
}
