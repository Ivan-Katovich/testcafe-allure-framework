import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.queryList&Results.pack. - Test ID 29986: Query - Query Results - IPType queries - overview`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
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
            name: 'Patent',
            ipType: 'Patent',
            query: 'Patent>PA All Cases',
            ipTypeName: 'PatentMasters',
            brief: 'true'
        },
        {
            name: 'Trademark',
            ipType: 'Trademark',
            query: 'Trademark>TM All Cases',
            ipTypeName: 'TrademarkMasters',
            brief: 'false'
        },
        {
            name: 'Disclosure',
            ipType: 'Disclosure',
            query: 'Disclosure>DS All Cases',
            ipTypeName: 'DisclosureMasters',
            brief: 'false'
        },
        {
            name: 'GeneralIP',
            ipType: 'GeneralIP',
            query: 'GeneralIP1>GIP1 All Cases',
            ipTypeName: 'GeneralIP1Masters',
            brief: 'false'
        },
        {
            name: 'Actions',
            ipType: 'Patent',
            query: 'Patent>PA All Actions',
            ipTypeName: 'PatentMasters',
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
            await app.step('Create Precondition queries (API)', async () => {
                app.memory.current.props = [
                    {image: false, link: true},
                    {image: true, link: true},
                    {image: false, link: false},
                    {image: true, link: false}
                ];
                let additionalProps = [];
                if (data.name === 'Actions') {
                    additionalProps = [
                        {path: 'QueryMetadata>From', value: 'QRYPA_MASTERTITLEACTIONS'},
                        {path: 'QueryMetadata>Source', value: 'QRYPA_MASTERTITLEACTIONS'}
                    ];
                }
                for (let prop of app.memory.current.props) {
                    let modifier = app.services.modifiers.changeProperties([
                        {path: 'QueryMetadata>DisplayCaseImage', value: prop.image},
                        {path: 'QueryMetadata>DataModificationFormApplicable', value: prop.link},
                        ...additionalProps
                    ]);
                    const name = `TA ${data.name} image_${prop.image} link_${prop.link}`;
                    app.memory.current.names.push(name);
                    let queryData = await app.api.query.createPreconditionQuery(
                        data.ipType,
                        name,
                        {id: globalConfig.user.contentGroupId, name: globalConfig.user.contentGroup},
                        null, modifier
                    );
                    if (queryData) {
                        app.memory.current.ids.push(queryData.ResourceId);
                    }
                }
            });
        })
        (`Verify queries with different combinations of Display Primary Case Image and Data Modification Applicable (Step 2 - ${data.name})`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Check queries', async () => {
                for (let i = 0; i < app.memory.current.names.length; i++) {
                    await app.ui.queryBoard.openTree();
                    await t.expect(await app.ui.queryBoard.kendoTreeview.isItemVisible(app.memory.current.names[i])).ok();
                    await app.ui.queryBoard.kendoTreeview.open(app.memory.current.names[i]);
                    await app.ui.waitLoading({checkErrors: true});
                    await t
                        .expect(await app.ui.queryBoard.isEnabled('menuItems', 'More')).ok()
                        .expect(await app.ui.queryBoard.queryResultsGrid.isFirstColumnHyperlink()).eql(app.memory.current.props[i].link)
                        .expect(await app.ui.queryBoard.queryResultsGrid.isFirstColumnImage()).eql(app.memory.current.props[i].image);
                }
            });
        })
        .after(async () => {
            await app.step('Delete Precondition queries (API)', async () => {
                if (app.memory.current.ids.length !== 4) {
                    await app.api.query.getAllQueries();
                    app.memory.current.ids = await app.api.query.getQueryIds(app.memory.current.names);
                }
                for (let id of app.memory.current.ids) {
                    await app.api.query.deleteQuery(id);
                }
                app.memory.reset();
            }, {isSkipped: false});
        });
});

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify More button (Step 3 - ${data.name})`, async (t) => {
            const iconClasses = {
                'Collaborate': {iconClass: 'fa-object-group', hasArrow: true},
                'Duplicate': {iconClass: 'fa-clone', hasArrow: true},
                'Email': {iconClass: 'fa-envelope', hasArrow: true},
                'Form Letter': {iconClass: 'fa-wpforms', hasArrow: true},
                'Global Change': {iconClass: 'fa-random', hasArrow: true},
                'Print': {iconClass: 'fa-print', hasArrow: false},
                'Process Rules': {iconClass: 'fa-certificate', hasArrow: false},
                'Relationship Graphic': {iconClass: 'fa-code-fork', hasArrow: false},
                'Report': {iconClass: 'fa-file-image-o', hasArrow: false},
                'Variable Link': {iconClass: 'fa-external-link', hasArrow: true},
                'Delete': {iconClass: 'fa-trash', hasArrow: false}
            };
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Run a ${data.name} query`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify More dropdown (step 3)', async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
                await app.ui.queryBoard.click('menuItems', 'More');
                const items = await app.ui.kendoPopup.getAllItemsText();
                await t
                    .expect(items).eql(Object.keys(iconClasses));
                for (let i = 0; i < items.length; i++) {
                    const iconLeft = await app.ui.kendoPopup.getElementLeft('simpleIcons', i);
                    const iconWidth = await app.ui.kendoPopup.getElementWidth('simpleIcons', i);
                    const textLeft = await app.ui.kendoPopup.getElementLeft('simpleItemNames', i);
                    await t
                        .expect(iconLeft + iconWidth).lte(textLeft)
                        .expect(await app.ui.kendoPopup.isItemWithArrow(i)).eql(iconClasses[items[i]].hasArrow)
                        .expect(await app.ui.kendoPopup.isItemWithIcon(i)).ok()
                        .expect(await app.ui.kendoPopup.getItemIconClass(items[i])).contains(iconClasses[items[i]].iconClass);
                }
            });
        });
});

test
    // .only
    .meta('brief', 'true')
    (`Verify second flyout amd modal dialogue (Step 4-5)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run a Patent query query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(`Patent>PA All Cases TA filter`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open More dropdown', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await app.ui.queryBoard.click('menuItems', 'More');
        });
        await app.step('Verify first flyout width (step 4)', async () => {
            const count = await app.ui.kendoPopup.getCount('simpleItems');
            const widthArr = [];
            for (let i = 0; i < count; i++) {
                widthArr.push(await app.ui.kendoPopup.getItemWidth(i));
            }
            const maxWidth = Math.max(...widthArr);
            await t
                .expect(await app.ui.kendoPopup.getElementWidth()).within(maxWidth + 17, maxWidth + 19);
        });
        await app.step('Verify second flyout (step 4)', async () => {
            await app.ui.kendoPopup.selectItem('Email');
            const parentHeight = await app.ui.kendoPopup.getElementHeight();
            const childHeight = await app.ui.kendoPopup.child.getElementHeight();
            await t
                .expect(await app.ui.kendoPopup.child.isVisible()).ok()
                .expect(childHeight).gte(384);
            if (parentHeight > 384) {
                await t.expect(childHeight).eql(parentHeight);
            } else {
                await t.expect(childHeight).eql(384);
            }
            await app.ui.header.click('mainLogo');
            await t.expect(await app.ui.kendoPopup.isPresent()).notOk();
        });
        await app.step('Open More dropdown', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await app.ui.queryBoard.click('menuItems', 'More');
        });
        await app.step('Verify modal window (step 5)', async () => {
            await app.ui.kendoPopup.selectItem('Duplicate');
            await app.ui.kendoPopup.child.selectItem(0);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.duplicationModal.isVisible('title')).ok()
                .expect(await app.ui.duplicationModal.isVisible('cross')).ok()
                .expect(await app.ui.duplicationModal.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.duplicationModal.isVisible('buttons', 'Reset')).ok()
                .expect(await app.ui.duplicationModal.isVisible('buttons', 'Create')).ok();
            await app.ui.resizeWindow({width: 1280, height: 1000});
            await t
                .expect(await app.ui.duplicationModal.isVisible('title')).ok()
                .expect(await app.ui.duplicationModal.isVisible('cross')).ok()
                .expect(await app.ui.duplicationModal.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.duplicationModal.isVisible('buttons', 'Reset')).ok()
                .expect(await app.ui.duplicationModal.isVisible('buttons', 'Create')).ok();
            const viewPortHeight = await app.ui.duplicationModal.getElementHeight('viewPort');
            const viewPortWidth = await app.ui.duplicationModal.getElementWidth('viewPort');
            let modalHeight = await app.ui.duplicationModal.getElementHeight('window');
            let modalWidth = await app.ui.duplicationModal.getElementWidth('window');
            await t
                .expect(await app.ui.duplicationModal.isVisible()).ok()
                .expect(parseInt((modalHeight / viewPortHeight * 100).toFixed(0))).eql(80)
                .expect(parseInt((modalWidth / viewPortWidth * 100).toFixed(0))).eql(80);
            await app.ui.resizeWindow({width: 700, height: 500});
            await t
                .expect(await app.ui.duplicationModal.isVisible('title')).ok()
                .expect(await app.ui.duplicationModal.isVisible('cross')).ok()
                .expect(await app.ui.duplicationModal.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.duplicationModal.isVisible('buttons', 'Reset')).ok()
                .expect(await app.ui.duplicationModal.isVisible('buttons', 'Create')).ok();
            modalHeight = await app.ui.duplicationModal.getElementHeight('window');
            modalWidth = await app.ui.duplicationModal.getElementWidth('window');
            await t
                .expect(modalHeight).within(598, 602)
                .expect(modalWidth).within(798, 802);
        });
    })
    .after(async () => {
        await app.step('Set default window size', async () => {
            await app.ui.resizeWindow();
        }, {isSkipped: false});
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify modal responsiveness (Step 6)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run a Patent query query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(`Patent>PA All Cases TA filter`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open More dropdown', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await app.ui.queryBoard.click('menuItems', 'More');
        });
        await app.step('Verify Email Preview modal (step 6.1)', async () => {
            await app.ui.kendoPopup.selectItem('Email');
            await app.ui.kendoPopup.child.selectItem(0);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(await app.ui.emailModal.isVisible('title')).ok()
                .expect(await app.ui.emailModal.isVisible('cross')).ok()
                .expect(await app.ui.emailModal.isVisible('help')).ok()
                .expect(await app.ui.emailModal.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.emailModal.isVisible('buttons', 'Send')).ok();
            await app.ui.resizeWindow({width: 1280, height: 1000});
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(await app.ui.emailModal.isVisible('title')).ok()
                .expect(await app.ui.emailModal.isVisible('cross')).ok()
                .expect(await app.ui.emailModal.isVisible('help')).ok()
                .expect(await app.ui.emailModal.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.emailModal.isVisible('buttons', 'Send')).ok();
            const viewPortHeight = await app.ui.emailModal.getElementHeight('viewPort');
            const viewPortWidth = await app.ui.emailModal.getElementWidth('viewPort');
            let modalHeight = await app.ui.emailModal.getElementHeight('window');
            let modalWidth = await app.ui.emailModal.getElementWidth('window');
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(parseInt((modalHeight / viewPortHeight * 100).toFixed(0))).eql(80)
                .expect(parseInt((modalWidth / viewPortWidth * 100).toFixed(0))).eql(80);
            await app.ui.resizeWindow({width: 700, height: 500});
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(await app.ui.emailModal.isVisible('title')).ok()
                .expect(await app.ui.emailModal.isVisible('cross')).ok()
                .expect(await app.ui.emailModal.isVisible('help')).ok()
                .expect(await app.ui.emailModal.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.emailModal.isVisible('buttons', 'Send')).ok();
            modalHeight = await app.ui.emailModal.getElementHeight('window');
            modalWidth = await app.ui.emailModal.getElementWidth('window');
            await t
                .expect(modalHeight).within(598, 602)
                .expect(modalWidth).within(798, 802);
            await app.ui.resizeWindow();
        });
        await app.step('Verify Email Add Party To (step 6.2)', async () => {
            await app.ui.emailModal.click('addPartyToTo');
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(await app.ui.emailModal.isVisible('cross')).ok()
                .expect(await app.ui.emailModal.isVisible('partyButtons', 'Cancel')).ok()
                .expect(await app.ui.emailModal.isVisible('partyButtons', 'Add')).ok();
            await app.ui.resizeWindow({width: 1280, height: 1000});
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(await app.ui.emailModal.isVisible('cross')).ok()
                .expect(await app.ui.emailModal.isVisible('partyButtons', 'Cancel')).ok()
                .expect(await app.ui.emailModal.isVisible('partyButtons', 'Add')).ok();
            const viewPortHeight = await app.ui.emailModal.getElementHeight('viewPort');
            const viewPortWidth = await app.ui.emailModal.getElementWidth('viewPort');
            let modalHeight = await app.ui.emailModal.getElementHeight('window');
            let modalWidth = await app.ui.emailModal.getElementWidth('window');
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(parseInt((modalHeight / viewPortHeight * 100).toFixed(0))).eql(80)
                .expect(parseInt((modalWidth / viewPortWidth * 100).toFixed(0))).eql(80);
            await app.ui.resizeWindow({width: 700, height: 500});
            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(await app.ui.emailModal.isVisible('cross')).ok()
                .expect(await app.ui.emailModal.isVisible('partyButtons', 'Cancel')).ok()
                .expect(await app.ui.emailModal.isVisible('partyButtons', 'Add')).ok();
            modalHeight = await app.ui.emailModal.getElementHeight('window');
            modalWidth = await app.ui.emailModal.getElementWidth('window');
            await t
                .expect(modalHeight).within(598, 602)
                .expect(modalWidth).within(798, 802);
            await app.ui.resizeWindow();
        });
        await app.step('Close Email Modal', async () => {
            await app.ui.emailModal.close();
            await app.ui.emailModal.close();
        });
        await app.step('Open More dropdown', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await app.ui.queryBoard.click('menuItems', 'More');
        });
        await app.step('Verify Global Change modal (step 6.3)', async () => {
            await app.ui.kendoPopup.selectItem('Global Change');
            await app.ui.kendoPopup.child.selectItem(0);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.globalChangeDialog.isVisible()).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('title')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('help')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('cross')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Cancel')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Duplicate')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Preview')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Execute')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Reset')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Save')).ok();
            await app.ui.resizeWindow({width: 1280, height: 1000});
            await t
                .expect(await app.ui.globalChangeDialog.isVisible()).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('title')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('help')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('cross')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Cancel')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Duplicate')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Preview')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Execute')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Reset')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Save')).ok();
            const viewPortHeight = await app.ui.globalChangeDialog.getElementHeight('viewPort');
            const viewPortWidth = await app.ui.globalChangeDialog.getElementWidth('viewPort');
            let modalHeight = await app.ui.globalChangeDialog.getElementHeight('window');
            let modalWidth = await app.ui.globalChangeDialog.getElementWidth('window');
            await t
                .expect(await app.ui.globalChangeDialog.isVisible()).ok()
                .expect(parseInt((modalHeight / viewPortHeight * 100).toFixed(0))).eql(80)
                .expect(parseInt((modalWidth / viewPortWidth * 100).toFixed(0))).eql(80);
            await app.ui.resizeWindow({width: 700, height: 500});
            await t
                .expect(await app.ui.globalChangeDialog.isVisible()).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('title')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('help')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('cross')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Cancel')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Duplicate')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Preview')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Execute')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Reset')).ok()
                .expect(await app.ui.globalChangeDialog.isVisible('footerButtons', 'Save')).ok();
            modalHeight = await app.ui.globalChangeDialog.getElementHeight('window');
            modalWidth = await app.ui.globalChangeDialog.getElementWidth('window');
            await t
                .expect(modalHeight).within(598, 602)
                .expect(modalWidth).within(798, 802);
            await app.ui.resizeWindow();
        });
        await app.step('Close Global Change dialogue', async () => {
            await app.ui.globalChangeDialog.close();
        });
        await app.step('Open More dropdown', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await app.ui.queryBoard.click('menuItems', 'More');
        });
        await app.step('Verify Report modal (step 6.4)', async () => {
            await app.ui.kendoPopup.selectItem('Report');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.reportModal.isVisible()).ok()
                .expect(await app.ui.reportModal.isVisible('title')).ok()
                .expect(await app.ui.reportModal.isVisible('help')).ok()
                .expect(await app.ui.reportModal.isVisible('cross')).ok()
                .expect(await app.ui.reportModal.isVisible('buttons', 'Close')).ok();
            await app.ui.resizeWindow({width: 1280, height: 1000});
            await t
                .expect(await app.ui.reportModal.isVisible()).ok()
                .expect(await app.ui.reportModal.isVisible('title')).ok()
                .expect(await app.ui.reportModal.isVisible('help')).ok()
                .expect(await app.ui.reportModal.isVisible('cross')).ok()
                .expect(await app.ui.reportModal.isVisible('buttons', 'Close')).ok();
            const viewPortHeight = await app.ui.reportModal.getElementHeight('viewPort');
            const viewPortWidth = await app.ui.reportModal.getElementWidth('viewPort');
            let modalHeight = await app.ui.reportModal.getElementHeight('window');
            let modalWidth = await app.ui.reportModal.getElementWidth('window');
            await t
                .expect(await app.ui.reportModal.isVisible()).ok()
                .expect(parseInt((modalHeight / viewPortHeight * 100).toFixed(0))).eql(80)
                .expect(parseInt((modalWidth / viewPortWidth * 100).toFixed(0))).eql(80);
            await app.ui.resizeWindow({width: 700, height: 500});
            await t
                .expect(await app.ui.reportModal.isVisible()).ok()
                .expect(await app.ui.reportModal.isVisible('title')).ok()
                .expect(await app.ui.reportModal.isVisible('help')).ok()
                .expect(await app.ui.reportModal.isVisible('cross')).ok()
                .expect(await app.ui.reportModal.isVisible('buttons', 'Close')).ok();
            modalHeight = await app.ui.reportModal.getElementHeight('window');
            modalWidth = await app.ui.reportModal.getElementWidth('window');
            await t
                .expect(modalHeight).within(598, 602)
                .expect(modalWidth).within(798, 802);
            await app.ui.resizeWindow();
        });
        await app.step('Close Report modal', async () => {
            await app.ui.reportModal.close();
        });
        await app.step('Open a Record', async () => {
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify Add Relations modal (step 6.5)', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Related Records');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.addRelationshipsModal.isVisible()).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('title')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('help')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('cross')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('buttons', 'Add as')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('buttons', 'Close')).ok();
            await app.ui.resizeWindow({width: 1280, height: 1000});
            await t
                .expect(await app.ui.addRelationshipsModal.isVisible()).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('title')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('help')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('cross')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('buttons', 'Add as')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('buttons', 'Close')).ok();
            const viewPortHeight = await app.ui.addRelationshipsModal.getElementHeight('viewPort');
            const viewPortWidth = await app.ui.addRelationshipsModal.getElementWidth('viewPort');
            let modalHeight = await app.ui.addRelationshipsModal.getElementHeight('window');
            let modalWidth = await app.ui.addRelationshipsModal.getElementWidth('window');
            await t
                .expect(await app.ui.addRelationshipsModal.isVisible()).ok()
                .expect(parseInt((modalHeight / viewPortHeight * 100).toFixed(0))).eql(80)
                .expect(parseInt((modalWidth / viewPortWidth * 100).toFixed(0))).eql(80);
            await app.ui.resizeWindow({width: 700, height: 500});
            await t
                .expect(await app.ui.addRelationshipsModal.isVisible()).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('title')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('help')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('cross')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('buttons', 'Add as')).ok()
                .expect(await app.ui.addRelationshipsModal.isVisible('buttons', 'Close')).ok();
            modalHeight = await app.ui.addRelationshipsModal.getElementHeight('window');
            modalWidth = await app.ui.addRelationshipsModal.getElementWidth('window');
            await t
                .expect(modalHeight).within(598, 602)
                .expect(modalWidth).within(798, 802);
            await app.ui.resizeWindow();
        });
        await app.step('Close Add Relationships modal', async () => {
            await app.ui.addRelationshipsModal.close();
        });
        await app.step('Verify External Files modal (step 6.6)', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('External Files');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.dataEntryBoard.childRecord.addNew();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.externalFilesModal.isVisible()).ok()
                .expect(await app.ui.externalFilesModal.isVisible('title')).ok()
                .expect(await app.ui.externalFilesModal.isVisible('cross')).ok()
                .expect(await app.ui.externalFilesModal.isVisible('buttons', 'Add')).ok()
                .expect(await app.ui.externalFilesModal.isVisible('buttons', 'Close')).ok();
            await app.ui.resizeWindow({width: 1280, height: 1000});
            await t
                .expect(await app.ui.externalFilesModal.isVisible()).ok()
                .expect(await app.ui.externalFilesModal.isVisible('title')).ok()
                .expect(await app.ui.externalFilesModal.isVisible('cross')).ok()
                .expect(await app.ui.externalFilesModal.isVisible('buttons', 'Add')).ok()
                .expect(await app.ui.externalFilesModal.isVisible('buttons', 'Close')).ok();
            const viewPortHeight = await app.ui.externalFilesModal.getElementHeight('viewPort');
            const viewPortWidth = await app.ui.externalFilesModal.getElementWidth('viewPort');
            let modalHeight = await app.ui.externalFilesModal.getElementHeight('window');
            let modalWidth = await app.ui.externalFilesModal.getElementWidth('window');
            await t
                .expect(await app.ui.externalFilesModal.isVisible()).ok()
                .expect(parseInt((modalHeight / viewPortHeight * 100).toFixed(0))).eql(80)
                .expect(parseInt((modalWidth / viewPortWidth * 100).toFixed(0))).eql(80);
            await app.ui.resizeWindow({width: 700, height: 500});
            await t
                .expect(await app.ui.externalFilesModal.isVisible()).ok()
                .expect(await app.ui.externalFilesModal.isVisible('title')).ok()
                .expect(await app.ui.externalFilesModal.isVisible('cross')).ok()
                .expect(await app.ui.externalFilesModal.isVisible('buttons', 'Add')).ok()
                .expect(await app.ui.externalFilesModal.isVisible('buttons', 'Close')).ok();
            modalHeight = await app.ui.externalFilesModal.getElementHeight('window');
            modalWidth = await app.ui.externalFilesModal.getElementWidth('window');
            await t
                .expect(modalHeight).within(598, 602)
                .expect(modalWidth).within(798, 802);
            await app.ui.resizeWindow();
        });
        // PAIR matching skipped
    })
    .after(async () => {
        await app.step('Set default window size', async () => {
            await app.ui.resizeWindow();
        }, {isSkipped: false});
    });

