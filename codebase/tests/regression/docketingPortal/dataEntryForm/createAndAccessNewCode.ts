import app from '../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.dataEntryForm.pack. - Test ID 30918: DEF_Create and access new code`
    // .disablePageReloads
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
            ipType: 'Patent',
            queryName: 'Patent>PA All Cases',
            viewIn: 'Patent DEF',
            combobox: {
                name: 'Case Type',
                value: 'Regular - (REG)',
                code: 'REG',
                codeType: 'CSP (Patent Case Type)',
                codeTypeID: 'CSP',
                applicationSecurity: 'PatentMasters>PATENTS>Case Type'
            },
            hierarchy: {
                name: 'Convention Type',
                value: 'Paris Convention - (P)',
                code: 'P',
                codeType: 'CNP (Patent Convention Type)',
                codeTypeID: 'CNP',
                applicationSecurity: 'PatentMasters>PATENTS>Convention Type'
            },
            differentCodeType: 'AC1 (GeneralIP1 Action)',
            differentCodeTypeID: 'AC1',
            existingCodeName: 'TA code FLP',
            existingCodeType: 'FLP (Patent Filing Type)',
            brief: 'true'
        },
        {
            ipType: 'Trademark',
            queryName: 'Trademark>TM All Cases',
            viewIn: 'Trademark DEF',
            combobox: {
                name: 'Case Type',
                value: 'Regular - (REG)',
                code: 'REG',
                codeType: 'CST (Trademark Case Type)',
                codeTypeID: 'CST',
                applicationSecurity: 'TrademarkMasters>TRADEMARKS>Case Type'
            },
            hierarchy: {
                name: 'Substatus',
                value: 'Decision: Renew indefinitely - (IDF)',
                code: 'IDF',
                codeType: 'SUT (Trademark Sub Status)',
                codeTypeID: 'SUT',
                applicationSecurity: 'TrademarkMasters>TRADEMARKS>Substatus'
            },
            differentCodeType: 'AC1 (GeneralIP1 Action)',
            differentCodeTypeID: 'AC1',
            existingCodeName: 'TA code FLT',
            existingCodeType: 'FLT (Trademark Filing Type)',
            brief: 'false'
        },
        {
            ipType: 'Disclosure',
            queryName: 'Disclosure>DS All Cases',
            viewIn: 'Disclosure DEF',
            combobox: {
                name: 'Status',
                value: 'Decision Finalized - (DEC)',
                code: 'DEC',
                codeType: 'SDP (Patent Disclosure Status)',
                codeTypeID: 'SDP',
                applicationSecurity: 'DisclosureMasters>DISCLOSURES>Status'
            },
            hierarchy: {
                name: 'Technology',
                value: 'Encoding - (ENC)',
                code: 'ENC',
                codeType: 'TCP (Patent Tech. Category)',
                codeTypeID: 'TCP',
                applicationSecurity: 'DisclosureMasters>DISCLOSURES>Technology'
            },
            differentCodeType: 'AC1 (GeneralIP1 Action)',
            differentCodeTypeID: 'AC1',
            existingCodeName: 'TA code RTP',
            existingCodeType: 'RTP (Disclosure Filing Decision)',
            brief: 'false'
        },
        {
            ipType: 'GeneralIP',
            queryName: 'GeneralIP1>GIP1 All Cases',
            viewIn: 'GeneralIP1 DEF',
            combobox: {
                name: 'Relationship',
                value: 'Alteration - (ALT)',
                code: 'ALT',
                codeType: 'FL1 (GeneralIP1 Keycode02)',
                codeTypeID: 'FL1',
                applicationSecurity: 'GeneralIP1Masters>GENERALIP1>Relationship'
            },
            hierarchy: {
                name: 'Status',
                value: 'In Force - (INF)',
                code: 'INF',
                codeType: 'ST1 (GeneralIP1 Status)',
                codeTypeID: 'ST1',
                applicationSecurity: 'GeneralIP1Masters>GENERALIP1>Status'
            },
            differentCodeType: 'AC1 (GeneralIP1 Action)',
            differentCodeTypeID: 'AC1',
            existingCodeName: 'TA code IM1',
            existingCodeType: 'IM1 (GeneralIP1 External File Type)',
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
        (`Verify confirmation and error messages on the Code Management modal of combobox field (Steps 1-10 - ${data.ipType})`, async (t: TestController) => {
            await app.step(`Open data entry record and check control (Step 1)`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.queryBoard.kendoTreeview.open(data.queryName);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.click('fields', data.combobox.name);
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').isVisible('managementControlButton')).ok()
                    .expect(await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').isEnabled('managementControlButton')).ok()
                    .expect(await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').isVisible('pencilIcon')).ok();
            });
            await app.step(`Open the Code Management modal`, async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').fill(data.combobox.value);
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.codeManagementModal.isVisible()).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Save')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Reset')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('help')).ok();
            });
            await app.step('Verify fields in the Code Management modal', async () => {
                const codeInfo = await app.api.administration.codeManagement.openCode(data.combobox.code, data.combobox.codeTypeID);
                await t
                    .expect(await app.ui.codeManagementModal.getField('Description').isVisible('input'))
                    .ok('The Description field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code').isVisible('input'))
                    .ok('The Code field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Active').isVisible('input'))
                    .ok('The Active field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').isPresent('input'))
                    .notOk('The Code Type field is not read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code ID').isPresent('input'))
                    .notOk('The Code ID field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Create User'))
                    .ok('The Create User field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Create Date'))
                    .ok('The Create Date field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Update User'))
                    .ok('The Update User field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Update Date'))
                    .ok('The Update Date field is not read-only')
                    .expect(await app.ui.codeManagementModal.getValue('Description')).eql(codeInfo.CodesDescription)
                    .expect(await app.ui.codeManagementModal.getValue('Code')).eql(data.combobox.code)
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.combobox.codeType)
                    .expect(await app.ui.codeManagementModal.getValue('Code ID')).eql(codeInfo.CodeId)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create User')).eql(codeInfo.CreateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create Date'))
                    .eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update User')).eql(codeInfo.UpdateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update Date'))
                    .eql(app.services.time.toLocal(codeInfo.UpdateDate));
            });
            await app.step('Click the Add New button (Step 2)', async () => {
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.getField('Description').isVisible('input'))
                    .ok('The Description field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue())
                    .eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code').isVisible('input'))
                    .ok('The Code field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue())
                    .eql('')
                    .expect(await app.ui.codeManagementModal.getField('Active').isVisible('input'))
                    .ok('The Active field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked())
                    .ok()
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').isVisible('input'))
                    .ok('The Code Type field is read-only')
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.combobox.codeType);
            });
            await app.step('Close without any changes (Step 3)', async () => {
                await app.ui.codeManagementModal.close();
                await t
                    .expect(await app.ui.codeManagementModal.waitTillElementNotPresent()).ok();
            });
            await app.step('Reopen the Code Management modal and make some changes (Step 4)', async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.getField('Description').fill('Test Code');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').uncheck();
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).ok();
            });
            await app.step (`Click Close->Cancel on the Code Management modal`, async () => {
                await app.ui.codeManagementModal.close();
                await t
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.differentCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).notOk();
            });
            await app.step(`Click Close->Continue on the Code Management modal (Step 5)`, async () => {
                await app.ui.codeManagementModal.close();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await app.ui.codeManagementModal.waitTillElementNotPresent()).ok();
            });
            await app.step('Reopen the Code Management modal and make some changes (Step 6)', async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.getField('Description').fill('Test Code');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').uncheck();
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).ok();
            });
            await app.step('Click Reset->Cancel on the Code Management modal', async () => {
                await app.ui.codeManagementModal.reset();
                await t
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.differentCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).notOk();
            });
            await app.step('Click Reset->Continue on the Code Management modal (Step 7)', async () => {
                await app.ui.codeManagementModal.reset();
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.combobox.codeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).ok();
            });
            await app.step(`Save with one missing required field value`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.save();
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('Missing required field value(s): Description');
                await app.ui.errorModal.click('buttons', 'Ok');
                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
                await app.ui.codeManagementModal.save();
                await app.ui.errorModal.click('cross');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code');
            });
            await app.step(`Save with all missing required field values (Step 9)`, async () => {
                await app.ui.codeManagementModal.getField('Code Type', 'dropdown').clear();
                await app.ui.codeManagementModal.getField('Code').clear();
                await app.ui.codeManagementModal.getField('Description').clear();
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('Missing required field value(s): Code, Description, Code Type');
                await app.ui.errorModal.click('cross');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql('');
            });
            await app.step(`Save with existing code name (Step 10)`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill(data.existingCodeName);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.existingCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('The Code and Code Type combination must be unique.');
            });
            await app.step(`Click Ok on the Error message`, async () => {
                await app.ui.errorModal.click('buttons', 'Ok');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql(data.existingCodeName)
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.existingCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Description');
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.createCode)
        (`Create and access new codes for combobox (Steps 11-13 - ${data.ipType})`, async (t) => {
            let userDateFormat = (await app.api.userPreferences.getUserPreferences()).Preferences.DateFormat.Value.toUpperCase();
            let expectedDateFormat = userDateFormat + ' HH:mm:ss';
            let activeCodeSameType = `code${app.services.time.timestampShortWithMilliseconds()}.1Simple`;
            let notActiveCodeSameType = `code${app.services.time.timestampShortWithMilliseconds()}.2Simple`;
            let activeCodeDifferentType = `code${app.services.time.timestampShortWithMilliseconds()}.3Simple`;
            let notActiveCodeDifferentType = `code${app.services.time.timestampShortWithMilliseconds()}.4Simple`;
            await app.step(`Go to data entry record and open Code Management modal for combobox`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.queryBoard.kendoTreeview.open(data.queryName);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.click('fields', data.combobox.name);
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
            });
            await app.step(`Save active code with initial code type (Step 11)`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill(activeCodeSameType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('check');
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.combobox.codeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            });
            await app.step(`Select created code in the dropdown (Step 12)`, async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name).fill(activeCodeSameType);
                await app.ui.waitLoading({checkErrors: true});
                const possibleValues = await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown'). getPossibleValues();
                await t
                    .expect(possibleValues.length).eql(1)
                    .expect(possibleValues[0]).contains(activeCodeSameType)
                    .expect(possibleValues[0]).contains('Test Description');
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').selectRow(possibleValues[0]);
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.combobox.name).getValue()).eql(possibleValues[0]);
            });
            await app.step('Click on the Edit button', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeSameType);
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                const createDate = await app.ui.codeManagementModal.auditInfo.getValue('Update Date');
                const updateDate = await app.ui.codeManagementModal.auditInfo.getValue('Create Date');
                await t
                    .expect(await app.ui.codeManagementModal.getValue('Code')).eql(activeCodeSameType)
                    .expect(await app.ui.codeManagementModal.getValue('Description')).eql('Test Description')
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.combobox.codeType)
                    .expect(await app.ui.codeManagementModal.getValue('Code ID')).eql(codeInfo.CodeId)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update User')).eql(codeInfo.UpdateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create User')).eql(codeInfo.CreateUser)
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step(`Create not active code with the same type`, async () => {
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(notActiveCodeSameType);
                await app.ui.codeManagementModal.getField('Description').fill('not active, same type');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('uncheck');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.combobox.codeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await app.ui.dataEntryBoard.getField(data.combobox.name).fill(notActiveCodeSameType);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect((await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown'). getPossibleValues()).length).eql(0);
            });
            await app.step(`Create not active code with different type`, async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(notActiveCodeDifferentType);
                await app.ui.codeManagementModal.getField('Description').fill('other code type, not active');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('uncheck');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await app.ui.dataEntryBoard.getField(data.combobox.name).fill(notActiveCodeDifferentType);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect((await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown'). getPossibleValues()).length).eql(0);
            });
            await app.step(`Create active code with different type`, async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(activeCodeDifferentType);
                await app.ui.codeManagementModal.getField('Description').fill('other code type, active');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('check');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await app.ui.dataEntryBoard.getField(data.combobox.name).fill(activeCodeDifferentType);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect((await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown'). getPossibleValues()).length).eql(0);
            });
            await app.step(`Check created codes in database`, async () => {
                await t
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.combobox.codeTypeID}' and code = '${activeCodeSameType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.combobox.codeTypeID}' and code = '${notActiveCodeSameType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.differentCodeTypeID}' and code = '${activeCodeDifferentType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.differentCodeTypeID}' and code = '${notActiveCodeDifferentType}'`)).recordset.length).eql(1);
            });
            await app.step('Go to the Code Management page', async () => {
                await app.ui.closeNativeDialog();
                await app.ui.navigate(`${globalConfig.env.url}/AdminUI/administration`);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.adminMenu.getCard('Management').open('Code Management');
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify created active code with the same code type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeSameType);
                await app.ui.adminBoard.searchItem(activeCodeSameType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.combobox.codeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step(`Check inactive code with the same code type`, async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === notActiveCodeSameType);
                await app.ui.adminBoard.searchItem(notActiveCodeSameType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.combobox.codeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step('Verify active code with different type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeDifferentType);
                await app.ui.adminBoard.searchItem(activeCodeDifferentType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.differentCodeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step('Verify inactive code with different type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === notActiveCodeDifferentType);
                await app.ui.adminBoard.searchItem(notActiveCodeDifferentType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.differentCodeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete created admin items (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => {
                    return { CodeId: x.CodeId, CodeTypeId: x.CodeTypeId };
                }), 'code');
                app.memory.current.recordsArray = [];
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        (`Verify confirmation and error messages on the Code Management modal of hierarchy field (Steps 1-10 - ${data.ipType})`, async (t) => {
            await app.step(`Open data entry record and check control`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.queryBoard.kendoTreeview.open(data.queryName);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.click('fields', data.hierarchy.name);
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').isVisible('managementControlButton')).ok()
                    .expect(await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').isEnabled('managementControlButton')).ok()
                    .expect(await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').isVisible('pencilIcon')).ok();
            });
            await app.step(`Open the Code Management modal`, async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').fill(data.hierarchy.value);
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.codeManagementModal.isVisible()).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Save')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Reset')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('help')).ok();
            });
            await app.step('Verify fields in the Code Management modal', async () => {
                const codeInfo = await app.api.administration.codeManagement.openCode(data.hierarchy.code, data.hierarchy.codeTypeID);
                await t
                    .expect(await app.ui.codeManagementModal.getField('Description').isVisible('input'))
                    .ok('The Description field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code').isVisible('input'))
                    .ok('The Code field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Active').isVisible('input'))
                    .ok('The Active field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').isPresent('input'))
                    .notOk('The Code Type field is not read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code ID').isPresent('input'))
                    .notOk('The Code ID field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Create User'))
                    .ok('The Create User field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Create Date'))
                    .ok('The Create Date field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Update User'))
                    .ok('The Update User field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Update Date'))
                    .ok('The Update Date field is not read-only')
                    .expect(await app.ui.codeManagementModal.getValue('Description')).eql(codeInfo.CodesDescription)
                    .expect(await app.ui.codeManagementModal.getValue('Code')).eql(data.hierarchy.code)
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.hierarchy.codeType)
                    .expect(await app.ui.codeManagementModal.getValue('Code ID')).eql(codeInfo.CodeId)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create User')).eql(codeInfo.CreateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create Date'))
                    .eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update User')).eql(codeInfo.UpdateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update Date'))
                    .eql(app.services.time.toLocal(codeInfo.UpdateDate));
            });
            await app.step('Click the Add New button (Step 2)', async () => {
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.getField('Description').isVisible('input'))
                    .ok('The Description field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue())
                    .eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code').isVisible('input'))
                    .ok('The Code field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue())
                    .eql('')
                    .expect(await app.ui.codeManagementModal.getField('Active').isVisible('input'))
                    .ok('The Active field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked())
                    .ok()
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').isVisible('input'))
                    .ok('The Code Type field is read-only')
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.hierarchy.codeType);
            });
            await app.step('Close without any changes (Step 3)', async () => {
                await app.ui.codeManagementModal.close();
                await t
                    .expect(await app.ui.codeManagementModal.waitTillElementNotPresent()).ok();
            });
            await app.step('Reopen the Code Management modal and make some changes (Step 4)', async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.getField('Description').fill('Test Code');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').uncheck();
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).ok();
            });
            await app.step (`Click Close->Cancel on the Code Management modal`, async () => {
                await app.ui.codeManagementModal.close();
                await t
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.differentCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).notOk();
            });
            await app.step(`Click Continue on the confirmation message`, async () => {
                await app.ui.codeManagementModal.close();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await app.ui.codeManagementModal.waitTillElementNotPresent()).ok;
            });
            await app.step('Reopen the Code Management modal and make some changes (Step 6)', async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.getField('Description').fill('Test Code');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').uncheck();
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).ok();
            });
            await app.step('Click Reset->Cancel on the Code Management modal', async () => {
                await app.ui.codeManagementModal.reset();
                await t
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.differentCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).notOk();
            });
            await app.step('Click Reset->Continue on the Code Management modal (Step 7)', async () => {
                await app.ui.codeManagementModal.reset();
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.hierarchy.codeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).ok();
            });
            await app.step('Reopen the Code Management modal(Step 8)', async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
            });
            await app.step(`Save with one missing required field value`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('Missing required field value(s): Description');
                await app.ui.errorModal.click('buttons', 'Ok');
                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.errorModal.click('cross');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code');
            });
            await app.step(`Save with all missing required field values`, async () => {
                await app.ui.codeManagementModal.getField('Code Type', 'dropdown').clear();
                await app.ui.codeManagementModal.getField('Code').clear();
                await app.ui.codeManagementModal.getField('Description').clear();
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('Missing required field value(s): Code, Description, Code Type');
                await app.ui.errorModal.click('cross');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql('');
            });
            await app.step(`Save with existing code name`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill(data.existingCodeName);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.existingCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('The Code and Code Type combination must be unique.');
            });
            await app.step(`Click Ok on the Error message`, async () => {
                await app.ui.errorModal.click('buttons', 'Ok');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql(data.existingCodeName)
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.existingCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Description');
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.createCode, app.ui.requestLogger.simple)
        (`Create and access new codes for hierarchy field (Steps 11-13 - ${data.ipType})`, async (t) => {
            let userDateFormat = (await app.api.userPreferences.getUserPreferences()).Preferences.DateFormat.Value.toUpperCase();
            let expectedDateFormat = userDateFormat + ' HH:mm:ss';
            let activeCodeSameType = `code${app.services.time.timestampShortWithMilliseconds()}.1Simple`;
            let notActiveCodeSameType = `code${app.services.time.timestampShortWithMilliseconds()}.2Simple`;
            let activeCodeDifferentType = `code${app.services.time.timestampShortWithMilliseconds()}.3Simple`;
            let notActiveCodeDifferentType = `code${app.services.time.timestampShortWithMilliseconds()}.4Simple`;
            await app.step(`Go to data entry record and open Code Management modal for combobox`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.queryBoard.kendoTreeview.open(data.queryName);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.click('fields', data.hierarchy.name);
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
            });
            await app.step(`Save active code with initial code type (Step 11)`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill(activeCodeSameType);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.hierarchy.codeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('check');
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            });
            await app.step(`Select created code in the hierarchy modal`, async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').clickSearch();
                await app.ui.hierarchyModal.searchItem(activeCodeSameType);
                const allPossibleValues = await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1);
                await t
                    .expect(allPossibleValues.length).eql(1)
                    .expect(allPossibleValues[0]).contains(activeCodeSameType)
                    .expect(allPossibleValues[0]).contains('Test Description');
                await app.ui.hierarchyModal.kendoTreeview.open(allPossibleValues[0]);
                await app.ui.hierarchyModal.click('buttons', 'Add');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').getValue()).contains(allPossibleValues[0]);
            });
            await app.step('Click on the Edit button', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeSameType);
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                const createDate = await app.ui.codeManagementModal.auditInfo.getValue('Update Date');
                const updateDate = await app.ui.codeManagementModal.auditInfo.getValue('Create Date');
                await t
                    .expect(await app.ui.codeManagementModal.getValue('Code')).eql(activeCodeSameType)
                    .expect(await app.ui.codeManagementModal.getValue('Description')).eql('Test Description')
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.hierarchy.codeType)
                    .expect(await app.ui.codeManagementModal.getValue('Code ID')).eql(codeInfo.CodeId)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update User')).eql(codeInfo.UpdateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create User')).eql(codeInfo.CreateUser)
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step(`Create not active code with different type`, async () => {
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(notActiveCodeSameType);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('uncheck');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.hierarchy.codeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
            });
            await app.step(`Create not active code with different type`, async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(notActiveCodeDifferentType);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('uncheck');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
            });
            await app.step(`Create active code with different type`, async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(activeCodeDifferentType);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('check');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
            });
            await app.step(`Verify newly created codes in the hierarchy modal`, async () => {
                if (await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Reset')) {
                    await app.ui.dataEntryBoard.reset();
                    await app.ui.waitLoading({checkErrors: true});
                    await app.ui.confirmationModal.confirm();
                }
                await app.ui.refresh();
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').clickSearch();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.hierarchyModal.searchItem(notActiveCodeSameType);
                let allPossibleValues = await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1);
                await app.ui. hierarchyModal.kendoTreeview.open(allPossibleValues[0]);
                await t
                    .expect(allPossibleValues.length).eql(1)
                    .expect(allPossibleValues[0]).contains(notActiveCodeSameType)
                    .expect(allPossibleValues[0]).contains('Test Description')
                    .expect(await app.ui.hierarchyModal.kendoTreeview.isItemEnabled(allPossibleValues[0])).notOk()
                    .expect(await app.ui.hierarchyModal.isEnabled('buttons', 'Add')).notOk();
                await app.ui.hierarchyModal.searchItem(activeCodeDifferentType);
                await t
                    .expect((await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1)).length).eql(0);
                await app.ui.hierarchyModal.searchItem(notActiveCodeDifferentType);
                await t
                    .expect((await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1)).length).eql(0);

                await app.ui.hierarchyModal.click('buttons', 'Cancel');
            });
            await app.step(`Check created codes in database`, async () => {
                await t
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.hierarchy.codeTypeID}' and code = '${activeCodeSameType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.hierarchy.codeTypeID}' and code = '${notActiveCodeSameType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.differentCodeTypeID}' and code = '${activeCodeDifferentType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.differentCodeTypeID}' and code = '${notActiveCodeDifferentType}'`)).recordset.length).eql(1);
            });
            await app.step('Go to the Code Management page', async () => {
                await app.ui.closeNativeDialog();
                await app.ui.navigate(`${globalConfig.env.url}/AdminUI/administration`);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.adminMenu.getCard('Management').open('Code Management');
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify created active code with the same code type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeSameType);
                await app.ui.adminBoard.searchItem(activeCodeSameType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.hierarchy.codeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step(`Check inactive code with the same code type`, async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === notActiveCodeSameType);
                await app.ui.adminBoard.searchItem(notActiveCodeSameType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.hierarchy.codeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step('Verify active code with different type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeDifferentType);
                await app.ui.adminBoard.searchItem(activeCodeDifferentType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.differentCodeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step('Verify inactive code with different type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === notActiveCodeDifferentType);
                await app.ui.adminBoard.searchItem(notActiveCodeDifferentType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.differentCodeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete created admin items (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => {
                    return { CodeId: x.CodeId, CodeTypeId: x.CodeTypeId };
                }), 'code');
                app.memory.current.recordsArray = [];
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        (`New Data Entry Form - Verify confirmation and error messages on the Code Management modal of combobox field (Steps 1-10 - ${data.ipType})`, async (t: TestController) => {
            await app.step(`Open data entry record and check control (Step 1)`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.click('fields', data.combobox.name);
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').isVisible('managementControlButton')).ok()
                    .expect(await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').isEnabled('managementControlButton')).ok()
                    .expect(await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').isVisible('pencilIcon')).ok();
            });
            await app.step(`Open the Code Management modal`, async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').fill(data.combobox.value);
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.codeManagementModal.isVisible()).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Save')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Reset')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('help')).ok();
            });
            await app.step('Verify fields in the Code Management modal', async () => {
                const codeInfo = await app.api.administration.codeManagement.openCode(data.combobox.code, data.combobox.codeTypeID);
                await t
                    .expect(await app.ui.codeManagementModal.getField('Description').isVisible('input'))
                    .ok('The Description field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code').isVisible('input'))
                    .ok('The Code field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Active').isVisible('input'))
                    .ok('The Active field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').isPresent('input'))
                    .notOk('The Code Type field is not read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code ID').isPresent('input'))
                    .notOk('The Code ID field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Create User'))
                    .ok('The Create User field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Create Date'))
                    .ok('The Create Date field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Update User'))
                    .ok('The Update User field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Update Date'))
                    .ok('The Update Date field is not read-only')
                    .expect(await app.ui.codeManagementModal.getValue('Description')).eql(codeInfo.CodesDescription)
                    .expect(await app.ui.codeManagementModal.getValue('Code')).eql(data.combobox.code)
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.combobox.codeType)
                    .expect(await app.ui.codeManagementModal.getValue('Code ID')).eql(codeInfo.CodeId)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create User')).eql(codeInfo.CreateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create Date'))
                    .eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update User')).eql(codeInfo.UpdateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update Date'))
                    .eql(app.services.time.toLocal(codeInfo.UpdateDate));
            });
            await app.step('Click the Add New button (Step 2)', async () => {
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.getField('Description').isVisible('input'))
                    .ok('The Description field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue())
                    .eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code').isVisible('input'))
                    .ok('The Code field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue())
                    .eql('')
                    .expect(await app.ui.codeManagementModal.getField('Active').isVisible('input'))
                    .ok('The Active field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked())
                    .ok()
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').isVisible('input'))
                    .ok('The Code Type field is read-only')
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.combobox.codeType);
            });
            await app.step('Close without any changes (Step 3)', async () => {
                await app.ui.codeManagementModal.close();
                await t
                    .expect(await app.ui.codeManagementModal.waitTillElementNotPresent()).ok();
            });
            await app.step('Reopen the Code Management modal and make some changes (Step 4)', async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.getField('Description').fill('Test Code');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').uncheck();
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).ok();
            });
            await app.step (`Click Close->Cancel on the Code Management modal`, async () => {
                await app.ui.codeManagementModal.close();
                await t
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.differentCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).notOk();
            });
            await app.step(`Click Close->Continue on the Code Management modal (Step 5)`, async () => {
                await app.ui.codeManagementModal.close();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await app.ui.codeManagementModal.waitTillElementNotPresent()).ok();
            });
            await app.step('Reopen the Code Management modal and make some changes (Step 6)', async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.getField('Description').fill('Test Code');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').uncheck();
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).ok();
            });
            await app.step('Click Reset->Cancel on the Code Management modal', async () => {
                await app.ui.codeManagementModal.reset();
                await t
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.differentCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).notOk();
            });
            await app.step('Click Reset->Continue on the Code Management modal (Step 7)', async () => {
                await app.ui.codeManagementModal.reset();
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.combobox.codeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).ok();
            });
            await app.step('Reopen the Code Management modal (Step 8)', async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
            });
            await app.step(`Save with one missing required field value`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.save();
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('Missing required field value(s): Description');
                await app.ui.errorModal.click('buttons', 'Ok');
                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
                await app.ui.codeManagementModal.save();
                await app.ui.errorModal.click('cross');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code');
            });
            await app.step(`Save with all missing required field values (Step 9)`, async () => {
                await app.ui.codeManagementModal.getField('Code Type', 'dropdown').clear();
                await app.ui.codeManagementModal.getField('Code').clear();
                await app.ui.codeManagementModal.getField('Description').clear();
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('Missing required field value(s): Code, Description, Code Type');
                await app.ui.errorModal.click('cross');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql('');
            });
            await app.step(`Save with existing code name (Step 10)`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill(data.existingCodeName);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.existingCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('The Code and Code Type combination must be unique.');
            });
            await app.step(`Click Ok on the Error message`, async () => {
                await app.ui.errorModal.click('buttons', 'Ok');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql(data.existingCodeName)
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.existingCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Description');
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.createCode)
        (`New Data Entry Form - Create and access new codes for combobox (Steps 11-13 - ${data.ipType})`, async (t) => {
            let userDateFormat = (await app.api.userPreferences.getUserPreferences()).Preferences.DateFormat.Value.toUpperCase();
            let expectedDateFormat = userDateFormat + ' HH:mm:ss';
            let activeCodeSameType = `code${app.services.time.timestampShortWithMilliseconds()}.1Simple`;
            let notActiveCodeSameType = `code${app.services.time.timestampShortWithMilliseconds()}.2Simple`;
            let activeCodeDifferentType = `code${app.services.time.timestampShortWithMilliseconds()}.3Simple`;
            let notActiveCodeDifferentType = `code${app.services.time.timestampShortWithMilliseconds()}.4Simple`;
            await app.step(`Go to data entry record and open Code Management modal for combobox`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
            });
            await app.step(`Save active code with initial code type (Step 11)`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill(activeCodeSameType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('check');
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.combobox.codeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            });
            await app.step(`Select created code in the dropdown (Step 12)`, async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name).fill(activeCodeSameType);
                await app.ui.waitLoading({checkErrors: true});
                const possibleValues = await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown'). getPossibleValues();
                await t
                    .expect(possibleValues.length).eql(1)
                    .expect(possibleValues[0]).contains(activeCodeSameType)
                    .expect(possibleValues[0]).contains('Test Description');
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').selectRow(possibleValues[0]);
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.combobox.name).getValue()).eql(possibleValues[0]);
            });
            await app.step('Click on the Edit button', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeSameType);
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                const createDate = await app.ui.codeManagementModal.auditInfo.getValue('Update Date');
                const updateDate = await app.ui.codeManagementModal.auditInfo.getValue('Create Date');
                await t
                    .expect(await app.ui.codeManagementModal.getValue('Code')).eql(activeCodeSameType)
                    .expect(await app.ui.codeManagementModal.getValue('Description')).eql('Test Description')
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.combobox.codeType)
                    .expect(await app.ui.codeManagementModal.getValue('Code ID')).eql(codeInfo.CodeId)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update User')).eql(codeInfo.UpdateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create User')).eql(codeInfo.CreateUser)
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step(`Create not active code with the same type`, async () => {
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(notActiveCodeSameType);
                await app.ui.codeManagementModal.getField('Description').fill('not active, same type');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('uncheck');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.combobox.codeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await app.ui.dataEntryBoard.getField(data.combobox.name).fill(notActiveCodeSameType);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect((await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown'). getPossibleValues()).length).eql(0);
            });
            await app.step(`Create not active code with different type`, async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(notActiveCodeDifferentType);
                await app.ui.codeManagementModal.getField('Description').fill('other code type, not active');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('uncheck');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await app.ui.dataEntryBoard.getField(data.combobox.name).fill(notActiveCodeDifferentType);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect((await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown'). getPossibleValues()).length).eql(0);
            });
            await app.step(`Create active code with different type`, async () => {
                await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(activeCodeDifferentType);
                await app.ui.codeManagementModal.getField('Description').fill('other code type, active');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('check');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await app.ui.dataEntryBoard.getField(data.combobox.name).fill(activeCodeDifferentType);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect((await app.ui.dataEntryBoard.getField(data.combobox.name, 'dropdown'). getPossibleValues()).length).eql(0);
            });
            await app.step(`Check created codes in database`, async () => {
                await t
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.combobox.codeTypeID}' and code = '${activeCodeSameType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.combobox.codeTypeID}' and code = '${notActiveCodeSameType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.differentCodeTypeID}' and code = '${activeCodeDifferentType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.differentCodeTypeID}' and code = '${notActiveCodeDifferentType}'`)).recordset.length).eql(1);
            });
            await app.step('Go to the Code Management page', async () => {
                await app.ui.closeNativeDialog();
                await app.ui.navigate(`${globalConfig.env.url}/AdminUI/administration`);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.adminMenu.getCard('Management').open('Code Management');
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify created active code with the same code type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeSameType);
                await app.ui.adminBoard.searchItem(activeCodeSameType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.combobox.codeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step(`Check inactive code with the same code type`, async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === notActiveCodeSameType);
                await app.ui.adminBoard.searchItem(notActiveCodeSameType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.combobox.codeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step('Verify active code with different type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeDifferentType);
                await app.ui.adminBoard.searchItem(activeCodeDifferentType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.differentCodeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step('Verify inactive code with different type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === notActiveCodeDifferentType);
                await app.ui.adminBoard.searchItem(notActiveCodeDifferentType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.differentCodeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete created admin items (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => {
                    return { CodeId: x.CodeId, CodeTypeId: x.CodeTypeId };
                }), 'code');
                app.memory.current.recordsArray = [];
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.simple)
        (`New Data Entry Form - Verify confirmation and error messages on the Code Management modal of hierarchy field (Steps 1-10 - ${data.ipType})`, async (t) => {
            await app.step(`Open data entry record and check control`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.click('fields', data.hierarchy.name);
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').isVisible('managementControlButton')).ok()
                    .expect(await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').isEnabled('managementControlButton')).ok()
                    .expect(await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').isVisible('pencilIcon')).ok();
            });
            await app.step(`Open the Code Management modal`, async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').fill(data.hierarchy.value);
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.codeManagementModal.isVisible()).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Save')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Reset')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('help')).ok();
            });
            await app.step('Verify fields in the Code Management modal', async () => {
                const codeInfo = await app.api.administration.codeManagement.openCode(data.hierarchy.code, data.hierarchy.codeTypeID);
                await t
                    .expect(await app.ui.codeManagementModal.getField('Description').isVisible('input'))
                    .ok('The Description field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code').isVisible('input'))
                    .ok('The Code field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Active').isVisible('input'))
                    .ok('The Active field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').isPresent('input'))
                    .notOk('The Code Type field is not read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code ID').isPresent('input'))
                    .notOk('The Code ID field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Create User'))
                    .ok('The Create User field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Create Date'))
                    .ok('The Create Date field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Update User'))
                    .ok('The Update User field is not read-only')
                    .expect(await app.ui.codeManagementModal.auditInfo.isReadOnly('Update Date'))
                    .ok('The Update Date field is not read-only')
                    .expect(await app.ui.codeManagementModal.getValue('Description')).eql(codeInfo.CodesDescription)
                    .expect(await app.ui.codeManagementModal.getValue('Code')).eql(data.hierarchy.code)
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.hierarchy.codeType)
                    .expect(await app.ui.codeManagementModal.getValue('Code ID')).eql(codeInfo.CodeId)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create User')).eql(codeInfo.CreateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create Date'))
                    .eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update User')).eql(codeInfo.UpdateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update Date'))
                    .eql(app.services.time.toLocal(codeInfo.UpdateDate));
            });
            await app.step('Click the Add New button (Step 2)', async () => {
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).notOk()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.getField('Description').isVisible('input'))
                    .ok('The Description field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue())
                    .eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code').isVisible('input'))
                    .ok('The Code field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue())
                    .eql('')
                    .expect(await app.ui.codeManagementModal.getField('Active').isVisible('input'))
                    .ok('The Active field is read-only')
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked())
                    .ok()
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').isVisible('input'))
                    .ok('The Code Type field is read-only')
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.hierarchy.codeType);
            });
            await app.step('Close without any changes (Step 3)', async () => {
                await app.ui.codeManagementModal.close();
                await t
                    .expect(await app.ui.codeManagementModal.waitTillElementNotPresent()).ok();
            });
            await app.step('Reopen the Code Management modal and make some changes (Step 4)', async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.getField('Description').fill('Test Code');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').uncheck();
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Add New')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Close')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).ok()
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Save')).ok();
            });
            await app.step (`Click Close->Cancel on the Code Management modal`, async () => {
                await app.ui.codeManagementModal.close();
                await t
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.differentCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).notOk();
            });
            await app.step(`Click Continue on the confirmation message`, async () => {
                await app.ui.codeManagementModal.close();
                await app.ui.confirmationModal.click('buttons', 'Continue');
                await t
                    .expect(await app.ui.codeManagementModal.waitTillElementNotPresent()).ok;
            });
            await app.step('Reopen the Code Management modal and make some changes (Step 6)', async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.getField('Description').fill('Test Code');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').uncheck();
                await t
                    .expect(await app.ui.codeManagementModal.isEnabled('buttons', 'Reset')).ok();
            });
            await app.step('Click Reset->Cancel on the Code Management modal', async () => {
                await app.ui.codeManagementModal.reset();
                await t
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                    .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Code')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.differentCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).notOk();
            });
            await app.step('Click Reset->Continue on the Code Management modal (Step 7)', async () => {
                await app.ui.codeManagementModal.reset();
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.hierarchy.codeType)
                    .expect(await app.ui.codeManagementModal.getField('Active', 'checkbox').isChecked()).ok();
            });
            await app.step('Reopen the Code Management modal(Step 8)', async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.click('buttons', 'Add New');
            });
            await app.step(`Save with one missing required field value`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill('Test Code');
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('Missing required field value(s): Description');
                await app.ui.errorModal.click('buttons', 'Ok');
                await t
                    .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.errorModal.click('cross');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('Test Code');
            });
            await app.step(`Save with all missing required field values`, async () => {
                await app.ui.codeManagementModal.getField('Code Type', 'dropdown').clear();
                await app.ui.codeManagementModal.getField('Code').clear();
                await app.ui.codeManagementModal.getField('Description').clear();
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('Missing required field value(s): Code, Description, Code Type');
                await app.ui.errorModal.click('cross');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('')
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql('');
            });
            await app.step(`Save with existing code name`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill(data.existingCodeName);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.existingCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading();
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage')).eql('The Code and Code Type combination must be unique.');
            });
            await app.step(`Click Ok on the Error message`, async () => {
                await app.ui.errorModal.click('buttons', 'Ok');
                await t
                    .expect(await app.ui.codeManagementModal.getField('Code').getValue()).eql(data.existingCodeName)
                    .expect(await app.ui.codeManagementModal.getField('Code Type', 'dropdown').getValue()).eql(data.existingCodeType)
                    .expect(await app.ui.codeManagementModal.getField('Description').getValue()).eql('Test Description');
            });
        });
    });

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.createCode, app.ui.requestLogger.simple)
        (`New Data Entry Form - Create and access new codes for hierarchy field (Steps 11-13 - ${data.ipType})`, async (t) => {
            let userDateFormat = (await app.api.userPreferences.getUserPreferences()).Preferences.DateFormat.Value.toUpperCase();
            let expectedDateFormat = userDateFormat + ' HH:mm:ss';
            let activeCodeSameType = `code${app.services.time.timestampShortWithMilliseconds()}.1Simple`;
            let notActiveCodeSameType = `code${app.services.time.timestampShortWithMilliseconds()}.2Simple`;
            let activeCodeDifferentType = `code${app.services.time.timestampShortWithMilliseconds()}.3Simple`;
            let notActiveCodeDifferentType = `code${app.services.time.timestampShortWithMilliseconds()}.4Simple`;
            await app.step(`Go to data entry record and open Code Management modal for combobox`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.viewIn);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.click('fields', data.hierarchy.name);
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
            });
            await app.step(`Save active code with initial code type (Step 11)`, async () => {
                await app.ui.codeManagementModal.getField('Code').fill(activeCodeSameType);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.hierarchy.codeType);
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('check');
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            });
            await app.step(`Select created code in the hierarchy modal`, async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').clickSearch();
                await app.ui.hierarchyModal.searchItem(activeCodeSameType);
                const allPossibleValues = await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1);
                await t
                    .expect(allPossibleValues.length).eql(1)
                    .expect(allPossibleValues[0]).contains(activeCodeSameType)
                    .expect(allPossibleValues[0]).contains('Test Description');
                await app.ui.hierarchyModal.kendoTreeview.open(allPossibleValues[0]);
                await app.ui.hierarchyModal.click('buttons', 'Add');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').getValue()).contains(allPossibleValues[0]);
            });
            await app.step('Click on the Edit button', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeSameType);
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'dropdown').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                const createDate = await app.ui.codeManagementModal.auditInfo.getValue('Update Date');
                const updateDate = await app.ui.codeManagementModal.auditInfo.getValue('Create Date');
                await t
                    .expect(await app.ui.codeManagementModal.getValue('Code')).eql(activeCodeSameType)
                    .expect(await app.ui.codeManagementModal.getValue('Description')).eql('Test Description')
                    .expect(await app.ui.codeManagementModal.getValue('Code Type')).eql(data.hierarchy.codeType)
                    .expect(await app.ui.codeManagementModal.getValue('Code ID')).eql(codeInfo.CodeId)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Update User')).eql(codeInfo.UpdateUser)
                    .expect(await app.ui.codeManagementModal.auditInfo.getValue('Create User')).eql(codeInfo.CreateUser)
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step(`Create not active code with different type`, async () => {
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(notActiveCodeSameType);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('uncheck');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.hierarchy.codeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
            });
            await app.step(`Create not active code with different type`, async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(notActiveCodeDifferentType);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('uncheck');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
            });
            await app.step(`Create active code with different type`, async () => {
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').click('managementControlButton');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.codeManagementModal.addNew();
                await app.ui.codeManagementModal.getField('Code').fill(activeCodeDifferentType);
                await app.ui.codeManagementModal.getField('Description').fill('Test Description');
                await app.ui.codeManagementModal.getField('Active', 'checkbox').fill('check');
                await app.ui.codeManagementModal.getField('Code Type', 'autocomplete').fill(data.differentCodeType);
                await app.ui.codeManagementModal.click('buttons', 'Save');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.recordsArray.push(app.ui.getLastResponseBody('createCode'));
            });
            await app.step(`Verify newly created codes in the hierarchy modal`, async () => {
                if (await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Reset')) {
                    await app.ui.dataEntryBoard.reset();
                    await app.ui.waitLoading({checkErrors: true});
                    await app.ui.confirmationModal.confirm();
                }
                await app.ui.refresh();
                await app.ui.dataEntryBoard.getField(data.hierarchy.name, 'hierarchy').clickSearch();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.hierarchyModal.searchItem(notActiveCodeSameType);
                let allPossibleValues = await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1);
                await app.ui. hierarchyModal.kendoTreeview.open(allPossibleValues[0]);
                await t
                    .expect(allPossibleValues.length).eql(1)
                    .expect(allPossibleValues[0]).contains(notActiveCodeSameType)
                    .expect(allPossibleValues[0]).contains('Test Description')
                    .expect(await app.ui.hierarchyModal.kendoTreeview.isItemEnabled(allPossibleValues[0])).notOk()
                    .expect(await app.ui.hierarchyModal.isEnabled('buttons', 'Add')).notOk();
                await app.ui.hierarchyModal.searchItem(activeCodeDifferentType);
                await t
                    .expect((await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1)).length).eql(0);
                await app.ui.hierarchyModal.searchItem(notActiveCodeDifferentType);
                await t
                    .expect((await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1)).length).eql(0);

                await app.ui.hierarchyModal.click('buttons', 'Cancel');
            });
            await app.step(`Check created codes in database`, async () => {
                await t
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.hierarchy.codeTypeID}' and code = '${activeCodeSameType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.hierarchy.codeTypeID}' and code = '${notActiveCodeSameType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.differentCodeTypeID}' and code = '${activeCodeDifferentType}'`)).recordset.length).eql(1)
                    .expect((await app.services.db.executeDatabaseQuery(`select * from codes where codeTypeID = '${data.differentCodeTypeID}' and code = '${notActiveCodeDifferentType}'`)).recordset.length).eql(1);
            });
            await app.step('Go to the Code Management page', async () => {
                await app.ui.closeNativeDialog();
                await app.ui.navigate(`${globalConfig.env.url}/AdminUI/administration`);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.adminMenu.getCard('Management').open('Code Management');
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify created active code with the same code type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeSameType);
                await app.ui.adminBoard.searchItem(activeCodeSameType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.hierarchy.codeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step(`Check inactive code with the same code type`, async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === notActiveCodeSameType);
                await app.ui.adminBoard.searchItem(notActiveCodeSameType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.hierarchy.codeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step('Verify active code with different type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === activeCodeDifferentType);
                await app.ui.adminBoard.searchItem(activeCodeDifferentType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.differentCodeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
            await app.step('Verify inactive code with different type', async () => {
                const codeInfo = app.memory.current.recordsArray.find((x) => x.Code === notActiveCodeDifferentType);
                await app.ui.adminBoard.searchItem(notActiveCodeDifferentType);
                await app.ui.adminBoard.grid.openRecordByValueInColumn('Code Types', data.differentCodeTypeID);
                await app.ui.waitLoading({checkErrors: true});
                const updateDate = await app.ui.adminBoard.auditInfo.getValue('Update Date');
                const createDate = await app.ui.adminBoard.auditInfo.getValue('Create Date');
                await t
                    .expect(updateDate).eql(app.services.time.toLocal(codeInfo.UpdateDate))
                    .expect(createDate).eql(app.services.time.toLocal(codeInfo.CreateDate))
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Create User')).eql(app.ui.currentUser.userName)
                    .expect(await app.ui.adminBoard.auditInfo.getValue('Update User')).eql(app.ui.currentUser.userName)
                    .expect(app.services.time.matchDateFormat(createDate, expectedDateFormat)).ok()
                    .expect(app.services.time.matchDateFormat(updateDate, expectedDateFormat)).ok();
            });
        })
        .after(async () => {
            await app.step('Delete created admin items (API)', async () => {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => {
                    return { CodeId: x.CodeId, CodeTypeId: x.CodeTypeId };
                }), 'code');
                app.memory.current.recordsArray = [];
            });
        });
    });

