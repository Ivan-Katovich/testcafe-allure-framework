import app from '../../../../app';
declare const globalConfig: any;

/*
Following assertions are verified in Test ID 31228: 06_Verify_Hyperlink from GS and DEF template
- IP Type of case record and Record identifier of the case record
- the [table name-field name]: field value
*/

fixture `REGRESSION.globalSearch.pack. - Test ID 31381: 01_Verify_Global Search_Overall`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const data = {
    ipType: 'PatentMasters',
    type: 'patent',
    searchText: `Test31381`,
    ipTypes: [
        {
            name: 'PatentMasters',
            type: 'patent',
            dataDictionaryName: 'Patents'
        },
        {
            name: 'DisclosureMasters',
            type: 'disclosure',
            dataDictionaryName: 'Disclosures'
        },
        {
            name: 'TrademarkMasters',
            type: 'trademark',
            dataDictionaryName: 'Trademarks'
        },
        {
            name: 'GeneralIP1Masters',
            type: 'generalIP1',
            dataDictionaryName: 'GeneralIP1'
        }
    ]
};

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.globalSearch)
    .before(async () => {
        await app.step('Change Records Per Page in User Preferences(API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'RecordsPerPage.Value', value: 100 }]);
        });
    })
    (`Verify Global Search (Steps 2-6)`, async (t: TestController) => {
        await app.step('Login (Step 2-4)', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.header.isVisible('globalSearch')).ok()
                .expect(await app.ui.header.getAttribute('globalSearchInput', 'placeholder')).eql('Search for a record');
        });
        await app.step('Type 3 characters and verify (Step 5)', async () => {
            await app.ui.header.setGlobalSearch(app.services.random.str(3));

            await t
                .expect(await app.ui.header.isEnabled('globalSearchButton')).notOk();
        });
        await app.step('Type 4 characters and verify', async () => {
            await app.ui.header.setGlobalSearch(app.services.random.str(4));

            await t
                .expect(await app.ui.header.isEnabled('globalSearchButton')).ok();
        });
        await app.step('Perform search (Step 6)', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.globalSearchBoard.getText('searchInValue')).eql('All records');
        });
        await app.step('Verify global search results screen', async () => {
            const globalSearchResponseBody = app.ui.getLastResponseBody('globalSearch');
            const ipTypes = app.services.array.removeDuplicates(globalSearchResponseBody.GlobalSearchResult.map((x) => x.IpType));
            const expectedIPTypes = (await app.api.common.getIpTypes()).filter((x) => ipTypes.includes(x.IpTypeId)).map((x) => x.Name);

            await app.ui.globalSearchBoard.click('searchIn');
            const searchInItems = await app.ui.kendoPopup.getAllItemsText();
            const searchInIpTypes = searchInItems.filter((x) => x !== 'All records');
            const recordCount = await app.ui.globalSearchBoard.getRecordCount();

            await t
                .expect(await app.ui.globalSearchBoard.isVisible()).ok()
                .expect(await app.ui.globalSearchBoard.getText('title')).eql('Global Search Results')
                .expect((await app.ui.globalSearchBoard.getText('recordsCountInfo')).startsWith('Case records:')).ok()
                .expect(await app.ui.globalSearchBoard.getTotalCount()).eql(recordCount)
                .expect(app.services.array.isSortedAlphabetically(searchInItems)).ok()
                .expect(app.services.array.areEquivalent(expectedIPTypes, searchInIpTypes)).ok();
        });
        await app.step('Verify record information', async () => {
            const searchInItems = await app.ui.kendoPopup.getAllItemsText();
            const record = app.ui.globalSearchBoard.getResult(0);
            const recordName = await record.getAuditKeyValue();
            const foundText = await record.getRowValue(0);

            await t
                .expect(searchInItems.some((x) => recordName.includes(x))).ok()
                .expect(foundText).contains(data.searchText);
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API) ', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Global Search records number (Step 7-8)`, async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Set value to Global Search and search', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
        });
        await app.step('Verify result records number (Step 7)', async () => {
            const expectedRecordNumber = Number(app.api.userPreferences.getDefaultValue('RecordsPerPage.Value'));
            const actualRecordNumber = await app.ui.globalSearchBoard.getRecordCount();

            await t
                .expect(actualRecordNumber).eql(expectedRecordNumber)
                .expect(await app.ui.globalSearchBoard.getText('showMoreLink')).eql('Show more..');
        });
        await app.step('Click Show More (Step 8)', async () => {
            const expectedRecordNumber = 2 * Number(app.api.userPreferences.getDefaultValue('RecordsPerPage.Value'));

            await app.ui.globalSearchBoard.click('showMoreLink');
            await app.ui.waitLoading();

            const actualRecordNumber = await app.ui.globalSearchBoard.getRecordCount();

            await t
                .expect(actualRecordNumber).eql(expectedRecordNumber);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.globalSearch)
    (`Verify Global Search filter (Step 9-12)`, async (t: TestController) => {
        let totalBeforeFilter: number;
        let allRecords: any[];
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Set value to Global Search and search', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.globalSearchBoard.isPresent('headerButtons', 'Filter Results')).notOk();
        });
        await app.step(`Select ${data.ipType} in Search In dropdown (Step 9)`, async () => {
            await app.ui.globalSearchBoard.selectSearchIn(data.ipType);
            await app.ui.waitLoading();
            totalBeforeFilter = await app.ui.globalSearchBoard.getTotalCount();
            const resultRecords = await app.ui.globalSearchBoard.getAllRecordNames();
            allRecords = app.ui.getLastResponseBody('globalSearch').GlobalSearchResult;

            await t
                .expect(resultRecords.length).gt(0)
                .expect(resultRecords.every((x) => x.startsWith(data.ipType))).ok()
                .expect(await app.ui.globalSearchBoard.isVisible('headerButtons', 'Filter Results')).ok();
        });
        await app.step('Click on Filter Results button (Step 10)', async () => {
            await app.ui.globalSearchBoard.click('headerButtons', 'Filter Results');
            await t
                .expect(await app.ui.globalSearchBoard.isVisible('headerButtons', 'Hide Filter')).ok()
                .expect(await app.ui.globalSearchBoard.filterBox.isVisible()).ok();
        });
        await app.step('Select Audit fields and apply filter(Step 11)', async () => {
            const filterFields = (await app.ui.globalSearchBoard.filterBox.getRowLabels()).map((x) => x.text);
            const fieldsWithTypes = [];
            for (let field of filterFields) {
                fieldsWithTypes.push({ name: field, type: await app.ui.globalSearchBoard.filterBox.getFieldType(field) });
            }

            const dropdownFieldName = fieldsWithTypes.find((x) => x.type === 'dropdown').name;
            const singlelineFieldName = fieldsWithTypes.find((x) => x.type === 'input').name;
            await app.api.globalSearch.search(data.searchText);
            const record = app.api.globalSearch.getRecords(data.ipType)[0];
            const recordId = record.MasterId;
            const resourceId = record.ResourceId;

            await app.api.dataEntryForm.openRecord(recordId, resourceId);
            const dropdownValue = await app.api.dataEntryForm.getValue(dropdownFieldName);
            const singleLineValue = await app.api.dataEntryForm.getValue(singlelineFieldName);

            await app.ui.globalSearchBoard.filterBox.fillFieldWithValue(dropdownFieldName, 'autocomplete', dropdownValue);
            await app.ui.globalSearchBoard.filterBox.fillFieldWithValue(singlelineFieldName, 'input', singleLineValue);
            await t
                .expect(await (await app.ui.globalSearchBoard.filterBox.getField(dropdownFieldName, 'input')).isVisible('clearButton')).ok()
                .expect(await (await app.ui.globalSearchBoard.filterBox.getField(dropdownFieldName, 'autocomplete')).isVisible('clearCross')).ok();

            await app.ui.globalSearchBoard.filterBox.click('buttons', 'Filter');
            await app.ui.waitLoading();
            const recordNames = await app.ui.globalSearchBoard.getAllRecordNames();
            for (let recordName of recordNames) {
                const record = allRecords.find((x) => recordName.includes(x.AuditKey.replace('  ', ' ')));
                await app.api.dataEntryForm.openRecord(record.MasterId, record.ResourceId);
                await t
                    .expect(await app.api.dataEntryForm.getValue(dropdownFieldName)).eql(dropdownValue)
                    .expect(await app.api.dataEntryForm.getValue(singlelineFieldName)).eql(singleLineValue);
            }
        });
        await app.step('Click Clear Filter(Step 12)', async () => {
            await app.ui.globalSearchBoard.filterBox.click('buttons', 'Clear Filter');
            await app.ui.waitLoading();
            const recordNames = await app.ui.globalSearchBoard.getAllRecordNames();

            await t
                .expect(await app.ui.globalSearchBoard.filterBox.isVisible()).notOk()
                .expect(await app.ui.globalSearchBoard.getTotalCount()).eql(totalBeforeFilter)
                .expect(recordNames.every((x) => x.startsWith(data.ipType))).ok();
        });
        await app.step('Verify Filter is cleared', async () => {
            await app.ui.globalSearchBoard.click('headerButtons', 'Filter Results');
            await app.ui.waitLoading();
            const filterFields = (await app.ui.globalSearchBoard.filterBox.getRowLabels()).map((x) => x.text);
            for (let field of filterFields) {
                await t
                    .expect(await (await app.ui.globalSearchBoard.filterBox.getField(field, 'input')).getValue()).eql('');
            }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.globalSearchFilterconfig)
    (`Verify ip types in filter (Step 13)`, async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Set value to Global Search and search', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();
        });
        for (let ipType of data.ipTypes) {
            let expectedAuditFields: string[];
            await app.step(`Select ${ipType} in Search In dropdown (Step 9)`, async () => {
                await app.ui.globalSearchBoard.selectSearchIn(ipType.name);
                await app.ui.waitLoading();
                await app.ui.globalSearchBoard.click('headerButtons', 'Filter Results');
            });
            await app.step('Verify audit fields on filter', async () => {
                const ipTypeSection = await app.api.administration.defaultSystemConfiguration.openIPType(ipType.name);
                expectedAuditFields = await ipTypeSection.getAuditFields();
                const actualAuditFields = (await app.ui.globalSearchBoard.filterBox.getRowLabels()).map((x) => x.text);

                await t
                    .expect(app.services.array.areEquivalent(expectedAuditFields, actualAuditFields)).ok();
            });
            await app.step('Verify field types in Filter Box', async () => {
                const fieldData = app.ui.getLastResponseBody('globalSearchFilterconfig');
                for (let field of expectedAuditFields) {
                    const lookup = fieldData.find((x) => x.DisplayConfiguredName === field).LookupSource;
                    const fieldType = await app.ui.globalSearchBoard.filterBox.getFieldType(field);
                    if (lookup) {
                        await t
                            .expect(fieldType).eql('dropdown', `The field type for ${field} for ip type ${ipType} should be dropdown`);
                    } else {
                        await t
                            .expect(fieldType).eql('input', `The field type for ${field} for ip type ${ipType} should be singleline`);
                    }
                }
            });
        }
    });

