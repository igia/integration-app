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
import { KeyValue } from '@angular/common';

import { EndpointType } from '../endpoint/endpoint-type.model';
import { EndpointRoleType } from '../endpoint/endpoint-role-type.model';
import { EndpointConfigurationAssociation } from './endpoint-configuration-association.model';
import { FormControl } from './form-control.model';

export abstract class ConfigurationMetadata<T> implements FormControl<T>, EndpointConfigurationAssociation {
    value?: T;
    key?: string;
    label?: KeyValue<string, string>[];
    order?: number;
    controlType?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    endpointType?: EndpointType;
    endpointRoleType?: EndpointRoleType;

    constructor(options: FormControl<T> & EndpointConfigurationAssociation = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || [{ key: 'en', value: this.key }];
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.required = !!options.required;
        this.minLength = options.minLength || 0;
        this.maxLength = options.maxLength || Number.MAX_SAFE_INTEGER;
        this.min = options.min || 0;
        this.max = options.max || Number.MAX_SAFE_INTEGER;
        this.pattern = options.pattern;

        this.endpointType = options.endpointType;
        this.endpointRoleType = options.endpointRoleType || EndpointRoleType.ALL;
    }
}
