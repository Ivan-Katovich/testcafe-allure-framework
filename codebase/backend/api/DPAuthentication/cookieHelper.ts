import { CustomLogger } from '../../../support/utils/log';

export const cookieStorage = {
    cookies: [],
    userCookie: null
};

export function getCookies(response) {
    return response.headers['set-cookie'];
}

export function addCookiesToStorage(cookie) {
    let separatedCookies = separateCookie(cookie);
    for (const cookie of separatedCookies) {
        if (!cookieStorage.cookies.includes(cookie)) {
            cookieStorage.cookies.push(cookie);
        }
    }
}

export function createCookieProperty(name) {
    cookieStorage.cookies
        .filter((cookie) => cookie.includes(name))
        .forEach((cookie) => cookieStorage[name] = cookie);

    if (!cookieStorage[name]) {
        CustomLogger.logger.log('WARN', `Cookie that includes "${name}" was not returned with any response.`);
    }
}

function separateCookie(cookies) {
    const separator = '; ';
    return cookies.join(separator).split(separator);
}
