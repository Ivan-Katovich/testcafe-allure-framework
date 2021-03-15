import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.userPreferences.pack. - Test ID 29962 : User Preferences - Hosted - General and Display Options`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step(`Set default values in Default System Configuration (API)`, async () => {
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            general.setDisplayOptions('Country / Region Display', 'Codes');
            general.setDisplayOptions('Party Display', 'Codes');
            general.setDisplayOptions('Codes Display', 'Codes');
            await general.save();

            const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            userPref.setRecordsPerPage(100);
            await userPref.setPortalDefault('Query');
            await userPref.save();
        });
        await app.step(`Add current user to content group '${additionalGroup1}' (API)`, async () => {
            await app.api.administration.contentGroup.openContentGroup(additionalGroup1);
            app.api.administration.contentGroup.addUser(globalConfig.user.userName);
            await app.api.administration.contentGroup.save();
        });
        await app.step(`Add current user to content group '${additionalGroup2}' (API)`, async () => {
            await app.api.administration.contentGroup.openContentGroup(additionalGroup2);
            app.api.administration.contentGroup.addUser(globalConfig.user.userName);
            await app.api.administration.contentGroup.save();
        });
    })
    .after(async () => {
        await app.step(`Set default values in Default System Configuration (API)`, async () => {
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            general.setDisplayOptions('Country / Region Display', 'WIPO Codes');
            general.setDisplayOptions('Party Display', 'Description');
            general.setDisplayOptions('Codes Display', 'Description');
            await general.save();

            const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            userPref.setRecordsPerPageLocked(false);
            userPref.setRecordsPerPage(25);
            await userPref.setPortalDefault('Query');
            await userPref.save();
        });
        await app.step(`Remove current user from '${additionalGroup1}' (API)`, async () => {
            await app.api.administration.contentGroup.openContentGroup(additionalGroup1);
            app.api.administration.contentGroup.setActive(false);
            app.api.administration.contentGroup.removeUser(globalConfig.user.userName);
            await app.api.administration.contentGroup.save();
        });
        await app.step(`Remove current user from '${additionalGroup2}' (API)`, async () => {
            await app.api.administration.contentGroup.openContentGroup(additionalGroup2);
            app.api.administration.contentGroup.removeUser(globalConfig.user.userName);
            app.api.administration.contentGroup.setActive(false);
            await app.api.administration.contentGroup.save();
        });
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step(`Add license with collaboration in Default System Configuration (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
    });

const userContentGroup = globalConfig.user.contentGroup;
const additionalGroup1 = 'Test Automation CG Regression 2';
const additionalGroup2 = 'Test Automation CG Regression 3';

