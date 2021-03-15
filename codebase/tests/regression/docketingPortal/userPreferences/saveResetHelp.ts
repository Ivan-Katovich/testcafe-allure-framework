import { table } from 'console';
import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.userPreferences.pack. - Test ID 30714: User Preferences - Hosted - Save, Reset, Help and Display Configuration`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step(`Unlock all Default User Preferences is Default System Configuration`, async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setRecordsPerPageLocked(false);
            defaultUserPreferences.setPortalDefaultLocked(false);
            defaultUserPreferences.setThemeLocked(false);
            defaultUserPreferences.setCultureLocked(false);
            defaultUserPreferences.setDateFormatLocked(false);
            defaultUserPreferences.setUseBaseCurrencyLocked(false);
            await defaultUserPreferences.save();
        });
    });

const fields = [
    {
        name: 'Records Per Page',
        type: 'dropdown',
        defaultValue: '25',
        updValue: '50'
    },
    {
        name: 'Default Portal',
        type: 'dropdown',
        defaultValue: 'Query',
        updValue: 'Collaboration Portal'
    },
    {
        name: 'Default Report',
        type: 'autocomplete',
        defaultValue: '',
        updValue: 'All Agents'
    },
    {
        name: 'Batch Rules Processing',
        type: 'checkbox',
        defaultValue: 'check',
        updValue: 'uncheck'
    },
    {
        name: 'Country / Region Display',
        type: 'radiobutton',
        defaultValue: 'WIPO Codes',
        updValue: 'Codes'
    },
    {
        name: 'Party Display',
        type: 'radiobutton',
        defaultValue: 'Description',
        updValue: 'Codes'
    },
    {
        name: 'Code Display',
        type: 'radiobutton',
        defaultValue: 'Description',
        updValue: 'Codes'
    },
    {
        name: 'Date Format',
        type: 'dropdown',
        defaultValue: 'MM/dd/yyyy',
        updValue: 'yyyy-MM-dd'
    },
    {
        name: 'Use Base Currency',
        type: 'checkbox',
        defaultValue: 'uncheck',
        updValue: 'check'
    },
    {
        name: 'Actions Completed Date Filter',
        type: 'toggle',
        defaultValue: 'Off',
        updValue: 'On'
    },
    {
        name: 'Default Query',
        type: 'autocomplete',
        defaultValue: '',
        updValue: 'TA PA All Cases'
    },
    {
        name: 'Auto-Execute Queries',
        type: 'toggle',
        defaultValue: 'On',
        updValue: 'Off'
    }
    ];
// Note: 'Culture' field is separated from the common fields due to different behavior on Save

const tableGrids = [
    {
        name: 'Default Country',
        column1: 'IP Type',
        column2: 'Default Country',
        ipType: 'GeneralIP1Masters',
        defaultValue: 'United Arab Emirates',
        updValue: 'France'
    },
    {
        name: 'Record Management Form',
        column1: 'IP Type',
        column2: 'View in Template',
        ipType: 'GeneralIP1Masters',
        defaultValue: 'GeneralIP1 DEF',
        updValue: 'TA DEF for GeneralIP1'
    }
];

let treeClickedNames = [];
let treeExpectedNames = [];
let treeSelectedNames = [];

test
    // .only
    .meta('brief', 'true')
    (`Verify [Save] and [Reset] buttons state, [Reset] functionality on the User Preferences (Steps 2-3, 10)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences');
        });
        await app.step('Verify [Save] and [Reset] buttons are disabled (Step 2)', async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
        });
        for (let field of fields) {
            await app.step(`Make changes in '${field.name}' common field and verify the [Save] and [Reset] buttons are enabled (step 3)`, async () => {
                await app.ui.userPreferencesBoard.getField(field.name, field.type).fill(field.updValue);
                await t
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok()
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).ok();
            });
            await app.step(`Reset the changes for the '${field.name}' field`, async () => {
                await app.ui.userPreferencesBoard.reset();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.defaultValue)
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
            });
        }
        await app.step(`Make changes in 'Culture' field and verify the [Save] and [Reset] buttons are enabled (step 3)`, async () => {
            await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill('ja-JP');
            await t
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).ok();
        });
        await app.step(`Confirm [Reset] for the 'Culture' field`, async () => {
            await app.ui.userPreferencesBoard.reset();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?');
            await app.ui.confirmationModal.confirm();
            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('en-US')
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
        });
        for (let grid of tableGrids) {
            const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
            const field = await table.getField(grid.column2, 'autocomplete', index);

            await app.step(`Make changes in '${grid.name}' table - '${grid.column2}' field for '${grid.ipType}' and verify the [Save] and [Reset] buttons are enabled (step 3)`, async () => {
                await field.fill(grid.updValue, {isTextExact: false});
                await t
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok()
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).ok();
            });
            await app.step(`Reset changes for the '${grid.column2}' field for '${grid.ipType}'`, async () => {
                await app.ui.userPreferencesBoard.reset();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.confirmationModal.confirm();
                await t
                    .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                    .expect(await field.getValue()).contains(grid.defaultValue)
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
            });
        }
        await app.step(`Make changes in 'Favorite Queries' tree and verify the [Save] and [Reset] buttons are enabled (step 3)`, async () => {
            treeClickedNames = ['Trademark', 'Disclosure'];
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[0]);
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[1]);
            await t
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).ok();
        });
        await app.step(`Reset changes for the 'Favorite Queries' tree (step 10)`, async () => {
            await app.ui.userPreferencesBoard.reset();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.confirmationModal.confirm();
            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames()).eql([])
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify unsaved changes are not cleared after cancelling message on User Preferences (Steps 4-9, 11)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences');
        });
        await app.step(`Update the 'Culture' field on User Preferences page`, async () => {
            await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill('ja-JP');
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('ja-JP');
        });
        await app.step(`Update all common fields on User Preferences page`, async () => {
            for (let field of fields) {
                await app.ui.userPreferencesBoard.getField(field.name, field.type).fill(field.updValue);
                await t
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.updValue);
            }
        });
        await app.step(`Update both grids on User Preferences page`, async () => {
            for (let grid of tableGrids) {
                const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
                const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
                const field = await table.getField(grid.column2, 'autocomplete', index);

                await field.fill(grid.updValue, {isTextExact: false});
                await t
                    .expect(await field.getValue()).contains(grid.updValue);
            }
        });
        await app.step(`Update the 'Favourite Queries' tree on User Preferences page`, async () => {
            treeClickedNames = ['GeneralIP1', 'Patent'];
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[0]);
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[1]);
            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(app.services.array.areEquivalent(treeClickedNames, treeSelectedNames)).ok();
        });
        await app.step(`Verify unsaved changes in all fields are not cleared when user cancels navigation to another page (steps 4-5)`, async () => {
            await app.ui.naviBar.click('links', 'Reports');
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Continue')).ok()
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Cancel')).ok();
            await app.ui.confirmationModal.cancel();

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).ok();

            for (let field of fields) {
                await t
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.updValue);
            }

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('ja-JP');

            for (let grid of tableGrids) {
                const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
                const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
                const field = await table.getField(grid.column2, 'autocomplete', index);

                await t
                    .expect(await field.getValue()).contains(grid.updValue);
            }

            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(app.services.array.areEquivalent(treeClickedNames, treeSelectedNames)).ok();
        });
        await app.step(`Verify unsaved changes in all fields are not cleared when user cancels sign out (steps 4-5)`, async () => {
            await app.ui.header.click('userIcon');
            await app.ui.kendoPopup.selectContentLink('Sign Out');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Continue')).ok()
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Cancel')).ok();
            await app.ui.confirmationModal.cancel();

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).ok();

            for (let field of fields) {
                await t
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.updValue);
            }

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('ja-JP');

            for (let grid of tableGrids) {
                const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
                const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
                const field = await table.getField(grid.column2, 'autocomplete', index);

                await t
                    .expect(await field.getValue()).contains(grid.updValue);
            }

            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(app.services.array.areEquivalent(treeClickedNames, treeSelectedNames)).ok();
        });
        await app.step(`Verify unsaved changes in all fields are not cleared when user cancels the [Reset] (steps 8-9)`, async () => {
            await app.ui.userPreferencesBoard.reset();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?')
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Continue')).ok()
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Cancel')).ok();
            await app.ui.confirmationModal.cancel();

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).ok();

            for (let field of fields) {
                await t
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.updValue);
            }

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('ja-JP');

            for (let grid of tableGrids) {
                const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
                const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
                const field = await table.getField(grid.column2, 'autocomplete', index);

                await t
                    .expect(await field.getValue()).contains(grid.updValue);
            }

            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(app.services.array.areEquivalent(treeClickedNames, treeSelectedNames)).ok();
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify all unsaved changes are lost when user navigates away from User Preferences (steps 6-7)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences');
        });
        await app.step(`Update all common fields on User Preferences page`, async () => {
            for (let field of fields) {
                await app.ui.userPreferencesBoard.getField(field.name, field.type).fill(field.updValue);
                await t
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.updValue);
            }
        });
        await app.step(`Update the 'Culture' field on User Preferences page`, async () => {
            await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill('ja-JP');
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('ja-JP');
        });
        await app.step(`Update both grids on User Preferences page`, async () => {
            for (let grid of tableGrids) {
                const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
                const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
                const field = await table.getField(grid.column2, 'autocomplete', index);

                await field.fill(grid.updValue, {isTextExact: false});
                await t
                    .expect(await field.getValue()).contains(grid.updValue);
            }
        });
        await app.step(`Update the 'Favourite Queries' tree on User Preferences page`, async () => {
            treeClickedNames = ['Trademark', 'Patent'];
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[0]);
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[1]);
            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(app.services.array.areEquivalent(treeClickedNames, treeSelectedNames)).ok();
        });
        await app.step(`Navigate to another page`, async () => {
            await app.ui.naviBar.click('links', 'Reports');
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.getCurrentUrl()).contains('UI/reports')
                .expect(await app.ui.reportBoard.kendoTreeview.isVisible()).ok()
                .expect(await app.ui.reportBoard.kendoTreeview.isItemVisible('Reports')).ok();
            });
        await app.step(`Navigate back to User Preferences and verify all changes are lost`, async () => {
            await app.ui.header.click('userIcon');
            await app.ui.kendoPopup.selectNavigationItem('User Preferences');
            await app.ui.waitLoading({checkErrors: true});

            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences')
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();

            for (const field of fields) {
                await t
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.defaultValue);
            }

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('en-US');

            for (let grid of tableGrids) {
                const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
                const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
                const field = await table.getField(grid.column2, 'autocomplete', index);
                await t
                    .expect(await field.getValue()).contains(grid.defaultValue);
            }

            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(treeSelectedNames).eql([]);
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify all unsaved changes are lost when user user signs out from User Preferences (steps 6-7)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences');
        });
        await app.step(`Update all common fields on User Preferences page`, async () => {
            for (let field of fields) {
                await app.ui.userPreferencesBoard.getField(field.name, field.type).fill(field.updValue);
                await t
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.updValue);
            }
        });
        await app.step(`Update the 'Culture' field on User Preferences page`, async () => {
            await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill('ja-JP');
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('ja-JP');
        });
        await app.step(`Update both grids on User Preferences page`, async () => {
            for (let grid of tableGrids) {
                const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
                const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
                const field = await table.getField(grid.column2, 'autocomplete', index);

                await field.fill(grid.updValue, {isTextExact: false});
                await t
                    .expect(await field.getValue()).contains(grid.updValue);
            }
        });
        await app.step(`Update the 'Favourite Queries' tree on User Preferences page`, async () => {
            treeClickedNames = ['Trademark', 'Patent'];
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[0]);
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[1]);
            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(app.services.array.areEquivalent(treeClickedNames, treeSelectedNames)).ok();
        });
        await app.step(`Sign out`, async () => {
            await app.ui.header.click('userIcon');
            await app.ui.kendoPopup.selectContentLink('Sign Out');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.getCurrentUrl()).contains(`${globalConfig.env.loginPageUrl}/logout`);
            app.ui.resetRole(undefined, 'UI/user-preferences');
        });
        await app.step(`Sign in, open User Preferences and verify changes are lost`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});

            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences')
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();

            for (const field of fields) {
                await t
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.defaultValue);
            }

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('en-US');

            for (let grid of tableGrids) {
                const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
                const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
                const field = await table.getField(grid.column2, 'autocomplete', index);
                await t
                    .expect(await field.getValue()).contains(grid.defaultValue);
            }

            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(treeSelectedNames).eql([]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify [Save] button functionality on User Preferences (Steps 12-14)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences');
        });
        for (const field of fields) {
            await app.step(`Make changes in '${field.name}' field and verify [Save]`, async () => {
                await app.ui.userPreferencesBoard.getField(field.name, field.type).fill(field.updValue);
                await t
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok();
                await app.ui.userPreferencesBoard.save();
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.updValue)
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
            });
        }
        for (let grid of tableGrids) {
            const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
            const field = await table.getField(grid.column2, 'autocomplete', index);

            await app.step(`Make changes in '${grid.name}' table - '${grid.column2}' field for '${grid.ipType}' and verify [Save]`, async () => {
                await field.fill(grid.updValue, {isTextExact: false});
                await t
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok();
                await app.ui.userPreferencesBoard.save();
                await t
                    .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                    .expect(await field.getValue()).contains(grid.updValue)
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                    .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
            });
        }
        await app.step(`Make changes in 'Favorite Queries' tree and verify [Save]`, async () => {
            await app.ui.waitLoading();
            treeClickedNames = ['TA All Codes', 'Patent>TA PA test'];
            treeExpectedNames = ['TA All Codes', 'TA PA test'];
            await app.ui.userPreferencesBoard.scrollTo('fields', 'Favorite Queries');
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[0]);
            await app.ui.userPreferencesBoard.nodeTreeview.check(treeClickedNames[1]);
            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(app.services.array.areEquivalent(treeExpectedNames, treeSelectedNames)).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok();
            await app.ui.userPreferencesBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(app.services.array.areEquivalent(treeExpectedNames, treeSelectedNames)).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
        });
        await app.step(`Refresh the User Preferences page and verify all updates are saved`, async () => {
            await app.ui.refresh();
            await app.ui.waitLoading({checkErrors: false});

            for (const field of fields) {
                await app.ui.userPreferencesBoard.scrollTo('fields', field.name);
                await t
                    .expect(await app.ui.userPreferencesBoard.getField(field.name, field.type).getValue()).eql(field.updValue);
            }
            for (let grid of tableGrids) {
                const table = await app.ui.userPreferencesBoard.getField(grid.name, 'tablegrid');
                const index = (await table.getColumnValues('IP Type')).indexOf(grid.ipType);
                const field = await table.getField(grid.column2, 'autocomplete', index);

                await app.ui.userPreferencesBoard.scrollTo('fields', grid.name);
                await t
                    .expect(await field.getValue()).contains(grid.updValue);
            }
            await app.ui.userPreferencesBoard.scrollTo('fields', 'Favorite Queries');
            await app.ui.userPreferencesBoard.nodeTreeview.expand('Patent');
            treeSelectedNames = await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames();
            await t
                .expect(app.services.array.areEquivalent(treeExpectedNames, treeSelectedNames)).ok();
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

const blanks = {
    report: {
        field: 'Default Report',
        value: 'All Action Codes',
        valueId: 1233,
        blankValue: ''
    },
    query: {
        field: 'Default Query',
        value: 'TA TM All Actions',
        valueId: 46657,
        blankValue: ''
    },
    country: {
        field: 'Default Country',
        column1: 'IP Type',
        column2: 'Default Country',
        ipType: 'GeneralIP1Masters',
        ipTypeId: '4',
        value: 'AE - (United Arab Emirates)',
        valueId: 259,
        blankValue: ''
    },
    form: {
        field: 'Record Management Forms',
        column1: 'IP Type',
        column2: 'View in Template',
        ipType: 'GeneralIP1Masters',
        ipTypeId: '4',
        value: 'TA DEF for GeneralIP1',
        valueId: 29651,
        blankValue: ''
    }
};

test
    // .only
    .meta('brief', 'false')
    .before(async () => {
        await app.step('Set non-blank values and not-first DMF in User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultReport', value: blanks.report.valueId }, { property: 'DefaultQuery', value: blanks.query.valueId }, { property: 'DefaultDmForms', value: {'4': 29651} }]);
        });
    })
    (`Verify Reset of a cleared field to a filled value (step 11: blank values)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences')
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql(blanks.report.value)
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql(blanks.query.value);
        });
        await app.step(`Clear value in the 'Default Report' field`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').clear();
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Clear value in the 'Default Query' field`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').clear();
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Clear value in the 'Default Country' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.country.ipType);
            const field = await table.getField('Default Country', 'autocomplete', index);
            await field.clear();
            await t
                .expect(await field.getValue()).eql('');
        });
        await app.step(`Clear value in 'Record Management Form' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Record Management Forms', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.form.ipType);
            const field = await table.getField('View in Template', 'autocomplete', index);
            await field.clear();
            await t
                .expect(await field.getValue()).eql('');
        });
        await app.step(`Confirm [Reset]`, async () => {
            await app.ui.userPreferencesBoard.reset();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?');
            await app.ui.confirmationModal.confirm();
            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok();
        });
        await app.step(`Verify [Reset] restored value in the 'Default Report'`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql(blanks.report.value);
        });
        await app.step(`Verify [Reset] restored value in the 'Default Query'`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql(blanks.query.value);
        });
        await app.step(`Verify [Reset] restored value in 'Default Country' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.country.ipType);
            const field = await table.getField('Default Country', 'autocomplete', index);
            await t
                .expect(await field.getValue()).eql(blanks.country.value);
        });
        await app.step(`Verify [Reset] restored value in 'Record Management Forms' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Record Management Forms', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.form.ipType);
            const field = await table.getField('View in Template', 'autocomplete', index);
            await t
                .expect(await field.getValue()).eql(blanks.form.value);
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'false')
    .before(async () => {
        await app.step('Set blank values and not-first DMF in User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCountries', value: {'4': null} }, { property: 'DefaultDmForms', value: {'4': 29651} }]);
        });
    })
    (`Verify Reset of a filled field to a blank value (step 11: blank values)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences')
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql('')
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Set a non-blank value in the 'Default Report' dropdown`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').fill(blanks.report.value);
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).notEql('');
        });
        await app.step(`Set a non-blank value in the 'Default Query' dropdown`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').fill(blanks.query.value);
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).notEql('');
        });
        await app.step(`Set a non-blank value in 'Default Country' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.country.ipType);
            const field = await table.getField('Default Country', 'autocomplete', index);
            await field.fill(blanks.country.value);
            await t
                .expect(await field.getValue()).notEql('');
        });
        await app.step(`Confirm [Reset]`, async () => {
            await app.ui.userPreferencesBoard.reset();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Unsaved changes will be lost. Do you want to continue?');
            await app.ui.confirmationModal.confirm();
            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
        });
        await app.step(`Verify [Reset] restored blank value in the 'Default Report'`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Verify [Reset] restored blank value in the 'Default Query'`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Verify [Reset] restored blank value in 'Default Country' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.country.ipType);
            const field = await table.getField('Default Country', 'autocomplete', index);
            await t
                .expect(await field.getValue()).eql('');
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'false')
    .before(async () => {
        await app.step('Set non-blank values and not-first DMF in User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultReport', value: blanks.report.valueId }, { property: 'DefaultQuery', value: blanks.query.valueId }, { property: 'DefaultDmForms', value: {'4': 29651} }]);
        });
    })
    (`Verify Save of a blank value (step 14: blank values)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql(blanks.report.value)
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql(blanks.query.value);
        });
        await app.step(`Clear value in the 'Default Report' dropdown`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').clear();
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Clear value in the 'Default Query' dropdown`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').clear();
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Clear value in 'Default Country' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.country.ipType);
            const field = await table.getField('Default Country', 'autocomplete', index);
            await t
                .expect(await field.getValue()).eql(blanks.country.value);
            await field.clear();
            await t
                .expect(await field.getValue()).eql('');
        });
        await app.step(`Clear value in 'Record Management Form' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Record Management Forms', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.form.ipType);
            const field = await table.getField('View in Template', 'autocomplete', index);
            await t
                .expect(await field.getValue()).eql(blanks.form.value);
            await field.clear();
            await t
                .expect(await field.getValue()).eql('');
        });
        await app.step(`Click [Save]`, async () => {
            await app.ui.userPreferencesBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
        });
        await app.step(`Verify blank value is saved in the 'Default Report'`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Verify blank value is saved in the 'Default Query'`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Verify blank value is saved in the 'Default Country' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.country.ipType);
            const field = await table.getField('Default Country', 'autocomplete', index);
            await t
                .expect(await field.getValue()).eql('');
        });
        await app.step(`Verify blank value is changed to the 1st available value in 'Record Management Forms' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Record Management Forms', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.form.ipType);
            const field = await table.getField('View in Template', 'autocomplete', index);
            await field.expand();
            const dropdownList = await app.ui.kendoPopup.getAllItemsText();
            await t
                .expect(await field.getValue()).eql(dropdownList[0]);
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'false')
    .before(async () => {
        await app.step('Set blank values in User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultReport', value: null }, { property: 'DefaultQuery', value: null }, { property: 'DefaultCountries', value: {'4': null} }]);
        });
    })
    (`Verify Save of a filled value instead of a blank (step 14: blank values)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql('')
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql('');
        });
        await app.step(`Set a non-blank value in the 'Default Report' field`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').fill(blanks.report.value);
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).notEql('');
        });
        await app.step(`Set a non-blank value in the 'Default Query' field`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').fill(blanks.query.value);
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).notEql('');
        });
        await app.step(`Set a non-blank value in the 'Default Country' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.country.ipType);
            const field = await table.getField('Default Country', 'autocomplete', index);
            await field.fill(blanks.country.value);
            await t
                .expect(await field.getValue()).notEql('');
        });
        await app.step(`Click [Save]`, async () => {
            await app.ui.userPreferencesBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).notOk()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).notOk();
        });
        await app.step(`Verify new value is saved in the 'Default Report'`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql(blanks.report.value);
        });
        await app.step(`Verify new value is saved in the 'Default Query'`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql(blanks.query.value);
        });
        await app.step(`Verify new value is saved in 'Default Country' grid`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.country.ipType);
            const field = await table.getField('Default Country', 'autocomplete', index);

            await t
                .expect(await field.getValue()).eql(blanks.country.value);
        });
        await app.step(`Refresh the User Preferences page and verify updates are saved`, async () => {
            await app.ui.refresh();
            await app.ui.waitLoading({checkErrors: false});
            const table = await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf(blanks.country.ipType);
            const field = await table.getField('Default Country', 'autocomplete', index);
            await t
                .expect(await field.getValue()).eql(blanks.country.value)
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql(blanks.report.value)
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql(blanks.query.value);
        });
    })
    .after(async () => {
       await app.step('Reset User Preferences (API)', async () => {
           await app.api.userPreferences.resetUserPreferences();
       });
   });

