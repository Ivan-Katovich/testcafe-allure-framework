import app from '../../../../app';

fixture`REGRESSION.userPreferences.pack. - Test ID 29963: User Preferences - apply Date Format to DEF and Query`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Change Default Culture and Date Format in User Preferences (Steps 2-5) - Cancel`, async (t: TestController) => {
        let cultureBefore: string;
        let dateFormatBefore: string;
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            cultureBefore = await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue();
            dateFormatBefore = await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue();
        });
        await app.step(`Change Default Culture`, async () => {
            await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').expand();
            const newValue = (await app.ui.kendoPopup.getAllItemsText()).find((x) => x !== cultureBefore);
            await app.ui.kendoPopup.selectItem(newValue);

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(newValue);
        });
        await app.step(`Change Date Format`, async () => {
            await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').expand();
            const newValue = (await app.ui.kendoPopup.getAllItemsText()).find((x) => x !== dateFormatBefore);
            await app.ui.kendoPopup.selectItem(newValue);

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(newValue);
        });
        await app.step(`Save User Preferences`, async () => {
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('The selection of a different culture requires you to sign out of the application. Do you want to continue with this action?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Continue')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step(`Click 'Cancel' on the confirmation modal`, async () => {
            await app.ui.confirmationModal.cancel();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(cultureBefore);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Change Default Culture and Date Format in User Preferences (Steps 2-5) - Continue`, async (t: TestController) => {
        let cultureBefore: string;
        let dateFormatBefore: string;
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            cultureBefore = await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue();
            dateFormatBefore = await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue();
        });
        await app.step(`Change Default Culture`, async () => {
            await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').expand();
            const newValue = (await app.ui.kendoPopup.getAllItemsText()).find((x) => x !== cultureBefore);
            await app.ui.kendoPopup.selectItem(newValue);

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(newValue);
        });
        await app.step(`Change Date Format`, async () => {
            await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').expand();
            const newValue = (await app.ui.kendoPopup.getAllItemsText()).find((x) => x !== dateFormatBefore);
            await app.ui.kendoPopup.selectItem(newValue);

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(newValue);
        });
        await app.step(`Save User Preferences`, async () => {
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();
        });
        await app.step(`Click 'Continue' on the confirmation modal`, async () => {
            await app.ui.confirmationModal.click('buttons', 'Continue');
            await app.ui.waitLoading();

            await t
                .expect((await app.ui.getCurrentUrl()).toLowerCase()).contains('logout');
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

[
    { page: 'Query', url: 'UI/queries', query: 'Patent>TA PA All Cases', field: 'Create Date', culture: 'de-DE', dateFormat: 'dd.MM.yyyy' },
    { page: 'Party', url: 'UI/party/queries', query: 'Party>Party Query', field: 'Parties_Create Date', culture: 'en-GB', dateFormat: 'dd MMMM yyyy' },
    { page: 'Audit Log', url: 'UI/administration/audit-log', query: 'Audit Log>GeneralIP1 Audit Query', field: 'Audit Date', culture: 'en-US', dateFormat: 'd, MMMM, yyyy' },
    { page: 'Deletion Management', url: 'UI/administration/deletion-management', query: 'Deletion Management>Disclosure Deleted Query', field: 'Deletion Date', culture: 'ja-JP', dateFormat: 'yyyy年M月d日' },
    { page: 'Global Change Log', url: 'UI/administration/global-change-log', query: 'Global Change Log>Patents Log', field: 'Create Date', culture: 'sv-SE', dateFormat: 'yy-MM-dd' },
    { page: 'Message Center', url: 'UI/message-center', query: 'Message Center>Review Messages>Patents', field: 'Create Date', culture: 'zh-CN', dateFormat: 'yyyy/MM/dd' }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step(`Set Culture to '${data.culture}' and Date Format to '${data.dateFormat}' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: data.culture },
                    { property: 'DateFormat.Value', value: data.dateFormat }
                ]);
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        })
        (`Verify Date Format in Criteria Builder (Step 6): page - '${data.page}', culture - '${data.culture}', date format - '${data.dateFormat}' `, async (t: TestController) => {
            await app.step(`Login and go to the '${data.page}' page`, async () => {
                await app.ui.getRole(undefined, data.url);
                await app.ui.waitLoading();
            });
            await app.step(`Run query '${data.query}'`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();

                if (!await app.ui.noErrors()) {
                    await app.ui.refresh();
                    await app.ui.waitLoading();
                }
            });
            await app.step(`Open Criteria Builder`, async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
            });
            await app.step(`Verify tooltip for '${data.field}' in the Criteria Builder`, async () => {
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(data.field);
                const datepicker = await row.getField('Value', 'datepicker');
                const tooltip = await datepicker.getAttribute('input', 'placeholder');

                await t
                    .expect(tooltip).eql(data.dateFormat);
            });
            await app.step(`Verify date format for '${data.field}' in the Criteria Builder`, async () => {
                const expectedValue = app.services.time.today(data.dateFormat.toUpperCase());
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                const datepicker = await row.getField('Value', 'datepicker');
                await datepicker.expand();
                await datepicker.selectToday();
                const actualValue = await datepicker.getValue();

                await t
                    .expect(actualValue).eql(expectedValue);
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        });
});

[
    { page: 'Query', url: 'UI/queries', query: 'Patent>TA PA All Cases', field: 'Create Date', culture: 'de-DE', dateFormat: 'dd. MMM yyyy', step: 10 },
    { page: 'Party', url: 'UI/party/queries', query: 'Party>Party Query', field: 'Parties_Create Date', culture: 'en-GB', dateFormat: 'yyyy-MM-dd', step: 12 },
    { page: 'Audit Log', url: 'UI/administration/audit-log', query: 'Audit Log>GeneralIP1 Audit Query', field: 'Audit Date', culture: 'en-US', dateFormat: 'M/d/yy', step: 15 },
    { page: 'Deletion Management', url: 'UI/administration/deletion-management', query: 'Deletion Management>Disclosure Deleted Query', field: 'Deletion Date', culture: 'ja-JP', dateFormat: 'yyyy年MM月dd日', step: 15 },
    { page: 'Global Change Log', url: 'UI/administration/global-change-log', query: 'Global Change Log>TradeMark Log', field: 'Create Date', culture: 'sv-SE', dateFormat: 'yyyy-MM-dd', step: 16 },
    { page: 'Message Center', url: 'UI/message-center', query: 'Message Center>Review Messages>Patents', field: 'Create Date', culture: 'zh-CN', dateFormat: 'yyyy年M月d日', step: 13 }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step(`Set Culture to '${data.culture}' and Date Format to '${data.dateFormat}' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: data.culture },
                    { property: 'DateFormat.Value', value: data.dateFormat }
                ]);
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        })
        (`Verify Criteria Builder filter is applied in audit field in the grid (Step 7, ${data.step}): page - '${data.page}', culture - '${data.culture}', date format - '${data.dateFormat}'`, async (t: TestController) => {
            let expectedDate: string;
            await app.step(`Login and go to the '${data.page}' page`, async () => {
                await app.ui.getRole(undefined, data.url);
                await app.ui.waitLoading();
            });
            await app.step(`Run query '${data.query}'`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
                if (!(await app.ui.noErrors())) {
                    await app.ui.refresh();
                    await app.ui.waitLoading();
                }
            });
            await app.step(`Open Criteria Builder`, async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
            });
            await app.step(`Add criteria in Criteria Builder`, async () => {
                const firstRecordValue = await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.field);
                expectedDate = app.services.time.moment(firstRecordValue, `${data.dateFormat.toUpperCase()} HH:mm:ss`, true).format(data.dateFormat.toUpperCase());
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(data.field);
                const datepicker = await row.getField('Value', 'datepicker');
                await datepicker.fill(expectedDate);
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step(`Verify date format in the grid`, async () => {
                const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();

                for (let index = 0; index < recordCount; index++) {
                    const row = await app.ui.queryBoard.queryResultsGrid.getRecord(index);
                    const actualValue = await row.getValue(data.field);

                    await t
                        .expect(app.services.time.moment(actualValue, `${data.dateFormat.toUpperCase()} HH:mm:ss`, true).format(data.dateFormat.toUpperCase())).eql(expectedDate);
                }
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        });
});

