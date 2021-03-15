// Imports
const moment = require('moment');
const helper = require('../support/utils/runnerHelper');

process.env.npm_config_strategy = helper.setUpGlobal(process.env.npm_config_strategy, ['regression', 'smoke', ''], '');
helper.setStrategy(process.env.npm_config_strategy);

process.env.npm_config_clean = helper.setUpGlobal(process.env.npm_config_clean, ['all', 'html', 'logs', 'screenshots'], false, true);

global.globalConfig = {
    threads: parseInt(helper.setUpGlobal(process.env.npm_config_threads, [], '1')),
    browser: helper.setUpGlobal(process.env.npm_config_browser, ['chrome', 'firefox', 'ie', 'edge'], 'chrome'),
    env: helper.setUpGlobal(process.env.npm_config_env, ['atdv', 'a491', 'prod', 'pilot'], 'atdv'),
    user: helper.setUpGlobal(process.env.npm_config_user, ['test', 'testRegression1', 'testRegression3', 'testRegression4', 'testRegression5', 'testRegression6', 'testRegression7', 'testDevelopment1'], process.env.npm_config_suite === 'regression' ? 'testRegression1' : 'test', true),
    suite: helper.setUpGlobal(process.env.npm_config_suite, ['smoke', 'docketing', 'administration', 'iprules', 'regression', 'cp', 'cb', 'def', 'ch', 'qlr', 'gs', 'up'], 'smoke', true),
    parallelTimeout: parseInt(helper.setUpGlobal(process.env.npm_config_timeout, [], '60000')),
    threadBuffer: parseInt(helper.setUpGlobal(process.env.npm_config_timeout, [], '7')),
    brief: helper.setUpFlag(process.env.npm_config_brief),
    headless: helper.setUpFlag(process.env.npm_config_headless),
    quarantine: helper.setUpFlag(process.env.npm_config_quarantine),
    version: helper.setUpGlobal(process.env.npm_config_vers, [], '4.9.4.0'),
    exception: helper.setUpGlobal(process.env.npm_config_exception, [], '')
};

global.globalInfo = {
    executionStartTime: parseInt(moment().format('x')),
    executionEndTime: null,
    executionDuration: null,
    suite: process.env.npm_config_suite
};

(async () => {
    await helper.setUpPrebuildSettings();
    try{
        console.log(`
        ================================================================
            PARALLEL RUN STARTS
            suites: ${globalConfig.suite}
            users: ${globalConfig.user}
            environment: ${globalConfig.env}
            browser: ${globalConfig.browser}
            threads: ${globalConfig.threads}
            is brief: ${globalConfig.brief}
            is quarantine: ${globalConfig.quarantine}
            is headless: ${globalConfig.headless}
            version: ${globalConfig.version}
            exception: ${globalConfig.exception}
            start time: ${moment(globalInfo.executionStartTime).format('MM/DD/YYYY HH:mm:ss (UTC Z)')}
        ================================================================
            `);
        const promises = [];
        const suites = globalConfig.suite.split(',');
        const users = globalConfig.user.split(',');
        for (let i = 0; i < globalConfig.threads; i++) {
            const user = users[i] ? users[i] : users[0];
            const suite = suites[i] ? suites[i] : suites[0];
            const port = 1339 + (i * 2);
            const row = `npm run execute ` +
                `--parallel --monochrome --clean=false ` +
                `--brief=${globalConfig.brief} --headless=${globalConfig.headless} --quarantine=${globalConfig.quarantine} ` +
                `--thread=${i} ` +
                `--category="${globalConfig.exception ? `-${globalConfig.exception}` : ''}" ` +
                `--port=${port} --user=${user} --suite=${suite}`;
            promises.push(helper.shell(row, globalConfig.parallelTimeout * i));
        }
        let results = await Promise.all(promises);
        console.log(`
        ================================================================
            ALL PARALLEL TASKS END
        ================================================================
            `);
        let result = {
            error: null,
            stderr: null
        };
        if (globalConfig.exception) {
            console.log(`
        ================================================================
            EXCEPTIONS RUN STARTS
            suites: ${suites.join('/')}
            users: ${users[0]}
            environment: ${globalConfig.env}
            is brief: ${globalConfig.brief}
            is quarantine: ${globalConfig.quarantine}
            version: ${globalConfig.version}
            category: ${globalConfig.exception}
            start time: ${moment(globalInfo.executionStartTime).format('MM/DD/YYYY HH:mm:ss (UTC Z)')}
        ================================================================
            `);
            const row = `npm run execute ` +
                `--parallel --monochrome --clean=false ` +
                `--brief=${globalConfig.brief} --headless=${globalConfig.headless} --quarantine=${globalConfig.quarantine} ` +
                `--thread=${globalConfig.threads} ` +
                `--category="${globalConfig.exception}" ` +
                `--port=1337 --user=${users[0]} --suite=${suites.join('/')}`;
            result = await helper.shell(row);
            console.log(`
        ================================================================
            EXCEPTIONAL RUN ENDS
        ================================================================
            `);
        }

        results = [...results, result];
        const failures = results.filter((res) => res.error || (res.stderr && res.stderr.includes('errno 1')))
        globalInfo.executionEndTime = parseInt(moment().format('x'));
        globalInfo.executionDuration = globalInfo.executionEndTime - globalInfo.executionStartTime;
        const hours = moment.duration(globalInfo.executionDuration).hours();
        const minutes = moment.duration(globalInfo.executionDuration).minutes();
        const seconds = moment.duration(globalInfo.executionDuration).seconds();
        console.log(`
        ================================================================
            ALL PARALLEL TASKS AND EXCEPTIONAL RUN END
            start time: ${moment(globalInfo.executionStartTime).format('MM/DD/YYYY HH:mm:ss (UTC Z)')}
            duration: ${hours}h ${minutes}m ${seconds}s
        ================================================================
            `);

        await helper.allureGenerate();
        if (failures.length) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();