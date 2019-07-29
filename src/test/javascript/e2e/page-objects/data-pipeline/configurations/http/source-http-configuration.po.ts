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
import { HttpConfigurationPage } from './http-configuration.po';
import { element, by, ElementFinder } from 'protractor';

export class SourceHttpConfigurationPage extends HttpConfigurationPage {
    userName;
    password;
    enableCORS: ElementFinder;
    sessionSupport: ElementFinder;

    constructor(prefix: string, index?: number) {
        super(prefix);
        this.userName = element(by.id(`${prefix}${index}cusername`));
        this.password = element(by.id(`${prefix}${index}cpassword`));
        this.enableCORS = element(by.id(`#${prefix}${index}cenableCORS`));
        this.sessionSupport = element(by.id(`#${prefix}${index}csessionSupport`));
    }
}
