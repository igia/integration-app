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
import { Moment } from 'moment';

import { DataType } from '../data-type/data-type.model';
import { Endpoint } from '../endpoint/endpoint.model';
import { EndpointConfiguration } from '../endpoint/endpoint-configuration.model';
import { EndpointType } from '../endpoint/endpoint-type.model';
import { Filter } from '../filter/filter.model';
import { Transformer } from '../transformer/transformer.model';

export class DataPipelineEndpoint implements Endpoint {
    constructor(
        public id?: number,
        public type?: EndpointType,
        public name?: string,
        public inDataType?: DataType,
        public outDataType?: DataType,
        public createdOn?: Moment,
        public createdBy?: string,
        public modifiedOn?: Moment,
        public modifiedBy?: string,
        public filters?: Filter[],
        public transformers?: Transformer[],
        public responseTransformers?: Transformer[],
        public configurations?: EndpointConfiguration[]
    ) {
        this.filters = this.filters || [];
        this.transformers = this.transformers || [];
        this.responseTransformers = this.responseTransformers || [];
        this.configurations = this.configurations || [];
    }
}
