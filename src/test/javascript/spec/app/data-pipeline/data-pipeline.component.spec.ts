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
import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Data } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';

import { DataPipelineService } from 'app/data-pipeline/data-pipeline.service';
import { DataPipeline } from 'app/shared/model/data-pipeline/data-pipeline.model';
import { DataPipelineComponent } from 'app/data-pipeline';
import { IntegrationappTestModule } from '../../test.module';
import { DataPipelineState } from 'app/shared';
import { ElementRef } from '@angular/core';

describe('Component Tests', () => {
    describe('DataPipeline List Component', () => {
        let comp: DataPipelineComponent;
        let fixture: ComponentFixture<DataPipelineComponent>;
        let service: DataPipelineService;
        let modalService: NgbModal;

        beforeEach(
            async(() => {
                TestBed.configureTestingModule({
                    imports: [IntegrationappTestModule],
                    declarations: [DataPipelineComponent],
                    providers: [
                        {
                            provide: ActivatedRoute,
                            useValue: {
                                data: {
                                    subscribe: (fn: (value: Data) => void) =>
                                        fn({
                                            pagingParams: {
                                                predicate: 'id',
                                                reverse: false,
                                                page: 0
                                            }
                                        })
                                }
                            }
                        },
                        NgbModal
                    ]
                })
                    .overrideTemplate(DataPipelineComponent, '')
                    .compileComponents();
            })
        );

        beforeEach(() => {
            fixture = TestBed.createComponent(DataPipelineComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataPipelineService);
            modalService = fixture.debugElement.injector.get(NgbModal);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new DataPipeline(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.dataPipelines[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });

        it('should load a page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new DataPipeline(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.dataPipelines[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });

        it('should not load a page is the page is the same as the previous page', () => {
            spyOn(service, 'query').and.callThrough();

            // WHEN
            comp.loadPage(0);

            // THEN
            expect(service.query).toHaveBeenCalledTimes(0);
        });

        it('should re-initialize the page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new DataPipeline(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);
            comp.clear();

            // THEN
            expect(comp.page).toEqual(0);
            expect(service.query).toHaveBeenCalledTimes(2);
            expect(comp.dataPipelines[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
        it('should calculate the sort attribute for an id', () => {
            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['id,desc']);
        });

        it('should calculate the sort attribute for a non-id attribute', () => {
            // GIVEN
            comp.predicate = 'name';

            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['name,desc', 'id']);
        });

        it('should return no data alert', () => {
            // WHEN
            const result = comp.noDataAlert();

            // THEN
            expect(result).toEqual([
                {
                    type: 'info',
                    msg: 'No record found.',
                    params: undefined,
                    timeout: 0,
                    toast: false,
                    scoped: true
                }
            ]);
        });

        it(
            'should show import modal and on successful import reloads collections',
            fakeAsync(() => {
                // GIVEN
                comp.dataPipelines = [{ id: 123 }];
                const mockRef = { componentInstance: {}, result: Promise.resolve('test') };
                spyOn(modalService, 'open').and.returnValue(mockRef);

                spyOn(comp, 'loadAll').and.callFake(() => {});

                // WHEN
                comp.openImportDialog();
                tick();

                // THEN
                expect(modalService.open).toHaveBeenCalled();
                expect(comp.loadAll).toHaveBeenCalled();
            })
        );

        it(
            'should show import modal and on unsuccessful import do nothing',
            fakeAsync(() => {
                // GIVEN
                comp.dataPipelines = [{ id: 123 }];

                spyOn(modalService, 'open').and.returnValue({ componentInstance: {}, result: Promise.reject({}) });

                spyOn(comp, 'loadAll').and.callFake(() => {});
                // WHEN
                comp.openImportDialog();
                tick();

                // THEN
                expect(modalService.open).toHaveBeenCalled();
                expect(comp.loadAll).toHaveBeenCalledTimes(0);
            })
        );

        it(
            'should show delete modal and on successful delete reloads collections',
            fakeAsync(() => {
                // GIVEN
                comp.dataPipelines = [{ id: 123 }];
                const mockRef = { componentInstance: {}, result: Promise.resolve('test') };
                spyOn(modalService, 'open').and.returnValue(mockRef);

                spyOn(comp, 'loadAll').and.callFake(() => {});

                // WHEN
                comp.deleteDataPipeline(123);
                tick();

                // THEN
                expect(modalService.open).toHaveBeenCalled();
                expect(comp.loadAll).toHaveBeenCalled();
            })
        );

        it(
            'should show delete modal and on unsuccessful delete do nothing',
            fakeAsync(() => {
                // GIVEN
                comp.dataPipelines = [{ id: 123 }];

                spyOn(modalService, 'open').and.returnValue({ componentInstance: {}, result: Promise.reject({}) });

                spyOn(comp, 'loadAll').and.callFake(() => {});
                // WHEN
                comp.deleteDataPipeline(123);
                tick();

                // THEN
                expect(modalService.open).toHaveBeenCalled();
                expect(comp.loadAll).toHaveBeenCalledTimes(0);
            })
        );

        it(
            'Should update data pipeline when user toggle the deployment flag',
            async(() => {
                // GIVEN
                comp.dataPipelines = [{ id: 123 }];

                spyOn(service, 'update').and.returnValue(
                    of(
                        new HttpResponse({
                            body: new DataPipeline(123)
                        })
                    )
                );

                spyOn(comp, 'loadAll').and.callFake(() => {});
                // WHEN
                comp.updatePipelineDeployment(123);

                // THEN
                expect(service.update).toHaveBeenCalled();
                expect(comp.loadAll).toHaveBeenCalled();
                expect(comp.loadAll).toHaveBeenCalledTimes(1);
            })
        );

        it(
            'Should gracefully handle error scenario when user toggle the deployment flag',
            async(() => {
                // GIVEN
                comp.dataPipelines = [{ id: 123 }];

                spyOn(service, 'update').and.returnValue(
                    throwError(
                        new HttpErrorResponse({
                            error: {
                                type: 'https://www.jhipster.tech/problem/parameterized',
                                title: 'Parameterized Exception',
                                status: 400,
                                message: 'Name should be unique',
                                params: {
                                    'dataPipeline.name': 'A01 registration'
                                }
                            },
                            status: 400
                        })
                    )
                );

                spyOn(comp, 'loadAll').and.callFake(() => {});
                // WHEN
                comp.updatePipelineDeployment(123);

                // THEN
                expect(service.update).toHaveBeenCalled();
                expect(comp.loadAll).toHaveBeenCalled();
                expect(comp.loadAll).toHaveBeenCalledTimes(1);
            })
        );

        it(
            'Should export data pipeline record by id',
            async(() => {
                // GIVEN
                comp.dataPipelines = [{ id: 123 }];
                comp.exportLink = new ElementRef(document.createElement('a'));
                spyOn(comp.exportLink.nativeElement, 'click').and.stub();
                URL.revokeObjectURL = jest.fn();
                URL.createObjectURL = jest.fn();
                spyOn(service, 'export').and.returnValue(
                    of(
                        new HttpResponse({
                            body: new Blob([JSON.stringify({ id: 123 })]),
                            headers: new HttpHeaders().append('content-disposition', 'attachment; filename="abc.json"')
                        })
                    )
                );

                // WHEN
                comp.export(123);

                // THEN
                expect(service.export).toHaveBeenCalled();
                expect(service.export).toHaveBeenCalledWith(123);
                expect(comp.exportLink.nativeElement.click).toHaveBeenCalled();
                expect(URL.createObjectURL).toHaveBeenCalled();
                expect(URL.revokeObjectURL).toHaveBeenCalled();
            })
        );

        it(
            'Should export data pipeline record by id when filename is not present in content disposition header',
            async(() => {
                // GIVEN
                comp.dataPipelines = [{ id: 123 }];
                comp.exportLink = new ElementRef(document.createElement('a'));
                spyOn(comp.exportLink.nativeElement, 'click').and.stub();
                URL.revokeObjectURL = jest.fn();
                URL.createObjectURL = jest.fn();
                spyOn(service, 'export').and.returnValue(
                    of(
                        new HttpResponse({
                            body: new Blob([JSON.stringify({ id: 123 })]),
                            headers: new HttpHeaders().append('content-disposition', 'attachment;')
                        })
                    )
                );

                // WHEN
                comp.export(123);

                // THEN
                expect(service.export).toHaveBeenCalled();
                expect(service.export).toHaveBeenCalledWith(123);
                expect(comp.exportLink.nativeElement.click).toHaveBeenCalled();
                expect(URL.createObjectURL).toHaveBeenCalled();
                expect(URL.revokeObjectURL).toHaveBeenCalled();
            })
        );

        it(
            'Should export all data pipeline records and return progress indicators in case of streamed response',
            async(() => {
                // GIVEN
                comp.dataPipelines = [{ id: 123 }];
                comp.exportLink = new ElementRef(document.createElement('a'));
                spyOn(comp.exportLink.nativeElement, 'click').and.stub();
                URL.revokeObjectURL = jest.fn();
                URL.createObjectURL = jest.fn();
                spyOn(service, 'exportAll').and.returnValue(
                    of(
                        {
                            progress: 20,
                            response: undefined
                        },
                        {
                            progress: 100,
                            response: new HttpResponse({
                                body: new Blob([JSON.stringify([{ id: 123 }])]),
                                headers: new HttpHeaders().append('content-disposition', 'attachment; filename="abc.json"')
                            })
                        }
                    )
                );

                // WHEN
                comp.exportAll();

                // THEN
                expect(service.exportAll).toHaveBeenCalled();
                expect(service.exportAll).toHaveBeenCalledWith();
                expect(comp.exportLink.nativeElement.click).toHaveBeenCalled();
                expect(URL.createObjectURL).toHaveBeenCalled();
                expect(URL.revokeObjectURL).toHaveBeenCalled();
            })
        );

        it('should return false when no downloads in progress.', () => {
            expect(comp.isDownloadInProgress()).toBeFalsy();
        });

        it('should return true if any download in progress.', () => {
            comp.progressCounter = 5;
            expect(comp.isDownloadInProgress()).toBeTruthy();
        });

        it('should get deployment action translation key when pipeline is in deployed state', () => {
            expect(comp.getDeploymentAction(true)).toEqual('dataPipeline.actions.undeploy');
        });

        it('should get deployment action translation key when pipeline is in undeployed state', () => {
            expect(comp.getDeploymentAction(false)).toEqual('dataPipeline.actions.deploy');
        });

        it('should return update disabled tooltip when pipeline is in the deployed state', () => {
            expect(comp.getUpdateTooltip(true)).toEqual('dataPipeline.actions.update.disabled');
        });

        it('should not return update disabled tooltip when pipeline is not in the deployed state', () => {
            expect(comp.getUpdateTooltip(false)).toEqual('');
        });

        it('should return delete disabled tooltip when pipeline is in the deployed state', () => {
            expect(comp.getDeleteTooltip(true)).toEqual('dataPipeline.actions.delete.disabled');
        });

        it('should not return delete disabled tooltip when pipeline is not in the deployed state', () => {
            expect(comp.getDeleteTooltip(false)).toEqual('');
        });

        it('should return primary class for pipeline in READY state', () => {
            // WHEN
            const result = comp.getClassByState(DataPipelineState.READY);
            // THEN
            expect(result).toEqual(['badge', 'badge-primary']);
        });

        it('should return secondary class for pipeline in STOPPED state', () => {
            // WHEN
            const result = comp.getClassByState(DataPipelineState.STOPPED);
            // THEN
            expect(result).toEqual(['badge', 'badge-secondary']);
        });

        it('should return animated secondary class for pipeline in STOPPING state', () => {
            // WHEN
            const result2 = comp.getClassByState(DataPipelineState.STOPPING);
            // THEN
            expect(result2).toEqual(['badge', 'badge-secondary', 'progress-bar-striped', 'progress-bar-animated']);
        });

        it('should return danger class for pipeline in FAILURE state', () => {
            // WHEN
            const result = comp.getClassByState(DataPipelineState.FAILED);
            // THEN
            expect(result).toEqual(['badge', 'badge-danger']);
        });

        it('should return success class for pipeline in STARTED state', () => {
            // WHEN
            const result = comp.getClassByState(DataPipelineState.STARTED);
            // THEN
            expect(result).toEqual(['badge', 'badge-success']);
        });

        it('should return animated success class for pipeline in STARTING state', () => {
            // WHEN
            const result = comp.getClassByState(DataPipelineState.STARTING);
            // THEN
            expect(result).toEqual(['badge', 'badge-success', 'progress-bar-striped', 'progress-bar-animated']);
        });
    });
});
