import { CustomLogger } from '../../support/utils/log';
declare const globalConfig: any;

const modifierService = {
    name: 'ModifierService',

    composer(...args: Array<(x: any) => any>) {
        return function(body) {
            return args.reduce((b, arg) => {
                return arg(b);
            }, body);
        };
    },

    * propertiesGenerator(properties: any[], childMassiveName: string) {
        for (let property of properties) {
            yield property;
            if (property[childMassiveName] && property[childMassiveName].length) {
                yield* this.propertiesGenerator(property[childMassiveName], childMassiveName);
            }
        }
    },

    changeRecordPropertiesModifier(updData: any[]): (rec: any) => any {
        function* propertyIterator(properties: any[]) {
            for (let property of properties) {
                yield property;
            }
        }
        function changeProperty(item: {}, properties: any[]) {
            const itemInArray: any[] = Object.entries(item);
            const propGenerator = propertyIterator(properties);
            let prop = propGenerator.next();
            while (!prop.done) {
                if (prop.value[itemInArray[0][0]] === itemInArray[0][1].toUpperCase().replace(/ /g, '')) {
                    prop.value[itemInArray[1][0]] = itemInArray[1][1];
                    return;
                } else {
                    prop = propGenerator.next();
                }
            }
        }
        return function(record: any) {
            updData.forEach((item) => {
                changeProperty(item, record.filingObjectDefinition.Properties);
            });
            return record;
        };
    },

    selectQueryFieldsModifier(filterNames: string[]) {
        return function(query: any) {
            query.QueryMetadata.ResultFields = query.QueryMetadata.ResultFields.reduce((arr, filter) => {
                if (filterNames.includes(filter.Display)) {
                    arr.push(filter);
                }
                return arr;
            }, []);
            return query;
        };
    },

    removeQueryAdditionalFilters() {
        return function(query: any) {
            query.QueryMetadata.AdditionalFilters = null;
            return query;
        };
    },

    changeProperties(properties: Array<{path: string, value: any}>) {
        return function(body: any) {
            properties.forEach((prop) => {
                let value = prop.value;
                const path = prop.path.replace('>', '.');
                if (typeof value === 'string') {
                    value = `'${prop.value}'`;
                } else if (typeof prop.value === 'object') {
                    value = JSON.stringify(prop.value);
                }
                (new Function('body', `if (body.${path} !== undefined) {body.${path} = ${value}} else {throw new Error('Wrong property path')}`))(body);
            });
            return body;
        };
    }
};

export default modifierService;