test
    // .only
    .meta('brief', 'true')
    .before(async (t) => {
        await app.step('Set default query with auto execute (API)', async () => {
            app.memory.reset();
            await app.api.query.getAllQueries();
            app.memory.current.array = await app.api.query.getQueryIds(['Patent>PA All Cases']);
            await app.api.userPreferences.resetUserPreferences([
                {property: 'DefaultQuery', value: app.memory.current.array[0]},
                {property: 'AutoExecuteQueries', value: true}
            ]);
        });
    })
    (`Verify Auto-execute default query (Step 7,10,11)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Auto-execute query', async () => {
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.getCurrentQueryName()).eql('PA All Cases');
        });
        await app.step('Check selected query in treeview', async () => {
            await app.ui.queryBoard.openTree();
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.getSelectedItemName()).eql('PA All Cases');
        });
        await app.step('Run a another query query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(`Patent>PA All Cases TA filter`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify query after clicking "query" menu item', async () => {
            await app.ui.naviBar.click('links', 'Query');
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.getCurrentQueryName()).eql('PA All Cases TA filter');
        });
        await app.step('Disable permissions for CG (API)', async () => {
            await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [
                {name: 'Query>PA All Cases', check: false}
            ]);
        }, {isSkipped: false});
        await app.step('Check default query execution', async () => {
            await app.ui.navigate();
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.getCurrentUrl()).eql(`${globalConfig.env.url}/UI/queries`)
                .expect(await app.ui.queryBoard.queryResultsGrid.isPresent()).notOk()
                .expect(await app.ui.queryBoard.isPresent('securityError')).notOk()
                .expect(await app.ui.queryBoard.getText('emptyPlaceholder'))
                .eql('Please select a query to view the results.');
        });
    })
    .after(async (t) => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step('Set permissions default (API)', async () => {
            await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
            await app.api.administration.contentGroup.setPermissionDefaults();
            await app.api.administration.contentGroup.save();
            await app.api.administration.clearCache();
        }, {isSkipped: false});
    });

dataSet.forEach((data, index) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async (t) => {
            await app.step('Create Precondition queries (API)', async () => {
                app.memory.current.props = [
                    {image: false, link: true},
                    {image: true, link: true}
                ];
                let additionalProps = [];
                if (data.name === 'Actions') {
                    additionalProps = [
                        {path: 'QueryMetadata>From', value: 'QRYPA_MASTERTITLEACTIONS'},
                        {path: 'QueryMetadata>Source', value: 'QRYPA_MASTERTITLEACTIONS'}
                    ];
                }
                for (let prop of app.memory.current.props) {
                    let modifier = app.services.modifiers.changeProperties([
                        {path: 'QueryMetadata>DisplayCaseImage', value: prop.image},
                        {path: 'QueryMetadata>DataModificationFormApplicable', value: prop.link},
                        ...additionalProps
                    ]);
                    const name = `TA ${data.name} image_${prop.image} link_${prop.link}`;
                    app.memory.current.names.push(name);
                    let queryData = await app.api.query.createPreconditionQuery(
                        data.ipType,
                        name,
                        {id: globalConfig.user.contentGroupId, name: globalConfig.user.contentGroup},
                        null, modifier
                    );
                    if (queryData) {
                        app.memory.current.ids.push(queryData.ResourceId);
                    }
                }
            }, {isSkipped: false});
            await app.step('Unselect all the RM forms for the IP Type (API)', async () => {
                const customTemplateNames = (await app.api.administration.getAllDataEntryTemplates())
                    .Items.filter((x) => x.IPTypeName === data.ipTypeName).map((x) => x.CustomResourceName);
                const contentGroup = app.api.administration.contentGroup;
                await contentGroup.openContentGroup(globalConfig.user.contentGroup);
                await contentGroup.setPermissionForIpType('Record Management Form', data.ipTypeName, false);
                for (let name of customTemplateNames) {
                    contentGroup.setPermission('Record Management Form' + '>' + name, false);
                }
                await contentGroup.save();
            }, {isSkipped: false});
        })
        (`Verify Queries hyperlink (Step 8 - ${data.name})`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Check queries', async () => {
                for (let name of app.memory.current.names) {
                    await app.ui.queryBoard.openTree();
                    await app.ui.queryBoard.kendoTreeview.open(name);
                    await app.ui.waitLoading({checkErrors: true});
                    await t
                        .expect(await app.ui.queryBoard.queryResultsGrid.isFirstColumnHyperlink()).notOk();
                }
            });

        })
        .after(async () => {
            await app.step('Delete Precondition queries (API)', async () => {
                if (app.memory.current.ids.length !== 2) {
                    await app.api.query.getAllQueries();
                    app.memory.current.ids = await app.api.query.getQueryIds(app.memory.current.names);
                }
                for (let id of app.memory.current.ids) {
                    await app.api.query.deleteQuery(id);
                }
                app.memory.reset();
            }, {isSkipped: false});
            await app.step('Set permissions default (API)', async () => {
                await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
                await app.api.administration.contentGroup.setPermissionDefaults();
                await app.api.administration.contentGroup.save();
                await app.api.administration.clearCache();
            }, {isSkipped: false});
        });
});

test
    // .only
    .meta('brief', 'true')
    .before(async (t) => {
        await app.step('Disable permissions for CG (API)', async () => {
            await app.api.changePermissionsInContentGroup(globalConfig.user.contentGroup, [
                {name: 'Disable Options>Disable Rules', check: true},
                {name: 'Duplicate Record Template', check: false},
                {name: 'Email Template', check: false},
                {name: 'Form Letter', check: false},
                {name: 'Variable Links', check: false},
                {name: 'Reports', check: false}
            ]);
        }, {isSkipped: false});
        await app.step('Disable Delete permission for IPtype in CG (API)', async () => {
            await app.api.changeApplicationSecurityInContentGroup(globalConfig.user.contentGroup, [
                {Path: 'PatentMasters', EditPermission: true, VisiblePermission: true, deletePermission: false}
            ]);
        }, {isSkipped: false});
        await app.step('Change ownership for processes (API)', async () => {
            const processes = await app.api.administration.processDesigner.getAllProcesses();
            app.memory.current.array = processes.filter((process) => {
                return process.OwnerName === globalConfig.user.contentGroup;
            });
            for (let process of app.memory.current.array) {
                await app.api.administration.processDesigner.open(process.CustomResourceName);
                await app.api.administration.processDesigner.setOwner(null);
                await app.api.administration.processDesigner.save();
            }
        }, {isSkipped: false});
    })
    (`Verify More menu with disabled permissions (Step 9)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run a Patent query query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(`Patent>PA All Cases TA filter`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify More dropdown (step 9)', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await app.ui.queryBoard.click('menuItems', 'More');
            const items = await app.ui.kendoPopup.getAllItemsText();
            await t
                .expect(items).eql(['Global Change', 'Print', 'Relationship Graphic', 'Delete']);
        });

    })
    .after(async () => {
        await app.step('Set CG defaults (API)', async () => {
            await app.api.administration.contentGroup.openContentGroup(globalConfig.user.contentGroup);
            await app.api.administration.contentGroup.setPermissionDefaults();
            await app.api.administration.contentGroup.setAppSecurityDefaults();
            await app.api.administration.contentGroup.save();
            await app.api.administration.clearCache();
        }, {isSkipped: false});
        await app.step('Return ownership for processes (API)', async () => {
            for (let process of app.memory.current.array) {
                await app.api.administration.processDesigner.open(process.CustomResourceName);
                await app.api.administration.processDesigner.setOwner(globalConfig.user.contentGroup);
                await app.api.administration.processDesigner.save();
            }
        }, {isSkipped: false});
    });

