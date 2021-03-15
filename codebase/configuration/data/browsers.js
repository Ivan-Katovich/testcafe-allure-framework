module.exports = {
    chrome: {
        name: 'chrome',
        headless: ':headless'
        // headless: ':headless:cdpPort=9222 --disable-dev-shm-usage --no-sandbox'
    },
    firefox: {
        name: 'firefox',
        headless: ':headless'
    },
    edge: {
        name: 'edge',
        headless: ':headless'
    },
    ie: {
        name: 'ie',
        headless: ':headless'
    },
};