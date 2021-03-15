import app from '../../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.dataEntryForm.child.pack - Test ID 30004: DEF_Childs - Editable and Read-only grids`
    // .disablePageReloads
    // .only
    // .skip
    .before(async (t) => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step('Creating data entry items with child records', async () => {
            for (const data of dataSet) {
                try {
                    const record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                    createdRecords.push(record);
                    data.recordId = record.respData.Record.MasterId.toString();
                    data.recordName = record.reqData.recordName;
                    const child = data.editableChildWithData;
                    const dataEntry = app.api.dataEntryForm;
                    await dataEntry.openRecord(Number(data.recordId), data.viewIn);
                    await dataEntry.openChild(data.editableChildWithData.name);
                    for (let i = 0; i < 5; i++) {
                        dataEntry.addChildRecord();
                        await dataEntry.setChildValue(child.filter.columnName, app.services.random.num().toString());
                        await dataEntry.setChildValue(child.requiredField.name, child.requiredField.value);
                        dataEntry.addChildRecord();
                        await dataEntry.setChildValue(child.filter.columnName, child.filter.value);
                        await dataEntry.setChildValue(child.requiredField.name, child.requiredField.value);
                    }
                    await dataEntry.openChild(data.actionsChild.name);
                    for (let i = 0; i < 5; i++) {
                        dataEntry.addChildRecord();
                        await dataEntry.setChildValue('Notes', app.services.random.num().toString());
                        await dataEntry.setChildValue(data.actionsChild.requiredField.name, data.actionsChild.requiredField.value);
                    }
                    await dataEntry.save();
                } catch (err) {}
            }
        });
        await app.step('Creating text files', async () => {
            app.services.os.createFile(filePath1, 'test');
            app.services.os.createFile(filePath2, 'test');
        });
    })
    .after(async (t) => {
        await app.step('Deleting created data entry records', async () => {
            try {
                const recordsToDelete = createdRecords.map((x) => {
                    return  x.respData ;
                });
                await app.api.login();
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete);
            } catch (err) {}
        });
        await app.step('Deleting the created text files', async () => {
            app.services.os.removeFilesInFolder(folder, [ fileName1, fileName2 ]);
        });
    });

const createdRecords = [];
const fileName1 = 'test1.txt';
const fileName2 = 'test2.txt';
const folder = `${process.env.USERPROFILE}\\Documents`;
const filePath1 = `${folder}\\${fileName1}`;
const filePath2 = `${folder}\\${fileName2}`;

