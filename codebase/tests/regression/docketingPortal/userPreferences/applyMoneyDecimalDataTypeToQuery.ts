import app from '../../../../app';

const value = app.services.random.decimal(7, 2);

let record;
let recordId = '';
let recordName = '';

const childs = [{
    childName: 'Expenses',
    rows: [ { properties:
        [
        {name: 'Percentage', value: value.toString() },
        {name: 'Amount', value: value.toString() },
        {name: 'Expense Date', value: app.services.time.today('MM/DD/YYYY') }
        ]
    }]
}];

fixture `REGRESSION.userPreferences.pack. - Test ID 29968: User Preferences - apply Money & Decimal Data Types to Query`
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
    { culture: 'de-DE', currencyType: 'United Kingdom, Pound', type: 'Patent', query: 'Patent>Patent Expenses', nameField: 'Docket Number', brief: 'true' },
    { culture: 'en-GB', currencyType: 'Switzerland, Franc', type: 'Trademark', query: 'Trademark>Trademark Expenses', nameField: 'Docket Number', brief: 'false' },
    { culture: 'en-US', currencyType: 'Sweden, Krona', type: 'Disclosure', query: 'Disclosure>TA Disclosure Expenses', nameField: 'Disclosure Number', brief: 'false' },
    { culture: 'ja-JP', currencyType: 'Euro', type: 'GeneralIP1', query: 'GeneralIP1>TA GIP1 Expenses', nameField: 'Agreement Number', brief: 'false' },
    { culture: 'sv-SE', currencyType: 'Polish zlotys', type: 'Patent', query: 'Patent>Patent Expenses', nameField: 'Docket Number', brief: 'false' },
    { culture: 'zh-CN', currencyType: 'Japan, Yen', type: 'Trademark', query: 'Trademark>Trademark Expenses', nameField: 'Docket Number', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Create a ${data.type} record with filled 'Expenses' child tab`, async () => {
                record = await app.api.combinedFunctionality.createRecord(data.type, 'simple');
                app.memory.current.createRecordData = record;
                recordId = record.respData.Record.MasterId.toString();
                recordName = record.reqData.recordName;
                await app.api.addChildRecords(Number(recordId), `TA DEF for ${data.type}`, childs);
            });
            await app.step(`Set Default Culture to '${data.culture} in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
            await app.step(`Set base Currency Type to '${data.currencyType}' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(data.currencyType);
                await general.save();
            });
        })
        (`Verify decimal & money formats in query results for ${data.type} - ${data.culture} culture with base currency type = ${data.currencyType} (steps 2-7)`, async (t: TestController) => {
            await app.step('Login and run query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Apply column filter to the ${data.nameField} column`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(data.nameField);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(recordName);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.nameField);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue[0].includes(recordName)).ok();
            });
            await app.step(`Verify format of the 'Percentage' decimal column value`, async () => {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
                const actualValue = await row.getValue('Percentage');
                const expectedValue = app.services.culture.numberToDecimalFormat(value, data.culture);
                await t
                    .expect(actualValue).eql(expectedValue, `Decimal format on query results does not match the expected ${data.culture} format`);
            });
            await app.step(`Verify format of the 'Amount' money column value`, async () => {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(0);
                const actualValue = await row.getValue('Amount');
                const baseCurrencyCode = (await app.api.userPreferences.getUserPreferences()).Preferences.BaseCurrency.CurrencyCode;

                const expectedValue = app.services.culture.numberToMoneyFormat(value, data.culture, baseCurrencyCode);

                await t
                    .expect(actualValue).eql(expectedValue, `Money format on query results does not match the expected ${data.culture} format`);
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Delete created record (API)`, async () => {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            });
            await app.step(`Set base Currency Type to 'United States, Dollar' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType('United States, Dollar');
                await general.save();
            });
        });
});

