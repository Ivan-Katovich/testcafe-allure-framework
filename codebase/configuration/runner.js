// Imports
const createTestCafe = require('testcafe');
const moment = require('moment');
const helper = require('../support/utils/runnerHelper');
const browsers = require('./data/browsers');
const environments = require('./data/environments');
const databases = require('./data/databases');
const users = require('./data/users');
const suites = require('./data/suites');

// Globals
process.env.npm_config_clean = helper.setUpGlobal(process.env.npm_config_clean, ['all', 'html', 'logs', 'screenshots', 'false'], 'false', true);
process.env.npm_config_env = helper.setUpGlobal(process.env.npm_config_env, ['atdv', 'a491', 'prod', 'pilot', 'local', 'ent'], 'atdv');
process.env.npm_config_authtype = helper.setUpGlobal(process.env.npm_config_authtype, ['hosted', 'enterprise'], 'hosted');
process.env.npm_config_database = helper.setUpGlobal(process.env.npm_config_database, ['DP49Automation', 'DP491Automation', 'DP49AutomationEnt', 'IPMGQA493_0715'], '');
process.env.npm_config_suite = helper.setUpGlobal(process.env.npm_config_suite, ['smoke', 'docketing', 'administration', 'iprules', 'regression', 'cp', 'cb', 'def', 'ch', 'qlr', 'gs', 'up'], 'smoke', true);
process.env.npm_config_user = helper.setUpGlobal(process.env.npm_config_user, ['test', 'testRegression1', 'testRegression3', 'testRegression4', 'testRegression5', 'testRegression6', 'testRegression7', 'testDevelopment1', 'testAllPermissions', 'local', 'entTest'], process.env.npm_config_suite === 'regression' ? 'testRegression1' : 'test');
process.env.npm_config_browser = helper.setUpGlobal(process.env.npm_config_browser, ['chrome', 'firefox', 'ie', 'edge'], 'chrome');
process.env.npm_config_port = helper.setUpGlobal(process.env.npm_config_port, [], '1335');
process.env.npm_config_vers = helper.setUpGlobal(process.env.npm_config_vers, [], '4.9.4.0');
process.env.npm_config_thread = helper.setUpGlobal(process.env.npm_config_thread, [], '0');
process.env.npm_config_quarantine = helper.setUpFlag(process.env.npm_config_quarantine);
process.env.npm_config_monochrome = helper.setUpFlag(process.env.npm_config_monochrome);
process.env.npm_config_headless = helper.setUpFlag(process.env.npm_config_headless);
process.env.npm_config_brief = helper.setUpFlag(process.env.npm_config_brief);
process.env.npm_config_parallel = helper.setUpFlag(process.env.npm_config_parallel);
process.env.npm_config_test = helper.setUpGlobal(process.env.npm_config_test, [], '');
process.env.npm_config_fixture = helper.setUpGlobal(process.env.npm_config_fixture, [], '');
process.env.npm_config_category = helper.setUpGlobal(process.env.npm_config_category, [], '');

global.globalConfig = {
    browser: process.env.npm_config_browser,
    report: 'allure',
    env: environments[process.env.npm_config_env],
    authType: process.env.npm_config_authtype,
    user: users[process.env.npm_config_user],
    suite: process.env.npm_config_suite,
    database: databases[process.env.npm_config_database ? process.env.npm_config_database : environments[process.env.npm_config_env].database],
    port: parseInt(process.env.npm_config_port),
    brief: process.env.npm_config_brief === 'true',
    headless: process.env.npm_config_headless === 'true',
    quarantine: process.env.npm_config_quarantine === 'true',
    parallel: process.env.npm_config_parallel === 'true',
    timeout: {
        expiration: 60 * 60 * 1000,
        loading: 3 * 60 * 1000,
        element: 1 * 60 * 1000,
        request: 5 * 1000
    },
    version: process.env.npm_config_vers,
    thread: parseInt(process.env.npm_config_thread),
    category: process.env.npm_config_category,
    test: process.env.npm_config_test,
    fixture: process.env.npm_config_fixture
};

global.globalInfo = {
    executionStartTime: parseInt(moment().format('x')),
    executionEndTime: null,
    executionDuration: null,
    suite: process.env.npm_config_suite
};

// Runner
(async () => {
    await helper.setUpPrebuildSettings();
    helper.fixTestCafeReporting();
    helper.fixTestCafeAssertions();
    helper.fixTestCafeFirefoxConfig();
    await helper.fixPrototipes();
    const testCafe = await createTestCafe('localhost', globalConfig.port, globalConfig.port + 1);
    try {
        let runner = testCafe.createRunner()
            .src(suites.compose(globalConfig.suite))
            .browsers(`${browsers[globalConfig.browser].name}${globalConfig.headless ? browsers[globalConfig.browser].headless : ''}`)
            .screenshots('./reports/screenshots/', true)
            .reporter('allure')
            .filter(helper.setFilters);

        const numFailed = await runner
            .run(
                {
                    quarantineMode: globalConfig.quarantine,
                    skipJsErrors: true,
                    disableMultipleWindows: true,
                    skipUncaughtErrors: true,
                    selectorTimeout: 10000,
                    assertionTimeout: 10000,
                    pageLoadTimeout: 40000
                }
            );
        testCafe.close();
        if (!globalConfig.parallel) {
            await helper.allureGenerate();
        }
        if (numFailed) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    } catch (err) {
        console.error(err);
        testCafe.close();
        process.exit(1);
    }
})();
