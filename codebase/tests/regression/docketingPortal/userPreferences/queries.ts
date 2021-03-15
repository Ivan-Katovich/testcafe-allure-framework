import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.userPreferences.pack. - Test ID 30711: User Preferences - Hosted - Record Management - Queries`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const additionalCG1 = 'Test Automation CG Regression 2';
const additionalCG2 = 'Test Automation CG Regression 3';

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Delete DEFAULT_QUERY from UserParameters for current user (Database)`, async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE UserName = '${globalConfig.user.userName}' AND ParameterType = 'DEFAULT_QUERY'`);
            await app.api.clearCache();
        });
    })
    (`Verify Default Query field (Step 3)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').getValue()).eql('');
        });

        await app.step(`Verify dropdown list`, async () => {
            await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
            const allQueries = app.api.administration.contentGroup.getPermissionNodeChildrenNames('Query');
            const partyQueries = await app.api.administration.contentGroup.getPermissionsChildrenNamesForIpType('Query', 'Parties');
            const expectedValues = app.services.array.getDifference(allQueries, partyQueries).map((x) => x.trim());
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').expand();
            const actualValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(app.services.array.areEquivalent(expectedValues, actualValues)).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Search functionality in the Default Query field (Step 4)`, async (t: TestController) => {
        let possiblevalues: string[];
        let longestValue: string;
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Set value in Default Query`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').expand();
            possiblevalues = await app.ui.kendoPopup.getAllItemsText();
            await app.ui.kendoPopup.selectTop();
        });
        await app.step(`Clear the text via [x] icon`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').clear();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').getValue()).eql('');
        });
        await app.step(`Search by beginning symbols`, async () => {
            longestValue = app.services.sorting.sortByLength(possiblevalues, app.services.sorting.sortDirection.desc)[0];
            const beginning = longestValue.slice(0, longestValue.length / 2);
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').typeText(beginning);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues).contains(longestValue);
        });
        await app.step(`Search by ending symbols`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').clear();
            const ending = longestValue.slice(longestValue.length / 2, longestValue.length - 1);
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').typeText(ending);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues).contains(longestValue);
        });
        await app.step(`Search by term in upper case`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').clear();
            const valueWithLetters = possiblevalues.find((x) => app.services.regex.containsLetters(x));
            const upperCase = valueWithLetters.toUpperCase();
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').typeText(upperCase);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues).contains(valueWithLetters);
        });
        await app.step(`Search by term in lower case`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').clear();
            const valueWithLetters = possiblevalues.find((x) => app.services.regex.containsLetters(x));
            const lowerCase = valueWithLetters.toLowerCase();
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').typeText(lowerCase);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues).contains(valueWithLetters);
        });
        await app.step(`Search by symbols from the middle of the name`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').clear();
            const middle = longestValue.slice(longestValue.length * 0.25, longestValue.length * 0.75);
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').typeText(middle);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues).contains(longestValue);
        });
        await app.step(`Search by numbers`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').clear();
            const valueWithNumbers = possiblevalues.find((x) => app.services.regex.containsNumbers(x));
            const numbers = app.services.regex.getFirstNumber(valueWithNumbers);
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').typeText(numbers);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues).contains(valueWithNumbers);
        });
        await app.step(`Search by special symbols`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').clear();
            const valueWithSpecialSymbols = String.raw`[~!@#$%^&*()_+=\-}{[\]|;\'?<,.’/"]`;
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').typeText(valueWithSpecialSymbols);
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues).contains(valueWithSpecialSymbols);
        });
        await app.step(`Type non-existing value`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').clear();
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').typeText(app.services.random.str(20));
            const foundValues = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundValues.length).eql(0)
                .expect(await app.ui.kendoPopup.isVisible('noDataInfo')).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Add content group '${additionalCG1}' to current user and activate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalCG1);
            await cg.addUser(globalConfig.user.userName);
            cg.setActive(true);
            await cg.save();
        });
        await app.step(`Add content group ${additionalCG2} to current user and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalCG2);
            await cg.addUser(globalConfig.user.userName);
            cg.setActive(false);
            await cg.save();
        });
    })

    (`Verify permissions for Default Query (Step 5)`, async (t: TestController) => {
        let queryName: string;
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Set Default Query and save`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').expand();
            await app.ui.kendoPopup.selectTop();
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();
            queryName = await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').getValue();
        });
        await app.step(`Remove permissions for ${queryName} query in '${globalConfig.user.contentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(globalConfig.user.contentGroup);
            cg.setPermission('Query>' + queryName, false);
            await cg.save();
        });
        await app.step(`Remove permissions for ${queryName} query in '${additionalCG1}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalCG1);
            cg.setPermission('Query>' + queryName, false);
            await cg.save();
        });
        await app.step(`Add permissions for ${queryName} query in '${additionalCG2}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalCG2);
            cg.setPermission('Query>' + queryName, true);
            await cg.save();
        });
        await app.step(`Refresh User Preferences and verify Default Query`, async () => {
            await app.ui.refresh();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').getValue()).eql('');
        });
        await app.step(`Verify dropdown list in Default Query`, async () => {
            await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').expand();

            await t
                .expect(await app.ui.kendoPopup.getAllItemsText()).notContains(queryName);
        });
    })
    .after(async () => {
        await app.step(`Set default permissions for '${globalConfig.user.contentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(globalConfig.user.contentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Remove content group '${additionalCG1}' from current user and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalCG1);
            await cg.removeUser(globalConfig.user.userName);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step(`Remove content group ${additionalCG2} from current user and deactivate (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(additionalCG2);
            await cg.removeUser(globalConfig.user.userName);
            cg.setActive(false);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Delete AutoExecuteQuery from UserParameters for current user (Database)`, async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE UserName = '${globalConfig.user.userName}' AND Code = 'AutoExecuteQuery'`);
            await app.api.clearCache();
        });
    })
    (`Verify Auto-Execute Queries field (Step 6-7)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Auto-Execute Queries', 'toggle').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Auto-Execute Queries', 'toggle').isOn()).ok();
        });
        await app.step(`Switch OFF Auto-Execute Queries and save`, async () => {
            await app.ui.userPreferencesBoard.getField('Auto-Execute Queries', 'toggle').off();
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Auto-Execute Queries', 'toggle').isOn()).notOk();
        });
        await app.step(`Switch ON Auto-Execute Queries and save`, async () => {
            await app.ui.userPreferencesBoard.getField('Auto-Execute Queries', 'toggle').on();
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Auto-Execute Queries', 'toggle').isOn()).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Delete DEFAULT_QUERY_PER_NODE from UserParameters for current user (Database)`, async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE UserName = '${globalConfig.user.userName}' AND ParameterType = 'DEFAULT_QUERY_PER_NODE'`);
            await app.api.clearCache();
        });
    })
    (`Verify Favorite Queries field (Step 8)`, async (t: TestController) => {
        let favoriteQueriesPathArray: string[];
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            await app.ui.userPreferencesBoard.nodeTreeview.expandAll();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Favorite Queries').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.isVisible()).ok()
                .expect((await app.ui.userPreferencesBoard.nodeTreeview.getAllSelectedItemsNames()).length).eql(0);
        });
        await app.step(`Verify node tree checkbox`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.eachItemHasCheckbox()).ok();
        });

        await app.step(`Verify Favorite Queries tree displays queries as in Query > Query List`, async () => {
            const expectedTreePathArray = await app.api.query.getAllQueriesWithPath();
            favoriteQueriesPathArray = await app.ui.userPreferencesBoard.nodeTreeview.getAllElementsPaths();

            await t
                .expect(app.services.array.areEquivalent(expectedTreePathArray, favoriteQueriesPathArray)).ok();
        });
        await app.step(`Verify queries in groups are sorted alphanumerically`, async () => {
            const groupQueries = favoriteQueriesPathArray.map((x) => {
                const array = x.split('>');
                return {
                    query: array.pop(),
                    group: array.join('>')
                };
            });
            const groups = app.services.array.groupBy(groupQueries, 'group');

            for (const group in groups) {
                const queries = groups[group].map((x) => x.query);

                await t
                    .expect(app.services.array.isSortedAlphabetically(queries)).ok(`Queries in the ${group} are not sorted alphanumerically`);
            }
        });
        await app.step(`Verify Favorite Queries tree displays queries from user's content group`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(globalConfig.user.contentGroup);
            const queryWithPermissions = (await cg.getPermissionsAndResources())
                .ListOfResources.find((x) => x.DisplayText === 'Query')
                .ResourceListItems.filter((x) => x.Selected).map((x) => x.DisplayText);
            const partyQueries = await cg.getPermissionsChildrenNamesForIpType('Query', 'Parties');
            const expectedQueryNames = app.services.array.removeDuplicates(app.services.array.getDifference(queryWithPermissions, partyQueries));
            const uiQueryNames = app.services.array.removeDuplicates(favoriteQueriesPathArray.map((x) => x.split('>').pop()));

            await t
                .expect(app.services.array.areEquivalent(expectedQueryNames, uiQueryNames)).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Favorite Queries correspond hierarchy in Query Groups (Step 9)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Change parent value for Query Group (API)`, async () => {
            const qg = app.api.administration.groupQuery;
            await qg.open('Portfolio Analysis');
            qg.setLocation('Query>Admin');
            await qg.save();
        });
        await app.step(`Verify Favorite Queries`, async () => {
            await app.ui.refresh();
            await app.ui.userPreferencesBoard.nodeTreeview.expand('Admin');
            await t
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemPresent('Admin>Portfolio Analysis')).ok();
        });
    })
    .after(async () => {
        await app.step(`Change parent back in Query Groups (API)`, async () => {
            const qg = app.api.administration.groupQuery;
            await qg.open('Portfolio Analysis');
            qg.setLocation('Query');
            await qg.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify queries in Favorite Queries has query groups from Query Management (Step 10)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Change a group for a query (API)`, async () => {
            await app.api.queryManagement.openQueryManagement('Patent>TA PA test');
            await app.api.queryManagement.addQueryGroup('Admin');
            await app.api.queryManagement.save();
        });
        await app.step(`Verify Favorite Queries`, async () => {
            await app.ui.refresh();
            await app.ui.userPreferencesBoard.nodeTreeview.expand('Admin');
            await t
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemPresent('Admin>TA PA test')).ok();
        });
    })
    .after(async () => {
        await app.step(`Reset query group changes (API)`, async () => {
            await app.api.queryManagement.openQueryManagement('Patent>TA PA test');
            await app.api.queryManagement.removeQueryGroup('Admin');
            await app.api.queryManagement.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify selection in Favorite Queries (Steps 11-12)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Select query by clicking checkbox`, async () => {
            await app.ui.userPreferencesBoard.nodeTreeview.clickCheckbox('Patent>PA All Cases');

            await t
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemChecked('Patent>PA All Cases')).ok();
        });
        await app.step(`Select query by clicking its name`, async () => {
            await app.ui.userPreferencesBoard.nodeTreeview.clickCheckboxLabel('Patent>PA All Actions');

            await t
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemChecked('Patent>PA All Actions')).ok();
        });
        await app.step(`Select group by clicking checkbox`, async () => {
            await app.ui.userPreferencesBoard.nodeTreeview.clickCheckbox('Disclosure');

            await t
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemChecked('Disclosure')).ok();
        });
        await app.step(`Select group by clicking its name`, async () => {
            await app.ui.userPreferencesBoard.nodeTreeview.clickCheckboxLabel('GeneralIP1');

            await t
                .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemChecked('GeneralIP1')).ok();
        });
    });

[
    {
        ipType: 'Patent',
        query1: 'TA PA All Actions',
        query2: 'TA PA All Cases',
        query3: 'TA PA test',
        brief: true
    },
    {
        ipType: 'Trademark',
        query1: 'TA TM All Actions',
        query2: 'TA TM All Cases',
        query3: 'TM All Cases',
        brief: false
    },
    {
        ipType: 'Disclosure',
        query1: 'TA DS All Actions',
        query2: 'TA DS All Cases',
        query3: 'PA All Cases',
        brief: false
    },
    {
        ipType: 'GeneralIP1',
        query1: 'TA GIP1 All Actions',
        query2: 'TA GIP1 All Cases',
        query3: 'PA All Cases',
        brief: false
    }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', data.brief.toString())
        .before(async () => {
            await app.step(`Add permissions for query '${data.query1}' in content group '${globalConfig.user.contentGroup}'`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                cg.setPermission('Query', false);
                cg.setPermission('Query>' + data.query1, true);
                await cg.save();
            });
            await app.step(`Add permissions for query '${data.query2}' in content group '${additionalCG1}`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(additionalCG1);
                await cg.addUser(globalConfig.user.userName);
                cg.setActive(true);
                cg.setPermission('Query', false);
                cg.setPermission('Query>' + data.query2, true);
                await cg.save();
            });
            await app.step(`Add permissions for query '${data.query3}' in content group '${additionalCG2}'`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(additionalCG2);
                await cg.addUser(globalConfig.user.userName);
                cg.setActive(false);
                cg.setPermission('Query', false);
                cg.setPermission('Query>' + data.query3, true);
                await cg.save();
            });
        })
        (`Verify Default Query and Favorite Queries fields have queries only from user's active content groups (Step 13, 17): ${data.ipType}`, async (t: TestController) => {
            await app.step(`Login and go to User Preferences`, async () => {
                await app.ui.getRole(undefined, 'UI/user-preferences');
                await app.ui.waitLoading();
            });
            await app.step(`Verify Default Query`, async () => {
                const field = app.ui.userPreferencesBoard.getField('Default Query', 'dropdown');
                await field.expand();
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(app.services.array.areEquivalent(dropdownList, [data.query1, data.query2])).ok();
            });
            await app.step(`Verify Favorite Queries`, async () => {
                await app.ui.userPreferencesBoard.nodeTreeview.expand(data.ipType);

                await t
                    .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemVisible(data.ipType + '>' + data.query1)).ok()
                    .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemVisible(data.ipType + '>' + data.query2)).ok()
                    .expect(await app.ui.userPreferencesBoard.nodeTreeview.isItemVisible(data.ipType + '>' + data.query3)).notOk();
            });
        })
        .after(async () => {
            await app.step(`Set default permissions in '${globalConfig.user.contentGroup}'`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                cg.setPermissionDefaults();
                await cg.save();
            });
            await app.step(`Set default permissions in '${additionalCG1}', remove current user and deactivate (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(additionalCG1);
                await cg.removeUser(globalConfig.user.userName);
                cg.setPermissionDefaults();
                cg.setActive(false);
                await cg.save();
            });
            await app.step(`Set default permissions in '${additionalCG2}', remove current user and deactivate (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(additionalCG2);
                await cg.removeUser(globalConfig.user.userName);
                cg.setPermissionDefaults();
                cg.setActive(false);
                await cg.save();
            });
        });
});

