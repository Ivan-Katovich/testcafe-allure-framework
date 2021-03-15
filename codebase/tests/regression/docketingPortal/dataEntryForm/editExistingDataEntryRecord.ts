import app from '../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.dataEntryForm.pack. - Test ID 30009: DEF_Edit existing Data Entry record`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const dataSet = [{
    ipType: 'Patents',
    recordType: 'patent',
    query: 'Patent>PA All Cases',
    identifierName: 'PATENTMASTERID',
    viewIn: 'TA DEF for Patent',
    singleline: { name: 'Examiner', previousValue: 'Test', value: 'Test Examiner' },
    multiline: { name: 'Application Number', previousValue: 'Test', value: 'Test Application Number' },
    combobox: { name: 'Status', previousValue: 'Inactive - (I)', value: 'Docketed - (D)' },
    hierarchy: { name: 'Convention Type', previousValue: 'Paris Convention - (P)', value: 'European Patent - (E)' },
    date: { name: 'Expiration Date', previousValue: '10/29/2018', value: '10/29/2019' },
    checkbox: { name: 'Power of Attorney', previousValue: 'check', value: 'uncheck' },
    numeric: { name: 'Drawings', previousValue: '11', value: app.services.random.num(1, 10).toString() },
    brief: 'true'
},
{
    ipType: 'Trademarks',
    recordType: 'trademark',
    query: 'Trademark>TM All Cases',
    identifierName: 'TRADEMARKMASTERID',
    viewIn: 'TA DEF for Trademark',
    singleline: { name: 'Filing Number', previousValue: 'Test', value: 'Test Filing Number' },
    multiline: { name: 'Current Application Number', previousValue: 'Test', value: 'Test Application Number' },
    combobox: { name: 'Status', previousValue: 'Inactive - (I)', value: 'Docket - (D)' },
    hierarchy: { name: 'Substatus', previousValue: 'Decision: Do not renew - (DNR)', value: 'Sold - (SOL)' },
    date: { name: 'Current Expiration Date', previousValue: '10/28/2019', value: '10/29/2019' },
    checkbox: { name: 'GENERICCHECKBOX01', previousValue: 'check', value: 'uncheck'},
    numeric: { name: 'Original Amount Paid', previousValue: '11', value: app.services.random.num(1, 10).toString() },
    brief: 'false'
},
{
    ipType: 'Disclosures',
    recordType: 'disclosure',
    query: 'Disclosure>DS All Cases',
    identifierName: 'DISCLOSUREMASTERID',
    viewIn: 'TA DEF for Disclosure',
    singleline: { name: 'Custom Text #3', previousValue: 'Test', value: 'Test Text' },
    multiline: { name: 'Potential Product Applications', previousValue: 'Test', value: 'Test Potential Product Applications' },
    combobox: { name: 'Status', previousValue: 'New submission - (NEW)', value: 'Quality Review - (QA)' },
    hierarchy: { name: 'Technology', previousValue: 'Computer - (COM)', value: 'PGP Encryption - (PGP)' },
    date: { name: 'Custom Date #3', previousValue: '10/28/2019', value: '10/29/2019' },
    checkbox: { name: 'GENERICCHECKBOX10', previousValue: 'check', value: 'uncheck' },
    numeric: { name: 'PRL_ID', previousValue: '11', value: app.services.random.num(1, 10).toFixed(2).toString() },
    brief: 'false'
},
{
    ipType: 'GeneralIP1',
    recordType: 'generalip',
    query: 'GeneralIP1>GIP1 All Cases',
    identifierName: 'GENERALIP1MASTERID',
    viewIn: 'TA DEF for GeneralIP1',
    singleline: { name: 'Custom Text #2', previousValue: 'Test', value: 'Test Text' },
    multiline: { name: 'Custom Text #4', previousValue: 'Test', value: 'Test Text' },
    combobox: { name: 'Responsible Party', previousValue: 'Arthur C. Woodmere - (ACW)', value: 'Addison Woods - (ABW)' },
    hierarchy: { name: 'Status', previousValue: 'In Draft - (DRF)', value: 'Expired - (EXP)' },
    date: { name: 'Custom Date #3', previousValue: '10/28/2019', value: '10/29/2019' },
    checkbox: {name: 'Sensitive', previousValue: 'check', value: 'uncheck'},
    numeric: { name: 'GIP1RM_ID', previousValue: '11', value: app.services.random.num(1, 10).toFixed(2).toString() },
    brief: 'false'
}];

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple, app.ui.requestLogger.getRecord)
    ('Verify controls without Visible&Edit permissions on data entry form (Steps 2-3, 7 partially, 9-11)', async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            app.ui.setCookie();
        });
        await app.step('Remove Visible&Edit permissions for Hierarchy and Large List Lookup controls (API)', async () => {
            await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, [
                { Path: 'PatentMasters>PATENTS>Convention Type', VisiblePermission: false, EditPermission: false},
                { Path: 'PatentMasters>PATENTS>Parent Relation Type', VisiblePermission: false, EditPermission: false},
                { Path: 'PatentMasters>PATENTS>Client Division', VisiblePermission: false, EditPermission: false},
                { Path: 'PatentMasters>PATENTS>Associate', VisiblePermission: false, EditPermission: false}
            ]);
        });
        await app.step('Open an existing Data Entry record', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in');
            await app.ui.kendoPopup.selectItem('Patent DEF');
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify controls without Visible&Edit permissions', async () => {
            await t
                .expect(await app.ui.dataEntryBoard.isPresent('fields', 'Convention Type')).notOk()
                .expect(await app.ui.dataEntryBoard.isPresent('fields', 'Parent Relation Type')).notOk()
                .expect(await app.ui.dataEntryBoard.isPresent('fields', 'Client Division')).notOk()
                .expect(await app.ui.dataEntryBoard.isPresent('fields', 'Associate')).notOk();
        });
        await app.step('Add Visible&Edit permissions for Hierarchy and Large List Lookup controls (API)', async () => {
            await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, [
                { Path: 'PatentMasters>PATENTS>Convention Type', VisiblePermission: true, EditPermission: true},
                { Path: 'PatentMasters>PATENTS>Parent Relation Type', VisiblePermission: true, EditPermission: true},
                { Path: 'PatentMasters>PATENTS>Client Division', VisiblePermission: true, EditPermission: true},
                { Path: 'PatentMasters>PATENTS>Associate', VisiblePermission: true, EditPermission: true}
            ]);
        });
        await app.step('Verify controls with Visible&Edit permissions', async () => {
            await app.ui.refresh();
            await t
                .expect(await app.ui.dataEntryBoard.isVisible('fields', 'Convention Type')).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('fields', 'Parent Relation Type')).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('fields', 'Client Division')).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('fields', 'Associate')).ok();
        });
        await app.step('Set values on data entry record', async () => {
            const recordId = app.ui.getLastResponseBody('getRecord').RecordData.RecordId;
            await app.api.changeValuesForRecord(recordId, 'Patent DEF', [
                { name: 'Convention Type', value: 'Paris Convention - (P)' },
                { name: 'Client Division', value: 'ABC Corporation - (ABCC-1)' },
                { name: 'Associate', value: 'McGee and McDuff - (MCG)' },
                { name: 'Parent Relation Type', value: 'Division - (D)' } ]);
        });
        await app.step('Set codes of the fields to not active state', async () => {
            await app.api.administration.codeManagement.openCode('P', 'CNP');
            app.api.administration.codeManagement.activate(false);
            await app.api.administration.codeManagement.save();
            await app.api.administration.codeManagement.openCode('D', 'RLP');
            app.api.administration.codeManagement.activate(false);
            await app.api.administration.codeManagement.save();
            await app.api.activatePartyCode('MCG', 'ATP', false);
            await app.api.activatePartyCode('ABCC-1', 'CLP', false);
            await app.api.clearCache();
        });
        await app.step('Verify values on the data entry form', async () => {
            await app.ui.refresh();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.dataEntryBoard.getField('Convention Type').getValue()).eql('Paris Convention - (P)')
                .expect(await app.ui.dataEntryBoard.getField('Parent Relation Type').getValue()).eql('Division - (D)')
                .expect(await app.ui.dataEntryBoard.getField('Client Division').getValue()).eql('ABC Corporation - (ABCC-1)')
                .expect(await app.ui.dataEntryBoard.getField('Associate').getValue()).eql('McGee and McDuff - (MCG)');
        });
        await app.step('Verify values are not displayed in lists', async () => {
            await app.ui.dataEntryBoard.getField('Parent Relation Type').clear();
            await app.ui.dataEntryBoard.getField('Parent Relation Type').fill('Division - (D)');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect((await app.ui.dataEntryBoard.getField('Parent Relation Type', 'dropdown').getPossibleValues()).length).eql(0);
            await app.ui.dataEntryBoard.getField('Associate').clear();
            await app.ui.dataEntryBoard.getField('Associate').fill('McGee and McDuff - (MCG)');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect((await app.ui.dataEntryBoard.getField('Associate', 'dropdown').getPossibleValues()).length).eql(0);
        });
        await app.step('Verify values are disabled in the hierarchy modal', async () => {
            await app.ui.dataEntryBoard.getField('Convention Type', 'hierarchy').clickSearch();
            await app.ui.hierarchyModal.searchItem('Paris Convention - (P)');
            await t
                .expect(await app.ui.hierarchyModal.kendoTreeview.isItemEnabled('Paris Convention - (P)')).notOk();
            await app.ui.hierarchyModal.close();
            await app.ui.dataEntryBoard.getField('Client Division', 'hierarchy').clickSearch();
            await app.ui.hierarchyModal.searchItem('ABC Corporation - (ABCC-1)');
            await t
                .expect(await app.ui.hierarchyModal.kendoTreeview.isItemEnabled('ABC Corporation - (ABCC-1)')).notOk();
            await app.ui.hierarchyModal.close();
        });
    })
    .after(async () => {
        await app.step('Add Visible&Edit permissions for controls (API)', async () => {
            await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, [
                { Path: 'PatentMasters>PATENTS>Convention Type', VisiblePermission: true, EditPermission: true},
                { Path: 'PatentMasters>PATENTS>Parent Relation Type', VisiblePermission: true, EditPermission: true},
                { Path: 'PatentMasters>PATENTS>Client Division', VisiblePermission: true, EditPermission: true},
                { Path: 'PatentMasters>PATENTS>Associate', VisiblePermission: true, EditPermission: true}
            ]);
        });
        await app.step('Set codes for values to active (API)', async () => {
            await app.api.administration.codeManagement.openCode('P', 'CNP');
            app.api.administration.codeManagement.activate(true);
            await app.api.administration.codeManagement.save();
            await app.api.administration.codeManagement.openCode('D', 'RLP');
            app.api.administration.codeManagement.activate(true);
            await app.api.administration.codeManagement.save();
            await app.api.activatePartyCode('MCG', 'ATP');
            await app.api.activatePartyCode('ABCC-1', 'CLP');
            await app.api.clearCache();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple, app.ui.requestLogger.getRecord)
    .before(async () => {
        await app.step('Uncheck Batch Rules Processing in user preferences', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            app.ui.setCookie();
            await app.api.userPreferences.resetUserPreferences([{property: 'IsUserPreferencesBatchRulesChecked', value: {Value: false, LockedOut: false}}]);
        });
        await app.step('Remove Disable Rules/Disable Batch Rules Processing permissions in content group of the user', async () => {
            await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [
                {name: 'Disable Options>Disable Rules', check: false},
                {name: 'Disable Options>Disable Batch Rules Processing', check: false}
            ]);
        });
    })
    (`Verify Get Latest Changes for data entry form (Steps 4-8)`, async (t) => {
        let filingNumberValue;
        let parentNumberValue;
        let publicationNumber = app.services.random.num().toString();
        let confirmationNumber = app.services.random.num().toString();
        await app.step('Open a data entry record in the browser', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in');
            await app.ui.kendoPopup.selectItem('Patent DEF');
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Edit fields of the record in browser', async () => {
            filingNumberValue = await app.ui.dataEntryBoard.getField('Filing Number').getValue();
            await app.ui.dataEntryBoard.getField('Filing Number').fill(app.services.random.num().toString());
            parentNumberValue = await app.ui.dataEntryBoard.getField('Parent Number').getValue();
            await app.ui.dataEntryBoard.getField('Parent Number').fill(app.services.random.num().toString());
        });
        await app.step('Open the same record and edit fields in backend', async () => {
            const recordId = app.ui.getLastResponseBody('getRecord').RecordData.RecordId;
            await app.api.changeValuesForRecord(recordId, 'Patent DEF', [
                { name: 'Publication Number', value: publicationNumber },
                { name: 'Confirmation Number', value: confirmationNumber } ]);
        });
        await app.step('Save & Validate the record in browser', async () => {
            await app.ui.dataEntryBoard.saveValidate();
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('This record has been changed by another user! Do you wish to Save and over-ride those changes?Note: If you Get the Latest Changes you will lose all of your modifications.');
        });
        await app.step('Check Batch User Processing, Disable Rules and Disable Batch Rules Processing (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{property: 'IsUserPreferencesBatchRulesChecked', value: {Value: false, LockedOut: false}}]);
            await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [
                {name: 'Disable Options>Disable Rules', check: true},
                {name: 'Disable Options>Disable Batch Rules Processing', check: true}
            ]);
        });
        await app.step('Get Latest Changes and verify data entry fields', async () => {
            await app.ui.confirmationModal.click('buttons', 'Get Latest Changes');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.dataEntryBoard.getField('Publication Number').getValue()).eql(publicationNumber)
                .expect(await app.ui.dataEntryBoard.getField('Confirmation Number').getValue()).eql(confirmationNumber);
            await app.ui.refresh();
            await t
                .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save')).ok()
                .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Save & Validate')).notOk()
                .expect(await app.ui.dataEntryBoard.getField('Filing Number').getValue()).eql(filingNumberValue)
                .expect(await app.ui.dataEntryBoard.getField('Parent Number').getValue()).eql(parentNumberValue);
        });
    })
    .after(async () => {
        await app.step('Reset user preferences and set permissions back in content group (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
            await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [
                {name: 'Disable Options>Disable Rules', check: false},
                {name: 'Disable Options>Disable Batch Rules Processing', check: false}
            ]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Remove ExportedFile.xlsx from the Downloads folder', async () => {
            await app.services.os.removeDownloads(['ExportedFile.xlsx']);
        });
    })
    ('Verify Excel Export for data entry records (Steps 15-18)', async (t) => {
        await app.step('Login and run a query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Select records and export to excel file', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await app.ui.queryBoard.click('menuItems', 'Export');
            await app.ui.kendoPopup.selectItem('Excel Export - (Excel Export)');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.services.os.waitForFileExists('ExportedFile.xlsx')).ok();
        });
        await app.step('Navigate to data entry record from excel', async () => {
            let pattern = /HYPERLINK\(\"(.*)\",\"Link\"\)/g;
            let worksheet = await app.services.excel.getWorksheet(`${process.env.USERPROFILE}\\Downloads\\ExportedFile.xlsx`, 'Query Export');
            let excelLink = pattern.exec(worksheet.getCell(2, 1).formula)[1];
            await app.ui.navigate(excelLink);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify controls on the data entry record', async () => {
            await t
                .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Previous')).notOk()
                .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Next')).notOk()
                .expect(await app.ui.dataEntryBoard.isPresent('recordCount')).notOk();
        });
        await app.step('Verify reset on the data entry form', async () => {
            let previousValue = await app.ui.dataEntryBoard.getField('Filing Number').getValue();
            let nextValue = app.services.random.num().toString();
            await app.ui.dataEntryBoard.getField('Filing Number').fill(nextValue);
            await app.ui.dataEntryBoard.reset();
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('You have unsaved changes. Are you sure you want to continue?');
            await app.ui.confirmationModal.cancel();
            await t
                .expect(await app.ui.dataEntryBoard.getField('Filing Number').getValue()).eql(nextValue);
            await app.ui.dataEntryBoard.reset();
            await app.ui.confirmationModal.confirm();
            await t
                .expect(await app.ui.dataEntryBoard.getField('Filing Number').getValue()).eql(previousValue);
        });
        await app.step('Verify the Save Failed error message', async () => {
            await app.ui.dataEntryBoard.getField('Filing Number').fill(app.services.random.num().toString());
            await app.ui.addRequestHook('mock', 'everythingWith500Err');
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Save failed.');
            await app.ui.errorModal.close();
            await app.ui.removeRequestHooks('mock', 'everythingWith500Err');
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Verify Open in Browser functionality (Steps 19-21)', async (t) => {
        await app.step('Run query and verify the button', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).notOk();
        });
        await app.step('Open in Browser a record and verify data entry form', async () => {
            const record = await app.ui.queryBoard.queryResultsGrid.getRecord(5);
            const recordId = await record.getValue('PATENTMASTERID');
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await t
                .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
            await app.ui.queryBoard.click('openInBrowserButton');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('recordIdRow')).ok()
                .expect(await app.ui.dataEntryBoard.getRecordIdentifier()).contains(recordId)
                .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Previous')).notOk()
                .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Next')).notOk()
                .expect(await app.ui.dataEntryBoard.isPresent('recordCount')).notOk();
        });
        await app.step('Go back and verify the button when no record is selected', async () => {
            await app.ui.goBack();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await t
                .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).ok();
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).uncheck();
            await t
                .expect(await app.ui.queryBoard.isEnabled('openInBrowserButton')).notOk();
            await app.ui.waitLoading({checkErrors: true});
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Verify navigation with unsaved changes on data entry form (Steps 12-14)', async (t) => {
        await app.step('Navigate to another page with unsaved changes on data entry form', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.getField('Filing Number').fill(app.services.random.num().toString());
            await app.ui.dataEntryBoard.getField('Parent Number').fill(app.services.random.num().toString());
            await app.ui.naviBar.click('links', 'Reports');
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?');
            await app.ui.confirmationModal.click('buttons', 'Continue');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.reportBoard.isVisible()).ok();
            await app.ui.naviBar.click('links', 'Query');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.isVisible()).ok();
        });
        await app.step('Sign out with unsaved changes on data entry form', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.getField('Filing Number').fill(app.services.random.num().toString());
            await app.ui.dataEntryBoard.getField('Parent Number').fill(app.services.random.num().toString());
            await app.ui.header.click('userIcon');
            await app.ui.kendoPopup.selectContentLink('Sign Out');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?');
            await app.ui.confirmationModal.click('buttons', 'Continue');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.getCurrentUrl()).contains(`${globalConfig.env.loginPageUrl}/logout`);
            app.ui.resetRole();
        });
        await app.step('Refresh path with unsaved changes on data entry form', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
            const recordIndicator = await app.ui.dataEntryBoard.getRecordIdentifier();
            await app.ui.dataEntryBoard.getField('Filing Number').fill(app.services.random.num().toString());
            await app.ui.dataEntryBoard.getField('Parent Number').fill(app.services.random.num().toString());
            // await t.setNativeDialogHandler(() => true);
            await app.ui.refresh();
            await app.ui.waitLoading({checkErrors: true});
            await t
                // .expect((await t.getNativeDialogHistory())[0].type).eql('beforeunload')
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.dataEntryBoard.getRecordIdentifier()).eql(recordIndicator);
            await app.ui.naviBar.click('links', 'Query');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.isVisible()).ok();
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        .before(async () => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                app.ui.setCookie();
            });
            await app.step('Create Patent record (API)', async () => {
                app.memory.current.masterId = (await app.api.combinedFunctionality.createRecord(data.recordType, 'simple')).respData.Record.MasterId;
                await app.api.changeValuesForRecord(app.memory.current.masterId, data.viewIn,
                    [ { name: data.singleline.name, value: data.singleline.previousValue},
                        { name: data.multiline.name, value: data.multiline.previousValue},
                        { name: data.checkbox.name, value: data.checkbox.previousValue},
                        { name: data.combobox.name, value: data.combobox.previousValue},
                        { name: data.hierarchy.name, value: data.hierarchy.previousValue},
                        { name: data.date.name, value: data.date.previousValue},
                        { name: data.numeric.name, value: data.numeric.previousValue}
                ]);
            });
        })
        (`Edit fields on exising data entry record (${data.ipType} - steps 22-23)`, async (t) => {
            await app.step('Open created record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading({checkErrors: true});
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(data.identifierName);
                await row.getField('Value', 'input').fill(app.memory.current.masterId.toString());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Change values for controls of all types', async () => {
                const dataEntryForm = app.ui.dataEntryBoard;
                await dataEntryForm.getField(data.singleline.name).fill(data.singleline.value);
                await dataEntryForm.getField(data.multiline.name).fill(data.multiline.value);
                await dataEntryForm.getField(data.combobox.name).fill(data.combobox.value);
                await app.ui.waitLoading({checkErrors: true});
                await dataEntryForm.getField(data.date.name, 'datepicker').fill(data.date.value);
                await dataEntryForm.getField(data.hierarchy.name, 'hierarchy').fill(data.hierarchy.value);
                await dataEntryForm.getField(data.numeric.name, 'numeric').fill(data.numeric.value);
                await dataEntryForm.getField(data.checkbox.name, 'checkbox').fill(data.checkbox.value);
                await dataEntryForm.save();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify changed values', async () => {
                await app.ui.refresh();
                const dataEntryForm = app.ui.dataEntryBoard;
                await t
                    .expect(await dataEntryForm.getField(data.singleline.name).getValue()).eql(data.singleline.value)
                    .expect(await dataEntryForm.getField(data.multiline.name).getValue()).eql(data.multiline.value)
                    .expect(await dataEntryForm.getField(data.combobox.name).getValue()).eql(data.combobox.value)
                    .expect(await dataEntryForm.getField(data.hierarchy.name, 'hierarchy').getValue()).eql(data.hierarchy.value)
                    .expect(await dataEntryForm.getField(data.date.name, 'datepicker').getValue()).eql(data.date.value)
                    .expect(Number(await dataEntryForm.getField(data.numeric.name, 'numeric').getValue())).eql(Number(data.numeric.value))
                    .expect(await dataEntryForm.getField(data.checkbox.name, 'checkbox').getValue()).eql(data.checkbox.value);
            });
        })
        .after(async () => {
            await app.step('Delete data entry record (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords([ app.memory.current.masterId ]);
            });
        });
    });
