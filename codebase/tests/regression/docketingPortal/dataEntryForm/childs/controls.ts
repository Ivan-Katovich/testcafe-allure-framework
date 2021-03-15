import app from '../../../../../app';
declare const test: any;
declare const fixture: any;
declare const globalConfig: any;

const createdRecords = [];

fixture `REGRESSION.dataEntryForm.child.pack - Test ID 30001: DEF_Childs - Controls`
    // .disablePageReloads
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
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
                rows: [ { properties: data.requiredFields } ]
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
    });

const data = {
        ipType: 'Patent',
        recordId: '',
        recordName: '',
        defTemplate: 'TA DEF for Patent',
        query: 'Patent>PA All Cases TA filter',
        identifierName: 'PATENTMASTERID',
        child: 'Expenses',
        requiredFields: [ { name: 'Amount', value: '100' } ],
        multiline: { name: 'Text 1', singlelineValue: 'Test Automation', multilineValue: 'Test\nAutomation', value2: 'Test' },
        singleline: { name: 'Invoice Number', value: app.services.random.num().toString(), value2: app.services.random.num().toString() },
        combobox: { name: 'Expense', value: 'Credit Note - (CDN)', value2: 'Debit Note - (DBN)', partialValue: 'Code', invalidValue: 'invalid' },
        largeList: { name: 'Division', value: 'Chemical Division - (CD)', value2: 'Acme Propellants - (ACME-1)', partialValue: 'Party', invalidValue: 'invalid'},
        numeric: [
            { name: 'Percentage', dataType: 'decimal', value: app.services.random.num(1, 10).toString(), value2: app.services.random.num(11, 100).toString() },
            { name: 'USA Amount', dataType: 'money', value: app.services.random.num(1, 100).toString(), value2: app.services.random.num(100, 10000).toString()},
            { name: 'Tax Year', dataType: 'integer', value: app.services.random.num(2000, 2015).toString(), value2: app.services.random.num(2016, 2030).toString()}
        ],
        checkbox: { name: 'GENERICCHECKBOX1', initialValue: 'uncheck', value: 'check' },
        linkedFile: { name: 'Linked File', fileValue: 'testFile1.txt', urlValue: 'http://test', urlValue2: 'http://test1', folder: `${process.env.USERPROFILE}\\Documents` },
        datepicker: { name: 'Miscellaneous Date', value: '11/10/2019', value2: '11/11/2019', invalidValue: 'invalid', newDateFormat: 'yyyy-MM-dd' },
        hierarchyParties: { name: 'Payto Code', initialValue: '', value: '' },
        hierarchyCodes: { name: 'TA Patent Keyword Codes HCY', initialValue: '', value: '' }
    };

