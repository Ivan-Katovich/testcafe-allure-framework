import app from '../../../../app';
declare const globalConfig: any;

let record;
let recordId = '';
const createdRecords = [];

const dataSet = [
    {
        recordType: 'Patent',
        query: 'Patent>Patent Expenses',
        expenseIDcolumn: 'PATENTEXPENSEID',
        nameField: 'Docket Number',
        expenseField: 'Expense',
        filterField: {name: 'Tax Year', type: 'input', operator: 'Less Than'},
        sortingField: 'Amount',
        dateField: {name: 'Expenses_Create Date', type: 'datepicker'},
        maxRecords: 4,
        defWithExpenses: 'TA DEF for PA - childIDs',
        defNoExpenses: 'TA DEF for PA - no expenses',
        brief: 'true'
    },
    {
        recordType: 'Trademark',
        query: 'Trademark>Trademark Expenses',
        expenseIDcolumn: 'TRADEMARKEXPENSEID',
        nameField: 'Docket Number',
        expenseField: 'Expense',
        filterField: {name: 'Tax Year', type: 'input', operator: 'Less Than'},
        sortingField: 'Amount',
        dateField: {name: 'Expenses_Create Date', type: 'datepicker'},
        maxRecords: 4,
        defWithExpenses: 'TA DEF for TM - childIDs',
        defNoExpenses: 'TA DEF for TM - no expenses',
        brief: 'false'
    },
    {
        recordType: 'Disclosure',
        query: 'Disclosure>TA Disclosure Expenses',
        expenseIDcolumn: 'DISCLOSUREEXPENSEID',
        nameField: 'Disclosure Number',
        expenseField: 'Expense',
        filterField: {name: 'Tax Year', type: 'input', operator: 'Less Than'},
        sortingField: 'Amount',
        dateField: {name: 'Expenses_Create Date', type: 'datepicker'},
        maxRecords: 4,
        defWithExpenses: 'TA DEF for DS - childIDs',
        defNoExpenses: 'TA DEF for DS - no expenses',
        brief: 'false'
    },
    {
        recordType: 'GeneralIP1',
        query: 'GeneralIP1>TA GIP1 Expenses',
        expenseIDcolumn: 'GENERALIP1EXPENSEID',
        nameField: 'Agreement Number',
        expenseField: 'Expense',
        filterField: {name: 'Tax Year', type: 'input', operator: 'Less Than'},
        sortingField: 'Amount',
        dateField: {name: 'Expenses_Create Date', type: 'datepicker'},
        maxRecords: 4,
        defWithExpenses: 'TA DEF for GIP1 - childIDs',
        defNoExpenses: 'TA DEF for GIP1 - no expenses',
        brief: 'false'
    }
];

