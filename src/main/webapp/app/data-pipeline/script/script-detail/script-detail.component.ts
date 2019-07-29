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
import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

import { ScriptType } from 'app/shared/model/script/script-type.model';

@Component({
    selector: 'igia-script-detail',
    templateUrl: './script-detail.component.html',
    styleUrls: ['./script-detail.scss']
})
export class ScriptDetailComponent implements AfterViewInit {
    @Input() editFlow: boolean;
    @Input() type: string;
    @Input() script: FormGroup;

    readonly scriptTypes: ScriptType[];
    @ViewChild('description') descriptionField: ElementRef;

    constructor(private activeModal: NgbActiveModal) {
        this.scriptTypes = [ScriptType.JAVASCRIPT];
    }

    ngAfterViewInit() {
        $('igia-script-detail').bootstrapMaterialDesign({});
    }

    dismiss(reason: string) {
        this.activeModal.dismiss(reason);
    }

    getTitle() {
        return `${this.editFlow ? 'Modify' : 'Add'} ${this.type}`;
    }

    save() {
        if (this.editFlow) {
            this.dismiss('updated');
        } else {
            this.activeModal.close(this.script);
        }
    }
}
