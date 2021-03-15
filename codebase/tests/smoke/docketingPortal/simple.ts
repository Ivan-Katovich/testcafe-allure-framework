import app from '../../../app';
declare const test: any;
declare const globalConfig: any;

fixture `SMOKE.docketingPortal.pack. : Simple tests for Docketing Portal`
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
    .before(async (t) => {
        await app.step('Go to default logged in state', async () => {
            app.ui.resetRole();
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
    })
    ('Test 01: Verify Log in', async (t) => {
        await app.step('Check Global Header and Global Menu', async () => {
            await t
                .expect(await app.ui.header.isVisible('globalSearch')).ok()
                .expect(await app.ui.header.isVisible('externalWebLinks')).ok()
                .expect(await app.ui.header.isVisible('appSwitcher')).ok()
                .expect(await app.ui.header.isVisible('helpIcon')).ok()
                .expect(await app.ui.header.isVisible('notificationIcon')).ok()
                .expect(await app.ui.header.isVisible('userIcon')).ok()
                .expect(await app.ui.naviBar.isVisible('links', 'Query')).ok()
                .expect(await app.ui.naviBar.isVisible('links', 'Data Entry')).ok()
                .expect(await app.ui.naviBar.isVisible('links', 'Party')).ok()
                .expect(await app.ui.naviBar.isVisible('links', 'Reports')).ok()
                .expect(await app.ui.naviBar.isVisible('links', 'Audit')).ok()
                .expect(await app.ui.naviBar.isVisible('links', 'Collaboration Portal')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Verify User Badge', async () => {
            await app.ui.header.click('userIcon');
            await t
                .expect(await app.ui.kendoPopup.isVisible('navigationItems', 'Job Center')).ok()
                .expect(await app.ui.kendoPopup.isVisible('navigationItems', 'User Preferences')).ok()
                .expect(await app.ui.kendoPopup.isVisible('userName')).ok()
                .expect(await app.ui.kendoPopup.isVisible('signOutLink')).ok();
        });
        await app.step('Verify Footer', async () => {
            await t
                .expect(await app.ui.footer.isVisible('footerLinks', 'Help')).ok()
                .expect(await app.ui.footer.isVisible('footerLinks', 'Support')).ok()
                .expect(await app.ui.footer.isVisible('footerLinks', 'Privacy Policy')).ok()
                .expect(await app.ui.footer.isVisible('footerLinks', 'Terms of Use')).ok()
                .expect(await app.ui.footer.isVisible('ipRulesExpertiseIcon')).ok()
                .expect(await app.ui.footer.isVisible('copyrightMark')).ok();
        });
    });

test
    // .disablePageReloads
    // .only
    // .skip
    ('Test 02: Verify Message Center', async (t) => {
        await app.step('Click "Bell" notification icon', async () => {
            await app.ui.header.click('notificationIcon');
            await t.expect(await app.ui.kendoPopup.isVisible('contentLinks', 'Message Center')).ok();
        });
        await app.step('Click "Message Center" link', async () => {
            await app.ui.kendoPopup.click('contentLinks', 'Message Center');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('message-center')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Verify Query List section', async () => {
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Message Center>Pending Rules Validation')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Message Center>Review Messages')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Message Center>Rules Message Archive')).ok()
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible('Message Center>Rules Message Log')).ok();

        });
        await app.step('Run "Patents" query from "Pending Rules Validation" section', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Message Center>Pending Rules Validation>Patents');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.getText('queryName')).eql('Patents')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');

        });
        await app.step('Open any record from the list', async () => {
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.dataEntryBoard.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 03: Verify Query Management', async (t) => {
        app.ui.setCookie();
        await app.step('Save existing state', async () => {
            await app.ui.queryBoard.kendoTreeview.open('TM All Cases TA change');
            await app.ui.waitLoading();
            app.memory.current.array = await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray();
            await app.ui.queryBoard.openTree();
        });
        await app.step('Open Query Management modal window for query', async () => {
            await app.ui.queryBoard.kendoTreeview.modify('TM All Cases TA change');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryManagementModal.isVisible()).ok()
                .expect(await app.ui.queryManagementModal.isVisible('steps', 'Query')).ok()
                .expect(await app.ui.queryManagementModal.isVisible('steps', 'Build Criteria')).ok()
                .expect(await app.ui.queryManagementModal.isVisible('steps', 'Select Fields')).ok()
                .expect(await app.ui.queryManagementModal.isVisible('steps', 'Order Columns')).ok()
                .expect(await app.ui.queryManagementModal.isVisible('steps', 'Sort Results')).ok()
                .expect(await app.ui.queryManagementModal.isVisible('steps', 'Permissions')).ok()
                .expect(await app.ui.queryManagementModal.isVisible('steps', 'Preview')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Make changes on all sections', async () => {
            await app.ui.queryManagementModal.selectStep('Query');
            await app.ui.queryManagementModal.getField('Query Name').fill('Updated query');
            await app.ui.queryManagementModal.selectStep('Build Criteria');
            await t
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            await app.ui.queryManagementModal.criteriaBuilder.getRow(0).getField('Field Name', 'autocomplete').fill('Docket Number');
            await app.ui.queryManagementModal.criteriaBuilder.getRow(0).getField('Value', 'input').fill('test');
            await app.ui.queryManagementModal.selectStep('Select Fields');
            await app.ui.queryManagementModal.getField('Selected Fields', 'multiselect').removeItem('Create User');
            await app.ui.queryManagementModal.selectStep('Order Columns');
            await app.ui.queryManagementModal.sortFields('Create Date', 1, 'down');
        });
        await app.step('Save changes', async () => {
            await app.ui.queryManagementModal.save();
            await t.expect(await app.ui.queryManagementModal.getNotificationMessage()).eql('Save was successful.');
            await app.ui.queryManagementModal.close();
        });
        await app.step('Check that changes have been applied.', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Updated query');
            await app.ui.waitLoading();
            const actualArray = await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray();
            await t
                .expect(actualArray).notEql(app.memory.current.array)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
            const records = await app.ui.queryBoard.queryResultsGrid.getFirstColumnValues();
            for (let recordName of records) {
                await t.expect(recordName.toLowerCase()).contains('test');
            }
        });
    })
    .after(async (t) => {
        await app.step('Return Query to default state (API)', async () => {
            await app.api.query.setQueryOptions('trademark', 'ta change');
        });
        app.ui.resetRequestLogger();
    });

