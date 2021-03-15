const localeCurrency = require('locale-currency');
const intl = require('intl');

const cultureService = {
    name: 'CultureService',

    getCurrencyCodeByLocale(locale: string): string {
        return localeCurrency.getCurrency(locale);
    },

    getCurrencySymbolByLocale(locale: string): string {
        const numberFormat = new intl.NumberFormat(locale, { style: 'currency', currencyDisplay: 'symbol', currency: localeCurrency.getCurrency(locale) });
        const parts = numberFormat.formatToParts(0);

        return parts.find((x) => x.type === 'currency').value;
    },

    getCurrencySymbolByCode(currencyCode: string): string {
        return CurrencySymbols[currencyCode].symbol;
    },

    getCurrencyCodeByType(currencyType: string): string {
        return CurrencyType[currencyType];
    },

    removeCurrencySymbolByCode(value: string, currencyCode: string): string {
        let symbol = this.getCurrencySymbolByCode(currencyCode);
        return value.replace(symbol, '').trim();
    },

    removeCurrencySymbolByLocale(value: string, locale: string): string {
        let symbol = this.getCurrencySymbolByLocale(locale);
        return value.replace(symbol, '').trim();
    },

    numberToDecimalFormat(value: number, locale: string = 'en-US'): string {
        const numberFormat = new intl.NumberFormat(locale, { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return numberFormat.format(value);
    },

    numberToMoneyFormat(value: number, locale: string = 'en-US', currencyCode: string): string {
        const format = { ...CurrencySymbols[currencyCode].format, style: 'currency', currencyDisplay: 'symbol', currency: currencyCode };
        const numberFormat = new intl.NumberFormat(locale, format);
        let localeValue: string = numberFormat.format(value);

        const parts = numberFormat.formatToParts(0);
        const currency = parts.find((x) => x.type === 'currency').value;
        localeValue = localeValue.replace(currency, CurrencySymbols[currencyCode].symbol);

        return localeValue;
    }
};

export default cultureService;

enum CurrencyType {
    'Australia, Dollars' = 'AUD',
    'Canada, Dollar' = 'CAD',
    'China, Yuan Renminbi' = 'CNY',
    'Denmark, Krone' = 'DKK',
    'Euro' = 'EUR',
    'Hong Kong Dollars' = 'HKD',
    'India, Rupees' = 'INR',
    'Japan, Yen' = 'JPY',
    'Malawi, Kwacha' = 'MWK',
    'Malaysia, Ringgit' = 'MYR',
    'Malta, Lira' = 'MTL',
    'Mexican Peso' = 'MXN',
    'New Zealand, Dollar' = 'NZD',
    'Norway, Krone' = 'NOK',
    'Polish zlotys' = 'PLN',
    'Singapore, Dollar' = 'SGD',
    'South Africa, Rand' = 'ZAR',
    'South Korea' = 'KRW',
    'Sweden, Krona' = 'SEK',
    'Switzerland, Franc' = 'CHF',
    'Taiwan, Dollar' = 'TWD',
    'United Kingdom, Pound' = 'GBP',
    'United States, Dollar' = 'USD'
}

const CurrencySymbols = {
    'AUD': { symbol: '$', format: { minimumFractionDigits: 2, maximumFractionDigits: 2} },
    'CAD': { symbol: '$', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'CNY': { symbol: '¥', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'DKK': { symbol: 'kr', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'EUR': { symbol: '€', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'HKD': { symbol: '$', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'INR': { symbol: '₹', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'JPY': { symbol: '¥', format: { maximumFractionDigits: 0 } },
    'MWK': { symbol: 'MWK', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'MYR': { symbol: 'RM', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'MTL': { symbol: 'MTL', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'MXN': { symbol: '$', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'NZD': { symbol: '$', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'NOK': { symbol: 'kr', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'PLN': { symbol: 'zł', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'SGD': { symbol: '$', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'ZAR': { symbol: 'R', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'KRW': { symbol: '₩', format: { maximumFractionDigits: 0 } },
    'SEK': { symbol: 'kr', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'CHF': { symbol: 'CHF', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'TWD': { symbol: '$', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'GBP': { symbol: '£', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    'USD': { symbol: '$', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } }
};
