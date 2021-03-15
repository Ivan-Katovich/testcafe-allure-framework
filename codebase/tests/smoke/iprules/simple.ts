import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.iprules.pack. : Simple tests for IP Rules`
    // .only
    // .page(`${globalConfig.env.url}/UI`)
    .meta('brief', 'true')
    .before(async () => {
        if (!globalConfig.brief) {
            await app.api.userPreferences.resetUserPreferences();
        }
    })
    .beforeEach(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole(null, 'RulesUI/ip-rules-management');
            await app.ui.waitLoading();
        });
    });

test
    // .disablePageReloads
    // .only
    // .page(`${globalConfig.env.url}/UI`)
    .before(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
    })
    ('Test 01: Verify IP Rules Link', async (t) => {
        await app.step('Verify Apps Tab', async () => {
            await t.expect(await app.ui.header.isVisible('appSwitcher')).ok();
        });
        await app.step('Click on Apps Tab', async () => {
            await app.ui.header.hover('appSwitcher');
            await app.ui.header.click('appSwitcher');
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect(await app.ui.kendoPopup.getAllItemsText('appLinks'))
                .eql(['Administration', 'Analytics', 'CIPP-Patent', 'CIPP-Trademark', 'Idea Portal', 'IP Rules']);
        });
        await app.step('Check IP rules Items', async () => {
            await app.ui.kendoPopup.click('appLinks', 'IP Rules');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('ip-rules-management')
                .expect(await app.ui.naviBar.isVisible('links', 'Query')).ok()
                .expect(await app.ui.naviBar.isVisible('links', 'Export')).ok()
                .expect(await app.ui.naviBar.isVisible('links', 'Import')).ok()
                .expect(await app.ui.naviBar.isVisible('links', 'Auto Update')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    // .page(`${globalConfig.env.url}/RulesUI/ip-rules-management`)
    ('Test 02: Create a new Add Rule type ID and verify (partially)', async (t) => {
        await app.step('Click on Patents Link from IP Rules Query  section', async () => {
            await app.ui.queryBoard.kendoTreeview.open('IP Rules Query>Rule Types>Patents');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.isVisible('menuItems', 'Add Rule Type')).ok()
                .expect(await app.ui.queryBoard.isVisible('resultsHeaderItems', 'Build complex queries')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Click on Add Rule Type button', async () => {
            await app.ui.queryBoard.click('menuItems', 'Add Rule Type');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.addRuleTypeModal.isVisible()).ok()
                .expect(await app.ui.addRuleTypeModal.getTitle()).eql('Add Rule Type > Patents')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Create a new Rule Type', async () => {
            await app.ui.addRuleTypeModal.getField('Country / Region', 'autocomplete').fill('US - (United States)');
            await app.ui.addRuleTypeModal.getField('Case Type', 'autocomplete').fill('Copyright - (Y)');
            await app.ui.addRuleTypeModal.getField('Filing Type', 'autocomplete').fill('National - (NAT)');
            await app.ui.addRuleTypeModal.getField('Relation Type', 'autocomplete').fill('Division - (D)');
            await app.ui.addRuleTypeModal.getField('Status', 'autocomplete').fill('Granted - (G)');
            await app.ui.addRuleTypeModal.save();
            await app.ui.waitLoading();
        });
        // Test will be completed after implementation of Rule Type Deletion functionality
    });

test
    // .disablePageReloads
    // .only
    // .page(`${globalConfig.env.url}/RulesUI/ip-rules-management`)
    ('Test 03: Validate Rules Summary (partially)', async (t) => {
        await app.step('Click on Patents Link from IP Rules Query section', async () => {
            await app.ui.queryBoard.kendoTreeview.open('IP Rules Query>Rule Types>Patents');
            await app.ui.waitLoading();
        });
        await app.step('Select a record from query results grid and click on it', async () => {
            const firstRecord = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            app.memory.current.ruleTypeId = await firstRecord.getValue('Rule Type ID');
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.rulesSummaryBoard.isVisible()).ok()
                .expect(await app.ui.rulesSummaryBoard.getTitle()).eql('Rules Summary')
                .expect(await app.ui.rulesSummaryBoard.isVisible('menuButtons', 'Reset')).ok()
                .expect(await app.ui.rulesSummaryBoard.isVisible('menuButtons', 'Rules Refresh')).ok()
                .expect(await app.ui.rulesSummaryBoard.isVisible('menuButtons', 'Add Calculation')).ok()
                .expect(await app.ui.rulesSummaryBoard.isVisible('menuButtons', 'Save')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Click on Add Calculation Button', async () => {
            await app.ui.rulesSummaryBoard.clickButton('Add Calculation');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.rulesSummaryBoard.isVisible('summaryDetails')).ok()
                .expect(await app.ui.rulesSummaryBoard.getText('detailsTitle')).eql('Calculation')
                .expect(await app.ui.rulesSummaryBoard.getField('Result Table', 'dropdown').getValue()).eql('Patents')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Select "License data" from Result Table', async () => {
            await app.ui.rulesSummaryBoard.getField('Result Table', 'dropdown').fill('License Data');
            await t
                .expect(await app.ui.rulesSummaryBoard.getField('Result Record Field', 'dropdown').isVisible()).ok();
            await app.ui.rulesSummaryBoard.getField('Result Record Field', 'dropdown').expand();
            await t
                .expect(await app.ui.rulesSummaryBoard.getField('Result Record Field', 'dropdown').getPossibleValues())
                .eql(['GENERICCHECKBOX1', 'GENERICCHECKBOX2', 'License Number', 'Licensee Licensor']);
        });
        await app.step('Select "License Number" from Result Record Field', async () => {
            await app.ui.rulesSummaryBoard.getField('Result Record Field', 'dropdown').selectRow('License Number');
            await t
                .expect(await app.ui.rulesSummaryBoard.getField('Result Record', 'autocomplete', {isTextExact: true}).isVisible()).ok();
        });
        await app.step('Enter "TA ET for Patents" in Result Record text box and click on save button', async () => {
            await app.ui.rulesSummaryBoard.getField('Result Record', 'input', {isTextExact: true}).fill('TA ET for Patents', {isPaste: true});
            await app.ui.rulesSummaryBoard.save();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
                // .expect(await app.ui.waitTillElementPresent('notificationMessage', null, {timeout: globalConfig.timeout.element, interval: 1})).ok();
            // await app.ui.waitLoading();
            // await t
            //     .expect(await app.ui.rulesSummaryBoard.nodeTreeview.isItemVisible('ID: 1213>ID: 20380')).ok()
            //     .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        // Test will be completed after implementation of Rule Type Deletion functionality
    });

// test
//     // .disablePageReloads
//     // .only
//     .skip // Skip cause of issue with Background services
//     .page(`${globalConfig.env.url}/RulesUI/ip-rules-management`)
//     ('Test 04: Validate Rules Export and Import functionality', async (t) => {
//         await app.step('Click on Export Menu from IP Rules home page', async () => {
//             await app.ui.naviBar.click('links', 'Export');
//             await t
//                 .expect(await app.ui.rulesExportBoard.isVisible()).ok()
//                 .expect(await app.ui.rulesExportBoard.getTitle()).eql('Provide a name to export the Rules file')
//                 .expect(await app.ui.rulesExportBoard.getField('File Name', 'input').isVisible()).ok()
//                 .expect(await app.ui.rulesExportBoard.isVisible('exportButton')).ok()
//                 .expect(await app.ui.noErrors()).ok('A System Error thrown');
//         });
//         await app.step('Enter file name and click on Export button', async () => {
//             app.memory.current.exportName = `rulesExport${app.services.time.timestampShort()}Simple`;
//             await app.ui.rulesExportBoard.getField('File Name', 'input').fill(app.memory.current.exportName);
//             await app.ui.rulesExportBoard.export();
//             await t
//                 .expect(await app.ui.getNotificationMessage()).eql('Rules export was submitted to background services.');
//             await app.ui.waitLoading();
//             await app.ui.rulesExportBoard.waitExportProcessing(360000);
//             await app.ui.rulesExportBoard.download();
//             await t
//                 .expect(await app.services.os.waitForFileExists(`${app.memory.current.exportName}.RUF2`)).ok();
//         });
//         await app.step('Click on Import Menu from IP Rules home page', async () => {
//             await app.ui.naviBar.click('links', 'Import');
//             await app.ui.waitLoading();
//             await t
//                 .expect(await app.ui.rulesImportBoard.isVisible()).ok()
//                 .expect(await app.ui.rulesImportBoard.isVisible('importButton')).ok()
//                 .expect(await app.ui.rulesImportBoard.isVisible('dropZone')).ok()
//                 .expect(await app.ui.rulesImportBoard.isVisible('selectButton')).ok()
//                 .expect(await app.ui.rulesImportBoard.isVisible('headerButtons', 'Refresh')).ok()
//                 .expect(await app.ui.rulesImportBoard.isVisible('headerButtons', 'Delete')).ok()
//                 .expect(await app.ui.noErrors()).ok('A System Error thrown');
//         });
//         await app.step('Select Exported Rules file from desktop and click on import button', async () => {
//             await app.ui.rulesImportBoard.import(`${app.memory.current.exportName}.RUF2`);
//             await app.ui.modal.confirm();
//             await app.ui.waitLoading();
//             await t
//                 .expect(await app.ui.rulesImportBoard.isItemExists(app.memory.current.exportName)).ok()
//                 .expect(await app.ui.rulesImportBoard.getItem(app.memory.current.exportName).getText('status')).eql('In Progress')
//                 .expect(await app.ui.rulesImportBoard.getItem(app.memory.current.exportName).checkbox.isVisible()).ok();
//         });
//         await app.step('Select completed TA imports and delete them', async () => {
//             await app.ui.rulesImportBoard.selectItemsByRegex(/rulesExport\d+Simple/);
//             await app.ui.rulesImportBoard.delete();
//             await app.ui.modal.confirm();
//             await t
//                 .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully._');
//             await app.ui.waitLoading();
//             await t
//                 .expect(await app.ui.rulesImportBoard.itemsWithRegexCount(/rulesExport\d+Simple/)).eql(0);
//         });
//     })
//     .after(async (t) => {
//         await app.step('Clean target folder (OS)', async () => {
//             await app.services.os.removeDownloads(['rulesExport*.RUF2']);
//         });
//     });

test
    // .disablePageReloads
    // .only
    // .skip
    // .page(`${globalConfig.env.url}/RulesUI/ip-rules-management`)
    .requestHooks(app.ui.requestLogger.createAutoUpdate)
    ('Test 05: Validate Auto Update functionality', async (t) => {
        await app.step('Click on Auto Update  from IP Rules home page', async () => {
            await app.ui.naviBar.click('links', 'Auto Update');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getTitle()).eql('Auto Update')
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Execute')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Save')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Refresh')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Reset')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Add Auto Update')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Remove Auto Update')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Previous')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Next')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Fill fields and save Auto Update', async () => {
            app.memory.current.recordName = `au${app.services.time.timestampShort()}Simple`;
            await app.ui.adminBoard.getField('Name', 'input').fill(app.memory.current.recordName);
            await app.ui.adminBoard.getField('Description', 'input').fill('TA Auto Update for tests');
            await app.ui.adminBoard.getField('IP Type', 'multiselect').fill('PatentMasters');
            await app.ui.adminBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.adminBoard.searchItem(app.memory.current.recordName);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.grid.isRecordPresent(app.memory.current.recordName)).ok();
        });
        await app.step('Select a record from Rules grid and click on Remove Auto Update button', async () => {
            await await app.ui.adminBoard.grid.getCheckbox(0).check();
            await app.ui.adminBoard.clickButton('Remove Auto Update');
            await t
                .expect(await app.ui.modal.getText('confirmationMessage'))
                .eql('Are you sure you want to delete the selected record(s)?')
                .expect(await app.ui.modal.isVisible('buttons', 'Continue')).ok()
                .expect(await app.ui.modal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Clock on Continue Button', async () => {
            await app.ui.modal.confirm();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the Auto Update (API)', async () => {
            app.ui.setCookie('createAutoUpdate');
            try {
                const recordsToDelete = [app.ui.getLastResponseBody('createAutoUpdate').AutoUpdateLogId];
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete, 'auto update');
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createAutoUpdate');
    });
