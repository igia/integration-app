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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ScriptType } from 'app/shared';
import { DataPipelineControlService } from 'app/data-pipeline/data-pipeline-control.service';
import { ScriptDetailComponent } from 'app/data-pipeline/script/script-detail/script-detail.component';
import { IntegrationappTestModule } from '../../../../test.module';

describe('Component Tests', () => {
    describe('ScriptDetailComponent', () => {
        let comp: ScriptDetailComponent;
        let fixture: ComponentFixture<ScriptDetailComponent>;
        let modal: NgbActiveModal;
        let controlService: DataPipelineControlService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IntegrationappTestModule],
                declarations: [ScriptDetailComponent],
                providers: [FormBuilder, NgbActiveModal, DataPipelineControlService]
            })
                .overrideTemplate(ScriptDetailComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ScriptDetailComponent);
            comp = fixture.componentInstance;
            modal = fixture.debugElement.injector.get(NgbActiveModal);
            controlService = fixture.debugElement.injector.get(DataPipelineControlService);
        });

        it('should check initial state', () => {
            // THEN
            expect(comp.scriptTypes.length).toEqual(1);
            expect(comp.scriptTypes).toContainEqual(ScriptType.JAVASCRIPT);
        });

        it('should get update title when editFlow is true', () => {
            // GIVEN
            comp.editFlow = true;
            comp.type = 'Filter';

            // THEN
            expect(comp.getTitle()).toEqual('Modify Filter');
        });

        it('should get create title when editFlow is false', () => {
            // GIVEN
            comp.editFlow = false;
            comp.type = 'Filter';

            // THEN
            expect(comp.getTitle()).toEqual('Add Filter');
        });

        it('should return script object when editFlow is false', () => {
            // GIVEN
            comp.script = controlService.toScriptFormGroup();
            comp.editFlow = false;
            comp.type = 'Filter';
            spyOn(modal, 'close').and.callThrough();
            spyOn(modal, 'dismiss').and.callThrough();

            // WHEN
            comp.save();

            // THEN
            expect(modal.dismiss).not.toHaveBeenCalled();
            expect(modal.close).toHaveBeenCalled();
            expect(modal.close).toHaveBeenCalledWith(comp.script);
        });

        it('should not return script object when editFlow is true', () => {
            // GIVEN
            comp.script = controlService.toScriptFormGroup();
            comp.editFlow = true;
            comp.type = 'Filter';
            spyOn(modal, 'close').and.callThrough();
            spyOn(modal, 'dismiss').and.callThrough();

            // WHEN
            comp.save();

            // THEN
            expect(modal.dismiss).toHaveBeenCalled();
            expect(modal.close).not.toHaveBeenCalled();
        });

        it('should check initial script object validations', () => {
            // GIVEN
            comp.script = controlService.toScriptFormGroup();
            // THEN
            const script = comp.script['controls'];
            expect(script['type'].valid).toBeTruthy();
            expect(script['order'].valid).toBeTruthy();
            expect(script['data'].valid).toBeFalsy();
            expect(script['description'].valid).toBeTruthy();
        });
    });
});
