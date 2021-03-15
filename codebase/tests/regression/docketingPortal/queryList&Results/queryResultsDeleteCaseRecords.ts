import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.queryList&Results.pack. - Test ID 29992: Query - Query Results - Delete Case Record(s)`
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
            query: 'Patent>TA PA Cases with condition',
            deleteQuery: 'Deletion Management>Patent Deleted Query',
            ipType: 'patent',
            category: 'PatentMasters',
            templateDEF: 'Patent DEF',
            masterIdColumn: 'PATENTMASTERID',
            criteriaBuilder: {
                fieldName: 'Docket Number',
                operator: 'Contains',
                value: 'patent'
            },
            filter: {
                column: 'PATENTMASTERID',
                method: 'Contains',
                value: '0'
            },
            sort: { column: 'Create Date' },
            brief: 'true'
        },
        {
            query: 'Trademark>TA TM All Cases with condition',
            deleteQuery: 'Deletion Management>Trademark Deleted Query',
            ipType: 'trademark',
            category: 'TrademarkMasters',
            templateDEF: 'Trademark DEF',
            masterIdColumn: 'TRADEMARKMASTERID',
            criteriaBuilder: {
                fieldName: 'Docket Number',
                operator: 'Contains',
                value: 'trademark'
            },
            filter: {
                column: 'TRADEMARKMASTERID',
                method: 'Contains',
                value: '0'
            },
            sort: { column: 'Create Date' },
            brief: 'false'
        },
        {
            query: 'Disclosure>TA DS All Cases with condition',
            deleteQuery: 'Deletion Management>Disclosure Deleted Query',
            ipType: 'disclosure',
            category: 'DisclosureMasters',
            templateDEF: 'Disclosure DEF',
            masterIdColumn: 'DISCLOSUREMASTERID',
            criteriaBuilder: {
                fieldName: 'Disclosure Number',
                operator: 'Contains',
                value: 'disclosure'
            },
            filter: {
                column: 'DISCLOSUREMASTERID',
                method: 'Contains',
                value: '0'
            },
            sort: { column: 'Create Date' },
            brief: 'false'
        },
        {
            query: 'GeneralIP1>TA GIP1 All Cases with condition',
            deleteQuery: 'Deletion Management>GeneralIP1 Deleted Query',
            ipType: 'generalip',
            category: 'GeneralIP1Masters',
            templateDEF: 'GeneralIP1 DEF',
            masterIdColumn: 'GENERALIP1MASTERID',
            criteriaBuilder: {
                fieldName: 'Agreement Number',
                operator: 'Contains',
                value: 'generalip'
            },
            filter: {
                column: 'GENERALIP1MASTERID',
                method: 'Contains',
                value: '0'
            },
            sort: { column: 'Create Date' },
            brief: 'false'
        }
    ];
    return fullData;
})();

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify Delete for query (${data.category} - Steps 1-7)`, async (t: TestController) => {
            await app.step('Create record (API)', async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                app.memory.current.array = [app.memory.current.createRecordData];
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step('Run query', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Verify Delete when no record is selected (step 3)', async () => {
                await app.ui.queryBoard.click('menuItems', 'More');
                const menuItems: string[] = await app.ui.kendoPopup.getAllItemsText();
                const deleteTopBorder = await app.ui.kendoPopup.getStyleProperty('simpleItems', 'border-top-style', 'Delete');

                await t
                    .expect(menuItems.pop()).eql('Delete')
                    .expect(menuItems).eql(menuItems.sort(app.services.sorting.appSortAlphabetically))
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Delete')).notOk()
                    .expect(deleteTopBorder).eql('solid');
            });
            await app.step('Select a record and verify Delete (Step 4)', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await t
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Delete')).ok();
            });
            await app.step('Click Delete and verify confirmation message', async () => {
                await app.ui.kendoPopup.selectItem('Delete');
                await t
                    .expect(await app.ui.confirmationModal.isVisible()).ok()
                    .expect(await app.ui.confirmationModal.getText('title')).eql('Confirm')
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to delete the selected record(s)?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok();
            });
            await app.step('Verify the screen is disabled', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).uncheck();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).isChecked()).ok();
            });
            await app.step('Click Cancel on the confirmation modal and verify query results (Step 5)', async () => {
                await app.ui.confirmationModal.click('buttons', 'Cancel');
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues()).contains(app.memory.current.createRecordData.reqData.recordName)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).isChecked()).ok();
            });
            await app.step('Click [X] on the confirmation modal and verify query results', async () => {
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.click('cross');
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues()).contains(app.memory.current.createRecordData.reqData.recordName)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).isChecked()).ok();
            });
            await app.step('Click More > Delete > Yes and verify query results (Step 6)', async () => {
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await app.ui.isVisible('spinner')).ok()
                    .expect(await app.ui.getText('notificationMessage')).eql('Selected record(s) were deleted successfully.');
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues()).notContains(app.memory.current.createRecordData.reqData.recordName);
            });
            await app.step('Select several records and Delete (Step 7)', async () => {
                const record1 = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                const record2 = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                const record3 = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                app.memory.current.array.push(record1, record2, record3);
                await app.ui.refresh();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(record1.reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(record2.reqData.recordName).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(record3.reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                const queryResultRecords = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();
                await t
                    .expect(queryResultRecords).notContains(record1.reqData.recordName)
                    .expect(queryResultRecords).notContains(record2.reqData.recordName)
                    .expect(queryResultRecords).notContains(record3.reqData.recordName);
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
        (`Verify Delete for all records in query (${data.category} - Step 8-9)`, async (t: TestController) => {
            await app.step('Create records (API)', async () => {
                app.memory.current.array = [
                    await app.api.combinedFunctionality.createRecord(data.ipType, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.ipType, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.ipType, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.ipType, 'simple'),
                    await app.api.combinedFunctionality.createRecord(data.ipType, 'simple')
                ];
            });
            await app.step('Login and open query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Add filter in Criteria Builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
                await criteriaBuilder.getRow(0).getField('Field Name', 'autocomplete').fill(data.masterIdColumn);
                await criteriaBuilder.getRow(0).getField('Operator', 'dropdown').fill('In');
                await criteriaBuilder.getRow(0).getField('Value', 'input').fill(app.memory.current.array.map((x) => x.respData.Record.MasterId.toString()).join());
                await criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Select all records and Delete (Step 8)', async () => {
                await app.ui.queryBoard.queryResultsGrid.selectAllRecords();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await app.ui.getText('notificationMessage')).eql('Selected record(s) were deleted successfully.');
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(0);
            });
            await app.step('Verify the deleted records are displayed in Deletion Management (Step 9 API)', async () => {
                await app.api.deletionManagementQuery.openQuery(data.deleteQuery);
                app.api.deletionManagementQuery.sort('Deletion Date');
                await app.api.deletionManagementQuery.runQuery();
                const recordsIds = await app.api.deletionManagementQuery.getColumnValuesFromResults(data.masterIdColumn);
                await t
                    .expect(app.memory.current.array.every((x) => recordsIds.includes(x.respData.Record.MasterId.toString()))).ok();
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
        (`Verify Delete for records with Related Records added (${data.category} - Steps 10-11)`, async (t: TestController) => {
            let record: number;
            let relatedRecord: number;
            await app.step('Created a record and add related records (Step 10 - API) ', async () => {
                record = (await app.api.combinedFunctionality.createRecord(data.ipType, 'simple')).respData.Record.MasterId;
                relatedRecord = (await app.api.combinedFunctionality.createRecord(data.ipType, 'simple')).respData.Record.MasterId;
                app.memory.current.array = [record, relatedRecord];
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(record, data.templateDEF);
                await dataEntry.addRelatedRecord([ relatedRecord ], 'Child');
            });
            await app.step('Login and open query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Select record with related records and Delete (Step 10)', async () => {
                const rowIndex = await app.ui.queryBoard.queryResultsGrid.getRowIndexByColumnValue(data.masterIdColumn, record.toString());
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(rowIndex).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await app.ui.getText('notificationMessage')).eql('Selected record(s) were deleted successfully.');
                await app.ui.waitLoading();
                const recordIds = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.masterIdColumn);

                await t
                    .expect(recordIds).notContains(record);
            });
            await app.step('Open related record and verify the Related Records child (Step 11 - API)', async () => {
                const dataEntryForm = app.api.dataEntryForm;
                await dataEntryForm.openRecord(relatedRecord, data.templateDEF);
                await dataEntryForm.openChild('Related Records');
                await t
                    .expect(dataEntryForm.getChildRecordsCount()).eql(0);
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
        (`Verify user is able to delete a record that is in the progress of Collaborate process (${data.category} - Step 12)`, async (t: TestController) => {
            await app.step('Create record (API)', async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                app.memory.current.array = [app.memory.current.createRecordData];
            });
            await app.step('Login and open query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Add a record to collaboration process', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Collaborate');
                await app.ui.kendoPopup.child.selectTop();
                await app.ui.waitLoading();
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
            });
            await app.step('Delete the record', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await app.ui.getText('notificationMessage')).eql('Selected record(s) were deleted successfully.');
                await app.ui.waitLoading();
                const displayedRecordNames = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(displayedRecordNames).notContains(app.memory.current.createRecordData.reqData.recordName);
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
        .requestHooks(app.ui.requestLogger.deleteQueryRecords)
        (`Verify Query Results page state retains when delete records (${data.category} - Step 13)`, async (t: TestController) => {
            await app.step('Login and open query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Apply Criteria Builder filter', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(data.criteriaBuilder.fieldName);
                await row.getField('Operator', 'dropdown').fill(data.criteriaBuilder.operator);
                await row.getField('Value', 'input').fill(data.criteriaBuilder.value);
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Apply column filter to some fields', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(data.filter.column);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.apply(data.filter.method, data.filter.value);
                await app.ui.waitLoading();
            });
            await app.step('Apply sorting to any grid\'s column', async () => {
                await app.ui.queryBoard.queryResultsGrid.clickHeader(data.sort.column);
            });
            await app.step('Navigate to another grid\'s page', async () => {
                await app.ui.queryBoard.queryResultsGrid.navigateToTheNextPage();
                await app.ui.waitLoading();
            });
            await app.step('Select several records, click Delete and confirm deletion', async () => {
                const totalBefore = Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }));
                const record1 = await app.ui.queryBoard.queryResultsGrid.getRecordFirstColumnValue(0);
                const record2 = await app.ui.queryBoard.queryResultsGrid.getRecordFirstColumnValue(1);
                const record3 = await app.ui.queryBoard.queryResultsGrid.getRecordFirstColumnValue(2);
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(record1).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(record2).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(record3).check();

                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
                const totalAfter = Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }));
                const recordNames = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getSortedColumn()).eql(data.sort.column)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCurrentPage()).eql(2)
                    .expect(totalAfter).eql(totalBefore - 3)
                    .expect(recordNames).notContains(record1)
                    .expect(recordNames).notContains(record2)
                    .expect(recordNames).notContains(record3);
            });
        })
        .after(async () => {
            await app.step('Restore deleted records (API)', async () => {
                const records = app.ui.getLastRequestBody('deleteQueryRecords');
                const ids = records.map((x) => x.Record.MasterId);
                await app.api.deletionManagementQuery.openQuery(data.deleteQuery);
                app.api.deletionManagementQuery.sort('Deletion Date');
                await app.api.deletionManagementQuery.runQuery();
                await app.api.deletionManagementQuery.restore(data.masterIdColumn, ids.map((x) => x.toString()));
            });
            // it is not possible to create and delete records for current test
        });

    test
        // .only
        .meta('brief', data.brief)
        (`Delete record on the last page (${data.category} - Step 14)`, async (t: TestController) => {
            let recordIdsForFilter: number[];
            await app.step('Create record (API)', async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                recordIdsForFilter = [app.memory.current.createRecordData.respData.Record.MasterId.toString()];
            });
            await app.step('Get record ids for filter (API)', async () => {
                await app.api.query.openQuery(data.query);
                app.api.query.changePageSize(25);
                app.api.query.sort('Create Date', app.api.query.sortDirection.asc);
                await app.api.query.runQuery();
                recordIdsForFilter.push(...await app.api.query.getRecordIdsFromResults());
            });
            await app.step('Login and open query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Set filter in Criteria Builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
                await criteriaBuilder.getRow(0).getField('Field Name', 'autocomplete').fill(data.masterIdColumn);
                await criteriaBuilder.getRow(0).getField('Operator', 'dropdown').fill('In');
                await criteriaBuilder.getRow(0).getField('Value', 'input').fill(recordIdsForFilter.join());
                await criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Sort Query Results by Create Date ascending', async () => {
                await app.ui.queryBoard.queryResultsGrid.sort('Create Date', app.ui.queryBoard.queryResultsGrid.sortDirection.ascending);
            });
            await app.step('Go to the Last page of Query Results', async () => {
                await app.ui.queryBoard.queryResultsGrid.navigateToTheLastPage();
                await app.ui.waitLoading();
            });
            await app.step('Select record on the page and Delete', async () => {
                const totalBefore = Number((await app.ui.queryBoard.getMenuTotalCount({ isNumber: true })));
                const pageBefore = await app.ui.queryBoard.queryResultsGrid.getCurrentPage();

                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
                const totalAfter = Number((await app.ui.queryBoard.getMenuTotalCount({ isNumber: true })));

                await t
                    .expect(totalAfter).eql(totalBefore - 1)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCurrentPage()).eql(pageBefore - 1)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getPagerNumbers()).notContains(pageBefore.toString());
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .skip
        // .only
        .meta('brief', data.brief)
        (`Verify Delete without ip type Record Management permissions (${data.category} - Step 15)`, async (t: TestController) => {
            await app.step('Create record (API)', async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                app.memory.current.array = [app.memory.current.createRecordData];
            });
            await app.step('Login and open query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Unselect all the RM forms for the IP Type (API)', async () => {
                const customTemplateNames = (await app.api.administration.getAllDataEntryTemplates())
                    .Items.filter((x) => x.IPTypeName === data.category).map((x) => x.CustomResourceName);
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                await contentGroup.setPermissionForIpType('Record Management Form', data.category, false);
                for (let name of customTemplateNames) {
                    contentGroup.setPermission('Record Management Form' + '>' + name, false);
                }
                await contentGroup.save();
            });
            await app.step('Click More menu', async () => {
                await app.ui.refresh();
                await t
                    .expect(await app.ui.queryBoard.isPresent('menuItems', 'View in:')).notOk();
                await app.ui.queryBoard.click('menuItems', 'More');
                await t
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Delete')).notOk();
            });
            await app.step('Select a record and click the More menu', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await t
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Delete')).ok();
            });
            await app.step('Click Delete and verify Query Results', async () => {
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
                const recordNames = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(recordNames).notContains(app.memory.current.createRecordData.reqData.recordName);
            });
        })
        .after(async () => {
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
            await app.step('Reset content group permissions (API)', async () => {
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                await contentGroup.setPermissionDefaults();
                await contentGroup.save();
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        (`Verify Delete for query with Data Modification disabled (${data.category} - Step 16)`, async (t: TestController) => {
            await app.step('Create record (API)', async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                app.memory.current.array = [app.memory.current.createRecordData];
            });
            await app.step('Disable Data Modification for query (API)', async () => {
                await app.api.query.openQueryManagement(data.query);
                app.api.query.enableDataModification(false);
                await app.api.query.save();
            });
            await app.step('Login and open query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Click More menu', async () => {
                await app.ui.queryBoard.click('menuItems', 'More');
                await t
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Delete')).notOk();
            });
            await app.step('Select a record and click the More menu', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await t
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Delete')).ok();
            });
            await app.step('Click Delete and verify Query Results', async () => {
                await app.ui.kendoPopup.selectItem('Delete');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
                const recordNames = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();

                await t
                    .expect(recordNames).notContains(app.memory.current.createRecordData.reqData.recordName);
            });
        })
        .after(async () => {
            await app.step('Enable Data Modification for query (API)', async () => {
                await app.api.query.openQueryManagement(data.query);
                app.api.query.enableDataModification(true);
                await app.api.query.save();
            });
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });

    test
        // .only
        .meta('brief', data.brief)
        (`Verify Delete for query without master id field (${data.category} - Step 17)`, async (t: TestController) => {
            await app.step('Create record (API)', async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                app.memory.current.array = [app.memory.current.createRecordData];
            });
            await app.step('Remove master id field from Field Selection in Query Management (API)', async () => {
                await app.api.query.openQueryManagement(data.query);
                app.api.query.removeResultField(data.masterIdColumn);
                await app.api.query.save();
            });
            await app.step('Login and open query', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step('Click More menu', async () => {
                await app.ui.queryBoard.click('menuItems', 'More');
                await t
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Delete')).notOk();
            });
            await app.step('Select a record and click the More menu', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                await t
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Delete')).notOk();
            });
        })
        .after(async () => {
            await app.step('Add master id field to Field Selection in Query Management (API)', async () => {
                await app.api.query.openQueryManagement(data.query);
                app.api.query.addResultField(data.masterIdColumn);
                app.api.query.enableDataModification(true);
                await app.api.query.save();
            });
            await app.step('Delete records (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
            });
        });
    });

