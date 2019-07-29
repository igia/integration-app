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
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationappSharedModule } from 'app/shared';
import {
    dataPipelineRoutes,
    DataPipelineComponent,
    DataPipelineDetailComponent,
    EndpointComponent,
    ScriptDetailComponent,
    ScriptComponent,
    EndpointConfigurationComponent,
    EndpointConfigurationDetailComponent,
    DataPipelineDeleteModalComponent,
    DataPipelineImportModalComponent
} from '.';

@NgModule({
    imports: [IntegrationappSharedModule, RouterModule.forChild(dataPipelineRoutes)],
    declarations: [
        DataPipelineComponent,
        DataPipelineDetailComponent,
        EndpointComponent,
        ScriptDetailComponent,
        ScriptComponent,
        EndpointConfigurationComponent,
        EndpointConfigurationDetailComponent,
        DataPipelineDeleteModalComponent,
        DataPipelineImportModalComponent
    ],
    entryComponents: [DataPipelineDeleteModalComponent, DataPipelineImportModalComponent, ScriptDetailComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DataPipelineModule {}
