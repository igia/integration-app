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
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as $ from 'jquery';

import { Pipeline, EndpointType, WorkerService, AuditMessageType } from 'app/shared';
import { DataPipelineService } from '../data-pipeline.service';
import { IntegrationWorkerService } from '../integration-worker-service.service';
import { DataPipelineControlService } from '../data-pipeline-control.service';

@Component({
    selector: 'igia-data-pipeline-detail',
    templateUrl: './data-pipeline-detail.component.html',
    styles: [
        `
        .igia-audit-field {
            height: 5.9rem !important;
        }
        `
    ]
})
export class DataPipelineDetailComponent implements OnInit, AfterViewInit {
    workerServices: WorkerService[];
    sourceEndpointTypes: EndpointType[];
    destinationEndpointTypes: EndpointType[];

    auditMessages: AuditMessageType[] = [AuditMessageType.ALL, AuditMessageType.ERROR, AuditMessageType.FILTERED];

    form: FormGroup;
    pipeline: Pipeline;
    isSaving: boolean;

    constructor(
        private dataPipelineService: DataPipelineService,
        private dataPipelineControlService: DataPipelineControlService,
        private integrationWorkerService: IntegrationWorkerService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.workerServices = [];
        this.sourceEndpointTypes = [EndpointType.MLLP, EndpointType.FILE, EndpointType.SFTP, EndpointType.HTTP];
        this.destinationEndpointTypes = [EndpointType.MLLP, EndpointType.FILE, EndpointType.SFTP, EndpointType.HTTP];

        this.activatedRoute.data.subscribe(({ dataPipeline }) => {
            this.pipeline = dataPipeline;
            this.form = this.dataPipelineControlService.toFormGroup(dataPipeline);

            if (this.pipeline.id && this.pipeline.deploy) {
                this.router.navigate(['/data-pipeline']);
            }
        });

        this.integrationWorkerService.query().subscribe((res: HttpResponse<WorkerService[]>) => (this.workerServices = res.body));
    }

    get destinations(): FormArray {
        return this.form.get('destinations') as FormArray;
    }

    get source(): FormGroup {
        return this.form.get('source') as FormGroup;
    }

    ngAfterViewInit() {
        $('igia-data-pipeline-detail').bootstrapMaterialDesign({});
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.form.value.id) {
            this.subscribeToSaveResponse(this.dataPipelineService.update(this.form.value));
        } else {
            this.subscribeToSaveResponse(this.dataPipelineService.create(this.form.value));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Pipeline>>) {
        result.subscribe((res: HttpResponse<Pipeline>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError(res));
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError(response: HttpErrorResponse) {
        this.isSaving = false;
    }

    trackWorkerService(index: number, item: WorkerService) {
        return item.name;
    }

    isCreateFlow(): boolean {
        return this.form.get('id').value === null;
    }
}
