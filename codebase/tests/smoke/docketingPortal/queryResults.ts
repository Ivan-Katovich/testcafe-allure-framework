import app from '../../../app';
// import App from '../../../app';
// const app = new App();
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Verify Query Results - Records List`
    // .only
    .meta('brief', 'true')
    .before(async (t) => {
        await app.services.os.removeDownloads(['ExportedFile.*']);
        await app.services.os.removeDownloads(['TestMasterFormLetter*.doc']);
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
        await app.step('Create Patent record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
    })
    .afterEach(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
        await app.step('Clean target folder (OS)', async () => {
            await app.services.os.removeDownloads(['ExportedFile.*']);
            await app.services.os.removeDownloads(['TestMasterFormLetter*.doc']);
        });
        app.ui.resetRequestLogger();
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 01: Verify Opening in browser', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
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
    ('Test 02: Verify Export', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
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
    // .skip
    .requestHooks(app.ui.requestLogger.simpleAndDuplication)
    .before(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            app.ui.setCookie('simpleAndDuplication');
        });
        await app.step('Create Patent record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
    })
    ('Test 03: Verify Duplication', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Run Duplication template', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Duplicate');
            await app.ui.kendoPopup.child.selectItem('Patent to Patent');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.duplicationModal.isVisible()).ok()
                .expect(await app.ui.duplicationModal.getText('title')).contains(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Fill required fields and confirm', async () => {
            await app.ui.duplicationModal.getField('Country', 'autocomplete').fill('US - (United States)');
            await app.ui.duplicationModal.getField('Case Type', 'autocomplete').fill('Copyright - (Y)');
            await app.ui.duplicationModal.getField('Filing Type', 'autocomplete').fill('ARIPO Case - (A)');
            await app.ui.duplicationModal.getField('Relation Type', 'autocomplete').fill('Continuation - (C)');
            await app.ui.duplicationModal.getField('Docket Number', 'input').fill(`${app.memory.current.createRecordData.reqData.recordName}D`);
            await app.ui.duplicationModal.create();
            await app.ui.waitLoading();
            app.memory.current.masterId = app.ui.getLastResponseBody('simpleAndDuplication').MasterIds[0];
        });
        await app.step('Cancel confirmation modal dialogue', async () => {
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown')
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.getText('title')).eql('Confirm');
            await app.ui.modal.cancel();
        });
        await app.step('Check record and its duplication', async () => {
            await app.ui.refresh();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isRecordPresent(`${app.memory.current.createRecordData.reqData.recordName}D`)).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isRecordPresent(app.memory.current.createRecordData.reqData.recordName)).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                const duplicatedRecordToDelete = JSON.parse(JSON.stringify(app.memory.current.createRecordData.respData));
                duplicatedRecordToDelete.Record.MasterId = app.memory.current.masterId;
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData, duplicatedRecordToDelete]);
            } catch (err) {}
        });
        app.ui.resetRequestLogger();
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 04: Verify Email', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Run Email template', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Email');
            await app.ui.kendoPopup.child.selectItem('TA ET for Patents');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(await app.ui.emailModal.getText('title')).contains(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Fill Data and send Email', async () => {
            await app.ui.emailModal.getField('To').fill('TestA@***.com');
            await app.ui.emailModal.send();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('The email is sent.');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 05: Verify Form Letter', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Download Form Letter', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Form Letter');
            await app.ui.kendoPopup.child.selectItem('TA FL for Patents');
            await app.ui.waitLoading();
            await t.expect(await app.services.os.waitForFileExists(/TestMasterFormLetter.*\.doc/)).ok();
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 06: Verify Print', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Print the record', async () => {
            await t.wait(1000);
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Print');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.reportPage.isVisible('tableNames', 'Patents')).ok()
                .expect(await app.ui.reportPage.getFirstParagraphText()).contains(app.memory.current.createRecordData.reqData.recordName);
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 07: Verify Process Rules', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Click Process Rules', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Process Rules');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Successfully submitted the selected records for rules processing. Check Job Center for details.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 08: Verify Reports', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Click Report', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Report');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.reportModal.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open the Report', async () => {
            await app.ui.reportModal.kendoTreeview.open('Reports>Patent Query Reports>TA Report TP for Patents');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.reportPage.isVisible('crReportViewer')).ok()
                .expect(await app.ui.reportPage.getTaRepForPatentsDocketNumberFromIframe()).eql(app.memory.current.createRecordData.reqData.recordName);
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 09: Verify Variable link', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Open Variable link (without checking new tab)', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Variable Link');
            await app.ui.kendoPopup.child.selectItem('TA VL for patents');
            await app.ui.waitLoading();
            await t.expect(await app.ui.getCurrentUrl()).eql('https://devexpress.github.io/');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 10: Verify Delete', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Delete the record', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Delete');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.getText('title')).eql('Confirm')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.modal.confirm();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.queryBoard.queryResultsGrid.isRecordAbsent(app.memory.current.createRecordData.reqData.recordName)).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .skip
    // .only
    .before(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            app.ui.setCookie();
        });
        await app.step('Create Patent record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
        await app.step('Create Global Change Template (API)', async () => {
            app.memory.current.respData = await app.api.combinedFunctionality.createTemplate('globalchangetemplate', `gct${app.services.time.timestampShort()}Simple`);
            await app.api.clearCache();
            await app.ui.refresh();
        });
    })
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 11: Verify Global Change', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Open Global Change Template modal', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Global Change');
            await app.ui.kendoPopup.child.selectItem(app.memory.current.respData.Name);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.globalChangeDialog.isVisible()).ok()
                .expect(await app.ui.globalChangeDialog.getText('title')).eql('Global Change Templates')
                .expect(await app.ui.globalChangeDialog.getField('Name').getValue()).eql(app.memory.current.respData.Name)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Check preview', async () => {
            await app.ui.globalChangeDialog.preview();
            await t
                .expect(await app.ui.getNotificationMessage())
                .eql('The export is currently processing.  You will be notified when the file is ready.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown')
                .expect(await app.services.os.waitForFileExists('ExportedFile.xlsx')).ok();
        });
        await app.step('Check Execute', async () => {
            await app.ui.globalChangeDialog.execute();
            await app.ui.modal.confirm();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getNotificationMessage())
                .eql('Global Change has been submitted for processing through Background Services. You may check the status of this job using the Job Center.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
        await app.step('Clean target folder (OS)', async () => {
            await app.services.os.removeDownloads(['ExportedFile.*']);
            await app.services.os.removeDownloads(['TestMasterFormLetter*.doc']);
        });
        await app.step('Delete the Global Change Template (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.respData.ResourceId], 'global change template');
            } catch (err) {}
        });
        app.ui.resetRequestLogger();
    });
