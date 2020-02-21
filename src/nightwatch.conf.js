const chromium = require('chromium');

console.log(chromium.path)
module.exports = {
    "src_folders": [
        "tests"
    ],
    "selenium": {
        "start_process": true,
        "server_path": "./node_modules/selenium-server/lib/runner/selenium-server-standalone-3.141.59.jar",
        "log_path": "",
        "port": 4444,
        "cli_args": {
            "webdriver.chrome.driver": "node_modules/chromedriver/lib/chromedriver/chromedriver"
        }
    },
    "test_settings": {
        "default": {
            "desiredCapabilities": {
                "browserName": 'chrome'
            },
        }
    }
}