

function fixTestCafeFirefoxConfig() {
    let __importDefault = (this && this.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    let local_firefox_1 = require('testcafe/lib/browser/provider/built-in/dedicated/firefox/local-firefox');
    let firefox = require('testcafe/lib/browser/provider/built-in/dedicated/firefox/index');
    const endpoint_utils_1 = require('endpoint-utils');
    const config_1 = __importDefault(require('testcafe/lib/browser/provider/built-in/dedicated/firefox/config'));
    const path_1 = __importDefault(require("path"));
    const temp_directory_1 = __importDefault(require("testcafe/lib/utils/temp-directory"));
    const promisified_functions_1 = require("testcafe/lib/utils/promisified-functions");
    const mime_db_1 = __importDefault(require("mime-db"));

    function getMimeTypes() {
        let mimeTypes = Object.keys(mime_db_1.default);
        mimeTypes = mimeTypes.filter(mimeType => {
            // @ts-ignore: Export of the 'mime-db' module has no index signature.
            const { extensions } = mime_db_1.default[mimeType];
            return extensions && extensions.length;
        });
        // mimeTypesNew to add your own mimeTypes
        const mimeTypesNew = [];
        return [...mimeTypes, ...mimeTypesNew].join(',');
    }
    async function generatePreferences(profileDir, { marionettePort, config }) {
        const prefsFileName = path_1.default.join(profileDir, 'user.js');
        let prefs = [
            'user_pref("browser.link.open_newwindow.override.external", 2);',
            'user_pref("app.update.enabled", false);',
            'user_pref("app.update.auto", false);',
            'user_pref("app.update.mode", 0);',
            'user_pref("app.update.service.enabled", false);',
            'user_pref("browser.shell.checkDefaultBrowser", false);',
            'user_pref("browser.usedOnWindows10", true);',
            'user_pref("browser.rights.3.shown", true);',
            'user_pref("browser.startup.homepage_override.mstone","ignore");',
            'user_pref("browser.tabs.warnOnCloseOtherTabs", false);',
            'user_pref("browser.tabs.warnOnClose", false);',
            'user_pref("browser.sessionstore.resume_from_crash", false);',
            `user_pref("browser.helperApps.neverAsk.saveToDisk", "${getMimeTypes()}");`,
            `user_pref("pdfjs.disabled", true);`,
            'user_pref("toolkit.telemetry.reportingpolicy.firstRun", false);',
            'user_pref("toolkit.telemetry.enabled", false);',
            'user_pref("toolkit.telemetry.rejected", true);',
            'user_pref("datareporting.healthreport.uploadEnabled", false);',
            'user_pref("datareporting.healthreport.service.enabled", false);',
            'user_pref("datareporting.healthreport.service.firstRun", false);',
            'user_pref("datareporting.policy.dataSubmissionEnabled", false);',
            'user_pref("datareporting.policy.dataSubmissionPolicyBypassNotification", true);',
            'user_pref("app.shield.optoutstudies.enabled", false);',
            'user_pref("extensions.shield-recipe-client.enabled", false);',
            'user_pref("extensions.shield-recipe-client.first_run", false);',
            'user_pref("extensions.shield-recipe-client.startupExperimentPrefs.browser.newtabpage.activity-stream.enabled", false);',
            'user_pref("devtools.toolbox.host", "window");',
            'user_pref("devtools.toolbox.previousHost", "bottom");',
            'user_pref("signon.rememberSignons", false);',
            // NOTE: dom.min_background_timeout_value should be equal to dom.min_timeout_value
            'user_pref("dom.min_background_timeout_value", 4);',
            'user_pref("dom.timeout.throttling_delay", 0);',
            'user_pref("dom.timeout.budget_throttling_max_delay", 0);',
            // NOTE: We set the foreground configuration for the background budget throttling parameters
            'user_pref("dom.timeout.background_throttling_max_budget", -1);',
            'user_pref("dom.timeout.background_budget_regeneration_rate", 1);',
            'user_pref("security.enterprise_roots.enabled", true);'
        ];
        // prefsNew to add new prefs for firefox config
        const prefsNew = [];
        prefs = [...prefs, ...prefsNew];
        if (marionettePort) {
            prefs = prefs.concat([
                `user_pref("marionette.port", ${marionettePort});`,
                'user_pref("marionette.enabled", true);'
            ]);
        }
        if (config.disableMultiprocessing) {
            prefs = prefs.concat([
                'user_pref("browser.tabs.remote.autostart", false);',
                'user_pref("browser.tabs.remote.autostart.2", false);',
            ]);
        }
        await promisified_functions_1.writeFile(prefsFileName, prefs.join('\n'));
    }
    async function create_temp_profile(runtimeInfo) {
        const tmpDir = await temp_directory_1.default.createDirectory('firefox-profile');
        await generatePreferences(tmpDir.path, runtimeInfo);
        return tmpDir;
    }

    async function runtime_info(configString) {
        const config = config_1.default(configString);
        const marionettePort = config.marionettePort || (!config.userProfile ? await endpoint_utils_1.getFreePort() : null);
        const runtimeInfo = { config, marionettePort };
        runtimeInfo.tempProfileDir = !config.userProfile ? await create_temp_profile(runtimeInfo) : null;
        runtimeInfo.activeWindowId = null;
        return runtimeInfo;
    }

    firefox.openBrowser = async function(browserId, pageUrl, configString, disableMultipleWindows) {
        const runtimeInfo = await runtime_info(configString);
        runtimeInfo.browserName = this._getBrowserName();
        runtimeInfo.browserId = browserId;
        runtimeInfo.windowDescriptors = {};
        await local_firefox_1.start(pageUrl, runtimeInfo);
        await this.waitForConnectionReady(runtimeInfo.browserId);
        if (!disableMultipleWindows)
            runtimeInfo.activeWindowId = this.calculateWindowId();
        if (runtimeInfo.marionettePort)
            runtimeInfo.marionetteClient = await this._createMarionetteClient(runtimeInfo);
        this.openedBrowsers[browserId] = runtimeInfo;
    }
}

exports.fixTestCafeFirefoxConfig = fixTestCafeFirefoxConfig;