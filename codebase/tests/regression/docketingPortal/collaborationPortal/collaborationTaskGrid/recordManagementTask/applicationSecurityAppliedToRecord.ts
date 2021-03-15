import app from '../../../../../../app';
import { t } from 'testcafe';
declare const globalConfig: any;
const userData = require('../../../../../../configuration/data/users');

const user1 = 'testRegression1';
const contentGroupOfUser1 = userData[user1].contentGroup;
const user2 = 'testRegression2';
const contentGroupOfUser2 = userData[user2].contentGroup;

fixture `REGRESSION.collaborationPortal.pack. - Test ID 30548: Collaboration Portal_Record Management Task_Application security applied to the record`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
            await app.api.setContentGroupActivity(contentGroupOfUser2, true);
            await app.api.setContentGroupDefaults(contentGroupOfUser2);
        });
    });

const dataSet = (function() {
    const fullData = [
        {
            brief: 'true',
            ipType: 'PatentMasters',
            filingSectionPath: 'PatentMasters>PATENTS',
            name: 'Patent',
            firstColumnName: 'Docket Number',
            permissions: {
                visible: {
                    field: 'Country / Region',
                    wholeChild: {
                        name: 'Data1',
                        fieldName: 'Text #2',
                        value: 'Test'
                    },
                    childWithField: {
                        name: 'Actions',
                        fieldName: 'Action',
                        value: 'Written Opinion - (WOP)'
                    }
                },
                edit: {
                    field: 'Case Type',
                    wholeChild: {
                        name: 'Expenses',
                        fieldName: 'Payto Code',
                        value: 'Exp - (Abcd)'
                    },
                    childWithField: {
                        name: 'Actions',
                        fieldName: 'Action Due Date',
                        value: '10/18/2001'
                    }
                }
            },
            processes: {
                matter: {
                    name: 'Matter Process for TA (Patent)',
                    query: 'TA PA All Cases',
                    task: {
                        name: 'RM',
                        resource: 'TA DEF for Patent'
                    }
                },
                action: {
                    name: 'Action Process for TA (Patent)',
                    task: {
                        name: 'RM',
                        resource: 'TA DEF for Patent'
                    }
                }
            }
        },
        {
            brief: 'false',
            ipType: 'TrademarkMasters',
            filingSectionPath: 'TrademarkMasters>TRADEMARKS',
            name: 'Trademark',
            firstColumnName: 'Docket Number',
            permissions: {
                visible: {
                    field: 'Country / Region',
                    wholeChild: {
                        name: 'Data1',
                        fieldName: 'Text #2',
                        value: 'Test'
                    },
                    childWithField: {
                        name: 'Actions',
                        fieldName: 'Action',
                        value: 'Abandoned - (ABN)'
                    }
                },
                edit: {
                    field: 'Status',
                    wholeChild: {
                        name: 'Expenses',
                        fieldName: 'Payto Code',
                        value: 'Payto - (PYT)'
                    },
                    childWithField: {
                        name: 'Actions',
                        fieldName: 'Action Due Date',
                        value: '10/18/2001'
                    }
                }
            },
            processes: {
                matter: {
                    name: 'Matter Process for TA (Trademark)',
                    query: 'TA TM All Cases',
                    task: {
                        name: 'RM',
                        resource: 'TA DEF for Trademark'
                    }
                },
                action: {
                    name: 'Action Process for TA (Trademark)',
                    task: {
                        name: 'RM',
                        resource: 'TA DEF for Trademark'
                    }
                }
            }
        },
        {
            brief: 'false',
            ipType: 'DisclosureMasters',
            filingSectionPath: 'DisclosureMasters>DISCLOSURES',
            name: 'Disclosure',
            firstColumnName: 'Disclosure Number',
            permissions: {
                visible: {
                    field: 'Business Unit',
                    wholeChild: {
                        name: 'Text',
                        fieldName: 'Text Type',
                        value: 'Designations - (DSG)'
                    },
                    childWithField: {
                        name: 'Actions',
                        fieldName: 'Action',
                        value: '1st Office Action - (1OA)'
                    }
                },
                edit: {
                    field: 'Status',
                    wholeChild: {
                        name: 'Expenses',
                        fieldName: 'Payto Code',
                        value: 'Exp - (Cdef)'
                    },
                    childWithField: {
                        name: 'Actions',
                        fieldName: 'Completed Date',
                        value: '10/18/2001'
                    }
                }
            },
            processes: {
                matter: {
                    name: 'Matter Process for TA (Disclosure)',
                    query: 'TA DS All Cases',
                    task: {
                        name: 'RM',
                        resource: 'TA DEF for Disclosure'
                    }
                },
                action: {
                    name: 'Action Process for TA (Disclosure)',
                    task: {
                        name: 'RM',
                        resource: 'TA DEF for Disclosure'
                    }
                }
            }
        },
        {
            brief: 'false',
            ipType: 'GeneralIP1Masters',
            filingSectionPath: 'GeneralIP1Masters>GENERALIP1',
            name: 'GeneralIP1',
            firstColumnName: 'Agreement Number',
            permissions: {
                visible: {
                    field: 'Jurisdiction',
                    wholeChild: {
                        name: 'Text',
                        fieldName: 'Text Type',
                        value: 'Addendum - (ADD)'
                    },
                    childWithField: {
                        name: 'Actions',
                        fieldName: 'Action',
                        value: 'Audit - (AUD)'
                    }
                },
                edit: {
                    field: 'Relationship',
                    wholeChild: {
                        name: 'Expenses',
                        fieldName: 'Payto Code',
                        value: 'Payto - (payti)'
                    },
                    childWithField: {
                        name: 'Actions',
                        fieldName: 'Action Due Date',
                        value: '10/18/2001'
                    }
                }
            },
            processes: {
                matter: {
                    name: 'Matter Process for TA (GeneralIP)',
                    query: 'TA GIP1 All Cases',
                    task: {
                        name: 'RM',
                        resource: 'TA DEF for GeneralIP1'
                    }
                },
                action: {
                    name: 'Action process for TA (GeneralIP)',
                    task: {
                        name: 'RM',
                        resource: 'TA DEF for GeneralIP1'
                    }
                }
            }
        }
    ];
    return fullData;
})();

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Change control permissions in content group', async () => {
                await app.api.login(user1);
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(contentGroupOfUser2);
                await contentGroup.setApplicationSecurity(data.filingSectionPath + '>' + data.permissions.visible.field,
                    { visiblePermission: false, editPermission: false });
                await contentGroup.setApplicationSecurity(data.ipType + '>' + data.permissions.visible.wholeChild.name.toUpperCase(),
                    { visiblePermission: false, editPermission: false });
                await contentGroup.setApplicationSecurity(data.ipType + '>' + data.permissions.visible.childWithField.name.toUpperCase()
                    + '>' + data.permissions.visible.childWithField.fieldName, { visiblePermission: false, editPermission: false });
                await contentGroup.setApplicationSecurity(data.filingSectionPath + '>' + data.permissions.edit.field,
                    { editPermission: false });
                await contentGroup.setApplicationSecurity(data.ipType + '>' + data.permissions.edit.wholeChild.name.toUpperCase(),
                    { editPermission: false });
                await contentGroup.setApplicationSecurity(data.ipType + '>' + data.permissions.edit.childWithField.name.toUpperCase()
                    + '>' + data.permissions.edit.childWithField.fieldName, { editPermission: false });
                await contentGroup.save();
            });
            await app.step('Create record and set child values', async () => {
                const record = await app.api.combinedFunctionality.createRecord(data.name, 'simple');
                app.memory.current.createRecordData = record;
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(record.respData.Record.MasterId, data.processes.matter.task.resource);
                await dataEntry.openChild(data.permissions.edit.wholeChild.name);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(data.permissions.edit.wholeChild.fieldName, data.permissions.edit.wholeChild.value);

                await dataEntry.openChild(data.permissions.edit.childWithField.name);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(data.permissions.edit.childWithField.fieldName, data.permissions.edit.childWithField.value);

                await dataEntry.openChild(data.permissions.visible.wholeChild.name);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(data.permissions.visible.wholeChild.fieldName, data.permissions.visible.wholeChild.value);

                await dataEntry.openChild(data.permissions.edit.childWithField.name);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(data.permissions.visible.childWithField.fieldName, data.permissions.visible.childWithField.value);
                await dataEntry.save();
            });
        })
        (`Application security applied to the record (Matter - ${data.ipType})`, async () => {
            await app.step('Add content group to process (API)', async () => {
                const designer = app.api.administration.processDesigner;
                await designer.open(data.processes.matter.name);
                await designer.setContentGroups(contentGroupOfUser2);
                await designer.save();
            });
            await app.step('Add records to collaboration process (API)', async () => {
                await app.api.login(user2);
                await app.api.query.runQuery(data.name + '>' + data.processes.matter.query);
                await app.api.query.collaborateRecords(data.processes.matter.name, 5);
            });
            await app.step('Log in Docketing Portal as User 2 and go to Collaboration portal (Step 4)', async () => {
                await app.ui.getRole(user2, '/UI/collaboration');
                await app.ui.waitLoading();
            });
            await app.step(`Open the '${data.processes.matter.task.name}' task of the '${data.processes.matter.name}' process`, async () => {
                await app.ui.collaborationBoard.getProcess(data.processes.matter.name).getTask(data.processes.matter.task.name).open();
                await app.ui.waitLoading();
            });
            await app.step('Open first record in the grid', async () => {
                const firstColumn = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray())[1].text;
                await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.getField(firstColumn).getValue()).eql(app.memory.current.createRecordData.reqData.recordName);
            });
            await app.step('Verify fields without edit and visible permissions (Step 5, 6)', async () => {
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.permissions.visible.field).isPresent()).notOk()
                    .expect(await app.ui.dataEntryBoard.getField(data.permissions.edit.field).isLocked()).ok();
            });
            await app.step('Verify field without visible permission in child', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.visible.childWithField.name);
                await app.ui.waitLoading();
                const columns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray()).map((x) => x.text);
                await t
                    .expect(columns.includes(data.permissions.visible.childWithField.fieldName)).notOk();
            });
            await app.step('Verify field without edit permissions in child', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.visible.childWithField.name);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
                const record = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await t
                    .expect(await record.isFieldReadOnly(data.permissions.edit.childWithField.fieldName)).ok();
                const otherColumns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .slice(1)
                    .map((x) => x.text)
                    .filter((x) => x !== data.permissions.edit.childWithField.fieldName);
                for (let column of otherColumns) {
                    await t
                        .expect(await record.isFieldReadOnly(column)).notOk(`The ${column} is not read only`);
                }
            });
            await app.step('Verify child without visible permission (Step 7)', async () => {
                await t
                    .expect((await app.ui.dataEntryBoard.getChildRecordsNames()).includes(data.permissions.visible.wholeChild.name)).notOk();
            });
            await app.step('Verify child without edit permissions (Step 8)', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.edit.wholeChild.name);
                await app.ui.waitLoading();
                const record = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const columns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray()).slice(1).map((x) => x.text);
                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).notOk();
                for (let column of columns) {
                    await t
                        .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).notOk()
                        .expect(await record.isFieldReadOnly(column)).ok(`The ${column} is not read only`);
                }
            });
            await app.step('Remove all edit permissions for IP Type in Content Group (Step 11 - API)', async () => {
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(contentGroupOfUser2);
                await contentGroup.setAppSecurityDefaults();
                await contentGroup.setApplicationSecurity(data.ipType, { editPermission: false});
                await contentGroup.save();
            });
            await app.step('Go to Collaboration Portal (Step 12)', async () => {
                await app.ui.naviBar.click('links', 'Collaboration Portal');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
            });
            await app.step('Open task', async () => {
                await app.ui.collaborationBoard.getProcess(data.processes.matter.name).getTask(data.processes.matter.task.name).open();
                await app.ui.waitLoading();
            });
            await app.step('Open the record and verify the fields', async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.dataEntryBoard.areNoInputsInFields()).ok('Not all fields are read-only');
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.edit.wholeChild.name);
                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).notOk();
                const record = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const columns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .slice(1)
                    .map((x) => x.text);
                for (let column of columns) {
                    await t
                        .expect(await record.isFieldReadOnly(column)).ok(`The ${column} is not read only`);
                }
            });
            await app.step('Add permissions for child records in Content Group (Step 13 - API)', async () => {
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(contentGroupOfUser2);
                await contentGroup.setAppSecurityDefaults();
                await contentGroup.setApplicationSecurity(data.filingSectionPath, { editPermission: false});
                await contentGroup.save();
            });
            await app.step('Go to Collaboration Portal (Step 14)', async () => {
                await app.ui.naviBar.click('links', 'Collaboration Portal');
                await app.ui.waitLoading();
            });
            await app.step('Open task', async () => {
                await app.ui.collaborationBoard.getProcess(data.processes.matter.name).getTask(data.processes.matter.task.name).open();
                await app.ui.waitLoading();
            });
            await app.step('Open the record and verify the fields', async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.dataEntryBoard.areNoInputsInFields()).ok('Not all fields are read-only');
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.edit.childWithField.name);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
                await app.ui.waitLoading();
                const record = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const columns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .slice(1)
                    .map((x) => x.text);
                for (let column of columns) {
                    await t
                        .expect(await record.isFieldReadOnly(column)).notOk(`The ${column} is read only`);
                }
            });
        })
        .after(async () => {
            await app.step('Remove all records from collaboration task (API)', async () => {
                await app.api.collaboration.executeTask(data.processes.matter.name, data.processes.matter.task.name);
                await app.api.collaboration.removeAllRecords();
            });
            await app.step('Delete created record (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
                } catch (err) {}
            });
            await app.step('Reset content group to default values (API)', async () => {
                await app.setDefaults(user2);
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Change control permissions in content group (API)', async () => {
                await app.api.login(user1);
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(contentGroupOfUser2);
                await contentGroup.setApplicationSecurity(data.filingSectionPath + '>' + data.permissions.visible.field,
                    { visiblePermission: false, editPermission: false });
                await contentGroup.setApplicationSecurity(data.ipType + '>' + data.permissions.visible.wholeChild.name.toUpperCase(),
                    { visiblePermission: false, editPermission: false });
                await contentGroup.setApplicationSecurity(data.ipType + '>' + data.permissions.visible.childWithField.name.toUpperCase()
                    + '>' + data.permissions.visible.childWithField.fieldName, { visiblePermission: false, editPermission: false });
                await contentGroup.setApplicationSecurity(data.filingSectionPath + '>' + data.permissions.edit.field,
                    { editPermission: false });
                await contentGroup.setApplicationSecurity(data.ipType + '>' + data.permissions.edit.wholeChild.name.toUpperCase(),
                    { editPermission: false });
                await contentGroup.setApplicationSecurity(data.ipType + '>' + data.permissions.edit.childWithField.name.toUpperCase()
                    + '>' + data.permissions.edit.childWithField.fieldName, { editPermission: false });
                await contentGroup.save();
            });
            await app.step('Update record and set child values (API)', async () => {
                await app.api.collaboration.executeTask(data.processes.action.name, data.processes.action.task.name);
                const ids = await app.api.collaboration.getRecordIdsFromResults();
                app.memory.current.masterId = ids[0];
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.masterId, data.processes.action.task.resource);
                app.memory.current.recordName = await dataEntry.getValue(data.firstColumnName);
                await dataEntry.openChild(data.permissions.edit.wholeChild.name);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(data.permissions.edit.wholeChild.fieldName, data.permissions.edit.wholeChild.value);

                await dataEntry.openChild(data.permissions.edit.childWithField.name);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(data.permissions.edit.childWithField.fieldName, data.permissions.edit.childWithField.value);

                await dataEntry.openChild(data.permissions.visible.wholeChild.name);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(data.permissions.visible.wholeChild.fieldName, data.permissions.visible.wholeChild.value);

                await dataEntry.openChild(data.permissions.edit.childWithField.name);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(data.permissions.visible.childWithField.fieldName, data.permissions.visible.childWithField.value);
                await dataEntry.save();
            });
        })
        (`Application security applied to the record (Action - ${data.ipType})`, async () => {
            await app.step('Add content group to process (API)', async () => {
                const designer = app.api.administration.processDesigner;
                await designer.open(data.processes.action.name);
                await designer.setContentGroups(contentGroupOfUser2);
                await designer.save();
            });
            await app.step('Log in Docketing Portal as User 2 and go to Collaboration Portal (Step 4)', async () => {
                await app.ui.getRole(user2, '/UI/collaboration');
                await app.ui.waitLoading();
            });
            await app.step('Open task', async () => {
                await app.ui.collaborationBoard.getProcess(data.processes.action.name).getTask(data.processes.action.task.name).open();
                await app.ui.waitLoading();
            });
            await app.step('Open first record in the grid', async () => {
                const firstColumn = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray())[1].text;
                await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.recordName);
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.getField(firstColumn).getValue()).eql(app.memory.current.recordName);
            });
            await app.step('Verify fields without edit and visible permissions (Step 5, 6)', async () => {
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.permissions.visible.field).isPresent()).notOk()
                    .expect(await app.ui.dataEntryBoard.getField(data.permissions.edit.field).isLocked()).ok();
            });
            await app.step('Verify field without visible permission in child', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.visible.childWithField.name);
                await app.ui.waitLoading();
                const columns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray()).map((x) => x.text);
                await t
                    .expect(columns.includes(data.permissions.visible.childWithField.fieldName)).notOk();
            });
            await app.step('Verify field without edit permissions in child', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.visible.childWithField.name);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
                const record = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await t
                    .expect(await record.isFieldReadOnly(data.permissions.edit.childWithField.fieldName)).ok();
                const otherColumns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .slice(1)
                    .map((x) => x.text)
                    .filter((x) => x !== data.permissions.edit.childWithField.fieldName);
                for (let column of otherColumns) {
                    await t
                        .expect(await record.isFieldReadOnly(column)).notOk(`The ${column} is not read only`);
                }
            });
            await app.step('Verify child without visible permission (Step 7)', async () => {
                await t
                    .expect((await app.ui.dataEntryBoard.getChildRecordsNames()).includes(data.permissions.visible.wholeChild.name)).notOk();
            });
            await app.step('Verify child without edit permissions (Step 8)', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.edit.wholeChild.name);
                await app.ui.waitLoading();
                const record = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const columns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray()).slice(1).map((x) => x.text);
                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).notOk();
                for (let column of columns) {
                    await t
                        .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).notOk()
                        .expect(await record.isFieldReadOnly(column)).ok(`The ${column} is not read only`);
                }
            });
            await app.step('Remove all edit permissions for IP Type in Content Group (Step 11 - API)', async () => {
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(contentGroupOfUser2);
                await contentGroup.setAppSecurityDefaults();
                await contentGroup.setApplicationSecurity(data.ipType, { editPermission: false});
                await contentGroup.save();
            });
            await app.step('Go to Collaboration Portal (Step 12)', async () => {
                await app.ui.naviBar.click('links', 'Collaboration Portal');
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();
            });
            await app.step('Open task', async () => {
                await app.ui.collaborationBoard.getProcess(data.processes.action.name).getTask(data.processes.action.task.name).open();
                await app.ui.waitLoading();
            });
            await app.step('Open the record and verify the fields', async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.recordName);
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.dataEntryBoard.areNoInputsInFields()).ok('Not all fields are read-only');
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.edit.wholeChild.name);
                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.isEnabled('addNewButton')).notOk();
                const record = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const columns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .slice(1)
                    .map((x) => x.text);
                for (let column of columns) {
                    await t
                        .expect(await record.isFieldReadOnly(column)).ok(`The ${column} is not read only`);
                }
            });
            await app.step('Add permissions for child records in Content Group (Step 13 - API)', async () => {
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(contentGroupOfUser2);
                await contentGroup.setAppSecurityDefaults();
                await contentGroup.setApplicationSecurity(data.filingSectionPath, { editPermission: false});
                await contentGroup.save();
            });
            await app.step('Go to Collaboration Portal (Step 14)', async () => {
                await app.ui.naviBar.click('links', 'Collaboration Portal');
                await app.ui.waitLoading();
            });
            await app.step('Open task', async () => {
                await app.ui.collaborationBoard.getProcess(data.processes.action.name).getTask(data.processes.action.task.name).open();
                await app.ui.waitLoading();
            });
            await app.step('Open the record and verify the fields', async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.recordName);
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.dataEntryBoard.areNoInputsInFields()).ok('Not all fields are read-only');
                await app.ui.dataEntryBoard.selectChildRecord(data.permissions.edit.childWithField.name);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
                await app.ui.waitLoading();
                const record = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const columns = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .slice(1)
                    .map((x) => x.text);
                for (let column of columns) {
                    await t
                        .expect(await record.isFieldReadOnly(column)).notOk(`The ${column} is read only`);
                }
            });
        })
        .after(async () => {
            await app.step('Reset content group to default values (API)', async () => {
                await app.setDefaults(user2);
            });
        });
    });
