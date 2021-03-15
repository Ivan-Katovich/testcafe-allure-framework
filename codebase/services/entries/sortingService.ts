import { CustomLogger } from '../../support/utils/log';
import infrastructureService from './infrastructureService';
declare const globalConfig: any;

enum SortDirection {
    'asc',
    'desc'
}

const sortingService = {
    name: 'SortingService',
    sortDirection: SortDirection,

    appSort(a, b) {
        if (typeof a === 'boolean' && typeof b === 'boolean') {
            return a === b ? 0 : a === true && b === false ? 1 : -1;
        }
        return a === '' ? -1 : b === '' ? 1 : a.localeCompare(b, 'kf', {numeric: true});
    },

    appSortLocal(a, b) {
        return a.localeCompare(b, 'en', {numeric: false});
    },

    appSortEmptyToEnd(a, b) {
        return a === '' ? 1 : b === '' ? -1 : 0;
    },

    arrayAsSet<T>(array: T[]): T[] {
        const set = new Set(array);
        return Array.from(set.values());
    },

    appSortAlphabetically(a: string, b: string): number {
        return a.toLowerCase() > b.toLowerCase() ? 1 : a.toLowerCase() < b.toLowerCase() ? -1 : 0;
    },

    sortByNumericProperty(array: any[], propertyName: string, direction: SortDirection): any[] {
        let sortedArray: number[];
        if (direction === SortDirection.desc) {
            sortedArray = array.sort((a, b) => b[propertyName] - a[propertyName]);
        } else {
            sortedArray = array.sort((a, b) => a[propertyName] - b[propertyName]);
        }
        return sortedArray;
    },

    sortByLength(array: string[], direction: SortDirection): string[] {
        let sortedArray: string[];
        if (direction === SortDirection.desc) {
            sortedArray = array.sort((a, b) => b.length - a.length);
        } else {
            sortedArray = array.sort((a, b) => a.length - b.length);
        }
        return sortedArray;
    },

    sortBy<T>(array: T[], property: string): T[] {
        return infrastructureService.underscore.sortBy(array, property);
    }
};

export default sortingService;