[
    { page: 'Query', url: 'UI/queries', query: 'Patent>TA PA All Cases', field: 'Create Date', culture: 'de-DE', dateFormat: 'yyyy-MM-dd', step: 10 },
    { page: 'Party', url: 'UI/party/queries', query: 'Party>Party Query', field: 'Parties_Create Date', culture: 'en-GB', dateFormat: 'd.MM.yy', step: 12 },
    { page: 'Audit Log', url: 'UI/administration/audit-log', query: 'Audit Log>GeneralIP1 Audit Query', field: 'Audit Date', culture: 'en-US', dateFormat: 'dd-MMM-yy', step: 15 },
    { page: 'Deletion Management', url: 'UI/administration/deletion-management', query: 'Deletion Management>Disclosure Deleted Query', field: 'Deletion Date', culture: 'ja-JP', dateFormat: 'yyyy/M/d', step: 15 },
    { page: 'Global Change Log', url: 'UI/administration/global-change-log', query: 'Global Change Log>TradeMark Log', field: 'Create Date', culture: 'sv-SE', dateFormat: 'yy-MM-dd', step: 16 },
    { page: 'Message Center', url: 'UI/message-center', query: 'Message Center>Review Messages>Patents', field: 'Create Date', culture: 'zh-CN', dateFormat: 'yy.M.d', step: 13 },
    { page: 'Job Center', url: 'UI/job-center', query: null, field: 'AUDITTIME', culture: 'en-US', dateFormat: 'M/d/yyyy', step: 14 }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step(`Set Culture to '${data.culture}' and Date Format to '${data.dateFormat}' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: data.culture },
                    { property: 'DateFormat.Value', value: data.dateFormat }
                ]);
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        })
        (`Verify Date Format in audit field in the grid (Step 7, ${data.step}): page - '${data.page}', culture - '${data.culture}', date format - '${data.dateFormat}'`, async (t: TestController) => {
            await app.step(`Login and go to the '${data.page}' page`, async () => {
                await app.ui.getRole(undefined, data.url);
                await app.ui.waitLoading();
            });
            await app.step(`Run query '${data.query}'`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
                if (!(await app.ui.noErrors())) {
                    await app.ui.refresh();
                    await app.ui.waitLoading();
                }
            }, { isSkipped: !data.query });
            await app.step(`Verify date format in the grid`, async () => {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
                const actualValue = await row.getValue(data.field);

                await t
                    .expect(app.services.time.matchDateFormat(actualValue, `${data.dateFormat.toUpperCase()} HH:mm:ss`)).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        });
});

[
    { page: 'Query', url: 'UI/queries', query: 'Patent>TA PA All Cases', fields: { nonaudit: 'Expiration Date', audit: 'Create Date' }, culture: 'de-DE', dateFormat: 'dd.MM.yyyy' },
    { page: 'Party', url: 'UI/party/queries', query: 'Party>Party Query', fields: { nonaudit: 'Custom Date #1', audit: 'Parties_Create Date' }, culture: 'en-GB', dateFormat: 'dd MMMM yyyy' }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step(`Set Culture to '${data.culture}' and Date Format to '${data.dateFormat}' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: data.culture },
                    { property: 'DateFormat.Value', value: data.dateFormat }
                ]);
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        })
        (`Verify Date Format in audit and non-audit field in the grid (Step 8-9): page - '${data.page}', culture - '${data.culture}', date format - '${data.dateFormat}'`, async (t: TestController) => {
            await app.step(`Login and go to the '${data.page}' page`, async () => {
                await app.ui.getRole(undefined, data.url);
                await app.ui.waitLoading();
            });
            await app.step(`Run query '${data.query}'`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step(`Open Criteria Builder`, async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
            });
            await app.step(`Add criteria in Criteria Builder`, async () => {
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(data.fields.nonaudit);
                await row.getField('Operator', 'dropdown').fill('Is Not Null');
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step(`Verify date format of the '${data.fields.nonaudit}' field`, async () => {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
                const actualValue = await row.getValue(data.fields.nonaudit);

                await t
                    .expect(app.services.time.matchDateFormat(actualValue, data.dateFormat.toUpperCase())).ok();
            });
            await app.step(`Verify date format of the '${data.fields.audit}' field`, async () => {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
                const actualValue = await row.getValue(data.fields.audit);

                await t
                    .expect(app.services.time.matchDateFormat(actualValue, `${data.dateFormat.toUpperCase()} HH:mm:ss`)).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        });
});

[{ page: 'Query', url: 'UI/queries', query: 'Patent>TA PA All Cases', field: 'Expiration Date', culture: 'de-DE', dateFormat: 'dd.MM.yy' }]
    .forEach(async (data) => {
        test
            // .only
            .meta('brief', 'true')
            .before(async () => {
                await app.step(`Set Culture to '${data.culture}' and Date Format to '${data.dateFormat}' in User Preferences (API)`, async () => {
                    await app.api.userPreferences.resetUserPreferences([
                        { property: 'DefaultCulture.Value', value: data.culture },
                        { property: 'DateFormat.Value', value: data.dateFormat }
                    ]);
                });
                await app.step(`Reset role`, async () => {
                    app.ui.resetRole(undefined, data.url);
                });
            })
            (`Verify Date Format in the grid filter (Step 10): page - '${data.page}', culture - '${data.culture}', date format - '${data.dateFormat}'`, async (t: TestController) => {
                await app.step(`Login and go to the '${data.page}' page`, async () => {
                    await app.ui.getRole(undefined, data.url);
                    await app.ui.waitLoading();
                });
                await app.step(`Run query '${data.query}'`, async () => {
                    await app.ui.queryBoard.kendoTreeview.open(data.query);
                    await app.ui.waitLoading();
                });
                await app.step(`Open filter for the '${data.field}' column`, async () => {
                    await app.ui.queryBoard.queryResultsGrid.openFilter(data.field);
                });
                await app.step(`Verify tooltip in the grid filter`, async () => {
                    const filter = await app.ui.kendoPopup.getFilter('input');
                    const datepicker = await filter.getCriteriaField('datepicker');
                    const tooltip = await datepicker.getAttribute('input', 'placeholder');

                    await t
                        .expect(tooltip).eql(data.dateFormat);
                });
                await app.step(`Verify date format in the grid filter`, async () => {
                    const filter = await app.ui.kendoPopup.getFilter('input');
                    const datepicker = await filter.getCriteriaField('datepicker');
                    await datepicker.expand();
                    await datepicker.selectToday();
                    const value = await datepicker.getValue();

                    await t
                        .expect(app.services.time.matchDateFormat(value, data.dateFormat.toUpperCase())).ok();
                });
            })
            .after(async () => {
                await app.step('Reset User Preferences (API)', async () => {
                    await app.api.userPreferences.resetUserPreferences();
                });
                await app.step(`Reset role`, async () => {
                    app.ui.resetRole(undefined, data.url);
                });
            });
    });

[
    { culture: 'zh-CN', dateFormat: 'yyyy/M/d', type: 'patent', field: 'Application Date', auditField: 'Create Date', brief: 'true' },
    { culture: 'zh-CN', dateFormat: 'yyyy-MM-dd', type: 'trademark', field: 'Substatus Date', auditField: 'Create Date', brief: 'false' },
    { culture: 'zh-CN', dateFormat: 'yy.MM.dd', type: 'disclosure', field: 'Target Filing Date', auditField: 'Create Date', brief: 'false' },
    { culture: 'zh-CN', dateFormat: 'yyyy年M月d日', type: 'generalip', field: 'Start Date', auditField: 'Create Date', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Set Culture to '${data.culture}' and Date Format to '${data.dateFormat}' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: data.culture },
                    { property: 'DateFormat.Value', value: data.dateFormat }
                ]);
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole();
            });
        })
        (`Verify Date Format in the filing section of the Data Entry Form page (Step 11.1 - ${data.type})`, async (t: TestController) => {
            await app.step(`Create a patent record (API)`, async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.type, 'simple');
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Open created record`, async () => {
                await app.ui.openDataEntryRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await app.ui.waitLoading();
            });
            await app.step(`Verify tooltip of the ${data.field}`, async () => {
                const tooltip = await app.ui.dataEntryBoard.getField(data.field, 'datepicker').getAttribute('input', 'placeholder');

                await t
                    .expect(tooltip).eql(data.dateFormat);
            });
            await app.step(`Verify date format of the ${data.field}`, async () => {
                const expectedValue = app.services.time.today(data.dateFormat.toUpperCase());
                await app.ui.dataEntryBoard.getField(data.field, 'datepicker').expand();
                await app.ui.dataEntryBoard.getField(data.field, 'datepicker').selectToday();
                const actualValue = await app.ui.dataEntryBoard.getField(data.field, 'datepicker').getValue();

                await t
                    .expect(expectedValue).eql(actualValue);
            });
            await app.step(`Verify audit field ${data.auditField}`, async () => {
                const value = await app.ui.dataEntryBoard.getField(data.auditField).getLockedValue();

                await t
                    .expect(app.services.time.matchDateFormat(value, `${data.dateFormat.toUpperCase()} HH:mm:ss`)).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Delete created record (API)`, async () => {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole();
            });
        });
});

