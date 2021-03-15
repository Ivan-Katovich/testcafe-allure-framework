import { table } from 'console';
import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.userPreferences.pack. - Test ID 31164: User Preferences - apply Default Query and Auto-Execute Queries`
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
    .before(async () => {
        await app.step(`Set default query to 'TA PA All Cases' and 'Auto-Execute Queries' to ON in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultQuery', value: 37043 }, { property: 'AutoExecuteQueries', value: true }]);
        });
    })
    (`Verify the Query screen when 'Default query' is selected, 'Auto-Execute Queries' is ON (steps 3-5)`, async (t: TestController) => {
        await app.step('Login and verify the default query is auto-executed on Query page', async () => {
            await app.ui.getRole();
            await app.ui.navigate(`${globalConfig.env.url}/UI/queries`);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.getCurrentUrl()).contains('queries')
                .expect(await app.ui.queryBoard.getCurrentQueryName()).eql('TA PA All Cases')
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.isVisible('menu')).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).ok();
        });
        await app.step(`Verify the default query is selected in the query tree`, async () => {
            await app.ui.queryBoard.openTree();
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.getSelectedItemName()).eql('TA PA All Cases');
        });
        await app.step(`Verify another query is auto-executed on Query page`, async () => {
            await app.ui.queryBoard.kendoTreeview.open('Trademark>TA TM All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getCurrentQueryName()).eql('TA TM All Cases')
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.isVisible('menu')).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).ok();
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
    .before(async () => {
        await app.step(`Set default query to 'TA PA All Cases' and 'Auto-Execute Queries' to OFF in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultQuery', value: 37043 }, { property: 'AutoExecuteQueries', value: false }]);
        });
    })
    (`Verify the Query screen when 'Default query' is selected, 'Auto-Execute Queries' is OFF (steps 6-10)`, async (t: TestController) => {
        await app.step('Login and verify the default query is displayed but not auto-executed', async () => {
            await app.ui.getRole();
            await app.ui.navigate(`${globalConfig.env.url}/UI/queries`);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.getCurrentUrl()).contains('queries')
                .expect(await app.ui.queryBoard.getCurrentQueryName()).eql('TA PA All Cases')
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(2)
                .expect(await app.ui.queryBoard.isVisible('menu')).notOk()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).notOk();
        });
        await app.step(`Verify the default query is selected in the expanded query tree`, async () => {
            await t
                .expect(await app.ui.queryBoard.isVisible('queryList')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.getSelectedItemName()).eql('TA PA All Cases');
        });
        await app.step(`Add a criterion, run the query, and verify query results`, async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Docket Number');
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill('patent');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            const record = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            const value = await record.getValue('Docket Number');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.isVisible('menu')).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).ok()
                .expect(rowCount).gt(0, 'No records were returned in Query Results')
                .expect(value).contains('patent', `The first record does not fit the Criteria Builder conditions`);
        });
        await app.step(`Verify another query is not auto-executed`, async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open('Trademark>TA TM All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getCurrentQueryName()).eql('TA TM All Cases')
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(2)
                .expect(await app.ui.queryBoard.isVisible('menu')).notOk()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).notOk()
                .expect(await app.ui.queryBoard.isVisible('queryList')).ok();
        });
        await app.step(`Add a criterion for query 2, run the query, and verify query results`, async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Country / Region');
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill('US - (United States)');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            const record = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            const value = await record.getValue('Country / Region');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.isVisible('menu')).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).ok()
                .expect(rowCount).gt(0, 'No records were returned in Query Results')
                .expect(value).eql('US - (United States)', `The first record does not fit the Criteria Builder conditions`);
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
    .before(async () => {
        await app.step(`Set default query to None and 'Auto-Execute Queries' to ON in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultQuery', value: 0 }, { property: 'AutoExecuteQueries', value: true }]);
        });
    })
    (`Verify the Query screen when 'Default query' is empty, 'Auto-Execute Queries' is ON (steps 11-13)`, async (t: TestController) => {
        await app.step('Login and verify no query is opened by default', async () => {
            await app.ui.getRole();
            await app.ui.navigate(`${globalConfig.env.url}/UI/queries`);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.getCurrentUrl()).contains('queries')
                .expect(await app.ui.queryBoard.isVisible('emptyPlaceholder')).ok()
                .expect(await app.ui.queryBoard.isVisible('queryList')).ok();
        });
        await app.step(`Verify any clicked query is auto-executed`, async () => {
            await app.ui.queryBoard.kendoTreeview.open('Trademark>TA TM All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getCurrentQueryName()).eql('TA TM All Cases')
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.isVisible('menu')).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).ok();
        });
    })    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Set default query to None and 'Auto-Execute Queries' to OFF in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultQuery', value: 0 }, { property: 'AutoExecuteQueries', value: false }]);
        });
    })
    (`Verify the Query screen when 'Default query' is empty, 'Auto-Execute Queries' is OFF (steps 14-17)`, async (t: TestController) => {
        await app.step('Login and verify no query is opened by default', async () => {
            await app.ui.getRole();
            await app.ui.navigate(`${globalConfig.env.url}/UI/queries`);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.getCurrentUrl()).contains('queries')
                .expect(await app.ui.queryBoard.isVisible('emptyPlaceholder')).ok()
                .expect(await app.ui.queryBoard.isVisible('queryList')).ok();
        });
        await app.step(`Verify any clicked query is not auto-executed`, async () => {
            await app.ui.queryBoard.kendoTreeview.open('Trademark>TA TM All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getCurrentQueryName()).eql('TA TM All Cases')
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(2)
                .expect(await app.ui.queryBoard.isVisible('menu')).notOk()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).notOk()
                .expect(await app.ui.queryBoard.isVisible('queryList')).ok();
        });
        await app.step(`Add a criterion, run the query, and verify query results`, async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Country / Region');
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill('US - (United States)');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.isVisible('menu')).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).ok()
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            const record = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            const value = await record.getValue('Country / Region');
            await t
                .expect(value).eql('US - (United States)', `The first record does not fit the Criteria Builder conditions`);
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

