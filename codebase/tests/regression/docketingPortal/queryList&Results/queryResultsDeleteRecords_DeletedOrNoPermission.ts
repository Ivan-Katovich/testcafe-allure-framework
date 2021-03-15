import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.queryList&Results.pack. - Test ID 29994: Query - Query Results - Delete Case Record(s) - deleted records or with no delete permissions`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    })
    .after(async () => {
        await app.step('Restore Delete permissions in content group (API)', async () => {
            await app.api.login();
            await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
        });
        await app.step('Delete created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(recordsToDelete);
        });
    });

const dataSet = (function() {
    const fullData = [
        {
            query: 'Patent>TA PA All Cases',
            deletionQuery: 'Deletion Management>Patent Deleted Query',
            masterIdColumn: 'PATENTMASTERID',
            ipType: 'PatentMasters',
            type: 'patent',
            condition: {
                name: 'US Records',
                fieldName: 'Country / Region',
                valueFitCondition: 'US - (United States)',
                valueDoesNotFitCondition: 'AE - (United Arab Emirates)'
            },
            brief: 'true'
        },
        {
            query: 'Trademark>TA TM All Cases',
            deletionQuery: 'Deletion Management>Trademark Deleted Query',
            masterIdColumn: 'TRADEMARKMASTERID',
            ipType: 'TrademarkMasters',
            type: 'trademark',
            condition: {
                name: 'US Records',
                fieldName: 'Country / Region',
                valueFitCondition: 'US - (United States)',
                valueDoesNotFitCondition: 'AE - (United Arab Emirates)'
            },
            brief: 'false'
        },
        {
            query: 'Disclosure>TA DS All Cases',
            deletionQuery: 'Deletion Management>Disclosure Deleted Query',
            masterIdColumn: 'DISCLOSUREMASTERID',
            ipType: 'DisclosureMasters',
            type: 'disclosure',
            condition: {
                name: 'TA Business Unit ',
                fieldName: 'Business Unit',
                valueFitCondition: 'Acme Propellants - (ACME-1)',
                valueDoesNotFitCondition: 'Chemical Division - (CD)'
            },
            brief: 'false'
        },
        {
            query: 'GeneralIP1>TA GIP1 All Cases',
            deletionQuery: 'Deletion Management>GeneralIP1 Deleted Query',
            masterIdColumn: 'GENERALIP1MASTERID',
            ipType: 'GeneralIP1Masters',
            type: 'generalip',
            condition: {
                name: 'TA Expired Status',
                fieldName: 'Status',
                valueFitCondition: 'Expired - (EXP)',
                valueDoesNotFitCondition: 'Under Review - (RVW)'
            },
            brief: 'false'
        }
    ];
    return fullData;
})();

const data = dataSet[0];

const currentCGSettings = {
    path: null,
    permission: null,
    condition: null
};

const recordsToDelete = [];

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.executeQuery)
        .before(async () => {
            await app.step('Disable Delete permissions in content group (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: data.ipType, permission: false, condition: null})) {
                    await app.api.login();
                    await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    await app.api.administration.contentGroup.setApplicationSecurity(data.ipType, { deletePermission: false });
                    await app.api.administration.contentGroup.save();
                    currentCGSettings.path = data.ipType;
                    currentCGSettings.permission = false;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete record(s) when to all of them user doesn't have Delete permissions: 1 record - OK (${data.ipType} - Steps 1-5)`, async (t: TestController) => {
            await app.step('Create record (API)', async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.type, 'simple');
                app.memory.current.array = [app.memory.current.createRecordData];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Select a record and verify the More menu (Step 4)', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                const menuItems: string[] = await app.ui.kendoPopup.getAllItemsText();
                const deleteTopBorder = await app.ui.kendoPopup.getStyleProperty('simpleItems', 'border-top-style', 'Delete');

                await t
                    .expect(menuItems.pop()).eql('Delete')
                    .expect(menuItems).eql(menuItems.sort(app.services.sorting.appSortAlphabetically))
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Delete')).ok()
                    .expect(deleteTopBorder).eql('solid');
            });
            await app.step('Select Delete in More menu (Step 5)', async () => {
                app.ui.resetRequestLogger('executeQuery');
                app.memory.current.masterId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(app.memory.current.createRecordData.reqData.recordName)).getValue(data.masterIdColumn);
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql('The selected record(s) was not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission')
                    .expect(firstColumnValues).contains(app.memory.current.createRecordData.reqData.recordName)
                    .expect(app.ui.getLastRequest('executeQuery')).notOk();
            });
            await app.step('Verify records in Deletion Management (API)', async () => {
                await app.api.login();
                await app.api.deletionManagementQuery.openQuery(data.deletionQuery);
                app.api.deletionManagementQuery.sort('Deletion Date', app.api.query.sortDirection.desc);
                await app.api.deletionManagementQuery.runQuery();
                const recordValues = await app.api.deletionManagementQuery.getColumnValuesFromResults(data.masterIdColumn);

                await t
                    .expect(recordValues).notContains(app.memory.current.masterId);
            });
            await app.step('Click Ok on the confirmation modal (Step 6)', async () => {
                app.ui.resetRequestLogger('executeQuery');
                await app.ui.errorModal.click('buttons', 'Ok');

                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).isChecked()).ok()
                    .expect(app.ui.getLastRequest('executeQuery')).notOk();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.executeQuery)
        .before(async () => {
            await app.step('Disable Delete permissions in content group (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: data.ipType, permission: false, condition: null})) {
                    await app.api.login();
                    await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    await app.api.administration.contentGroup.setApplicationSecurity(data.ipType, { deletePermission: false });
                    await app.api.administration.contentGroup.save();
                    currentCGSettings.path = data.ipType;
                    currentCGSettings.permission = false;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete record(s) when to all of them user doesn\'t have Delete permissions: 2 records - Cancel (${data.ipType} - Steps 1-5)`, async (t: TestController) => {
            await app.step('Create records (API)', async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Select 2 records and Delete (Step 5)', async () => {
                app.ui.resetRequestLogger('executeQuery');
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[0].reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[1].reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql('The selected record(s) was not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission')
                    .expect(firstColumnValues).contains(app.memory.current.array[0].reqData.recordName)
                    .expect(firstColumnValues).contains(app.memory.current.array[1].reqData.recordName)
                    .expect(app.ui.getLastRequest('executeQuery')).notOk();
            });
            await app.step('Verify records in Deletion Management (API)', async () => {
                await app.api.deletionManagementQuery.openQuery(data.deletionQuery);
                app.api.deletionManagementQuery.sort('Deletion Date', app.api.query.sortDirection.desc);
                await app.api.deletionManagementQuery.runQuery();
                const recordValues = await app.api.deletionManagementQuery.getColumnValuesFromResults(data.masterIdColumn);

                await t
                    .expect(recordValues).notContains(app.memory.current.array[0].respData.Record.MasterId.toString())
                    .expect(recordValues).notContains(app.memory.current.array[1].respData.Record.MasterId.toString());
            });
            await app.step('Click [x] on the confirmation modal (Step 6)', async () => {
                app.ui.resetRequestLogger('executeQuery');
                await app.ui.errorModal.click('cross');

                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[0].reqData.recordName).isChecked()).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[1].reqData.recordName).isChecked()).ok()
                    .expect(app.ui.getLastRequest('executeQuery')).notOk();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.executeQuery)
        .before(async () => {
            await app.step('Disable Delete permissions in content group (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: data.ipType, permission: false, condition: null})) {
                    await app.api.login();
                    await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    await app.api.administration.contentGroup.setApplicationSecurity(data.ipType, { deletePermission: false });
                    await app.api.administration.contentGroup.save();
                    currentCGSettings.path = data.ipType;
                    currentCGSettings.permission = false;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete record(s) when to all of them user doesn\'t have Delete permissions: all records - OK (${data.ipType} - Steps 1-5)`, async (t: TestController) => {
            await app.step('Create records (API)', async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Add filter in criteria builder (Step 5)', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(data.masterIdColumn);
                await row.getField('Operator', 'dropdown').fill('In');
                await row.getField('Value', 'input').fill(app.memory.current.array.map((x) => x.respData.Record.MasterId.toString()).join());
                await app.ui.queryBoard.criteriaBuilder.showResults();
            });
            await app.step('Select all records and Delete', async () => {
                app.ui.resetRequestLogger('executeQuery');
                await app.ui.queryBoard.queryResultsGrid.selectAllRecords();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql('The selected record(s) was not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission')
                    .expect(app.memory.current.array.every((x) => firstColumnValues.includes(x.reqData.recordName))).ok()
                    .expect(app.ui.getLastRequest('executeQuery')).notOk();
            });
            await app.step('Verify records in Deletion Management (API)', async () => {
                await app.api.deletionManagementQuery.openQuery(data.deletionQuery);
                app.api.deletionManagementQuery.sort('Deletion Date', app.api.query.sortDirection.desc);
                await app.api.deletionManagementQuery.runQuery();
                const recordValues = await app.api.deletionManagementQuery.getColumnValuesFromResults(data.masterIdColumn);

                await t
                    .expect(app.memory.current.array.every((x) => !recordValues.includes(x.respData.Record.MasterId.toString()))).ok();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Set content group to default (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: null, permission: null, condition: null})) {
                    await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
                    currentCGSettings.path = null;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete record(s) when all of them have been already deleted: 1 record - OK (${data.ipType} - Steps 6.0-7)`, async (t: TestController) => {
            await app.step(`Create a ${data.type} record (API) (Step 7)`, async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.type, 'simple');
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Select created record', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
            });
            await app.step('Delete selected record (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords([ app.memory.current.createRecordData.respData ]);
            });
            await app.step('Select Delete in More menu', async () => {
                app.ui.resetRequestLogger('executeQuery');
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql('The selected record(s) was not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission')
                    .expect(firstColumnValues).contains(app.memory.current.createRecordData.reqData.recordName)
                    .expect(app.ui.getLastRequest('executeQuery')).notOk();
            });
            await app.step('Verify records in Deletion Management (API)', async () => {
                await app.api.login();
                await app.api.deletionManagementQuery.openQuery(data.deletionQuery);
                app.api.deletionManagementQuery.sort('Deletion Date', app.api.query.sortDirection.desc);
                await app.api.deletionManagementQuery.runQuery();
                const recordValues = await app.api.deletionManagementQuery.getColumnValuesFromResults(data.masterIdColumn);

                await t
                    .expect(recordValues.filter((x) => x === app.memory.current.createRecordData.respData.Record.MasterId.toString()).length).eql(1);
            });
            await app.step('Click Ok on the confirmation modal (Step 8)', async () => {
                app.ui.resetRequestLogger('executeQuery');
                await app.ui.errorModal.click('buttons', 'Ok');

                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).isChecked()).ok()
                    .expect(app.ui.getLastRequest('executeQuery')).notOk();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Set content group to default (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: null, permission: null, condition: null})) {
                    await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
                    currentCGSettings.path = null;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete record(s) when all of them have been already deleted: 2 records - Close (${data.ipType} - Steps 6.1-7)`, async (t: TestController) => {
            await app.step(`Create 2 ${data.type} records (API) (Step 7)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Select created records', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[0].reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[1].reqData.recordName).check();
            });
            await app.step('Delete all selected records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords( app.memory.current.array.map((x) => x.respData) );
            });
            await app.step('Click More and select Delete', async () => {
                app.ui.resetRequestLogger('executeQuery');
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql('The selected record(s) was not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission')
                    .expect(firstColumnValues).contains(app.memory.current.array[0].reqData.recordName)
                    .expect(firstColumnValues).contains(app.memory.current.array[1].reqData.recordName)
                    .expect(app.ui.getLastRequest('executeQuery')).notOk();
            });
            await app.step('Verify records in Deletion Management (API)', async () => {
                await app.api.deletionManagementQuery.openQuery(data.deletionQuery);
                app.api.deletionManagementQuery.sort('Deletion Date', app.api.query.sortDirection.desc);
                await app.api.deletionManagementQuery.runQuery();
                const recordValues = await app.api.deletionManagementQuery.getColumnValuesFromResults(data.masterIdColumn);

                await t
                    .expect(app.memory.current.array.every((x) => recordValues.filter((y) => y === x.respData.Record.MasterId.toString()).length === 1)).ok();
            });
            await app.step('Click [x] on the confirmation modal (Step 8)', async () => {
                app.ui.resetRequestLogger('executeQuery');
                await app.ui.errorModal.click('cross');

                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[0].reqData.recordName).isChecked()).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[1].reqData.recordName).isChecked()).ok()
                    .expect(app.ui.getLastRequest('executeQuery')).notOk();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Set content group to default (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: null, permission: null, condition: null})) {
                    await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
                    currentCGSettings.path = null;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete record(s) when all of them have been already deleted: all records - Cancel (${data.ipType} - Step 6.2)`, async (t: TestController) => {
            await app.step(`Create 5 ${data.type} records (API)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Add filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'dropdown').fill(data.masterIdColumn);
                await row.getField('Operator', 'dropdown').fill('In');
                await row.getField('Value', 'input').fill(app.memory.current.array.map((x) => x.respData.Record.MasterId).join());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(app.memory.current.array.length);
            });
            await app.step('Delete All selected records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords( app.memory.current.array.map((x) => x.respData) );
            });
            await app.step('Select all records and Delete', async () => {
                await app.ui.queryBoard.queryResultsGrid.selectAllRecords();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.confirmationModal.isVisible()).ok()
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                    .eql('The record count for this query has changed. Do you want to proceed with the changed result set?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok();
            });
            await app.step('Click Cancel on confirmation modal', async () => {
                await app.ui.confirmationModal.click('buttons', 'Cancel');
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(0);
            });
            await app.step('Verify records in Deletion Management (API)', async () => {
                await app.api.deletionManagementQuery.openQuery(data.deletionQuery);
                app.api.deletionManagementQuery.sort('Deletion Date', app.api.query.sortDirection.desc);
                await app.api.deletionManagementQuery.runQuery();
                const recordValues = await app.api.deletionManagementQuery.getColumnValuesFromResults(data.masterIdColumn);

                await t
                    .expect(app.memory.current.array.every((x) => recordValues.filter((y) => y === x.respData.Record.MasterId.toString()).length === 1)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Set content group to default (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: null, permission: null, condition: null})) {
                    await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
                    currentCGSettings.path = null;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete record(s) when all of them have been already deleted: all records - Continue (${data.ipType} - Step 6.2)`, async (t: TestController) => {
            await app.step(`Create 5 ${data.type} records (API)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Add filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'dropdown').fill(data.masterIdColumn);
                await row.getField('Operator', 'dropdown').fill('In');
                await row.getField('Value', 'input').fill(app.memory.current.array.map((x) => x.respData.Record.MasterId).join());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(app.memory.current.array.length);
            });
            await app.step('Delete selected records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords( app.memory.current.array.map((x) => x.respData) );
            });
            await app.step('Select all records and Delete', async () => {
                await app.ui.queryBoard.queryResultsGrid.selectAllRecords();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.confirmationModal.isVisible()).ok()
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                    .eql('The record count for this query has changed. Do you want to proceed with the changed result set?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok();
            });
            await app.step('Click Continue on confirmation modal', async () => {
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(0)
                    .expect(await app.ui.getText('notificationMessage')).eql('Selected record(s) were deleted successfully.');
            });
            await app.step('Verify records in Deletion Management (API)', async () => {
                await app.api.deletionManagementQuery.openQuery(data.deletionQuery);
                app.api.deletionManagementQuery.sort('Deletion Date', app.api.query.sortDirection.desc);
                await app.api.deletionManagementQuery.runQuery();
                const recordValues = await app.api.deletionManagementQuery.getColumnValuesFromResults(data.masterIdColumn);

                await t
                    .expect(app.memory.current.array.every((x) => recordValues.filter((y) => y === x.respData.Record.MasterId.toString()).length === 1)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.executeQuery)
        .before(async () => {
            await app.step('Disable Delete permissions in content group (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: data.ipType, permission: null, condition: data.condition.name})) {
                    await app.api.login();
                    await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    await app.api.administration.contentGroup.setApplicationSecurity(data.ipType, { deletePermission: true });
                    await app.api.administration.contentGroup.setApplicationSecurityWithCondition(data.ipType, { deleteCondition: data.condition.name });
                    await app.api.administration.contentGroup.save();
                    currentCGSettings.path = data.ipType;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = data.condition.name;
                }
            });
        })
        (`Delete a set of records, some of which have Delete permissions: 2 records - OK (${data.ipType} - Steps 8-9)`, async (t: TestController) => {
            await app.step(`Create 2 ${data.type} records (API)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];

                await app.api.dataEntryForm.openRecord(app.memory.current.array[0].respData.Record.MasterId,
                    app.memory.current.array[0].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueFitCondition);
                await app.api.dataEntryForm.save();

                await app.api.dataEntryForm.openRecord(app.memory.current.array[1].respData.Record.MasterId,
                    app.memory.current.array[1].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueDoesNotFitCondition);
                await app.api.dataEntryForm.save();
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Select a record and verify the More menu', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[0].reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[1].reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
            });
            await app.step('Select Delete in More menu', async () => {
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql(
                        'One or more selected record(s) was deleted successfully.' +
                        '\nThe following record(s) was not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission' +
                        `\nMaster ID: ${app.memory.current.array[1].respData.Record.MasterId}.`)
                    .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok();
            });
            await app.step('Click Ok on the confirmation modal', async () => {
                await app.ui.errorModal.click('buttons', 'Ok');
                await app.ui.waitLoading();
                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();
                const checkboxValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues('checkbox');

                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok()
                    .expect(firstColumnValues).notContains(app.memory.current.array[0].reqData.recordName)
                    .expect(firstColumnValues).contains(app.memory.current.array[1].reqData.recordName)
                    .expect(checkboxValues.every((x) => x === false)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.executeQuery)
        .before(async () => {
            await app.step('Disable Delete permissions in content group (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: data.ipType, permission: null, condition: data.condition.name})) {
                    await app.api.login();
                    await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    await app.api.administration.contentGroup.setApplicationSecurity(data.ipType, { deletePermission: true });
                    await app.api.administration.contentGroup.setApplicationSecurityWithCondition(data.ipType, { deleteCondition: data.condition.name });
                    await app.api.administration.contentGroup.save();
                    currentCGSettings.path = data.ipType;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = data.condition.name;
                }
            });
        })
        (`Delete a set of records, some of which have Delete permissions: 3 records - Close (${data.ipType} - Steps 8-9)`, async (t: TestController) => {
            await app.step(`Create 3 ${data.type} records (API)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];

                await app.api.dataEntryForm.openRecord(app.memory.current.array[0].respData.Record.MasterId,
                    app.memory.current.array[0].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueFitCondition);
                await app.api.dataEntryForm.save();

                await app.api.dataEntryForm.openRecord(app.memory.current.array[1].respData.Record.MasterId,
                    app.memory.current.array[1].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueDoesNotFitCondition);
                await app.api.dataEntryForm.save();

                await app.api.dataEntryForm.openRecord(app.memory.current.array[2].respData.Record.MasterId,
                    app.memory.current.array[2].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueDoesNotFitCondition);
                await app.api.dataEntryForm.save();
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Select created records', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[0].reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[1].reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[2].reqData.recordName).check();
            });
            await app.step('Select 2 records and Delete', async () => {
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql(
                        'One or more selected record(s) was deleted successfully.' +
                        '\nThe following record(s) was not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission' +
                        `\nMaster ID: ${app.memory.current.array[1].respData.Record.MasterId}, ${app.memory.current.array[2].respData.Record.MasterId}.`)
                    .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok();
            });
            await app.step('Click [x] on the confirmation modal', async () => {
                await app.ui.errorModal.click('cross');
                await app.ui.waitLoading();
                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();
                const checkboxValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues('checkbox');

                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok()
                    .expect(firstColumnValues).notContains(app.memory.current.array[0].reqData.recordName)
                    .expect(firstColumnValues).contains(app.memory.current.array[1].reqData.recordName)
                    .expect(firstColumnValues).contains(app.memory.current.array[2].reqData.recordName)
                    .expect(checkboxValues.every((x) => x === false)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.executeQuery)
        .before(async () => {
            await app.step('Disable Delete permissions in content group (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: data.ipType, permission: null, condition: data.condition.name})) {
                    await app.api.login();
                    await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    await app.api.administration.contentGroup.setApplicationSecurity(data.ipType, { deletePermission: true });
                    await app.api.administration.contentGroup.setApplicationSecurityWithCondition(data.ipType, { deleteCondition: data.condition.name });
                    await app.api.administration.contentGroup.save();
                    currentCGSettings.path = data.ipType;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = data.condition.name;
                }
            });
        })
        (`Delete a set of records, some of which have Delete permissions: all records (${data.ipType} - Step 8)`, async (t: TestController) => {
            await app.step(`Create 5 ${data.type} records (API)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];

                await app.api.dataEntryForm.openRecord(app.memory.current.array[0].respData.Record.MasterId,
                    app.memory.current.array[0].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueFitCondition);
                await app.api.dataEntryForm.save();

                await app.api.dataEntryForm.openRecord(app.memory.current.array[1].respData.Record.MasterId,
                    app.memory.current.array[1].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueFitCondition);
                await app.api.dataEntryForm.save();

                await app.api.dataEntryForm.openRecord(app.memory.current.array[2].respData.Record.MasterId,
                    app.memory.current.array[2].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueDoesNotFitCondition);
                await app.api.dataEntryForm.save();

                await app.api.dataEntryForm.openRecord(app.memory.current.array[3].respData.Record.MasterId,
                    app.memory.current.array[3].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueDoesNotFitCondition);
                await app.api.dataEntryForm.save();

                await app.api.dataEntryForm.openRecord(app.memory.current.array[4].respData.Record.MasterId,
                    app.memory.current.array[4].respData.ResourceId);
                await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueDoesNotFitCondition);
                await app.api.dataEntryForm.save();
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Add filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'dropdown').fill(data.masterIdColumn);
                await row.getField('Operator', 'dropdown').fill('In');
                await row.getField('Value', 'input').fill(app.memory.current.array.map((x) => x.respData.Record.MasterId).join());
                await app.ui.queryBoard.criteriaBuilder.showResults();

                await t
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(app.memory.current.array.length);
            });
            await app.step('Select all records and Delete', async () => {
                await app.ui.queryBoard.queryResultsGrid.selectAllRecords();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql(
                        'One or more selected record(s) were deleted successfully.' +
                        '\nOne or more selected record(s) were not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission')
                    .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok();
            });
            await app.step('Click Ok on confirmation modal', async () => {
                await app.ui.errorModal.click('buttons', 'Ok');
                await app.ui.waitLoading();
                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok()
                    .expect(firstColumnValues).notContains(app.memory.current.array[0].reqData.recordName)
                    .expect(firstColumnValues).notContains(app.memory.current.array[1].reqData.recordName)
                    .expect(firstColumnValues).contains(app.memory.current.array[2].reqData.recordName)
                    .expect(firstColumnValues).contains(app.memory.current.array[3].reqData.recordName)
                    .expect(firstColumnValues).contains(app.memory.current.array[4].reqData.recordName)
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(app.memory.current.array.length - 2);
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Set content group to default (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: null, permission: null, condition: null})) {
                    await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
                    currentCGSettings.path = null;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete 2 records, one of which have already been deleted (${data.ipType} - Step 10.1)`, async (t: TestController) => {
            await app.step(`Create 2 ${data.type} records (API)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Select created records', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[0].reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[1].reqData.recordName).check();
            });
            await app.step('Delete one of the selected records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords([ app.memory.current.array[0].respData ]);
            });
            await app.step('Click More and select Delete', async () => {
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql(
                        'One or more selected record(s) was deleted successfully.' +
                        '\nThe following record(s) was not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission' +
                        `\nMaster ID: ${app.memory.current.array[0].respData.Record.MasterId}.`)
                    .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok();
            });
            await app.step('Click OK and verify query results', async () => {
                await app.ui.errorModal.click('buttons', 'Ok');
                await app.ui.waitLoading();
                const checkboxValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues('checkbox');

                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();
                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok()
                    .expect(firstColumnValues).notContains(app.memory.current.array[0].reqData.recordName)
                    .expect(firstColumnValues).notContains(app.memory.current.array[1].reqData.recordName)
                    .expect(checkboxValues.every((x) => x === false)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Set content group to default (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: null, permission: null, condition: null})) {
                    await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
                    currentCGSettings.path = null;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete 3 records, 2 of which have already been deleted (${data.ipType} - Step 10.2)`, async (t: TestController) => {
            await app.step(`Create 2 ${data.type} records (API)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Select created records', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[0].reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[1].reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[2].reqData.recordName).check();
            });
            await app.step('Delete 2 of the selected records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords([
                    app.memory.current.array[0].respData,
                    app.memory.current.array[1].respData ]);
            });
            await app.step('Delete one of the selected records (API)', async () => {
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.errorModal.getText('title')).eql('Attention')
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql(
                        'One or more selected record(s) was deleted successfully.' +
                        '\nThe following record(s) was not deleted due to:' +
                        '\nDeleted by another user' +
                        '\nInsufficient permission' +
                        `\nMaster ID: ${app.memory.current.array[0].respData.Record.MasterId}, ${app.memory.current.array[1].respData.Record.MasterId}.`)
                    .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok();
            });
            await app.step('Click OK and verify query results', async () => {
                await app.ui.errorModal.click('buttons', 'Ok');
                await app.ui.waitLoading();
                const checkboxValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues('checkbox');

                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();
                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok()
                    .expect(firstColumnValues).notContains(app.memory.current.array[0].reqData.recordName)
                    .expect(firstColumnValues).notContains(app.memory.current.array[1].reqData.recordName)
                    .expect(firstColumnValues).notContains(app.memory.current.array[2].reqData.recordName)
                    .expect(checkboxValues.every((x) => x === false)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Set content group to default (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: null, permission: null, condition: null})) {
                    await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
                    currentCGSettings.path = null;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete all records, some of which have already been deleted and Cancel (${data.ipType} - Step 10.3.1)`, async (t: TestController) => {
            await app.step(`Create 5 ${data.type} records (API)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Add filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'dropdown').fill(data.masterIdColumn);
                await row.getField('Operator', 'dropdown').fill('In');
                await row.getField('Value', 'input').fill(app.memory.current.array.map((x) => x.respData.Record.MasterId).join());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(app.memory.current.array.length);
            });
            await app.step('Delete selected records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords([
                    app.memory.current.array[0].respData,
                    app.memory.current.array[1].respData ]);
            });
            await app.step('Select all records and Delete', async () => {
                await app.ui.queryBoard.queryResultsGrid.selectAllRecords();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.confirmationModal.isVisible()).ok()
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                    .eql('The record count for this query has changed. Do you want to proceed with the changed result set?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok();
            });
            await app.step('Click Cancel on confirmation modal', async () => {
                await app.ui.confirmationModal.click('buttons', 'Cancel');
                await app.ui.waitLoading();
                const firstColumnValues = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(firstColumnValues).notContains(app.memory.current.array[0].reqData.recordName)
                    .expect(firstColumnValues).notContains(app.memory.current.array[1].reqData.recordName);
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Set content group to default (API)', async () => {
                if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: null, permission: null, condition: null})) {
                    await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
                    currentCGSettings.path = null;
                    currentCGSettings.permission = null;
                    currentCGSettings.condition = null;
                }
            });
        })
        (`Delete all records, some of which have already been deleted and Continue (${data.ipType} - Step 10.3.2)`, async (t: TestController) => {
            await app.step(`Create 5 ${data.type} records (API)`, async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.type, 'simple')
                ];
            });
            await app.step('Login and run query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Add filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'dropdown').fill(data.masterIdColumn);
                await row.getField('Operator', 'dropdown').fill('In');
                await row.getField('Value', 'input').fill(app.memory.current.array.map((x) => x.respData.Record.MasterId).join());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(app.memory.current.array.length);
            });
            await app.step('Delete selected records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords([
                    app.memory.current.array[0].respData,
                    app.memory.current.array[1].respData ]);
            });
            await app.step('Select all records and Delete', async () => {
                await app.ui.queryBoard.queryResultsGrid.selectAllRecords();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.confirmationModal.isVisible()).ok()
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                    .eql('The record count for this query has changed. Do you want to proceed with the changed result set?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok();
            });
            await app.step('Click Continue on confirmation modal', async () => {
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(0)
                    .expect(await app.ui.getText('notificationMessage')).eql('Selected record(s) were deleted successfully.');
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });
    });

