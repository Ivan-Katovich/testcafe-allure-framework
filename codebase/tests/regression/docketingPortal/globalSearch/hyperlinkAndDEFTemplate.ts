import app from '../../../../app';

fixture`REGRESSION.globalSearch.pack - Test ID 31228: 06_Verify_Hyperlink from GS and DEF template`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const data = {
    searchText: 'test',
    ipTypes: [
        {
            name: 'PatentMasters',
            parentTable: 'Patents'
        },
        {
            name: 'TrademarkMasters',
            parentTable: 'Trademarks'
        }
    ]
};

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.getRecord)
    (`Verify Audit Key of the record in Global Search`, async (t: TestController) => {
        let searchResults: any[];
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform global search', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
        });
        for (let ipType of data.ipTypes) {
            await app.step(`Open first record for ${ipType.name} ipType`, async () => {
                const expectedTemplateId = await app.api.userPreferences.getCurrentDefaultDEFTemplate(ipType.name);
                await app.ui.globalSearchBoard.selectSearchIn(ipType.name);
                await app.ui.waitLoading();
                const record = app.ui.globalSearchBoard.getResult(0);
                const name = await record.getAuditKeyValue();
                searchResults = await record.getAllSearchResultTableValues();
                await record.open();
                await app.ui.waitLoading();
                const recordId = app.ui.getLastResponseBody('getRecord').RecordData.RecordId;
                const actualTemplateId = (await app.ui.getCurrentUrl()).split('/').pop();
                const recordIdentifier = await app.ui.dataEntryBoard.getText('recordIdRow');

                await t
                    .expect(searchResults.length).gt(0)
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(name).contains(recordId.toString())
                    .expect(name).contains(ipType.name)
                    .expect(expectedTemplateId.toString()).eql(actualTemplateId)
                    .expect(name.replace(ipType.name, '').replace(':', '').trim())
                    .eql(recordIdentifier.replace('Current Record:', '').trim(), `The Audit Key is different from Record Identification for ${ipType}`);
            });
            await app.step('Go Back to Global Search', async () => {
                await app.ui.goBack();
                await app.services.time.wait(async () => await app.ui.globalSearchBoard.isVisible());
            });
        }
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.getRecord)
    (`Verify Table Name - Field Name values in Global Search`, async (t: TestController) => {
        let searchResults: any[];
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform global search', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
        });
        for (let ipType of data.ipTypes) {
            await app.step(`Open first record for ${ipType.name} ipType`, async () => {
                await app.ui.globalSearchBoard.selectSearchIn(ipType.name);
                await app.ui.waitLoading();
                const record = app.ui.globalSearchBoard.getResult(0);
                searchResults = await record.getAllSearchResultTableValues();
                await record.open();
                await app.ui.waitLoading();
            });
            await app.step('Verify search result values in record filing section', async () => {
                const parentResults = searchResults.filter((x) => x.table === ipType.parentTable);
                for (let result of parentResults) {
                    const value = (await app.ui.dataEntryBoard.getField(result.field).getValue()).toLowerCase();
                    await t
                        .expect(value)
                        .eql(result.value.toLowerCase(), `The ${result.field} value Global Search is not the same as for record`);
                }
            });
            await app.step('Verify search result values in record children', async () => {
                const childResults = searchResults.filter((x) => x.table !== ipType.parentTable);
                const children = app.services.array.removeDuplicates(childResults.map((x) => x.table));

                for (let child of children) {
                    await app.ui.dataEntryBoard.selectChildRecord(child);
                    await app.ui.waitLoading();
                    const searchResults = childResults.filter((x) => x.table === child);
                    const fields = app.services.array.removeDuplicates(searchResults.map((x) => x.field));

                    for (let field of fields) {
                        const childValues = await app.ui.dataEntryBoard.childRecord.grid.getColumnValues(field);
                        const globalSearchValues = searchResults.filter((x) => x.field === field).map((x) => x.value);

                        await t
                            .expect(app.services.array.isSubsetOf(childValues, globalSearchValues, true)).ok();
                    }
                }

                await app.ui.goBack();
                await app.services.time.wait(async () => await app.ui.globalSearchBoard.isVisible(), { timeout: 20000 });
                await app.ui.waitLoading();
            });
        }
    });