test
    // .only
    .meta('brief', 'true')
    .meta('category', 'Display Configuration')
    .before(async () => {
        await app.step('Change display configuration for user (API)', async () => {
            app.ui.resetRole();
            await app.api.changeDisplayConfigurationForUser('TA Query Display Configuration', globalConfig.user.userName);
        });
        await app.step('Create Patent record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
    })
    (`Query Results - Ip Type Query - Verify Display Configuration (Step 12)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        }, {isSkipped: false});
        await app.step('Run a Patent query query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(`Patent>PA All Cases Image !!!`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Query Board Items', async () => {
            await t
                .expect(await app.ui.queryBoard.getText('boardName')).contains('!!!')
                .expect(await app.ui.queryBoard.getText('queryName')).contains('!!!')
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).contains('!!!');
            for (let i = 0; i < await app.ui.queryBoard.getCount('menuItems'); i++) {
                await t.expect(await app.ui.queryBoard.getText('menuItems', i)).contains('!!!');
            }
            await app.ui.queryBoard.click('menuItems', 'View in');
            const items = await app.ui.kendoPopup.getAllItemsText();
            const item = items.find((i) => i.includes('TA') && i.includes('!!!'));
            await t
                .expect(item).ok();
            await app.ui.queryBoard.click('menuItems', 'View in');
            await app.ui.queryBoard.hover('questionCircle');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).contains('!!!');
        });
        await app.step('Verify More Menu Items', async () => {
            await app.ui.queryBoard.queryResultsGrid.getCheckbox(5).check();
            await app.ui.queryBoard.click('menuItems', 'More');
            const items = await app.ui.kendoPopup.getAllItemsText();
            for (let item of items) {
                await t.expect(item).contains('!!!');
            }
        });
        await app.step('Verify Resources', async () => {
            const parentItems = ['Collaborate', 'Duplicate', 'Email', 'Form Letter', 'Global Change', 'Variable Link'];
            for (let parent of parentItems) {
                await app.ui.kendoPopup.selectItem(parent);
                const items = await app.ui.kendoPopup.child.getAllItemsText();
                const item = items.find((i) => i.includes('TA') && i.includes('!!!'));
                await t
                    .expect(item).ok();
            }
        });
        await app.step('Verify Grid Header Items', async () => {
            const columns = await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray();
            const columnNames = columns.map((column) => column.text);
            await t
                .expect(columnNames).contains('Primary Case Image !!!')
                .expect(columnNames).contains('Docket Number !!!')
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('filters', 2)).contains('Filter !!!');
        });
        await app.step('Verify a value in results', async () => {
            const countries = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Country / Region');
            const country = countries.find((c) => c.includes('!!!'));
            await t
                .expect(country).ok();
        });
    })
    .after(async () => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
        await app.step('Change display configuration to default (API)', async () => {
            await app.api.changeDisplayConfigurationForUser('Default Display Configuration 1', globalConfig.user.userName);
            app.ui.resetRole();
        });
    });
