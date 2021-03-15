import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Verify Collaboration Portal`
    // .only
    .meta('brief', 'true')
    .before(async (t) => {
        await app.services.os.removeDownloads(['ExportedFile.*']);
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
        await app.step('Add the record to collaborate process (API)', async () => {
            const collaborateInfo = {
                WorkflowResourceId: 6002,
                MasterIds: [app.memory.current.createRecordData.respData.Record.MasterId]
            };
            await app.api.collaboration.collaborateSelected(collaborateInfo);
        });
    })
    .afterEach(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
        app.ui.resetRequestLogger();
    });
    // .after(async (t) => {
    //     app.api.cleanQueryByPattern(6001, /patent[\d]{3}Simple/);
    // });

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
        await app.step('Create Patent record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
    })
    ('Test 01: Verify Query -> More -> Collaborate & Collaboration Portal', async (t) => {
        await app.step('Run "PA All Cases TA filter" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Run Collaborate', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Collaborate');
            await app.ui.kendoPopup.child.selectItem('TA process');
            await app.ui.waitLoading();
            await app.ui.modal.confirm();
        });
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.naviBar.click('links', 'Collaboration Portal');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.collaborationBoard.isVisible()).ok()
                .expect(await app.ui.collaborationBoard.getProcess('TA process').isVisible()).ok()
                .expect(await app.ui.collaborationBoard.getProcess('TA process').getTaskCount()).gt(0)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open first task (record management task).', async () => {
            await app.ui.collaborationBoard.getProcess('TA process').getTask('TA Task1 RM').open();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isRecordPresent(app.memory.current.createRecordData.reqData.recordName)).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 02: Verify Open record', async (t) => {
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.naviBar.click('links', 'Collaboration Portal');
            await app.ui.waitLoading();
        });
        await app.step('Open first task (record management task).', async () => {
            await app.ui.collaborationBoard.getProcess('TA process').getTask('TA Task1 RM').open();
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Click "Open" (doesn\'t check new tab availability)', async () => {
            await app.ui.queryBoard.click('menuItems', 'Open');
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
    ('Test 03: Verify Print', async (t) => {
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.naviBar.click('links', 'Collaboration Portal');
            await app.ui.waitLoading();
        });
        await app.step('Open first task (record management task).', async () => {
            await app.ui.collaborationBoard.getProcess('TA process').getTask('TA Task1 RM').open();
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Click "Print" (doesn\'t check new tab availability)', async () => {
            await app.ui.queryBoard.click('menuItems', 'Print');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
                // TODO: Flaky fail when print page is not loaded
                // .expect(await app.ui.reportPage.isVisible('tableNames', 'Patents')).ok();
                // .expect(await app.ui.reportPage.getFirstParagraphText()).contains(app.memory.current.createRecordData.reqData.recordName);
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 04: Verify Export', async (t) => {
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.naviBar.click('links', 'Collaboration Portal');
            await app.ui.waitLoading();
        });
        await app.step('Open first task (record management task).', async () => {
            await app.ui.collaborationBoard.getProcess('TA process').getTask('TA Task1 RM').open();
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
                .expect(await app.ui.kendoPopup.isVisible('simpleItems', 'XML - (XML)')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
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
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
        await app.step('Delete downloaded files (OS)', async () => {
            await app.services.os.removeDownloads(['ExportedFile.*']);
        });
        app.ui.resetRequestLogger();
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 05: Verify Submit', async (t) => {
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.naviBar.click('links', 'Collaboration Portal');
            await app.ui.waitLoading();
        });
        await app.step('Open first task (record management task).', async () => {
            await app.ui.collaborationBoard.getProcess('TA process').getTask('TA Task1 RM').open();
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Click "Task controls" > Submit', async () => {
            await app.ui.queryBoard.click('menuItems', 'Task Controls');
            await app.ui.kendoPopup.selectItem('Submit');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isRecordAbsent(app.memory.current.createRecordData.reqData.recordName)).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.naviBar.click('links', 'Collaboration Portal');
            await app.ui.waitLoading();
        });
        await app.step('Open second task (email task).', async () => {
            await app.ui.collaborationBoard.getProcess('TA process').getTask('TA Task2 Email').open();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isRecordPresent(app.memory.current.createRecordData.reqData.recordName)).ok()
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
        await app.step('Create Patent record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
        await app.step('Add the record to collaborate process (API)', async () => {
            const collaborateInfo = {
                WorkflowResourceId: 6002,
                MasterIds: [app.memory.current.createRecordData.respData.Record.MasterId]
            };
            await app.api.collaboration.collaborateSelected(collaborateInfo);
        });
        await app.step('Submit First process Task (API)', async () => {
            const submitInfo = {
                selectedRecords: [ {masterId: Number(app.memory.current.createRecordData.respData.Record.MasterId), childId: 0} ],
                modifiers: null
            };
            await app.api.collaboration.submitCollaborationTask(328, submitInfo);
        });
    })
    ('Test 06: Verify Open email preview', async (t) => {
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.naviBar.click('links', 'Collaboration Portal');
            await app.ui.waitLoading();
        });
        await app.step('Open second task (email task)', async () => {
            await app.ui.collaborationBoard.getProcess('TA process').getTask('TA Task2 Email').open();
            await app.ui.waitLoading();
        });
        await app.step('Select the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Click "Open"', async () => {
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });
