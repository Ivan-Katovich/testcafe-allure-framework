import LoginPage from './pages/loginPage';
import MainHeader from './controls/mainHeader';
import MainFooter from './controls/mainFooter';
import InfoModal from './modals/infoModal';
import DuplicationModal from './modals/duplicationModal';
import EmailModal from './modals/emailModal';
import NavigationBar from './controls/navigationBar';
import KendoPopup from './elements/kendo/kendoPopup';
import DataEntryBoard from './boards/dataEntryBoard';
import UserPreferencesBoard from './boards/userPreferencesBoard';
import QueryBoard from './boards/queryBoard';
import {ClientFunction, RequestLogger, Selector, t, Role as UserRole, RequestMock} from 'testcafe';
import { CustomLogger } from '../support/utils/log';
import BaseObject from './baseObject';
import ReportPage from './pages/reportPage';
import QueryManagementModal from './modals/queryManagementModal';
import ReportModal from './modals/reportModal';
import ReportBoard from './boards/reportBoard';
import AuditHistoryModal from './modals/auditHistoryModal';
import ContentBoard from './boards/contentBoard';
import GlobalChangeModal from './modals/globalChangeModal';
import CollaborationBoard from './boards/collaborationBoard';
import GlobalSearchBoard from './boards/globalSearchBoard';
import ErrorModal from './modals/errorModal';
import AdminMenu from './boards/adminMenu';
import AdminBoard from './boards/adminBoard';
import AddRuleTypeModal from './modals/addRuleTypeModal';
import RulesSummaryBoard from './boards/rulesSummaryBoard';
import RulesExportBoard from './boards/rulesExportBoard';
import RulesImportBoard from './boards/rulesImportBoard';
import ProcessDesignerModal from './modals/processDesignerModal';
import CodeManagementModal from './modals/codeManagementModal';
import HierarchyModal from './modals/hierarchyModal';
import ConfirmationModal from './modals/confirmationModal';
import cookieProvider from '../backend/cookieProvider';
import ExternalFilesModal from './modals/externalFilesModal';
import timeService from '../services/entries/timeService';
import memory from '../support/memory';
import AddRelationshipsModal from './modals/addRelationshipsModal';
import GlobalChangeDialog from './modals/globalChangeDialogueModal';
import FormLetter from './modals/formLetterModal';
import SupportModal from './modals/supportModal';
import ClearCacheBoard from './boards/clearCacheBoard';
import ExportGlobalSearchPage from './pages/exportGlobalSearchPage';
import ExportHtmlPage from './pages/exportHtmlPage';

const userData = require('../configuration/data/users');
declare const globalConfig: any;
declare const globalInfo: any;

