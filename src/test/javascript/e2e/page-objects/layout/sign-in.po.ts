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
import { element, by, browser, ExpectedConditions as EC } from 'protractor';

export class SignInPage {
    username = element(by.name('username'));
    password = element(by.name('password'));
    loginButton = element(by.css('input[type=submit]'));
    loginError = element(by.css('.alert-error'));

    async autoLogin(username: string, password: string) {
        browser.wait(EC.urlContains('auth/realms'), 5000, 'Invalid login URL after wait of 5 seconds').catch(() => {});
        const currentUrl = await browser.getCurrentUrl();
        if (currentUrl.indexOf('auth/realms') > -1) {
            browser.wait(EC.visibilityOf(this.username), 5000, 'Username input is not visible after wait of 5 seconds').catch(() => {});
            await this.login(username, password);
            browser
                .wait(
                    EC.urlContains('data-pipeline'),
                    10000,
                    'Page is not redirected to the data-pipeline list page after wait of 5 seconds.'
                )
                .catch(() => {});
        }
    }

    async login(username: string, password: string) {
        await this.username.sendKeys(username);
        await this.password.sendKeys(password);
        await this.loginButton.click();
    }
}