[
    { culture: 'ja-JP', dateFormat: 'yyyy/M/d', type: 'patent', child: 'Expenses', field: 'Expense Date', auditField: 'Create Date', brief: 'true' },
    { culture: 'ja-JP', dateFormat: 'yyyy-MM-dd', type: 'trademark', child: 'Expenses', field: 'Expense Date', auditField: 'Create Date', brief: 'false' },
    { culture: 'ja-JP', dateFormat: 'yy/M/d', type: 'disclosure', child: 'Expenses', field: 'Expense Date', auditField: 'Create Date', brief: 'false' },
    { culture: 'ja-JP', dateFormat: 'yyyy年MM月dd日', type: 'generalip', child: 'Expenses', field: 'Expense Date', auditField: 'Create Date', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Set Culture to '${data.culture}' and Date Format to '${data.dateFormat}' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: data.culture },
                    { property: 'DateFormat.Value', value: data.dateFormat }
                ]);
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole();
            });
        })
        (`Verify Date Format in the child section of the Data Entry Form page (Step 11.2-3 - ${data.type})`, async (t: TestController) => {
            await app.step(`Create a patent record and add record to the '${data.child}' child (API)`, async () => {
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.type, 'simple');
                await app.api.dataEntryForm.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await app.api.dataEntryForm.openChild(data.child);
                app.api.dataEntryForm.addChildRecord();
                await app.api.dataEntryForm.setChildValue(data.field, app.services.time.today(data.dateFormat.toUpperCase()));
                await app.api.dataEntryForm.save();
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Open created record`, async () => {
                await app.ui.openDataEntryRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await app.ui.waitLoading();
            });
            await app.step(`Open the '${data.child}' child`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading();
            });
            await app.step(`Verify date format in the child grids (Step 11.2)`, async () => {
                const expectedValue = app.services.time.today(data.dateFormat.toUpperCase());
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const actualValue = await row.getValue(data.field);

                await t
                    .expect(actualValue).eql(expectedValue);
            });
            await app.step(`Verify date format in child grid filter (Step 11.3)`, async () => {
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const value = await row.getValue(data.auditField);

                await t
                    .expect(app.services.time.matchDateFormat(value, `${data.dateFormat.toUpperCase()} HH:mm:ss`)).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Delete created record (API)`, async () => {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole();
            });
        });
});

