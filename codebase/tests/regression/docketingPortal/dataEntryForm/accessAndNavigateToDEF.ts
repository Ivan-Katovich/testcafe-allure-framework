import app from '../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.dataEntryForm.pack. - Test ID 30000: DEF_Access and Navigate to Data Entry form (new and existing)`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const dataSet = (function() {
    const fullData = [
        {
            ipType: 'Patent',
            targetDef: 'TA DEF for Patent',
            ipTypeName: 'PatentMasters',
            query: 'PA All Cases',
            childAction: {name: 'Action', type: 'hierarchy', value: 'Abstract Due - (ABSD)'},
            childExpenses: { name: 'Expense', type: 'autocomplete', value: 'Legal Services - (LGL)' },
            brief: 'true'
        },
        {
            ipType: 'Disclosure',
            targetDef: 'TA DEF for Disclosure',
            ipTypeName: 'DisclosureMasters',
            query: 'DS All Cases',
            childAction: {name: 'Action', type: 'autocomplete', value: 'Abstract Due - (ABSD)'},
            childExpenses: { name: 'Expense', type: 'autocomplete', value: 'Legal Services - (LGL)' },
            brief: 'false'
        },
        {
            ipType: 'Trademark',
            targetDef: 'TA DEF for Trademark',
            ipTypeName: 'TrademarkMasters',
            query: 'TM All Cases',
            childAction: {name: 'Action', type: 'autocomplete', value: 'Abandoned - (ABN)'},
            childExpenses: { name: 'Expense', type: 'autocomplete', value: 'Legal Services - (LGL)' },
            brief: 'false'
        },
        {
            ipType: 'GeneralIP1',
            targetDef: 'TA DEF for GeneralIP1',
            ipTypeName: 'GeneralIP1Masters',
            query: 'GIP1 All Cases',
            childAction: {name: 'Action', type: 'autocomplete', value: 'Audit - (AUD)'},
            childExpenses: { name: 'Expense', type: 'autocomplete', value: 'Legal Fees - (LGL)' },
            brief: 'false'
        }
    ];
    return fullData;
})();

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        .before(async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Disable Edit/Visible permission for CG (API)', async () => {
                if (index === 0) {
                    app.ui.setCookie();
                    const changes = [{Path: 'PatentMasters', EditPermission: false, VisiblePermission: false},
                        {Path: 'DisclosureMasters', EditPermission: false, VisiblePermission: false},
                        {Path: 'TrademarkMasters', EditPermission: false, VisiblePermission: false},
                        {Path: 'GeneralIP1Masters', EditPermission: false, VisiblePermission: false}];
                    await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
                }
            });
        })
        (`Check Data Entry and Query without Edit/Visible permissions for IP Type (Steps 1-3 - ${data.ipType})`, async (t) => {
            await app.step('Open DEF without edit/visible permissions', async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.targetDef);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.getCount('fields')).eql(0)
                    .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Save & Validate')).notOk()
                    .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Save', {isTextExact: true})).notOk()
                    .expect(await app.ui.dataEntryBoard.getChildRecordsNames())
                    .eql(['Related Records', 'Automation Results', 'Collaboration Comments', 'Collaboration History']);
                await app.ui.dataEntryBoard.selectChildRecord('Related Records');
                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).notOk();
            });
            await app.step('Check query functionality', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.kendoTreeview.open(`${data.ipType}>${data.query}`);
                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.queryBoard.isVisible('securityError')).ok()
                    .expect(await app.ui.queryBoard.getText('errorHeader'))
                    .eql('The selected query cannot be run.')
                    .expect(await app.ui.queryBoard.getText('errorBody'))
                    .eql('Conditional security has been applied to this query and it requires additional result fields.')
                    .expect(await app.ui.queryBoard.getText('errorContactAdmin'))
                    .eql('Please contact your administrator for more information.');
            });
        })
        .after(async (t) => {
            await app.step('Restore Edit/Visible permission for CG (API)', async () => {
                if (index + 1 === dataSet.length || globalConfig.brief) {
                    app.ui.setCookie();
                    const changes = [{Path: 'PatentMasters', EditPermission: true, VisiblePermission: true},
                        {Path: 'DisclosureMasters', EditPermission: true, VisiblePermission: true},
                        {Path: 'TrademarkMasters', EditPermission: true, VisiblePermission: true},
                        {Path: 'GeneralIP1Masters', EditPermission: true, VisiblePermission: true}];
                    await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
                }
            });
            app.ui.resetRequestLogger();
        });
});

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        .before(async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Disable Edit permission for CG (API)', async () => {
                if (index === 0) {
                    app.ui.setCookie();
                    const changes = [{Path: 'PatentMasters', EditPermission: false},
                        {Path: 'DisclosureMasters', EditPermission: false},
                        {Path: 'TrademarkMasters', EditPermission: false},
                        {Path: 'GeneralIP1Masters', EditPermission: false}];
                    await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
                }
            });
        })
        (`Check Data Entry without Edit permissions for IP Type (Step 4 - ${data.ipType})`, async (t) => {
            await app.step('Open DEF without edit permissions', async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.targetDef);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('fields')).ok()
                    .expect(await app.ui.dataEntryBoard.getCount('fields')).gt(0)
                    .expect(await app.ui.dataEntryBoard.areNoInputsInFields()).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Save', {isTextExact: true})).notOk()
                    .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Save & Validate')).notOk();
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).notOk();
            });
        })
        .after(async (t) => {
            await app.step('Restore Edit/Visible permission for CG (API)', async () => {
                if (index + 1 === dataSet.length || globalConfig.brief) {
                    app.ui.setCookie();
                    const changes = [{Path: 'PatentMasters', EditPermission: true},
                        {Path: 'DisclosureMasters', EditPermission: true},
                        {Path: 'TrademarkMasters', EditPermission: true},
                        {Path: 'GeneralIP1Masters', EditPermission: true}];
                    await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
                }
            });
            app.ui.resetRequestLogger();
        });
});

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        .before(async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Enable only edit permission for only one field in child tab for CG (API)', async () => {
                if (index === 0) {
                    app.ui.setCookie();
                    const changes = [{Path: 'PatentMasters', EditPermission: false},
                        {Path: 'PatentMasters', EditPermission: null, isOnly: true},
                        {Path: 'PatentMasters>ACTIONS', EditPermission: null, isOnly: true},
                        {Path: 'PatentMasters>ACTIONS>Action', EditPermission: true},
                        {Path: 'DisclosureMasters', EditPermission: false},
                        {Path: 'DisclosureMasters', EditPermission: null, isOnly: true},
                        {Path: 'DisclosureMasters>ACTIONS', EditPermission: null, isOnly: true},
                        {Path: 'DisclosureMasters>ACTIONS>Action', EditPermission: true},
                        {Path: 'TrademarkMasters', EditPermission: false},
                        {Path: 'TrademarkMasters', EditPermission: null, isOnly: true},
                        {Path: 'TrademarkMasters>ACTIONS', EditPermission: null, isOnly: true},
                        {Path: 'TrademarkMasters>ACTIONS>Action', EditPermission: true},
                        {Path: 'GeneralIP1Masters', EditPermission: false},
                        {Path: 'GeneralIP1Masters', EditPermission: null, isOnly: true},
                        {Path: 'GeneralIP1Masters>ACTIONS', EditPermission: null, isOnly: true},
                        {Path: 'GeneralIP1Masters>ACTIONS>Action', EditPermission: true}];
                    await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
                }
            });
        })
        (`Check Data Entry and Query with some fields with edit permissions on child record for IP Type (Step 5,6 - ${data.ipType})`, async (t) => {
            await app.step('Check DEF with some fields with edit permissions on child record', async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.targetDef);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('fields')).ok()
                    .expect(await app.ui.dataEntryBoard.getCount('fields')).gt(0)
                    .expect(await app.ui.dataEntryBoard.areNoInputsInFields()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save', {isTextExact: true})).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).notOk()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok();
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).ok();
                await app.ui.dataEntryBoard.childRecord.addNew();
                await t
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).ok();
                const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await childAction.getField('Action', data.childAction.type).fill(data.childAction.value);
                await t
                    .expect(await childAction.getField('Action', data.childAction.type).getValue()).eql(data.childAction.value);
            });
            await app.step('Check query with some fields with edit permissions on child record', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.kendoTreeview.open(`${data.ipType}>${data.query}`);
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Save', {isTextExact: true})).notOk()
                    .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Save & Validate')).notOk();
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save', {isTextExact: true})).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).notOk()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok();
                await app.ui.dataEntryBoard.childRecord.addNew();
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save', {isTextExact: true})).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok();
            });
        })
        .after(async (t) => {
            await app.step('Restore Edit/Visible permission for CG (API)', async () => {
                if (index + 1 === dataSet.length || globalConfig.brief) {
                    app.ui.setCookie();
                    const changes = [{Path: 'PatentMasters', EditPermission: true},
                        {Path: 'DisclosureMasters', EditPermission: true},
                        {Path: 'TrademarkMasters', EditPermission: true},
                        {Path: 'GeneralIP1Masters', EditPermission: true}];
                    await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
                }
            });
            app.ui.resetRequestLogger();
        });
});

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        .before(async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Enable all Record Management Forms and Data Entry Forms (API)', async () => {
                if (index === 0) {
                    app.ui.setCookie();
                    await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [
                        {name: 'Record Management Form', check: true},
                        {name: 'New Data Entry', check: true}
                    ]);
                }
            });
        })
        (`Check DEF and "View in" dropdown with all permissions (Steps 7-9,19,20 - ${data.ipType})`, async (t) => {
            await app.step('Open DEF with all permissions', async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.targetDef);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('fields')).ok()
                    .expect(await app.ui.dataEntryBoard.getCount('fields')).gt(0)
                    .expect(await app.ui.dataEntryBoard.getCount('childRecords')).gt(4)
                    .expect(await app.ui.dataEntryBoard.areNoInputsInFields()).notOk()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save', {isTextExact: true})).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).notOk()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('recordIdRow')).notOk();
                await app.ui.dataEntryBoard.selectChildRecord('Expenses');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.childRecord.addNew();
                const childRecord = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await childRecord.getField(data.childExpenses.name, data.childExpenses.type, {isTextExact: true}).fill(data.childExpenses.value);
                await t
                    .expect(await childRecord.getField(data.childExpenses.name, data.childExpenses.type, {isTextExact: true}).getValue())
                    .eql(data.childExpenses.value);
            });
            await app.step('Verify "View in" dropdown', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.kendoTreeview.open(`${data.ipType}>${data.query}`);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                const items = await app.ui.kendoPopup.getAllItemsText();
                app.ui.setCookie();
                const expectedItems = (await app.api.administration.getAllDataEntryTemplates()).Items
                    .filter((item) => item.IPTypeName === data.ipTypeName)
                    .map((item) => item.CustomResourceName.trim());
                await t
                    .expect(items.sort()).eql(expectedItems.sort());
            });
            await app.step('Verify "Data Entry" dropdown', async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                const items = await app.ui.kendoPopup.getAllItemsText();
                const expectedItems = (await app.api.administration.getAllDataEntryTemplates()).Items
                    .filter((item) => item.IPTypeName !== 'Parties')
                    .map((item) => item.CustomResourceName.trim());
                await t
                    .expect(items.sort()).eql(expectedItems.sort());
            });
        })
        .after(async (t) => {
            app.ui.resetRequestLogger();
        });
});

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        .before(async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Restore permission for DEF in System Resources --> New Data Entry for CG (API)', async () => {
                app.ui.setCookie();
                await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{name: `New Data Entry>${data.targetDef}`, check: true}]);
            });
            await app.step('Open DEF and save URL', async () => {
                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.targetDef);
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.url = await app.ui.getCurrentUrl();
            });
            await app.step('Disable permission for DEF in System Resources --> New Data Entry for CG (API)', async () => {
                app.ui.setCookie();
                await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{name: `New Data Entry>${data.targetDef}`, check: false}]);
            });
        })
        (`Check dropdowns and messages with disabled New Data Entry permission for DEF (Steps 10-12 - ${data.ipType})`, async (t) => {
            await app.step('Verify "View in" dropdown', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.kendoTreeview.open(`${data.ipType}>${data.query}`);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                const items = await app.ui.kendoPopup.getAllItemsText();
                app.ui.setCookie();
                const expectedItems = (await app.api.administration.getAllDataEntryTemplates()).Items
                    .filter((item) => item.IPTypeName === data.ipTypeName)
                    .map((item) => item.CustomResourceName.trim());
                await t
                    .expect(items).contains(data.targetDef)
                    .expect(items.sort()).eql(expectedItems.sort());
            });
            await app.step('Verify "Data Entry" dropdown', async () => {
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Data Entry');
                const items = await app.ui.kendoPopup.getAllItemsText();
                await t
                    .expect(items).notContains(data.targetDef);
            });
            await app.step('Verify no permission message', async () => {
                await app.ui.navigate(app.memory.current.url);
                await app.ui.waitLoading({checkErrors: true});
                await app.services.time.wait(async () => await app.ui.queryBoard.getText('unauthorized'));
                await t
                    .expect(await app.ui.queryBoard.isVisible('unauthorized')).ok()
                    .expect(await app.ui.queryBoard.getText('unauthorized'))
                    .contains(`Sorry, this content does not exist or you don't have permission to access it.`)
                    .expect(await app.ui.queryBoard.getText('unauthorized'))
                    .contains(`Please contact your administrator if you think there has been an error.`)
                    .expect(await app.ui.noErrors()).ok('A System Error thrown');
            });
        })
        .after(async (t) => {
            await app.step('Restore permission New Data Entry for CG (API)', async () => {
                if (index + 1 === dataSet.length || globalConfig.brief) {
                    app.ui.setCookie();
                    await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{name: `New Data Entry`, check: true}]);
                }
            });
            app.ui.resetRequestLogger();
        });
});

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        .before(async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Restore permission for DEF in System Resources --> Record Management Form for CG (API)', async () => {
                app.ui.setCookie();
                await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{name: `Record Management Form>${data.targetDef}`, check: true}]);
            });
            await app.step('Open a record using DEF View in and save URL', async () => {
                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.kendoTreeview.open(`${data.ipType}>${data.query}`);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.targetDef);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.url = await app.ui.getCurrentUrl();
            });
            await app.step('Disable permission for DEF in System Resources --> Record Management Form for CG (API)', async () => {
                app.ui.setCookie();
                await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{name: `Record Management Form>${data.targetDef}`, check: false}]);
            });
        })
        (`Check "View in" dropdown and error message with disabled Record Management Form permission for DEF (Steps 13-15 - ${data.ipType})`, async (t) => {
            await app.step('Verify "View in" dropdown', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({ checkErrors: true });

                await t
                    .expect(await app.ui.queryBoard.isVisible('queryName')).ok('The Query Board is not displayed after clicking Query tab from DEF record');

                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                const items = await app.ui.kendoPopup.getAllItemsText();
                app.ui.setCookie();
                const expectedItems = (await app.api.administration.getAllDataEntryTemplates()).Items
                    .filter((item) => item.IPTypeName === data.ipTypeName)
                    .map((item) => item.CustomResourceName.trim())
                    .filter((name) => name !== data.targetDef);
                await t
                    .expect(items).notContains(data.targetDef)
                    .expect(items.sort()).eql(expectedItems.sort());
            });
            await app.step('Verify no permission message', async () => {
                await app.ui.navigate(app.memory.current.url);
                await app.ui.waitLoading({checkErrors: true});
                await app.services.time.wait(async () => await app.ui.queryBoard.getText('unauthorized'));
                await t
                    .expect(await app.ui.queryBoard.isVisible('unauthorized')).ok()
                    .expect(await app.ui.queryBoard.getText('unauthorized'))
                    .contains(`Sorry, this content does not exist or you don't have permission to access it.`)
                    .expect(await app.ui.queryBoard.getText('unauthorized'))
                    .contains(`Please contact your administrator if you think there has been an error.`)
                    .expect(await app.ui.noErrors()).ok('A System Error thrown');
            });
        })
        .after(async (t) => {
            await app.step('Restore permission for System Resources --> Record Management Form for CG (API)', async () => {
                if (index + 1 === dataSet.length || globalConfig.brief) {
                    app.ui.setCookie();
                    await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{name: `Record Management Form`, check: true}]);
                }
            });
            app.ui.resetRequestLogger();
        });
});

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        .before(async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Disable permission for all DEF in System Resources --> Record Management Form for CG (API)', async () => {
                if (index === 0) {
                    app.ui.setCookie();
                    await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [
                        {name: 'Record Management Form', check: false},
                        {name: 'New Data Entry', check: false}
                    ]);
                }
            });
        })
        (`Check "View in" and "Data Entry" controls not present with disabled all New Data Entry and Record Management Forms (Steps 16-18 - ${data.ipType})`, async (t) => {
            await app.step('Verify "Data Entry" link', async () => {
                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.naviBar.isPresent('links', 'Data Entry')).notOk();
            });
            await app.step('Verify "View in" link', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.kendoTreeview.open(`${data.ipType}>${data.query}`);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.queryBoard.isPresent('menuItems', 'View in:')).notOk();
            });
        })
        .after(async (t) => {
            await app.step('Enable all Record Management Forms and Data Entry Forms (API)', async () => {
                if (index + 1 === dataSet.length || globalConfig.brief) {
                    app.ui.setCookie();
                    await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [
                        {name: 'Record Management Form', check: true},
                        {name: 'New Data Entry', check: true}
                    ]);
                }
            });
            app.ui.resetRequestLogger();
        });
});
