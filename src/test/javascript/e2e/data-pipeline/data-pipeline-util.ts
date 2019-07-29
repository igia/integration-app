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
import { browser, ElementFinder, ExpectedConditions as EC } from 'protractor';
import { expect } from 'chai';

import { DataPipelineDetailPage } from '../page-objects/data-pipeline/data-pipeline-detail.po';
import { DataPipelineListPage } from '../page-objects/data-pipeline/data-pipeline-list.po';

import { DataPipelineScriptPage } from '../page-objects/data-pipeline/scripts/data-pipeline-script-po';
import { DataPipelineDeleteDialogPage } from '../page-objects/data-pipeline/data-pipeline-delete-dialog.po';
import { EndpointPage } from '../page-objects/data-pipeline/endpoint/endpoint.po';
import { DataPipelineConfigurationPage } from '../page-objects/data-pipeline/configurations/data-pipeline-configuration.po';
import {
    getDropdownOptionsCount,
    isDropdownOptionPresent,
    getTableRowsCount,
    getMatchedTableRowsCount,
    selectDropdownOption,
    getSelectedDropdownOption
} from '../util';
import { DataPipelineImportDialogPage } from '../page-objects/data-pipeline/data-pipeline-import-dialog.po';
import { stat } from 'fs';

// tslint:disable: no-unused-expression
export const assertDataTypeDropDownOptions = async (dataType: ElementFinder) => {
    expect(await getDropdownOptionsCount(dataType)).to.be.eq(5);
    expect(await isDropdownOptionPresent(dataType, 'HL7 V2')).to.be.true;
    expect(await isDropdownOptionPresent(dataType, 'CSV')).to.be.true;
    expect(await isDropdownOptionPresent(dataType, 'JSON')).to.be.true;
    expect(await isDropdownOptionPresent(dataType, 'RAW')).to.be.true;
};

export const assertWorkerServiceDropdownOptions = async (workerService: ElementFinder) => {
    expect(await getDropdownOptionsCount(workerService)).to.be.eq(2);
    expect(await isDropdownOptionPresent(workerService, 'Select Integration worker to deploy pipeline')).to.be.true;
    expect(await isDropdownOptionPresent(workerService, 'INTEGRATIONWORKER-I')).to.be.true;
};

export const toggleScriptSection = async (scriptPage: DataPipelineScriptPage, expectedText?: string) => {
    await scriptPage.title.click();
    expect(await scriptPage.addButton.isEnabled()).to.be.true;

    if (expectedText) {
        expect(await scriptPage.noRecords.isPresent()).to.be.true;
        expect(await scriptPage.noRecords.getText()).to.contain(expectedText);
    }
};

export const assertScriptRecords = async (scriptPage: DataPipelineScriptPage, expectedCount: number, expectedDescription: string) => {
    expect(await scriptPage.titleCount.getText()).to.be.eq(`${expectedCount}`);
    expect(await getTableRowsCount(scriptPage.recordList)).to.be.eq(expectedCount);
    expect(await getMatchedTableRowsCount(scriptPage.recordList, expectedDescription)).to.be.eq(1);
};

export const assertDeleteDialogPage = async (dataPipelineName: string, deleteDialogPage: DataPipelineDeleteDialogPage) => {
    expect(await deleteDialogPage.title.getText()).to.be.eq('Confirm Data Pipeline deletion');
    expect(await deleteDialogPage.content.getText()).to.be.contains('Are you sure you want to delete ');
    expect(await deleteDialogPage.confirmationName.getText()).to.be.eq(dataPipelineName);
    expect(await deleteDialogPage.cancelButton.isEnabled()).to.be.true;
    expect(await deleteDialogPage.deleteButton.isEnabled()).to.be.true;
};