const dataSet = (function() {
    const childTabWithControlsOfAllTypes = {
        name: 'Expenses',
        fieldForSave: {name: 'Amount', value: '100'},
        checkbox: { name: 'GENERICCHECKBOX1', value: 'check', value2: 'uncheck'},
        datepicker: { name: 'Miscellaneous Date', value: '11/10/2019', value2: '11/11/2019' },
        singleLine: { name: 'Invoice Number', value: app.services.random.num().toString(), value2: app.services.random.num().toString() },
        multiLine: { name: 'Text 1', value: 'Test Text', value2: 'Test Text2' },
        numericDecimal: { name: 'Percentage', value: (app.services.random.num(100, 1000) / 100).toString(), value2: app.services.random.num(11, 100).toString() },
        numericInt: { name: 'Tax Year', value: app.services.random.num(2000, 2015).toString(), value2: app.services.random.num(2016, 2030).toString() },
        numericMoney: { name: 'USA Amount', value: (app.services.random.num(100, 100000) / 100).toString(), value2: app.services.random.num(1000, 10000).toString() },
        linkedfile: { name: 'Linked File', valueToSet1: filePath1, valueToSet2: filePath2, expectedValue: fileName1 },
        systemField: { name: 'Update Date'}
    };
    const fullData = [
        {
            ipType: 'Patent',
            query: 'Patent>PA All Cases TA filter',
            recordId: '',
            recordName: '',
            viewIn: 'TA DEF for Patent',
            identifierName: 'PATENTMASTERID',
            readOnlyChildWithData: { name: 'Message Log', field: { name: 'PROCESSDATE' } },
            readOnlyChildWithNoData: 'Message Log Archive',
            editableChildWithData: { name: 'Text', filter: { columnName: 'Text', method: 'Equal', value: 'Filtered Value' },
                requiredField: { name: 'Text Type', value: 'Description - (DS)'}},
            editableChildWithNoData: 'Other Numbers',
            childWithAllControls: {
                combobox: { name: 'Expense', value: 'Credit Note - (CDN)', value2: 'Debit Note - (DBN)'},
                hierarchy: { name: 'Payto Code', value: 'Pay To Code - (PPT)', value2: 'Payto - (ptcp1)'},
                largeList: { name: 'Division', value: 'Chemical Division - (CD)', value2: 'Acme Propellants - (ACME-1)'},
                ...childTabWithControlsOfAllTypes },
            actionsChild: { name: 'Actions',
                requiredField: { name: 'Action', value: 'Change of the name - (CHAN)'} },
            filingSectionField: { name: 'Application Number', value: app.services.random.num().toString() },
            fieldsForRules: [{ name: 'Status', value: 'Granted - (G)' }],
            brief: 'true'
        },
        {
            ipType: 'Trademark',
            query: 'Trademark>TM All Cases TA filter',
            recordId: '',
            recordName: '',
            viewIn: 'TA DEF for Trademark',
            identifierName: 'TRADEMARKMASTERID',
            readOnlyChildWithData: { name: 'Message Log', field: { name: 'PROCESSDATE' } },
            readOnlyChildWithNoData: 'Message Log Archive',
            editableChildWithData: { name: 'Text', filter: { columnName: 'Text', method: 'Equal', value: 'Filtered Value' },
                requiredField: { name: 'Text Type', value: 'Remark - (RM)'}},
            editableChildWithNoData: 'Other Numbers',
            childWithAllControls: {
                combobox: { name: 'Expense', value: 'Legal Services - (LGL)', value2: 'Renewal Fees - (RNL)'},
                hierarchy: { name: 'Payto Code', value: 'Payto - (PYT)', value2: 'Party PAY - (PTCML)'},
                largeList: { name: 'Division', value: 'CLT Party - 1002 - (CLT Party - 1002)', value2: 'CLT Party - 1004 - (CLT Party - 1004)'},
                ...childTabWithControlsOfAllTypes },
            actionsChild: { name: 'Actions',
                requiredField: { name: 'Action', value: 'Abandoned - (ABN)'} },
            filingSectionField: { name: 'Filing Number', value: app.services.random.num().toString() },
            fieldsForRules: [{ name: 'Status', value: 'Registered - (G)' }],
            brief: 'false'
        },
        {
            ipType: 'Disclosure',
            query: 'Disclosure>DS All Cases TA filter',
            recordId: '',
            recordName: '',
            viewIn: 'TA DEF for Disclosure',
            identifierName: 'DISCLOSUREMASTERID',
            readOnlyChildWithData: { name: 'Message Log', field: { name: 'PROCESSDATE' } },
            readOnlyChildWithNoData: 'Message Log Archive',
            editableChildWithData: { name: 'Text', filter: { columnName: 'Text', method: 'Equal', value: 'Filtered Value' },
                requiredField: { name: 'Text Type', value: 'Description - (DS)'} },
            editableChildWithNoData: 'Other Numbers',
            childWithAllControls: {
                combobox: { name: 'Expense', value: 'Credit Note - (CDN)', value2: 'Manual Payment - (MNP)'},
                hierarchy: { name: 'Payto Code', value: 'Payto - (ptcp1)', value2: 'Pay To Code - (PPT)'},
                largeList: { name: 'Division', value: 'ABC Corporation - (ABCC-1)', value2: 'Banner Electronics - (BAN-1)'},
                ...childTabWithControlsOfAllTypes },
            actionsChild: { name: 'Actions',
                requiredField: { name: 'Action', value: 'Abstract Due - (ABSD)'} },
            filingSectionField: { name: 'Custom Text #3', value: app.services.random.num().toString() },
            fieldsForRules: [ { name: 'Status', value: 'New submission - (NEW)'},
                { name: 'Initial Disclosure', value: '11/11/2019' }],
            brief: 'false'
        },
        {
            ipType: 'GeneralIP',
            query: 'GeneralIP1>GIP1 All Cases TA filter',
            recordId: '',
            recordName: '',
            viewIn: 'TA DEF for GeneralIP1',
            identifierName: 'GENERALIP1MASTERID',
            readOnlyChildWithData: { name: 'Message Log', field: { name: 'PROCESSDATE' } },
            readOnlyChildWithNoData: 'Message Log Archive',
            editableChildWithData: { name: 'Text', filter: { columnName: 'Text', method: 'Equal', value: 'Filtered Value' },
                requiredField: { name: 'Text Type', value: 'Notification - (NTC)'} },
            editableChildWithNoData: 'Other Numbers',
            childWithAllControls: {
                combobox: { name: 'Expense', value: 'Lease - (LSE)', value2: 'Legal Fees - (LGL)'},
                hierarchy: { name: 'Payto Code', value: 'Pay To Code - (GPT)', value2: 'Payto - (payti)'},
                largeList: { name: 'Division', value: 'Acme Propellants - (ACME-1)', value2: 'Chemical Division - (CD)'},
                ...childTabWithControlsOfAllTypes },
            actionsChild: { name: 'Actions',
                requiredField: { name: 'Action', value: 'Defensive - (DEF)' } },
            filingSectionField: { name: 'Custom Text #2', value: app.services.random.num().toString() },
            fieldsForRules: [ { name: 'Jurisdiction', value: 'GB - (Great Britain)'},
                { name: 'Relationship', value: 'Renewal - (RNW)' },
                { name: 'Agreement Type', value: 'General Agreement - (GEN)' }],
            brief: 'false'
        }
    ];
    return fullData;
})();

