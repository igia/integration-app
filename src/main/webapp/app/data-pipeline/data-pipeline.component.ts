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
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiParseLinks, JhiAlertService, JhiEventManager, JhiAlert } from 'ng-jhipster';
import * as $ from 'jquery';

import { ITEMS_PER_PAGE, DataPipelineState } from 'app/shared';
import { Pipeline } from 'app/shared/model/data-pipeline/pipeline.model';
import { ProgressiveResponse } from 'app/shared/model/progressive-response';
import { DataPipelineService } from './data-pipeline.service';
import { DataPipelineDeleteModalComponent } from './data-pipeline-delete-modal/data-pipeline-delete-modal.component';
import { DataPipelineImportModalComponent } from './data-pipeline-import-modal/data-pipeline-import-modal.component';

@Component({
    selector: 'igia-data-pipeline',
    templateUrl: './data-pipeline.component.html',
    styleUrls: ['./data-pipeline.scss']
})
export class DataPipelineComponent implements OnInit, OnDestroy, AfterViewInit {
    dataPipelines: Pipeline[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    loaded = false;
    progressCounter: number;

    @ViewChild('exportLink') exportLink: ElementRef;

    constructor(
        private dataPipelineService: DataPipelineService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private modalService: NgbModal
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            if (data.pagingParams) {
                this.page = data.pagingParams.page;
                this.previousPage = data.pagingParams.page;
                this.reverse = data.pagingParams.ascending;
                this.predicate = data.pagingParams.predicate;
            }
        });
    }

    loadAll() {
        this.loaded = false;
        this.dataPipelineService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<Pipeline[]>) => this.paginateDataPipelines(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res)
            );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/data-pipeline'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate([
            '/data-pipeline',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    ngOnInit() {
        this.progressCounter = 0;
        this.loadAll();
        this.registerChangeInDataPipelines();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    ngAfterViewInit() {
        $('igia-data-pipeline').bootstrapMaterialDesign({});
    }

    trackId(index: number, item: Pipeline) {
        return item.id;
    }

    registerChangeInDataPipelines() {
        this.eventSubscriber = this.eventManager.subscribe('dataPipelineListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    updatePipelineDeployment(dataPipelineId: number) {
        this.loaded = false;
        this.dataPipelineService
            .update(this.dataPipelines.find((pipeline: Pipeline) => pipeline.id === dataPipelineId))
            .subscribe(null, () => this.loadAll(), () => this.loadAll());
    }

    getClassByState(state: DataPipelineState): string[] {
        const classes = ['badge'];
        switch (state) {
            case DataPipelineState.READY:
                classes.push('badge-primary');
                break;
            case DataPipelineState.FAILED:
                classes.push('badge-danger');
                break;
            case DataPipelineState.STOPPING:
                classes.push('badge-secondary');
                classes.push('progress-bar-striped');
                classes.push('progress-bar-animated');
                break;
            case DataPipelineState.STOPPED:
                classes.push('badge-secondary');
                break;
            case DataPipelineState.STARTING:
                classes.push('badge-success');
                classes.push('progress-bar-striped');
                classes.push('progress-bar-animated');
                break;
            default:
                classes.push('badge-success');
        }
        return classes;
    }

    getDeploymentAction(deploy: boolean): string {
        return deploy ? 'dataPipeline.actions.undeploy' : 'dataPipeline.actions.deploy';
    }

    getUpdateTooltip(deploy: boolean): string {
        return deploy ? 'dataPipeline.actions.update.disabled' : '';
    }

    getDeleteTooltip(deploy: boolean): string {
        return deploy ? 'dataPipeline.actions.delete.disabled' : '';
    }

    private paginateDataPipelines(data: Pipeline[], headers: HttpHeaders) {
        this.loaded = true;
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.dataPipelines = data;
    }

    private onError(errorResponse: HttpErrorResponse) {
        this.loaded = true;
    }

    deleteDataPipeline(dataPipelineId: number) {
        const modalRef: NgbModalRef = this.modalService.open(DataPipelineDeleteModalComponent, { backdrop: 'static' });
        modalRef.componentInstance.pipeline = this.dataPipelines.find((pipeline: Pipeline) => pipeline.id === dataPipelineId);
        modalRef.result.then(() => this.loadAll(), () => {});
    }

    openImportDialog() {
        const modalRef: NgbModalRef = this.modalService.open(DataPipelineImportModalComponent, { centered: true });
        modalRef.result.then(() => this.loadAll(), () => {});
    }

    export(id: number) {
        this.dataPipelineService.export(id).subscribe((response: HttpResponse<Blob>) => this.saveFile(response, id));
    }

    exportAll() {
        this.progressCounter = 0;
        this.dataPipelineService.exportAll().subscribe(
            (progressResponse: ProgressiveResponse<HttpEvent<Blob>>) => {
                this.progressCounter = progressResponse.progress === -1 ? this.progressCounter : progressResponse.progress;
                if (progressResponse.response && progressResponse.response.type === HttpEventType.Response) {
                    this.saveFile(progressResponse.response);
                }
            },
            error => {
                this.progressCounter = 100;
            }
        );
    }

    isDownloadInProgress() {
        return this.progressCounter > 0 && this.progressCounter < 100;
    }

    private saveFile(response: HttpResponse<Blob>, id?: number) {
        let url: string, link: HTMLAnchorElement;
        try {
            url = URL.createObjectURL(response.body);
            link = this.exportLink.nativeElement;
            link.href = url;
            link.download =
                this.extractFilenameFromHeader(response.headers.get('content-disposition')) || `data_pipeline${id ? '_' + id : ''}`;
            link.click();
        } finally {
            URL.revokeObjectURL(url);
            if (link) {
                link.href = '';
                link.download = '';
            }
        }
    }

    private extractFilenameFromHeader(contentDisposition: string): string {
        if (contentDisposition && contentDisposition.indexOf('filename') !== -1) {
            const filenameRegex = /filename\s*=\s*['"]+(.*)['"]+/;
            const matchResults: RegExpExecArray = filenameRegex.exec(contentDisposition);
            if (matchResults !== null && matchResults.length && matchResults[1]) {
                return matchResults[1];
            }
        }
        return undefined;
    }

    noDataAlert(): JhiAlert[] {
        return [
            {
                type: 'info',
                msg: 'No record found.',
                params: undefined,
                timeout: 0,
                toast: false,
                scoped: true
            }
        ];
    }
}
