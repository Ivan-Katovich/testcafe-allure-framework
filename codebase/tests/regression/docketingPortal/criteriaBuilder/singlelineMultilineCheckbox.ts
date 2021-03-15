import app from '../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.criteriaBuilder.pack. - Test ID 30127: Criteria Builder with Multiline and Singleline and Checkbox`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Application Prefix', Value: 'Singleline'},
                {ColumnName: 'Application Number', Value: 'Multiline'},
                {ColumnName: 'Power of Attorney', Value: true}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
        app.memory.reset();
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create additional Patent record (API)', async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Application Prefix', Value: 'Additional SL'},
                {ColumnName: 'Application Number', Value: 'Multiline'},
                {ColumnName: 'Power of Attorney', Value: true}
            ]);
            app.memory.current.additionalRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier);
        });
    })
    (`Verify Singleline (Steps 2-6)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        let additionalRecord;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Operator options (step 2)', async () => {
            await row.getField('Field Name', 'autocomplete').fill('Application Prefix');
            await t
                .expect(await row.getField('Operator', 'autocomplete').getValue()).eql('Contains');
            await row.getField('Operator', 'autocomplete').expand();
            await t
                .expect(await row.getField('Operator', 'autocomplete').getAllDisplayedOptions())
                .eql(['Contains', 'Does Not Contain', 'Equal', 'In', 'Is Not Null', 'Is Null', 'Not Equal']);
        });
        await app.step('Check Is Null Operator (step 3)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await row.getField('Operator', 'autocomplete').selectRow('Is Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const notEmptyValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Prefix')).filter((value) => {
                return value !== '';
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(notEmptyValues.length).eql(0);
        });
        await app.step('Check Is Not Null Operator (step 3)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Is Not Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Prefix');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('');
        });
        await app.step('Check Equal Operator (step 4)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await t
                .expect(await row.getFieldType('Value')).eql('input');
            const valueField = row.getField('Value', 'input');
            await valueField.fill('Singleline');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Prefix')).filter((value) => {
                return value.toUpperCase() !== 'Singleline'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Not Equal Operator (step 4)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Not Equal');
            await row.getField('Value', 'input').fill('Singleline');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Prefix');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('Singleline');
        });
        await app.step('Check Contains Operator (step 5)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Contains');
            await t
                .expect(await row.getFieldType('Value')).eql('input');
            await row.getField('Value', 'input').fill('Ngle');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Prefix')).filter((value) => {
                return !value.toUpperCase().includes('Ngle'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Does Not Contain Operator (step 5)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Does Not Contain');
            await row.getField('Value', 'input').fill('Ngle');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Prefix')).filter((value) => {
                return value.toUpperCase().includes('Ngle'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check In Operator (step 6)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('In');
            await t
                .expect(await row.getFieldType('Value')).eql('input');
            const valueField = row.getField('Value', 'input');
            await valueField.fill('Singleline,Additional SL');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Prefix')).filter((value) => {
                return (value.toUpperCase() !== 'Singleline'.toUpperCase() && value.toUpperCase() !== 'Additional SL'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gte(2)
                .expect(otherValues.length).eql(0);
        });
    })
    .after(async (t) => {
        await app.step('Delete the additional record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.additionalRecordData.respData]);
            } catch (err) {}
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Multiline (Steps 7-8)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Operator options (step 7)', async () => {
            await row.getField('Field Name', 'autocomplete').fill('Application Number');
            await t
                .expect(await row.getField('Operator', 'autocomplete').getValue()).eql('Contains');
            await row.getField('Operator', 'autocomplete').expand();
            await t
                .expect(await row.getField('Operator', 'autocomplete').getAllDisplayedOptions())
                .eql(['Contains', 'Does Not Contain', 'Is Not Null', 'Is Null']);
        });
        await app.step('Check Is Null Operator (step 8)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await row.getField('Operator', 'autocomplete').selectRow('Is Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const notEmptyValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Number')).filter((value) => {
                return value !== '';
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(notEmptyValues.length).eql(0);
        });
        await app.step('Check Is Not Null Operator (step 8)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Is Not Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Number');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(values).notContains('');
        });
        await app.step('Check Contains Operator (step 5)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Contains');
            await t
                .expect(await row.getFieldType('Value')).eql('input');
            await row.getField('Value', 'input').fill('UltI');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Number')).filter((value) => {
                return !value.toUpperCase().includes('UltI'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Does Not Contain Operator (step 5)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Does Not Contain');
            await row.getField('Value', 'input').fill('UltI');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Application Number')).filter((value) => {
                return value.toUpperCase().includes('UltI'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Checkbox (Steps 9-11)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open Criteria Builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Operator options (step 9)', async () => {
            await row.getField('Field Name', 'autocomplete').fill('Power of Attorney');
            await t
                .expect(await row.getField('Operator', 'autocomplete').getValue()).eql('Equal');
            await row.getField('Operator', 'autocomplete').expand();
            await t
                .expect(await row.getField('Operator', 'autocomplete').getAllDisplayedOptions())
                .eql(['Equal']);
        });
        await app.step('Check Value Options (step 10)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await row.getField('Operator', 'autocomplete').selectRow('Equal');
            await t
                .expect(await row.getFieldType('Value')).eql('dropdown');
            await row.getField('Value', 'dropdown').expand();
            await t
                .expect(await row.getField('Value', 'dropdown').getPossibleValues())
                .eql(['Checked', 'Not Checked']);
        });
        await app.step('Check Checked Values (step 11)', async () => {
            await row.getField('Value', 'dropdown').selectRow('Checked');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Power of Attorney');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains(false);
        });
        await app.step('Check Not Checked Values (step 11)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Value', 'dropdown').fill('Not Checked');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Power of Attorney');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains(true);
        });
    });