dataSet.forEach((data) => {
    test
        // .only
        // .skip
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Add records in the Message Log child (API)', async () => {
                try {
                    await app.api.changeValuesForRecord(Number(data.recordId), data.viewIn, data.fieldsForRules, true);
                } catch (err) {}
            });
        })
        (`Verification of read-only and editable child tabs (${data.ipType} - Steps 1-6)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify read-only child tab with records', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.readOnlyChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await record.isFieldReadOnly(data.readOnlyChildWithData.field.name)).ok()
                    .expect(await child.isPresent('addNewButton')).notOk()
                    .expect(await child.isPresent('deleteRowButton')).notOk()
                    .expect(await child.isPresent('emailButton')).notOk()
                    .expect(await child.isPresent('resetButton')).notOk()
                    .expect(await child.isVisible('cross')).ok()
                    .expect(await child.getTotalCount()).eql(await child.grid.getRecordsCount())
                    .expect(await child.grid.isVisible('filterRow')).ok()
                    .expect((await child.grid.getColumnsNamesArray()).length).gt(0)
                    .expect(await child.grid.getRecordsCount()).gt(0)
                    .expect(await child.grid.isPresent('kendoPager')).notOk();
            });
            await app.step('Verify read-only child tab without records', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.readOnlyChildWithNoData);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.grid.isVisible('noRecordsGrid')).ok()
                    .expect(await child.grid.getText('noRecordsGrid')).eql('No records available.')
                    .expect(await child.getTotalCount()).eql(0)
                    .expect(await child.grid.isPresent('kendoPager')).notOk();
            });
            await app.step('Verify editable child tab with records', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.isVisible('addNewButton')).ok()
                    .expect(await child.isEnabled('addNewButton')).ok()
                    .expect(await child.isVisible('resetButton')).ok()
                    .expect(await child.isEnabled('resetButton')).notOk()
                    .expect(await child.isVisible('deleteRowButton')).ok()
                    .expect(await child.isEnabled('deleteRowButton')).notOk()
                    .expect(await child.getTotalCount()).eql(await child.grid.getRecordsCount())
                    .expect(await child.isVisible('cross')).ok()
                    .expect(await child.grid.isVisible('filterRow')).ok()
                    .expect((await child.grid.getColumnsNamesArray()).length).gt(0)
                    .expect(await child.grid.getRecordsCount()).gt(0)
                    .expect(await child.grid.isVisible('selectAllCheckbox')).ok()
                    .expect(await child.grid.isPresent('kendoPager')).notOk();
            });
            await app.step('Verify the Action child tab', async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.isVisible('emailButton')).ok()
                    .expect(await child.isEnabled('emailButton')).notOk();
            });
            await app.step('Verify editable child tab without records', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithNoData);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.grid.isVisible('noRecordsGrid')).ok()
                    .expect(await child.grid.getText('noRecordsGrid')).eql('No records available.')
                    .expect(await child.getTotalCount()).eql(0)
                    .expect(await child.grid.isPresent('kendoPager')).notOk();
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify functionality for Adding records in child tab (${data.ipType} - Steps 7-9)`, async (t) => {
            let recordsCountBefore;
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Hover over the button', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await child.hover('addNewButton');
                await t
                    .expect(await app.ui.kendoPopup.isPresent()).notOk()
                    .expect(await child.isVisible('addNewButton')).ok()
                    .expect(await child.isEnabled('addNewButton')).ok()
                    .expect(await child.isVisible('resetButton')).ok()
                    .expect(await child.isEnabled('resetButton')).notOk()
                    .expect(await child.isVisible('deleteRowButton')).ok()
                    .expect(await child.isEnabled('deleteRowButton')).notOk();
            });
            await app.step('Add new row and reopen child tab', async () => {
                let child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                await t
                    .expect(await child.isEnabled('addNewButton')).ok()
                    .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await child.grid.isPresent('noRecordsGrid')).notOk()
                    .expect(await child.grid.getRecordsCount()).eql(1)
                    .expect(await child.getTotalCount()).eql(1);
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithAllControls.combobox.name, 'autocomplete', {isTextExact: true}).fill(data.childWithAllControls.combobox.value);
                await record.getField(data.childWithAllControls.singleLine.name, 'input').fill(data.childWithAllControls.singleLine.value);
                await record.getField(data.childWithAllControls.multiLine.name, 'input').fill(data.childWithAllControls.multiLine.value);
                await child.click('cross');
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
                await app.ui.waitLoading({checkErrors: true});
                child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.isEnabled('addNewButton')).ok()
                    .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await child.grid.getRecordsCount()).eql(1)
                    .expect(await child.getTotalCount()).eql(1)
                    .expect(await record.getValue(data.childWithAllControls.combobox.name, {isTextExact: true})).eql(data.childWithAllControls.combobox.value)
                    .expect(await record.getValue(data.childWithAllControls.singleLine.name)).eql(data.childWithAllControls.singleLine.value)
                    .expect(await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql(data.childWithAllControls.multiLine.value);
            });
            await app.step('Add a new row and fill it with values', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                recordsCountBefore = await child.grid.getRecordsCount();
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithAllControls.combobox.name, 'autocomplete', {isTextExact: true}).fill(data.childWithAllControls.combobox.value);
                await record.getField(data.childWithAllControls.singleLine.name, 'input').fill(data.childWithAllControls.singleLine.value);
                await record.getField(data.childWithAllControls.multiLine.name, 'input').fill(data.childWithAllControls.multiLine.value);
            });
            await app.step('Save values and refresh page', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore + 1)
                    .expect(await record.getValue(data.childWithAllControls.combobox.name, {isTextExact: true})).eql(data.childWithAllControls.combobox.value)
                    .expect(await record.getValue(data.childWithAllControls.singleLine.name)).eql(data.childWithAllControls.singleLine.value)
                    .expect(await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql(data.childWithAllControls.multiLine.value);
            });
            await app.step('Change values in child record and add a new row', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithAllControls.combobox.name, 'autocomplete', {isTextExact: true}).fill(data.childWithAllControls.combobox.value2);
                await record.getField(data.childWithAllControls.singleLine.name, 'input').fill(data.childWithAllControls.singleLine.value2);
                await record.getField(data.childWithAllControls.multiLine.name, 'input').fill(data.childWithAllControls.multiLine.value2);
                await t
                    .expect(await record.getValue(data.childWithAllControls.combobox.name, {isTextExact: true})).eql(data.childWithAllControls.combobox.value2)
                    .expect(await record.getValue(data.childWithAllControls.singleLine.name)).eql(data.childWithAllControls.singleLine.value2)
                    .expect(await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql(data.childWithAllControls.multiLine.value2);
                await child.addNew();
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore + 2)
                    .expect(await record.getValue(data.childWithAllControls.combobox.name, {isTextExact: true})).eql('')
                    .expect(await record.getValue(data.childWithAllControls.singleLine.name)).eql('')
                    .expect(await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql('')
                    .expect(await record.isFieldReadOnly(data.childWithAllControls.systemField.name)).ok();
            });
            await app.step('Add new records and save without filling them in', async () => {
                await app.ui.dataEntryBoard.reset();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                const child = app.ui.dataEntryBoard.childRecord;
                const recordsCount = await child.grid.getRecordsCount();
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await record.getValue(data.childWithAllControls.combobox.name, {isTextExact: true})).eql('')
                    .expect(await record.getValue(data.childWithAllControls.singleLine.name)).eql('')
                    .expect(await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql('');
                await child.addNew();
                await child.addNew();
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCount);
            });
        })
        .after(async () => {
            await app.step('Remove all created records in child tabs (API)', async () => {
                try {
                    await app.api.removeAllChildRecords(Number(data.recordId), data.viewIn, data.childWithAllControls.name);
                } catch (err) {}
            });
        });
    });

