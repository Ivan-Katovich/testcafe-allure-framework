import app from '../../../../app';

fixture `REGRESSION.globalSearch.pack - Test ID 31223: 10_Verify_Whole Words Only`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const data = {
    word: 'apple'
};

test
    // .only
    .meta('brief', 'true')
    (`Verify the Whole Words Only checkbox (Steps 2-4)`, async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.header.isVisible('globalSearchOptionsButton')).ok();
        });
        await app.step('Click the dropdown icon on the Global Search field', async () => {
            await app.ui.header.click('globalSearchOptionsButton');
            await t
                .expect(await app.ui.kendoPopup.isVisible()).ok()
                .expect(await app.ui.kendoPopup.getAllItemsText('checkboxItems')).eql(['Whole Words Only'])
                .expect(await app.ui.kendoPopup.getField('Whole Words Only', 'checkbox').isChecked()).notOk();
        });
        await app.step('Click outside options popup', async () => {
            await app.ui.header.click('mainLogo');
            await t
                .expect(await app.ui.kendoPopup.isPresent()).notOk();
        });
        await app.step('Check the Whole Words Only field', async () => {
            await app.ui.header.click('globalSearchOptionsButton');
            await app.ui.kendoPopup.getField('Whole Words Only', 'checkbox').check();
            await t
                .expect(await app.ui.kendoPopup.isPresent()).notOk();
        });
        await app.step('Verify the Whole Words Only checkbox', async () => {
            await app.ui.header.click('globalSearchOptionsButton');
            await t
                .expect(await app.ui.kendoPopup.getField('Whole Words Only', 'checkbox').isChecked()).ok();
        });
        await app.step('Uncheck the Whole Words Only checkbox and verify', async () => {
            await app.ui.kendoPopup.getField('Whole Words Only', 'checkbox').uncheck();
            await app.ui.header.click('globalSearchOptionsButton');
            await t
                .expect(await app.ui.kendoPopup.getField('Whole Words Only', 'checkbox').isChecked()).notOk();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Whole Words Only functionality (Step 4-6)`, async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.header.isVisible('globalSearchOptionsButton')).ok();
        });
        await app.step('Check the Whole Words Only field and perform search', async () => {
            await app.ui.header.click('globalSearchOptionsButton');
            await app.ui.kendoPopup.getField('Whole Words Only', 'checkbox').check();
            await app.ui.header.setGlobalSearch(data.word);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.globalSearchBoard.getRecordCount()).gt(0);
        });
        await app.step('Verify results', async () => {
            for (let i = 0; i < await app.ui.globalSearchBoard.getRecordCount(); i++) {
                const record = app.ui.globalSearchBoard.getResult(i);
                const searchResultsValues = (await record.getAllSearchResultTableValues()).map((x) => x.value);

                for (let y = 0; y < searchResultsValues.length; y++) {
                    const value = searchResultsValues[y];
                    const highlightedText = await record.getHighlightedText(y);
                    const words = value.split(' ');
                    await t
                        .expect(words).contains(data.word, `The search result value ${value} does not contain whole word ${data.word}`)
                        .expect(highlightedText.length).gt(0)
                        .expect(highlightedText.every((x) => x === data.word)).ok();
                }
            }
        });
        await app.step('Uncheck the Whole Words Only checkbox and verify', async () => {
            await app.ui.header.click('globalSearchOptionsButton');
            await app.ui.kendoPopup.getField('Whole Words Only', 'checkbox').uncheck();
            await app.ui.header.click('globalSearchOptionsButton');
            await t
                .expect(await app.ui.kendoPopup.getField('Whole Words Only', 'checkbox').isChecked()).notOk();
        });
        await app.step('Perform search', async () => {
            const totalRecordCountBefore = await app.ui.globalSearchBoard.getTotalCount();
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.globalSearchBoard.getTotalCount()).gt(totalRecordCountBefore);
        });
        await app.step('Verify results', async () => {
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.globalSearchBoard.getRecordCount()).gt(0);
            for (let i = 0; i < await app.ui.globalSearchBoard.getRecordCount(); i++) {
                const record = app.ui.globalSearchBoard.getResult(i);
                const searchResultsValues = (await record.getAllSearchResultTableValues()).map((x) => x.value);

                for (let y = 0; y < searchResultsValues.length; y++) {
                    const value = searchResultsValues[y];
                    const highlightedText = await record.getHighlightedText(y);
                    await t
                        .expect(value.includes(data.word)).ok(`The search result value ${value} does not contain '${data.word}'`)
                        .expect(highlightedText.length).gt(0)
                        .expect(highlightedText.every((x) => x === data.word)).ok();
                }
            }
        });
    });
