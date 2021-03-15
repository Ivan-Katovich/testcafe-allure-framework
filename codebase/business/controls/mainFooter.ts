import { Selector, t } from 'testcafe';
import BaseObject from '../baseObject';
import { CustomLogger } from '../../support/utils/log';

export default class MainFooter extends BaseObject {
    public name = 'MainFooter';
    protected container = Selector('ngx-footer', { visibilityCheck: true });

    // Elements
    protected footerLinks = this.container.find('.footer__link');
    protected copyrightMark = this.container.find('.footer__copyright');
    protected ipRulesExpertiseIcon = this.container.find('[title="IP Rules Expertise"]');
}
