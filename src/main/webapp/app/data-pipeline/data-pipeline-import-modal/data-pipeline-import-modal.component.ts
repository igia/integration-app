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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProgressiveResponse } from 'app/shared/model/progressive-response';
import { DataPipelineService } from '../data-pipeline.service';

@Component({
    selector: 'igia-data-pipeline-import-modal',
    templateUrl: './data-pipeline-import-modal.component.html',
    styleUrls: ['./data-pipeline-import-modal.scss']
})
export class DataPipelineImportModalComponent implements OnInit, OnDestroy {
    progressCounter: number;
    isDropAreaActive: boolean;
    _cleanup: Subject<any> = new Subject<any>();

    constructor(private dataPipelineService: DataPipelineService, private activeModal: NgbActiveModal) {}

    ngOnInit() {
        this.progressCounter = 0;
        const dragenter: Observable<Event> = Observable.fromEvent(document.querySelector('.import'), 'dragenter');
        const dragleave: Observable<Event> = Observable.fromEvent(document.querySelector('.import'), 'dragleave');
        const dragover: Observable<Event> = Observable.fromEvent(document.querySelector('.import'), 'dragover');
        const drop: Observable<Event> = Observable.fromEvent(document.querySelector('.import'), 'drop');

        const docDragover: Observable<Event> = Observable.fromEvent(document, 'dragover');
        const docDrop: Observable<Event> = Observable.fromEvent(document, 'drop');

        dragenter.pipe(takeUntil(this._cleanup)).subscribe(() => (this.isDropAreaActive = true));

        dragleave.pipe(takeUntil(this._cleanup)).subscribe(() => (this.isDropAreaActive = false));

        dragover.pipe(takeUntil(this._cleanup)).subscribe(($event: DragEvent) => {
            this.preventDefaultEvents($event);
            this.isDropAreaActive = true;
        });

        docDrop.pipe(takeUntil(this._cleanup)).subscribe(this.preventDefaultEvents);

        docDragover.pipe(takeUntil(this._cleanup)).subscribe(this.preventDefaultEvents);

        drop.pipe(takeUntil(this._cleanup)).subscribe(($event: DragEvent) => {
            this.preventDefaultEvents($event);
            this.isDropAreaActive = false;
            this.importFiles($event.dataTransfer.files);
        });
    }

    ngOnDestroy() {
        this._cleanup.next();
        this._cleanup.complete();
    }

    isUploadInProgress() {
        return this.progressCounter > 0 && this.progressCounter < 100;
    }

    import($event: any) {
        this.importFiles($event.target.files);
    }

    dismiss(reason: string) {
        this.activeModal.dismiss(reason);
    }

    private importFiles(files: FileList) {
        const selectedFile: File = files && files.length ? files[0] : undefined;

        if (selectedFile) {
            this.dataPipelineService.import(selectedFile).subscribe(
                (progressResponse: ProgressiveResponse<HttpEvent<any>>) => {
                    this.progressCounter = progressResponse.progress === -1 ? this.progressCounter : progressResponse.progress;
                    if (progressResponse.response && progressResponse.response.type === HttpEventType.Response) {
                        this.activeModal.close();
                    }
                },
                error => {
                    this.dismiss('error');
                    this.progressCounter = 100;
                }
            );
        }
    }

    private preventDefaultEvents($event: DragEvent) {
        $event.preventDefault();
        $event.stopPropagation();
    }
}
