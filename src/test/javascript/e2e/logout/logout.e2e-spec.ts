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
import { browser } from 'protractor';
import { expect } from 'chai';

import { NavbarPage } from '../page-objects/layout/navbar.po';
import { loginUser, maximizeBrowser } from '../util';

describe('logout', () => {
    const navbarPage: NavbarPage = new NavbarPage();

    before(async () => {
        await loginUser('admin', 'admin');
        maximizeBrowser();
    });

    beforeEach(async () => {
        await browser.get('/');
    });

    // tslint:disable:no-unused-expression
    it('should signout successfully', async () => {
        expect(await navbarPage.signOutMenu.isPresent()).to.be.true;
        expect(await navbarPage.signInMenu.isPresent()).to.be.false;

        await navbarPage.signOutMenu.click();

        expect(await navbarPage.signOutMenu.isPresent()).to.be.false;
        expect(await navbarPage.signInMenu.isPresent()).to.be.true;
    });
});
