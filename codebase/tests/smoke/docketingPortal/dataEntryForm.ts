import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Verify New Data Entry forms`
    // .only
    // .skip
    // .page(`${globalConfig.env.url}/UI`)
    .meta('brief', 'true')
    .before(async () => {
        if (!globalConfig.brief) {
            await app.api.userPreferences.resetUserPreferences();
        }
    })
    .beforeEach(async (t) => {
        app.ui.resetRequestLogger('createRecord');
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
    })
    .afterEach(async (t) => {
        await app.step('Delete the records (API)', async () => {
            app.ui.setCookie('createRecord');
            try {
                const recordsToDelete = app.ui.requestLogger.createRecord.requests.map((req) => {
                    return {
                        Record: {
                            IpType: JSON.parse(req.response.body).FilingSectionDefinition.IpType,
                            MasterId: JSON.parse(req.response.body).FilingSectionDefinition.RecordId
                        },
                        ResourceId: JSON.parse(req.request.body).dataEntryFormTemplateResourceId
                    };
                });
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete);
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createRecord');
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.createRecord)
    ('Test 01: Verify Trademark DEF form', async (t) => {
        await app.step('Open Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('Trademark DEF');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Fill the data', async () => {
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(`trademark${app.services.time.timestampShort()}SimpleS`);
            await app.ui.dataEntryBoard.getField('Country', 'autocomplete').fill('US - (United States)');
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.dataEntryBoard.childRecord.click('addNewButton');
            const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
            await childAction.getField('Action', 'autocomplete').fill('Abandoned - (ABN)');
            await childAction.getField('Responsible Atty #1', 'autocomplete').fill('Addison Woods - (ABW)');
            await childAction.getField('Action Due Date', 'datepicker').expand();
            await childAction.getField('Action Due Date', 'datepicker').selectToday();
            await childAction.getField('Completed Date', 'datepicker').expand();
            await childAction.getField('Completed Date', 'datepicker').selectToday();
            await childAction.getField('Deadline Date', 'datepicker').expand();
            await childAction.getField('Deadline Date', 'datepicker').selectToday();
            await childAction.getField('Taken Date', 'datepicker').expand();
            await childAction.getField('Taken Date', 'datepicker').selectToday();
            await childAction.getField('Notes', 'input').fill('Trademark Action for save');
        });
        await app.step('Save form', async () => {
            await app.ui.dataEntryBoard.save();
            if (globalConfig.browser !== 'firefox') {
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            }
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('Trademark DEF');
            await app.ui.waitLoading();
        });
        await app.step('Fill the data', async () => {
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(`trademark${app.services.time.timestampShort()}SimpleSV`);
            await app.ui.dataEntryBoard.getField('Country', 'autocomplete').fill('US - (United States)');
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.dataEntryBoard.childRecord.click('addNewButton');
            const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
            await childAction.getField('Action', 'autocomplete').fill('Abandoned - (ABN)');
            await childAction.getField('Responsible Atty #1', 'autocomplete').fill('Addison Woods - (ABW)');
            await childAction.getField('Action Due Date', 'datepicker').expand();
            await childAction.getField('Action Due Date', 'datepicker').selectToday();
            await childAction.getField('Completed Date', 'datepicker').expand();
            await childAction.getField('Completed Date', 'datepicker').selectToday();
            await childAction.getField('Deadline Date', 'datepicker').expand();
            await childAction.getField('Deadline Date', 'datepicker').selectToday();
            await childAction.getField('Taken Date', 'datepicker').expand();
            await childAction.getField('Taken Date', 'datepicker').selectToday();
            await childAction.getField('Notes', 'input').fill('Trademark Action for save & validate');
        });
        await app.step('Save & Validate form', async () => {
            await app.ui.dataEntryBoard.saveValidate();
            if (globalConfig.browser !== 'firefox') {
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            }
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.isVisible('infoList')).ok()
                .expect(await app.ui.modal.getText('title')).eql('IP Rules Message(s)')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        // await t.wait(5000);
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.createRecord)
    ('Test 02: Verify Disclosure DEF form', async (t) => {
        await app.step('Open Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('Disclosure DEF');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Fill the data', async () => {
            await app.ui.dataEntryBoard.getField('Disclosure Number', 'input').fill(`disclosure${app.services.time.timestampShort()}SimpleS`);
            await app.ui.dataEntryBoard.getField('Business Unit', 'autocomplete').fill('Acme Propellants - (ACME-1)');
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.dataEntryBoard.childRecord.click('addNewButton');
            const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
            await childAction.getField('Action', 'autocomplete').fill('1st Office Action - (1OA)');
            await childAction.getField('Due Date', 'datepicker').expand();
            await childAction.getField('Due Date', 'datepicker').selectToday();
            await childAction.getField('Notes', 'input').fill('Disclosure Action for save');
            await childAction.getField('Completed Date', 'datepicker').expand();
            await childAction.getField('Completed Date', 'datepicker').selectToday();
            await childAction.getField('Responsible Atty #1', 'autocomplete').fill('ATP Party - 1 - (ATP Party - 1)');
        });
        await app.step('Save form', async () => {
            await app.ui.dataEntryBoard.save();
            if (globalConfig.browser !== 'firefox') {
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            }
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('Disclosure DEF');
            await app.ui.waitLoading();
        });
        await app.step('Fill the data', async () => {
            await app.ui.dataEntryBoard.getField('Disclosure Number', 'input').fill(`disclosure${app.services.time.timestampShort()}SimpleSV`);
            await app.ui.dataEntryBoard.getField('Business Unit', 'autocomplete').fill('Acme Propellants - (ACME-1)');
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.dataEntryBoard.childRecord.click('addNewButton');
            const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
            await childAction.getField('Action', 'autocomplete').fill('1st Office Action - (1OA)');
            await childAction.getField('Due Date', 'datepicker').expand();
            await childAction.getField('Due Date', 'datepicker').selectToday();
            await childAction.getField('Notes', 'input').fill('Disclosure Action for save & validate');
            await childAction.getField('Completed Date', 'datepicker').expand();
            await childAction.getField('Completed Date', 'datepicker').selectToday();
            await childAction.getField('Responsible Atty #1', 'autocomplete').fill('ATP Party - 1 - (ATP Party - 1)');
        });
        await app.step('Save & Validate form', async () => {
            await app.ui.dataEntryBoard.saveValidate();
            if (globalConfig.browser !== 'firefox') {
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            }
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.isVisible('infoList')).ok()
                .expect(await app.ui.modal.getText('title')).eql('IP Rules Message(s)')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        // await t.wait(10000);
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.createRecord)
    ('Test 03: Verify GeneralIP DEF form', async (t) => {
        await app.step('Open Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('GeneralIP1 DEF');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Fill the data', async () => {
            await app.ui.dataEntryBoard.getField('Agreement Number', 'input').fill(`generalIp${app.services.time.timestampShort()}SimpleS`);
            await app.ui.dataEntryBoard.getField('Jurisdiction', 'autocomplete').fill('US - (United States)');
            await app.ui.dataEntryBoard.getField('Agreement Type', 'autocomplete').fill('General Agreement - (GEN)');
            await app.ui.dataEntryBoard.getField('Relationship', 'autocomplete').fill('Renewal - (RNW)');
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.dataEntryBoard.childRecord.click('addNewButton');
            const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
            await childAction.getField('Action', 'autocomplete').fill('Audit - (AUD)');
            await childAction.getField('Action Due Date', 'datepicker').expand();
            await childAction.getField('Action Due Date', 'datepicker').selectToday();
            await childAction.getField('Notes', 'input').fill('GeneralIP Action for save');
            await childAction.getField('Responsible Atty #1', 'autocomplete').fill('Addison Woods - (ABW)');
            await childAction.getField('Deadline Date', 'datepicker').expand();
            await childAction.getField('Deadline Date', 'datepicker').selectToday();
            await childAction.getField('Completed Date', 'datepicker').expand();
            await childAction.getField('Completed Date', 'datepicker').selectToday();
        });
        await app.step('Save form', async () => {
            await app.ui.dataEntryBoard.save();
            if (globalConfig.browser !== 'firefox') {
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            }
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('GeneralIP1 DEF');
            await app.ui.waitLoading();
        });
        await app.step('Fill the data', async () => {
            await app.ui.dataEntryBoard.getField('Agreement Number', 'input').fill(`generalIp${app.services.time.timestampShort()}SimpleSV`);
            await app.ui.dataEntryBoard.getField('Jurisdiction', 'autocomplete').fill('US - (United States)');
            await app.ui.dataEntryBoard.getField('Agreement Type', 'autocomplete').fill('General Agreement - (GEN)');
            await app.ui.dataEntryBoard.getField('Relationship', 'autocomplete').fill('Renewal - (RNW)');
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.dataEntryBoard.childRecord.click('addNewButton');
            const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
            await childAction.getField('Action', 'autocomplete').fill('Audit - (AUD)');
            await childAction.getField('Action Due Date', 'datepicker').expand();
            await childAction.getField('Action Due Date', 'datepicker').selectToday();
            await childAction.getField('Notes', 'input').fill('GeneralIP Action for save & validate');
            await childAction.getField('Responsible Atty #1', 'autocomplete').fill('Addison Woods - (ABW)');
            await childAction.getField('Deadline Date', 'datepicker').expand();
            await childAction.getField('Deadline Date', 'datepicker').selectToday();
            await childAction.getField('Completed Date', 'datepicker').expand();
            await childAction.getField('Completed Date', 'datepicker').selectToday();
        });
        await app.step('Save & Validate form', async () => {
            await app.ui.dataEntryBoard.saveValidate();
            if (globalConfig.browser !== 'firefox') {
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            }
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.isVisible('infoList')).ok()
                .expect(await app.ui.modal.getText('title')).eql('IP Rules Message(s)')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        // await t.wait(10000);
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.createRecord)
    ('Test 04: Verify Patent DEF form', async (t) => {
        await app.step('Open Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('Patent DEF');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Fill the data', async () => {
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(`patent${app.services.time.timestampShort()}SimpleS`);
            await app.ui.dataEntryBoard.getField('Country / Region', 'autocomplete').fill('US - (United States)');
            await t
                .expect(await app.ui.dataEntryBoard.getField('Case Type', 'autocomplete').getValue()).eql('Regular - (REG)')
                .expect(await app.ui.dataEntryBoard.getField('Relation Type', 'autocomplete').getValue()).eql('Original Filing - (ORG)')
                .expect(await app.ui.dataEntryBoard.getField('Filing Type', 'autocomplete').getValue()).eql('National - (NAT)');
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.dataEntryBoard.childRecord.click('addNewButton');
            const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
            await childAction.getField('Action', 'hierarchy').fill('Abstract Due - (ABSD)');
            await childAction.getField('Taken Date', 'datepicker').fill('today');
        });
        await app.step('Save form', async () => {
            await app.ui.dataEntryBoard.save();
            if (globalConfig.browser !== 'firefox') {
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            }
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Open Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('Patent DEF');
            await app.ui.waitLoading();
        });
        await app.step('Fill the data', async () => {
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(`patent${app.services.time.timestampShort()}SimpleSV`);
            await app.ui.dataEntryBoard.getField('Country', 'autocomplete').fill('US - (United States)');
            await t
                .expect(await app.ui.dataEntryBoard.getField('Case Type', 'autocomplete').getValue()).eql('Regular - (REG)')
                .expect(await app.ui.dataEntryBoard.getField('Relation Type', 'autocomplete').getValue()).eql('Original Filing - (ORG)')
                .expect(await app.ui.dataEntryBoard.getField('Filing Type', 'autocomplete').getValue()).eql('National - (NAT)');
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.dataEntryBoard.childRecord.click('addNewButton');
            const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
            await childAction.getField('Action', 'hierarchy').fill('Abstract Due - (ABSD)');
            await childAction.getField('Taken Date', 'datepicker').fill('today');
        });
        await app.step('Save & Validate form', async () => {
            await app.ui.dataEntryBoard.saveValidate();
            if (globalConfig.browser !== 'firefox') {
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            }
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.isVisible('infoList')).ok()
                .expect(await app.ui.modal.getText('title')).eql('IP Rules Message(s)')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        // await t.wait(10000);
    });
