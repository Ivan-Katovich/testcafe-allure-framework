import { CustomLogger } from '../../support/utils/log';
import CDP = require('chrome-remote-interface');
import {Options} from '../../interfaces';
import _ = require('underscore');
declare const globalConfig: any;
declare const allure: any;

const infrastructureService = {
    name: 'InfrastructureService',

    async step(name, stepFunc, options: Options = {}) {
        if (options.isSkipped) {
            CustomLogger.logger.log('WARN', `'${name}' skipped`);
        } else {
            CustomLogger.logger.log('step', `'${name}' starts`);
            try {
                await (allure.createStep(name, async () => {
                    await stepFunc();
                }))();
            } catch (err) {
                CustomLogger.logger.log('ERROR', `'${name}' finished with error`);
                throw err;
            }
            CustomLogger.logger.log('step', `'${name}' successfully finished `);
        }
    },

    async doTill(doCallback, tillCallback, iterations: number = 20) {
        let i: number = 0;
        async function doRecursion() {
            const is = await tillCallback();
            if (is) {
                await doCallback();
                i++;
                if (i < iterations) {
                    await doRecursion();
                }
            }
        }
        await doRecursion();
    },

    clone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    },

    changeProperty(obj: {}, propertyPath: string, value: any) {
        if (typeof value === 'string') {
            value = `'${value}'`;
        } else if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        (new Function('obj', `if (obj.${propertyPath} !== undefined) {obj.${propertyPath} = ${value}} else {throw new Error('Wrong property path')}`))(obj);
    },

    getProperty(obj: {}, propertyPath: string) {
        return (new Function('obj', `if (obj.${propertyPath} !== undefined) { return obj.${propertyPath}; } else {throw new Error('Wrong property path')}`))(obj);
    },

    runInfo() {
        CustomLogger.logger.log('WARN', `TEST EXECUTION INFO`);
        CustomLogger.logger.log('WARN', `Application Version: ${globalConfig.version}`);
        CustomLogger.logger.log('WARN', `Suite: ${globalConfig.suite}`);
        CustomLogger.logger.log('WARN', `Browser: ${globalConfig.browser}`);
        CustomLogger.logger.log('WARN', `Client: ${globalConfig.env.client}`);
        CustomLogger.logger.log('WARN', `Environment: ${globalConfig.env.name}`);
        CustomLogger.logger.log('WARN', `Auth Type: ${globalConfig.authType}`);
        CustomLogger.logger.log('WARN', `User: ${globalConfig.user.userName}`);
        CustomLogger.logger.log('WARN', `Database: ${globalConfig.database ? globalConfig.database.database : undefined}`);
        CustomLogger.logger.log('WARN', `Is Brief: ${globalConfig.brief}`);
        CustomLogger.logger.log('WARN', `Is Quarantine: ${globalConfig.quarantine}`);
        CustomLogger.logger.log('WARN', `Is Headless: ${globalConfig.headless}`);
        CustomLogger.logger.log('WARN', `Is Parallel: ${globalConfig.parallel}`);
        CustomLogger.logger.log('WARN', `Thread: ${globalConfig.thread}`);
        CustomLogger.logger.log('WARN', `Category: ${globalConfig.category}`);
        CustomLogger.logger.log('WARN', `Fixture: ${globalConfig.fixture}`);
        CustomLogger.logger.log('WARN', `Test: ${globalConfig.test}
        `);
    },

    async enableDownloadForHeadlessChrome() {
        if (process.env.npm_config_headless === 'true' && process.env.npm_config_browser === 'chrome') {
            CustomLogger.logger.log('WARN', `Chrome runs in headless mode with allowed file downloading`);
            const client = await CDP();
            const { Network, Page } = client;
            await Promise.all([
                Network.enable(),
                Page.enable()
            ]);
            Network.requestWillBeSent((param) => {
                // console.log("Network.requestWillBeSent: " + JSON.stringify(param));
            });
            Network.responseReceived((param) => {
                // console.log("Network.responseReceived: " + JSON.stringify(param));
            });
            await Page.setDownloadBehavior({
                behavior:     'allow',
                downloadPath: `${process.env.USERPROFILE}\\Downloads`
            });
        }
    },

    * propertiesGenerator(properties: any[], childMassiveName: string) {
        for (let property of properties) {
            yield property;
            if (property[childMassiveName] && property[childMassiveName].length) {
                yield* this.propertiesGenerator(property[childMassiveName], childMassiveName);
            }
        }
    },

    underscore: _
};

export default infrastructureService;