fixture `REGRESSION.queryList&Results.pack. - Test ID 31527: Query - Query Results - Child Record Selection and Navigation to DEF (Expenses Queries)`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        for (let data of dataSet) {
            await app.step(`Create a ${data.recordType} record with multiple Expenses on child tab`, async () => {
                try {
                    record = await app.api.combinedFunctionality.createRecord(data.recordType, 'simple');
                    createdRecords.push(record);
                    app.memory.current.createRecordData = record;
                    recordId = record.respData.Record.MasterId.toString();
                    await app.api.dataEntryForm.openRecord(Number(recordId), data.defWithExpenses);
                    await app.api.dataEntryForm.openChild('Expenses');
                    let allExpenses = await app.api.dataEntryForm.getChildAllPossibleValues('Expense');
                    for (let i = 1; i <= 2; i++) {
                        let childs = [{
                            childName: 'Expenses',
                            rows: [ { properties:
                                [
                                {name: data.expenseField, value: allExpenses[i] },
                                {name: data.filterField.name, value: i },
                                {name: data.sortingField, value: (app.services.random.num()).toString() }
                                ]
                            }]
                        }];
                        await app.api.addChildRecords(Number(recordId), data.defWithExpenses, childs);
                    }
                } catch (err) {}
            });
            await app.step(`Create ${data.maxRecords - 2} ${data.recordType} records with a single Expense on child tab`, async () => {
                try {
                    for (let i = 3; i <= data.maxRecords; i++) {
                        record = await app.api.combinedFunctionality.createRecord(data.recordType, 'simple');
                        createdRecords.push(record);
                        app.memory.current.createRecordData = record;
                        recordId = record.respData.Record.MasterId.toString();
                        await app.api.dataEntryForm.openRecord(Number(recordId), data.defWithExpenses);
                        await app.api.dataEntryForm.openChild('Expenses');
                        const allExpenses = (await app.api.dataEntryForm.getChildAllPossibleValues('Expense'));
                        let childs = [{
                            childName: 'Expenses',
                            rows: [ { properties:
                                [
                                {name: data.expenseField, value: (allExpenses[i] || allExpenses[0]) },
                                {name: data.filterField.name, value: i },
                                {name: data.sortingField, value: (app.services.random.num()).toString() }
                                ]
                            }]
                        }];
                        await app.api.addChildRecords(Number(recordId), data.defWithExpenses, childs);
                    }
                } catch (err) {}
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
        (`Verify a user can navigate through ${data.recordType} Expense records from DEF via Next and Previous buttons in the order they are displayed in the query' (Steps 2, 4, 19)`, async (t: TestController) => {
            let queryExpenseIDs = [];
            let clickedExpenseId = '';
            let rowToOpen = 0;
            const child = app.ui.dataEntryBoard.childRecord;

            await app.step('Login and run Expenses query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                queryExpenseIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.expenseIDcolumn);
            });
            await app.step(`Select the 'View in:' template with Expenses child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithExpenses);
            });
            await app.step(`Open a record and verify the 'Expenses' child tab is opened, and the clicked Expense record is highlighted`, async () => {
                clickedExpenseId = queryExpenseIDs[rowToOpen];
                await app.ui.queryBoard.queryResultsGrid.openRecord(rowToOpen);
                await app.ui.waitLoading({checkErrors: true});

                const clickedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, clickedExpenseId);
                const record = await child.grid.getRecord(clickedExpenseRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Click 'Next' and verify the next Expense records are highlighted`, async () => {
                for (let i = 1; i <= 2; i++) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Next');
                    await app.ui.waitLoading({checkErrors: false});
                    const expectedExpenseID = queryExpenseIDs[rowToOpen + i];
                    const expectedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, expectedExpenseID);
                    const record = await child.grid.getRecord(expectedExpenseRowIndex);

                    await t
                        .expect(await record.isRowHighlighted()).ok();
                }
            });
            await app.step(`Click 'Previous' and verify the previous Expense records are highlighted`, async () => {
                for (let i = 1; i >= 0; i--) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Previous');
                    await app.ui.waitLoading({checkErrors: false});
                    const expectedExpenseID = queryExpenseIDs[rowToOpen + i];
                    const expectedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, expectedExpenseID);
                    const record = await child.grid.getRecord(expectedExpenseRowIndex);

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
        (`Verify user is navigated through ${data.recordType} Expense records via Next/Previous from DEF in the order records are displayed in sorted and filtered query(Steps 5-6, 8, 19)`, async (t: TestController) => {
            let queryExpenseIDs = [];
            let clickedExpenseId = '';
            let rowToOpen = 2;

            await app.step('Login and run Expenses query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Set Criteria Builder filter for '${data.dateField.name}' = today`, async () => {
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
                const filter = await app.ui.kendoPopup.getFilter(data.filterField.type);
                await filter.selectMethod(data.filterField.operator);
                await filter.addCriteria(data.maxRecords.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const filteredValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.filterField.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getColumnSortingStatus(data.sortingField)).eql({isPresent: true, direction: 'ascending'})
                    .expect(filteredValues.every((x) => x < data.maxRecords)).ok();
            });
            await app.step(`Select the 'View in:' template with Expenses child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithExpenses);
            });
            await app.step(`Open a record and verify the clicked Expense record is highlighted on DEF child`, async () => {
                queryExpenseIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.expenseIDcolumn);

                clickedExpenseId = queryExpenseIDs[rowToOpen];
                await app.ui.queryBoard.queryResultsGrid.openRecord(rowToOpen);
                await app.ui.waitLoading({checkErrors: true});

                const child = app.ui.dataEntryBoard.childRecord;
                const clickedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, clickedExpenseId);
                const record = await child.grid.getRecord(clickedExpenseRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Click 'Previous, verify previous Expense record is highlighted in the order records are displayed in query`, async () => {
                for (let i = 1; i <= 2; i++) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Previous');
                    await app.ui.waitLoading({checkErrors: false});
                    const child = app.ui.dataEntryBoard.childRecord;
                    const expectedExpenseID = queryExpenseIDs[rowToOpen - i];
                    const expectedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, expectedExpenseID);
                    const record = await child.grid.getRecord(expectedExpenseRowIndex);

                    await t
                        .expect(await record.isRowHighlighted()).ok();
                }
            });
            await app.step(`Click 'Next', verify the next Expense records are highlighted in the order records are displayed in query`, async () => {
                for (let i = 1; i >= 0; i--) {
                    await app.ui.dataEntryBoard.click('menuButtons', 'Next');
                    await app.ui.waitLoading({checkErrors: false});
                    const expectedExpenseID = queryExpenseIDs[rowToOpen - i];
                    const child = app.ui.dataEntryBoard.childRecord;
                    const expectedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, expectedExpenseID);
                    const record = await child.grid.getRecord(expectedExpenseRowIndex);

                    await t
                        .expect(await record.isRowHighlighted()).ok();
                }
            });
            await app.step(`Go to Query`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Remove sorting and filtering via query reset and open a record`, async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                await app.ui.queryBoard.criteriaBuilder.reset();
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();

                queryExpenseIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.expenseIDcolumn);
                let random = app.services.random.num(0, data.maxRecords - 1); // # of records created in Precondition
                clickedExpenseId = queryExpenseIDs[random];
                await app.ui.queryBoard.queryResultsGrid.openRecord(random);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, clickedExpenseId);
                const record = await child.grid.getRecord(clickedExpenseRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
        });
});

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify an Expense record of ${data.recordType} iptype remains highlighed when saving DEF or navigating away&back from the child or DEF (Steps 7, 9, 17, 19)`, async (t: TestController) => {
            let queryExpenseIDs = [];
            let clickedExpenseId = '';
            let random = app.services.random.num(0, data.maxRecords - 1);

            await app.step('Login and run Expenses query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                queryExpenseIDs = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.expenseIDcolumn);
                clickedExpenseId = queryExpenseIDs[random];
            });
            await app.step(`Select the 'View in:' template with Expenses child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithExpenses);
            });
            await app.step(`Open a record and verify the clicked Expense record is highlighted on DEF child`, async () => {
                clickedExpenseId = queryExpenseIDs[random];
                await app.ui.queryBoard.queryResultsGrid.openRecord(random);
                await app.ui.waitLoading({checkErrors: true});

                const child = app.ui.dataEntryBoard.childRecord;
                const clickedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, clickedExpenseId);
                const record = await child.grid.getRecord(clickedExpenseRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Update and save the case record - the Expense row remains highlighted`, async () => {
                await app.ui.dataEntryBoard.getField(data.nameField).fill(`${data.recordType}-upd-${app.services.random.str()}`);

                const expectedExpenseID = queryExpenseIDs[random];
                const child = app.ui.dataEntryBoard.childRecord;
                const expectedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, expectedExpenseID);
                const record = await child.grid.getRecord(expectedExpenseRowIndex);
                await record.getField('Percentage', 'numeric').fill('70');
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Open another child tab, get back to 'Expenses' and verify the Expense row remains highlighted`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: false});
                await app.ui.dataEntryBoard.selectChildRecord('Expenses');
                await app.ui.waitLoading({checkErrors: false});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, clickedExpenseId);
                const record = await child.grid.getRecord(clickedExpenseRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Navigate to another page`, async () => {
                await app.ui.naviBar.click('links', 'Reports');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.getCurrentUrl()).contains('UI/reports')
                    .expect(await app.ui.reportBoard.kendoTreeview.isVisible()).ok();
            });
            await app.step(`Get back to DEF and verify the Expense row is highlighted`, async () => {
                await app.ui.goBack();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, clickedExpenseId);
                const record = await child.grid.getRecord(clickedExpenseRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Open a record via 'Open in Browser' and verify the Expense row is highlighted`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(random).check();
                await t
                    .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
                await app.ui.queryBoard.click('openInBrowserButton');
                await app.ui.waitLoading({checkErrors: true});

                const child = app.ui.dataEntryBoard.childRecord;
                const clickedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, clickedExpenseId);
                const record = await child.grid.getRecord(clickedExpenseRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Update and save the case record - the Expense row remains highlighted`, async () => {
                await app.ui.dataEntryBoard.getField(data.nameField).fill(`${data.recordType}-upd-${app.services.random.str()}`);

                const expectedExpenseID = queryExpenseIDs[random];
                const child = app.ui.dataEntryBoard.childRecord;
                const expectedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, expectedExpenseID);
                const record = await child.grid.getRecord(expectedExpenseRowIndex);
                await record.getField('Percentage', 'numeric').fill('10');
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Open another child tab, get back to 'Expenses', and verify the Expense row remains highlighted`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: false});
                await app.ui.dataEntryBoard.selectChildRecord('Expenses');
                await app.ui.waitLoading({checkErrors: false});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, clickedExpenseId);
                const record = await child.grid.getRecord(clickedExpenseRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
            await app.step(`Navigate to another page`, async () => {
                await app.ui.naviBar.click('links', 'Reports');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.getCurrentUrl()).contains('UI/reports')
                    .expect(await app.ui.reportBoard.kendoTreeview.isVisible()).ok();
            });
            await app.step(`Get back to DEF and verify the Expense row is highlighted`, async () => {
                await app.ui.goBack();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const clickedExpenseRowIndex = await child.grid.getRowIndexByColumnValue(data.expenseIDcolumn, clickedExpenseId);
                const record = await child.grid.getRecord(clickedExpenseRowIndex);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).ok()
                    .expect(await record.isRowHighlighted()).ok();
            });
        });
});

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify ${data.recordType} Expenses query without '${data.expenseIDcolumn}' column and DEF without 'Expenses' tab (Steps 10-12, 17, 19)`, async (t: TestController) => {
            await app.step(`Remove the ${data.expenseIDcolumn} column from 'Select Fields' section in Query Management (API)`, async () => {
                await app.api.query.openQueryManagement(data.query);
                app.api.query.removeResultField(data.expenseIDcolumn);
                await app.api.query.save();
            });
            await app.step('Login and run Expenses query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Verify the Expenses query does not contain the '${data.expenseIDcolumn}' column`, async () => {
                const columns = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(columns.includes(data.expenseIDcolumn)).notOk();
            });
            await app.step(`Select the 'View in:' template with Expenses child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithExpenses);
            });
            await app.step(`Open a record and verify the Expenses tab is not expanded`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).notOk();
            });
            await app.step(`Open a record via 'Open in Browser' and verify the Expense tab is not expanded`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await t
                    .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
                await app.ui.queryBoard.click('openInBrowserButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected('Expenses')).notOk();
            });
            await app.step(`Add the ${data.expenseIDcolumn} column to the 'Select Fields' section in Query Management (API)`, async () => {
                await app.api.query.openQueryManagement(data.query);
                app.api.query.addResultField(data.expenseIDcolumn);
                await app.api.query.save();
                await app.api.clearCache();
            });
            await app.step(`Re-run the query and verify the ${data.expenseIDcolumn} column is present`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                const columns = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(columns.includes(data.expenseIDcolumn)).ok();
            });
            await app.step(`Open a record in a DEF without Expenses child tab`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defNoExpenses);
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('childRecords', 'Expenses')).notOk();
            });
            await app.step(`Open a record via 'Open in Browser' and verify the Expense tab is not expanded`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await t
                    .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
                await app.ui.queryBoard.click('openInBrowserButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('childRecords', 'Expenses')).notOk();
            });
        });
});

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify Expenses child is not expanded by default when user has no permissions to '${data.recordType}' Expenses child tab (Steps 13-14, 17, 19)`, async (t: TestController) => {
            await app.step(`Remove permissions to the 'Expenses' tab for user's content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setApplicationSecurity(`${data.recordType}Masters>EXPENSES`, { editPermission: false, visiblePermission: false } );
                await cg.save();
            });
            await app.step('Login and run Expenses query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Verify the Expenses query does not contain the '${data.expenseIDcolumn}' column`, async () => {
                const columns = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(columns.includes(data.expenseIDcolumn)).notOk();
            });
            await app.step(`Select the 'View in:' template with Expenses child tab added`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defWithExpenses);
            });
            await app.step(`Open a record and verify the Expenses tab is not displayed`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('childRecords', 'Expenses')).notOk();
            });
            await app.step(`Open a record via 'Open in Browser' and verify the Expense tab is not displayed`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await t
                    .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
                await app.ui.queryBoard.click('openInBrowserButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isPresent('childRecords', 'Expenses')).notOk();
            });
        })
        .after(async () => {
            await app.step('Restore Content Groups settings (API)', async () => {
                const cg = app.api.administration.contentGroup;
                await cg.setApplicationSecurity(`${data.recordType}Masters>EXPENSES`, { editPermission: true, visiblePermission: true } );
                await cg.save();
        });
    });
});

// Steps 15-16 are covered in steps 7-9
// Step 18 is skipped as currently multiple windows are disabled in the runner for compatibility with previous tests. Refactoring is required.
