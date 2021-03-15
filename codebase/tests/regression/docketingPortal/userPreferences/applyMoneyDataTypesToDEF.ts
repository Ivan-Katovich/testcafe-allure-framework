import app from '../../../../app';

fixture`REGRESSION.userPreferences.pack. - Test ID 29965: User Preferences - apply Money Data Types to DEF`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step(`Set 'Use Base Currency' to false in User Preferences (API)`, async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'UseBaseCurrency.Value', value: false }]);
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

[
    { type: 'trademark', field: 'Current Amount Paid', culture: 'de-DE', currencyType: 'Australia, Dollars', brief: 'true' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify Amount field on Master section (Step 2): ${data.type}, Culture - '${data.culture}', Currency Type = '${data.currencyType}'`, async (t: TestController) => {
            await app.step(`Set Currency type to '${data.currencyType}' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(data.currencyType);
                await general.save();
            });
            await app.step(`Set Culture to '${data.culture}' in the User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
            await app.step(`Create a ${data.type} record (API)`, async () => {
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
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const defaultFieldName = `${data.field} (${defaultCurrency}`;
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                const cultureFieldName = `${data.field} (${cultureCurrency}`;

                await t
                    .expect(await app.ui.dataEntryBoard.getField(defaultFieldName).isPresent()).ok()
                    .expect(await app.ui.dataEntryBoard.getField(cultureFieldName).isPresent()).notOk();
            });
            await app.step(`Type letters in the '${data.field}'`, async () => {
                const value = app.services.random.letters();
                await app.ui.dataEntryBoard.getField(data.field, 'numeric').typeText(value);

                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.field, 'numeric').getValue()).notEql(value);
            });
            await app.step(`Enter value in the '${data.field}' and verify format`, async () => {
                const value = app.services.random.decimal(7, 2);
                const localeValue = app.services.num.toLocaleString(value, data.culture, {});
                const expectedValue = app.services.culture.numberToDecimalFormat(value, data.culture);
                await app.ui.dataEntryBoard.getField(data.field, 'numeric').fill(localeValue);
                await app.ui.pressKey('tab');

                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.field, 'numeric').verifyValue(expectedValue)).ok();
            });
            await app.step(`Enter negative value in the '${data.field}'`, async () => {
                const value = app.services.random.decimal(7, 2);
                const localeValue = '-' + app.services.num.toLocaleString(value, data.culture, {});
                const expectedValue = '-' + app.services.culture.numberToDecimalFormat(value, data.culture);
                await app.ui.dataEntryBoard.getField(data.field, 'numeric').fill(localeValue);
                await app.ui.pressKey('tab');

                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.field, 'numeric').verifyValue(expectedValue)).ok();
            });
            await app.step(`Verify label of the '${data.field}'`, async () => {
                const label = await app.ui.dataEntryBoard.getField(data.field, 'numeric').getText('label');
                const currency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const symbol = app.services.culture.getCurrencySymbolByCode(currency);

                await t
                    .expect(label).contains(currency)
                    .expect(label).contains(symbol);
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
    { type: 'patent', child: 'Expenses', field: 'Foreign Amount', culture: 'de-DE', currencyType: 'Canada, Dollar', brief: 'true' },
    { type: 'trademark', child: 'Expenses', field: 'Projected', culture: 'en-GB', currencyType: 'South Korea', brief: 'false' },
    { type: 'disclosure', child: 'Expenses', field: 'Amount', culture: 'en-US', currencyType: 'China, Yuan Renminbi', brief: 'false' },
    { type: 'generalip', child: 'Expenses', field: 'Amount', culture: 'ja-JP', currencyType: 'Denmark, Krone', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify Amount field on child tab (Step 3): ${data.type}, Culture - '${data.culture}', Currency Type = '${data.currencyType}'`, async (t: TestController) => {
            let defaultFieldName: string;
            let cultureFieldName: string;
            await app.step(`Set Currency type to '${data.currencyType}' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(data.currencyType);
                await general.save();
            });
            await app.step(`Set Culture to '${data.culture}' in the User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
            await app.step(`Create a ${data.type} record (API)`, async () => {
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
            await app.step(`Open the '${data.child}' child tab and add a new row`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
            });
            await app.step(`Get labels without currency symbols of the '${data.field}' fields`, async () => {
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                defaultFieldName = `${data.field} (${defaultCurrency}`;
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                cultureFieldName = `${data.field} (${cultureCurrency}`;
            });
            await app.step(`Type letters in the '${defaultFieldName}'`, async () => {
                const value = app.services.random.letters();
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField(defaultFieldName, 'numeric').click();
                await row.getField(defaultFieldName, 'numeric').typeText(value);

                await t
                    .expect(await row.getField(defaultFieldName, 'numeric').getValue()).eql('');
            });
            await app.step(`Enter value in the '${defaultFieldName}' and verify format`, async () => {
                const value = app.services.random.decimal(7, 2);
                const localeValue = app.services.num.toLocaleString(value, data.culture, {});
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const expectedValue = app.services.culture.numberToMoneyFormat(value, data.culture, defaultCurrency);
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField(defaultFieldName, 'numeric').fill(localeValue);
                await app.ui.pressKey('tab');

                await t
                    .expect(await row.getValue(defaultFieldName, { readOnlyMode: true })).eql(expectedValue);
            });
            await app.step(`Enter negative value in the '${data.field}'`, async () => {
                const value = app.services.random.decimal(7, 2);
                const localeValue = '-' + app.services.num.toLocaleString(value, data.culture, {});
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const expectedValue = `(${app.services.culture.numberToMoneyFormat(value, data.culture, defaultCurrency)})`;
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField(data.field, 'numeric').fill(localeValue);
                await app.ui.pressKey('tab');

                await t
                    .expect(await row.getValue(defaultFieldName, { readOnlyMode: true })).eql(expectedValue);
            });
            await app.step(`Verify full label of the '${data.field}'`, async () => {
                const columnNames = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .map((x) => x.text).filter((x) => x.includes(data.field));
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const defaultSymbol = app.services.culture.getCurrencySymbolByCode(defaultCurrency);
                defaultFieldName = `${data.field} (${defaultCurrency} ${defaultSymbol})`;
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                const cultureSymbol = app.services.culture.getCurrencySymbolByCode(cultureCurrency);
                cultureFieldName = `${data.field} (${cultureCurrency} ${cultureSymbol})`;

                await t
                    .expect(columnNames).contains(defaultFieldName, `The [${JSON.stringify(columnNames)}] array of column names doesn't contain '${defaultFieldName}'`)
                    .expect(columnNames).contains(cultureFieldName, `The [${JSON.stringify(columnNames)}] array of column names doesn't contain '${cultureFieldName}'`);
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
    { type: 'disclosure', child: 'Expenses', field: 'Amount', culture: 'en-US', currencyType: 'Euro', brief: 'true' },
    { type: 'generalip', child: 'Expenses', field: 'Amount', culture: 'ja-JP', currencyType: 'Hong Kong Dollars', brief: 'false' },
    { type: 'patent', child: 'Expenses', field: 'Foreign Amount', culture: 'sv-SE', currencyType: 'India, Rupees', brief: 'false' },
    { type: 'trademark', child: 'Expenses', field: 'Projected', culture: 'zh-CN', currencyType: 'Japan, Yen', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', `true`)
        (`Verify calculated column for Amount field on child tab (Step 3): ${data.type}, Culture - '${data.culture}', Currency Type = '${data.currencyType}'`, async (t: TestController) => {
            let defaultFieldName: string;
            let cultureFieldName: string;
            let value: number;
            await app.step(`Set Currency type to '${data.currencyType}' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(data.currencyType);
                await general.save();
            });
            await app.step(`Set Culture to '${data.culture}' in the User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
            await app.step(`Create a ${data.type} record (API)`, async () => {
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
            await app.step(`Open the '${data.child}' child tab and add a new row`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
                (await app.ui.dataEntryBoard.childRecord.grid.getRecord(0)).getField('Expense Date', 'datepicker').fill('today');
            });
            await app.step(`Get labels without currency symbols of the '${data.field}' fields`, async () => {
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                defaultFieldName = `${data.field} (${defaultCurrency}`;
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                cultureFieldName = `${data.field} (${cultureCurrency}`;
            });
            await app.step(`Verify the '${cultureFieldName}' field is read-only`, async () => {
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);

                await t
                    .expect(await row.isFieldReadOnly(cultureFieldName)).ok();
            });
            await app.step(`Enter value to the '${defaultFieldName}' field and save`, async () => {
                value = app.services.random.decimal(7, 2);
                const localeValue = app.services.num.toLocaleString(value, data.culture, {});
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField(defaultFieldName, 'numeric').fill(localeValue);
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading();
            });
            await app.step(`Verify value in the '${cultureFieldName}' field`, async () => {
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                await app.api.administration.currencyExchangeRates.open(cultureCurrency);
                const rate = app.api.administration.currencyExchangeRates.getLatestExchangeRate();

                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const actualValue = await row.getValue(cultureFieldName);
                const expectedValue = app.services.culture.numberToMoneyFormat(value / rate, data.culture, cultureCurrency);

                await t
                    .expect(actualValue).eql(expectedValue);
            });
            await app.step(`Enter negative value in the '${defaultFieldName}' and save`, async () => {
                const localeValue = '-' + app.services.num.toLocaleString(value, data.culture, {});
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField(data.field, 'numeric').fill(localeValue);
                await app.ui.pressKey('tab');
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading();
            });
            await app.step(`Verify value in the '${cultureFieldName}' field`, async () => {
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                await app.api.administration.currencyExchangeRates.open(cultureCurrency);
                const rate = app.api.administration.currencyExchangeRates.getLatestExchangeRate();

                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const actualValue = await row.getValue(cultureFieldName);
                const expectedValue = `(${app.services.culture.numberToMoneyFormat(value / rate, data.culture, cultureCurrency)})`;

                await t
                    .expect(actualValue).eql(expectedValue);
            });
            await app.step(`Verify full label of the '${data.field}'`, async () => {
                const columnNames = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .map((x) => x.text).filter((x) => x.includes(data.field));
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const defaultSymbol = app.services.culture.getCurrencySymbolByCode(defaultCurrency);
                defaultFieldName = `${data.field} (${defaultCurrency} ${defaultSymbol})`;
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                const cultureSymbol = app.services.culture.getCurrencySymbolByCode(cultureCurrency);
                cultureFieldName = `${data.field} (${cultureCurrency} ${cultureSymbol})`;

                await t
                    .expect(columnNames).contains(defaultFieldName, `The [${JSON.stringify(columnNames)}] array of column names doesn't contain '${defaultFieldName}'`)
                    .expect(columnNames).contains(cultureFieldName, `The [${JSON.stringify(columnNames)}] array of column names doesn't contain '${cultureFieldName}'`);
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
    { type: 'patent', child: 'Expenses', field: 'Foreign Amount', culture: 'de-DE', dateFormat: 'dd.MM.yyyy', currencyType: 'Malta, Lira', brief: 'true' },
    { type: 'trademark', child: 'Expenses', field: 'Projected', culture: 'zh-CN', dateFormat: 'yyyy/MM/dd', currencyType: 'Mexican Peso', brief: 'false' },
    { type: 'disclosure', child: 'Expenses', field: 'Amount', culture: 'en-US', dateFormat: 'MM/dd/yyyy', currencyType: 'Malawi, Kwacha', brief: 'false' },
    { type: 'generalip', child: 'Expenses', field: 'Amount', culture: 'ja-JP', dateFormat: 'yyyy/MM/dd', currencyType: 'Malaysia, Ringgit', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify the Calculate Column when exchange rates are not available (Step 4): ${data.type}, Culture - '${data.culture}', Currency Type: '${data.currencyType}'`, async (t: TestController) => {
            let defaultFieldName: string;
            let cultureFieldName: string;
            let value: number;
            await app.step(`Set Currency type to '${data.currencyType}' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(data.currencyType);
                await general.save();
            });
            await app.step(`Set Culture to '${data.culture}' in the User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: data.culture },
                    { property: 'DateFormat.Value', value: data.dateFormat }
                ]);
            });
            await app.step(`Create a ${data.type} record (API)`, async () => {
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
            await app.step(`Open the '${data.child}' child tab and add a new row`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
            });
            await app.step(`Set 'Expense Date' to the date before exchange rate of '${data.currencyType}'`, async () => {
                const code = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const exchangeRatePage = app.api.administration.currencyExchangeRates;
                await exchangeRatePage.open(code);
                const earliestDate = app.services.sorting.sortBy(exchangeRatePage.getExchangeRates(), 'date').shift().date;
                const dateToSet = earliestDate.add(-1, 'days').format(data.dateFormat.toUpperCase());
                (await app.ui.dataEntryBoard.childRecord.grid.getRecord(0)).getField('Expense Date', 'datepicker').fill(dateToSet);
            });
            await app.step(`Get labels without currency symbols of the '${data.field}' fields`, async () => {
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                defaultFieldName = `${data.field} (${defaultCurrency}`;
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                cultureFieldName = `${data.field} (${cultureCurrency}`;
            });
            await app.step(`Enter value to the '${defaultFieldName}' field and save`, async () => {
                value = app.services.random.decimal(7, 2);
                const localeValue = app.services.num.toLocaleString(value, data.culture, {});
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField(defaultFieldName, 'numeric').fill(localeValue);
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading();
            });
            await app.step(`Verify value in the '${cultureFieldName}' field`, async () => {
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const actualValue = await row.getValue(cultureFieldName);

                await t
                    .expect(actualValue).eql('');
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
    { type: 'patent', child: 'Expenses', field: 'Foreign Amount', culture: 'de-DE', currencyType: 'Euro', brief: 'true' },
    { type: 'trademark', child: 'Expenses', field: 'Projected', culture: 'en-GB', currencyType: 'United Kingdom, Pound', brief: 'false' },
    { type: 'disclosure', child: 'Expenses', field: 'Amount', culture: 'en-US', currencyType: 'United States, Dollar', brief: 'false' },
    { type: 'generalip', child: 'Expenses', field: 'Amount', culture: 'ja-JP', currencyType: 'Japan, Yen', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify combination when the Culture's Currency is the same as the Base Currency (Step 8): ${data.type}, Culture - ${data.culture}, Currency Type - ${data.currencyType}`, async (t: TestController) => {
            await app.step(`Set Currency type to '${data.currencyType}' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(data.currencyType);
                await general.save();
            });
            await app.step(`Set Culture to '${data.culture}' in the User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
            await app.step(`Create a ${data.type} record (API)`, async () => {
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
            await app.step(`Open the '${data.child}' child tab and add a new row`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
            });
            await app.step(`Verify label of the '${data.field}'`, async () => {
                const columnNames = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .map((x) => x.text).filter((x) => x.match(`^${data.field} (.*)`));

                await t
                    .expect(columnNames.length).eql(1);
            });
        })
        .after(async () => {
            await app.step(`Delete created record (API)`, async () => {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            });
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Set base Currency Type to 'United States, Dollar' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType('United States, Dollar');
                await general.save();
            });
        });
});

[
    { type: 'trademark', template: 'Trademark DEF', field: 'Current Amount Paid', culture: 'zh-CN', currencyType: 'South Africa, Rand', brief: 'true' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify Amount field on Master section of New Data Entry Form (Step 9): ${data.type}, Culture - '${data.culture}', Currency Type = '${data.currencyType}'`, async (t: TestController) => {
            await app.step(`Set Currency type to '${data.currencyType}' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(data.currencyType);
                await general.save();
            });
            await app.step(`Set Culture to '${data.culture}' in the User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Open new Data Entry Form for ${data.template}`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.template);
                await app.ui.waitLoading();
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const defaultFieldName = `${data.field} (${defaultCurrency}`;
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                const cultureFieldName = `${data.field} (${cultureCurrency}`;

                await t
                    .expect(await app.ui.dataEntryBoard.getField(defaultFieldName).isPresent()).ok()
                    .expect(await app.ui.dataEntryBoard.getField(cultureFieldName).isPresent()).notOk();
            });
            await app.step(`Type letters in the '${data.field}'`, async () => {
                const value = app.services.random.letters();
                await app.ui.dataEntryBoard.getField(data.field, 'numeric').typeText(value);

                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.field, 'numeric').getValue()).notEql(value);
            });
            await app.step(`Enter value in the '${data.field}' and verify format`, async () => {
                const value = app.services.random.decimal(7, 2);
                const localeValue = app.services.num.toLocaleString(value, data.culture, {});
                const expectedValue = app.services.culture.numberToDecimalFormat(value, data.culture);
                await app.ui.dataEntryBoard.getField(data.field, 'numeric').fill(localeValue);
                await app.ui.pressKey('tab');

                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.field, 'numeric').verifyValue(expectedValue)).ok();
            });
            await app.step(`Enter negative value in the '${data.field}'`, async () => {
                const value = app.services.random.decimal(7, 2);
                const localeValue = '-' + app.services.num.toLocaleString(value, data.culture, {});
                const expectedValue = '-' + app.services.culture.numberToDecimalFormat(value, data.culture);
                await app.ui.dataEntryBoard.getField(data.field, 'numeric').fill(localeValue);
                await app.ui.pressKey('tab');

                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.field, 'numeric').verifyValue(expectedValue)).ok();
            });
            await app.step(`Verify label of the '${data.field}'`, async () => {
                const label = await app.ui.dataEntryBoard.getField(data.field, 'numeric').getText('label');
                const currency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const symbol = app.services.culture.getCurrencySymbolByCode(currency);

                await t
                    .expect(label).contains(currency)
                    .expect(label).contains(symbol);
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Set base Currency Type to 'United States, Dollar' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType('United States, Dollar');
                await general.save();
            });
        });
});

[
    { type: 'disclosure', template: 'TA DEF for Disclosure', child: 'Expenses', field: 'Amount', culture: 'en-US', currencyType: 'South Korea', brief: 'true' },
    { type: 'generalip', template: 'GeneralIP1 DEF', child: 'Expenses', field: 'Amount', culture: 'ja-JP', currencyType: 'Sweden, Krona', brief: 'false' },
    { type: 'patent', template: 'Patent DEF', child: 'Expenses', field: 'Foreign Amount', culture: 'sv-SE', currencyType: 'Switzerland, Franc', brief: 'false' },
    { type: 'trademark', template: 'Trademark DEF', child: 'Expenses', field: 'Projected', culture: 'zh-CN', currencyType: 'Taiwan, Dollar', brief: 'false' }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify Amount field on child tab of New Data Entry Form (Step 9): ${data.type}, Culture - '${data.culture}', Currency Type = '${data.currencyType}'`, async (t: TestController) => {
            let defaultFieldName: string;
            let cultureFieldName: string;
            await app.step(`Set Currency type to '${data.currencyType}' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(data.currencyType);
                await general.save();
            });
            await app.step(`Set Culture to '${data.culture}' in the User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Open new Data Entry Form for ${data.template}`, async () => {
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.template);
                await app.ui.waitLoading();
            });
            await app.step(`Open the '${data.child}' child tab and add a new row`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
            });
            await app.step(`Get labels without currency symbols of the '${data.field}' fields`, async () => {
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                defaultFieldName = `${data.field} (${defaultCurrency}`;
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                cultureFieldName = `${data.field} (${cultureCurrency}`;
            });
            await app.step(`Type letters in the '${defaultFieldName}'`, async () => {
                const value = app.services.random.letters();
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField(defaultFieldName, 'numeric').click();
                await row.getField(defaultFieldName, 'numeric').typeText(value);

                await t
                    .expect(await row.getField(defaultFieldName, 'numeric').getValue()).eql('');
            });
            await app.step(`Enter value in the '${defaultFieldName}' and verify format`, async () => {
                const value = app.services.random.decimal(7, 2);
                const localeValue = app.services.num.toLocaleString(value, data.culture, {});
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const expectedValue = app.services.culture.numberToMoneyFormat(value, data.culture, defaultCurrency);
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField(defaultFieldName, 'numeric').fill(localeValue);
                await app.ui.pressKey('tab');

                await t
                    .expect(await row.getValue(defaultFieldName, { readOnlyMode: true })).eql(expectedValue);
            });
            await app.step(`Enter negative value in the '${data.field}'`, async () => {
                const value = app.services.random.decimal(7, 2);
                const localeValue = '-' + app.services.num.toLocaleString(value, data.culture, {});
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const expectedValue = `(${app.services.culture.numberToMoneyFormat(value, data.culture, defaultCurrency)})`;
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField(data.field, 'numeric').fill(localeValue);
                await app.ui.pressKey('tab');

                await t
                    .expect(await row.getValue(defaultFieldName, { readOnlyMode: true })).eql(expectedValue);
            });
            await app.step(`Verify full label of the '${data.field}'`, async () => {
                const columnNames = (await app.ui.dataEntryBoard.childRecord.grid.getColumnsNamesArray())
                    .map((x) => x.text).filter((x) => x.includes(data.field));
                const defaultCurrency = app.services.culture.getCurrencyCodeByType(data.currencyType);
                const defaultSymbol = app.services.culture.getCurrencySymbolByCode(defaultCurrency);
                defaultFieldName = `${data.field} (${defaultCurrency} ${defaultSymbol})`;
                const cultureCurrency = app.services.culture.getCurrencyCodeByLocale(data.culture);
                const cultureSymbol = app.services.culture.getCurrencySymbolByCode(cultureCurrency);
                cultureFieldName = `${data.field} (${cultureCurrency} ${cultureSymbol})`;

                await t
                    .expect(columnNames).contains(defaultFieldName, `The [${JSON.stringify(columnNames)}] array of column names doesn't contain '${defaultFieldName}'`)
                    .expect(columnNames).contains(cultureFieldName, `The [${JSON.stringify(columnNames)}] array of column names doesn't contain '${cultureFieldName}'`);
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Set base Currency Type to 'United States, Dollar' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType('United States, Dollar');
                await general.save();
            });
        });
});