test
    // .only
    .meta('brief', 'true')
    .meta('category', 'Display Configuration')
    .requestHooks(app.ui.requestLogger.createCode, app.ui.requestLogger.simple)
    ('DEF - Create and Access New Code - Verify Display Configuration (Step 18)', async (t) => {
        await app.step('Change display configuration for user (API)', async () => {
            app.ui.resetRole();
            await app.api.login();
            await app.api.changeDisplayConfigurationForUser('TA Custom Display Configuration', globalConfig.user.userName);
        });
        await app.step('Open Code Management modal and check control names', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.naviBar.click('links', 'Query');
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.click('fields', 'Test - CASETYPE');
            await app.ui.dataEntryBoard.getField('Test - CASETYPE', 'dropdown').click('managementControlButton');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.codeManagementModal.click('buttons', 'Test - Add New');
            await app.ui.codeManagementModal.hover('help');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Test - Help')
                .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Test - Add New')).ok()
                .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Test - Close')).ok()
                .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Test - Save')).ok()
                .expect(await app.ui.codeManagementModal.isVisible('buttons', 'Test - Reset')).ok()
                .expect(await app.ui.codeManagementModal.isVisible('fields', 'Test - Description')).ok()
                .expect(await app.ui.codeManagementModal.isVisible('fields', 'Test - Code')).ok()
                .expect(await app.ui.codeManagementModal.isVisible('fields', 'Test - Code Type')).ok()
                .expect(await app.ui.codeManagementModal.getField('Test - Code Type').getValue()).eql('CSP (Test - Patent Case Type)');
        });
        await app.step ('Verify confirmation message for unsaved changes on modal', async () => {
            await app.ui.codeManagementModal.getField('Test - Code').fill(`code${app.services.random.num()}Simple`);
            await app.ui.codeManagementModal.click('buttons', 'Test - Close');
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Test - Unsaved changes will be lost. Do you want to continue?');
            await app.ui.confirmationModal.cancel();
        });
        await app.step('Verify error message for missing required fields', async () => {
            await app.ui.codeManagementModal.getField('Test - Code').fill(`code${app.services.random.num()}Simple`);
            await app.ui.codeManagementModal.click('buttons', 'Test - Save');
            await t
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Test - Missing required field value(s):Test - Description');
            await app.ui.errorModal.click('cross');
        });
        await app.step('Verify error message for not unique code', async () => {
            await app.ui.codeManagementModal.getField('Test - Code').fill('TA code FLP');
            await app.ui.codeManagementModal.getField('Test - Description').fill('Test Description');
            await app.ui.codeManagementModal.getField('Test - Code Type', 'dropdown').fill('FLP (Test - Patent Filing Type)');
            await app.ui.codeManagementModal.click('buttons', 'Test - Save');
            await t
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Test - The Code and Code Type combination must be unique.');
            await app.ui.errorModal.click('cross');
        });
        await app.step('Verify message for successful save', async () => {
            await app.ui.codeManagementModal.getField('Test - Code').fill(`code${app.services.random.num()}Simple`);
            await app.ui.codeManagementModal.getField('Test - Active', 'checkbox').fill('check');
            await app.ui.codeManagementModal.getField('Test - Description').fill('Test Description');
            await app.ui.codeManagementModal.getField('Test - Code Type', 'dropdown').fill('CSP (Test - Patent Case Type)');
            await app.ui.codeManagementModal.click('buttons', 'Test - Save');
            await app.ui.waitLoading({checkErrors: true});
            app.memory.current.recordsArray.push({
                CodeId: app.ui.getLastResponseBody('createCode').CodeId,
                CodeTypeId: app.ui.getLastRequestBody('createCode').CodesCodeTypeId
            });
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Test - Save was successful.');
        });
    })
    .after(async () => {
        await app.step('Delete created code (API) and change display configuration to default (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray, 'code');
                app.memory.current.recordsArray = [];
                await app.api.changeDisplayConfigurationForUser('Default Display Configuration 1', globalConfig.user.userName);
                app.ui.resetRole();
            } catch (err) {}
        });
    });
