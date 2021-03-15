import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.queryList&Results.pack. - Test ID 31571: Query - Query Results - Add prefix to Field Name to Differentiate Duplicated Fields`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step(`Add current user to '${displayConfiguration}' display configuration (API)`, async () => {
            await app.api.changeDisplayConfigurationForUser(displayConfiguration, globalConfig.user.userName);
            await app.api.clearCache();
        });
    })
    .after(async () => {
        await app.step(`Add current user to default display configuration (API)`, async () => {
            await app.api.changeDisplayConfigurationForUser('Default Display Configuration 1', globalConfig.user.userName);
            await app.api.clearCache();
        });
    });

const displayConfiguration = 'TA Display Configuration 1';

[
    {
        iterationName: 'Parent-child, same field name (Steps 1-10)',
        name: 'TA Query' + app.services.time.timestampShort(),
        fieldName: 'CREATEDATE',
        field1: {
            table: 'PATENTACTIONS',
            displayConfiguration: {
                table: 'PatentActions',
                field: 'Create Date'
            },
            expectedName: 'PatentActions_Create Date'
        },
        field2: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'PatentMasters',
                field: 'Create Date'
            },
            expectedName: 'PatentMasters_Create Date'
        },
        source: 'QRYPA_MASTERTITLEACTIONS',
        brief: 'true'
    },
    {
        iterationName: 'Parent-child, different field name (Steps 11-12)',
        name: 'TA Query' + app.services.time.timestampShort(),
        fieldName: 'CREATEDATE',
        field1: {
            table: 'PATENTEXPENSES',
            displayConfiguration: {
                table: '',
                field: 'Create Date_Pat.Exp'
            },
            expectedName: 'Create Date_Pat.Exp'
        },
        field2: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'PatentMasters',
                field: 'Create Date'
            },
            expectedName: 'Create Date'
        },
        source: 'QRYPA_MASTERTITLEPATENTEXPENSES',
        brief: 'true'
    }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify field name prefix on the Query Management modal: ${data.iterationName}`, async (t: TestController) => {
            await app.step(`Change table names in display configuration (API)`, async () => {
                const dc = app.api.administration.displayConfiguration;
                await dc.openDisplayConfiguration(displayConfiguration);
                await dc.openTables();
                await dc.setEditValue(null, data.field1.table, data.field1.displayConfiguration.table);
                await dc.setEditValue(null, data.field2.table, data.field2.displayConfiguration.table);
                await dc.openFieldsTooltips();
                await dc.setEditValue(data.field1.table, data.fieldName, data.field1.displayConfiguration.field);
                await dc.setEditValue(data.field2.table, data.fieldName, data.field2.displayConfiguration.field);
                await dc.save();
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Click on 'Create New Query' button`, async () => {
                await app.ui.queryBoard.createNewQuery();
                await app.ui.waitLoading();
            });
            await app.step(`Populate Query Name and select Source`, async () => {
                await app.ui.queryManagementModal.getField('Query Name', 'input').fill(data.name);
                await app.ui.queryManagementModal.getField('Source', 'autocomplete').fill(data.source);
                await app.ui.waitLoading();
            });
            await app.step(`Open the 'Build Criteria' tab and verify the Field Name dropdown`, async () => {
                await app.ui.queryManagementModal.selectStep('Build Criteria');
                const row = app.ui.queryManagementModal.criteriaBuilder.getRow(0);
                const field = await row.getField('Field Name', 'dropdown');
                await field.expandWholeList();
                const list = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Open the 'Select Fields' tab and verify the 'Selected Fields' multiselect`, async () => {
                await app.ui.queryManagementModal.selectStep('Select Fields');
                const field = app.ui.queryManagementModal.getField('Selected Fields', 'multiselect');
                await field.expand();
                const list = await field.getAllDisplayedOptions();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Select all field with duplicated names`, async () => {
                const field = app.ui.queryManagementModal.getField('Selected Fields', 'multiselect');
                await field.fill(data.field1.expectedName);
                await field.fill(data.field2.expectedName);
            });
            await app.step(`Open the 'Order Columns' tab and verify the 'Selected Fields' list`, async () => {
                await app.ui.queryManagementModal.selectStep('Order Columns');
                const list = await app.ui.queryManagementModal.getSortFields();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Open the 'Sort Results' tab and verify Available Fields`, async () => {
                await app.ui.queryManagementModal.selectStep('Sort Results');
                const field = app.ui.queryManagementModal.getField('Available Fields', 'dropdown');
                await field.expandWholeList();
                const list = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Open the 'Preview' tab and verify the 'Fields' list`, async () => {
                await app.ui.queryManagementModal.selectStep('Preview');
                const list = (await app.ui.queryManagementModal.getQueryDefinitionValue('Fields')).split(', ');

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Click in the Show Query Results Preview link`, async () => {
                await app.ui.queryManagementModal.click('showQueryResultsLink');
                const list = (await app.ui.queryManagementModal.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
        });
});

[
    {
        iterationName: 'Parent-child, same field name (Step 13)',
        query: 'Patent>PA All Actions',
        fieldName: 'CREATEDATE',
        field1: {
            table: 'PATENTACTIONS',
            displayConfiguration: {
                table: 'PatentActions',
                field: 'Create Date'
            },
            expectedName: 'PatentActions_Create Date'
        },
        field2: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'PatentMasters',
                field: 'Create Date'
            },
            expectedName: 'PatentMasters_Create Date'
        },
        brief: 'true'
    },
    {
        iterationName: 'Parent-child, different field name (Step 14)',
        query: 'Patent>Patent Expenses',
        fieldName: 'CREATEDATE',
        field1: {
            table: 'PATENTEXPENSES',
            displayConfiguration: {
                table: '',
                field: 'Create Date_Pat.Exp'
            },
            expectedName: 'Create Date_Pat.Exp'
        },
        field2: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'PatentMasters',
                field: 'Create Date'
            },
            expectedName: 'Create Date'
        },
        brief: 'true'
    },
    {
        iterationName: 'Cross module (Step 15)',
        query: 'Patent>ExportCrossModule',
        fieldName: 'AGENT',
        field1: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'PatentMasters',
                field: 'Agent'
            },
            expectedName: 'PatentMasters_Agent'
        },
        field2: {
            table: 'TRADEMARKMASTERS',
            displayConfiguration: {
                table: 'TrademarkMasters',
                field: 'Agent'
            },
            expectedName: 'TrademarkMasters_Agent'
        },
        brief: 'true'
    }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify field name prefix on Query Management modal: ${data.iterationName}`, async (t: TestController) => {
            await app.step(`Change table names in display configuration (API)`, async () => {
                const dc = app.api.administration.displayConfiguration;
                await dc.openDisplayConfiguration(displayConfiguration);
                await dc.openTables();
                await dc.setEditValue(null, data.field1.table, data.field1.displayConfiguration.table);
                await dc.setEditValue(null, data.field2.table, data.field2.displayConfiguration.table);
                await dc.openFieldsTooltips();
                await dc.setEditValue(data.field1.table, data.fieldName, data.field1.displayConfiguration.field);
                await dc.setEditValue(data.field2.table, data.fieldName, data.field2.displayConfiguration.field);
                await dc.save();
                await app.api.clearCache();
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Click on Edit for the '${data.query}' query`, async () => {
                await app.ui.queryBoard.kendoTreeview.modify(data.query);
                await app.ui.waitLoading();
            });
            await app.step(`Open the 'Build Criteria' tab and verify the Field Name dropdown`, async () => {
                await app.ui.queryManagementModal.selectStep('Build Criteria');
                const row = app.ui.queryManagementModal.criteriaBuilder.getRow(0);
                const field = await row.getField('Field Name', 'dropdown');
                await field.expandWholeList();
                const list = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Open the 'Select Fields' tab and verify the 'Selected Fields' multiselect`, async () => {
                await app.ui.queryManagementModal.selectStep('Select Fields');
                const field = app.ui.queryManagementModal.getField('Selected Fields', 'multiselect');
                await field.expand();
                const list = await field.getAllDisplayedOptions();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Select all field with duplicated names`, async () => {
                const field = app.ui.queryManagementModal.getField('Selected Fields', 'multiselect');
                const value = await field.getValue();
                if (!value.includes(data.field1.expectedName)) {
                    await field.fill(data.field1.expectedName);
                }
                if (!value.includes(data.field2.expectedName)) {
                    await field.fill(data.field2.expectedName);
                }
            });
            await app.step(`Open the 'Order Columns' tab and verify the 'Selected Fields' list`, async () => {
                await app.ui.queryManagementModal.selectStep('Order Columns');
                const list = await app.ui.queryManagementModal.getSortFields();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Open the 'Sort Results' tab and verify Available Fields`, async () => {
                await app.ui.queryManagementModal.selectStep('Sort Results');
                const field = app.ui.queryManagementModal.getField('Available Fields', 'dropdown');
                await field.expandWholeList();
                const list = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Open the 'Preview' tab and verify the 'Fields' list`, async () => {
                await app.ui.queryManagementModal.selectStep('Preview');
                const list = (await app.ui.queryManagementModal.getQueryDefinitionValue('Fields')).split(', ');

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Click in the Show Query Results Preview link`, async () => {
                await app.ui.queryManagementModal.click('showQueryResultsLink');
                const list = (await app.ui.queryManagementModal.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
        });
    });

[
    {
        iterationName: 'Parent-child, same field name',
        url: 'UI/queries',
        query: 'Patent>PA All Actions',
        fieldsName: 'CREATEDATE',
        field1: {
            table: 'PATENTACTIONS',
            displayConfiguration: {
                table: 'Actions',
                field: 'Create Date'
            },
            expectedName: 'Actions_Create Date'
        },
        field2: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'Patents',
                field: 'Create Date'
            },
            expectedName: 'Patents_Create Date'
        },
        brief: 'true'
    },
    {
        iterationName: 'Parent-child, different field name',
        url: 'UI/queries',
        query: 'Patent>Patent Expenses',
        fieldsName: 'CREATEDATE',
        field1: {
            table: 'PATENTEXPENSES',
            displayConfiguration: {
                table: '',
                field: 'Create Date_Pat.Exp'
            },
            expectedName: 'Create Date_Pat.Exp'
        },
        field2: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'Patents',
                field: 'Create Date'
            },
            expectedName: 'Create Date'
        },
        brief: 'true'
    },
    {
        iterationName: 'Cross module',
        url: 'UI/queries',
        query: 'Patent>ExportCrossModule',
        fieldsName: 'DOCKETNUMBER',
        field1: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'Patents',
                field: 'Agent'
            },
            expectedName: 'Patents_Agent'
        },
        field2: {
            table: 'TRADEMARKMASTERS',
            displayConfiguration: {
                table: 'Trademarks',
                field: 'Agent'
            },
            expectedName: 'Trademarks_Agent'
        },
        brief: 'true'
    },
    {
        iterationName: 'Party query',
        url: 'UI/party/queries',
        query: 'Party>Party Query',
        fieldsName: 'CREATEDATE',
        field1: {
            table: 'PARTIES',
            displayConfiguration: {
                table: 'Parties',
                field: 'Create Date'
            },
            expectedName: 'Parties_Create Date'
        },
        field2: {
            table: 'PARTYDETAILS',
            displayConfiguration: {
                table: 'Details',
                field: 'Create Date'
            },
            expectedName: 'Details_Create Date'
        },
        brief: 'true'
    }
].forEach((data) => {
    test
        // .only
        .requestHooks(app.ui.requestLogger.downloadFile)
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Remove all exported files from the Download folder`, async () => {
                await app.services.os.removeDownloads(['ExportedFile.*']);
            });
        })
        (`Verify field name prefix on query in export files (Step 16-19): ${data.iterationName}`, async (t: TestController) => {
            await app.step(`Change table names in display configuration (API)`, async () => {
                const dc = app.api.administration.displayConfiguration;
                await dc.openDisplayConfiguration(displayConfiguration);
                await dc.openTables();
                await dc.setEditValue(null, data.field1.table, data.field1.displayConfiguration.table);
                await dc.setEditValue(null, data.field2.table, data.field2.displayConfiguration.table);
                await dc.openFieldsTooltips();
                await dc.setEditValue(data.field1.table, data.fieldsName, data.field1.displayConfiguration.field);
                await dc.setEditValue(data.field2.table, data.fieldsName, data.field2.displayConfiguration.field);
                await dc.save();
                await app.api.clearCache();
            });
            await app.step('Login', async () => {
                await app.ui.getRole(undefined, data.url);
                await app.ui.waitLoading();
            });
            await app.step('Run query', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step(`Verify column names in query results table`, async () => {
                const list = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Open Criteria Builder`, async () => {
                await app.ui.queryBoard.buildComplexQueries();
                await app.ui.waitLoading();
            });
            await app.step(`Verify the Field Name dropdown`, async () => {
                await app.ui.queryBoard.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown').expandWholeList();
                const list = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Select several records and click Export > Excel`, async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(1).check();
                await app.ui.queryBoard.click('menuItems', 'Export');
                await app.ui.kendoPopup.selectItem('Excel Export - (Excel Export)');
                await app.ui.waitLoading({ checkErrors: true });
                await t
                    .expect(await app.services.os.waitForFileExists('ExportedFile.xlsx')).ok();
            });
            await app.step(`Verify Excel file`, async () => {
                let worksheet = await app.services.excel.getWorksheet(`${process.env.USERPROFILE}\\Downloads\\ExportedFile.xlsx`, 'Query Export');
                const row = worksheet.getRow(1);
                const list = row.values;

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Select several records and click Export > HTML`, async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(1).check();
                await app.ui.queryBoard.click('menuItems', 'Export');
                await app.ui.kendoPopup.selectItem('HTML - (HTML)');
                await app.ui.waitLoading({ checkErrors: true });
                await t
                    .expect(await app.services.os.waitForFileExists('ExportedFile.html')).ok();
            });
            await app.step(`Verify Excel file`, async () => {
                await t.navigateTo(`file:///${process.env.USERPROFILE}\\Downloads\\ExportedFile.html`);
                const list = await app.ui.exportHtml.getRowValues(0);

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Select several records and click Export > Text`, async () => {
                await app.ui.goBack();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(1).check();
                await app.ui.queryBoard.click('menuItems', 'Export');
                await app.ui.kendoPopup.selectItem('Text - (Text)');
                await app.ui.waitLoading({ checkErrors: true });
                await t
                    .expect(await app.services.os.waitForFileExists('ExportedFile.txt')).ok();
            });
            await app.step(`Verify Excel file`, async () => {
                const fileContent = app.services.os.readFile(`${process.env.USERPROFILE}\\Downloads\\ExportedFile.txt`);
                const firstLine = fileContent.split(`\r\n`)[0];
                const list = firstLine.split(',');

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
        })
        .after(async () => {
            await app.step(`Remove all exported files from the Download folder`, async () => {
                await app.services.os.removeDownloads(['ExportedFile.*']);
            });
        });
    });

[
    {
        collaboration: {
            process: 'Action Process for TA (Patent)',
            task: 'RM'
        },
        fieldsName: 'CREATEDATE',
        field1: {
            table: 'PATENTACTIONS',
            displayConfiguration: {
                table: 'Actions',
                field: 'Create Date'
            },
            expectedName: 'Actions_Create Date'
        },
        field2: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'Patents',
                field: 'Create Date'
            },
            expectedName: 'Patents_Create Date'
        },
        brief: 'true'
    }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        .before(async () => {
            await app.step(`Remove all exported files from the Download folder`, async () => {
                await app.services.os.removeDownloads(['ExportedFile.*']);
            });
        })
        (`Verify field name prefix on the Collaboration portal page (Step 20)`, async (t: TestController) => {
            await app.step(`Change table names in display configuration (API)`, async () => {
                const dc = app.api.administration.displayConfiguration;
                await dc.openDisplayConfiguration(displayConfiguration);
                await dc.openTables();
                await dc.setEditValue(null, data.field1.table, data.field1.displayConfiguration.table);
                await dc.setEditValue(null, data.field2.table, data.field2.displayConfiguration.table);
                await dc.openFieldsTooltips();
                await dc.setEditValue(data.field1.table, data.fieldsName, data.field1.displayConfiguration.field);
                await dc.setEditValue(data.field2.table, data.fieldsName, data.field2.displayConfiguration.field);
                await dc.save();
                await app.api.clearCache();
            });
            await app.step('Login to the Collaboration Portal page', async () => {
                await app.ui.getRole(undefined, 'UI/collaboration');
                await app.ui.waitLoading();
            });
            await app.step(`Open the '${data.collaboration.task}' task in the '${data.collaboration.process}' process`, async () => {
                await app.ui.collaborationBoard.getProcess(data.collaboration.process)
                    .getTask(data.collaboration.task).open();
                await app.ui.waitLoading();
            });
            await app.step(`Verify column names in query results grid`, async () => {
                const list = (await app.ui.queryBoard.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Select records and click the Export button`, async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(2).check();
                await app.ui.queryBoard.click('menuItems', 'Export');
                await app.ui.kendoPopup.selectItem('Excel Export - (Excel Export)');
                await app.ui.waitLoading({ checkErrors: true });
                await t
                    .expect(await app.services.os.waitForFileExists('ExportedFile.xlsx')).ok();
            });
            await app.step(`Verify Excel file`, async () => {
                let worksheet = await app.services.excel.getWorksheet(`${process.env.USERPROFILE}\\Downloads\\ExportedFile.xlsx`, 'Query Export');
                const row = worksheet.getRow(1);
                const list = row.values;

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Select several records and click Export > HTML`, async () => {
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(1).check();
                await app.ui.queryBoard.click('menuItems', 'Export');
                await app.ui.kendoPopup.selectItem('HTML - (HTML)');
                await app.ui.waitLoading({ checkErrors: true });
                await t
                    .expect(await app.services.os.waitForFileExists('ExportedFile.html')).ok();
            });
            await app.step(`Verify Excel file`, async () => {
                await t.navigateTo(`file:///${process.env.USERPROFILE}\\Downloads\\ExportedFile.html`);
                const list = await app.ui.exportHtml.getRowValues(0);

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Select several records and click Export > Text`, async () => {
                await app.ui.goBack();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(0).check();
                await app.ui.queryBoard.queryResultsGrid.getCheckbox(1).check();
                await app.ui.queryBoard.click('menuItems', 'Export');
                await app.ui.kendoPopup.selectItem('Text - (Text)');
                await app.ui.waitLoading({ checkErrors: true });
                await t
                    .expect(await app.services.os.waitForFileExists('ExportedFile.txt')).ok();
            });
            await app.step(`Verify Excel file`, async () => {
                const fileContent = app.services.os.readFile(`${process.env.USERPROFILE}\\Downloads\\ExportedFile.txt`);
                const firstLine = fileContent.split(`\r\n`)[0];
                const list = firstLine.split(',');

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
        })
        .after(async () => {
            await app.step(`Remove all exported files from the Download folder`, async () => {
                await app.services.os.removeDownloads(['ExportedFile.*']);
            });
        });
    });

[
    {
        query: 'Patent>PA All Actions',
        fieldsName: 'CREATEDATE',
        field1: {
            table: 'PATENTACTIONS',
            displayConfiguration: {
                table: 'PatentActions',
                field: 'Create Date'
            },
            expectedName: 'PatentActions_Create Date'
        },
        field2: {
            table: 'PATENTMASTERS',
            displayConfiguration: {
                table: 'PatentMasters',
                field: 'Create Date'
            },
            expectedName: 'PatentMasters_Create Date'
        },
        brief: 'true'
    }
].forEach((data) => {
    test
        // .only
        .meta('brief', data.brief)
        (`Verify field name prefix on Data Entry Form (Step 21-23)`, async (t: TestController) => {
            await app.step(`Change table names in display configuration (API)`, async () => {
                const dc = app.api.administration.displayConfiguration;
                await dc.openDisplayConfiguration(displayConfiguration);
                await dc.openTables();
                await dc.setEditValue(null, data.field1.table, data.field1.displayConfiguration.table);
                await dc.setEditValue(null, data.field2.table, data.field2.displayConfiguration.table);
                await dc.openFieldsTooltips();
                await dc.setEditValue(data.field1.table, data.fieldsName, data.field1.displayConfiguration.field);
                await dc.setEditValue(data.field2.table, data.fieldsName, data.field2.displayConfiguration.field);
                await dc.save();
                await app.api.clearCache();
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step('Run query', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step(`Open first record`, async () => {
                await app.ui.queryBoard.queryResultsGrid.openRecord(0);
                await app.ui.waitLoading();
            });
            await app.step(`Go to the 'Related Records' child tab and click 'Add New'`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Related Records');
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
                await app.ui.waitLoading();
            });
            await app.step(`Run the '${data.query}' query in the Add Relationship modal`, async () => {
                await app.ui.addRelationshipsModal.kendoTreeview.open(data.query);
                await app.ui.waitLoading();
            });
            await app.step(`Verify column names  in query results grid`, async () => {
                const list = (await app.ui.addRelationshipsModal.queryResultsGrid.getColumnsNamesArray()).map((x) => x.text);

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
            await app.step(`Verify Field Name dropdown values in Criteria Builder`, async () => {
                await app.ui.addRelationshipsModal.buildComplexQueries();
                await app.ui.waitLoading();
                const field = await app.ui.addRelationshipsModal.criteriaBuilder.getRow(0).getField('Field Name', 'dropdown');
                await field.expandWholeList();
                const list = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(list).contains(data.field1.expectedName)
                    .expect(list).contains(data.field2.expectedName);
            });
        });
});