test
    // .only
    .meta('brief', 'true')
    (`Verify multiline in child grid (${data.ipType} - Step 6)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form record', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem(data.defTemplate);
            await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open child on the data entry record', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify multiline on the child grid', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.multiline.name, 'multiline');
            await field.click('container');
            await t
                .expect(await field.isVisible('input')).ok();
        });
        await app.step('Set single line value to field', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.multiline.name, 'multiline');
            await field.fill(data.multiline.singlelineValue);
            await child.pressKey('tab');
            await t
                .expect(await record.getValue(data.multiline.name, {readOnlyMode: true})).eql(data.multiline.singlelineValue);
        });
        await app.step('Set multi line value to field', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.multiline.name, 'multiline');
            await field.fill(data.multiline.multilineValue);
            await t
                .expect(await record.getValue(data.multiline.name)).eql(data.multiline.multilineValue);
            await child.pressKey('tab');
            await t
                .expect(await record.getValue(data.multiline.name, {readOnlyMode: true})).eql(data.multiline.singlelineValue);
        });
        await app.step('Save and reload record', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify multiline', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.multiline.name, {readOnlyMode: true})).eql(data.multiline.singlelineValue);
        });
        await app.step('Edit value in multiline', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.multiline.name, 'multiline');
            await field.fill(data.multiline.value2);
        });
        await app.step('Save and refresh record', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify multiline', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.multiline.name)).eql(data.multiline.value2);
        });
        await app.step('Clear multiline field', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.multiline.name, 'multiline');
            await field.clear();
        });
        await app.step('Save and refresh record', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify multiline', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.multiline.name)).eql('');
        });
        await app.step('Resize multiline field', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.multiline.name, 'multiline');
            await field.click('container');
            const widthBefore = await field.getElementWidth('input');
            const heightBefore = await field.getElementHeight('input');
            await field.dragAndDrop('resizeHandler', {offsetX: 100, offsetY: 100});
            await t
                .expect(await field.getElementHeight('input')).gt(heightBefore)
                .expect(await field.getElementWidth('input')).gt(widthBefore);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify singleline in child grid (${data.ipType} - Step 7)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form record', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem(data.defTemplate);
            await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open child on the data entry record', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Set value to singleline', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.singleline.name, 'input');
            await field.fill(data.singleline.value);
            await t
                .expect(await record.getValue(data.singleline.name)).eql(data.singleline.value);
        });
        await app.step('Save record and reload the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify singleline', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.singleline.name)).eql(data.singleline.value);
        });
        await app.step('Edit singleline in child', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.singleline.name, 'input');
            await field.fill(data.singleline.value2);
        });
        await app.step('Save record and refresh the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify edited field', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.singleline.name)).eql(data.singleline.value2);
        });
        await app.step('Clear field in child', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.singleline.name, 'input');
            await field.clear();
        });
        await app.step('Save record and refresh page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify singleline', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.singleline.name)).eql('');
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify CHECKBOX field in child grid (${data.ipType} - Step 11)`, async (t) => {
    await app.step('Login', async () => {
        await app.ui.getRole();
        await app.ui.waitLoading({checkErrors: true});
    });
    await app.step('Open the created record', async () => {
        await app.ui.queryBoard.kendoTreeview.open(data.query);
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.queryBoard.click('menuItems', 'View in:');
        await app.ui.kendoPopup.selectItem(data.defTemplate);
        await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
        await app.ui.waitLoading({checkErrors: true});
    });
    await app.step('Open the Expenses child tab on DEF', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
    });
    await app.step('Verify the checkbox field is displayed unchecked', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.checkbox.name, 'checkbox');
        await t
            .expect(await field.isVisible('input')).ok()
            .expect(await field.getAttribute('input', 'type')).eql('checkbox')
            .expect(await field.getValue()).eql(data.checkbox.initialValue);
    });
    await app.step('Verify the checkbox field can be checked', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.checkbox.name, 'checkbox');
        await field.check();
        await t
            .expect(await field.getValue()).eql('check');
    });
    await app.step('Save and reload record', async () => {
        await app.ui.dataEntryBoard.save();
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.refresh();
    });
    await app.step('Reopen child tab and verify the checkbox', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.checkbox.name, 'checkbox');
        await t
        .expect(await field.getValue()).eql('check');
    });
    await app.step('Verify the checkbox field can be unchecked', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.checkbox.name, 'checkbox');
        await field.uncheck();
        await t
            .expect(await field.getValue()).eql('uncheck');
    });
    await app.step('Save and reload record', async () => {
        await app.ui.dataEntryBoard.save();
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.refresh();
    });
    await app.step('Reopen child tab and verify the checkbox', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.checkbox.name, 'checkbox');
        await t
            .expect(await field.getValue()).eql('uncheck');
    });
});

