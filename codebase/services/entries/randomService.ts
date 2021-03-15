import { CustomLogger } from '../../support/utils/log';
declare const globalConfig: any;

const randomService = {
    name: 'RandomService',

    num(start: number = 1000, end: number = 9999): number {
        return Math.round(start + Math.random() * (end - start));
    },

    decimal(integerDigits: number, fractionDigits: number): number {
        const digits = integerDigits + fractionDigits;
        const start = Math.pow(10, digits - 1);
        const end = Math.pow(10, digits) - 1;
        return Math.round(start + Math.random() * (end - start)) / Math.pow(10, fractionDigits);
    },

    str(length: number = 10): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    letters(length: number = 10): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
};

export default randomService;
