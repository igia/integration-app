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

import { assertSourceSftpEndpointConfigurations, assertDestinationSftpEndpointConfigurations } from './sftp-endpoint-util';

describe('create sftp to file data pipeline', () => {
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

    it('should create data pipeline with sftp as source endpoint and file as destination endpoint passing HL7 messages', async () => {
        expect(await detailPage.pageTitle.getText()).to.be.eq('Create Data Pipeline');

        // enter data pipeline details
        detailPage.populateFields(dataPipelineName, 'This interface receives a HL7 file. It then filters patients and create a HL7 file.');

        // Select and assert worker service
        await populateAndAssertWorkerService(detailPage, 'INTEGRATIONWORKER-I');

        // Enter source endpoint details
        const sourcePage = detailPage.sourcePage;
        await populateAndAssertEndpoint(sourcePage, 'Hl7 file', 'HL7 V2', 'HL7 V2');

        // Source configurations
        await populateAndAssertEndpointType(sourcePage.configurationsPage, 'Secure File Transfer Protocol (SFTP)');

        const sourceConfigurations = sourcePage.configurationsPage.detailPage;
        assertSourceSftpEndpointConfigurations(sourceConfigurations);

        await sourceConfigurations.hostName.sendKeys(browser.params.sftp_host);
        await sourceConfigurations.userName.sendKeys(browser.params.sftp_username);
        await sourceConfigurations.passWord.sendKeys(browser.params.sftp_password);
        await sourceConfigurations.directoryPath.sendKeys('/public/integration');
        await sourceConfigurations.fileName.sendKeys('fromsftp.hl7');

        // filter patients who had heart failure
        const sourceFilterPage = sourcePage.filtersPage;
        await populateAndAssertScript(
            sourceFilterPage,
            'Add Filter',
            'Patients who had heart failure',
            'Javascript',
            `request.getBody()[0][12] === 'ICD9_DGNS_CD_1' || request.getBody()[0][12] === 'V428'`,
            1,
            'No Filter found. Click'
        );

        // Destination
        const destinationPage = detailPage.destinationPage;
        await populateAndAssertEndpoint(destinationPage, 'Patients file', 'HL7 V2', 'HL7 V2');

        // Destination configurations
        await populateAndAssertEndpointType(destinationPage.configurationsPage, 'File System');

        const destinationConfigurations = destinationPage.configurationsPage.detailPage;
        assertDestinationSftpEndpointConfigurations(destinationConfigurations);

        await destinationConfigurations.directoryPath.sendKeys('mnt/igia/test/receivedfromsftp');

        // Transformation to extract patient information
        const destinationTransformerPage = destinationPage.transformersPage;
        await populateAndAssertScript(
            destinationTransformerPage,
            'Add Transformer',
            'Extract only Patient id and ICD code 9',
            'Javascript',
            `var data = request.getBody()[0].toString();
             data = data.substring(1,data.length).split(',');
             result = [data[0], data[12]];`,
            1,
            'No Transformer found. Click'
        );

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

        it('should update to add advance fields and filters and response transformers', async () => {
            expect(await detailPage.editpageTitle.getText()).to.be.eq('Modify Data Pipeline');

            // Deploy data pipeline details
            detailPage.deploy.click();

            // Update source endpoint details
            const sourcePage = detailPage.sourcePage;
            await sourcePage.name.clear();
            await sourcePage.name.sendKeys('hl7 file Updated');

            const sourceConfigurations = sourcePage.configurationsPage.detailPage;
            assertSourceSftpEndpointConfigurations(sourceConfigurations);

            await sourceConfigurations.includeFilePattern.sendKeys('**/*.hl7');
            await sourceConfigurations.excludeFilePattern.sendKeys('**/encounter.json');
            await sourceConfigurations.sortFileCriteria.sendKeys('file:name');
            await sourceConfigurations.moveDirectory.sendKeys('public/integration/home/test/done');
            await sourceConfigurations.errorDirectory.sendKeys('public/integration/home/test/error');
            await sourceConfigurations.doneFileName.sendKeys('tmp');
            await sourceConfigurations.delay.sendKeys('3000000');
            await sourceConfigurations.initialDelay.sendKeys('1000');
            await sourceConfigurations.cronExpression.sendKeys('0/20+*+*+*+*+?');

            // adding a filter during update
            const sourceFilterPage = sourcePage.filtersPage;

            await populateAndAssertScript(
                sourceFilterPage,
                'Add Filter',
                'Patients who had high Blood Pressure',
                'Javascript',
                `request.getBody()[0][16] === 'ICD9_DGNS_CD_2' || request.getBody()[0][16] === 'V429'`,
                2
            );

            // Update destination endpoint details

            const destinationPage = detailPage.destinationPage;
            await destinationPage.name.clear();
            await destinationPage.name.sendKeys('Patients file Updated');
            const destinationConfigurations = destinationPage.configurationsPage.detailPage;

            await destinationConfigurations.fileName.sendKeys('patients1.json');
            await destinationConfigurations.doneFileName.sendKeys('tmp');

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
