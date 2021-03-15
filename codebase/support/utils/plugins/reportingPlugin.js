/* tslint:disable:no-unused-expression space-before-function-paren curly no-duplicate-variable */
const CustomLogger = require('../log').CustomLogger;
const helper = require('../runnerHelper');
const moment = require('moment');

function fixTestCafeReporting() {
    let RunnerBootstraper = require('testcafe/lib/runner/bootstrapper');

    RunnerBootstraper.prototype._getReporterPlugins = async function() {
        if (!this.reporters.length)
            Bootstrapper._addDefaultReporter(this.reporters);
        return Promise.all(this.reporters.map(async ({ name, output }) => {
            const pluginFactory = allureReporterBuilder;
            const processedName = 'allure';
            const outStream = output ? await this._ensureOutStream(output) : void 0;
            return {
                plugin: pluginFactory(),
                name: processedName,
                outStream
            };
        }));
    };
}

function allureReporterBuilder() {

    var appRoot = require('app-root-path');
    var Allure = require('allure-js-commons');
    var Runtime = require('allure-js-commons/runtime');
    var fs = require('fs');
    var saveHistory = require('testcafe-reporter-allure/lib/save-history.js');
    var deleteAllureData = require('testcafe-reporter-allure/lib/delete-allure-data').deleteAllureData;
    var generateConfig = require('testcafe-reporter-allure/lib/generateConfig').generateConfig;
    var commonTestCount;

    var allureReporter = new Allure();

    global.allure = new Runtime(allureReporter);
    var reporterConfig = undefined;

    try {
        reporterConfig = require(appRoot.path + '/doc-allure-config');
    } catch (err) {
        reporterConfig = {};
    }

// Default configuration
    allure.docAllureConfig = generateConfig(reporterConfig);

    if (allure.docAllureConfig.COPY_HISTORY) {
        saveHistory(appRoot.path, allure.docAllureConfig);
    }

    allureReporter.setOptions({ targetDir: '' + appRoot.path + allure.docAllureConfig.RESULT_DIR });
    var labels = allure.docAllureConfig.labels;

    var errorConfig = {
        beforeHook: '- Error in test.before hook -\n',
        assertionError: 'AssertionError',
        brokenError: 'BrokenTest',
        brokenErrorMessage: allure.docAllureConfig.labels.brokenTestMessage || 'This test has been broken',
        testSkipMessage: allure.docAllureConfig.labels.skippedTestMessage || 'This test has been skipped.',
        testPassMessage: allure.docAllureConfig.labels.passedTestMessage || 'This test has been passed.'
    };

    var testStatusConfig = {
        passed: 'passed',
        skipped: 'skipped',
        failed: 'failed',
        broken: 'failed'
    };
    return {
        noColors: true,
        currentFixture: null,

        report: {
            startTime: null,
            endTime: null,
            userAgents: null,
            passed: 0,
            total: 0,
            skipped: 0,
            fixtures: [],
            warnings: []
        },

        reportTaskStart: function reportTaskStart(startTime, userAgents, testCount) {
            CustomLogger.logger.log('WARN', `${globalInfo.suite.toUpperCase()} SUITE STARTS FOR ${testCount} TEST(S)`);
            this.report.startTime = startTime;
            this.report.userAgents = userAgents;
            commonTestCount = testCount;
            this.report.total = testCount;
            deleteAllureData(appRoot.path, allure.docAllureConfig);
        },

        reportFixtureStart: function reportFixtureStart(name, path, meta) {
            CustomLogger.logger.log('FIXTURE', `'${name}' starts
            `);
            this.currentFixture = { name: name, path: path, tests: [], meta: meta };
            this.report.fixtures.push(this.currentFixture);
        },

        formatErrorObect: function formatErrorObect(errorText) {
            var errorMessage = undefined;
            var errorName = undefined;

            if (errorText.indexOf(errorConfig.assertionError) !== -1) {
                errorName = errorConfig.assertionError;
                errorMessage = errorText.substring(0, errorText.indexOf('\n\n'));
            } else if (errorText.indexOf(errorConfig.beforeHook) !== -1) {
                errorName = errorConfig.beforeHook;
                errorMessage = errorText.substring(errorConfig.beforeHook.length, errorText.indexOf('\n\n'));
            } else {
                errorName = errorConfig.brokenError;
                errorMessage = errorConfig.brokenErrorMessage;
            }
            return { errorName: errorName, errorMessage: errorMessage };
        },
        getTestEndTime: function getTestEndTime(testDuration, testStartTime) {
            var testEndTime = testDuration + testStartTime;

            return testEndTime;
        },
        addScreenshot: function addScreenshot(screenshotPath) {
            if (screenshotPath && fs.existsSync(screenshotPath)) {
                var img = fs.readFileSync(screenshotPath);

                allure.createAttachment(labels.screenshotLabel, Buffer.from(img, 'base64'));
            }
        },
        addJiraLinks: function addJiraLinks(meta) {
            if (meta[allure.docAllureConfig.META.STORY_ID]) {
                var storyURL = allure.docAllureConfig.STORY_URL.replace('{{ID}}', meta[allure.docAllureConfig.META.STORY_ID]);

                if (storyURL) {
                    allure.addArgument(allure.docAllureConfig.STORY_LABEL, storyURL);
                }
            }

            if (meta[allure.docAllureConfig.META.TEST_ID]) {
                var testURL = allure.docAllureConfig.TEST_URL.replace('{{ID}}', meta[allure.docAllureConfig.META.TEST_ID]);

                if (testURL) {
                    allure.addArgument(allure.docAllureConfig.TEST_LABEL, testURL);
                }
            }
        },
        addFeatureInfo: function addFeatureInfo(meta, fixtureName) {
            var TEST_RUN = this.currentFixture.meta && this.currentFixture.meta[allure.docAllureConfig.META.TEST_RUN];

            if (!TEST_RUN) {
                TEST_RUN = meta && meta[allure.docAllureConfig.META.TEST_RUN];
            }
            var userAgent = this.report.userAgents[0];

            if (TEST_RUN) {
                allure.feature(TEST_RUN);
                allure.story(fixtureName);
                userAgent = TEST_RUN;
            }
            allure.addArgument(labels.userAgentLabel, userAgent);
        },
        reportTestStart: function reportTestStart(name) {
            CustomLogger.logger.log('TEST', `'${name}' starts`);
            allureReporter.startSuite(this.currentFixture.name);
            var testStartTime = Date.now();

            allureReporter.startCase(name, testStartTime);
        },
        reportTestDone: function reportTestDone(name, testRunInfo, meta) {
            var _this = this;

            this.addFeatureInfo(meta, this.currentFixture.name);
            allure.severity(meta[allure.docAllureConfig.META.SEVERITY]);
            this.addJiraLinks(meta);

            var testEndTime = Date.now();
            var formattedErrs = testRunInfo.errs.map(function (err) {
                return _this.formatError(err);
            });

            if (testRunInfo.skipped) {
                CustomLogger.logger.log('TEST', `'${name}' skipped
                `);
                var testInfo = {
                    message: errorConfig.testSkipMessage,
                    stack: 'no error'
                };

                allureReporter.endCase(testStatusConfig.skipped, testInfo, testEndTime);
            } else if (!formattedErrs || !formattedErrs.length) {
                CustomLogger.logger.log('TEST', `'${name}' successfully ends
                `);
                var testInfo = {
                    message: errorConfig.testPassMessage,
                    stack: 'no error'
                };

                allureReporter.endCase(testStatusConfig.passed, testInfo, testEndTime);
            } else if (formattedErrs && formattedErrs.length) {
                var _formatErrorObect = this.formatErrorObect(formattedErrs[0]);

                var errorName = _formatErrorObect.errorName;
                var errorMessage = _formatErrorObect.errorMessage;
                CustomLogger.logger.log('ERROR', `TEST '${name}' fails with error:
                ${formattedErrs[0]}
                `);
                var errorMsg = {
                    name: errorName,
                    message: errorMessage,
                    stack: formattedErrs[0]
                };
                var testCafeErrorObject = testRunInfo.errs[0];

                this.addScreenshot(testCafeErrorObject.screenshotPath);
                var testStatus = testStatusConfig.failed;

                if (errorName !== errorConfig.assertionError) {
                    testStatus = testStatusConfig.broken;
                }
                allureReporter.endCase(testStatus, errorMsg, testEndTime);
            }
            allureReporter.endSuite();
        },

        reportTaskDone: function reportTaskDone(endTime, passed, warnings) {
            globalInfo.executionEndTime = globalInfo.executionEndTime = parseInt(moment().format('x'));
            globalInfo.executionDuration = globalInfo.executionEndTime - globalInfo.executionStartTime;
            const time = helper.getTimeItems(globalInfo.executionDuration).time;
            CustomLogger.logger.log('WARN', `TASK ENDS
            suite: ${globalConfig.suite}
            total: ${commonTestCount}
            passed: ${passed}
            failed: ${commonTestCount - passed}
            duration: ${time.hours}h ${time.minutes}m ${time.seconds}s
            `);
            this.report.passed = passed;
            this.report.endTime = endTime;
            this.report.warnings = warnings;
        }
    };
}

exports.fixTestCafeReporting = fixTestCafeReporting;