[{ process: 'Action Process for TA (Disclosure)', task: 'RM', field: 'Disclosures_Create Date', culture: 'en-GB', dateFormat: 'd.M.yy' }]
    .forEach((data) => {
        test
            // .only
            .meta('brief', 'true')
            .before(async () => {
                await app.step(`Set Culture to '${data.culture}' and Date Format to '${data.dateFormat}' in User Preferences (API)`, async () => {
                    await app.api.userPreferences.resetUserPreferences([
                        { property: 'DefaultCulture.Value', value: data.culture },
                        { property: 'DateFormat.Value', value: data.dateFormat }
                    ]);
                });
                await app.step(`Reset role`, async () => {
                    app.ui.resetRole(undefined, 'UI/collaboration');
                });
            })
            (`Verify Date Format on the Collaboration Portal (Step 17)`, async (t: TestController) => {
                await app.step(`Login and go to the 'Collaboration Portal' page`, async () => {
                    await app.ui.getRole(undefined, 'UI/collaboration');
                    await app.ui.waitLoading();
                });
                await app.step(`Open the '${data.process}' task in the '${data.task}' process`, async () => {
                    await app.ui.collaborationBoard.getProcess(data.process).getTask(data.task).open();
                    await app.ui.waitLoading();
                });
                await app.step(`Verify date format of the '${data.field}' in the grid`, async () => {
                    const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
                    const value = await row.getValue(data.field);

                    await t
                        .expect(app.services.time.matchDateFormat(value, `${data.dateFormat.toUpperCase()} HH:mm:ss`)).ok();
                });
                await app.step(`Verify tooltip in the grid filter of the '${data.field}' column`, async () => {
                    const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.field);
                    const datepicker = await filter.getCriteriaField('datepicker');
                    const tooltip = await datepicker.getAttribute('input', 'placeholder');

                    await t
                        .expect(tooltip).eql(data.dateFormat);
                });
                await app.step(`Verify date format in the grid filter of the '${data.field}' column`, async () => {
                    const filter = await app.ui.kendoPopup.getFilter('input');
                    const datepicker = await filter.getCriteriaField('datepicker');
                    await datepicker.expand();
                    await datepicker.selectToday();
                    const value = await datepicker.getValue();

                    await t
                        .expect(app.services.time.matchDateFormat(value, data.dateFormat.toUpperCase())).ok();
                });
            })
            .after(async () => {
                await app.step('Reset User Preferences (API)', async () => {
                    await app.api.userPreferences.resetUserPreferences();
                });
                await app.step(`Reset role`, async () => {
                    app.ui.resetRole(undefined, 'UI/collaboration');
                });
            });
    });

