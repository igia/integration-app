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

import { AuditMessageType } from './audit-message-type.model';
import { DataPipelineEndpoint } from './data-pipeline-endpoint.model';
import { DataPipelineState } from './data-pipeline-state.model';
import { Endpoint } from '../endpoint/endpoint.model';
import { Pipeline } from './pipeline.model';

export class DataPipeline implements Pipeline {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public deploy?: boolean,
        public version?: string,
        public state?: DataPipelineState,
        public reason?: string,
        public workerService?: string,
        public auditMessages?: AuditMessageType[],
        public createdOn?: Moment,
        public createdBy?: string,
        public modifiedOn?: Moment,
        public modifiedBy?: string,
        public source?: Endpoint,
        public destinations?: Endpoint[]
    ) {
        this.deploy = this.deploy || false;
        this.source = this.source || new DataPipelineEndpoint();
        this.destinations = this.destinations || [];
        this.auditMessages = this.auditMessages || [];
    }
}
