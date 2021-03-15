import { CustomLogger } from '../../support/utils/log';
declare const globalConfig: any;
const intl = require('intl');

// NOTE: English locale is usually the only one working in node.js with the default 'small-icu'
// For other locales install full-icu and run via 'node --icu-data-dir=node_modules/full-icu YOURAPP.js'

const numericService = {
    name: 'NumericService',

    addThousandsSeparators(number: number, locale: string = 'en-US', min: number = 0, max: number = 20) {
        return number.toLocaleString(locale, {minimumFractionDigits: min, maximumFractionDigits: max, useGrouping: true });
    },

    removeThousandsSeparators(number: number, locale: string = 'en-US', min: number = 0, max: number = 20) {
        return number.toLocaleString(locale, { minimumFractionDigits: min, maximumFractionDigits: max, useGrouping: false });
    },

    removeAllSeparators(number: number, locale: string = 'en-US', min: number = 0, max: number = 20) {
        return number.toLocaleString(locale, {minimumFractionDigits: min, maximumFractionDigits: max}).replace(/[^\d\-]/g, '');
    },

    parseGridValues(value: string, option: string = 'float') {
        if (option === 'int') {
            return parseInt(value.replace(/\(/g, '-').replace(/[^\d\.\-]/g, '')); // for locales with "." as a decimal separator
        } else {
            return parseFloat(value.replace(/\(/g, '-').replace(/[^\d\.\-]/g, '')); // for locales with "." as a decimal separator
        }

    },

    parseToNumber(value: string): number {
        value = value.replace(/,/g, '');  // for locales with "." as a decimal separator
        const negativeAmountPattern = /^\(\$?[\d,\.]*\)$/;

        if (value.match(negativeAmountPattern)) {
            return Number('-' + value.replace(/[\(\$\),]/g, ''));
        } else if (value.includes('$')) {
            return Number(value.replace('$', ''));
        } else {
            return Number(value);
        }
    },

    toLocaleString(value: number, locale: string = 'en-US', format: Intl.NumberFormatOptions): string {
        const numberFormat = new intl.NumberFormat(locale, format);

        return numberFormat.format(value);
    },

    truncate(value: number, fractionDigits: number): number {
        return Math.trunc(value * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
    }

};

export default numericService;
