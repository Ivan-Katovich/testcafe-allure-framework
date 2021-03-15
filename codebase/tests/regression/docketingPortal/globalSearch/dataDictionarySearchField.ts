import app from '../../../../app';

fixture`REGRESSION.globalSearch.pack - Test ID 31219: 03_Verify_DataDictionarySearch Field_master and child`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const data = {
    master: {
        tableName: 'Patents',
        name: 'Application Number',
        value: 'AutoTest31219_MasterField'
    },
    child: {
        childName: 'Actions',
        fieldName: 'Notes',
        value: 'AutoTest31219_ChildField'
    },
    oneToOneTable: {
        name: 'Description',
        value: 'AutoTest31219_ChildMultilineField'
    }
};

test
    // .only
    .meta('brief', 'true')
    (`Verify master field in global search`, async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform search and verify results', async () => {
            await app.ui.header.setGlobalSearch(data.master.value);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            const allRecordsNames = await app.ui.globalSearchBoard.getAllRecordNames();
            await t
                .expect(allRecordsNames.length).gt(0, `No records returned in Global Search`);
            for (let recordName of allRecordsNames) {
                const result = app.ui.globalSearchBoard.getResult(recordName);
                const searchResults = await result.getAllSearchResultTableValues();

                await t
                    .expect(searchResults[0].table).eql(data.master.tableName)
                    .expect(searchResults[0].field).eql(data.master.name)
                    .expect(searchResults[0].value).eql(data.master.value);
            }
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify child field in global search`, async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform search and verify results', async () => {
            await app.ui.header.setGlobalSearch(data.child.value);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            const allRecordsNames = await app.ui.globalSearchBoard.getAllRecordNames();
            await t
                .expect(allRecordsNames.length).gt(0, `No records returned in Global Search`);
            for (let recordName of allRecordsNames) {
                const result = app.ui.globalSearchBoard.getResult(recordName);
                const searchResults = await result.getAllSearchResultTableValues();

                await t
                    .expect(searchResults[0].table).eql(data.child.childName)
                    .expect(searchResults[0].field).eql(data.child.fieldName)
                    .expect(searchResults[0].value).eql(data.child.value);
            }
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify one-to-one child table field in global search`, async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform search and verify results', async () => {
            await app.ui.header.setGlobalSearch(data.oneToOneTable.value);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            const allRecordsNames = await app.ui.globalSearchBoard.getAllRecordNames();
            await t
                .expect(allRecordsNames.length).gt(0, `No records returned in Global Search`);
            for (let recordName of allRecordsNames) {
                const result = app.ui.globalSearchBoard.getResult(recordName);
                const searchResults = await result.getAllSearchResultTableValues();

                await t
                    .expect(searchResults[0].table).eql(data.oneToOneTable.name)
                    .expect(searchResults[0].field).eql(data.oneToOneTable.name)
                    .expect(searchResults[0].value).eql(data.oneToOneTable.value);
            }
        });
    });
