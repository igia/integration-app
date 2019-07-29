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
import {
    loginUser,
    maximizeBrowser,
    getTableRowsCount,
    getMatchedTableRowsCount,
    selectDropdownOption,
    getSelectedDropdownOption
} from '../util';
import {
    assertDeleteDialogPage,
    populateAndAssertWorkerService,
    populateAndAssertEndpoint,
    populateAndAssertEndpointType,
    populateAndAssertScript,
    assertHttpMethodDropDownOptions,
    assertDataPipelineStatus
} from './data-pipeline-util';

import { assertSourceHttpEndpointConfigurations, assertDestinationHttpEndpointConfigurations } from './http-endpoint-util';

describe('create http to http data pipeline', () => {
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
        dataPipelineName = 'json-data' + randVal;
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

    it('should create data pipeline with http as source endpoint and http as destination endpoint passing JSON messages', async () => {
        expect(await detailPage.pageTitle.getText()).to.be.eq('Create Data Pipeline');

        // enter data pipeline details
        detailPage.populateFields(dataPipelineName, 'This interface receives a HL7 file. It then filters patients and create a HL7 file.');

        // Select and assert worker service
        await populateAndAssertWorkerService(detailPage, 'INTEGRATIONWORKER-I');

        // Enter source endpoint details
        const sourcePage = detailPage.sourcePage;
        await populateAndAssertEndpoint(sourcePage, 'Json file', 'JSON', 'JSON');

        // Source configurations
        await populateAndAssertEndpointType(sourcePage.configurationsPage, 'Hypertext Transfer Protocol Secure (HTTPS)');

        const sourceConfigurations = sourcePage.configurationsPage.detailPage;
        assertSourceHttpEndpointConfigurations(sourceConfigurations);

        await sourceConfigurations.hostName.sendKeys('localhost');
        await sourceConfigurations.port.sendKeys('12000');
        await sourceConfigurations.resourceUri.sendKeys('/');
        await sourceConfigurations.userName.sendKeys('admin');
        await sourceConfigurations.password.sendKeys('passpass');

        // Transformation to extract patient information
        const sourceTransformerPage = sourcePage.transformersPage;
        await populateAndAssertScript(
            sourceTransformerPage,
            'Add Transformer',
            'Add transformer that adds a property to the incoming json',
            'Javascript',
            `content=request.getBody();content['isTransformedAtSource']=true;result=content;`,
            1,
            'No Transformer found. Click'
        );

        // Destination
        const destinationPage = detailPage.destinationPage;
        await populateAndAssertEndpoint(destinationPage, 'Json file', 'JSON', 'JSON');

        // Destination configurations
        await populateAndAssertEndpointType(destinationPage.configurationsPage, 'Hypertext Transfer Protocol Secure (HTTPS)');

        const destinationConfigurations = destinationPage.configurationsPage.detailPage;
        assertDestinationHttpEndpointConfigurations(destinationConfigurations);

        await destinationConfigurations.hostName.sendKeys('localhost');
        await destinationConfigurations.port.sendKeys('3000');
        await destinationConfigurations.resourceUri.sendKeys('/demo');

        // assert supported data type drop down options
        await assertHttpMethodDropDownOptions(destinationConfigurations.httpMethod);
        await selectDropdownOption(destinationConfigurations.httpMethod, 'POST');
        expect(await getSelectedDropdownOption(destinationConfigurations.httpMethod)).to.be.eq(' POST ');

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

        it('should update to add response transformers', async () => {
            expect(await detailPage.editpageTitle.getText()).to.be.eq('Modify Data Pipeline');

            // Deploy data pipeline details
            detailPage.deploy.click();

            // Update source endpoint details
            const sourcePage = detailPage.sourcePage;
            await sourcePage.name.clear();
            await sourcePage.name.sendKeys('Json file Updated');

            // Update to add response transformer

            const destinationPage = detailPage.destinationPage;
            const destinationResponseTransformerPage = destinationPage.responseTransformersPage;
            await populateAndAssertScript(
                destinationResponseTransformerPage,
                'Add Transformer',
                'Received response',
                'Javascript',
                `content=request.getBody();content['isDeployed']=true;result=content;`,
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
            expect(await listPage.readColumnText(dataPipelineName, 2)).to.be.eq('Json file Updated');
            expect(await listPage.readColumnText(dataPipelineName, 3)).to.be.eq('Json file');
        });

        it('should undeploy data pipeline from list', async () => {
            expect(await listPage.readColumnText(dataPipelineName, 5)).to.be.eq('STARTED');
            await listPage.toggleDataPipelineDeployment(dataPipelineName, 6);
            await assertDataPipelineStatus(dataPipelineName, 5, 'STOPPING', 'STOPPED');
        });
    });
});