[
    {
        privateQuery: 'Private_' + app.services.time.timestampShort(),
        publicQuery: 'TA PA All Cases',
        ipType: 'patent',
        brief: 'true'
    }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Create private query '${data.privateQuery}' (API)`, async () => {
                await app.api.query.createPreconditionQuery(data.ipType, data.privateQuery);
            });
            await app.step(`Remove all permissions for query except party queries in content group '${globalConfig.user.contentGroup}'`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                cg.setPermission('Query', false);
                await cg.setPermissionForIpType('Query', 'Parties', true);
                await cg.save();
            });
            await app.step(`Remove all permissions for query except '${data.publicQuery}' in content group '${additionalCG1}'`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(additionalCG1);
                await cg.addUser(globalConfig.user.userName);
                cg.setActive(false);
                cg.setPermission('Query', false);
                cg.setPermission('Query>' + data.publicQuery, true);
                await cg.save();
            });
        })
        (`Verify user's private query retains displayed in Default Query and Favorite Queries fields when user has no permissions to queries in CG (Step 14)`, async (t: TestController) => {
            await app.step(`Login and go to User Preferences`, async () => {
                await app.ui.getRole(undefined, 'UI/user-preferences');
                await app.ui.waitLoading();
            });
            await app.step(`Verify Default Query`, async () => {
                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').isVisible()).ok();
            });
            await app.step(`Verify the Default Query dropdown`, async () => {
                await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').expand();
                const list = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(list).eql([ data.privateQuery ]);
            });
            await app.step(`Verify Favorite Queries`, async () => {
                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Favorite Queries', 'dropdown').isVisible()).ok()
                    .expect(await app.ui.userPreferencesBoard.nodeTreeview.isVisible()).ok();
            });
            await app.step(`Verify Favorite Queries tree`, async () => {
                const list = await app.ui.userPreferencesBoard.nodeTreeview.getAllElementsPaths();

                await t
                    .expect(list).eql([ data.privateQuery ]);
            });
        })
        .after(async () => {
            await app.step(`Set default permissions in '${globalConfig.user.contentGroup}'`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(globalConfig.user.contentGroup);
                cg.setPermissionDefaults();
                await cg.save();
            });
            await app.step(`Set default permissions in '${additionalCG1}', remove current user and deactivate (API)`, async () => {
                const cg = app.api.administration.contentGroup;
                await cg.openContentGroup(additionalCG1);
                await cg.removeUser(globalConfig.user.userName);
                cg.setPermissionDefaults();
                cg.setActive(false);
                await cg.save();
            });
            await app.step(`Delete private query '${data.privateQuery}' (API)`, async () => {
                await app.api.queryManagement.openQueryManagement(data.privateQuery);
                await app.api.queryManagement.deleteQuery();
            });
        });
    });

