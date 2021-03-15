import BasePage from './basePage';

export default class GlobalSearch extends BasePage {
    private searchResults: any;

    public async search(text: string): Promise<void> {
        this.searchResults = (await this.get('/GlobalSearch/globalsearch/', {
            SearchString: text,
            IncludeDocumentManagementSystem: false,
            WholeWordsOnly: false,
            StartRowNum: 1,
            EndRowNum: 100
        })).data;
    }

    public getRecordIds(ipType: string): string[] {
        return this.getRecords(ipType).map((x) => x.MasterId);
    }

    public getRecords(ipType: string): any[] {
        const ipTypeId = this.searchResults.AvailableIpTypes.find((x) => x.Name === ipType).IpTypeId;
        return this.searchResults.GlobalSearchResult.filter((x) => x.IpType === ipTypeId);
    }
}
