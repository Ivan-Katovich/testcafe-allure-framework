const regexService = {
    name: 'RegexService',

    containsLetters(text: string): boolean {
        return /.*[a-zA-Z].*$/.test(text);
    },

    containsSpecialSymbols(text: string): boolean {
        return /[~`!@#$%^&*()_+=\-}{[\]|;\'?><,.’/"]+$/.test(text);
    },

    containsNumbers(text: string): boolean {
        return /[0-9]+$/.test(text);
    },

    getFirstSpecialSymbol(text: string): string {
        return text.match(/[~`!@#$%^&*()_+=\-}{[\]|;\'?><,.’/"]$/)[0];
    },

    getFirstNumber(text: string): string {
        return text.match(/[0-9]+$/)[0];
    },

    replaceNbspWithSpace(text: string): string { // &nbsp; = non-breaking space in HTML
        return text.replace(/(\xa0)/gi, ' ');
    }
};

export default regexService;