/*
    Steps 19-22:
    Culture and Date Format fields in User Preferences
    are already verified in Test ID 29964: User Preferences - Hosted - Default Culture (see defaultCulture.ts)
*/

[
    { page: 'Query', url: 'UI/queries', query: 'Patent>TA PA All Cases', field: 'Create Date', culture: 'de-DE', dateFormat: 'yyyy-MM-dd', brief: 'true' },
    { page: 'Party', url: 'UI/party/queries', query: 'Party>Party Query', field: 'Parties_Create Date', culture: 'en-GB', dateFormat: 'd.MM.yy', brief: 'false' },
    { page: 'Audit Log', url: 'UI/administration/audit-log', query: 'Audit Log>GeneralIP1 Audit Query', field: 'Audit Date', culture: 'en-US', dateFormat: 'dd-MMM-yy', brief: 'false' },
    { page: 'Deletion Management', url: 'UI/administration/deletion-management', query: 'Deletion Management>Disclosure Deleted Query', field: 'Deletion Date', culture: 'ja-JP', dateFormat: 'yyyy/M/d', brief: 'false' },
    { page: 'Global Change Log', url: 'UI/administration/global-change-log', query: 'Global Change Log>TradeMark Log', field: 'Create Date', culture: 'sv-SE', dateFormat: 'yy-MM-dd', brief: 'false' },
    { page: 'Message Center', url: 'UI/message-center', query: 'Message Center>Review Messages>Patents', field: 'Create Date', culture: 'zh-CN', dateFormat: 'yy.M.d', brief: 'false' }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Set Culture to 'en-US' and Date Format to 'MM/dd/yyyy' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: 'en-US' },
                    { property: 'DateFormat.Value', value: 'MM/dd/yyyy' }
                ]);
            });
            await app.step(`Set Culture to '${data.culture}' and Date Format to '${data.dateFormat}' in Default System Configuration and lock (API)`, async () => {
                const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                await userPref.setDefaultCulture(data.culture);
                userPref.setCultureLocked(true);
                await userPref.setDefaultDateFormat(data.dateFormat);
                userPref.setDateFormatLocked(true);
                await userPref.save();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        })
        (`Verify locked Culture and Date Format (Step 20): page - '${data.page}', culture - '${data.culture}', date format - '${data.dateFormat}'`, async (t: TestController) => {
            await app.step(`Login and go to the '${data.page}' page`, async () => {
                await app.ui.getRole(undefined, data.url);
                await app.ui.waitLoading();
            });
            await app.step(`Run query '${data.query}'`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
                if (!(await app.ui.noErrors())) {
                    await app.ui.refresh();
                    await app.ui.waitLoading();
                }
            }, { isSkipped: !data.query });
            await app.step(`Verify date format in the grid`, async () => {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
                const actualValue = await row.getValue(data.field);

                await t
                    .expect(app.services.time.matchDateFormat(actualValue, `${data.dateFormat.toUpperCase()} HH:mm:ss`)).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
            await app.step(`Unlock Default Culture and Date Format in Default System Configuration (API)`, async () => {
                const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                userPref.setCultureLocked(false);
                userPref.setDateFormatLocked(false);
                await userPref.save();
            });
        });
});

