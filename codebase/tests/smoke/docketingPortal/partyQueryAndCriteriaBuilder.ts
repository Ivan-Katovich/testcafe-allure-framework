import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Verify Party Query & Criteria Builder`
    // .skip
    // .only
    .meta('brief', 'true')
    .before(async (t) => {
        app.services.os.removeDownloads(['ExportedFile.*']);
        app.services.os.removeDownloads(['SamplePatentMasterFormLetterParty*.docx']);
        if (!globalConfig.brief) {
            await app.api.userPreferences.resetUserPreferences();
        }
    })
    .beforeEach(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            app.ui.setCookie();
        });
        await app.step('Create Party record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('party', 'simple');
        });
    })
    .afterEach(async (t) => {
        await app.step('Remove Party record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData], 'party');
            } catch (err) {}
        });
        app.ui.resetRequestLogger();
    })
    .after(async (t) => {
        // app.api.deleteRecords([app.memory.current.createRecordData.respData], 'party');
        app.services.os.removeDownloads(['ExportedFile.*']);
        app.services.os.removeDownloads(['SamplePatentMasterFormLetterParty*.docx']);
        // app.api.cleanQueryByPattern(6001, /patent[\d]{3}Simple/);
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 01: Verify Criteria Builder', async (t) => {
        await app.step('Go to "Party > Party Query"', async () => {
            await app.ui.naviBar.click('links', 'Party');
            await app.ui.kendoPopup.selectItem('Party Query');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('party/queries')
                .expect(await app.ui.queryBoard.isVisible()).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.isVisible()).ok()
                .expect(await app.ui.queryBoard.isVisible('searchBox')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Verify Query List section', async () => {
            await t.expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Party')).ok();
        });
        await app.step('Run "Party Query"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Party>Party Query');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.isVisible('resultsHeaderItems', 'Party Query')).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Search for created Party by Docket Number', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Party');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'input').fill(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            const record = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            await t
                .expect(await record.getValue('Party')).eql(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 02: Verify Open in Browser', async (t) => {
        await app.step('Run "Party Query TA filter"', async () => {
            await app.ui.naviBar.click('links', 'Party');
            await app.ui.kendoPopup.selectItem('Party Query');
            await app.ui.queryBoard.kendoTreeview.open('Party>Party Query TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Click "Open in Browser" (without checking new tab)', async () => {
            await app.ui.queryBoard.click('menuItems', 'Open in Browser');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.dataEntryBoard.getText('recordIdRow')).contains(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 03: Verify Export', async (t) => {
        await app.step('Run "Party Query TA filter"', async () => {
            await app.ui.naviBar.click('links', 'Party');
            await app.ui.kendoPopup.selectItem('Party Query');
            await app.ui.queryBoard.kendoTreeview.open('Party>Party Query TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Search record using Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'dropdown').fill('Party');
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'input').fill(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Click "Export"', async () => {
            await app.ui.queryBoard.click('menuItems', 'Export');
            await t
                .expect(await app.ui.kendoPopup.isVisible('simpleItems', 'Excel Export - (Excel Export)')).ok()
                .expect(await app.ui.kendoPopup.isVisible('simpleItems', 'HTML - (HTML)')).ok()
                .expect(await app.ui.kendoPopup.isVisible('simpleItems', 'Text - (Text)')).ok()
                .expect(await app.ui.kendoPopup.isVisible('simpleItems', 'XML - (XML)')).ok();
        });
        await app.step('Export record as Excel', async () => {
            await app.ui.kendoPopup.selectItem('Excel Export - (Excel Export)');
            await t
                .expect(await app.ui.getNotificationMessage()).eql('The export is currently processing.  You will be notified when the file is ready.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown')
                .expect(await app.services.os.waitForFileExists('ExportedFile.xlsx')).ok();
        });
        await app.step('Export record as HTML', async () => {
            await app.ui.queryBoard.click('menuItems', 'Export');
            await app.ui.kendoPopup.selectItem('HTML - (HTML)');
            await t
                .expect(await app.ui.getNotificationMessage()).eql('The export is currently processing.  You will be notified when the file is ready.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown')
                .expect(await app.services.os.waitForFileExists('ExportedFile.html')).ok();
        });
        await app.step('Export record as Text', async () => {
            await app.ui.queryBoard.click('menuItems', 'Export');
            await app.ui.kendoPopup.selectItem('Text - (Text)');
            await t
                .expect(await app.ui.getNotificationMessage()).eql('The export is currently processing.  You will be notified when the file is ready.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown')
                .expect(await app.services.os.waitForFileExists('ExportedFile.txt')).ok();
        });
        await app.step('Export record as XML', async () => {
            await app.ui.queryBoard.click('menuItems', 'Export');
            await app.ui.kendoPopup.selectItem('XML - (XML)');
            await t
                .expect(await app.ui.getNotificationMessage()).eql('The export is currently processing.  You will be notified when the file is ready.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown')
                .expect(await app.services.os.waitForFileExists('ExportedFile.xml')).ok();
        }, {isSkipped: globalConfig.browser === 'firefox'}/*skipped due to firefox bug with no config property to avoid dialogue box while xml file is downloaded*/);
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 04: Verify Form letter', async (t) => {
        await app.step('Run "Party Query TA filter"', async () => {
            await app.ui.naviBar.click('links', 'Party');
            await app.ui.kendoPopup.selectItem('Party Query');
            await app.ui.queryBoard.kendoTreeview.open('Party>Party Query TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Download Form Letter', async () => {
            await app.ui.queryBoard.click('menuItems', 'Form Letter');
            await app.ui.kendoPopup.selectItem('TA FL for parties');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown')
                .expect(await app.services.os.waitForFileExists(/SamplePatentMasterFormLetterParty.*\.docx/)).ok();
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 05: Verify Edit party Record on DEF', async (t) => {
        await app.step('Run "Party Query TA filter"', async () => {
            await app.ui.naviBar.click('links', 'Party');
            await app.ui.kendoPopup.selectItem('Party Query');
            await app.ui.queryBoard.kendoTreeview.open('Party>Party Query TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.dataEntryBoard.getText('recordIdRow')).contains(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Change Party field and Save', async () => {
            await app.ui.dataEntryBoard.getField('Party', 'input').fill(`${app.memory.current.createRecordData.reqData.recordName}Updated`);
            await app.ui.dataEntryBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 06: Verify Delete', async (t) => {
        await app.step('Run "Party Query TA filter"', async () => {
            await app.ui.naviBar.click('links', 'Party');
            await app.ui.kendoPopup.selectItem('Party Query');
            await app.ui.queryBoard.kendoTreeview.open('Party>Party Query TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Delete the record', async () => {
            await app.ui.queryBoard.click('menuItems', 'Delete');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.getText('title')).eql('Confirm');
            await app.ui.modal.confirm();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await t.expect(await app.ui.queryBoard.queryResultsGrid.isRecordAbsent(app.memory.current.createRecordData.reqData.recordName)).ok();

        });
    });
