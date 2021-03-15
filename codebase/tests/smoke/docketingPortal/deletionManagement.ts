import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Verify Deletion management`
    // .only
    // .page(`${globalConfig.env.url}/UI`)
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
    // .after(async (t) => {
    //     app.api.cleanQueryByPattern(6001, /patent[\d]{3}Simple/);
    // });

test
    // .disablePageReloads
    // .only
    ('Test 01: Verify Query', async (t) => {
        await app.step('Click on Audit -> Deletion Management', async () => {
            await app.ui.naviBar.click('links', 'Audit');
            await app.ui.kendoPopup.selectItem('Deletion Management');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.isVisible()).ok();
        });
        await app.step('Verify Query List section', async () => {
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Deletion Management')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.getItemsNumberByLevel(1)).eql(1)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Run "Patent Deleted Query"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Deletion Management>Patent Deleted Query');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.getText('queryName')).eql('Patent Deleted Query')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 02: Verify Delete', async (t) => {
        await app.step('Click on Audit -> Deletion Management', async () => {
            await app.ui.naviBar.click('links', 'Audit');
            await app.ui.kendoPopup.selectItem('Deletion Management');
            await app.ui.waitLoading();
        });
        await app.step('Run "Patent Deleted Query"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Deletion Management>Patent Deleted Query');
            await app.ui.waitLoading();
        });
        await app.step('Filter TA patents', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const rowOne = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await rowOne.getField('Field Name', 'autocomplete').fill('Docket Number');
            await rowOne.getField('Value', 'input').fill('patent');
            const rowTwo = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await rowTwo.getField('Field Name', 'autocomplete').fill('Docket Number');
            await rowTwo.getField('Value', 'input').fill('Simple');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
        });
        await app.step('Select 1st record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
            app.memory.current.recordFirstColumnValue = await app.ui.queryBoard.queryResultsGrid.getRecordFirstColumnValue(0);
        });
        await app.step('Click "Delete"', async () => {
            await app.ui.queryBoard.click('menuItems', 'Delete');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.getText('title')).eql('Confirm')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.modal.confirm();
            const notificationMessage = await app.ui.getNotificationMessage();
            await app.ui.waitLoading();
            await t
                .expect(notificationMessage).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.queryBoard.queryResultsGrid.isRecordAbsent(app.memory.current.recordFirstColumnValue)).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 03: Verify Restore', async (t) => {
        await app.step('Click on Audit -> Deletion Management', async () => {
            await app.ui.naviBar.click('links', 'Audit');
            await app.ui.kendoPopup.selectItem('Deletion Management');
            await app.ui.waitLoading();
        });
        await app.step('Run "Patent Deleted Query"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Deletion Management>Patent Deleted Query');
            await app.ui.waitLoading();
        });
        await app.step('Filter TA patents', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const rowOne = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await rowOne.getField('Field Name', 'autocomplete').fill('Docket Number');
            await rowOne.getField('Value', 'input').fill('patent');
            const rowTwo = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await rowTwo.getField('Field Name', 'autocomplete').fill('Docket Number');
            await rowTwo.getField('Value', 'input').fill('Simple');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
        });
        await app.step('Select 1st record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
            app.memory.current.recordFirstColumnValue = await app.ui.queryBoard.queryResultsGrid.getRecordFirstColumnValue(0);
            const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            app.memory.current.recordName = await row.getValue('Docket Number');
        });
        await app.step('Click "Restore"', async () => {
            await app.ui.queryBoard.click('menuItems', 'Restore');
            const notificationMessage = await app.ui.getNotificationMessage();
            await app.ui.waitLoading();
            await t
                .expect(notificationMessage).eql('Selected record(s) were restored successfully.')
                .expect(await app.ui.queryBoard.queryResultsGrid.isRecordAbsent(app.memory.current.recordFirstColumnValue)).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.naviBar.click('links', 'Query');
            await app.ui.waitLoading();
        });
        await app.step('Find Restored Record', async () => {
            await app.ui.naviBar.click('links', 'Query');
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const rowOne = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await rowOne.getField('Field Name', 'autocomplete').fill('Docket Number');
            await rowOne.getField('Operator', 'autocomplete').fill('Equal');
            await rowOne.getField('Value', 'input').fill(app.memory.current.recordName);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isRecordPresent(app.memory.current.recordName)).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            app.memory.current.masterId = parseInt(await row.getValue('PATENTMASTERID'));
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            app.ui.setCookie();
            await app.api.combinedFunctionality.deleteRecords([{Record: {IpType: 1, MasterId: app.memory.current.masterId}, ResourceId: 481}]);
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 04: Verify Opening in browser', async (t) => {
        await app.step('Click on Audit -> Deletion Management', async () => {
            await app.ui.naviBar.click('links', 'Audit');
            await app.ui.kendoPopup.selectItem('Deletion Management');
            await app.ui.waitLoading();
        });
        await app.step('Run "Patent Deleted Query"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Deletion Management>Patent Deleted Query');
            await app.ui.waitLoading();
        });
        await app.step('Select 1st record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
            const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            app.memory.current.recordName = await row.getValue('Docket Number');
        });
        await app.step('Click "Open in Browser"', async () => {
            await app.ui.queryBoard.click('menuItems', 'Open in Browser');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.contentBoard.isVisible()).ok()
                .expect(await app.ui.contentBoard.getValue('Docket Number')).eql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });
