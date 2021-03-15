import app from '../../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

const additionalActiveCG = 'Test Automation CG Regression 2';
const additionalInactiveCG = 'Test Automation CG Regression 3';
const createdRecords = [];

fixture `REGRESSION.dataEntryForm.child.pack - Test ID 30010: DEF_Childs - Permissions`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.setContentGroupDefaults(globalConfig.user.contentGroup);
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step('Add current user and activate content group 2 (API)', async () => {
            const contentGroupPage = app.api.administration.contentGroup;
            await contentGroupPage.openContentGroup(additionalActiveCG);
            contentGroupPage.setActive(true);
            await contentGroupPage.addUser(globalConfig.user.userName);
            await contentGroupPage.save();
        });
        await app.step('Add current user to content group 3 (API)', async () => {
            const contentGroupPage = app.api.administration.contentGroup;

            await contentGroupPage.openContentGroup(additionalInactiveCG);
            await contentGroupPage.addUser(globalConfig.user.userName);
            contentGroupPage.setActive(false);
            await contentGroupPage.save();
        });
    })
    .after(async () => {
        await app.step('Deactivate content groups and remove current user (API)', async () => {
            await app.api.login();
            const contentGroupPage = app.api.administration.contentGroup;

            await contentGroupPage.openContentGroup(additionalActiveCG);
            await contentGroupPage.removeUser(globalConfig.user.userName);
            contentGroupPage.setActive(false);
            await contentGroupPage.save();

            await contentGroupPage.openContentGroup(additionalInactiveCG);
            await contentGroupPage.removeUser(globalConfig.user.userName);
            contentGroupPage.setActive(false);
            await contentGroupPage.save();
        });
    });

const dataSet = (function() {
    const childWithSpecificPermissions = {
        name: 'Expenses',
        checkbox: { name: 'GENERICCHECKBOX1', value: 'check' },
        datepicker: { name: 'Miscellaneous Date', value: app.services.time.getDate() },
        singleLine: { name: 'Invoice Number', value: app.services.random.num().toString() },
        multiLine: { name: 'Text 1', value: 'Test' },
        numeric: { name: 'Percentage', value: app.services.random.num(1, 100).toFixed(2).toString() },
        controlWithAllPermissions: { name: 'Receipt Date', value: app.services.time.getDate() },
        allControls: [ 'GENERICCHECKBOX1', 'Miscellaneous Date', 'Invoice Number', 'Text 1', 'Percentage', 'Linked File', 'Receipt Date', 'Expense', 'Payto Code', 'Division' ],
        condition: {
            name: 'Percentage Greater Than Or Equal 50',
            columnName: 'Percentage',
            controlType: 'numeric',
            valueFitCondition: app.services.random.num(50, 100).toFixed(2).toString(),
            valueFitCondition2: app.services.random.num(50, 100).toFixed(2).toString(),
            valueDoesNotFitCondition: app.services.random.num(0, 49).toFixed(2).toString(),
            valueDoesNotFitCondition2: app.services.random.num(0, 49).toFixed(2).toString()
        }
    };
    const fullData = [
        {
            ipType: 'Patent',
            recordId: '',
            recordName: '',
            defTemplate: 'TA DEF for Patent',
            query: 'Patent>PA All Cases TA filter',
            identifierName: 'PATENTMASTERID',
            childWithSpecificPermissions: {
                childApplicationSecurity: 'PatentMasters>EXPENSES',
                linkedfile: { name: 'Linked File', value: 'http://test' },
                combobox: { name: 'Expense', value: 'Credit Note - (CDN)' },
                hierarchy: { name: 'Payto Code', value: 'Pay To Code - (PPT)' },
                largeList: { name: 'Division', value: 'Chemical Division - (CD)' },
                ...childWithSpecificPermissions
            },
            childWithAllPermissions: { name: 'Text', requiredFields: [{ name: 'Text Type', value: 'Description - (DS)' }] },
            brief: 'true'
        },
        {
            ipType: 'Trademark',
            recordId: '',
            recordName: '',
            defTemplate: 'TA DEF for Trademark',
            query: 'Trademark>TM All Cases TA filter',
            identifierName: 'TRADEMARKMASTERID',
            childWithSpecificPermissions: {
                childApplicationSecurity: 'TrademarkMasters>EXPENSES',
                linkedfile: { name: 'Linked File', value: '', textValue: 'http://***.com' },
                combobox: { name: 'Expense', value: 'Legal Services - (LGL)' },
                hierarchy: { name: 'Payto Code', value: 'Payto - (PYT)' },
                largeList: { name: 'Division', value: 'CLT Party - 1002 - (CLT Party - 1002)' },
                ...childWithSpecificPermissions
            },
            childWithAllPermissions: { name: 'Text', requiredFields: [{ name: 'Text Type', value: 'Remark - (RM)' }] },
            brief: 'false'
        },
        {
            ipType: 'Disclosure',
            recordId: '',
            recordName: '',
            defTemplate: 'TA DEF for Disclosure',
            query: 'Disclosure>DS All Cases TA filter',
            identifierName: 'DISCLOSUREMASTERID',
            childWithSpecificPermissions: {
                childApplicationSecurity: 'DisclosureMasters>EXPENSES',
                linkedfile: { name: 'Linked File', value: '', textValue: 'http://***.com' },
                combobox: { name: 'Expense', value: 'Credit Note - (CDN)' },
                hierarchy: { name: 'Payto Code', value: 'Payto - (ptcp1)' },
                largeList: { name: 'Division', value: 'ABC Corporation - (ABCC-1)' },
                ...childWithSpecificPermissions
            },
            childWithAllPermissions: { name: 'Text', requiredFields: [{ name: 'Text Type', value: 'Description - (DS)' }] },
            brief: 'false'
        },
        {
            ipType: 'GeneralIP',
            recordId: '',
            recordName: '',
            defTemplate: 'TA DEF for GeneralIP1',
            query: 'GeneralIP1>GIP1 All Cases TA filter',
            identifierName: 'GENERALIP1MASTERID',
            childWithSpecificPermissions: {
                childApplicationSecurity: 'GeneralIP1Masters>EXPENSES',
                linkedfile: { name: 'Linked File', value: '', textValue: 'http://***.com' },
                combobox: { name: 'Expense', value: 'Lease - (LSE)' },
                hierarchy: { name: 'Payto Code', value: 'Pay To Code - (GPT)' },
                largeList: { name: 'Division', value: 'Acme Propellants - (ACME-1)' },
                ...childWithSpecificPermissions
            },
            childWithAllPermissions: { name: 'Text', requiredFields: [{ name: 'Text Type', value: 'Notification - (NTC)' }] },
            brief: 'false'
        }
    ];
    return fullData;
})();

dataSet.forEach(async (data, index) => {
    let record;
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            if (index === 0) {
                await app.step('Remove child Visible&Edit permissions for all content groups of the user (API)', async () => {
                    await app.api.login();
                    const contentGroupPage = app.api.administration.contentGroup;
                    for (const groupName of [ globalConfig.user.contentGroup, additionalActiveCG ]) {
                        await contentGroupPage.openContentGroup(groupName);
                        for (const element of dataSet) {
                            await contentGroupPage.setApplicationSecurity(element.childWithSpecificPermissions.childApplicationSecurity, { editPermission: false, visiblePermission: false});
                        }
                        await contentGroupPage.save();
                    }
                });
            }
        })
        (`Visible Permissions for child on Data Entry Form (${data.ipType} - Steps 3-4)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify visibility of the child', async () => {
                const childNames = await app.ui.dataEntryBoard.getChildRecordsNames();
                await t
                    .expect(childNames).notContains(data.childWithSpecificPermissions.name)
                    .expect(childNames).contains(data.childWithAllPermissions.name);
            });
            await app.step('Add Visible Permissions for one of the active content groups of the user (API)', async () => {
                const contentGroupPage = app.api.administration.contentGroup;
                await contentGroupPage.openContentGroup(globalConfig.user.contentGroup);
                await contentGroupPage.setApplicationSecurity(data.childWithSpecificPermissions.childApplicationSecurity, { editPermission: true, visiblePermission: true });
                await contentGroupPage.save();
            });
            await app.step('Refresh and verify visibility of the child', async () => {
                await app.ui.refresh();
                const childNames = await app.ui.dataEntryBoard.getChildRecordsNames();
                await t
                    .expect(childNames).contains(data.childWithSpecificPermissions.name);
            });
        })
        .after(async () => {
            await app.step('Delete created record with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([record.respData]);
                } catch (err) {}
            });
            if (index === dataSet.length - 1 || globalConfig.brief) {
                await app.step('Set child Visible&Edit permissions back for all content groups of the user (API)', async () => {
                    const contentGroupPage = app.api.administration.contentGroup;
                    for (const groupName of [ globalConfig.user.contentGroup, additionalActiveCG ]) {
                        await contentGroupPage.openContentGroup(groupName);
                        for (const element of dataSet) {
                            await contentGroupPage.setApplicationSecurity(element.childWithSpecificPermissions.childApplicationSecurity, { editPermission: true, visiblePermission: true });
                        }
                        await contentGroupPage.save();
                    }
                });
            }
        });
    });

dataSet.forEach(async (data, index) => {
    let record;
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            if (index === 0) {
                await app.step('Remove child Edit permissions for all content groups of the user (API)', async () => {
                    await app.api.login();
                    const contentGroupPage = app.api.administration.contentGroup;
                    for (const groupName of [ globalConfig.user.contentGroup, additionalActiveCG ]) {
                        await contentGroupPage.openContentGroup(groupName);
                        for (const element of dataSet) {
                            await contentGroupPage.setApplicationSecurity(element.childWithSpecificPermissions.childApplicationSecurity, { editPermission: false });
                        }
                        await contentGroupPage.save();
                    }
                });
            }
            await app.step('Add child records to data entry record', async () => {
                await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                    [{
                        childName: data.childWithSpecificPermissions.name,
                        rows: [
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: app.services.random.num().toString() },
                                { name: data.childWithSpecificPermissions.multiLine.name, value: app.services.random.num().toString() }
                            ]}
                        ]
                    }]);
            });
        })
        (`Edit Permissions for child on Data Entry Form (${data.ipType} - Steps 5-6)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open child without Edit permissions and verify fields', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await child.grid.getCheckbox(0).check();
                await t
                    .expect(await child.isEnabled('addNewButton')).notOk()
                    .expect(await child.isEnabled('deleteRowButton')).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.checkbox.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.combobox.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.datepicker.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.hierarchy.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.largeList.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.linkedfile.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.multiLine.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.numeric.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name)).ok();
            });
            await app.step('Select a record in child and delete', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCountBefore = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.delete();
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCountBefore - 1)
                    .expect(await child.isEnabled('resetButton')).ok();
            });
            await app.step('Reset changes on the child', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCountBefore = await child.grid.getRecordsCount();
                await child.resetChanges();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await app.ui.waitLoading();
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCountBefore + 1);
            });
            await app.step('Open and verify child with Edit permissions', async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Actions');
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCountBefore = await child.grid.getRecordsCount();
                await child.click('addNewButton');
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCountBefore + 1)
                    .expect(await record.isFieldReadOnly('Action')).notOk();
            });
            await app.step('Add Edit Permissions for one of the active content groups of the user (API)', async () => {
                const contentGroupPage = app.api.administration.contentGroup;
                await contentGroupPage.openContentGroup(globalConfig.user.contentGroup);
                await contentGroupPage.setApplicationSecurity(data.childWithSpecificPermissions.childApplicationSecurity, { editPermission: true });
                await contentGroupPage.save();
            });
            await app.step('Refresh and open child grid without Edit permissions', async () => {
                await app.ui.closeNativeDialog();
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Edit a record on the child grid', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                const randomValue = app.services.random.num().toString();
                await record.getField(data.childWithSpecificPermissions.singleLine.name, 'input').fill(randomValue);
                await t
                    .expect(await record.getValue(data.childWithSpecificPermissions.singleLine.name)).eql(randomValue);
            });
            await app.step('Delete a record on the child grid', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCountBefore = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.delete();
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCountBefore - 1);
            });
            await app.step('Add a new record to the child grid', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCountBefore = await child.grid.getRecordsCount();
                await child.addNew();
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCountBefore + 1);
            });
        })
        .after(async () => {
            await app.step('Delete created record with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([record.respData]);
                } catch (err) {}
            });
            if (index === dataSet.length - 1 || globalConfig.brief) {
                await app.step('Set child Edit permissions back for all content groups of the user (API)', async () => {
                    await app.api.login();
                    const contentGroupPage = app.api.administration.contentGroup;
                    for (const groupName of [ globalConfig.user.contentGroup, additionalActiveCG ]) {
                        await contentGroupPage.openContentGroup(groupName);
                        for (const element of dataSet) {
                            await contentGroupPage.setApplicationSecurity(element.childWithSpecificPermissions.childApplicationSecurity, { editPermission: true });
                        }
                        await contentGroupPage.save();
                    }
                });
            }
        });
    });

