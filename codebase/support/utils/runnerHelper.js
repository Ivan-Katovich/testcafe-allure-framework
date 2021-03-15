const allureCmd = require('allure-commandline');
const fs = require('fs');
const del = require('del');
const moment = require('moment');
const { exec } = require('child_process');

const allureGenerate = async () => {
    const env = `
<environment>
    <parameter>
        <key>Browser</key>
        <value>${globalConfig.browser}</value>
    </parameter>
    <parameter>
        <key>Environment</key>
        <value>${globalConfig.env.name ? globalConfig.env.name : globalConfig.env}</value>
    </parameter>
    <parameter>
        <key>Client</key>
        <value>${globalConfig.env.client ? globalConfig.env.client : globalConfig.env}</value>
    </parameter>
    <parameter>
        <key>User</key>
        <value>${globalConfig.user.userName ? globalConfig.user.userName : globalConfig.user}</value>
    </parameter>
    <parameter>
        <key>Suite</key>
        <value>${globalConfig.suite}</value>
    </parameter>
</environment>
`;
    const defectCategories = [
        {
            'name': 'Ignored tests',
            'matchedStatuses': ['skipped']
        },
        {
            'name': 'Assertion issues',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': '.*AssertionError.*'
        },
        {
            'name': 'Selector issues',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': '.*selector does not match any (node|element) in the DOM tree.*'
        },
        {
            'name': 'Loading timeout',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': '.*is still appeared after timeout.*'
        },
        {
            'name': 'System error',
            'matchedStatuses': ['broken', 'failed'],
            'messageRegex': '.*A System Error thrown.*'
        },
        {
            'name': 'Business Object element issues',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': '.*Action "selector" argument error.*'
        },
        {
            'name': 'Object API issues',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': '.*is not a function.*'
        },
        {
            'name': 'Product defects',
            'matchedStatuses': ['failed']
        },
        {
            'name': 'Test defects',
            'matchedStatuses': ['broken']
        },
        /* Specific defects*/
        {
            'name': '[IPDP-11502] Authorization - Unexpected message',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': '.*have permission to view this content.*'
        },
        {
            'name': '[IPDP-8993] System error when date field with timestamp with "Less than or equal to" operator and date function',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*Operator: 'Less Than Or Equal To', Value with function:.*`
        },
        {
            'name': '[IPDP-12010] Related Records modal - Criteria Builder works in unexpected way',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*Incomplete filter criteria shows incorrect results in Related Records query.*`
        },
        {
            'name': '[IPDP-9568] Criteria Builder - Issues with Tab focus on Date function flyout ',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*The query wasn't executed after clicking Ctrl + Enter with function in Value.*`
        },
        {
            'name': '[IPDP-13515] "Starts with" and "Ends with" operators are not in Camel Case in Filters ',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*Operator(s) [Starts With,Ends With] are missing or displayed incorrectly.*`
        },
        {
            'name': '[IPDP-13515] "Starts with" and "Ends with" operators are not in Camel Case in Filters ',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*The operator dropdown doesn\'t include Starts With.*`
        },
        {
            'name': '[IPDP-13515] "Starts with" and "Ends with" operators are not in Camel Case in Filters ',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*The operator dropdown doesn\'t include Ends With.*`
        },
        {
            'name': '[IPDP-12334] Query: column filter of party lookup fields has a list of operators in the menu',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*The Operator dropdown is present on column filter popup for party field.*`
        },
        {
            'name': '[IPDP-14392] [Global Search] no highlighting for "exact match" search with quotations',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*No highlighted texts in Global Search with Exact Match.*`
        },
        {
            'name': '[IPDP-14513] [Global Search]: user can\'t search for special symbls + \[',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*No records returned for Special Characters in Global Search.*`
        },
        {
            'name': '[IPDP-14597] [Global Search]: user preferences are not applied',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*The Audit Key is different from Record Identification for PatentMasters.*`
        },
        {
            'name': '[IPDP-14599] [Global Search]: \ symbol is duplicated in search results',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*No records returned for Logical operators in Global Search.*`
        },
        {
            'name': '[IPDP-14844] [AQA] [Query] Current query is reset with a default query when user clicks on \'Query\' meny item',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*The Query Board is not displayed after clicking Query tab from DEF record.*`
        },
        {
            'name': '[IPDP-5007] Query, DEF, Export - Issues with currency; [IPDP-7632] Query/DEF - Unexpected currency symbol placement',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*format on query results does not match.*`
        },
        {
            'name': '[IPDP-5007] Query, DEF, Export - Issues with currency',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*array of column names doesn't contain.*`
        },
        {
            'name': '[IPDP-15359] [Collaboration Portal] Message with grammatic mistake is displayed  if License without Collaboration Portal is applied',
            'matchedStatuses': ['broken', 'failed'],
            'traceRegex': `.*please contact your administrator for futher information.*`
        }
    ];
    fs.writeFileSync('reports/allure/allure-results/categories.json', JSON.stringify(defectCategories));
    fs.writeFileSync('reports/allure/allure-results/environment.xml', env);
    const generation = allureCmd(['generate', 'reports/allure/allure-results', '-o', 'reports/allure/allure-report', '--clean']);
    return new Promise((resolve, reject) => {
        generation.on('exit', function(exitCode) {
            console.log('Generation is finished with code:', exitCode);
            resolve();
        });
    });
};

