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

import { SourceFileConfigurationPage } from '../page-objects/data-pipeline/configurations/file/source-file-configuration.po';
import { DestinationFileConfigurationPage } from '../page-objects/data-pipeline/configurations/file/destination-file-configuration.po';

// tslint:disable: no-unused-expression
export const assertSourceFileEndpointConfigurations = async (sourceConfigurations: SourceFileConfigurationPage) => {
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

export const assertDestinationFileEndpointConfigurations = async (destinationConfigurations: DestinationFileConfigurationPage) => {
    expect(await destinationConfigurations.directoryPath.isPresent()).to.be.true;
    expect(await destinationConfigurations.fileName.isPresent()).to.be.true;
    expect(await destinationConfigurations.doneFileName.isPresent()).to.be.true;
};
