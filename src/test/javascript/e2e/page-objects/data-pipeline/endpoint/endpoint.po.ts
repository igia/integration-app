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
import { DataPipelineScriptPage } from './../scripts/data-pipeline-script-po';
import { DataPipelineConfigurationPage } from '../configurations/data-pipeline-configuration.po';

export abstract class EndpointPage {
    name: ElementFinder;
    inDataType: ElementFinder;
    outDataType: ElementFinder;

    filtersPage: DataPipelineScriptPage;
    transformersPage: DataPipelineScriptPage;
    configurationsPage: DataPipelineConfigurationPage;

    constructor(prefix: string, index?: number) {
        if (!index) {
            index = 0;
        }
        this.name = element(by.id(`${prefix}${index}name`));
        this.inDataType = element(by.id(`${prefix}${index}inDataType`));
        this.outDataType = element(by.id(`${prefix}${index}outDataType`));

        this.filtersPage = new DataPipelineScriptPage(`#${prefix}${index} [titletext="Filters"]`);
        this.transformersPage = new DataPipelineScriptPage(`#${prefix}${index} [titletext="Transformers"]`);
        this.configurationsPage = new DataPipelineConfigurationPage(prefix, index);
    }
}
