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
import { Route } from '@angular/router';

import { DataPipelineComponent } from '.';
import { UserRouteAccessService } from 'app/core';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { DataPipelineResolve } from './data-pipeline-resolve.service';
import { DataPipelineDetailComponent } from './data-pipeline-detail/data-pipeline-detail.component';

export const dataPipelineRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'data-pipeline'
    },
    {
        path: 'data-pipeline',
        component: DataPipelineComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            defaultSort: 'name,asc',
            pageTitle: 'dataPipeline.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'data-pipeline/new',
        component: DataPipelineDetailComponent,
        resolve: {
            dataPipeline: DataPipelineResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'dataPipeline.detail.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'data-pipeline/:id/edit',
        component: DataPipelineDetailComponent,
        resolve: {
            dataPipeline: DataPipelineResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'dataPipeline.detail.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
