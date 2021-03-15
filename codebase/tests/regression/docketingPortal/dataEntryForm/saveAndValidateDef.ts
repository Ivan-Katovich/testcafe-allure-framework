import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.dataEntryForm.pack. - Test ID 30464: DEF_Save and Validate on DEF - All IP Types`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

[
    { type: 'Patent', def: 'TA DEF for Patent', nameField: 'Docket Number', brief: 'true' },
    { type: 'Trademark', def: 'TA DEF for Trademark', nameField: 'Docket Number', brief: 'false' },
    { type: 'Disclosure', def: 'TA DEF for Disclosure', nameField: 'Disclosure Number', brief: 'false' },
    { type: 'GeneralIP1', def: 'TA DEF for GeneralIP1', nameField: 'Agreement Number', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify 'Save' button is visible, 'Save & Validate' button is hidden for ${data.type} IP Type: 'Disable Rules' in CG is checked, 'Disable Batch Rules' in CG is checked, 'Batch Rules Processing' in User Preferences is unchecked and disabled (Steps 1-2.1)`, async (t: TestController) => {
            await app.step(`Update settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', true);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', true);
                await cg.save();
            });
            await app.step(`Login and verify 'Batch Rules Processing' in User Preferences is read-only`, async () => {
                await app.ui.getRole(undefined, 'UI/user-preferences');
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').isVisible()).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').isReadOnly()).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').verifyValue('uncheck')).ok();
            });
            await app.step(`Open the '${data.def}' data entry form and verify 'Save' and 'Save & Validate' buttons`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.def);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).notOk()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save', {isTextExact: true})).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).notOk();
            });
            await app.step(`Make changes and verify buttons' state`, async () => {
                await app.ui.dataEntryBoard.getField(data.nameField).fill('autotest');

                await t
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).ok();
            });
        })
        .after(async () => {
            await app.step(`Reset settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', false);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', false);
                await cg.save();
            });
            await app.step(`Update User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'IsUserPreferencesBatchRulesChecked', value: {Value: true, LockedOut: false} }]);
            });
        });
});

[
    { type: 'Patent', def: 'TA DEF for Patent', nameField: 'Docket Number', brief: 'true' },
    { type: 'Trademark', def: 'TA DEF for Trademark', nameField: 'Docket Number', brief: 'false' },
    { type: 'Disclosure', def: 'TA DEF for Disclosure', nameField: 'Disclosure Number', brief: 'false' },
    { type: 'GeneralIP1', def: 'TA DEF for GeneralIP1', nameField: 'Agreement Number', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify 'Save' button is hidden, 'Save & Validate' button is visible for ${data.type} IP Type: 'Disable Rules' in CG is unchecked, 'Disable Batch Rules' in CG is checked, 'Batch Rules Processing' in User Preferences is unchecked and disabled (Steps 1-2.2)`, async (t: TestController) => {
            await app.step(`Update settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', false);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', true);
                await cg.save();
            });
            await app.step(`Login and verify 'Batch Rules Processing' in User Preferences is read-only`, async () => {
                await app.ui.getRole(undefined, 'UI/user-preferences');
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').isVisible()).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').isReadOnly()).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').verifyValue('uncheck')).ok();
            });
            await app.step(`Open the '${data.def}' data entry form and verify 'Save' and 'Save & Validate' buttons`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.def);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save', {isTextExact: true})).notOk()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok();
            });
            await app.step(`Make changes and verify buttons' state`, async () => {
                await app.ui.dataEntryBoard.getField(data.nameField).fill('autotest');

                await t
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok();
            });
        })
        .after(async () => {
            await app.step(`Reset settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', false);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', false);
                await cg.save();
            });
            await app.step(`Update User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'IsUserPreferencesBatchRulesChecked', value: {Value: true, LockedOut: false} }]);
            });
        });
});

