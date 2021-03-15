import app from '../../../../app';

fixture `REGRESSION.queryList&Results.pack. - Test ID 31233: Query - Query List - permissions (licenses)`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

[
    { ipType: 'PatentMasters', license: 'WithoutPatents.LIC', query: 'Trademark>TA TM All Cases', brief: 'true' },
    { ipType: 'TrademarkMasters', license: 'WithoutTM.LIC', query: 'Patent>TA PA All Cases', brief: 'false' },
    { ipType: 'DisclosureMasters', license: 'WithoutDisclosure.LIC', query: 'Trademark>TA TM All Cases', brief: 'false' },
    { ipType: 'GeneralIP1Masters', license: 'WithoutGIP1.LIC', query: 'Patent>TA PA All Cases', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify query list in Query screen and Related Records modal with no permissions for the '${data.ipType}' ip type (Steps 1-6)`, async (t: TestController) => {
            let ipTypeQueries: string[];
            await app.step(`Get all ${data.ipType} queries (API)`, async () => {
                ipTypeQueries = await app.api.query.getAllQueriesWithPathForIpType(data.ipType);
            });
            await app.step(`Add license without ${data.ipType} to Default System Configuration (API)`, async () => {
                const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + data.license;
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.addLicenseFile(path);
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Verify query list`, async () => {
                await app.ui.queryBoard.kendoTreeview.expandAll();
                const allQueries = await app.ui.queryBoard.kendoTreeview.getAllElementsPaths();
                const intersection = app.services.array.getIntersection(allQueries, ipTypeQueries);

                await t
                    .expect(intersection.length === 0).ok(`The items [${intersection.join()}] of ip type '${data.ipType}' are displayed in Query List`);
            });
            await app.step(`Go to the '${data.query}' query and open the first record`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading();
            });
            await app.step(`Open the 'Related Records' child tab`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Related Records');
                await app.ui.waitLoading();
            });
            await app.step(`Click 'Add New' and verify query list`, async () => {
                await app.ui.dataEntryBoard.childRecord.addNew();
                await app.ui.waitLoading();
                const allQueries = await app.ui.addRelationshipsModal.kendoTreeview.getAllElementsPaths();
                const intersection = app.services.array.getIntersection(allQueries, ipTypeQueries);

                await t
                    .expect(intersection.length === 0).ok(`The items [${intersection.join()}] of ip type '${data.ipType}' are displayed in Query List`);
            });
        })
        .after(async () => {
            await app.step(`Return license with all permissions to Default System Configuration (API)`, async () => {
                const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.addLicenseFile(path);
            });
            await app.step(`Reset current user role`, async () => {
                app.ui.resetRole();
            });
        });
});

[
    { ipType: 'PatentMasters', license: 'WithoutPatents.LIC', page: 'Audit Log', url: 'UI/administration/audit-log', apiPage: 'auditLogQuery', brief: 'true' },
    { ipType: 'TrademarkMasters', license: 'WithoutTM.LIC', page: 'Deletion Management', url: 'UI/administration/deletion-management', apiPage: 'deletionManagementQuery', brief: 'false' },
    { ipType: 'DisclosureMasters', license: 'WithoutDisclosure.LIC', page: 'Global Change Log', url: 'UI/administration/global-change-log', apiPage: 'globalChangeLogQuery', brief: 'false' },
    { ipType: 'GeneralIP1Masters', license: 'WithoutGIP1.LIC', page: 'Message Center', url: 'UI/message-center', apiPage: 'messageCenterQuery', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify query list on the ${data.page} with no permissions for the ${data.ipType} ip type (Step 7)`, async (t: TestController) => {
            let ipTypeQueries: string[];
            await app.step(`Get all ${data.ipType} queries (API)`, async () => {
                ipTypeQueries = await app.api[data.apiPage].getAllQueriesWithPathForIpType(data.ipType);
            });
            await app.step(`Add license without ${data.ipType} to Default System Configuration (API)`, async () => {
                const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + data.license;
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.addLicenseFile(path);
            });
            await app.step(`Login to the ${data.page}`, async () => {
                await app.ui.getRole(undefined, data.url);
                await app.ui.waitLoading();
            });
            await app.step(`Verify query list`, async () => {
                await app.ui.queryBoard.kendoTreeview.expandAll();
                const allQueries = await app.ui.queryBoard.kendoTreeview.getAllElementsPaths();
                const intersection = app.services.array.getIntersection(allQueries, ipTypeQueries);

                await t
                    .expect(intersection.length === 0).ok(`The items [${intersection.join()}] of ip type '${data.ipType}' are displayed in Query List`);
            });
        })
        .after(async () => {
            await app.step(`Return license with all permissions to Default System Configuration (API)`, async () => {
                const path = app.services.os.path.resolve(__dirname, '../../../../support/license') + '\\' + 'AllPermissions.LIC';
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.addLicenseFile(path);
            });
            await app.step(`Reset current user role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        });
});
