import app from '../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.criteriaBuilder.pack. - Test ID 30126: Criteria Builder with Hierarchy`
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
    (`Check Operators for different types of Hierarchy (Step 2)`, async (t) => {
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
        await app.step('Check Operator options for Party type of Hierarchy (step 2)', async () => {
            row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Client Division');
            await t
                .expect(await row.getField('Operator', 'autocomplete').getValue()).eql('Equal');
            await row.getField('Operator', 'autocomplete').expand();
            await t
                .expect(await row.getField('Operator', 'autocomplete').getAllDisplayedOptions())
                .eql(['Contains', 'Does Not Contain', 'Equal', 'Is Not Null', 'Is Null', 'Member Of', 'Not Equal'])
                .expect(await row.getFieldType('Value')).eql('hierarchy');
        });
        await app.step('Check Operator options for Code type of Hierarchy (step 2)', async () => {
            row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Convention Type');
            await t
                .expect(await row.getField('Operator', 'autocomplete').getValue()).eql('Equal');
            await row.getField('Operator', 'autocomplete').expand();
            await t
                .expect(await row.getField('Operator', 'autocomplete').getAllDisplayedOptions())
                .eql(['Contains', 'Does Not Contain', 'Equal', 'Is Not Null', 'Is Null', 'Member Of', 'Not Equal'])
                .expect(await row.getFieldType('Value')).eql('hierarchy');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Check Is (Not) Null Operator behavior for different types of Hierarchy (Step 3)`, async (t) => {
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
        await app.step('Check Is Null Operator for Party type of Hierarchy (step 3)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Client Division');
            await row.getField('Operator', 'autocomplete').fill('Is Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const notEmptyValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division')).filter((value) => {
                return value !== '';
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(notEmptyValues.length).eql(0);
        });
        await app.step('Check Is Not Null Operator for Party type of Hierarchy (step 3)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Is Not Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk()
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('');
        });
        await app.step('Check Is Null Operator for Code type of Hierarchy (step 3)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Convention Type');
            await row.getField('Operator', 'autocomplete').fill('Is Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const notEmptyValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Convention Type')).filter((value) => {
                return value !== '';
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(notEmptyValues.length).eql(0);
        });
        await app.step('Check Is Not Null Operator for Code type of Hierarchy (step 3)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Is Not Null');
            await t
                .expect(await row.getFieldType('Value')).eql('not displayed');
            await app.ui.pressKey('ctrl+enter');
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Convention Type');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(values).notContains('');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Check (Not) Equal Operator behavior for different types of Hierarchy (Steps 4-5)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'European Patent - (E)': 'CNP0000003',
            'ABC Corporation - (ABCC-1)': 'CLP0100000'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Convention Type', Value: valuesCode['European Patent - (E)']},
                {ColumnName: 'Client Division', Value: valuesCode['ABC Corporation - (ABCC-1)']}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier);
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Equal Operator for Party type of Hierarchy (step 4-5)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Client Division');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await t
                .expect(await row.getFieldType('Value')).eql('hierarchy');
            let parties = await app.services.db.executeDatabaseQuery(
                `SELECT PARTYDETAILS.PARTY, PARTIES.CODE, PARTIES.PARTYTYPEID FROM [PARTYDETAILS] JOIN PARTIES ON [PARTYDETAILS].[PARTYDETAILID] = [PARTIES].[PARTYDETAILID] WHERE PARTIES.PARTYTYPEID = 'CLP'`
            );
            parties = parties.recordset.map((row) => `${row.PARTY.trim()} - (${row.CODE.trim()})`);
            const valueField = row.getField('Value', 'hierarchy');
            await valueField.clickSearch();
            await app.ui.waitLoading({checkErrors: true});
            const options = await valueField.modal.kendoTreeview.getNShownValues(20);
            for (let option of options) {
                await t.expect(parties).contains(option);
            }
            await valueField.modal.pick('ABC Corporation - (ABCC-1)', {isPaste: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division')).filter((value) => {
                return value.toUpperCase() !== 'ABC Corporation - (ABCC-1)'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Not Equal Operator for Party type of Hierarchy (step 4-5)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Not Equal');
            await row.getField('Value', 'hierarchy').fill('ABC Corporation - (ABCC-1)', {isPaste: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('ABC Corporation - (ABCC-1)');
        });
        await app.step('Check Equal Operator for Code type of Hierarchy (step 4-5)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Convention Type');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await t
                .expect(await row.getFieldType('Value')).eql('hierarchy');
            let codes = await app.services.db.executeDatabaseQuery(
                `SELECT [CODES].[DESCRIPTION], [CODES].[CODE] FROM CODES WHERE CODETYPEID = 'CNP'`
            );
            codes = codes.recordset.map((row) => `${row.DESCRIPTION.trim()} - (${row.CODE.trim()})`);
            const valueField = row.getField('Value', 'hierarchy');
            await valueField.clickSearch();
            await app.ui.waitLoading({checkErrors: true});
            const options = await valueField.modal.kendoTreeview.getNShownValues(20);
            for (let option of options) {
                await t.expect(codes).contains(option);
            }
            await valueField.modal.pick('European Patent - (E)', {isPaste: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Convention Type')).filter((value) => {
                return value.toUpperCase() !== 'European Patent - (E)'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Not Equal Operator for Code type of Hierarchy (step 4-5)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Not Equal');
            await row.getField('Value', 'hierarchy').fill('European Patent - (E)', {isPaste: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Convention Type');
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).notContains('European Patent - (E)');
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
    (`Check (Does Not) Contain(s) Operator behavior for different types of Hierarchy ( Step 6)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'European Patent - (E)': 'CNP0000003',
            'ABC Corporation - (ABCC-1)': 'CLP0100000'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Convention Type', Value: valuesCode['European Patent - (E)']},
                {ColumnName: 'Client Division', Value: valuesCode['ABC Corporation - (ABCC-1)']}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier);
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Contains Operator for Party type of Hierarchy (step 6)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Client Division');
            await row.getField('Operator', 'autocomplete').fill('Contains');
            await t
                .expect(await row.getFieldType('Value')).eql('input');
            await row.getField('Value', 'input').fill('ABC');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division')).filter((value) => {
                return !value.toUpperCase().includes('ABC');
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Does Not Contain Operator for Party type of Hierarchy (step 6)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Does Not Contain');
            await row.getField('Value', 'input').fill('ABC');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division')).filter((value) => {
                return value.toUpperCase().includes('ABC');
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Contains Operator for Code type of Hierarchy (step 6)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Convention Type');
            await row.getField('Operator', 'autocomplete').fill('Contains');
            await t
                .expect(await row.getFieldType('Value')).eql('input');
            await row.getField('Value', 'input').fill('European');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Convention Type')).filter((value) => {
                return !value.toUpperCase().includes('European'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Does Not Contain Operator for Code type of Hierarchy (step 6)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Operator', 'autocomplete').fill('Does Not Contain');
            await row.getField('Value', 'input').fill('European');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Convention Type')).filter((value) => {
                return value.toUpperCase().includes('European'.toUpperCase());
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
    (`Check Member Of Operator behavior for different types of Hierarchy (Steps 7,8)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'TA Party Abc-001 - (TACLP1)': 'CLP1006001',
            'TA Party Abc-002 - (TACLP2)': 'CLP1006002',
            'European Patent - (E)': 'CNP0000003'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier1 = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Client Division', Value: valuesCode['TA Party Abc-001 - (TACLP1)']},
                {ColumnName: 'Convention Type', Value: valuesCode['European Patent - (E)']}
            ]);
            let modifier2 = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Client Division', Value: valuesCode['TA Party Abc-002 - (TACLP2)']},
                {ColumnName: 'Convention Type', Value: valuesCode['European Patent - (E)']}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier1);
            app.memory.current.recordsArray.push(app.memory.current.createRecordData.respData);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier2);
            app.memory.current.recordsArray.push(app.memory.current.createRecordData.respData);
            // await app.ui.refresh();
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Member Of Operator for Party type of Hierarchy (step 7)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Client Division');
            await row.getField('Operator', 'autocomplete').fill('Member Of');
            await t
                .expect(await row.getFieldType('Value')).eql('hierarchy');
            await row.getField('Value', 'hierarchy').fill('TA Party Abc-001 - (TACLP1)', {isPaste: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division');
            const otherValues = values.filter((value) => {
                value = value.toUpperCase();
                return (value !== 'TA Party Abc-002 - (TACLP2)'.toUpperCase() && value !== 'TA Party Abc-001 - (TACLP1)'.toUpperCase() && value !== 'TA Party Abc-003 - (TACLP3)'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).contains('TA Party Abc-001 - (TACLP1)')
                .expect(values).contains('TA Party Abc-002 - (TACLP2)')
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Member Of Operator for Code type of Hierarchy (step 8)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Convention Type');
            await row.getField('Operator', 'autocomplete').fill('Member Of');
            await t
                .expect(await row.getFieldType('Value')).eql('hierarchy');
            await row.getField('Value', 'hierarchy').fill('European Patent - (E)', {isPaste: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const otherValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues('Convention Type')).filter((value) => {
                return value.toUpperCase() !== 'European Patent - (E)'.toUpperCase();
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
    (`Check Different Operators behavior with CurrentUser() functionality for Hierarchy (Steps 9,10)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'TA Party Abc-001 - (TACLP1)': 'CLP1006001',
            'TA Party Abc-002 - (TACLP2)': 'CLP1006002'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier1 = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Client Division', Value: valuesCode['TA Party Abc-001 - (TACLP1)']}
            ]);
            let modifier2 = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Client Division', Value: valuesCode['TA Party Abc-002 - (TACLP2)']}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier1);
            app.memory.current.recordsArray.push(app.memory.current.createRecordData.respData);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier2);
            app.memory.current.recordsArray.push(app.memory.current.createRecordData.respData);
            // await app.ui.refresh();
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Equal Operator for CurrentUser() (step 9)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Client Division');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'hierarchy').fill('CurrentUser()', {isPaste: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division');
            const otherValues = values.filter((value) => {
                return value.toUpperCase() !== 'TA Party Abc-001 - (TACLP1)'.toUpperCase();
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(otherValues.length).eql(0);
        });
        await app.step('Check Member Of Operator for CurrentUser() (step 10)', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Client Division');
            await row.getField('Operator', 'autocomplete').fill('Member Of');
            await row.getField('Value', 'hierarchy').fill('CurrentUser()', {isPaste: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division');
            const otherValues = values.filter((value) => {
                value = value.toUpperCase();
                return (value !== 'TA Party Abc-001 - (TACLP1)'.toUpperCase() && value !== 'TA Party Abc-002 - (TACLP2)'.toUpperCase() && value !== 'TA Party Abc-003 - (TACLP3)'.toUpperCase());
            });
            currentCount = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await t
                .expect(currentCount).lt(total)
                .expect(currentCount).gt(0)
                .expect(values).contains('TA Party Abc-001 - (TACLP1)')
                .expect(values).contains('TA Party Abc-002 - (TACLP2)')
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
    (`Check Inactive Party behavior for Hierarchy (Steps 11)`, async (t) => {
        let row = app.ui.queryBoard.criteriaBuilder.getRow(0);
        let total;
        let currentCount;
        const valuesCode = {
            'TA Party Abc-003 - (TACLP3)': 'CLP1006003'
        };
        await app.step('Login', async () => {
            app.memory.reset();
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Create Patent record (API)', async () => {
            let modifier = app.services.modifiers.changeRecordPropertiesModifier([
                {ColumnName: 'Client Division', Value: valuesCode['TA Party Abc-003 - (TACLP3)']}
            ]);
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simpleTd', false, modifier);
            // await app.ui.refresh();
        });
        await app.step('Run "PA All Cases CB" query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check Equal Operator for Inactive Party (step 11)', async () => {
            total = await app.ui.queryBoard.getMenuTotalCount({isNumber: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading({checkErrors: true});
            await row.getField('Field Name', 'autocomplete').fill('Client Division');
            await row.getField('Operator', 'autocomplete').fill('Equal');
            await row.getField('Value', 'hierarchy').fill('TA Party Abc-003 - (TACLP3)', {isPaste: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const values = await app.ui.queryBoard.queryResultsGrid.getColumnValues('Client Division');
            const otherValues = values.filter((value) => {
                return value.toUpperCase() !== 'TA Party Abc-003 - (TACLP3)'.toUpperCase();
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
