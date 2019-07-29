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
import { DataType } from '../data-type/data-type.model';
import { EndpointType } from './endpoint-type.model';
import { EndpointConfiguration } from './endpoint-configuration.model';
import { Filter } from '../filter/filter.model';
import { Transformer } from '../transformer/transformer.model';
import { Audit } from '../audit/audit.model';

export interface Endpoint extends Audit {
    id?: number;
    type?: EndpointType;
    name?: string;
    inDataType?: DataType;
    outDataType?: DataType;
    filters?: Filter[];
    transformers?: Transformer[];
    responseTransformers?: Transformer[];
    configurations?: EndpointConfiguration[];
}
