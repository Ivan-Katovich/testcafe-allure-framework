import app from '../../../../app';
const userData = require('../../../../configuration/data/users');
declare const globalConfig: any;

const user1 = globalConfig.user;
const contentGroupOfUser1 = globalConfig.user.contentGroup;
const user2 = 'testRegression2';
const contentGroupOfUser2 = userData[user2].contentGroup;

fixture `REGRESSION.dataEntryForm.pack. - Test ID 30011: DEF_Filing Section and Child Tabs`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

let record;
const createdRecords = [];

[
    {   recordType: 'Patent',
        recordId: 0,
        query: 'Patent>TA PA All Cases',
        columnName: 'COUNTRY',
        conditionField: {name: 'Country / Region', type: 'autocomplete'},
        conditionVisible: {name: 'US - (United States)', code: 264},
        conditionHidden: {name: 'FI - (Finland)', code: 85},
        condition: {node: 'PatentMasters', name: 'TA Country US'},
        def: 'TA DEF for PA - childIDs',
        brief: 'true'
    },
    {   recordType: 'Trademark',
        recordId: 0,
        query: 'Trademark>TM All Cases TA filter',
        columnName: 'COUNTRY',
        conditionField: {name: 'Country / Region', type: 'autocomplete'},
        conditionVisible: {name: 'US - (United States)', code: 264},
        conditionHidden: {name: 'FI - (Finland)', code: 85},
        condition: {node: 'TrademarkMasters', name: 'US Records'},
        def: 'TA DEF for TM - childIDs',
        brief: 'false'
    },
    {   recordType: 'Disclosure',
        recordId: 0,
        query: 'Disclosure>TA DS All Cases',
        columnName: 'CUSTOMCODE#4',
        conditionField: {name: 'Status', type: 'autocomplete'},
        conditionVisible: {name: 'New submission - (NEW)', code: 'SDP0100000'},
        conditionHidden: {name: 'Decision Finalized - (DEC)', code: 'SDP0100002'},
        condition: {node: 'DisclosureMasters', name: 'TA New submissions only'},
        def: 'TA DEF for DS - childIDs',
        brief: 'false'
    },
    {   recordType: 'GeneralIP1',
        recordId: 0,
        query: 'GeneralIP1>TA GIP1 All Cases',
        columnName: 'KEYCOUNTRY',
        conditionField: {name: 'Jurisdiction', type: 'autocomplete'},
        conditionVisible: {name: 'US - (United States)', code: 264},
        conditionHidden: {name: 'FI - (Finland)', code: 85},
        condition: {node: 'GeneralIP1Masters', name: 'TA Jurisdiction US'},
        def: 'TA DEF for GIP1 - childIDs',
        brief: 'false'
    }
].forEach((data) => {
    test
    // .only
    .meta('brief', data.brief)
    .before(async () => {
        await app.step(`Create a ${data.recordType} record with the '${data.conditionVisible.name}' field value (API)`, async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: data.columnName, Value: data.conditionVisible.code}
            ]);
            record = app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.recordType, 'simple', false, modifier);
            data.recordId = record.respData.Record.MasterId.toString();
            createdRecords.push(record);
        });
        await app.step(`Create a ${data.recordType} record with the '${data.conditionHidden.name}' field value (API)`, async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: data.columnName, Value: data.conditionHidden.code}
            ]);
            record = app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.recordType, 'simple', false, modifier);
            createdRecords.push(record);
        });
        await app.step(`Apply conditional security to the user's content group (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(contentGroupOfUser1);
            await cg.setApplicationSecurityWithCondition(data.condition.node, {visibleCondition: data.condition.name});
            await cg.save();
        });
    })
    (`Verify ${data.recordType} DEF shows all values in '${data.conditionField.name}' when Conditional security is applied to the content group (Steps 2-3, 13)`, async (t: TestController) => {
        await app.step(`Login`, async () => {
            await app.ui.getRole(undefined, '/UI/queries');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Run the '${data.query}' query and verify only the records with '${data.conditionVisible.name}' are displayed in the result grid`, async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading({checkErrors: true});
            let columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.conditionField.name);
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.conditionField.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const checkboxes = await filter.getAllCheckboxLabelsWithValues();
            const filterItemLabels = checkboxes.map((x) => x.name);

            await t
                .expect(columnValues.includes(data.conditionHidden.name)).notOk()
                .expect(filterItemLabels.filter((x) => x !== 'Select All').every((x) => x === data.conditionVisible.name)).ok();
        });
        await app.step(`Open the '${data.def}' data entry form`, async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem(data.def);
            await app.ui.waitLoading({checkErrors: true});

            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('fields', data.conditionField.name)).ok();
        });
        let expectedItemsList;
        await app.step(`Get expected items list (API)`, async () => {
            await app.api.dataEntryForm.openRecord(Number(data.recordId), data.def);
            expectedItemsList = (await app.api.dataEntryForm.getFieldAllPossibleValues(data.conditionField.name))
                .map((x) => x.trim()).sort();
        });
        await app.step(`Verify the ${data.conditionField.name} contains all ${data.recordType} items`, async () => {
            const defField = await app.ui.dataEntryBoard.getField(data.conditionField.name, data.conditionField.type);
            await defField.expandWholeList();
            const defItemsList = await defField.getAllDisplayedOptions();

            await t
                .expect(app.services.array.areEquivalent(expectedItemsList, defItemsList)).ok();
        });
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
        await app.step(`Remove conditional security from the content group of the user (API) `, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(contentGroupOfUser1);
            await cg.setAppSecurityDefaults();
            await cg.save();
        });
    });
});