test
    // .only
    .meta('brief', data.brief)
    .meta('category', 'Display Configuration')
    .before(async () => {
        await app.step('Set content group to default (API)', async () => {
            if (!app.services.infra.underscore.isEqual(currentCGSettings, { path: null, permission: null, condition: null})) {
                await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
                currentCGSettings.path = null;
                currentCGSettings.permission = null;
                currentCGSettings.condition = null;
            }
        });
    })
    (`Query Results - Delete Records Without Permissions - Verify Display Configuration (${data.ipType} - Step 11)`, async (t: TestController) => {
        await app.step('Change display configuration for user (API)', async () => {
            app.ui.resetRole();
            await app.api.changeDisplayConfigurationForUser('TA Custom Display Configuration', globalConfig.user.userName);
        });
        await app.step(`Create a ${data.type} record (API)`, async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.type, 'simple');
        });
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Run query and select record', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading();
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
        });
        await app.step('Delete selected records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([
                app.memory.current.createRecordData.respData ]);
        });
        await app.step('Select created record and Delete', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Delete');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('title')).eql('Test - Attention')
                .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql(
                    'Test - The selected record(s) was not deleted due to:' +
                    '\nTest - Deleted by another user' +
                    '\nTest - Insufficient permission')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Test - OK')).ok();
        });
        await app.step(`Create 2 ${data.type} records (API)`, async () => {
            app.memory.current.array = [
                await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                await app.api.combinedFunctionality.createRecord(data.type, 'simple')
            ];
        });
        await app.step('Refresh and select record', async () => {
            await app.ui.refresh();
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[0].reqData.recordName).check();
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.array[1].reqData.recordName).check();
        });
        await app.step('Delete selected records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([
                app.memory.current.array[0].respData ]);
        });
        await app.step('Select created record and Delete', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Delete');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('title')).eql('Test - Attention')
                .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql(
                    'Test - One or more selected record(s) was deleted successfully.' +
                    '\nTest - The following record(s) was not deleted due to:' +
                    '\nTest - Deleted by another user' +
                    '\nTest - Insufficient permission' +
                    `\nTest - Master ID: ${app.memory.current.array[0].respData.Record.MasterId}.`)
                .expect(await app.ui.errorModal.isVisible('buttons', 'Test - OK')).ok();
        });
        await app.step(`Create 2 ${data.type} records (API)`, async () => {
            app.memory.current.array = [
                await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                await app.api.combinedFunctionality.createRecord(data.type, 'simple')
            ];
        });
        await app.step('Add filter in criteria builder', async () => {
            await app.ui.errorModal.confirm();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'dropdown').fill(data.masterIdColumn);
            await row.getField('Operator', 'dropdown').fill('Test - In');
            await row.getField('Value', 'input').fill(app.memory.current.array.map((x) => x.respData.Record.MasterId).join());
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(app.memory.current.array.length);
        });
        await app.step('Delete selected records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([
                app.memory.current.array[0].respData ]);
        });
        await app.step('Select all records and Delete', async () => {
            await app.ui.queryBoard.queryResultsGrid.selectAllRecords();
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Delete');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                .eql('Test - The record count for this query has changed. Do you want to proceed with the changed result set?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Test - Cancel')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Test - Continue')).ok();
        });
        await app.step(`Create 2 ${data.type} records (API)`, async () => {
            app.memory.current.array = [
                await app.api.combinedFunctionality.createRecord(data.type, 'simple'),
                await app.api.combinedFunctionality.createRecord(data.type, 'simple')
            ];

            await app.api.dataEntryForm.openRecord(app.memory.current.array[0].respData.Record.MasterId,
                app.memory.current.array[0].respData.ResourceId);
            await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueFitCondition);
            await app.api.dataEntryForm.save();

            await app.api.dataEntryForm.openRecord(app.memory.current.array[1].respData.Record.MasterId,
                app.memory.current.array[1].respData.ResourceId);
            await app.api.dataEntryForm.setValue(data.condition.fieldName, data.condition.valueDoesNotFitCondition);
            await app.api.dataEntryForm.save();
        });
        await app.step('Disable Delete permissions in content group (API)', async () => {
            await app.api.login();
            await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
            await app.api.administration.contentGroup.setApplicationSecurityWithCondition(data.ipType, { deleteCondition: data.condition.name });
            await app.api.administration.contentGroup.save();
        });
        await app.step('Add filter in criteria builder', async () => {
            await app.ui.refresh();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'dropdown').fill(data.masterIdColumn);
            await row.getField('Operator', 'dropdown').fill('Test - In');
            await row.getField('Value', 'input').fill(app.memory.current.array.map((x) => x.respData.Record.MasterId).join());
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();

            await t
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(app.memory.current.array.length);
        });
        await app.step('Select all records and Delete', async () => {
            await app.ui.queryBoard.queryResultsGrid.selectAllRecords();
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Delete');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('title')).eql('Test - Attention')
                .expect(await app.ui.errorModal.getText('errorMessageList', 0, { asDisplayed: true })).eql(
                    'Test - One or more selected record(s) were deleted successfully.' +
                    '\nTest - One or more selected record(s) were not deleted due to:' +
                    '\nTest - Deleted by another user' +
                    '\nTest - Insufficient permission')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Test - OK')).ok();
        });
    })
    .after(async () => {
        await app.step('Change display configuration to default (API)', async () => {
            try {
                await app.api.changeDisplayConfigurationForUser('Default Display Configuration 1', globalConfig.user.userName);
                app.ui.resetRole();
            } catch (err) {}
        });
        await app.step('Delete records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
        });
    });
