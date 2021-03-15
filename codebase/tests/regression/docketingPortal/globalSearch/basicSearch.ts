import app from '../../../../app';

fixture `REGRESSION.globalSearch.pack - Test ID 31220: 09_Verify_Basic Search`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const data = {
    word1: 'apple',
    word2: 'tree'
};

test
    // .only
    .meta('brief', 'true')
    (`Verify Basic Search`, async (t: TestController) => {
        let allRecordsNames: string[];
        await app.step('Login (Step 2)', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform search and verify results (Step 3)', async () => {
            await app.ui.header.setGlobalSearch(data.word1 + ' ' + data.word2);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            allRecordsNames = await app.ui.globalSearchBoard.getAllRecordNames();
            await t
                .expect(allRecordsNames.length).gt(0, `No records returned in Global Search`);
            for (let recorName of allRecordsNames) {
                const result = app.ui.globalSearchBoard.getResult(recorName);
                const searchResults = await result.getAllSearchResultValues();

                await t
                    .expect(searchResults.every((x) => x.includes(data.word1) && x.includes(data.word2))).ok();
            }
        });
        await app.step('Verify search term is highlighted (Step 4)', async () => {
            for (let recorName of allRecordsNames) {
                const result = app.ui.globalSearchBoard.getResult(recorName);

                for (let i = 0; i < await result.getCount('infoRows'); i++) {
                    const highlightedText = await result.getHighlightedText(i);

                    await t
                        .expect(highlightedText.length).gt(0)
                        .expect(highlightedText.every((x) => x.toLowerCase() === data.word1 || x.toLowerCase() === data.word2)).ok();
                }
            }
        });
    });
