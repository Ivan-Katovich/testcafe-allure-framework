import app from '../../../../app';

fixture`REGRESSION.globalSearch.pack - Test ID 31216: 05_Verify_10 occurrences of search criteria`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const data = {
    word: 'test'
};

test
    // .only
    .meta('brief', 'true')
    (`Verify occurences of search criteria`, async (t: TestController) => {
        let results: Array<{ name: string, rows: object[] }>;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform search', async () => {
            await app.ui.header.setGlobalSearch(data.word);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
        });
        await app.step('Verify search result count', async () => {
            results = await app.ui.globalSearchBoard.getAllRecordResults();
            await t
                .expect(results.length).gt(0);
            for (let result of results) {

                await t
                    .expect(result.rows.length).lte(10, `The search results for ${result.name} is greated than 10`);
            }
        });
        await app.step('Verify results sorting', async () => {
            const actualResults = results.map((x) => ({ name: x.name, count: x.rows.length }));
            const expectedResults = app.services.sorting.sortByNumericProperty(actualResults, 'count', app.services.sorting.sortDirection.desc);

            await t
                .expect(expectedResults).eql(actualResults, 'The sorting in Global Search is not correct');
        });
        await app.step('Verify results grouping', async () => {
            const groupedResults = app.services.array.groupBy(results.map((x) => ({ name: x.name, count: x.rows.length })), 'count');

            for (let group in groupedResults) {
                const actualGroupedResult = groupedResults[group].map((x) => x.name);
                const expectedGroupedResult = actualGroupedResult.sort(app.services.sorting.appSortAlphabetically);
                await t
                    .expect(expectedGroupedResult).eql(actualGroupedResult, `The grouping is not correct for records with number of results = ${group}`);
            }
        });
    });
