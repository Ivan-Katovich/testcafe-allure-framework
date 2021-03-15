import app from '../../../../app';

declare const test: TestFn;
declare const fixture: any;
declare const globalConfig: any;

const createdRecords = [];

const placeholder = '0.00'; // NOTE: 'dot' decimal separator is expected for some cultures only, e.g. en-US
const valuePositive = app.services.random.num(10000, 99999999) / 3.12;
const valueNegative = app.services.random.num(-999, 0);
const valueInvalid = 'aBc';
const row = app.ui.queryBoard.criteriaBuilder.getRow(0);

fixture `REGRESSION.criteriaBuilder.pack. - Test ID 30128: Criteria Builder with Numeric fields`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
        await app.step('Create records and fill with data (API)', async () => {
            const record = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
            app.memory.current.createRecordData = record;
            createdRecords.push(record);
            data.recordId = record.respData.Record.MasterId.toString();
            data.recordName = record.reqData.recordName;
            await app.api.addChildRecords(Number(data.recordId), data.defTemplate,
                [{
                    childName: data.child,
                    rows: [ { properties: data.positiveFields }, { properties: data.negativeFields }, { properties: data.greaterFields }, { properties: data.lessFields }, { properties: data.nullFields }]
                }]);
        });
    })
    .after(async () => {
        await app.step('Delete created records with data (API)', async () => {
            try {
                const recordsToDelete = createdRecords.map((x) => {
                    return  x.respData;
                });
                await app.api.combinedFunctionality.deleteRecords(recordsToDelete);
            } catch (err) {}
        });
    })
    .beforeEach(async () => {
        await app.step('Login and run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading({checkErrors: true});
        });
    });

