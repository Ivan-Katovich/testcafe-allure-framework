const queryString = require('query-string');
const httpHelper = require('./httpHelper');
declare const globalConfig: any;

export async function getUserCookie(userName, password, baseUrl) {
    let url = new URL(`${baseUrl}/UI/`);
    let resp;
    let html;
    let cookie;
    let bodyObj;
    let body;
    const options = {
        baseURL: url.origin,
        url: url.pathname,
        headers: {
            cookie: [],
            accept: 'text/html,application/xhtml+xml,application/xml',
            'content-type': 'application/json,text/html; charset=utf-8'
        }
    };

    // A GET request to base URL and prepare login URL
    resp = await httpHelper.getAsync(options);

    url = new URL(resp.headers.location);

    options.baseURL = url.origin;
    options.url = `${url.pathname}${url.search}`;

    // The first GET request to login URL and prepare Web Form data for next one
    resp = await httpHelper.getAsync(options);

    html = resp.data;

    let viewStateValue = httpHelper.getInputValue(html, '__VIEWSTATE');
    let viewStateGeneratorValue = httpHelper.getInputValue(html, '__VIEWSTATEGENERATOR');
    let eventValidationValue = httpHelper.getInputValue(html, '__EVENTVALIDATION');

    bodyObj = {
        '__EVENTTARGET': 'ctl00$MainContent$SettingsAnchor',
        '__EVENTARGUMENT': '',
        '__VIEWSTATE': viewStateValue,
        '__VIEWSTATEGENERATOR': viewStateGeneratorValue,
        '__EVENTVALIDATION': eventValidationValue,
        'ctl00$MainContent$UserNameTextBox': '',
        'ctl00$MainContent$PasswordTextBox': ''

    };
    body = queryString.stringify(bodyObj);

    // The first POST request to login URL and prepare Web Form data for next one
    resp = await httpHelper.postAsync(options, body);

    html = resp.data;
    viewStateValue = httpHelper.getInputValue(html, '__VIEWSTATE');
    viewStateGeneratorValue = httpHelper.getInputValue(html, '__VIEWSTATEGENERATOR');
    eventValidationValue = httpHelper.getInputValue(html, '__EVENTVALIDATION');

    bodyObj = {
        '__EVENTTARGET': '',
        '__EVENTARGUMENT': '',
        '__VIEWSTATE': viewStateValue,
        '__VIEWSTATEGENERATOR': viewStateGeneratorValue,
        '__EVENTVALIDATION': eventValidationValue,
        'ctl00$MainContent$UserNameTextBox': userName,
        'ctl00$MainContent$PasswordTextBox': password,
        'ctl00$MainContent$DatabaseTypeDropDownList': 'SQL',
        'ctl00$MainContent$ServerTextBox': globalConfig.database.server,
        'ctl00$MainContent$DatabaseTextBox': globalConfig.database.database,
        'ctl00$MainContent$SignInButton': 'Login'

    };
    body = queryString.stringify(bodyObj);

    // The second POST request to login URL and prepare data Web Form for next one
    resp = await httpHelper.postAsync(options, body);

    html = resp.data;

    const waValue = httpHelper.getInputValue(html, 'wa', {decode: true});
    const wresultValue = httpHelper.getInputValue(html, 'wresult', {decode: true});
    const wctxValue = httpHelper.getInputValue(html, 'wctx', {decode: true});

    bodyObj = {
        'wa': waValue,
        'wresult': wresultValue,
        'wctx': wctxValue
    };
    body = queryString.stringify(bodyObj);

    url = new URL(`${baseUrl}/UI/`);
    options.baseURL = url.origin;
    options.url = url.pathname;

    // A POST request to base URL and prepare necessary cookies
    resp = await httpHelper.postAsync(options, body);

    cookie = resp.headers['set-cookie'];
    const cookieArch = [...cookie];

    url = new URL(`${baseUrl}/UsersManagement/Users/current/`);
    options.baseURL = url.origin;
    options.url = url.pathname;
    options.headers.cookie = cookie;

    // A POST request to base URL and receive LOGIN COOKIES
    resp = await httpHelper.getAsync(options);

    cookie = resp.headers['set-cookie'];
    if (!cookie.some((c) => c.includes('ipms.ipm='))) {
        cookie = [...cookie, ...cookieArch];
    }

    return cookie.join('; ');
}