test
    // .only
    .meta('brief', 'true')
    (`Verify General Section (Step 2-5)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences (Step 2-3)`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'General')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionLinks', 'General')).ok();
        });
        await app.step(`Click General link (Step 4)`, async () => {
            await app.ui.userPreferencesBoard.click('sectionLinks', 'General');

            await t
                .expect(await app.ui.userPreferencesBoard.isInView('sectionTitles', 'General')).ok()
                .expect(await app.ui.userPreferencesBoard.isInView('sectionLinks', 'General')).notOk();
        });
        await app.step(`Verify General section fields (Step 5)`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Records Per Page').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Default Report').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Password').isPresent()).notOk()
                .expect(await app.ui.userPreferencesBoard.getField('Confirm Password').isPresent()).notOk();
        });
        await app.step(`Scroll to the 'Record Management' section`, async () => {
            await app.ui.userPreferencesBoard.scrollTo('sectionTitles', 'Record Management');

            await t
                .expect(await app.ui.userPreferencesBoard.isInView('sectionTitles', 'Record Management')).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Delete Records Per Page value in User Parameters table (Database)', async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'RECORDS_PER_PAGE'`);
            await app.api.clearCache();
        });
    })
    (`Verify Records Per Page field (Step 6)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Verify Records Per Page field (Step 6)`, async () => {
            const userPrefSysConfig = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            const expectedValue = await userPrefSysConfig.getValue('RECORDS_PER_PAGE');
            const actualValue = await app.ui.userPreferencesBoard.getField('Records Per Page', 'dropdown').getValue();
            await app.ui.userPreferencesBoard.getField('Records Per Page', 'dropdown').expand();
            const dropdownValues = await app.ui.kendoPopup.getAllItemsText();
            const expectedDropdownValues = [
                '25',
                '50',
                '75',
                '100'
            ];

            await t
                .expect(actualValue).eql(expectedValue)
                .expect(dropdownValues).eql(expectedDropdownValues);
        });
        await app.step(`Clear Records Per Page`, async () => {
            const valueBefore = await app.ui.userPreferencesBoard.getField('Records Per Page', 'dropdown').getValue();
            await app.ui.userPreferencesBoard.getField('Records Per Page', 'dropdown').click();
            await app.ui.pressKey('ctrl+a');
            await app.ui.pressKey('delete');
            const valueAfter = await app.ui.userPreferencesBoard.getField('Records Per Page', 'dropdown').getValue();

            await t
                .expect(valueBefore).eql(valueAfter);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Delete Default Portal value in User Parameters table (Database)', async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'PORTAL_DEFAULT'`);
        });
    })
    (`Verify Default Portal field (Step 7)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Verify Default Portal field`, async () => {
            const userPrefSysConfig = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            const expectedValue = await userPrefSysConfig.getPortalDefault();
            await app.ui.pressKey('tab');
            const actualValue = await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').getValue();
            await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').expand();
            const dropdownValues = await app.ui.kendoPopup.getAllItemsText();
            const expectedDropdownValues = [
                'Collaboration Portal',
                'Query'
            ];

            await t
                .expect(actualValue).eql(expectedValue)
                .expect(dropdownValues).eql(expectedDropdownValues);
        });
        await app.step(`Change Portal_Default in GlobalParameters to not supported value (Database)`, async () => {
            app.memory.current.id = (await app.services.db.executeDatabaseQuery(`SELECT ParameterValue FROM GlobalParameters WHERE Code = 'Portal_Default'`)).recordset[0].ParameterValue;
            await app.services.db.executeDatabaseQuery(`UPDATE GlobalParameters SET ParameterValue = 'C2' WHERE Code = 'Portal_Default'`);
            await app.api.clearCache();
            await app.ui.refresh();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').getValue()).eql('');
        });
    })
    .after(async () => {
        await app.step(`Change back Portal_Default parameter value in database (Database)`, async () => {
            await app.services.db.executeDatabaseQuery(`UPDATE GlobalParameters SET ParameterValue = '${app.memory.current.id}' WHERE Code = 'Portal_Default'`);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Default Portal based on Content Group permissions (Step 8.1): User has permissions to both Query and Collaboration Portal`, async (t: TestController) => {
        await app.step(`Change content group '${userContentGroup}': permissions to 1 public query, active (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', false);
            cg.setPermission('Query>TA PA All Cases', true);
            await cg.save();
        });
        await app.step(`Change content group '${additionalGroup1}': no permissions to any query, active (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            cg.setActive(true);
            await cg.openContentGroup(additionalGroup1);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Change content group '${additionalGroup2}': no permissions to any query, not active (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Go to User Preferences  and verify Default portal`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').expand();
            const dropdownValues = await app.ui.kendoPopup.getAllItemsText();
            const expectedDropdownValues = [
                'Collaboration Portal',
                'Query'
            ];

            await t
                .expect(dropdownValues).eql(expectedDropdownValues);
        });
    })
    .after(async () => {
        await app.step(`Reset '${userContentGroup}' to default values (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Reset '${additionalGroup1}' to default values and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Reset '${additionalGroup2}' to default values and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Default Portal based on Content Group permissions (Step 8.2): User has only private query`, async (t: TestController) => {
        await app.step(`Change content group '${userContentGroup}': permissions to 1 private query, active (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', false);
            cg.setPermission('Query>TA Private Query', true);
            await cg.save();
        });
        await app.step(`Change content group '${additionalGroup1}': no permissions to any query, active (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(true);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Change content group '${additionalGroup2}': no permissions to any query, not active (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Go to User Preferences  and verify Default portal`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').expand();
            const dropdownValues = await app.ui.kendoPopup.getAllItemsText();
            const expectedDropdownValues = [
                'Collaboration Portal',
                'Query'
            ];

            await t
                .expect(dropdownValues).eql(expectedDropdownValues);
        });
    })
    .after(async () => {
        await app.step(`Reset '${userContentGroup}' to default values (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Reset '${additionalGroup1}' to default values and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Reset '${additionalGroup2}' to default values and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Default Portal based on Content Group permissions (Step 8.3): User has no permissions to Query`, async (t: TestController) => {
        await app.step(`Set Default Portal to 'Query' in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences();
            await app.api.userPreferences.setDefaultPortal('Query');
        });
        await app.step(`Change content group '${userContentGroup}': no permissions to any query, active (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Change content group '${additionalGroup1}': no permissions to any query, active (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(true);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Change content group '${additionalGroup2}': has permissions to 1 public query, not active (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermission('Query', false);
            cg.setPermission('Query>TA PA All Cases', true);
            await cg.save();
        });
        await app.step(`Go to User Preferences  and verify Default portal`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            const value = await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').getValue();
            await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').expand();
            const dropdownValues = await app.ui.kendoPopup.getAllItemsText();
            const expectedDropdownValues = [
                'Collaboration Portal'
            ];

            await t
                .expect(value).eql('')
                .expect(dropdownValues).eql(expectedDropdownValues);
        });
    })
    .after(async () => {
        await app.step(`Reset '${userContentGroup}' to default values (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Reset '${additionalGroup1}' to default values and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Reset '${additionalGroup2}' to default values and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Default Portal with the license (Step 9.1): with access to Collaboration Portal and no Query permissions in Content Group`, async (t: TestController) => {
        await app.step(`Set 'Query' to Default Portal (API)`, async () => {
            await app.api.userPreferences.setDefaultPortal('Query');
        });
        await app.step(`Remove Query permissions for content group '${userContentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Remove Query permissions for content group '${additionalGroup1}' and activate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(true);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Remove Query permissions for content group '${additionalGroup2}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Add license with access to the Collaboration Portal to Default System Configuration (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Verify Default Portal dropdown list`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').expand();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').getValue()).eql('')
                .expect(await app.ui.kendoPopup.getAllItemsText()).eql(['Collaboration Portal']);
        });
    })
    .after(async () => {
        await app.step(`Set default permissions for '${userContentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup1}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup2}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Default Portal with the license (Step 9.2): without access to Collaboration Portal and with Query permissions in Content Group`, async (t: TestController) => {
        await app.step(`Set 'Collaboration Portal' to Default Portal (API)`, async () => {
            await app.api.userPreferences.setDefaultPortal('Collaboration Portal');
        });
        await app.step(`Remove Query permissions for content group '${userContentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', false);
            cg.setPermission('Query>PA All Cases', true);
            await cg.save();
        });
        await app.step(`Remove Query permissions for content group '${additionalGroup1}' and activate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(true);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Remove Query permissions for content group '${additionalGroup2}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Add license with access to the Collaboration Portal to Default System Configuration (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'WithoutCollaboration.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Verify Default Portal dropdown list`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').expand();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').getValue()).eql('')
                .expect(await app.ui.kendoPopup.getAllItemsText()).eql(['Query']);
        });
    })
    .after(async () => {
        await app.step(`Set default permissions for '${userContentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup1}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup2}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Remove license from Default System Configuration (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Default Portal with the license (Step 9.3): without access to Collaboration Portal and Query permissions in Content Group`, async (t: TestController) => {
        await app.step(`Remove Query permissions for content group '${userContentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Remove Query permissions for content group '${additionalGroup1}' and activate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(true);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Remove Query permissions for content group '${additionalGroup2}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Add license with access to the Collaboration Portal to Default System Configuration (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'WithoutCollaboration.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Verify Default Portal dropdown list`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').isPresent()).notOk();
        });
    })
    .after(async () => {
        await app.step(`Set default permissions for '${userContentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup1}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup2}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Remove license from Default System Configuration (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify supported and unsupported Default Portal value in User Preferences (Step 10)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Select supported value in Default Portal`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').fill('Query');

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').getValue()).eql('Query');
        });
        await app.step(`Change Portal_Default in UserParameters table to unsupported value (Database)`, async () => {
            app.memory.current.id = (await app.services.db.executeDatabaseQuery(`SELECT ParameterValue FROM UserParameters WHERE Code = 'Portal_Default' and username = '${globalConfig.user.userName}'`)).recordset[0].ParameterValue;
            await app.services.db.executeDatabaseQuery(`UPDATE UserParameters SET ParameterValue = 'C2' WHERE Code = 'Portal_Default' and username = '${globalConfig.user.userName}'`);
            await app.api.clearCache();
        });
        await app.step(`Refresh User Preferences and verify unsupported value`, async () => {
            await app.ui.refresh(true);

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').getValue()).eql('');
        });
    })
    .after(async () => {
        await app.step(`Change back Portal_Default parameter value in database (Database)`, async () => {
            await app.services.db.executeDatabaseQuery(`UPDATE UserParameters SET ParameterValue = '${app.memory.current.id}' WHERE Code = 'Portal_Default' and username = '${globalConfig.user.userName}'`);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Delete Default Report value in User Parameters table (Database)', async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'DEFAULT_REPORT_RESOURCEID'`);
            await app.api.clearCache();
        });
    })
    (`Verify Default Report in User Preferences (Step 11-12)`, async (t: TestController) => {
        let allReports: string[];
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').isVisible()).ok();
        });
        await app.step(`Verify default value`, async () => {
            const actualValue = await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue();

            await t
                .expect(actualValue).eql('');
        });
        await app.step(`Verify dropdown list`, async () => {
            const dbValues = (await app.services.db
                .executeDatabaseQuery('SELECT * FROM Resources ' +
                    'WHERE ResourceTypeID = (SELECT ResourceTypeID FROM ResourceTypes WHERE ResourceTypeName = \'REPORT\') ' +
                    'AND ResourceID ' +
                    'IN (SELECT ResourceID FROM Report WHERE ReportType = 0)')).recordset.map((x) => x.RESOURCENAME);

            await app.api.administration.displayConfiguration.openDisplayConfiguration('Default Display Configuration 1');
            await app.api.administration.displayConfiguration.openResources();
            const expectedValues = dbValues.map((x) => app.api.administration.displayConfiguration.getDisplayedValue('REPORT', x).trim());

            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').expandWholeList();
            const actualValues = await app.ui.kendoPopup.getAllItemsText();
            allReports = actualValues;

            await t
                .expect(app.services.array.areEquivalent(expectedValues, actualValues)).ok()
                .expect(app.services.array.isSortedAlphabetically(actualValues)).ok();
        });
        await app.step(`Search by beginning symbols`, async () => {
            const longestValue = allReports.sort((a, b) => b.length - a.length)[0];
            const beginning = longestValue.substring(0, longestValue.length - 5);
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').type('input', beginning);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues.includes(longestValue)).ok();
        });
        await app.step(`Search by ending symbols`, async () => {
            const searchValue = allReports.sort((a, b) => b.length - a.length)[0];
            const ending = searchValue.substring(searchValue.length - 5);
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').type('input', ending);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues.includes(searchValue)).ok();
        });
        await app.step(`Search by the symbols from the middle of the name`, async () => {
            const searchValue = allReports.sort((a, b) => b.length - a.length)[0];
            const middle = searchValue.substring(3, searchValue.length - 3);
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').type('input', middle);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues.includes(searchValue)).ok();
        });
        await app.step(`Search by term in upper case`, async () => {
            const searchValue = allReports.find((x) => app.services.regex.containsLetters(x));
            const uppercase = searchValue.toUpperCase();
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').type('input', uppercase);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues.includes(searchValue)).ok();
        });
        await app.step(`Search by term in lower case`, async () => {
            const searchValue = allReports.find((x) => app.services.regex.containsLetters(x));
            const lowercase = searchValue.toLowerCase();
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').type('input', lowercase);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues.includes(searchValue)).ok();
        });
        await app.step(`Search by special symbols`, async () => {
            const searchValue = allReports.find((x) => app.services.regex.containsSpecialSymbols(x)); // Value with special symbols
            const specialSymbol = app.services.regex.getFirstSpecialSymbol(searchValue);
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').type('input', specialSymbol);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues.includes(searchValue)).ok();
        });
        await app.step(`Search by numbers`, async () => {
            const searchValue = allReports.find((x) => app.services.regex.containsNumbers(x)); // Value with number
            const number = app.services.regex.getFirstNumber(searchValue);
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').type('input', number);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues.includes(searchValue)).ok();
        });
        await app.step(`Type non-existing value`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').type('input', 'non-exising value');

            await t
                .expect((await app.ui.kendoPopup.getAllItemsText()).length).eql(0)
                .expect(await app.ui.kendoPopup.isVisible('noDataInfo')).ok()
                .expect(await app.ui.kendoPopup.getText('noDataInfo')).eql('0 items found');
        });
        await app.step(`Select value and save`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').click('clearButton');
            await app.ui.kendoPopup.selectTop();
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();
        });
        await app.step(`Clear the value via [x] icon`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').click('clearButton');

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql('');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify permissions to Basic and Query reports (Step 13)`, async (t: TestController) => {
        const basicReport1 = 'Patent 30 Day Docket';
        const basicReport2 = 'Patent 60 Day Docket';
        const basicReport3 = 'Patent 90 Day Docket';
        const queryReport1 = 'Patent 30 Day Docket Query Report';
        const queryReport2 = 'Patent 60 Day Docket Query Report';
        const queryReport3 = 'Patent 90 Day Docket Query Report';
        await app.step(`Set permissions for content group '${userContentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Reports', false);
            cg.setPermission('Reports>' + basicReport1, true);
            cg.setPermission('Reports>' + queryReport1, true);
            await cg.save();
        });
        await app.step(`Set permission for content group '${additionalGroup1}' and activate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(true);
            cg.setPermission('Reports', false);
            cg.setPermission('Reports>' + basicReport2, true);
            cg.setPermission('Reports>' + queryReport2, true);
            await cg.save();
        });
        await app.step(`Set permissions for content group '${additionalGroup2}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermission('Reports', false);
            cg.setPermission('Reports>' + basicReport3, true);
            cg.setPermission('Reports>' + queryReport3, true);
            await cg.save();
        });
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Verify Default Report list`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').expandWholeList();
            const actualList = await app.ui.kendoPopup.getAllItemsText();
            const expectedList = [basicReport1, basicReport2];

            await t
                .expect(actualList).eql(expectedList);
        });
    })
    .after(async () => {
        await app.step(`Set default permissions for '${userContentGroup}'`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup1}' and deactivate`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup2}' and deactivate`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify when set Default Report doesn't have permissions (Step 14.1)`, async (t: TestController) => {
        const basicReport = 'Patent 30 Day Docket';
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Set Default Report and save`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').fill('Patent 30 Day Docket');
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();
        });
        await app.step(`Remove permissions for '${basicReport}' in Content Group (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Reports>' + basicReport, false);
            await cg.save();
        });
        await app.step(`Refresh User Preferences and verify Default Report list`, async () => {
            await app.ui.refresh();
            const actualValue = await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue();
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').expandWholeList();
            const wholeList = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(wholeList).notContains(basicReport)
                .expect(actualValue).eql('');
        });
    })
    .after(async () => {
        await app.step(`Set default permissions for userContentGroup`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

test
    // .only
    .before(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step(`Remove permissions for 'Patent 30 Day Docket' in content group '${userContentGroup}'`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Reports>Patent 30 Day Docket', false);
            await cg.save();
        });
        await app.step(`Activate content group '${additionalGroup1}' and add permissions for 'Patent 30 Day Docket'`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(true);
            cg.setPermission('Reports>Patent 30 Day Docket', true);
            await cg.save();
        });
    })
    (`Verify when content group with permissions for set Deafult Report is not active (Step 14.2)`, async (t: TestController) => {
        const basicReport = 'Patent 30 Day Docket';
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Set Default Report and save`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').fill(basicReport);
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();
        });
        await app.step(`Deactivate Content Group '${additionalGroup1}'`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            await cg.save();
        });
        await app.step(`Refresh User Preferences and verify Default Report list`, async () => {
            await app.ui.refresh();
            const actualValue = await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue();
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').expandWholeList();
            const wholeList = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(wholeList).notContains(basicReport)
                .expect(actualValue).eql('');
        });
    })
    .after(async () => {
        await app.step(`Set default permissions for '${userContentGroup}'`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setActive(true);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup1}' and deactivate`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify when user doesn't have permissions to any Basic report (Step 15)`, async (t: TestController) => {
        await app.step(`Set permissions for content group '${userContentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Reports', false);
            await cg.save();
        });
        await app.step(`Set permission for content group '${additionalGroup1}' and activate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(true);
            cg.setPermission('Reports', false);
            await cg.save();
        });
        await app.step(`Set permissions for content group '${additionalGroup2}' and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermission('Reports', false);
            cg.setPermission('Reports>Patent 90 Day Docket', false);
            cg.setPermission('Reports>Patent 90 Day Docket Query Report', false);
            await cg.save();
        });
        await app.step(`Login and go to User Preferences and verify Default Report`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').isPresent()).notOk();
        });
    })
    .after(async () => {
        await app.step(`Set default permissions for '${userContentGroup}'`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup1}' and deactivate`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup1);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Set default permissions for '${additionalGroup2}' and deactivate`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalGroup2);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Delete Batch Rules Processing value in User Parameters table (Database)', async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'BATCH_RULES'`);
            await app.api.clearCache();
        });
    })
    (`Verify Batching Rules Processing (Step 16)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').isChecked()).notOk();
        });
        await app.step(`Check Batching Rules Processing`, async () => {
            await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').check();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').isChecked()).ok();
        });
        await app.step(`Uncheck Batching Rules Processing`, async () => {
            await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').uncheck();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Batch Rules Processing', 'checkbox').isChecked()).notOk();
        });
    });

