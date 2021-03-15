import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Verify Global Change Log`
    // .only
    // .page(`${globalConfig.env.url}/UI`)
    .meta('brief', 'true')
    .before(async () => {
        if (!globalConfig.brief) {
            await app.api.userPreferences.resetUserPreferences();
        }
    })
    .beforeEach(async (t) => {
        await app.step('Go to default logged in state', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 01: Verify Query', async (t) => {
        await app.step('Click on Audit -> Global Change Log', async () => {
            await app.ui.naviBar.click('links', 'Audit');
            await app.ui.kendoPopup.selectItem('Global Change Log');
            await app.ui.waitLoading();
            await t.expect(await app.ui.queryBoard.kendoTreeview.isVisible()).ok();
        });
        await app.step('Verify Query List section', async () => {
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Global Change Log')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.getItemsNumberByLevel(1)).eql(1)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Run "Patents Log"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Global Change Log>Patents Log');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.getText('queryName')).eql('Patents Log')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 03: Verify View Detail', async (t) => {
        await app.step('Click on Audit -> Global Change Log', async () => {
            await app.ui.naviBar.click('links', 'Audit');
            await app.ui.kendoPopup.selectItem('Global Change Log');
            await app.ui.waitLoading();
        });
        await app.step('Run "Patents Log"', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Global Change Log>Patents Log');
            await app.ui.waitLoading();
        });
        await app.step('Select 1st record', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
            const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
            app.memory.current.recordName = await row.getValue('Docket Number');
        });
        await app.step('Click "View Detail"', async () => {
            await app.ui.queryBoard.click('menuItems', 'View Detail');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.globalChangeModal.isVisible()).ok()
                .expect(await app.ui.globalChangeModal.getText('title')).eql('Global Change Detail')
                .expect(await app.ui.globalChangeModal.getInfo()).contains(app.memory.current.recordName)
                .expect(await app.ui.globalChangeModal.isVisible('grid')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });
