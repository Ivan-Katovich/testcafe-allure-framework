import app from '../../../../app';
declare const globalConfig: any;

fixture`REGRESSION.globalSearch.pack - Test ID 31221: 07_Verify_GS without Permissions`
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
    (`Verify Global Search without permissions`, async (t: TestController) => {
        await app.step('Remove Global Search permissions in Content Group (API) (Step 1)', async () => {
            await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{
                name: 'Miscellaneous>Global Search',
                check: false
            }]);
        });
        await app.step('Login (Step 2)', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Verify Global Search field (Step 3)', async () => {
            await t
                .expect(await app.ui.header.isVisible('globalSearch')).notOk();
        });
    })
    .after(async () => {
        await app.step('Add Global Search permissions in Content Group (API)', async () => {
            await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [{
                name: 'Miscellaneous>Global Search',
                check: true
            }]);
        });
    });
