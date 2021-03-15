import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.queryList&Results.pack. - Test ID 30055: Query - Query Results - Column Filters`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
            await app.api.query.getAllQueries();
        });
        await app.step('Create record (API)', async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('patent', 'simple');
        });
    });

const defaultDateFormat: string = app.api.userPreferences.getDefaultValue('DateFormat.Value').toUpperCase();
const data = {
    redColor: 'rgb(215, 0, 37)',
    input: {
        query: 'Patent>PA All Cases CB',
        fields: [
            { type: 'multiline', name: 'Application Number', existingValue: 'test', nonExistingValue: 'Non Existing Value', valueWithSpecialSymbols: '#1' },
            { type: 'singleline', name: 'Patent Number', existingValue: 'test', nonExistingValue: 'Non Existing Value', valueWithSpecialSymbols: '#1'}
        ]
    },
    numeric: {
        query: 'Patent>Patent Expenses',
        child: 'Expenses',
        fields: [
            { type: 'decimal', name: 'Percentage', format: { minimumFractionDigits: 2, useGrouping: true }, brief: 'true' },
            { type: 'integer', name: 'Tax Year', format: { maximumFractionDigits: 0, useGrouping: false }, brief: 'false' },
            { type: 'money', name: 'Amount', format: { minimumFractionDigits: 2, useGrouping: true }, brief: 'false' }
        ],
        cultures: [
            'de-DE',
            'en-GB',
            'en-US',
            'ja-JP',
            'sv-SE',
            'zh-CN'
        ]
    },
    datepicker: {
        query: 'Patent>PA All Cases CB',
        fields: [
            { type: 'date', name: 'Custom Date #4', brief: 'true', dateFormat: defaultDateFormat },
            { type: 'timestamp', name: 'Create Date', brief: 'false', dateFormat: defaultDateFormat + ' HH:mm:ss' },
            { type: 'datetime', name: 'Expiration Date', brief: 'false', dateFormat: defaultDateFormat }
        ],
        format1: 'MM/dd/yyyy',
        format2: 'yyyy-MM-dd',
        validValue: '12/12/2012',
        alphanumericValue: 'abcde12345',
        outOfRangeValue: '13/13/2020'
    },
    checkbox: {
        query: 'Patent>PA All Cases CB',
        name: 'Power of Attorney'
    },
    linkedfile: {
        query: 'Patent>Patent Expenses',
        name: 'Linked File'
    },
    null: {
        query: 'Patent>PA All Cases CB',
        name: 'APPLICATIONDATEFLAG'
    },
    multiple: {
        query: 'Patent>PA All Cases CB',
        filter1: {
            name: 'Application Number',
            operator: 'Equal',
            value: 'Number_' + app.services.time.timestampShort(),
            type: 'input'
        },
        filter2: {
            name: 'Expiration Date',
            type: 'datepicker',
            operator: 'Equal',
            existingValue: app.services.time.tomorrow(defaultDateFormat),
            nonexistingValue: app.services.time.today(defaultDateFormat)
        }
    }
};

// Singleline/Multiline
data.input.fields.forEach((field) => {

    test
        // .only
        .meta('brief', 'true')
        (`Verify ${field.type} column filter`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.input.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Verify filters are displayed in the query (Step 3)', async () => {
                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('filterRow')).ok();
            });
            await app.step('Verify filter control', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.openMethodDropdown();
                const expectedItems =
                    [
                        'Contains',
                        'Does Not Contain',
                        'Starts With',
                        'Ends With',
                        'Equal',
                        'Not Equal',
                        'Is Null',
                        'Is Not Null'
                    ];
                const actualItems = await filter.child.getAllItemsText();
                const difference = app.services.array.getDifference(expectedItems, actualItems);

                await t
                    .expect(await filter.getMethodValue()).eql('Contains')
                    .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql('Filter Criteria')
                    .expect(await filter.isVisible('applyButton')).ok()
                    .expect(difference.length).eql(0, `Operator(s) [${difference.toString()}] are missing or displayed incorrectly`);
            });
        });

    test
        // .only
        .meta('brief', 'true')
        (`Verify Contains for ${field.type}`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.input.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step(`Set to ${field.type} value in record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, field.existingValue + app.services.random.num().toString());
                await dataEntry.save();
            });
            await app.step('Enter any value that exists in the grid and click Filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Contains');
                await filter.addCriteria(field.existingValue);
                await filter.confirm();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x: string) => x.toLowerCase().includes(field.existingValue))).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Contains')
                    .expect(await filter.getCriteriaValue()).eql(field.existingValue);
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter criteria to non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Contains');
                await filter.addCriteria(field.nonExistingValue);
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
            await app.step(`Set to ${field.type} value with special symmbols in record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, field.valueWithSpecialSymbols);
                await dataEntry.save();
            });
            await app.step('Set filter criteria to value with special symbols', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Contains');
                await filter.addCriteria(field.valueWithSpecialSymbols);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(columnValue.every((x: string) => x.toLowerCase().includes(field.valueWithSpecialSymbols))).ok();
            });
        });

    test
        // .only
        .meta('brief', 'false')
        (`Verify Does Not Contain for ${field.type}`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.input.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Set operator to Does Not Contain', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Does Not Contain');
                await filter.addCriteria(field.existingValue);
                await filter.confirm();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x) => !x.toLowerCase().includes(field.existingValue))).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Does Not Contain')
                    .expect(await filter.getCriteriaValue()).eql(field.existingValue);
            });
            await app.step(`Set to ${field.type} value with special symmbols in record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, field.valueWithSpecialSymbols);
                await dataEntry.save();
            });
            await app.step('Set filter criteria to value with special symbols', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Does Not Contain');
                await filter.addCriteria(field.valueWithSpecialSymbols);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(columnValue.every((x: string) => !x.toLowerCase().includes(field.valueWithSpecialSymbols))).ok();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Contains');
                await row.getField('Value', 'input').fill(field.existingValue);
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Set filter criteria to non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Does Not Contain');
                await filter.addCriteria(field.existingValue);
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', 'true')
        (`Verify Starts With for ${field.type}`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.input.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Open column filter and verify Starts With', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.openMethodDropdown();

                await t
                    .expect((await filter.child.getAllItemsText()).includes('Starts With')).ok('The operator dropdown doesn\'t include Starts With');
            });
            await app.step('Set operator to Starts With', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Starts With');
                await filter.addCriteria(field.existingValue);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x: string) => x.toLowerCase().startsWith(field.existingValue))).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Starts With')
                    .expect(await filter.getCriteriaValue()).eql(field.existingValue);
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter criteria to non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Starts With');
                await filter.addCriteria(field.nonExistingValue);
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
            await app.step(`Set to ${field.type} value with special symmbols in record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, field.valueWithSpecialSymbols + 'test');
                await dataEntry.save();
            });
            await app.step('Set filter criteria to value with special symbols', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Starts With');
                await filter.addCriteria(field.valueWithSpecialSymbols);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(columnValue.every((x: string) => x.toLowerCase().startsWith(field.valueWithSpecialSymbols))).ok();
            });
        });

    test
        // .only
        .meta('brief', 'false')
        (`Verify Ends With for ${field.type}`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.input.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Open column filter and verify Ends With', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.openMethodDropdown();

                await t
                    .expect((await filter.child.getAllItemsText()).includes('Starts With')).ok('The operator dropdown doesn\'t include Ends With');
            });
            await app.step('Set operator to Ends With', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Ends With');
                await filter.addCriteria(field.existingValue);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x: string) => x.toLowerCase().endsWith(field.existingValue))).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Ends With')
                    .expect(await filter.getCriteriaValue()).eql(field.existingValue);
            });
            await app.step('Set filter criteria to non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Ends With');
                await filter.addCriteria(field.nonExistingValue);
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
            await app.step(`Set to ${field.type} value with special symmbols in record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, 'test' + field.valueWithSpecialSymbols);
                await dataEntry.save();
            });
            await app.step('Set filter criteria to value with special symbols', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Ends With');
                await filter.addCriteria(field.valueWithSpecialSymbols);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(columnValue.every((x: string) => x.toLowerCase().endsWith(field.valueWithSpecialSymbols))).ok();
            });
        });

    test
        // .only
        .meta('brief', 'true')
        (`Verify Equal for ${field.type}`, async (t: TestController) => {
            await app.step(`Set to ${field.type} a value in record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, field.existingValue);
                await dataEntry.save();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.input.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Set operator to Equal', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(field.existingValue);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x: string) => x.toLowerCase() === field.existingValue)).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Equal')
                    .expect(await filter.getCriteriaValue()).eql(field.existingValue);
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter criteria to non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(field.nonExistingValue);
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
            await app.step(`Set to ${field.type} value with special symmbols in record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, field.valueWithSpecialSymbols);
                await dataEntry.save();
            });
            await app.step('Set filter criteria to value with special symbols', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(field.valueWithSpecialSymbols);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(columnValue.every((x: string) => x.toLowerCase() === field.valueWithSpecialSymbols)).ok();
            });
        });

    test
        // .only
        .meta('brief', 'false')
        (`Verify Not Equal for ${field.type}`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.input.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Set operator to Not Equal', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Not Equal');
                await filter.addCriteria(field.existingValue);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x: string) => x.toLowerCase() !== field.existingValue)).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Not Equal')
                    .expect(await filter.getCriteriaValue()).eql(field.existingValue);
            });
            await app.step(`Set to ${field.type} value with special symmbols in record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, field.valueWithSpecialSymbols);
                await dataEntry.save();
            });
            await app.step('Set filter criteria to value with special symbols', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Not Equal');
                await filter.addCriteria(field.valueWithSpecialSymbols);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(columnValue.every((x: string) => x.toLowerCase() !== field.valueWithSpecialSymbols)).ok();
            });
        });

    test
        // .only
        .meta('brief', 'true')
        (`Verify Is Null for ${field.type}`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.input.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Set operator to Is Null', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Null');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x: string) => x === '')).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Is Null');
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Is Not Null');
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Set filter criteria to non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Null');
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', 'false')
        (`Verify Is Not Null for ${field.type}`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.input.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Set operator to Is Not Null', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Not Null');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x: string) => x !== '')).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Is Not Null');
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Is Null');
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Set filter criteria to non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Not Null');
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });
    });

// Datepicker
data.datepicker.fields
    .forEach((field) => {

    test
        // .only
        .meta('brief', field.brief)
        (`Verify filter criteria field for ${field.type} (Steps 6-8)`, async (t: TestController) => {
            await app.step('Set Date Format in User Preferences (API)', async () => {
                await app.api.login();
                await app.api.userPreferences.resetUserPreferences([{ property: 'DateFormat.Value', value: data.datepicker.format1 }]);
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.datepicker.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Verify filter control (Step 6)', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.openMethodDropdown();

                await t
                    .expect(await filter.getMethodValue()).eql('Equal')
                    .expect(await filter.child.getAllItemsText()).eql(
                        [
                            'Equal',
                            'Not Equal',
                            'Greater Than',
                            'Greater Than Or Equal To',
                            'Less Than',
                            'Less Than Or Equal To',
                            'Is Null',
                            'Is Not Null'
                        ]
                    )
                    .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql(data.datepicker.format1)
                    .expect(await filter.isVisible('applyButton')).ok();
            });
            await app.step('Select date from calendar (Step 7)', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.child.selectItem('Equal');
                const field = filter.getCriteriaField('datepicker');
                await field.expand();
                await field.selectToday();

                await t
                    .expect(await field.getValue()).eql(app.services.time.getDate());
            });
            await app.step('Enter not full valid value', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                const field = filter.getCriteriaField('datepicker');
                await field.fill(data.datepicker.validValue.substr(0, 5));
                await app.services.time.sleep(300); // Hardcoded sleep cause of hardcoded sleep 250 ms on frontend

                await t
                    .expect(await field.getStyleProperty('field', 'border-left-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-right-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-top-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-bottom-color')).eql(data.redColor);
            });
            await app.step('Enter full valid value', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                const field = filter.getCriteriaField('datepicker');
                await field.fill(data.datepicker.validValue);

                await app.services.time.sleep(300); // Hardcoded sleep cause of hardcoded sleep 250 ms on frontend

                await t
                    .expect(await field.getStyleProperty('field', 'border-left-color')).notEql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-right-color')).notEql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-top-color')).notEql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-bottom-color')).notEql(data.redColor);
            });
            await app.step('Enter invalid value - alphanumeric value', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                const field = filter.getCriteriaField('datepicker');
                await field.fill(data.datepicker.alphanumericValue);

                await app.services.time.sleep(300); // Hardcoded sleep cause of hardcoded sleep 250 ms on frontend

                await t
                    .expect(await field.getStyleProperty('field', 'border-left-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-right-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-top-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-bottom-color')).eql(data.redColor);
            });
            await app.step('Enter invalid value - date format different from User Preferences', async () => {
                const dateString = app.services.time.today(data.datepicker.format2.toUpperCase());
                const filter = await app.ui.kendoPopup.getFilter('input');
                const field = filter.getCriteriaField('datepicker');
                await field.fill(dateString);

                await app.services.time.sleep(300); // Hardcoded sleep cause of hardcoded sleep 250 ms on frontend

                await t
                    .expect(await field.getStyleProperty('field', 'border-left-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-right-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-top-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-bottom-color')).eql(data.redColor);
            });
            await app.step('Enter invalid format - out of range date', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                const field = filter.getCriteriaField('datepicker');
                await field.fill(data.datepicker.outOfRangeValue);

                await app.services.time.sleep(300); // Hardcoded sleep cause of hardcoded sleep 250 ms on frontend

                await t
                    .expect(await field.getStyleProperty('field', 'border-left-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-right-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-top-color')).eql(data.redColor)
                    .expect(await field.getStyleProperty('field', 'border-bottom-color')).eql(data.redColor);
            });
            await app.step('Change Date Format in User Preferences (API) (Step 8)', async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DateFormat.Value', value: data.datepicker.format2 }]);
            });
            await app.step('Refresh and verify the placeholder format', async () => {
                await app.ui.refresh();
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql(data.datepicker.format2);
            });
            await app.step('Verify date format', async () => {
                const expectedDateString = app.services.time.today(data.datepicker.format2.toUpperCase());
                const filter = await app.ui.kendoPopup.getFilter('input');
                const field = filter.getCriteriaField('datepicker');
                await field.expand();
                await field.selectToday();

                await t
                    .expect(await field.getValue()).eql(expectedDateString);
            });
        })
        .after(async () => {
            await app.step('Set Date Format in User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Equal for datepicker with type ${field.type} (Step 9)`, async (t: TestController) => {
            const date = app.services.time.today(defaultDateFormat);
            await app.step(`Set ${field.name} value (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, date);
                await dataEntry.save();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.datepicker.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Enter any value that exists in the grid and click Filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(date);
                await filter.confirm();
                const columnValue = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.time.format(x, defaultDateFormat, {pattern: 'MM/DD/YYYY'}));

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x: string) => x === date)).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Equal')
                    .expect(await filter.getCriteriaValue()).eql(date);
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Not Equal');
                await row.getField('Value', 'input').fill(date);
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Enter valid non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(date);
                await filter.confirm();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', 'false')
        (`Verify Not Equal for datepicker with type ${field.type} (Step 9)`, async (t: TestController) => {
            const date = app.services.time.today(defaultDateFormat);
            await app.step(`Set ${field.name} value (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, date);
                await dataEntry.save();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.datepicker.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Enter any value that exists in the grid and click Filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Not Equal');
                await filter.addCriteria(date);
                await filter.confirm();
                const columnValue = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.time.format(x, defaultDateFormat, {pattern: 'MM/DD/YYYY'}));

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x: string) => x !== date)).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Not Equal')
                    .expect(await filter.getCriteriaValue()).eql(date);
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Equal');
                await row.getField('Value', 'input').fill(date);
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Enter valid non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Not Equal');
                await filter.addCriteria(date);
                await filter.confirm();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Greater Than for datepicker with type ${field.type} (Step 9)`, async (t: TestController) => {
            let date: string;
            let filterValue: string;
            await app.step('Get date (API)', async () => {
                const query = app.api.query;
                await query.openQuery(data.datepicker.query);
                query.sort(field.name);
                await query.runQuery();
                const lastResult = await query.getColumnValuesFromResults(field.name)[0];
                date = app.services.time.format(lastResult, defaultDateFormat);
                filterValue = app.services.time.moment(lastResult).add(-1, 'days').format(defaultDateFormat);
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.datepicker.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Enter any value that exists in the grid and click Filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than');
                await filter.addCriteria(filterValue);
                await t
                    .expect(await filter.getMethodValue()).eql('Greater Than')
                    .expect(await filter.getCriteriaValue()).eql(filterValue);
            });
            await app.step('Verify query results', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.confirm();
                const columnValue = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.time.moment(x, field.dateFormat));

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x) => x.isAfter(app.services.time.moment(filterValue, defaultDateFormat)))).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Greater Than')
                    .expect(await filter.getCriteriaValue()).eql(filterValue);
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Equal');
                await row.getField('Value', 'input').fill(filterValue);
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Enter valid non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than');
                await filter.addCriteria(date);
                await filter.confirm();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Less Than for datepicker with type ${field.type} (Step 9)`, async (t: TestController) => {
            const date = app.services.time.today(defaultDateFormat);
            await app.step(`Set ${field.name} value (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, app.services.time.getDate());
                await dataEntry.save();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.datepicker.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Enter any value that exists in the grid and click Filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than');
                await filter.addCriteria(date);
                await filter.confirm();
                const columnValue = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.time.moment(x, 'MM/DD/YYYY'));

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isBefore(app.services.time.moment(date, 'MM/DD/YYYY')))).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Less Than')
                    .expect(await filter.getCriteriaValue()).eql(date);
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Equal');
                await row.getField('Value', 'input').fill(date);
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Enter valid non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than');
                await filter.addCriteria(app.services.time.getDate());
                await filter.confirm();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Greater Than Or Equal To for datepicker with type ${field.type} (Step 9)`, async (t: TestController) => {
            const date = app.services.time.today(defaultDateFormat);
            await app.step(`Set ${field.name} value (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, app.services.time.getDate());
                await dataEntry.save();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.datepicker.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Enter any value that exists in the grid and click Filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than Or Equal To');
                await filter.addCriteria(date);
                await filter.confirm();
                const columnValue = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.time.moment(x, 'MM/DD/YYYY'));

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrAfter(app.services.time.moment(date, 'MM/DD/YYYY')))).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Greater Than Or Equal To')
                    .expect(await filter.getCriteriaValue()).eql(date);
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Less Than');
                await row.getField('Value', 'input').fill(date);
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Enter valid non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than Or Equal To');
                await filter.addCriteria(app.services.time.getDate());
                await filter.confirm();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Less Than Or Equal To for datepicker with type ${field.type} (Step 9)`, async (t: TestController) => {
            const date = app.services.time.yesterday(defaultDateFormat);
            await app.step(`Set ${field.name} value (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, app.services.time.getDate());
                await dataEntry.save();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.datepicker.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Enter any value that exists in the grid and click Filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than Or Equal To');
                await filter.addCriteria(date);
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.time.moment(x, 'MM/DD/YYYY').startOf('day'));

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x) => app.services.time.moment(x, 'MM/DD/YYYY').isSameOrBefore(app.services.time.moment(app.services.time.yesterday(defaultDateFormat), 'MM/DD/YYYY')))).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Less Than Or Equal To')
                    .expect(await filter.getCriteriaValue()).eql(date);
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Equal');
                await row.getField('Value', 'input').fill(app.services.time.today(defaultDateFormat));
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Enter valid non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than Or Equal To');
                await filter.addCriteria(date);
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Is Null for datepicker with type ${field.type} (Step 9)`, async (t: TestController) => {
            await app.step(`Set ${field.name} value (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, app.services.time.getDate());
                await dataEntry.save();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.datepicker.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Enter any value that exists in the grid and click Filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Null');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name));

                await t
                    .expect(columnValue.every((x) => x === '')).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Is Null');
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Is Not Null');
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Enter valid non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Null');
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', 'false')
        (`Verify Is Not Null for datepicker with type ${field.type} (Step 9)`, async (t: TestController) => {
            await app.step(`Set ${field.name} value (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.setValue(field.name, app.services.time.getDate());
                await dataEntry.save();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.datepicker.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Enter any value that exists in the grid and click Filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Not Null');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValue = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name));

                await t
                    .expect(columnValue.length).gt(0)
                    .expect(columnValue.every((x) => x !== '')).ok()
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok();
            });
            await app.step('Open Filter menu again', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Is Not Null');
            });
            await app.step('Click Clear to reset filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Is Null');
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Enter valid non-existing value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Not Null');
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });
    });

// Checkbox

test
    // .only
    .meta('brief', 'true')
    (`Verify Checkbox (Step 10-11)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.checkbox.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Open filter for checkbox', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.checkbox.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');

            await t
                .expect(await filter.isVisible('checkboxes', 'Checked')).ok()
                .expect(await filter.isVisible('checkboxes', 'Not Checked')).ok()
                .expect(await filter.getCount('checkboxes')).eql(2)
                .expect(await filter.isVisible('buttons', 'Filter')).ok();
        });
        await app.step('Verify Checked', async () => {
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.getCheckbox('Checked').check();
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.checkbox.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x === true)).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.checkbox.name)).ok();
        });
        await app.step('Reopen filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.checkbox.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');

            await t
                .expect(await filter.getCheckbox('Not Checked').isChecked()).notOk()
                .expect(await filter.getCheckbox('Checked').isChecked()).ok();
        });
        await app.step('Remove filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.checkbox.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.checkbox.name)).notOk();
        });
        await app.step('Verify "Not Checked"', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.checkbox.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.getCheckbox('Not Checked').check();
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.checkbox.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x === false)).ok()
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.checkbox.name)).ok();
        });
        await app.step('Reopen filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.checkbox.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');

            await t
                .expect(await filter.getCheckbox('Not Checked').isChecked()).ok()
                .expect(await filter.getCheckbox('Checked').isChecked()).notOk();
        });
        await app.step('Remove filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.checkbox.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.checkbox.name)).notOk();
        });
        await app.step('Verify "Checked" and "Not Checked"', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.checkbox.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.getCheckbox('Checked').check();
            await filter.getCheckbox('Not Checked').check();
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.checkbox.name)).ok();
        });
        await app.step('Reopen filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.checkbox.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');

            await t
                .expect(await filter.getCheckbox('Not Checked').isChecked()).ok()
                .expect(await filter.getCheckbox('Checked').isChecked()).ok();
        });
        await app.step('Remove filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.checkbox.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.checkbox.name)).notOk();
        });
        await app.step('Verify when none is selected', async () => {
            const totalRecordsCount = Number(await app.ui.queryBoard.getMenuTotalCount({isNumber: true}));
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.checkbox.name);
            const filter = await app.ui.kendoPopup.getFilter('checkbox');
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({isNumber: true}))).eql(totalRecordsCount);
        });
    });

// Numeric

data.numeric.fields
    .forEach((field) => {

    test
        // .only
        .meta('brief', field.brief)
        (`Verify numeric criteria in column filter (Step 12-13) `, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Verify filter control (Step 6)', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.openMethodDropdown();

                await t
                    .expect(await filter.getMethodValue()).eql('Equal')
                    .expect(await filter.child.getAllItemsText()).eql(
                        [
                            'Equal',
                            'Not Equal',
                            'Greater Than',
                            'Greater Than Or Equal To',
                            'Less Than',
                            'Less Than Or Equal To',
                            'Is Null',
                            'Is Not Null'
                        ]
                    )
                    .expect(await filter.isVisible('applyButton')).ok()
                    .expect(await filter.getCriteriaValue()).eql(Number(0).toLocaleString(undefined, field.format));
            });
            await app.step('Type not numeric value in the Criteria field', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.child.selectItem('Equal');
                await filter.getCriteriaField('numeric').typeText('abcde');

                await t
                    .expect(await filter.getCriteriaValue()).eql('0');
            });
            await app.step('Paste not numeric value in the Criteria field', async () => {
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.getCriteriaField('numeric').typeText('abcde', { isPaste: true});

                await t
                    .expect(await filter.getCriteriaValue()).eql('0');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Equal for numeric with ${field.type} type`, async (t: TestController) => {
            const value = 100;
            const positiveValue = 100;
            const negativeValue = -100;
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, value);
                await dataEntry.save();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Set Equal filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x === value)).ok();
            });
            await app.step('Reopen column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Equal')
                    .expect(await filter.getCriteriaValue()).eql(value.toLocaleString(undefined, field.format));
            });
            await app.step('Reset column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, positiveValue);
                await dataEntry.save();
            });
            await app.step('Set positive value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(positiveValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x === positiveValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, negativeValue);
                await dataEntry.save();
            });
            await app.step('Set negative value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(negativeValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x === negativeValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, 0);
                await dataEntry.save();
            });
            await app.step('Set zero value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria('0');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x === 0)).ok();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Less Than');
                await row.getField('Value', 'numeric').fill(value.toString());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Set non exiting value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Equal');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', 'false')
        (`Verify Not Equal for numeric with ${field.type} type`, async (t: TestController) => {
            const value = 100;
            const positiveValue = 100;
            const negativeValue = -100;
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, value);
                await dataEntry.save();
            });
            await app.step('Set Not Equal filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Not Equal');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x !== value)).ok();
            });
            await app.step('Reopen column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Not Equal')
                    .expect(await filter.getCriteriaValue()).eql(value.toLocaleString(undefined, field.format));
            });
            await app.step('Reset column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, positiveValue);
                await dataEntry.save();
            });
            await app.step('Set positive value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Not Equal');
                await filter.addCriteria(positiveValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x !== positiveValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, negativeValue);
                await dataEntry.save();
            });
            await app.step('Set negative value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Not Equal');
                await filter.addCriteria(negativeValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x !== negativeValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, 0);
                await dataEntry.save();
            });
            await app.step('Set zero value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Not Equal');
                await filter.addCriteria('0');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x !== 0)).ok();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Equal');
                await row.getField('Value', 'numeric').fill(value.toString());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Set non exiting value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Not Equal');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Greater Than for numeric with ${field.type} type`, async (t: TestController) => {
            const value = 100;
            const positiveValue = 100;
            const negativeValue = -100;
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, value);
                await dataEntry.save();
            });
            await app.step('Set Greater Than filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x > value)).ok();
            });
            await app.step('Reopen column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Greater Than')
                    .expect(await filter.getCriteriaValue()).eql(value.toLocaleString(undefined, field.format));
            });
            await app.step('Reset column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, positiveValue);
                await dataEntry.save();
            });
            await app.step('Set positive value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than');
                await filter.addCriteria(positiveValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x > positiveValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, negativeValue);
                await dataEntry.save();
            });
            await app.step('Set negative value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than');
                await filter.addCriteria(negativeValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x > negativeValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, 0);
                await dataEntry.save();
            });
            await app.step('Set zero value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than');
                await filter.addCriteria('0');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x > 0)).ok();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Equal');
                await row.getField('Value', 'numeric').fill(value.toString());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Set non exiting value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Less Than for numeric with ${field.type} type`, async (t: TestController) => {
            const value = 100;
            const positiveValue = 100;
            const negativeValue = -100;
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, value);
                await dataEntry.save();
            });
            await app.step('Set Less Than filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x < value)).ok();
            });
            await app.step('Reopen column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Less Than')
                    .expect(await filter.getCriteriaValue()).eql(value.toLocaleString(undefined, field.format));
            });
            await app.step('Reset column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, positiveValue);
                await dataEntry.save();
            });
            await app.step('Set positive value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than');
                await filter.addCriteria(positiveValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x < positiveValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, negativeValue);
                await dataEntry.save();
            });
            await app.step('Set negative value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than');
                await filter.addCriteria(negativeValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x < negativeValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, 0);
                await dataEntry.save();
            });
            await app.step('Set zero value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than');
                await filter.addCriteria('0');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x < 0)).ok();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Equal');
                await row.getField('Value', 'numeric').fill(value.toString());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Set non exiting value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Greater Than Or Equal To for numeric with ${field.type} type`, async (t: TestController) => {
            const value = 100;
            const positiveValue = 100;
            const negativeValue = -100;
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, value);
                await dataEntry.save();
            });
            await app.step('Set Greater Than Or Equal To in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than Or Equal To');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x >= value)).ok();
            });
            await app.step('Reopen column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Greater Than Or Equal To')
                    .expect(await filter.getCriteriaValue()).eql(value.toLocaleString(undefined, field.format));
            });
            await app.step('Reset column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, positiveValue);
                await dataEntry.save();
            });
            await app.step('Set positive value', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than Or Equal To');
                await filter.addCriteria(positiveValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x >= positiveValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, negativeValue);
                await dataEntry.save();
            });
            await app.step('Set negative value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than Or Equal To');
                await filter.addCriteria(negativeValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x >= negativeValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, 0);
                await dataEntry.save();
            });
            await app.step('Set zero value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than Or Equal To');
                await filter.addCriteria('0');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x >= 0)).ok();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Less Than');
                await row.getField('Value', 'numeric').fill(value.toString());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Set non exiting value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Greater Than Or Equal To');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Less Than Or Equal To for numeric with ${field.type} type`, async (t: TestController) => {
            const value = 100;
            const positiveValue = 100;
            const negativeValue = -100;
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step(`Set ${field.name} in the created record (API)`, async () => {
                await app.api.login();
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, value);
                await dataEntry.save();
            });
            await app.step('Set Less Than Or Equal To in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than Or Equal To');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x <= value)).ok();
            });
            await app.step('Reopen column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Less Than Or Equal To')
                    .expect(await filter.getCriteriaValue()).eql(value.toLocaleString(undefined, field.format));
            });
            await app.step('Reset column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
            await app.step(`Set ${field.name} in the created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, positiveValue);
                await dataEntry.save();
            });
            await app.step('Set positive value to criteria field', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than Or Equal To');
                await filter.addCriteria(positiveValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x <= positiveValue)).ok();
            });
            await app.step(`Set ${field.name} in the created record(API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, negativeValue);
                await dataEntry.save();
            });
            await app.step('Set negative value to criteria field', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than Or Equal To');
                await filter.addCriteria(negativeValue.toString());
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x <= negativeValue)).ok();
            });
            await app.step(`Set ${field.name} in created record (API)`, async () => {
                const dataEntry = app.api.dataEntryForm;
                await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await dataEntry.openChild(data.numeric.child);
                dataEntry.addChildRecord();
                await dataEntry.setChildValue(field.name, 0);
                await dataEntry.save();
            });
            await app.step('Set zero value to criteria field', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than Or Equal To');
                await filter.addCriteria('0');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = (await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name))
                    .map((x) => app.services.num.parseToNumber(x));

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x <= 0)).ok();
            });
            await app.step('Set filter in criteria builder', async () => {
                await app.ui.queryBoard.buildComplexQueries();
                const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
                await row.getField('Field Name', 'autocomplete').fill(field.name);
                await row.getField('Operator', 'dropdown').fill('Greater Than');
                await row.getField('Value', 'numeric').fill(value.toString());
                await app.ui.queryBoard.criteriaBuilder.showResults();
                await app.ui.waitLoading();
            });
            await app.step('Set non exiting value in column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Less Than Or Equal To');
                await filter.addCriteria(value.toString());
                await filter.confirm();
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).ok()
                    .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                    .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
            });
        });

    test
        // .only
        .meta('brief', field.brief)
        (`Verify Is Null for numeric with ${field.type} type`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Set Is Null to column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Null');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x === '')).ok();
            });
            await app.step('Reopen column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Is Null')
                    .expect(await filter.getCriteriaValue()).eql('');
            });
            await app.step('Reset column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
        });

    test
        // .only
        .meta('brief', 'false')
        (`Verify Is Not Null for numeric with ${field.type} type`, async (t: TestController) => {
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            await app.step('Set Is Not Null to column filter', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');
                await filter.selectMethod('Is Not Null');
                await filter.confirm();
                await app.ui.waitLoading();
                const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(field.name);

                await t
                    .expect(columnValues.length).gt(0)
                    .expect(columnValues.every((x) => x !== '')).ok();
            });
            await app.step('Reopen column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                const filter = await app.ui.kendoPopup.getFilter('input');

                await t
                    .expect(await filter.getMethodValue()).eql('Is Not Null')
                    .expect(await filter.getCriteriaValue()).eql('');
            });
            await app.step('Reset column filter and verify', async () => {
                await app.ui.queryBoard.queryResultsGrid.removeFilter(field.name);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(field.name)).notOk();
            });
        });
    });

// Numeric - cultures
data.numeric.cultures.forEach((culture) => {
    test
        // .only
        .meta('brief', 'true')
        (`Verify numeric for culture = ${culture} type (Step 15)`, async (t: TestController) => {
            await app.step(`Set Culture = ${culture} (API)`, async () => {
                await app.api.login();
                await app.api.userPreferences.resetUserPreferences([ { property: 'DefaultCulture.Value', value: culture }]);
                app.ui.resetRole();
            });
            await app.step('Run query', async () => {
                const queryId = await app.api.query.getQueryId(data.numeric.query);
                await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
                await app.ui.waitLoading();
            });
            for (const field of data.numeric.fields) {
                await app.step('Verify field in column filter', async () => {
                    await app.ui.queryBoard.queryResultsGrid.openFilter(field.name);
                    const filter = await app.ui.kendoPopup.getFilter('input');
                    const expectedValue = app.services.num.toLocaleString(0, culture, field.format);

                    await t
                        .expect(await filter.getCriteriaValue()).eql(expectedValue);
                });
                await app.step('Set a value in the criteria field', async () => {
                    const randomValue = app.services.random.num(10000, 100000);
                    const filter = await app.ui.kendoPopup.getFilter('input');
                    await filter.getCriteriaField('numeric').fill(randomValue.toString());
                    await app.ui.pressKey('tab');
                    const expectedValue = app.services.num.toLocaleString(randomValue, culture, field.format);

                    await t
                        .expect(await filter.getCriteriaValue()).eql(expectedValue);
                });
            }
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
                app.ui.resetRole();
            });
        });
    });

// Linked File

test
    // .only
    .meta('brief', 'true')
    (`Verify filter for Linked File (Step 16-17)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.linkedfile.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filters are displayed in the query', async () => {
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('filterRow')).ok();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.openMethodDropdown();
            const expectedItems =
                [
                    'Contains',
                    'Does Not Contain',
                    'Starts With',
                    'Ends With',
                    'Equal',
                    'Not Equal',
                    'Is Null',
                    'Is Not Null'
                ];
            const actualItems = await filter.child.getAllItemsText();
            const difference = app.services.array.getDifference(expectedItems, actualItems);

            await t
                .expect(await filter.getMethodValue()).eql('Contains')
                .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql('Filter Criteria')
                .expect(await filter.isVisible('applyButton')).ok()
                .expect(difference.length).eql(0, `Operator(s) [${difference.toString()}] are missing or displayed incorrectly`);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Contains for Linked file (Step 16-17)`, async (t: TestController) => {
        let nonExistingValue;
        const value = '1';
        await app.step('Get non-existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.linkedfile.query);
            app.api.query.sort(data.linkedfile.name);
            await app.api.query.runQuery();
            const array = await app.api.query.getColumnValuesFromResults(data.linkedfile.name);
            nonExistingValue = (Number(array[0]) + 1).toString();
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.linkedfile.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Contains');
            await filter.addCriteria(value);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.linkedfile.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x.includes(value))).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Contains')
                .expect(await filter.getCriteriaValue()).eql(value);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.linkedfile.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).notOk();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Contains');
            await filter.addCriteria(nonExistingValue);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify Does Not Contain for Linked file (Step 16-17)`, async (t: TestController) => {
        const value = '1';
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.linkedfile.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Does Not Contain');
            await filter.addCriteria(value);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.linkedfile.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => !x.includes(value))).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Does Not Contain')
                .expect(await filter.getCriteriaValue()).eql(value);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.linkedfile.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).notOk();
        });
        await app.step('Set filter in criteria builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name').fill(data.linkedfile.name);
            await row.getField('Operator').fill('Contains');
            await row.getField('Value', 'input').fill(value);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Does Not Contain');
            await filter.addCriteria(value);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Starts With for Linked file (Step 16-17)`, async (t: TestController) => {
        let nonExistingValue;
        const value = '1';
        await app.step('Get non-existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.linkedfile.query);
            app.api.query.sort(data.linkedfile.name);
            await app.api.query.runQuery();
            const array = await app.api.query.getColumnValuesFromResults(data.linkedfile.name);
            nonExistingValue = (Number(array[0]) + 1).toString();
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.linkedfile.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Open column filter and verify Starts With', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.openMethodDropdown();

            await t
                .expect((await filter.child.getAllItemsText()).includes('Starts With')).ok('The operator dropdown doesn\'t include Starts With');
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Starts With');
            await filter.addCriteria(value);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.linkedfile.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x: string) => x.startsWith(value))).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Starts With')
                .expect(await filter.getCriteriaValue()).eql(value);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.linkedfile.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).notOk();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Starts With');
            await filter.addCriteria(nonExistingValue);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify Ends With for Linked file (Step 16-17)`, async (t: TestController) => {
        let nonExistingValue;
        const value = '1';
        await app.step('Get non-existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.linkedfile.query);
            app.api.query.sort(data.linkedfile.name);
            await app.api.query.runQuery();
            const array = await app.api.query.getColumnValuesFromResults(data.linkedfile.name);
            nonExistingValue = (Number(array[0]) + 1).toString();
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.linkedfile.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Open column filter and verify Ends With', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.openMethodDropdown();

            await t
                .expect((await filter.child.getAllItemsText()).includes('Ends With')).ok('The operator dropdown doesn\'t include Ends With');
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Ends With');
            await filter.addCriteria(value);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.linkedfile.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x: string) => x.endsWith(value))).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Ends With')
                .expect(await filter.getCriteriaValue()).eql(value);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.linkedfile.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).notOk();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Ends With');
            await filter.addCriteria(nonExistingValue);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Equal for Linked file (Step 16-17)`, async (t: TestController) => {
        let nonExistingValue;
        let existingValue;
        await app.step('Get exisint and non-existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.linkedfile.query);
            app.api.query.sort(data.linkedfile.name);
            await app.api.query.runQuery();
            existingValue = (await app.api.query.getColumnValuesFromResults(data.linkedfile.name))[0];
            nonExistingValue = (Number(existingValue) + 1).toString();
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.linkedfile.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Equal');
            await filter.addCriteria(existingValue);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.linkedfile.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x === existingValue)).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Equal')
                .expect(await filter.getCriteriaValue()).eql(existingValue);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.linkedfile.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).notOk();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Equal');
            await filter.addCriteria(nonExistingValue);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify Not Equal for Linked file (Step 16-17)`, async (t: TestController) => {
        let value = '8479';
        await app.step('Get existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.linkedfile.query);
            app.api.query.sort(data.linkedfile.name);
            await app.api.query.runQuery();
            value = (await app.api.query.getColumnValuesFromResults(data.linkedfile.name))[0];
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.linkedfile.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Not Equal');
            await filter.addCriteria(value);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.linkedfile.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x !== value)).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Not Equal')
                .expect(await filter.getCriteriaValue()).eql(value);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.linkedfile.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).notOk();
        });
        await app.step('Set filter in criteria builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name').fill(data.linkedfile.name);
            await row.getField('Operator').fill('Equal');
            await row.getField('Value', 'input').fill(value);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Not Equal');
            await filter.addCriteria(value);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Is Null for Linked file (Step 16-17)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            await app.api.login();
            const queryId = await app.api.query.getQueryId(data.linkedfile.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Is Null');
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.linkedfile.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x === '')).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Is Null')
                .expect(await filter.getCriteriaValue()).eql('');
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.linkedfile.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).notOk();
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify Is Not Null for Linked file (Step 16-17)`, async (t: TestController) => {
        let queryTotal;
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.linkedfile.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
            queryTotal = Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }));
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Is Not Null');
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.linkedfile.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x !== '')).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.linkedfile.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Is Not Null')
                .expect(await filter.getCriteriaValue()).eql('');
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.linkedfile.name);
            await app.ui.waitLoading();

            await t
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(queryTotal)
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.linkedfile.name)).notOk();
        });
    });

