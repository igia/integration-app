/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v.
 * 2.0 with a Healthcare Disclaimer.
 * A copy of the Mozilla Public License, v. 2.0 with the Healthcare Disclaimer can
 * be found under the top level directory, named LICENSE.
 * If a copy of the MPL was not distributed with this file, You can obtain one at
 * http://mozilla.org/MPL/2.0/.
 * If a copy of the Healthcare Disclaimer was not distributed with this file, You
 * can obtain one at the project website https://github.com/igia.
 *
 * Copyright (C) 2018-2019 Persistent Systems, Inc.
 */
var path = require('path');
var file_download_directory = path.resolve(__dirname, '../../../target');

exports.config = {
    allScriptsTimeout: 20000,

    specs: [
         './e2e/login/**/*.e2e-spec.ts',
         './e2e/listPage/**/*.e2e-spec.ts',
         './e2e/data-pipeline/**/*.e2e-spec.ts',
         './e2e/logout/**/*.e2e-spec.ts'
        /* jhipster-needle-add-protractor-tests - JHipster will add protractors tests here */
    ],

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: process.env.JHI_E2E_HEADLESS
                ? ['--headless', '--disable-gpu', '--window-size=800,600']
                : ['--disable-gpu', '--window-size=800,600'],
            prefs: {
                download: {
                    'prompt_for_download': false,
                    'directory_upgrade': true,
                    'default_directory': file_download_directory
                }
                }
        }
    },

    directConnect: true,

    baseUrl: 'http://localhost:8052/',

    params: {
        sftp_host: 'integration-app-sftp',
        sftp_username: 'igia',
        sftp_password: 'integration',
        file_download_Path: file_download_directory
        },

    framework: 'mocha',

    SELENIUM_PROMISE_MANAGER: false,

    mochaOpts: {
        reporter: 'spec',
        slow: 3000,
        ui: 'bdd',
        timeout: 720000
    },

    beforeLaunch: function() {
        require('ts-node').register({
            project: ''
        });
    },

    onPrepare: function() {
        browser.driver
            .manage()
            .window()
            .setSize(1280, 1024);
        // Disable animations
        browser.executeScript('document.body.className += " notransition";');
        const chai = require('chai');
        const chaiAsPromised = require('chai-as-promised');
        chai.use(chaiAsPromised);
        const chaiString = require('chai-string');
        chai.use(chaiString);
        global.chai = chai;
    },

    useAllAngular2AppRoots: true
};
