import { RequestMock } from 'testcafe';
import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.userPreferences.pack. - Test ID 29981: User Preferences - apply Default Report`
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
    (`Verify the Default Report is empty and not executed for a new user (Steps 2-4)`, async (t: TestController) => {
        await app.step(`Delete the 'Default Report' setting in User Parameters table (Database)`, async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'DEFAULT_REPORT_RESOURCEID'`, { closeConnection: true });
        });
        await app.step(`Clear cache (API)`, async () => {
            await app.api.clearCache();
        });
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').isVisible()).ok();
        });
        await app.step(`Verify 'Default Report' field is blank`, async () => {
            const actualValue = await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue();
            await t
                .expect(actualValue).eql('');
        });
        await app.step(`Go to Reports page and verify no report is selected and run`, async () => {
            await app.ui.naviBar.click('links', 'Reports');
            await app.ui.waitLoading({checkErrors: true});
            const selectedReport = await app.ui.reportBoard.kendoTreeview.getAllSelectedItemsNames();
            await t
                .expect(await app.ui.getCurrentUrl()).notContains('ReportViewer')
                .expect(await app.ui.reportBoard.kendoTreeview.isItemVisible('Reports')).ok()
                .expect(await app.ui.reportBoard.kendoTreeview.isVisible()).ok()
                .expect(selectedReport).eql([]);
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step(`Reset role (API)`, async () => {
            await app.ui.resetRole(undefined, 'UI/user-preferences');
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Assign the 'Patent 30 Day Docket' as a Default Report in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultReport', value: 1026 }]); // 1026 = id of 'Patent 30 Day Docket' report
        });
    })
    (`Verify the Default Report is executed if assigned in User Preferences (Steps 5-10)`, async (t: TestController) => {
        await app.step('Login', async () => {
        await app.ui.getRole();
        await app.ui.waitLoading({checkErrors: true});
            });
        await app.step(`Go to Reports page and verify the default report is run (Step 6)`, async () => {
            await app.ui.naviBar.click('links', 'Reports');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.reportPage.isVisible('crReportViewer')).ok()
                .expect(await app.ui.reportPage.getReportTitleFromIframe()).contains('30 Day Docket');
        });
        // New version of TestCafe with support for multiple tabs is required to verify steps 7-9 of this test scenario
        await app.step(`Set another Default report in User Preferences (Step 10)`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI/user-preferences`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').fill('Open Trademark Actions');
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.', { timeout: 1000 })
                .expect(await app.ui.userPreferencesBoard.getField('Default Report', 'autocomplete').getValue()).eql('Open Trademark Actions');
        });
        await app.step(`Go to Reports page and verify the new default report is run`, async () => {
            await app.ui.naviBar.click('links', 'Reports');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.reportPage.isVisible('crReportViewer')).ok()
                .expect(await app.ui.reportPage.getReportTitleFromIframe()).contains('Open Actions');
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step(`Reset role (API)`, async () => {
            await app.ui.resetRole();
        });
    });

test
    // .only
    .meta('brief', 'false')
    .before(async () => {
        await app.step(`Assign the 'Patent 30 Day Docket' as a Default Report in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultReport', value: 1026 }]); // 1026 = id of 'Patent 30 Day Docket' report
        });
    })
    (`Verify the Default Report is run on login when 'Reports' page is opened via a direct link (Step 11)`, async (t: TestController) => {
        await app.ui.getRole(undefined, 'UI/reports');
        await app.ui.waitLoading({checkErrors: true});
        await t
                .expect(await app.ui.reportPage.isVisible('crReportViewer')).ok()
                .expect(await app.ui.reportPage.getReportTitleFromIframe()).contains('30 Day Docket');
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step(`Reset role (API)`, async () => {
            await app.ui.resetRole(undefined, 'UI/reports');
        });
    });

const userContentGroup = globalConfig.user.contentGroup;

test
    // .only
    .meta('brief', 'true')
    (`Verify the Default Report is not executed without permissions (Steps 12-13)`, async (t: TestController) => {
        await app.step(`Assign the 'Patent 30 Day Docket' as a Default Report in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultReport', value: 1026 }]); // 1026 = id of 'Patent 30 Day Docket' report
        });
        await app.step(`Change content group '${userContentGroup}': remove permission to the default 'Patent 30 Day Docket' report (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermission('Reports>Patent 30 Day Docket', false);
            await cg.save();
        });
        await app.step(`Login and verify the Reports page`, async () => {
            await app.ui.getRole(undefined, 'UI/reports');
            await app.ui.waitLoading();
            const selectedReport = await app.ui.reportBoard.kendoTreeview.getAllSelectedItemsNames();
            await t
                .expect(await app.ui.getCurrentUrl()).notContains('ReportViewer')
                .expect(await app.ui.reportBoard.kendoTreeview.isVisible()).ok()
                .expect(await app.ui.reportBoard.kendoTreeview.isItemVisible('Reports')).ok()
                .expect(await app.ui.reportBoard.kendoTreeview.isItemVisible('Reports>Patent Reports>Patent 30 Day Docket')).notOk()
                .expect(selectedReport).eql([]);
        });
    })
    .after(async () => {
        await app.step(`Set default permissions for '${userContentGroup}' (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(userContentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step(`Reset role (API)`, async () => {
            await app.ui.resetRole(undefined, 'UI/reports');
        });
    });