const dataset = [
    { page: 'Party', pageUrl: 'UI/party/queries', queryPath: 'Party>Party Query', queryName: 'Party Query' },
    { page: 'Audit Log', pageUrl: 'UI/administration/audit-log', queryPath: 'Audit Log>Patent Audit Query', queryName: 'Patent Audit Query' },
    { page: 'Deletion Management', pageUrl: 'UI/administration/deletion-management', queryPath: 'Deletion Management>Patent Deleted Query', queryName: 'Patent Deleted Query' },
    { page: 'Global Change Log', pageUrl: 'UI/administration/global-change-log', queryPath: 'Global Change Log>Patents Log', queryName: 'Patents Log' },
    { page: 'Message Center', pageUrl: 'UI/message-center', queryPath: 'Message Center>Pending Rules Validation>Patents', queryName: 'Patents' }
];

dataset.forEach((data) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step(`Set 'Auto-Execute Queries' to ON in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
            });
        })
        (`Verify the '${data.queryName}' query is auto-executed on '${data.page}' page when 'Auto-Execute Queries' is ON (step 19)`, async (t: TestController) => {
            await app.step(`Login to the '${data.page}' page`, async () => {
                await app.ui.getRole(undefined, data.pageUrl);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.getCurrentUrl()).contains(data.pageUrl)
                    .expect(await app.ui.queryBoard.isVisible('emptyPlaceholder')).ok()
                    .expect(await app.ui.queryBoard.isVisible('queryList')).ok();
            });
            await app.step(`Verify a clicked query is auto-executed`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.queryPath);
                await app.ui.waitLoading({checkErrors: false});
                if (!(await app.ui.queryBoard.noErrors())) {
                    await app.ui.refresh(true); // required due to IPDP-14327 error
                    await app.ui.waitLoading({checkErrors: true});
                }
                await t
                    .expect(await app.ui.queryBoard.getCurrentQueryName()).eql(data.queryName)
                    .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                    .expect(await app.ui.queryBoard.isVisible('menu')).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });
});

dataset.forEach((data) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step(`Set 'Auto-Execute Queries' to OFF in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
            });
        })
        (`Verify the '${data.queryName}' query is not auto-executed on '${data.page}' page when 'Auto-Execute Queries' is OFF (step 19)`, async (t: TestController) => {
            await app.step(`Login to the '${data.page}' page`, async () => {
                await app.ui.getRole(undefined, data.pageUrl);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.getCurrentUrl()).contains(data.pageUrl)
                    .expect(await app.ui.queryBoard.isVisible('emptyPlaceholder')).ok()
                    .expect(await app.ui.queryBoard.isVisible('queryList')).ok();
            });
            await app.step(`Verify a clicked query is not auto-executed`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.queryPath);
                await app.ui.waitLoading({checkErrors: false});
                if (!(await app.ui.queryBoard.noErrors())) {
                    await app.ui.refresh(true); // required due to IPDP-14327 error
                    await app.ui.waitLoading({checkErrors: true});
                }
                await t
                    .expect(await app.ui.queryBoard.getCurrentQueryName()).eql(data.queryName)
                    .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                    .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(2)
                    .expect(await app.ui.queryBoard.isVisible('menu')).notOk()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('list')).notOk()
                    .expect(await app.ui.queryBoard.isVisible('queryList')).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });
});

test
    // .only
    .meta('brief', 'false')
    .before(async () => {
        await app.step(`Set 'Auto-Execute Queries' to OFF in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    (`Verify a query on 'Add Relationships' modal is always run automatically (step 19)`, async (t: TestController) => {
        await app.step('Login and run a query on Queries page', async () => {
            await app.ui.getRole();
            await app.ui.navigate(`${globalConfig.env.url}/UI/queries`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open('Patent>TA PA All Cases');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
        });
        await app.step(`Open a record and verify query is auto-executed on the 'Add Relationships' modal`, async () => {
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.selectChildRecord('Related Records');
            await app.ui.waitLoading();
            await app.ui.dataEntryBoard.childRecord.addNew();
            await app.ui.waitLoading();
            await app.ui.addRelationshipsModal.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.addRelationshipsModal.getText('queryName')).eql('PA All Cases')
                .expect(await app.ui.addRelationshipsModal.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.addRelationshipsModal.isVisible('menu')).ok()
                .expect(await app.ui.addRelationshipsModal.queryResultsGrid.isVisible('list')).ok();
        });
        await app.step(`Set 'Auto-Execute Queries' to ON in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);

        });
        await app.step(`Refresh the DEF and verify query is auto-executed on the 'Add Relationships' modal`, async () => {
            await app.ui.refresh();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.selectChildRecord('Related Records');
            await app.ui.waitLoading();
            await app.ui.dataEntryBoard.childRecord.addNew();
            await app.ui.waitLoading();
            await app.ui.addRelationshipsModal.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.addRelationshipsModal.getText('queryName')).eql('PA All Cases')
                .expect(await app.ui.addRelationshipsModal.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.addRelationshipsModal.isVisible('menu')).ok()
                .expect(await app.ui.addRelationshipsModal.queryResultsGrid.isVisible('list')).ok();
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });
