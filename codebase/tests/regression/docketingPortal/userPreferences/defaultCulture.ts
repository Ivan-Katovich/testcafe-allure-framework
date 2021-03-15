import app from '../../../../app';
declare const globalConfig: any;

fixture `REGRESSION.userPreferences.pack. - Test ID 29964: User Preferences - Hosted - Default Culture`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    });

const data = {
    sysConfig: {
        culture: 'de-DE',
        dateFormat: 'dd.MM.yyyy'
    },
    userPref: {
        culture: 'en-US',
        defaultFormat: 'MM/dd/yyyy',
        dateFormat: 'd, MMMM, yyyy'
    },
    cultures: [
        {
            name: 'de-DE',
            defaultDateFormat: 'dd.MM.yyyy',
            dateFormat: 'yyyy-MM-dd',
            availableDateFormats: [
                'dd.MM.yyyy',
                'dd.MM.yy',
                'yyyy-MM-dd',
                'dd. MMM. yyyy',
                'd. MMMM yyyy',
                'd. MMM. yyyy'
            ],
            currency: '€ (Euro)'
        },
        {
            name: 'en-GB',
            defaultDateFormat: 'dd/MM/yyyy',
            dateFormat: 'yyyy-MM-dd',
            availableDateFormats: [
                'dd/MM/yyyy',
                'dd/MM/yy',
                'd/M/yy',
                'd.M.yy',
                'yyyy-MM-dd',
                'dd MMMM yyyy',
                'd MMMM yyyy'
            ],
            currency: '£ (United Kingdom, Pound)'
        },
        {
            name: 'en-US',
            defaultDateFormat: 'MM/dd/yyyy',
            dateFormat: 'MMMM d, yyyy',
            availableDateFormats: [
                'M/d/yyyy',
                'M/d/yy',
                'MM/dd/yy',
                'MM/dd/yyyy',
                'yy/MM/dd',
                'yyyy-MM-dd',
                'dd-MMM-yy',
                'MMMM d, yyyy',
                'd, MMMM, yyyy'
            ],
            currency: '$ (United States, Dollar)'
        },
        {
            name: 'ja-JP',
            defaultDateFormat: 'yyyy/MM/dd',
            dateFormat: 'yyyy年MM月dd日',
            availableDateFormats: [
                'yyyy/MM/dd',
                'yy/MM/dd',
                'yy/M/d',
                'yyyy/M/d',
                'yyyy-MM-dd',
                'yyyy年M月d日',
                'yyyy年MM月dd日'
            ],
            currency: '¥ (Japan, Yen)'
        },
        {
            name: 'sv-SE',
            defaultDateFormat: 'yyyy-MM-dd',
            dateFormat: 'yy-MM-dd',
            availableDateFormats: [
                'yyyy-MM-dd',
                'yy-MM-dd'
            ],
            currency: 'kr (Sweden, Krona)'
        },
        {
            name: 'zh-CN',
            defaultDateFormat: 'yyyy/MM/dd',
            dateFormat: 'yyyy.MM.dd',
            availableDateFormats: [
                'yyyy/M/d',
                'yyyy-M-d',
                'yyyy.M.d',
                'yyyy/MM/dd',
                'yyyy-MM-dd',
                'yyyy.MM.dd',
                'yy/M/d',
                'yy-M-d',
                'yy.M.d',
                'yy/MM/dd',
                'yyyy年M月d日'
            ],
            currency: '¥ (China, Yuan Renminbi)'
        }
    ],
    currencies: [
        {
            wholeValue: '$ (Australia, Dollars)',
            description: 'Australia, Dollars'
        },
        {
            wholeValue: '$ (Canada, Dollar)',
            description: 'Canada, Dollar'
        },
        {
            wholeValue: '¥ (China, Yuan Renminbi)',
            description: 'China, Yuan Renminbi'
        },
        {
            wholeValue: 'kr (Denmark, Krone)',
            description: 'Denmark, Krone'
        },
        {
            wholeValue: '€ (Euro)',
            description: 'Euro'
        },
        {
            wholeValue: 'HK$ (Hong Kong Dollars)',
            description: 'Hong Kong Dollars'
        },
        {
            wholeValue: '₹ (India, Rupees)',
            description: 'India, Rupees'
        },
        {
            wholeValue: '¥ (Japan, Yen)',
            description: 'Japan, Yen'
        },
        {
            wholeValue: 'MWK (Malawi, Kwacha)',
            description: 'Malawi, Kwacha'
        },
        {
            wholeValue: 'R (Malaysia, Ringgit)',
            description: 'Malaysia, Ringgit'
        },
        {
            wholeValue: 'Lm (Malta, Lira)',
            description: 'Malta, Lira'
        },
        {
            wholeValue: '$ (Mexican Peso)',
            description: 'Mexican Peso'
        },
        {
            wholeValue: '$ (New Zealand, Dollar)',
            description: 'New Zealand, Dollar'
        },
        {
            wholeValue: 'kr (Norway, Krone)',
            description: 'Norway, Krone'
        },
        {
            wholeValue: 'zl (Polish zlotys)',
            description: 'Polish zlotys'
        },
        {
            wholeValue: '$ (Singapore, Dollar)',
            description: 'Singapore, Dollar'
        },
        {
            wholeValue: 'R (South Africa, Rand)',
            description: 'South Africa, Rand'
        },
        {
            wholeValue: 'KRW (South Korea)',
            description: 'South Korea'
        },
        {
            wholeValue: 'kr (Sweden, Krona)',
            description: 'Sweden, Krona'
        },
        {
            wholeValue: 'SFr. (Switzerland, Franc)',
            description: 'Switzerland, Franc'
        },
        {
            wholeValue: 'NT$ (Taiwan, Dollar)',
            description: 'Taiwan, Dollar'
        },
        {
            wholeValue: '£ (United Kingdom, Pound)',
            description: 'United Kingdom, Pound'
        },
        {
            wholeValue: '$ (United States, Dollar)',
            description: 'United States, Dollar'
        }
    ],
    countryDisplayOptions: [
        {
            name: 'Codes',
            displayProperty1: 'CountryCode',
            displayProperty2: 'CountryName'
        },
        {
            name: 'Description',
            displayProperty1: 'CountryName',
            displayProperty2: 'Wipo'
        },
        {
            name: 'WIPO Codes',
            displayProperty1: 'Wipo',
            displayProperty2: 'CountryName'
        }
    ]
};

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Delete Default Culture value in User Parameters table (Database)', async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'DefaultCulture'`, { closeConnection: false });
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'IPDP_DATE_FORMAT'`, { closeConnection: true });
        });
        await app.step(`Clear cache (API)`, async () => {
            await app.api.clearCache();
        });
    })
    (`Verify Culture and Date Format in User Preferences (Step 1-6)`, async (t: TestController) => {
        await app.step('Login and go to User Preferences (Step 2)', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getText('title')).eql('User Preferences')
                .expect(await app.ui.userPreferencesBoard.isVisible('sectionLinks', 'Default Culture')).ok()
                .expect(await app.ui.userPreferencesBoard.getAttribute('sectionLinks', 'href', 'Default Culture')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('preferencesButtons', 'Save')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('preferencesButtons', 'Reset')).ok();
        });
        await app.step('Click the Default Culture link (Step 3)', async () => {
            await app.ui.userPreferencesBoard.click('sectionLinks', 'Default Culture');

            await t
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Culture')).ok()
                .expect(await app.ui.userPreferencesBoard.isInView('fields', 'Culture')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Date Format')).ok()
                .expect(await app.ui.userPreferencesBoard.isInView('fields', 'Date Format')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Display Currency')).ok()
                .expect(await app.ui.userPreferencesBoard.isInView('fields', 'Display Currency')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Use Base Currency')).ok()
                .expect(await app.ui.userPreferencesBoard.isInView('fields', 'Use Base Currency')).ok()
                .expect(await app.ui.userPreferencesBoard.isVisible('fields', 'Default Country')).ok()
                .expect(await app.ui.userPreferencesBoard.isInView('fields', 'Default Country')).ok();
        });
        await app.step('Verify the Culture field (Step 4)', async () => {
            const defaultUserPref = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            const expectedCultureValue = defaultUserPref.getDefaultCulture();
            const cultureValue = await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue();
            await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').expand();
            const dropdownValues = await app.ui.kendoPopup.getAllItemsText();

            const expectedDropdownValues = data.cultures.map((x) => x.name);

            await t
                .expect(cultureValue).eql(expectedCultureValue)
                .expect(dropdownValues).eql(expectedDropdownValues);
        });
        for (const culture of data.cultures) {
            await app.step(`Verify Date Format for the '${culture.name}' culture (Step 5-6)`, async () => {
                await app.ui.pressKey('esc');
                await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill(culture.name);
                const actualDefaultDataFormat = await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue();
                await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').expand();

                const userConfig = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                const defaultDateFormat = await userConfig.getDefaultDateFormatForCulture(culture.name);

                await t
                    .expect(actualDefaultDataFormat).eql(defaultDateFormat)
                    .expect(await app.ui.kendoPopup.getAllItemsText()).eql(culture.availableDateFormats);
            });
        }
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Locked Culture and Date Format in User Prefereces (Step 7-8)`, async (t: TestController) => {
        await app.step('Set Culture and Date Format in User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([
                { property: 'DefaultCulture.Value', value: data.userPref.culture },
                { property: 'DateFormat.Value', value: data.userPref.dateFormat }
            ]);
        });
        await app.step('Login and go to User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        for (const culture of data.cultures) {
            await app.step(`Set Culture to ${culture.name} and Date Format to ${culture.dateFormat} in Default System Configuration (API)`, async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                await defaultUserPreferences.setDefaultCulture(culture.name);
                await defaultUserPreferences.setDefaultDateFormat(culture.dateFormat);
                await defaultUserPreferences.save();
            });
            await app.step('Lock Culture and Date Format in Default System Configuration (API)', async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                defaultUserPreferences.setCultureLocked(true);
                defaultUserPreferences.setDateFormatLocked(true);
                await defaultUserPreferences.save();
            });
            await app.step('Refresh User Preferences and verify Culture and Date Format', async () => {
                await app.ui.refresh();

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(culture.name)
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').isEnabled('dropdownList')).notOk()
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(culture.dateFormat)
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').isEnabled('dropdownList')).notOk();
            });
            await app.step('Unlock Culture and Date Format in Default System Configuration (API)', async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                defaultUserPreferences.setCultureLocked(false);
                defaultUserPreferences.setDateFormatLocked(false);
                await defaultUserPreferences.save();
            });
            await app.step('Refresh page and verify Culture and Date Format', async () => {
                await app.ui.refresh();

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(data.userPref.culture)
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').isEnabled('dropdownList')).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(data.userPref.dateFormat)
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').isEnabled('dropdownList')).ok();
            });
        }
    })
    .after(async () => {
        await app.step('Unlock Culture and Date Format in Default System Configuration (API)', async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setCultureLocked(false);
            defaultUserPreferences.setDateFormatLocked(false);
            await defaultUserPreferences.save();
        });
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify locked Culture in User Preferences (Step 9)`, async (t: TestController) => {
        await app.step('Set Culture and Date Format in User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences([
                { property: 'DefaultCulture.Value', value: data.userPref.culture },
                { property: 'DateFormat.Value', value: data.userPref.dateFormat }
            ]);
        });
        await app.step('Login and go to User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        for (let culture of data.cultures.filter((x) => x.name !== data.userPref.culture)) {
            await app.step(`Set Culture to '${culture.name}' in Default System Configuration (API)`, async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                defaultUserPreferences.setCultureLocked(false);
                await defaultUserPreferences.setDefaultCulture(culture.name);
                await defaultUserPreferences.setDefaultDateFormat(culture.defaultDateFormat);
                await defaultUserPreferences.save();
            });
            await app.step('Lock Culture in Default System Configuration (API)', async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                defaultUserPreferences.setCultureLocked(true);
                await defaultUserPreferences.save();
            });
            await app.step('Refresh User Preferences and verify Culture and Date Format', async () => {
                await app.ui.refresh();

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(culture.name)
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').isEnabled('dropdownList')).notOk()
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(culture.defaultDateFormat)
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').isEnabled('dropdownList')).ok();
            });
            await app.step('Unlock Culture in Default System Configuration (API)', async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                defaultUserPreferences.setCultureLocked(false);
                await defaultUserPreferences.save();
            });
            await app.step('Refresh page and verify Culture and Date Format', async () => {
                await app.ui.refresh();

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(data.userPref.culture)
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').isEnabled('dropdownList')).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(data.userPref.dateFormat)
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').isEnabled('dropdownList')).ok();
            });
        }
        await app.step(`Set Culture in Default System Configuration to saved value from User Preferences (API)`, async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setCultureLocked(false);
            await defaultUserPreferences.setDefaultCulture(data.userPref.culture);
            await defaultUserPreferences.setDefaultDateFormat(data.userPref.defaultFormat);
            await defaultUserPreferences.save();
        });
        await app.step('Lock Culture in Default System Configuration (API)', async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setCultureLocked(true);
            await defaultUserPreferences.save();
        });
        await app.step(`Refresh User Preferences and verify Culture and Date Format`, async () => {
            await app.ui.refresh();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(data.userPref.culture)
                .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(data.userPref.dateFormat);
        });
    })
    .after(async () => {
        await app.step('Unlock Culture in Default System Configuration (API)', async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setCultureLocked(false);
            await defaultUserPreferences.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify locked Date Format in User Preferences (Step 10)`, async (t: TestController) => {
        await app.step('Login and go to User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        for (const culture of data.cultures) {
            await app.step(`Set Culture to '${culture.name}' and Date Format to '${culture.dateFormat}' in User Preferences (API)`, async () => {
                await app.api.userPreferences.resetUserPreferences([
                    { property: 'DefaultCulture.Value', value: culture.name },
                    { property: 'DateFormat.Value', value: culture.dateFormat }
                ]);
            });
            await app.step(`Set Default Culture to '${culture.name}' and Default Date Format to '${culture.defaultDateFormat}' in Default System Configuration (API)`, async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                await defaultUserPreferences.setDefaultCulture(culture.name);
                await defaultUserPreferences.setDefaultDateFormat(culture.defaultDateFormat);
                await defaultUserPreferences.save();
            });
            await app.step(`Lock Date Format in Default System Configuration (API)`, async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                defaultUserPreferences.setDateFormatLocked(true);
                await defaultUserPreferences.save();
            });
            await app.step(`Refresh User Preferences and verify Culture and Date Format`, async () => {
                await app.ui.refresh();

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').isEnabled('dropdownList')).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(culture.name)
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').isEnabled('dropdownList')).notOk()
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(culture.defaultDateFormat);
            });
            await app.step(`Unlock Date Format in Default System Configuration (API)`, async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                defaultUserPreferences.setDateFormatLocked(false);
                await defaultUserPreferences.save();
            });
            await app.step(`Refresh User Preferences and verify Culture and Date Format`, async () => {
                await app.ui.refresh();

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').isEnabled('dropdownList')).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').getValue()).eql(culture.name)
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').isEnabled('dropdownList')).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(culture.dateFormat);
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
    (`Verify default Date Format in User Preferences (Step 11)`, async (t: TestController) => {
        await app.step('Set default Date Format for all cultures in Default System Configuration (API)', async () => {
            for (const culture of data.cultures) {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                await defaultUserPreferences.setDefaultCulture(culture.name);
                await defaultUserPreferences.setDefaultDateFormat(culture.dateFormat);
                await defaultUserPreferences.save();
            }
        });
        await app.step('Login and go to User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        for (const culture of data.cultures) {
            await app.step(`Change Culture to '${culture.name}' and verify default Data Format`, async () => {
                await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill(culture.name);

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Date Format', 'dropdown').getValue()).eql(culture.dateFormat);
            });
        }
    })
    .after(async () => {
        await app.step('Return default values fot cultures in Default System Configuration (API)', async () => {
            for (const culture of data.cultures) {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                await defaultUserPreferences.setDefaultCulture(culture.name);
                await defaultUserPreferences.setDefaultDateFormat(culture.defaultDateFormat);
                await defaultUserPreferences.save();
            }
        });
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Delete Use Base Currency value in User Parameters table (Database)', async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'UseBaseCurrency'`);
        });
        await app.step(`Clear cache (API)`, async () => {
            await app.api.clearCache();
        });
    })
    (`Verify Display Currency in User Preferences (Step 12-13)`, async (t: TestController) => {
        await app.step('Login and go to User Preferences and verify Display Currency field', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').isVisible()).ok()
                .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').getText('inputLabel')).eql('Use Base Currency');
        });
        await app.step('Check Use Base Currency in Default System Configuration (API)', async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setUseBaseCurrency(true);
            await defaultUserPreferences.save();
        });
        await app.step('Refresh and verify Use Base Currency in User Preferences', async () => {
            await app.ui.refresh();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Use Base Currency', 'checkbox').isChecked()).ok();
        });
        await app.step('Uncheck Use Base Currency in Default System Configuration (API)', async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setUseBaseCurrency(false);
            await defaultUserPreferences.save();
        });
        await app.step('Refresh and verify Use Base Currency in User Preferences', async () => {
            await app.ui.refresh();

            await t
                .expect(await app.ui.userPreferencesBoard.getField('Use Base Currency', 'checkbox').isChecked()).notOk();
        });
    })
    .after(async () => {
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify default Currency for every Culture in User Preferences (Step 14-15)`, async (t: TestController) => {
        await app.step('Login and go to User Preferences and verify Display Currency field', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').uncheck();
        });
        for (const culture of data.cultures) {
            await app.step(`Change Culture to '${culture.name}' and verify Currency`, async () => {
                await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill(culture.name);

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').getText('textOnTheTop')).eql(culture.currency);
            });
        }
        await app.step('Uncheck and lock Use Base Currency in Default System Configuration (API)', async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setUseBaseCurrency(false);
            defaultUserPreferences.setUseBaseCurrencyLocked(true);
            await defaultUserPreferences.save();
        });
        await app.step('Refresh page', async () => {
            await app.ui.refresh(true);
        });
        for (const culture of data.cultures) {
            await app.step(`Change Culture to '${culture.name}' and verify Currency`, async () => {
                await app.ui.userPreferencesBoard.getField('Culture', 'dropdown').fill(culture.name);

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').isEnabled('input')).notOk()
                    .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').isChecked()).notOk()
                    .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').getText('textOnTheTop')).eql(culture.currency);
            });
        }
    })
    .after(async () => {
        await app.step('Unlock Use Base Currency in Default System Configuration (API)', async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setUseBaseCurrencyLocked(false);
            await defaultUserPreferences.save();
        });
    });

test
    // .only
    (`Verify Display Currency in User Preferences changes when Currency Type is changed in Default System Configuration (Step 16)`, async (t: TestController) => {
        await app.step('Unlock Use Base Currency in Default System Configuration (API)', async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setUseBaseCurrencyLocked(false);
            await defaultUserPreferences.save();
        });
        await app.step('Login and go to User Preferences and verify Display Currency field', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step('Check Use Base Currency and save', async () => {
            await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').check();
            if (await app.ui.userPreferencesBoard.isEnabled('preferencesButtons', 'Save')) {
                await app.ui.userPreferencesBoard.save();
                await app.ui.waitLoading();
            }
        });
        for (const currency of data.currencies) {
            await app.step(`Change Currency Type to '${currency.description}' in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(currency.description);
                await general.save();
            });
            await app.step('Refresh User Preferences and verify Currency value', async () => {
                await app.ui.refresh(true);

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').getText('textOnTheTop')).eql(currency.wholeValue);
            });
        }
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Delete Use Base Currency value in User Parameters table (Database)', async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM UserParameters WHERE USERNAME = '${globalConfig.user.userName}' AND CODE = 'UseBaseCurrency'`);
        });
        await app.step(`Clear cache (API)`, async () => {
            await app.api.clearCache();
        });
    })
    (`Verify locked Display Currency in User Preferences changes when Currency Type is changed in Default System Configuration (Step 17)`, async (t: TestController) => {
        await app.step('Login and go to User Preferences and verify Display Currency field', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        for (const currency of data.currencies) {
            await app.step(`Change Currency Type to ${currency.description} in Default System Configuration (API)`, async () => {
                const general = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                await general.setCurrencyType(currency.description);
                await general.save();
            });
            await app.step(`Check and lock User Base Currency in Default System Configuration (API)`, async () => {
                const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
                defaultUserPreferences.setUseBaseCurrency(true);
                defaultUserPreferences.setUseBaseCurrencyLocked(true);
                await defaultUserPreferences.save();
            });
            await app.step('Refresh page and verify Default Currency', async () => {
                await app.ui.refresh(true);

                await t
                    .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').isChecked()).ok()
                    .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').isEnabled('input')).notOk()
                    .expect(await app.ui.userPreferencesBoard.getField('Display Currency', 'checkbox').getText('textOnTheTop')).eql(currency.wholeValue);
            });
        }
    })
    .after(async () => {
        await app.step('Unlock Use Base Currency in Default System Configuration (API)', async () => {
            const defaultUserPreferences = await app.api.administration.defaultSystemConfiguration.openUserPreferencesSection();
            defaultUserPreferences.setUseBaseCurrencyLocked(false);
            await defaultUserPreferences.save();
        });
        await app.step('Reset User Preferences (API)', async () => {
            await app.api.userPreferences.resetUserPreferences();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Delete User Preference Default Countries in the User Parameters table (Database)`, async () => {
            await app.services.db.executeDatabaseQuery(`DELETE FROM userParameters WHERE USERNAME = '${globalConfig.user.userName}' and ParameterType = 'COUNTRY_DEFAULT'`);
        });
    })
    (`Verify Default Country field (Step 18)`, async (t: TestController) => {
        await app.step('Login and go to User Preferences and verify Display Country field', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const columns = await table.getColumnsNamesArray();

            await t
                .expect(await table.isVisible()).ok()
                .expect(columns.length).eql(2)
                .expect(columns.map((x) => x.text)).eql(['IP Type', 'Default Country' ]);
        });
        await app.step(`Verify IP Type column values`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const expectedIpTypes = [
                'GeneralIP1Masters',
                'GeneralIP2Masters',
                'GeneralIP3Masters',
                'GeneralIP4Masters',
                'GeneralIP5Masters',
                'GeneralIP6Masters',
                'GeneralIP7Masters',
                'GeneralIP8Masters',
                'GeneralIP9Masters',
                'PatentMasters',
                'TrademarkMasters'
            ];
            const actualIpTypes = await table.getColumnValues('IP Type');

            await t
                .expect(actualIpTypes).eql(expectedIpTypes);
        });
        await app.step(`Verify Defaul Country column values`, async () => {
            const generalApi = await app.api.administration.defaultSystemConfiguration.openGeneralSection();

            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const ipTypes = await table.getColumnValues('IP Type');
            for (let index = 0; index < ipTypes.legth; index++) {
                const ipType = ipTypes[index];
                const expectedCountry = await generalApi.getDefaultCountry(ipType, true);
                const actualCountry = await table.getField('Default Country', 'dropdown', index);

                await t
                    .expect(actualCountry).eql(expectedCountry);
            }
        });
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify Country / Region Display Options in Default Country (Step 19.1)`, async (t: TestController) => {
        let countryIds: any [];
        await app.step('Login and go to User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
        });
        await app.step(`Get Default Country ids`, async () => {
            const countriesDataApi = (await app.api.common.getCountries()).Data;
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const countriesUI = await table.getColumnValues('Default Country');
            countryIds = countriesUI.map((x) => countriesDataApi.find((y) => y.Name === x)).map((x) => x.Id);
        });
        for (const displayOption of data.countryDisplayOptions) {
            await app.step(`Change Country / Region Display to '${displayOption.name}' and save`, async () => {
                if (await app.ui.userPreferencesBoard.getField('Country / Region Display', 'radiobutton').getValue() !== displayOption.name) {
                    await app.ui.userPreferencesBoard.getField('Country / Region Display', 'radiobutton').check(displayOption.name);
                    await app.ui.userPreferencesBoard.save();
                    await app.ui.waitLoading();
                    await app.ui.refresh();
                }
            });
            await app.step(`Verify Country format in the Default Country table`, async () => {
                const countriesAdministrationDataApi = (await app.api.administration.getAllCountryRegion()).Items;
                const expectedValues = countryIds.map((x) => countriesAdministrationDataApi.find((y) => y.CountryId === x))
                    .map((x) => `${x[displayOption.displayProperty1]} - (${x[displayOption.displayProperty2]})`);

                const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
                const actualValues = await table.getColumnValues('Default Country');

                await t
                    .expect(expectedValues).eql(actualValues);
            });
        }
    });

test
    // .only
    .meta('brief', 'true')
    (`Verify search in Default Country dropdown (Step 19.2)`, async (t: TestController) => {
        let defaultCountry: string;
        let allCountries: string[];
        await app.step('Login and go to User Preferences', async () => {
            await app.ui.getRole(undefined, 'UI/user-preferences');
            await app.ui.waitLoading();
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            await (await table.getField('Default Country', 'dropdown', 0)).expand();
            allCountries = await app.ui.kendoPopup.getAllItemsText();
        });
        await app.step(`Clear default value in Default Country via [x]`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const field = await table.getField('Default Country', 'dropdown', 0);
            defaultCountry = await field.getValue();
            await field.click('clearButton');

            await t
                .expect(await field.getValue()).eql('');
        });
        await app.step(`Search by beginning symbols`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const field = await table.getField('Default Country', 'dropdown', 0);
            const beginning = defaultCountry.slice(0, 3);
            await field.type('input', beginning);
            await app.ui.kendoPopup.waitLoading();
            const foundItems = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundItems.every((x) => x.includes(beginning))).ok();
        });
        await app.step(`Search by ending symbols`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const field = await table.getField('Default Country', 'dropdown', 0);
            const ending = defaultCountry.slice(defaultCountry.length - 4, defaultCountry.length - 1);
            await field.type('input', ending);
            await app.ui.kendoPopup.waitLoading();
            const foundItems = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundItems.every((x) => x.includes(ending))).ok();
        });
        await app.step(`Search by upper case`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const field = await table.getField('Default Country', 'dropdown', 0);
            const upperCase = defaultCountry.toUpperCase();
            await field.type('input', upperCase);
            await app.ui.kendoPopup.waitLoading();
            const foundItems = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundItems.length).eql(1)
                .expect(foundItems[0].toUpperCase()).eql(upperCase);
        });
        await app.step(`Search by lower case`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const field = await table.getField('Default Country', 'dropdown', 0);
            const lowerCase = defaultCountry.toUpperCase();
            await field.type('input', lowerCase);
            await app.ui.kendoPopup.waitLoading();
            const foundItems = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundItems.length).eql(1)
                .expect(foundItems[0].toUpperCase()).eql(lowerCase);
        });
        await app.step(`Search by symbols in the middle of the name`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const field = await table.getField('Default Country', 'dropdown', 0);
            const middle = defaultCountry.slice(3, defaultCountry.length - 3);
            await field.type('input', middle);
            await app.ui.kendoPopup.waitLoading();
            const foundItems = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundItems.every((x) => x.includes(middle))).ok();
        });
        await app.step(`Search by special symbols`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const field = await table.getField('Default Country', 'dropdown', 0);
            const specialSymbol = '/';
            await field.type('input', specialSymbol);
            await app.ui.kendoPopup.waitLoading();
            const foundItems = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundItems.every((x) => x.includes(specialSymbol))).ok();
        });
        await app.step(`Search non existing value`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const field = await table.getField('Default Country', 'dropdown', 0);
            await field.type('input', 'non existing value');
            await app.ui.kendoPopup.waitLoading();

            await t
                .expect(await app.ui.kendoPopup.isVisible('noDataInfo')).ok()
                .expect(await app.ui.kendoPopup.getText('noDataInfo')).eql('0 items found');
        });
        await app.step(`Clear search criteria and verify list of countries`, async () => {
            const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
            const field = await table.getField('Default Country', 'dropdown', 0);
            await field.click('clearButton');
            const foundItems = await app.ui.kendoPopup.getAllItemsText();

            await t
                .expect(foundItems).eql(allCountries);
        });
    });

const dataSet = [
    {
        ipType: 'PatentMasters',
        country: 'AE - (United Arab Emirates)',
        template: 'Patent DEF',
        countryField: 'Country / Region'
    },
    {
        ipType: 'TrademarkMasters',
        country: 'FR - (France)',
        template: 'Trademark DEF',
        countryField: 'Country / Region'
    },
    {
        ipType: 'GeneralIP1Masters',
        country: 'CA - (Canada)',
        template: 'GeneralIP1 DEF',
        countryField: 'Jurisdiction'
    }
];

dataSet.forEach((data) => {
    test
        // .only
        .meta('brief', 'true')
        (`Verify Default Country value in DEF for ${data.ipType} (Step 20-21)`, async (t: TestController) => {
            await app.step('Login and go to User Preferences', async () => {
                await app.ui.getRole(undefined, 'UI/user-preferences');
                await app.ui.waitLoading();
            });
            await app.step(`Clear Default Country for ${data.ipType} and save`, async () => {
                const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
                const ipTypes = await table.getColumnValues('IP Type');
                const field = await table.getField('Default Country', 'dropdown', ipTypes.indexOf(data.ipType));
                await field.click('clearButton');
                await app.ui.userPreferencesBoard.save();
                await app.ui.waitLoading();
            });
            await app.step(`Go to New Data Entry Form for ${data.template} and verify '${data.countryField}'`, async () => {
                const generalAPI = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                const expectedValue = await generalAPI.getDefaultCountry(data.ipType, true);
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.template);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.countryField, 'dropdown').getValue()).eql(expectedValue);
            });
            await app.step('Go to User Preferences', async () => {
                await app.ui.header.click('userIcon');
                await app.ui.kendoPopup.selectNavigationItem('User Preferences');
                await app.ui.waitLoading();
            });
            await app.step(`Set Default Country for ${data.ipType} to '${data.country}' and save`, async () => {
                const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
                const ipTypes = await table.getColumnValues('IP Type');
                const field = await table.getField('Default Country', 'autocomplete', ipTypes.indexOf(data.ipType));

                await field.fill(data.country);
                await app.ui.userPreferencesBoard.save();
                await app.ui.waitLoading();
            });
            await app.step(`Unassign '${data.country}' from ${data.ipType} (API)`, async () => {
                await app.api.administration.countryRegionManagement.openCountry(data.country);
                await app.api.administration.countryRegionManagement.removeIPType(data.ipType);
                await app.api.administration.countryRegionManagement.save();
            });
            await app.step(`Refresh User Preferences page`, async () => {
                await app.ui.refresh();
                await app.ui.waitLoading();

                const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
                const ipTypes = await table.getColumnValues('IP Type');
                const field = await table.getField('Default Country', 'autocomplete', ipTypes.indexOf(data.ipType));
                const countryValue = await field.getValue();
                await field.expand();
                const dropdownValues = await app.ui.kendoPopup.getAllItemsText();

                await t
                    .expect(countryValue).eql('')
                    .expect(dropdownValues.includes(data.country)).notOk();
            });
            await app.step(`Search for the '${data.country}'`, async () => {
                const table = app.ui.userPreferencesBoard.getField('Default Country', 'tableGrid');
                const ipTypes = await table.getColumnValues('IP Type');
                const field = await table.getField('Default Country', 'dropdown', ipTypes.indexOf(data.ipType));

                await field.type('input', data.country);

                await t
                    .expect(await app.ui.kendoPopup.isVisible('noDataInfo')).ok();
            });
            await app.step(`Go to New Data Entry Form for ${data.template} and verify '${data.countryField}'`, async () => {
                await app.ui.closeNativeDialog();
                const generalAPI = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                const expectedValue = await generalAPI.getDefaultCountry(data.ipType, true);
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.template);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.countryField, 'dropdown').getValue()).eql(expectedValue);
            });
            await app.step(`Unassign Default Country for ${data.ipType} (API)`, async () => {
                const generalAPI = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                const defaultCountry = await generalAPI.getDefaultCountry(data.ipType, true);
                await app.api.administration.countryRegionManagement.openCountry(defaultCountry);
                await app.api.administration.countryRegionManagement.removeIPType(data.ipType);
                await app.api.administration.countryRegionManagement.save();
            });
            await app.step(`Go to New Data Entry Form for ${data.template} and verify '${data.countryField}'`, async () => {
                await app.ui.closeNativeDialog();
                await app.ui.naviBar.click('links', 'Data Entry');
                await app.ui.kendoPopup.selectItem(data.template);
                await app.ui.waitLoading();

                await t
                    .expect(await app.ui.dataEntryBoard.getField(data.countryField, 'dropdown').getValue()).eql('');
            });
        })
        .after(async () => {
            await app.step(`Assign '${data.country}' to ${data.ipType} (API)`, async () => {
                await app.api.administration.countryRegionManagement.openCountry(data.country);
                await app.api.administration.countryRegionManagement.addIPType(data.ipType);
                await app.api.administration.countryRegionManagement.save();
            });
            await app.step(`Assign Default Country for ${data.ipType} (API)`, async () => {
                const generalAPI = await app.api.administration.defaultSystemConfiguration.openGeneralSection();
                const defaultCountry = await generalAPI.getDefaultCountry(data.ipType, true);
                await app.api.administration.countryRegionManagement.openCountry(defaultCountry);
                await app.api.administration.countryRegionManagement.addIPType(data.ipType);
                await app.api.administration.countryRegionManagement.save();
            });
            await app.step('Reset User Preferences (API)', async () => {
                await app.api.userPreferences.resetUserPreferences();
            });
        });
    });
