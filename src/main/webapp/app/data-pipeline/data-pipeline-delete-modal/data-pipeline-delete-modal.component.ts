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
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Pipeline } from 'app/shared/model/data-pipeline/pipeline.model';
import { DataPipelineService } from '../data-pipeline.service';

@Component({
    selector: 'igia-data-pipeline-delete-modal',
    templateUrl: './data-pipeline-delete-modal.component.html'
})
export class DataPipelineDeleteModalComponent {
    @Input() pipeline: Pipeline;
    loaded = true;

    constructor(private dataPipelineService: DataPipelineService, private activeModal: NgbActiveModal) {}

    dismiss(reason: string) {
        this.activeModal.dismiss(reason);
    }

    delete() {
        this.loaded = false;
        this.dataPipelineService.delete(this.pipeline.id).subscribe(
            () => {
                this.activeModal.close();
                this.loaded = true;
            },
            () => {
                this.dismiss('error');
                this.loaded = true;
            }
        );
    }
}
