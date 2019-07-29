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
import { HttpResponse, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { NgbActiveModal, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { of, throwError } from 'rxjs';

import { DataPipelineImportModalComponent } from 'app/data-pipeline/data-pipeline-import-modal/data-pipeline-import-modal.component';
import { DataPipelineService } from 'app/data-pipeline/data-pipeline.service';
import { IntegrationappTestModule } from '../../../test.module';

describe('Component Tests', () => {
    describe('Data Pipeline Import Modal Component', () => {
        let comp: DataPipelineImportModalComponent;
        let fixture: ComponentFixture<DataPipelineImportModalComponent>;
        let service: DataPipelineService;
        let modal: NgbActiveModal;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IntegrationappTestModule],
                declarations: [DataPipelineImportModalComponent, NgbProgressbar, FaIconComponent],
                providers: [NgbActiveModal]
            }).compileComponents();

            fixture = TestBed.createComponent(DataPipelineImportModalComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataPipelineService);
            modal = fixture.debugElement.injector.get(NgbActiveModal);

            library.add(faTimes, faFileUpload);
        });

        it('should return false when no uploads in progress.', () => {
            expect(comp.isUploadInProgress()).toBeFalsy();
        });

        it('should return true if any upload in progress.', () => {
            comp.progressCounter = 5;
            expect(comp.isUploadInProgress()).toBeTruthy();
        });

        describe('import data pipelines', () => {
            it(
                'should close modal when import service call succeeds',
                async(() => {
                    // GIVEN
                    const event = { target: { files: [new File([], 'test')] } };

                    spyOn(service, 'import').and.returnValue(of({ progress: 100, response: new HttpResponse({ body: {} }) }));
                    spyOn(modal, 'close').and.callThrough();

                    // WHEN
                    fixture.detectChanges();
                    comp.import(event);

                    // THEN
                    expect(service.import).toHaveBeenCalled();
                    expect(modal.close).toHaveBeenCalled();
                })
            );

            it(
                'should not take any action in case user has not selected file',
                async(() => {
                    // GIVEN
                    const event = { target: { files: [] } };

                    spyOn(service, 'import').and.returnValue(of({ progress: 100, response: new HttpResponse({ body: {} }) }));
                    spyOn(modal, 'close').and.callThrough();

                    // WHEN
                    comp.import(event);

                    // THEN
                    expect(service.import).not.toHaveBeenCalled();
                    expect(modal.close).not.toHaveBeenCalled();
                })
            );

            it(
                'Should import all data pipeline records and return progress indicators in case of streamed response.',
                async(() => {
                    // GIVEN
                    const event = { target: { files: [new File([], 'test')] } };

                    spyOn(service, 'import').and.returnValue(
                        of(
                            {
                                progress: 20,
                                response: {
                                    type: HttpEventType.ResponseHeader,
                                    headers: new HttpHeaders(),
                                    statusText: 'OK',
                                    status: 200,
                                    clone: undefined,
                                    url: 'localhost',
                                    ok: true
                                }
                            },
                            {
                                progress: 100,
                                response: new HttpResponse({ body: {} })
                            }
                        )
                    );
                    spyOn(modal, 'close').and.callThrough();

                    // WHEN
                    comp.import(event);

                    // THEN
                    expect(service.import).toHaveBeenCalled();
                    expect(modal.close).toHaveBeenCalled();
                })
            );

            it(
                'should dismiss modal when delete service call fails',
                async(() => {
                    // GIVEN
                    const event = { target: { files: [new File([], 'test')] } };
                    spyOn(service, 'import').and.returnValue(throwError(new HttpErrorResponse({ status: 500 })));
                    spyOn(modal, 'dismiss').and.callThrough();

                    // WHEN
                    comp.import(event);

                    // THEN
                    expect(service.import).toHaveBeenCalled();
                    expect(modal.dismiss).toHaveBeenCalled();
                })
            );
        });
    });
});
