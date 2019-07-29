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
import { TestBed } from '@angular/core/testing';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { Pipeline, DataPipelineState, ScriptType, Endpoint, EndpointType, DataType } from 'app/shared';
import { DataPipelineControlService } from 'app/data-pipeline/data-pipeline-control.service';

describe('Service Tests', () => {
    let service: DataPipelineControlService;
    describe('DataPipelineControl Service', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [],
                providers: [FormBuilder, DataPipelineControlService]
            });

            service = TestBed.get(DataPipelineControlService);
        });

        describe('Data Pipeline', () => {
            describe('validations', () => {
                it('should check field validations', () => {
                    // GIVEN
                    const form = service.toFormGroup();

                    // THEN
                    expect(form['controls']['name'].valid).toEqual(false);
                    expect(form['controls']['description'].valid).toEqual(true);
                    expect(form['controls']['deploy'].valid).toEqual(true);
                    expect(form['controls']['workerService'].valid).toEqual(false);
                });

                it('should check source field validations', () => {
                    // GIVEN
                    const form = service.toFormGroup();

                    const source: FormGroup = form['controls']['source']['controls'];

                    // THEN
                    expect(form['controls']['source'].valid).toEqual(false);
                    expect(source['name'].valid).toEqual(false);
                    expect(source['type'].valid).toEqual(false);
                    expect(source['inDataType'].valid).toEqual(false);
                    expect(source['outDataType'].valid).toEqual(false);
                });

                it('should check destination field validations', () => {
                    // GIVEN
                    const form = service.toFormGroup();

                    const destination: FormGroup = form['controls']['destinations']['controls'][0];

                    // THEN
                    expect(destination.valid).toEqual(false);
                    expect(destination['controls']['name'].valid).toEqual(false);
                    expect(destination['controls']['type'].valid).toEqual(false);
                    expect(destination['controls']['inDataType'].valid).toEqual(false);
                    expect(destination['controls']['outDataType'].valid).toEqual(false);
                });
            });

            describe('state', () => {
                it('initial state', () => {
                    // GIVEN
                    const form = service.toFormGroup();

                    // THEN
                    expect(form['controls']['id'].value).toBeNull();
                    expect(form['controls']['state'].value).toBeNull();
                    expect(form['controls']['version'].value).toBeNull();

                    expect(form['controls']['name'].value).toEqual('');
                    expect(form['controls']['description'].value).toEqual('');
                    expect(form['controls']['deploy'].value).toEqual(false);
                    expect(form['controls']['workerService'].value).toBeNull();
                });

                it('updated state', () => {
                    // GIVEN
                    const pipeline: Pipeline = {
                        id: 14,
                        name: 'A01 registration',
                        description: 'This is data pipeline',
                        deploy: true,
                        version: '1.0.0',
                        state: DataPipelineState.READY,
                        workerService: 'workerService10'
                    };
                    const form = service.toFormGroup(pipeline);

                    // THEN
                    expect(form['controls']['id'].value).toEqual(14);
                    expect(form['controls']['state'].value).toEqual(DataPipelineState.READY);
                    expect(form['controls']['version'].value).toEqual('1.0.0');
                    expect(form['controls']['name'].value).toEqual('A01 registration');
                    expect(form['controls']['description'].value).toEqual('This is data pipeline');
                    expect(form['controls']['deploy'].value).toEqual(true);
                    expect(form['controls']['workerService'].value).toEqual('workerService10');
                });
            });
        });

        describe('Data Pipeline Endpoint', () => {
            describe('validations', () => {
                it('should check field validations', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup();

                    // THEN
                    expect(form.valid).toEqual(false);
                    expect(form['controls']['name'].valid).toEqual(false);
                    expect(form['controls']['type'].valid).toEqual(false);
                    expect(form['controls']['inDataType'].valid).toEqual(false);
                    expect(form['controls']['outDataType'].valid).toEqual(false);
                });

                it('should check filters initialized with no scripts', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup();

                    // THEN
                    expect(form.get('filters') as FormArray).toBeDefined();
                    expect((form.get('filters') as FormArray).length).toEqual(0);
                });

                it('should check transformers initialized with no scripts', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup();

                    // THEN
                    expect(form.get('transformers') as FormArray).toBeDefined();
                    expect((form.get('transformers') as FormArray).length).toEqual(0);
                });

                it('should check response transformers initialized with no scripts', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup();

                    // THEN
                    expect(form.get('responseTransformers') as FormArray).toBeDefined();
                    expect((form.get('responseTransformers') as FormArray).length).toEqual(0);
                });

                it('should check filter/transformer validations with missing data', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup();

                    const transformers = form.get('transformers') as FormArray;
                    transformers.push(
                        service.toScriptFormGroup({ type: ScriptType.JAVASCRIPT, order: 0, data: '', description: 'sample' })
                    );

                    // THEN
                    const transformer: FormGroup = transformers.at(0) as FormGroup;
                    expect(transformer.valid).toBeFalsy();
                    expect(transformer.errors).toBeDefined();
                });
            });

            describe('state', () => {
                const endpoint: Endpoint = {
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
                            order: 2,
                            type: ScriptType.JAVASCRIPT,
                            data: 'Add java script code here 2',
                            description: 'This is filter 2'
                        },
                        {
                            id: 13752,
                            order: 1,
                            type: ScriptType.JAVASCRIPT,
                            data: 'Add java script code here 1',
                            description: 'This is filter 1'
                        }
                    ],
                    transformers: [
                        {
                            id: 13801,
                            order: 2,
                            type: ScriptType.JAVASCRIPT,
                            data: 'Add java script code here 2',
                            description: 'This is transformer 2'
                        },
                        {
                            id: 13802,
                            order: 1,
                            type: ScriptType.JAVASCRIPT,
                            data: 'Add java script code here 1',
                            description: 'This is transformer 1'
                        }
                    ],
                    responseTransformers: [
                        {
                            id: 13101,
                            order: 2,
                            type: ScriptType.JAVASCRIPT,
                            data: 'Add java script code here rs 2',
                            description: 'This is rs transformer 2'
                        },
                        {
                            id: 13102,
                            order: 1,
                            type: ScriptType.JAVASCRIPT,
                            data: 'Add java script code here rs 1',
                            description: 'This is rs transformer 1'
                        }
                    ]
                };

                it('should check endpoint initial state', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup();

                    // THEN
                    expect(form.valid).toEqual(false);
                    expect(form['controls']['name'].value).toEqual('');
                    expect(form['controls']['type'].value).toBeNull();
                    expect(form['controls']['inDataType'].value).toBeNull();
                    expect(form['controls']['outDataType'].value).toBeNull();
                });

                it('should check filter initial state', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup();
                    const filters = form.get('filters') as FormArray;
                    filters.push(service.toScriptFormGroup());

                    const filter: FormGroup = filters.at(0) as FormGroup;

                    // THEN
                    expect(filter.get('type').value).toEqual(ScriptType.JAVASCRIPT);
                    expect(filter.get('order').value).toEqual('0');
                    expect(filter.get('data').value).toEqual('');
                    expect(filter.get('description').value).toEqual('');
                });

                it('should check transformer initial state', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup();
                    const transformers = form.get('transformers') as FormArray;
                    transformers.push(service.toScriptFormGroup());

                    const transformer: FormGroup = transformers.at(0) as FormGroup;

                    // THEN
                    expect(transformer.get('type').value).toEqual(ScriptType.JAVASCRIPT);
                    expect(transformer.get('order').value).toEqual('0');
                    expect(transformer.get('data').value).toEqual('');
                    expect(transformer.get('description').value).toEqual('');
                });

                it('should check response transformer initial state', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup();
                    const transformers = form.get('responseTransformers') as FormArray;
                    transformers.push(service.toScriptFormGroup());

                    const transformer: FormGroup = transformers.at(0) as FormGroup;

                    // THEN
                    expect(transformer.get('type').value).toEqual(ScriptType.JAVASCRIPT);
                    expect(transformer.get('order').value).toEqual('0');
                    expect(transformer.get('data').value).toEqual('');
                    expect(transformer.get('description').value).toEqual('');
                });

                it('should check endpoint updated state', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup(endpoint);

                    // THEN
                    expect(form.valid).toEqual(true);
                    expect(form['controls']['name'].value).toEqual('destinationEndpoint');
                    expect(form['controls']['type'].value).toEqual(EndpointType.FILE);
                    expect(form['controls']['inDataType'].value).toEqual(DataType.HL7_V2);
                    expect(form['controls']['outDataType'].value).toEqual(DataType.HL7_V2);
                });

                it('should check filter updated state', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup(endpoint);

                    // THEN
                    const filters: FormArray = form.get('filters') as FormArray;
                    expect(filters.length).toEqual(2);
                    const filter1: FormGroup = filters.at(0) as FormGroup;
                    expect(filter1.get('type').value).toEqual(ScriptType.JAVASCRIPT);
                    expect(filter1.get('order').value).toEqual(1);
                    expect(filter1.get('data').value).toEqual('Add java script code here 1');
                    expect(filter1.get('description').value).toEqual('This is filter 1');

                    const filter2: FormGroup = filters.at(1) as FormGroup;
                    expect(filter2.get('type').value).toEqual(ScriptType.JAVASCRIPT);
                    expect(filter2.get('order').value).toEqual(2);
                    expect(filter2.get('data').value).toEqual('Add java script code here 2');
                    expect(filter2.get('description').value).toEqual('This is filter 2');
                });

                it('should check transformer updated state', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup(endpoint);

                    // THEN
                    const transformers: FormArray = form.get('transformers') as FormArray;
                    expect(transformers.length).toEqual(2);

                    const transformer1: FormGroup = transformers.at(0) as FormGroup;
                    expect(transformer1.get('type').value).toEqual(ScriptType.JAVASCRIPT);
                    expect(transformer1.get('order').value).toEqual(1);
                    expect(transformer1.get('data').value).toEqual('Add java script code here 1');
                    expect(transformer1.get('description').value).toEqual('This is transformer 1');

                    const transformer2: FormGroup = transformers.at(1) as FormGroup;
                    expect(transformer2.get('type').value).toEqual(ScriptType.JAVASCRIPT);
                    expect(transformer2.get('order').value).toEqual(2);
                    expect(transformer2.get('data').value).toEqual('Add java script code here 2');
                    expect(transformer2.get('description').value).toEqual('This is transformer 2');
                });

                it('should check response transformer updated state', () => {
                    // GIVEN
                    const form = service.toEndpointFormGroup(endpoint);

                    // THEN
                    const transformers: FormArray = form.get('responseTransformers') as FormArray;
                    expect(transformers.length).toEqual(2);

                    const transformer1: FormGroup = transformers.at(0) as FormGroup;
                    expect(transformer1.get('type').value).toEqual(ScriptType.JAVASCRIPT);
                    expect(transformer1.get('order').value).toEqual(1);
                    expect(transformer1.get('data').value).toEqual('Add java script code here rs 1');
                    expect(transformer1.get('description').value).toEqual('This is rs transformer 1');

                    const transformer2: FormGroup = transformers.at(1) as FormGroup;
                    expect(transformer2.get('type').value).toEqual(ScriptType.JAVASCRIPT);
                    expect(transformer2.get('order').value).toEqual(2);
                    expect(transformer2.get('data').value).toEqual('Add java script code here rs 2');
                    expect(transformer2.get('description').value).toEqual('This is rs transformer 2');
                });
            });
        });
    });
});
