import { query, queryFilter } from '../collections/preferences';
import { CustomLogger } from '../../../support/utils/log';
import BasePage from './basePage';
import infrastructureService from '../../../services/entries/infrastructureService';
import { Options } from '../../../interfaces';
import arrayService from '../../../services/entries/arrayService';
import nodeService from '../../../services/entries/nodeService';

export default class BaseQuery extends BasePage {

    protected queryPageName: string;
    protected currentQueryId: number;
    protected allQueries: any;
    protected queryInfo: any;
    protected queryMetadata: any;
    protected queryData: typeof query.default;
    protected queryResults: any;
    protected queryManagementResults: any;
    public sortDirection = SortDirection;

    public async addCriteria(name: string, value: any, operator: string = 'Equal'): Promise<void> {
        CustomLogger.logger.log('method', `Add criteria - '${name}' ${operator} '${value}' to query (API)`);
        const filter = infrastructureService.clone(queryFilter);
        filter.FieldAlias = this.queryMetadata.FieldMetadata.find((x) => x.CustomValue === name).FieldAliasName;
        filter.LeftFieldValue = value;
        filter.FilterOperator = Operators[operator];
        this.queryData.Filters.push(filter);
    }

    public async getInfo(): Promise<any> {
        return (await this.get(`/Queries/${this.queryPageName}/${this.currentQueryId}`)).data;
    }

    public async getRecordIdsFromResults(): Promise<number[]> {
        const columnIndex = this.queryResults.FieldNames
            .map((name: string, index: number) => {
                return { name, index };
            })
            .find((x) => x.name === this.queryMetadata.MasterIdFieldAliasName).index;
        return this.queryResults.Rows.map((x) => {
            return x[columnIndex];
        });
    }

    public getColumnValuesFromResults(columnName: string): any[] {
        const columnIndex = this.queryResults.FieldNames.findIndex((x) => x === this.getFieldAlias(columnName));
        return this.queryResults.Rows.map((x) => {
            return x[columnIndex];
        });
    }

    public getColumnValue(columnName: string, rowIndex: number): any {
        const columnIndex = this.queryResults.FieldNames.findIndex((x) => x === this.getFieldAlias(columnName));
        return this.queryResults.Rows[rowIndex][columnIndex];
    }

    public getRowIndexWithValues(values: Array<{ name: string, value: any }>): number {
        for (let i = 0; i < this.queryResults.Rows.length; i++) {
            const result = values.every((x) => this.getColumnValue(x.name, i) === x.value);
            if (result) {
                return i;
            }
        }

        return -1;
    }

    public async openQuery(name: string): Promise<void> {
        CustomLogger.logger.log('method', `Open query ${name} (API)`);
        if (!this.allQueries) {
            await this.getAllQueries();
        }
        this.currentQueryId = await this.getQueryId(name);
        this.queryInfo = await this.getInfo();
        this.queryMetadata = await this.getQueryMetadata();
        this.queryData = infrastructureService.clone(query.default);
    }

    public async runQuery(name: string = null): Promise<any> {
        if (name) {
            await this.openQuery(name);
        }
        CustomLogger.logger.log('method', `Execute query with id ${this.currentQueryId} (API)`);
        this.queryResults = (await this.post(`/Queries/queryexecution/${this.currentQueryId}`, this.queryData)).data;
        return this.queryResults;
    }

    public changePageSize(size: number): void {
        this.queryData.PaginationDescriptor.PageSize = size;
    }

    public sort(fieldName: string, direction: SortDirection = SortDirection.desc): void {
        this.queryData.SortDescriptor = {
            FieldAlias: this.getFieldAlias(fieldName),
            SortDirection: direction
        };
    }

    public async getQueryMetadata(): Promise<any> {
        return (await this.get(`/Queries/querymetadata/${this.currentQueryId}`)).data;
    }

    public async getQueryId(queryPath: string): Promise<number> {
        let query;
        let queries = this.allQueries;
        const pathArray = queryPath.split('>');
        pathArray.forEach((element) => {
            query = queries.find((x) => x.DisplayText === element);
            if (query && query.ResourceListItems) {
                queries = query.ResourceListItems;
            }
        });
        if (query) {
            CustomLogger.logger.log('method', `'${queryPath}' Query ID ${query.ResourceId} (API)`);
            return query.ResourceId;
        } else {
            CustomLogger.logger.log('WARN', `'${queryPath}' Query ID ${null} (API)`);
            return null;
        }
    }