const setUpGlobal = (global, possibleOptionsArray, defaultValue, isMultiplePossible = false) => {
    if (global === undefined || global === '' || global === ' ' || global === null) {
        global = defaultValue;
    } else {
        if (possibleOptionsArray.length > 0) {
            if (!isMultiplePossible) {
                if (!possibleOptionsArray.includes(global)) {
                    throw new Error(`Wrong global's value - '${global}', it should be one of '[${possibleOptionsArray.join(', ')}]'`);
                }
            } else {
                const valuesArr = global.split(/[\/,:;.\\]/);
                valuesArr.forEach((value) => {
                    if (!possibleOptionsArray.includes(value)) {
                        throw new Error(`Wrong global's multiple value - '${global}', it should consist of '[${possibleOptionsArray.join(', ')}]'`);
                    }
                });
            }
        }
    }
    return global;
};

const setUpFlag = (global) => {
    return global === 'true';
};

const setUpPrebuildSettings = async () => {
    if (process.env.npm_config_clean.match(/all/)) {
        await del('reports');
        console.log(`All Reports were deleted`);
    }
    if (process.env.npm_config_clean.match(/html/)) {
        await del('reports/allure');
        console.log(`HTML report was deleted`);
    }
    if (process.env.npm_config_clean.match(/logs/)) {
        await del('reports/logs');
        console.log(`Logs were deleted`);
    }
    if (process.env.npm_config_clean.match(/screenshots/)) {
        await del('reports/screenshots');
        console.log(`Screenshots were deleted`);
    }
    if (!fs.existsSync('reports')) {
        fs.mkdirSync('reports');
    }
};

const fixTestCafeReporting = () => {
    require('./plugins/reportingPlugin').fixTestCafeReporting();
}

const fixTestCafeAssertions = () => {
    require('./plugins/assertionPlugin').fixTestCafeAssertions();
}

const fixTestCafeFirefoxConfig = () => {
    require('./plugins/firefoxPlugin').fixTestCafeFirefoxConfig();
}

const getTimeItems = (duration) => {
    const hours = moment.duration(duration).hours();
    const minutes = moment.duration(duration).minutes();
    const seconds = moment.duration(duration).seconds();
    const fullHours = parseInt(moment.duration(duration).asHours());
    const fullMinutes = parseInt(moment.duration(duration).asMinutes());
    const fullSeconds = parseInt(moment.duration(duration).asSeconds());
    return {
        fullHours,
        fullMinutes,
        fullSeconds,
        time: {
            hours,
            minutes,
            seconds
        }
    };
};

