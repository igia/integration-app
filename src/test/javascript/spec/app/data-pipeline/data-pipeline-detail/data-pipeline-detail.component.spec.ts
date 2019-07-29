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
import { ComponentFixture, TestBed, inject, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { DataPipeline, DataPipelineState, EndpointType, DataType, ScriptType } from 'app/shared';
import { DataPipelineDetailComponent } from 'app/data-pipeline/data-pipeline-detail/data-pipeline-detail.component';
import { DataPipelineService } from 'app/data-pipeline/data-pipeline.service';
import { IntegrationappTestModule } from '../../../test.module';
import { DataPipelineControlService } from 'app/data-pipeline/data-pipeline-control.service';
import { IntegrationWorkerService } from 'app/data-pipeline/integration-worker-service.service';
import { MockActivatedRoute, MockRouter } from '../../../helpers/mock-route.service';

describe('Component Tests', () => {
    describe('Data Pipeline Detail Component', () => {
        let comp: DataPipelineDetailComponent;
        let fixture: ComponentFixture<DataPipelineDetailComponent>;
        let service: DataPipelineService;
        let dataPipelineControlService: DataPipelineControlService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IntegrationappTestModule],
                declarations: [DataPipelineDetailComponent],
                providers: [
                    FormBuilder,
                    DataPipelineControlService,
                    IntegrationWorkerService,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({ dataPipeline: new DataPipeline() })
                    }
                ]
            })
                .overrideTemplate(DataPipelineDetailComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DataPipelineDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataPipelineService);
            dataPipelineControlService = fixture.debugElement.injector.get(DataPipelineControlService);
        });

        describe('initial state', () => {
            it(
                'should check initial state',
                async(
                    inject([IntegrationWorkerService], (integrationWorkerService: IntegrationWorkerService) => {
                        // GIVEN
                        spyOn(integrationWorkerService, 'query').and.returnValue(of(new HttpResponse({ body: [] })));

                        // WHEN
                        comp.ngOnInit();

                        // THEN
                        expect(comp.form).toBeDefined();
                        expect(comp.pipeline).toBeDefined();
                        expect(comp.workerServices).toBeDefined();
                        expect(comp.workerServices.length).toEqual(0);
                        expect(comp.sourceEndpointTypes.length).toEqual(4);
                        expect(comp.sourceEndpointTypes).toEqual([
                            EndpointType.MLLP,
                            EndpointType.FILE,
                            EndpointType.SFTP,
                            EndpointType.HTTP
                        ]);
                        expect(comp.destinationEndpointTypes.length).toEqual(4);
                        expect(comp.destinationEndpointTypes).toEqual([
                            EndpointType.MLLP,
                            EndpointType.FILE,
                            EndpointType.SFTP,
                            EndpointType.HTTP
                        ]);
                    })
                )
            );

            it(
                'should redirect to list page if pipeline is already in the deployed state',
                async(
                    inject([ActivatedRoute, Router], (activatedRoute: MockActivatedRoute, router: MockRouter) => {
                        // GIVEN
                        activatedRoute.data = of({ dataPipeline: new DataPipeline(12, 'xy', 'desc', true) });

                        // WHEN
                        comp.ngOnInit();

                        // THEN
                        expect(router.navigateSpy).toHaveBeenCalled();
                        expect(router.navigateSpy).toHaveBeenCalledWith(['/data-pipeline']);
                    })
                )
            );
        });

        describe('crud operations', () => {
            it(
                'should call create service on save for new entity',
                async(() => {
                    // GIVEN
                    const pipeline = {
                        name: 'A01 registration',
                        description: 'This is data pipeline',
                        deploy: false,
                        workerService: 'workerService10',
                        source: {
                            type: EndpointType.MLLP,
                            name: 'sourceEndpoint',
                            inDataType: DataType.HL7_V2,
                            outDataType: DataType.HL7_V2,
                            configurations: [
                                {
                                    key: 'hostname',
                                    value: 'hostname'
                                },
                                {
                                    key: 'port',
                                    value: '9090'
                                }
                            ],
                            filters: [],
                            transformers: []
                        },
                        destinations: [
                            {
                                type: EndpointType.FILE,
                                name: 'destinationEndpoint',
                                inDataType: DataType.HL7_V2,
                                outDataType: DataType.HL7_V2,
                                configurations: [
                                    {
                                        key: 'directoryName',
                                        value: '/data'
                                    },
                                    {
                                        key: 'fileName',
                                        value: 'test'
                                    }
                                ],
                                filters: [],
                                transformers: []
                            }
                        ]
                    };
                    comp.form = dataPipelineControlService.toFormGroup();

                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: pipeline })));

                    // WHEN
                    comp.save();

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(comp.form.value);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'should call update service for existing entity',
                async(() => {
                    // GIVEN
                    const pipeline = {
                        id: 14,
                        name: 'A01 registration',
                        description: 'This is data pipeline',
                        deploy: false,
                        version: '1.0.0',
                        state: DataPipelineState.READY,
                        workerService: 'workerService10',
                        source: {
                            id: 13451,
                            type: EndpointType.MLLP,
                            name: 'sourceEndpoint',
                            inDataType: DataType.HL7_V2,
                            outDataType: DataType.HL7_V2,
                            configurations: [
                                {
                                    id: 13501,
                                    key: 'hostname',
                                    value: 'hostname'
                                },
                                {
                                    id: 13502,
                                    key: 'port',
                                    value: '9090'
                                }
                            ],
                            filters: [
                                {
                                    id: 13551,
                                    order: 1,
                                    type: ScriptType.JAVASCRIPT,
                                    data: 'Add javascript code here',
                                    description: 'filter messages'
                                }
                            ],
                            transformers: [
                                {
                                    id: 13601,
                                    order: 1,
                                    type: ScriptType.JAVASCRIPT,
                                    data: 'Add javascript code here',
                                    description: 'transformer messages'
                                }
                            ]
                        },
                        destinations: [
                            {
                                id: 13651,
                                type: EndpointType.FILE,
                                name: 'destinationEndpoint',
                                inDataType: DataType.HL7_V2,
                                outDataType: DataType.HL7_V2,
                                configurations: [
                                    {
                                        id: 13701,
                                        key: 'directoryName',
                                        value: '/data'
                                    },
                                    {
                                        id: 13702,
                                        key: 'fileName',
                                        value: 'test'
                                    }
                                ],
                                filters: [
                                    {
                                        id: 13751,
                                        order: 1,
                                        type: ScriptType.JAVASCRIPT,
                                        data: 'Add java script code here',
                                        description: 'This is filter'
                                    }
                                ],
                                transformers: [
                                    {
                                        id: 13801,
                                        order: 1,
                                        type: ScriptType.JAVASCRIPT,
                                        data: 'Add java script code here',
                                        description: 'This is transformer'
                                    }
                                ]
                            }
                        ]
                    };
                    comp.form = dataPipelineControlService.toFormGroup(pipeline);

                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: pipeline })));

                    // WHEN
                    comp.save();

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(comp.form.value);
                    expect(comp.isSaving).toBeFalsy();
                })
            );
        });

        describe('validations', () => {
            it('should mark form as invalid when name is not populated', () => {
                // GIVEN
                comp.form = dataPipelineControlService.toFormGroup();

                // THEN
                expect(comp.source.valid).toBeFalsy();
                expect(comp.destinations.valid).toBeFalsy();
                expect(comp.form.valid).toBeFalsy();
            });

            it('should check if component is populated in edit flow', () => {
                // GIVEN
                comp.form = dataPipelineControlService.toFormGroup();

                // THEN
                expect(comp.isCreateFlow()).toBeTruthy();
            });
        });
    });
});
