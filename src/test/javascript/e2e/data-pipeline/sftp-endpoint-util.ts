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
import { expect } from 'chai';

import { SourceSftpConfigurationPage } from '../page-objects/data-pipeline/configurations/sftp/source-sftp-configuration.po';
import { DestinationSftpConfigurationPage } from '../page-objects/data-pipeline/configurations/sftp/destination-sftp-configuration.po';

// tslint:disable: no-unused-expression
export const assertSourceSftpEndpointConfigurations = async (sourceConfigurations: SourceSftpConfigurationPage) => {
    expect(await sourceConfigurations.hostName.isPresent()).to.be.true;
    expect(await sourceConfigurations.port.isPresent()).to.be.true;
    expect(await sourceConfigurations.userName.isPresent()).to.be.true;
    expect(await sourceConfigurations.passWord.isPresent()).to.be.true;
    expect(await sourceConfigurations.directoryPath.isPresent()).to.be.true;
    expect(await sourceConfigurations.fileName.isPresent()).to.be.true;
    expect(await sourceConfigurations.includeFilePattern.isPresent()).to.be.true;
    expect(await sourceConfigurations.excludeFilePattern.isPresent()).to.be.true;
    expect(await sourceConfigurations.sortFileCriteria.isPresent()).to.be.true;
    expect(await sourceConfigurations.moveDirectory.isPresent()).to.be.true;
    expect(await sourceConfigurations.errorDirectory.isPresent()).to.be.true;
    expect(await sourceConfigurations.doneFileName.isPresent()).to.be.true;
    expect(await sourceConfigurations.delay.isPresent()).to.be.true;
    expect(await sourceConfigurations.initialDelay.isPresent()).to.be.true;
    expect(await sourceConfigurations.cronExpression.isPresent()).to.be.true;
};

export const assertDestinationSftpEndpointConfigurations = async (destinationConfigurations: DestinationSftpConfigurationPage) => {
    expect(await destinationConfigurations.hostName.isPresent()).to.be.true;
    expect(await destinationConfigurations.port.isPresent()).to.be.true;
    expect(await destinationConfigurations.userName.isPresent()).to.be.true;
    expect(await destinationConfigurations.passWord.isPresent()).to.be.true;
    expect(await destinationConfigurations.directoryPath.isPresent()).to.be.true;
    expect(await destinationConfigurations.fileName.isPresent()).to.be.true;
    expect(await destinationConfigurations.doneFileName.isPresent()).to.be.true;
};
