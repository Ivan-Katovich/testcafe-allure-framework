import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.userPreferences.pack. - Test ID 29982: User Preferences - apply Default Portal`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify 'Query' as default portal with or without permissions (Step 2-5)`, async (t: TestController) => {
        let allQueries: string[];
        await app.step(`Set Default Portal to 'Query'`, async () => {
            await app.api.userPreferences.setDefaultPortal('Query');
        });
        await app.step(`Login and verify default page`, async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.navigate(`${globalConfig.env.url}/UI`);
            await app.ui.waitLoading();
            const currentPage = (await app.ui.getCurrentUrl()).split('/').pop();

            await t
                .expect(currentPage).eql('queries')
                .expect(await app.ui.naviBar.getText('activeLink')).eql('Query');
        });
        await app.step(`Remove Query permissions in content group (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(globalConfig.user.contentGroup);
            cg.setPermission('Query', false);
            await cg.save();
        });
        await app.step(`Login and verify default page`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI`);
            await app.ui.waitLoading();
            const currentPage = (await app.ui.getCurrentUrl()).split('/').pop();

            await t
                .expect(currentPage).eql('queries')
                .expect(await app.ui.queryBoard.isVisible('createNewQueryButton')).ok()
                .expect(await app.ui.queryBoard.getText('queriesNotFoundText')).eql('0 items found')
                .expect(await app.ui.queryBoard.getText('emptyPlaceholder')).eql('Please select a query to view the results.')
                .expect(await app.ui.naviBar.isPresent('links', 'Query')).notOk();
        });
        await app.step(`Add Query permissions in content group (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(globalConfig.user.contentGroup);
            cg.setPermission('Query', true);
            allQueries = cg.getPermissionNodeChildrenNames('Query');
            const partyQueries = await cg.getPermissionsChildrenNamesForIpType('Query', 'Parties');
            allQueries = app.services.array.removeDuplicates(app.services.array.getDifference(allQueries, partyQueries));
            await cg.save();
        });
        await app.step(`Navigate to default page and verify`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI`);
            await app.ui.waitLoading();
            const currentPage = (await app.ui.getCurrentUrl()).split('/').pop();
            await app.ui.queryBoard.kendoTreeview.expandAll();
            const queryList = app.services.array.removeDuplicates(await app.ui.queryBoard.kendoTreeview.getSelectableItemsNames());

            await t
                .expect(currentPage).eql('queries')
                .expect(await app.ui.naviBar.isVisible('links', 'Query')).ok()
                .expect(app.services.array.areEquivalent(queryList, allQueries)).ok();
        });
    })
    .after(async () => {
        await app.step(`Set permissions in content group to default (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(globalConfig.user.contentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify 'Collaboration Portal' as default portal with or without permissions (Step 6, 8)`, async (t: TestController) => {
        await app.step(`Set Default Portal to 'Collaboration Portal' (Step 6)`, async () => {
            await app.api.userPreferences.setDefaultPortal('Collaboration Portal');
        });
        await app.step(`Login and verify default page`, async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.navigate(`${globalConfig.env.url}/UI`);
            await app.ui.waitLoading();
            const currentPage = (await app.ui.getCurrentUrl()).split('/').pop();

            await t
                .expect(currentPage).eql('collaboration')
                .expect(await app.ui.collaborationBoard.isVisible()).ok()
                .expect((await app.ui.collaborationBoard.getProcessArray()).length).gt(0);
        });
        await app.step(`Add license without Collaboration Portal (API)(Step 8)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'WithoutCollaboration.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
        await app.step(`Go to default page`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI`);
            await app.ui.waitLoading();
            const currentPage = (await app.ui.getCurrentUrl()).split('/').pop();

            await t
                .expect(currentPage).eql('collaboration')
                .expect(await app.ui.collaborationBoard.isVisible()).ok()
                .expect(await app.ui.naviBar.isPresent('links', 'Collaboration Portal')).notOk()
                .expect(await app.ui.collaborationBoard.getText('errorHeader', 0, { isTextExact: true })).eql('Sorry, you don\'t have access to view this content.')
                .expect(await app.ui.collaborationBoard.getText('errorBody', 0, { isTextExact: true }))
                .eql('Your license does not have the privileges to access this content, please contact your administrator for further information.');
        });
    })
    .after(async () => {
        await app.step(`Add license with all permissions (API)`, async () => {
            const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
            const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
            await general.addLicenseFile(path);
        });
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

[
    { userPref: 'Query', defSystConfig: 'Collaboration Portal' },
    { userPref: 'Collaboration Portal', defSystConfig: 'Query' }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', 'true')
        (`Verify Default Portal when field is locked in Default System Configuration (Step 9): userPref: '${data.userPref}', defSysConf: '${data.defSystConfig}'`, async (t: TestController) => {
            await app.step(`Set Default Portal to '${data.userPref}'`, async () => {
                await app.api.userPreferences.setDefaultPortal(data.userPref);
            });
            await app.step(`Set Portal Default to '${data.defSystConfig}' in Display System Configuration and lock (API)`, async () => {
                const defUP = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                await defUP.setPortalDefault(data.defSystConfig);
                defUP.setPortalDefaultLocked(true);
                await defUP.save();
            });
            await app.step(`Login and verify default page`, async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
                await app.ui.navigate(`${globalConfig.env.url}/UI`);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.naviBar.getText('activeLink')).eql(data.defSystConfig);
            });
        })
        .after(async () => {
            await app.step(`Unlock Portal Default in Default Configuration (API)`, async () => {
                const defUP = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                defUP.setPortalDefaultLocked(false);
                await defUP.save();
            });
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });
    });

[
    { url: 'queries', pageName: 'Query' },
    { url: 'reports', pageName: 'Reports' }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step(`Set Default Portal to 'Collaboration Portal'`, async () => {
                await app.api.userPreferences.setDefaultPortal('Collaboration Portal');
            });
            await app.step(`Reset role for ${data.pageName}`, async () => {
                app.ui.resetRole(undefined, `UI/${data.url}`);
            });
        })
        (`Verify direct link to ${data.pageName} (Step 10)`, async (t: TestController) => {
            await app.step(`Login via direct link to ${data.pageName}`, async () => {
                await app.ui.getRole(undefined, `UI/${data.url}`);
                await app.ui.waitLoading();
                const currentUrl = (await app.ui.getCurrentUrl()).split('/').pop();

                await t
                    .expect(currentUrl).eql(data.url)
                    .expect(await app.ui.naviBar.getText('activeLink')).eql(data.pageName);
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset roles`, async () => {
                app.ui.resetRole(undefined, `UI/${data.url}`);
            });
        });
    });
