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
import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import * as moment from 'moment';

import { IntegrationWorkerService } from 'app/data-pipeline/integration-worker-service.service';
import { DataPipelineState } from 'app/shared/model/data-pipeline/data-pipeline-state.model';
import { EndpointType } from 'app/shared/model/endpoint/endpoint-type.model';
import { DataType } from 'app/shared/model/data-type/data-type.model';
import { ScriptType } from 'app/shared/model/script/script-type.model';
import { WorkerService } from 'app/shared/model/worker-service/worker-service.model';

describe('Service Tests', () => {
    describe('Integration worker Service', () => {
        const currentDate: moment.Moment = moment();
        const workerServices = [
            {
                name: 'workerService10',
                dataPipelines: [
                    {
                        id: 14,
                        name: 'A01 registration',
                        description: 'This is data pipeline',
                        deploy: false,
                        version: '1.0.0',
                        state: DataPipelineState.READY,
                        workerService: 'workerService10',
                        createdOn: currentDate,
                        createdBy: 'user',
                        modifiedOn: currentDate,
                        modifiedBy: 'user',
                        source: {
                            id: 13451,
                            type: EndpointType.MLLP,
                            name: 'sourceEndpoint',
                            inDataType: DataType.HL7_V2,
                            outDataType: DataType.HL7_V2,
                            createdOn: currentDate,
                            createdBy: 'user',
                            modifiedOn: currentDate,
                            modifiedBy: 'user',
                            configurations: [
                                {
                                    id: 13501,
                                    key: 'hostname',
                                    value: 'hostname',
                                    createdOn: currentDate,
                                    createdBy: 'user',
                                    modifiedOn: currentDate,
                                    modifiedBy: 'user'
                                },
                                {
                                    id: 13502,
                                    key: 'port',
                                    value: '9090',
                                    createdOn: currentDate,
                                    createdBy: 'user',
                                    modifiedOn: currentDate,
                                    modifiedBy: 'user'
                                }
                            ],
                            filters: [
                                {
                                    id: 13551,
                                    order: 1,
                                    type: ScriptType.JAVASCRIPT,
                                    data: 'Add javascript code here',
                                    description: 'filter messages',
                                    createdOn: currentDate,
                                    createdBy: 'user',
                                    modifiedOn: currentDate,
                                    modifiedBy: 'user'
                                }
                            ],
                            transformers: [
                                {
                                    id: 13601,
                                    order: 1,
                                    type: ScriptType.JAVASCRIPT,
                                    data: 'Add javascript code here',
                                    description: 'transformer messages',
                                    createdOn: currentDate,
                                    createdBy: 'user',
                                    modifiedOn: currentDate,
                                    modifiedBy: 'user'
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
                                createdOn: currentDate,
                                createdBy: 'user',
                                modifiedOn: currentDate,
                                modifiedBy: 'user',
                                configurations: [
                                    {
                                        id: 13701,
                                        key: 'directoryName',
                                        value: '/data',
                                        createdOn: currentDate,
                                        createdBy: 'user',
                                        modifiedOn: currentDate,
                                        modifiedBy: 'user'
                                    },
                                    {
                                        id: 13702,
                                        key: 'fileName',
                                        value: 'test',
                                        createdOn: currentDate,
                                        createdBy: 'user',
                                        modifiedOn: currentDate,
                                        modifiedBy: 'user'
                                    }
                                ],
                                filters: [
                                    {
                                        id: 13751,
                                        order: 1,
                                        type: ScriptType.JAVASCRIPT,
                                        data: 'Add java script code here',
                                        description: 'This is filter',
                                        createdOn: currentDate,
                                        createdBy: 'user',
                                        modifiedOn: currentDate,
                                        modifiedBy: 'user'
                                    }
                                ],
                                transformers: [
                                    {
                                        id: 13801,
                                        order: 1,
                                        type: ScriptType.JAVASCRIPT,
                                        data: 'Add java script code here',
                                        description: 'This is transformer',
                                        createdOn: currentDate,
                                        createdBy: 'user',
                                        modifiedOn: currentDate,
                                        modifiedBy: 'user'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [IntegrationWorkerService]
            });
        });

        describe('Service methods', () => {
            it(
                `should return a list of worker services enclosing associated pipelines`,
                async(
                    inject(
                        [IntegrationWorkerService, HttpTestingController],
                        (service: IntegrationWorkerService, backend: HttpTestingController) => {
                            service.query().subscribe((event: HttpEvent<any>) => {
                                switch (event.type) {
                                    case HttpEventType.Response: {
                                        const res: WorkerService[] = event.body;
                                        expect(res.length).toEqual(1);
                                        expect(res).toEqual(workerServices);
                                        expect(event.status).toEqual(200);
                                        expect(event.statusText).toEqual('OK');
                                    }
                                }
                            });

                            const mockRequest = backend.expectOne({ method: 'GET' });
                            expect(mockRequest.cancelled).toBeFalsy();
                            expect(mockRequest.request.responseType).toEqual('json');
                            mockRequest.flush(workerServices, {
                                status: 200,
                                statusText: 'OK'
                            });

                            backend.verify();
                        }
                    )
                )
            );
        });

        afterEach(
            inject([HttpTestingController], (backend: HttpTestingController) => {
                backend.verify();
            })
        );
    });
});
