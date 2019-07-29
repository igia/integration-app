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
import { browser, ExpectedConditions as EC, by, element } from 'protractor';
import { expect } from 'chai';

import { DataPipelineDetailPage } from '../page-objects/data-pipeline/data-pipeline-detail.po';
import { DataPipelineListPage } from '../page-objects/data-pipeline/data-pipeline-list.po';
import { loginUser, maximizeBrowser, getTableRowsCount, getMatchedTableRowsCount } from '../util';

import {
    assertDeleteDialogPage,
    populateAndAssertWorkerService,
    populateAndAssertEndpoint,
    populateAndAssertEndpointType,
    populateAndAssertScript,
    assertDataPipelineStatus
} from './data-pipeline-util';

import { assertSourceMllpEndpointConfigurations } from './mllp-endpoint-util';
import { assertDestinationFileEndpointConfigurations } from './file-endpoint-util';

describe('create mllp to file data pipeline', () => {
    const detailPage: DataPipelineDetailPage = new DataPipelineDetailPage();
    const listPage: DataPipelineListPage = new DataPipelineListPage();
    let randVal: number;
    let beforeListCount: number;
    let dataPipelineName: string;

    before(async () => {
        await loginUser('admin', 'admin');
        maximizeBrowser();
    });

    // tslint:disable:no-unused-expression
    before(async () => {
        await browser.get('/');
        randVal = Date.now();
        dataPipelineName = 'hl7-data' + randVal;
        expect(await listPage.createButton.isPresent()).to.be.true;
        expect(await listPage.createButton.isEnabled()).to.be.true;

        beforeListCount = await getTableRowsCount(listPage.recordList);
        await listPage.createButton.click();
    });

    // tslint:disable:no-unused-expression
    after(async () => {
        await browser.get('/');
        expect(await listPage.createButton.isPresent()).to.be.true;
        expect(await listPage.createButton.isEnabled()).to.be.true;

        const deleteDialogPage = await listPage.deleteRecord(dataPipelineName);
        await assertDeleteDialogPage(dataPipelineName, deleteDialogPage);
        await deleteDialogPage.deleteButton.click();
        await browser.get('/');
        expect(await getTableRowsCount(listPage.recordList)).to.be.eq(beforeListCount);
    });

    it('should create data pipeline with mllp as source endpoint and file as destination endpoint passing HL7 messages', async () => {
        expect(await detailPage.pageTitle.getText()).to.be.eq('Create Data Pipeline');

        // enter data pipeline details
        detailPage.populateFields(dataPipelineName, 'This interface receives a HL7 file. It then filters patients and create a HL7 file.');

        // Select and assert worker service
        await populateAndAssertWorkerService(detailPage, 'INTEGRATIONWORKER-I');

        // Enter source endpoint details
        const sourcePage = detailPage.sourcePage;
        await populateAndAssertEndpoint(sourcePage, 'hl7 file', 'HL7 V2', 'HL7 V2');

        // Source configurations
        await populateAndAssertEndpointType(sourcePage.configurationsPage, 'Minimal Low Layer Protocol (MLLP)');

        const sourceConfigurations = sourcePage.configurationsPage.detailPage;
        assertSourceMllpEndpointConfigurations(sourceConfigurations);

        await sourceConfigurations.hostName.sendKeys('localhost');
        await sourceConfigurations.port.sendKeys('12016');

        // filter patients who had heart failure
        const sourceFilterPage = sourcePage.filtersPage;
        await populateAndAssertScript(
            sourceFilterPage,
            'Add Filter',
            'Filter for ADT messages',
            'Javascript',
            `var logger = org.slf4j.LoggerFactory.getLogger(exchange.getFromRouteId());
             var msg = exchange.getIn().getBody(Java.type(\'ca.uhn.hl7v2.model.v26.message.ADT_A01\').class);
             var Mtype = msg.getMSH().getMessageType().encode();
             logger.info (\'Source Filter Logging: {}\', Mtype);
             result=msg.getMSH().getMessageType().encode().equals(\'ADT^A04^ADT_A01\')`,
            1,
            'No Filter found. Click'
        );

        // Destination
        const destinationPage = detailPage.destinationPage;
        await populateAndAssertEndpoint(destinationPage, 'hl7 file', 'HL7 V2', 'HL7 V2');

        // Destination configurations
        await populateAndAssertEndpointType(destinationPage.configurationsPage, 'File System');

        const destinationConfigurations = destinationPage.configurationsPage.detailPage;
        assertDestinationFileEndpointConfigurations(destinationConfigurations);

        await destinationConfigurations.directoryPath.sendKeys('/patients');
        await destinationConfigurations.fileName.sendKeys('patinet_data.hl7');

        // Save data pipeline
        expect(await detailPage.submitButton.isEnabled()).to.be.true;
        await detailPage.submitButton.click();

        browser.wait(EC.urlContains('#/data-pipeline'), 5000, 'Invalid list page URL after wait of 5 seconds').catch(() => {});

        expect(await listPage.pageTitle.isPresent()).to.be.true;
        expect(await listPage.pageTitle.getText()).to.be.eq('Data Pipelines');

        // verify list count is incremented by one
        expect(await getTableRowsCount(listPage.recordList)).to.be.eq(beforeListCount + 1);
        expect(await getMatchedTableRowsCount(listPage.recordList, dataPipelineName)).to.be.eq(1);
    });

    describe('update data pipeline', () => {
        before(async () => {
            await browser.get('/');
            expect(await listPage.createButton.isPresent()).to.be.true;
            expect(await listPage.createButton.isEnabled()).to.be.true;

            await listPage.editRecord(dataPipelineName);
        });

        it('should update to add advance fields and response transformers', async () => {
            expect(await detailPage.editpageTitle.getText()).to.be.eq('Modify Data Pipeline');

            // Deploy data pipeline details
            detailPage.deploy.click();

            // Update source endpoint details
            const sourcePage = detailPage.sourcePage;
            await sourcePage.name.clear();
            await sourcePage.name.sendKeys('hl7 file Updated');

            const sourceConfigurations = sourcePage.configurationsPage.detailPage;
            await sourceConfigurations.idleTimeout.sendKeys('10000');

            // Update destination endpoint details

            const destinationPage = detailPage.destinationPage;
            await destinationPage.name.clear();
            await destinationPage.name.sendKeys('Patients file Updated');
            const destinationConfigurationPage = destinationPage.configurationsPage.detailPage;

            await destinationConfigurationPage.doneFileName.sendKeys('tmp');

            // Add Response Transformers
            const destinationResponseTransformerPage = destinationPage.responseTransformersPage;
            await populateAndAssertScript(
                destinationResponseTransformerPage,
                'Add Transformer',
                'Received response',
                'Javascript',
                `var ResponseMessage = response.getMessage();
                logger.info("ResponseMessage: "+ ResponseMessage.toString());`,
                1,
                'No Transformer found. Click'
            );

            // Save data pipeline
            expect(await detailPage.submitButton.isEnabled()).to.be.true;
            await detailPage.submitButton.click();

            browser.wait(EC.urlContains('#/data-pipeline'), 5000, 'Invalid list page URL after wait of 5 seconds').catch(() => {});

            expect(await listPage.pageTitle.isPresent()).to.be.true;
            expect(await listPage.pageTitle.getText()).to.be.eq('Data Pipelines');

            // assert data pipeline status, version, source and destination.
            // Data Pipeline version depends on the status and can change after update in data pipeline state during refresh.
            await assertDataPipelineStatus(dataPipelineName, 5, 'STARTING', 'STARTED');
            expect(await listPage.readColumnText(dataPipelineName, 0)).contains('v2');
            expect(await listPage.readColumnText(dataPipelineName, 2)).to.be.eq('hl7 file Updated');
            expect(await listPage.readColumnText(dataPipelineName, 3)).to.be.eq('Patients file Updated');
        });

        it('should undeploy data pipeline from list', async () => {
            expect(await listPage.readColumnText(dataPipelineName, 5)).to.be.eq('STARTED');
            await listPage.toggleDataPipelineDeployment(dataPipelineName, 6);
            await assertDataPipelineStatus(dataPipelineName, 5, 'STOPPING', 'STOPPED');
        });
    });
});
