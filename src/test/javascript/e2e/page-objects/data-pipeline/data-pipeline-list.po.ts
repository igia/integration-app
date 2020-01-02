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
import { element, by, ElementFinder, browser, ExpectedConditions as EC } from 'protractor';

import { DataPipelineDeleteDialogPage } from './data-pipeline-delete-dialog.po';
import { DataPipelineImportDialogPage } from './data-pipeline-import-dialog.po';
import { getTableRowByColumnText } from '../../util';

export class DataPipelineListPage {
    pageTitle = element(by.css('#igia-page-heading [jhitranslate="dataPipeline.home.title"]'));
    createButton = element(by.css('#igia-page-heading [icon ="plus"]'));
    importButton = element(by.css('#igia-page-heading [icon ="file-import"]'));
    exportAllButton = element(by.css('#igia-page-heading [icon ="file-export"]'));
    refreshButton = element(by.css('#igia-page-heading [icon ="sync-alt"]'));

    pageAlerts = element(by.css('.alert'));
    recordList = element(by.css('#igia-page table'));

    paginationLabel = element(by.css('#igia-page-body .jhi-item-count span'));
    activePaginationLink = element(by.css('#igia-page-body .page-item.active .page-link'));

    async getAlertText() {
        return await this.pageAlerts.element(by.tagName('p')).getText();
    }

    async closeAlert() {
        await this.pageAlerts.element(by.css('.close')).click();
    }

    async clickActionMenu(uniqueText: string): Promise<ElementFinder> {
        const matchedRecords = await getTableRowByColumnText(this.recordList, uniqueText);
        const menuOption = await matchedRecords[0].element(by.css('td #lr1'));
        await menuOption.click();
        const menuList = matchedRecords[0].element(by.css('td #lr1 + [aria-labelledby="lr1"]'));
        browser.wait(EC.visibilityOf(menuList), 9000, 'Action menu not visible after wait of 9 seconds').catch(() => {});
        return menuList;
    }

    async deleteRecord(uniqueText: string): Promise<DataPipelineDeleteDialogPage> {
        const menuList: ElementFinder = await this.clickActionMenu(uniqueText);
        await browser.wait(EC.visibilityOf(menuList), 9000, 'Delete option not visible after wait of 9 seconds').catch(() => {});
        await menuList.element(by.css('[icon="trash-alt"]')).click();
        return new DataPipelineDeleteDialogPage();
    }

    async editRecord(uniqueText: string) {
        const menuList = await this.clickActionMenu(uniqueText);
        await menuList.element(by.css('[icon="pencil-alt"]')).click();
    }
    async exportRecord(uniqueText: string) {
        const menuList = await this.clickActionMenu(uniqueText);
        await menuList.element(by.css('[icon="file-export"]')).click();
    }

    async readColumnText(uniqueText: string, position: number) {
        const rows = await getTableRowByColumnText(this.recordList, uniqueText);
        const firstColumn = await rows[0].all(by.css('td')).get(position);
        return await firstColumn.getText();
    }

    async importDataPipelines(): Promise<DataPipelineImportDialogPage> {
        await this.importButton.click();
        return new DataPipelineImportDialogPage();
    }

    async toggleDataPipelineDeployment(uniqueText: string, position: number) {
        const rows = await getTableRowByColumnText(this.recordList, uniqueText);
        await rows[0]
            .all(by.css('td'))
            .get(position)
            .click();
    }
}