[
    { userPrefValue: 25, defaultConfigValue: 100, locked: false },
    { userPrefValue: 50, defaultConfigValue: 100, locked: false },
    { userPrefValue: 75, defaultConfigValue: 100, locked: false },
    { userPrefValue: 100, defaultConfigValue: 25, locked: false },
    { userPrefValue: 100, defaultConfigValue: 25, locked: true },
    { userPrefValue: 100, defaultConfigValue: 50, locked: true },
    { userPrefValue: 100, defaultConfigValue: 75, locked: true },
    { userPrefValue: 25, defaultConfigValue: 100, locked: true }
].forEach((data) => {
    test
        // .only
        .meta('brief', 'true')
        (`Verify Records Per Page (Step 17-18): User Preferences: ${data.userPrefValue}, Default System Configuration: ${data.defaultConfigValue}, ${data.locked ? 'locked' : 'not locked'}`, async (t: TestController) => {
            await app.step(`Set values in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'RecordsPerPage.Value', value: data.userPrefValue }]);
            });
            await app.step(`Set values in Default System Configuration (API)`, async () => {
                const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                userPref.setRecordsPerPage(data.defaultConfigValue);
                userPref.setRecordsPerPageLocked(data.locked);
                await userPref.save();
            });
            await app.step(`Login and open User Preferences`, async () => {
                await app.ui.getRole(undefined, 'UI/user-preferences');
                await app.ui.waitLoading();
                const expectedValue = data.locked ? data.defaultConfigValue : data.userPrefValue;

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Records Per Page', 'dropdown').getValue()).eql(expectedValue.toString())
                    .expect(await app.ui.userPreferencesBoard.getField('Records Per Page', 'dropdown').isEnabled('dropdownList')).eql(!data.locked);
            });
            await app.step(`Verify Query`, async () => {
                await app.ui.naviBar.click('links', 'Query');
                await app.ui.waitLoading();

                await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
                await app.ui.waitLoading();
                const expectedValue = data.locked ? data.defaultConfigValue : data.userPrefValue;

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(expectedValue);
            });
            await app.step(`Verify Related Records modal`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.selectChildRecord('Related Records');
                await app.ui.waitLoading();

                await app.ui.dataEntryBoard.childRecord.addNew();
                await app.ui.waitLoading();
                await app.ui.addRelationshipsModal.kendoTreeview.open('Patent>PA All Cases');
                await app.ui.waitLoading();

                const expectedValue = data.locked ? data.defaultConfigValue : data.userPrefValue;

                await t
                    .expect(await app.ui.addRelationshipsModal.queryResultsGrid.getRecordsCount()).eql(expectedValue);
            });
            await app.step(`Verify Party Query`, async () => {
                await app.ui.addRelationshipsModal.close();
                await app.ui.navigate(`${globalConfig.env.url}/UI/party/queries`);
                await app.ui.waitLoading();

                await app.ui.queryBoard.kendoTreeview.open('Party>Party Query');
                await app.ui.waitLoading();
                const expectedValue = data.locked ? data.defaultConfigValue : data.userPrefValue;

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(expectedValue);
            });
            await app.step(`Verify Audit Queries`, async () => {
                await app.ui.navigate(`${globalConfig.env.url}/UI/administration/audit-log`);
                await app.ui.waitLoading();

                await app.ui.queryBoard.kendoTreeview.open('Audit Log>Patent Audit Query');
                await app.ui.waitLoading();
                const expectedValue = data.locked ? data.defaultConfigValue : data.userPrefValue;

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(expectedValue);
            });
            await app.step(`Verify Message Center queries`, async () => {
                await app.ui.navigate(`${globalConfig.env.url}/UI/message-center`);
                await app.ui.waitLoading();

                await app.ui.queryBoard.kendoTreeview.open('Message Center>Pending Rules Validation>Patents');
                await app.ui.waitLoading({checkErrors: false});
                if (!(await app.ui.queryBoard.noErrors())) {
                    await app.ui.refresh(true); // required due to IPDP-14327 error
                    await app.ui.waitLoading({checkErrors: true});
                }
                const expectedValue = data.locked ? data.defaultConfigValue : data.userPrefValue;

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(expectedValue);
            });
            await app.step(`Verify Collaboration Task Grid`, async () => {
                await app.ui.refresh();
                await app.ui.naviBar.click('links', 'Collaboration Portal');
                await app.ui.waitLoading();

                await app.ui.collaborationBoard.getProcess('Action Process for TA (Patent)').getTask('RM').open();
                await app.ui.waitLoading();

                const expectedValue = data.locked ? data.defaultConfigValue : data.userPrefValue;

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(expectedValue);
            });
            await app.step(`Verify Job Center`, async () => {
                await app.ui.navigate(`${globalConfig.env.url}/UI/job-center`);
                await app.ui.waitLoading();

                const expectedValue = data.locked ? data.defaultConfigValue : data.userPrefValue;

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).eql(expectedValue);
            });
        });
});

[
    { userPref: 'Query', defSysConfig: 'Collaboration Portal', locked: false, licenseWithCollaboration: true, queryPermissions: true, expectedUserPref: 'Query' },
    { userPref: 'Query', defSysConfig: 'Collaboration Portal', locked: true, licenseWithCollaboration: true, queryPermissions: true, expectedUserPref: 'Collaboration Portal' },
    { userPref: 'Collaboration Portal', defSysConfig: 'Query', locked: false, licenseWithCollaboration: true, queryPermissions: true, expectedUserPref: 'Collaboration Portal' },
    { userPref: 'Collaboration Portal', defSysConfig: 'Query', locked: true, licenseWithCollaboration: true, queryPermissions: true, expectedUserPref: 'Query' },
    { userPref: 'Query', defSysConfig: 'Collaboration Portal', locked: false, licenseWithCollaboration: false, queryPermissions: true, expectedUserPref: 'Query' },
    { userPref: 'Query', defSysConfig: 'Collaboration Portal', locked: true, licenseWithCollaboration: false, queryPermissions: true, expectedUserPref: 'Query' },
    { userPref: 'Collaboration Portal', defSysConfig: 'Query', locked: false, licenseWithCollaboration: false, queryPermissions: true, expectedUserPref: '' },
    { userPref: 'Collaboration Portal', defSysConfig: 'Query', locked: true, licenseWithCollaboration: false, queryPermissions: true, expectedUserPref: 'Query' },
    { userPref: 'Query', defSysConfig: 'Query', locked: false, licenseWithCollaboration: true, queryPermissions: false, expectedUserPref: '' },
    { userPref: 'Collaboration Portal', defSysConfig: 'Query', locked: false, licenseWithCollaboration: true, queryPermissions: false, expectedUserPref: 'Collaboration Portal' },
    { userPref: 'Query', defSysConfig: 'Query', locked: true, licenseWithCollaboration: true, queryPermissions: false, expectedUserPref: '' }
].forEach((data) => {
    test
        // .only
        .meta('brief', 'true')
        (`Verify Default Portal (Step 17-18): User Pref: ${data.userPref}, Default Sys Config: ${data.defSysConfig}, ${data.locked ? '' : 'not'} locked, ${data.licenseWithCollaboration ? 'with' : 'without'} Collaboration, ${data.queryPermissions ? 'with' : 'no'} Query permissions`, async (t: TestController) => {
            let currentUrl: string;
            await app.step(`Set '${data.userPref}' to Default Portal in User Prefernces (API)`, async () => {
                await app.api.userPreferences.setDefaultPortal(data.userPref);
            });
            await app.step(`Set '${data.defSysConfig}' to Default Portal in Default System Configuration (API)`, async () => {
                const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                await userPref.setPortalDefault(data.defSysConfig);
                userPref.setPortalDefaultLocked(data.locked);
                await userPref.save();
            });
            await app.step(`Add license ${data.licenseWithCollaboration ? 'with' : 'without'} collaboration in Default System Configuration (API)`, async () => {
                const license = data.licenseWithCollaboration ? 'AllPermissions.LIC' : 'WithoutCollaboration.LIC';
                const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + license;
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.addLicenseFile(path);
            });
            await app.step(`Set Query permissions in Content Group (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(userContentGroup);
                cg.setPermission('Query', data.queryPermissions);
                await cg.save();
            });
            await app.step(`Login and open User Preferences`, async () => {
                await app.ui.getRole(undefined, 'UI/user-preferences');
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').getValue()).eql(data.expectedUserPref)
                    .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').isEnabled('dropdownList')).eql(!data.locked);
            });
            await app.step(`Verify Default Portal list`, async () => {
                await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').expand();
                const expectedList = data.licenseWithCollaboration && data.queryPermissions ? ['Collaboration Portal', 'Query'] :
                    data.licenseWithCollaboration ? ['Collaboration Portal'] :
                        data.queryPermissions ? ['Query'] : [''];

                await t
                    .expect(await app.ui.kendoPopup.getAllItemsText()).eql(expectedList);
            }, { isSkipped: data.locked });
            await app.step(`Navigate to login screen`, async () => {
                await app.ui.navigate(`${globalConfig.env.url}/UI`);
                await app.ui.waitLoading();
                const expectedPage = data.expectedUserPref === '' ? data.userPref : data.expectedUserPref;
                const expectedUrl = expectedPage === 'Query' ? 'queries' : 'collaboration';
                currentUrl = (await app.ui.getCurrentUrl()).split('/').pop();

                await t
                    .expect(currentUrl).eql(expectedUrl);
            });
            await app.step(`Verify Query page`, async () => {
                if (data.queryPermissions) {
                    await t
                        .expect(await app.ui.queryBoard.kendoTreeview.isVisible()).ok();
                } else {
                    await t
                        .expect(await app.ui.queryBoard.isVisible('queriesNotFoundText')).ok()
                        .expect(await app.ui.queryBoard.kendoTreeview.isPresent()).notOk();
                }
            }, { isSkipped: currentUrl !== 'queries' });
            await app.step(`Verify Collaboration Portal page`, async () => {
                if (data.licenseWithCollaboration) {
                    await t
                        .expect(await app.ui.collaborationBoard.isPresent('errorHeader')).notOk()
                        .expect(await app.ui.collaborationBoard.isPresent('errorBody')).notOk();
                } else {
                    await t
                        .expect(await app.ui.collaborationBoard.isVisible('errorHeader')).ok()
                        .expect(await app.ui.collaborationBoard.getText('errorHeader', 0, { isTextExact: true })).eql('Sorry, you don\'t have access to view this content.')
                        .expect(await app.ui.collaborationBoard.isVisible('errorBody')).ok()
                        .expect(await app.ui.collaborationBoard.getText('errorBody', 0, { isTextExact: true }))
                        .eql('Your license does not have the privileges to access this content, please contact your administrator for futher information.');
                }
            }, { isSkipped: currentUrl !== 'collaboration' });
        })
        .after(async () => {
            await app.step(`Add license with collaboration in Default System Configuration (API)`, async () => {
                const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.addLicenseFile(path);
            });
            await app.step(`Add Query permission to current user (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(userContentGroup);
                cg.setPermission('Query', true);
                await cg.save();
            });
            await app.step(`Unlock Default Portal field in Default System Configuration (API)`, async () => {
                const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                userPref.setPortalDefaultLocked(false);
                await userPref.save();
            });
        });
});

test
    // .only
    .meta('brief', 'true')
    (`Verify Default Portal dropdown for private query (Step 18)`, async (t: TestController) => {
        await app.step(`Set 'Query' to Default Portal in User Prefernces (API)`, async () => {
            await app.api.userPreferences.setDefaultPortal('Query');
        });
        await app.step(`Set Query permissions in Content Group (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', false);
            cg.setPermission('Query>TA Private Query', true);
            await cg.save();
        });
        await app.step(`Add license with collaboration in Default System Configuration (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
        await app.step(`Login and open User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').getValue()).eql('Query')
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').isEnabled('dropdownList')).ok();
        });
        await app.step(`Verify Default Portal list`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').expand();
            const expectedList = ['Collaboration Portal', 'Query'];

            await t
                .expect(await app.ui.kendoPopup.getAllItemsText()).eql(expectedList);
        });
        await app.step(`Navigate to login screen`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI`);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.naviBar.getText('activeLink', 0, { isTextExact: true })).eql('Query')
                .expect(await app.ui.queryBoard.kendoTreeview.isVisible()).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.getSelectableItemsNumber()).eql(1);
        });
    })
    .after(async () => {
        await app.step(`Add Query permission to current user (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', true);
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Default Portal dropdown without Collaboration and Query permissions (Step 18)`, async (t: TestController) => {
        await app.step(`Add license without collaboration in Default System Configuration (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'WithoutCollaboration.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
        await app.step(`Set Query permissions in Content Group (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Login and open User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Portal', 'dropdown').isPresent()).notOk();
        });
        await app.step(`Navigate to login screen and verify`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI`);
            await app.ui.waitLoading();
            const urlPage = (await app.ui.getCurrentUrl()).split('/').pop();

            await t
                .expect(urlPage).eql('queries')
                .expect(await app.ui.queryBoard.isVisible('queriesNotFoundText')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.isPresent()).notOk();
        });
    })
    .after(async () => {
        await app.step(`Add license with collaboration in Default System Configuration (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
        await app.step(`Add Query permission to current user (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Query', true);
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Delete Display Option values in User Parameters table (Database)', async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'CODE_DISPLAY'`, { closeConnection: false });
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'COUNTRY_DISPLAY'`, { closeConnection: false });
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'PARTY_DISPLAY'`, { closeConnection: true });
            await app.api.clearCache();
        });
    })
    (`Verify Display Options section (Step 19)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'Display Options')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionLinks', 'Display Options')).ok();
        });
        await app.step(`Click the Display Options link`, async () => {
            await app.ui.userPreferencesBoard.click('sectionLinks', 'Display Options');

            await app.services.time.wait(async () => !(await app.ui.userPreferencesBoard.isInView('sectionTitles', 'General')), { timeout: 1000 });

            await t
                .expect(await app.ui.userPreferencesBoard.isInView('sectionTitles', 'General')).notOk()
                .expect(await app.ui.userPreferencesBoard.isInView('sectionTitles', 'Display Options')).ok();
        });
        await app.step(`Verify fields in Display Options Section`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Country / Region Display', 'radiobutton').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Party Display', 'radiobutton').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Code Display', 'radiobutton').isVisible()).ok();
        });
        await app.step(`Verify default value for Country / Region Display`, async () => {
            const generalAPI = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            const expectedValue = generalAPI.getDisplayOption('Country / Region Display');

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Country / Region Display', 'radiobutton').getPossibleValues()).eql(['Codes', 'Description', 'WIPO Codes'])
                .expect(await app.ui.userPreferencesBoard.getField('Country / Region Display', 'radiobutton').isSelected(expectedValue)).ok();
        });
        await app.step(`Verify default value for Party Display`, async () => {
            const generalAPI = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            const expectedValue = generalAPI.getDisplayOption('Party Display');

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Party Display', 'radiobutton').getPossibleValues()).eql(['Codes', 'Description'])
                .expect(await app.ui.userPreferencesBoard.getField('Party Display', 'radiobutton').isSelected(expectedValue)).ok();
        });
        await app.step(`Verify default value for Code Display`, async () => {
            const generalAPI = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            const expectedValue = generalAPI.getDisplayOption('Codes Display');

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Code Display', 'radiobutton').getPossibleValues()).eql(['Codes', 'Description'])
                .expect(await app.ui.userPreferencesBoard.getField('Code Display', 'radiobutton').isSelected(expectedValue)).ok();
        });
    });