[
    { recordType: 'Patent',
        recordId: 0,
        def: { name: 'TA DEF for PA - childIDs', id: 61345},
        defFields: [
            {name: 'Docket Number', type: 'input', value: `patent${app.services.time.timestampShort()}UI`},
            {name: 'Country / Region', type: 'autocomplete', value: 'US - (United States)'},
            {name: 'Case Type', type: 'autocomplete', value: 'Regular - (REG)'},
            {name: 'Relation Type', type: 'autocomplete', value: 'Original Filing - (ORG)'},
            {name: 'Filing Type', type: 'autocomplete', value: 'National - (NAT)'}
        ],
        defUpdates: [
            {name: 'Docket Number', type: 'input', value: `patent${app.services.time.timestampShort()}UI-UPD`},
            {name: 'Country / Region', type: 'autocomplete', value: 'FR - (France)'}
        ],
        child: 'Actions',
        childFields: [
            {name: 'Action', type: 'hierarchy', value: 'Abstract Due - (ABSD)'},
            {name: 'Action Due Date', type: 'datepicker', value: app.services.time.tomorrow('MM/DD/YYYY')}
        ],
        childUpdates: [
            {name: 'Action', type: 'hierarchy', value: 'Claims Fee - (CLF)'},
            {name: 'Action Due Date', type: 'datepicker', value: app.services.time.today('MM/DD/YYYY')}
        ],
        defAudit: {
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
        },
        childAudit: {
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
        },
        brief: 'true'
    },
    { recordType: 'Trademark',
        recordId: 0,
        def: { name: 'TA DEF for TM - childIDs', id: 61346},
        defFields: [
            {name: 'Docket Number', type: 'input', value: `trademark${app.services.time.timestampShort()}UI`},
            {name: 'Country / Region', type: 'autocomplete', value: 'US - (United States)'},
            {name: 'Case Type', type: 'autocomplete', value: 'Regular - (REG)'},
            {name: 'Filing Type', type: 'autocomplete', value: 'National - (NAT)'}
        ],
        defUpdates: [
            {name: 'Docket Number', type: 'input', value: `trademark${app.services.time.timestampShort()}UI-UPD`},
            {name: 'Country / Region', type: 'autocomplete', value: 'FR - (France)'}
        ],
        child: 'Actions',
        childFields: [
            {name: 'Action', type: 'autocomplete', value: 'Affidavit Due - (AFF)'},
            {name: 'Action Due Date', type: 'datepicker', value: app.services.time.tomorrow('MM/DD/YYYY')}
        ],
        childUpdates: [
            {name: 'Action', type: 'autocomplete', value: 'Brief Due - (BRF)'},
            {name: 'Action Due Date', type: 'datepicker', value: app.services.time.today('MM/DD/YYYY')}
        ],
        defAudit: {
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
        },
        childAudit: {
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
        },
        brief: 'false'
    },
    { recordType: 'Disclosure',
        recordId: 0,
        def: { name: 'TA DEF for DS - childIDs', id: 61344},
        defFields: [
            {name: 'Disclosure Number', type: 'input', value: `disclosure${app.services.time.timestampShort()}UI`},
            {name: 'Business Unit', type: 'autocomplete', value: 'Banner Electronics - (BAN-1)'}
        ],
        defUpdates: [
            {name: 'Disclosure Number', type: 'input', value: `disclosure${app.services.time.timestampShort()}UI-UPD`},
            {name: 'Business Unit', type: 'autocomplete', value: 'Chemical Division - (CD)'}
        ],
        child: 'Actions',
        childFields: [
            {name: 'Action', type: 'autocomplete', value: 'Abstract Due - (ABSD)'},
            {name: 'Due Date', type: 'datepicker', value: app.services.time.tomorrow('MM/DD/YYYY')}
        ],
        childUpdates: [
            {name: 'Action', type: 'autocomplete', value: 'Certified Copy - (CER)'},
            {name: 'Due Date', type: 'datepicker', value: app.services.time.today('MM/DD/YYYY')}
        ],
        defAudit: {
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
        },
        childAudit: {
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
        },
        brief: 'false'
    },
    { recordType: 'GeneralIP1',
        recordId: 0,
        def: { name: 'TA DEF for GIP1 - childIDs', id: 61347},
        defFields: [
            {name: 'Agreement Number', type: 'input', value: `gip1${app.services.time.timestampShort()}UI`},
            {name: 'Jurisdiction', type: 'autocomplete', value: 'ES - (Spain)'},
            {name: 'Relationship', type: 'autocomplete', value: 'Original - (ORG)'},
            {name: 'Agreement Type', type: 'autocomplete', value: 'License - (LIC)'}
        ],
        defUpdates: [
            {name: 'Agreement Number', type: 'input', value: `gip1${app.services.time.timestampShort()}UI-UPD`},
            {name: 'Jurisdiction', type: 'autocomplete', value: 'DE - (Germany)'}
        ],
        child: 'Actions',
        childFields: [
            {name: 'Action', type: 'autocomplete', value: 'Audit - (AUD)'},
            {name: 'Action Due Date', type: 'datepicker', value: app.services.time.tomorrow('MM/DD/YYYY')}
        ],
        childUpdates: [
            {name: 'Action', type: 'autocomplete', value: 'Defensive - (DEF)'},
            {name: 'Action Due Date', type: 'datepicker', value: app.services.time.today('MM/DD/YYYY')}
        ],
        defAudit: {
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
        },
        childAudit: {
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
        },
        brief: 'false'
    }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.createRecord)
        .before(async () => {
            await app.step(`Enable the content group of user '${user2}' (API)`, async () => {
                await app.api.setContentGroupActivity(contentGroupOfUser2, true);
                await app.api.setContentGroupDefaults(contentGroupOfUser2);
            });
        })
        (`Verify audit data and reset on ${data.recordType} DEF and a child tab (Steps 4-7, 13)`, async (t: TestController) => {
            await app.step(`Login with the main user`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Open the ${data.recordType} data entry form`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.def.name);
                await app.ui.waitLoading({checkErrors: true});

                await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok();
            });
            await app.step(`Fill some fields on the filing section and on the '${data.child}' child tab, and save the record`, async () => {
                await app.ui.dataEntryBoard.fillFieldsWithValue(data.defFields);
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.dataEntryBoard.childRecord.addNew();
                const childRow = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                for (const field of data.childFields) {
                    await childRow.getField(field.name, field.type).fill(field.value);
                }
                await app.ui.dataEntryBoard.save();

                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');

                record = app.ui.getLastResponseBody('createRecord');
                data.recordId = record.FilingSectionDefinition.RecordId;
            });
            await app.step(`Verify audit data on the filing section`, async () => {
                data.defAudit.createUser = await app.ui.dataEntryBoard.getField('Create User').getLockedValue();
                data.defAudit.createDate = await app.ui.dataEntryBoard.getField('Create Date').getLockedValue();
                data.defAudit.updateUser = await app.ui.dataEntryBoard.getField('Update User').getLockedValue();
                data.defAudit.updateDate = await app.ui.dataEntryBoard.getField('Update Date').getLockedValue();

                await t
                    .expect(data.defAudit.createUser).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.parseDate(data.defAudit.createDate).diff(app.services.time.moment(), 'minute', true)).lte(2) // localized server time can differ from the local time up to 2 minutes
                    .expect(data.defAudit.updateUser).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.parseDate(data.defAudit.updateDate).diff(app.services.time.moment(), 'minute', true)).lte(2)
                    .expect(data.defAudit.updateDate).eql(data.defAudit.createDate);
            });
            await app.step(`Verify audit data on the child section`, async () => {
                const childRow = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);

                data.childAudit.createUser = await childRow.getField('Create User').getLockedValue();
                data.childAudit.createDate = await childRow.getField('Create Date').getLockedValue();
                data.childAudit.updateUser = await childRow.getField('Update User').getLockedValue();
                data.childAudit.updateDate = await childRow.getField('Update Date').getLockedValue();

                await t
                    .expect(data.childAudit.createUser).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.parseDate(data.childAudit.createDate).diff(app.services.time.moment(), 'minute', true)).lte(2)
                    .expect(data.childAudit.updateUser).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.parseDate(data.childAudit.updateDate).diff(app.services.time.moment(), 'minute', true)).lte(2)
                    .expect(data.childAudit.updateDate).eql(data.childAudit.createDate);
            });
            await app.step(`Make changes on both filing and child sections`, async () => {
                await app.ui.dataEntryBoard.fillFieldsWithValue(data.defUpdates);

                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading({checkErrors: true});
                let childRow = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                for (const field of data.childUpdates) {
                    await childRow.getField(field.name, field.type).fill(field.value);
                }
                await app.ui.dataEntryBoard.childRecord.addNew();

                await t
                    .expect(await app.ui.dataEntryBoard.verifyFieldsValues(data.defUpdates)).ok()
                    .expect(await app.ui.dataEntryBoard.childRecord.getTotalCount()).eql(2);
                childRow = await app.ui.dataEntryBoard.childRecord.grid.getRecord(1);
                await t
                    .expect(await childRow.verifyFieldsValues(data.childUpdates)).ok();
            });
            await app.step(`Click 'Reset' on the '${data.child}' child tab and verify child tab is reset, filing section is not reset`, async () => {
                await app.ui.dataEntryBoard.childRecord.resetChanges();
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.dataEntryBoard.verifyFieldsValues(data.defUpdates)).ok()
                    .expect(await app.ui.dataEntryBoard.childRecord.getTotalCount()).eql(1);
                const childRow = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await t
                    .expect(await childRow.verifyFieldsValues(data.childFields)).ok();
            });
            await app.step(`Make changes on the child section again`, async () => {
                let childRow = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                for (const field of data.childUpdates) {
                    await childRow.getField(field.name, field.type).fill(field.value);
                }
                await app.ui.dataEntryBoard.childRecord.addNew();

                await t
                    .expect(await app.ui.dataEntryBoard.childRecord.getTotalCount()).eql(2);
                childRow = await app.ui.dataEntryBoard.childRecord.grid.getRecord(1);
                await t
                    .expect(await childRow.verifyFieldsValues(data.childUpdates)).ok();
            });
            await app.step(`Click 'Reset' on the filing section and verify both filing and child sections are reset`, async () => {
                await app.ui.dataEntryBoard.reset();
                await app.ui.confirmationModal.confirm();
                await app.ui.waitLoading({checkErrors: false});

                await t
                    .expect(await app.ui.dataEntryBoard.verifyFieldsValues(data.defFields)).ok()
                    .expect(await app.ui.dataEntryBoard.childRecord.getTotalCount()).eql(1);
                const childRow = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await t
                    .expect(await childRow.verifyFieldsValues(data.childFields)).ok();
            });
            await app.step(`Log in as user ${user2} and open the saved ${data.recordType} data entry form via a direct link`, async () => {
                app.ui.resetRole();
                await app.ui.getRole(user2, `UI/queries`);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.openDataEntryRecord(data.recordId, data.def.id);

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.getField(data.defFields[0].name, data.defFields[0].type).getValue()).eql(data.defFields[0].value);
            });
            await app.step(`Make updates on the filing section, save and verify the filing section audit fields`, async () => {
                await app.ui.dataEntryBoard.fillFieldsWithValue(data.defUpdates);
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});

                const currentCreateUser = await app.ui.dataEntryBoard.getField('Create User').getLockedValue();
                const currentCreateDate = await app.ui.dataEntryBoard.getField('Create Date').getLockedValue();
                const currentUpdateUser = await app.ui.dataEntryBoard.getField('Update User').getLockedValue();
                const currentUpdateDate = await app.ui.dataEntryBoard.getField('Update Date').getLockedValue();

                await t
                    .expect(currentCreateUser).eql(user1.userName)
                    .expect(currentCreateDate).eql(data.defAudit.createDate)
                    .expect(currentUpdateUser).eql(userData[user2].userName)
                    .expect(app.services.time.parseDate(currentUpdateDate).isAfter(app.services.time.parseDate(data.defAudit.updateDate))).ok()
                    .expect(app.services.time.parseDate(currentUpdateDate).diff(app.services.time.moment(), 'minute', true)).lte(2); // localized server time can differ from the local time up to 2 minutes
            });
            await app.step(`Expand the '${data.child}' child tab and verify child audit data did not change`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading({checkErrors: true});
                const childRow = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);

                const currentCreateUser = await childRow.getField('Create User').getLockedValue();
                const currentCreateDate = await childRow.getField('Create Date').getLockedValue();
                const currentUpdateUser = await childRow.getField('Update User').getLockedValue();
                const currentUpdateDate = await childRow.getField('Update Date').getLockedValue();

                await t
                    .expect(currentCreateUser).eql(user1.userName)
                    .expect(currentCreateDate).eql(data.childAudit.createDate)
                    .expect(currentUpdateUser).eql(user1.userName)
                    .expect(currentUpdateDate).eql(data.childAudit.createDate);
            });
        })
        .after(async () => {
            await app.step('Delete the created data entry records', async () => {
                try {
                    record = app.ui.getLastResponseBody('createRecord');
                    let recordToDel = {
                            Record: {
                                IpType: record.FilingSectionDefinition.IpType,
                                MasterId: record.FilingSectionDefinition.RecordId
                            },
                            ResourceId: app.ui.getLastRequestBody('createRecord').dataEntryFormTemplateResourceId
                        };
                    await app.api.combinedFunctionality.deleteRecords([recordToDel]);
                } catch (err) {}
            });
            await app.step(`Disable the content group of user '${user2}' (API)`, async () => {
                await app.api.setContentGroupActivity(contentGroupOfUser2, false);
            });
    });
});

[
    { recordType: 'Patent',
        query: 'Patent>TA PA All Cases',
        filterField: {name: 'Docket Number', type: 'input', operator: 'Contains', value: '1'},
        sortingField: 'PATENTMASTERID',
        dateField: {name: 'Create Date', type: 'datepicker', operator: 'Greater Than Or Equal To', value: app.services.time.startOfMonth('MM/DD/YYYY')},
        def: 'TA DEF for PA - childIDs',
        brief: 'true'
    },
    { recordType: 'Trademark',
        query: 'Trademark>TM All Cases TA filter',
        filterField: {name: 'Docket Number', type: 'input', operator: 'Contains', value: '1'},
        sortingField: 'TRADEMARKMASTERID',
        dateField: {name: 'Create Date', type: 'datepicker', operator: 'Greater Than Or Equal To', value: app.services.time.startOfMonth('MM/DD/YYYY')},
        def: 'TA DEF for TM - childIDs',
        brief: 'false'
    },
    { recordType: 'Disclosure',
        query: 'Disclosure>TA DS All Cases',
        filterField: {name: 'Disclosure Number', type: 'input', operator: 'Contains', value: '1'},
        sortingField: 'DISCLOSUREMASTERID',
        dateField: {name: 'Create Date', type: 'datepicker', operator: 'Greater Than Or Equal To', value: app.services.time.startOfMonth('MM/DD/YYYY')},
        def: 'TA DEF for DS - childIDs',
        brief: 'false'
    },
    { recordType: 'GeneralIP1',
        query: 'GeneralIP1>TA GIP1 All Cases',
        filterField: {name: 'Agreement Number', type: 'input', operator: 'Contains', value: '1'},
        sortingField: 'GENERALIP1MASTERID',
        dateField: {name: 'Create Date', type: 'datepicker', operator: 'Greater Than Or Equal To', value: app.services.time.startOfMonth('MM/DD/YYYY')},
        def: 'TA DEF for GIP1 - childIDs',
        brief: 'false'
    }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify navigation via 'Next' and 'Previous' buttons in the order ${data.recordType} DEF records are displayed in a query`, async (t: TestController) => {
            let orderedRecords = [];
            let filteredTotal;

            await app.step(`Login and run query`, async () => {
            await app.ui.getRole(user1.userType, '/UI/queries');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading({checkErrors: true});

            await t
                .expect(await app.ui.queryBoard.getMenuTotalCount({isNumber: true})).gt(0, `No records returned by the ${data.query} query`);
            });
            await app.step(`Set Criteria Builder filter for ${data.dateField.name}`, async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(data.dateField.name);
                await row.getField('Operator', 'autocomplete').fill(data.dateField.operator);
                const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', data.dateField.type);
                await field.fill(data.dateField.value);
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.queryBoard.getMenuTotalCount({isNumber: true})).gt(0, `No records returned by the ${data.query} query`);
            });
            await app.step(`Apply sorting and filtering to the query`, async () => {
                await app.ui.queryBoard.queryResultsGrid.clickHeader(data.sortingField);

                await app.ui.queryBoard.queryResultsGrid.openFilter(data.filterField.name);
                const filter = await app.ui.kendoPopup.getFilter(data.filterField.type);
                await filter.selectMethod(data.filterField.operator);
                await filter.addCriteria(data.filterField.value);
                await filter.confirm();
                await app.ui.waitLoading();
                const filteredValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.filterField.name);

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getCount()).gt(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getColumnSortingStatus(data.sortingField)).eql({isPresent: true, direction: 'ascending'})
                    .expect(filteredValues.every((x) => x.includes(data.filterField.value))).ok();

                orderedRecords = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.sortingField);
                filteredTotal = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            });
            await app.step(`Select the 'View in:' def template with several filing section tabs`, async () => {
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.def);
            });
            await app.step(`Open the first record and verify 'Record X of Y' text, the 'Previous' button is disabled, the 'Next' button is enabled`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Next')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Next')).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Previous')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Previous')).notOk();
            });
            await app.step(`Verify the record counter and identifier`, async () => {
                await t
                    .expect(await app.ui.dataEntryBoard.isPresent('recordCount')).ok();

                let recordCounterText = await app.ui.dataEntryBoard.getRecordCounter();
                let recordIdentifier = await app.ui.dataEntryBoard.getRecordIdentifier();

                await t
                    .expect(recordCounterText).eql(`Record 1 of ${filteredTotal}`)
                    .expect(recordIdentifier).contains(orderedRecords[0]);
            });
            await app.step(`Click 'Next' and verify record cound is changed, 'Previous' button gets enabled`, async () => {
                await app.ui.dataEntryBoard.click('menuButtons', 'Next');
                await app.ui.waitLoading({checkErrors: false});

                let recordCounterText = await app.ui.dataEntryBoard.getRecordCounter();
                let recordIdentifier = await app.ui.dataEntryBoard.getRecordIdentifier();

                await t
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Next')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Previous')).ok()
                    .expect(recordCounterText).eql(`Record 2 of ${filteredTotal}`)
                    .expect(recordIdentifier).contains(orderedRecords[1]);
            });
            await app.step(`Expand the second child tab and second filing section tab, click 'Next', and verify the tabs remain expanded`, async () => {
                let secondChild = (await app.ui.dataEntryBoard.getChildRecordsNames())[1];
                await app.ui.dataEntryBoard.selectChildRecord(secondChild);
                await app.ui.dataEntryBoard.selectFilingTab(1);
                await app.ui.dataEntryBoard.click('menuButtons', 'Next');
                await app.ui.waitLoading({checkErrors: false});

                let recordCounterText = await app.ui.dataEntryBoard.getRecordCounter();
                let recordIdentifier = await app.ui.dataEntryBoard.getRecordIdentifier();

                await t
                    .expect(recordCounterText).eql(`Record 3 of ${filteredTotal}`)
                    .expect(recordIdentifier).contains(orderedRecords[2])
                    .expect(await app.ui.dataEntryBoard.isChildRecordSelected(secondChild)).ok()
                    .expect(await app.ui.dataEntryBoard.isFilingTabSelected(1)).ok();
            });
            await app.step(`Go to Query and verify criteria, sorting, and filtering are still applied`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading({checkErrors: true});
                let page = await app.ui.queryBoard.queryResultsGrid.getCurrentPage();
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
                const criteria = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', data.dateField.type).getValue();

                await t
                    .expect(page).eql(1)
                    .expect(criteria).eql(data.dateField.value)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getColumnSortingStatus(data.sortingField)).eql({isPresent: true, direction: 'ascending'})
                    .expect(await app.ui.queryBoard.queryResultsGrid.isFilterActive(data.filterField.name)).ok();
            });
            await app.step(`Open the last record and verify 'Next' button is disabled, the 'Previous' button is enabled`, async () => {
                await app.ui.queryBoard.queryResultsGrid.navigateToTheLastPage();
                await app.ui.waitLoading({checkErrors: false});
                let count = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
                await app.ui.queryBoard.queryResultsGrid.scrollTo('checkboxes', count - 1);
                await app.ui.queryBoard.queryResultsGrid.openRecord(count - 1);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Next')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Next')).notOk()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Previous')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Previous')).ok();
            });

        });
});

// Step 12 skipped - styling verification
