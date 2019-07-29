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
import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

import { ConfigurationMetadata } from 'app/shared';

@Component({
    selector: 'igia-endpoint-configuration',
    templateUrl: 'endpoint-configuration.component.html'
})
export class EndpointConfigurationComponent {
    @Input() id: string;
    @Input() configurations: FormArray;
    @Input() configurationsMetadata: ConfigurationMetadata<any>[];

    constructor() {}
}