test
    // .only
    .meta('brief', 'true')
    (`Verify Combobox (Codes) in child grid (${data.ipType} - Step 8)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form record', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem(data.defTemplate);
            await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open child on the data entry record', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Expand dropdown and verify', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.combobox.name, 'dropdown');
            await t.click(field['container']);
            await field.expand();
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect((await field.getPossibleValues()).length).eql(25)
                .expect(await app.ui.kendoPopup.isVisible('showMoreLink')).ok();
            await app.ui.kendoPopup.click('showMoreLink');
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect((await field.getPossibleValues()).length).eql(50);
        });
        await app.step('Select value from dropdown', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.combobox.name, 'dropdown');
            await field.typeText(data.combobox.value);
            await app.ui.kendoPopup.waitLoading();
            await app.ui.kendoPopup.selectTop();
            await t
                .expect(await record.getValue(data.combobox.name)).eql(data.combobox.value);
        });
        await app.step('Save record and refresh the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.combobox.name)).eql(data.combobox.value);
        });
        await app.step('Edit combobox in child', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.combobox.name, 'dropdown');
            await field.typeText(data.combobox.value2);
            await app.ui.header.hover('mainLogo');
            await app.ui.kendoPopup.waitLoading();
            await app.ui.kendoPopup.selectTop();
        });
        await app.step('Save record and refresh the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify the value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.combobox.name);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.combobox.name)).eql(data.combobox.value2);
        });
        await app.step('Clear existing value', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.combobox.name);
            await field.clear();
        });
        await app.step('Save record and refresh the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.combobox.name)).eql('');
        });
        await app.step('Type partial value in combobox', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.combobox.name, 'dropdown');
            await field.typeText(data.combobox.partialValue);
            await t
                .expect(await app.ui.kendoPopup.isPresent('busyIndicator')).ok();
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect(await app.ui.kendoPopup.verifyTextHighlightedInList(data.combobox.partialValue)).ok();
        });
        await app.step('Type invalid value', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.combobox.name, 'dropdown');
            await field.typeText(data.combobox.invalidValue);
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect(await app.ui.kendoPopup.getText('container')).eql('0 items found');
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Large List Lookup (Party) in child grid (${data.ipType} - Step 8)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form record', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem(data.defTemplate);
            await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open child on the data entry record', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Expand dropdown and verify', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.largeList.name, 'dropdown');
            await t.click(field['container']);
            await field.expand();
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect((await field.getPossibleValues()).length).eql(25)
                .expect(await app.ui.kendoPopup.isVisible('showMoreLink')).ok();
            await app.ui.kendoPopup.click('showMoreLink');
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect((await field.getPossibleValues()).length).eql(50);
        });
        await app.step('Select value from dropdown', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.largeList.name, 'dropdown');
            await field.typeText(data.largeList.value);
            await app.ui.kendoPopup.waitLoading();
            await app.ui.kendoPopup.selectTop();
            await t
                .expect(await record.getValue(data.largeList.name)).eql(data.largeList.value);
        });
        await app.step('Save record and refresh the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.largeList.name)).eql(data.largeList.value);
        });
        await app.step('Edit large list lookup in child', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.largeList.name, 'dropdown');
            await field.typeText(data.largeList.value2);
            await app.ui.header.hover('mainLogo');
            await app.ui.kendoPopup.waitLoading();
            await app.ui.kendoPopup.selectTop();
        });
        await app.step('Save record and refresh the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify the value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.largeList.name)).eql(data.largeList.value2);
        });
        await app.step('Clear existing value', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.largeList.name);
            await field.clear();
        });
        await app.step('Save record and refresh the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.largeList.name)).eql('');
        });
        await app.step('Type partial value in large list lookup', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.largeList.name, 'dropdown');
            await field.typeText(data.largeList.partialValue);
            await t
                .expect(await app.ui.kendoPopup.isPresent('busyIndicator')).ok();
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect(await app.ui.kendoPopup.verifyTextHighlightedInList(data.largeList.partialValue)).ok();
        });
        await app.step('Type invalid value', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.largeList.name, 'dropdown');
            await field.typeText(data.largeList.invalidValue);
            await app.ui.kendoPopup.waitLoading();
            await t
                .expect(await app.ui.kendoPopup.getText('container')).eql('0 items found');
        });
    });

data.numeric.forEach ((numericField) => {
    test
        // .only
        .meta('brief', 'true')
        (`Verify Numeric field with data type - ${numericField.dataType} in child grid (${data.ipType} - Step 10)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry form record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open child on the data entry record', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Verify numeric field', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                const field = await record.getField(numericField.name, 'numeric');
                await field.click('container');
                await t
                    .expect(await field.isVisible('arrowUp')).ok()
                    .expect(await field.isVisible('arrowDown')).ok();
            });
            await app.step('Set value in child', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                const field = await record.getField(numericField.name, 'numeric');
                await field.fill(numericField.value);
                await t
                    .expect(await record.getValue(numericField.name)).eql(numericField.value);
            });
            await app.step('Save record and reload the page', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
            });
            await app.step('Reopen child and verify numeric field', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await record.getValue(numericField.name)).eql(numericField.value);
            });
            await app.step('Edit numeric field in child', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                const field = record.getField(numericField.name, 'numeric');
                await field.fill(numericField.value2);
            });
            await app.step('Save record and refresh the page', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
            });
            await app.step('Reopen child and verify edited field', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await record.getValue(numericField.name)).eql(numericField.value2);
            });
            await app.step('Clear field in child', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                const field = record.getField(numericField.name, 'numeric');
                await field.clear();
            });
            await app.step('Save record and refresh page', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
            });
            await app.step('Reopen child and verify singleline', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await record.getValue(numericField.name)).eql('');
            });
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Creating text file', async () => {
            app.services.os.createFile(data.linkedFile.folder + '\\' + data.linkedFile.fileValue, 'test');
        });
    })
    (`Verify Linked File field in child (${data.ipType} - Step 12)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form record', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem(data.defTemplate);
            await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open child on the data entry record', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify Linked File field', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.linkedFile.name, 'linkedfile');
            await t
                .expect(await field.getText('container')).eql('+ Add');
        });
        await app.step('Add new file', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.linkedFile.name, 'linkedfile');
            await field.click('addLink');
            await app.ui.externalFilesModal.openTab('File');
            await app.ui.externalFilesModal.uploadFile(data.linkedFile.folder + '\\' + data.linkedFile.fileValue);
            await app.ui.externalFilesModal.add();
            await t
                .expect(await field.getValue()).eql(data.linkedFile.fileValue);
        });
        await app.step('Add new url', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.linkedFile.name, 'linkedfile');
            await field.click('editButton');
            await app.ui.externalFilesModal.openTab('URL');
            await app.ui.externalFilesModal.getField('URL').fill(data.linkedFile.urlValue);
            await app.ui.externalFilesModal.add();
            await t
                .expect(await field.getValue()).eql(data.linkedFile.urlValue);
        });
        await app.step('Add existing file', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.linkedFile.name, 'linkedfile');
            await field.click('editButton');
            const index = await app.ui.externalFilesModal.grid.getRowIndexByColumnValue('Document Name', data.linkedFile.fileValue);
            await app.ui.externalFilesModal.grid.getCheckbox(index).check();
            await app.ui.externalFilesModal.add();
            await t
                .expect(await field.getValue()).eql(data.linkedFile.fileValue);
        });
        await app.step('Add exising url', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.linkedFile.name, 'linkedfile');
            await field.click('editButton');
            const index = await app.ui.externalFilesModal.grid.getRowIndexByColumnValue('Location', data.linkedFile.urlValue);
            await app.ui.externalFilesModal.grid.getCheckbox(index).check();
            await app.ui.externalFilesModal.add();
            await t
                .expect(await field.getValue()).eql(data.linkedFile.urlValue);
        });
        await app.step('Save record and refresh the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify the value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.linkedFile.name, 'linkedfile');
            await t
                .expect(await field.getValue()).eql(data.linkedFile.urlValue);
        });
        await app.step('Open External Files child tab', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('External Files');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Edit value in External Files', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const index = await child.grid.getRowIndexByColumnValue('External File Location', data.linkedFile.urlValue);
            await child.grid.getCheckbox(index).check();
            await child.click('editRowButton');
            await app.ui.externalFilesModal.openTab('URL');
            await app.ui.externalFilesModal.getField('URL').fill(data.linkedFile.urlValue2);
            await app.ui.externalFilesModal.edit();
        });
        await app.step('Save record and refresh the page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify the value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.linkedFile.name, 'linkedfile');
            await t
                .expect(await field.getValue()).eql(data.linkedFile.urlValue2);
        });
        await app.step('Open External Files child tab', async () => {
            await app.ui.dataEntryBoard.selectChildRecord('External Files');
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Delete value in External Files', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const index = await child.grid.getRowIndexByColumnValue('External File Location', data.linkedFile.urlValue2);
            await child.grid.getCheckbox(index).check();
            await child.click('deleteRowButton');
            await app.ui.confirmationModal.confirm();
        });
        await app.step('Reopen the child and verify the value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.linkedFile.name, 'linkedfile');
            await t
                .expect(await field.getText('container')).eql('+ Add');
        });
    })
    .after(async () => {
        await app.step('Deleting the created text files', async () => {
            app.services.os.removeFilesInFolder(data.linkedFile.folder, [ data.linkedFile.fileValue ]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Date field in child (${data.ipType} - steps 4-5)`, async (t) => {
        await app.step('Login', async () => {
            await app.ui.getRole();
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open data entry form record', async () => {
            await app.ui.queryBoard.kendoTreeview.open(data.query);
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.queryBoard.click('menuItems', 'View in:');
            await app.ui.kendoPopup.selectItem(data.defTemplate);
            await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Open child on the data entry record', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
        });
        await app.step('Verify date field in child', async () => {
            const dateFormat = (await app.api.userPreferences.getUserPreferences()).Preferences.DateFormat.Value;
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.datepicker.name, 'datepicker');
            await field.click('container');
            await t
                .expect(await field.isVisible('calendarButton')).ok()
                .expect(await field.getAttribute('input', 'placeholder')).eql(dateFormat);
        });
        await app.step('Add an invalid date', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.datepicker.name, 'datepicker');
            await field.fill(data.datepicker.invalidValue);
            await app.ui.pressKey('tab');
            await t
                .expect(await record.getValue(data.datepicker.name)).eql('');
        });
        await app.step('Add a valid date from calendar', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.datepicker.name, 'datepicker');
            await field.click('container');
            await field.expand();
            await field.selectToday();
            await t
                .expect(await record.getValue(data.datepicker.name)).eql(app.services.time.getDate());
        });
        await app.step('Save record and refresh page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify the value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.datepicker.name)).eql(app.services.time.getDate());
        });
        await app.step('Edit value in child', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.datepicker.name, 'datepicker');
            await field.fill(data.datepicker.value);
        });
        await app.step('Save record and refresh page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify the value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.datepicker.name)).eql(data.datepicker.value);
        });
        await app.step('Clear value in child', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.datepicker.name, 'datepicker');
            await field.clear();
        });
        await app.step('Save record and refresh page', async () => {
            await app.ui.dataEntryBoard.save();
            await app.ui.waitLoading({checkErrors: true});
            await app.ui.refresh();
        });
        await app.step('Reopen child and verify the value', async () => {
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            await t
                .expect(await record.getValue(data.datepicker.name)).eql('');
        });
        await app.step('Paste valid value', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.datepicker.name, 'datepicker');
            await field.click('container');
            await field.typeText(data.datepicker.value2, {isPaste: true, isReplace: true});
            await app.ui.pressKey('tab');
            await t
                .expect(await record.getValue(data.datepicker.name)).eql(data.datepicker.value2);
        });
        await app.step('Paste invalid value', async () => {
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.datepicker.name, 'datepicker');
            await field.click('container');
            await field.typeText(data.datepicker.invalidValue, {isPaste: true, isReplace: true});
            await app.ui.pressKey('tab');
            await t
                .expect(await record.getValue(data.datepicker.name)).eql('');
        });
        await app.step('Change date format in User Preferences', async () => {
            await app.api.userPreferences.resetUserPreferences([{ property: 'DateFormat.Value', value: data.datepicker.newDateFormat }]);
        });
        await app.step('Refresh the record and verify Date field', async () => {
            await app.ui.closeNativeDialog();
            await app.ui.refresh();
            await app.ui.dataEntryBoard.selectChildRecord(data.child);
            await app.ui.waitLoading({checkErrors: true});
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.datepicker.name, 'datepicker');
            await field.click('container');
            await t
                .expect(await field.getAttribute('input', 'placeholder')).eql(data.datepicker.newDateFormat);
        });
        await app.step('Set value and verify format', async () => {
            const expectedvalue = app.services.time.today(data.datepicker.newDateFormat.toUpperCase());
            const child = app.ui.dataEntryBoard.childRecord;
            const record = await child.grid.getRecord(0);
            const field = record.getField(data.datepicker.name, 'datepicker');
            await field.expand();
            await field.selectToday();
            await t
                .expect(await record.getValue(data.datepicker.name)).eql(expectedvalue);
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify HIERARCHY field with Parties lookup source in child grid (${data.ipType} - Step 3-parties)`, async (t) => {
    await app.step('Login', async () => {
        await app.ui.getRole();
        await app.ui.waitLoading({checkErrors: true});
    });
    await app.step('Open the created record', async () => {
        await app.ui.queryBoard.kendoTreeview.open(data.query);
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.queryBoard.click('menuItems', 'View in:');
        await app.ui.kendoPopup.selectItem(data.defTemplate);
        await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
        await app.ui.waitLoading({checkErrors: true});
    });
    await app.step('Open the Expenses child tab on DEF', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
    });
    await app.step('Verify the hierarchy field is displayed with the search icon', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyParties.name, 'hierarchy');
        await field.click('container');
        await t
            .expect(await field.isVisible('input')).ok()
            .expect(await field.isVisible('searchButton')).ok()
            .expect(await field.getValue()).eql(data.hierarchyParties.initialValue);
    });
    await app.step('Verify the hierarchy modal window is opened by click on the search icon', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyParties.name, 'hierarchy');
        await field.click('container');
        await field.clickSearch();
        await t
            .expect(await app.ui.hierarchyModal.isVisible()).ok()
            .expect(await app.ui.hierarchyModal.isVisible('searchBoxSelector')).ok()
            .expect(await app.ui.hierarchyModal.isVisible('dataBox')).ok();
    });
    await app.step('Verify a value can be selected in the hierarchy field on the child tab', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyParties.name, 'hierarchy');
        data.hierarchyParties.value = (await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1))[0];
        await app.ui.hierarchyModal.kendoTreeview.open(data.hierarchyParties.value);
        await app.ui.hierarchyModal.click('buttons', 'Add');
        await t
            .expect(await app.ui.hierarchyModal.waitTillElementNotPresent()).ok()
            .expect(await field.getValue()).eql(data.hierarchyParties.value);
    });
    await app.step('Save and reload record', async () => {
        await app.ui.dataEntryBoard.save();
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.refresh();
    });
    await app.step('Reopen child tab and verify the hierarchy value', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyParties.name, 'hierarchy');
        await t
            .expect(await field.getValue()).eql(data.hierarchyParties.value);
    });
    await app.step('Verify a value can be edited in the hierarchy field on the child tab', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyParties.name, 'hierarchy');
        await field.click('container');
        await field.clickSearch();
        await app.ui.hierarchyModal.isVisible();
        data.hierarchyParties.value = (await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1))[1];
        await app.ui.hierarchyModal.kendoTreeview.open(data.hierarchyParties.value);
        await app.ui.hierarchyModal.click('buttons', 'Add');
        await t
            .expect(await field.getValue()).eql(data.hierarchyParties.value);
    });
    await app.step('Save and reload record', async () => {
        await app.ui.dataEntryBoard.save();
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.refresh();
    });
    await app.step('Reopen child tab and verify the hierarchy value', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyParties.name, 'hierarchy');
        await t
            .expect(await field.getValue()).eql(data.hierarchyParties.value);
    });
    await app.step('Verify a value can be cleared in the hierarchy field on the child tab', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyParties.name, 'hierarchy');
        await field.clear();
        await t
            .expect(await field.getValue()).eql('');
    });
    await app.step('Save and reload record', async () => {
        await app.ui.dataEntryBoard.save();
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.refresh();
    });
    await app.step('Reopen child tab and verify the hierarchy value', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyParties.name, 'hierarchy');
        await t
            .expect(await field.getValue()).eql('');
    });
});

test
    // .only
    // .skip
    .meta('brief', 'true')
    (`Verify HIERARCHY field with Codes lookup source in child grid (${data.ipType} - Step 3-codes)`, async (t) => {
    await app.step('Login', async () => {
        await app.ui.getRole();
        await app.ui.waitLoading({checkErrors: true});
    });
    await app.step('Open the created record', async () => {
        await app.ui.queryBoard.kendoTreeview.open(data.query);
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.queryBoard.click('menuItems', 'View in:');
        await app.ui.kendoPopup.selectItem(data.defTemplate);
        await app.ui.queryBoard.queryResultsGrid.openRecord(data.recordName);
        await app.ui.waitLoading({checkErrors: true});
    });
    await app.step('Open the Expenses child tab on DEF', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
    });
    await app.step('Verify the hierarchy field is displayed with the search icon', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyCodes.name, 'hierarchy');
        await field.click('container');
        await t
            .expect(await field.isVisible('input')).ok()
            .expect(await field.isVisible('searchButton')).ok()
            .expect(await field.getValue()).eql(data.hierarchyCodes.initialValue);
    });
    await app.step('Verify the hierarchy modal window is opened by click on the search icon', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyCodes.name, 'hierarchy');
        await field.click('container');
        await field.clickSearch();
        await t
            .expect(await app.ui.hierarchyModal.isVisible()).ok()
            .expect(await app.ui.hierarchyModal.isVisible('searchBoxSelector')).ok()
            .expect(await app.ui.hierarchyModal.isVisible('dataBox')).ok();
    });
    await app.step('Verify a value can be selected in the hierarchy field on the child tab', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyCodes.name, 'hierarchy');
        data.hierarchyCodes.value = (await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1))[0];
        await app.ui.hierarchyModal.kendoTreeview.open(data.hierarchyCodes.value);
        await app.ui.hierarchyModal.click('buttons', 'Add');
        await t
            .expect(await app.ui.hierarchyModal.waitTillElementNotPresent()).ok()
            .expect(await field.getValue()).eql(data.hierarchyCodes.value);
    });
    await app.step('Save and reload record', async () => {
        await app.ui.dataEntryBoard.save();
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.refresh();
    });
    await app.step('Reopen child tab and verify the hierarchy value', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyCodes.name, 'hierarchy');
        await t
            .expect(await field.getValue()).eql(data.hierarchyCodes.value);
    });
    await app.step('Verify a value can be edited in the hierarchy field on the child tab', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyCodes.name, 'hierarchy');
        await field.click('container');
        await field.clickSearch();
        await app.ui.hierarchyModal.isVisible();
        data.hierarchyCodes.value = (await app.ui.hierarchyModal.kendoTreeview.getItemNamesByLevel(1))[1];
        await app.ui.hierarchyModal.kendoTreeview.open(data.hierarchyCodes.value);
        await app.ui.hierarchyModal.click('buttons', 'Add');
        await t
            .expect(await field.getValue()).eql(data.hierarchyCodes.value);
    });
    await app.step('Save and reload record', async () => {
        await app.ui.dataEntryBoard.save();
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.refresh();
    });
    await app.step('Reopen child tab and verify the hierarchy value', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyCodes.name, 'hierarchy');
        await t
            .expect(await field.getValue()).eql(data.hierarchyCodes.value);
    });
    await app.step('Verify a value can be cleared in the hierarchy field on the child tab', async () => {
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyCodes.name, 'hierarchy');
        await field.clear();
        await t
            .expect(await field.getValue()).eql('');
    });
    await app.step('Save and reload record', async () => {
        await app.ui.dataEntryBoard.save();
        await app.ui.waitLoading({checkErrors: true});
        await app.ui.refresh();
    });
    await app.step('Reopen child tab and verify the hierarchy value', async () => {
        await app.ui.dataEntryBoard.selectChildRecord(data.child);
        await app.ui.waitLoading({checkErrors: true});
        const child = app.ui.dataEntryBoard.childRecord;
        const record = await child.grid.getRecord(0);
        const field = record.getField(data.hierarchyCodes.name, 'hierarchy');
        await t
            .expect(await field.getValue()).eql('');
    });
});

const dataSet = function() {
    return [{
        ipType: 'Trademark',
        recordId: '',
        defTemplate: 'TA DEF for Trademark',
        query: 'Trademark>TM All Cases TA filter',
        identifierName: 'TRADEMARKMASTERID',
        child: 'Expenses',
        multiline: { name: 'Text 1', value: 'Test Automation' },
        singleline: { name: 'Invoice Number', value: app.services.random.num().toString() },
        combobox: { name: 'Expense', value: 'Legal Services - (LGL)' },
        largeList: { name: 'Division', value: 'CLT Party - 1002 - (CLT Party - 1002)' },
        numeric: { name: 'Percentage', value: app.services.random.num(1, 10).toString() },
        checkbox: { name: 'GENERICCHECKBOX1', value: 'check' },
        linkedFile: { name: 'Linked File', value: 'http://test' },
        datepicker: { name: 'Miscellaneous Date', value: '11/10/2019' },
        hierarchy: { name: 'Payto Code', value: 'Payto - (PYT)' }
    },
    {
        ipType: 'Disclosure',
        query: 'Disclosure>DS All Cases TA filter',
        recordId: '',
        defTemplate: 'TA DEF for Disclosure',
        identifierName: 'DISCLOSUREMASTERID',
        child: 'Expenses',
        multiline: { name: 'Text 1', value: 'Test Automation' },
        singleline: { name: 'Invoice Number', value: app.services.random.num().toString() },
        combobox: { name: 'Expense', value: 'Credit Note - (CDN)'},
        largeList: { name: 'Division', value: 'ABC Corporation - (ABCC-1)' },
        numeric: { name: 'Percentage', value: app.services.random.num(1, 10).toString() },
        checkbox: { name: 'GENERICCHECKBOX1', value: 'check' },
        linkedFile: { name: 'Linked File', value: 'http://test' },
        datepicker: { name: 'Miscellaneous Date', value: '11/10/2019' },
        hierarchy: { name: 'Payto Code', value: 'Payto - (ptcp1)' }
    },
    {
        ipType: 'GeneralIP',
        query: 'GeneralIP1>GIP1 All Cases TA filter',
        recordId: '',
        defTemplate: 'TA DEF for GeneralIP1',
        identifierName: 'GENERALIP1MASTERID',
        child: 'Expenses',
        multiline: { name: 'Text 1', value: 'Test Automation' },
        singleline: { name: 'Invoice Number', value: app.services.random.num().toString() },
        combobox: { name: 'Expense', value: 'Lease - (LSE)' },
        largeList: { name: 'Division', value: 'Acme Propellants - (ACME-1)' },
        numeric: { name: 'Percentage', value: app.services.random.num(1, 10).toString() },
        checkbox: { name: 'GENERICCHECKBOX1', value: 'check' },
        linkedFile: { name: 'Linked File', value: 'http://test' },
        datepicker: { name: 'Miscellaneous Date', value: '11/10/2019' },
        hierarchy: { name: 'Payto Code', value: 'Pay To Code - (GPT)' }
    }];
}();

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', 'true')
        .before(async () => {
            await app.step('Create records and fill with data (API)', async () => {
                await app.api.login();
                app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord(data.ipType, 'simple');
                data.recordId = app.memory.current.createRecordData.respData.Record.MasterId.toString();
            });
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        })
        (`Populate child grid fields (${data.ipType} - step 14)`, async (t) => {
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open data entry form record', async () => {
                await app.ui.queryBoard.kendoTreeview.open(data.query);
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.queryBoard.click('menuItems', 'View in:');
                await app.ui.kendoPopup.selectItem(data.defTemplate);
                await app.ui.queryBoard.queryResultsGrid.openRecord(app.memory.current.createRecordData.reqData.recordName);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Open child on the data entry record', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading({checkErrors: true});
            });
            await app.step('Populate child with all control types', async () => {
                const child = app.ui.dataEntryBoard.childRecord;
                await child.addNew();
                const record = await child.grid.getRecord(0);
                await record.getField(data.checkbox.name, 'checkbox').fill(data.checkbox.value);
                await record.getField(data.combobox.name, 'autocomplete', {isTextExact: true}).fill(data.combobox.value);
                await record.getField(data.largeList.name, 'autocomplete').fill(data.largeList.value);
                await record.getField(data.multiline.name, 'multiline').fill(data.multiline.value);
                await record.getField(data.singleline.name, 'input').fill(data.singleline.value);
                await record.getField(data.numeric.name, 'numeric').fill(data.numeric.value);
                await record.getField(data.datepicker.name, 'datepicker').fill(data.datepicker.value);
                await app.ui.pressKey('tab');
                await record.getField(data.hierarchy.name, 'hierarchy').fill(data.hierarchy.value);
                const field = record.getField(data.linkedFile.name, 'linkedfile');
                await field.click('container');
                await field.click('addLink');
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.externalFilesModal.openTab('URL');
                await app.ui.externalFilesModal.getField('URL').fill(data.linkedFile.value);
                await app.ui.externalFilesModal.add();
            });
            await app.step('Save and refresh the page', async () => {
                await app.ui.dataEntryBoard.save();
                await app.ui.waitLoading({checkErrors: true});
                await app.ui.refresh();
            });
            await app.step('Reopen child and verify the values', async () => {
                await app.ui.dataEntryBoard.selectChildRecord(data.child);
                await app.ui.waitLoading({checkErrors: true});
                const child = app.ui.dataEntryBoard.childRecord;
                const record = await child.grid.getRecord(0);
                await t
                    .expect(await record.getField(data.checkbox.name, 'checkbox').getValue()).eql(data.checkbox.value)
                    .expect(await record.getValue(data.combobox.name, {isTextExact: true})).eql(data.combobox.value)
                    .expect(await record.getValue(data.datepicker.name)).eql(data.datepicker.value)
                    .expect(await record.getValue(data.hierarchy.name)).eql(data.hierarchy.value)
                    .expect(await record.getValue(data.largeList.name)).eql(data.largeList.value)
                    .expect(await record.getValue(data.multiline.name)).eql(data.multiline.value)
                    .expect(await record.getValue(data.numeric.name)).eql(data.numeric.value)
                    .expect(await record.getValue(data.singleline.name)).eql(data.singleline.value)
                    .expect(await record.getField(data.linkedFile.name, 'linkedfile').getValue()).eql(data.linkedFile.value);
            });
        })
        .after(async () => {
            await app.step('Delete created records with data (API)', async () => {
                try {
                    await app.api.combinedFunctionality.deleteRecords([app.memory.current.createRecordData.respData]);
                } catch (err) {}
            });
        });
    });
