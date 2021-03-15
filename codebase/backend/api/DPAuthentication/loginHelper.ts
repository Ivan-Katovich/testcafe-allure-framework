const querystring = require('querystring');
const httpHelper = require('./httpHelper');
const cookieHelper = require('./cookieHelper');

export async function getUserCookie(userName, password, baseUrl) {
    const url = new URL(`${baseUrl}/UI/`);
    const cookieNames = {
        idsrvXsrf: 'idsrv.xsrf',
        signInMessage: 'SignInMessage',
        tempUserName: 'TempUserName',
        idsrv: 'idsrv=',
        idsvrSession: 'idsvr.session',
        authUserName: 'Auth.UserName',
        ipmsIpm: 'ipms.ipm',
        clientcode: 'ipms.ipm.clientcode',
        currentuserinfo: 'ipms.ipm.currentuserinfo'
    };

    const options = {
        baseURL: url.origin,
        url: url.pathname,
        headers: {
            cookie: [],
            accept: 'text/html,application/xhtml+xml,application/xml',
            'content-type': 'application/json,text/html; charset=utf-8'
        }
    };

    let response = await httpHelper.getAsync(options);

    const authConnectUrl = new URL(response.headers.location);
    const authOptions = JSON.parse(JSON.stringify(options));
    authOptions.params = querystring.parse(authConnectUrl.searchParams.toString());
    authOptions.url = authConnectUrl.pathname;
    response = await httpHelper.getAsync(authOptions);
    cookieHelper.createCookieProperty(cookieNames.signInMessage);

    const signInUrl = new URL(response.headers.location);
    const signInOptions = JSON.parse(JSON.stringify(options));
    signInOptions.headers.cookie = [cookieHelper.cookieStorage[cookieNames.signInMessage]];
    signInOptions.params = querystring.parse(signInUrl.searchParams.toString());
    signInOptions.url = signInUrl.pathname;
    response = await httpHelper.getAsync(signInOptions);
    cookieHelper.createCookieProperty(cookieNames.idsrvXsrf);

    const idsrvXsrfFromBody = httpHelper.getHiddenInputValue(response.data, cookieNames.idsrvXsrf);
    const loginProviderOptions = JSON.parse(JSON.stringify(signInOptions));
    loginProviderOptions.headers.cookie = [
        cookieHelper.cookieStorage[cookieNames.signInMessage],
        cookieHelper.cookieStorage[cookieNames.idsrvXsrf]
    ];
    loginProviderOptions.params['userName'] = userName;
    loginProviderOptions.url = '/auth/Account/LoginProviders';
    response = await httpHelper.getAsync(loginProviderOptions);
    cookieHelper.createCookieProperty(cookieNames.tempUserName);

    signInOptions.headers.cookie = [
        cookieHelper.cookieStorage[cookieNames.tempUserName],
        cookieHelper.cookieStorage[cookieNames.signInMessage],
        cookieHelper.cookieStorage[cookieNames.idsrvXsrf]
    ];
    let body = querystring.stringify({
        'idsrv.xsrf': idsrvXsrfFromBody,
        username: userName,
        password,
        btnLoginSubmit: 'Sign in'
    });
    response = await httpHelper.postAsync(signInOptions, body);
    cookieHelper.createCookieProperty(cookieNames.idsrv);
    cookieHelper.createCookieProperty(cookieNames.idsvrSession);

    authOptions.headers.cookie = [
        cookieHelper.cookieStorage[cookieNames.tempUserName],
        cookieHelper.cookieStorage[cookieNames.idsrvXsrf],
        cookieHelper.cookieStorage[cookieNames.idsrv],
        cookieHelper.cookieStorage[cookieNames.idsvrSession]
    ];
    response = await httpHelper.getAsync(authOptions);
    cookieHelper.createCookieProperty(cookieNames.authUserName);

    body = querystring.stringify({
        code: httpHelper.getHiddenInputValue(response.data, 'code'),
        state: httpHelper.getHiddenInputValue(response.data, 'state')
    });
    options.headers.cookie = [cookieHelper.cookieStorage[cookieNames.authUserName]];
    response = await httpHelper.postAsync(options, body);
    cookieHelper.createCookieProperty(cookieNames.ipmsIpm);

    const loginUrl = new URL(response.headers.location);
    options.headers.cookie = [cookieHelper.cookieStorage[cookieNames.ipmsIpm]];
    response = await httpHelper.getAsync({ ...options, url: loginUrl.pathname });
    cookieHelper.createCookieProperty(cookieNames.clientcode);

    options.headers.cookie = [
        cookieHelper.cookieStorage[cookieNames.authUserName],
        cookieHelper.cookieStorage[cookieNames.ipmsIpm],
        cookieHelper.cookieStorage[cookieNames.clientcode]
    ];
    response = await httpHelper.getAsync({ ...options, url: `${options.url.replace('/UI', '')}/UsersManagement/Users/current/`});
    cookieHelper.createCookieProperty(cookieNames.currentuserinfo);

    cookieHelper.cookieStorage.userCookie = [
        cookieHelper.cookieStorage[cookieNames.authUserName],
        cookieHelper.cookieStorage[cookieNames.ipmsIpm],
        cookieHelper.cookieStorage[cookieNames.clientcode],
        cookieHelper.cookieStorage[cookieNames.currentuserinfo]
    ].join('; ');

    return cookieHelper.cookieStorage.userCookie;
}
