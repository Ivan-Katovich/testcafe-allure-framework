import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import BaseObject from '../baseObject';

declare const globalConfig: any;

export default class LoginPage extends BaseObject {
    public name = 'LoginPage';

    // Elements
    protected userNameField = Selector('#username-login-type-discovery,#UserNameTextBox');
    protected passwordField = Selector('#password,#PasswordTextBox');
    protected serverField = Selector('#ServerTextBox');
    protected databaseField = Selector('#DatabaseTextBox');
    protected nextButton = Selector('#button-discovery-next');
    protected signInBtn = Selector('#btnLoginSubmit,#MainContent_SignInButton');
    protected signInAgainButton = Selector('[name="SignInAgain"]');
    protected placeHolderArea = Selector('.ca-query-results-placeholder');
    protected settingsLink = Selector('#MainContent_SettingsAnchor');

    public async login(username: string, password: string) {
        CustomLogger.logger.log('method', `Log in as "${username}"`);
        const isNameInputVisible = await this.isVisible('userNameField');
        if (isNameInputVisible) {
            await t
                .typeText(this.userNameField, username);
            if (globalConfig.authType !== 'enterprise') {
                await t
                    .click(this.nextButton);
            }
        } else {
            CustomLogger.logger.log('method', 'User has been already chosen');
        }
        await t
            .typeText(this.passwordField, password);
        if (globalConfig.authType === 'enterprise') {
            await t
                .click(this.settingsLink);
            await t
                .typeText(this.serverField, globalConfig.database.server);
            await t
                .typeText(this.databaseField, globalConfig.database.database);
        }
        await t
            .click(this.signInBtn);
        CustomLogger.logger.log('method', 'User Successfully logged into the Docketing Portal System');
    }

    public async signInAgain() {
        await this.click('signInAgainButton');
    }
}