[
    { type: 'Patent', def: 'TA DEF for Patent', nameField: 'Docket Number', brief: 'true' },
    { type: 'Trademark', def: 'TA DEF for Trademark', nameField: 'Docket Number', brief: 'false' },
    { type: 'Disclosure', def: 'TA DEF for Disclosure', nameField: 'Disclosure Number', brief: 'false' },
    { type: 'GeneralIP1', def: 'TA DEF for GeneralIP1', nameField: 'Agreement Number', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify 'Save' button is hidden, 'Save & Validate' button is visible for ${data.type} IP Type: 'Disable Rules' in CG is unchecked, 'Disable Batch Rules' in CG is unchecked, 'Batch Rules Processing' in User Preferences is unchecked (Steps 1-2.3)`, async (t: TestController) => {
            await app.step(`Update settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', false);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', false);
                await cg.save();
            });
            await app.step(`Update User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'IsUserPreferencesBatchRulesChecked', value: {Value: false, LockedOut: false} }]);
            });
            await app.step(`Login`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Open the '${data.def}' data entry form and verify 'Save' and 'Save & Validate' buttons`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.def);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save', {isTextExact: true})).notOk()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok();
            });
            await app.step(`Make changes and verify buttons' state`, async () => {
                await app.ui.dataEntryBoard.getField(data.nameField).fill('autotest');

                await t
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok();
            });
        })
        .after(async () => {
            await app.step(`Reset settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', false);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', false);
                await cg.save();
            });
            await app.step(`Update User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'IsUserPreferencesBatchRulesChecked', value: {Value: true, LockedOut: false} }]);
            });
        });
});

[
    { type: 'Patent', def: 'TA DEF for Patent', nameField: 'Docket Number', brief: 'true' },
    { type: 'Trademark', def: 'TA DEF for Trademark', nameField: 'Docket Number', brief: 'false' },
    { type: 'Disclosure', def: 'TA DEF for Disclosure', nameField: 'Disclosure Number', brief: 'false' },
    { type: 'GeneralIP1', def: 'TA DEF for GeneralIP1', nameField: 'Agreement Number', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify 'Save' button is visible, 'Save & Validate' button is visible for ${data.type} IP Type: 'Disable Rules' in CG is unchecked, 'Disable Batch Rules' in CG is unchecked, 'Batch Rules Processing' in User Preferences is checked (Steps 1-2.4)`, async (t: TestController) => {
            await app.step(`Update settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', false);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', false);
                await cg.save();
            });
            await app.step(`Update User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'IsUserPreferencesBatchRulesChecked', value: {Value: true, LockedOut: false} }]);
            });
            await app.step(`Login`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Open the '${data.def}' data entry form and verify 'Save' and 'Save & Validate' buttons`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.def);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save', {isTextExact: true})).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).notOk();
            });
            await app.step(`Make changes and verify buttons' state`, async () => {
                await app.ui.dataEntryBoard.getField(data.nameField).fill('autotest');

                await t
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).ok();
            });
        })
        .after(async () => {
            await app.step(`Reset settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', false);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', false);
                await cg.save();
            });
            await app.step(`Update User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'IsUserPreferencesBatchRulesChecked', value: {Value: true, LockedOut: false} }]);
            });
        });
});

