import app from '../../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.dataEntryForm.child.pack. - Test ID 30006: DEF_Childs - Grids Sorting & Filtering`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Verify sorting (Steps 2-3)`, async (t) => {
        let childGrid = null;
        let defaultTable = [];
        let sortableTable = [];
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            app.ui.setCookie();
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleSF');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open "Expenses" child record', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify grid\'s data may be sorted by each column', async () => {
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            const columnNames = await childGrid.getColumnsNamesArray();
            defaultTable = columnNames.map((name) => {
                return {columnData: name};
            });
            for (let column of defaultTable) {
                column.columnValues = await childGrid.getColumnValues(column.columnData.text);
            }
            sortableTable = defaultTable.filter((column) => {
                return column.columnData.text !== 'checkbox' && column.columnData.text !== 'Linked File'/* && !column.columnData.text.includes('Amount')*/;
            });
            for (let column of sortableTable) {
                await t
                    .expect(await childGrid.getColumnSortingStatus(column.columnData.text))
                    .eql({isPresent: false, direction: null});
                await childGrid.clickHeader(column.columnData.text);
                await t
                    .expect(await childGrid.getColumnSortingStatus(column.columnData.text))
                    .eql({isPresent: true, direction: 'ascending'})
                    .expect(await childGrid.getColumnValues(column.columnData.text))
                    .eql(column.columnValues.sort(app.services.sorting.appSort));
                await childGrid.clickHeader(column.columnData.text);
                await t
                    .expect(await childGrid.getColumnSortingStatus(column.columnData.text))
                    .eql({isPresent: true, direction: 'descending'})
                    .expect(await childGrid.getColumnValues(column.columnData.text))
                    .eql(column.columnValues.sort(app.services.sorting.appSort).reverse());
                await childGrid.clickHeader(column.columnData.text);
                await t
                    .expect(await childGrid.getColumnSortingStatus(column.columnData.text))
                    .eql({isPresent: false, direction: null});
            }
        });
        await app.step('Verify Linked File column can not be sorted', async () => {
            await childGrid.clickHeader('Linked File');
            await t
                .expect(await childGrid.getColumnSortingStatus('Linked File'))
                .eql({isPresent: false, direction: null});
        });
        await app.step('Verify sorting reverted when close the child tab', async () => {
            await childGrid.clickHeader(sortableTable[0].columnData.index);
            await t
                .expect(await childGrid.getColumnSortingStatus(sortableTable[0].columnData.text))
                .eql({isPresent: true, direction: 'ascending'});
            await app.ui.dataEntryBoard.unselectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await childGrid.getColumnSortingStatus(sortableTable[0].columnData.text))
                .eql({isPresent: false, direction: null});
        });
        await app.step('Verify sorting reverted when reset tab or DEF', async () => {
            await app.ui.dataEntryBoard.childRecord.addNew();
            await childGrid.clickHeader(sortableTable[0].columnData.index);
            await t
                .expect(await childGrid.getColumnSortingStatus(sortableTable[0].columnData.text))
                .eql({isPresent: true, direction: 'ascending'});
            await app.ui.dataEntryBoard.childRecord.resetChanges();
            await app.ui.confirmationModal.confirm();
            await t
                .expect(await childGrid.getColumnSortingStatus(sortableTable[0].columnData.text))
                .eql({isPresent: false, direction: null});
            await app.ui.dataEntryBoard.childRecord.addNew();
            await childGrid.clickHeader(sortableTable[0].columnData.index);
            await t
                .expect(await childGrid.getColumnSortingStatus(sortableTable[0].columnData.text))
                .eql({isPresent: true, direction: 'ascending'});
            await app.ui.dataEntryBoard.reset();
            await app.ui.confirmationModal.confirm();
            await t
                .expect(await childGrid.getColumnSortingStatus(sortableTable[0].columnData.text))
                .eql({isPresent: false, direction: null});
        });
        await app.step('Verify sorting reverted when switch to another tab', async () => {
            await childGrid.clickHeader(sortableTable[0].columnData.index);
            await t
                .expect(await childGrid.getColumnSortingStatus(sortableTable[0].columnData.text))
                .eql({isPresent: true, direction: 'ascending'});
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await childGrid.getColumnSortingStatus(sortableTable[0].columnData.text))
                .eql({isPresent: false, direction: null});
        });
        await app.step('Check special symbols', async () => {
            await app.ui.dataEntryBoard.childRecord.addNew();
            await app.ui.dataEntryBoard.childRecord.addNew();
            await app.ui.dataEntryBoard.childRecord.addNew();
            await app.ui.dataEntryBoard.childRecord.addNew();
            let firstRow = await childGrid.getRecord(0);
            let secondRow = await childGrid.getRecord(1);
            let thirdRow = await childGrid.getRecord(2);
            let fourthRow = await childGrid.getRecord(3);
            await firstRow.getField('Invoice Number', 'input').fill('111');
            await secondRow.getField('Invoice Number', 'input').fill('&&&');
            await thirdRow.getField('Invoice Number', 'input').fill('{{{');
            await fourthRow.getField('Invoice Number', 'input').fill('@@@');
            let nonSortedColumnValues = await childGrid.getColumnValues('Invoice Number');
            await childGrid.clickHeader('Invoice Number');
            let ascendingColumnValues = await childGrid.getColumnValues('Invoice Number');
            await childGrid.clickHeader('Invoice Number');
            let descendingColumnValues = await childGrid.getColumnValues('Invoice Number');
            console.log(nonSortedColumnValues);
            console.log(ascendingColumnValues);
            console.log(nonSortedColumnValues.sort(app.services.sorting.appSortLocal));
            console.log(descendingColumnValues);
            console.log(nonSortedColumnValues.sort(app.services.sorting.appSortLocal).reverse());
            await t
                .expect(ascendingColumnValues).eql(nonSortedColumnValues.sort(app.services.sorting.appSortLocal))
                .expect(descendingColumnValues).eql(nonSortedColumnValues.sort(app.services.sorting.appSortLocal).reverse());
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.createRecord, app.ui.requestLogger.simple)
    .before(async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Update User Preferences (API)', async () => {
            app.ui.setCookie();
            await app.api.userPreferences.resetUserPreferences([{property: 'ActionsCompletedDateFilter', value: true}]);
        });
    })
    (`Verify default filter and sorting (Step 4)`, async (t) => {
        let childGrid;
        let firstRow;
        let secondRow;
        await app.step('Open Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(`patent${app.services.time.timestampShort()}Simple`);
        });
        await app.step('Add two rows with Completed Date to Child Actions', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            await app.ui.dataEntryBoard.childRecord.addNew();
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            firstRow = await childGrid.getRecord(0);
            secondRow = await childGrid.getRecord(1);
            await firstRow.getField('Completed Date', 'datepicker').fill('12/04/2019');
            await firstRow.getField('Notes', 'input').fill('first row');
            await secondRow.getField('Notes', 'input').fill('second row');
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.services.time.wait(async () => (await childGrid.getRecordsCount()) === 1);
            await t
                .expect(await childGrid.getRecordsCount()).eql(1)
                .expect(await childGrid.isFilterActive('Completed Date')).ok()
                .expect(await firstRow.getField('Notes', 'input').getLockedValue()).eql('second row')
                .expect(await firstRow.getField('Completed Date', 'datepicker').getLockedValue()).eql('');
        });
        await app.step('Clear the filter', async () => {
            await childGrid.removeFilter('Completed Date');
            await t
                .expect(await app.services.time.wait(async () => {
                    return await childGrid.getRecordsCount() === 2;
                }, {timeout: 3000})).ok()
                .expect(await firstRow.getField('Notes', 'input').getLockedValue()).eql('first row')
                .expect(await firstRow.getField('Completed Date', 'datepicker').getLockedValue())
                .eql('12/04/2019');
        });
        await app.step('Add two rows with Action Due Date', async () => {
            await app.ui.dataEntryBoard.childRecord.addNew();
            await app.ui.dataEntryBoard.childRecord.addNew();
            await firstRow.getField('Action Due Date', 'datepicker').fill('12/04/2019');
            await secondRow.getField('Action Due Date', 'datepicker').fill('12/03/2019');
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.services.time.wait(async () => (await childGrid.getRecordsCount()) === 3);
            await t
                .expect(await childGrid.getRecordsCount()).eql(3)
                .expect(await childGrid.isFilterActive('Completed Date')).ok()
                .expect(await childGrid.getColumnSortingStatus('Action Due Date'))
                .eql({isPresent: true, direction: 'ascending'});
        });
        await app.step('Add Completed date to the Row with Action Due Date', async () => {
            await firstRow.getField('Completed date', 'datepicker').fill('12/04/2019');
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.services.time.wait(async () => (await childGrid.getRecordsCount()) === 2);
            await t
                .expect(await childGrid.getRecordsCount()).eql(2)
                .expect(await childGrid.isFilterActive('Completed Date')).ok()
                .expect(await firstRow.getField('Completed Date', 'datepicker').getLockedValue()).eql('')
                .expect(await secondRow.getField('Completed Date', 'datepicker').getLockedValue()).eql('');
        });
        await app.step('Close the Actions tab and Open again', async () => {
            await childGrid.removeFilter('Completed Date');
            await t
                .expect(await childGrid.isFilterActive('Completed Date')).notOk()
                .expect(await childGrid.getRecordsCount()).eql(4);
            await app.ui.dataEntryBoard.unselectChildRecord('Actions');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.waitLoading({checkErrors: true});
            await app.services.time.wait(async () => (await childGrid.getRecordsCount()) === 2);
            await t
                .expect(await childGrid.getRecordsCount()).eql(2)
                .expect(await childGrid.isFilterActive('Completed Date')).ok()
                .expect(await firstRow.getField('Completed Date', 'datepicker').getLockedValue()).eql('')
                .expect(await secondRow.getField('Completed Date', 'datepicker').getLockedValue()).eql('');
        });
    })
    .after(async (t) => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step('Delete the record (API)', async () => {
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
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Verify filters for singleline and multiline fields (Step 6)`, async (t) => {
        let childGrid = null;
        let firstRow;
        let expectedMethods = [];
        let filter;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            app.ui.setCookie();
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleSF');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open "Expenses" child record and add One more row', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            firstRow = await childGrid.getRecord(0);
            await firstRow.getField('Amount', 'numeric').fill('1');
            await t
                .expect(await childGrid.getRecordsCount()).eql(6);
        });
        await app.step('Verify controls', async () => {
            expectedMethods = [
                'Contains',
                'Does Not Contain',
                'Starts With',
                'Ends With',
                'Equal',
                'Not Equal',
                'Is Null',
                'Is Not Null'
            ];
            filter = await childGrid.openFilter('Invoice Number');
            await filter.click('methodDropdown');
            await t
                .expect(await filter.child.getAllItemsText()).eql(expectedMethods)
                .expect(await filter.getAttribute('criteriaInput', 'placeholder'))
                .eql('Filter Criteria')
                .expect(await filter.getInputType()).eql('text')
                .expect(await filter.getText('applyButton')).eql('Filter')
                .expect(await filter.isEnabled('applyButton')).ok();
            filter = await childGrid.openFilter('Text 1');
            await filter.click('methodDropdown');
            await t
                .expect(await filter.child.getAllItemsText()).eql(expectedMethods)
                .expect(await filter.getAttribute('criteriaInput', 'placeholder'))
                .eql('Filter Criteria')
                .expect(await filter.isEnabled('applyButton')).ok();
            await childGrid.closeFilter();
        });
        await app.step('Verify filters methods for singleline field', async () => {
            const methodsData = [
                {name: 'Contains', value: 'abc', compare: 'contains'},
                {name: 'Does Not Contain', value: 'abc', compare: 'notContains'},
                {name: 'Starts With', value: 'abc', compare: 'match', tValue: /^abc.+$/},
                {name: 'Ends With', value: 'bcd', compare: 'match', tValue: /^.+bcd$/},
                {name: 'Equal', value: 'abcd', compare: 'eql'},
                {name: 'Not Equal', value: 'abcd', compare: 'notEql'},
                {name: 'Is Null', compare: 'eql', tValue: ''},
                {name: 'Is Not Null', compare: 'notEql', tValue: ''}
            ];
            for (let method of methodsData) {
                filter = await childGrid.openFilter('Invoice Number');
                await filter.apply(method.name, method.value);
                const actualValues = await childGrid.getColumnValues('Invoice Number');
                for (let actualValue of actualValues) {
                    await t.expect(actualValue)[method.compare](method.tValue !== undefined ? method.tValue : method.value);
                }
            }
        });
        await app.step('Verify filters methods for multiline field', async () => {
            const methodsData = [
                {name: 'Contains', value: 'aaa', compare: 'contains'},
                {name: 'Does Not Contain', value: 'aaa', compare: 'notContains'},
                {name: 'Starts With', value: 'abc', compare: 'match', tValue: /^aaa.+$/},
                {name: 'Ends With', value: 'bcd', compare: 'match', tValue: /^.+aaa$/},
                {name: 'Equal', value: 'aaaaaaaaaa', compare: 'eql'},
                {name: 'Not Equal', value: 'aaaaaaaaaa', compare: 'notEql'},
                {name: 'Is Null', compare: 'eql', tValue: ''},
                {name: 'Is Not Null', compare: 'notEql', tValue: ''}
            ];
            for (let method of methodsData) {
                filter = await childGrid.openFilter('Text 1');
                await filter.apply(method.name, method.value);
                const actualValues = await childGrid.getColumnValues('Text 1');
                for (let actualValue of actualValues) {
                    await t.expect(actualValue)[method.compare](method.tValue !== undefined ? method.tValue : method.value);
                }
            }
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
    });

const dataSet = (function() {
    const fullData = [
        {
            ipType: 'Patent',
            targetDef: 'TA DEF for Patent',
            query: 'PA All Cases TA filter',
            newRowExpense: 'Credit Note - (CDN)',
            brief: 'true'
        },
        {
            ipType: 'Disclosure',
            targetDef: 'TA DEF for Disclosure',
            query: 'DS All Cases TA filter',
            newRowExpense: 'Debit Note - (DBN)',
            brief: 'false'
        },
        {
            ipType: 'Trademark',
            targetDef: 'TA DEF for Trademark',
            query: 'TM All Cases TA filter',
            newRowExpense: 'Research Fees - (SRC)',
            brief: 'false'
        },
        {
            ipType: 'GeneralIP1',
            targetDef: 'TA DEF for GeneralIP1',
            query: 'GIP1 All Cases TA filter',
            newRowExpense: 'Government Fees - (GOV)',
            brief: 'false'
        }
    ];
    return fullData;
})();

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        (`Verify filters for Combobox field (Step 7 - ${data.ipType})`, async (t) => {
            let childGrid = null;
            let firstRow;
            let expectedCheckboxes = [];
            let actualCheckboxes = [];
            let filter;
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Create Patent record (API)', async () => {
                app.ui.setCookie();
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.ipType, 'simpleSF');
            });
            await app.step('Open the record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(`${data.ipType}>${data.query}`);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.targetDef);
                await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open "Expenses" child record and add One more row', async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Expenses');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.childRecord.addNew();
                childGrid = app.ui.dataEntryBoard.childRecord.grid;
                firstRow = await childGrid.getRecord(0);
                await firstRow.getField('Amount', 'numeric').fill('1');
                await t
                    .expect(await childGrid.getRecordsCount()).eql(6);
            });
            await app.step('Verify filter controls', async () => {
                expectedCheckboxes = await childGrid.getColumnValues('Expense');
                expectedCheckboxes = app.services.sorting.arrayAsSet(expectedCheckboxes).sort(app.services.sorting.appSort);
                filter = await childGrid.openFilter('Expense');
                actualCheckboxes = await filter.getAllCheckboxLabels();
                actualCheckboxes = actualCheckboxes.filter((label) => label !== 'Select All');
                await t
                    .expect(await filter.getAttribute('searchInput', 'placeholder'))
                    .eql('Search')
                    .expect(await filter.isVisible('selectAllCheckbox')).ok()
                    .expect(actualCheckboxes).eql(expectedCheckboxes.sort(app.services.sorting.appSortEmptyToEnd))
                    .expect(await filter.getText('countLabel')).eql('0 items selected')
                    .expect(await filter.isEnabled('applyButton')).ok();
                await childGrid.closeFilter();
            });
            await app.step('Verify filtering', async () => {
                const rows = await childGrid.getColumnValues('Expense');
                filter = await childGrid.openFilter('Expense');
                await filter.apply([actualCheckboxes[0]]);
                await t
                    .expect(app.services.sorting.arrayAsSet(await childGrid.getColumnValues('Expense')))
                    .eql([actualCheckboxes[0]]);
                await childGrid.removeFilter('Expense');
                await t
                    .expect(await childGrid.getColumnValues('Expense')).eql(rows);
                filter = await childGrid.openFilter('Expense');
                await filter.apply([actualCheckboxes[0], actualCheckboxes[2]]);
                await t
                    .expect(app.services.sorting.arrayAsSet(
                        await childGrid.getColumnValues('Expense'))
                        .sort(app.services.sorting.appSort)
                    )
                    .eql([actualCheckboxes[0], actualCheckboxes[2]]);
                await childGrid.removeFilter('Expense');
                filter = await childGrid.openFilter('Expense');
                await filter.apply(['Select All']);
                await t
                    .expect(app.services.sorting.arrayAsSet(
                        await childGrid.getColumnValues('Expense'))
                        .sort(app.services.sorting.appSort)
                        .sort(app.services.sorting.appSortEmptyToEnd)
                    )
                    .eql(actualCheckboxes);
                await childGrid.removeFilter('Expense');
                filter = await childGrid.openFilter('Expense');
                await filter.apply([]);
                await t
                    .expect(app.services.sorting.arrayAsSet(
                        await childGrid.getColumnValues('Expense'))
                        .sort(app.services.sorting.appSort)
                        .sort(app.services.sorting.appSortEmptyToEnd)
                    )
                    .eql(actualCheckboxes);
            });
            await app.step('Verify filter updates', async () => {
                await firstRow.getField('Expense', 'autocomplete', {isTextExact: true}).fill(data.newRowExpense);
                expectedCheckboxes = app.services.sorting.arrayAsSet(await childGrid.getColumnValues('Expense'))
                    .sort(app.services.sorting.appSort)
                    .sort(app.services.sorting.appSortEmptyToEnd);
                filter = await childGrid.openFilter('Expense');
                actualCheckboxes = await filter.getAllCheckboxLabels();
                actualCheckboxes = actualCheckboxes.filter((label) => label !== 'Select All');
                await t
                    .expect(actualCheckboxes).eql(expectedCheckboxes);
                await filter.apply([data.newRowExpense]);
                await t
                    .expect(app.services.sorting.arrayAsSet(await childGrid.getColumnValues('Expense')))
                    .eql([data.newRowExpense]);
                await childGrid.removeFilter('Expense');
                await app.ui.dataEntryBoard.childRecord.addNew();
                await firstRow.getField('Amount', 'numeric').fill('2');
                expectedCheckboxes = app.services.sorting.arrayAsSet(await childGrid.getColumnValues('Expense'))
                    .sort(app.services.sorting.appSort)
                    .sort(app.services.sorting.appSortEmptyToEnd);
                filter = await childGrid.openFilter('Expense');
                actualCheckboxes = await filter.getAllCheckboxLabels();
                actualCheckboxes = actualCheckboxes.filter((label) => label !== 'Select All');
                await t
                    .expect(actualCheckboxes).eql(expectedCheckboxes);
                await childGrid.closeFilter();
            });
            await app.step('Verify filter searching', async () => {
                filter = await childGrid.openFilter('Expense');
                await filter.search(actualCheckboxes[2]);
                await t
                    .expect(await filter.getAllCheckboxLabels()).eql(['Select All', actualCheckboxes[2]]);
                await filter.clearSearch();
                await filter.search('nothing');
                await t
                    .expect(await filter.getAllCheckboxLabels()).eql(['Select All']);
            });
        })
        .after(async (t) => {
            await app.step('Delete the record (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            });
            app.ui.resetRequestLogger();
        });
});

test
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    .meta('brief', 'true')
    (`Verify filters for LLL field (Step 11)`, async (t) => {
        let childGrid = null;
        let firstRow;
        let expectedCheckboxes = [];
        let actualCheckboxes = [];
        let filter;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            app.ui.setCookie();
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleSF');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open "Expenses" child record and add One more row', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            firstRow = await childGrid.getRecord(0);
            await firstRow.getField('Amount', 'numeric').fill('1');
            await t
                .expect(await childGrid.getRecordsCount()).eql(6);
        });
        await app.step('Verify filter controls', async () => {
            expectedCheckboxes = await childGrid.getColumnValues('Division');
            expectedCheckboxes = app.services.sorting.arrayAsSet(expectedCheckboxes).sort(app.services.sorting.appSort);
            filter = await childGrid.openFilter('Division');
            actualCheckboxes = await filter.getAllCheckboxLabels();
            actualCheckboxes = actualCheckboxes.filter((label) => label !== 'Select All');
            await t
                .expect(await filter.getAttribute('searchInput', 'placeholder'))
                .eql('Search')
                .expect(await filter.isVisible('selectAllCheckbox')).ok()
                .expect(actualCheckboxes).eql(expectedCheckboxes.sort(app.services.sorting.appSortEmptyToEnd))
                .expect(await filter.getText('countLabel')).eql('0 items selected')
                .expect(await filter.isEnabled('applyButton')).ok();
            await childGrid.closeFilter();
        });
        await app.step('Verify filtering', async () => {
            filter = await childGrid.openFilter('Division');
            await filter.apply([actualCheckboxes[0]]);
            await t
                .expect(app.services.sorting.arrayAsSet(await childGrid.getColumnValues('Division')))
                .eql([actualCheckboxes[0]]);
            await childGrid.removeFilter('Division');
            filter = await childGrid.openFilter('Division');
            await filter.apply([actualCheckboxes[0], actualCheckboxes[2]]);
            await t
                .expect(app.services.sorting.arrayAsSet(
                    await childGrid.getColumnValues('Division'))
                    .sort(app.services.sorting.appSort)
                )
                .eql([actualCheckboxes[0], actualCheckboxes[2]]);
            await childGrid.removeFilter('Division');
            filter = await childGrid.openFilter('Division');
            await filter.apply(['Select All']);
            await t
                .expect(app.services.sorting.arrayAsSet(
                    await childGrid.getColumnValues('Division'))
                    .sort(app.services.sorting.appSort)
                    .sort(app.services.sorting.appSortEmptyToEnd)
                )
                .eql(actualCheckboxes);
            await childGrid.removeFilter('Division');
            filter = await childGrid.openFilter('Division');
            await filter.apply([]);
            await t
                .expect(app.services.sorting.arrayAsSet(
                    await childGrid.getColumnValues('Division'))
                    .sort(app.services.sorting.appSort)
                    .sort(app.services.sorting.appSortEmptyToEnd)
                )
                .eql(actualCheckboxes);
        });
        await app.step('Verify filter updates', async () => {
            await firstRow.getField('Division', 'autocomplete').fill('CLP Party - 1 - (CLP Party - 1)');
            expectedCheckboxes = app.services.sorting.arrayAsSet(await childGrid.getColumnValues('Division')).sort(app.services.sorting.appSort);
            filter = await childGrid.openFilter('Division');
            actualCheckboxes = await filter.getAllCheckboxLabels();
            actualCheckboxes = actualCheckboxes.filter((label) => label !== 'Select All');
            await t
                .expect(actualCheckboxes).eql(expectedCheckboxes.sort(app.services.sorting.appSortEmptyToEnd));
            await filter.apply(['CLP Party - 1 - (CLP Party - 1)']);
            await t
                .expect(app.services.sorting.arrayAsSet(await childGrid.getColumnValues('Division')))
                .eql(['CLP Party - 1 - (CLP Party - 1)']);
            await childGrid.removeFilter('Division');
            await app.ui.dataEntryBoard.childRecord.addNew();
            await firstRow.getField('Amount', 'numeric').fill('2');
            expectedCheckboxes = app.services.sorting.arrayAsSet(await childGrid.getColumnValues('Division')).sort(app.services.sorting.appSort);
            filter = await childGrid.openFilter('Division');
            actualCheckboxes = await filter.getAllCheckboxLabels();
            actualCheckboxes = actualCheckboxes.filter((label) => label !== 'Select All');
            await t
                .expect(actualCheckboxes).eql(expectedCheckboxes.sort(app.services.sorting.appSortEmptyToEnd));
            await childGrid.closeFilter();
        });
        await app.step('Verify filter searching', async () => {
            await childGrid.clickHeader('Invoice Number'); // Workaround for scrolling issues
            filter = await childGrid.openFilter('Division');
            await filter.search(actualCheckboxes[2]);
            await t
                .expect(await filter.getAllCheckboxLabels()).eql(['Select All', actualCheckboxes[2]]);
            await filter.clearSearch();
            await filter.search('nothing');
            await t
                .expect(await filter.getAllCheckboxLabels()).eql(['Select All']);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
    });

test
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    (`Verify filters for Numeric field (Step 8)`, async (t) => {
        let childGrid = null;
        let firstRow;
        let expectedMethods = [];
        let filter;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            app.ui.setCookie();
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleSF');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open "Expenses" child record and add One more row', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            firstRow = await childGrid.getRecord(0);
            await firstRow.getField('Amount', 'numeric').fill('1');
            await t
                .expect(await childGrid.getRecordsCount()).eql(6);
        });
        await app.step('Verify filter controls', async () => {
            expectedMethods = [
                'Equal',
                'Not Equal',
                'Greater Than',
                'Greater Than Or Equal To',
                'Less Than',
                'Less Than Or Equal To',
                'Is Null',
                'Is Not Null'
            ];
            filter = await childGrid.openFilter('Percentage');
            await filter.click('methodDropdown');
            await t
                .expect(await filter.child.getAllItemsText()).eql(expectedMethods)
                .expect(await filter.isVisible('criteriaInput')).ok()
                .expect(await filter.getInputType()).eql('numeric')
                .expect(await filter.isEnabled('applyButton')).ok();
            await childGrid.closeFilter();
        });
        await app.step('Verify filters methods for field', async () => {
            const methodsData = [
                {name: 'Equal', value: '0.18', compare: 'eql'},
                {name: 'Not Equal', value: '0.18', compare: 'notEql'},
                {name: 'Greater Than', value: '0.18', compare: 'gt'},
                {name: 'Greater Than Or Equal To', value: '0.18', compare: 'gte'},
                {name: 'Less Than', value: '0.18', compare: 'lt'},
                {name: 'Less Than Or Equal To', value: '0.18', compare: 'lte'},
                {name: 'Is Null', compare: 'eql', tValue: ''},
                {name: 'Is Not Null', compare: 'notEql', tValue: ''}
            ];
            for (let method of methodsData) {
                filter = await childGrid.openFilter('Percentage');
                await filter.apply(method.name, method.value);
                const actualValues = await childGrid.getColumnValues('Percentage');
                for (let actualValue of actualValues) {
                    if (actualValue) {
                        actualValue = parseFloat(actualValue);
                    } else {
                        if (method.compare === 'gt' || method.compare === 'gte' || method.compare === 'lt' || method.compare === 'lte') {
                            actualValue = 0;
                        }
                    }
                    await t
                        .expect(actualValue)[method.compare](method.tValue !== undefined ? method.tValue : parseFloat(method.value));
                }
            }
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Verify filters for Date field (Step 9)`, async (t) => {
        let childGrid = null;
        let firstRow;
        let expectedMethods = [];
        let filter;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            app.ui.setCookie();
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleSF');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open "Expenses" child record and add One more row', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            firstRow = await childGrid.getRecord(0);
            await firstRow.getField('Amount', 'numeric').fill('1');
            await t
                .expect(await childGrid.getRecordsCount()).eql(6);
        });
        await app.step('Verify filter controls', async () => {
            expectedMethods = [
                'Equal',
                'Not Equal',
                'Greater Than',
                'Greater Than Or Equal To',
                'Less Than',
                'Less Than Or Equal To',
                'Is Null',
                'Is Not Null'
            ];
            filter = await childGrid.openFilter('Miscellaneous Date');
            await filter.click('methodDropdown');
            await t
                .expect(await filter.child.getAllItemsText()).eql(expectedMethods)
                .expect(await filter.isVisible('criteriaInput')).ok()
                .expect(await filter.getInputType()).eql('date')
                .expect(await filter.isEnabled('applyButton')).ok();
            await childGrid.closeFilter();
        });
        await app.step('Verify filters methods for field', async () => {
            const methodsData = [
                {name: 'Equal', value: '12/13/2019', compare: 'eql'},
                {name: 'Not Equal', value: '12/13/2019', compare: 'notEql'},
                {name: 'Greater Than', value: '12/13/2019', compare: 'gt'},
                {name: 'Greater Than Or Equal To', value: '12/13/2019', compare: 'gte'},
                {name: 'Less Than', value: '12/13/2019', compare: 'lt'},
                {name: 'Less Than Or Equal To', value: '12/13/2019', compare: 'lte'},
                {name: 'Is Null', compare: 'eql', tValue: ''},
                {name: 'Is Not Null', compare: 'notEql', tValue: ''}
            ];
            for (let method of methodsData) {
                filter = await childGrid.openFilter('Miscellaneous Date');
                await filter.apply(method.name, method.value);
                const actualValues = await childGrid.getColumnValues('Miscellaneous Date');
                for (let actualValue of actualValues) {
                    if (actualValue) {
                        actualValue = app.services.time.getSeconds(actualValue, {pattern: 'MM/DD/YYYY'});
                    } else {
                        if (method.compare === 'gt' || method.compare === 'gte' || method.compare === 'lt' || method.compare === 'lte') {
                            actualValue = 0;
                        }
                    }
                    await t
                        .expect(actualValue)[method.compare](method.tValue !== undefined ? method.tValue : app.services.time.getSeconds(method.value, {pattern: 'MM/DD/YYYY'}));
                }
            }
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Verify filter for Checkbox field (Step 10)`, async (t) => {
        let childGrid = null;
        let firstRow;
        let expectedCheckboxes = [];
        let actualCheckboxes = [];
        let filter;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            app.ui.setCookie();
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleSF');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open "Expenses" child record and add One more row', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            firstRow = await childGrid.getRecord(0);
        });
        await app.step('Verify filter controls', async () => {
            filter = await childGrid.openFilter('GENERICCHECKBOX1');
            actualCheckboxes = await filter.getAllCheckboxLabels();
            await t
                .expect(actualCheckboxes).eql(['Checked', 'Not Checked'])
                .expect(await filter.isEnabled('applyButton')).ok();
            await childGrid.closeFilter();
        });
        await app.step('Verify filtering', async () => {
            filter = await childGrid.openFilter('GENERICCHECKBOX1');
            await filter.apply(['Checked']);
            await t
                .expect(await childGrid.getColumnValues('GENERICCHECKBOX1'))
                .notContains(false);
            await childGrid.removeFilter('GENERICCHECKBOX1');
            filter = await childGrid.openFilter('GENERICCHECKBOX1');
            await filter.apply(['Not Checked']);
            await t
                .expect(await childGrid.getColumnValues('GENERICCHECKBOX1'))
                .notContains(true);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Verify filters for Hierarchy field (Step 12)`, async (t) => {
        let childGrid = null;
        let firstRow;
        let expectedCheckboxes = [];
        let actualCheckboxes = [];
        let filter;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            app.ui.setCookie();
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleSF');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open "Expenses" child record and add One more row', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            firstRow = await childGrid.getRecord(0);
            await firstRow.getField('Amount', 'numeric').fill('1');
            await t
                .expect(await childGrid.getRecordsCount()).eql(6);
        });
        await app.step('Verify filter controls', async () => {
            expectedCheckboxes = await childGrid.getColumnValues('Payto Code');
            expectedCheckboxes = app.services.sorting.arrayAsSet(expectedCheckboxes).sort(app.services.sorting.appSort);
            filter = await childGrid.openFilter('Payto Code');
            actualCheckboxes = await filter.getAllCheckboxLabels();
            actualCheckboxes = actualCheckboxes.filter((label) => label !== 'Select All');
            await t
                .expect(await filter.getAttribute('searchInput', 'placeholder'))
                .eql('Search')
                .expect(await filter.isVisible('selectAllCheckbox')).ok()
                .expect(actualCheckboxes).eql(expectedCheckboxes.sort(app.services.sorting.appSortEmptyToEnd))
                .expect(await filter.getText('countLabel')).eql('0 items selected')
                .expect(await filter.isEnabled('applyButton')).ok();
            await childGrid.closeFilter();
        });
        await app.step('Verify filtering', async () => {
            filter = await childGrid.openFilter('Payto Code');
            await filter.apply([actualCheckboxes[0]]);
            await t
                .expect(app.services.sorting.arrayAsSet(await childGrid.getColumnValues('Payto Code')))
                .eql([actualCheckboxes[0]]);
            await childGrid.removeFilter('Payto Code');
            filter = await childGrid.openFilter('Payto Code');
            await filter.apply([actualCheckboxes[0], actualCheckboxes[2]]);
            await t
                .expect(app.services.sorting.arrayAsSet(
                    await childGrid.getColumnValues('Payto Code'))
                    .sort(app.services.sorting.appSort)
                )
                .eql([actualCheckboxes[0], actualCheckboxes[2]]);
            await childGrid.removeFilter('Payto Code');
            filter = await childGrid.openFilter('Payto Code');
            await filter.apply(['Select All']);
            await t
                .expect(app.services.sorting.arrayAsSet(
                    await childGrid.getColumnValues('Payto Code'))
                    .sort(app.services.sorting.appSort)
                    .sort(app.services.sorting.appSortEmptyToEnd)
                )
                .eql(actualCheckboxes);
            await childGrid.removeFilter('Payto Code');
            filter = await childGrid.openFilter('Payto Code');
            await filter.apply([]);
            await t
                .expect(app.services.sorting.arrayAsSet(
                    await childGrid.getColumnValues('Payto Code'))
                    .sort(app.services.sorting.appSort)
                    .sort(app.services.sorting.appSortEmptyToEnd)
                )
                .eql(actualCheckboxes);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Verify two filters applied one by one (Step 13)`, async (t) => {
        let childGrid = null;
        let firstRow;
        let actualCheckboxes = [];
        let filter;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            app.ui.setCookie();
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleSF');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open "Expenses" child record and add One more row', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            firstRow = await childGrid.getRecord(0);
            await firstRow.getField('Amount', 'numeric').fill('1');
            await firstRow.getField('Expense', 'autocomplete').fill('Research Fees - (SRC)');
            await t
                .expect(await childGrid.getRecordsCount()).eql(6);
        });
        await app.step('Verify two filters applied one by one', async () => {
            const allRows = await childGrid.getColumnValues('Expense');
            const targetCount = allRows.reduce((count, row) => {
                return row === 'Research Fees - (SRC)' ? count + 1 : count;
            }, 0);
            filter = await childGrid.openFilter('GENERICCHECKBOX1');
            await filter.apply(['Checked']);
            const filteredRows = (await childGrid.getColumnValues('Expense')).sort(app.services.sorting.appSort);
            filter = await childGrid.openFilter('Expense');
            actualCheckboxes = await filter.getAllCheckboxLabels();
            actualCheckboxes = actualCheckboxes.filter((label) => label !== 'Select All');
            await t
                .expect(app.services.sorting.arrayAsSet(filteredRows)).eql(actualCheckboxes)
                .expect(allRows.length).gt(filteredRows.length);
            await filter.apply(['Research Fees - (SRC)']);
            await t
                .expect((await childGrid.getColumnValues('Expense')).length).eql(targetCount - 1);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        app.ui.resetRequestLogger();
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Verify filter with locked child tab (Step 15)`, async (t) => {
        let childGrid = null;
        let actualCheckboxes = [];
        let filter;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Disable Edit/Visible permission for CG (API)', async () => {
            app.ui.setCookie();
            const changes = [{Path: 'PatentMasters', EditPermission: null, isOnly: true},
                {Path: 'PatentMasters>EXPENSES', EditPermission: false}];
            await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
        });
        await app.step('Create Patent record (API)', async () => {
            app.ui.setCookie();
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleSF');
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open "Expenses" child record and add One more row', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Expenses');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).notOk();
        });
        await app.step('Verify Checkbox filter controls', async () => {
            childGrid = app.ui.dataEntryBoard.childRecord.grid;
            filter = await childGrid.openFilter('GENERICCHECKBOX1');
            actualCheckboxes = await filter.getAllCheckboxLabels();
            await t
                .expect(actualCheckboxes).eql(['Checked', 'Not Checked'])
                .expect(await filter.isEnabled('applyButton')).ok();
            await childGrid.closeFilter();
        });
        await app.step('Verify Checkbox filtering', async () => {
            filter = await childGrid.openFilter('GENERICCHECKBOX1');
            await filter.apply(['Checked']);
            await t
                .expect((await childGrid.getColumnValues('GENERICCHECKBOX1'))
                    .filter((value) => {
                        return !!value;
                    })
                )
                .notContains(false);
            await childGrid.removeFilter('GENERICCHECKBOX1');
            filter = await childGrid.openFilter('GENERICCHECKBOX1');
            await filter.apply(['Not Checked']);
            await t
                .expect((await childGrid.getColumnValues('GENERICCHECKBOX1'))
                    .filter((value) => {
                        return !!value;
                    })
                )
                .notContains(true);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
        });
        await app.step('Restore Edit/Visible permission for CG (API)', async () => {
            const changes = [{Path: 'PatentMasters', EditPermission: true}];
            await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
        });
        app.ui.resetRequestLogger();
    });
