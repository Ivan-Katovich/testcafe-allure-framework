import app from '../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

fixture `REGRESSION.criteriaBuilder.pack. - Test ID 30129: Criteria Builder_Overall`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const data = {
    query: {
        page: 'Query',
        url: 'UI/queries',
        fieldName: 'Country / Region',
        operator: 'Equal',
        fieldName2: 'Tax Agent',
        operator2: 'Not Equal',
        fieldValue: 'AE - (United Arab Emirates)',
        fieldValue2: 'JP - (Japan)',
        fieldNameCombobox: 'Country / Region',
        fieldNameSingleLine: 'Docket Number',
        query: 'Patent>PA All Cases CB',
        query2: 'Patent>PA All Actions',
        singleline: { name: 'Docket Number', value: 'patent' },
        multiline: { name: 'Application Number', value: 'test' },
        combobox: { name: 'Tax Agent' },
        hierarchy: { name: 'Convention Type', value: 'Paris Convention - (P)' },
        numeric: { name: 'Drawings', value: '10' },
        checkbox: { name: 'Power of Attorney', value: 'Checked', expectedValue: 'check' },
        datepicker: { name: 'Expiration Date', value: '2/6/2019' },
        largeList: { name: 'Custom Code #8'},
        country: { name: 'Country / Region', value: 'AM - (Armenia)'}
    },
    messageCenter: {
        page: 'Message Center',
        url: 'UI/message-center?resetMessageCenter=1',
        query: 'Message Center>Pending Rules Validation>Patents',
        query2: 'Message Center>Review Messages>TrademarkMasters',
        source: 'QRYPA_MASTERTITLE',
        fieldName: 'Country / Region',
        operator: 'Equal',
        fieldName2: 'Case Type',
        operator2: 'Not Equal',
        fieldValue: 'AE - (United Arab Emirates)',
        fieldValue2: 'JP - (Japan)',
        fieldNameCombobox: 'Country / Region',
        fieldNameSingleLine: 'Docket Number',
        singleline: { name: 'Docket Number', value: 'patent' },
        combobox: { name: 'Case Type' },
        datepicker: { name: 'Create Date', value: '2/6/2019' },
        country: { name: 'Country / Region', value: 'AM - (Armenia)'}
    },
    party: {
        page: 'Party Query',
        url: 'UI/party/queries',
        query: 'Party>Party Query',
        query2: 'Party>Party Query TA filter',
        fieldName: 'Citizenship',
        operator: 'Equal',
        fieldName2: 'Party Type',
        operator2: 'Does Not Contain',
        fieldValue: 'US - (United States)',
        fieldValue2: 'AD - (Andorra)',
        fieldNameCombobox: 'Citizenship',
        fieldNameSingleLine: 'CODE',
        singleline: { name: 'Party Type', value: 'patent' },
        combobox: { name: 'Custom Code #2' },
        datepicker: { name: 'Custom Date #1', value: '2/6/2019' },
        country: { name: 'Citizenship', value: 'US - (United States)'}
    },
    auditLog: {
        page: 'Audit Log',
        url: 'UI/administration/audit-log',
        query: 'Audit Log>Patent Audit Query',
        query2: 'Audit Log>Trademark Audit Query',
        source: 'QRYPatent_AUDITS',
        fieldName: 'Country / Region',
        operator: 'Equal',
        fieldName2: 'Status',
        operator2: 'Not Equal',
        fieldValue: 'AE - (United Arab Emirates)',
        fieldValue2: 'JP - (Japan)',
        fieldNameCombobox: 'Country / Region',
        fieldNameSingleLine: 'AUDITID',
        singleline: { name: 'Docket Number', value: 'patent' },
        singleline2: { name: 'AUDITID', value: '2' },
        combobox: { name: 'Case Type' },
        country: { name: 'Country / Region', value: 'AM - (Armenia)'}
    },
    deletion: {
        page: 'Deletion Management',
        url: 'UI/administration/deletion-management',
        query: 'Deletion Management>Patent Deleted Query',
        query2: 'Deletion Management>Trademark Deleted Query',
        source: 'QRYPatent_DELETIONAUDITS',
        fieldName: 'Country / Region',
        operator: 'Equal',
        fieldName2: 'Status',
        operator2: 'Does Not Contain',
        fieldValue: 'AE - (United Arab Emirates)',
        fieldValue2: 'JP - (Japan)',
        fieldNameCombobox: 'Country / Region',
        fieldNameSingleLine: 'AUDITID',
        singleline: { name: 'Docket Number', value: 'patent' },
        combobox: { name: 'Case Type', value: 'Regular - (REG)' },
        singleline2: { name: 'Deletion User', value: '***.com' },
        country: { name: 'Country / Region', value: 'AM - (Armenia)'}
    },
    globalChangeLog: {
        page: 'Global Change Log',
        url: 'UI/administration/global-change-log',
        query: 'Global Change Log>Patents Log',
        query2: 'Global Change Log>TradeMark Log',
        source: 'VW_PATENTGLOBALCHANGEAUDIT',
        fieldName: 'Country / Region',
        operator: 'Equal',
        fieldName2: 'Agent',
        operator2: 'Not Equal',
        fieldValue: 'CA - (Canada)',
        fieldValue2: 'JP - (Japan)',
        fieldNameCombobox: 'Country / Region',
        fieldNameSingleLine: 'Docket Number',
        singleline: { name: 'Docket Number', value: 'patent' },
        combobox: { name: 'Case Type' },
        combobox2: { name: 'Status', value: 'Docketed - (D)' },
        country: { name: 'Country / Region', value: 'US - (United States)'}
    },
    countries: {
        page: 'Countries / Regions',
        url: 'UI/queries',
        query: 'Countries / Regions>All Countries / Regions',
        query2: 'Countries / Regions>PA All Cases',
        fieldName: 'Description',
        operator: 'Equal',
        fieldName2: 'Remarks',
        operator2: 'Contains',
        fieldValue: 'Argentina',
        fieldValue2: 'Bahamas',
        singleline1: { name: 'Country / Region ID', value: '1' },
        singleline2: { name: 'Country / Region', value: 'A' },
        singleline3: { name: 'WIPO', value: 'AZ' },
        singleline4: { name: 'Description', value: 'Bahamas'}
    },
    crossmodule: {
        page: 'Cross Module',
        url: 'UI/queries',
        query: 'TA Cross Module',
        query2: 'Patent>PA All Actions',
        fieldName: 'Patents_Country / Region',
        operator: 'Equal',
        fieldName2: 'Create Date',
        operator2: 'Not Equal',
        fieldValue: 'AE - (United Arab Emirates)',
        fieldValue2: 'JP - (Japan)',
        fieldNameCombobox: 'Patents_Country / Region',
        fieldNameSingleLine: 'Patents_Docket Number',
        singleline: { name: 'Patents_Docket Number', value: 'patent' },
        combobox: { name: 'Patents_Case Type' },
        datepicker: { name: 'Create Date', value: '2/6/2019' },
        country: { name: 'Patents_Country / Region', value: 'AM - (Armenia)'}
    },
    joinparties: {
        page: 'Join Parties',
        url: 'UI/queries',
        query: 'Patent>Parties Join With Patent',
        query2: 'Patent>PA All Actions',
        fieldName: 'Country / Region',
        operator: 'Equal',
        fieldName2: 'Filing Type',
        operator2: 'Contains',
        fieldValue: 'US - (United States)',
        fieldValue2: 'JP - (Japan)',
        fieldNameCombobox: 'Country / Region',
        fieldNameSingleLine: 'Docket Number',
        singleline: { name: 'Docket Number', value: 'IPRules' },
        combobox: { name: 'Agent' },
        datepicker: { name: 'Patents_Create Date', value: '2/6/2019' },
        country: { name: 'Country / Region', value: 'AM - (Armenia)'}
    },
    queryManagement: {
        page: 'Query',
        url: 'UI/queries',
        fieldName: 'Country / Region',
        operator: 'Equal',
        fieldName2: 'Application Number',
        operator2: 'Contains',
        fieldValue: 'AE - (United Arab Emirates)',
        fieldValue2: 'JP - (Japan)',
        fieldNameCombobox: 'Country / Region',
        fieldNameSingleLine: 'Docket Number',
        query: 'Patent>PA All Cases CB',
        singleline: { name: 'Docket Number', value: 'patent' },
        multiline: { name: 'Application Number', value: 'test' },
        combobox: { name: 'Tax Agent' },
        hierarchy: { name: 'Convention Type', value: 'Paris Convention - (P)' },
        numeric: { name: 'Drawings', value: '10' },
        checkbox: { name: 'Power of Attorney', value: 'Checked', expectedValue: 'check' },
        datepicker: { name: 'Expiration Date', value: '2/6/2019' },
        largeList: { name: 'Custom Code #8'},
        country: { name: 'Country / Region', value: 'AM - (Armenia)'}
    },
    relationships: {
        queryName: 'Patent>PA All Cases CB',
        queryName2: 'Patent>PA All Active',
        fieldName: 'Country / Region',
        operator: 'Equal',
        fieldName2: 'Status',
        operator2: 'Equal',
        fieldValue: 'US - (United States)',
        fieldValue2: 'AE - (United Arab Emirates)',
        fieldNameCombobox: 'Country / Region',
        fieldNameSingleLine: 'Docket Number',
        defTemplate: 'TA DEF for Patent',
        singleline: { name: 'Docket Number', value: 'patent' },
        multiline: { name: 'Application Number', value: 'test' },
        combobox: { name: 'Tax Agent' },
        hierarchy: { name: 'Convention Type', value: 'Paris Convention - (P)' },
        numeric: { name: 'Drawings', value: '10' },
        checkbox: { name: 'Power of Attorney', value: 'Checked', expectedValue: 'check' },
        datepicker: { name: 'Expiration Date', value: '2/6/2019' },
        largeList: { name: 'Custom Code #8'},
        country: { name: 'Country / Region', value: 'AM - (Armenia)'}
    }
};

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Query - Steps 1-10)`, async (t: TestController) => {
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.query.query);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
            }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            await app.api.query.openQuery(data.query.query);
            const sourceInfoFields = (await app.api.query.openQueryManagement()).QueryMetadata.FieldMetadata.map((x) => x.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1)).eql(sourceInfoFields.sort(app.services.sorting.appSortAlphabetically));
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.query.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.query.operator);
            await row.getField('Value', 'autocomplete').fill(data.query.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.query.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.query.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.query.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryBoard.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.query.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.query.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.query.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.query.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.query.operator);
            await row.getField('Value', 'autocomplete').fill(data.query.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.query.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.query.operator2);

            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.query.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.query.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.query.fieldValue2);
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on Cross button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.query.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.query.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on Reset button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Select field with Combobox edit control type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.query.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.query.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.query.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getText('queryBuilderName')).eql(data.query.query2.split('>').pop())
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
        await app.step('Reopen query', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.query.query);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Set any criterias in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.query.fieldName);
            await row.getField('Value', 'autocomplete').fill(data.query.fieldValue);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.query.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.query.fieldValue);
        });
        await app.step('Click on any record, back to the query and verify criteria builder.', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading();
            await app.ui.goBack();
            await app.ui.queryBoard.waitTillElementPresent('menu', undefined, { timeout: 20000 });
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.buildComplexQueries();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.query.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.query.fieldValue);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Criteria Builder with multiple filters and conjunctions for Patents query - (Step 11)', async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.query.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Add criteria for a singleline', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.query.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.query.singleline.value);
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.query.country.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.query.country.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
        });
        await app.step('Add criteria for a multiline', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.query.multiline.name);
            await row.getField('Operator', 'dropdown').fill('Does Not Contain');
            await row.getField('Value', 'input').fill(data.query.multiline.value);
        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.query.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');
        });
        await app.step('Add criteria for a hierarchy', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(3).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(4);
            await row.getField('Field Name', 'autocomplete').fill(data.query.hierarchy.name);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
            await row.getField('Value', 'hierarchy').fill(data.query.hierarchy.value);
        });
        await app.step('Add criteria for a datepicker', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(4).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(5);
            await row.getField('Field Name', 'autocomplete').fill(data.query.datepicker.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
            await row.getField('Value', 'datepicker').fill(data.query.datepicker.value);
            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a numeric', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(5).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(6);
            await row.getField('Field Name', 'autocomplete').fill(data.query.numeric.name);
            await row.getField('Operator', 'dropdown').fill('Less Than Or Equal To');
            await row.getField('Value', 'input').fill(data.query.numeric.value);
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for a large list lookup', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(6).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(7);
            await row.getField('Field Name', 'autocomplete').fill(data.query.largeList.name);
            await row.getField('Operator', 'dropdown').fill('Is Not Null');
            await row.getField('Conjunction', 'dropdown').fill('Or');
        });
        await app.step('Add criteria for a checkbox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(7).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(8);
            await row.getField('Field Name', 'autocomplete').fill(data.query.checkbox.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'dropdown').fill(data.query.checkbox.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const singleline = await record.getValue(data.query.singleline.name);
                const multiline = await record.getValue(data.query.multiline.name);
                const combobox = await record.getValue(data.query.combobox.name);
                const largeList = await record.getValue(data.query.largeList.name);
                const hierarchy = await record.getValue(data.query.hierarchy.name);
                const numeric = await record.getValue(data.query.numeric.name);
                const datepicker = await record.getValue(data.query.datepicker.name);
                const checkbox = await record.getValue(data.query.checkbox.name);
                const country = await record.getValue(data.query.country.name);
                const fitCondition =
                    (singleline.toLowerCase().includes(data.query.singleline.value.toLowerCase()) &&
                        country === data.query.country.value ||
                        !multiline.includes(data.query.multiline.value) &&
                        combobox === '' &&
                        hierarchy !== data.query.hierarchy.value &&
                        app.services.time.getSeconds(datepicker, {pattern: 'MM/DD/YYYY'}) > app.services.time.getSeconds(data.query.datepicker.value, {pattern: 'MM/DD/YYYY'})) ||
                    (Number(numeric) <= Number(data.query.numeric.value) &&
                        largeList !== '' ||
                        checkbox === data.query.checkbox.expectedValue);
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Permissions in Criteria Builder (Steps 13-15)', async (t: TestController) => {
        let expectedCountriesList: [];
        let sourceInfoFields: any[];
        let expectedFieldsList: string[];
        await app.step('Get expected countries list (API)', async () => {
            expectedCountriesList = (await app.api.common.getCountriesForIPType('PatentMasters'))
                .Data.map((x) => x.Name.trim()).sort();
        });
        await app.step('Get all fields for query (API)', async () => {
            await app.api.query.openQuery('GeneralIP1>GIP1 All Actions');
            sourceInfoFields = (await app.api.query.openQueryManagement()).QueryMetadata.FieldMetadata;
        });
        await app.step('Change permissions in the content group of the user', async () => {
            const contentGroup = app.api.administration.contentGroup;
            await contentGroup.openContentGroup(globalConfig.user.contentGroup);
            await contentGroup.setApplicationSecurityWithCondition('PatentMasters', {visibleCondition: 'US Records'});
            await contentGroup.setApplicationSecurity('PatentMasters>PATENTS>Docket Number', { editPermission: false, visiblePermission: false } );
            await contentGroup.setApplicationSecurity('PatentMasters>PATENTS>Case Type', { editPermission: false, visiblePermission: false });
            await contentGroup.setApplicationSecurity('DisclosureMasters', { editPermission: false, visiblePermission: false });
            await contentGroup.setApplicationSecurity('GeneralIP1Masters>ACTIONS', { editPermission: false, visiblePermission: false });
            await contentGroup.save();
        });
        await app.step('Get fields with visible permissions (API)', async () => {
            const fieldsOfChildWithoutPermission = app.api.administration.contentGroup.getNodeChildrenNames('GeneralIP1Masters>ACTIONS');
            const indexesOfFieldsWithoutPermissions = fieldsOfChildWithoutPermission.map((x) => sourceInfoFields.findIndex((y) => y.OriginalLabel === x));
            expectedFieldsList = sourceInfoFields.filter((x: string, i: number) => !indexesOfFieldsWithoutPermissions.includes(i)).map((x) => x.CustomValue);
        });
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases CB');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Check that the Field Name section doesn\'t contain fields without permissions.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const row = criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'dropdown').expandWholeList();
            const possibleValues = await row.getField('Field Name', 'dropdown').getPossibleValues();
            await app.ui.pressKey('esc');
            await t
                .expect(possibleValues).notContains('Docket Number')
                .expect(possibleValues).notContains('Case Type');
        });
        await app.step('Check that all countries are displayed in the Value dropdown', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const row = criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill('Country / Region');
            await row.getField('Value', 'dropdown').expandWholeList();
            const possibleValues = (await row.getField('Value', 'dropdown').getPossibleValues()).sort();
            await app.ui.pressKey('esc');
            await t
                .expect(possibleValues).eql(expectedCountriesList);
        });
        await app.step('Check a query of the IP Type without Visible permissions', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open('Disclosure>DS All Cases');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await t
                .expect(await app.ui.queryBoard.getText('errorHeader')).eql('The selected query cannot be run.')
                .expect(await app.ui.queryBoard.getText('errorBody')).eql('Conditional security has been applied to this query and it requires additional result fields.')
                .expect(await app.ui.queryBoard.getText('errorContactAdmin')).eql('Please contact your administrator for more information.');
        });
        await app.step('Check fields in the Field Name dropdown from the child tab without visible permissions', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open('GeneralIP1>GIP1 All Actions');
            await app.ui.waitLoading({checkErrors: true});
            const field = app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            await field.expandWholeList();
            const allValues = await field.getPossibleValues();
            const possibleValues: string[] = allValues.slice(allValues.indexOf('------------') + 1);
            await t
                .expect(app.services.array.areEquivalent(possibleValues, expectedFieldsList)).ok();
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
        await app.step('Restore Content Groups settings (API)', async () => {
            const contentGroup = app.api.administration.contentGroup;
            await contentGroup.openContentGroup(globalConfig.user.contentGroup);
            await contentGroup.setApplicationSecurity('PatentMasters', { editPermission: true, visiblePermission: true });
            await contentGroup.setApplicationSecurity('DisclosureMasters', { editPermission: true, visiblePermission: true });
            await contentGroup.setApplicationSecurity('GeneralIP1Masters>ACTIONS', { editPermission: true, visiblePermission: true });
            await contentGroup.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Message Center - Steps 1-10)`, async (t: TestController) => {
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.messageCenter.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.messageCenter.query);
            if (!(await app.ui.queryBoard.noErrors())) {
                await app.ui.refresh(true); // required due to IPDP-14327 error
                await app.ui.waitLoading({checkErrors: true});
            }
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
            }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            const sourceInfoFields = (await app.api.query.getSourceInfo(data.messageCenter.source)).FieldMetadata.map((x) => x.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1)).eql(sourceInfoFields.sort(app.services.sorting.appSortAlphabetically));
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.messageCenter.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.messageCenter.operator);
            await row.getField('Value', 'autocomplete').fill(data.messageCenter.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.messageCenter.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.messageCenter.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.messageCenter.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryBoard.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.messageCenter.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.messageCenter.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.messageCenter.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.messageCenter.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.messageCenter.operator);
            await row.getField('Value', 'autocomplete').fill(data.messageCenter.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.messageCenter.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.messageCenter.operator2);

            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.messageCenter.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.messageCenter.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.messageCenter.fieldValue2);
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on Cross button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.messageCenter.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.messageCenter.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on Reset button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Select field with Combobox edit control type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.messageCenter.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.messageCenter.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.messageCenter.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getText('queryBuilderName')).eql(data.messageCenter.query2.split('>').pop())
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
        await app.step('Reopen the Message Center query', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.messageCenter.query);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Set any criterias in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.messageCenter.fieldName);
            await row.getField('Value', 'autocomplete').fill(data.messageCenter.fieldValue);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.messageCenter.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.messageCenter.fieldValue);
        });
        await app.step('Click on any record, back to the query and verify criteria builder.', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.goBack();
            await app.ui.queryBoard.waitTillElementPresent('menu', undefined, { timeout: 20000 });
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.buildComplexQueries();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.messageCenter.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.messageCenter.fieldValue);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Criteria Builder with multiple filters and conjunctions for Message Center Patents query - (Step 11)', async (t: TestController) => {
        await app.step('Login and open the Message Center page', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.messageCenter.url}`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.messageCenter.query);
            await app.ui.waitLoading({checkErrors: false});
            if (!(await app.ui.queryBoard.noErrors())) {
                await app.ui.refresh(true); // required due to IPDP-14327 error
                await app.ui.waitLoading({checkErrors: true});
            }
        });
        await app.step('Add criteria for a singleline', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.messageCenter.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.messageCenter.singleline.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.messageCenter.country.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.messageCenter.country.value);

            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.messageCenter.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for a datepicker', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.messageCenter.datepicker.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
            await row.getField('Value', 'datepicker').fill(data.messageCenter.datepicker.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const singleline = await record.getValue(data.messageCenter.singleline.name);
                const combobox = await record.getValue(data.messageCenter.combobox.name);
                const datepicker = await record.getValue(data.messageCenter.datepicker.name);
                const country = await record.getValue(data.messageCenter.country.name);
                const fitCondition =
                    (singleline.toLowerCase().includes(data.messageCenter.singleline.value.toLowerCase()) ||
                        country === data.messageCenter.country.value) &&
                    (combobox === '' ||
                        app.services.time.getSeconds(datepicker, {pattern: 'MM/DD/YYYY'}) > app.services.time.getSeconds(data.messageCenter.datepicker.value, {pattern: 'MM/DD/YYYY'}));
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Party - Steps 1-10)`, async (t: TestController) => {
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.party.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.party.query);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
            }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            await app.api.partyQuery.openQuery(data.party.query);
            const sourceInfoFields = (await app.api.partyQuery.openQueryManagement()).QueryMetadata.FieldMetadata.map((x) => x.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1)).eql(sourceInfoFields.sort(app.services.sorting.appSortAlphabetically));
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.party.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.party.operator);
            await row.getField('Value', 'autocomplete').fill(data.party.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.party.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.party.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.party.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryBoard.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.party.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.party.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.party.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.party.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.party.operator);
            await row.getField('Value', 'autocomplete').fill(data.party.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.party.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.party.operator2);

            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.party.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.party.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.party.fieldValue2);
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on Cross button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.party.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.party.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on Reset button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Select field with Combobox edit control type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.party.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.party.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.party.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getText('queryBuilderName')).eql(data.party.query2.split('>').pop())
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
        await app.step('Reopen Party Query', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.party.query);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Set any criterias in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.party.fieldName);
            await row.getField('Value', 'autocomplete').fill(data.party.fieldValue);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.party.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.party.fieldValue);
        });
        await app.step('Click on any record, back to the query and verify criteria builder.', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.goBack();
            await app.ui.queryBoard.waitTillElementPresent('menu', undefined, { timeout: 20000 });
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.party.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.party.fieldValue);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Criteria Builder with multiple filters and conjunctions for Party query - (Step 11)', async (t: TestController) => {
        await app.step('Login and open the Party page', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.party.url}`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.party.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Add criteria for a singleline', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.party.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.party.singleline.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'dropdown').typeText(data.party.country.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.party.country.value);
            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.party.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for a datepicker', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.party.datepicker.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
            await row.getField('Value', 'datepicker').fill(data.party.datepicker.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const singleline = await record.getValue(data.party.singleline.name);
                const combobox = await record.getValue(data.party.combobox.name);
                const datepicker = await record.getValue(data.party.datepicker.name);
                const country = await record.getValue(data.party.country.name);
                const fitCondition =
                    (singleline.toLowerCase().includes(data.party.singleline.value.toLowerCase()) ||
                        country === data.party.country.value) &&
                    (combobox === '' ||
                        app.services.time.getSeconds(datepicker, {pattern: 'MM/DD/YYYY'}) > app.services.time.getSeconds(data.party.datepicker.value, {pattern: 'MM/DD/YYYY'}));
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Audit Log - Steps 1-9)`, async (t: TestController) => {
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.auditLog.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.auditLog.query);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
            }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            const sourceInfoFields = (await app.api.query.getSourceInfo(data.auditLog.source)).FieldMetadata.map((x) => x.CustomValue.split('$').pop());

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();
            let wholeList: string[] = [...sourceInfoFields];
            columnNames.filter((x) => !sourceInfoFields.includes(x)).forEach((x) => wholeList.push(x));

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1).every((x) => wholeList.includes(x))).ok();
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.auditLog.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.auditLog.operator);
            await row.getField('Value', 'autocomplete').fill(data.auditLog.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.auditLog.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.auditLog.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.auditLog.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryBoard.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.auditLog.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.auditLog.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.auditLog.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.auditLog.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.auditLog.operator);
            await row.getField('Value', 'autocomplete').fill(data.auditLog.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.auditLog.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.auditLog.operator2);

            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.auditLog.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.auditLog.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.auditLog.fieldValue2);
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on Cross button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.auditLog.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.auditLog.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on Reset button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Select field with Combobox edit control type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.auditLog.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.auditLog.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.auditLog.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getText('queryBuilderName')).eql(data.auditLog.query2.split('>').pop())
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
        await app.step('Reopen audit log query', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.auditLog.query);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Set any criterias in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.auditLog.fieldName);
            await row.getField('Value', 'autocomplete').fill(data.auditLog.fieldValue);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.auditLog.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.auditLog.fieldValue);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Criteria Builder with multiple filters and conjunctions for Audit Log query - (Step 11)', async (t: TestController) => {
        await app.step('Login and open the Audit Log page', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.auditLog.url}`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.auditLog.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Add criteria for a singleline', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.auditLog.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.auditLog.singleline.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.auditLog.country.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.auditLog.country.value);
            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.auditLog.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for a second singleline', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.auditLog.singleline2.name);
            await row.getField('Operator', 'dropdown').fill('Does Not Contain');
            await row.getField('Value', 'input').fill(data.auditLog.singleline2.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const singleline = await record.getValue(data.auditLog.singleline.name);
                const combobox = await record.getValue(data.auditLog.combobox.name);
                const singleline2 = await record.getValue(data.auditLog.singleline2.name);
                const country = await record.getValue(data.auditLog.country.name);
                const fitCondition =
                    (singleline.toLowerCase().includes(data.auditLog.singleline.value.toLowerCase()) ||
                        country === data.auditLog.country.value) &&
                    (combobox === '' ||
                        !singleline2.includes(data.auditLog.singleline2.value));
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Deletion Management - Steps 1-10)`, async (t: TestController) => {
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.deletion.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.deletion.query);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
            }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            const sourceInfoFields = (await app.api.query.getSourceInfo(data.deletion.source)).FieldMetadata.filter((x) => x.DataDictionaryId != null).map((x) => x.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();
            let wholeList: string[] = [...sourceInfoFields];
            columnNames.filter((x) => !sourceInfoFields.includes(x)).forEach((x) => wholeList.push(x));

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1).every((x) => wholeList.includes(x))).ok();
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.deletion.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.deletion.operator);
            await row.getField('Value', 'autocomplete').fill(data.deletion.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.deletion.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.deletion.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.deletion.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryBoard.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.deletion.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.deletion.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.deletion.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.deletion.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.deletion.operator);
            await row.getField('Value', 'autocomplete').fill(data.deletion.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.deletion.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.deletion.operator2);

            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.deletion.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.deletion.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.deletion.fieldValue2);
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on Cross button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.deletion.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.deletion.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on Reset button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Select field with Combobox edit control type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.deletion.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.deletion.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.deletion.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getText('queryBuilderName')).eql(data.deletion.query2.split('>').pop())
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
        await app.step('Reopen Deletion query', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.deletion.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Set any criterias in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.deletion.fieldName);
            await row.getField('Value', 'autocomplete').fill(data.deletion.fieldValue);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.deletion.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.deletion.fieldValue);
        });
        await app.step('Click on any record, back to the query and verify criteria builder.', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.queryBoard.queryResultsGrid.openRecord(0);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.goBack();
            await app.ui.queryBoard.waitTillElementPresent('menu', undefined, { timeout: 40000 });
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.buildComplexQueries();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.deletion.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.deletion.fieldValue);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Criteria Builder with multiple filters and conjunctions for Deletion Management query - (Step 11)', async (t: TestController) => {
        await app.step('Login and open the Deletion Management page', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.deletion.url}`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.deletion.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Add criteria for a singleline', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.deletion.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.deletion.singleline.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.deletion.country.name);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
            await row.getField('Value', 'autocomplete').fill(data.deletion.country.value);
            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.deletion.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.deletion.combobox.value);
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for a second combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.deletion.singleline2.name);
            await row.getField('Operator', 'dropdown').fill('Does Not Contain');
            await row.getField('Value', 'input').fill(data.deletion.singleline2.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const singleline = await record.getValue(data.deletion.singleline.name);
                const combobox = await record.getValue(data.deletion.combobox.name);
                const singleline2 = await record.getValue(data.deletion.singleline2.name);
                const country = await record.getValue(data.deletion.country.name);
                const fitCondition =
                    (singleline.toLowerCase().includes(data.deletion.singleline.value.toLowerCase()) ||
                        country !== data.deletion.country.value) &&
                    (combobox === data.deletion.combobox.value &&
                        !singleline2.includes(data.deletion.singleline2.value));
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Global Change Log - Steps 1-9)`, async (t: TestController) => {
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.globalChangeLog.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.globalChangeLog.query);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
            }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            const sourceInfoFields = (await app.api.query.getSourceInfo(data.globalChangeLog.source)).FieldMetadata.filter((x) => x.DataDictionaryId !== null).map((x) => x.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();
            let wholeList: string[] = [...sourceInfoFields];
            columnNames.filter((x) => !sourceInfoFields.includes(x)).forEach((x) => wholeList.push(x));

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1)).eql(wholeList.sort(app.services.sorting.appSortAlphabetically));
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.globalChangeLog.operator);
            await row.getField('Value', 'autocomplete').fill(data.globalChangeLog.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.globalChangeLog.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.globalChangeLog.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.globalChangeLog.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryBoard.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.globalChangeLog.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.globalChangeLog.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.globalChangeLog.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.globalChangeLog.operator);
            await row.getField('Value', 'autocomplete').fill(data.globalChangeLog.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.globalChangeLog.operator2);

            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.globalChangeLog.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.globalChangeLog.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.globalChangeLog.fieldValue2);
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on Cross button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.globalChangeLog.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.globalChangeLog.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on Reset button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Select field with Combobox edit control type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.globalChangeLog.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getText('queryBuilderName')).eql(data.globalChangeLog.query2.split('>').pop())
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
        await app.step('Reopen Flobal Change Log query', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.globalChangeLog.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Set any criterias in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.fieldName);
            await row.getField('Value', 'autocomplete').fill(data.globalChangeLog.fieldValue);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.globalChangeLog.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.globalChangeLog.fieldValue);
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Criteria Builder with multiple filters and conjunctions for Global Change Log query - (Step 11)', async (t: TestController) => {
        await app.step('Login and open the Global Change Log page', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.globalChangeLog.url}`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.globalChangeLog.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Add criteria for a singleline', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.globalChangeLog.singleline.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.country.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.globalChangeLog.country.value);
            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for a second combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.globalChangeLog.combobox2.name);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
            await row.getField('Value', 'autocomplete').fill(data.globalChangeLog.combobox2.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const singleline = await record.getValue(data.globalChangeLog.singleline.name);
                const combobox = await record.getValue(data.globalChangeLog.combobox.name);
                const combobox2 = await record.getValue(data.globalChangeLog.combobox2.name);
                const country = await record.getValue(data.globalChangeLog.country.name);
                const fitCondition =
                    (singleline.toLowerCase().includes(data.globalChangeLog.singleline.value.toLowerCase()) ||
                        country === data.globalChangeLog.country.value) &&
                    (combobox === '' ||
                        combobox2 !== data.globalChangeLog.combobox2.value);
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Country / Regions - Steps 1-10)`, async (t: TestController) => {
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.countries.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.countries.query);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
            }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            await app.api.query.openQuery(data.countries.query);
            const sourceInfoFields = (await app.api.query.openQueryManagement()).QueryMetadata.FieldMetadata.map((x) => x.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1)).eql(sourceInfoFields.sort(app.services.sorting.appSortAlphabetically));
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.countries.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.countries.operator);
            await row.getField('Value', 'input').fill(data.countries.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.countries.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.countries.operator)
                .expect(await row.getField('Value', 'input').getValue()).eql(data.countries.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryBoard.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.countries.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.countries.operator)
                .expect(await filledRow.getField('Value', 'input').getValue()).eql(data.countries.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.countries.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.countries.operator);
            await row.getField('Value', 'input').fill(data.countries.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.countries.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.countries.operator2);

            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.countries.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.countries.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').fill(data.countries.fieldValue2);
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on Cross button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.countries.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.countries.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on Reset button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Set any criterias in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.countries.fieldName);
            await row.getField('Value', 'input').fill(data.countries.fieldValue);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.countries.fieldName)
                .expect(await row.getField('Value', 'input').getValue()).eql(data.countries.fieldValue);
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.countries.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getText('queryBuilderName')).eql(data.countries.query2.split('>').pop())
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Criteria Builder with multiple filters and conjunctions for Country / Regions query - (Step 11)', async (t: TestController) => {
        await app.step('Login and open the Query page', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.countries.url}`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.countries.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Add first row to Query Builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.countries.singleline1.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.countries.singleline1.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add second row to Query Builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'input').fill(data.countries.singleline2.name);
            await row.getField('Operator', 'dropdown').fill('Does Not Contain');
            await row.getField('Value', 'input').fill(data.countries.singleline2.value);
            await row.click('rightParenthesis');
        });
        await app.step('Add third row to Query Builder', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.countries.singleline3.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'input').fill(data.countries.singleline3.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add 4th row to Query Builder', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.countries.singleline4.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'input').fill(data.countries.singleline4.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const singleline1 = await record.getValue(data.countries.singleline1.name);
                const singleline2 = await record.getValue(data.countries.singleline2.name);
                const singleline3 = await record.getValue(data.countries.singleline3.name);
                const singleline4 = await record.getValue(data.countries.singleline4.name);
                const fitCondition =
                    (singleline1.includes(data.countries.singleline1.value) ||
                        !singleline2.includes(data.countries.singleline2.value)) &&
                    (singleline3 === data.countries.singleline3.value ||
                        singleline4 === data.countries.singleline4.value);
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Cross Module - Steps 1-9)`, async (t: TestController) => {
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.crossmodule.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.crossmodule.query);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
            }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            await app.api.query.openQuery(data.crossmodule.query);
            const sourceInfoFields = (await app.api.query.openQueryManagement()).QueryMetadata.FieldMetadata.map((x) => x.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1)).eql(sourceInfoFields.sort(app.services.sorting.appSortAlphabetically));
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the second row in the criteria builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.crossmodule.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.crossmodule.operator);
            await row.getField('Value', 'autocomplete').fill(data.crossmodule.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.crossmodule.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.crossmodule.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.crossmodule.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryBoard.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.crossmodule.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.crossmodule.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.crossmodule.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.crossmodule.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.crossmodule.operator);
            await row.getField('Value', 'autocomplete').fill(data.crossmodule.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.crossmodule.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.crossmodule.operator2);

            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.crossmodule.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.crossmodule.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.crossmodule.fieldValue2);
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on Cross button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.crossmodule.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.crossmodule.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on Reset button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Select field with Combobox edit control type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.crossmodule.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.crossmodule.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.crossmodule.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getText('queryBuilderName')).eql(data.crossmodule.query2.split('>').pop())
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
        await app.step('Reopen Crossmodule query', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.crossmodule.query);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Set any criterias in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.crossmodule.fieldName);
            await row.getField('Value', 'autocomplete').fill(data.crossmodule.fieldValue);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.crossmodule.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.crossmodule.fieldValue);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Criteria Builder with multiple filters and conjunctions for Cross Module query - (Step 11)', async (t: TestController) => {
        await app.step('Login and open the Query page', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.crossmodule.url}`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.crossmodule.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Add criteria for a singleline', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.crossmodule.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.crossmodule.singleline.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.crossmodule.country.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.crossmodule.country.value);
            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.crossmodule.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for a datepicker', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.crossmodule.datepicker.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
            await row.getField('Value', 'datepicker').fill(data.crossmodule.datepicker.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const singleline = await record.getValue(data.crossmodule.singleline.name);
                const combobox = await record.getValue(data.crossmodule.combobox.name);
                const datepicker = await record.getValue(data.crossmodule.datepicker.name);
                const country = await record.getValue(data.crossmodule.country.name);
                const fitCondition =
                    (singleline.toLowerCase().includes(data.crossmodule.singleline.value.toLowerCase()) ||
                        country === data.crossmodule.country.value) &&
                    (combobox === '' ||
                        app.services.time.getSeconds(datepicker, {pattern: 'MM/DD/YYYY'}) > app.services.time.getSeconds(data.crossmodule.datepicker.value, {pattern: 'MM/DD/YYYY'}));
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Join Parties - Steps 1-9)`, async (t: TestController) => {
        await app.step('Login and open query', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.joinparties.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.open(data.joinparties.query);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
            }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            await app.api.query.openQuery(data.joinparties.query);
            const sourceInfoFields = (await app.api.query.openQueryManagement()).QueryMetadata.FieldMetadata.map((x) => x.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1)).eql(sourceInfoFields.sort(app.services.sorting.appSortAlphabetically));
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.joinparties.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.joinparties.operator);
            await row.getField('Value', 'autocomplete').fill(data.joinparties.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.joinparties.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.joinparties.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.joinparties.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryBoard.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.joinparties.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.joinparties.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.joinparties.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryBoard.criteriaBuilder.getRowCount();
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.joinparties.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.joinparties.operator);
            await row.getField('Value', 'autocomplete').fill(data.joinparties.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.joinparties.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.joinparties.operator2);

            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.joinparties.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.joinparties.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.joinparties.fieldValue2);
            await app.ui.queryBoard.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on Cross button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.joinparties.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.joinparties.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on Reset button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.queryBoard.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Select field with Combobox edit control type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.joinparties.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.joinparties.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.joinparties.query2);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const columnNames = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.queryBoard.criteriaBuilder.getText('queryBuilderName')).eql(data.joinparties.query2.split('>').pop())
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
        await app.step('Reopen Join Parties query', async () => {
            await app.ui.queryBoard.openTree();
            await app.ui.queryBoard.kendoTreeview.open(data.joinparties.query);
            await app.ui.waitLoading();
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
        });
        await app.step('Set any criterias in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.joinparties.fieldName);
            await row.getField('Value', 'autocomplete').fill(data.joinparties.fieldValue);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await app.ui.queryBoard.click('complexQueriesLink');
            await t
                .expect(await app.ui.queryBoard.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.queryBoard.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.joinparties.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.joinparties.fieldValue);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Turn off the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: false }]);
        });
    })
    ('Criteria Builder with multiple filters and conjunctions for Join Parties query - (Step 11)', async (t: TestController) => {
        await app.step('Login and open the Query page', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.joinparties.url}`);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Run query', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.joinparties.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Add criteria for a singleline', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.joinparties.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.joinparties.singleline.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.joinparties.country.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.joinparties.country.value);
            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.joinparties.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');
            await row.getField('Conjunction', 'dropdown').fill('Or');
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for a datepicker', async () => {
            await app.ui.queryBoard.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryBoard.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.joinparties.datepicker.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
            await row.getField('Value', 'datepicker').fill(data.joinparties.datepicker.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryBoard.queryResultsGrid.getRecord(i);
                const singleline: string = await record.getValue(data.joinparties.singleline.name);
                const combobox = await record.getValue(data.joinparties.combobox.name);
                const datepicker = await record.getValue(data.joinparties.datepicker.name);
                const country = await record.getValue(data.joinparties.country.name);
                const fitCondition =
                    (singleline.toLowerCase().includes(data.joinparties.singleline.value.toLowerCase()) ||
                        country === data.joinparties.country.value) &&
                    (combobox === '' ||
                        app.services.time.getSeconds(datepicker, {pattern: 'MM/DD/YYYY'}) >= app.services.time.getSeconds(data.joinparties.datepicker.value, {pattern: 'MM/DD/YYYY'}));
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async () => {
        await app.step('Turn on the "AutoExecuteQueries" setting (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'AutoExecuteQueries', value: true }]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Criteria Builder controls (Query Management - Steps 1-8)`, async (t: TestController) => {
        await app.step('Login and open query management', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.queryManagement.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.modify(data.queryManagement.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify rows in criteria builder', async () => {
            await app.ui.queryManagementModal.selectStep('Build Criteria');
            await app.ui.waitLoading({checkErrors: true});
            const criteriaBuilder = app.ui.queryManagementModal.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2);
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
                }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.queryManagementModal.criteriaBuilder;
            await app.api.query.openQuery(data.queryManagement.query);
            const sourceInfo = await app.api.query.openQueryManagement();
            const sourceInfoFields = sourceInfo.QueryMetadata.FieldMetadata.map((x) => x.CustomValue);
            const columnNames = sourceInfo.QueryMetadata.ResultFields.map((x) => x.DataInfo.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1)).eql(sourceInfoFields.sort(app.services.sorting.appSortAlphabetically));
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.queryManagementModal.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over Add Line and Remove Line icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.queryManagementModal.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.queryManagement.operator);
            await row.getField('Value', 'autocomplete').fill(data.queryManagement.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.queryManagement.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.queryManagement.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.queryManagement.fieldValue);
        });
        await app.step('Click on Add Line icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.queryManagementModal.criteriaBuilder.getRowCount();
            await app.ui.queryManagementModal.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.queryBoard.criteriaBuilder.getRow(0);
            const newRow = app.ui.queryManagementModal.criteriaBuilder.getRow(1);
            const filledRow = app.ui.queryManagementModal.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.queryManagementModal.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.queryManagement.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.queryManagement.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.queryManagement.fieldValue);
        });
        await app.step('Click on Remove Line button of any row.', async () => {
            const rowCountBefore = await app.ui.queryManagementModal.criteriaBuilder.getRowCount();
            await app.ui.queryManagementModal.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.queryManagementModal.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.queryManagementModal.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.queryManagementModal.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Delete all rows except one.', async () => {
            await app.ui.queryManagementModal.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.queryManagementModal.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.queryManagementModal.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.queryManagement.operator);
            await row.getField('Value', 'autocomplete').fill(data.queryManagement.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.queryBoard.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.queryManagement.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.queryManagement.operator2);

            await app.ui.queryManagementModal.selectStep('Preview');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryManagementModal.click('showQueryResultsLink');
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.queryManagementModal.queryResultsGrid.getColumnValues(data.queryManagement.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.queryManagement.fieldValue)).ok();
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.queryManagementModal.selectStep('Build Criteria');
            await app.ui.queryManagementModal.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.queryManagement.fieldValue2);
            await app.ui.queryManagementModal.criteriaBuilder.getRow(0).click('leftParenthesis');

            await t
                .expect(await app.ui.queryManagementModal.isVisible('syntaxValidationMessage')).ok()
                .expect(await app.ui.queryManagementModal.getText('syntaxValidationMessage')).eql('Please correct the syntax.');
        });
        await app.step('Select field with Combobox edit control type in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Criteria Builder with multiple filters and conjunctions for Query Management - (Step 11)', async (t: TestController) => {
        await app.step('Login and open query management', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.navigate(`${globalConfig.env.url}/${data.queryManagement.url}`);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.kendoTreeview.modify(data.queryManagement.query);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify rows in criteria builder', async () => {
            await app.ui.queryManagementModal.selectStep('Build Criteria');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Add criteria for a singleline', async () => {
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.queryManagement.singleline.value);

            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.country.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.queryManagement.country.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
        });
        await app.step('Add criteria for a multiline', async () => {
            await app.ui.queryManagementModal.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.multiline.name);
            await row.getField('Operator', 'dropdown').fill('Does Not Contain');
            await row.getField('Value', 'input').fill(data.queryManagement.multiline.value);

        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.queryManagementModal.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');

        });
        await app.step('Add criteria for a hierarchy', async () => {
            await app.ui.queryManagementModal.criteriaBuilder.getRow(3).click('add');
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(4);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.hierarchy.name);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
            await row.getField('Value', 'hierarchy').fill(data.queryManagement.hierarchy.value);

        });
        await app.step('Add criteria for a datepicker', async () => {
            await app.ui.queryManagementModal.criteriaBuilder.getRow(4).click('add');
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(5);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.datepicker.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
            await row.getField('Value', 'datepicker').fill(data.queryManagement.datepicker.value);

            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a numeric', async () => {
            await app.ui.queryManagementModal.criteriaBuilder.getRow(5).click('add');
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(6);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.numeric.name);
            await row.getField('Operator', 'dropdown').fill('Less Than Or Equal To');
            await row.getField('Value', 'input').fill(data.queryManagement.numeric.value);
            await row.click('leftParenthesis');

        });
        await app.step('Add criteria for a large list lookup', async () => {
            await app.ui.queryManagementModal.criteriaBuilder.getRow(6).click('add');
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(7);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.largeList.name);
            await row.getField('Operator', 'dropdown').fill('Is Not Null');
            await row.getField('Conjunction', 'dropdown').fill('Or');
        });
        await app.step('Add criteria for a checkbox', async () => {
            await app.ui.queryManagementModal.criteriaBuilder.getRow(7).click('add');
            const row = app.ui.queryManagementModal.criteriaBuilder.getRow(8);
            await row.getField('Field Name', 'autocomplete').fill(data.queryManagement.checkbox.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'dropdown').fill(data.queryManagement.checkbox.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.queryManagementModal.selectStep('Preview');
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryManagementModal.click('showQueryResultsLink');
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.queryManagementModal.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.queryManagementModal.queryResultsGrid.getRecord(i);
                const singleline = await record.getValue(data.queryManagement.singleline.name, { readOnlyMode: true });
                const multiline = await record.getValue(data.queryManagement.multiline.name, { readOnlyMode: true });
                const combobox = await record.getValue(data.queryManagement.combobox.name, { readOnlyMode: true });
                const largeList = await record.getValue(data.queryManagement.largeList.name, { readOnlyMode: true });
                const hierarchy = await record.getValue(data.queryManagement.hierarchy.name, { readOnlyMode: true });
                const numeric = await record.getValue(data.queryManagement.numeric.name, { readOnlyMode: true });
                const datepicker = await record.getValue(data.queryManagement.datepicker.name, { readOnlyMode: true });
                const checkbox = await record.getValue(data.queryManagement.checkbox.name, { readOnlyMode: true });
                const country = await record.getValue(data.queryManagement.country.name, { readOnlyMode: true });
                const fitCondition =
                    (singleline.toLowerCase().includes(data.queryManagement.singleline.value.toLowerCase()) &&
                        country === data.queryManagement.country.value ||
                        !multiline.toLowerCase().includes(data.queryManagement.multiline.value.toLowerCase()) &&
                        combobox === '' &&
                        hierarchy !== data.queryManagement.hierarchy.value &&
                        app.services.time.getSeconds(datepicker, {pattern: 'MM/DD/YYYY'}) > app.services.time.getSeconds(data.queryManagement.datepicker.value, {pattern: 'MM/DD/YYYY'})) &&
                    (Number(numeric) <= Number(data.queryManagement.numeric.value) &&
                        largeList !== '' ||
                        checkbox === data.queryManagement.checkbox.expectedValue);
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create a record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
    })
    ('Verify Criteria Builder controls (Add Relationships - Steps 1-10)', async (t: TestController) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open an existing case record', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.relationships.queryName);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem(data.relationships.defTemplate);
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open the `Related records` child tab', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Related Records');
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            await t
                .expect(await child.isPresent('addNewButton')).ok()
                .expect(await child.isEnabled('addNewButton')).ok();
        });
        await app.step('Open the `Add Relationships` modal window', async () => {
            let child = app.ui.dataEntryBoard.childRecord;
            await child.addNew();
            await t
                .expect(await app.ui.addRelationshipsModal.isVisible()).ok();
    });
        await app.step(`Run the ${data.relationships.queryName} query`, async () => {
            await app.ui.addRelationshipsModal.kendoTreeview.open(data.relationships.queryName);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.addRelationshipsModal.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Verify criteria builder panel', async () => {
            await app.ui.addRelationshipsModal.buildComplexQueries();
            const criteriaBuilder = app.ui.addRelationshipsModal.criteriaBuilder;
            await t
                .expect(await app.ui.addRelationshipsModal.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await criteriaBuilder.getText('queryBuilderLabel')).eql('Query Builder')
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.isEnabled('showResultsButton')).ok()
                .expect(await criteriaBuilder.isEnabled('resetButton')).ok();
        });
        await app.step('Verify rows in criteria builder', async () => {
            const criteriaBuilder = app.ui.addRelationshipsModal.criteriaBuilder;
            for (let i = 0; i < 2; i++) {
                await t
                    .expect(await criteriaBuilder.getRow(i).isVisible('add')).ok()
                    .expect(await criteriaBuilder.getRow(i).isVisible('remove')).ok()
                    .expect(await criteriaBuilder.getRow(i).getField('Compare', 'checkbox').isChecked()).notOk()
                    .expect(await criteriaBuilder.getRow(i).isPresent('activeParentheses')).notOk()
                    .expect(await criteriaBuilder.getRow(i).getField('Field Name').getAttribute('input', 'role')).eql('combobox')
                    .expect(await criteriaBuilder.getRow(i).getField('Operator').getAttribute('input', 'role')).eql('combobox');
                }
        });
        await app.step('Verify the Field Name field', async () => {
            const criteriaBuilder = app.ui.addRelationshipsModal.criteriaBuilder;
            const columnNames = (await app.ui.addRelationshipsModal.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text).slice(1);
            await app.api.query.openQuery(data.relationships.queryName);
            const sourceInfoFields = (await app.api.query.openQueryManagement()).QueryMetadata.FieldMetadata.map((x) => x.CustomValue);

            const field = criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
            const initialValue = await field.getValue();
            await field.expandWholeList();
            const fieldNamePossibleValues = await field.getPossibleValues();
            app.memory.current.array = fieldNamePossibleValues;
            await field.selectRow('------------');
            const valueAfter = await field.getValue();

            await t
                .expect(initialValue).eql(valueAfter)
                .expect(initialValue).eql(fieldNamePossibleValues[0])
                .expect(fieldNamePossibleValues.slice(0, columnNames.length)).eql(columnNames)
                .expect(fieldNamePossibleValues[columnNames.length]).eql('------------')
                .expect(fieldNamePossibleValues.slice(columnNames.length + 1)).eql(sourceInfoFields.sort(app.services.sorting.appSortAlphabetically));
        });
        await app.step('Verify the Conjunction field', async () => {
            const criteriaBuilder = app.ui.addRelationshipsModal.criteriaBuilder;
            await t
                .expect(await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getValue()).eql('And');
            await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').expand();
            const conjunctionPossibleValues = await criteriaBuilder.getRow(0).getField('Conjunction', 'dropdown').getPossibleValues();
            await criteriaBuilder.pressKey('esc');
            await t
                .expect(conjunctionPossibleValues).eql([ 'And', 'Or' ]);
        });
        await app.step('Mouse over [Add line] icon or [Remove line] icons of the criteria builder', async () => {
            const criteriaBuilder = app.ui.addRelationshipsModal.criteriaBuilder;
            await criteriaBuilder.getRow(0).hover('add');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Add line');
            await criteriaBuilder.getRow(0).hover('remove');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql('Remove line');
        });
        await app.step('Set some Field name, Operator and Value for the first row in the criteria builder', async () => {
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.relationships.operator);
            await row.getField('Value', 'autocomplete').fill(data.relationships.fieldValue);
            await t
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.relationships.fieldName)
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql(data.relationships.operator)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.relationships.fieldValue);
        });
        await app.step('Click on [Add line] icon in the first row of the criteria builder.', async () => {
            const rowCountBefore = await app.ui.addRelationshipsModal.criteriaBuilder.getRowCount();
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(0).click('add');
            const rowInDefaultState = app.ui.addRelationshipsModal.criteriaBuilder.getRow(0);
            const newRow = app.ui.addRelationshipsModal.criteriaBuilder.getRow(1);
            const filledRow = app.ui.addRelationshipsModal.criteriaBuilder.getRow(2);
            await t
                .expect(await app.ui.addRelationshipsModal.criteriaBuilder.getRowCount()).eql(rowCountBefore + 1)
                .expect(await newRow.getField('Field Name', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Field Name', 'dropdown').getValue())
                .expect(await newRow.getField('Operator', 'dropdown').getValue()).eql(await rowInDefaultState.getField('Operator', 'dropdown').getValue())
                .expect(await newRow.getField('Value').getValue()).eql('')
                .expect(await filledRow.getField('Field Name', 'dropdown').getValue()).eql(data.relationships.fieldName)
                .expect(await filledRow.getField('Operator', 'dropdown').getValue()).eql(data.relationships.operator)
                .expect(await filledRow.getField('Value', 'dropdown').getValue()).eql(data.relationships.fieldValue);
        });
        await app.step('Click on [Remove line] button of any row.', async () => {
            const rowCountBefore = await app.ui.addRelationshipsModal.criteriaBuilder.getRowCount();
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(2).click('remove');
            await t
                .expect(await app.ui.addRelationshipsModal.criteriaBuilder.getRowCount()).eql(rowCountBefore - 1)
                .expect(await app.ui.addRelationshipsModal.criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await app.ui.addRelationshipsModal.criteriaBuilder.getRow(1).getField('Value').getValue()).eql('');
        });
        await app.step('Try to delete all rows.', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(1).click('remove');
            await t
                .expect(await app.ui.addRelationshipsModal.criteriaBuilder.getRow(0).isPresent('remove')).notOk();
        });
        await app.step('Verify criteria builder with incomplete filter criteria', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(0).click('add');
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.fieldName);
            await row.getField('Operator', 'dropdown').fill(data.relationships.operator);
            await row.getField('Value', 'autocomplete').fill(data.relationships.fieldValue);
            await row.getField('Conjunction', 'dropdown').fill('Or');
            const row2 = app.ui.addRelationshipsModal.criteriaBuilder.getRow(1);
            await row2.getField('Field Name', 'autocomplete').fill(data.relationships.fieldName2);
            await row2.getField('Operator', 'dropdown').fill(data.relationships.operator2);

            await app.ui.addRelationshipsModal.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});

            const columnValues = await app.ui.addRelationshipsModal.queryResultsGrid.getColumnValues(data.relationships.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.relationships.fieldValue)).ok('Incomplete filter criteria shows incorrect results in Related Records query');
        });
        await app.step('Verify criteria builder with one parenthesis', async () => {
            await app.ui.addRelationshipsModal.buildComplexQueries();
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(0).getField('Value', 'autocomplete').fill(data.relationships.fieldValue2);
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(0).click('leftParenthesis');
            app.ui.resetRequestLogger('executeQuery');
            await app.ui.addRequestHook('logger', 'executeQuery');
            await app.ui.addRelationshipsModal.criteriaBuilder.showResults();
            await app.ui.waitLoading();
            await t
                .expect(app.ui.getLastRequest('executeQuery')).notOk()
                .expect(await app.ui.errorModal.isVisible()).ok()
                .expect(await app.ui.errorModal.getText('errorMessage')).eql('Syntax error: Missing parentheses.')
                .expect(await app.ui.errorModal.isVisible('buttons', 'Ok')).ok()
                .expect(await app.ui.errorModal.isVisible('cross')).ok();
            await app.ui.removeRequestHooks('logger', 'executeQuery');
        });
        await app.step('Click on [Ok] or [x] button on the appeared error modal.', async () => {
            await app.ui.errorModal.click('cross');
            const columnValues = await app.ui.addRelationshipsModal.queryResultsGrid.getColumnValues(data.relationships.fieldName);
            await t
                .expect(columnValues.every((x) => x === data.relationships.fieldValue)).ok()
                .expect(await app.ui.errorModal.waitTillElementNotPresent()).ok();
        });
        await app.step('Click on [Reset] button in Criteria Builder.', async () => {
            const criteriaBuilder = app.ui.addRelationshipsModal.criteriaBuilder;
            await criteriaBuilder.reset();
            await t
                .expect(await criteriaBuilder.getRowCount()).eql(2)
                .expect(await criteriaBuilder.getRow(0).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(1).getField('Compare', 'checkbox').isChecked()).notOk()
                .expect(await criteriaBuilder.getRow(0).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(1).isPresent('activeParentheses')).notOk()
                .expect(await criteriaBuilder.getRow(0).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(1).getField('Value').getValue()).eql('')
                .expect(await criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0])
                .expect(await criteriaBuilder.getRow(1).getField('Field Name', 'dropdown').getValue()).eql(app.memory.current.array[0]);
        });
        await app.step('Select field with the Combobox edit control type e.g. Tax Agent in the Field Name in the Criteria Builder.', async () => {
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.fieldNameCombobox);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Equal')
                .expect(await row.getFieldType('Value')).eql('autocomplete');
        });
        await app.step('In field Field Name select field with a different edit control type', async () => {
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.fieldNameSingleLine);
            await t
                .expect(await row.getField('Operator', 'dropdown').getValue()).eql('Contains')
                .expect(await row.getFieldType('Value')).eql('input');
        });
        await app.step('Click on any other query in the Query List', async () => {
            await app.ui.addRelationshipsModal.openTree();
            await app.ui.addRelationshipsModal.kendoTreeview.open(data.relationships.queryName2);
            await app.ui.addRelationshipsModal.waitLoading();
            await app.ui.addRelationshipsModal.buildComplexQueries();
            await app.ui.addRelationshipsModal.waitLoading();
            const columnNames = (await app.ui.addRelationshipsModal.queryResultsGrid.getColumnsNamesArray()).slice(1);
            await t
                .expect(await app.ui.addRelationshipsModal.criteriaBuilder.getText('queryBuilderName')).eql(data.relationships.queryName2.split('>').pop())
                .expect(await app.ui.addRelationshipsModal.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').getValue())
                .eql(columnNames[0].text)
                .expect(await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Value', 'input').getValue()).eql('');
        });
        await app.step('Reopen Relationship query', async () => {
            await app.ui.addRelationshipsModal.openTree();
            await app.ui.addRelationshipsModal.kendoTreeview.open(data.relationships.queryName);
            await app.ui.addRelationshipsModal.waitLoading();
            await app.ui.addRelationshipsModal.buildComplexQueries();
            await app.ui.addRelationshipsModal.waitLoading();
        });
        await app.step('Set any criteria in the Criteria Builder and click on the "Hide complex queries" link.', async () => {
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.fieldName);
            await row.getField('Value', 'autocomplete').fill(data.relationships.fieldValue);
            await app.ui.addRelationshipsModal.click('complexQueriesLink');
            await t
                .expect(await app.ui.addRelationshipsModal.getText('complexQueriesLink')).eql('Build complex queries')
                .expect(await app.ui.addRelationshipsModal.criteriaBuilder.isPresent()).notOk();
        });
        await app.step('Click on the "Build complex queries" link again and verify the Criteria Builder.', async () => {
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(0);
            await app.ui.addRelationshipsModal.click('complexQueriesLink');
            await t
                .expect(await app.ui.addRelationshipsModal.getText('complexQueriesLink')).eql('Hide complex queries')
                .expect(await app.ui.addRelationshipsModal.criteriaBuilder.isVisible()).ok()
                .expect(await row.getField('Field Name', 'dropdown').getValue()).eql(data.relationships.fieldName)
                .expect(await row.getField('Value', 'dropdown').getValue()).eql(data.relationships.fieldValue);
        });
    })
    .after(async () => {
        await app.step('Delete the created record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
    });

test
    // .only
    .meta('brief', 'true')
    ('Criteria Builder with multiple filters and conjunctions for Add Relationships modal window - (Step 11)', async (t: TestController) => {
        await app.step('Create a record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open the created case record', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.relationships.queryName);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem(data.relationships.defTemplate);
            await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open the `Related records` child tab', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('Related Records');
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            await t
                .expect(await child.isPresent('addNewButton')).ok()
                .expect(await child.isEnabled('addNewButton')).ok();
        });
        await app.step('Open the `Add Relationships` modal window', async () => {
            let child = app.ui.dataEntryBoard.childRecord;
            await child.addNew();
            await t
                .expect(await app.ui.addRelationshipsModal.isVisible()).ok();
        });
        await app.step('Run the query', async () => {
            await app.ui.addRelationshipsModal.kendoTreeview.open(data.relationships.queryName);
            await app.ui.waitLoading({checkErrors: true});
            await t
                .expect(await app.ui.addRelationshipsModal.getText('complexQueriesLink')).eql('Build complex queries');
        });
        await app.step('Add criteria for a singleline', async () => {
            await app.ui.addRelationshipsModal.buildComplexQueries();
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(0);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.singleline.name);
            await row.getField('Operator', 'dropdown').fill('Contains');
            await row.getField('Value', 'input').fill(data.relationships.singleline.value);
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for country', async () => {
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(1);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.country.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'autocomplete').fill(data.relationships.country.value);
            await row.getField('Conjunction', 'dropdown').fill('Or');
        });
        await app.step('Add criteria for a multiline', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(1).click('add');
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(2);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.multiline.name);
            await row.getField('Operator', 'dropdown').fill('Does Not Contain');
            await row.getField('Value', 'input').fill(data.relationships.multiline.value);
        });
        await app.step('Add criteria for a combobox', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(2).click('add');
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(3);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.combobox.name);
            await row.getField('Operator', 'dropdown').fill('Is Null');
        });
        await app.step('Add criteria for a hierarchy', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(3).click('add');
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(4);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.hierarchy.name);
            await row.getField('Operator', 'dropdown').fill('Not Equal');
            await row.getField('Value', 'hierarchy').fill(data.relationships.hierarchy.value);
        });
        await app.step('Add criteria for a datepicker', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(4).click('add');
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(5);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.datepicker.name);
            await row.getField('Operator', 'dropdown').fill('Greater Than Or Equal To');
            await row.getField('Value', 'datepicker').fill(data.relationships.datepicker.value);
            await row.click('rightParenthesis');
        });
        await app.step('Add criteria for a numeric', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(5).click('add');
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(6);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.numeric.name);
            await row.getField('Operator', 'dropdown').fill('Less Than Or Equal To');
            await row.getField('Value', 'input').fill(data.relationships.numeric.value);
            await row.click('leftParenthesis');
        });
        await app.step('Add criteria for a large list lookup', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(6).click('add');
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(7);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.largeList.name);
            await row.getField('Operator', 'dropdown').fill('Is Not Null');
            await row.getField('Conjunction', 'dropdown').fill('Or');
        });
        await app.step('Add criteria for a checkbox', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.getRow(7).click('add');
            const row = app.ui.addRelationshipsModal.criteriaBuilder.getRow(8);
            await row.getField('Field Name', 'autocomplete').fill(data.relationships.checkbox.name);
            await row.getField('Operator', 'dropdown').fill('Equal');
            await row.getField('Value', 'dropdown').fill(data.relationships.checkbox.value);
            await row.click('rightParenthesis');
        });
        await app.step('Verify the results', async () => {
            await app.ui.addRelationshipsModal.criteriaBuilder.showResults();
            await app.ui.waitLoading({checkErrors: true});
            const rowCount = await app.ui.addRelationshipsModal.queryResultsGrid.getRecordsCount();
            await t
                .expect(rowCount).gt(0, 'No records were returned in Query Results');
            for (let i = 0; i < rowCount; i++) {
                const record = await app.ui.addRelationshipsModal.queryResultsGrid.getRecord(i);
                const singleline = await record.getValue(data.relationships.singleline.name);
                const multiline = await record.getValue(data.relationships.multiline.name);
                const combobox = await record.getValue(data.relationships.combobox.name);
                const largeList = await record.getValue(data.relationships.largeList.name);
                const hierarchy = await record.getValue(data.relationships.hierarchy.name);
                const numeric = await record.getValue(data.relationships.numeric.name);
                const datepicker = await record.getValue(data.relationships.datepicker.name);
                const checkbox = await record.getValue(data.relationships.checkbox.name);
                const country = await record.getValue(data.relationships.country.name);
                const fitCondition =
                    (singleline.toLowerCase().includes(data.relationships.singleline.value.toLowerCase()) &&
                        country === data.relationships.country.value ||
                        !multiline.toLowerCase().includes(data.relationships.multiline.value.toLowerCase()) &&
                        combobox === '' &&
                        hierarchy !== data.relationships.hierarchy.value &&
                        app.services.time.getSeconds(datepicker, {pattern: 'MM/DD/YYYY'}) > app.services.time.getSeconds(data.relationships.datepicker.value, {pattern: 'MM/DD/YYYY'})) &&
                    (Number(numeric) <= Number(data.relationships.numeric.value) &&
                        largeList !== '' ||
                        checkbox === data.relationships.checkbox.expectedValue);
                await t
                    .expect(fitCondition).ok(`A record with index = ${i} does not fit the Criteria Builder conditions`);
            }
        });
    })
    .after(async (t) => {
        await app.step('Delete the created record (API)', async () => {
            try {
                await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
            } catch (err) {}
        });
    });
