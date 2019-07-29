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

import { SourceFileConfigurationPage } from '../configurations/file/source-file-configuration.po';
import { SourceSftpConfigurationPage } from '../configurations/sftp/source-sftp-configuration.po';
import { SourceHttpConfigurationPage } from '../configurations/http/source-http-configuration.po';
import { SourceMllpConfigurationPage } from '../configurations/mllp/source-mllp-configuration.po';

import { DestinationFileConfigurationPage } from '../configurations/file/destination-file-configuration.po';
import { DestinationSftpConfigurationPage } from '../configurations/sftp/destination-sftp-configuration.po';
import { DestinationHttpConfigurationPage } from '../configurations/http/destination-http-configuration.po';
import { DestinationMllpConfigurationPage } from '../configurations/mllp/destination-mllp-configuration.po';

import { selectDropdownOption } from '../../../util';

export class DataPipelineConfigurationPage {
    private prefix: string;
    private index: number;
    private sourceConfiguration: boolean;

    type: ElementFinder;
    detailPage: any;

    constructor(prefix: string, index?: number) {
        this.index = index || 0;
        this.prefix = prefix;
        this.type = element(by.id(`${this.prefix}${this.index}type`));
    }

    enableAsSourceConfiguration() {
        this.sourceConfiguration = true;
    }

    async selectType(option: string) {
        await selectDropdownOption(this.type, option);

        if (this.sourceConfiguration) {
            this.createSourceConfigurationsPage(option);
        } else {
            this.createDestinationConfigurationsPage(option);
        }
    }

    private createSourceConfigurationsPage(option: string) {
        switch (option) {
            case 'File System':
                this.detailPage = new SourceFileConfigurationPage(this.prefix, this.index);
                break;
            case 'Secure File Transfer Protocol (SFTP)':
                this.detailPage = new SourceSftpConfigurationPage(this.prefix, this.index);
                break;
            case 'Hypertext Transfer Protocol Secure (HTTPS)':
                this.detailPage = new SourceHttpConfigurationPage(this.prefix, this.index);
                break;
            case 'Minimal Low Layer Protocol (MLLP)':
                this.detailPage = new SourceMllpConfigurationPage(this.prefix, this.index);
                break;
        }
    }

    private createDestinationConfigurationsPage(option: string) {
        switch (option) {
            case 'File System':
                this.detailPage = new DestinationFileConfigurationPage(this.prefix, this.index);
                break;
            case 'Secure File Transfer Protocol (SFTP)':
                this.detailPage = new DestinationSftpConfigurationPage(this.prefix, this.index);
                break;
            case 'Hypertext Transfer Protocol Secure (HTTPS)':
                this.detailPage = new DestinationHttpConfigurationPage(this.prefix, this.index);
                break;
            case 'Minimal Low Layer Protocol (MLLP)':
                this.detailPage = new DestinationMllpConfigurationPage(this.prefix, this.index);
                break;
        }
    }
}