    public getQueryIds(queryPaths: string[]): number[] {
        let ids = [];
        for (let queryPath of queryPaths) {
            let query;
            let queries = this.allQueries;
            const pathItems = queryPath.split('>');
            pathItems.forEach((element) => {
                query = queries.find((x) => x.DisplayText === element);
                if (query && query.ResourceListItems) {
                    queries = query.ResourceListItems;
                }
            });
            if (query) {
                ids.push(query.ResourceId ? query.ResourceId : query.CategoryId);
            } else {
                ids.push(null);
            }
        }
        CustomLogger.logger.log('method', `Query IDs with paths ${queryPaths} is ${ids} (API)`);
        return ids;
    }

    public async getAllQueries(options: Options = {}): Promise<any> {
        if (this.allQueries && options.cache) {
            return this.allQueries;
        }
        this.allQueries = (await this.get(`/Queries/${this.queryPageName}`)).data;
        return this.allQueries;
    }

    protected getFieldAlias(name: string): string {
        return this.queryMetadata.FieldMetadata.find((x) => x.CustomValue === name).FieldAliasName;
    }

    public async getAllQueryNames(): Promise<string[]> {
        await this.getAllQueries();
        const queries = nodeService.getAllLastNodes(this.allQueries, 'ResourceListItems');
        const ids = arrayService.removeDuplicates(queries.map((x) => x.ResourceId));
        return ids.map((x) => queries.find((y) => y.ResourceId === x).DisplayText);
    }

    public async getAllQueryNamesForIPType(ipType: string): Promise<string[]> {
        const ipTypeId = await this.common.getIpTypeId(ipType);
        await this.getAllQueries();
        const queries = nodeService.getAllLastNodes(this.allQueries, 'ResourceListItems').filter((x) => x.IpType === ipTypeId);
        const ids = arrayService.removeDuplicates(queries.map((x) => x.ResourceId));
        return ids.map((x) => queries.find((y) => y.ResourceId === x).DisplayText);
    }

    public async getAllQueriesWithPath(): Promise<string[]> {
        const array: string[] = [];
        await this.getAllQueries();
        for (const group of this.allQueries) {
            if (!group.ResourceListItems) {
                array.push(group.DisplayText);
            } else {
                array.push(...this.getQueryPath(group, 'ResourceListItems', 'DisplayText'));
            }
        }
        return array;
    }

    public async getAllQueriesWithPathForIpType(ipType: string): Promise<string[]> {
        const array: string[] = [];
        const ipTypeId = await this.common.getIpTypeId(ipType);
        await this.getAllQueries();
        for (const group of this.allQueries) {
            if (!group.ResourceListItems) {
                if (group.IpType === ipTypeId) {
                    array.push(group.DisplayText);
                }
            } else {
                array.push(...this.getQueryPathForIpType(group, 'ResourceListItems', 'DisplayText', ipTypeId));
            }
        }
        return array;
    }

    protected getQueryPathForIpType(node: any, childrenNodeName: string, displayTextName: string, ipType: number): string[] {
        const array = [];
        const children = node[childrenNodeName] ? node[childrenNodeName].filter((x) => x.IpType === ipType || x.NodeType === 'Category') : null;
        if (children) {
            for (const child of children) {
                const childrenPaths = this.getQueryPathForIpType(child, childrenNodeName, displayTextName, ipType);
                childrenPaths.forEach((x) => array.push(node[displayTextName] + '>' + x));
            }
        } else {
            array.push(node[displayTextName]);
        }

        return array;
    }

    protected getQueryPath(node: any, childrenNodeName: string, displayTextName: string): string[] {
        const array = [];
        const children = node[childrenNodeName];
        if (children) {
            for (const child of children) {
                const childrenPaths = this.getQueryPath(child, childrenNodeName, displayTextName);
                childrenPaths.forEach((x) => array.push(node[displayTextName] + '>' + x));
            }
        } else {
            array.push(node[displayTextName]);
        }

        return array;
    }
}

export enum Operators {
    'Equals' = 0,
    'Not Equal' = 1,
    'Contains' = 2,
    'Does Not Contain' = 3,
    'Greater Than' = 6,
    'Greater Than Or Equal To' = 11,
    'Less Than' = 7,
    'Less Than Or Equal To' = 12,
    'Is Null' = 13,
    'Is Not Null' = 14,
    'In' = 19
}

export enum SortDirection {
    'asc' = 0,
    'desc' = 1
}