const data = dataSet[0];

test
    // .only
    // .skip
    .meta('brief', data.brief)
    .meta('category', 'Display Configuration')
    ('Query Results - Delete Records - Verify Display Configuration (Step 18)', async (t: TestController) => {
        await app.step('Create record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
            app.memory.current.array = [app.memory.current.createRecordData];
        });
        await app.step('Change display configuration for user (API)', async () => {
            app.ui.resetRole();
            await app.api.changeDisplayConfigurationForUser('TA Custom Display Configuration', globalConfig.user.userName);
        });
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading();
        });
        await app.step('Click More menu', async () => {
            await app.ui.queryBoard.click('menuItems', 'More');
            await t
                .expect(await app.ui.kendoPopup.isVisible('simpleItems', 'Test - Delete')).ok();
        });
        await app.step('Verify confirmation message', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(app.memory.current.createRecordData.reqData.recordName).check();
            await app.ui.queryBoard.click('menuItems', 'More');
            await app.ui.kendoPopup.selectItem('Test - Delete');
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Test - Are you sure you want to delete the selected record(s)?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Test - Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Test - Cancel')).ok()
                .expect(await app.ui.confirmationModal.getText('title')).eql('Test - Confirm');
        });
        await app.step('Verify the successful message', async () => {
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.getText('notificationMessage')).eql('Test - Selected record(s) were deleted successfully.');
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