test
    // .only
    .meta('brief', 'true')
    .meta('category', 'Display Configuration')
    .requestHooks(app.ui.requestLogger.globalSearchFilterconfig)
    (`Global Search - Overall - Verify Display Configuration (Step 14)`, async (t: TestController) => {
        await app.step('Change display configuration for user (API)', async () => {
            app.ui.resetRole();
            await app.api.changeDisplayConfigurationForUser('TA Custom Display Configuration', globalConfig.user.userName);
        });
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
        });
        await app.step('Set value to Global Search and search', async () => {
            await app.ui.header.setGlobalSearch(data.searchText);
            await app.ui.header.click('globalSearchButton');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.globalSearchBoard.isVisible()).ok()
                .expect(await app.ui.globalSearchBoard.getText('title')).eql('Test - Global Search Results')
                .expect((await app.ui.globalSearchBoard.getText('recordsCountInfo')).startsWith('Test - Case records:')).ok()
                .expect(await app.ui.globalSearchBoard.getText('searchInLabel')).eql('Test - Search in:')
                .expect(await app.ui.globalSearchBoard.getText('searchInValue')).eql('Test - All records');
        });
        await app.step('Verify Search In dropdown', async () => {
            await app.ui.globalSearchBoard.click('searchIn');
            await app.api.administration.displayConfiguration.openDisplayConfiguration('TA Custom Display Configuration');
            await app.api.administration.displayConfiguration.openIPType();
            const expectedList = app.api.administration.displayConfiguration.getEditValues();
            const actualList = app.services.array.remove(await app.ui.kendoPopup.getAllItemsText(), 'Test - All records');
            await t
                .expect(app.services.array.isSubsetOf(expectedList, actualList)).ok();
        });
        await app.step('Verify filter', async () => {
            await app.ui.kendoPopup.selectItem('Test - PatentMasters');
            await app.ui.waitLoading();
            await app.ui.globalSearchBoard.click('headerButtons', 'Test - Filter Results');
            await t
                .expect(await app.ui.globalSearchBoard.isVisible('headerButtons', 'Test - Hide Filter')).ok()
                .expect(await app.ui.globalSearchBoard.filterBox.isVisible('buttons', 'Test - Clear Filter')).ok()
                .expect(await app.ui.globalSearchBoard.filterBox.isVisible('buttons', 'Test - Filter')).ok();
        });
        await app.step('Verify filter fields', async () => {
            const fieldIds = app.ui.getLastResponseBody('globalSearchFilterconfig').map((x) => x.DataDictionaryId);
            await app.api.administration.displayConfiguration.openFieldsTooltips();
            const expectedList = [];
            for (let id of fieldIds) {
                expectedList.push(app.api.administration.displayConfiguration.getEditValueByID(id));
            }

            const actualFields = (await app.ui.globalSearchBoard.filterBox.getRowLabels()).map((x) => x.text);
            await t
                .expect(app.services.array.areEquivalent(expectedList, actualFields)).ok();
        });
    })
    .after(async () => {
        await app.step('Change display configuration to default (API)', async () => {
            await app.api.changeDisplayConfigurationForUser('Default Display Configuration 1', globalConfig.user.userName);
            app.ui.resetRole();
        });
    });
