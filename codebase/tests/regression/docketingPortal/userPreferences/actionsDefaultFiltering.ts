import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.userPreferences.pack. - Test ID 30713: User Preferences - apply Actions Default Filtering`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        for (let data of dataSet) {
            await app.step(`Create a ${data.recordType} record with filled 'Actions' child tab`, async () => {
                try {
                    const record = await app.api.combinedFunctionality.createRecord(data.recordType, 'simple');
                    createdRecords.push(record);
                    data.recordId = record.respData.Record.MasterId.toString();
                    data.recordName = record.reqData.recordName;
                    const dataEntry = app.api.dataEntryForm;

                    await dataEntry.openRecord(Number(data.recordId), data.viewIn);
                    await dataEntry.openChild('Actions');
                    const allActions = (await app.api.dataEntryForm.getChildAllPossibleValues('Action'));
                    for (let i = 0; i < 3; i++) {
                        dataEntry.addChildRecord();
                        await dataEntry.setChildValue('Action', allActions[i]);
                        await dataEntry.setChildValue(data.dueDate, app.services.time.moment().add(1 - i, 'year'));
                    }
                    for (let i = 0; i < 2; i++) {
                        dataEntry.addChildRecord();
                        await dataEntry.setChildValue('Action', allActions[i + 3]);
                        await dataEntry.setChildValue(data.dueDate, app.services.time.moment().add(-i, 'year'));
                        await dataEntry.setChildValue('Completed Date', app.services.time.moment().add(-i, 'year'));
                    }
                    dataEntry.addChildRecord();
                    await dataEntry.setChildValue('Action', allActions[10]);
                    await dataEntry.setChildValue('Notes', 'No dates');

                    await dataEntry.save();
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

const createdRecords = [];

const dataSet = [
    {
        ipType: 'Patents',
        recordType: 'patent',
        recordId: '',
        recordName: '',
        query: 'Patent>TA PA All Cases',
        viewIn: 'TA DEF for Patent',
        actionsCode: 'ACP',
        dueDate: 'Action Due Date',
        brief: 'true'
    },
    {
        ipType: 'Trademarks',
        recordType: 'trademark',
        recordId: '',
        recordName: '',
        query: 'Trademark>TA TM All Cases',
        viewIn: 'TA DEF for Trademark',
        dueDate: 'Action Due Date',
        actionsCode: 'ACT',
        brief: 'false'
    },
    {
        ipType: 'Disclosures',
        recordType: 'disclosure',
        recordId: '',
        recordName: '',
        query: 'Disclosure>TA DS All Cases',
        viewIn: 'TA DEF for Disclosure',
        actionsCode: 'ACP',
        dueDate: 'Due Date',
        brief: 'false'
    },
    {
        ipType: 'GeneralIP1',
        recordType: 'generalip',
        recordId: '',
        recordName: '',
        query: 'GeneralIP1>TA GIP1 All Cases',
        viewIn: 'TA DEF for GeneralIP1',
        actionsCode: 'AC1',
        dueDate: 'Action Due Date',
        brief: 'false'
    }
];

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Delete 'Actions Completed Date Filter' value in User Parameters table (Database)`, async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'ActionsCompletedDateFilter'`, { closeConnection: true });
        });
        await app.step(`Clear cache (API)`, async () => {
            await app.api.clearCache();
        });
    })
    (`Verify the state of the 'Actions Completed Date Filter' toggle for the new user on User Preferences (Step 3)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences');
        });
        await app.step(`Verify the state of the 'Actions Completed Date Filter' toggle is ON`, async () => {
            await app.ui.userPreferencesBoard.scrollTo('fields', 'Actions Completed Date Filter');
            await t
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Actions Completed Date Filter')).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Actions Completed Date Filter', 'toggle').getValue()).eql('On');
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Delete 'Actions Completed Date Filter' value in User Parameters table (Database)`, async () => {
                await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'ActionsCompletedDateFilter'`, { closeConnection: true });
            });
            await app.step(`Clear cache (API)`, async () => {
                await app.api.clearCache();
            });
        })
        (`Verify 'Actions' child tab on existing '${data.recordType}' def with 'Actions Completed Date Filter' toggle ON for a new user (steps 4-6)`, async (t: TestController) => {
            await app.step('Login', async () => {
                await app.ui.getRole(undefined, 'UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.getCurrentUrl()).contains('queries');
            });
            await app.step(`Open the '${data.recordType}' data entry record`, async () => {
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok();
            });
            await app.step(`Verify the 'Completed Date' filter is applied on 'Actions' child tab (Step 4)`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.grid.isFilterActive('Completed Date')).ok()
                    .expect((await child.grid.getColumnValues('Completed Date')).every((x) => x === '')).ok();
            });
            await app.step(`Verify the visible actions are sorted by data.dueDate asc (step 4)`, async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                let sorting = await child.grid.getColumnSortingStatus(data.dueDate);
                await t
                    .expect(sorting.isPresent).ok()
                    .expect(sorting.direction).eql('ascending');
            });
            await app.step(`Verify the row with added 'Completed Date' is filtered out on Save (step 4)`, async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                let countNoCD = await child.getTotalCount();
                let row = await child.grid.getRecord(countNoCD - 1);
                let rowTitle = await child.grid.getRecordFirstColumnValue(countNoCD - 1);
                await row.getField('Completed Date', 'datepicker').fill('today');
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await child.grid.isFilterActive('Completed Date')).ok()
                    .expect(await child.getTotalCount()).eql(countNoCD - 1)
                    .expect(await child.grid.isRecordAbsent(rowTitle)).ok();
            });
            await app.step(`Clear the 'Completed Date' filter`, async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.removeFilter('Completed Date');
                let sorting = await child.grid.getColumnSortingStatus(data.dueDate);
                await t
                    .expect(await child.grid.isFilterActive('Completed Date')).notOk()
                    .expect((await child.grid.getColumnValues('Completed Date')).some((x) => x !== '')).ok()
                    .expect(sorting.isPresent).ok()
                    .expect(sorting.direction).eql('ascending');
            });
            await app.step(`Verify the row with cleared 'Completed Date' is not filtered out on Save (steps 4, 5)`, async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                let indexWithCD = (await child.grid.getColumnValues('Completed Date')).findIndex((x) => x !== '');
                let row = await child.grid.getRecord(indexWithCD);
                let rowTitle = await child.grid.getRecordFirstColumnValue(indexWithCD);
                let field = await row.getField('Completed Date', 'datepicker');
                await field.click();
                await field.clear();

                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await child.grid.isFilterActive('Completed Date')).ok()
                    .expect(await child.grid.isRecordPresent(rowTitle)).ok();
            });
            await app.step(`Verify the 'Completed Date' filter is re-applied on reopening the Actions child tab (step 6)`, async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.removeFilter('Completed Date');
                await app.ui.dataEntryBoard.unselectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await child.grid.isFilterActive('Completed Date')).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });
});

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Set 'Actions Completed Date Filter' to OFF in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'ActionsCompletedDateFilter', value: false }]);
            });
        })
        (`Verify 'Actions' child tab on existing '${data.recordType}' def with 'Actions Completed Date Filter' toggle OFF (steps 7-10)`, async (t: TestController) => {
            await app.step('Login', async () => {
                await app.ui.getRole(undefined, 'UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.getCurrentUrl()).contains('queries');
            });
            await app.step(`Open the '${data.recordType}' data entry record`, async () => {
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok();
            });
            await app.step(`Verify the 'Completed Date' filter is NOT applied on 'Actions' child tab (Step 8)`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.grid.isFilterActive('Completed Date')).notOk()
                    .expect((await child.grid.getColumnValues('Completed Date')).some((x) => x !== '')).ok();
            });
            await app.step(`Verify the visible actions are sorted by data.dueDate asc (step 8)`, async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                let sorting = await child.grid.getColumnSortingStatus(data.dueDate);
                await t
                    .expect(sorting.isPresent).ok()
                    .expect(sorting.direction).eql('ascending');
            });
            await app.step(`Verify the 'Completed Date' filter is NOT applied on reopening the Actions child tab (step 9)`, async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await app.ui.dataEntryBoard.unselectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await child.grid.isFilterActive('Completed Date')).notOk()
                    .expect((await child.grid.getColumnValues('Completed Date')).some((x) => x !== '')).ok();
            });
            await app.step(`Apply a filter to the 'Completed Date' column (step 10)`, async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.openFilter('Completed Date');
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                const field = filter.getCriteriaField('datepicker');
                const today = app.services.time.moment().format('MM/DD/YYYY');
                await field.fill(today);
                await filter.confirm();

                await t
                    .expect(await child.grid.isFilterActive('Completed Date')).ok()
                    .expect((await child.grid.getColumnValues('Completed Date')).every((x) => x === today)).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });
});

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Delete 'Actions Completed Date Filter' value in User Parameters table (Database)`, async () => {
                await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'ActionsCompletedDateFilter'`, { closeConnection: true });
            });
            await app.step(`Clear cache (API)`, async () => {
                await app.api.clearCache();
            });
        })
        (`Verify Actions Completed Date Filter for a new '${data.recordType}' DEF (step 11)`, async (t: TestController) => {
            await app.step(`Login`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Verify the filter is applied in the 'Actions' child of a new '${data.recordType}' form`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.grid.isFilterActive('Completed Date')).ok();
            });
            await app.step(`Go to User Preferences`, async () => {
                await app.ui.navigate(`${globalConfig.env.url}/UI/user-preferences`);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Switch OFF Actions Completed Date Filter`, async () => {
                await app.ui.userPreferencesBoard.getField('Actions Completed Date Filter', 'toggle').off();

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Actions Completed Date Filter', 'toggle').isOn()).notOk();
            });
            await app.step(`Save User Preferences`, async () => {
                await app.ui.userPreferencesBoard.save();
                await app.ui.waitLoading();
            });
            await app.step(`Verify filter is not applied in the 'Actions' child of a new '${data.recordType}' form`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.grid.isFilterActive('Completed Date')).notOk();
            });
            await app.step(`Go back to User Preferences`, async () => {
                await app.ui.navigate(`${globalConfig.env.url}/UI/user-preferences`);
                await app.ui.waitLoading();
            });
            await app.step(`Switch ON Actions Completed Date Filter`, async () => {
                await app.ui.userPreferencesBoard.getField('Actions Completed Date Filter', 'toggle').on();

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Actions Completed Date Filter', 'toggle').isOn()).ok();
            });
            await app.step(`Save User Preferences`, async () => {
                await app.ui.userPreferencesBoard.save();
                await app.ui.waitLoading();
            });
            await app.step(`Verify filter is applied in the Actions child`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.grid.isFilterActive('Completed Date')).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });
});
