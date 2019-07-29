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
import { element, by } from 'protractor';
import { selectDropdownOption } from '../../../util';

export class DataPipelineScriptDetailPage {
    title = element(by.css('.modal-title'));

    description = element(by.id('description'));
    type = element(by.id('type'));
    script = element(by.id('data'));

    cancelButton = element(by.css('.modal-content .modal-footer .btn-secondary'));
    saveButton = element(by.css('.modal-content .modal-footer .btn-primary'));

    async populateFields(description: string, type: string, script: string) {
        await this.description.sendKeys(description);
        await selectDropdownOption(this.type, type);
        await this.script.sendKeys(script);
    }
}
