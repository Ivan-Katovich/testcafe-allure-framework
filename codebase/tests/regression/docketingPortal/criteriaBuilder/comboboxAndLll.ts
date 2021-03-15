import app from '../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.criteriaBuilder.pack. - Test ID 30123: Criteria Builder with Combobox and LLL`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Check Operators for different types of Combobox and LLL (Steps 2,12)`, async (t) => {
        let row;
        await app.step('Login', async () => {
            app.memory.reset();
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
        await app.step('Check Operator options for Party type of Combobox (step 2)', async () => {
            row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Tax Agent');
            await t
                .expect(await row.getField('Operator', 'autocomplete').getValue()).eql('Equal');
            await row.getField('Operator', 'autocomplete').expand();
            await t
                .expect(await row.getField('Operator', 'autocomplete').getAllDisplayedOptions())
                .eql(['Contains', 'Does Not Contain', 'Equal', 'Is Not Null', 'Is Null', 'Member Of', 'Not Equal'])
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('Check Operator options for Code type of LLL (step 2)', async () => {
            row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Custom Code #8');
            await t
                .expect(await row.getField('Operator', 'autocomplete').getValue()).eql('Equal');
            await row.getField('Operator', 'autocomplete').expand();
            await t
                .expect(await row.getField('Operator', 'autocomplete').getAllDisplayedOptions())
                .eql(['Contains', 'Does Not Contain', 'Equal', 'Is Not Null', 'Is Null', 'Member Of', 'Not Equal'])
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('Check Operator options for Country type of Combobox (step 12)', async () => {
            row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Country / Region');
            await t
                .expect(await row.getField('Operator', 'autocomplete').getValue()).eql('Equal');
            await row.getField('Operator', 'autocomplete').expand();
            await t
                .expect(await row.getField('Operator', 'autocomplete').getAllDisplayedOptions())
                .eql(['Contains', 'Does Not Contain', 'Equal', 'Is Not Null', 'Is Null', 'Not Equal'])
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Check Is (Not) Null Operator behavior for different types of Combobox and LLL (Steps 3,13)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Is Null Operator for Party type of Combobox (step 3)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Tax Agent');
            await row.getField('Operator', 'autocomplete').fill('Is Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const notEmptyValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent')).filter((value) => {
                return value !== '';
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(notEmptyValues.length).eql(0);
        });
        await app.step('Check Is Not Null Operator for Party type of Combobox (step 3)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Is Not Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('');
        });
        await app.step('Check Is Null Operator for Country type of Combobox (step 13)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Country / Region');
            await row.getField('Operator', 'autocomplete').fill('Is Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const notEmptyValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Country / Region')).filter((value) => {
                return value !== '';
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(notEmptyValues.length).eql(0);
        });
        await app.step('Check Is Not Null Operator for Country type of Combobox (step 13)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Is Not Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Country / Region');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(values).notContains('');
        });
        await app.step('Check Is Null Operator for Code type of Combobox (step 13)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Custom Code #8');
            await row.getField('Operator', 'autocomplete').fill('Is Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const notEmptyValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Custom Code #8')).filter((value) => {
                return value !== '';
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(notEmptyValues.length).eql(0);
        });
        await app.step('Check Is Not Null Operator for Code type of Combobox (step 13)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Is Not Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Custom Code #8');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Check (Not) Equal Operator behavior for different types of Combobox and LLL (Steps 4-5,14-15)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'ABC-Patent - (ABCP)': 'AGP0000405',
            'US - (United States)': 264,
            'Haydar - (test101)': 'CDP1000000'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Tax Agent', Value: valuesCode['ABC-Patent - (ABCP)']},
                {ColumnName: 'country', Value: valuesCode['US - (United States)']},
                {ColumnName: 'Custom Code #8', Value: valuesCode['Haydar - (test101)']}
                ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier);
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Equal Operator for Party type of Combobox (step 4-5)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Tax Agent');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await t
                .expect(await row.getFieldType('Value')).eql('autocomplete');
            let parties = await app.services.db.executeDatabaseQuery(
                `SELECT PARTYDETAILS.PARTY, PARTIES.CODE, PARTIES.PARTYTYPEID FROM [PARTYDETAILS] JOIN PARTIES ON [PARTYDETAILS].[PARTYDETAILID] = [PARTIES].[PARTYDETAILID] WHERE PARTIES.PARTYTYPEID = 'AGP'`
            );
            parties = parties.recordset.map((row) => `${row.PARTY.trim()} - (${row.CODE.trim()})`);
            const valueField = row.getField('Value', 'autocomplete');
            await valueField.expand();
            await valueField.showMore();
            const options = await valueField.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(parties).contains(option);
            }
            await valueField.click('chevron');
            await valueField.fill('ABC-Patent - (ABCP)');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent')).filter((value) => {
                return value.toUpperCase() !== 'ABC-Patent - (ABCP)'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Not Equal Operator for Party type of Combobox (step 4-5)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Not Equal');
            await row.getField('Value', 'autocomplete').fill('ABC-Patent - (ABCP)');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('ABC-Patent - (ABCP)');
        });
        await app.step('Check Equal Operator for Country type of Combobox (step 14-15)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Country / Region');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await t
                .expect(await row.getFieldType('Value')).eql('autocomplete');
            let countries = await app.services.db.executeDatabaseQuery(
                `SELECT COUNTRIES.WIPO, COUNTRIES.[DESCRIPTION] FROM COUNTRIES`
            );
            countries = countries.recordset.map((row) => `${row.WIPO.trim()} - (${row.DESCRIPTION})`);
            const valueField = row.getField('Value', 'autocomplete');
            await valueField.expand();
            await valueField.showMore();
            let options = await valueField.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(countries).contains(option);
            }
            await valueField.typeText('United');
            options = await valueField.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(option).contains('United');
            }
            await valueField.typeText('US - (United States)');
            await valueField.selectTop();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Country / Region')).filter((value) => {
                return value.toUpperCase() !== 'US - (United States)'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Not Equal Operator for Country type of Combobox (step 14-15)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Not Equal');
            await row.getField('Value', 'autocomplete').typeText('US - (United States)');
            await row.getField('Value', 'autocomplete').selectTop();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Country / Region');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('US - (United States)');
        });
        await app.step('Check Equal Operator for Code type of LLL (step 4-5)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Custom Code #8');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await t
                .expect(await row.getFieldType('Value')).eql('autocomplete');
            let codes = await app.services.db.executeDatabaseQuery(
                `SELECT [CODES].[DESCRIPTION], [CODES].[CODE] FROM CODES WHERE CODETYPEID = 'CDP'`
            );
            codes = codes.recordset.map((row) => `${row.DESCRIPTION.trim()} - (${row.CODE.trim()})`);
            const valueField = row.getField('Value', 'autocomplete');
            await valueField.expand();
            const options = await valueField.getAllDisplayedOptions();
            for (let option of options) {
                await t.expect(codes).contains(option);
            }
            await valueField.fill('Haydar - (test101)');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Custom Code #8')).filter((value) => {
                return value.toUpperCase() !== 'Haydar - (test101)'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Not Equal Operator for Code type of LLL (step 4-5)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Not Equal');
            await row.getField('Value', 'autocomplete').fill('Haydar - (test101)');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Custom Code #8');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('Haydar - (test101)');
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Check (Does Not) Contain(s) Operator behavior for different types of Combobox and LLL ( Steps 6,16)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'ABC-Patent - (ABCP)': 'AGP0000405',
            'US - (United States)': 264,
            'Haydar - (test101)': 'CDP1000000'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Tax Agent', Value: valuesCode['ABC-Patent - (ABCP)']},
                {ColumnName: 'country', Value: valuesCode['US - (United States)']},
                {ColumnName: 'Custom Code #8', Value: valuesCode['Haydar - (test101)']}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier);
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Contains Operator for Party type of Combobox (step 6)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Tax Agent');
            await row.getField('Operator', 'autocomplete').fill('Contains');
            await t
                .expect(await row.getFieldType('Value')).eql('input');
            await row.getField('Value', 'input').fill('patent - (a');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent')).filter((value) => {
                return !value.toUpperCase().includes('patent - (a'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Does Not Contain Operator for Party type of Combobox (step 6)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Does Not Contain');
            await row.getField('Value', 'input').fill('patent - (a');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent')).filter((value) => {
                return value.toUpperCase().includes('patent - (a'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Contains Operator for Country type of Combobox (step 16)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Country / Region');
            await row.getField('Operator', 'autocomplete').fill('Contains');
            await t
                .expect(await row.getFieldType('Value')).eql('input');
            await row.getField('Value', 'input').fill('s - (uni');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Country / Region')).filter((value) => {
                return !value.toUpperCase().includes('s - (uni'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Does Not Contain Operator for Country type of Combobox (step 16)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Does Not Contain');
            await row.getField('Value', 'input').fill('s - (uni');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Country / Region')).filter((value) => {
                return value.toUpperCase().includes('s - (uni'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Contains Operator for Code type of LLL (step 6)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Custom Code #8');
            await row.getField('Operator', 'autocomplete').fill('Contains');
            await t
                .expect(await row.getFieldType('Value')).eql('input');
            await row.getField('Value', 'input').fill('dar - (te');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Custom Code #8')).filter((value) => {
                return !value.toUpperCase().includes('dar - (te'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Does Not Contain Operator for Code type of LLL (step 6)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Does Not Contain');
            await row.getField('Value', 'input').fill('dar - (te');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Custom Code #8')).filter((value) => {
                return value.toUpperCase().includes('dar - (te'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Check Member Of Operator behavior for different types of Combobox and LLL (Steps 7,8)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'TA Party Abc-001 - (TAAGP1)': 'AGP1006001',
            'TA Party Abc-002 - (TAAGP2)': 'AGP1006002',
            'Haydar - (test101)': 'CDP1000000'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier1 = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Tax Agent', Value: valuesCode['TA Party Abc-001 - (TAAGP1)']},
                {ColumnName: 'Custom Code #8', Value: valuesCode['Haydar - (test101)']}
            ]);
            let modifier2 = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Tax Agent', Value: valuesCode['TA Party Abc-002 - (TAAGP2)']},
                {ColumnName: 'Custom Code #8', Value: valuesCode['Haydar - (test101)']}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier1);
            app.memory.current.recordsArray.push(app.memory.current.createRecordData.respData);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier2);
            app.memory.current.recordsArray.push(app.memory.current.createRecordData.respData);
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Member Of Operator for Party type of Combobox (step 7)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Tax Agent');
            await row.getField('Operator', 'autocomplete').fill('Member Of');
            await t
                .expect(await row.getFieldType('Value')).eql('autocomplete');
            await row.getField('Value', 'autocomplete').typeText('TA Party Abc-001 - (TAAGP1)');
            await row.getField('Value', 'autocomplete').selectTop();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent');
            const otherValues = values.filter((value) => {
                value = value.toUpperCase();
                return (value !== 'TA Party Abc-002 - (TAAGP2)'.toUpperCase() && value !== 'TA Party Abc-001 - (TAAGP1)'.toUpperCase() && value !== 'TA Party Abc-003 - (TAAGP3)'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).contains('TA Party Abc-002 - (TAAGP2)')
                .expect(values).contains('TA Party Abc-001 - (TAAGP1)')
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Member Of Operator for Code type of LLL (step 8)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Custom Code #8');
            await row.getField('Operator', 'autocomplete').fill('Member Of');
            await t
                .expect(await row.getFieldType('Value')).eql('autocomplete');
            await row.getField('Value', 'autocomplete').typeText('Haydar - (test101)');
            await row.getField('Value', 'autocomplete').selectTop();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Custom Code #8')).filter((value) => {
                return value.toUpperCase() !== 'Haydar - (test101)'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray);
                app.memory.reset();
            } catch (err) {}
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Check Different Operators behavior with CurrentUser() functionality (Steps 9,10)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'TA Party Abc-001 - (TAAGP1)': 'AGP1006001',
            'TA Party Abc-002 - (TAAGP2)': 'AGP1006002'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier1 = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Tax Agent', Value: valuesCode['TA Party Abc-001 - (TAAGP1)']}
            ]);
            let modifier2 = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Tax Agent', Value: valuesCode['TA Party Abc-002 - (TAAGP2)']}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier1);
            app.memory.current.recordsArray.push(app.memory.current.createRecordData.respData);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier2);
            app.memory.current.recordsArray.push(app.memory.current.createRecordData.respData);
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check CurrentUser() for Equal Operator (step 9)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Tax Agent');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'autocomplete').typeText('CurrentUser()');
            await row.getField('Value', 'autocomplete').selectTop();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent');
            const otherValues = values.filter((value) => {
                return value.toUpperCase() !== 'TA Party Abc-001 - (TAAGP1)'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check CurrentUser() for Member Of Operator (step 10)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Tax Agent');
            await row.getField('Operator', 'autocomplete').fill('Member Of');
            await row.getField('Value', 'autocomplete').typeText('CurrentUser()');
            await row.getField('Value', 'autocomplete').selectTop();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent');
            const otherValues = values.filter((value) => {
                value = value.toUpperCase();
                return (value !== 'TA Party Abc-002 - (TAAGP2)'.toUpperCase() && value !== 'TA Party Abc-001 - (TAAGP1)'.toUpperCase() && value !== 'TA Party Abc-003 - (TAAGP3)'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).contains('TA Party Abc-002 - (TAAGP2)')
                .expect(values).contains('TA Party Abc-001 - (TAAGP1)')
                .expect(otherValues.length).eql(0);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray);
                app.memory.reset();
            } catch (err) {}
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.simple)
    (`Check Inactive Party behavior for Combobox (Steps 11)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'TA Party Abc-003 - (TAAGP3)': 'AGP1006003'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Tax Agent', Value: valuesCode['TA Party Abc-003 - (TAAGP3)']}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier);
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Equal Operator for Inactive Party (step 11)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Tax Agent');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'autocomplete').typeText('TA Party Abc-003 - (TAAGP3)');
            await row.getField('Value', 'autocomplete').selectTop();
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Tax Agent');
            const otherValues = values.filter((value) => {
                return value.toUpperCase() !== 'TA Party Abc-003 - (TAAGP3)'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
    })
    .after(async (t) => {
        await app.step('Delete the record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
                app.memory.reset();
            } catch (err) {}
        });
    });