[
    { page: 'Query', url: 'UI/queries', query: 'Patent>TA PA All Cases', field: 'Create Date', sysConfig: { culture: 'de-DE', dateFormat: 'yyyy-MM-dd' }, userPref: { culture: 'en-GB', dateFormat: 'd.MM.yy' }, brief: 'true' },
    { page: 'Party', url: 'UI/party/queries', query: 'Party>Party Query', field: 'Parties_Create Date', sysConfig: { culture: 'en-GB', dateFormat: 'd.MM.yy' }, userPref: { culture: 'zh-CN', dateFormat: 'yy.M.d' }, brief: 'false' },
    { page: 'Audit Log', url: 'UI/administration/audit-log', query: 'Audit Log>GeneralIP1 Audit Query', field: 'Audit Date', sysConfig: { culture: 'en-US', dateFormat: 'dd-MMM-yy' }, userPref: { culture: 'ja-JP', dateFormat: 'yyyy/M/d' }, brief: 'false' },
    { page: 'Deletion Management', url: 'UI/administration/deletion-management', query: 'Deletion Management>Disclosure Deleted Query', field: 'Deletion Date', sysConfig: { culture: 'ja-JP', dateFormat: 'yyyy/M/d' }, userPref: { culture: 'sv-SE', dateFormat: 'yy-MM-dd' }, brief: 'false' },
    { page: 'Global Change Log', url: 'UI/administration/global-change-log', query: 'Global Change Log>TradeMark Log', field: 'Create Date', sysConfig: { culture: 'sv-SE', dateFormat: 'yy-MM-dd' }, userPref: { culture: 'en-US', dateFormat: 'dd-MMM-yy' }, brief: 'false' },
    { page: 'Message Center', url: 'UI/message-center', query: 'Message Center>Review Messages>Patents', field: 'Create Date', sysConfig: { culture: 'zh-CN', dateFormat: 'yy.M.d' }, userPref: { culture: 'de-DE', dateFormat: 'd. MMMM yyyy' }, brief: 'false' }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Set Culture to '${data.userPref.culture}' and Date Format to '${data.userPref.dateFormat}' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: data.userPref.culture },
                    { property: 'DateFormat.Value', value: data.userPref.dateFormat }
                ]);
            });
            await app.step(`Set Culture to '${data.sysConfig.culture}' and Date Format to '${data.sysConfig.dateFormat}' in Default System Configuration and lock (API)`, async () => {
                const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                await userPref.setDefaultCulture(data.sysConfig.culture);
                userPref.setCultureLocked(true);
                await userPref.setDefaultDateFormat(data.sysConfig.dateFormat);
                await userPref.save();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        })
        (`Verify locked Culture (Step 21): page - '${data.page}', culture - '${data.sysConfig.culture}', date format - '${data.sysConfig.dateFormat}'`, async (t: TestController) => {
            await app.step(`Login and go to the '${data.page}' page`, async () => {
                await app.ui.getRole(undefined, data.url);
                await app.ui.waitLoading();
            });
            await app.step(`Run query '${data.query}'`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
                if (!(await app.ui.noErrors())) {
                    await app.ui.refresh();
                    await app.ui.waitLoading();
                }
            }, { isSkipped: !data.query });
            await app.step(`Verify date format in the grid`, async () => {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
                const actualValue = await row.getValue(data.field);

                await t
                    .expect(app.services.time.matchDateFormat(actualValue, `${data.sysConfig.dateFormat.toUpperCase()} HH:mm:ss`)).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
            await app.step(`Unlock Default Culture and Date Format in Default System Configuration (API)`, async () => {
                const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                userPref.setCultureLocked(false);
                await userPref.save();
            });
        });
});

[
    { page: 'Query', url: 'UI/queries', query: 'Patent>TA PA All Cases', field: 'Create Date', sysConfig: { culture: 'de-DE', dateFormat: 'yyyy-MM-dd' }, userPref: { culture: 'en-GB', dateFormat: 'd.MM.yy' }, brief: 'true' },
    { page: 'Party', url: 'UI/party/queries', query: 'Party>Party Query', field: 'Parties_Create Date', sysConfig: { culture: 'en-GB', dateFormat: 'd.M.yy' }, userPref: { culture: 'zh-CN', dateFormat: 'yy.M.d' }, brief: 'false' },
    { page: 'Audit Log', url: 'UI/administration/audit-log', query: 'Audit Log>GeneralIP1 Audit Query', field: 'Audit Date', sysConfig: { culture: 'en-US', dateFormat: 'dd-MMM-yy' }, userPref: { culture: 'ja-JP', dateFormat: 'yyyy/M/d' }, brief: 'false' },
    { page: 'Deletion Management', url: 'UI/administration/deletion-management', query: 'Deletion Management>Disclosure Deleted Query', field: 'Deletion Date', sysConfig: { culture: 'ja-JP', dateFormat: 'yyyy/M/d' }, userPref: { culture: 'sv-SE', dateFormat: 'yy-MM-dd' }, brief: 'false' },
    { page: 'Global Change Log', url: 'UI/administration/global-change-log', query: 'Global Change Log>TradeMark Log', field: 'Create Date', sysConfig: { culture: 'sv-SE', dateFormat: 'yy-MM-dd' }, userPref: { culture: 'en-US', dateFormat: 'dd-MMM-yy' }, brief: 'false' },
    { page: 'Message Center', url: 'UI/message-center', query: 'Message Center>Review Messages>Patents', field: 'Create Date', sysConfig: { culture: 'zh-CN', dateFormat: 'yy.M.d' }, userPref: { culture: 'de-DE', dateFormat: 'd. MMMM yyyy' }, brief: 'false' }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Set Culture to '${data.userPref.culture}' and Date Format to '${data.userPref.dateFormat}' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: data.userPref.culture },
                    { property: 'DateFormat.Value', value: data.userPref.dateFormat }
                ]);
            });
            await app.step(`Set Culture to '${data.sysConfig.culture}' and Date Format to '${data.sysConfig.dateFormat}' in Default System Configuration and lock (API)`, async () => {
                const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                await userPref.setDefaultCulture(data.sysConfig.culture);
                await userPref.setDefaultDateFormat(data.sysConfig.dateFormat);
                userPref.setDateFormatLocked(true);
                await userPref.save();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
        })
        (`Verify locked Culture and Date Format (Step 22): page - '${data.page}', culture - '${data.sysConfig.culture}', date format - '${data.sysConfig.dateFormat}'`, async (t: TestController) => {
            await app.step(`Login and go to the '${data.page}' page`, async () => {
                await app.ui.getRole(undefined, data.url);
                await app.ui.waitLoading();
            });
            await app.step(`Run query '${data.query}'`, async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
                if (!(await app.ui.noErrors())) {
                    await app.ui.refresh();
                    await app.ui.waitLoading();
                }
            }, { isSkipped: !data.query });
            await app.step(`Verify date format in the grid`, async () => {
                const defUserPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                const expectedDateFormat = await defUserPref.getDefaultDateFormatForCulture(data.userPref.culture);
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
                const actualValue = await row.getValue(data.field);

                await t
                    .expect(app.services.time.matchDateFormat(actualValue, `${expectedDateFormat.toUpperCase()} HH:mm:ss`)).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset role`, async () => {
                app.ui.resetRole(undefined, data.url);
            });
            await app.step(`Unlock Default Culture and Date Format in Default System Configuration (API)`, async () => {
                const userPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                userPref.setDateFormatLocked(false);
                await userPref.save();
            });
        });
});
