import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.queryList&Results.pack. - Test ID 29988: Query - Query List - permissions`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step('Delete Precondition queries (API)', async () => {
            await app.api.query.getAllQueries();
            const queryIds = await app.api.query.getQueryIds([
                'Patent>TA PA own made query',
                'Trademark>TA TM own made query',
                'Disclosure>TA DS own made query',
                'GeneralIP1>TA GIP1 own made query',
                `TA private own made ${globalConfig.user.userType}`
            ]);
            await app.api.partyQuery.getAllQueries();
            const partyQueryIds = await app.api.partyQuery.getQueryIds([
                'Party>TA Party own made query',
                `Party>TA private party own made ${globalConfig.user.userType}`
            ]);
            for (let id of [...queryIds, ... partyQueryIds]) {
                await app.api.query.deleteQuery(id);
            }
        });
    })
    .after(async () => {
    });

interface Data {
    mainScreen: string;
    pristineIPTypeQueries: string[];
    customIPTypeQueries: string[];
    pristineNonIPTypeQueries: string[];
    crossModuleQueries: string[];
    joinPartyQueries: string[];
    withoutGroupQueries: string[];
    ownMadeIPTypeQueries: string[];
    privateOwnMadeQueries: string[];
    queryTypes: string[];
    skipStep: boolean;
    findQueries: () => Promise<any>;
    refresh: () => Promise<void>;
}

const getDataSet = function(set: string = 'full'): Data[] {
    const fullData = [
        {
            mainScreen: 'Query List',
            pristineIPTypeQueries: [
                'Patent>PA All Cases',
                'Trademark>TM All Cases',
                'Disclosure>DS All Cases',
                'GeneralIP1>GIP1 All Cases'
            ],
            customIPTypeQueries: [
                'Patent>PA All Cases TA filter',
                'Trademark>TM All Cases TA filter',
                'Disclosure>DS All Cases TA filter',
                'GeneralIP1>GIP1 All Cases TA filter'
            ],
            pristineNonIPTypeQueries: [
                'Countries / Regions>All Countries / Regions',
                'Admin>All Codes_'
            ],
            crossModuleQueries: [
                'Patent>PA All Actions'
            ],
            joinPartyQueries: [
                'Patent>Parties Join With Patent'
            ],
            withoutGroupQueries: [
                'TA All Codes'
            ],
            ownMadeIPTypeQueries: [
                'Patent>TA PA own made query',
                'Trademark>TA TM own made query',
                'Disclosure>TA DS own made query',
                'GeneralIP1>TA GIP1 own made query'
            ],
            privateOwnMadeQueries: [
                `TA private own made ${globalConfig.user.userType}`
            ],
            queryTypes: [
                'patent',
                'trademark',
                'disclosure',
                'generalip'
            ],
            skipStep: false,
            async findQueries(): Promise<any> {
                await app.ui.queryBoard.openTree();
                return app.ui.queryBoard.kendoTreeview;
            },
            async refresh() {
                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
            }
        },
        {
            mainScreen: 'Related Records',
            pristineIPTypeQueries: [
                'Patent>PA All Cases',
                'Trademark>TM All Cases',
                'Disclosure>DS All Cases',
                'GeneralIP1>GIP1 All Cases'
            ],
            customIPTypeQueries: [
                'Patent>PA All Cases TA filter',
                'Trademark>TM All Cases TA filter',
                'Disclosure>DS All Cases TA filter',
                'GeneralIP1>GIP1 All Cases TA filter'
            ],
            pristineNonIPTypeQueries: [],
            crossModuleQueries: [],
            joinPartyQueries: [],
            withoutGroupQueries: [
                'TA All Patents'
            ],
            ownMadeIPTypeQueries: [
                'Patent>TA PA own made query',
                'Trademark>TA TM own made query',
                'Disclosure>TA DS own made query',
                'GeneralIP1>TA GIP1 own made query'
            ],
            privateOwnMadeQueries: [
                `TA private own made ${globalConfig.user.userType}`
            ],
            queryTypes: [
                'patent',
                'trademark',
                'disclosure',
                'generalip'
            ],
            skipStep: true,
            async findQueries() {
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.selectChildRecord('Related Records');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.childRecord.addNew();
                await app.ui.waitLoading({checkErrors: true});
                return app.ui.addRelationshipsModal.kendoTreeview;
            },
            async refresh() {
                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.selectChildRecord('Related Records');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.childRecord.addNew();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.addRelationshipsModal.openTree();
            }
        },
        {
            mainScreen: 'Party Queries',
            pristineIPTypeQueries: [
                'Party>Party Query'
            ],
            customIPTypeQueries: [
                'Party>Party Query TA filter'
            ],
            pristineNonIPTypeQueries: [],
            crossModuleQueries: [],
            joinPartyQueries: [],
            withoutGroupQueries: [],
            ownMadeIPTypeQueries: [
                'Party>TA Party own made query'
            ],
            privateOwnMadeQueries: [
                `Party>TA private party own made ${globalConfig.user.userType}`
            ],
            queryTypes: [
                'party'
            ],
            skipStep: false,
            async findQueries() {
                await app.ui.naviBar.click('links', 'Party');
                await app.ui.kendoPopup.selectItem('Party Query');
                await app.ui.waitLoading({checkErrors: true});
                return app.ui.queryBoard.kendoTreeview;
            },
            async refresh() {
                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
            }
        }
    ];
    let readyData: any[];
    if (globalConfig.brief) {
        readyData = [fullData[0]];
    } else if (set === 'particular' && fullData.length === 3) {
        readyData = [fullData[0], fullData[1]];
    } else {
        readyData = fullData;
    }
    return readyData;
};

getDataSet().forEach((data, index) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step('Create Precondition queries (API)', async () => {
                app.memory.reset();
                const promises = [];
                if (data.mainScreen !== 'Party Queries') {
                    const queries = data.ownMadeIPTypeQueries.map((query) => query.split('>')[1]);
                    const groups = data.ownMadeIPTypeQueries.map((query) => query.split('>')[0]);
                    await app.api.query.getAllQueries();
                    const ids = await app.api.query.getQueryIds(groups);
                    for (let i = 0; i < queries.length; i++) {
                        promises.push(app.api.query.createPreconditionQuery(data.queryTypes[i], queries[i], {id: app.memory.current.permanent.contentGroupId, name: globalConfig.user.contentGroup}, ids[i]));
                    }
                    promises.push(app.api.query.createPreconditionQuery(data.queryTypes[0], data.privateOwnMadeQueries[0]));
                } else {
                    const queries = data.ownMadeIPTypeQueries.map((query) => query.split('>')[1]);
                    for (let i = 0; i < queries.length; i++) {
                        promises.push(app.api.query.createPreconditionQuery(data.queryTypes[i], queries[i], {id: app.memory.current.permanent.contentGroupId, name: globalConfig.user.contentGroup}));
                    }
                    promises.push(app.api.query.createPreconditionQuery(data.queryTypes[0], data.privateOwnMadeQueries[0].split('>')[1]));
                }
                await Promise.all(promises);
                await app.api.clearCache();
            });
        })
        (`Check different types of queries in default and without permission (Steps 2-6, 9-10 - ${data.mainScreen})`, async (t) => {
            await app.step('Login and find Queries', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.actionBox = await data.findQueries();
            });
            await app.step('Check queries (Steps 2-5, 9)', async () => {
                const checkVisibilityArray = [
                    ...data.pristineIPTypeQueries,
                    ...data.customIPTypeQueries,
                    ...data.ownMadeIPTypeQueries,
                    ...data.pristineNonIPTypeQueries,
                    ...data.crossModuleQueries,
                    ...data.joinPartyQueries,
                    ...data.withoutGroupQueries,
                    ...data.privateOwnMadeQueries
                ];
                await t
                    .expect(await app.ui.queryBoard.kendoTreeview.isItemPresent('Favorites')).notOk();
                for (let query of checkVisibilityArray) {
                    await t.expect(await app.memory.current.actionBox.isItemVisible(query)).ok();
                }
                for (let query of data.privateOwnMadeQueries) {
                    await t.expect(await app.memory.current.actionBox.isItemPrivate(query)).ok();
                }
            }, {isSkipped: false});
            await app.step('Disable permissions for queries (API)', async () => {
                let removePermissionArray: any[] = [
                    ...data.pristineIPTypeQueries,
                    ...data.customIPTypeQueries,
                    ...data.ownMadeIPTypeQueries,
                    ...data.pristineNonIPTypeQueries,
                    ...data.crossModuleQueries,
                    ...data.joinPartyQueries,
                    ...data.withoutGroupQueries
                ];
                removePermissionArray = removePermissionArray.map((query) => {
                    let queryItems: string[] = query.split('>');
                    queryItems[0] = 'Query';
                    query = queryItems.join('>');
                    return {name: query, check: false};
                });
                await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup, true);
                await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, removePermissionArray);
            }, {isSkipped: false});
            await app.step('Check queries with no permission (Step 10)', async () => {
                await data.refresh();
                const checkUnavailableArray = [
                    ...data.pristineIPTypeQueries,
                    ...data.customIPTypeQueries,
                    ...data.pristineNonIPTypeQueries,
                    ...data.crossModuleQueries,
                    ...data.joinPartyQueries,
                    ...data.withoutGroupQueries
                ];
                const checkVisibilityAndPrivacyArray = [
                    ...data.ownMadeIPTypeQueries,
                    ...data.privateOwnMadeQueries
                ];
                for (let query of checkUnavailableArray) {
                    await t.expect(await app.memory.current.actionBox.isItemPresent(query)).notOk();
                }
                for (let query of checkVisibilityAndPrivacyArray) {
                    await t
                        .expect(await app.memory.current.actionBox.isItemVisible(query)).ok()
                        .expect(await app.memory.current.actionBox.isItemPrivate(query)).ok();
                }
            });
        })
        .after(async () => {
            await app.step('Delete Precondition queries (API)', async () => {
                let ids: number[];
                if (data.mainScreen !== 'Party Queries') {
                    await app.api.query.getAllQueries();
                    ids = await app.api.query.getQueryIds([...data.ownMadeIPTypeQueries, ...data.privateOwnMadeQueries]);
                } else {
                    await app.api.partyQuery.getAllQueries();
                    ids = await app.api.partyQuery.getQueryIds([...data.ownMadeIPTypeQueries, ...data.privateOwnMadeQueries]);
                }
                for (let id of ids) {
                    await app.api.query.deleteQuery(id);
                }
            }, {isSkipped: false});
            await app.step('Set permissions default (API)', async () => {
                await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                await app.api.administration.contentGroup.setPermissionDefaults();
                await app.api.administration.contentGroup.save();
                await app.api.administration.clearCache();
            }, {isSkipped: false});
        });
});

getDataSet('particular').forEach((data, index) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async (t) => {
            await app.step('Set default and favorites queries with auto execute (API)', async () => {
                app.memory.reset();
                await app.api.query.getAllQueries();
                app.memory.current.dataArray = [data.pristineIPTypeQueries[0], data.customIPTypeQueries[0], data.withoutGroupQueries[0]];
                app.memory.current.array = await app.api.query.getQueryIds(app.memory.current.dataArray);
                await app.api.userPreferences.resetUserPreferences([
                    {property: 'DefaultQuery', value: app.memory.current.array[0]},
                    {property: 'FavoriteQueries', value: app.memory.current.array},
                    {property: 'AutoExecuteQueries', value: true}
                ]);
            });
        })
        (`Check Query management from User Preferences (Steps 7-8 - ${data.mainScreen})`, async (t) => {
            const defaultQueryName = data.pristineIPTypeQueries[0].split('>')[1];
            await app.step('Login and find Queries', async () => {
                await app.ui.getRole();
                await app.ui.refresh();
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.actionBox = await data.findQueries();
            });
            await app.step('Check Favorites queries (Step 8)', async () => {
                const allQueryNodesLvl1 = await app.memory.current.actionBox.getItemNamesByLevel(1);
                await t
                    .expect(allQueryNodesLvl1).contains('Favorites')
                    .expect(allQueryNodesLvl1[0]).eql('Favorites');
                const allFavorites = await app.memory.current.actionBox.getSubItems('Favorites');
                await t
                    .expect(allFavorites).eql(allFavorites.sort())
                    .expect(allFavorites).notContains('Patent');
                const names = app.memory.current.dataArray.map((q) => {
                    if (q.includes('>')) {
                        return q.split('>')[1];
                    } else {
                        return q;
                    }
                });
                for (let name of names) {
                    await t
                        .expect(allFavorites).contains(name);
                }
            });
            await app.step('Check default query when Auto-Execute is ON (Step 8)', async () => {
                await t
                    .expect(await app.ui.queryBoard.getCurrentQueryName()).eql(defaultQueryName)
                    .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok();
            }, {isSkipped: data.skipStep});
            await app.step('Switch off auto execute for default query (API)', async () => {
                await app.api.userPreferences.resetUserPreferences([
                    {property: 'DefaultQuery', value: app.memory.current.array[0]},
                    {property: 'FavoriteQueries', value: app.memory.current.array},
                    {property: 'AutoExecuteQueries', value: false}
                ]);
            }, {isSkipped: data.skipStep});
            await app.step('Check default query when Auto-Execute is OFF (Step 8)', async () => {
                await data.refresh();
                await t
                    .expect(await app.ui.queryBoard.getCurrentQueryName()).eql(defaultQueryName)
                    .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                    .expect(await app.memory.current.actionBox.getSelectedItemName()).eql(defaultQueryName)
                    .expect(await app.ui.queryBoard.queryResultsGrid.isPresent()).notOk();
            }, {isSkipped: data.skipStep});
        })
        .after(async (t) => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });
});

getDataSet().forEach((data, index) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step('Create private query (API)', async () => {
                app.memory.reset();
                app.memory.current.query = data.privateOwnMadeQueries[0].split('>')['last']();
                await app.api.query.createPreconditionQuery(data.queryTypes[0], app.memory.current.query);
                await app.api.clearCache();
            });
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.login('testRegression2');
                await app.api.userPreferences.resetUserPreferences();
            }, {isSkipped: false});
        })
        (`Verify private queries with another user (Steps 13-16 - ${data.mainScreen})`, async (t) => {
            await app.step('Login and find queries', async () => {
                await app.ui.getRole('testRegression2');
                await app.ui.waitLoading({checkErrors: true});
                app.memory.current.actionBox = await data.findQueries();
            });
            await app.step('Check another user\'s private query (Step 14)', async () => {
                await t
                    .expect(await app.memory.current.actionBox.isItemPresent(data.privateOwnMadeQueries[0])).notOk();
            }, {isSkipped: false});
            await app.step('Add permission to the query (API)', async () => {
                await app.api.administration.contentGroup.openContentGroup('Test Automation CG for regression user2', true);
                await app.api.changePermissionsInContentGroup('Test Automation CG for regression user2', [
                    {name: `Query>${app.memory.current.query}`, check: true}
                ]);
            }, {isSkipped: false});
            await app.step('Check the query after adding permission (Step 16)', async () => {
                await data.refresh();
                await t
                    .expect(await app.memory.current.actionBox.isItemVisible(data.privateOwnMadeQueries[0])).ok()
                    .expect(await app.memory.current.actionBox.isItemPrivate(data.privateOwnMadeQueries[0])).notOk();
            }, {isSkipped: false});
        })
        .after(async () => {
            await app.step('Set permissions default (API)', async () => {
                await app.api.administration.contentGroup.openContentGroup('Test Automation CG for regression user2', true);
                await app.api.administration.contentGroup.setPermissionDefaults();
                await app.api.administration.contentGroup.save();
                await app.api.administration.clearCache();
            }, {isSkipped: false});
            await app.step('Delete Precondition queries (API)', async () => {
                await app.api.query.getAllQueries();
                let ids: number[];
                if (data.mainScreen !== 'Party Queries') {
                    await app.api.query.getAllQueries();
                    ids = await app.api.query.getQueryIds(data.privateOwnMadeQueries);
                } else {
                    await app.api.partyQuery.getAllQueries();
                    ids = await app.api.partyQuery.getQueryIds(data.privateOwnMadeQueries);
                }
                await app.api.query.deleteQuery(ids[0]);
            }, {isSkipped: false});
            await app.step('Re-login (API)', async () => {
                await app.api.login();
            }, {isSkipped: false});
        });
});
