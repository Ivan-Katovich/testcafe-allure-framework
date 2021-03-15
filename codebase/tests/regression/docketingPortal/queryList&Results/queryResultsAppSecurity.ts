import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.queryList&Results.pack. - Test ID 29985: Query - Query Results - Application security`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        }, {isSkipped: false});
        await app.step('Delete Precondition queries (API)', async () => {
            await app.api.query.getAllQueries();
            const queryIds = await app.api.query.getQueryIds([
                `TA Patents with one field`,
                'TA Trademark with one field',
                'TA Disclosure with one field',
                'TA GeneralIP1 with one field'
            ]);
            await app.api.partyQuery.getAllQueries();
            const partyQueryIds = await app.api.partyQuery.getQueryIds(['Party>TA Party with one field']);
            for (let id of [...queryIds, ...partyQueryIds]) {
                await app.api.query.deleteQuery(id);
            }
        }, {isSkipped: false});
    })
    .after(async () => {
    });

const dataSet = (function() {
    async function runQueryForIPType(query: string) {
        await app.ui.queryBoard.openTree();
        await app.ui.queryBoard.kendoTreeview.open(this[query]);
        await app.ui.waitLoading({checkErrors: true});
        return app.ui.queryBoard;
    }
    async function deleteQueryForIPType() {
        if (!app.memory.current.id) {
            await app.api.query.getAllQueries();
            const queryIds = await app.api.query.getQueryIds([this.queryName]);
            await app.api.query.deleteQuery(queryIds[0]);
        } else {
            await app.api.query.deleteQuery(app.memory.current.id);
        }
        app.memory.reset();
    }
    const fullData = [
        {
            ipType: 'Patent',
            queryName: 'TA Patents with one field',
            keyField: 'Country / Region',
            permission: {
                ipType: 'PatentMasters',
                group: 'PatentMasters>PATENTS',
                field: 'PatentMasters>PATENTS>Country / Region'
            },
            condition: 'TA Country US',
            queryWithField: 'Patent>PA All Cases',
            additionalQueriesToCheck: ['TA All Patents', 'Trademark>TM All Cases'],
            skippedSteps: {
                conditions: false,
                oneFieldQuery: false,
                disabledIPType: false,
                openRecord: true
            },
            async runQuery(query: string) {
                return runQueryForIPType.call(this, query);
            },
            async deleteQuery() {
                await deleteQueryForIPType.call(this);
            },
            brief: 'true'
        },
        {
            ipType: 'Trademark',
            queryName: 'TA Trademark with one field',
            keyField: 'Create User',
            permission: {
                ipType: 'TrademarkMasters',
                group: 'TrademarkMasters>TRADEMARKS',
                field: 'TrademarkMasters>TRADEMARKS>Create User'
            },
            condition: 'TA CreateUser TestA',
            queryWithField: 'Trademark>TM All Cases',
            additionalQueriesToCheck: ['Trademark>TM All Actions', 'Patent>PA All Cases'],
            skippedSteps: {
                conditions: false,
                oneFieldQuery: false,
                disabledIPType: false,
                openRecord: true
            },
            async runQuery(query: string) {
                return runQueryForIPType.call(this, query);
            },
            async deleteQuery() {
                await deleteQueryForIPType.call(this);
            },
            brief: 'false'
        },
        {
            ipType: 'Disclosure',
            queryName: 'TA Disclosure with one field',
            keyField: 'Technology',
            permission: {
                ipType: 'DisclosureMasters',
                group: 'DisclosureMasters>DISCLOSURES',
                field: 'DisclosureMasters>DISCLOSURES>Technology'
            },
            condition: 'TA Tech Data Compression',
            queryWithField: 'Disclosure>DS All Cases',
            additionalQueriesToCheck: ['Disclosure>DS All Actions', 'Trademark>TM All Cases'],
            skippedSteps: {
                conditions: false,
                oneFieldQuery: false,
                disabledIPType: false,
                openRecord: true
            },
            async runQuery(query: string) {
                return runQueryForIPType.call(this, query);
            },
            async deleteQuery() {
                await deleteQueryForIPType.call(this);
            },
            brief: 'false'
        },
        {
            ipType: 'GeneralIP',
            queryName: 'TA GeneralIP1 with one field',
            keyField: 'Sensitive',
            permission: {
                ipType: 'GeneralIP1Masters',
                group: 'GeneralIP1Masters>GENERALIP1',
                field: 'GeneralIP1Masters>GENERALIP1>Sensitive'
            },
            condition: 'TA Sensitive false',
            queryWithField: 'GeneralIP1>GIP1 All Cases',
            additionalQueriesToCheck: ['GeneralIP1>GIP1 All Actions', 'Trademark>TM All Cases'],
            skippedSteps: {
                conditions: false,
                oneFieldQuery: false,
                disabledIPType: false,
                openRecord: true
            },
            async runQuery(query: string) {
                return runQueryForIPType.call(this, query);
            },
            async deleteQuery() {
                await deleteQueryForIPType.call(this);
            },
            brief: 'false'
        },
        {
            ipType: 'Party',
            queryName: 'TA Party with one field',
            keyField: 'Party',
            permission: {
                ipType: 'Parties',
                group: 'Parties>PARTIES',
                field: 'Parties>PARTIES>Party'
            },
            condition: null,
            queryWithField: 'Party Query',
            additionalQueriesToCheck: ['Party>Party Query TA filter'],
            skippedSteps: {
                conditions: true,
                oneFieldQuery: false,
                disabledIPType: false,
                openRecord: true
            },
            async runQuery(query: string) {
                await app.ui.naviBar.click('links', 'Party');
                await app.ui.kendoPopup.selectItem('Party Query');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(`Party>${this[query]}`);
                await app.ui.waitLoading({checkErrors: true});
                return app.ui.queryBoard;
            },
            async deleteQuery() {
                if (!app.memory.current.id) {
                    await app.api.partyQuery.getAllQueries();
                    const queryIds = await app.api.partyQuery.getQueryIds([`Party>${this.queryName}`]);
                    await app.api.query.deleteQuery(queryIds[0]);
                } else {
                    await app.api.query.deleteQuery(app.memory.current.id);
                }
                app.memory.reset();
            },
            brief: 'false'
        },
        {
            ipType: 'Patent (Related Records)',
            queryName: null,
            keyField: 'Country / Region',
            permission: {
                ipType: 'PatentMasters',
                group: 'PatentMasters>PATENTS',
                field: 'PatentMasters>PATENTS>Country / Region'
            },
            condition: 'TA Country US',
            queryWithField: 'Patent>PA All Cases',
            additionalQueriesToCheck: ['TA All Patents', 'Trademark>TM All Cases'],
            skippedSteps: {
                conditions: false,
                oneFieldQuery: true,
                disabledIPType: true,
                openRecord: false
            },
            async runQuery(query: string) {
                const url = await app.ui.getCurrentUrl();
                if (url.includes('queries')) {
                    await app.ui.queryBoard.openTree();
                    await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
                    await app.ui.waitLoading({checkErrors: true});
                    await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                    await app.ui.waitLoading({checkErrors: true});
                } else {
                    await app.ui.refresh();
                    await app.ui.waitLoading({checkErrors: true});
                }
                await app.ui.dataEntryBoard.selectChildRecord('Related Records');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.dataEntryBoard.childRecord.addNew();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.addRelationshipsModal.kendoTreeview.open(this[query]);
                await app.ui.waitLoading({checkErrors: true});
                return app.ui.addRelationshipsModal;
            },
            async deleteQuery() {
                await deleteQueryForIPType.call(this);
            },
            brief: 'false'
        }
    ];
    return fullData;
})();

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step('Create Precondition query (API)', async () => {
                const modifier = app.services.modifiers.composer(
                    app.services.modifiers.removeQueryAdditionalFilters(),
                    app.services.modifiers.selectQueryFieldsModifier([data.keyField])
                );
                const queryData = await app.api.query.createPreconditionQuery(
                    data.ipType,
                    data.queryName,
                    {id: app.memory.current.permanent.contentGroupId, name: globalConfig.user.contentGroup},
                    null, modifier
                );
                app.memory.current.id = queryData.ResourceId;
            }, {isSkipped: data.skippedSteps.oneFieldQuery});
        })
        (`Verify Application Security for Query Results (Steps 1-14 - ${data.ipType})`, async (t) => {
            let boardContainer = null;
            let total = null;
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            }, {isSkipped: false});
            await app.step(`Run "${data.queryName}" query and check state`, async () => {
                boardContainer = await data.runQuery('queryName');
                await t
                    .expect(await boardContainer.queryResultsGrid.getColumnsNamesArray())
                    .eql([{ text: 'checkbox', index: 0 },
                        { text: data.keyField, index: 1 }]);
            }, {isSkipped: data.skippedSteps.oneFieldQuery});
            await app.step(`Run "${data.queryWithField}" query and get total`, async () => {
                boardContainer = await data.runQuery('queryWithField');
                const columns = await boardContainer.queryResultsGrid.getColumnsNamesArray();
                const columnNames = columns.map((c) => c.text);
                await t
                    .expect(columnNames).contains(data.keyField);
                total = await boardContainer.getMenuTotalCount({isNumber: true});
            }, {isSkipped: false});
            await app.step(`Disable Visible and Edit permission for ${data.permission.ipType} (API)`, async () => {
                const changes = [{Path: data.permission.ipType, VisiblePermission: false, EditPermission: false}];
                await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
            }, {isSkipped: data.skippedSteps.disabledIPType});
            await app.step(`Refresh "${data.queryName}" query and check state`, async () => {
                await data.runQuery('queryName');
                await t
                    .expect(await boardContainer.isVisible('securityError')).ok()
                    .expect(await boardContainer.getText('errorHeader'))
                    .eql('The selected query cannot be run.')
                    .expect(await boardContainer.getText('errorBody'))
                    .eql('Conditional security has been applied to this query and it requires additional result fields.')
                    .expect(await boardContainer.getText('errorContactAdmin'))
                    .eql('Please contact your administrator for more information.');
            }, {isSkipped: data.skippedSteps.oneFieldQuery});
            await app.step('Set app security default (API)', async () => {
                await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                await app.api.administration.contentGroup.setAppSecurityDefaults();
                await app.api.administration.contentGroup.save();
                await app.api.administration.clearCache();
            }, {isSkipped: false});
            await app.step(`Disable Visible permission for ${data.keyField} (API)`, async () => {
                const changes = [{Path: data.permission.field, VisiblePermission: false, EditPermission: false}];
                await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
            }, {isSkipped: false});
            await app.step(`Refresh "${data.queryName}" query and check state`, async () => {
                await data.runQuery('queryName');
                await t
                    .expect(await boardContainer.isVisible('securityError')).ok()
                    .expect(await boardContainer.getText('errorHeader'))
                    .eql('The selected query cannot be run.')
                    .expect(await boardContainer.getText('errorBody'))
                    .eql('Conditional security has been applied to this query and it requires additional result fields.')
                    .expect(await boardContainer.getText('errorContactAdmin'))
                    .eql('Please contact your administrator for more information.');
            }, {isSkipped: data.skippedSteps.oneFieldQuery});
            await app.step('Verify screen elements', async () => {
                await t
                    .expect(await boardContainer.isPresent('complexQueriesLink')).notOk()
                    .expect(await boardContainer.isPresent('questionCircle')).notOk()
                    .expect(await boardContainer.queryResultsGrid.isPresent()).notOk()
                    .expect(await boardContainer.isPresent('menuItems', 'Export')).notOk();
            }, {isSkipped: data.skippedSteps.oneFieldQuery});
            await app.step(`Run "${data.queryWithField}" query and verify columns`, async () => {
                await data.runQuery('queryWithField');
                const columns = await boardContainer.queryResultsGrid.getColumnsNamesArray();
                const columnNames = columns.map((c) => c.text);
                await t
                    .expect(await boardContainer.queryResultsGrid.isVisible()).ok()
                    .expect(columnNames).notContains(data.keyField);
            }, {isSkipped: false});
            await app.step('Check other queries', async () => {
                for (let query of data.additionalQueriesToCheck) {
                    await boardContainer.openTree();
                    await boardContainer.kendoTreeview.open(query);
                    await app.ui.waitLoading({checkErrors: true});
                    await t
                        .expect(await boardContainer.queryResultsGrid.isVisible()).ok();
                }
            }, {isSkipped: false});
            await app.step(`Set Visible condition for ${data.ipType} (API)`, async () => {
                await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                await app.api.administration.contentGroup.setApplicationSecurityWithCondition(
                    data.permission.group,
                    {visibleCondition: data.condition}
                );
                await app.api.administration.contentGroup.save();
                await app.api.administration.clearCache();
            }, {isSkipped: data.skippedSteps.conditions});
            await app.step(`Run "${data.queryName}" query and check state`, async () => {
                await app.ui.refresh();
                await data.runQuery('queryName');
                await t
                    .expect(await boardContainer.isVisible('securityError')).ok()
                    .expect(await boardContainer.getText('errorHeader'))
                    .eql('The selected query cannot be run.')
                    .expect(await boardContainer.getText('errorBody'))
                    .eql('Conditional security has been applied to this query and it requires additional result fields.')
                    .expect(await boardContainer.getText('errorContactAdmin'))
                    .eql('Please contact your administrator for more information.');
            }, {isSkipped: data.skippedSteps.conditions === true || data.skippedSteps.oneFieldQuery === true});
            await app.step('Verify screen elements', async () => {
                await t
                    .expect(await boardContainer.isPresent('complexQueriesLink')).notOk()
                    .expect(await boardContainer.isPresent('questionCircle')).notOk()
                    .expect(await boardContainer.queryResultsGrid.isPresent()).notOk()
                    .expect(await boardContainer.isPresent('menuItems', 'Export')).notOk();
            }, {isSkipped: data.skippedSteps.conditions === true || data.skippedSteps.oneFieldQuery === true});
            await app.step(`Run "${data.queryWithField}" query and verify amount`, async () => {
                await data.runQuery('queryWithField');
                const columns = await boardContainer.queryResultsGrid.getColumnsNamesArray();
                const columnNames = columns.map((c) => c.text);
                let total1 = await boardContainer.getMenuTotalCount({isNumber: true});
                await t
                    .expect(await boardContainer.queryResultsGrid.isVisible()).ok()
                    .expect(columnNames).notContains(data.keyField)
                    .expect(await boardContainer.getMenuTotalCount({isNumber: true})).lt(total);
            }, {isSkipped: data.skippedSteps.conditions});
            await app.step('Check other queries', async () => {
                for (let query of data.additionalQueriesToCheck) {
                    await boardContainer.openTree();
                    await boardContainer.kendoTreeview.open(query);
                    await app.ui.waitLoading({checkErrors: true});
                    await t
                        .expect(await boardContainer.queryResultsGrid.isVisible()).ok();
                }
            }, {isSkipped: data.skippedSteps.conditions});
        })
        .after(async () => {
            await app.step('Delete Precondition query (API)', async () => {
                await data.deleteQuery();
            }, {isSkipped: data.skippedSteps.oneFieldQuery});
            await app.step('Set app security default (API)', async () => {
                await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                await app.api.administration.contentGroup.setAppSecurityDefaults();
                await app.api.administration.contentGroup.save();
                await app.api.administration.clearCache();
            }, {isSkipped: false});
        });
});

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .meta('category', 'Display Configuration')
        .before(async () => {
            await app.step('Change display configuration for user (API)', async () => {
                if (index === 0) {
                    app.ui.resetRole();
                    await app.api.changeDisplayConfigurationForUser('TA Custom Display Configuration', globalConfig.user.userName);
                }
            });
        })
        (`Query Results - Security - Verify display configuration (Step 16 - ${data.ipType})`, async (t) => {
            let boardContainer = null;
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            }, {isSkipped: false});
            await app.step('Open any record', async () => {
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open('Trademark>TM All Cases');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading({checkErrors: true});
            }, {isSkipped: data.skippedSteps.openRecord});
            await app.step(`Disable Visible permission for ${data.ipType} (API)`, async () => {
                const changes = [{Path: data.permission.ipType, VisiblePermission: false, EditPermission: false}];
                await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, changes);
            }, {isSkipped: false});
            await app.step(`Run "${data.queryWithField}" query and check state`, async () => {
                boardContainer = await data.runQuery('queryWithField');
                await t
                    .expect(await boardContainer.isVisible('securityError')).ok()
                    .expect(await boardContainer.getText('errorHeader'))
                    .eql('The selected query cannot be run. !!!')
                    .expect(await boardContainer.getText('errorBody'))
                    .eql('Conditional security has been applied to this query and it requires additional result fields. 111')
                    .expect(await boardContainer.getText('errorContactAdmin'))
                    .eql('Please contact your administrator for more information. AAA');
            }, {isSkipped: false});
        })
        .after(async () => {
            await app.step('Set app security default (API)', async () => {
                await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup, true);
                await app.api.administration.contentGroup.setAppSecurityDefaults();
                await app.api.administration.contentGroup.save();
                await app.api.administration.clearCache();
            }, {isSkipped: false});
            await app.step('Change display configuration to default (API)', async () => {
                if (index === dataSet.length - 1 || globalConfig.brief) {
                    try {
                        await app.api.changeDisplayConfigurationForUser('Default Display Configuration 1', globalConfig.user.userName);
                        app.ui.resetRole();
                    } catch (err) {}
                }
            });
        });
});
