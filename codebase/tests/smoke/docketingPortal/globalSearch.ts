import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Verify Global Search`
    // .only
    .meta('brief', 'true')
    .before(async (t) => {
        await app.services.os.removeDownloads(['ExportGlobalSearch*.html']);
        if (!globalConfig.brief) {
            await app.api.userPreferences.resetUserPreferences();
        }
    })
    .beforeEach(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 01: Verify Filters', async (t) => {
        await app.step('Type "test" into Global Search field -> press search', async () => {
            await app.ui.header.searchGlobally('test');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.globalSearchBoard.isVisible()).ok()
                .expect(await app.ui.globalSearchBoard.getCount('globalSearchResults')).gt(0);
            app.memory.current.recordsCount = await app.ui.globalSearchBoard.getTotalCount();
        });
        await app.step('Set IP Type in Search In', async () => {
            await app.ui.globalSearchBoard.click('searchIn');
            await app.ui.kendoPopup.selectItem('PatentMasters');
            const newRecordsTotal = await app.ui.globalSearchBoard.getTotalCount();
            await t.expect(newRecordsTotal).lt(app.memory.current.recordsCount);
            app.memory.current.recordsCount = newRecordsTotal;
        });
        await app.step('Filter results -> apply any filter', async () => {
            await app.ui.globalSearchBoard.click('headerButtons', 'Filter Results');
            await t.expect(await app.ui.globalSearchBoard.filterBox.isVisible()).ok();
            await app.ui.globalSearchBoard.filterBox.fillFieldWithValue('Docket Number', 'input', 'patent');
            await app.ui.globalSearchBoard.filterBox.click('buttons', 'Filter');
            await t
                .expect(await app.ui.globalSearchBoard.getTotalCount()).lt(app.memory.current.recordsCount)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            const count = await app.ui.globalSearchBoard.getCount('auditKeys');
            for (let i = 0; i < count; i++) {
                await t.expect((await app.ui.globalSearchBoard.getResult(i).getAuditKeyValue()).toLowerCase()).contains('patent');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 02: Verify Export', async (t) => {
        await app.step('Type "test" into Global Search field -> press search', async () => {
            await app.ui.header.searchGlobally('test');
            await app.ui.waitLoading();
        });
        await app.step('Select some records', async () => {
            await app.ui.globalSearchBoard.getResult(0).checkbox.check();
            await app.ui.globalSearchBoard.getResult(1).checkbox.check();
        });
        await app.step('Press Export', async () => {
            await app.ui.globalSearchBoard.click('headerButtons', 'Export');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('The export is currently processing.  You will be notified when the file is ready.')
                .expect(await app.services.os.waitForFileExists(/ExportGlobalSearch.*\.html/)).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Remove downloaded file (OS)', async () => {
            await app.services.os.removeDownloads(['ExportGlobalSearch*.html']);
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 03: Verify Record Opening', async (t) => {
        await app.step('Type "test" into Global Search field -> press search', async () => {
            await app.ui.header.searchGlobally('test');
            await app.ui.waitLoading();
        });
        await app.step('Click on any record from global search results', async () => {
            const firstRecord = app.ui.globalSearchBoard.getResult(0);
            app.memory.current.recordName = await firstRecord.getAuditKeyValue();
            app.memory.current.recordName = app.ui.searchAuditKeyToRecordTitle(app.memory.current.recordName);
            await firstRecord.open();
            await app.ui.waitLoading();
            const recordNameParts = app.memory.current.recordName.split(' - ');
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.dataEntryBoard.getRecordIdentifier()).contains(recordNameParts[0])
                .expect(await app.ui.dataEntryBoard.getRecordIdentifier()).contains(recordNameParts[1])
                // .expect(await app.ui.dataEntryBoard.getRecordIdentifier()).contains(recordNameParts[2])
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });
