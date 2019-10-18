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

import { SourceHttpConfigurationPage } from '../page-objects/data-pipeline/configurations/http/source-http-configuration.po';
import { DestinationHttpConfigurationPage } from '../page-objects/data-pipeline/configurations/http/destination-http-configuration.po';

// tslint:disable: no-unused-expression
export const assertSourceHttpEndpointConfigurations = async (sourceConfigurations: SourceHttpConfigurationPage) => {
    expect(await sourceConfigurations.hostName.isPresent()).to.be.true;
    expect(await sourceConfigurations.port.isPresent()).to.be.true;
    expect(await sourceConfigurations.resourceUri.isPresent()).to.be.true;
};

export const assertDestinationHttpEndpointConfigurations = async (destinationConfigurations: DestinationHttpConfigurationPage) => {
    expect(await destinationConfigurations.hostName.isPresent()).to.be.true;
    expect(await destinationConfigurations.port.isPresent()).to.be.true;
    expect(await destinationConfigurations.resourceUri.isPresent()).to.be.true;
    expect(await destinationConfigurations.httpMethod.isPresent()).to.be.true;
    expect(await destinationConfigurations.authMethod.isPresent()).to.be.true;
    expect(await destinationConfigurations.authUsername.isPresent()).to.be.true;
    expect(await destinationConfigurations.authPassword.isPresent()).to.be.true;
    expect(await destinationConfigurations.isSecure.isPresent()).to.be.true;
};
