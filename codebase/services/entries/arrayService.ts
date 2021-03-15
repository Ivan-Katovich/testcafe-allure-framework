import { CustomLogger } from '../../support/utils/log';
import sortingService from './sortingService';
import infrastructureService from './infrastructureService';
declare const globalConfig: any;

const arrayService = {
    name: 'ArrayService',

    areEquivalent(array1: string[], array2: string[]): boolean {
        const result = infrastructureService.underscore.isEqual([...array1].sort(sortingService.appSortAlphabetically), [...array2].sort(sortingService.appSortAlphabetically));
        CustomLogger.logger.log('method', `The arrays ${JSON.stringify(array1)} and ${JSON.stringify(array2)} are ${result ? 'equivalent' : 'not equivalent'}`);
        return result;
    },

    isSortedAlphabetically(array: string[]): boolean {
        const result = infrastructureService.underscore.isEqual([...array].sort(sortingService.appSortAlphabetically), array);
        CustomLogger.logger.log('method', `The array ${JSON.stringify(array)} ${result ? 'is' : 'is not'} sorted alphabetically`);
        return result;
    },

    isSubsetOf(supersetArray: string[], subsetArray: string[], caseInsensitive?: boolean): boolean {
        if (caseInsensitive) {
            supersetArray = supersetArray.map((x) => x.toLowerCase());
            subsetArray = subsetArray.map((x) => x.toLowerCase());
        }

        const result = subsetArray.every((x) => {
            const index = supersetArray.indexOf(x);
            if (index !== -1) {
                supersetArray.splice(index, 1);
                return true;
            }
            return false;
        });

        return result;
    },

    remove<T>(array: T[], element: T): T[] {
        return array.filter((x) => x !== element);
    },

    removeFirstOccurance<T>(array: T[], element: T | T[]): T[] {
        if (Array.isArray(element)) {
            let filteredArray: T[] = [...array];
            element.forEach((x) => filteredArray = this.removeFirstOccurance(filteredArray, x));
            return filteredArray;
        } else {
            return array.filter((x, i, list) => x !== element || list.findIndex((y) => y === x) !== i);
        }
    },

    contains(array: string[], value: string, caseInsensitive: boolean): boolean {
        if (caseInsensitive) {
            return array.some((x) => x.toLowerCase() === value.toLowerCase());
        }
        return array.includes(value);
    },

    getIndexArray<T>(array: T[], element: T): number[] {
        return array.map((x, i) => ({ value: x, index: i })).filter((x) => x.value === element).map((x) => x.index);
    },

    getArrayWithIndexes<T>(array: T[], indexArray: number[]): T[] {
        return array.filter((x, i) => indexArray.includes(i));
    },

    getDifference<T>(array1: T[], array2: T[]): T[] {
        return infrastructureService.underscore.difference(array1, array2);
    },

    getIntersection<T>(array1: T[], array2: T[]): T[] {
        return infrastructureService.underscore.intersection(array1, array2);
    },

    removeDuplicates<T>(array: T[]): T[] {
        return infrastructureService.underscore.uniq(array);
    },

    groupBy<T>(array: T[], property: string): _.Dictionary<T[]> {
        return infrastructureService.underscore.groupBy(array, property);
    }
};

export default arrayService;
