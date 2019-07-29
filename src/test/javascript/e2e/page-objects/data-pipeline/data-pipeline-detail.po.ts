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

import { SourceEndpointPage } from './endpoint/source-endpoint.po';
import { DestinationEndpointPage } from './endpoint/destination-endpoint.po';
import { EndpointPage } from './endpoint/endpoint.po';

export class DataPipelineDetailPage {
    editpageTitle = element(by.xpath('//*[@jhitranslate="dataPipeline.home.editLabel"]'));
    pageTitle = element(by.xpath('//*[@jhitranslate="dataPipeline.home.createLabel"]'));

    name: ElementFinder = element(by.id('field_name'));
    description: ElementFinder = element(by.id('field_description'));
    workerService: ElementFinder = element(by.id('field_workerService'));
    deploy: ElementFinder = element(by.css('#field_deploy+.checkbox-decorator>.check'));

    sourcePage: EndpointPage = new SourceEndpointPage();
    destinationPage: DestinationEndpointPage = new DestinationEndpointPage();

    submitButton: ElementFinder = element(by.id('save-entity'));

    async populateFields(name: string, description: string, deploy?: boolean) {
        await this.name.sendKeys(name);
        await this.description.sendKeys(description);
        if (deploy) {
            await this.deploy.click();
        }
    }
}