[{
    privateQuery: 'Private_' + app.services.time.timestampShort(),
    publicQuery: 'TA PA All Cases',
    ipType: 'Patent',
    brief: 'true'
}]
    .forEach(async (data) => {
        test
            // .only
            .meta('brief', data.brief)
            .before(async () => {
                await app.step(`Create private query '${data.privateQuery}' (API)`, async () => {
                    await app.api.query.createPreconditionQuery(data.ipType, data.privateQuery);
                });
                await app.step(`Remove all permissions for query except party queries in content group '${globalConfig.user.contentGroup}'`, async () => {
                    const cg = app.api.administration.contentGroup;
                    await cg.openContentGroup(globalConfig.user.contentGroup);
                    cg.setPermission('Query', false);
                    await cg.setPermissionForIpType('Query', 'Parties', true);
                    await cg.save();
                });
                await app.step(`Remove all permissions for query except '${data.publicQuery}' in content group '${additionalCG1}'`, async () => {
                    const cg = app.api.administration.contentGroup;
                    await cg.openContentGroup(additionalCG1, true);
                    await cg.addUser(globalConfig.user.userName);
                    cg.setActive(false);
                    cg.setPermission('Query', false);
                    cg.setPermission('Query>' + data.privateQuery, true);
                    cg.setPermission('Query>' + data.publicQuery, true);
                    await cg.save();
                });
                await app.step(`Assign private query '${data.privateQuery}' to content group '${additionalCG2}' and unassign current user from the group`, async () => {
                    const cg = app.api.administration.contentGroup;
                    await cg.openContentGroup(additionalCG2, true);
                    await cg.removeUser(globalConfig.user.userName);
                    cg.setActive(true);
                    cg.setPermission('Query>' + data.privateQuery, true);
                    await cg.save();
                });
            })
            (`Verify Default Query and Favorite Queries fields are hidden from the screen when user doesn't have permissions to any query and has no private queries (Step 15): ${data.ipType}`, async (t: TestController) => {
                await app.step(`Login and go to User Preferences`, async () => {
                    await app.ui.getRole(undefined, 'UI/user-preferences');
                    await app.ui.waitLoading();
                });
                await app.step(`Verify Default Query`, async () => {
                    await t
                        .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').isPresent()).notOk();
                });
                await app.step(`Verify Favorite Queries`, async () => {
                    await t
                        .expect(await app.ui.userPreferencesBoard.getField('Favorite Queries', 'dropdown').isPresent()).notOk()
                        .expect(await app.ui.userPreferencesBoard.nodeTreeview.isPresent()).notOk();
                });
            })
            .after(async () => {
                await app.step(`Set default permissions in '${globalConfig.user.contentGroup}'`, async () => {
                    const cg = app.api.administration.contentGroup;
                    await cg.openContentGroup(globalConfig.user.contentGroup);
                    cg.setPermissionDefaults();
                    await cg.save();
                });
                await app.step(`Set default permissions in '${additionalCG1}', remove current user and deactivate (API)`, async () => {
                    const cg = app.api.administration.contentGroup;
                    await cg.openContentGroup(additionalCG1);
                    await cg.removeUser(globalConfig.user.userName);
                    cg.setPermissionDefaults();
                    cg.setActive(false);
                    await cg.save();
                });
                await app.step(`Set default permissions in '${additionalCG2}' and deactivate (API)`, async () => {
                    const cg = app.api.administration.contentGroup;
                    await cg.openContentGroup(additionalCG2);
                    cg.setPermissionDefaults();
                    cg.setActive(false);
                    await cg.save();
                });
                await app.step(`Delete private query '${data.privateQuery}' (API)`, async () => {
                    await app.api.queryManagement.openQueryManagement(data.privateQuery);
                    await app.api.queryManagement.deleteQuery();
                });
            });
    });