export const populateAndAssertWorkerService = async (detailPage: DataPipelineDetailPage, workerServiceName: string) => {
    await assertWorkerServiceDropdownOptions(detailPage.workerService);
    await selectDropdownOption(detailPage.workerService, workerServiceName);
    expect(await getSelectedDropdownOption(detailPage.workerService)).to.be.eq(workerServiceName);
};

export const populateAndAssertEndpoint = async (endPointPage: EndpointPage, name: string, inDataType: string, outDataType: string) => {
    await endPointPage.name.sendKeys(name);

    // assert supported data type drop down options
    await assertDataTypeDropDownOptions(endPointPage.inDataType);

    await selectDropdownOption(endPointPage.inDataType, inDataType);
    expect(await getSelectedDropdownOption(endPointPage.inDataType)).to.be.eq(inDataType);

    await assertDataTypeDropDownOptions(endPointPage.outDataType);
    // assert that out data type is auto selected based on in data type
    expect(await getSelectedDropdownOption(endPointPage.outDataType)).to.be.eq(outDataType);
};

export const populateAndAssertEndpointType = async (configurationPage: DataPipelineConfigurationPage, endPointType: string) => {
    expect(await isDropdownOptionPresent(configurationPage.type, endPointType)).to.be.true;
    await configurationPage.selectType(endPointType);
    expect(await getSelectedDropdownOption(configurationPage.type)).to.be.eq(endPointType);
};

export const populateAndAssertScript = async (
    scriptPage: DataPipelineScriptPage,
    modalTitle: string,
    scriptName: string,
    scriptType: string,
    script: string,
    expectedScriptsCount: number,
    expectedTextOnScriptPage?: string
) => {
    await toggleScriptSection(scriptPage, expectedTextOnScriptPage);
    await scriptPage.addButton.click();
    const scriptDetailPage = scriptPage.detailPage;
    browser.wait(EC.visibilityOf(scriptDetailPage.title), 2000, 'Dialog not visible after wait of 5 seconds').catch(() => {});
    expect(await scriptDetailPage.title.getText()).to.be.eq(modalTitle);
    expect(await scriptDetailPage.saveButton.isEnabled()).to.be.false;
    await scriptDetailPage.populateFields(scriptName, scriptType, script);
    expect(await scriptDetailPage.saveButton.isEnabled()).to.be.true;
    await scriptDetailPage.saveButton.click();

    await assertScriptRecords(scriptPage, expectedScriptsCount, scriptName);
};

// tslint:disable: no-unused-expression
export const assertHttpMethodDropDownOptions = async (httpMethod: ElementFinder) => {
    expect(await getDropdownOptionsCount(httpMethod)).to.be.eq(4);
    expect(await isDropdownOptionPresent(httpMethod, 'GET')).to.be.true;
    expect(await isDropdownOptionPresent(httpMethod, 'PUT')).to.be.true;
    expect(await isDropdownOptionPresent(httpMethod, 'POST')).to.be.true;
    expect(await isDropdownOptionPresent(httpMethod, 'DELETE')).to.be.true;
};

export const assertImportDialogPage = async (importDialogPage: DataPipelineImportDialogPage) => {
    expect(await importDialogPage.title.getText()).to.be.eq('Import Data Pipelines');
    expect(await importDialogPage.cancelButton.isEnabled()).to.be.true;
    expect(await importDialogPage.chooseFileButton.isPresent()).to.be.true;
};

export const assertDataPipelineStatus = async (
    dataPipelineName: string,
    position: number,
    currentStatus: string,
    expectedStatus: string
) => {
    const listPage: DataPipelineListPage = new DataPipelineListPage();
    const maxAttempts = 10;

    for (let i = 0; i <= maxAttempts; i++) {
        await listPage.refreshButton.click();
        const status = await listPage.readColumnText(dataPipelineName, position);

        if (status === expectedStatus) {
            break;
        }

        if (status !== currentStatus) {
            break;
        }

        await browser.sleep(5000);
    }
    expect(await listPage.readColumnText(dataPipelineName, 5)).to.be.eq(expectedStatus);
};
