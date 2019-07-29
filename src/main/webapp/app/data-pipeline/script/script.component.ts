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
import { Component, Input, Renderer2, ElementRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { DataPipelineControlService } from '../data-pipeline-control.service';
import { ScriptDetailComponent } from './script-detail/script-detail.component';

@Component({
    selector: 'igia-script',
    templateUrl: 'script.component.html',
    styleUrls: ['script.scss']
})
export class ScriptComponent {
    @Input() id: string;
    @Input() type: string;
    @Input() scripts: FormArray;

    draggedToElementId: string;
    draggedElementIndex = -1;

    constructor(
        private controlService: DataPipelineControlService,
        private modalService: NgbModal,
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {}

    noDataAlert(): any[] {
        return [
            {
                type: 'secondary',
                msg: `No ${this.type} found. Click <strong>+</strong> to add ${this.type}.`,
                timeout: 0
            }
        ];
    }

    addOrUpdate(existingScript?: FormGroup) {
        const modalRef: NgbModalRef = this.modalService.open(ScriptDetailComponent, { size: 'lg' });
        modalRef.componentInstance.script = existingScript || this.controlService.toScriptFormGroup({ order: this.getHighestOrder() + 1 });
        modalRef.componentInstance.type = this.type;
        modalRef.componentInstance.editFlow = existingScript ? true : false;
        modalRef.result.then((script: FormGroup) => this.scripts.push(script), () => {});
    }

    delete(index: number) {
        this.scripts.removeAt(index);
    }

    uniqueId(script: FormGroup) {
        return this.id + script.get('order').value;
    }

    drag($event: DragEvent, index: number): void {
        $event.dataTransfer.setData('index', `${index}`); // only for FF
        this.draggedElementIndex = index;
    }

    allowDrop($event): void {
        $event.preventDefault();
    }

    drop($event, dropElementId: string, dropElementIndex: number) {
        $event.preventDefault();

        this.removeDropContainerStyles(dropElementId);
        if (dropElementIndex !== this.draggedElementIndex) {
            const controlToMove = this.scripts.at(this.draggedElementIndex);
            this.scripts.removeAt(this.draggedElementIndex);
            this.scripts.insert(dropElementIndex, controlToMove);
            this.updateScriptsOrder();
        }
    }

    dragenter(elementId, index: number) {
        if (this.draggedToElementId) {
            this.removeDropContainerStyles(this.draggedToElementId);
        }
        this.draggedToElementId = elementId;

        if (this.draggedElementIndex !== index) {
            this.styleDropContainer(elementId);
        }
    }

    dragend() {
        this.draggedElementIndex = -1;
        if (this.draggedToElementId) {
            this.removeDropContainerStyles(this.draggedToElementId);
        }
    }

    private updateScriptsOrder(): void {
        for (let loopIndex = 0; loopIndex < this.scripts.length; loopIndex++) {
            this.scripts
                .at(loopIndex)
                .get('order')
                .setValue(loopIndex + 1);
        }
    }

    private styleDropContainer(elementId: string): void {
        const currentElement = this.elementRef.nativeElement.querySelector('#' + elementId);
        if (currentElement) {
            this.renderer.addClass(currentElement, 'drop-container');
        }
    }

    private removeDropContainerStyles(elementId: string): void {
        const existingElement = this.elementRef.nativeElement.querySelector('#' + elementId);
        if (existingElement) {
            this.renderer.removeClass(existingElement, 'drop-container');
        }
        this.draggedToElementId = undefined;
    }

    private getHighestOrder(): number {
        return this.scripts && this.scripts.length ? this.scripts.controls[this.scripts.length - 1].get('order').value : 0;
    }
}
