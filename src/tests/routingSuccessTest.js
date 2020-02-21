module.exports = {
    'Routing Success Test': function (browser) {
        browser
            .url('http://localhost:3000/')
            .waitForElementVisible('body')
            .assert.titleContains('Mars Weather')
            .assert.visible('div[class=]sol-page-container')
            .assert.visible('a[class=small-sol-clicker]')
            .click('a[class=small-sol-clicker]')
            .assert.titleContains('Mars Weather | Sol')
            .end();
    }
};