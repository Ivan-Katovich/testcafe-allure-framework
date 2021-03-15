import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Verify Audit Log`
    // .only
    .meta('brief', 'true')
    .before(async () => {
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
    ('Test 01: Verify Query', async (t) => {
        await app.step('Click on Audit -> Audit Log', async () => {
            await app.ui.naviBar.click('links', 'Audit');
            await app.ui.kendoPopup.selectItem('Audit Log');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Verify Query List section', async () => {
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Audit Log')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.getItemsNumberByLevel(1)).eql(1)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Run "Patent Audit Query"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Audit Log>Patent Audit Query');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.getText('queryName')).eql('Patent Audit Query')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    .before(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            app.ui.setCookie();
        });
        await app.step('Create Patent record and change it', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading();
            await app.ui.dataEntryBoard.getField('Application Number', 'input').fill(`123`);
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading();
        });
    })
    ('Test 02: Verify Delete', async (t) => {
        await app.step('Click on Audit -> Audit Log', async () => {
            await app.ui.naviBar.click('links', 'Audit');
            await app.ui.kendoPopup.selectItem('Audit Log');
            await app.ui.waitLoading();
        });
        await app.step('Run "Patent Audit Query"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Audit Log>Patent Audit Query');
            await app.ui.waitLoading();
        });
        await app.step('Filter pre-made patent', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Docket Number');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'input').fill(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
        });
        await app.step('Click "Delete"', async () => {
            await app.ui.queryBoard.click('menuItems', 'Delete');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.getText('title')).eql('Confirm')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.modal.confirm();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(0)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
    });

test
    // .disablePageReloads
    // .only
    ('Test 03: Verify History', async (t) => {
        await app.step('Click on Audit -> Audit Log', async () => {
            await app.ui.naviBar.click('links', 'Audit');
            await app.ui.kendoPopup.selectItem('Audit Log');
            await app.ui.waitLoading();
        });
        await app.step('Run "Patent Audit Query"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Audit Log>Patent Audit Query');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
        });
        await app.step('Click "Audit History"', async () => {
            await app.ui.queryBoard.click('menuItems', 'Audit History');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.auditHistoryModal.isVisible()).ok()
                .expect(await app.ui.auditHistoryModal.getText('title')).eql('Audit History')
                .expect(await app.ui.auditHistoryModal.isVisible('grid')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });
