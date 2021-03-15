import app from '../../../../app';
declare const globalConfig: any;

let record;
let recordId = '';
const createdRecords = [];

const dataSet = [
    {
        recordType: 'Patent',
        query: 'Patent>TA Actions query for PA',
        actionIDcolumn: 'PATENTACTIONID',
        nameField: 'Docket Number',
        actionField: 'Action',
        filterField: {name: 'Drawings', type: 'input', operator: 'Less Than'},
        sortingField: 'Docket Number',
        dateField: {name: 'Actions_Create Date', type: 'datepicker'},
        maxRecords: 4,
        defWithActions: 'TA DEF for PA - childIDs',
        defNoActions: 'TA DEF for PA - no actions',
        process: {
            name: 'TA Action - PA',
            task: { name: 'RM Actions', resource: 'TA DEF for PA - childIDs'}
        },
        brief: 'true'
    },
    {
        recordType: 'Trademark',
        query: 'Trademark>TA Actions query for TM',
        actionIDcolumn: 'TRADEMARKACTIONID',
        nameField: 'Docket Number',
        actionField: 'Action',
        filterField: {name: 'Original Amount Paid', type: 'input', operator: 'Less Than'},
        sortingField: 'Docket Number',
        dateField: {name: 'Actions_Create Date', type: 'datepicker'},
        maxRecords: 4,
        defWithActions: 'TA DEF for TM - childIDs',
        defNoActions: 'TA DEF for TM - no actions',
        process: {
            name: 'TA Action - TM',
            task: { name: 'RM Actions', resource: 'TA DEF for TM - childIDs'}
        },
        brief: 'false'
    },
    {
        recordType: 'Disclosure',
        query: 'Disclosure>TA Actions query for DS',
        actionIDcolumn: 'DISCLOSUREACTIONID',
        nameField: 'Disclosure Number',
        actionField: 'Action',
        filterField: {name: 'PRL_ID', type: 'input', operator: 'Less Than'},
        sortingField: 'Disclosure Number',
        dateField: {name: 'Actions_Create Date', type: 'datepicker'},
        maxRecords: 4,
        defWithActions: 'TA DEF for DS - childIDs',
        defNoActions: 'TA DEF for DS - no actions',
        process: {
            name: 'TA Action - DS',
            task: { name: 'RM Actions', resource: 'TA DEF for DS - childIDs'}
        },
        brief: 'false'
    },
    {
        recordType: 'GeneralIP1',
        query: 'GeneralIP1>TA Actions query for GIP1',
        actionIDcolumn: 'GENERALIP1ACTIONID',
        nameField: 'Agreement Number',
        actionField: 'Action',
        filterField: {name: 'GIP1RM_ID', type: 'input', operator: 'Less Than'},
        sortingField: 'Agreement Number',
        dateField: {name: 'Actions_Create Date', type: 'datepicker'},
        maxRecords: 4,
        defWithActions: 'TA DEF for GIP1 - childIDs',
        defNoActions: 'TA DEF for GIP1 - no actions',
        process: {
            name: 'TA Action - GIP1',
            task: { name: 'RM Actions', resource: 'TA DEF for GIP1 - childIDs'}
        },
        brief: 'false'
    }
];

