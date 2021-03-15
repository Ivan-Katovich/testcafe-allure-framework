import { query, queryFilter } from '../collections/preferences';
import { CustomLogger } from '../../../support/utils/log';
import BasePage from './basePage';
import infrastructureService from '../../../services/entries/infrastructureService';
import { Options } from '../../../interfaces';
import QueryGroups from './administrationPages/queryGroups';

export default class QueryManagement extends BasePage {

    protected currentQueryId: number;
    protected allQueries: any;
    protected queryInfo: any;
    protected queryMetadata: any;
    protected queryData: typeof query.default;
    protected queryResults: any;
    protected queryManagementResults: any;

    public async getInfo(): Promise<any> {
        return (await this.get(`/Queries/Queries/${this.currentQueryId}`)).data;
    }

    public async openQuery(name: string): Promise<void> {
        CustomLogger.logger.log('method', `Open query ${name} (API)`);
        await this.getAllQueries();
        this.currentQueryId = await this.getQueryId(name);
        this.queryInfo = await this.getInfo();
        this.queryMetadata = await this.getQueryMetadata();
        this.queryData = infrastructureService.clone(query.default);
    }

    public async openQueryManagement(queryName: string = null): Promise<any> {
        if (queryName) {
            await this.openQuery(queryName);
        }
        CustomLogger.logger.log('method', `Open Query Management for query with id ${this.currentQueryId} (API)`);
        this.queryManagementResults = (await this.get(`/Queries/querymanagement/${this.currentQueryId}`, this.queryData)).data;
        return this.queryManagementResults;
    }

    public enableDataModification(value: boolean = true): void {
        this.queryManagementResults.QueryMetadata.DataModificationFormApplicable = value;
    }

    public removeResultField(fieldName: string): void {
        this.queryManagementResults.QueryMetadata.ResultFields = this.queryManagementResults.QueryMetadata.ResultFields.filter((x) => x.Display !== fieldName);
    }

    public addResultField(fieldName: string): void {
        const fieldInfo = this.queryManagementResults.QueryMetadata.FieldMetadata.find((x) => x.CustomValue === fieldName);
        this.queryManagementResults.QueryMetadata.ResultFields
            .push({
                DataInfo: fieldInfo,
                Display: fieldInfo.CustomValue,
                Value: this.queryManagementResults.QueryMetadata.From + '.' + fieldInfo.FieldAliasName
            });
    }

    public setFilter(fieldName: string, operator: string, value: string): void {
        CustomLogger.logger.log('method', `Set Build Criteria filter - '${fieldName}' ${operator} '${value}' in query management (API)`);
        const filter = infrastructureService.clone(queryFilter);
        filter.FieldAlias = this.getFieldAlias(fieldName);
        filter.LeftFieldValue = value;
        filter.FilterOperator = Operators[operator];
        filter['Field'] = this.getFieldMetadata(fieldName);
        this.queryManagementResults.QueryMetadata.AdditionalFilters = [filter];
    }

    public resetFilter(): void {
        CustomLogger.logger.log('method', `Reset Build Criteria filter in query management (API)`);
        this.queryManagementResults.QueryMetadata.AdditionalFilters = [];
    }

    public async save(): Promise<void> {
        this.queryManagementResults.QueryMetadata.AdditionalFilters.forEach((x) => {
            x.Field = this.queryManagementResults.QueryMetadata.FieldMetadata.find((y) => y.FieldAliasName === x.FieldAlias);
        });
        await this.post('/Queries/querymanagement/save', this.queryManagementResults);
    }

    public async deleteQuery(): Promise<void> {
        await this.delete(`Queries/querymanagement/${this.currentQueryId}`);
    }

    public async getSourceInfo(source: string): Promise<any> {
        return (await this.get(`/Queries/querymanagement/sourcesinfo/${source}`)).data;
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
        this.allQueries = (await this.get('/Queries/Queries')).data;
        return this.allQueries;
    }

    public async addQueryGroup(name: string): Promise<void> {
        const id = await (new QueryGroups(this.cookieProvider)).getQueryGroupId('Query>' + name);
        this.queryManagementResults.QueryGroupIds.push(id);
    }

    public async removeQueryGroup(name: string): Promise<void> {
        const id = await (new QueryGroups(this.cookieProvider)).getQueryGroupId('Query>' + name);
        this.queryManagementResults.QueryGroupIds = this.queryManagementResults.QueryGroupIds.filter((x) => x !== id);
    }

    protected getFieldAlias(name: string): string {
        return this.getFieldMetadata(name).FieldAliasName;
    }

    protected getFieldMetadata(name: string) {
        return this.queryMetadata.FieldMetadata.find((x) => x.CustomValue === name);
    }
}

enum Operators {
    'Equals' = 0
}
