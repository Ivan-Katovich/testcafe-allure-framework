import app from '../../../../app';

fixture`REGRESSION.userPreferences.pack. - Test ID 29961: User Preferences - apply Decimal Data Type to DEF`
    // .only
    // .skip
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step(`Reset current user role`, async () => {
            app.ui.resetRole();
        });
        await app.step(`Create a trademark record (API)`, async () => {
            app.memory.current.createRecordData = await app.api.combinedFunctionality.createRecord('trademark', 'simple');
        });
    });

[
    { culture: 'de-DE' },
    { culture: 'en-US' },
    { culture: 'ja-JP' },
    { culture: 'en-GB' },
    { culture: 'sv-SE' },
    { culture: 'zh-CN' }
].forEach(async (data) => {
    test
        // .only
        .meta('brief', 'true')
        (`Verify Decimal Data Type with culture = '${data.culture}' on filing section`, async (t: TestController) => {
            await app.step(`Set Default Culture to '${data.culture}' (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Open created DEF record`, async () => {
                await app.ui.openDataEntryRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await app.ui.waitLoading();
            });
            await app.step(`Enter letters in decimal field`, async () => {
                const expectedValue = await app.ui.dataEntryBoard.getField('Current Late Fee', 'numeric').getValue();
                await app.ui.dataEntryBoard.getField('Current Late Fee', 'numeric').fill(app.services.random.letters(5));

                await t
                    .expect(await app.ui.dataEntryBoard.getField('Current Late Fee', 'numeric').verifyValue(expectedValue)).ok();
            });
            await app.step(`Enter negative number in decimal field`, async () => {
                const integer = app.services.random.num(100, 999);
                const value = '-' + integer.toString();
                const expectedValue = '-' + app.services.num.toLocaleString(integer, data.culture, { useGrouping: true, minimumFractionDigits: 2 });
                await app.ui.dataEntryBoard.getField('Current Late Fee', 'numeric').fill(value);
                await app.ui.pressKey('tab');

                await t
                    .expect(await app.ui.dataEntryBoard.getField('Current Late Fee', 'numeric').verifyValue(expectedValue)).ok();
            });
            await app.step(`Enter integer in decimal field`, async () => {
                const value = app.services.random.num(1000, 90000);
                const expectedValue = app.services.num.toLocaleString(value, data.culture, { useGrouping: true, minimumFractionDigits: 2 });
                await app.ui.dataEntryBoard.getField('Current Late Fee', 'numeric').fill(value.toString());
                await app.ui.pressKey('tab');

                await t
                    .expect(await app.ui.dataEntryBoard.getField('Current Late Fee', 'numeric').verifyValue(expectedValue)).ok();
            });
            await app.step(`Enter decimal value in decimal field`, async () => {
                const decimal = app.services.random.decimal(3, 3);
                const value = app.services.num.toLocaleString(decimal, data.culture, {});
                const expectedValue = app.services.num.toLocaleString(app.services.num.truncate(decimal, 2), data.culture, { useGrouping: true, maximumFractionDigits: 2 });
                await app.ui.dataEntryBoard.getField('Current Late Fee', 'numeric').fill(value);
                await app.ui.pressKey('tab');

                await t
                    .expect(await app.ui.dataEntryBoard.getField('Current Late Fee', 'numeric').verifyValue(expectedValue)).ok();
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset corrent user role`, async () => {
                app.ui.resetRole();
            });
        });

    test
        // .only
        .meta('brief', 'true')
        (`Verify Decimal Data Type with culture = '${data.culture}' on child tab`, async (t: TestController) => {
            await app.step(`Set Default Culture to '${data.culture}' (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([{ property: 'DefaultCulture.Value', value: data.culture }]);
            });
            await app.step('Login', async () => {
                await app.ui.getRole();
                await app.ui.waitLoading();
            });
            await app.step(`Open created DEF record`, async () => {
                await app.ui.openDataEntryRecord(app.memory.current.createRecordData.respData.Record.MasterId,
                    app.memory.current.createRecordData.reqData.dataEntryFormTemplateResourceId);
                await app.ui.waitLoading();
            });
            await app.step(`Open Expenses child and add record`, async () => {
                await app.ui.dataEntryBoard.selectChildRecord('Expenses');
                await app.ui.waitLoading();
                await app.ui.dataEntryBoard.childRecord.addNew();
            });
            await app.step(`Type letters in Percentage field`, async () => {
                const letters = app.services.random.letters(5);
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                const valueBefore = await row.getField('Percentage', 'numeric').getValue();
                await row.getField('Percentage', 'numeric').fill(letters);

                await t
                    .expect(await row.getField('Percentage', 'numeric').getValue()).eql(valueBefore);
            });
            await app.step(`Enter integer value in the Percentage field`, async () => {
                const integer = app.services.random.num(1000, 90000);
                const value = integer.toString();
                const expectedValue = app.services.num.toLocaleString(integer, data.culture, { useGrouping: true, minimumFractionDigits: 2 });
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField('Percentage', 'numeric').fill(value);
                await app.ui.pressKey('tab');

                await t
                    .expect(await row.getValue('Percentage', { readOnlyMode: true })).eql(expectedValue);
            });
            await app.step(`Enter decimal value in the Percantage field`, async () => {
                const decimal = app.services.random.decimal(3, 3);
                const value = app.services.num.toLocaleString(decimal, data.culture, {});
                const expectedValue = app.services.num.toLocaleString(app.services.num.truncate(decimal, 2), data.culture, { useGrouping: true, minimumFractionDigits: 2 });
                const row = await app.ui.dataEntryBoard.childRecord.grid.getRecord(0);
                await row.getField('Percentage', 'numeric').fill(value);
                await app.ui.pressKey('tab');
                const actualValue = await row.getValue('Percentage', { readOnlyMode: true });

                await t
                    .expect(actualValue).eql(expectedValue);
            });
        })
        .after(async () => {
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
            await app.step(`Reset corrent user role`, async () => {
                app.ui.resetRole();
            });
        });
});