[
    { ipType: 'Patent', fileName: 'WithoutPatents.LIC', brief: true },
    { ipType: 'Trademark', fileName: 'WithoutTM.LIC', brief: false },
    { ipType: 'Disclosure', fileName: 'WithoutDisclosure.LIC', brief: false },
    { ipType: 'GeneralIP1', fileName: 'WithoutGIP1.LIC', brief: false }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', data.brief.toString())
        (`Verify Default Query and Favorite Queries when license without '${data.ipType}' is applied (Step 16-17)`, async (t: TestController) => {
            let expectedQueries: string[];
            let expectedQueryPaths: string[];
            await app.step(`Get all IP Type queries (API)`, async () => {
                const allQueries = await app.api.query.getAllQueryNames();
                const allIpTypeQueries = await app.api.query.getAllQueryNamesForIPType(data.ipType + 'Masters');
                expectedQueries = app.services.array.removeFirstOccurance(allQueries, allIpTypeQueries);
            });
            await app.step(`Get all IP Type query paths (API)`, async () => {
                const allQueries = await app.api.query.getAllQueriesWithPath();
                const allIpTypeQueries = await app.api.query.getAllQueriesWithPathForIpType(data.ipType + 'Masters');
                expectedQueryPaths = app.services.array.getDifference(allQueries, allIpTypeQueries);
            });
            await app.step(`Add license without ${data.ipType} permissions (API)`, async () => {
                const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + data.fileName;
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.addLicenseFile(path);
            });
            await app.step(`Login and go to User Preferences`, async () => {
                await app.ui.getRole(undefined, 'UI/user-preferences');
                await app.ui.waitLoading();
            });
            await app.step(`Verify Default Query`, async () => {
                await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').expand();
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(app.services.array.areEquivalent(dropdownList, expectedQueries)).ok();
            });
            await app.step(`Verify Favorite Queries`, async () => {
                await app.ui.userPreferencesBoard.nodeTreeview.expandAll();
                const actualActualQueryPaths = await app.ui.userPreferencesBoard.nodeTreeview.getAllElementsPaths();

                await t
                    .expect(app.services.array.areEquivalent(expectedQueryPaths, actualActualQueryPaths)).ok();
            });
        })
        .after(async () => {
            await app.step(`Add license with all permissions (API)`, async () => {
                const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.addLicenseFile(path);
            });
        });
});
