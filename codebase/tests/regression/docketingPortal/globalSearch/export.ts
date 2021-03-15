import app from '../../../../app';
declare const globalConfig: any;

fixture`REGRESSION.globalSearch.pack - Test ID 31229: 04_Verify_Export for Global Search`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step('Change Records Per Page in User Preferences(API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'RecordsPerPage.Value', value: 100 }]);
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API) ', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

const data = {
    searchText: 'Test31381',
    ipType: 'PatentMasters',
    dropdown: 'Case Type',
    singleline: 'Docket Number'
};

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.downloadFile, app.ui.requestLogger.globalSearch)
    (`Verify Export for one record (Step 1-7)`, async (t: TestController) => {
        let fileName: string;
        await app.step('Login (Step 2)', async () => {
            app.ui.resetRequestLogger('globalSearch');
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform global search (Step 3)', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            await app.services.time.wait(() => app.ui.requestLogger['globalSearch'].requests.length === 2);
        });
        await app.step('Verify the Export button (Step 5)', async () => {
            await t
                .expect(await app.ui.globalSearchBoard.isVisible('headerButtons', 'Export')).ok()
                .expect(await app.ui.globalSearchBoard.isEnabled('headerButtons', 'Export')).notOk();
        });
        await app.step('Select a record and verify the Export button (Step 6)', async () => {
            await app.ui.globalSearchBoard.getResult(0).checkbox.check();
            await t
                .expect(await app.ui.globalSearchBoard.isEnabled('headerButtons', 'Export')).ok();
        });
        await app.step('Click the Export button (Step 7)', async () => {
            await app.ui.globalSearchBoard.click('headerButtons', 'Export');
            await t
                .expect(await app.ui.getNotificationMessage()).eql('The export is currently processing.  You will be notified when the file is ready.');

            await app.ui.waitLoading();
            await app.services.time.wait(() => app.ui.getLastResponse('downloadFile'));
            fileName = app.ui.getLastResponse('downloadFile').headers['content-disposition'].split('filename=')[1];

            await t
                .expect(await app.services.os.waitForFileExists(fileName)).ok()
                .expect(fileName.endsWith('.html')).ok();
        });
        await app.step('Verify the contains of the exported file', async () => {
            const record = app.ui.globalSearchBoard.getResult(0);
            const expectedTitle = (await record.getAuditKeyValue()).slice(0, -1); // removes ':' in the end of the name
            const expectedRows = await record.getAllSearchResultTableValues();
            await t.navigateTo(`file:///${process.env.USERPROFILE}\\Downloads\\${fileName}`);
            const results = await app.ui.exportGlobalSearch.getResults();
            const title = await results[0].getTitle();
            const rows = await results[0].getResults();

            await t
                .expect(results.length).eql(1)
                .expect(expectedTitle).eql(title);

            for (let i = 0; i < rows.length; i++) {
                await t
                    .expect(rows[i]).contains(expectedRows[i].field)
                    .expect(rows[i]).contains(expectedRows[i].table)
                    .expect(rows[i]).contains(expectedRows[i].value);
            }
        });
    })
    .after(async () => {
        await app.step('Remove downloaded file (OS)', async () => {
            await app.services.os.removeDownloads(['ExportGlobalSearch*.html']);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.downloadFile)
    (`Export for Filtered search (Step 4)`, async (t: TestController) => {
        let fileName: string;
        await app.step('Login', async () => {
            app.ui.resetRequestLogger('globalSearch');
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform global search', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            await app.services.time.wait(() => app.ui.requestLogger['globalSearch'].requests.length === 2);
        });
        await app.step('Select ip type and apply filter', async () => {
            await app.api.globalSearch.search(data.searchText);
            const record = app.api.globalSearch.getRecords(data.ipType)[0];
            const recordId = record.MasterId;
            const resourceId = record.ResourceId;

            await app.api.dataEntryForm.openRecord(recordId, resourceId);
            const dropdownValue = await app.api.dataEntryForm.getValue(data.dropdown);
            const singleLineValue = await app.api.dataEntryForm.getValue(data.singleline);

            await app.ui.globalSearchBoard.selectSearchIn(data.ipType);
            await app.ui.globalSearchBoard.click('headerButtons', 'Filter Results');
            await app.ui.waitLoading();
            await app.ui.globalSearchBoard.filterBox.fillFieldWithValue(data.dropdown, 'autocomplete', dropdownValue);
            await app.ui.globalSearchBoard.filterBox.fillFieldWithValue(data.singleline, 'input', singleLineValue);
            await app.ui.globalSearchBoard.filterBox.click('buttons', 'Filter');
            await app.ui.waitLoading();
        });
        await app.step('Select all and click the Export button', async () => {
            await app.ui.globalSearchBoard.click('selectAllCheckbox');
            await app.ui.globalSearchBoard.click('headerButtons', 'Export');
            await t
                .expect(await app.ui.getNotificationMessage()).eql('The export is currently processing.  You will be notified when the file is ready.');

            await app.ui.waitLoading();
            await app.services.time.wait(() => app.ui.getLastResponse('downloadFile'));
            fileName = app.ui.getLastResponse('downloadFile').headers['content-disposition'].split('filename=')[1];

            await t
                .expect(await app.services.os.waitForFileExists(fileName)).ok();
        });
        await app.step('Verify the contents of the exported file', async () => {
            const record = app.ui.globalSearchBoard.getResult(0);
            const expectedTitle = (await record.getAuditKeyValue()).slice(0, -1); // removes ':' in the end of the name
            const expectedRows = await record.getAllSearchResultTableValues();
            await t.navigateTo(`file:///${process.env.USERPROFILE}\\Downloads\\${fileName}`);
            const results = await app.ui.exportGlobalSearch.getResults();
            const title = await results[0].getTitle();
            const rows = await results[0].getResults();

            await t
                .expect(results.length).eql(1)
                .expect(expectedTitle).eql(title);

            for (let i = 0; i < rows.length; i++) {
                await t
                    .expect(rows[i]).contains(expectedRows[i].field)
                    .expect(rows[i]).contains(expectedRows[i].table)
                    .expect(rows[i]).contains(expectedRows[i].value);
            }
        });
    })
    .after(async () => {
        await app.step('Remove downloaded file (OS)', async () => {
            await app.services.os.removeDownloads(['ExportGlobalSearch*.html']);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.downloadFile)
    (`Verify Export for all records (Step 8)`, async (t: TestController) => {
        let fileName: string;
        await app.step('Login', async () => {
            app.ui.resetRequestLogger('globalSearch');
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform global search', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            await app.services.time.wait(() => app.ui.requestLogger['globalSearch'].requests.length === 2);
            await t
                .expect(await app.ui.globalSearchBoard.isEnabled('headerButtons', 'Export')).notOk();
        });
        await app.step('Select a record and verify the Export button', async () => {
            await app.ui.globalSearchBoard.click('selectAllCheckbox');
            await t
                .expect(await app.ui.globalSearchBoard.isEnabled('headerButtons', 'Export')).ok();
        });
        await app.step('Click the Export button', async () => {
            await app.ui.globalSearchBoard.click('headerButtons', 'Export');
            await t
                .expect(await app.ui.getNotificationMessage()).eql('The export is currently processing.  You will be notified when the file is ready.');

            await app.ui.waitLoading();
            await app.services.time.wait(() => app.ui.getLastResponse('downloadFile'));
            fileName = app.ui.getLastResponse('downloadFile').headers['content-disposition'].split('filename=')[1];

            await t
                .expect(await app.services.os.waitForFileExists(fileName)).ok();
        });
        await app.step('Verify the contains of the exported file', async () => {
            const totalRecordCount = await app.ui.globalSearchBoard.getTotalCount();
            const expectedRecordCount = await app.ui.globalSearchBoard.getRecordCount();
            await t
                .expect(expectedRecordCount).gt(0);

            const expectedRecords = [];
            for (let i = 0; i < expectedRecordCount; i++) {
                const record = app.ui.globalSearchBoard.getResult(i);
                const expectedTitle = (await record.getAuditKeyValue()).slice(0, -1); // removes ':' in the end of the name
                const expectedRows = await record.getAllSearchResultTableValues();
                expectedRecords.push({
                    title: expectedTitle,
                    row: expectedRows
                });
            }
            await t.navigateTo(`file:///${process.env.USERPROFILE}\\Downloads\\${fileName}`);
            const resultsCount = await app.ui.exportGlobalSearch.getCount('recordTitles');
            await t
                .expect(resultsCount).eql(totalRecordCount);

            for (let i = 0; i < expectedRecordCount; i++) {
                const record = await app.ui.exportGlobalSearch.getResult(i);
                const title = await record.getTitle();
                const rows = await record.getResults();
                const expectedRecord = expectedRecords[i];

                await t
                    .expect(expectedRecord.title).eql(title);

                for (let i = 0; i < rows.length; i++) {
                    await t
                        .expect(rows[i]).contains(expectedRecord.row[i].field)
                        .expect(rows[i]).contains(expectedRecord.row[i].table)
                        .expect(rows[i]).contains(expectedRecord.row[i].value);
                }
            }
        });
    })
    .after(async () => {
        await app.step('Remove downloaded file (OS)', async () => {
            await app.services.os.removeDownloads(['ExportGlobalSearch*.html']);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .meta('category', 'Display Configuration')
    .requestHooks(app.ui.requestLogger.downloadFile)
    (`Global Search - Export - Verify Display Configuration (Step 9)`, async (t: TestController) => {
        await app.step('Change display configuration for user (API)', async () => {
            app.ui.resetRequestLogger('globalSearch');
            app.ui.resetRole();
            await app.api.login();
            await app.api.changeDisplayConfigurationForUser('TA Custom Display Configuration', globalConfig.user.userName);
        });
        let fileName: string;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Perform global search', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
            await app.services.time.wait(() => app.ui.requestLogger['globalSearch'].requests.length === 2);
            await t
                .expect(await app.ui.globalSearchBoard.isVisible('headerButtons', 'Test - Export')).ok();
        });
        await app.step('Click the Export button', async () => {
            await app.ui.globalSearchBoard.getResult(0).checkbox.check();
            await app.ui.globalSearchBoard.click('headerButtons', 'Export');
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Test - The export is currently processing. You will be notified when the file is ready.');

            await app.ui.waitLoading();
            await app.services.time.wait(() => app.ui.getLastResponse('downloadFile'));
            fileName = app.ui.getLastResponse('downloadFile').headers['content-disposition'].split('filename=')[1];

            await t
                .expect(await app.services.os.waitForFileExists(fileName)).ok();
        });
        await app.step('Verify the contains of the exported file', async () => {
            const record = app.ui.globalSearchBoard.getResult(0);
            const expectedTitle = (await record.getAuditKeyValue()).slice(0, -1); // removes ':' in the end of the name
            const expectedRows = await record.getAllSearchResultTableValues();
            await t.navigateTo(`file:///${process.env.USERPROFILE}\\Downloads\\${fileName}`);
            const results = await app.ui.exportGlobalSearch.getResults();
            const title = await results[0].getTitle();
            const rows = await results[0].getResults();

            await t
                .expect(results.length).eql(1)
                .expect(expectedTitle).eql(title);

            for (let i = 0; i < rows.length; i++) {
                await t
                    .expect(rows[i]).contains(expectedRows[i].field)
                    .expect(rows[i]).contains(expectedRows[i].table)
                    .expect(rows[i]).contains(expectedRows[i].value);
            }
        });
    })
    .after(async () => {
        await app.step('Delete created code (API) and change display configuration to default (API)', async () => {
            try {
                await app.api.changeDisplayConfigurationForUser('Default Display Configuration 1', globalConfig.user.userName);
                app.ui.resetRole();
            } catch (err) { }
        });
        await app.step('Remove downloaded file (OS)', async () => {
            await app.services.os.removeDownloads(['ExportGlobalSearch*.html']);
        });
    });