export default class Ui extends BaseObject {
    public name = 'Ui';
    private cookieProvider = cookieProvider;
    public requestLogger = {
        createRecord: RequestLogger({url: `${globalConfig.env.url}/Records/records`, method: 'POST'}, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        }),
        createAdminItem: RequestLogger(/AdminPortal\/.+\/save/, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        }),
        createAutoUpdate: RequestLogger(/RulesManagement\/saveDetails/, {
            logRequestHeaders: true,
            logResponseBody: true,
            stringifyResponseBody: true
        }),
        simpleAndDuplication: RequestLogger(/Queries\/Queries|Records\/duplicaterecord\/create/, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        }),
        simple: RequestLogger(/Queries\/Queries/, {
            logRequestHeaders: true
        }),
        simpleAdmin: RequestLogger(/Common\//, {
            logRequestHeaders: true
        }),
        createQuery: RequestLogger({url: `${globalConfig.env.url}/Queries/querymanagement/save`, method: 'POST'}, {
            logRequestHeaders: true,
            logResponseBody: true,
            stringifyResponseBody: true
        }),
        getRecord: RequestLogger({url: /Records\/\/records/, method: 'GET'}, {
            logRequestHeaders: true,
            logResponseBody: true,
            stringifyResponseBody: true
        }),
        executeQuery: RequestLogger(/Queries\/queryexecution/, {
            logRequestHeaders: true,
            logResponseBody: true,
            stringifyResponseBody: true
        }),
        support: RequestLogger(/UsersManagement\/Support\/details/, {
            logRequestHeaders: false,
            logResponseBody: true,
            stringifyResponseBody: true
        }),
        deleteQueryRecords: RequestLogger({url: /Records\/records\/deletequeryrecords/, method: 'POST'}, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        }),
        queryMetadata: RequestLogger({ url: /Queries\/querymetadata/, method: 'GET' }, {
            logRequestHeaders: true,
            logResponseBody: true,
            stringifyResponseBody: true
        }),
        globalSearchFilterconfig: RequestLogger({ url: /GlobalSearch\/globalsearch\/filterconfig/, method: 'GET' }, {
            logRequestHeaders: true,
            logResponseBody: true,
            stringifyResponseBody: true
        }),
        globalSearch: RequestLogger({ url: /GlobalSearch\/globalsearch/, method: 'GET' }, {
            logRequestHeaders: true,
            logResponseBody: true,
            stringifyResponseBody: true
        }),
        downloadFile: RequestLogger({ url: /Assets\/tempFiles/, method: 'GET' }, {
            logRequestHeaders: true,
            logResponseHeaders: true,
            logResponseBody: true,
            stringifyResponseBody: true
        }),
        // preconditions
        getContentGroupId: RequestLogger(/AdminPortal\/(ContentGroupAdmin\/get\/|.+\/save)/, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        }),
        getProcessId: RequestLogger(/AdminPortal\/(ProcessDesigner\/get\/|.+\/save)/, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        }),
        getQueryGroupId: RequestLogger(/(AdminPortal\/QueryGroups\/getGroupById\/|AdminUI\/administration)/, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        }),
        createCode: RequestLogger({url: `${globalConfig.env.url}/Common/codes-management/codes`, method: 'POST'}, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        }),
        collaborationSubmit: RequestLogger(/Collaboration\/tasks\/.+\/submit/, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        }),
        collaborationReturn: RequestLogger(/Collaboration\/tasks\/.+\/return/, {
            logRequestHeaders: true,
            logResponseBody: true,
            logRequestBody: true,
            stringifyResponseBody: true
        })
    };
    public requestMock = {
        everythingWith500Err: RequestMock().onRequestTo(/http/).respond(null, 500)
    };

    private usersCache = [];
    public currentUser = {
        userType: null,
        userName: null,
        urlItem: null,
        expiration: null,
        role: null
    };

    // Elements
    protected notificationMessage = Selector('.ca-notification-message__container', {timeout: globalConfig.timeout.element});
    protected modalWrapper = Selector('ca-modal');

    // Getters
    get loginPage() {
        return this.createGetter(LoginPage);
    }

    get reportPage() {
        return this.createGetter(ReportPage);
    }

    get header() {
        return this.createGetter(MainHeader);
    }

    get footer() {
        return this.createGetter(MainFooter);
    }

    get naviBar() {
        return this.createGetter(NavigationBar);
    }

    get kendoPopup() {
        return this.createGetter(KendoPopup);
    }

    get modal() {
        return this.createGetter(InfoModal);
    }

    get errorModal() {
        return this.createGetter(ErrorModal);
    }

    get duplicationModal() {
        return this.createGetter(DuplicationModal);
    }

    get processDesignerModal() {
        return this.createGetter(ProcessDesignerModal);
    }

    get queryManagementModal() {
        return this.createGetter(QueryManagementModal);
    }

    get reportModal() {
        return this.createGetter(ReportModal);
    }

    get supportModal() {
        return this.createGetter(SupportModal);
    }

    get emailModal() {
        return this.createGetter(EmailModal);
    }

    get auditHistoryModal() {
        return this.createGetter(AuditHistoryModal);
    }

    get addRuleTypeModal() {
        return this.createGetter(AddRuleTypeModal);
    }

    get globalChangeModal() {
        return this.createGetter(GlobalChangeModal);
    }

    get globalChangeDialog() {
        return this.createGetter(GlobalChangeDialog);
    }

    get codeManagementModal() {
        return this.createGetter(CodeManagementModal);
    }

    get hierarchyModal() {
        return this.createGetter(HierarchyModal);
    }

    get confirmationModal() {
        return this.createGetter(ConfirmationModal);
    }

    get externalFilesModal() {
        return this.createGetter(ExternalFilesModal);
    }

    get addRelationshipsModal() {
        return this.createGetter(AddRelationshipsModal);
    }

    get dataEntryBoard() {
        return this.createGetter(DataEntryBoard);
    }

    get queryBoard() {
        return this.createGetter(QueryBoard);
    }

    get userPreferencesBoard() {
        return this.createGetter(UserPreferencesBoard);
    }

    get clearCacheBoard() {
        return this.createGetter(ClearCacheBoard);
    }

    get reportBoard() {
        return this.createGetter(ReportBoard);
    }

    get contentBoard() {
        return this.createGetter(ContentBoard);
    }

    get collaborationBoard() {
        return this.createGetter(CollaborationBoard);
    }

    get globalSearchBoard() {
        return this.createGetter(GlobalSearchBoard);
    }

    get adminBoard() {
        return this.createGetter(AdminBoard);
    }

    get rulesSummaryBoard() {
        return this.createGetter(RulesSummaryBoard);
    }

    get rulesExportBoard() {
        return this.createGetter(RulesExportBoard);
    }

    get rulesImportBoard() {
        return this.createGetter(RulesImportBoard);
    }

    get adminMenu() {
        return this.createGetter(AdminMenu);
    }

    get formLetterModal() {
        return this.createGetter(FormLetter);
    }

    get exportGlobalSearch() {
        return this.createGetter(ExportGlobalSearchPage);
    }

    get exportHtml() {
        return this.createGetter(ExportHtmlPage);
    }

    // Methods
    public async getNotificationMessage() {
        const message = (await this.notificationMessage.textContent).trim();
        CustomLogger.logger.log('method', `Notification message is '${message}'`);
        return message;
    }

    public setCookie(type: string = 'simple', force: boolean = false) {
        try {
            this.cookieProvider.setCookie(this.requestLogger[type].requests.last().request.headers['cookie'], force);
            CustomLogger.logger.log('method', `Cookie was set correctly`);
        } catch (err) {
            CustomLogger.logger.log('WARN', `Cookie was not set`);
        }
    }

    public resetRequestLogger(type: string = 'simple') {
        if (this.requestLogger[type]) {
            this.requestLogger[type].clear();
            CustomLogger.logger.log('method', `Logger is reset`);
        } else {
            CustomLogger.logger.log('WARN', `Wrong request logger type - '${type}'`);
        }
    }

    public getCookie() {
        return cookieProvider.getCookie();
    }

    public async getPageTitle() {
        const title = await Selector('title').textContent;
        CustomLogger.logger.log('method', `The title of the page is '${title}'`);
        return title;
    }

    public async getCurrentUrl() {
        const url = await ClientFunction(() => window.location.href)();
        CustomLogger.logger.log('method', `The URL of the page is '${url}'`);
        return url;
    }

    public async navigate(url: string = `${globalConfig.env.url}/UI`) {
        CustomLogger.logger.log('method', `Navigate to '${url}'`);
        await t.navigateTo(url);
    }

    public async goRoot(urlItem: string = 'UI/queries') {
        CustomLogger.logger.log('method', `Logged in as using goRoot`);
        let now = parseInt(timeService.today('x'));
        await t.resizeWindow(1280, 720);
        await t.setNativeDialogHandler(() => true);
        // memory.reset();
        let url: string = await this.getCurrentUrl();
        if (globalInfo.executionStartTime + globalConfig.timeout.expiration <= now) {
            await this.signOut();
            await this.waitLoading();
            await this.navigate(`${globalConfig.env.url}/${urlItem}`);
            await this.waitLoading();
            url = await this.getCurrentUrl();
        }
        if (url.includes('logout')) {
            CustomLogger.logger.log('method', `Going from logout`);
            await this.navigate(`${globalConfig.env.url}/${urlItem}`);
            await this.waitLoading();
            url = await this.getCurrentUrl();
        }
        if (url.includes('auth')) {
            CustomLogger.logger.log('method', `Going root with login`);
            await this.loginPage.login(globalConfig.user.userName, globalConfig.user.password);
            await this.waitLoading();
            const newUrl = await this.getCurrentUrl();
            if (!newUrl.includes(urlItem)) {
                await this.navigate(`${globalConfig.env.url}/${urlItem}`);
                await this.waitLoading();
            }
        } else {
            CustomLogger.logger.log('method', `Going root without login`);
            if (!url.includes(urlItem)) {
                await this.navigate(`${globalConfig.env.url}/${urlItem}`);
                await this.waitLoading();
            }
        }
        const noErrors = await this.noErrors();
        if (!noErrors) {
            await this.errorModal.confirm();
        }
    }

    public async goBack() {
        const goBack = ClientFunction(() => window.history.back());
        await goBack();
    }

    public async getRole(userType?: string, urlItem: string = 'UI') {
        CustomLogger.logger.log('method', `Logged in as using roles`);
        const userItems = userType ? userData[userType] : globalConfig.user;
        userType = userItems.userType;
        let now = parseInt(timeService.today('x'));
        let user;
        if (this.currentUser.userType === userType && this.currentUser.urlItem === urlItem) {
            if (this.currentUser.expiration && this.currentUser.expiration >= now) {
                user = this.currentUser;
            }
        } else {
            user = this.usersCache.find((us) => (us && us.userType === userType && us.urlItem === urlItem && us.expiration && us.expiration >= now));
            if (user) {
                this.currentUser = user;
            }
        }
        if (!user) {
            user = {
                userName: userItems.userName,
                userType: userItems.userType,
                urlItem,
                expiration: now + globalConfig.timeout.expiration,
                role: UserRole(`${globalConfig.env.url}/${urlItem}`, async () => {
                    await this.resizeWindow();
                    await t.setNativeDialogHandler(() => true);
                    await this.loginPage.login(userItems.userName, userItems.password);
                    await this.waitLoading();
                }, { preserveUrl: true })
            };
            this.usersCache.push(user);
            this.currentUser = user;
        }
        await t.useRole(user.role);
        CustomLogger.logger.log('method', `Logged in as user: '${user.userName}'`);
        CustomLogger.logger.log('method', `Start URL: ${globalConfig.env.url}/${urlItem}`);
        return user;
    }

    public resetRole(userType: string = globalConfig.user.userType, urlItem: string = 'UI') {
        CustomLogger.logger.log('method', `Remove '${userType}' from cache`);
        if (this.currentUser.userType === userType && this.currentUser.urlItem === urlItem) {
            this.currentUser = {
                userType: null,
                userName: null,
                urlItem: null,
                expiration: null,
                role: null
            };
        }
        this.usersCache = this.usersCache.filter((us) => !(us.userType === userType && us.urlItem === urlItem));
    }

    public async closeNativeDialog() {
        await t.setNativeDialogHandler(() => true);
    }

    public async signOut() {
        await this.header.click('userIcon');
        await this.kendoPopup.selectContentLink('Sign Out');
        this.usersCache.splice(this.usersCache.indexOf(this.currentUser), 1 );
        this.currentUser = {
            userType: null,
            userName: null,
            urlItem: null,
            expiration: null,
            role: null
        };
        await this.waitLoading();
    }

    public async refresh(closeNativeDialog: boolean = false) {
        CustomLogger.logger.log('method', `Refresh the page`);
        if (closeNativeDialog) {
            await this.closeNativeDialog();
        }
        await t.eval(() => location.reload());
        // const url = await this.getCurrentUrl();
        // await this.navigate(url);
        await this.waitLoading();
    }

    public searchAuditKeyToRecordTitle(auditKey: string) {
        return auditKey.replace(/^[A-Za-z0-9]+ (.+):$/, '$1');
    }

    public async addRequestHook(type: string, name: string) {
        const hook = type === 'logger' ? this.requestLogger[name] : this.requestMock[name];
        await t.addRequestHooks(hook);
    }

    public async removeRequestHooks(type: string, name: string) {
        const hook = type === 'logger' ? this.requestLogger[name] : this.requestMock[name];
        await t.removeRequestHooks(hook);
    }

    public getLastRequest(name: string): RequestData {
        if (this.requestLogger[name].requests.length > 0) {
            const index = this.requestLogger[name].requests.length - 1;
            return this.requestLogger[name].requests[index].request;
        }
        return null;
    }

    public getLastRequestBody(name: string) {
        return JSON.parse(this.getLastRequest(name).body);
    }

    public getLastResponse(name: string): ResponseData {
        if (this.requestLogger[name].requests.length > 0) {
            const index = this.requestLogger[name].requests.length - 1;
            return this.requestLogger[name].requests[index].response;
        }
        return null;
    }

    public getLastResponseBody(name: string) {
        return JSON.parse(this.getLastResponse(name).body);
    }

    public async openDataEntryRecord(recordId: number, template: number) {
        await this.navigate(`${globalConfig.env.url}/UI/data-entry-form/${recordId}/template/${template}`);
        await this.waitLoading();
    }

    public async clearCache() {
        await this.navigate(`${globalConfig.env.url}/UI/clear-cache`);
        await this.waitLoading();
        await this.clearCacheBoard.clearEverythingForEveryone();
        await this.goBack();
        await this.waitLoading();
    }

    public async resizeWindow(size: {width?: number, height?: number} = {}) {
        size.width = size.width || 1280;
        size.height = size.height || 720;
        await t.resizeWindow(size.width, size.height);
    }
}