test
    // .disablePageReloads
    // .skip
    // .only
    .requestHooks(app.ui.requestLogger.createRecord)
    ('Test 04: Verify New Party DEF', async (t) => {
        await app.step('Open Party Data Entry form', async () => {
            await app.ui.naviBar.click('links', 'Party');
            await app.ui.kendoPopup.selectItem('New Party');
            await app.ui.waitLoading();
        });
        await app.step('Fill the data', async () => {
            const partyId = app.services.time.timestampShort();
            await app.ui.dataEntryBoard.getField('Party', 'input').fill(`party${partyId}SimpleS`);
            await app.ui.dataEntryBoard.selectChildRecord('Related Parties');
            await app.ui.dataEntryBoard.childRecord.click('addNewButton');
            const childAction = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
            await childAction.getField('Party Type', 'autocomplete').fill('Expe - (EXP)');
            await childAction.getField('CODE', 'input').fill(partyId.toString());
        });
        await app.step('Save form', async () => {
            await app.ui.dataEntryBoard.save();
            await t
                .expect(await app.ui.getNotificationMessage()).eql('Save was successful.')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        // await t.wait(10000);
    })
    .after(async (t) => {
        await app.step('Delete the records (API)', async () => {
            app.ui.setCookie('createRecord');
            try {
                const recordsToDelete = app.ui.requestLogger.createRecord.requests.map((req) => {
                    let code;
                    let partyTypeId;
                    JSON.parse(req.response.body).ActiveChildRecord.Data[0].Properties.forEach((prop) => {
                        if (prop.ColumnName && prop.ColumnName === 'CODE') {
                            code = prop.Value;
                        }
                        if (prop.ColumnName && prop.ColumnName === 'PARTYTYPEID') {
                            partyTypeId = prop.Value;
                        }
                    });
                    return {
                        Code: code,
                        PartyTypeId: partyTypeId,
                        PartyDetailId: JSON.parse(req.response.body).FilingSectionDefinition.RecordId
                    };
                });
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete, 'party');
            } catch (err) {}
        });
        app.ui.resetRequestLogger('createRecord');
    });

test
    // .disablePageReloads
    // .only
    ('Test 05: Verify Web Links', async (t) => {
        await app.step('Click on "External Web Links" icon', async () => {
            await app.ui.header.click('externalWebLinks');
        });
        await app.step('open link from sub-menu', async () => {
            await app.ui.kendoPopup.selectWebLink('TA WL testcafe');
            await t.expect(await app.ui.getCurrentUrl()).contains('testcafe');
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 6: Verify Reports', async (t) => {
        await app.step('Go to "Reports"', async () => {
            await app.ui.naviBar.click('links', 'Reports');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.reportBoard.isVisible('searchBox')).ok()
                .expect(await app.ui.reportBoard.kendoTreeview.isVisible()).ok()
                .expect(await app.ui.reportBoard.kendoTreeview.isItemVisible('Reports')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Run the Report', async () => {
            await app.ui.reportBoard.kendoTreeview.open('Reports>Patent Reports>Patent 30 Day Docket');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.reportPage.isVisible('crReportViewer')).ok()
                .expect(await app.ui.reportPage.get30DayReportTitleFromIframe()).contains('30')
                .expect(await app.ui.reportPage.get30DayReportTitleFromIframe()).contains('Day')
                .expect(await app.ui.reportPage.get30DayReportTitleFromIframe()).contains('Docket');
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 7: Verify Job Center', async (t) => {
        await app.step('Open User Badge -> Job Center', async () => {
            await app.ui.header.click('userIcon');
            await app.ui.kendoPopup.selectNavigationItem('Job Center');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.getCurrentUrl()).contains('job-center')
                .expect(await app.ui.queryBoard.isVisible()).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible()).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.getRecordsCount()).gt(0)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    });

test
    // .disablePageReloads
    // .only
    .requestHooks(app.ui.requestLogger.simple)
    ('Test 8: Verify User Preferences', async (t) => {
        app.ui.setCookie();
        await app.step('Open User Badge -> User Preferences', async () => {
            await app.ui.header.click('userIcon');
            await app.ui.kendoPopup.selectNavigationItem('User Preferences');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'General')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'Display Options')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'Default Culture')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'Record Management')).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Make changes in all sections', async () => {
            await app.ui.userPreferencesBoard.getField('Records Per Page', 'dropdown').fill('50');
            await app.ui.userPreferencesBoard.getField('Country / Region Display', 'radiobutton').fill('Codes');
            await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').check();
            await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').fill('PA All Cases');
        });
        await app.step('Save changes', async () => {
            await app.ui.userPreferencesBoard.save();
            await t.expect(await app.ui.getNotificationMessage()).eql('Save was successful.');
            await app.ui.refresh();
            await app.ui.waitLoading();
            // await t.wait(10000);
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Records Per Page', 'dropdown').getValue()).eql('50')
                .expect(await app.ui.userPreferencesBoard.getField('Country / Region Display', 'radiobutton').isSelected('Codes')).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').isChecked()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'autocomplete').getValue()).eql('PA All Cases')
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        app.ui.resetRequestLogger();
    });

