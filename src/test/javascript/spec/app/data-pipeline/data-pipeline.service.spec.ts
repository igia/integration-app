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
import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

import { DataPipelineService } from 'app/data-pipeline/data-pipeline.service';
import { Pipeline } from 'app/shared/model/data-pipeline/pipeline.model';
import { DataPipelineState } from 'app/shared/model/data-pipeline/data-pipeline-state.model';
import { EndpointType } from 'app/shared/model/endpoint/endpoint-type.model';
import { DataType } from 'app/shared/model/data-type/data-type.model';
import { ScriptType } from 'app/shared/model/script/script-type.model';
import { ProgressiveResponse } from 'app/shared/model/progressive-response';

describe('Service Tests', () => {
    describe('DataPipeline Service', () => {
        let service: DataPipelineService;
        let backend: HttpTestingController;
        const currentDate: moment.Moment = moment();
        const dataPipelines: Pipeline[] = [
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
                        ],
                        responseTransformers: [
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
        ];

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [DataPipelineService]
            });

            service = TestBed.get(DataPipelineService);
            backend = TestBed.get(HttpTestingController);
        });

        describe('Service methods', () => {
            it(
                `should return a list of DataPipeline`,
                async(() => {
                    service.query({ sort: ['name'], page: 10 }).subscribe((event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Response: {
                                const res: Pipeline[] = event.body;
                                expect(res.length).toEqual(1);
                                expect(res).toEqual(dataPipelines);
                                expect(event.headers.has('x-total-count')).toBeTruthy();
                                expect(event.headers.get('x-total-count')).toEqual('1');
                                expect(event.headers.get('link')).toEqual(
                                    '</api/data-pipelines?page=0&size=20>; rel="last",</api/data-pipelines?page=0&size=20>; rel="first"'
                                );
                                expect(event.status).toEqual(200);
                                expect(event.statusText).toEqual('OK');
                            }
                        }
                    });

                    const mockRequest = backend.expectOne({ method: 'GET' });
                    expect(mockRequest.cancelled).toBeFalsy();
                    expect(mockRequest.request.responseType).toEqual('json');
                    mockRequest.flush(dataPipelines, {
                        headers: {
                            'x-total-count': '1',
                            link: '</api/data-pipelines?page=0&size=20>; rel="last",</api/data-pipelines?page=0&size=20>; rel="first"'
                        },
                        status: 200,
                        statusText: 'OK'
                    });
                })
            );

            it(
                `should find data pipeline object by Id`,
                async(() => {
                    service.find(14).subscribe((event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Response: {
                                const res: Pipeline = event.body;
                                expect(res).toEqual(dataPipelines[0]);
                                expect(event.status).toEqual(200);
                                expect(event.statusText).toEqual('OK');
                            }
                        }
                    });

                    const mockRequest = backend.expectOne({ method: 'GET' });
                    expect(mockRequest.cancelled).toBeFalsy();
                    expect(mockRequest.request.responseType).toEqual('json');
                    mockRequest.flush(dataPipelines[0], {
                        status: 200,
                        statusText: 'OK'
                    });
                })
            );

            it(
                `should delete data pipeline object by Id`,
                async(() => {
                    service.delete(14).subscribe((event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Response: {
                                expect(event.status).toEqual(204);
                                expect(event.statusText).toEqual('OK');
                            }
                        }
                    });

                    const mockRequest = backend.expectOne({ method: 'DELETE' });
                    expect(mockRequest.cancelled).toBeFalsy();
                    expect(mockRequest.request.responseType).toEqual('json');
                    mockRequest.flush(dataPipelines[0], {
                        status: 204,
                        statusText: 'OK'
                    });
                })
            );

            it(
                `should export data pipeline object by Id`,
                async(() => {
                    service.export(14).subscribe((event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Response: {
                                const res: Blob = event.body;
                                expect(res).toBeDefined();
                                expect(event.status).toEqual(200);
                                expect(event.statusText).toEqual('OK');
                                expect(event.headers.get('content-disposition')).toEqual('attachment; filename="abc.json"');
                            }
                        }
                    });

                    const mockRequest = backend.expectOne({ method: 'GET' });
                    expect(mockRequest.cancelled).toBeFalsy();
                    expect(mockRequest.request.responseType).toEqual('blob');
                    mockRequest.flush(new Blob([JSON.stringify(dataPipelines[0])]), {
                        status: 200,
                        statusText: 'OK',
                        headers: new HttpHeaders().append('content-disposition', 'attachment; filename="abc.json"')
                    });
                })
            );

            it(
                `should export all data pipelines`,
                async(() => {
                    service.exportAll().subscribe((progressiveResponse: ProgressiveResponse<HttpEvent<Blob>>) => {
                        const response = progressiveResponse.response;
                        switch (response.type) {
                            case HttpEventType.Sent:
                                expect(progressiveResponse.progress).toEqual(10);
                                break;
                            case HttpEventType.ResponseHeader:
                                expect(progressiveResponse.progress).toEqual(20);
                                break;
                            case HttpEventType.DownloadProgress:
                                expect(progressiveResponse.progress).toEqual(60);
                                break;
                            case HttpEventType.Response:
                                expect(progressiveResponse.progress).toEqual(100);
                                const body: Blob = response.body;
                                expect(body).toBeDefined();
                                expect(response.status).toEqual(200);
                                expect(response.statusText).toEqual('OK');
                                expect(response.headers.get('content-disposition')).toEqual('attachment; filename="pipeline.json"');
                                break;
                            default:
                                fail('unknown response event type');
                        }
                    });

                    const mockRequest = backend.expectOne({ method: 'GET' });
                    expect(mockRequest.cancelled).toBeFalsy();
                    expect(mockRequest.request.responseType).toEqual('blob');

                    mockRequest.event({
                        type: HttpEventType.ResponseHeader,
                        headers: new HttpHeaders(),
                        statusText: 'OK',
                        status: 200,
                        clone: undefined,
                        url: 'localhost',
                        ok: true
                    });
                    mockRequest.event({
                        type: HttpEventType.DownloadProgress,
                        loaded: 5
                    });
                    mockRequest.flush(new Blob([JSON.stringify(dataPipelines)]), {
                        status: 200,
                        statusText: 'OK',
                        headers: new HttpHeaders().append('content-disposition', 'attachment; filename="pipeline.json"')
                    });
                })
            );

            it(
                `should export all data pipelines when the server response is streamed`,
                async(() => {
                    service.exportAll().subscribe((progressiveResponse: ProgressiveResponse<HttpEvent<Blob>>) => {
                        const response = progressiveResponse.response;
                        switch (response.type) {
                            case HttpEventType.Sent:
                                expect(progressiveResponse.progress).toEqual(10);
                                break;
                            case HttpEventType.ResponseHeader:
                                expect(progressiveResponse.progress).toEqual(20);
                                break;
                            case HttpEventType.DownloadProgress:
                                expect(progressiveResponse.progress).toEqual(45);
                                break;
                            case HttpEventType.Response:
                                expect(progressiveResponse.progress).toEqual(100);
                                const body: Blob = response.body;
                                expect(body).toBeDefined();
                                expect(response.status).toEqual(200);
                                expect(response.statusText).toEqual('OK');
                                expect(response.headers.get('content-disposition')).toEqual('attachment; filename="pipeline.json"');
                                break;
                            default:
                                fail('unknown response event type');
                        }
                    });

                    const mockRequest = backend.expectOne({ method: 'GET' });
                    expect(mockRequest.cancelled).toBeFalsy();
                    expect(mockRequest.request.responseType).toEqual('blob');

                    mockRequest.event({
                        type: HttpEventType.ResponseHeader,
                        headers: new HttpHeaders(),
                        statusText: 'OK',
                        status: 200,
                        clone: undefined,
                        url: 'localhost',
                        ok: true
                    });
                    mockRequest.event({
                        type: HttpEventType.DownloadProgress,
                        loaded: 5,
                        total: 20
                    });
                    mockRequest.flush(new Blob([JSON.stringify(dataPipelines)]), {
                        status: 200,
                        statusText: 'OK',
                        headers: new HttpHeaders().append('content-disposition', 'attachment; filename="pipeline.json"')
                    });
                })
            );

            it(
                `should import all data pipelines`,
                async(() => {
                    const file = {
                        msDetachStream: undefined,
                        msClose: undefined,
                        webkitRelativePath: undefined,
                        lastModifiedDate: undefined,
                        lastModified: undefined,
                        name: 'test.json',
                        size: 22,
                        type: undefined,
                        slice: undefined
                    };
                    service.import(file).subscribe((progressiveResponse: ProgressiveResponse<HttpEvent<Blob>>) => {
                        const response = progressiveResponse.response;
                        switch (response.type) {
                            case HttpEventType.Sent:
                                expect(progressiveResponse.progress).toEqual(10);
                                break;
                            case HttpEventType.UploadProgress:
                                expect(progressiveResponse.progress).toEqual(25);
                                break;
                            case HttpEventType.ResponseHeader:
                                expect(progressiveResponse.progress).toEqual(80);
                                break;
                            case HttpEventType.Response:
                                expect(progressiveResponse.progress).toEqual(100);
                                expect(response.status).toEqual(200);
                                expect(response.statusText).toEqual('OK');
                                break;
                            default:
                                fail('unknown response event type');
                        }
                    });

                    const mockRequest = backend.expectOne({ method: 'POST' });
                    expect(mockRequest.cancelled).toBeFalsy();
                    expect(mockRequest.request.responseType).toEqual('json');

                    mockRequest.event({
                        type: HttpEventType.UploadProgress,
                        loaded: 5,
                        total: 20
                    });
                    mockRequest.event({
                        type: HttpEventType.ResponseHeader,
                        headers: new HttpHeaders(),
                        statusText: 'OK',
                        status: 200,
                        clone: undefined,
                        url: 'localhost',
                        ok: true
                    });
                    mockRequest.flush(
                        {},
                        {
                            status: 200,
                            statusText: 'OK'
                        }
                    );
                })
            );

            it(
                `should create a data pipeline`,
                async(() => {
                    const requestObj = {
                        name: 'A01 registration',
                        description: 'This is data pipeline',
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
                            filters: [
                                {
                                    order: 1,
                                    type: ScriptType.JAVASCRIPT,
                                    data: 'Add javascript code here',
                                    description: 'filter messages'
                                }
                            ],
                            transformers: [
                                {
                                    order: 1,
                                    type: ScriptType.JAVASCRIPT,
                                    data: 'Add javascript code here',
                                    description: 'transformer messages'
                                }
                            ],
                            responseTransformers: []
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
                                filters: [
                                    {
                                        order: 1,
                                        type: ScriptType.JAVASCRIPT,
                                        data: 'Add java script code here',
                                        description: 'This is filter'
                                    }
                                ],
                                transformers: [
                                    {
                                        order: 1,
                                        type: ScriptType.JAVASCRIPT,
                                        data: 'Add java script code here',
                                        description: 'This is transformer'
                                    }
                                ],
                                responseTransformers: []
                            }
                        ]
                    };

                    const responseObj = Object.assign({}, requestObj, { id: 12 });

                    service.create(requestObj).subscribe((event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Response: {
                                const res: Pipeline = event.body;
                                expect(res).toEqual(responseObj);
                                expect(event.status).toEqual(201);
                                expect(event.statusText).toEqual('OK');
                            }
                        }
                    });

                    const mockRequest = backend.expectOne({ method: 'POST' });
                    expect(mockRequest.cancelled).toBeFalsy();
                    expect(mockRequest.request.responseType).toEqual('json');
                    mockRequest.flush(responseObj, {
                        status: 201,
                        statusText: 'OK'
                    });
                })
            );

            it(
                `should update data pipeline`,
                async(() => {
                    const requestObj = Object.assign({}, dataPipelines[0], { name: 'existing' });

                    service.update(requestObj).subscribe((event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Response: {
                                const res: Pipeline = event.body;
                                expect(res).toEqual(requestObj);
                                expect(event.status).toEqual(200);
                                expect(event.statusText).toEqual('OK');
                            }
                        }
                    });

                    const mockRequest = backend.expectOne({ method: 'PUT' });
                    expect(mockRequest.cancelled).toBeFalsy();
                    expect(mockRequest.request.responseType).toEqual('json');
                    mockRequest.flush(requestObj, {
                        status: 200,
                        statusText: 'OK'
                    });
                })
            );
        });

        afterEach(() => {
            backend.verify();
        });
    });
});
