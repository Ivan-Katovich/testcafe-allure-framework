import Ui from './business/ui';
import Api from './backend/api';
import Services from './services/services';
import cookieProvider from './backend/cookieProvider';
import memory from './support/memory';

const userData = require('./configuration/data/users');
declare const globalConfig: any;

class App {
    public name = 'App';

    // Application parts
    public ui = new Ui();
    public api = new Api(cookieProvider);
    public services = new Services();

    // Elements

    // Helpers
    public step = this.services.infra.step;
    public doTill = this.services.infra.doTill;
    public memory = memory;

    // Methods
    public async setDefaults(mainUser: any = globalConfig.user) {
        if (typeof  mainUser === 'string') {
            mainUser = userData[mainUser];
        }
        await this.api.userPreferences.resetUserPreferences();
        await this.api.changeDisplayConfigurationForUser('Default Display Configuration 1', mainUser.userName);

        await this.api.administration.contentGroup.openContentGroup('Test Automation CG Regression 2');
        await this.api.administration.contentGroup.removeUser(globalConfig.user.userName);
        await this.api.administration.contentGroup.save();

        await this.api.administration.contentGroup.openContentGroup('Test Automation CG Regression 3');
        await this.api.administration.contentGroup.removeUser(globalConfig.user.userName);
        await this.api.administration.contentGroup.save();

        await this.api.setContentGroupDefaults(mainUser.contentGroup);
        if (!app.memory.current.permanent.contentGroupId || !globalConfig.user.contentGroup) {
            app.memory.current.permanent.contentGroupId = await this.api.administration.contentGroup.getContentGroupIdByName(globalConfig.user.contentGroup);
            globalConfig.user.contentGroupId = app.memory.current.permanent.contentGroupId;
        }
        this.memory.reset();
    }
}

const app = new App();
app.services.infra.runInfo();
// app.services.infra.enableDownloadForHeadlessChrome();

export default app;