test
    // .disablePageReloads
    // .only
    ('Test 9: Verify Sign out', async (t) => {
        await app.step('Sign out from the IP Docketing Portal', async () => {
            await app.ui.header.click('userIcon');
            await app.ui.kendoPopup.selectContentLink('Sign Out');
            // await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();
            await t.expect(await app.ui.getCurrentUrl()).contains(`${globalConfig.env.loginPageUrl}/${globalConfig.authType === 'enterprise' ? 'L' : 'l'}ogout`);
            // await app.ui.loginPage.signInAgain();
            // await t.expect(await app.ui.getCurrentUrl()).contains(`${globalConfig.env.loginPageUrl}/login`);
            // Commented cause of Bag: https://jira.***.com/browse/IPDP-8985
        });
    })
    .after(async (t) => {
        await app.step('Reset Role', async () => {
            app.ui.resetRole();
        });
    });

test
    // .disablePageReloads
    .requestHooks(app.ui.requestLogger.createQuery)
    // .only
    ('Test 10: Verify Create New Query', async (t) => {
        let queryName = `query${app.services.time.timestampShort()}Simple`;
        await app.step('Open Query Management modal window for a new query', async () => {
            await app.ui.queryBoard.createNewQuery();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryManagementModal.isVisible()).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Set required fields on all sections', async () => {
            await app.ui.queryManagementModal.getField('Query Name').fill(queryName);
            await app.ui.queryManagementModal.getField('Source', 'autocomplete').fill('QRYPA_MASTERTITLE');

            await app.ui.queryManagementModal.selectStep('Select Fields');
            await app.ui.queryManagementModal.getField('Selected Fields', 'multiselect').fill('Application Date');
            await app.ui.queryManagementModal.getField('Selected Fields', 'multiselect').fill('Docket Number');
            await app.ui.queryManagementModal.getField('Selected Fields', 'multiselect').fill('Description');
        });
        await app.step('Save query', async () => {
            await app.ui.queryManagementModal.save();
            await t.expect(await app.ui.queryManagementModal.getNotificationMessage()).eql('Save was successful.');
            await app.ui.queryManagementModal.close();
            app.ui.setCookie('createQuery');
        });
        await app.step('Check that new query was created', async () => {
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible(queryName)).ok()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
        await app.step('Delete query', async () => {
            await app.ui.queryBoard.kendoTreeview.modify(queryName);
            await app.ui.queryManagementModal.delete();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.modal.isVisible()).ok()
                .expect(await app.ui.modal.getText('confirmationMessage')).eql('Are you sure you want to delete the query?');
        });
        await app.step('Confirm deletion', async () => {
            await app.ui.modal.confirm();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.queryBoard.kendoTreeview.isItemVisible(queryName)).notOk()
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async (t) => {
        await app.step('Delete query (API)', async () => {
            try {
                let queryId = app.ui.getLastResponseBody('createQuery').ResourceId;
                await app.api.query.deleteQuery(queryId);
                app.ui.resetRequestLogger();
            } catch (err) {}
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 11: Verify Software version and Support modal info', async (t) => {
        await app.step('Open Support modal', async () => {
            await app.ui.footer.click('footerLinks', 'Support');
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.supportModal.isVisible()).ok();
        });
        await app.step('Verify Software version', async () => {
            // let supportRes = JSON.parse(app.ui.requestLogger.support.requests['last']().response.body);
            await t
                .expect(await app.ui.supportModal.getInfoRowValue('Software Version')).eql(globalConfig.version);
        });
        await app.step('Verify Content group', async () => {
            await t
                .expect(await app.ui.supportModal.getText('contentGroups')).eql(globalConfig.user.contentGroup);
        });
    });

test
    // .disablePageReloads
    // .only
    ('Test 12: Verify Locales', async (t) => {
        await app.step(`Set Culture (API)`, async () => {
            await app.api.login();
            await app.api.userPreferences.resetUserPreferences([ { property: 'DefaultCulture.Value', value: 'ja-JP' }]);
            app.ui.resetRole();
        });
        await app.step('Run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases TA filter');
            let consoleOutput;
            await app.services.time.wait(async () => {
                const spinner = await app.ui.checkSpinner();
                consoleOutput = await t.getBrowserConsoleMessages();
                const cleanLog = consoleOutput.log.length === 0;
                return !spinner || !cleanLog;
            }, {timeout: globalConfig.timeout.loading, interval: 2000});
            await t
                .expect(consoleOutput.log.length).eql(0)
                .expect(await app.ui.noErrors()).ok('A System Error thrown');
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
            app.ui.resetRole();
        });
    });
