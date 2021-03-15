import app from '../../../../app';
import Datepicker from '../../../../business/fields/datepicker';
declare const test: TestFn;
declare const fixture: any;

fixture `REGRESSION.criteriaBuilder.pack. - Test ID 30125: Criteria Builder with Date`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
        await app.step('Create Data Entry record', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
        await app.step(`Update the '${data.datetime.fieldName}' value`, async () => {
            const dataEntry = app.api.dataEntryForm;
            await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                app.memory.current.createRecordData.respData.ResourceId);
            await dataEntry.setValue(data.datetime.fieldName, app.services.time.today('MM/DD/YYYY'));
            await dataEntry.setValue(data.date.fieldName, app.services.time.today('MM/DD/YYYY'));
            await dataEntry.save();
        });
    })
    .after(async () => {
        await app.step('Delete created Data Entry record', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.setDefaults();
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
    query: 'Patent>PA All Cases CB',
    datetime: {
        fieldName: 'Expiration Date',
        value: '12/20/2015'
    },
    timestamp: {
        fieldName: 'Create Date',
        value: '12/20/2015'
    },
    date: {
        fieldName: 'Custom Date #4',
        value: '12/20/2015'
    },
    adjustorMaxValue: 5000,
    adjustorMinValue: -5000
};

test
    // .only
    .meta('brief', 'true')
    ('DateTime: Verify Criteria Builder (Steps 2 - 3, 18)', async (t: TestController) => {
        await app.step('Select field with "Date" edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            const operatorValue = await row.getField('Operator', 'dropdown').getValue();
            await row.getField('Operator', 'dropdown').expandWholeList();
            const possibleValues = await row.getField('Operator', 'dropdown').getPossibleValues();
            await t
                .expect(operatorValue).eql('Equal')
                .expect(possibleValues)
                .eql(['Between', 'Equal', 'Greater Than', 'Greater Than Or Equal To', 'Is Not Null', 'Is Null', 'Less Than', 'Less Than Or Equal To', 'Not Equal'])
                .expect(await row.getFieldType('Value')).eql('datepicker')
                .expect(await row.getField('Value', 'datepicker').isVisible('calendarButton')).ok()
                .expect(await row.getField('Value', 'datepicker').isVisible('slidersButton')).ok();
        });
        await app.step('Click on Calendar icon (Step 3)', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('calendarButton');
            await t
                .expect(await field.isVisible('calendar')).ok();
        });
        await app.step('Click on Date Function icon (Step 3, 18)', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('slidersButton');
            await t
                .expect(await field.waitTillElementNotPresent('calendar')).ok()
                .expect(await field.isVisible('dateFunctionsPopup')).ok()
                .expect(await app.ui.kendoPopup.getField('Function').isVisible()).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor').isVisible()).ok()
                .expect(await app.ui.kendoPopup.getField('Function', 'dropdown').isVisible('chevron')).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').isVisible('arrowUp')).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').isVisible('arrowDown')).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql('0')
                .expect(await app.ui.kendoPopup.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.kendoPopup.isEnabled('buttons', 'Cancel')).ok()
                .expect(await app.ui.kendoPopup.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.kendoPopup.isEnabled('buttons', 'Ok')).notOk();
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectTop();
            await t
                .expect(await app.ui.kendoPopup.isEnabled('buttons', 'Ok')).ok();
            await app.ui.kendoPopup.click('buttons', 'Cancel');
            await t
                .expect(await app.ui.kendoPopup.waitTillElementNotPresent()).ok()
                .expect(await field.getValue()).eql('');
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('DateTime: The "Equal" operator and a value from calendar (Step 4)', async (t: TestController) => {
        await app.step('Set the "Field Name" value', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
        });
        await app.step('Choose a date value using Calendar', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('calendarButton');
            await field.selectToday();
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSame(app.services.time.moment().startOf('day')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('DateTime: The "Not Equal" operator and a value from calendar (Step 5)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
        });
        await app.step('Choose a date value using Calendar', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('calendarButton');
            await field.selectToday();
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => !app.services.time.moment(x, 'MM/DD/YYYY').isSame(app.services.time.moment().startOf('day')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('DateTime: The "Between" operator and values from calendar (Step 6)', async (t: TestController) => {
        const startOfMonth = app.services.time.moment().startOf('month');
        const endOfMonth = app.services.time.moment().endOf('month');
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set value fields using calendar', async () => {

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('calendarButton');
            await row.getValueField('datepicker').selectDate(startOfMonth.format('dddd, MMMM D, YYYY'));
            await row.getValueField('datepicker', 1).click('calendarButton');
            await row.getValueField('datepicker', 1).selectDate(endOfMonth.format('dddd, MMMM D, YYYY'));
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(startOfMonth) && app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(endOfMonth))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('DateTime: The "Greater Than Or Equal To" operator and set the Value field (Step 7)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
        });
        await app.step('Type value in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').typeText(data.datetime.value);
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment(data.datetime.value, 'MM/DD/YYYY')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('DateTime: The "Is Null" operator (Step 8)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Is Null');
            await t
                .expect(await row.getField('Value').isPresent('input')).notOk();
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x === '')).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('DateTime: The "Is Not Null" operator (Step 9)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Is Not Null');
            await t
                .expect(await row.getField('Value').isPresent('input')).notOk();
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x !== '')).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('DateTime: The "Less Than" operator and the "EndOfMonth" function (Step 11)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Less Than');
        });
        await app.step('Open the Functions popup and verify the Function list', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            const list = await app.ui.kendoPopup.child.getAllItemsText();
            await t
                .expect(list).eql(['AddDays() - (AD)',
                    'CurrentDate() - (CD)',
                    'EndOfMonth() - (EOM)',
                    'EndOfQuarter() - (EOQ)',
                    'EndOfWeek() - (EOW)',
                    'EndOfYear() - (EOY)',
                    'StartOfMonth() - (SOM)',
                    'StartOfQuarter() - (SOQ)',
                    'StartOfWeek() - (SOW)',
                    'StartOfYear() - (SOY)']);
        });
        await app.step('Set function in the Value field', async () => {
            await app.ui.kendoPopup.child.selectItem('EndOfMonth() - (EOM)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await t
                .expect(await row.getField('Value').getValue()).eql('EndOfMonth(0) - (EOM)');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isBefore(app.services.time.moment().endOf('month')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('DateTime: The "Less Than Or Equal To" operator and the "AddDays" function (Step 12-13)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Less Than Or Equal To');
        });
        await app.step('Open the Functions popup', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
        });
        await app.step('Set the Function field', async () => {
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('AddDays() - (AD)');
        });
        await app.step('Verify max/min values in "Adjustor"', async () => {
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill((data.adjustorMaxValue + 1).toString());
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql(data.adjustorMaxValue.toString());
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill((data.adjustorMinValue - 1).toString());
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql(data.adjustorMinValue.toString());
        });
        await app.step('Using the up/down controls set the adjustor value to "-11" (Step 13)', async () => {
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill('0');
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').decrease(11);
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql('-11');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'numeric').getValue()).eql('AddDays(-11) - (AD)');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().add(-11, 'days')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('DateTime: The "Between" operator and "StartOfYear" and "EndOfYear" functions (Step 14)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set functions in the Value fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfYear() - (SOY)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await row.getValueField('datepicker', 1).click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('EndOfYear() - (EOY)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment().startOf('year'))
                    && app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().endOf('year')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('DateTime: The "Between" operator and the "StartOfMonth" and "EndOfQuater" functions (Step 15)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set functions in the Value fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfMonth() - (SOM)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await row.getValueField('datepicker', 1).click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('EndOfQuarter() - (EOQ)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment().startOf('month')) &&
                    app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().endOf('quarter')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('DateTime: The "Between" operator and the "StartOfQuater" and "EndOfWeek" functions (Step 16)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set functions in the Value fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfQuarter() - (SOQ)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await row.getValueField('datepicker', 1).click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('EndOfWeek() - (EOW)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment().startOf('quarter')) &&
                    app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().endOf('week')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('DateTime: The "Greater Than" operator and the "CurrentDate" function (Step 17)', async (t: TestController) => {
        await app.step(`Update the '${data.datetime.fieldName}' value`, async () => {
            const dataEntry = app.api.dataEntryForm;
            await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                app.memory.current.createRecordData.respData.ResourceId);
            await dataEntry.setValue(data.datetime.fieldName, app.services.time.tomorrow('MM/DD/YYYY'));
            await dataEntry.save();
        });
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Greater Than');
        });
        await app.step('Set a value from calendar', async () => {
            const startOfMonth = app.services.time.moment().startOf('month').format('dddd, MMMM D, YYYY');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('calendarButton');
            await row.getField('Value', 'datepicker').selectDate(startOfMonth);
            const actualValue = await row.getField('Value', 'datepicker').getValue();
            await t
                .expect(app.services.time.moment(actualValue, 'MM/DD/YYYY').isSame(app.services.time.moment(startOfMonth, 'dddd, MMMM D, YYYY'))).ok();
        });
        await app.step('Set function in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('CurrentDate() - (CD)');
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor').isPresent()).notOk();
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await t
                .expect(await row.getField('Value', 'datepicker').getValue()).eql('CurrentDate() - (CD)');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isAfter(app.services.time.moment().startOf('day')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('DateTime: The "Equal" operator and the "StartOfWeek" function (Step 19)', async (t: TestController) => {
        await app.step(`Update the '${data.datetime.fieldName}' value`, async () => {
            const dataEntry = app.api.dataEntryForm;
            await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                app.memory.current.createRecordData.respData.ResourceId);
            await dataEntry.setValue(data.datetime.fieldName, app.services.time.startOfWeek('MM/DD/YYYY'));
            await dataEntry.save();
        });
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Equal');
        });
        await app.step('Set function in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfWeek() - (SOW)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSame(app.services.time.moment().startOf('week')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Timestamp: Verify Criteria Builder (Steps 2 - 3, 18)', async (t: TestController) => {
        await app.step('Select field with "Date" edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            const operatorValue = await row.getField('Operator', 'dropdown').getValue();
            await row.getField('Operator', 'dropdown').expandWholeList();
            const possibleValues = await row.getField('Operator', 'dropdown').getPossibleValues();
            await t
                .expect(operatorValue).eql('Equal')
                .expect(possibleValues)
                .eql(['Between', 'Equal', 'Greater Than', 'Greater Than Or Equal To', 'Is Not Null', 'Is Null', 'Less Than', 'Less Than Or Equal To', 'Not Equal'])
                .expect(await row.getFieldType('Value')).eql('datepicker')
                .expect(await row.getField('Value', 'datepicker').isVisible('calendarButton')).ok()
                .expect(await row.getField('Value', 'datepicker').isVisible('slidersButton')).ok();
        });
        await app.step('Click on Calendar icon (Step 3)', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('calendarButton');
            await t
                .expect(await field.isVisible('calendar')).ok();
        });
        await app.step('Click on Date Function icon (Step 3, 18)', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('slidersButton');
            await t
                .expect(await field.waitTillElementNotPresent('calendar')).ok()
                .expect(await field.isVisible('dateFunctionsPopup')).ok()
                .expect(await app.ui.kendoPopup.getField('Function').isVisible()).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor').isVisible()).ok()
                .expect(await app.ui.kendoPopup.getField('Function', 'dropdown').isVisible('chevron')).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').isVisible('arrowUp')).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').isVisible('arrowDown')).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql('0')
                .expect(await app.ui.kendoPopup.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.kendoPopup.isEnabled('buttons', 'Cancel')).ok()
                .expect(await app.ui.kendoPopup.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.kendoPopup.isEnabled('buttons', 'Ok')).notOk();
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectTop();
            await t
                .expect(await app.ui.kendoPopup.isEnabled('buttons', 'Ok')).ok();
            await app.ui.kendoPopup.click('buttons', 'Cancel');
            await t
                .expect(await app.ui.kendoPopup.waitTillElementNotPresent()).ok()
                .expect(await field.getValue()).eql('');
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Timestamp: The "Equal" operator and a value from calendar (Step 4)', async (t: TestController) => {
        await app.step('Set the "Field Name" value', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
        });
        await app.step('Choose a date value using Calendar', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('calendarButton');
            await field.selectToday();
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').startOf('day').isSame(app.services.time.moment().startOf('day')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Timestamp: The "Not Equal" operator and a value from calendar (Step 5)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
        });
        await app.step('Choose a date value using Calendar', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('calendarButton');
            await field.selectToday();
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => !app.services.time.moment(x, 'MM/DD/YYYY').isSame(app.services.time.moment().startOf('day')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Timestamp: The "Between" operator and values from calendar (Step 6)', async (t: TestController) => {
        const startOfMonth = app.services.time.moment().startOf('month');
        const endOfMonth = app.services.time.moment().endOf('month');
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set value fields using calendar', async () => {

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('calendarButton');
            await row.getValueField('datepicker').selectDate(startOfMonth.format('dddd, MMMM D, YYYY'));
            await row.getValueField('datepicker', 1).click('calendarButton');
            await row.getValueField('datepicker', 1).selectDate(endOfMonth.format('dddd, MMMM D, YYYY'));
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(startOfMonth) && app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(endOfMonth))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Timestamp: The "Greater Than Or Equal To" operator and set the Value field (Step 7)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
        });
        await app.step('Type value in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').typeText(data.timestamp.value);
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment(data.timestamp.value, 'MM/DD/YYYY')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Timestamp: The "Is Not Null" operator (Step 9)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Is Not Null');
            await t
                .expect(await row.getField('Value').isPresent('input')).notOk();
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x !== '')).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Timestamp: The "Greater Than" operator and the "EndOfMonth (-1)" function (Step 11)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Greater Than');
        });
        await app.step('Open the Functions popup and verify the Function list', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            const list = await app.ui.kendoPopup.child.getAllItemsText();
            await t
                .expect(list).eql(['AddDays() - (AD)',
                    'CurrentDate() - (CD)',
                    'EndOfMonth() - (EOM)',
                    'EndOfQuarter() - (EOQ)',
                    'EndOfWeek() - (EOW)',
                    'EndOfYear() - (EOY)',
                    'StartOfMonth() - (SOM)',
                    'StartOfQuarter() - (SOQ)',
                    'StartOfWeek() - (SOW)',
                    'StartOfYear() - (SOY)']);
        });
        await app.step('Set function in the Value field', async () => {
            await app.ui.kendoPopup.child.selectItem('EndOfMonth() - (EOM)');
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill('-1');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await t
                .expect(await row.getField('Value').getValue()).eql('EndOfMonth(-1) - (EOM)');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isAfter(app.services.time.moment().add(-1, 'month').endOf('month')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Timestamp: The "Less Than Or Equal To" operator and the "AddDays" function (Step 12-13)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Less Than Or Equal To');
        });
        await app.step('Open the Functions popup', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
        });
        await app.step('Set the Function field', async () => {
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('AddDays() - (AD)');
        });
        await app.step('Verify max/min values in "Adjustor"', async () => {
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill((data.adjustorMaxValue + 1).toString());
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql(data.adjustorMaxValue.toString());
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill((data.adjustorMinValue - 1).toString());
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql(data.adjustorMinValue.toString());
        });
        await app.step('Using the up/down controls set the adjustor value to "-11" (Step 13)', async () => {
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill('0');
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').decrease(11);
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql('-11');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'numeric').getValue()).eql('AddDays(-11) - (AD)');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().add(-11, 'days')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Timestamp: The "Between" operator and "StartOfYear" and "EndOfYear" functions (Step 14)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set functions in the Value fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfYear() - (SOY)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await row.getValueField('datepicker', 1).click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('EndOfYear() - (EOY)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment().startOf('year')) &&
                    app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().endOf('year')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Timestamp: The "Between" operator and the "StartOfMonth" and "EndOfQuater" functions (Step 15)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set functions in the Value fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfMonth() - (SOM)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await row.getValueField('datepicker', 1).click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('EndOfQuarter() - (EOQ)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment().startOf('month')) &&
                    app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().endOf('quarter')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Timestamp: The "Between" operator and the "StartOfQuater" and "EndOfWeek" functions (Step 16)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set functions in the Value fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfQuarter() - (SOQ)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await row.getValueField('datepicker', 1).click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('EndOfWeek() - (EOW)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment().startOf('quarter')) &&
                    app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().endOf('week')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Timestamp: The "Less Than" operator and the "CurrentDate" function (Step 17)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Less Than');
        });
        await app.step('Set a value from calendar', async () => {
            const startOfMonth = app.services.time.moment().startOf('month').format('dddd, MMMM D, YYYY');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('calendarButton');
            await row.getField('Value', 'datepicker').selectDate(startOfMonth);
            const actualValue = await row.getField('Value', 'datepicker').getValue();
            await t
                .expect(app.services.time.moment(actualValue, 'MM/DD/YYYY').isSame(app.services.time.moment(startOfMonth, 'dddd, MMMM D, YYYY'))).ok();
        });
        await app.step('Set function in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('CurrentDate() - (CD)');
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor').isPresent()).notOk();
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await t
                .expect(await row.getField('Value', 'datepicker').getValue()).eql('CurrentDate() - (CD)');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isBefore(app.services.time.moment().startOf('day')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Timestamp: The "Greater Than" operator and the "StartOfWeek" function (Step 19)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.timestamp.fieldName);
            await row.getField('Operator', 'dropdown').fill('Greater Than');
        });
        await app.step('Set function in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfWeek() - (SOW)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.timestamp.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.timestamp.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isAfter(app.services.time.moment().startOf('week')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Date: Verify Criteria Builder (Steps 2 - 3, 18)', async (t: TestController) => {
        await app.step('Select field with "Date" edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            const operatorValue = await row.getField('Operator', 'dropdown').getValue();
            await row.getField('Operator', 'dropdown').expandWholeList();
            const possibleValues = await row.getField('Operator', 'dropdown').getPossibleValues();
            await t
                .expect(operatorValue).eql('Equal')
                .expect(possibleValues)
                .eql(['Between', 'Equal', 'Greater Than', 'Greater Than Or Equal To', 'Is Not Null', 'Is Null', 'Less Than', 'Less Than Or Equal To', 'Not Equal'])
                .expect(await row.getFieldType('Value')).eql('datepicker')
                .expect(await row.getField('Value', 'datepicker').isVisible('calendarButton')).ok()
                .expect(await row.getField('Value', 'datepicker').isVisible('slidersButton')).ok();
        });
        await app.step('Click on Calendar icon (Step 3)', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('calendarButton');
            await t
                .expect(await field.isVisible('calendar')).ok();
        });
        await app.step('Click on Date Function icon (Step 3, 18)', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('slidersButton');
            await t
                .expect(await field.waitTillElementNotPresent('calendar')).ok()
                .expect(await field.isVisible('dateFunctionsPopup')).ok()
                .expect(await app.ui.kendoPopup.getField('Function').isVisible()).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor').isVisible()).ok()
                .expect(await app.ui.kendoPopup.getField('Function', 'dropdown').isVisible('chevron')).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').isVisible('arrowUp')).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').isVisible('arrowDown')).ok()
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql('0')
                .expect(await app.ui.kendoPopup.isVisible('buttons', 'Cancel')).ok()
                .expect(await app.ui.kendoPopup.isEnabled('buttons', 'Cancel')).ok()
                .expect(await app.ui.kendoPopup.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.kendoPopup.isEnabled('buttons', 'Ok')).notOk();
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectTop();
            await t
                .expect(await app.ui.kendoPopup.isEnabled('buttons', 'Ok')).ok();
            await app.ui.kendoPopup.click('buttons', 'Cancel');
            await t
                .expect(await app.ui.kendoPopup.waitTillElementNotPresent()).ok()
                .expect(await field.getValue()).eql('');
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Date: The "Equal" operator and a value from calendar (Step 4)', async (t: TestController) => {
        await app.step('Set the "Field Name" value', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
        });
        await app.step('Choose a date value using Calendar', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('calendarButton');
            await field.selectToday();
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSame(app.services.time.moment().startOf('day')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Date: The "Not Equal" operator and a value from calendar (Step 5)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
        });
        await app.step('Choose a date value using Calendar', async () => {
            const field: Datepicker = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'datepicker');
            await field.click('calendarButton');
            await field.selectToday();
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => !app.services.time.moment(x, 'MM/DD/YYYY').isSame(app.services.time.moment().startOf('day')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Date: The "Between" operator and values from calendar (Step 6)', async (t: TestController) => {
        const startOfMonth = app.services.time.moment().startOf('month');
        const endOfMonth = app.services.time.moment().endOf('month');
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set value fields using calendar', async () => {

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('calendarButton');
            await row.getValueField('datepicker').selectDate(startOfMonth.format('dddd, MMMM D, YYYY'));
            await row.getValueField('datepicker', 1).click('calendarButton');
            await row.getValueField('datepicker', 1).selectDate(endOfMonth.format('dddd, MMMM D, YYYY'));
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(startOfMonth) &&
                    app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(endOfMonth))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Date: The "Greater Than Or Equal To" operator and set the Value field (Step 7)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
        });
        await app.step('Type value in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').typeText(data.date.value);
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment(data.date.value, 'MM/DD/YYYY')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Date: The "Is Null" operator (Step 8)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Is Null');
            await t
                .expect(await row.getField('Value').isPresent('input')).notOk();
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x === '')).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Date: The "Is Not Null" operator (Step 9)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Is Not Null');
            await t
                .expect(await row.getField('Value').isPresent('input')).notOk();
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x !== '')).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Date: The "Less Than" operator and the "EndOfMonth" function (Step 11)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Less Than');
        });
        await app.step('Open the Functions popup and verify the Function list', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            const list = await app.ui.kendoPopup.child.getAllItemsText();
            await t
                .expect(list).eql(['AddDays() - (AD)',
                    'CurrentDate() - (CD)',
                    'EndOfMonth() - (EOM)',
                    'EndOfQuarter() - (EOQ)',
                    'EndOfWeek() - (EOW)',
                    'EndOfYear() - (EOY)',
                    'StartOfMonth() - (SOM)',
                    'StartOfQuarter() - (SOQ)',
                    'StartOfWeek() - (SOW)',
                    'StartOfYear() - (SOY)']);
        });
        await app.step('Set function in the Value field', async () => {
            await app.ui.kendoPopup.child.selectItem('EndOfMonth() - (EOM)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await t
                .expect(await row.getField('Value').getValue()).eql('EndOfMonth(0) - (EOM)');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isBefore(app.services.time.moment().endOf('month')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Date: The "Less Than Or Equal To" operator and the "AddDays" function (Step 12-13)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Less Than Or Equal To');
        });
        await app.step('Open the Functions popup', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
        });
        await app.step('Set the Function field', async () => {
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('AddDays() - (AD)');
        });
        await app.step('Verify max/min values in "Adjustor"', async () => {
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill((data.adjustorMaxValue + 1).toString());
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql(data.adjustorMaxValue.toString());
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill((data.adjustorMinValue - 1).toString());
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql(data.adjustorMinValue.toString());
        });
        await app.step('Using the up/down controls set the adjustor value to "-11" (Step 13)', async () => {
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').fill('0');
            await app.ui.kendoPopup.getField('Adjustor', 'numeric').decrease(11);
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor', 'numeric').getValue()).eql('-11');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'numeric').getValue()).eql('AddDays(-11) - (AD)');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().add(-11, 'days')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Date: The "Between" operator and "StartOfYear" and "EndOfYear" functions (Step 14)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set functions in the Value fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfYear() - (SOY)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await row.getValueField('datepicker', 1).click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('EndOfYear() - (EOY)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment().startOf('year')) &&
                    app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().endOf('year')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Date: The "Between" operator and the "StartOfMonth" and "EndOfQuater" functions (Step 15)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set functions in the Value fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfMonth() - (SOM)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await row.getValueField('datepicker', 1).click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('EndOfQuarter() - (EOQ)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment().startOf('month')) &&
                    app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().endOf('quarter')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Date: The "Between" operator and the "StartOfQuater" and "EndOfWeek" functions (Step 16)', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Between');
        });
        await app.step('Set functions in the Value fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getValueField('datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfQuarter() - (SOQ)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await row.getValueField('datepicker', 1).click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('EndOfWeek() - (EOW)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment().startOf('quarter')) &&
                    app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment().endOf('week')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Date: The "Greater Than" operator and the "CurrentDate" function (Step 17)', async (t: TestController) => {
        await app.step(`Update the '${data.date.fieldName}' value`, async () => {
            const dataEntry = app.api.dataEntryForm;
            await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                app.memory.current.createRecordData.respData.ResourceId);
            await dataEntry.setValue(data.date.fieldName, app.services.time.tomorrow('MM/DD/YYYY'));
            await dataEntry.save();
        });
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Greater Than');
        });
        await app.step('Set a value from calendar', async () => {
            const startOfMonth = app.services.time.moment().startOf('month').format('dddd, MMMM D, YYYY');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('calendarButton');
            await row.getField('Value', 'datepicker').selectDate(startOfMonth);
            const actualValue = await row.getField('Value', 'datepicker').getValue();
            await t
                .expect(app.services.time.moment(actualValue, 'MM/DD/YYYY').isSame(app.services.time.moment(startOfMonth, 'dddd, MMMM D, YYYY'))).ok();
        });
        await app.step('Set function in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('CurrentDate() - (CD)');
            await t
                .expect(await app.ui.kendoPopup.getField('Adjustor').isPresent()).notOk();
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await t
                .expect(await row.getField('Value', 'datepicker').getValue()).eql('CurrentDate() - (CD)');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isAfter(app.services.time.moment().startOf('day')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Date: The "Equal" operator and the "StartOfWeek" function (Step 19)', async (t: TestController) => {
        await app.step(`Update the '${data.date.fieldName}' value`, async () => {
            const dataEntry = app.api.dataEntryForm;
            await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                app.memory.current.createRecordData.respData.ResourceId);
            await dataEntry.setValue(data.date.fieldName, app.services.time.startOfWeek('MM/DD/YYYY'));
            await dataEntry.save();
        });
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.date.fieldName);
            await row.getField('Operator', 'dropdown').fill('Equal');
        });
        await app.step('Set function in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('StartOfWeek() - (SOW)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
        });
        await app.step('Click Show Results', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.date.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.date.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSame(app.services.time.moment().startOf('week')))).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.executeQuery)
    ('Verify Ctrl + Enter for Date with function in Criteria Builder', async (t: TestController) => {
        await app.step('Set the "Field Name" and "Operator" fields', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datetime.fieldName);
            await row.getField('Operator', 'dropdown').fill('Less Than');
        });
        await app.step('Set function in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'datepicker').click('slidersButton');
            await app.ui.kendoPopup.getField('Function', 'dropdown').expand();
            await app.ui.kendoPopup.child.selectItem('CurrentDate() - (CD)');
            await app.ui.kendoPopup.click('buttons', 'Ok');
            await t
                .expect(await row.getField('Value', 'datepicker').getValue()).eql('CurrentDate() - (CD)');
        });
        await app.step('Press Ctrl + Enter', async () => {
            const actualOperator = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown').getValue();
            const actualValue = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue();
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).ok('The query wasn\'t executed after clicking Ctrl + Enter with function in Value')
                .expect(await app.ui.noErrors()).ok('An error occured with following parameters in Criteria Builder: ' +
                    `Field Name: '${data.datetime.fieldName}', Operator: '${actualOperator}', Value with function: '${actualValue}'`);
        });
        await app.step('Verify values in Query Results', async () => {
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.datetime.fieldName);
            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isBefore(app.services.time.moment().startOf('day')))).ok();
        });
    });