fixture `REGRESSION.queryList&Results.pack. - Test ID 31526: Query - Query Results - Child Record Selection and Navigation to DEF (Actions Queries)`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        for (let data of dataSet) {
            await app.step(`Create a ${data.recordType} record with multiple Actions on child tab`, async () => {
                    record = await app.api.combinedFunctionality.createRecord(data.recordType, 'simple');
                    createdRecords.push(record);
                    app.memory.current.createRecordData = record;
                    recordId = record.respData.Record.MasterId.toString();
                    await app.api.dataEntryForm.openRecord(Number(recordId), data.defWithActions);
                    await app.api.dataEntryForm.openChild('Actions');
                    let allActions = await app.api.dataEntryForm.getChildAllPossibleValues('Action');
                    for (let i = 1; i <= 2; i++) {
                        await app.api.dataEntryForm.setValue(data.filterField.name, i);
                        await app.api.dataEntryForm.save();
                        let childs = [{
                            childName: 'Actions',
                            rows: [ { properties:
                                [{name: data.actionField, value: allActions[i] }]
                            }]
                        }];
                        await app.api.addChildRecords(Number(recordId), data.defWithActions, childs);
                    }
            });
            await app.step(`Create ${data.maxRecords - 2} ${data.recordType} records with a single Action on child tab`, async () => {
                    for (let i = 3; i <= data.maxRecords; i++) {
                        record = await app.api.combinedFunctionality.createRecord(data.recordType, 'simple');
                        createdRecords.push(record);
                        app.memory.current.createRecordData = record;
                        recordId = record.respData.Record.MasterId.toString();
                        await app.api.dataEntryForm.openRecord(Number(recordId), data.defWithActions);
                        await app.api.dataEntryForm.setValue(data.filterField.name, i);
                        await app.api.dataEntryForm.save();
                        await app.api.dataEntryForm.openChild('Actions');
                        const allActions = (await app.api.dataEntryForm.getChildAllPossibleValues('Action'));
                        let childs = [{
                            childName: 'Actions',
                            rows: [ { properties:
                                [{name: data.actionField, value: allActions[i] }]
                            }]
                        }];
                        await app.api.addChildRecords(Number(recordId), data.defWithActions, childs);
                    }
            });
        }
    })
    .after(async () => {
        await app.step('Delete the created data entry records', async () => {
            try {
                const recordsToDelete = createdRecords.map((x) => {
                    return  x.respData ;
                });
                await app.api.login();
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete);
            } catch (err) {}
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify Next and Previous order of ${data.recordType} records opened from query '${data.query}' (Steps 2, 4, 20)`, async (t: TestController) => {
            let queryActionIDs = [];
            let clickedActionId = '';
            let rowToOpen = 0;
            const child = app.ui.dataEntryBoard.childRecord;

            await app.step('Login and run Actions query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                queryActionIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.actionIDcolumn);
            });
            await app.step(`Select the 'View in:' template with Actions child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithActions);
            });
            await app.step(`Open a record and verify the clicked Action record is highlighted on DEF child`, async () => {
                clickedActionId = queryActionIDs[rowToOpen];
                await app.ui.queryBoard.queryResultsGrid.openRecord(rowToOpen);
                await app.ui.waitLoading({checkErrors: true});

                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Click 'Next' and verify the next remembered ActionID values are highlighted`, async () => {
                for (let i = 1; i <= 2; i++) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Next');
                    await app.ui.waitLoading({checkErrors: false});
                    const expectedActionID = queryActionIDs[rowToOpen + i];
                    const expectedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, expectedActionID);
                    const record = await child.grid.getRecord(expectedActionRowIndex);

                    await t
                        .expect(await record.isRowHighlighted()).ok();
                }
            });
            await app.step(`Click 'Previous' and verify the previous remembered ActionID values are highlighted`, async () => {
                for (let i = 1; i >= 0; i--) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Previous');
                    await app.ui.waitLoading({checkErrors: false});
                    const expectedActionID = queryActionIDs[rowToOpen + i];
                    const expectedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, expectedActionID);
                    const record = await child.grid.getRecord(expectedActionRowIndex);

                    await t
                        .expect(await record.isRowHighlighted()).ok();
                }
            });
        });
});

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify Next and Previous order of sorted/filtered ${data.recordType} records opened from an Actions query (Steps 5-6, 8, 20)`, async (t: TestController) => {
            let queryActionIDs = [];
            let clickedActionId = '';
            let rowToOpen = 2;

            await app.step('Login and run Actions query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Set Criteria Builder filter for 'Create date' = today`, async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(data.dateField.name);
                const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', data.dateField.type);
                await field.click('calendarButton');
                await field.selectToday();
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.noErrors()).ok();
            });
            await app.step(`Apply sorting and filtering to the query`, async () => {
                await app.ui.queryBoard.queryResultsGrid.clickHeader(data.sortingField);

                await app.ui.queryBoard.queryResultsGrid.openFilter(data.filterField.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod(data.filterField.operator);
                await filter.addCriteria(data.maxRecords.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const filteredValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.filterField.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCount()).gt(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getColumnSortingStatus(data.sortingField)).eql({isPresent: true, direction: 'ascending'})
                    .expect(filteredValues.every((x) => x < data.maxRecords)).ok();
            });
            await app.step(`Select the 'View in:' template with Actions child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithActions);
            });
            await app.step(`Open a record and verify the clicked Action record is highlighted on DEF child`, async () => {
                queryActionIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.actionIDcolumn);

                clickedActionId = queryActionIDs[rowToOpen];
                await app.ui.queryBoard.queryResultsGrid.openRecord(rowToOpen);
                await app.ui.waitLoading({checkErrors: true});

                const child = app.ui.dataEntryBoard.childRecord;
                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Click 'Previous' and verify the previous remembered ActionID values are highlighted`, async () => {
                for (let i = 1; i <= 2; i++) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Previous');
                    await app.ui.waitLoading({checkErrors: false});
                    const child = app.ui.dataEntryBoard.childRecord;
                    const expectedActionID = queryActionIDs[rowToOpen - i];
                    const expectedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, expectedActionID);
                    const record = await child.grid.getRecord(expectedActionRowIndex);

                    await t
                        .expect(await record.isRowHighlighted()).ok();
                }
            });
            await app.step(`Click 'Next' and verify the next remembered ActionID values are highlighted`, async () => {
                for (let i = 1; i >= 0; i--) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Next');
                    await app.ui.waitLoading({checkErrors: false});
                    const expectedActionID = queryActionIDs[rowToOpen - i];
                    const child = app.ui.dataEntryBoard.childRecord;
                    const expectedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, expectedActionID);
                    const record = await child.grid.getRecord(expectedActionRowIndex);

                    await t
                        .expect(await record.isRowHighlighted()).ok();
                }
            });
            await app.step(`Go to Query and verify the 'View in' template remains`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                const defTemplate = await app.ui.queryBoard.getText('viewInDropdown');

                await t
                    .expect(defTemplate).eql(data.defWithActions);
            });
            await app.step(`Remove sorting and filtering and open a record`, async () => {
                await app.ui.queryBoard.queryResultsGrid.clickHeader(data.sortingField);
                await app.ui.queryBoard.queryResultsGrid.clickHeader(data.sortingField);
                await app.ui.queryBoard.queryResultsGrid.removeFilter(data.filterField.name);
                await app.ui.waitLoading();
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                await app.ui.queryBoard.criteriaBuilder.reset();
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();

                queryActionIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.actionIDcolumn);
                let random = app.services.random.num(0, data.maxRecords - 1); // # of records created in Precondition
                clickedActionId = queryActionIDs[random];
                await app.ui.queryBoard.queryResultsGrid.openRecord(random);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
        });
});

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify a clicked Action is highlighed after save or navigaton in ${data.recordType} records opened from an Actions query (Steps 7, 9, 17, 20)`, async (t: TestController) => {
            let queryActionIDs = [];
            let clickedActionId = '';
            let random = app.services.random.num(0, data.maxRecords - 1);

            await app.step('Login and run Actions query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                queryActionIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.actionIDcolumn);
                clickedActionId = queryActionIDs[random];
            });
            await app.step(`Select the 'View in:' template with Actions child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithActions);
            });
            await app.step(`Open a record and verify the clicked Action record is highlighted on DEF child`, async () => {
                clickedActionId = queryActionIDs[random];
                await app.ui.queryBoard.queryResultsGrid.openRecord(random);
                await app.ui.waitLoading({checkErrors: true});

                const child = app.ui.dataEntryBoard.childRecord;
                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Update and save the case record - the Action row remains highlighted`, async () => {
                await app.ui.dataEntryBoard.getField(data.nameField).fill(`${data.recordType}-upd-1`);

                const expectedActionID = queryActionIDs[random];
                const child = app.ui.dataEntryBoard.childRecord;
                const expectedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, expectedActionID);
                const record = await child.grid.getRecord(expectedActionRowIndex);
                await record.getField('Notes', 'multiline').fill('update 2');
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Open another child tab and get back to 'Actions'`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: false});
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: false});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Navigate to another page`, async () => {
                await app.ui.naviBar.click('links', 'Reports');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.getCurrentUrl()).contains('UI/reports')
                    .expect(await app.ui.reportBoard.kendoTreeview.isVisible()).ok();
            });
            await app.step(`Get back to DEF and verify the Action row is highlighted`, async () => {
                await app.ui.goBack();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step('Open in Browser a record and verify the Action row is highlighted', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(random).check();
                await t
                    .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
                await app.ui.queryBoard.click('openInBrowserButton');
                await app.ui.waitLoading({checkErrors: true});

                const child = app.ui.dataEntryBoard.childRecord;
                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Update and save the case record - the Action row remains highlighted`, async () => {
                await app.ui.dataEntryBoard.getField(data.nameField).fill(`${data.recordType}-upd-2`);

                const expectedActionID = queryActionIDs[random];
                const child = app.ui.dataEntryBoard.childRecord;
                const expectedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, expectedActionID);
                const record = await child.grid.getRecord(expectedActionRowIndex);
                await record.getField('Notes', 'multiline').fill('updated field');
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Open another child tab and get back to 'Actions'`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: false});
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: false});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Navigate to another page`, async () => {
                await app.ui.naviBar.click('links', 'Reports');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.getCurrentUrl()).contains('UI/reports')
                    .expect(await app.ui.reportBoard.kendoTreeview.isVisible()).ok();
            });
            await app.step(`Get back to DEF and verify the Action row is highlighted`, async () => {
                await app.ui.goBack();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
        });
});

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify ${data.recordType} Actions query without '${data.actionIDcolumn}' column and DEF without 'Actions' tab (Steps 10-12, 17, 20)`, async (t: TestController) => {
            await app.step(`Remove the ${data.actionIDcolumn} column from Field Selection in Query Management (API)`, async () => {
                await app.api.query.openQueryManagement(data.query);
                app.api.query.removeResultField(data.actionIDcolumn);
                await app.api.query.save();
            });
            await app.step('Login and run Actions query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Verify the Actions query does not contain the '${data.actionIDcolumn}' column`, async () => {
                const columns = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(columns.includes(data.actionIDcolumn)).notOk();
            });
            await app.step(`Select the 'View in:' template with Actions child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithActions);
            });
            await app.step(`Open a record and verify the Actions tab is not expanded`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).notOk();
            });
            await app.step('Open in Browser a record and verify the Actions tab is not expanded', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await t
                    .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
                await app.ui.queryBoard.click('openInBrowserButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).notOk();
            });
            await app.step(`Add the ${data.actionIDcolumn} column to the Field Selection in Query Management (API)`, async () => {
                await app.api.query.openQueryManagement(data.query);
                app.api.query.addResultField(data.actionIDcolumn);
                app.api.query.enableDataModification();
                await app.api.query.save();
                await app.api.clearCache();
            });
            await app.step(`Re-run the query and verify the ${data.actionIDcolumn} column is present`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                const columns = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(columns.includes(data.actionIDcolumn)).ok();
            });
            await app.step(`Open a record in a DEF without Actions child tab`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defNoActions);
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('childRecords', 'Actions')).notOk();
            });
            await app.step('Open in Browser a record and verify the Actions tab is not expanded', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await t
                    .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
                await app.ui.queryBoard.click('openInBrowserButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('childRecords', 'Actions')).notOk();
            });
        });
});

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify permissions to Actions child tab for '${data.recordType}' iptype (Steps 13-14, 17, 20)`, async (t: TestController) => {
            await app.step(`Remove permissions to the 'Actions' tab for user's content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setApplicationSecurity(`${data.recordType}Masters>ACTIONS`, { editPermission: false, visiblePermission: false } );
                await cg.save();
            });
            await app.step('Login and run Actions query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Verify the Actions query does not contain the '${data.actionIDcolumn}' column`, async () => {
                const columns = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(columns.includes(data.actionIDcolumn)).notOk();
            });
            await app.step(`Select the 'View in:' template with Actions child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithActions);
            });
            await app.step(`Open a record and verify the Actions tab is not displayed`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('childRecords', 'Actions')).notOk();
            });
            await app.step('Open in Browser a record and verify the Actions tab is not displayed', async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await t
                    .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
                await app.ui.queryBoard.click('openInBrowserButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('childRecords', 'Actions')).notOk();
            });
        })
        .after(async () => {
            await app.step('Restore Content Groups settings (API)', async () => {
                const cg = app.api.administration.contentGroup;
                await cg.setApplicationSecurity(`${data.recordType}Masters>ACTIONS`, { editPermission: true, visiblePermission: true } );
                await cg.save();
        });
    });
});

// Steps 15-16 are covered in steps 7-9

// Step 18, part of step 19 are skipped as currently multiple windows are disabled in the runner for compatibility with previous tests. Refactoring is required.

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify a clicked Action is highilighed in ${data.recordType} records when opened from a Collaboration Portal task (steps 17, 19)`, async (t: TestController) => {
            let queryActionIDs = [];
            let clickedActionId = '';
            let rowToOpen = 0;
            const child = app.ui.dataEntryBoard.childRecord;
            await app.step('Log in Docketing Portal and go to Collaboration portal (Step 4)', async () => {
                await app.ui.getRole(undefined, '/UI/collaboration');
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open task', async () => {
                await app.ui.collaborationBoard.getProcess(data.process.name).getTask(data.process.task.name).open();
                await app.ui.waitLoading({checkErrors: true});
                queryActionIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.actionIDcolumn);
            });
            await app.step('Open a record and verify the clicked Action record is highlighted on DEF child', async () => {
                clickedActionId = queryActionIDs[rowToOpen];
                await app.ui.queryBoard.queryResultsGrid.openRecord(rowToOpen);
                await app.ui.waitLoading({checkErrors: true});

                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Click 'Next' and verify the next remembered ActionID values are highlighted`, async () => {
                for (let i = 1; i <= 2; i++) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Next');
                    await app.ui.waitLoading({checkErrors: false});
                    const expectedActionID = queryActionIDs[rowToOpen + i];
                    const expectedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, expectedActionID);
                    const record = await child.grid.getRecord(expectedActionRowIndex);

                    await t
                        .expect(await record.isRowHighlighted()).ok();
                }
            });
            await app.step(`Click 'Previous' and verify the previous remembered ActionID values are highlighted`, async () => {
                for (let i = 1; i >= 0; i--) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Previous');
                    await app.ui.waitLoading({checkErrors: false});
                    const expectedActionID = queryActionIDs[rowToOpen + i];
                    const expectedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, expectedActionID);
                    const record = await child.grid.getRecord(expectedActionRowIndex);

                    await t
                        .expect(await record.isRowHighlighted()).ok();
                }
            });
            await app.step(`Re-open the process task query results`, async () => {
                await app.ui.naviBar.click('links', 'Collaboration Portal');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.collaborationBoard.getProcess(data.process.name).getTask(data.process.task.name).open();
                await app.ui.waitLoading({checkErrors: true});
                queryActionIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.actionIDcolumn);
            });
            await app.step('Open in Browser a record and verify the Action row is highlighted', async () => {
                let random = app.services.random.num(0, data.maxRecords - 1);
                clickedActionId = queryActionIDs[random];
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(random).check();
                await t
                    .expect(await app.ui.queryBoard.isEnabled('menuItems', 'Open')).ok();
                await app.ui.queryBoard.click('menuItems', 'Open');
                await app.ui.waitLoading({checkErrors: true});

                const child = app.ui.dataEntryBoard.childRecord;
                const clickedActionRowIndex = await child.grid.getRowIndexByColumnValue(data.actionIDcolumn, clickedActionId);
                const record = await child.grid.getRecord(clickedActionRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Actions')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
        });
});
