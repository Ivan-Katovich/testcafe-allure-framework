import { CustomLogger } from '../../support/utils/log';
import moment = require('moment');
import {Options} from '../../interfaces';
declare const globalConfig: any;

const timeService = {
    name: 'TimeService',

    moment,

    getSeconds(date, options: Options = {}) {
        const offset = options.reduceOffset ? moment().utcOffset() * 60 : 0;
        const seconds = parseInt(moment(date, options.pattern).format('X')) - offset;
        CustomLogger.logger.log('method', `Date "${date}" contains ${seconds} seconds ${options.reduceOffset ? ` with offset ${offset} sec` : ''}`);
        return seconds;
    },

    timestamp() {
        return moment().format('DD/MM/YY_HH:mm:ss');
    },

    today(format: string) {
        return moment().format(format);
    },

    tomorrow(format: string) {
        return moment().add(1, 'day').format(format);
    },

    yesterday(format: string) {
        return moment().add(-1, 'day').format(format);
    },

    startOfWeek(format: string) {
        return moment().startOf('week').format(format);
    },

    startOfMonth(format: string) {
        return moment().startOf('month').format(format);
    },

    timestampShort() {
        return moment().utc().format('DDMMHHmmss');
    },

    timestampShortWithMilliseconds() {
        return moment().utc().format('DDMMHHmmssSS');
    },

    getDate() {
        return moment().format('MM/DD/YYYY');
    },

    matchDateFormat(dateValue: string, stringDateFormat: string) {
        let result = moment(dateValue, stringDateFormat, true).isValid();
        CustomLogger.logger.log('method', `The date value ${result ? 'matches' : 'does not match'} format ${stringDateFormat}.`);
        return result;
    },

    format(value: string, format: string, options: Options = {}): string {
        return moment(value, options.pattern).format(format);
    },

    sleep(timeout = 10000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // console.log(`sleep ${timeout} ms`);
                resolve();
            }, timeout);
        });
    },

    toLocal(dateValue: string, format: string = 'MM/DD/YYYY HH:mm:ss'): string {
        return moment.utc(dateValue).local().format(format);
    },

    wait(callback, options: Options = {}) {
        const start = Date.now();
        const timeout = options.timeout || 10000;
        const interval = options.interval || 200;
        const waitCallback = async () => {
            let state;
            try {
                state = await callback();
            } catch (err) {
                // console.log(err.message);
                state = false;
            }
            const delta = Date.now() - start;
            if (state) {
                return true;
            } else if (delta > timeout) {
                CustomLogger.logger.log('WARN', `Wait fails because of timeout = ${timeout}`);
                return false;
            } else {
                await this.sleep(interval);
                return waitCallback();
            }
        };
        return waitCallback();
    },

    parseDate(dateValue: string, format: string = 'MM/DD/YYYY HH:mm:ss') {
        return moment(dateValue, format, true);
    }
};

export default timeService;
