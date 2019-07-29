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
import { browser, ExpectedConditions as EC } from 'protractor';
import { expect } from 'chai';

import { NavbarPage } from '../page-objects/layout/navbar.po';
import { SignInPage } from '../page-objects/layout/sign-in.po';
import { maximizeBrowser } from '../util';

describe('login', () => {
    const signInPage: SignInPage = new SignInPage();
    const navbarPage = new NavbarPage();

    before(async () => {
        maximizeBrowser();
    });

    beforeEach(async () => {
        browser.waitForAngularEnabled(false);
        await browser.get('/');
    });

    afterEach(() => {
        browser.waitForAngularEnabled(true);
    });

    // tslint:disable:no-unused-expression
    it('should fail to login with bad password', async () => {
        await browser.wait(EC.urlContains('auth/realms'), 10000, 'Login url not present').catch(() => {});
        expect(await browser.getCurrentUrl()).to.containIgnoreCase('auth/realms');

        await signInPage.login('admin', 'foo');
        await browser.wait(signInPage.loginError.isPresent(), 3000, 'Login error not present after wait of 3 seconds.');
        expect(await signInPage.loginError.getText()).to.eq('Invalid username or password.');
    });

    it('should login successfully with admin account', async () => {
        await browser.wait(EC.urlContains('auth/realms'), 15000, 'Login url not present').catch(() => {});
        expect(await browser.getCurrentUrl()).to.containIgnoreCase('auth/realms');

        await signInPage.login('admin', 'admin');
        await browser.wait(
            EC.urlContains('data-pipeline'),
            5000,
            'Page is not redirected to the data-pipeline list page after wait of 5 seconds.'
        );
        browser.waitForAngularEnabled(true);

        expect(await navbarPage.signOutMenu.isPresent()).to.be.true;
        expect(await navbarPage.signInMenu.isPresent()).to.be.false;
    });
});
