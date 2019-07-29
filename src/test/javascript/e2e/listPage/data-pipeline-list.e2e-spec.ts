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
const path = require('path');
const glob = require('glob');
const fs = require('fs');
import { DataPipelineListPage } from '../page-objects/data-pipeline/data-pipeline-list.po';
import { loginUser, maximizeBrowser, getTableRowsCount, getMatchedTableRowsCount } from '../util';
import { assertDeleteDialogPage, assertImportDialogPage } from '../data-pipeline/data-pipeline-util';

describe('data pipeline list', () => {
    const listPage: DataPipelineListPage = new DataPipelineListPage();

    before(async () => {
        await loginUser('admin', 'admin');
        maximizeBrowser();
    });

    beforeEach(async () => {
        await browser.get('/');
    });

    // tslint:disable:no-unused-expression
    it('should get list page with no records.', async () => {
        expect(await listPage.pageTitle.getText()).to.eq('Data Pipelines');
        expect(await listPage.createButton.isEnabled()).to.be.true;
        expect(await listPage.exportAllButton.isEnabled()).to.be.true;
        expect(await listPage.importButton.isEnabled()).to.be.true;
        expect(await listPage.pageAlerts.isPresent()).to.be.true;
        expect(await listPage.getAlertText()).to.eq('No record found.');
    });

    describe('data pipeline Import and Export', () => {
        let fileName = '';
        let initialListCount;
        before(async () => {
            initialListCount = await getTableRowsCount(listPage.recordList);
        });

        after(async () => {
            await browser.get('/');
            fs.unlinkSync(fileName);
            const deleteDialogPage = await listPage.deleteRecord('DataPipeline_Sample');
            await assertDeleteDialogPage('DataPipeline_Sample', deleteDialogPage);
            await deleteDialogPage.deleteButton.click();
            expect(await deleteDialogPage.title.isPresent()).to.be.false;
            expect(await getTableRowsCount(listPage.recordList)).to.eq(initialListCount);
        });

        it('should import pipelines from JSON file', async () => {
            const fileToUpload = './import_data_pipeline.json';
            const absolutePathToFile = path.resolve(__dirname, fileToUpload);
            expect(await listPage.importButton.isEnabled()).to.be.true;
            const importDialogPage = await listPage.importDataPipelines();
            await assertImportDialogPage(importDialogPage);
            await importDialogPage.fileElement.sendKeys(absolutePathToFile);
            expect(await listPage.pageTitle.getText()).to.eq('Data Pipelines');
            const count = await getTableRowsCount(listPage.recordList);
            expect(count).to.be.eq(initialListCount + 1);
            expect(await getMatchedTableRowsCount(listPage.recordList, 'DataPipeline_Sample')).to.be.eq(1);
            expect(await listPage.readColumnText('DataPipeline_Sample', 2)).to.be.eq('Source_1');
            expect(await listPage.readColumnText('DataPipeline_Sample', 3)).to.be.eq('Destination_1');
        });

        describe('data pipeline Export function', () => {
            it('should export all data pipelines in json file', async () => {
                let filesArray;
                const exportFileNamePattern = '/data_pipelines_*.json';
                expect(await listPage.exportAllButton.isEnabled()).to.be.true;
                await listPage.exportAllButton.click();
                await browser.driver.wait(function() {
                    filesArray = glob.sync(browser.params.file_download_Path + exportFileNamePattern);
                    if (typeof filesArray !== 'undefined' && filesArray.length > 0) {
                        return filesArray;
                    }
                }, 5000);
                expect(filesArray.length).to.be.eq(1);
                fileName = filesArray[0];
                expect(fileName).to.containIgnoreCase('data_pipelines_');
                const exportedData = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf8' }));
                expect(exportedData.length).to.be.eq(initialListCount + 1);
                expect(await getMatchedTableRowsCount(listPage.recordList, exportedData[0].name)).to.be.eq(1);
                expect(exportedData[0].workerService).to.be.eq(await listPage.readColumnText(exportedData[0].name, 1));
                expect(exportedData[0].source.name).to.be.eq(await listPage.readColumnText(exportedData[0].name, 2));
                expect(exportedData[0].destinations.length).to.be.greaterThan(0);
                expect(exportedData[0].destinations[0].name).to.be.eq(await listPage.readColumnText(exportedData[0].name, 3));
            });
        });
    });
});
