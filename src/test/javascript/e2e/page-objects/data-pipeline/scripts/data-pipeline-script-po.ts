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
import { element, by, ElementFinder } from 'protractor';

import { DataPipelineScriptDetailPage } from './data-pipeline-script-detail.po';

export class DataPipelineScriptPage {
    title: ElementFinder;
    titleCount: ElementFinder;
    noRecords: ElementFinder;
    addButton: ElementFinder;

    recordList: ElementFinder;
    detailPage: DataPipelineScriptDetailPage = new DataPipelineScriptDetailPage();

    constructor(parentCssPath: string) {
        this.title = element(by.css(`${parentCssPath} .igia-group-title`));
        this.titleCount = this.title.element(by.css('.badge'));
        const section = element(by.css(`${parentCssPath} #section-content`));
        this.addButton = section.element(by.css('.btn-primary'));
        this.noRecords = section.element(by.css('.alerts p'));
        this.recordList = section.element(by.css('table'));
    }
}