const fixPrototipes = () => {
    if (!Array.prototype.last) {
        Array.prototype.last = function() {
            return this[this.length - 1];
        };
    }
};

const shell = (row, timeout) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(moment().format('MM/DD/YYYY HH:mm:ss (UTC Z)'));
            console.log(row);
            exec(row, {maxBuffer: 1024 * 1024 * globalConfig.threadBuffer}, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                }
                console.log(stdout);
                console.log(stderr);
                resolve({error, stdout, stderr});
            })
        }, timeout);
    })
};

const setStrategy = (strategy) => {
    switch(strategy) {
        case 'regression':
            if (!process.env.npm_config_clean) {
                process.env.npm_config_clean = 'all';
            }
            if (!process.env.npm_config_threads) {
                process.env.npm_config_threads = '5';
            }
            if (!process.env.npm_config_suite) {
                process.env.npm_config_suite = 'cp,qlr,def,ch,cb';
            }
            if (!process.env.npm_config_user) {
                process.env.npm_config_user = 'testRegression1,testRegression3,testRegression4,testRegression5,testRegression6';
            }
            break;
        case 'smoke':
            if (!process.env.npm_config_clean) {
                process.env.npm_config_clean = 'all';
            }
            if (!process.env.npm_config_threads) {
                process.env.npm_config_threads = '3';
            }
            if (!process.env.npm_config_suite) {
                process.env.npm_config_suite = 'docketing,administration,iprules';
            }
            if (!process.env.npm_config_suite) {
                process.env.npm_config_suite = 'test';
            }
            break;
    }
}

const setFilters = (testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
    let nameFilter = true,
        categoryFilter = true,
        briefFilter = true;
    // Filter for Test and Fixture names
    if (globalConfig.test || globalConfig.fixture) {
        nameFilter = (!globalConfig.test || testName === globalConfig.test) && (!globalConfig.fixture || fixtureName === globalConfig.fixture);
    }
    // Filter for Test and Fixture categories
    if (globalConfig.category) {
        let fixtureCategoryFilter = true,
            testCategoryFilter = true;
        if (globalConfig.category.includes('-')) {
            const category = globalConfig.category.replace('-', '');
            if (fixtureMeta.category) {
                fixtureCategoryFilter = !fixtureMeta.category.split(',').includes(category);
            }
            if (testMeta.category) {
                testCategoryFilter = !testMeta.category.split(',').includes(category);
            }
            categoryFilter = fixtureCategoryFilter && testCategoryFilter;
        } else {
            fixtureCategoryFilter = false;
            testCategoryFilter = false;
            if (fixtureMeta.category) {
                fixtureCategoryFilter = fixtureMeta.category.split(',').includes(globalConfig.category);
            }
            if (testMeta.category) {
                testCategoryFilter = testMeta.category.split(',').includes(globalConfig.category);
            }
            categoryFilter = fixtureCategoryFilter || testCategoryFilter;
        }
    }
    // Filter for --brief flag
    if (globalConfig.brief) {
        briefFilter = (testMeta.brief && testMeta.brief === 'true') || (fixtureMeta.brief && fixtureMeta.brief === 'true')
    }
    return nameFilter && categoryFilter && briefFilter;
}

exports.allureGenerate = allureGenerate;
exports.setUpGlobal = setUpGlobal;
exports.setUpFlag = setUpFlag;
exports.setUpPrebuildSettings = setUpPrebuildSettings;
exports.fixTestCafeReporting = fixTestCafeReporting;
exports.fixTestCafeAssertions = fixTestCafeAssertions;
exports.fixTestCafeFirefoxConfig = fixTestCafeFirefoxConfig;
exports.getTimeItems = getTimeItems;
exports.fixPrototipes = fixPrototipes;
exports.shell = shell;
exports.setStrategy = setStrategy;
exports.setFilters = setFilters;
