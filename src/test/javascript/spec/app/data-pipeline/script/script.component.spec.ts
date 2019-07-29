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
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ScriptType } from 'app/shared';
import { DataPipelineControlService } from 'app/data-pipeline/data-pipeline-control.service';
import { ScriptComponent } from 'app/data-pipeline/script/script.component';
import { IntegrationappTestModule } from '../../../test.module';

describe('Component Tests', () => {
    describe('ScriptComponent', () => {
        let comp: ScriptComponent;
        let fixture: ComponentFixture<ScriptComponent>;
        let modalService: NgbModal;
        let controlService: DataPipelineControlService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IntegrationappTestModule],
                declarations: [ScriptComponent],
                providers: [FormBuilder, NgbModal, DataPipelineControlService]
            })
                .overrideTemplate(ScriptComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ScriptComponent);
            comp = fixture.componentInstance;
            modalService = fixture.debugElement.injector.get(NgbModal);
            controlService = fixture.debugElement.injector.get(DataPipelineControlService);
        });

        it('should return no data alert', () => {
            // GIVEN
            comp.type = 'Filter';

            // WHEN
            const result = comp.noDataAlert();

            // THEN
            expect(result).toEqual([
                {
                    type: 'secondary',
                    msg: 'No Filter found. Click <strong>+</strong> to add Filter.',
                    timeout: 0
                }
            ]);
        });

        it(
            'should add filter/transformer script',
            fakeAsync(() => {
                // GIVEN
                comp.scripts = new FormArray([]);
                comp.type = 'Filter';
                const mockRef = {
                    componentInstance: {},
                    result: Promise.resolve(controlService.toScriptFormGroup({ data: 'test', type: ScriptType.JAVASCRIPT, order: 1 }))
                };
                spyOn(modalService, 'open').and.returnValue(mockRef);

                // WHEN
                comp.addOrUpdate();
                tick();

                // THEN
                expect(modalService.open).toHaveBeenCalled();
                expect(comp.scripts.length).toEqual(1);
            })
        );

        it(
            'should add filter/transformer script to non empty list',
            fakeAsync(() => {
                // GIVEN
                comp.scripts = new FormArray([controlService.toScriptFormGroup({ data: 'test', type: ScriptType.JAVASCRIPT, order: 1 })]);
                comp.type = 'Filter';
                const mockRef = {
                    componentInstance: {},
                    result: Promise.resolve(controlService.toScriptFormGroup({ data: 'test', type: ScriptType.JAVASCRIPT, order: 2 }))
                };
                spyOn(modalService, 'open').and.returnValue(mockRef);

                // WHEN
                comp.addOrUpdate();
                tick();

                // THEN
                expect(modalService.open).toHaveBeenCalled();
                expect(comp.scripts.length).toEqual(2);
            })
        );

        it(
            'should update existing filter/transformer script',
            fakeAsync(() => {
                // GIVEN
                comp.scripts = new FormArray([controlService.toScriptFormGroup({ data: 'test', type: ScriptType.JAVASCRIPT, order: 1 })]);
                comp.type = 'Transformer';
                const mockRef = {
                    componentInstance: {},
                    result: Promise.reject({})
                };
                spyOn(modalService, 'open').and.returnValue(mockRef);

                // WHEN
                comp.addOrUpdate(controlService.toScriptFormGroup({ data: 'test', type: ScriptType.JAVASCRIPT, order: 1 }));
                tick();

                // THEN
                expect(modalService.open).toHaveBeenCalled();
                expect(comp.scripts.length).toEqual(1);
            })
        );

        it('should delete an element from list', () => {
            // GIVEN
            comp.scripts = new FormArray([
                controlService.toScriptFormGroup({ data: 'test', type: ScriptType.JAVASCRIPT, order: 1 }),
                controlService.toScriptFormGroup({ data: 'test 2', type: ScriptType.JAVASCRIPT, order: 2 }),
                controlService.toScriptFormGroup({ data: 'test 3', type: ScriptType.JAVASCRIPT, order: 3 })
            ]);

            // WHEN
            comp.delete(2);

            // THEN
            expect(comp.scripts.length).toEqual(2);
        });

        it('should get unique control id', () => {
            // GIVEN
            comp.id = 'c';
            // THEN
            expect(comp.uniqueId(controlService.toScriptFormGroup({ data: 'test', type: ScriptType.JAVASCRIPT, order: 1 }))).toEqual('c1');
        });
    });
});
