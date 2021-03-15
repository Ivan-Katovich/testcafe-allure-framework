import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.administration.pack. : Simple tests for Administration`
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
            await app.ui.getRole(null, 'AdminUI/administration');
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
    ('Test 01: Verify Admin Link', async (t) => {
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
        await app.step('Click on Administration link from Apps tab', async () => {
            await app.ui.kendoPopup.click('appLinks', 'Administration');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminMenu.getAllCardNames())
                .eql(['Configuration', 'IP Payments', 'Management', 'Resources'])
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    // .page(`${globalConfig.env.url}/AdminUI/administration`)
    .requestHooks(app.ui.requestLogger.createAdminItem)
    ('Test 02: Validate Code Management functionality', async (t) => {
        await app.step('Click on Code Management Link from Management menu', async () => {
            await app.ui.adminMenu.getCard('Management').open('Code Management');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('code-mgmt')
                .expect(await app.ui.adminBoard.getTitle()).eql('Code Management')
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Save')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Reset')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Create New')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Delete')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Previous')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Next')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Enter required fields for a form', async () => {
            app.memory.current.recordName = `code${app.services.time.timestampShort()}Simple`;
            await app.ui.adminBoard.getField('Code', 'input').fill(app.memory.current.recordName, {isPaste: true});
            await app.ui.adminBoard.getField('Description', 'input').fill('TA Code for tests', {isPaste: true});
            await app.ui.adminBoard.getField('Code Type', 'autocomplete').fill('AC1 (GeneralIP1 Action)', {isPaste: true});
        });
        await app.step('Click on Save Button', async () => {
            await app.ui.adminBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Search the Code', async () => {
            await app.ui.adminBoard.searchItem(app.memory.current.recordName);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.grid.isRecordPresent(app.memory.current.recordName)).ok();
        });
        await app.step('Delete the Code', async () => {
            await await app.ui.adminBoard.grid.getCheckbox(app.memory.current.recordName).check();
            await app.ui.adminBoard.clickButton('Delete');
            await t
                .expect(await app.ui.modal.getText('confirmationMessage'))
                .eql('Are you sure you want to delete the selected record(s)?')
                .expect(await app.ui.modal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.modal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Confirm deletion', async () => {
            await app.ui.modal.confirm();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Check Previous/Next buttons functionality', async () => {
            await app.ui.adminBoard.clearSearch();
            await app.ui.waitLoading();
            await app.ui.adminBoard.grid.openRecord(0);
            await app.ui.waitLoading();
            app.memory.current.recordName = await app.ui.adminBoard.getField('Code', 'input').getValue();
            await app.ui.adminBoard.clickButton('Next');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Code', 'input').getValue()).notEql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.adminBoard.clickButton('Previous');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Code', 'input').getValue()).eql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the Code (API)', async () => {
            app.ui.setCookie('createAdminItem');
            try {
                const recordsToDelete = [{
                    CodeId: app.ui.getLastResponseBody('createAdminItem').CodeId,
                    CodeTypeId: app.ui.getLastRequestBody('createAdminItem').CodesCodeTypeId
                }];
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete, 'code');
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createAdminItem');
    });

test
    // .disablePageReloads
    // .only
    // .page(`${globalConfig.env.url}/AdminUI/administration`)
    .requestHooks(app.ui.requestLogger.createAdminItem)
    ('Test 03: Validate Content Group Maintenance functionality', async (t) => {
        await app.step('Click on Content group maintenance link from Management menu', async () => {
            await app.ui.adminMenu.getCard('Management').open('Content Group Maintenance');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('content-group-admin')
                .expect(await app.ui.adminBoard.getTitle()).eql('Content Group Maintenance')
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Duplicate')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Save')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Reset')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Create New')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Delete')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Previous')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Next')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Set Content Group Settings', async () => {
            await app.ui.adminBoard.click('administrationControl');
            await t
                .expect(await app.ui.adminBoard.sideBar.isVisible()).ok()
                .expect(await app.ui.adminBoard.sideBar.getText('title'))
                .eql('Content Group Settings');
            await app.ui.adminBoard.sideBar.nodeTreeview.check('Administration');
            await app.ui.adminBoard.sideBar.nodeTreeview.check('Collaboration');
            await app.ui.adminBoard.sideBar.selectTab('System Resources');
            await app.ui.adminBoard.sideBar.nodeTreeview.check('New Data Entry');
            await app.ui.adminBoard.sideBar.nodeTreeview.check('Query');
            await app.ui.adminBoard.sideBar.close();
        });
        await app.step('Enter required fields and save the form', async () => {
            app.memory.current.recordName = `cg${app.services.time.timestampShort()}Simple`;
            await app.ui.adminBoard.getField('Name', 'input').fill(app.memory.current.recordName, {isPaste: true});
            await app.ui.adminBoard.getField('Description', 'input').fill('TA Content Group for tests', {isPaste: true});
            await app.ui.adminBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Search the Content Group', async () => {
            await app.ui.adminBoard.searchItem(app.memory.current.recordName);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.grid.isRecordPresent(app.memory.current.recordName)).ok();
        });
        await app.step('Delete the Content Group', async () => {
            await await app.ui.adminBoard.grid.getCheckbox(app.memory.current.recordName).check();
            await app.ui.adminBoard.clickButton('Delete');
            await t
                .expect(await app.ui.modal.getText('confirmationMessage'))
                .eql('Are you sure you want to delete the selected record(s)?')
                .expect(await app.ui.modal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.modal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Confirm deletion', async () => {
            await app.ui.modal.confirm();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Check Previous/Next buttons functionality', async () => {
            await app.ui.adminBoard.clearSearch();
            await app.ui.waitLoading();
            await app.ui.adminBoard.grid.openRecord(0);
            await app.ui.waitLoading();
            app.memory.current.recordName = await app.ui.adminBoard.getField('Name', 'input').getValue();
            await app.ui.adminBoard.clickButton('Next');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Name', 'input').getValue()).notEql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.adminBoard.clickButton('Previous');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Name', 'input').getValue()).eql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the Content Group (API)', async () => {
            app.ui.setCookie('createAdminItem');
            try {
                const recordsToDelete = [app.ui.getLastResponseBody('createAdminItem').ContentGroupId];
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete, 'content group');
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createAdminItem');
    });

test
    // .disablePageReloads
    // .only
    // .page(`${globalConfig.env.url}/AdminUI/administration`)
    .requestHooks(app.ui.requestLogger.createAdminItem)
    ('Test 04: Validate Query groups functionality', async (t) => {
        await app.step('Click on Query groups link from Management menu', async () => {
            await app.ui.adminMenu.getCard('Management').open('Query Groups');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('query-group')
                .expect(await app.ui.adminBoard.getTitle()).eql('Query Groups')
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Save')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Reset')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Create New')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Delete')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Previous')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Next')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Enter required fields and save the form', async () => {
            app.memory.current.recordName = `qg${app.services.time.timestampShort()}Simple`;
            await app.ui.adminBoard.getField('Name', 'input').fill(app.memory.current.recordName, {isPaste: true});
            await app.ui.adminBoard.getField('Description', 'input').fill('TA Query Group for tests', {isPaste: true});
            await app.ui.adminBoard.kendoTreeview.select('Query>Build query');
            await app.ui.adminBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Search the Query Group', async () => {
            await app.ui.adminBoard.searchItem(app.memory.current.recordName);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.grid.isRecordPresent(app.memory.current.recordName)).ok();
        });
        await app.step('Delete the Query Group', async () => {
            await await app.ui.adminBoard.grid.getCheckbox(app.memory.current.recordName).check();
            await app.ui.adminBoard.clickButton('Delete');
            await t
                .expect(await app.ui.modal.getText('confirmationMessage'))
                .eql('Are you sure you want to delete the selected record(s)?')
                .expect(await app.ui.modal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.modal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Confirm deletion', async () => {
            await app.ui.modal.confirm();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Check Previous/Next buttons functionality', async () => {
            await app.ui.adminBoard.clearSearch();
            await app.ui.waitLoading();
            await app.ui.adminBoard.grid.openRecord(0);
            await app.ui.waitLoading();
            let isLocked: boolean = await app.ui.adminBoard.getField('Name', 'input').isLocked();
            if (isLocked) {
                app.memory.current.recordName = await app.ui.adminBoard.getField('Name', 'input').getLockedValue();
            } else {
                app.memory.current.recordName = await app.ui.adminBoard.getField('Name', 'input').getValue();
            }
            await app.ui.adminBoard.clickButton('Next');
            await app.ui.waitLoading();
            let nameToCompare: string;
            isLocked = await app.ui.adminBoard.getField('Name', 'input').isLocked();
            if (isLocked) {
                nameToCompare = await app.ui.adminBoard.getField('Name', 'input').getLockedValue();
            } else {
                nameToCompare = await app.ui.adminBoard.getField('Name', 'input').getValue();
            }
            await t
                .expect(nameToCompare).notEql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.adminBoard.clickButton('Previous');
            await app.ui.waitLoading();
            isLocked = await app.ui.adminBoard.getField('Name', 'input').isLocked();
            if (isLocked) {
                nameToCompare = await app.ui.adminBoard.getField('Name', 'input').getLockedValue();
            } else {
                nameToCompare = await app.ui.adminBoard.getField('Name', 'input').getValue();
            }
            await t
                .expect(nameToCompare).eql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the Query Group (API)', async () => {
            app.ui.setCookie('createAdminItem');
            try {
                const recordsToDelete = [app.ui.getLastResponseBody('createAdminItem').CategoryId];
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete, 'query group');
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createAdminItem');
    });

test
    // .disablePageReloads
    // .only
    // .page(`${globalConfig.env.url}/AdminUI/administration`)
    .requestHooks(app.ui.requestLogger.createAdminItem)
    ('Test 05: Validate Display Configuration functionality', async (t) => {
        await app.step('Click on Display Configuration link from Configuration menu', async () => {
            await app.ui.adminMenu.getCard('Configuration').open('Display Configuration');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('display-config-setting')
                .expect(await app.ui.adminBoard.getTitle()).eql('Display Configuration')
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Export')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Duplicate')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Save')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Reset')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Create New')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Delete')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Previous')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Next')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Enter required fields and save the form', async () => {
            app.memory.current.recordName = `dc${app.services.time.timestampShort()}Simple`;
            await app.ui.adminBoard.getField('Name', 'input').fill(app.memory.current.recordName, {isPaste: true});
            await app.ui.adminBoard.getField('Description', 'input').fill('TA Display Configuration for tests', {isPaste: true});
            await app.ui.adminBoard.getField('Culture', 'dropdown').fill('en-US', {isPaste: true});
            await app.ui.adminBoard.getField('Users', 'multiselect').fill('ikotovich@***.com', {isPaste: true});
            await app.ui.adminBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Search the Display Configuration', async () => {
            await app.ui.adminBoard.searchItem(app.memory.current.recordName);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.grid.isRecordPresent(app.memory.current.recordName)).ok();
        });
        await app.step('Delete the Display Configuration', async () => {
            await await app.ui.adminBoard.grid.getCheckbox(app.memory.current.recordName).check();
            await app.ui.adminBoard.clickButton('Delete');
            await t
                .expect(await app.ui.modal.getText('confirmationMessage'))
                .eql('Are you sure you want to delete the selected record(s)?')
                .expect(await app.ui.modal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.modal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Confirm deletion', async () => {
            await app.ui.modal.confirm();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Check Previous/Next buttons functionality', async () => {
            await app.ui.adminBoard.clearSearch();
            await app.ui.waitLoading();
            await app.ui.adminBoard.grid.openRecord(0);
            await app.ui.waitLoading();
            app.memory.current.recordName = await app.ui.adminBoard.getField('Name', 'input').getValue();
            await app.ui.adminBoard.clickButton('Next');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Name', 'input').getValue()).notEql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.adminBoard.clickButton('Previous');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Name', 'input').getValue()).eql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the Display Configuration (API)', async () => {
            app.ui.setCookie('createAdminItem');
            try {
                const recordsToDelete = [app.ui.getLastResponseBody('createAdminItem').DisplaySettingId];
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete, 'display configuration');
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createAdminItem');
    });

test
    // .disablePageReloads
    // .only
    // .page(`${globalConfig.env.url}/AdminUI/administration`)
    .requestHooks(app.ui.requestLogger.createAdminItem)
    ('Test 06: Validate Email Templates functionality', async (t) => {
        await app.step('Click on Email Templates link from Resources menu', async () => {
            await app.ui.adminMenu.getCard('Resources').open('Email Templates');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('email-templates')
                .expect(await app.ui.adminBoard.getTitle()).eql('Email Templates')
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Save')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Reset')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Create New')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Delete')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Previous')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Next')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Enter required fields and save the form', async () => {
            app.memory.current.recordName = `et${app.services.time.timestampShort()}Simple`;
            await app.ui.adminBoard.getField('Name', 'input').fill(app.memory.current.recordName, {isPaste: true});
            await app.ui.adminBoard.getField('Description', 'input').fill('TA Email Template for tests', {isPaste: true});
            await app.ui.adminBoard.getField('IP Type', 'dropdown').fill('PatentMasters', {isPaste: true});
            await app.ui.waitLoading();
            await app.ui.adminBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Search the Email Template', async () => {
            await app.ui.adminBoard.searchItem(app.memory.current.recordName);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.grid.isRecordPresent(app.memory.current.recordName)).ok();
        });
        await app.step('Delete the Email Template', async () => {
            await await app.ui.adminBoard.grid.getCheckbox(app.memory.current.recordName).check();
            await app.ui.adminBoard.clickButton('Delete');
            await t
                .expect(await app.ui.modal.getText('confirmationMessage'))
                .eql('Are you sure you want to delete the selected record(s)?')
                .expect(await app.ui.modal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.modal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Confirm deletion', async () => {
            await app.ui.modal.confirm();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Check Previous/Next buttons functionality', async () => {
            await app.ui.adminBoard.clearSearch();
            await app.ui.waitLoading();
            await app.ui.adminBoard.grid.openRecord(0);
            await app.ui.waitLoading();
            app.memory.current.recordName = await app.ui.adminBoard.getField('Name', 'input').getValue();
            await app.ui.adminBoard.clickButton('Next');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Name', 'input').getValue()).notEql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.adminBoard.clickButton('Previous');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Name', 'input').getValue()).eql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the Email Template (API)', async () => {
            app.ui.setCookie('createAdminItem');
            try {
                const recordsToDelete = [app.ui.getLastResponseBody('createAdminItem').ResourceId];
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete, 'email template');
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createAdminItem');
    });

test
    // .disablePageReloads
    // .only
    // .page(`${globalConfig.env.url}/AdminUI/administration`)
    .requestHooks(app.ui.requestLogger.createAdminItem)
    ('Test 07: Validate Global Change Templates functionality', async (t) => {
        await app.step('Click on Global Change Templates link from Resources menu', async () => {
            await app.ui.adminMenu.getCard('Resources').open('Global Change Templates');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('global-change-templates')
                .expect(await app.ui.adminBoard.getTitle()).eql('Global Change Templates')
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Duplicate')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Save')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Reset')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Create New')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Delete')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Previous')).ok()
                .expect(await app.ui.adminBoard.isVisible('menuButtons', 'Next')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Enter required fields and save the form', async () => {
            app.memory.current.recordName = `gct${app.services.time.timestampShort()}Simple`;
            await app.ui.adminBoard.getField('Name', 'input').fill(app.memory.current.recordName, {isPaste: true});
            await app.ui.adminBoard.getField('Description', 'input').fill('TA Global Change Template for tests', {isPaste: true});
            await app.ui.adminBoard.getField('IP Type', 'dropdown').fill('PatentMasters', {isPaste: true});
            await app.ui.adminBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Search the Global Change Template', async () => {
            await app.ui.adminBoard.searchItem(app.memory.current.recordName);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.grid.isRecordPresent(app.memory.current.recordName)).ok();
        });
        await app.step('Delete the Global Change Template', async () => {
            await await app.ui.adminBoard.grid.getCheckbox(app.memory.current.recordName).check();
            await app.ui.adminBoard.clickButton('Delete');
            await t
                .expect(await app.ui.modal.getText('confirmationMessage'))
                .eql('Are you sure you want to delete the selected record(s)?')
                .expect(await app.ui.modal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.modal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Confirm deletion', async () => {
            await app.ui.modal.confirm();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Selected record(s) were deleted successfully.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Check Previous/Next buttons functionality', async () => {
            await app.ui.adminBoard.clearSearch();
            await app.ui.waitLoading();
            await app.ui.adminBoard.grid.openRecord(0);
            await app.ui.waitLoading();
            app.memory.current.recordName = await app.ui.adminBoard.getField('Name', 'input').getValue();
            await app.ui.adminBoard.clickButton('Next');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Name', 'input').getValue()).notEql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.adminBoard.clickButton('Previous');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.adminBoard.getField('Name', 'input').getValue()).eql(app.memory.current.recordName)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete the Global Change Template (API)', async () => {
            app.ui.setCookie('createAdminItem');
            try {
                const recordsToDelete = [ app.ui.getLastResponseBody('createAdminItem').ResourceId ];
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete, 'global change template');
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createAdminItem');
    });