test
    // .only
    .meta('brief', 'true')
    (`Verify [Save] for the 'Culture' field on User Preferences (Steps 15-18: 'Culture' field)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences');
        });
        await app.step(`Make changes in 'Culture' field and verify the Save confirmation message (step 15)`, async () => {
            await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill('ja-JP');
            await t
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok();
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('The selection of a different culture requires you to sign out of the application. Do you want to continue with this action?')
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Continue')).ok()
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Cancel')).ok();
        });
        await app.step(`Click [Cancel] on the Save confirmation message (step 16)`, async () => {
            await app.ui.confirmationModal.cancel();
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('en-US')
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')).ok()
                .expect(await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Reset')).ok();
        });
        await app.step(`Change the 'Culture' field and verify user is logged out on Save (step 17)`, async () => {
            await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill('ja-JP');
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.getCurrentUrl()).contains(`${globalConfig.env.loginPageUrl}/logout`);
            app.ui.resetRole(undefined, 'UI/user-preferences');
        });
        await app.step(`Re-login and verify 'Culture' on User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences')
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql('ja-JP');
        });
        await app.step(`Verify the new culture is saved in the database`, async () => {
            const dbCulture = (await app.services.db.executeDatabaseQuery(`SELECT PARAMETERVALUE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'DefaultCulture'`, { closeConnection: true })).recordset[0].PARAMETERVALUE;
            await t
                .expect(dbCulture).eql('ja-JP');
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify 'Help' on the User Preferences (Step 20)`, async (t: TestController) => {
        await app.step('Login and open User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences')
                .expect(await app.ui.header.isVisible('helpIcon')).ok();
        });
        await app.step(`Verify 'Help' tooltip`, async () => {
            await app.ui.header.hover('helpIcon');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Help');
        });
        await app.step(`Verify 'Help' URL on User Preferences`, async () => {
            await app.ui.header.click('helpIcon');
            await t
                .expect(await app.ui.getCurrentUrl()).contains(`#130`);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .meta('category', 'Display Configuration')
    .before(async () => {
        await app.step('Set non-blank values in User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultReport', value: blanks.report.valueId }, { property: 'DefaultQuery', value: blanks.query.valueId }]);
        });
    })
    (`User Preferences - Save/Reset/Help - Verify Display Configuration (Step 21)`, async (t: TestController) => {
        await app.step('Change display configuration for user (API)', async () => {
            app.ui.resetRole(undefined, 'UI/user-preferences');
            await app.api.login();
            await app.api.changeDisplayConfigurationForUser('TA Custom Display Configuration', globalConfig.user.userName);
        });
        // Note: currencies, cultures and date format are not display configurable
        await app.step(`Open User Preferences and verify control names are display configured`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.header.hover('helpIcon');
            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('Test - User Preferences')
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Test - Help')
                .expect(await app.ui.userPreferencesBoard.isVisible('preferencesButtons', 'Test - Save')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('preferencesButtons', 'Test - Reset')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'Test - General')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'Test - Display Options')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'Test - Default Culture')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'Test - Record Management')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Records per page')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Default portal')).ok()

                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Default report')).ok()

                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Batch Rules Processing')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Country / Region Display')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Party Display')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Code Display')).ok()

                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Culture')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Date Format')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Display Currency')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Use Base Currency')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Default Country')).ok()

                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Record Management Forms')).ok()

                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Actions Completed Date Filter')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Default Query')).ok()

                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Auto-Execute Queries')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Test - Favorite Queries')).ok()
                ;
        });
        await app.step(`Verify control values are display configured`, async () => {
            const countryDisplayValues = await app.ui.userPreferencesBoard.getField('Test - Country / Region Display', 'radiobutton').getPossibleValues();
            console.log('countryDisplayValues are ' + countryDisplayValues);
            const partyDisplayValues = await app.ui.userPreferencesBoard.getField('Test - Party Display', 'radiobutton').getPossibleValues();
            console.log('partyDisplayValues are ' + partyDisplayValues);
            const codeDisplayValues = await app.ui.userPreferencesBoard.getField('Test - Code Display', 'radiobutton').getPossibleValues();
            console.log('codeDisplayValues are ' + codeDisplayValues);

            const tableDC = await app.ui.userPreferencesBoard.getField('Test - Default Country', 'tablegrid');
            const tableDCColumns = await tableDC.getColumnsNamesArray();
            const tableDCIPTypes = await tableDC.getColumnValues(tableDCColumns[0].text);
            const tableDCCountries = await tableDC.getColumnValues(tableDCColumns[1].text);

            const tableRM = await app.ui.userPreferencesBoard.getField('Test - Record Management Forms', 'tablegrid');
            const tableRMColumns = await tableRM.getColumnsNamesArray();
            const tableRMIPTypes = await tableRM.getColumnValues(tableRMColumns[0].text);
            const tableRMTemplates = await tableRM.getColumnValues(tableRMColumns[1].text);

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Test - Default portal', 'dropdown').getValue()).contains('Test - ', 'Field value is not display configured')
                .expect(await app.ui.userPreferencesBoard.getField('Test - Default report', 'autocomplete').getValue()).contains('Test - ', 'Field value is not display configured')
                .expect(countryDisplayValues.every((x) => x.includes('Test - '))).ok('Field value is not display configured')
                .expect(partyDisplayValues.every((x) => x.includes('Test - '))).ok('Field value is not display configured')
                .expect(codeDisplayValues.every((x) => x.includes('Test - '))).ok('Field value is not display configured')
                .expect(tableDCIPTypes.every((x) => x.includes('Test - '))).ok('Field value is not display configured')
                .expect(tableDCCountries.every((x) => x.includes('Test - '))).ok('Field value is not display configured')
                .expect(tableRMIPTypes.every((x) => x.includes('Test - '))).ok('Field value is not display configured')
                .expect(tableRMTemplates.every((x) => x.includes('Test - '))).ok('Field value is not display configured')
                .expect(await app.ui.userPreferencesBoard.getField('Test - Actions Completed Date Filter', 'toggle').getValue()).contains('Test - ', 'Field value is not display configured')
                .expect(await app.ui.userPreferencesBoard.getField('Test - Auto-Execute Queries', 'toggle').getValue()).contains('Test - ', 'Field value is not display configured')
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemVisible('Trademark>Test - TA TM All Actions')).ok();
            for (let column of tableDCColumns) {
                await t.expect(column.text.includes('Test - ')).ok('Field value is not display configured');
            }
            for (let column of tableRMColumns) {
                await t.expect(column.text.includes('Test - ')).ok('Field value is not display configured');
            }
        });
        await app.step(`Make changes and verify the 'Unsaved changes' message`, async () => {
            await app.ui.userPreferencesBoard.getField('Test - Records per page', 'dropdown').fill('100');
            await app.ui.userPreferencesBoard.click('preferencesButtons', 'Test - Reset');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('title')).eql('Test - Confirm')
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Test - Unsaved changes will be lost. Do you want to continue?')
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Test - Continue')).ok()
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Test - Cancel')).ok();
            await app.ui.confirmationModal.cancel();
        });
        await app.step(`Make changes and verify the Save message`, async () => {
            await app.ui.userPreferencesBoard.getField('Test - Records per page', 'dropdown').fill('100');
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Test - Save was successful.');
        });
        await app.step(`Make changes in 'Culture' field and verify the confirmation message`, async () => {
            await app.ui.userPreferencesBoard.getField('Test - Culture', 'dropdown').fill('ja-JP');
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Test - The selection of a different culture requires you to sign out of the application. Do you want to continue with this action?')
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Test - Continue')).ok()
                .expect(await app.ui.confirmationModal.isEnabled('buttons', 'Test - Cancel')).ok();
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences and change display configuration to default (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
            await app.api.changeDisplayConfigurationForUser('Default Display Configuration 1', globalConfig.user.userName);
            app.ui.resetRole(undefined, 'UI/user-preferences');
        });
    });