[
    { culture: 'en-GB', type: 'Patent', query: 'Patent>Patent Expenses', nameField: 'Docket Number', brief: 'true' },
    { culture: 'en-US', type: 'Trademark', query: 'Trademark>Trademark Expenses', nameField: 'Docket Number', brief: 'false' },
    { culture: 'ja-JP', type: 'Disclosure', query: 'Disclosure>TA Disclosure Expenses', nameField: 'Disclosure Number', brief: 'false' },
    { culture: 'sv-SE', type: 'GeneralIP1', query: 'GeneralIP1>TA GIP1 Expenses', nameField: 'Agreement Number', brief: 'false' },
    { culture: 'zh-CN', type: 'Patent', query: 'Patent>Patent Expenses', nameField: 'Docket Number', brief: 'false' },
    { culture: 'de-DE', type: 'Trademark', query: 'Trademark>Trademark Expenses', nameField: 'Docket Number', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Create a ${data.type} record with filled 'Expenses' child tab`, async () => {
                record = await app.api.combinedFunctionality.createRecord(data.type, 'simple');
                app.memory.current.createRecordData = record;
                recordId = record.respData.Record.MasterId.toString();
                recordName = record.reqData.recordName;
                await app.api.addChildRecords(Number(recordId), `TA DEF for ${data.type}`, childs);
            });
            await app.step(`Set Default Culture to '${data.culture}' (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
        })
        (`Verify decimal & money formats in a query grid filter for ${data.type} - ${data.culture} culture (step 8)`, async (t: TestController) => {
            await app.step('Login and run query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step(`Verify value in a 'decimal' column filter is formatted as per the ${data.culture} culture`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter('Percentage');
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                const valueNoGrouping = app.services.num.toLocaleString(value, data.culture, {useGrouping: false});
                await filter.addCriteria(valueNoGrouping);
                await app.ui.pressKey('tab');

                const actualValue = await filter.getCriteriaValue();
                const expectedValue = app.services.culture.numberToDecimalFormat(value, data.culture);
                await t
                    .expect(actualValue).eql(expectedValue, `Decimal format on column filter does not match the expected ${data.culture} format`);
            });
            await app.step(`Apply 'decimal' column filter and verify the query results`, async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Percentage');
                const expectedValue = app.services.culture.numberToDecimalFormat(value, data.culture);

                await t
                    .expect(columnValues.length).gt(0, 'No records were returned in Query Results')
                    .expect(columnValues.every((x) => x === expectedValue)).ok(`Value or decimal format on query results does not match the expectation = ${expectedValue}`);
            });
            await app.step(`Clear 'Percentage' column filter`, async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter('Percentage');
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed('Percentage')).notOk();
            });
            await app.step(`Verify value in a 'money' column filter is formatted as per the ${data.culture} culture without currency sign`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter('Amount');
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(app.services.num.toLocaleString(value, data.culture, {useGrouping: false}));
                await app.ui.pressKey('tab');

                const actualValue = await filter.getCriteriaValue();
                const expectedValue = app.services.culture.numberToDecimalFormat(value, data.culture); // Note: currency symbol is not applied to the filter value.
                await t
                    .expect(actualValue).eql(expectedValue, `Money format on column filter does not match the expected ${data.culture} format`);
            });
            await app.step(`Apply 'money' column filter and verify the query results`, async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.confirm();
                await app.ui.waitLoading();

                const baseCurrencyCode = (await app.api.userPreferences.getUserPreferences()).Preferences.BaseCurrency.CurrencyCode;
                const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Amount');
                const expectedValue = app.services.culture.numberToMoneyFormat(value, data.culture, baseCurrencyCode);

                await t
                    .expect(columnValues.length).gt(0, 'No records were returned in Query Results')
                    .expect(columnValues.every((x) => x === expectedValue)).ok(`Value or money format on query results does not match the expectation = ${expectedValue}`);
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Delete created record (API)`, async () => {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            });
        });
});

[
    { culture: 'en-US', type: 'Patent', query: 'Patent>Patent Expenses', nameField: 'Docket Number', brief: 'true' },
    { culture: 'ja-JP', type: 'Trademark', query: 'Trademark>Trademark Expenses', nameField: 'Docket Number', brief: 'false' },
    { culture: 'sv-SE', type: 'Disclosure', query: 'Disclosure>TA Disclosure Expenses', nameField: 'Disclosure Number', brief: 'false' },
    { culture: 'zh-CN', type: 'GeneralIP1', query: 'GeneralIP1>TA GIP1 Expenses', nameField: 'Agreement Number', brief: 'false' },
    { culture: 'de-DE', type: 'Patent', query: 'Patent>Patent Expenses', nameField: 'Docket Number', brief: 'false' },
    { culture: 'en-GB', type: 'Trademark', query: 'Trademark>Trademark Expenses', nameField: 'Docket Number', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Create a ${data.type} record with filled 'Expenses' child tab`, async () => {
                record = await app.api.combinedFunctionality.createRecord(data.type, 'simple');
                app.memory.current.createRecordData = record;
                recordId = record.respData.Record.MasterId.toString();
                recordName = record.reqData.recordName;
                await app.api.addChildRecords(Number(recordId), `TA DEF for ${data.type}`, childs);
            });
            await app.step(`Set Default Culture to '${data.culture}' (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
        })
        (`Verify decimal & money formats in a query Criteria Builder for ${data.type} - ${data.culture} culture (step 9)`, async (t: TestController) => {
            await app.step('Login and run query', async () => {
                await app.ui.getRole(undefined, '/UI/queries');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.openTree();
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open Criteria Builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
            });
            await app.step(`Verify value in a 'decimal' Criteria Builder field is formatted as per the ${data.culture} culture`, async () => {
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill('Percentage');
                await row.getField('Operator', 'dropdown').fill('Equal');
                const field = await row.getField('Value', 'numeric');
                const valueNoGrouping = app.services.num.toLocaleString(value, data.culture, {useGrouping: false});
                await field.fill(valueNoGrouping);
                await app.ui.pressKey('tab');

                const expectedValue = app.services.culture.numberToDecimalFormat(value, data.culture);

                await t
                    .expect(await field.isFocused()).notOk()
                    .expect(await field.verifyValue(expectedValue)).ok(`Decimal format on Criteria Builder does not match the expected ${data.culture} format`);
            });
            await app.step(`Apply the Criteria Builder filter and verify the query results`, async () => {
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();

                const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Percentage');
                const expectedValue = app.services.culture.numberToDecimalFormat(value, data.culture);

                await t
                    .expect(columnValues.length).gt(0, 'No records were returned in Query Results')
                    .expect(columnValues.every((x) => x === expectedValue)).ok(`Value or decimal format on query results does not match the expectation = ${expectedValue}`);
            });
            await app.step('Open Criteria Builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
            });
            await app.step(`Verify value in a 'money' Criteria Builder field is formatted as per the ${data.culture} culture`, async () => {
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill('Amount');
                await row.getField('Operator', 'dropdown').fill('Equal');
                const field = await row.getField('Value', 'numeric');
                const valueNoGrouping = app.services.num.toLocaleString(value, data.culture, {useGrouping: false});
                await field.fill(valueNoGrouping);
                await app.ui.pressKey('tab');

                const expectedValue = app.services.culture.numberToDecimalFormat(value, data.culture); // Note: currency symbol is not applied to the filter value.

                await t
                    .expect(await field.isFocused()).notOk()
                    .expect(await field.verifyValue(expectedValue)).ok(`Money format on Criteria Builder does not match the expected ${data.culture} format`);
            });
            await app.step(`Apply the Criteria Builder filter and verify the query results`, async () => {
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();

                const baseCurrencyCode = (await app.api.userPreferences.getUserPreferences()).Preferences.BaseCurrency.CurrencyCode;
                const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Amount');
                const expectedValue = app.services.culture.numberToMoneyFormat(value, data.culture, baseCurrencyCode);

                await t
                    .expect(columnValues.length).gt(0, 'No records were returned in Query Results')
                    .expect(columnValues.every((x) => x === expectedValue)).ok(`Value or money format on query results does not match the expectation = ${expectedValue}`);
            });
        }).after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Delete created record (API)`, async () => {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            });
        });
});