dataSet.forEach(async (data, index) => {
    let record;
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            if (index === 0) {
                await app.step('Remove child Delete permissions for all content groups of the user (API)', async () => {
                    await app.api.login();
                    const contentGroupPage = app.api.administration.contentGroup;
                    for (const groupName of [ globalConfig.user.contentGroup, additionalActiveCG ]) {
                        await contentGroupPage.openContentGroup(groupName);
                        for (const element of dataSet) {
                            await contentGroupPage.setApplicationSecurity(element.childWithSpecificPermissions.childApplicationSecurity, { deletePermission: false });
                        }
                        await contentGroupPage.save();
                    }
                });
            }
            await app.step('Add records to the child without Delete persmissions', async () => {
                await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                    [{
                        childName: data.childWithSpecificPermissions.name,
                        rows: [
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: app.services.random.num().toString() },
                                { name: data.childWithSpecificPermissions.multiLine.name, value: app.services.random.num().toString() }
                            ]}
                        ]
                    }]);
            });
            await app.step('Add records to the child with all permissions', async () => {
                await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                    [{
                        childName: data.childWithAllPermissions.name,
                        rows: [
                            { properties: data.childWithAllPermissions.requiredFields }
                        ]
                    }]);
            });
        })
        (`Delete Permissions for child on Data Entry Form (${data.ipType} - Steps 7-8)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open and verify child without Delete permissions', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                await child.grid.getCheckbox(0).check();
                await t
                    .expect(await child.isEnabled('deleteRowButton')).notOk();
            });
            await app.step('Edit existing data on the child', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                const randomValue = app.services.random.num().toString();
                await record.getField(data.childWithSpecificPermissions.singleLine.name, 'input').fill(randomValue);
                await t
                    .expect(await record.getValue(data.childWithSpecificPermissions.singleLine.name)).eql(randomValue);
            });
            await app.step('Add a new row to the child', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCount = await child.grid.getRecordsCount();
                await child.addNew();
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCount + 1);
            });
            await app.step('Open and verify child with Delete permissions', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithAllPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCount = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.delete();
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCount - 1);
            });
            await app.step('Add child Delete permissions for one of the active content groups of user', async () => {
                await app.api.login();
                const contentGroupPage = app.api.administration.contentGroup;
                await contentGroupPage.openContentGroup(globalConfig.user.contentGroup);
                await contentGroupPage.setApplicationSecurity(data.childWithSpecificPermissions.childApplicationSecurity, { deletePermission: true });
                await contentGroupPage.save();
            });
            await app.step('Refresh and open child without Delete permissions', async () => {
                await app.ui.closeNativeDialog();
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Select a record and click delete', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCount = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await t
                    .expect(await child.isEnabled('deleteRowButton')).ok();
                await child.delete();
                await app.ui.confirmationModal.click('buttons', 'Yes');
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCount - 1);
            });
            await app.step('Add a new records to the child', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCount = await child.grid.getRecordsCount();
                await child.addNew();
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCount + 1);
            });
        })
        .after(async () => {
            await app.step('Delete created record with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([record.respData]);
                } catch (err) {}
            });
            if (index === dataSet.length - 1 || globalConfig.brief) {
                await app.step('Set child Delete permissions back for all content groups of the user (API)', async () => {
                    const contentGroupPage = app.api.administration.contentGroup;
                    for (const groupName of [ globalConfig.user.contentGroup, additionalActiveCG ]) {
                        await contentGroupPage.openContentGroup(groupName);
                        for (const element of dataSet) {
                            await contentGroupPage.setApplicationSecurity(element.childWithSpecificPermissions.childApplicationSecurity, { deletePermission: true });
                        }
                        await contentGroupPage.save();
                    }
                });
            }
        });
    });

dataSet.forEach(async (data, index) => {
    let record;
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            if (index === 0) {
                await app.step('Add conditional Visible permission to one of the active content group', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    for (let element of dataSet) {
                    await contentGroup.setApplicationSecurityWithCondition(
                        element.childWithSpecificPermissions.childApplicationSecurity,
                        {visibleCondition: element.childWithSpecificPermissions.condition.name}
                        );
                    }
                    await contentGroup.save();
                });
            }
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            await app.step('Add record to the child with conditional permissions', async () => {
                await app.api.login();
                await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                    [{
                        childName: data.childWithSpecificPermissions.name,
                        rows: [
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: 'Test' },
                                { name: data.childWithSpecificPermissions.condition.columnName,
                                    value: data.childWithSpecificPermissions.condition.valueFitCondition} ] },
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: 'Test' },
                                { name: data.childWithSpecificPermissions.condition.columnName,
                                    value: data.childWithSpecificPermissions.condition.valueDoesNotFitCondition} ] },
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: 'Test' } ] }
                        ]
                    }]);
            });
        })
        (`Conditional Visible permissions for child on Data Entry Form (${data.ipType} - Step 9)`, async (t) => {
            let recordsCount: number;
            let columnValues;
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open child with conditional permissions', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify child contains records that fit set condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const columnValues = await child.grid.getColumnValues(data.childWithSpecificPermissions.condition.columnName);
                await t
                    .expect(columnValues.every((x) => Number(x) === Number(data.childWithSpecificPermissions.condition.valueFitCondition))).ok()
                    .expect(await child.grid.getRecordsCount()).eql(await child.getTotalCount());
            });
            await app.step('Verify records in the child can be edited', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                const randomValue = app.services.random.num().toString();
                await record.getField(data.childWithSpecificPermissions.singleLine.name, 'input').fill(randomValue);
                await t
                    .expect(await record.getValue(data.childWithSpecificPermissions.singleLine.name)).eql(randomValue);
            });
            await app.step('Verify records in the child can be deleted', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCount = await child.grid.getRecordsCount();
                await child.grid.getCheckbox(0).check();
                await child.delete();
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCount - 1);
            });
            await app.step('Add a new record with values that fit condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithSpecificPermissions.condition.columnName, data.childWithSpecificPermissions.condition.controlType)
                    .fill(data.childWithSpecificPermissions.condition.valueFitCondition2);
                await t
                    .expect(Number(await record.getValue(data.childWithSpecificPermissions.condition.columnName)))
                    .eql(Number(data.childWithSpecificPermissions.condition.valueFitCondition2));
            });
            await app.step('Save record and verify child', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await t
                    .expect(Number(await record.getValue(data.childWithSpecificPermissions.condition.columnName)))
                    .eql(Number(data.childWithSpecificPermissions.condition.valueFitCondition2));
            });
            await app.step('Add a new record with values that doesn\'t fit condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                recordsCount = await child.grid.getRecordsCount();
                columnValues = (await child.grid.getColumnValues(data.childWithSpecificPermissions.condition.columnName)).map((x) => {
                    return Number(x);
                });
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithSpecificPermissions.condition.columnName, data.childWithSpecificPermissions.condition.controlType)
                    .fill(data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2);
                await t
                    .expect(Number(await record.getValue(data.childWithSpecificPermissions.condition.columnName)))
                    .eql(Number(data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2))
                    .expect(await child.getTotalCount()).eql(recordsCount + 1);
            });
            await app.step('Save record and verify child', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const columnValuesAfterSave = (await child.grid.getColumnValues(data.childWithSpecificPermissions.condition.columnName)).map((x) => {
                    return Number(x);
                });
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordsCount)
                    .expect(await child.getTotalCount()).eql(recordsCount)
                    .expect(columnValuesAfterSave).eql(columnValues);
            });
        })
        .after(async () => {
            if (index === dataSet.length - 1 || globalConfig.brief) {
                await app.step('Remove conditional Visible permissions in content group', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    for (let element of dataSet) {
                        await contentGroup.setApplicationSecurity(element.childWithSpecificPermissions.childApplicationSecurity, { visiblePermission: true });
                    }
                    await contentGroup.save();
                });
            }
            await app.step('Remove records from child with conditions', async () => {
                await app.api.removeAllChildRecords(Number(data.recordId), data.defTemplate, data.childWithSpecificPermissions.name);
            });
            await app.step('Delete created record with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([record.respData]);
                } catch (err) {}
            });
        });
    });

dataSet.forEach((data, index) => {
    let record;
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            if (index === 0) {
                await app.step('Add conditional Edit permission to one of the active content group', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    for (let element of dataSet) {
                        await contentGroup.setApplicationSecurityWithCondition(
                            element.childWithSpecificPermissions.childApplicationSecurity,
                            {editCondition: element.childWithSpecificPermissions.condition.name}
                            );
                    }
                    await contentGroup.save();
                });
            }
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            await app.step('Add records to the child with conditional permissions', async () => {
                await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                    [{
                        childName: data.childWithSpecificPermissions.name,
                        rows: [
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: 'Test' },
                                { name: data.childWithSpecificPermissions.condition.columnName,
                                    value: data.childWithSpecificPermissions.condition.valueFitCondition} ] },
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: 'Test' },
                                { name: data.childWithSpecificPermissions.condition.columnName,
                                    value: data.childWithSpecificPermissions.condition.valueDoesNotFitCondition} ] },
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: 'Test' } ] }
                        ]
                    }]);
            });
        })
        (`Conditional Edit permissions for child on Data Entry Form (${data.ipType} - Step 10)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open child with conditions on record', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify record with fields that fit the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueFitCondition);
                const record = await child.grid.getRecord(recordIndex);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.checkbox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.combobox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.datepicker.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.hierarchy.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.largeList.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.linkedfile.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.multiLine.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.numeric.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name)).notOk();
            });
            await app.step('Delete record with fields that fit condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordCount = await child.grid.getRecordsCount();
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueFitCondition);
                await child.grid.getCheckbox(recordIndex).check();
                await child.delete();
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordCount - 1);
            });
            await app.step('Verify record with fields that doesn\'t fit the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueDoesNotFitCondition);
                const record = await child.grid.getRecord(recordIndex);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.checkbox.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.combobox.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.datepicker.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.hierarchy.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.largeList.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.linkedfile.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.multiLine.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.numeric.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name)).ok();
            });
            await app.step('Add a new record with fields that fit the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithSpecificPermissions.condition.columnName, data.childWithSpecificPermissions.condition.controlType)
                    .fill(data.childWithSpecificPermissions.condition.valueFitCondition2);
                await t
                    .expect(Number(await record.getValue(data.childWithSpecificPermissions.condition.columnName)))
                    .eql(Number(data.childWithSpecificPermissions.condition.valueFitCondition2))
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.checkbox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.combobox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.datepicker.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.hierarchy.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.largeList.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.linkedfile.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.multiLine.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.numeric.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name)).notOk();
            });
            await app.step('Save record and verify child', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueFitCondition2);
                const record = await child.grid.getRecord(recordIndex);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.checkbox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.combobox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.datepicker.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.hierarchy.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.largeList.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.linkedfile.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.multiLine.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.numeric.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name)).notOk();
            });
            await app.step('Add a new record with fields that doesn\'t fit the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithSpecificPermissions.condition.columnName, data.childWithSpecificPermissions.condition.controlType)
                    .fill(data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2);
                await t
                    .expect(Number(await record.getValue(data.childWithSpecificPermissions.condition.columnName)))
                    .eql(Number(data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2))
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.checkbox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.combobox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.datepicker.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.hierarchy.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.largeList.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.linkedfile.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.multiLine.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.numeric.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name)).notOk();
            });
            await app.step('Save record and verify child', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2);
                const record = await child.grid.getRecord(recordIndex);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.checkbox.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.combobox.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.datepicker.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.hierarchy.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.largeList.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.linkedfile.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.multiLine.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.numeric.name)).ok()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name)).ok();
            });
        })
        .after(async () => {
            if (index === dataSet.length - 1 || globalConfig.brief) {
                await app.step('Add conditional Edit permission to one of the active content group', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    for (let element of dataSet) {
                        await contentGroup.setApplicationSecurity(element.childWithSpecificPermissions.childApplicationSecurity, { editPermission: true });
                    }
                    await contentGroup.save();
                });
            }
            await app.step('Remove records from child with conditions', async () => {
                await app.api.removeAllChildRecords(Number(data.recordId), data.defTemplate, data.childWithSpecificPermissions.name);
            });
            await app.step('Delete created record with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([record.respData]);
                } catch (err) {}
            });
        });
    });

