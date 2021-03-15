import Axios from 'axios';
import { CustomLogger } from '../../../support/utils/log';
const decode = require('unescape');
const cookieHelper = require('./cookieHelper');

export async function getAsync(options) {
    try {
        let axios = Axios;
        const resp = await axios({
            ...options,
            method: 'GET',
            maxRedirects: 0,
            validateStatus: (status) => {
                return true;
            }
        });
        const cookies = cookieHelper.getCookies(resp);
        if (cookies) {
            cookieHelper.addCookiesToStorage(cookies);
        }
        CustomLogger.logger.log('method', `GET ${options.url} request is completed with status code ${resp.status}`);
        return resp;
    } catch (error) {
        CustomLogger.logger.log('WARN', `GET ${options.url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
        return null;
    }
}

export async function postAsync(options, body) {
    try {
        let axios = Axios;
        const resp = await axios({
            ...options,
            method: 'POST',
            data: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'cookie': options.headers.cookie
                },
            maxRedirects: 0,
            validateStatus: (status) => {
                return true;
            }
        });
        const cookies = cookieHelper.getCookies(resp);
        if (cookies) {
            cookieHelper.addCookiesToStorage(cookies);
        }
        CustomLogger.logger.log('method', `POST ${options.url} request is completed with status code ${resp.status}`);
        return resp;
    } catch (error) {
        CustomLogger.logger.log('WARN', `POST ${options.url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
        return null;
    }
}

export function getHiddenInputValue(body, propertyName) {
    return body.match(new RegExp(`<input type=\"hidden\" name=\"${propertyName}\" value=\"(.*)\" \.+\/>`))[1];
}

export function getInputValue(body, propertyName, options) {
    let value = body.match(new RegExp(`name=\"${propertyName}\"[^>]*value=\"([^"]*)\"`))[1];
    if (options && options.decode) {
        value = decode(value);
    }
    return value;
}
