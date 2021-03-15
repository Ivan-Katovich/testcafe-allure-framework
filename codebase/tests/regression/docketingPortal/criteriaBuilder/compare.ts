import app from '../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.criteriaBuilder.pack. - Test ID 30124: Criteria Builder with Compare`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
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
    singleline: { name1: 'Create User', name2: 'Manual Expiration User', editControlType: 'SINGLELINE' },
    multiline: { name1: 'Application Number', name2: 'Custom Text #1', editControlType: 'MULTILINE' },
    largeList: { name1: 'Agent', name2: 'Custom Party #1', editControlType: 'LARGE LIST LOOKUP'},
    combobox: { name1: 'Country / Region', name2: 'Parent Country / Region', editControlType: 'COMBOBOX' },
    hierarchy: { name1: 'Convention Type', name2: 'Custom Code #6', editControlType: 'Hierarchy' },
    checkbox: { name1: 'Power of Attorney', name2: 'First Tax Paid', editControlType: 'CHECKBOX'},
    numeric: {
        query: 'Patent>Patent Expenses',
        int: { name1: 'Drawings', name2: 'Total Claims', editControlType: 'NUMERIC'},
        money: { name1: 'Amount', name2: 'USA Amount', editControlType: 'NUMERIC'},
        decimal: { name1: 'PRM_ID', name2: 'Percentage', editControlType: 'NUMERIC'}
    },
    datepicker: { name1: 'Expiration Date', name2: 'Parent Expiration Date', editControlType: 'DATE' }
};

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    ('Verify Compare in criteria builder for Singleline (Step 2)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with singleline edit control', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.singleline.name1);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values.', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            await t
                .expect(await field.getPossibleValues()).eql(['Equal', 'Not Equal']);
        });
        await app.step('Set the Operator as "Equal" and verify the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Operator', 'dropdown');
            await field.fill('Equal');
            await t
                .expect(await field.getValue()).eql('Equal')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Click on "Value" field and verify the list of values', async () => {
            const controlTypeID = (await app.api.administration.getControlTypes()).Items
                .find((x) => x.Name === data.singleline.editControlType).CodeId;
            await app.api.query.openQuery(data.query);
            const expectedValues = (await app.api.query.getQueryMetadata()).FieldMetadata
                .filter((x) => x.EditControlType === controlTypeID)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'dropdown');
            await field.fill(data.singleline.name2);
            await t
                .expect(await field.getValue()).eql(data.singleline.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = await row.getValue(data.singleline.name1);
                const field2 = await row.getValue(data.singleline.name2);
                await t
                    .expect(field1).eql(field2, 'Query Results do not correspond the criteria builder filter');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    ('Verify Compare in criteria builder for Multiline (Step 3)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with Multiline Edit Control Type in the Filed Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.multiline.name1);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.multiline.name1)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql([ 'Equal', 'Not Equal']);
        });
        await app.step('Set the Operator as "Equal" and verify the "Value" field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Set any value in the Value field', async () => {
            const controlTypeID = (await app.api.administration.getControlTypes()).Items
                .find((x) => x.Name === data.multiline.editControlType).CodeId;
            await app.api.query.openQuery(data.query);
            const expectedValues = (await app.api.query.getQueryMetadata()).FieldMetadata
                .filter((x) => x.EditControlType === controlTypeID)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'dropdown');
            await field.fill(data.multiline.name2);
            await t
                .expect(await field.getValue()).eql(data.multiline.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = await row.getValue(data.multiline.name1);
                const field2 = await row.getValue(data.multiline.name2);
                await t
                    .expect(field1).eql(field2, 'Query Results do not correspond the criteria builder filter');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    ('Verify Compare in criteria builder for Large List Lookup (Step 4)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with Large List Lookup Edit Control Type in the Criteria Builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'dropdown').typeText(data.largeList.name1);
            await row.getField('Field Name', 'dropdown').pressKey('tab');
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.largeList.name1)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql([ 'Equal', 'Not Equal']);
        });
        await app.step('Set the Operator as "Equal" and verify the "Value" field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Click on "Value" field and verify the list of values', async () => {
            await app.api.query.openQuery(data.query);
            const queryMetadata = await app.api.query.getQueryMetadata();
            const lookupSource = queryMetadata.FieldMetadata.find((x) => x.CustomValue === data.largeList.name1).LookupSource;
            const expectedValues = queryMetadata.FieldMetadata
                .filter((x) => x.LookupSource === lookupSource)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'dropdown');
            await field.fill(data.largeList.name2);
            await t
                .expect(await field.getValue()).eql(data.largeList.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = await row.getValue(data.largeList.name1);
                const field2 = await row.getValue(data.largeList.name2);
                await t
                    .expect(field1).eql(field2, 'Query Results do not correspond the criteria builder filter');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    ('Verify Compare in criteria builder for Combobox (Step 5)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with Combobox Control Type in the Criteria Builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.combobox.name1);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.combobox.name1)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql([ 'Equal', 'Not Equal']);
        });
        await app.step('Set the Operator as "Equal" and verify the "Value" field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Not Equal')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Click on "Value" field and verify the list of values', async () => {
            await app.api.query.openQuery(data.query);
            const queryMetadata = await app.api.query.getQueryMetadata();
            const lookupSource = queryMetadata.FieldMetadata.find((x) => x.CustomValue === data.combobox.name1).LookupSource;
            const expectedValues = queryMetadata.FieldMetadata
                .filter((x) => x.LookupSource === lookupSource)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'dropdown');
            await field.fill(data.combobox.name2);
            await t
                .expect(await field.getValue()).eql(data.combobox.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = await row.getValue(data.combobox.name1);
                const field2 = await row.getValue(data.combobox.name2);
                await t
                    .expect(field1).notEql(field2, 'Query Results do not correspond the criteria builder filter');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    ('Verify Compare in criteria builder for Hierarchy (Step 6)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with Hierarchy Edit Control Type in the Criteria Builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.hierarchy.name1);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.hierarchy.name1)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql([ 'Equal', 'Not Equal']);
        });
        await app.step('Set the Operator as "Equal" and verify the "Value" field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Click on "Value" field and verify the list of values', async () => {
            await app.api.query.openQuery(data.query);
            const queryMetadata = await app.api.query.getQueryMetadata();
            const lookupSource = queryMetadata.FieldMetadata.find((x) => x.CustomValue === data.hierarchy.name1).LookupSource;
            const expectedValues = queryMetadata.FieldMetadata
                .filter((x) => x.LookupSource === lookupSource)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'dropdown');
            await field.fill(data.hierarchy.name2);
            await t
                .expect(await field.getValue()).eql(data.hierarchy.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = await row.getValue(data.hierarchy.name1);
                const field2 = await row.getValue(data.hierarchy.name2);
                await t
                    .expect(field1).eql(field2, 'Query Results do not correspond the criteria builder filter');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    ('Verify Compare in criteria builder for Checkbox (Step 7)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with Checkbox Edit Control Type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.checkbox.name1);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.checkbox.name1)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values.', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            await t
                .expect(await field.getPossibleValues()).eql( ['Equal', 'Not Equal'] );
        });
        await app.step('Set the Operator as "Not Equal" and verify the "Value" field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Not Equal')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Click on "Value" field and verify the list of values', async () => {
            const controlTypeID = (await app.api.administration.getControlTypes()).Items
                .find((x) => x.Name === data.checkbox.editControlType).CodeId;
            await app.api.query.openQuery(data.query);
            const expectedValues = (await app.api.query.getQueryMetadata()).FieldMetadata
                .filter((x) => x.EditControlType === controlTypeID)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'dropdown').fill(data.checkbox.name2);
            await t
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.checkbox.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = await row.getValue(data.checkbox.name1);
                const field2 = await row.getValue(data.checkbox.name2);
                await t
                    .expect(field1).notEql(field2, 'Query Results do not correspond the criteria builder filter');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Login and run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.numeric.query);
            await app.ui.waitLoading({checkErrors: true});
        });
    })
    ('Verify Compare in criteria builder for Numeric Decimal (Step 8)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with Numeric Edit Control Type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.numeric.decimal.name1);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.numeric.decimal.name1)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values.', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql( ['Equal', 'Not Equal'] );
        });
        await app.step('Set the Operator as "Equal" and verify the "Value" field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Click on "Value" field and verify the list of values', async () => {
            const controlTypeID = (await app.api.administration.getControlTypes()).Items
                .find((x) => x.Name === data.numeric.decimal.editControlType).CodeId;
            await app.api.query.openQuery(data.numeric.query);
            const metadata = (await app.api.query.getQueryMetadata()).FieldMetadata;
            const controlInfo = metadata.find((x) => x.CustomValue === data.numeric.decimal.name1);
            const expectedValues = metadata
                .filter((x) => x.EditControlType === controlTypeID && x.DataType === controlInfo.DataType)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'dropdown').fill(data.numeric.decimal.name2);
            await t
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.numeric.decimal.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = await row.getValue(data.numeric.decimal.name1);
                const field2 = await row.getValue(data.numeric.decimal.name2);
                await t
                    .expect(field1).eql(field2, 'Query Results do not correspond the criteria builder filter');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    ('Verify Compare in criteria builder for Numeric Integer (Step 9)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with Numeric Edit Control Type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.numeric.int.name1);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.numeric.int.name1)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values.', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql( ['Between', 'Equal', 'Greater Than', 'Greater Than Or Equal To', 'Less Than', 'Less Than Or Equal To', 'Not Equal'] );
        });
        await app.step('Set the Operator as "Equal" and verify the "Value" field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Click on "Value" field and verify the list of values', async () => {
            const controlTypeID = (await app.api.administration.getControlTypes()).Items
                .find((x) => x.Name === data.numeric.int.editControlType).CodeId;
            await app.api.query.openQuery(data.query);
            const metadata = (await app.api.query.getQueryMetadata()).FieldMetadata;
            const controlInfo = metadata.find((x) => x.CustomValue === data.numeric.int.name1);
            const expectedValues = metadata
                .filter((x) => x.EditControlType === controlTypeID && x.DataType === controlInfo.DataType)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'dropdown').fill(data.numeric.int.name2);
            await t
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.numeric.int.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = await row.getValue(data.numeric.int.name1);
                const field2 = await row.getValue(data.numeric.int.name2);
                await t
                    .expect(field1).eql(field2, 'Query Results do not correspond the criteria builder filter');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Login and run query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.numeric.query);
            await app.ui.waitLoading({checkErrors: true});
        });
    })
    ('Verify Compare in criteria builder for Numeric Money (Step 10)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with Numeric Edit Control Type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.numeric.money.name1);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.numeric.money.name1)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values.', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql( ['Equal', 'Not Equal'] );
        });
        await app.step('Set the Operator as "Equal" and verify the "Value" field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Click on "Value" field and verify the list of values', async () => {
            const controlTypeID = (await app.api.administration.getControlTypes()).Items
                .find((x) => x.Name === data.numeric.money.editControlType).CodeId;
            await app.api.query.openQuery(data.numeric.query);
            const metadata = (await app.api.query.getQueryMetadata()).FieldMetadata;
            const controlInfo = metadata.find((x) => x.CustomValue === data.numeric.money.name1);
            const expectedValues = metadata
                .filter((x) => x.EditControlType === controlTypeID && x.DataType === controlInfo.DataType)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'dropdown').fill(data.numeric.money.name2);
            await t
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.numeric.money.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = await row.getValue(data.numeric.money.name1);
                const field2 = await row.getValue(data.numeric.money.name2);
                await t
                    .expect(field1).eql(field2, 'Query Results do not correspond the criteria builder filter');
            }
        });
    });

