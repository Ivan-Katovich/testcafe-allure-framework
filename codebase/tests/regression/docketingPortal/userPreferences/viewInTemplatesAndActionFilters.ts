import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.userPreferences.pack. - Test ID 29966: User Preferences - Hosted - Record Management - View In Templates and Actions filter`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Record Management section`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences (Step 2)`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionTitles', 'Record Management')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionLinks', 'Record Management')).ok();
        });
        await app.step(`Click Record Management link (Step 3)`, async () => {
            await app.ui.userPreferencesBoard.click('sectionLinks', 'Record Management');
            await app.services.time.wait(async () => await app.ui.userPreferencesBoard.isInView('sectionTitles', 'Record Management'), { timeout: 1000 });

            await t
                .expect(await app.ui.userPreferencesBoard.isInView('sectionTitles', 'Record Management')).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Default Country', 'tablegrid').isInView()).notOk();
        });
        await app.step(`Verify fields in section`, async () => {
            await t
                .expect(await app.ui.userPreferencesBoard.getField('Record Management Form', 'tablegrid').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Actions Completed Date Filter', 'toggle').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Default Query', 'dropdown').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Auto-Execute Queries', 'toggle').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Favorite Queries').isVisible()).ok();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Delete Record Management Forms in UserDefaultDataForms for current user (Database)`, async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserDefaultDataForms WHERE UserName = '${globalConfig.user.userName}'`);
            await app.api.clearCache();
        });
    })
    (`Verify Record Management Form (Step 4)`, async (t: TestController) => {
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            const table = await app.ui.userPreferencesBoard.getField('Record Management Form', 'tablegrid');
            const actualColumns = (await table.getColumnsNamesArray()).map((x) => x.text);
            const expectedColumns = [
                'IP Type',
                'View in Template'
            ];

            await t
                .expect(actualColumns).eql(expectedColumns);
        });
        await app.step(`Verify default values`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Record Management Form', 'tablegrid');
            const ipTypes = await table.getColumnValues('IP Type');
            for (let index = 0; index < await table.getRecordCount(); index++) {
                const ipType = ipTypes[index];
                const field = await table.getField('View in Template', 'dropdown', index);
                const actualValue = await field.getValue();
                await field.expand();
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();
                await app.ui.pressKey('tab');

                await t
                    .expect(actualValue).eql(dropdownList[0], `The default value for '${ipType}' is not correct.`);
            }
        });
        await app.step(`Set blank value and save`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Record Management Form', 'tablegrid');
            const field = await table.getField('View in Template', 'dropdown', 0);
            await field.expand();
            const dropdownList = await app.ui.kendoPopup.getAllItemsText();
            await field.clear();
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();

            await t
                .expect(await field.getValue()).eql(dropdownList[0]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify search in Record Management Forms (Step 6)`, async (t: TestController) => {
        let ipTypes: string[];
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            const table = await app.ui.userPreferencesBoard.getField('Record Management Form', 'tablegrid');
            ipTypes = await table.getColumnValues('IP Type');
        });
        for (let index = 0; index < ipTypes.length; index++) {
            const ipType = ipTypes[index];
            const table = await app.ui.userPreferencesBoard.getField('Record Management Form', 'tablegrid');
            const field = await table.getField('View in Template', 'dropdown', index);
            await field.expand();
            await app.ui.kendoPopup.waitLoading();
            const possibleValues = await app.ui.kendoPopup.getAllItemsText();
            await app.ui.pressKey('tab');
            await app.step(`Clear default value via [x] icon (${ipType})`, async () => {
                await field.click('clearButton');

                await t
                    .expect(await field.getValue()).eql('', `The field is not cleared for '${ipType}'`);
            });
            await app.step(`Search by beginning symbols (${ipType})`, async () => {
                const value = app.services.sorting.sortByLength(possibleValues, app.services.sorting.sortDirection.desc)[0];
                const beginning = value.slice(0, value.length / 2);
                await field.type('input', beginning);
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(dropdownList).contains(value, `The value is not found for '${ipType}'`);
            });
            await app.step(`Search by ending symbols (${ipType})`, async () => {
                const value = app.services.sorting.sortByLength(possibleValues, app.services.sorting.sortDirection.desc)[0];
                const ending = value.slice(value.length / 2, value.length);
                await field.type('input', ending);
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(dropdownList).contains(value, `The value is not found for '${ipType}'`);
            });
            await app.step(`Search by term in upper case (${ipType})`, async () => {
                const value: string = possibleValues.find((x) => app.services.regex.containsLetters(x));
                const upperCase = value.toUpperCase();
                await field.type('input', upperCase);
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(dropdownList).contains(value, `The value is not found for '${ipType}'`);
            });
            await app.step(`Search by term in lower case (${ipType})`, async () => {
                const value: string = possibleValues.find((x) => app.services.regex.containsLetters(x));
                const lowerCase = value.toLowerCase();
                await field.type('input', lowerCase);
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(dropdownList).contains(value, `The value is not found for '${ipType}'`);
            });
            await app.step(`Search by the symbols from the middle of the name (${ipType})`, async () => {
                const value = app.services.sorting.sortByLength(possibleValues, app.services.sorting.sortDirection.desc)[0];
                const middle = value.slice(value.length * 0.25, value.length * 0.75);
                await field.type('input', middle);
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(dropdownList).contains(value, `The value is not found for '${ipType}'`);
            });
            await app.step(`Search by numbers (${ipType})`, async () => {
                const value = possibleValues.find((x) => app.services.regex.containsNumbers(x));
                const numbers = app.services.regex.getFirstNumber(value);
                await field.type('input', numbers);
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(dropdownList).contains(value, `The value is not found for '${ipType}'`);
            });
            await app.step(`Search by special symbols (${ipType})`, async () => {
                const specialSymbols = `TA ~\`!@#$%^&*()_+=-}{[]|":;'\\?<,.’/№`;
                await field.type('input', specialSymbols);
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(dropdownList.some((x) => x.includes(specialSymbols))).ok(`The value is not found for '${ipType}'`);
            });
            await app.step(`Type non-existing value (${ipType})`, async () => {
                await field.type('input', app.services.random.str(20));
                await app.ui.kendoPopup.waitLoading();
                const dropdownList = await app.ui.kendoPopup.getAllItemsText();
                await t
                    .expect(dropdownList.length).eql(0, `No value should be found for '${ipType}'`)
                    .expect(await app.ui.kendoPopup.isVisible('noDataInfo')).ok();

                await app.ui.pressKey('tab');
            });
        }
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify content group permissions for Record Management Form (Step 7-9)`, async (t: TestController) => {
        let allPatentValues: string[];
        let selectedValue: string;
        await app.step(`Login and go to User Preferences`, async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Set Record Management Form for Patent`, async () => {
            const table = await app.ui.userPreferencesBoard.getField('Record Management Form', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf('PatentMasters');
            const field = await table.getField('View in Template', 'dropdown', index);
            await field.expand();
            allPatentValues = await app.ui.kendoPopup.getAllItemsText();
            selectedValue = allPatentValues[allPatentValues.length - 1];
            await field.fill(selectedValue);
            await app.ui.userPreferencesBoard.save();
            await app.ui.waitLoading();
        });
        await app.step(`Verify View In on Patents query`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI/queries`);
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.getText('viewInDropdown')).eql(selectedValue);
        });
        await app.step(`Remove permissions for the '${selectedValue}' template in Content Group (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(globalConfig.user.contentGroup);
            cg.setPermission('Record Management Form>' + selectedValue, false);
            await cg.save();
        });
        await app.step(`Verify View in Template on User Preferences`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI/user-preferences`);
            await app.ui.waitLoading();
            const table = await app.ui.userPreferencesBoard.getField('Record Management Form', 'tablegrid');
            const index = (await table.getColumnValues('IP Type')).indexOf('PatentMasters');
            const field = await table.getField('View in Template', 'dropdown', index);

            await t
                .expect(await field.getValue()).eql(allPatentValues[0]);
        });
        await app.step(`Verify View In on Patents query`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI/queries`);
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.getText('viewInDropdown')).eql(allPatentValues[0]);
        });
        await app.step(`Remove permissions to all templates for Patents in Content Group (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(globalConfig.user.contentGroup);
            for (const value of allPatentValues) {
                cg.setPermission('Record Management Form>' + value, false);
            }
            await cg.save();
        });
        await app.step(`Verify View in Template on User Preferences`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI/user-preferences`);
            await app.ui.waitLoading();
            const table = await app.ui.userPreferencesBoard.getField('Record Management Form', 'tablegrid');
            const ipTypes = await table.getColumnValues('IP Type');

            await t
                .expect(ipTypes).notContains('PatentMasters');
        });
        await app.step(`Verify View In on Patents query`, async () => {
            await app.ui.navigate(`${globalConfig.env.url}/UI/queries`);
            await app.ui.waitLoading();
            await app.ui.queryBoard.kendoTreeview.open('Patent>PA All Cases');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.queryBoard.isPresent('menuItems', 'View in:')).notOk()
                .expect(await app.ui.queryBoard.queryResultsGrid.isFirstColumnHyperlink()).notOk();
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
        await app.step(`Set content group to default values (API)`, async () => {
            const cg = app.api.administration.contentGroup;
            await cg.openContentGroup(globalConfig.user.contentGroup);
            cg.setPermissionDefaults();
            await cg.save();
        });
    });

// Test `Verify Actions Completed Date Filter (Step 10)` is moved to fixture actionsDefaultFiltering.ts (Test ID 30713: User Preferences - apply Actions Default Filtering)