dataSet.forEach((data) => {
    test
        .requestHooks(app.ui.requestLogger.simple)
        // .only
        .meta('brief', data.brief)
        (`Verify Reset functionality on child tab (${data.ipType} - Steps 13-15, 17)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                app.ui.setCookie();
                await app.api.userPreferences.resetUserPreferences([{property: 'ActionsCompletedDateFilter', value: true}]);
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify tooltip of the Reset button', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.childRecord.hover('resetButton');
                await t
                    .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Reset changes');
            });
            await app.step('Verify confirmation message after reset', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordsCountBefore = await child.grid.getRecordsCount();
                await child.addNew();
                await child.resetChanges();
                await t
                    .expect(await app.ui.confirmationModal.isVisible()).ok()
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                    .eql('You have unsaved changes. Are you sure you want to continue?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('cross')).ok();
                await app.ui.confirmationModal.click('buttons', 'Cancel');
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore + 1);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore)
                    .expect(await child.isEnabled('resetButton')).notOk();
            });
            await app.step('Change child table headers and filter and reset', async () => {
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const defaultFilteredColumns = await child.grid.getFilteredColumns();
                const defaultSortedColumn = await child.grid.getSortedColumn();
                await child.grid.dragColumn('Action', 'Completed Date');
                await child.grid.resizeColumn('Action', 100);
                await child.grid.removeFilter('Completed Date');
                await child.grid.openFilter('Taken Date');
                await app.ui.kendoPopup.getFilter('input').apply('Is Null');
                await child.grid.clickHeader('Notes');
                const columnWidthBeforeReset = await child.grid.getColumnWidth('Action');
                const columnArrayBeforeReset = await child.grid.getColumnsNamesArray();
                const record = await child.grid.getRecord(0);
                await record.getField('Notes', 'input').fill(app.services.random.num().toString());
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                const filteredColumnsAfterReset = await child.grid.getFilteredColumns();
                const sortedColumnAfterReset = await child.grid.getSortedColumn();
                const columnWidthAfterReset = await child.grid.getColumnWidth('Action');
                const columnArrayAfterReset = await child.grid.getColumnsNamesArray();
                await t
                    .expect(filteredColumnsAfterReset).eql(defaultFilteredColumns)
                    .expect(sortedColumnAfterReset).eql(defaultSortedColumn)
                    .expect(columnArrayAfterReset).eql(columnArrayBeforeReset)
                    .expect(columnWidthAfterReset).eql(columnWidthBeforeReset);
            });
            await app.step('Make changes in 2 child table and reset', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const value = app.services.random.num().toString();
                const record1 = await child.grid.getRecord(0);
                await record1.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).fill(value);
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
                await app.ui.waitLoading({checkErrors: true});
                const recordsCountBefore = await child.grid.getRecordsCount();
                await child.addNew();
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore);
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await record1.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue()).eql(value);
            });
            await app.step('Make changes in a child table and filing section and reset', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
                await app.ui.waitLoading({checkErrors: true});
                const value = app.services.random.num().toString();
                const child = app.ui.dataEntryBoard.childRecord;
                const recordsCountBefore = await child.grid.getRecordsCount();
                await child.addNew();
                await app.ui.dataEntryBoard.getField(data.filingSectionField.name, 'input').fill(value);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore)
                    .expect(await app.ui.dataEntryBoard.getField(data.filingSectionField.name, 'input').getValue()).eql(value);
            });
        })
        .after(async () => {
            await app.step('Reset user references to default (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        (`Verify Reset functionality for added/deleted/changed records (${data.ipType} - Step 16)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                app.ui.setCookie();
                await app.api.userPreferences.resetUserPreferences([{property: 'ActionsCompletedDateFilter', value: true}]);
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Add one record to a child table and reset', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const recordsCountBefore = await child.grid.getRecordsCount();
                await child.addNew();
                await t
                    .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore + 1);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore);
            });
            await app.step('Add several new records to a child table and reset', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordsCountBefore = await child.grid.getRecordsCount();
                await child.addNew();
                await child.addNew();
                await t
                .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore + 2);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore);
            });
            await app.step('Delete one row in a child table and reset', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordsCountBefore = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.delete();
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore - 1);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore);
            });
            await app.step('Delete several rows in a child table and reset', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordsCountBefore = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.grid.getCheckbox(1).check();
                await child.delete();
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore - 2);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore);
            });
            await app.step('Delete all rows in a child table and reset', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordsCountBefore = await child.grid.getRecordsCount();
                await child.grid.selectAllRecords();
                await child.delete();
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await child.grid.getRecordsCount()).eql(0);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBefore);
            });
            await app.step('Edit one records in a child table and reset', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                const valueBefore = await record.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue();
                const field = await record.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true});
                const randomValue = app.services.random.num().toString();
                await field.fill(randomValue);
                await t
                    .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await record.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue()).eql(randomValue);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await record.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue()).eql(valueBefore);
            });
            await app.step('Edit several records in a child table and reset', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record1 = await child.grid.getRecord(0);
                const record2 = await child.grid.getRecord(1);
                const valueBefore1 = await record1.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue();
                const valueBefore2 = await record2.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue();
                const randomValue1 = app.services.random.num().toString();
                const randomValue2 = app.services.random.num().toString();
                await record1.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).fill(randomValue1);
                await record2.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).fill(randomValue2);
                await t
                    .expect(await record1.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue()).eql(randomValue1)
                    .expect(await record2.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue()).eql(randomValue2);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await record1.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue()).eql(valueBefore1)
                    .expect(await record2.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue()).eql(valueBefore2);
            });
            await app.step('Edit all records in a child table and reset', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.pressKey('esc');
                const firstColumnValuesBefore = await child.grid.getColumnValues(data.editableChildWithData.filter.columnName);
                const count = await child.grid.getRecordsCount();
                for (let i = 0; i < count; i++ ) {
                    const record = await child.grid.getRecord(i);
                    await record.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: {isTextExact: true}}).fill(app.services.random.num().toString());
                }
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await child.pressKey('esc');
                const firstColumnValuesAfter = await child.grid.getColumnValues(data.editableChildWithData.filter.columnName);
                await t
                    .expect(firstColumnValuesAfter).eql(firstColumnValuesBefore);
            });
            await app.step('Set values in empty fields of all types and reset', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithAllControls.fieldForSave.name, 'input').fill(data.childWithAllControls.fieldForSave.value);
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await record.getField(data.childWithAllControls.combobox.name, 'autocomplete', {isTextExact: true}).fill(data.childWithAllControls.combobox.value);
                await record.getField(data.childWithAllControls.largeList.name, 'autocomplete').fill(data.childWithAllControls.largeList.value);
                await record.getField(data.childWithAllControls.singleLine.name, 'input').fill(data.childWithAllControls.singleLine.value);
                await record.getField(data.childWithAllControls.multiLine.name, 'input').fill(data.childWithAllControls.multiLine.value);
                await record.getField(data.childWithAllControls.hierarchy.name, 'hierarchy').fill(data.childWithAllControls.hierarchy.value);
                await record.getField(data.childWithAllControls.numericInt.name, 'numeric').fill(data.childWithAllControls.numericInt.value);
                await record.getField(data.childWithAllControls.numericDecimal.name, 'numeric').fill(data.childWithAllControls.numericDecimal.value);
                await record.getField(data.childWithAllControls.numericMoney.name, 'numeric').fill(data.childWithAllControls.numericMoney.value);
                await record.getField(data.childWithAllControls.datepicker.name, 'datepicker').fill(data.childWithAllControls.datepicker.value);
                await record.getField(data.childWithAllControls.checkbox.name, 'checkbox').fill(data.childWithAllControls.checkbox.value);
                await record.getField(data.childWithAllControls.linkedfile.name, 'linkedfile').fill(data.childWithAllControls.linkedfile.valueToSet1);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await await record.getValue(data.childWithAllControls.combobox.name, {isTextExact: true})).eql('')
                    .expect(await await record.getValue(data.childWithAllControls.largeList.name)).eql('')
                    .expect(await await record.getValue(data.childWithAllControls.singleLine.name)).eql('')
                    .expect(await await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql('')
                    .expect(await await record.getValue(data.childWithAllControls.hierarchy.name)).eql('')
                    .expect(await await record.getValue(data.childWithAllControls.numericDecimal.name)).eql('')
                    .expect(await await record.getValue(data.childWithAllControls.numericInt.name)).eql('')
                    .expect(await await record.getValue(data.childWithAllControls.numericMoney.name)).eql('')
                    .expect(await await record.getValue(data.childWithAllControls.datepicker.name)).eql('')
                    .expect(await await record.getField(data.childWithAllControls.checkbox.name, 'checkbox').getValue()).eql('uncheck')
                    .expect(await await record.getField(data.childWithAllControls.linkedfile.name, 'linkedfile').getValue()).eql('');
            });
            await app.step('Set values in filled fields of all types and reset', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithAllControls.combobox.name, 'autocomplete', {isTextExact: true}).fill(data.childWithAllControls.combobox.value);
                await record.getField(data.childWithAllControls.largeList.name, 'autocomplete').fill(data.childWithAllControls.largeList.value);
                await record.getField(data.childWithAllControls.singleLine.name, 'input').fill(data.childWithAllControls.singleLine.value);
                await record.getField(data.childWithAllControls.multiLine.name, 'input').fill(data.childWithAllControls.multiLine.value);
                await record.getField(data.childWithAllControls.hierarchy.name, 'hierarchy').fill(data.childWithAllControls.hierarchy.value);
                await record.getField(data.childWithAllControls.numericDecimal.name, 'numeric').fill(data.childWithAllControls.numericDecimal.value);
                await record.getField(data.childWithAllControls.numericInt.name, 'numeric').fill(data.childWithAllControls.numericInt.value);
                await record.getField(data.childWithAllControls.numericMoney.name, 'numeric').fill(data.childWithAllControls.numericMoney.value);
                await record.getField(data.childWithAllControls.datepicker.name, 'datepicker').fill(data.childWithAllControls.datepicker.value);
                await record.getField(data.childWithAllControls.checkbox.name, 'checkbox').fill(data.childWithAllControls.checkbox.value);
                await record.getField(data.childWithAllControls.linkedfile.name, 'linkedfile').fill(data.childWithAllControls.linkedfile.valueToSet1);
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await record.getField(data.childWithAllControls.combobox.name, 'autocomplete', {isTextExact: true}).fill(data.childWithAllControls.combobox.value2);
                await record.getField(data.childWithAllControls.largeList.name, 'autocomplete').fill(data.childWithAllControls.largeList.value2);
                await record.getField(data.childWithAllControls.singleLine.name, 'input').fill(data.childWithAllControls.singleLine.value2);
                await record.getField(data.childWithAllControls.multiLine.name, 'input').fill(data.childWithAllControls.multiLine.value2);
                await record.getField(data.childWithAllControls.hierarchy.name, 'hierarchy').fill(data.childWithAllControls.hierarchy.value2);
                await record.getField(data.childWithAllControls.numericDecimal.name, 'numeric').fill(data.childWithAllControls.numericDecimal.value2);
                await record.getField(data.childWithAllControls.numericInt.name, 'numeric').fill(data.childWithAllControls.numericInt.value2);
                await record.getField(data.childWithAllControls.numericMoney.name, 'numeric').fill(data.childWithAllControls.numericMoney.value2);
                await record.getField(data.childWithAllControls.datepicker.name, 'datepicker').fill(data.childWithAllControls.datepicker.value2);
                await record.getField(data.childWithAllControls.checkbox.name, 'checkbox').fill(data.childWithAllControls.checkbox.value2);
                await record.getField(data.childWithAllControls.linkedfile.name, 'linkedfile').fill(data.childWithAllControls.linkedfile.valueToSet1);
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await await record.getValue(data.childWithAllControls.combobox.name, {isTextExact: true})).eql(data.childWithAllControls.combobox.value)
                    .expect(await await record.getValue(data.childWithAllControls.largeList.name)).eql(data.childWithAllControls.largeList.value)
                    .expect(await await record.getValue(data.childWithAllControls.singleLine.name)).eql(data.childWithAllControls.singleLine.value)
                    .expect(await await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql(data.childWithAllControls.multiLine.value)
                    .expect(await await record.getValue(data.childWithAllControls.hierarchy.name)).eql(data.childWithAllControls.hierarchy.value)
                    .expect(await await record.getValue(data.childWithAllControls.numericDecimal.name)).eql(data.childWithAllControls.numericDecimal.value)
                    .expect(await await record.getValue(data.childWithAllControls.numericInt.name)).eql(data.childWithAllControls.numericInt.value)
                    .expect(await await record.getValue(data.childWithAllControls.numericMoney.name)).eql(data.childWithAllControls.numericMoney.value)
                    .expect(await await record.getValue(data.childWithAllControls.datepicker.name)).eql(data.childWithAllControls.datepicker.value)
                    .expect(await await record.getField(data.childWithAllControls.checkbox.name, 'checkbox').getValue()).eql(data.childWithAllControls.checkbox.value)
                    .expect(await await record.getField(data.childWithAllControls.linkedfile.name, 'linkedfile').getValue()).eql(data.childWithAllControls.linkedfile.expectedValue);
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify Email button in Action child tab (${data.ipType} - Step 18)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify tooltip of the Email button', async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await child.hover('emailButton');
                await t
                    .expect(await app.ui.kendoPopup.isPresent()).notOk();
            });
            await app.step('Select 1 row and verify menu buttons', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.getCheckbox(0).check();
                await t
                    .expect(await child.isEnabled('resetButton')).notOk()
                    .expect(await child.isEnabled('deleteRowButton')).ok()
                    .expect(await child.isEnabled('emailButton')).ok()
                    .expect(await child.isEnabled('addNewButton')).ok();
            });
            await app.step('Select several rows and verify menu buttons', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.getCheckbox(0).check();
                await child.grid.getCheckbox(1).check();
                await t
                    .expect(await child.isEnabled('resetButton')).notOk()
                    .expect(await child.isEnabled('deleteRowButton')).ok()
                    .expect(await child.isEnabled('emailButton')).ok()
                    .expect(await child.isEnabled('addNewButton')).ok();
            });
            await app.step('Select all rows and verify menu buttons', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.selectAllRecords();
                await t
                    .expect(await child.isEnabled('resetButton')).notOk()
                    .expect(await child.isEnabled('deleteRowButton')).ok()
                    .expect(await child.isEnabled('emailButton')).ok()
                    .expect(await child.isEnabled('addNewButton')).ok();
            });
            await app.step('Edit record, select it and verify the Email button', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.deselectAllRecords();
                const record = await child.grid.getRecord(0);
                await t.click(record.getCell('Completed Date'));
                await record.getField('Completed Date', 'datepicker').fill('today');
                await child.grid.getCheckbox(0).check();
                await t
                    .expect(await child.isEnabled('emailButton')).notOk();
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify the Delete functionality in child tab of Data Entry Form (${data.ipType} - Steps 10-12)`, async (t) => {
            let recordsCountBeforeDelete;
            let recordsCountAfterDelete;
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Hover over the button', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await child.hover('deleteRowButton');
                await t
                    .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Delete row'); /* Bug: https://jira.***.com/browse/IPDP-8827 Should be "Delete selected row"*/
            });
            await app.step('Select record in grid', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.getCheckbox(0).check();
                await t
                    .expect(await child.isEnabled('resetButton')).notOk()
                    .expect(await child.isEnabled('deleteRowButton')).ok();
            });
            await app.step('Deselect record in grid', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.getCheckbox(0).uncheck();
                await t
                    .expect(await child.isEnabled('resetButton')).notOk()
                    .expect(await child.isEnabled('deleteRowButton')).notOk();
            });
            await app.step('Select and delete some records', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                recordsCountBeforeDelete = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.grid.getCheckbox(1).check();
                await child.click('deleteRowButton');
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await child.isVisible('addNewButton')).ok()
                    .expect(await child.isEnabled('addNewButton')).ok()
                    .expect(await child.isVisible('resetButton')).ok()
                    .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await child.isVisible('deleteRowButton')).ok()
                    .expect(await child.isEnabled('deleteRowButton')).notOk();
            });
            await app.step('Close and reopen child tab', async () => {
                let child = app.ui.dataEntryBoard.childRecord;
                recordsCountAfterDelete = await child.grid.getRecordsCount();
                await child.click('cross');
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountAfterDelete)
                    .expect(await child.isEnabled('addNewButton')).ok()
                    .expect(await child.isEnabled('resetButton')).ok()
                    .expect(await child.isEnabled('deleteRowButton')).notOk();
            });
            await app.step('Refresh tab and reopen child', async () => {
                await t.setNativeDialogHandler(() => true);
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.grid.getRecordsCount()).eql(recordsCountBeforeDelete);
            });
            await app.step('Verify Confirmation Modal', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                recordsCountBeforeDelete = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.click('deleteRowButton');
                await t
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to delete the selected row(s)?')
                    .expect(await app.ui.confirmationModal.isVisible('cross')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'No')).ok();
                await app.ui.confirmationModal.click('cross');
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBeforeDelete)
                    .expect(await child.grid.getCheckbox(0).isChecked()).ok()
                    .expect(await child.isEnabled('deleteRowButton')).ok();
                await child.click('deleteRowButton');
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCountBeforeDelete - 1)
                    .expect(await child.getTotalCount()).eql(recordsCountBeforeDelete - 1);
            });
            await app.step('Delete one row on the child tab and save the record', async () => {
                let child = app.ui.dataEntryBoard.childRecord;
                const recordsCount = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.click('deleteRowButton');
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await app.ui.dataEntryBoard.save();
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCount - 1);
            });
            await app.step('Delete several rows on the child tab and save the record', async () => {
                let child = app.ui.dataEntryBoard.childRecord;
                const recordsCount = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.grid.getCheckbox(1).check();
                await child.click('deleteRowButton');
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await app.ui.dataEntryBoard.save();
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCount - 2);
            });
            await app.step('Delete filtered records on the child tab and save the record', async () => {
                let child = app.ui.dataEntryBoard.childRecord;
                const recordCount = await child.grid.getRecordsCount();
                let columnValues = await child.grid.getColumnValues(data.editableChildWithData.filter.columnName);
                const filteredRecordCount = columnValues.filter((x) => x === data.editableChildWithData.filter.value).length;
                await child.grid.openFilter(data.editableChildWithData.filter.columnName);
                await app.ui.kendoPopup.getFilter('input').apply(data.editableChildWithData.filter.method, data.editableChildWithData.filter.value);
                await app.ui.waitLoading({checkErrors: true});
                await child.grid.selectAllRecords();
                await child.click('deleteRowButton');
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                child = app.ui.dataEntryBoard.childRecord;
                columnValues = await child.grid.getColumnValues(data.editableChildWithData.filter.columnName);
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCount - filteredRecordCount)
                    .expect(columnValues.some((x) => x === data.editableChildWithData.filter.value)).notOk();
            });
            await app.step('Delete all rows on the child tab and save the record', async () => {
                let child = app.ui.dataEntryBoard.childRecord;
                await child.grid.selectAllRecords();
                await child.click('deleteRowButton');
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
                await app.ui.waitLoading({checkErrors: true});
                child = app.ui.dataEntryBoard.childRecord;
                await t
                    .expect(await child.grid.getRecordsCount()).eql(0);
            });
        });
    });

const data = {
    ipType: 'Trademark',
    viewIn: 'TA DEF for Trademark',
    readOnlyChildWithNoData: 'Message Log Archive',
    editableChildWithData: { name: 'Text', filter: { columnName: 'Text', method: 'Equal', value: 'Filtered Value' },
        requiredFields: [ { name: 'Text Type', value: 'Remark - (RM)'}] },
    editableChildWithNoData: 'Other Numbers',
    childWithAllControls: {
        name: 'Expenses',
        singleLine: { name: 'Invoice Number', value: app.services.random.num().toString(), value2: app.services.random.num().toString() },
        multiLine: { name: 'Text 1', value: 'Test Text', value2: 'Test Text2' },
        systemField: { name: 'Update Date'},
        combobox: { name: 'Expense', value: 'Legal Services - (LGL)', value2: 'Renewal Fees - (RNL)'}
    },
    filingSectionField: { name: 'Filing Number', value: app.services.random.num().toString() }
};

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verification of read-only and editable child tabs on a New DEF (${data.ipType} - Steps 2,4,6,18)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Open a new ${data.ipType} DEF`, async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem(data.viewIn);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify read-only child tab without records', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.readOnlyChildWithNoData);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            await t
                .expect(await child.grid.isVisible('noRecordsGrid')).ok()
                .expect(await child.grid.getText('noRecordsGrid')).eql('No records available.')
                .expect(await child.getTotalCount()).eql(0);
        });
        await app.step('Verify editable child tab without records', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithNoData);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            await t
                .expect(await child.grid.isVisible('noRecordsGrid')).ok()
                .expect(await child.grid.getText('noRecordsGrid')).eql('No records available.')
                .expect(await child.getTotalCount()).eql(0)
                .expect(await child.isVisible('addNewButton')).ok()
                .expect(await child.isEnabled('addNewButton')).ok()
                .expect(await child.isVisible('resetButton')).ok()
                .expect(await child.isEnabled('resetButton')).notOk()
                .expect(await child.isVisible('deleteRowButton')).ok()
                .expect(await child.isEnabled('deleteRowButton')).notOk();
        });
        await app.step('Verify `Email` button on the Action child tab', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Actions');
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            await t
                .expect(await child.isVisible('emailButton')).ok()
                .expect(await child.isEnabled('emailButton')).notOk();
            await child.hover('emailButton');
            await t
                .expect(await app.ui.kendoPopup.isPresent()).notOk();
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify functionality for Adding records in child tab on a New DEF (${data.ipType} - Steps 7-8)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Open a new ${data.ipType} DEF`, async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem(data.viewIn);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Hover over the button', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            await t
                .expect(await child.isVisible('addNewButton')).ok()
                .expect(await child.isEnabled('addNewButton')).ok();
            await child.hover('addNewButton');
            await t
                .expect(await app.ui.kendoPopup.isPresent()).notOk();
        });
        await app.step('Add a new row and verify it is retained on reopening the child tab', async () => {
            let child = app.ui.dataEntryBoard.childRecord;
            await child.addNew();
            await t
                .expect(await child.isEnabled('addNewButton')).ok()
                .expect(await child.isEnabled('resetButton')).ok()
                .expect(await child.grid.isPresent('noRecordsGrid')).notOk()
                .expect(await child.grid.getRecordsCount()).eql(1)
                .expect(await child.getTotalCount()).eql(1);
            const record = await child.grid.getRecord(0);
            await record.getField(data.childWithAllControls.combobox.name).fill(data.childWithAllControls.combobox.value);
            await record.getField(data.childWithAllControls.singleLine.name, 'input').fill(data.childWithAllControls.singleLine.value);
            await record.getField(data.childWithAllControls.multiLine.name, 'input').fill(data.childWithAllControls.multiLine.value);
            await child.click('cross');
            await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
            await app.ui.waitLoading({checkErrors: true});
            child = app.ui.dataEntryBoard.childRecord;
            await t
                .expect(await child.isEnabled('addNewButton')).ok()
                .expect(await child.isEnabled('resetButton')).ok()
                .expect(await child.grid.getRecordsCount()).eql(1)
                .expect(await child.getTotalCount()).eql(1)
                .expect(await record.getValue(data.childWithAllControls.combobox.name)).eql(data.childWithAllControls.combobox.value)
                .expect(await record.getValue(data.childWithAllControls.singleLine.name)).eql(data.childWithAllControls.singleLine.value)
                .expect(await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql(data.childWithAllControls.multiLine.value);
        });
        await app.step('Edit values in child tab record, and verify system field is not editable', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await record.getField(data.childWithAllControls.combobox.name, 'dropdown').fill(data.childWithAllControls.combobox.value2);
            await record.getField(data.childWithAllControls.singleLine.name, 'input').fill(data.childWithAllControls.singleLine.value2);
            await record.getField(data.childWithAllControls.multiLine.name, 'input').fill(data.childWithAllControls.multiLine.value2);
            await t
                .expect(await record.getValue(data.childWithAllControls.combobox.name)).eql(data.childWithAllControls.combobox.value2)
                .expect(await record.getValue(data.childWithAllControls.singleLine.name)).eql(data.childWithAllControls.singleLine.value2)
                .expect(await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql(data.childWithAllControls.multiLine.value2)
                .expect(await record.isFieldReadOnly(data.childWithAllControls.systemField.name)).ok();
        });
        await app.step('Verify new row is added at the top of the grid', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await child.addNew();
            await t
                .expect(await child.grid.getRecordsCount()).eql(2)
                .expect(await record.getValue(data.childWithAllControls.combobox.name)).eql('')
                .expect(await record.getValue(data.childWithAllControls.singleLine.name)).eql('')
                .expect(await record.getField(data.childWithAllControls.multiLine.name, 'input').getValue()).eql('');
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Verify Reset functionality on child tab of a New DEF (${data.ipType} - Steps 13-14, 17)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            app.ui.setCookie();
            await app.api.userPreferences.resetUserPreferences([{property: 'ActionsCompletedDateFilter', value: true}]);
        });
        await app.step(`Open a new ${data.ipType} DEF`, async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem(data.viewIn);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify tooltip of the Reset button', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.hover('resetButton');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Reset changes');
        });
        await app.step('Verify confirmation modal after reset', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            await child.addNew();
            await child.resetChanges();
            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                .eql('You have unsaved changes. Are you sure you want to continue?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                .expect(await app.ui.confirmationModal.isVisible('cross')).ok();
            await app.ui.confirmationModal.click('buttons', 'Cancel');
            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await child.grid.getRecordsCount()).eql(1);
            await child.resetChanges();
            await app.ui.confirmationModal.click('buttons', 'Continue');
            await t
                .expect(await child.grid.getRecordsCount()).eql(0)
                .expect(await child.isEnabled('resetButton')).notOk();
        });
        await app.step('Add one record to a child table and reset', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            await child.addNew();
            await t
                .expect(await child.isEnabled('resetButton')).ok()
                .expect(await child.grid.getRecordsCount()).eql(1);
            await child.resetChanges();
            await app.ui.confirmationModal.click('buttons', 'Continue');
            await t
                .expect(await child.grid.getRecordsCount()).eql(0);
        });
        await app.step('Verify a child tab`s Reset does not restore another child tab', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const value = app.services.random.num().toString();
            const record1 = await child.grid.getRecord(0);
            await child.addNew();
            await record1.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).fill(value);
            await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
            await app.ui.waitLoading({checkErrors: true});
            await child.addNew();
            await child.resetChanges();
            await app.ui.confirmationModal.click('buttons', 'Continue');
            await t
                .expect(await child.grid.getRecordsCount()).eql(0);
            await app.ui.dataEntryBoard.selectChildRecord(data.editableChildWithData.name);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await child.grid.getRecordsCount()).eql(1)
                .expect(await record1.getField(data.editableChildWithData.filter.columnName, 'input', {isTextExact: true}).getValue()).eql(value);
        });
        await app.step('Verify a child tab`s Reset does not restore the filing section', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
            await app.ui.waitLoading({checkErrors: true});
            const value = app.services.random.num().toString();
            const child = app.ui.dataEntryBoard.childRecord;
            await child.addNew();
            await app.ui.dataEntryBoard.getField(data.filingSectionField.name, 'input').fill(value);
            await child.resetChanges();
            await app.ui.confirmationModal.click('buttons', 'Continue');
            await t
                .expect(await child.grid.getRecordsCount()).eql(0)
                .expect(await app.ui.dataEntryBoard.getField(data.filingSectionField.name, 'input').getValue()).eql(value);
        });
    })
    .after(async (t) => {
        await app.step('Reset user references to default (API)', async () => {
            await app.api.login();
            await app.api.userPreferences.resetUserPreferences();
        });
        app.ui.resetRequestLogger();
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify Delete functionality on child tab of a New DEF (${data.ipType}- Steps 10-11)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Open a new ${data.ipType} DEF`, async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem(data.viewIn);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Hover over the Delete button on a child tab', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllControls.name);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            await t
                .expect(await child.isVisible('deleteRowButton')).ok()
                .expect(await child.isEnabled('deleteRowButton')).notOk();
            await child.hover('deleteRowButton');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Delete row'); /* Bug: https://jira.***.com/browse/IPDP-8827 Should be "Delete selected row"*/
            });
        await app.step('Add some records to the child tab grid', async () => {
            let child = app.ui.dataEntryBoard.childRecord;
            await child.addNew();
            const record1 = await child.grid.getRecord(0);
            await record1.getField(data.childWithAllControls.combobox.name).fill(data.childWithAllControls.combobox.value);
            await child.addNew();
            const record2 = await child.grid.getRecord(1);
            await record2.getField(data.childWithAllControls.singleLine.name, 'input').fill(data.childWithAllControls.singleLine.value);
            await t
                .expect(await child.grid.getRecordsCount()).eql(2)
                .expect(await child.getTotalCount()).eql(2);
        });
        await app.step('Select 1 record in grid and verify Delete button', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            await child.grid.getCheckbox(0).check();
            await t
                .expect(await child.isEnabled('deleteRowButton')).ok();
        });
        await app.step('Deselect 1 record in grid and verify Delete button', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            await child.grid.getCheckbox(0).uncheck();
            await t
                .expect(await child.isEnabled('deleteRowButton')).notOk();
        });
        await app.step('Select all records in grid and verify Delete button', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            await child.grid.selectAllRecords();
            await t
                .expect(await child.isEnabled('deleteRowButton')).ok();
        });
        await app.step('Deselect all records in grid and verify Delete button', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            await child.grid.deselectAllRecords();
            await t
                .expect(await child.isEnabled('deleteRowButton')).notOk();
        });
        await app.step('Verify the Delete Confirmation Modal and delete 1 record', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            await child.grid.getCheckbox(0).check();
            await child.click('deleteRowButton');
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to delete the selected row(s)?')
                .expect(await app.ui.confirmationModal.isVisible('cross')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'No')).ok();
            await app.ui.confirmationModal.click('cross');
            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await child.grid.getRecordsCount()).eql(2)
                .expect(await child.grid.getCheckbox(0).isChecked()).ok()
                .expect(await child.isEnabled('deleteRowButton')).ok();
            await child.click('deleteRowButton');
            await app.ui.confirmationModal.click('buttons', 'Yes');
            await t
                .expect(await child.grid.getRecordsCount()).eql(1)
                .expect(await child.getTotalCount()).eql(1);
        });
    });
