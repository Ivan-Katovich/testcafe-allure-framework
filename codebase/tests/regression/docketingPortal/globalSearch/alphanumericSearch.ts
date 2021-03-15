import app from '../../../../app';

fixture`REGRESSION.globalSearch.pack - Test ID 31218: 02_Verify_AlphaNumeric search`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const data = {
    alphanumeric: [
        {
            name: 'Alphanumeric characters',
            searchText: 'MPG3A'
        },
        {
            name: 'Alphanumeric characters within single quotes',
            searchText: `'G7HC'`
        },
        {
            name: 'Four characters followed by Space',
            searchText: 'only '
        },
        {
            name: 'Greater than Four Characters with space',
            searchText: 'required '
        },
        {
            name: 'Greater than Four Characters without space',
            searchText: 'test25'
        },
        {
            name: 'Special Characters',
            searchText: '~`!@#$%^&*()_+=-}{[]|;\'?><,.’/'
        },
        {
            name: 'Logical operators',
            searchText: '<,>,=,<>,+,-,*,/'
        },
        {
            name: 'Equals to 30 characters',
            searchText: 'abcdefghijklmnopqrstuvwxyz1234'
        },
        {
            name: 'Less than 30 characters',
            searchText: 'abcdefghijklmnopqrstuvwxyz123'
        },
        {
            name: 'Unicode characters - Chinese',
            searchText: '对不起对不起'
        },
        {
            name: 'Unicode characters - Japanese',
            searchText: 'おねがいします'
        },
        {
            name: 'Unicode characters - German',
            searchText: 'achtundfünfzig'
        }
    ],
    longText: {
        before: 'ThePartAfterMoreThan30Characters',
        after: 'ThePartBeforeMoreThan30Characters',
        beforeAfter: 'ThePartInTheMiddle',
        thirtyCharacters: 'abcdefghijklmnopqrstuvwxyz1234'
    }
};

data.alphanumeric.forEach((search) => {
    test
        // .only
        .meta('brief', 'true')
        (`Verify AlphaNumeric search for ${search.name} (Steps 2-4)`, async (t: TestController) => {
            await app.step('Login (Step 2)', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step('Perform search and verify results (Step 4)', async () => {
                await app.ui.header.setGlobalSearch(`"` + search.searchText + `"`);
                await app.ui.header.click('globalSearchButton');
                await app.ui.waitLoading();
                const allRecordsNames = await app.ui.globalSearchBoard.getAllRecordNames();
                await t
                    .expect(allRecordsNames.length).gt(0, `No records returned for ${search.name} in Global Search`);

                for (let recorName of allRecordsNames) {
                    const result = app.ui.globalSearchBoard.getResult(recorName);
                    const searchResults = await result.getAllSearchResultValues();

                    await t
                        .expect(searchResults.every((x) => x.includes(search.searchText))).ok();
                }
            });
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify search results when search text contains more than 30 characters before or after (Step 5)`, async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Verify when search text contains more than 30 characters before', async () => {
            await app.ui.header.setGlobalSearch(data.longText.before);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            const allRecordsNames = await app.ui.globalSearchBoard.getAllRecordNames();
            await t
                .expect(allRecordsNames.length).gt(0, `No records returned in Global Search`);
            for (let recordName of allRecordsNames) {
                const result = app.ui.globalSearchBoard.getResult(recordName);
                const searchResults = await result.getAllSearchResultValues();

                await t
                    .expect(searchResults.every((x) => x.includes(data.longText.before) && x.startsWith('...')))
                    .ok(`The value does not start with "..." when there is more than 30 characters before; record "${recordName}"`);
            }
        });
        await app.step('Verify when search text contains more than 30 characters after', async () => {
            await app.ui.header.setGlobalSearch(data.longText.after);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            const allRecordsNames = await app.ui.globalSearchBoard.getAllRecordNames();
            await t
                .expect(allRecordsNames.length).gt(0, `No records returned in Global Search`);
            for (let recordName of allRecordsNames) {
                const result = app.ui.globalSearchBoard.getResult(recordName);
                const searchResults = await result.getAllSearchResultValues();

                await t
                    .expect(searchResults.every((x) => x.includes(data.longText.after) && x.endsWith('...')))
                    .ok(`The value does not end with "..." when there is more than 30 characters after; record "${recordName}"`);
            }
        });
        await app.step('Verify when search text contains more than 30 characters before and after', async () => {
            await app.ui.header.setGlobalSearch(data.longText.beforeAfter);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            const allRecordsNames = await app.ui.globalSearchBoard.getAllRecordNames();
            await t
                .expect(allRecordsNames.length).gt(0, `No records returned in Global Search`);
            for (let recordName of allRecordsNames) {
                const result = app.ui.globalSearchBoard.getResult(recordName);
                const searchResults = await result.getAllSearchResultValues();

                await t
                    .expect(searchResults.every((x) => x.includes(data.longText.beforeAfter) && x.endsWith('...') && x.startsWith('...')))
                    .ok(`The value does not start or end with "..." when there is more than 30 characters before and after; record "${recordName}"`);
            }
        });
        await app.step('Verify when search text contains exactly 30 characters', async () => {
            await app.ui.header.setGlobalSearch(data.longText.thirtyCharacters);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            const allRecordsNames = await app.ui.globalSearchBoard.getAllRecordNames();
            await t
                .expect(allRecordsNames.length).gt(0, `No records returned in Global Search`);
            for (let recordName of allRecordsNames) {
                const result = app.ui.globalSearchBoard.getResult(recordName);
                const searchResults = await result.getAllSearchResultValues();

                await t
                    .expect(searchResults.every((x) => x.includes(data.longText.thirtyCharacters) && !x.includes('...')))
                    .ok(`The value for exactly 30 characters contains "..."; record "${recordName}"`);
            }
        });
    });
