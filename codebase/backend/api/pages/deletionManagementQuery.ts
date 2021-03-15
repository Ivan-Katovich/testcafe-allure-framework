import BaseQuery from './baseQuery';

export default class DeletionManagementQuery extends BaseQuery {

    protected queryPageName = 'deletionmanagementqueries';

    public async restore(columnName: string, values: string[]): Promise<void> {
        const alias = this.getFieldAlias(columnName);
        const index = this.queryResults.FieldNames.findIndex((x) => x === alias);
        const masterIdIndex = this.queryResults.FieldNames.findIndex((x) => x === this.queryMetadata.MasterIdFieldAliasName);
        const body = this.queryResults.Rows.filter((x) => values.includes(x[index])).map((x) => x[masterIdIndex]);
        await this.post(`/Records/deleted-record/restore/${this.currentQueryId}/`, body);
    }
}