[
    {
        type: 'Patent',
        def: 'TA DEF for Patent',
        fields: [
            {name: 'Docket Number', type: 'input', value: `PA rule test ${app.services.random.num()}` },
            {name: 'Country / Region', type: 'autocomplete', value: 'US - (United States)'},
            {name: 'Case Type', type: 'autocomplete', value: 'Regular - (REG)'},
            {name: 'Relation Type', type: 'autocomplete', value: 'Original Filing - (ORG)'},
            {name: 'Filing Type', type: 'autocomplete', value: 'National - (NAT)'},
            {name: 'Status', type: 'autocomplete', value: 'Granted - (G)'},
            {name: 'Application Date', type: 'datepicker', value: app.services.time.moment().subtract(3, 'months').startOf('month').format('MM/DD/YYYY')},
            {name: 'Application Number', type: 'input', value: 'PA test'},
            {name: 'Grant Date', type: 'datepicker', value: app.services.time.moment().subtract(1, 'months').format('MM/DD/YYYY')},
            {name: 'Patent Number', type: 'input', value: 'PA test'}
        ],
        rules: [
            {name: 'Tax Base Date', type: 'datepicker', value: app.services.time.moment().subtract(1, 'months').add(6, 'months').format('MM/DD/YYYY'), message: 'Set the Tax Base Date as 6 months from the Grant Date'},
            {name: 'Expiration Date', type: 'datepicker', value: app.services.time.moment().subtract(3, 'months').startOf('month').add(20, 'years').format('MM/DD/YYYY'), message: 'Set the Expiration Date as 20 years from the Application Date'},
            {name: 'First Tax Date', type: 'datepicker', value: app.services.time.moment().subtract(1, 'months').add(6, 'months').add(3, 'years').format('MM/DD/YYYY') , message: 'Set the First Tax Date as 3 years from the Tax Base Date'}
        ],
        brief: 'true'
    },
    {
        type: 'Trademark',
        def: 'TA DEF for Trademark',
        fields: [
            {name: 'Docket Number', type: 'input', value: `TM rule test ${app.services.random.num()}` },
            {name: 'Country / Region', type: 'autocomplete', value: 'FR - (France)'},
            {name: 'Case Type', type: 'autocomplete', value: 'Regular - (REG)'},
            {name: 'Filing Type', type: 'autocomplete', value: 'National - (NAT)'},
            {name: 'Status', type: 'autocomplete', value: 'Registered - (G)'},
            {name: 'Current Application Date', type: 'datepicker', value: app.services.time.moment().subtract(3, 'months').format('MM/DD/YYYY')},
            {name: 'Current Application Number', type: 'input', value: 'PA test'},
            {name: 'Current Registration Date', type: 'datepicker', value: app.services.time.moment().subtract(1, 'months').format('MM/DD/YYYY')},
            {name: 'Current Registration Number', type: 'input', value: 'PA test'}
        ],
        rules: [
            {name: 'Current Start Date', type: 'datepicker', value: app.services.time.moment().subtract(3, 'months').format('MM/DD/YYYY'), message: 'Current Start Date updated to'},
            {name: 'Current Expiration Date', type: 'datepicker', value: app.services.time.moment().subtract(3, 'months').add(10, 'years').endOf('month').format('MM/DD/YYYY'), message: 'Set the ExpirationDate as 10 years from the StartDate plus a 10 years addition, adjust to Adjust to last day of Month'},
            {name: 'Current Renewal Date', type: 'datepicker', value: app.services.time.moment().subtract(3, 'months').add(10, 'years').endOf('month').format('MM/DD/YYYY'), message: 'Set the RenewalDate as 10 years from the StartDate plus a 10 years addition, adjust to Adjust to last day of Month'},
            {name: 'Current Dropdead Date', type: 'datepicker', value: app.services.time.moment().subtract(3, 'months').add(10, 'years').endOf('month').add(6, 'months').format('MM/DD/YYYY'), message: 'Set the DropDeadDate as the RenewalDate, adjust to Add 6 Months to Result value'}
        ],
        brief: 'false'
    } ,
    {
        type: 'Disclosure',
        def: 'TA DEF for Disclosure',
        fields: [
            {name: 'Disclosure Number', type: 'input', value: `DS rule test ${app.services.random.num()}`},
            {name: 'Business Unit', type: 'autocomplete', value: 'Chemical Division - (CD)'},
            {name: 'Status', type: 'autocomplete', value: 'New submission - (NEW)'},
            {name: 'Initial Disclosure', type: 'datepicker', value: app.services.time.moment().subtract(3, 'months').format('MM/DD/YYYY')}
        ],
        rules: [
            {name: 'Target Filing Date', type: 'datepicker', value: app.services.time.moment().subtract(3, 'months').add(1, 'year').format('MM/DD/YYYY'), message: 'Set the Target Filing Date as 1 year from the Initial Disclosure'}
        ],
        brief: 'false'
    },
    {
        type: 'GeneralIP1',
        def: 'TA DEF for GeneralIP1',
        fields: [
            {name: 'Agreement Number', type: 'input', value: `GIP1 rule test ${app.services.random.num()}`},
            {name: 'Jurisdiction', type: 'autocomplete', value: 'GB - (Great Britain)'},
            {name: 'Agreement Type', type: 'autocomplete', value: 'General Agreement - (GEN)'},
            {name: 'Relationship', type: 'autocomplete', value: 'Renewal - (RNW)'},
            {name: 'Start Date', type: 'datepicker', value: app.services.time.moment().format('MM/DD/YYYY')}
        ],
        rules: [
            {name: 'Status', type: 'hierarchy', value: 'Pending - (PEN)', message: 'Set the Status as Pending'},
            {name: 'Status', type: 'hierarchy', value: 'Pending - (PEN)', message: 'Legislation currently pending'}, // used twice to verify the second message
            {name: 'Expiration Date', type: 'datepicker', value: app.services.time.moment().add(2, 'years').format('MM/DD/YYYY'), message: 'Set the Expiration Date as 2 years from the Start Date'}
        ],
        brief: 'false'
    }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.createRecord)
        .before(async () => {
            await app.step(`Update settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', false);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', false);
                await cg.save();
            });
            await app.step(`Update User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'IsUserPreferencesBatchRulesChecked', value: {Value: false, LockedOut: false} }]);
            });
        })
        (`Verify rules message on Save & Validate for a ${data.type} record`, async (t: TestController) => {
            await app.step(`Login`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Open the '${data.def}' data entry form`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.def);
                await app.ui.waitLoading({checkErrors: true});

                await t
                    .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                    .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok();
            });
            await app.step(`Fill the DEF fields as per the ${data.type} rule`, async () => {
                await app.ui.dataEntryBoard.fillFieldsWithValue(data.fields);

                await t
                    .expect(await app.ui.dataEntryBoard.verifyFieldsValues(data.fields)).ok();
            });
            await app.step(`Click 'Save & Validate' and verify the IP Rules messages`, async () => {
                await app.ui.dataEntryBoard.saveValidate();
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await app.ui.modal.isVisible()).ok()
                    .expect(await app.ui.modal.isVisible('infoList')).ok()
                    .expect(await app.ui.modal.getText('title')).eql('IP Rules Message(s)')
                    .expect(await app.ui.noErrors()).ok('A System Error thrown');
                let messageText = await app.ui.modal.getText('infoList', 0, {asDisplayed: true});
                for (const rule of data.rules) {
                    await t
                        .expect(messageText.includes(rule.message)).ok();
                }
            });
            await app.step(`Close the IP Rules messages pop-up`, async () => {
                await app.ui.modal.confirm();
                await app.ui.waitLoading({checkErrors: true});
            });
            for (const rule of data.rules) {
                await app.step(`Verify the '${rule.name}' field is updated by the rule`, async () => {
                    let fieldValue = await app.ui.dataEntryBoard.getField(rule.name, rule.type).getValue();
                    await  t
                        .expect(fieldValue).eql(rule.value);
                });
            }
    }).after(async () => {
            await app.step('Delete the records (API)', async () => {
                try {
                    let record = app.ui.getLastResponseBody('createRecord');
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
            app.ui.resetRequestLogger('createRecord');
            await app.step(`Reset settings in content group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                await cg.setPermission('Disable Options>Disable Rules', false);
                await cg.setPermission('Disable Options>Disable Batch Rules Processing', false);
                await cg.save();
            });
            await app.step(`Update User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'IsUserPreferencesBatchRulesChecked', value: {Value: true, LockedOut: false} }]);
            });
        }) ;
});
