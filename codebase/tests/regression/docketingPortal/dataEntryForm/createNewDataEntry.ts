import app from '../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.dataEntryForm.pack. - Test ID 30005: DEF_Create New Data Entry`
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
    .requestHooks(app.ui.requestLogger.createRecord)
    (`Check Data Entry form Items (Steps 3, 17)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form from preconditions and check items', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.dataEntryBoard.waitTillElementNotPresent('recordIdRow')).ok()
                .expect(await app.ui.dataEntryBoard.waitTillElementNotPresent('menuButtons', 'Previous')).ok()
                .expect(await app.ui.dataEntryBoard.waitTillElementNotPresent('menuButtons', 'Next')).ok()
                .expect(await app.ui.dataEntryBoard.areFieldsVisible([
                    'Docket Number',
                    'Country / Region',
                    'Expiration Date',
                    'Drawings',
                    'Convention Type',
                    'Application Number',
                    'Power of Attorney',
                    'Tax Agent'])).notContains(false)
                .expect(await app.ui.dataEntryBoard.isVisible('tabs', 'Patents')).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('tabNotes', 'Enter or verify critical bibliographic data and responsible parties')).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('tabs', 'Bibliographic Data with very long name to show through UI and I can check it')).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok()
                .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save', {isTextExact: true})).ok()
                .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).notOk()
                .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Reset')).ok()
                .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Reset')).notOk()
                .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Duplicate')).ok()
                .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Duplicate')).notOk()
                .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'More')).ok()
                .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'More')).notOk()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.dataEntryBoard.hover('tabs', 'Bibliographic Data');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Bibliographic Data with very long name to show through UI and I can check it');
            await app.ui.dataEntryBoard.click('tabs', 'Bibliographic Data');
            await t
                .expect(await app.ui.dataEntryBoard.isVisible('tabNotes', 'List all contributors to this invention, listing the primary or lead inventor first')).ok()
                .expect(await app.ui.dataEntryBoard.areFieldsVisible([
                    'Manual Expiration User',
                    'Manual Expiration Date'])).notContains(false)
                .expect(await app.ui.dataEntryBoard.getField('Manual Expiration User').isReadOnly()).ok()
                .expect(await app.ui.dataEntryBoard.getField('Manual Expiration Date').isReadOnly()).ok();
            await app.ui.dataEntryBoard.click('tabs', 'Patents');
        });
        await app.step('Verify record identifier', async () => {
            app.memory.current.recordName = `patent${app.services.time.timestampShort()}Simple`;
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(app.memory.current.recordName);
            const statusAutocomplete = app.ui.dataEntryBoard.getField('Status', 'autocomplete');
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            let recordIdentifier = await app.ui.dataEntryBoard.getRecordIdentifier();
            let idItems = recordIdentifier.split(/[: -]{2,3}/);
            app.memory.current.masterId = app.ui.getLastResponseBody('createRecord').FilingSectionDefinition.RecordId;
            await t
                .expect(idItems).contains(app.memory.current.recordName)
                .expect(idItems).contains('')
                .expect(idItems).contains('AE')
                .expect(idItems).contains('Regular')
                .expect(idItems).contains(app.memory.current.masterId.toString())
                .expect(idItems).contains('Current Record');
            await statusAutocomplete.fill('Testing from Admin - (Cherry_123)');
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            recordIdentifier = await app.ui.dataEntryBoard.getRecordIdentifier();
            idItems = recordIdentifier.split(/[: -]{2,3}/);
            await t
                .expect(idItems).contains(app.memory.current.recordName)
                .expect(idItems).contains('Testing from Admin')
                .expect(idItems).contains('AE')
                .expect(idItems).contains('Regular')
                .expect(idItems).contains(app.memory.current.masterId.toString())
                .expect(idItems).contains('Current Record');
            await statusAutocomplete.typeText('Very long code description:');
            await statusAutocomplete.selectTop();
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            recordIdentifier = await app.ui.dataEntryBoard.getRecordIdentifier();
            await app.ui.dataEntryBoard.hover('recordIdRow');
            const idFromTooltip = await app.ui.kendoPopup.getText('tooltip');
            await t
                .expect(recordIdentifier).contains(idFromTooltip);
        });
    })
    .after(async (t) => {
        await app.step('Delete the records (API)', async () => {
            app.ui.setCookie('createRecord');
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
    .requestHooks(app.ui.requestLogger.createRecord)
    (`Check Data Entry form Fields (Steps 4-10, 16, 18)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Large List Lookup and Combobox fields', async () => {
            await app.ui.dataEntryBoard.click('tabs', 'Patents');
            const taxAgentAutocomplete = app.ui.dataEntryBoard.getField('Tax Agent', 'autocomplete');
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await taxAgentAutocomplete.isFocused('input'));
            }, 30);
            await taxAgentAutocomplete.typeText('sdfsdfsdf');
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect(await app.ui.kendoPopup.getText('noDataInfo')).ok('0 items found');
            // with no testing
            await taxAgentAutocomplete.typeText('str');
            await app.ui.kendoPopup.waitLoading();
            let options = await taxAgentAutocomplete.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(option.toLowerCase()).contains('str');
            }
            await taxAgentAutocomplete.typeText('222');
            await app.ui.kendoPopup.waitLoading();
            options = await taxAgentAutocomplete.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(option.toLowerCase()).contains('222');
            }
            await taxAgentAutocomplete.typeText('&');
            await app.ui.kendoPopup.waitLoading();
            options = await taxAgentAutocomplete.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(option.toLowerCase()).contains('&');
            }
            await taxAgentAutocomplete.typeText('A');
            await app.ui.kendoPopup.waitLoading();
            options = await taxAgentAutocomplete.getAllDisplayedOptions();
            await taxAgentAutocomplete.selectTop();
            const value = await taxAgentAutocomplete.getValue();
            let position: number;
            for (let i in options) {
                if (options[i] === value) {
                    position = parseInt(i);
                }
            }
            await t
                .expect(options).contains(value)
                .expect(position).eql(0)
                .expect(await taxAgentAutocomplete.isVisible('clearCross')).ok()
                .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).ok()
                .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Reset')).ok()
                .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Duplicate')).notOk();
        });
        await app.step('Check Hierarchy field', async () => {
            const conventionTypeHierarchy = app.ui.dataEntryBoard.getField('Convention Type', 'hierarchy');
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await conventionTypeHierarchy.isFocused('input'));
            }, 30);
            await app.ui.pressKey('tab', 2);
            await app.ui.pressKey('enter');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.hierarchyModal.isVisible()).ok()
                .expect(await app.ui.hierarchyModal.searchBox.isVisible()).ok()
                .expect(await app.ui.hierarchyModal.isVisible('buttons', 'Add')).ok()
                .expect(await app.ui.hierarchyModal.isVisible('cross')).ok()
                .expect(await app.ui.hierarchyModal.isVisible('buttons', 'Cancel')).ok();
            await app.ui.hierarchyModal.searchItem('st');
            let options = await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1);
            for (let option of options) {
                await t.expect(option.toLowerCase()).contains('st');
            }
            await app.ui.hierarchyModal.searchItem('1');
            options = await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1);
            for (let option of options) {
                await t.expect(option.toLowerCase()).contains('1');
            }
            await app.ui.hierarchyModal.searchItem('@');
            options = await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1);
            for (let option of options) {
                await t.expect(option.toLowerCase()).contains('@');
            }
            await app.ui.hierarchyModal.searchItem('!!!');
            await t.expect(await await app.ui.hierarchyModal.getText('dataBox')).eql('0 items found');
            await app.ui.hierarchyModal.clearSearch();
            await app.ui.hierarchyModal.kendoTreeview.hoverItem('Code for TA - (Code with very lond name to check troncation into Test Automation scripts and it is not enough lengt)');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Code for TA - (Code with very lond name to check troncation into Test Automation scripts and it is not enough lengt)');
            await app.ui.hierarchyModal.kendoTreeview.open('Code for TA - (Code with very lond name to check troncation into Test Automation scripts and it is not enough lengt)');
            await app.ui.hierarchyModal.click('buttons', 'Add');
            await t
                .expect(await conventionTypeHierarchy.getValue()).eql('Code for TA - (Code with very lond name to check troncation into Test Automation scripts and it is not enough lengt)')
                .expect(await conventionTypeHierarchy.isVisible('clearButton')).ok();
            await conventionTypeHierarchy.hover('inputBox');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Code for TA - (Code with very lond name to check troncation into Test Automation scripts and it is not enough lengt)');
            await app.ui.dataEntryBoard.hover('tabs', 'Patents');
        });
        await app.step('Check Textbox field', async () => {
            const examinerTextBox = app.ui.dataEntryBoard.getField('Examiner', 'input');
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await examinerTextBox.isFocused('input'));
            }, 30);
            await examinerTextBox.fill('Hello world');
            await t
                .expect(await examinerTextBox.getValue()).eql('Hello world');
            await examinerTextBox.fill('Goodbye world', {isPaste: true});
            await t
                .expect(await examinerTextBox.getValue()).eql('Goodbye world');
        });
        await app.step('Check Multiline field', async () => {
            const appNumberMultiline = app.ui.dataEntryBoard.getField('Application Number', 'input');
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await appNumberMultiline.isFocused('input'));
            }, 30);
            await appNumberMultiline.fill(`Hello world\n Colleagues`);
            await t
                .expect(await appNumberMultiline.getValue()).eql(`Hello world\n Colleagues`);
            await appNumberMultiline.fill(`Goodbye world\n Mates`, {isPaste: true});
            await t
                .expect(await appNumberMultiline.getValue()).eql(`Goodbye world\n Mates`);
        });
        await app.step('Check Calendar field', async () => {
            const expirationDateDatepicker = app.ui.dataEntryBoard.getField('Expiration Date', 'datepicker');
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await expirationDateDatepicker.isFocused('input'));
            }, 30);
            const date = app.services.time.getDate();
            await expirationDateDatepicker.fill(date);
            await t
                .expect(await expirationDateDatepicker.getValue()).eql(date);
            await expirationDateDatepicker.fill(date, {isPaste: true});
            await t
                .expect(await expirationDateDatepicker.getValue()).eql(date);
            await expirationDateDatepicker.expand();
            await expirationDateDatepicker.selectToday();
            await t
                .expect(await expirationDateDatepicker.getValue()).eql(date);
        });
        await app.step('Check Numeric field', async () => {
            const drawingsNumeric = app.ui.dataEntryBoard.getField('Drawings', 'numeric');
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await drawingsNumeric.isFocused('input'));
            }, 30);
            await drawingsNumeric.fill('2');
            await t
                .expect(await drawingsNumeric.getValue()).eql('2');
            await drawingsNumeric.fill('3', {isPaste: true});
            await t
                .expect(await drawingsNumeric.getValue()).eql('3');
            await drawingsNumeric.increase(2);
            await t
                .expect(await drawingsNumeric.getValue()).eql('5');
            await drawingsNumeric.decrease(3);
            await t
                .expect(await drawingsNumeric.getValue()).eql('2');
        });
        await app.step('Check Checkbox field', async () => {
            const powerOfAttorneyCheckbox = app.ui.dataEntryBoard.getField('Power of Attorney', 'checkbox');
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await powerOfAttorneyCheckbox.isFocused('input'));
            }, 30);
            await app.ui.pressKey('space');
            await t
                .expect(await powerOfAttorneyCheckbox.isChecked()).ok();
            await powerOfAttorneyCheckbox.uncheck();
            await t
                .expect(await powerOfAttorneyCheckbox.isChecked()).notOk();
        });
        await app.step('Verify Multiselect field in duplication modal', async () => {
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(`patent${app.services.time.timestampShort()}Simple`);
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.click('menuButtons', 'Duplicate');
            await app.ui.kendoPopup.selectItem('Patent to Patent');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.duplicationModal.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            const countriesRegionsMultiselect = app.ui.duplicationModal.getField('Countries / Regions', 'multiselect');
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await countriesRegionsMultiselect.isFocused());
            }, 30);
            await countriesRegionsMultiselect.typeText('str');
            let options = await countriesRegionsMultiselect.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(option.toLowerCase()).contains('str');
            }
            await countriesRegionsMultiselect.typeText('2');
            options = await countriesRegionsMultiselect.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(option.toLowerCase()).contains('2');
            }
            await countriesRegionsMultiselect.typeText('&');
            options = await countriesRegionsMultiselect.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(option.toLowerCase()).contains('&');
            }
            await countriesRegionsMultiselect.typeText('aawevawefawef');
            await t
                .expect(await app.ui.kendoPopup.getText('noDataInfo')).ok('0 items found');
            await countriesRegionsMultiselect.typeText('US - (United States)');
            await countriesRegionsMultiselect.selectTop();
            let results = await countriesRegionsMultiselect.getSelectedItems();
            await t
                .expect(results).contains('US - (United States)')
                .expect(results.length).eql(1);
            await countriesRegionsMultiselect.typeText('AE - (United Arab Emirates)');
            await countriesRegionsMultiselect.selectTop();
            results = await countriesRegionsMultiselect.getSelectedItems();
            await t
                .expect(results).contains('US - (United States)')
                .expect(results).contains('AE - (United Arab Emirates)')
                .expect(results.length).eql(2);
            await countriesRegionsMultiselect.removeItem('US - (United States)');
            results = await countriesRegionsMultiselect.getSelectedItems();
            await t
                .expect(results).contains('AE - (United Arab Emirates)')
                .expect(results.length).eql(1);
            await app.ui.duplicationModal.close();
            await app.ui.confirmationModal.confirm();
        });
        await app.step('Check system fields', async () => {
            await t
                .expect(await app.ui.dataEntryBoard.getField('Create User').isLocked()).ok()
                .expect(await app.ui.dataEntryBoard.getField('Update User').isLocked()).ok()
                .expect(await app.ui.dataEntryBoard.getField('Create Date').isLocked()).ok()
                .expect(await app.ui.dataEntryBoard.getField('Update Date').isLocked()).ok()
                .expect(await app.ui.dataEntryBoard.getField('Create User').getLockedValue())
                .eql(globalConfig.user.userName)
                .expect(await app.ui.dataEntryBoard.getField('Update User').getLockedValue())
                .eql(globalConfig.user.userName)
                .expect(await app.ui.dataEntryBoard.getField('Create Date').getLockedValue())
                .match(/\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2}:\d{2}/)
                .expect(await app.ui.dataEntryBoard.getField('Update Date').getLockedValue())
                .match(/\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2}:\d{2}/);
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await app.ui.dataEntryBoard.getField('Create User').isFocused('span'));
            }, 30);
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await app.ui.dataEntryBoard.getField('Create Date').isFocused('span'));
            }, 30);
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await app.ui.dataEntryBoard.getField('Update User').isFocused('span'));
            }, 30);
            await app.doTill(async () => {
                await app.ui.pressKey('tab');
            }, async () => {
                return !(await app.ui.dataEntryBoard.getField('Update Date').isFocused('span'));
            }, 30);
        });
    })
    .after(async (t) => {
        await app.step('Delete the records (API)', async () => {
            app.ui.setCookie('createRecord');
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

const dataSet = (function() {
    const patentName = `patent${app.services.time.timestampShort()}Simple`;
    const disclosureName = `disclosure${app.services.time.timestampShort()}Simple`;
    const trademarkName = `trademark${app.services.time.timestampShort()}Simple`;
    const generalipName = `generalip${app.services.time.timestampShort()}Simple`;
    return [
        {
            ipType: 'Patent',
            recordName: patentName,
            requiredField: {name: 'Country / Region', type: 'autocomplete', value: 'US - (United States)'},
            requiredFields: [
                {name: 'Docket Number', type: 'input', value: patentName},
                {name: 'Country / Region', type: 'autocomplete', value: 'US - (United States)'}
            ],
            additionalFields: [
                {name: 'Tax Agent', type: 'autocomplete', value: 'Dimock Stratton - (DIMO)'},
                {name: 'Convention Type', type: 'hierarchy', value: 'Code for TA - (123-TA)'},
                {name: 'Examiner', type: 'input', value: 'Elon Mask'},
                {name: 'Application Number', type: 'input', value: 'Hello world'},
                {name: 'Expiration Date', type: 'datepicker', value: 'today'},
                {name: 'Drawings', type: 'numeric', value: '2'},
                {name: 'Power of Attorney', type: 'checkbox', value: 'check'}
            ],
            brief: 'true'
        },
        {
            ipType: 'Disclosure',
            recordName: disclosureName,
            requiredField: {name: 'Business Unit', type: 'autocomplete', value: 'Acme Propellants - (ACME-1)'},
            requiredFields: [
                {name: 'Disclosure Number', type: 'input', value: disclosureName},
                {name: 'Business Unit', type: 'autocomplete', value: 'Acme Propellants - (ACME-1)'}
            ],
            additionalFields: [
                {name: 'Filing Decision', type: 'autocomplete', value: 'Do Not File - (DNF)'},
                {name: 'Technology', type: 'hierarchy', value: 'Data Compression - (CMP)'},
                {name: 'Custom Text #3', type: 'input', value: 'Custom text'},
                {name: 'Potential Product Applications', type: 'input', value: 'Hello world'},
                {name: 'Custom Date #3', type: 'datepicker', value: 'today'},
                {name: 'GENERICCHECKBOX10', type: 'checkbox', value: 'check'}
            ],
            brief: 'false'
        },
        {
            ipType: 'Trademark',
            recordName: trademarkName,
            requiredField: {name: 'Country / Region', type: 'autocomplete', value: 'US - (United States)'},
            requiredFields: [
                {name: 'Docket Number', type: 'input', value: trademarkName},
                {name: 'Country / Region', type: 'autocomplete', value: 'US - (United States)'}
            ],
            additionalFields: [
                {name: 'Associate', type: 'autocomplete', value: 'ATT Party - 1 - (ATT Party - 1)'},
                {name: 'Substatus', type: 'hierarchy', value: 'Sold - (SOL)'},
                {name: 'Filing Number', type: 'input', value: 'The Number'},
                {name: 'Current Application Number', type: 'input', value: 'The App Number'},
                {name: 'Current Expiration Date', type: 'datepicker', value: 'today'},
                {name: 'Original Amount Paid', type: 'numeric', value: '2'},
                {name: 'GENERICCHECKBOX01', type: 'checkbox', value: 'check'}
            ],
            brief: 'false'
        },
        {
            ipType: 'GeneralIP1',
            recordName: generalipName,
            requiredField: {name: 'Jurisdiction', type: 'autocomplete', value: 'US - (United States)'},
            requiredFields: [
                {name: 'Agreement Number', type: 'input', value: generalipName},
                {name: 'Jurisdiction', type: 'autocomplete', value: 'US - (United States)'},
                {name: 'Relationship', type: 'autocomplete', value: 'Renewal - (RNW)'},
                {name: 'Agreement Type', type: 'autocomplete', value: 'General Agreement - (GEN)'}
            ],
            additionalFields: [
                {name: 'Responsible Party', type: 'autocomplete', value: 'Addison Woods - (ABW)'},
                {name: 'Custom Text #2', type: 'input', value: 'Custom Text'},
                {name: 'Custom Text #4', type: 'input', value: 'Custom MultiText'},
                {name: 'Custom Date #3', type: 'datepicker', value: 'today'},
                {name: 'Sensitive', type: 'checkbox', value: 'check'}
            ],
            brief: 'false'
        }
    ];
})();

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .requestHooks(app.ui.requestLogger.createRecord)
        (`Check Data Entry form functionality (Steps 12-15.2 - ${data.ipType})`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry form from preconditions and check items', async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(`TA DEF for ${data.ipType}`);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Fill required fields and other different controls', async () => {
                await app.ui.dataEntryBoard.fillFieldsWithValue([...data.additionalFields, ...data.requiredFields]);
            });
            await app.step('Check Reset button', async () => {
                await app.ui.dataEntryBoard.click('menuButtons', 'Reset');
                await t
                    .expect(await app.ui.confirmationModal.isVisible()).ok()
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                    .eql('You have unsaved changes. Are you sure you want to continue?');
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.dataEntryBoard.verifyFieldsValues([...data.additionalFields, ...data.requiredFields]))
                    .notContains(false);
            });
            await app.step('Check Confirmation about unsaved changes', async () => {
                await app.ui.header.click('userIcon');
                await app.ui.kendoPopup.selectContentLink('Sign Out');
                await t
                    .expect(await app.ui.confirmationModal.isVisible()).ok()
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                    .eql('Unsaved changes will be lost. Do you want to continue?');
                await app.ui.confirmationModal.cancel();
                await app.ui.naviBar.click('links', 'Query');
                await t
                    .expect(await app.ui.confirmationModal.isVisible()).ok()
                    .expect(await app.ui.confirmationModal.getText('confirmationMessage'))
                    .eql('Unsaved changes will be lost. Do you want to continue?');
                await app.ui.confirmationModal.cancel();
                await t
                    .expect(await app.ui.dataEntryBoard.verifyFieldsValues([...data.additionalFields, ...data.requiredFields]))
                    .notContains(false);
            });
            await app.step('Check Save without required fields', async () => {
                await app.ui.dataEntryBoard.getField(data.requiredField.name, data.requiredField.type).clear();
                await app.ui.dataEntryBoard.save();
                await t
                    .expect(await app.ui.errorModal.isVisible()).ok()
                    .expect(await app.ui.errorModal.getText('errorMessage'))
                    .eql(`Missing required field value(s): ${data.requiredField.name}`);
                await app.ui.errorModal.confirm();
            });
            await app.step('Check Save with required fields', async () => {
                await app.ui.dataEntryBoard.getField(data.requiredField.name, data.requiredField.type).fill(data.requiredField.value);
                await app.ui.dataEntryBoard.save();
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await app.ui.noErrors()).ok('A System Error thrown');
            });
            await app.step('Save & Validate form', async () => {
                await app.ui.dataEntryBoard.saveValidate();
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await app.ui.modal.isVisible()).ok()
                    .expect(await app.ui.modal.isVisible('infoList')).ok()
                    .expect(await app.ui.modal.getText('title')).eql('IP Rules Message(s)')
                    .expect(await app.ui.noErrors()).ok('A System Error thrown');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.modal.confirm();
                await t
                    .expect(await app.ui.dataEntryBoard.isVisible('recordIdRow')).ok()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'More')).ok()
                    .expect(await app.ui.dataEntryBoard.verifyFieldsValues([...data.additionalFields, ...data.requiredFields]))
                    .notContains(false);
            });
            await app.step('Delete all data from unrequired fields', async () => {
                await app.ui.dataEntryBoard.clearFields(data.additionalFields);
                await t
                    .expect(await app.ui.dataEntryBoard.verifyFieldsValues(data.additionalFields))
                    .notContains(true);
                await app.ui.dataEntryBoard.save();
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await app.ui.noErrors()).ok('A System Error thrown');
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.dataEntryBoard.verifyFieldsValues(data.additionalFields))
                    .notContains(true)
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save', {isTextExact: true})).notOk()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Reset')).notOk()
                    .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Duplicate')).ok();
            });

        })
        .after(async (t) => {
            await app.step('Delete the records (API)', async () => {
                app.ui.setCookie('createRecord');
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
});

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Check DEF with disabled Batch Rules Processing (Step 19)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            app.ui.setCookie();
        });
        await app.step('Disable Batch Rules Processing (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{property: 'IsUserPreferencesBatchRulesChecked', value: {Value: false, LockedOut: false}}]);
            await app.ui.refresh();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form from preconditions and check items', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.dataEntryBoard.isVisible('menuButtons', 'Save & Validate')).ok()
                .expect(await app.ui.dataEntryBoard.isEnabled('menuButtons', 'Save & Validate')).ok()
                .expect(await app.ui.dataEntryBoard.isPresent('menuButtons', 'Save', {isTextExact: true})).notOk()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Reset preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        app.ui.resetRequestLogger('simple');
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.createRecord, app.ui.requestLogger.simple)
    (`Check that creation of record with the same data is forbidden (Steps 20-21)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            app.ui.setCookie();
        });
        await app.step('Create Patent record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTD');
        });
        await app.step('Open data entry form', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Try to create record with the same data as created before', async () => {
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.dataEntryBoard.saveValidate();
            await t
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage'))
                .eql('Duplicate Record exists for this key field combination.');
            await app.ui.errorModal.confirm();
        });
        await app.step('Create record with unique data', async () => {
            app.memory.current.recordName = `patent${app.services.time.timestampShort()}SimpleTD`;
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(app.memory.current.recordName);
            await app.ui.dataEntryBoard.saveValidate();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.modal.confirm();
        });
    })
    .after(async (t) => {
        await app.step('Delete the records (API)', async () => {
            try {
                const recordsToDelete = app.ui.requestLogger.createRecord.requests.map((req) => {
                    try {
                        return {
                            Record: {
                                IpType: JSON.parse(req.response.body).FilingSectionDefinition.IpType,
                                MasterId: JSON.parse(req.response.body).FilingSectionDefinition.RecordId
                            },
                            ResourceId: JSON.parse(req.request.body).dataEntryFormTemplateResourceId
                        };
                    } catch (err) {}
                }).filter((record) => {
                    if (record) {
                        return record;
                    }
                });
                await app.api.combinedFunctionality.deleteRecords([...recordsToDelete, app.memory.current.createRecordData.respData]);
            } catch (err) {
                throw err;
            }
        });
        app.ui.resetRequestLogger('createRecord');
        app.ui.resetRequestLogger('simple');
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.createRecord, app.ui.requestLogger.simple)
    (`Check Update functionality (Step 22)`, async (t) => {
        await app.step('Login as first User (API)', async () => {
            await app.api.login('testRegression2');
        });
        await app.step('Create Patent record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTD', true);
        });
        await app.step('Login as second User', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run "PA All Cases TA filter" query', async () => {
            app.ui.setCookie();
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open the record', async () => {
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Update the record', async () => {
            const updData = app.memory.current.createRecordData.updateData;
            const createDate = await await app.ui.dataEntryBoard.getField('Create Date').getLockedValue();
            let updateDate = await await app.ui.dataEntryBoard.getField('Update Date').getLockedValue();
            console.log(updData);
            await t
                .expect(app.services.time.getSeconds(createDate, {pattern: 'MM/DD/YYYY HH:mm:ss', reduceOffset: true}))
                .eql(app.services.time.getSeconds(updData.createDate))
                .expect(app.services.time.getSeconds(updateDate, {pattern: 'MM/DD/YYYY HH:mm:ss', reduceOffset: true}))
                .eql(app.services.time.getSeconds(updData.updateDate))
                .expect(await await app.ui.dataEntryBoard.getField('Create User').getLockedValue()).eql(updData.createUser)
                .expect(await await app.ui.dataEntryBoard.getField('Update User').getLockedValue()).eql(updData.createUser);
            await app.ui.dataEntryBoard.getField('Docket Number', 'input').fill(`${app.memory.current.createRecordData.reqData.recordName}Upd`);
            await app.ui.dataEntryBoard.saveValidate();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.waitLoading({checkErrors: true});
            updateDate = await await app.ui.dataEntryBoard.getField('Update Date').getLockedValue();
            await t
                .expect(app.services.time.getSeconds(createDate, {pattern: 'MM/DD/YYYY HH:mm:ss', reduceOffset: true}))
                .eql(app.services.time.getSeconds(updData.createDate))
                .expect(app.services.time.getSeconds(updateDate, {pattern: 'MM/DD/YYYY HH:mm:ss', reduceOffset: true}))
                .gt(app.services.time.getSeconds(updData.updateDate))
                .expect(await await app.ui.dataEntryBoard.getField('Create User').getLockedValue()).eql(updData.createUser)
                .expect(await await app.ui.dataEntryBoard.getField('Update User').getLockedValue()).eql(globalConfig.user.userName);
        });
    })
    .after(async (t) => {
        await app.step('Delete the records (API)', async () => {
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
                await app.api.combinedFunctionality.deleteRecords([...recordsToDelete, app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createRecord');
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Check Read-only field and its validation (Step 3, 14)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            app.ui.setCookie();
        });
        await app.step('Disable edit permission for Docket Number field for CG (API)', async () => {
            app.ui.setCookie();
            const changes = [{Path: 'PatentMasters>PATENTS>Docket Number', EditPermission: false}];
            await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
            await app.ui.refresh();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form from preconditions and check read-only field', async () => {
            await app.ui.naviBar.click('links', 'Data Entry');
            await app.ui.kendoPopup.selectItem('TA DEF for Patent');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await await app.ui.dataEntryBoard.getField('Docket Number').isLocked()).ok();
        });
        await app.step('Click save and check error modal message', async () => {
            await app.ui.dataEntryBoard.getField('Country / Region').clear();
            await app.ui.dataEntryBoard.saveValidate();
            await t
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage'))
                .contains(`Missing required field value(s):`)
                .expect(await app.ui.errorModal.getText('errorMessage'))
                .contains(`Docket Number`)
                .expect(await app.ui.errorModal.getText('errorMessage'))
                .contains(`Country / Region`);
        });
    })
    .after(async (t) => {
        await app.step('Enable only edit permission for only one field in child tab for CG (API)', async () => {
            app.ui.setCookie();
            const changes = [{Path: 'PatentMasters', EditPermission: true}];
            await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
        });
        app.ui.resetRequestLogger('simple');
    });
