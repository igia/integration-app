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
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Pipeline } from 'app/shared/model/data-pipeline/pipeline.model';
import { DataPipeline } from 'app/shared/model/data-pipeline/data-pipeline.model';
import { DataPipelineService } from './data-pipeline.service';

@Injectable({ providedIn: 'root' })
export class DataPipelineResolve implements Resolve<Pipeline> {
    constructor(private service: DataPipelineService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'];
        if (id) {
            return this.service.find(id).pipe(map((pipelineResponse: HttpResponse<Pipeline>) => pipelineResponse.body));
        }
        return of(new DataPipeline());
    }
}