const data = {
        ipType: 'Patent',
        recordId: '',
        recordName: '',
        defTemplate: 'TA DEF for Patent',
        query: 'Patent>Patent Expenses',
        identifierName: 'PATENTMASTERID',
        child: 'Expenses',
        positiveFields: [
            {name: 'Percentage', value: valuePositive.toFixed(2) },
            {name: 'Amount', value: valuePositive.toFixed(2) },
            {name: 'Tax Year', value: valuePositive.toFixed(0) } ],
        greaterFields: [
            {name: 'Percentage', value: (valuePositive * 1.1).toFixed(2) },
            {name: 'Amount', value: (valuePositive * 2).toFixed(2) },
            {name: 'Tax Year', value: (valuePositive * 3).toFixed(0) } ],
        negativeFields: [
            {name: 'Percentage', value: valueNegative.toFixed(2) },
            {name: 'Amount', value: valueNegative.toFixed(2) },
            {name: 'Tax Year', value: valueNegative.toFixed(0) } ],
        lessFields: [
            {name: 'Percentage', value: (valueNegative * 2).toFixed(2) },
            {name: 'Amount', value: (valueNegative * 3.5).toFixed(2) },
            {name: 'Tax Year', value: (valueNegative * 5).toFixed(0) } ],
        nullFields: [ {name: 'Expense', value: 'Official Fees - (OFF)' } ],

        integer: {
            type: 'Integer',
            name: 'Tax Year',
            valuePositive: {
                allSeparators: app.services.num.addThousandsSeparators(valuePositive),
                noSeparators: app.services.num.removeAllSeparators(valuePositive),
                trimmed: valuePositive.toFixed(0)
            },
            valueNegative: {
                minus: app.services.num.addThousandsSeparators(valueNegative),
                minusTrimmed: valueNegative.toFixed(0)
            }
        },
        decimal: {
            type: 'Decimal',
            name: 'Percentage',
            valuePositive: {
                allSeparators: app.services.num.addThousandsSeparators(valuePositive),
                allSeparatorsTrimmed: app.services.num.addThousandsSeparators(valuePositive, 'en-US', 2, 2),
                decimalSeparators: valuePositive.toString(),
                decimalSeparatorsTrimmed: valuePositive.toFixed(2)
            },
            valueNegative: {
                minus: app.services.num.addThousandsSeparators(valueNegative),
                minusTrimmed: valueNegative.toFixed(2)
            }
        },
        money: {
            type: 'Money',
            name: 'Amount',
            valuePositive: {
                allSeparators: app.services.num.addThousandsSeparators(valuePositive),
                allSeparatorsTrimmed: app.services.num.addThousandsSeparators(valuePositive, 'en-US', 2, 2),
                decimalSeparators: valuePositive.toString(),
                decimalSeparatorsTrimmed: valuePositive.toFixed(2)
            },
            valueNegative: {
                minus: app.services.num.addThousandsSeparators(valueNegative),
                minusTrimmed: valueNegative.toFixed(2)
            }
        }
    };

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Check Criteria Builder Operators for Numeric fields (Step 2a)`, async (t) => {
        await app.step(`Select the Numeric Integer "${data.integer.name}" field and verify the default operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.integer.name);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.integer.name)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step(`Verify the list of Operators for the Numeric Integer "${data.integer.name}" field`, async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql( ['Between', 'Equal', 'Greater Than', 'Greater Than Or Equal To', 'Is Not Null', 'Is Null', 'Less Than', 'Less Than Or Equal To', 'Not Equal'] );
        });
        await app.step(`Select the Numeric Decimal "${data.decimal.name}" field and verify the default operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.decimal.name);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.decimal.name)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step(`Verify the list of Operators for the Numeric Decimal "${data.decimal.name}" field`, async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql( ['Between', 'Equal', 'Greater Than', 'Greater Than Or Equal To', 'Is Not Null', 'Is Null', 'Less Than', 'Less Than Or Equal To', 'Not Equal'] );
        });
        await app.step(`Select the Numeric Money "${data.money.name}" field and verify the default operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.money.name);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.money.name)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step(`Verify the list of Operators for the Numeric Money "${data.money.name}" field`, async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql( ['Between', 'Equal', 'Greater Than', 'Greater Than Or Equal To', 'Is Not Null', 'Is Null', 'Less Than', 'Less Than Or Equal To', 'Not Equal'] );
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Check Value control for Numeric fields (Step 2b)`, async (t) => {
        await app.step(`Select the Numeric Integer "${data.integer.name}" field and verify the Value control`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.integer.name);
            const field = await row.getField('Value', 'numeric');
            await t
                .expect(await row.getFieldType('Value')).eql('numeric')
                .expect(await row.getField('Value', 'numeric').verifyValue('')).ok()
                .expect(await field.isPresent('arrowUp')).notOk()
                .expect(await field.isPresent('arrowDown')).notOk();
        });
        await app.step(`Verify that text cannot be entered into the Numeric Integer "${data.integer.name}" Value field`, async () => {
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.integer.name);
            await row.getField('Value', 'numeric').fill(valueInvalid);
            await t
                .expect(await row.getField('Value', 'numeric').getValue()).eql('');
        });
        await app.step(`Verify value format of the Numeric Integer control`, async () => {
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.integer.name);
            await row.getField('Value', 'numeric').fill(data.integer.valuePositive.allSeparators);
            await t
                .expect(await row.getField('Value', 'numeric').getValue()).eql(data.integer.valuePositive.noSeparators);
            await app.ui.pressKey('tab');
            await t
                .expect(await row.getField('Value', 'numeric').isFocused()).notOk()
                .expect(await row.getField('Value', 'numeric').verifyValue(data.integer.valuePositive.noSeparators)).ok();
        });
        await app.step(`Select the Numeric Decimal "${data.decimal.name}" field and verify the Value control`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.decimal.name);
            const field = await row.getField('Value', 'numeric');
            await t
                .expect(await row.getFieldType('Value')).eql('numeric')
                .expect(await row.getField('Value', 'numeric').verifyValue(placeholder)).ok()
                .expect(await field.isVisible('arrowUp')).ok()
                .expect(await field.isVisible('arrowDown')).ok();
        });
        await app.step(`Verify that text cannot be entered into the Numeric Decimal "${data.decimal.name}" Value field`, async () => {
            await t
            .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.decimal.name);
            await row.getField('Value', 'numeric').fill(valueInvalid);
            await t
                .expect(await row.getField('Value', 'numeric').getValue()).eql('0');
        });
        await app.step(`Verify value format of the Numeric Decimal control`, async () => {
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.decimal.name);
            await row.getField('Value', 'numeric').fill(data.decimal.valuePositive.allSeparators);
            await t
                .expect(await row.getField('Value', 'numeric').getValue()).eql(data.decimal.valuePositive.decimalSeparators);
            await app.ui.pressKey('tab');
            await t
                .expect(await row.getField('Value', 'numeric').isFocused()).notOk()
                .expect(await row.getField('Value', 'numeric').verifyValue(data.decimal.valuePositive.allSeparatorsTrimmed)).ok();

            await row.getField('Value', 'numeric').fill(data.decimal.valueNegative.minus);
            await t
                .expect(await row.getField('Value', 'numeric').getValue()).eql(data.decimal.valueNegative.minus);
            await app.ui.pressKey('tab');
            await t
                .expect(await row.getField('Value', 'numeric').isFocused()).notOk()
                .expect(await row.getField('Value', 'numeric').verifyValue(data.decimal.valueNegative.minusTrimmed)).ok();
        });
        await app.step(`Select the Numeric Money "${data.money.name}" field and verify the Value control`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.money.name);
            const field = await row.getField('Value', 'numeric');
            await t
                .expect(await row.getFieldType('Value')).eql('numeric')
                .expect(await row.getField('Value', 'numeric').verifyValue(placeholder)).ok()
                .expect(await field.isVisible('arrowUp')).ok()
                .expect(await field.isVisible('arrowDown')).ok();
        });
        await app.step(`Verify that text cannot be entered into the Numeric Money "${data.money.name}" Value field`, async () => {
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.money.name);
            await row.getField('Value', 'numeric').fill(valueInvalid);
            await t
                .expect(await row.getField('Value', 'numeric').getValue()).eql('0');
        });
        await app.step(`Verify value format of the Numeric Money control`, async () => {
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.money.name);
            await row.getField('Value', 'numeric').fill(data.money.valuePositive.allSeparators);
            await t
                .expect(await row.getField('Value', 'numeric').getValue()).eql(data.money.valuePositive.decimalSeparators);
            await app.ui.pressKey('tab');
            await t
                .expect(await row.getField('Value', 'numeric').isFocused()).notOk()
                .expect(await row.getField('Value', 'numeric').verifyValue(data.money.valuePositive.allSeparatorsTrimmed)).ok();

            await row.getField('Value', 'numeric').fill(data.money.valueNegative.minus);
            await t
                .expect(await row.getField('Value', 'numeric').getValue()).eql(data.money.valueNegative.minus);
            await app.ui.pressKey('tab');
            await t
                .expect(await row.getField('Value', 'numeric').isFocused()).notOk()
                .expect(await row.getField('Value', 'numeric').verifyValue(data.money.valueNegative.minusTrimmed)).ok();
        });
});

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify '(Not) Equal' Operator behavior for Numeric Integer "${data.integer.name}" field (Step 3)`, async (t) => {
        await app.step(`Verify query results for the Numeric Integer "${data.integer.name}" field with positive value and 'Equal' operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.integer.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'numeric').fill(data.integer.valuePositive.trimmed);
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.integer.name);
            const columnValuesNum = columnValuesString.map((x) => parseFloat(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x === parseInt(data.integer.valuePositive.trimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
        await app.step('Click on the "Build complex queries" link.', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Verify query results for the Numeric Integer "${data.integer.name}" field with negative value and 'Not Equal' operator`, async () => {
            await t
            .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.integer.name);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
            await row.getField('Value', 'numeric').fill(data.integer.valueNegative.minus);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.integer.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x !== parseInt(data.integer.valueNegative.minusTrimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify "Greater Than" Operator behavior for Numeric Money "${data.money.name}" field (Step 4)`, async (t) => {
        await app.step(`Verify query results for the Numeric Money "${data.money.name}" field with positive value and "Greater Than" operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.money.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than');
            await row.getField('Value', 'numeric').fill(data.money.valuePositive.decimalSeparators);
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.money.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x > parseInt(data.money.valuePositive.decimalSeparatorsTrimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
        await app.step('Click on the "Build complex queries" link.', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Verify query results for the Numeric Money "${data.money.name}" field with negative value and "Greater Than" operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.money.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than');
            await row.getField('Value', 'numeric').fill(data.money.valueNegative.minusTrimmed);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.money.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x > parseInt(data.money.valueNegative.minusTrimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
});

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify "Less Than" Operator behavior for Numeric Decimal "${data.decimal.name}" field (Step 5)`, async (t) => {
        await app.step(`Verify query results for the Numeric Decimal "${data.decimal.name}" field with positive value and "Less Than" operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.decimal.name);
            await row.getField('Operator', 'dropdown').fill('Less Than');
            await row.getField('Value', 'numeric').fill(data.decimal.valuePositive.decimalSeparators);
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.decimal.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x < parseFloat(data.decimal.valuePositive.decimalSeparatorsTrimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
        await app.step('Click on the "Build complex queries" link.', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Verify query results for the Numeric Decimal "${data.decimal.name}" field with negative value and "Less Than" operator`, async () => {
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.decimal.name);
            await row.getField('Operator', 'dropdown').fill('Less Than');
            await row.getField('Value', 'numeric').fill(data.decimal.valueNegative.minus);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.decimal.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x < parseInt(data.money.valueNegative.minusTrimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
});

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify "Greater Than Or Equal To" Operator behavior for Numeric Integer "${data.integer.name}" field (Step 6)`, async (t) => {
        await app.step(`Verify query results for the Numeric Integer "${data.integer.name}" field with positive value and "Greater Than Or Equal To" operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.integer.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
            await row.getField('Value', 'numeric').fill(data.integer.valuePositive.trimmed);
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.integer.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x >= parseInt(data.integer.valuePositive.trimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
        await app.step('Click on the "Build complex queries" link.', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Verify query results for the Numeric Integer "${data.integer.name}" field with negative value and "Greater Than Or Equal To" operator`, async () => {
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.integer.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
            await row.getField('Value', 'numeric').fill(data.integer.valueNegative.minusTrimmed);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.integer.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x >= parseInt(data.integer.valueNegative.minusTrimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify "Less Than Or Equal To" Operator behavior for Numeric Money "${data.money.name}" field (Step 7)`, async (t) => {
        await app.step(`Verify query results for the Numeric Money "${data.money.name}" field with positive value and "Less Than Or Equal To" operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.money.name);
            await row.getField('Operator', 'dropdown').fill('Less Than Or Equal To');
            await row.getField('Value', 'numeric').fill(data.money.valuePositive.decimalSeparators);
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.money.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x <= parseFloat(data.money.valuePositive.decimalSeparatorsTrimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
        await app.step('Click on the "Build complex queries" link.', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Verify query results for the Numeric Money "${data.money.name}" field with negative value and "Less Than Or Equal To" operator`, async () => {
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.money.name);
            await row.getField('Operator', 'dropdown').fill('Less Than Or Equal To');
            await row.getField('Value', 'numeric').fill(data.money.valueNegative.minus);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.money.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x <= parseFloat(data.money.valueNegative.minusTrimmed))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify "Between" Operator behavior for Numeric Decimal "${data.decimal.name}" field (Step 8)`, async (t) => {
        await app.step(`Select the "Between" operator and verify there are two Value controls`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.decimal.name);
            await row.getField('Operator', 'dropdown').fill('Between');
            await t
                .expect(await row.getValueField('numeric', 0).isVisible()).ok()
                .expect(await row.getValueField('numeric', 1).isVisible()).ok();
        });
        await app.step(`Verify query results for the Numeric Decimal "${data.decimal.name}" field with "Between" operator`, async () => {
            await row.getValueField('numeric').fill(data.lessFields[0].value);
            await row.getValueField('numeric', 1).fill(data.greaterFields[0].value);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.decimal.name);
            const columnValuesNum = columnValuesString.map((x) => app.services.num.parseGridValues(x));
            await t
                .expect(columnValuesNum.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesNum.every((x) => x >= parseFloat(data.lessFields[0].value) && x <= parseFloat(data.greaterFields[0].value))).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
});

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify "Is (Not) Null" Operators behavior for Numeric fields (Step 9)`, async (t) => {
        await app.step(`Verify query results for the Numeric Integer "${data.integer.name}" field with "Is Null" operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.integer.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');
            await t
                .expect(await row.getField('Value', 'numeric').isPresent('input')).notOk();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.integer.name);
            await t
                .expect(columnValuesString.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesString.every((x) => x === '')).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
        await app.step('Click on the "Build complex queries" link.', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Verify query results for the Numeric Money "${data.money.name}" field with "Is Not Null" operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.money.name);
            await row.getField('Operator', 'dropdown').fill('Is Not Null');
            await t
                .expect(await row.getField('Value', 'numeric').isPresent('input')).notOk();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.money.name);
            await t
                .expect(columnValuesString.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesString.every((x) => x !== '')).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
        await app.step('Click on the "Build complex queries" link.', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step(`Verify query results for the Numeric Decimal "${data.decimal.name}" field with "Is Not Null" operator`, async () => {
            await row.getField('Field Name', 'autocomplete').fill(data.decimal.name);
            await row.getField('Operator', 'dropdown').fill('Is Not Null');
            await t
                .expect(await row.getField('Value', 'numeric').isPresent('input')).notOk();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const columnValuesString = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.decimal.name);
            await t
                .expect(columnValuesString.length).gt(0, 'No records were returned in Query Results')
                .expect(columnValuesString.every((x) => x !== '')).ok(`Some record(s) do not fit the Criteria Builder conditions`);
        });
});