test
    // .disablePageReloads
    // .only
    .meta('brief', 'true')
    ('Verify Compare in criteria builder for Datepicker (Step 11)', async (t: TestController) => {
        await app.step('Set "Compare" checkbox for the first row of the Criteria Builder', async () => {
            const field = await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Compare', 'checkbox');
            await field.check();
            await t.
                expect(await field.isChecked()).eql(true);
        });
        await app.step('Select field with Datepicker Edit Control Type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.datepicker.name1);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.datepicker.name1)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal');
        });
        await app.step('Click on the Operator field and verify the list of values.', async () => {
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Operator', 'dropdown');
            await field.expandWholeList();
            const possibleValues = await field.getPossibleValues();
            await t
                .expect(possibleValues).eql( ['Between', 'Equal', 'Greater Than', 'Greater Than Or Equal To', 'Less Than', 'Less Than Or Equal To', 'Not Equal'] );
        });
        await app.step('Set the Operator as "Equal" and verify the "Value" field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Operator', 'dropdown').fill('Greater Than');
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Greater Than')
                .expect(await row.getField('Value').getAttribute('input', 'role')).eql('combobox');
        });
        await app.step('Click on "Value" field and verify the list of values', async () => {
            await app.api.query.openQuery(data.query);
            const controlTypeID = (await app.api.administration.getControlTypes()).Items
                .find((x) => x.Name === data.datepicker.editControlType).CodeId;
            const metadata = (await app.api.query.getQueryMetadata()).FieldMetadata;
            const expectedValues = metadata
                .filter((x) => x.EditControlType === controlTypeID)
                .map((x) => x.CustomValue);

            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const field = row.getField('Value', 'dropdown');
            await field.expandWholeList();
            const actualValues = await field.getPossibleValues();
            await t
                .expect(actualValues).eql(expectedValues);
        });
        await app.step('Set any value in the Value field', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Value', 'dropdown').fill(data.datepicker.name2);
            await t
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.datepicker.name2);
        });
        await app.step('Click Show Results and check the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(recordCount > 0).ok();
            for (let i = 0; i < recordCount; i++) {
                const row = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const field1 = app.services.time.getSeconds(await row.getValue(data.datepicker.name1), {pattern: 'MM/DD/YYYY'});
                const field2 = app.services.time.getSeconds(await row.getValue(data.datepicker.name2), {pattern: 'MM/DD/YYYY'});
                await t
                    .expect(field1 > field2).ok('Query Results do not correspond the criteria builder filter');
            }
        });
    });
