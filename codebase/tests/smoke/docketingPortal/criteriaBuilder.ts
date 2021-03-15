import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Criteria Builder & Edit DEF`
    // .only
    // .skip
    // .page(`${globalConfig.env.url}/UI`)
    .meta('brief', 'true')
    .before(async () => {
        if (!globalConfig.brief) {
            await app.api.userPreferences.resetUserPreferences();
        }
    })
    .afterEach(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
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
        await app.step('Create Trademark record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('trademark', 'simple');
        });
    })
    ('Test 01: Trademark DEF Criteria Builder', async (t) => {
        await app.step('Go to "Query"', async () => {
            await t.expect(await app.ui.getCurrentUrl()).contains('queries');
        });
        await app.step('Verify Query List section"', async () => {
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Patent')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Trademark')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Disclosure')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('GeneralIP1')).ok();
        });
        await app.step('Run "TM All Cases" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Trademark>TM All Cases');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Search for created TM DEF by Docket Number', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Docket Number');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'input').fill(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            const record = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            await t
                .expect(await record.getValue('Docket Number')).eql(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.getText('recordIdRow')).contains(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Change Docket Number and Save', async () => {
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(`${app.memory.current.createRecordData.reqData.recordName}Updated`);
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
    .before(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            app.ui.setCookie();
        });
        await app.step('Create Disclosure record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('disclosure', 'simple');
        });
    })
    ('Test 02: Disclosure DEF Criteria Builder', async (t) => {
        await app.step('Run "DS All Cases" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Disclosure>DS All Cases');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Search for created DS DEF by Disclosure Number', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Disclosure Number');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'input').fill(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            const record = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            await t
                .expect(await record.getValue('Disclosure Number')).eql(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.getText('recordIdRow')).contains(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Change Disclosure Number and Save', async () => {
            await app.ui.dataEntryBoard.getField('Disclosure Number', 'input').fill(`${app.memory.current.createRecordData.reqData.recordName}Updated`);
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
    .before(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            app.ui.setCookie();
        });
        await app.step('Create GeneralIP record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('generalIp', 'simple');
        });
    })
    ('Test 03: GeneralIp DEF Criteria Builder', async (t) => {
        await app.step('Run "GIP1 All Cases" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('GeneralIP1>GIP1 All Cases');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Search for created GIP1 DEF by Agreement Number', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Agreement Number');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'input').fill(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            const record = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            await t
                .expect(await record.getValue('Agreement Number')).eql(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.getText('recordIdRow')).contains(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Change Agreement Number and Save', async () => {
            await app.ui.dataEntryBoard.getField('Agreement Number', 'input').fill(`${app.memory.current.createRecordData.reqData.recordName}Updated`);
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
    ('Test 04: Patent DEF Criteria Builder', async (t) => {
        await app.step('Run "PA All Cases" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Search for created PA DEF by Docket Number', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Docket Number');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'input').fill(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            const record = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            await t
                .expect(await record.getValue('Docket Number')).eql(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.getText('recordIdRow')).contains(app.memory.current.createRecordData.reqData.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Change Docket Number and Save', async () => {
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(`${app.memory.current.createRecordData.reqData.recordName}Updated`);
            await app.ui.dataEntryBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });
