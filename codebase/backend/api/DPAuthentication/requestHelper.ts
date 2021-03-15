import Axios from 'axios';
import { CustomLogger } from '../../../support/utils/log';
const cookieHelper = require('./cookieHelper');
declare const globalConfig: any;

export async function get(url: string, params: object = null) {
    try {
        let axios = Axios;
        const resp = await axios({
            baseURL: globalConfig.env.url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookieHelper.cookieStorage.userCookie
                },
            url,
            params
        });
        CustomLogger.logger.log('method', `GET ${url} request is completed with status code ${resp.status}`);
        return resp;
    } catch (error) {
        CustomLogger.logger.log('WARN', `GET ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
        return null;
    }
}

export async function post(url: string, body: object) {
    try {
        let axios = Axios;
        const resp = await axios({
            baseURL: globalConfig.env.url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookieHelper.cookieStorage.userCookie
                },
            url,
            data: body
        });
        CustomLogger.logger.log('method', `POST ${url} request is completed with status code ${resp.status}`);
        return resp;
    } catch (error) {
        CustomLogger.logger.log('WARN', `POST ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
        return null;
    }
}

export async function put(url: string, body: object) {
    try {
        let axios = Axios;
        const resp = await axios({
            baseURL: globalConfig.env.url,
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookieHelper.cookieStorage.userCookie
                },
            url,
            data: body
        });
        CustomLogger.logger.log('method', `PUT ${url} request is completed with status code ${resp.status}`);
        return resp;
    } catch (error) {
        CustomLogger.logger.log('WARN', `PUT ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
        return null;
    }
}
