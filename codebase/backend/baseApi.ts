import Axios, { AxiosResponse } from 'axios';
import { CustomLogger } from './../support/utils/log';
import timeService from './../services/entries/timeService';
import * as loginHelper from './api/DPAuthentication/loginHelper';
import * as loginHelperEnt from './api/DPAuthentication/loginHelperEnt';
import { Options } from '../interfaces';
declare const globalConfig: any;
const userData = require('../configuration/data/users');

export default class BaseAPI {
    constructor(cookieProvider) {
        this.axios.defaults.baseURL = globalConfig.env.url;
        this.axios.defaults.headers.common['content-type'] = 'application/json';
        this.axios.defaults.headers.common['Cookie'] = cookieProvider.getCookie();
        this.cookieProvider = cookieProvider;
    }
    protected axios = Axios;
    protected cookieProvider;

    protected objectsArray = [];
    protected currentObject = null;

    public async login(user: string = null): Promise<string> {
        const username = user ? userData[user].userName : globalConfig.user.userName;
        const password = user ? userData[user].password : globalConfig.user.password;
        try {
            let cookie: string;
            if (globalConfig.authType === 'enterprise') {
                cookie = await loginHelperEnt.getUserCookie(username, password, globalConfig.env.url);
            } else {
                cookie = await loginHelper.getUserCookie(username, password, globalConfig.env.url);
            }
            this.setCookie(cookie);
            CustomLogger.logger.log('method', `login request is completed successfully for user "${username}"`);
            return cookie;
        } catch (err) {
            CustomLogger.logger.log('WARN', `login request is completed with Error: ${err}`);
            return null;
        }
    }

    //#region protected

    protected setCookie(cookie: string): void {
        this.cookieProvider.setCookie(cookie);
        this.axios.defaults.headers.common['Cookie'] = cookie;
    }

    protected createGetter<T>(Constructor: new(...args: any[]) => T, ...param: any[]): T {
        let obj: T;
        if (this.currentObject && this.currentObject.constructor === Constructor) {
            obj = this.currentObject;
        } else {
            obj = this.objectsArray.find((obj) => obj.constructor === Constructor);
            this.currentObject = obj;
        }
        if (!obj) {
            obj = new Constructor(...param);
            this.objectsArray.push(obj);
            this.currentObject = obj;
        }
        return obj;
    }

    protected async get(url: string, params: object = null, options: Options = {}): Promise<AxiosResponse> {
        if (!this.cookieProvider.getCookie()) {
            await this.login();
        }
        const req = {
            method: 'GET',
            url,
            params
        };
        try {
            const resp = await this.axios(req);
            CustomLogger.logger.log('method', `GET ${url} request is completed with status code ${resp.status}`);
            return resp;
        } catch (error) {
            CustomLogger.logger.log('WARN', `GET ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
            if (error.response.status === 401) {
                CustomLogger.logger.log('WARN', `GET ${url} request: retry after relogin`);
                await this.login();
            } else {
                if (options.retry) {
                    CustomLogger.logger.log('WARN', `GET ${url} request: retry after timeout ${globalConfig.timeout.request}ms`);
                    await timeService.sleep(globalConfig.timeout.request);
                } else {
                    return null;
                }
            }
            try {
                const resp = await this.axios(req);
                CustomLogger.logger.log('method', `GET ${url} request is completed with status code ${resp.status}`);
                return resp;
            } catch (error) {
                CustomLogger.logger.log('WARN', `GET ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
                return null;
            }
        }
    }

    protected async post(url: string, body: object, options: Options = {}): Promise<AxiosResponse> {
        if (!this.cookieProvider.getCookie()) {
            await this.login();
        }
        const req = {
            method: 'POST',
            url,
            data: body
        };
        try {
            const resp = await this.axios(req);
            CustomLogger.logger.log('method', `POST ${url} request is completed with status code ${resp.status}`);
            return resp;
        } catch (error) {
            CustomLogger.logger.log('WARN', `POST ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
            if (error.response.status === 401) {
                CustomLogger.logger.log('WARN', `POST ${url} request: retry after relogin`);
                await this.login();
            } else {
                if (options.retry) {
                    CustomLogger.logger.log('WARN', `POST ${url} request: retry after timeout ${globalConfig.timeout.request}ms`);
                    await timeService.sleep(globalConfig.timeout.request);
                } else {
                    return null;
                }
            }
            try {
                const resp = await this.axios(req);
                CustomLogger.logger.log('method', `POST ${url} request is completed with status code ${resp.status}`);
                return resp;
            } catch (error) {
                CustomLogger.logger.log('WARN', `POST ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
                return null;
            }
        }
    }

    protected async put(url: string, body: object, options: Options = {}): Promise<AxiosResponse> {
        if (!this.cookieProvider.getCookie()) {
            await this.login();
        }
        const req = {
            method: 'PUT',
            url,
            data: body
        };
        try {
            const resp = await this.axios(req);
            CustomLogger.logger.log('method', `PUT ${url} request is completed with status code ${resp.status}`);
            return resp;
        } catch (error) {
            CustomLogger.logger.log('WARN', `PUT ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
            if (error.response.status === 401) {
                CustomLogger.logger.log('WARN', `PUT ${url} request: retry after relogin`);
                await this.login();
            } else {
                if (options.retry) {
                    CustomLogger.logger.log('WARN', `PUT ${url} request: retry after timeout ${globalConfig.timeout.request}ms`);
                    await timeService.sleep(globalConfig.timeout.request);
                } else {
                    return null;
                }
            }
            try {
                const resp = await this.axios(req);
                CustomLogger.logger.log('method', `PUT ${url} request is completed with status code ${resp.status}`);
                return resp;
            } catch (error) {
                CustomLogger.logger.log('WARN', `PUT ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
                return null;
            }
        }
    }

    protected async delete(url: string, options: Options = {}): Promise<AxiosResponse> {
        if (!this.cookieProvider.getCookie()) {
            await this.login();
        }
        const req = {
            method: 'DELETE',
            url
        };
        try {
            const resp = await this.axios(req);
            CustomLogger.logger.log('method', `DELETE ${url} request is completed with status code ${resp.status}`);
            return resp;
        } catch (error) {
            CustomLogger.logger.log('WARN', `DELETE ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
            if (error.response.status === 401) {
                CustomLogger.logger.log('WARN', `DELETE ${url} request: retry after relogin`);
                await this.login();
            } else {
                if (options.retry) {
                    CustomLogger.logger.log('WARN', `DELETE ${url} request: retry after timeout ${globalConfig.timeout.request}ms`);
                    await timeService.sleep(globalConfig.timeout.request);
                } else {
                    return null;
                }
            }
            try {
                const resp = await this.axios(req);
                CustomLogger.logger.log('method', `DELETE ${url} request is completed with status code ${resp.status}`);
                return resp;
            } catch (error) {
                CustomLogger.logger.log('WARN', `DELETE ${url} request is completed with status code ${error.response.status}, cause ${JSON.stringify(error.response.data)}`);
                return null;
            }
        }
    }

    //#endregion
}