// Null

test
    // .only
    .meta('brief', 'true')
    (`Verify Null  (Step 16-17)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filters are displayed in the query', async () => {
            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isVisible('filterRow')).ok();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.openMethodDropdown();
            const expectedItems =
                [
                    'Contains',
                    'Does Not Contain',
                    'Starts With',
                    'Ends With',
                    'Equal',
                    'Not Equal',
                    'Is Null',
                    'Is Not Null'
                ];
            const actualItems = await filter.child.getAllItemsText();
            const difference = app.services.array.getDifference(expectedItems, actualItems);

            await t
                .expect(await filter.getMethodValue()).eql('Contains')
                .expect(await filter.getAttribute('criteriaInput', 'placeholder')).eql('Filter Criteria')
                .expect(await filter.isVisible('applyButton')).ok()
                .expect(difference.length).eql(0, `Operator(s) [${difference.toString()}] are missing or displayed incorrectly`);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Contains for Null (Step 16-17)`, async (t: TestController) => {
        let existingValue;
        const nonExistingValue = 'non existent';
        await app.step('Get existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.null.query);
            app.api.query.sort(data.null.name);
            await app.api.query.runQuery();
            const array = await app.api.query.getColumnValuesFromResults(data.null.name);
            existingValue = array[0];
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Contains');
            await filter.addCriteria(existingValue);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.null.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x.includes(existingValue))).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Contains')
                .expect(await filter.getCriteriaValue()).eql(existingValue);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.null.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).notOk();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Contains');
            await filter.addCriteria(nonExistingValue);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify Does Not Contain for Null (Step 16-17)`, async (t: TestController) => {
        const value = 'N';
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Does Not Contain');
            await filter.addCriteria(value);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.null.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => !x.includes(value))).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Does Not Contain')
                .expect(await filter.getCriteriaValue()).eql(value);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.null.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).notOk();
        });
        await app.step('Set filter in criteria builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name').fill(data.null.name);
            await row.getField('Operator').fill('Contains');
            await row.getField('Value', 'input').fill(value);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Does Not Contain');
            await filter.addCriteria(value);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Starts With for Null (Step 16-17)`, async (t: TestController) => {
        let existingValue;
        const nonExistingValue = 'non existing';
        await app.step('Get existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.null.query);
            app.api.query.sort(data.null.name);
            await app.api.query.runQuery();
            const array = await app.api.query.getColumnValuesFromResults(data.null.name);
            existingValue = array[0];
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Open column filter and verify Starts With', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.openMethodDropdown();

            await t
                .expect((await filter.child.getAllItemsText()).includes('Starts With')).ok('The operator dropdown doesn\'t include Starts With');
        });
        await app.step('Verify filter control', async () => {
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Starts With');
            await filter.addCriteria(existingValue);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.null.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x: string) => x.startsWith(existingValue))).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Starts With')
                .expect(await filter.getCriteriaValue()).eql(existingValue);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.null.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).notOk();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Starts With');
            await filter.addCriteria(nonExistingValue);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify Ends With for Null (Step 16-17)`, async (t: TestController) => {
        let existingValue;
        const nonExistingValue = 'non existing';
        await app.step('Get existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.null.query);
            app.api.query.sort(data.null.name);
            await app.api.query.runQuery();
            const array = await app.api.query.getColumnValuesFromResults(data.null.name);
            existingValue = array[0];
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Open column filter and verify Ends With', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.openMethodDropdown();

            await t
                .expect((await filter.child.getAllItemsText()).includes('Ends With')).ok('The operator dropdown doesn\'t include Ends With');
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Ends With');
            await filter.addCriteria(existingValue);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.null.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x: string) => x.endsWith(existingValue))).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Ends With')
                .expect(await filter.getCriteriaValue()).eql(existingValue);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.null.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).notOk();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Ends With');
            await filter.addCriteria(nonExistingValue);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Equal for Null (Step 16-17)`, async (t: TestController) => {
        let existingValue;
        const nonExistingValue = 'non existing';
        await app.step('Get existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.null.query);
            app.api.query.sort(data.null.name);
            await app.api.query.runQuery();
            const array = await app.api.query.getColumnValuesFromResults(data.null.name);
            existingValue = array[0];
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Equal');
            await filter.addCriteria(existingValue);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.null.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x === existingValue)).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Equal')
                .expect(await filter.getCriteriaValue()).eql(existingValue);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.null.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).notOk();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Equal');
            await filter.addCriteria(nonExistingValue);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify Not Equal for Null (Step 16-17)`, async (t: TestController) => {
        let existingValue;
        await app.step('Get existing value (API)', async () => {
            await app.api.login();
            await app.api.query.openQuery(data.null.query);
            app.api.query.sort(data.null.name);
            await app.api.query.runQuery();
            const array = await app.api.query.getColumnValuesFromResults(data.null.name);
            existingValue = array[0];
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Not Equal');
            await filter.addCriteria(existingValue);
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.null.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x !== existingValue)).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Not Equal')
                .expect(await filter.getCriteriaValue()).eql(existingValue);
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.null.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).notOk();
        });
        await app.step('Set filter in criteria builder', async () => {
            await app.ui.queryBoard.buildComplexQueries();
            await app.ui.waitLoading();
            const row = app.ui.queryBoard.criteriaBuilder.getRow(0);
            await row.getField('Field Name').fill(data.null.name);
            await row.getField('Operator').fill('Equal');
            await row.getField('Value', 'input').fill(existingValue);
            await app.ui.queryBoard.criteriaBuilder.showResults();
            await app.ui.waitLoading();
        });
        await app.step('Set filter criteria to non-existing value', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Not Equal');
            await filter.addCriteria(existingValue);
            await filter.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).ok()
                .expect(Number(await app.ui.queryBoard.getMenuTotalCount({ isNumber: true }))).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Is Null for Null (Step 16-17)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Is Null');
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.null.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x === '')).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Is Null')
                .expect(await filter.getCriteriaValue()).eql('');
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.null.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).notOk();
        });
    });

test
    // .only
    .meta('brief', 'false')
    (`Verify Is Not Null for Null (Step 16-17)`, async (t: TestController) => {
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Verify filter control', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod('Is Not Null');
            await filter.confirm();
            await app.ui.waitLoading();
            const columnValues = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.null.name);

            await t
                .expect(columnValues.length).gt(0)
                .expect(columnValues.every((x) => x !== '')).ok();
        });
        await app.step('Open Filter menu again', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.null.name);
            const filter = await app.ui.kendoPopup.getFilter('input');

            await t
                .expect(await filter.getMethodValue()).eql('Is Not Null')
                .expect(await filter.getCriteriaValue()).eql('');
        });
        await app.step('Click Clear to reset filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.removeFilter(data.null.name);
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.queryResultsGrid.isClearFilterDisplayed(data.null.name)).notOk();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify multiple filters (Step 18)`, async (t: TestController) => {
        await app.step('Set filter values in created record (API)', async () => {
            await app.api.login();
            const dataEntry = app.api.dataEntryForm;
            await dataEntry.openRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
            await dataEntry.setValue(data.multiple.filter1.name, data.multiple.filter1.value);
            await dataEntry.setValue(data.multiple.filter2.name, data.multiple.filter2.existingValue);
            await dataEntry.save();
        });
        await app.step('Run query', async () => {
            const queryId = await app.api.query.getQueryId(data.null.query);
            await app.ui.getRole(undefined, `/UI/queries/${queryId}`);
            await app.ui.waitLoading();
        });
        await app.step('Set 1st filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.multiple.filter1.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod(data.multiple.filter1.operator);
            await filter.addCriteria(data.multiple.filter1.value);
            await filter.confirm();
            await app.ui.waitLoading();
        });
        await app.step('Set existing value in 2nd filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.multiple.filter2.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod(data.multiple.filter2.operator);
            await filter.addCriteria(data.multiple.filter2.existingValue);
            await filter.confirm();
            await app.ui.waitLoading();
        });
        await app.step('Verify query resuilts', async () => {
            const columnValues1 = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.multiple.filter1.name);
            const columnValues2 = await app.ui.queryBoard.queryResultsGrid.getColumnValues(data.multiple.filter2.name);

            await t
                .expect(columnValues1.length).gt(0)
                .expect(columnValues1.every((x) => x === data.multiple.filter1.value)).ok()
                .expect(columnValues2.every((x) => x === data.multiple.filter2.existingValue)).ok();
        });
        await app.step('Set non-existing value in 2nd filter', async () => {
            await app.ui.queryBoard.queryResultsGrid.openFilter(data.multiple.filter2.name);
            const filter = await app.ui.kendoPopup.getFilter('input');
            await filter.selectMethod(data.multiple.filter2.operator);
            await filter.addCriteria(data.multiple.filter2.nonexistingValue);
            await filter.confirm();
            await app.ui.waitLoading();
        });
        await app.step('Verify query resuilts', async () => {
            const recordCount = await app.ui.queryBoard.queryResultsGrid.getRecordsCount();

            await t
                .expect(recordCount).eql(0)
                .expect(await app.ui.queryBoard.queryResultsGrid.getText('noRecordsGrid')).eql('No records available.');
        });
    });
