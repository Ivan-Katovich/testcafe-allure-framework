import app from '../../../../app';
declare const globalConfig: any;

fixture`REGRESSION.queryList&Results.pack. - Test ID 31154: Query - Query Results - Column Filter for lookup fields`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step('Create records (API)', async () => {
            app.memory.current.array = [];
            for (let record of records) {
                app.memory.current.array.push(await app.api.createRecordWithValues(data.type, 'simple', record));
            }
        });
    })
    .after(async () => {
        await app.step('Delete created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.array);
        });
    });

const data = {
    query: 'Patent>TA PA All Cases (Lookup Fields)',
    displayConfiguration: {
        query: 'Patent>Patent Expenses',
        checkbox: 'Test - POWEROFATTORNEY',
        singleline: 'Test - TEXT#10',
        multiline: 'Test - APPLICATIONNUMBER',
        datepicker: 'Test - EXPIRATIONDATE',
        numeric: 'Test - PATENTDRAWINGS',
        linkedFile: 'Test - LINKEDFILE',
        null: 'Test - APPLICATIONDATEFLAG',
        party: 'Test - ATTORNEY',
        country: 'Test - COUNTRY',
        code: 'Test - RELATIONTYPE'
    },
    type: 'patent',
    ipType: 'PatentMasters',
    party: {
        name: 'Attorney',
        value: 'Addison Woods - (ABW)'
    },
    code: {
        name: 'Relation Type',
        value1: 'Division - (D)',
        value2: 'Continuation - (C)',
        value3: 'Reissue Patent - (R)',
        displaySettings: {
            code: { userPreferenceValue: 1, descriptionRegex: /\((.*)\)/ },
            description: { userPreferenceValue: 2, descriptionRegex: /^(.*)- \(/ }
        }
    },
    country: {
        name: 'Country / Region',
        value1: 'FI - (Finland)',
        value2: 'BB - (Barbados)',
        value3: 'CA - (Canada)',
        displaySettings: {
            code: { userPreferenceValue: 1, descriptionRegex: /\((.*)\)/ },
            description: { userPreferenceValue: 3, descriptionRegex: /^(.*)- \(/ },
            wipo: { userPreferenceValue: 2, descriptionRegex: /\((.*)\)/ }
        }
    },
    hierarchy: {
        code: {
            name: 'Convention Type'
        },
        party: {
            name: 'Client Division'
        }
    },
    singleline: {
        name: 'Text #10',
        value: 'Test_' + app.services.time.timestampShort()
    },
    multiline: {
        name: 'Application Number'
    },
    numeric: {
        name: 'Drawings'
    },
    datepicker: {
        name: 'Expiration Date'
    },
    checkbox: {
        name: 'Power of Attorney'
    },
    linkedfile: {
        name: 'Linked File'
    },
    null: {
        name: 'APPLICATIONDATEFLAG'
    }
};

const records = [
    [
        { name: data.party.name, value: data.party.value },
        { name: data.code.name, value: data.code.value1 },
        { name: data.country.name, value: data.country.value1 },
        { name: data.singleline.name, value: data.singleline.value }
    ],
    [
        { name: data.party.name, value: data.party.value },
        { name: data.code.name, value: data.code.value1 },
        { name: data.country.name, value: data.country.value2 },
        { name: data.singleline.name, value: data.singleline.value }
    ],
    [
        { name: data.party.name, value: data.party.value },
        { name: data.code.name, value: data.code.value2 },
        { name: data.country.name, value: data.country.value2 },
        { name: data.singleline.name, value: data.singleline.value }
    ],
    [
        { name: data.party.name, value: data.party.value },
        { name: data.code.name, value: data.code.value2 },
        { name: data.country.name, value: data.country.value3 },
        { name: data.singleline.name, value: data.singleline.value }
    ],
    [
        { name: data.party.name, value: data.party.value },
        { name: data.code.name, value: data.code.value3 },
        { name: data.country.name, value: data.country.value3 },
        { name: data.singleline.name, value: data.singleline.value }
    ],
    [
        { name: data.party.name, value: data.party.value },
        { name: data.code.name, value: data.code.value3 },
        { name: data.country.name, value: data.country.value2 },
        { name: data.singleline.name, value: data.singleline.value }
    ]
];

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.queryMetadata)
    (`Verify column filters for lookup fields with Code and Country types (Step 2-4)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading();
        });
        await app.step(`Verify filter for Country field`, async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.country.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const checkboxes = await filter.getAllCheckboxLabelsWithValues();
            const filterItemLabels = checkboxes.map((x) => x.name);
            const filterItemValues = checkboxes.map((x) => x.value);
            const countryItems = (await app.api.common.getCountries()).Data.map((x) => x.Name.trim());

            await t
                .expect(await filter.isVisible('searchInput')).ok()
                .expect(filterItemLabels[0]).eql('Select All')
                .expect(filterItemLabels.filter((x) => x !== 'Select All').every((x) => countryItems.includes(x))).ok()
                .expect(filterItemValues.every((x) => x === false)).ok()
                .expect(await filter.isVisible('buttons', 'Filter')).ok()
                .expect(await filter.getText('countLabel')).eql('0 items selected');
        });
        await app.step(`Verify filter for code field`, async () => {
            const fieldCode = app.ui.getLastResponseBody('queryMetadata').FieldMetadata
                .find((x) => x.CustomValue === data.code.name).LookupSourceType;
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const checkboxes = await filter.getAllCheckboxLabelsWithValues();
            const filterItemLabels = checkboxes.map((x) => x.name);
            const filterItemValues = checkboxes.map((x) => x.value);
            const controlItems = (await app.api.common.getCodesForType(fieldCode)).Data.map((x) => x.Description.trim());

            await t
                .expect(await filter.isVisible('searchInput')).ok()
                .expect(filterItemLabels[0]).eql('Select All')
                .expect(filterItemLabels.filter((x) => x !== 'Select All').every((x) => controlItems.includes(x))).ok()
                .expect(filterItemValues.every((x) => x === false)).ok()
                .expect(await filter.isVisible('buttons', 'Filter')).ok()
                .expect(await filter.getText('countLabel')).eql('0 items selected');
        });
        await app.step(`Verify filter for code field (Hierarchy)`, async () => {
            const fieldCode = app.ui.getLastResponseBody('queryMetadata').FieldMetadata
                .find((x) => x.CustomValue === data.hierarchy.code.name).LookupSourceType;
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.hierarchy.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const checkboxes = await filter.getAllCheckboxLabelsWithValues();
            const filterItemLabels = checkboxes.map((x) => x.name);
            const filterItemValues = checkboxes.map((x) => x.value);
            const controlItems = (await app.api.common.getCodesForType(fieldCode)).Data.map((x) => x.Description.trim());

            await t
                .expect(await filter.isVisible('searchInput')).ok()
                .expect(filterItemLabels[0]).eql('Select All')
                .expect(filterItemLabels.filter((x) => !(x === 'Select All' || x === '')).every((x) => controlItems.includes(x))).ok()
                .expect(filterItemValues.every((x) => x === false)).ok()
                .expect(await filter.isVisible('buttons', 'Filter')).ok()
                .expect(await filter.getText('countLabel')).eql('0 items selected');
        });
        await app.step('Go to the next page in query results', async () => {
            await app.ui.queryBoard.queryResultsGrid.navigateToTheNextPage();
            await app.ui.waitLoading();
        });
        await app.step(`Verify filter for Country field`, async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.country.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const checkboxes = await filter.getAllCheckboxLabelsWithValues();
            const filterItemLabels = checkboxes.map((x) => x.name);
            const filterItemValues = checkboxes.map((x) => x.value);
            const countryItems = (await app.api.common.getCountries()).Data.map((x) => x.Name.trim());

            await t
                .expect(await filter.isVisible('searchInput')).ok()
                .expect(filterItemLabels[0]).eql('Select All')
                .expect(filterItemLabels.filter((x) => x !== 'Select All').every((x) => countryItems.includes(x))).ok()
                .expect(filterItemValues.every((x) => x === false)).ok()
                .expect(await filter.isVisible('buttons', 'Filter')).ok()
                .expect(await filter.getText('countLabel')).eql('0 items selected');
        });
        await app.step(`Verify filter for Code field`, async () => {
            const fieldCode = app.ui.getLastResponseBody('queryMetadata').FieldMetadata
                .find((x) => x.CustomValue === data.code.name).LookupSourceType;
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const checkboxes = await filter.getAllCheckboxLabelsWithValues();
            const filterItemLabels = checkboxes.map((x) => x.name);
            const filterItemValues = checkboxes.map((x) => x.value);
            const controlItems = (await app.api.common.getCodesForType(fieldCode)).Data.map((x) => x.Description.trim());

            await t
                .expect(await filter.isVisible('searchInput')).ok()
                .expect(filterItemLabels[0]).eql('Select All')
                .expect(filterItemLabels.filter((x) => x !== 'Select All').every((x) => controlItems.includes(x))).ok()
                .expect(filterItemValues.every((x) => x === false)).ok()
                .expect(await filter.isVisible('buttons', 'Filter')).ok()
                .expect(await filter.getText('countLabel')).eql('0 items selected');
        });
        await app.step(`Verify filter for code field (Hierarchy)`, async () => {
            const fieldCode = app.ui.getLastResponseBody('queryMetadata').FieldMetadata
                .find((x) => x.CustomValue === data.hierarchy.code.name).LookupSourceType;
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.hierarchy.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const checkboxes = await filter.getAllCheckboxLabelsWithValues();
            const filterItemLabels = checkboxes.map((x) => x.name);
            const filterItemValues = checkboxes.map((x) => x.value);
            const controlItems = (await app.api.common.getCodesForType(fieldCode)).Data.map((x) => x.Description.trim());

            await t
                .expect(await filter.isVisible('searchInput')).ok()
                .expect(filterItemLabels[0]).eql('Select All')
                .expect(filterItemLabels.filter((x) => !(x === 'Select All' || x === '')).every((x) => controlItems.includes(x))).ok()
                .expect(filterItemValues.every((x) => x === false)).ok()
                .expect(await filter.isVisible('buttons', 'Filter')).ok()
                .expect(await filter.getText('countLabel')).eql('0 items selected');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify column filters for lookup fields with Party type (Step 2-3)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading();
        });
        await app.step(`Verify filter for party field`, async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.party.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.isPresent('methodDropdown')).notOk('The Operator dropdown is present on column filter popup for party field')
                .expect(await filter.isVisible('criteriaInput')).ok()
                .expect(await filter.isVisible('buttons', 'Filter')).ok();
        });
        await app.step(`Verify filter for party field (Hierarchy)`, async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.hierarchy.party.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.isPresent('methodDropdown')).notOk('The Operator dropdown is present on column filter popup for party field')
                .expect(await filter.isVisible('criteriaInput')).ok()
                .expect(await filter.isVisible('buttons', 'Filter')).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify column filters checkbox lists (Step 5-12)`, async (t: TestController) => {
        await app.step('Change Builder Criteria in Query Management (API)', async () => {
            await app.api.queryManagement.openQueryManagement(data.query);
            app.api.queryManagement.setFilter(data.singleline.name, 'Equal', data.singleline.value);
            await app.api.queryManagement.save();
        });
        await app.step('Run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading();
        });
        await app.step(`Verify column filter for Country(Step 5)`, async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.country.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const checkboxes = await filter.getAllCheckboxLabelsWithValues();
            const filterItemLabels = checkboxes.map((x) => x.name);
            const filterItemValues = checkboxes.map((x) => x.value);
            const expectedValues = app.services.array.removeDuplicates(records.map((x) => x.find((y) => y.name === data.country.name).value))
                .sort(app.services.sorting.appSortAlphabetically);
            const actualValues = filterItemLabels.filter((x) => x !== 'Select All');

            await t
                .expect(actualValues).eql(expectedValues)
                .expect(filterItemValues.every((x) => x === false)).ok();
        });
        await app.step(`Verify column filter for Code and verify (Step 5)`, async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const checkboxes = await filter.getAllCheckboxLabelsWithValues();
            const filterItemLabels = checkboxes.map((x) => x.name);
            const filterItemValues = checkboxes.map((x) => x.value);
            const expectedValues = app.services.array.removeDuplicates(records.map((x) => x.find((y) => y.name === data.code.name).value))
                .sort(app.services.sorting.appSortAlphabetically);
            const actualValues = app.services.array.remove(filterItemLabels, 'Select All');

            await t
                .expect(actualValues).eql(expectedValues)
                .expect(filterItemValues.every((x) => x === false)).ok();
        });
        await app.step('Set column filter for Party (Step 6)', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.party.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.addCriteria(data.party.value);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.party.name);

            await t
                .expect(columnValues.every((x) => x === data.party.value)).ok();
        });
        await app.step('Verify column filter for Code (Step 7)', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const filterItems = await filter.getAllCheckboxLabels();
            const expectedRecords = records.filter((x) => x.find((y) => y.name === data.party.name).value === data.party.value);
            const expectedValues = app.services.array.removeDuplicates(expectedRecords
                .map((x) => x.find((y) => y.name === data.code.name).value))
                .sort(app.services.sorting.appSortAlphabetically);
            const actualValues = filterItems.filter((x) => x !== 'Select All');

            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set column filter for Code and verify', async () => {
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.getCheckbox(data.code.value1).check();
            await filter.confirm();
            await app.ui.waitLoading();
            const partyColumnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.party.name);
            const codeColumnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.code.name);

            await t
                .expect(partyColumnValues.every((x) => x === data.party.value)).ok()
                .expect(codeColumnValues.every((x) => x === data.code.value1)).ok();
        });
        await app.step('Verify column filter for Country (Step 8)', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.country.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const filterItems = await filter.getAllCheckboxLabels();
            const expectedRecords = records.filter((x) => x.find((y) => y.name === data.party.name).value === data.party.value
                && x.find((y) => y.name === data.code.name).value === data.code.value1);
            const expectedValues = app.services.array.removeDuplicates(expectedRecords
                .map((x) => x.find((y) => y.name === data.country.name).value))
                .sort(app.services.sorting.appSortAlphabetically);
            const actualValues = filterItems.filter((x) => x !== 'Select All');

            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set column filter for Country and verify', async () => {
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.getCheckbox(data.country.value1).check();
            await filter.confirm();
            await app.ui.waitLoading();
            const partyColumnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.party.name);
            const codeColumnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.code.name);
            const countryColumnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.country.name);

            await t
                .expect(partyColumnValues.every((x) => x === data.party.value)).ok()
                .expect(codeColumnValues.every((x) => x === data.code.value1)).ok()
                .expect(countryColumnValues.every((x) => x === data.country.value1)).ok();
        });
        await app.step('Open column filter for Code and verify (Step 9)', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const filterItems = app.services.array.remove(await filter.getAllCheckboxLabels(), 'Select All');

            await t
                .expect(filterItems).eql([data.code.value1])
                .expect(await filter.getCheckbox(data.code.value1).isChecked()).ok();
        });
        await app.step('Clear column filter for Code', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.code.name);
            await app.ui.waitLoading();
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const filterItems = (await filter.getAllCheckboxLabels()).filter((x) => x !== 'Select All');
            const expectedRecords = records.filter((x) => x.find((y) => y.name === data.party.name).value === data.party.value
                && x.find((y) => y.name === data.country.name).value === data.country.value1);
            const expectedValues = app.services.array.removeDuplicates(expectedRecords
                .map((x) => x.find((y) => y.name === data.code.name).value))
                .sort(app.services.sorting.appSortAlphabetically);

            await t
                .expect(filterItems).eql(expectedValues);
        });
        await app.step('Clear column filter for Country (Step 10)', async () => {
            await app.ui.queryBoard.click('queryName');
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.country.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.country.name)).notOk();
        });
        await app.step('Verify column filter for Code', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const filterItems = (await filter.getAllCheckboxLabels()).filter((x) => x !== 'Select All');
            const expectedRecords = records.filter((x) => x.find((y) => y.name === data.party.name).value === data.party.value);
            const expectedValues = app.services.array.removeDuplicates(expectedRecords
                .map((x) => x.find((y) => y.name === data.code.name).value))
                .sort(app.services.sorting.appSortAlphabetically);

            await t
                .expect(filterItems).eql(expectedValues);
        });
        await app.step('Verify column filter for Country (Step 11)', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.country.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const filterItems = (await filter.getAllCheckboxLabels()).filter((x) => x !== 'Select All');
            const expectedRecords = records.filter((x) => x.find((y) => y.name === data.party.name).value === data.party.value);
            const expectedValues = app.services.array.removeDuplicates(expectedRecords
                .map((x) => x.find((y) => y.name === data.country.name).value))
                .sort(app.services.sorting.appSortAlphabetically);

            await t
                .expect(filterItems).eql(expectedValues);
        });
        await app.step('Set column filter for Country', async () => {
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.getCheckbox(data.country.value2).check();
            await filter.confirm();
            await app.ui.waitLoading();
            const partyColumnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.party.name);
            const countryColumnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.country.name);

            await t
                .expect(partyColumnValues.every((x) => x === data.party.value)).ok()
                .expect(countryColumnValues.every((x) => x === data.country.value2)).ok();
        });
    })
    .after(async () => {
        await app.step('Reset Build Criteria filter in Query Management (API)', async () => {
            await app.api.queryManagement.openQueryManagement(data.query);
            app.api.queryManagement.resetFilter();
            await app.api.queryManagement.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify column filters with Criteria Builder (Step 13-14)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading();
        });
        await app.step('Set filter in Criteria Builder (Step 13)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name').fill(data.singleline.name);
            await row.getField('Operator').fill('Equal');
            await row.getField('Value', 'input').fill(data.singleline.value);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
        });
        await app.step('Set column filter for Code', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.getCheckbox(data.code.value1).check();
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.code.name);

            await t
                .expect(columnValues.every((x) => x === data.code.value1)).ok();
        });
        await app.step('Verify Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);

            await t
                .expect(await row.getField('Field Name').getValue()).eql(data.singleline.name)
                .expect(await row.getField('Operator').getValue()).eql('Equal')
                .expect(await row.getField('Value', 'input').getValue()).eql(data.singleline.value);
        });
        await app.step('Click Show Results (Step 14)', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.code.name)).notOk();
        });
        await app.step('Verify column filter for Code', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const filterItems = app.services.array.remove((await filter.getAllCheckboxLabels()), 'Select All');
            const expectedValues = app.services.array.removeDuplicates(records.map((x) => x.find((y) => y.name === data.code.name).value))
                .sort(app.services.sorting.appSortAlphabetically);

            await t
                .expect(filterItems).eql(expectedValues);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.queryMetadata)
    (`Verify inactive Code in column filters (step 15)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading();
        });
        await app.step(`Deactivate ${data.code.value1} for ${data.code.name} in Code Management (API)`, async () => {
            const controlType = (app.ui.getLastResponseBody('queryMetadata')).FieldMetadata
                .find((x) => x.CustomValue === data.code.name).LookupSourceType;
            await app.api.administration.codeManagement.openCode(data.code.value1, controlType);
            app.api.administration.codeManagement.activate(false);
            await app.api.administration.codeManagement.save();
        });
        await app.step('Verify inactive value in column filter', async () => {
            await app.ui.refresh();
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.code.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const filterItems = await filter.getAllCheckboxLabels();

            await t
                .expect(filterItems.includes(data.code.value1)).ok();
        });
        await app.step('Filter column by inactive value', async () => {
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.getCheckbox(data.code.value1).check();
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.code.name);

            await t
                .expect(columnValues.every((x) => x === data.code.value1)).ok();
        });
    })
    .after(async () => {
        await app.step(`Activate ${data.code.value1} for ${data.code.name} in Code Management (API)`, async () => {
            const controlType = (app.ui.getLastResponseBody('queryMetadata')).FieldMetadata
                .find((x) => x.CustomValue === data.code.name).LookupSourceType;
            await app.api.administration.codeManagement.openCode(data.code.value1, controlType);
            app.api.administration.codeManagement.activate(true);
            await app.api.administration.codeManagement.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify inactive Country in column filters (step 16)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading();
        });
        await app.step(`Remove ${data.ipType} IP Type in ${data.country.value1} in Country/Region Management (API)`, async () => {
            await app.api.administration.countryRegionManagement.openCountry(data.country.value1);
            await app.api.administration.countryRegionManagement.removeIPType(data.ipType);
            await app.api.administration.countryRegionManagement.save();

            await app.api.administration.countryRegionManagement.openCountry(data.country.value1);
            const ipTypes = await app.api.administration.countryRegionManagement.getIPTypes();

            await t
                .expect(ipTypes.includes(data.ipType)).notOk();
        });
        await app.step('Verify inactive value in column filter', async () => {
            await app.ui.refresh();
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.country.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            const filterItems = await filter.getAllCheckboxLabels();

            await t
                .expect(filterItems.includes(data.country.value1)).ok();
        });
        await app.step('Filter column by inactive value', async () => {
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.getCheckbox(data.country.value1).check();
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.country.name);

            await t
                .expect(columnValues.every((x) => x === data.country.value1)).ok();
        });
    })
    .after(async () => {
        await app.step(`Add ${data.ipType} IP Type in ${data.country.value1} in Country/Region Management (API)`, async () => {
            await app.api.administration.countryRegionManagement.openCountry(data.country.value1);
            await app.api.administration.countryRegionManagement.addIPType(data.ipType);
            await app.api.administration.countryRegionManagement.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.queryMetadata)
    (`Verify inactive Party in column filters (step 17)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading();
        });
        await app.step(`Deactivate party ${data.party.value} for ${data.party.name}`, async () => {
            const controlType = (app.ui.getLastResponseBody('queryMetadata')).FieldMetadata
                .find((x) => x.CustomValue === data.party.name).LookupSourceType;
            await app.api.activatePartyCodeByValue(data.party.value, controlType, false);
        });
        await app.step('Filter column by inactive value', async () => {
            await app.ui.refresh();
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.party.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.addCriteria(data.party.value);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.party.name);

            await t
                .expect(columnValues.every((x) => x === data.party.value)).ok();
        });
    })
    .after(async () => {
        await app.step(`Activate party ${data.party.value} for ${data.party.name}`, async () => {
            const controlType = (app.ui.getLastResponseBody('queryMetadata')).FieldMetadata
                .find((x) => x.CustomValue === data.party.name).LookupSourceType;
            await app.api.activatePartyCode(data.party.value, controlType, true);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    .meta('category', 'Display Configuration')
    .requestHooks(app.ui.requestLogger.queryMetadata)
    (`Query Results - Column Filter - Verify Display Configuration (Step 16-17)`, async (t: TestController) => {
        await app.step('Change display configuration for user', async () => {
            app.ui.resetRole();
            await app.api.changeDisplayConfigurationForUser('TA Custom Display Configuration', globalConfig.user.userName);
        });
        await app.step('Run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open(data.displayConfiguration.query);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter for column', async () => {
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('filterButtons')).eql('Test - Filter');
        });
        await app.step('Verify column filter for checkbox', async () => {
            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.checkbox);
            await app.ui.waitLoading();
            const filterItems = await filter.getAllCheckboxLabels();

            await t
                .expect(filterItems).eql(['Test - Checked', 'Test - Not Checked'])
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok();
        });
        await app.step('Verify column filter for signleline', async () => {
            await app.ui.queryBoard.queryResultsGrid.closeFilter();
            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.singleline);
            await app.ui.waitLoading();
            await filter.openMethodDropdown();
            await app.ui.waitLoading();
            const expectedItems =
                [
                    'Test - Contains',
                    'Test - Does Not Contain',
                    'Test - Starts With',
                    'Test - Ends With',
                    'Test - Equal',
                    'Test - Not Equal',
                    'Test - Is Null',
                    'Test - Is Not Null'
                ];
            const actualItems = await filter.child.getAllItemsText();

            await t
                .expect(actualItems).eql(expectedItems)
                .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql('Test - Filter Criteria')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok();
        });
        await app.step('Verify column filter for miltiline', async () => {
            await app.ui.queryBoard.queryResultsGrid.closeFilter();
            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.multiline);
            await app.ui.waitLoading();
            await filter.openMethodDropdown();
            await app.ui.waitLoading();
            const expectedItems =
                [
                    'Test - Contains',
                    'Test - Does Not Contain',
                    'Test - Starts With',
                    'Test - Ends With',
                    'Test - Equal',
                    'Test - Not Equal',
                    'Test - Is Null',
                    'Test - Is Not Null'
                ];
            const actualItems = await filter.child.getAllItemsText();

            await t
                .expect(actualItems).eql(expectedItems)
                .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql('Test - Filter Criteria')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok();
        });
        await app.step('Verify column filter for datepicker', async () => {
            await app.ui.queryBoard.queryResultsGrid.closeFilter();
            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.datepicker);
            await app.ui.waitLoading();
            await filter.openMethodDropdown();
            await app.ui.waitLoading();
            const expectedItems =
                [
                    'Test - Equal',
                    'Test - Not Equal',
                    'Test - Greater Than',
                    'Test - Greater Than Or Equal To',
                    'Test - Less Than',
                    'Test - Less Than Or Equal To',
                    'Test - Is Null',
                    'Test - Is Not Null'
                ];
            const actualItems = await filter.child.getAllItemsText();

            await t
                .expect(actualItems).eql(expectedItems)
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok();
        });
        await app.step('Verify column filter for numeric', async () => {
            await app.ui.queryBoard.queryResultsGrid.closeFilter();
            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.numeric);
            await app.ui.waitLoading();
            await filter.openMethodDropdown();
            await app.ui.waitLoading();
            const expectedItems =
                [
                    'Test - Equal',
                    'Test - Not Equal',
                    'Test - Greater Than',
                    'Test - Greater Than Or Equal To',
                    'Test - Less Than',
                    'Test - Less Than Or Equal To',
                    'Test - Is Null',
                    'Test - Is Not Null'
                ];
            const actualItems = await filter.child.getAllItemsText();

            await t
                .expect(actualItems).eql(expectedItems)
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok();
        });
        await app.step('Verify column filter for linkedfile', async () => {
            await app.ui.queryBoard.queryResultsGrid.closeFilter();
            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.linkedFile);
            await app.ui.waitLoading();
            await filter.openMethodDropdown();
            await app.ui.waitLoading();
            const expectedItems =
                [
                    'Test - Contains',
                    'Test - Does Not Contain',
                    'Test - Starts With',
                    'Test - Ends With',
                    'Test - Equal',
                    'Test - Not Equal',
                    'Test - Is Null',
                    'Test - Is Not Null'
                ];
            const actualItems = await filter.child.getAllItemsText();

            await t
                .expect(actualItems).eql(expectedItems)
                .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql('Test - Filter Criteria')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok();
        });
        await app.step('Verify column filter for null', async () => {
            await app.ui.queryBoard.queryResultsGrid.closeFilter();
            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.null);
            await app.ui.waitLoading();
            await filter.openMethodDropdown();
            await app.ui.waitLoading();
            const expectedItems =
                [
                    'Test - Contains',
                    'Test - Does Not Contain',
                    'Test - Starts With',
                    'Test - Ends With',
                    'Test - Equal',
                    'Test - Not Equal',
                    'Test - Is Null',
                    'Test - Is Not Null'
                ];
            const actualItems = await filter.child.getAllItemsText();

            await t
                .expect(actualItems).eql(expectedItems)
                .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql('Test - Filter Criteria')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok();
        });
        await app.step('Verify column filter for lookup party', async () => {
            await app.ui.queryBoard.queryResultsGrid.closeFilter();
            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.party);
            await app.ui.waitLoading();
            await filter.openMethodDropdown();
            await app.ui.waitLoading();
            const expectedItems =
                [
                    'Test - Contains',
                    'Test - Does Not Contain',
                    'Test - Starts With',
                    'Test - Ends With',
                    'Test - Equal',
                    'Test - Not Equal',
                    'Test - Is Null',
                    'Test - Is Not Null'
                ];
            const actualItems = await filter.child.getAllItemsText();

            await t
                .expect(actualItems).eql(expectedItems)
                .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql('Test - Filter Criteria')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok();
        });
        await app.step('Get Country values from Display Configuration (API)', async () => {
            await app.api.administration.displayConfiguration.openDisplayConfiguration('TA Custom Display Configuration');
            await app.api.administration.displayConfiguration.openCountrySettings();
            app.memory.current.array = app.api.administration.displayConfiguration.getDisplayedValues();
        });
        await app.step('Change Display Option for Country in User Preferences to Code', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'CountryDisplaySetting', value: data.country.displaySettings.code.userPreferenceValue }]);
        });
        await app.step('Verify column filters for country', async () => {
            await app.ui.refresh();

            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.country);
            await app.ui.waitLoading();
            const filterItems = await filter.getAllCheckboxLabels();
            const firstItem = filterItems.shift();
            const actualValues = filterItems.map((x: string) => x.match(data.country.displaySettings.code.descriptionRegex)[1]);

            await t
                .expect(firstItem).eql('Test - Select All')
                .expect(await filter.getText('countLabel')).eql('0 Test - items selected')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok()
                .expect(actualValues.every((x) => app.memory.current.array.includes(x))).ok();
        });
        await app.step('Change Display Option for Country in User Preferences to Description', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'CountryDisplaySetting', value: data.country.displaySettings.description.userPreferenceValue }]);
        });
        await app.step('Verify column filters for country', async () => {
            await app.ui.refresh();

            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.country);
            await app.ui.waitLoading();
            const filterItems = await filter.getAllCheckboxLabels();
            const firstItem = filterItems.shift();
            const actualValues = filterItems.map((x: string) => x.match(data.country.displaySettings.description.descriptionRegex)[1].trim());

            await t
                .expect(firstItem).eql('Test - Select All')
                .expect(await filter.getText('countLabel')).eql('0 Test - items selected')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok()
                .expect(actualValues.every((x) => app.memory.current.array.includes(x))).ok();
        });
        await app.step('Change Display Option for Country in User Preferences to WIPO Codes', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'CountryDisplaySetting', value: data.country.displaySettings.wipo.userPreferenceValue }]);
        });
        await app.step('Verify column filters for country', async () => {
            await app.ui.refresh();

            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.country);
            await app.ui.waitLoading();
            const filterItems = await filter.getAllCheckboxLabels();
            const firstItem = filterItems.shift();
            const actualValues = filterItems.map((x: string) => x.match(data.country.displaySettings.wipo.descriptionRegex)[1]);

            await t
                .expect(firstItem).eql('Test - Select All')
                .expect(await filter.getText('countLabel')).eql('0 Test - items selected')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok()
                .expect(actualValues.every((x) => app.memory.current.array.includes(x))).ok();
        });
        await app.step('Get values for Code control from Display Configuration (API)', async () => {
            const controlCodeType = app.ui.getLastResponseBody('queryMetadata').FieldMetadata.find((x) => x.CustomValue === data.displayConfiguration.code).LookupSourceType;
            await app.api.administration.displayConfiguration.openDisplayConfiguration('TA Custom Display Configuration');
            await app.api.administration.displayConfiguration.openCodeSettings();
            app.memory.current.array = app.api.administration.displayConfiguration.getDisplayedValues(controlCodeType);
        });
        await app.step('Change Display Option for Code controls in User Preferences to Codes', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'CodeDisplaySetting', value: data.code.displaySettings.code.userPreferenceValue }]);
        });
        await app.step('Verify column filters for code', async () => {
            await app.ui.refresh();

            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.code);
            await app.ui.waitLoading();
            const filterItems = await filter.getAllCheckboxLabels();
            const firstItem = filterItems.shift();
            const actualValues = filterItems.map((x: string) => x.match(data.code.displaySettings.code.descriptionRegex)[1]);

            await t
                .expect(firstItem).eql('Test - Select All')
                .expect(await filter.getText('countLabel')).eql('0 Test - items selected')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok()
                .expect(actualValues.every((x) => app.memory.current.array.includes(x))).ok()
                .expect(await filter.getAttribute('searchInput', 'placeholder')).eql('Test - Search');
        });
        await app.step('Change Display Option for Code controls in User Preferences to Description', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'CodeDisplaySetting', value: data.code.displaySettings.description.userPreferenceValue }]);
        });
        await app.step('Verify column filters for code', async () => {
            await app.ui.refresh();

            const filter = await app.ui.queryBoard.queryResultsGrid.openFilter(data.displayConfiguration.code);
            await app.ui.waitLoading();
            const filterItems = await filter.getAllCheckboxLabels();
            const firstItem = filterItems.shift();
            const actualValues = filterItems.map((x: string) => x.match(data.code.displaySettings.description.descriptionRegex)[1].trim());

            await t
                .expect(firstItem).eql('Test - Select All')
                .expect(await filter.getText('countLabel')).eql('0 Test - items selected')
                .expect(await filter.isVisible('buttons', 'Test - Filter')).ok()
                .expect(actualValues.every((x) => app.memory.current.array.includes(x))).ok()
                .expect(await filter.getAttribute('searchInput', 'placeholder')).eql('Test - Search');
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step('Change display configuration to default (API)', async () => {
            try {
                await app.api.changeDisplayConfigurationForUser('Default Display Configuration 1', globalConfig.user.userName);
                app.ui.resetRole();
            } catch (err) { }
        });
    });