dataSet.forEach((data, index) => {
    let record;
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            if (index === 0) {
                await app.step('Add conditional Delete permission to one of the active content group', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    for (let element of dataSet) {
                        await contentGroup.setApplicationSecurityWithCondition(
                            element.childWithSpecificPermissions.childApplicationSecurity,
                            {deleteCondition: element.childWithSpecificPermissions.condition.name}
                            );
                    }
                    await contentGroup.save();
                });
            }
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            await app.step('Add records to the child with conditional permissions', async () => {
                await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                    [{
                        childName: data.childWithSpecificPermissions.name,
                        rows: [
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: 'Test' },
                                { name: data.childWithSpecificPermissions.condition.columnName,
                                    value: data.childWithSpecificPermissions.condition.valueFitCondition} ] },
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: 'Test' },
                                { name: data.childWithSpecificPermissions.condition.columnName,
                                    value: data.childWithSpecificPermissions.condition.valueDoesNotFitCondition} ] },
                            { properties: [
                                { name: data.childWithSpecificPermissions.singleLine.name, value: 'Test' } ] }
                        ]
                    }]);
            });
        })
        (`Conditional Delete permissions for child on Data Entry Form (${data.ipType} - Step 11)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open child with conditions on record', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Edit record with fields that fit condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueFitCondition);
                const record = await child.grid.getRecord(recordIndex);
                const randomValue = app.services.random.num().toString();
                await record.getField(data.childWithSpecificPermissions.singleLine.name, 'input').fill(randomValue);
                await t
                    .expect(await record.getValue(data.childWithSpecificPermissions.singleLine.name)).eql(randomValue);
            });
            await app.step('Delete record with fields that fit the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordcount = await child.grid.getRecordsCount();
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueFitCondition);
                await child.grid.getCheckbox(recordIndex).check();
                await t
                    .expect(await child.isEnabled('deleteRowButton')).ok();
                await child.delete();
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await child.grid.getRecordsCount()).eql(recordcount - 1);
            });
            await app.step('Delete record with fields that doesn\'t fit the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueDoesNotFitCondition);
                await child.grid.getCheckbox(recordIndex).check();
                await t
                    .expect(await child.isEnabled('deleteRowButton')).notOk();
                await child.grid.getCheckbox(recordIndex).uncheck();
            });
            await app.step('Add a new record with fields that fit the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithSpecificPermissions.condition.columnName, data.childWithSpecificPermissions.condition.controlType)
                    .fill(data.childWithSpecificPermissions.condition.valueFitCondition2);
                await child.grid.getCheckbox(0).check();
                await t
                    .expect(await child.isEnabled('deleteRowButton')).ok();
            });
            await app.step('Save the record and verify child with permissions', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueFitCondition2);
                await child.grid.getCheckbox(recordIndex).check();
                await t
                    .expect(await child.isEnabled('deleteRowButton')).ok();
                await child.grid.getCheckbox(recordIndex).uncheck();
            });
            await app.step('Add a new record with fields that doesn\t fit the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithSpecificPermissions.condition.columnName, data.childWithSpecificPermissions.condition.controlType)
                    .fill(data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2);
                await child.grid.getCheckbox(0).check();
                await t
                    .expect(await child.isEnabled('deleteRowButton')).ok();
            });
            await app.step('Save the record and verify child with permissions', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2);
                await child.grid.getCheckbox(recordIndex).check();
                await t
                    .expect(await child.isEnabled('deleteRowButton')).notOk();
            });
        })
        .after(async () => {
            if (index === dataSet.length - 1 || globalConfig.brief) {
                await app.step('Add conditional Delete permission to one of the active content group', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    for (let element of dataSet) {
                        await contentGroup.setApplicationSecurity(element.childWithSpecificPermissions.childApplicationSecurity, { editPermission: true, visiblePermission: true, deletePermission: true });
                    }
                    await contentGroup.save();
                });
            }
            await app.step('Remove records from child with conditions', async () => {
                await app.api.removeAllChildRecords(Number(data.recordId), data.defTemplate, data.childWithSpecificPermissions.name);
            });
            await app.step('Delete created record with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([record.respData]);
                } catch (err) {}
            });
        });
    });

dataSet.forEach((data, index) => {
    let record;
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            await app.step('Add records to the child without Visible control permissions', async () => {
                await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                    [{
                        childName: data.childWithSpecificPermissions.name,
                        rows: [
                            { properties: [
                                { name: data.childWithSpecificPermissions.controlWithAllPermissions.name,
                                    value: data.childWithSpecificPermissions.controlWithAllPermissions.value } ] }
                        ]
                    }]);
            });
            if (index === 0) {
                await app.step('Remove Visible permissions for controls in child', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    for (const group of [globalConfig.user.contentGroup, additionalActiveCG]) {
                        await contentGroup.openContentGroup(group);
                        for (let element of dataSet) {
                            const child = element.childWithSpecificPermissions;
                            const applicationSecurity = element.childWithSpecificPermissions.childApplicationSecurity;
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.checkbox.name, { editPermission: false, visiblePermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.combobox.name, { editPermission: false, visiblePermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.datepicker.name, { editPermission: false, visiblePermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.hierarchy.name, { editPermission: false, visiblePermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.largeList.name, { editPermission: false, visiblePermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.linkedfile.name, { editPermission: false, visiblePermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.multiLine.name, { editPermission: false, visiblePermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.numeric.name, { editPermission: false, visiblePermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.singleLine.name, { editPermission: false, visiblePermission: false });
                        }
                        await contentGroup.save();
                    }
                });
            }
        })
        (`Visible permissions for controls of different types in child tab (${data.ipType} - Steps 12-13)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open child without Visible control permissions', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify visisbility of controls on the child grid', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const columnNames = (await child.grid.getColumnsNamesArray()).map((x) => x.text);
                await t
                    .expect(columnNames).notContains(data.childWithSpecificPermissions.checkbox.name)
                    .expect(columnNames).notContains(data.childWithSpecificPermissions.combobox.name)
                    .expect(columnNames).notContains(data.childWithSpecificPermissions.datepicker.name)
                    .expect(columnNames).notContains(data.childWithSpecificPermissions.hierarchy.name)
                    .expect(columnNames).notContains(data.childWithSpecificPermissions.largeList.name)
                    .expect(columnNames).notContains(data.childWithSpecificPermissions.linkedfile.name)
                    .expect(columnNames).notContains(data.childWithSpecificPermissions.multiLine.name)
                    .expect(columnNames).notContains(data.childWithSpecificPermissions.numeric.name)
                    .expect(columnNames).notContains(data.childWithSpecificPermissions.singleLine.name)
                    .expect(columnNames).contains(data.childWithSpecificPermissions.controlWithAllPermissions.name);
            });
            await app.step('Add Visible permissions for controls in one of the active content group', async () => {
                await app.api.login();
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                const child = data.childWithSpecificPermissions;
                const applicationSecurity = data.childWithSpecificPermissions.childApplicationSecurity;
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.checkbox.name, { editPermission: true, visiblePermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.combobox.name, { editPermission: true, visiblePermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.datepicker.name, { editPermission: true, visiblePermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.hierarchy.name, { editPermission: true, visiblePermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.largeList.name, { editPermission: true, visiblePermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.linkedfile.name, { editPermission: true, visiblePermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.multiLine.name, { editPermission: true, visiblePermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.numeric.name, { editPermission: true, visiblePermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.singleLine.name, { editPermission: true, visiblePermission: true });
                await contentGroup.save();
            });
            await app.step('Refresh page and open child without conrol permissions', async () => {
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify controls wuthout permissions on the child', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const columnNames = (await child.grid.getColumnsNamesArray()).map((x) => x.text);
                await t
                    .expect(columnNames).contains(data.childWithSpecificPermissions.checkbox.name)
                    .expect(columnNames).contains(data.childWithSpecificPermissions.combobox.name)
                    .expect(columnNames).contains(data.childWithSpecificPermissions.datepicker.name)
                    .expect(columnNames).contains(data.childWithSpecificPermissions.hierarchy.name)
                    .expect(columnNames).contains(data.childWithSpecificPermissions.largeList.name)
                    .expect(columnNames).contains(data.childWithSpecificPermissions.linkedfile.name)
                    .expect(columnNames).contains(data.childWithSpecificPermissions.multiLine.name)
                    .expect(columnNames).contains(data.childWithSpecificPermissions.numeric.name)
                    .expect(columnNames).contains(data.childWithSpecificPermissions.singleLine.name);
            });
        })
        .after(async () => {
            if (index === dataSet.length - 1 || globalConfig.brief) {
                await app.step('Set Visible permissions back for controls in child', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    for (const group of [globalConfig.user.contentGroup, additionalActiveCG]) {
                        await contentGroup.openContentGroup(group);
                        for (let element of dataSet) {
                            const child = element.childWithSpecificPermissions;
                            const applicationSecurity = element.childWithSpecificPermissions.childApplicationSecurity;
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.checkbox.name, { editPermission: true, visiblePermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.combobox.name, { editPermission: true, visiblePermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.datepicker.name, { editPermission: true, visiblePermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.hierarchy.name, { editPermission: true, visiblePermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.largeList.name, { editPermission: true, visiblePermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.linkedfile.name, { editPermission: true, visiblePermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.multiLine.name, { editPermission: true, visiblePermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.numeric.name, { editPermission: true, visiblePermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.singleLine.name, { editPermission: true, visiblePermission: true });
                        }
                        await contentGroup.save();
                    }
                });
            }
            await app.step('Remove records from child with conditions', async () => {
                await app.api.removeAllChildRecords(Number(data.recordId), data.defTemplate, data.childWithSpecificPermissions.name);
            });
            await app.step('Delete created record with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([record.respData]);
                } catch (err) {}
            });
        });
    });

dataSet.forEach((data, index) => {
    let record;
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            await app.step('Add records to the child without Edit control permissions', async () => {
                await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                    [{
                        childName: data.childWithSpecificPermissions.name,
                        rows: [
                            { properties: [
                                data.childWithSpecificPermissions.controlWithAllPermissions,
                                data.childWithSpecificPermissions.checkbox,
                                data.childWithSpecificPermissions.combobox,
                                data.childWithSpecificPermissions.datepicker,
                                data.childWithSpecificPermissions.hierarchy,
                                data.childWithSpecificPermissions.largeList,
                                data.childWithSpecificPermissions.multiLine,
                                data.childWithSpecificPermissions.numeric,
                                data.childWithSpecificPermissions.singleLine,
                                data.childWithSpecificPermissions.linkedfile ] }
                        ]
                    }]);
            });
            if (index === 0) {
                await app.step('Remove Edit permissions for controls in child', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    for (const group of [globalConfig.user.contentGroup, additionalActiveCG]) {
                        await contentGroup.openContentGroup(group);
                        for (let element of dataSet) {
                            const child = element.childWithSpecificPermissions;
                            const applicationSecurity = element.childWithSpecificPermissions.childApplicationSecurity;
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.checkbox.name, { editPermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.combobox.name, { editPermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.datepicker.name, { editPermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.hierarchy.name, { editPermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.largeList.name, { editPermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.linkedfile.name, { editPermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.multiLine.name, { editPermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.numeric.name, { editPermission: false });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.singleLine.name, { editPermission: false });
                        }
                        await contentGroup.save();
                    }
                });
            }
        })
        (`Edit permissions for controls of different types in child tab (${data.ipType} - Steps 14-15)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open child without Visible control permissions', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify controls on the child grid', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.checkbox.name, { isTextExact: true })).ok(`The ${data.childWithSpecificPermissions.checkbox.name} is not read only`)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.combobox.name, { isTextExact: true })).ok(`The ${data.childWithSpecificPermissions.combobox.name} is not read only`)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.datepicker.name, { isTextExact: true })).ok(`The ${data.childWithSpecificPermissions.datepicker.name} is not read only`)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.hierarchy.name, { isTextExact: true })).ok(`The ${data.childWithSpecificPermissions.hierarchy.name} is not read only`)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.largeList.name, { isTextExact: true })).ok(`The ${data.childWithSpecificPermissions.largeList.name} is not read only`)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.linkedfile.name, { isTextExact: true })).ok(`The ${data.childWithSpecificPermissions.linkedfile.name} is not read only`)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.multiLine.name, { isTextExact: true })).ok(`The ${data.childWithSpecificPermissions.multiLine.name} is not read only`)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.numeric.name, { isTextExact: true })).ok(`The ${data.childWithSpecificPermissions.numeric.name} is not read only`)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name, { isTextExact: true })).ok(`The ${data.childWithSpecificPermissions.singleLine.name} is not read only`)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.controlWithAllPermissions.name, { isTextExact: true })).notOk()
                    .expect(await record.getValue(data.childWithSpecificPermissions.checkbox.name, { isTextExact: true })).eql(data.childWithSpecificPermissions.checkbox.value)
                    .expect(await record.getValue(data.childWithSpecificPermissions.combobox.name, { isTextExact: true })).eql(data.childWithSpecificPermissions.combobox.value)
                    .expect(await record.getValue(data.childWithSpecificPermissions.datepicker.name, { isTextExact: true })).eql(data.childWithSpecificPermissions.datepicker.value)
                    .expect(await record.getValue(data.childWithSpecificPermissions.hierarchy.name, { isTextExact: true })).eql(data.childWithSpecificPermissions.hierarchy.value)
                    .expect(await record.getValue(data.childWithSpecificPermissions.largeList.name, { isTextExact: true })).eql(data.childWithSpecificPermissions.largeList.value)
                    .expect(await record.getValue(data.childWithSpecificPermissions.multiLine.name, { isTextExact: true })).eql(data.childWithSpecificPermissions.multiLine.value)
                    .expect(await record.getValue(data.childWithSpecificPermissions.numeric.name, { isTextExact: true })).eql(data.childWithSpecificPermissions.numeric.value)
                    .expect(await record.getValue(data.childWithSpecificPermissions.singleLine.name, { isTextExact: true })).eql(data.childWithSpecificPermissions.singleLine.value)
                    .expect(await record.getValue(data.childWithSpecificPermissions.controlWithAllPermissions.name, { isTextExact: true })).eql(data.childWithSpecificPermissions.controlWithAllPermissions.value)
                    .expect(await record.getValue(data.childWithSpecificPermissions.linkedfile.name, { isTextExact: true, readOnlyMode: true})).eql(data.childWithSpecificPermissions.linkedfile.value);
            });
            await app.step('Verify navigation via keyboard', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const columns = (await child.grid.getColumnsNamesArray());
                const index = columns.find((x) => x.text === data.childWithSpecificPermissions.largeList.name).index;
                const nextColumn = columns.find((x) => x.index === index + 1).text;
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithSpecificPermissions.largeList.name).click('container');
                await app.ui.pressKey('tab');
                await t
                    .expect(await record.isCellFocused(nextColumn)).ok()
                    .expect(await record.getField(nextColumn).isPresent('input')).notOk();
            });
            await app.step('Add Edit permissions for controls in one of the active group', async () => {
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                const child = data.childWithSpecificPermissions;
                const applicationSecurity = data.childWithSpecificPermissions.childApplicationSecurity;
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.checkbox.name, { editPermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.combobox.name, { editPermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.datepicker.name, { editPermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.hierarchy.name, { editPermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.largeList.name, { editPermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.linkedfile.name, { editPermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.multiLine.name, { editPermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.numeric.name, { editPermission: true });
                await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.singleLine.name, { editPermission: true });
                await contentGroup.save();
            });
            await app.step('Refresh page and open the child without permissions', async () => {
                await app.ui.refresh();
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify controls on the child grid', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.checkbox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.combobox.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.datepicker.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.hierarchy.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.largeList.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.linkedfile.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.multiLine.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.numeric.name)).notOk()
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name)).notOk();
            });
        })
        .after(async () => {
            if (index === dataSet.length - 1 || globalConfig.brief) {
                await app.step('Set Edit permissions back for controls in child', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    for (const group of [globalConfig.user.contentGroup, additionalActiveCG]) {
                        await contentGroup.openContentGroup(group);
                        for (let element of dataSet) {
                            const child = element.childWithSpecificPermissions;
                            const applicationSecurity = element.childWithSpecificPermissions.childApplicationSecurity;
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.checkbox.name, { editPermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.combobox.name, { editPermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.datepicker.name, { editPermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.hierarchy.name, { editPermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.largeList.name, { editPermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.linkedfile.name, { editPermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.multiLine.name, { editPermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.numeric.name, { editPermission: true });
                            await contentGroup.setApplicationSecurity(applicationSecurity + '>' + child.singleLine.name, { editPermission: true });
                        }
                        await contentGroup.save();
                    }
                });
            }
            await app.step('Remove records from child with conditions', async () => {
                await app.api.removeAllChildRecords(Number(data.recordId), data.defTemplate, data.childWithSpecificPermissions.name);
            });
            await app.step('Delete created record with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([record.respData]);
                } catch (err) {}
            });
        });
    });

dataSet.forEach((data, index) => {
    let record;
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Create record and fill with data (API)', async () => {
                await app.api.login();
                record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = record.respData.Record.MasterId.toString();
                data.recordName = record.reqData.recordName;
            });
            await app.step('Add records to the child without Edit control permissions', async () => {
                await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                    [{
                        childName: data.childWithSpecificPermissions.name,
                        rows: [
                            { properties: [
                                data.childWithSpecificPermissions.singleLine,
                                { name: data.childWithSpecificPermissions.multiLine.name,
                                    value: 'Fit condition' },
                                { name: data.childWithSpecificPermissions.condition.columnName,
                                    value: data.childWithSpecificPermissions.condition.valueFitCondition } ] },
                            { properties: [
                                data.childWithSpecificPermissions.singleLine,
                                { name: data.childWithSpecificPermissions.multiLine.name,
                                    value: 'Doesn\'t fit condition' },
                                { name: data.childWithSpecificPermissions.condition.columnName,
                                    value: data.childWithSpecificPermissions.condition.valueDoesNotFitCondition } ] }
                        ]
                    }]);
            });
            if (index === 0) {
                await app.step('Add conditional permissions in child field', async () => {
                    await app.api.login();
                    const contentGroup = app.api.administration.contentGroup;
                    await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    for (let element of dataSet) {
                        await contentGroup.setApplicationSecurityWithCondition(
                            `${element.childWithSpecificPermissions.childApplicationSecurity}>${element.childWithSpecificPermissions.condition.columnName}`,
                            {editCondition: element.childWithSpecificPermissions.condition.name}
                            );
                    }
                    await contentGroup.save();
                });
            }
        })
        (`Conditional Edit permissions for a field in child on Data Entry Form (${data.ipType} - Steps 16)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open child conditional edit permissions in field', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.childWithSpecificPermissions.name);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify field with value that fits the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueFitCondition);
                const record = await child.grid.getRecord(recordIndex);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.condition.columnName)).notOk();

                await record.getField(data.childWithSpecificPermissions.condition.columnName, data.childWithSpecificPermissions.condition.controlType)
                    .fill(data.childWithSpecificPermissions.condition.valueFitCondition2);
                await child.pressKey('tab');
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.condition.columnName)).notOk();

                await child.resetChanges();
                await app.ui.modal.confirm();
            });
            await app.step('Verify record with field that doesn\'t fit the condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueDoesNotFitCondition);
                const record = await child.grid.getRecord(recordIndex);
                const controlsWithPermissions = data.childWithSpecificPermissions.allControls.filter((x) => x !== data.childWithSpecificPermissions.condition.columnName);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.condition.columnName)).ok()
                    .expect(controlsWithPermissions.some((x) => record.isFieldReadOnly(x))).ok();
            });
            await app.step('Add record with value in field that fit condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithSpecificPermissions.condition.columnName, data.childWithSpecificPermissions.condition.controlType)
                    .fill(data.childWithSpecificPermissions.condition.valueFitCondition2);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.condition.columnName)).notOk()
                    .expect(await record.getValue(data.childWithSpecificPermissions.condition.columnName)).eql(data.childWithSpecificPermissions.condition.valueFitCondition2)
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.singleLine.name)).notOk();
            });
            await app.step('Save record and verify field', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueFitCondition2);
                const record = await child.grid.getRecord(recordIndex);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.condition.columnName)).notOk();
            });
            await app.step('Add record with value in field that doesn\'t fit condition', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.childWithSpecificPermissions.condition.columnName, data.childWithSpecificPermissions.condition.controlType)
                    .fill(data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.condition.columnName)).notOk()
                    .expect(await record.getValue(data.childWithSpecificPermissions.condition.columnName)).eql(data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2);
            });
            await app.step('Save record and verify field', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const recordIndex = await child.grid.getRowIndexByColumnValue(data.childWithSpecificPermissions.condition.columnName,
                    data.childWithSpecificPermissions.condition.valueDoesNotFitCondition2);
                const record = await child.grid.getRecord(recordIndex);
                await t
                    .expect(await record.isFieldReadOnly(data.childWithSpecificPermissions.condition.columnName)).ok();
            });
        })
        .after(async () => {
            if (index === dataSet.length - 1 || globalConfig.brief) {
                await app.step('Set Edit permissions back for controls in child', async () => {
                    await app.api.login();
                    const contentGroup = await app.api.administration.contentGroup;
                    await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                    for (let element of dataSet) {
                        await contentGroup.setApplicationSecurity(
                            element.childWithSpecificPermissions.childApplicationSecurity + '>' + element.childWithSpecificPermissions.condition.columnName,
                            { editPermission: true });
                        }
                    await contentGroup.save();
                });
            }
            await app.step('Remove records from child with conditions', async () => {
                await app.api.removeAllChildRecords(Number(data.recordId), data.defTemplate, data.childWithSpecificPermissions.name);
            });
            await app.step('Delete created record with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([record.respData]);
                } catch (err) {}
            });
        });
    });
