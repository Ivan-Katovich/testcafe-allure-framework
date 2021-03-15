import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.queryList&Results.pack. - Test ID 29987: Query - Query Results - Query without MasterId & Non-IPType query`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    })
    .beforeEach(async () => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
    });

const data = {
            pristineNonIPTypeQueries: [
                'Countries / Regions>All Countries / Regions',
                'Admin>All Country / Region Groups',
                'Admin>Rule Message Log'
            ],
            codesQuery: 'Admin>All Codes_',
            crossModuleQuery: 'TA Cross Module',
            joinPartyQuery: 'Patent>Parties Join With Patent',
            withoutMasterIdQuery: 'Patent>TA PA All Cases without masterID',
            queryReport: 'Reports>Patent Query Reports>TA Report TP for Patents'
        };

data.pristineNonIPTypeQueries.forEach((query) => {
    let queryName = query.split('>').pop();
    test
        // .only
        // .skip
        .meta('brief', 'true')
        (`Verify hyperlink and elements for the non-IPtype query "${queryName}" (Steps 3-4)`, async (t) => {
            await app.step(`Run query "${queryName}"`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(query);
                await app.ui.waitLoading({checkErrors: true});
                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok();
            });
            await app.step(`Verify query menu items`, async () => {
                await t
                    .expect(await app.ui.queryBoard.isPresent('menuItems', 'Open in Browser')).notOk()
                    .expect(await app.ui.queryBoard.isPresent('menuItems', 'View in:')).notOk()
                    .expect(await app.ui.queryBoard.isPresent('menuItems', 'Export')).ok()
                    .expect(await app.ui.queryBoard.isPresent('menuItems', 'Delete')).notOk()
                    .expect(await app.ui.queryBoard.isPresent('menuItems', 'More')).notOk();
            });
            await app.step(`Verify that first column is not a hyperlink`, async () => {
                const isFirstColumnLink = await app.ui.queryBoard.queryResultsGrid.isFirstColumnHyperlink();
                await t
                    .expect(await app.ui.queryBoard.getMenuTotalCount({isNumber: true})).gt(0)
                    .expect(isFirstColumnLink).notOk();
            });
        });
});

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify hyperlink and elements for Codes query (Steps 3-4)`, async (t) => {
        await app.step(`Run query "${data.codesQuery}" `, async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.codesQuery);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok();
        });
        await app.step (`Verify that first column is a hyperlink`, async () => {
            const isFirstColumnLink = await app.ui.queryBoard.queryResultsGrid.isFirstColumnHyperlink();
            await t
                .expect(await app.ui.queryBoard.getMenuTotalCount({isNumber: true})).gt(0)
                .expect(isFirstColumnLink).ok();
        });
        await app.step(`Verify query menu items`, async () => {
            await t
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Open in Browser')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'View in:')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Export')).ok()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Delete')).ok()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'More')).notOk();
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify the Join-Parties query (Steps 5-7)`, async (t) => {
        let gridDocketNumber = null;
        await app.step(`Run query "${data.joinPartyQuery}" `, async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.joinPartyQuery);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.getMenuTotalCount({isNumber: true})).gt(0);
        });
        await app.step(`Verify that first column is not a hyperlink`, async () => {
            const isFirstColumnLink = await app.ui.queryBoard.queryResultsGrid.isFirstColumnHyperlink();
            await t
                .expect(isFirstColumnLink).notOk();
        });
        await app.step(`Verify query menu items`, async () => {
            await t
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Open in Browser')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'View in:')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Export')).ok()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Delete')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'More')).ok();
        });
        await app.step(`Select a random record and verify items in "...More" menu`, async () => {
            let count = (await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues()).length;
            let randomNum = app.services.random.num(0, count - 1);
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(randomNum).check();
            gridDocketNumber = (await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues())[randomNum];
            await app.ui.queryBoard.click('menuItems', 'More');
            let moreItems = await app.ui.kendoPopup.getAllItemsText();
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Report')).ok();
            let otherMoreItems = moreItems.filter((x) => x !== 'Report');
            for (let i of otherMoreItems) {
                await t
                    .expect(await app.ui.kendoPopup.isEnabled('simpleItems', i)).notOk();
            }
        });
        await app.step(`Open "Report" modal window`, async () => {
            await app.ui.kendoPopup.selectItem('Report');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.reportModal.isVisible()).ok();
        });
        await app.step('Generate a report and verify it', async () => {
            await app.ui.reportModal.kendoTreeview.open(data.queryReport);
            let reportDocketNumber = await app.ui.reportPage.getTaRepForPatentsDocketNumberFromIframe();
            await t
                .expect(await app.ui.reportPage.isVisible('crReportViewer')).ok()
                .expect(reportDocketNumber).eql(gridDocketNumber);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify the Cross-Module query (Steps 8-10)`, async (t) => {
        let gridDocketNumber = null;
        await app.step(`Run query "${data.crossModuleQuery}" `, async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.crossModuleQuery);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.getMenuTotalCount({isNumber: true})).gt(0);
        });
        await app.step(`Verify that first column is not a hyperlink`, async () => {
            const isFirstColumnLink = await app.ui.queryBoard.queryResultsGrid.isFirstColumnHyperlink();
            await t
                .expect(isFirstColumnLink).notOk();
        });
        await app.step(`Verify query menu items`, async () => {
            await t
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Open in Browser')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'View in:')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Export')).ok()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Delete')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'More')).ok();
        });
        await app.step(`Select a random record and verify items in "...More" menu`, async () => {
            let count = (await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues()).length;
            let randomNum = app.services.random.num(0, count - 1);
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(randomNum).check();
            gridDocketNumber = (await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues())[randomNum];
            await app.ui.queryBoard.click('menuItems', 'More');
            let moreItems = await app.ui.kendoPopup.getAllItemsText();
            for (let i of moreItems) {
                if (i === 'Report') {
                    await t
                        .expect(await app.ui.kendoPopup.isEnabled('simpleItems', i)).ok();
                } else {
                    await t
                        .expect(await app.ui.kendoPopup.isEnabled('simpleItems', i)).notOk();
                }
            }
        });
        await app.step(`Open "Report" modal window`, async () => {
            await app.ui.kendoPopup.selectItem('Report');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.reportModal.isVisible()).ok();
        });
        await app.step('Generate a report and verify it', async () => {
            await app.ui.reportModal.kendoTreeview.open(data.queryReport);
            let reportDocketNumber = await app.ui.reportPage.getTaRepForPatentsDocketNumberFromIframe();
            await t
                .expect(await app.ui.reportPage.isVisible('crReportViewer')).ok()
                .expect(reportDocketNumber).eql(gridDocketNumber);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify an IP-Type query without MasterID (Steps 11-13)`, async (t) => {
        let gridDocketNumber = null;
        await app.step(`Run query "${data.withoutMasterIdQuery}" `, async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.withoutMasterIdQuery);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.getMenuTotalCount({isNumber: true})).gt(0);
        });
        await app.step(`Verify that first column is not a hyperlink`, async () => {
            const isFirstColumnLink = await app.ui.queryBoard.queryResultsGrid.isFirstColumnHyperlink();
            await t
                .expect(isFirstColumnLink).notOk();
        });
        await app.step(`Verify query menu items`, async () => {
            await t
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Open in Browser')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'View in:')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Export')).ok()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'Delete')).notOk()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'More')).ok();
        });
        await app.step(`Select a random record and verify items in "...More" menu`, async () => {
            let count = (await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues()).length;
            let randomNum = app.services.random.num(0, count - 1);
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(randomNum).check();
            gridDocketNumber = (await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues())[randomNum];
            await app.ui.queryBoard.click('menuItems', 'More');
            let moreItems = await app.ui.kendoPopup.getAllItemsText();
            for (let i of moreItems) {
                if (i === 'Report') {
                    await t
                        .expect(await app.ui.kendoPopup.isEnabled('simpleItems', i)).ok();
                } else {
                    await t
                        .expect(await app.ui.kendoPopup.isEnabled('simpleItems', i)).notOk();
                }
            }
        });
        await app.step(`Open "Report" modal window`, async () => {
            await app.ui.kendoPopup.selectItem('Report');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.reportModal.isVisible()).ok();
        });
        await app.step('Generate a report and verify it', async () => {
            await app.ui.reportModal.kendoTreeview.open(data.queryReport);
            let reportDocketNumber = await app.ui.reportPage.getTaRepForPatentsDocketNumberFromIframe();
            await t
                .expect(await app.ui.reportPage.isVisible('crReportViewer')).ok()
                .expect(reportDocketNumber).eql(gridDocketNumber);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    .before(async (t) => {
        await app.step(`Remove permissions to all Reports for user's content group (API)`, async () => {
            await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{name: 'Reports', check: false}]);
        });
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
    })
    (`Verify custom queries without Report permissions (Steps 14-15)`, async (t) => {
        await app.step(`Verify the "More" button is hidden for the Join-Parties query`, async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.joinPartyQuery);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'More')).notOk();
        });
        await app.step(`Verify the "More" button is hidden for the Cross-Module query`, async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.crossModuleQuery);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'More')).notOk();
        });
        await app.step(`Verify the "More" button is hidden for the query without MasterID`, async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.withoutMasterIdQuery);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'More')).notOk();
        });
    })
    .after(async (t) => {
        await app.step(`Restore permissions to all Reports for user's content group (API)`, async () => {
            await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{name: 'Reports', check: true}]);
        });
    });
