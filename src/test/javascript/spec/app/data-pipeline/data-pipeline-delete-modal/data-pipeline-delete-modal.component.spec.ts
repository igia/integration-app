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
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';

import { DataPipelineDeleteModalComponent } from 'app/data-pipeline/data-pipeline-delete-modal/data-pipeline-delete-modal.component';
import { DataPipelineService } from 'app/data-pipeline/data-pipeline.service';
import { IntegrationappTestModule } from '../../../test.module';

describe('Component Tests', () => {
    describe('Data Pipeline Delete Modal Component', () => {
        let comp: DataPipelineDeleteModalComponent;
        let fixture: ComponentFixture<DataPipelineDeleteModalComponent>;
        let service: DataPipelineService;
        let modal: NgbActiveModal;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IntegrationappTestModule],
                declarations: [DataPipelineDeleteModalComponent],
                providers: [NgbActiveModal]
            })
                .overrideTemplate(DataPipelineDeleteModalComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DataPipelineDeleteModalComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataPipelineService);
            modal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('delete data pipeline', () => {
            it(
                'should close modal when delete service call succeeds',
                async(() => {
                    // GIVEN
                    const idVal = 1234;
                    comp.pipeline = { id: idVal };

                    spyOn(service, 'delete').and.returnValue(of(new HttpResponse({ body: {} })));
                    spyOn(modal, 'close').and.callThrough();

                    // WHEN
                    comp.delete();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(idVal);
                    expect(modal.close).toHaveBeenCalled();
                    expect(comp.loaded).toEqual(true);
                })
            );

            it(
                'should dismiss modal when delete service call fails',
                async(() => {
                    // GIVEN
                    const idVal = 1234;
                    comp.pipeline = { id: idVal };

                    spyOn(service, 'delete').and.returnValue(throwError(new HttpErrorResponse({ status: 500 })));
                    spyOn(modal, 'dismiss').and.callThrough();

                    // WHEN
                    comp.delete();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(idVal);
                    expect(modal.dismiss).toHaveBeenCalled();
                    expect(comp.loaded).toEqual(true);
                })
            );
        });
    });
});
