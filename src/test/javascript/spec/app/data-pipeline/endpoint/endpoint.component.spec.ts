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
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
    TranslateService,
    TranslateStore,
    TranslateLoader,
    TranslateCompiler,
    TranslateParser,
    MissingTranslationHandler,
    USE_DEFAULT_LANG,
    TranslateModule,
    USE_STORE
} from '@ngx-translate/core';

import { EndpointType, DataType, EndpointRoleType } from 'app/shared';
import { ConfigurationControlService } from 'app/shared/service/configuration-control.service';
import { ConfiguationMetadataService } from 'app/shared/service/configuration-metadata.service';
import { DataPipelineControlService } from 'app/data-pipeline/data-pipeline-control.service';
import { EndpointComponent } from 'app/data-pipeline/endpoint/endpoint.component';
import { IntegrationappTestModule } from '../../../test.module';
import { ConfigurationTranslateService } from 'app/shared/service/configuration-translate.service';

describe('Component Tests', () => {
    describe('EndpointComponent', () => {
        let comp: EndpointComponent;
        let fixture: ComponentFixture<EndpointComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IntegrationappTestModule, TranslateModule],
                declarations: [EndpointComponent],
                providers: [
                    { provide: USE_DEFAULT_LANG },
                    { provide: USE_STORE },
                    FormBuilder,
                    ConfigurationControlService,
                    ConfiguationMetadataService,
                    ConfigurationTranslateService,
                    TranslateService,
                    TranslateStore,
                    TranslateLoader,
                    TranslateCompiler,
                    TranslateParser,
                    MissingTranslationHandler
                ]
            })
                .overrideTemplate(EndpointComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EndpointComponent);
            comp = fixture.componentInstance;
            const translateService = TestBed.get(TranslateService);
            spyOn(translateService, 'setTranslation').and.stub();
        });

        beforeEach(
            async(
                inject([DataPipelineControlService], (dataPipelineControlService: DataPipelineControlService) => {
                    // GIVEN
                    comp.form = dataPipelineControlService.toEndpointFormGroup();
                })
            )
        );

        it('should get unique control id', () => {
            // GIVEN
            comp.id = 'c';
            // THEN
            expect(comp.uniqueId('test')).toEqual('ctest');
        });

        it('should true when endpoint role is producer', () => {
            // GIVEN
            comp.endpointRole = EndpointRoleType.PRODUCER;
            // THEN
            expect(comp.isProducer()).toBeTruthy();
        });

        it('should false when endpoint role is consumer', () => {
            // GIVEN
            comp.endpointRole = EndpointRoleType.CONSUMER;
            // THEN
            expect(comp.isProducer()).toBeFalsy();
        });

        describe('initial state', () => {
            it('should check initial state', () => {
                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.dataTypes.length).toEqual(4);
                expect(comp.dataTypes).toContainEqual(DataType.HL7_V2);
                expect(comp.dataTypes).toContainEqual(DataType.CSV);
                expect(comp.dataTypes).toContainEqual(DataType.JSON);
                expect(comp.dataTypes).toContainEqual(DataType.RAW);

                expect(comp.endpoint).toBeDefined();
                expect(comp.configurationsMetadata).toBeDefined();
                expect(comp.configurationsMetadata.length).toEqual(0);
                expect(comp.isDependentDataType()).toBeFalsy();
                expect(comp.isDataTypeOptionDisabled(DataType.HL7_V2)).toBeFalsy();
            });

            it(
                'should check population of incoming data type when it is dependent on other endpoint',
                inject([DataPipelineControlService], (dataPipelineControlService: DataPipelineControlService) => {
                    // GIVEN
                    comp.depends = dataPipelineControlService.toEndpointFormGroup();

                    // WHEN
                    comp.ngOnInit();
                    comp.depends.get('outDataType').setValue(DataType.HL7_V2);

                    // THEN
                    expect(comp.isDependentDataType()).toBeTruthy();
                    expect(comp.isDataTypeOptionDisabled(DataType.CSV)).toBeTruthy();
                    expect(comp.inDataType.value).toEqual(DataType.HL7_V2);
                })
            );

            it(
                'should check auto population of outbound in case no transformation scripts specified',
                inject([DataPipelineControlService], (controlService: DataPipelineControlService) => {
                    // GIVEN
                    comp.ngOnInit();

                    // WHEN
                    comp.inDataType.setValue(DataType.HL7_V2);

                    // THEN
                    expect(comp.outDataType.value).toEqual(DataType.HL7_V2);
                })
            );
        });

        describe('File endpoint', () => {
            it(
                'should populate metadata and configurations when FILE is selected as an endpoint',
                async(() => {
                    // GIVEN
                    comp.ngOnInit();

                    // WHEN
                    comp.form.get('type').setValue(EndpointType.FILE);
                    comp.onTypeChange();

                    // THEN
                    expect(comp.configurationsMetadata).toBeDefined();
                    expect(comp.configurationsMetadata.length).toEqual(12);
                    expect(comp.configurationsMetadata[0].key).toEqual('directoryName');
                    expect(comp.configurationsMetadata[1].key).toEqual('fileName');
                    expect(comp.configurationsMetadata[2].key).toEqual('antInclude');
                    expect(comp.configurationsMetadata[3].key).toEqual('antExclude');
                    expect(comp.configurationsMetadata[4].key).toEqual('recursive');
                    expect(comp.configurationsMetadata[5].key).toEqual('sortBy');
                    expect(comp.configurationsMetadata[6].key).toEqual('move');
                    expect(comp.configurationsMetadata[7].key).toEqual('moveFailed');
                    expect(comp.configurationsMetadata[8].key).toEqual('doneFileName');
                    expect(comp.configurationsMetadata[9].key).toEqual('delay');
                    expect(comp.configurationsMetadata[10].key).toEqual('initialDelay');
                    expect(comp.configurationsMetadata[11].key).toEqual('scheduler.cron');

                    const controls = comp.form.get('configurations')['controls'];
                    expect(controls.length).toEqual(12);
                    expect(controls[0].get('key')).toBeDefined();
                    expect(controls[1].get('key')).toBeDefined();
                    expect(controls[2].get('key')).toBeDefined();
                    expect(controls[3].get('key')).toBeDefined();
                    expect(controls[4].get('key')).toBeDefined();
                    expect(controls[5].get('key')).toBeDefined();
                    expect(controls[6].get('key')).toBeDefined();
                    expect(controls[7].get('key')).toBeDefined();
                    expect(controls[8].get('key')).toBeDefined();
                    expect(controls[9].get('key')).toBeDefined();
                    expect(controls[10].get('key')).toBeDefined();
                    expect(controls[11].get('key')).toBeDefined();
                })
            );

            it(
                'should populate metadata and configurations when FILE is selected as destination endpoint',
                async(
                    inject([DataPipelineControlService], (dataPipelineControlService: DataPipelineControlService) => {
                        // GIVEN
                        comp.depends = dataPipelineControlService.toEndpointFormGroup();
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.FILE);
                        comp.onTypeChange();

                        // THEN
                        expect(comp.configurationsMetadata).toBeDefined();
                        expect(comp.configurationsMetadata.length).toEqual(5);
                        expect(comp.configurationsMetadata[0].key).toEqual('directoryName');
                        expect(comp.configurationsMetadata[1].key).toEqual('fileName');
                        expect(comp.configurationsMetadata[2].key).toEqual('flatten');
                        expect(comp.configurationsMetadata[3].key).toEqual('doneFileName');
                        expect(comp.configurationsMetadata[4].key).toEqual('fileExist');

                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(5);
                        expect(controls[0].get('key')).toBeDefined();
                        expect(controls[1].get('key')).toBeDefined();
                        expect(controls[2].get('key')).toBeDefined();
                        expect(controls[3].get('key')).toBeDefined();
                        expect(controls[4].get('key')).toBeDefined();
                    })
                )
            );

            describe('validations', () => {
                it(
                    'should assert configuration objects validations',
                    async(() => {
                        // GIVEN
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.FILE);
                        comp.onTypeChange();

                        // THEN
                        expect(comp.configurationsMetadata).toBeDefined();
                        expect(comp.configurationsMetadata.length).toEqual(12);
                        expect(comp.configurationsMetadata[0].key).toEqual('directoryName');
                        expect(comp.configurationsMetadata[1].key).toEqual('fileName');
                        expect(comp.configurationsMetadata[2].key).toEqual('antInclude');
                        expect(comp.configurationsMetadata[3].key).toEqual('antExclude');
                        expect(comp.configurationsMetadata[4].key).toEqual('recursive');
                        expect(comp.configurationsMetadata[5].key).toEqual('sortBy');
                        expect(comp.configurationsMetadata[6].key).toEqual('move');
                        expect(comp.configurationsMetadata[7].key).toEqual('moveFailed');
                        expect(comp.configurationsMetadata[8].key).toEqual('doneFileName');
                        expect(comp.configurationsMetadata[9].key).toEqual('delay');
                        expect(comp.configurationsMetadata[10].key).toEqual('initialDelay');
                        expect(comp.configurationsMetadata[11].key).toEqual('scheduler.cron');

                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(12);
                        expect(controls[0].get('value').valid).toBeFalsy();
                        expect(controls[1].get('value').valid).toBeTruthy();
                        expect(controls[2].get('value').valid).toBeTruthy();
                        expect(controls[3].get('value').valid).toBeTruthy();
                        expect(controls[4].get('value').valid).toBeTruthy();
                        expect(controls[5].get('value').valid).toBeTruthy();
                        expect(controls[6].get('value').valid).toBeTruthy();
                        expect(controls[7].get('value').valid).toBeTruthy();
                        expect(controls[8].get('value').valid).toBeTruthy();
                        expect(controls[9].get('value').valid).toBeTruthy();
                        expect(controls[10].get('value').valid).toBeTruthy();
                        expect(controls[11].get('value').valid).toBeTruthy();
                    })
                );
            });

            describe('initial state', () => {
                it(
                    'should check configurations initial state in update flow',
                    async(() => {
                        // GIVEN
                        comp.form.get('type').setValue(EndpointType.FILE);
                        comp.endpoint = {
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
                            filters: [],
                            transformers: []
                        };

                        // WHEN
                        comp.ngOnInit();

                        // THEN
                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(12);
                        expect(controls[0].get('key').value).toEqual('directoryName');
                        expect(controls[0].get('value').value).toEqual('/data');
                        expect(controls[1].get('key').value).toEqual('fileName');
                        expect(controls[1].get('value').value).toEqual('test');
                        expect(controls[2].get('value').value).toBeNull();
                        expect(controls[3].get('value').value).toBeNull();
                        expect(controls[4].get('value').value).toBeNull();
                        expect(controls[5].get('value').value).toBeNull();
                        expect(controls[6].get('value').value).toBeNull();
                        expect(controls[7].get('value').value).toBeNull();
                        expect(controls[8].get('value').value).toBeNull();
                        expect(controls[9].get('value').value).toBeNull();
                        expect(controls[10].get('value').value).toBeNull();
                        expect(controls[11].get('value').value).toBeNull();
                    })
                );

                it(
                    'should check configurations initial state on type change',
                    async(() => {
                        // GIVEN
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.FILE);
                        comp.onTypeChange();

                        // THEN
                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(12);
                        expect(controls[0].get('key').value).toEqual('directoryName');
                        expect(controls[0].get('value').value).toBeNull();
                        expect(controls[1].get('key').value).toEqual('fileName');
                        expect(controls[1].get('value').value).toBeNull();
                        expect(controls[2].get('value').value).toBeNull();
                        expect(controls[3].get('value').value).toBeNull();
                        expect(controls[4].get('value').value).toBeNull();
                        expect(controls[5].get('value').value).toBeNull();
                        expect(controls[6].get('value').value).toBeNull();
                        expect(controls[7].get('value').value).toBeNull();
                        expect(controls[8].get('value').value).toBeNull();
                        expect(controls[9].get('value').value).toBeNull();
                        expect(controls[10].get('value').value).toBeNull();
                        expect(controls[11].get('value').value).toBeNull();
                    })
                );
            });
        });

        describe('MLLP endpoint', () => {
            it(
                'should populate metadata and configurations when MLLP is selected as an endpoint',
                async(() => {
                    // GIVEN
                    comp.ngOnInit();

                    // WHEN
                    comp.form.get('type').setValue(EndpointType.MLLP);
                    comp.onTypeChange();

                    // THEN
                    expect(comp.configurationsMetadata).toBeDefined();
                    expect(comp.configurationsMetadata.length).toEqual(3);
                    expect(comp.configurationsMetadata[0].key).toEqual('hostname');
                    expect(comp.configurationsMetadata[1].key).toEqual('port');
                    expect(comp.configurationsMetadata[2].key).toEqual('idleTimeout');

                    const controls = comp.form.get('configurations')['controls'];
                    expect(controls.length).toEqual(3);
                    expect(controls[0].get('key')).toBeDefined();
                    expect(controls[1].get('key')).toBeDefined();
                    expect(controls[2].get('key')).toBeDefined();
                })
            );

            it(
                'should populate metadata and configurations when MLLP is selected as destination endpoint',
                async(
                    inject([DataPipelineControlService], (dataPipelineControlService: DataPipelineControlService) => {
                        // GIVEN
                        comp.depends = dataPipelineControlService.toEndpointFormGroup();
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.MLLP);
                        comp.onTypeChange();

                        // THEN
                        expect(comp.configurationsMetadata).toBeDefined();
                        expect(comp.configurationsMetadata.length).toEqual(3);
                        expect(comp.configurationsMetadata[0].key).toEqual('hostname');
                        expect(comp.configurationsMetadata[1].key).toEqual('port');
                        expect(comp.configurationsMetadata[2].key).toEqual('connectTimeout');

                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(3);
                        expect(controls[0].get('key')).toBeDefined();
                        expect(controls[1].get('key')).toBeDefined();
                        expect(controls[2].get('key')).toBeDefined();
                    })
                )
            );

            describe('validations', () => {
                it(
                    'should assert configuration objects validations',
                    async(() => {
                        // GIVEN
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.MLLP);
                        comp.onTypeChange();

                        // THEN
                        expect(comp.configurationsMetadata).toBeDefined();
                        expect(comp.configurationsMetadata.length).toEqual(3);
                        expect(comp.configurationsMetadata[0].key).toEqual('hostname');
                        expect(comp.configurationsMetadata[1].key).toEqual('port');
                        expect(comp.configurationsMetadata[2].key).toEqual('idleTimeout');

                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(3);
                        expect(controls[0].get('key').valid).toBeTruthy();
                        expect(controls[0].get('value').valid).toBeFalsy();
                        expect(controls[1].get('key').valid).toBeTruthy();
                        expect(controls[1].get('value').valid).toBeFalsy();
                        expect(controls[2].get('value').valid).toBeTruthy();
                    })
                );
            });

            describe('initial state', () => {
                it(
                    'should check configurations initial state in update flow',
                    async(() => {
                        // GIVEN
                        comp.form.get('type').setValue(EndpointType.MLLP);
                        comp.endpoint = {
                            id: 13651,
                            type: EndpointType.FILE,
                            name: 'destinationEndpoint',
                            inDataType: DataType.HL7_V2,
                            outDataType: DataType.HL7_V2,
                            configurations: [
                                {
                                    id: 13701,
                                    key: 'hostname',
                                    value: 'localhost'
                                },
                                {
                                    id: 13702,
                                    key: 'port',
                                    value: '1234'
                                },
                                {
                                    id: 13704,
                                    key: 'idleTimeout',
                                    value: 60000
                                }
                            ],
                            filters: [],
                            transformers: []
                        };

                        // WHEN
                        comp.ngOnInit();

                        // THEN
                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(3);
                        expect(controls[0].get('key').value).toEqual('hostname');
                        expect(controls[0].get('value').value).toEqual('localhost');
                        expect(controls[1].get('key').value).toEqual('port');
                        expect(controls[1].get('value').value).toEqual('1234');
                        expect(controls[2].get('value').value).toEqual(60000);
                    })
                );

                it(
                    'should check configurations initial state on type change',
                    async(() => {
                        // GIVEN
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.MLLP);
                        comp.onTypeChange();

                        // THEN
                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(3);
                        expect(controls[0].get('key').value).toEqual('hostname');
                        expect(controls[0].get('value').value).toBeNull();
                        expect(controls[1].get('key').value).toEqual('port');
                        expect(controls[1].get('value').value).toBeNull();
                        expect(controls[2].get('value').value).toBeNull();
                    })
                );

                it(
                    'should check destination endpoint configurations initial state on type change',
                    async(
                        inject([DataPipelineControlService], (dataPipelineControlService: DataPipelineControlService) => {
                            // GIVEN
                            comp.depends = dataPipelineControlService.toEndpointFormGroup();
                            comp.ngOnInit();

                            // WHEN
                            comp.form.get('type').setValue(EndpointType.MLLP);
                            comp.onTypeChange();

                            // THEN
                            const controls = comp.form.get('configurations')['controls'];
                            expect(controls.length).toEqual(3);
                            expect(controls[0].get('key').value).toEqual('hostname');
                            expect(controls[0].get('value').value).toBeNull();
                            expect(controls[1].get('key').value).toEqual('port');
                            expect(controls[1].get('value').value).toBeNull();
                            expect(controls[2].get('value').value).toEqual(30000);
                        })
                    )
                );
            });
        });

        describe('SFTP endpoint', () => {
            it(
                'should populate metadata and configurations when SFTP is selected as source endpoint',
                async(() => {
                    // GIVEN
                    comp.ngOnInit();

                    // WHEN
                    comp.form.get('type').setValue(EndpointType.SFTP);
                    comp.onTypeChange();

                    // THEN
                    expect(comp.configurationsMetadata).toBeDefined();
                    expect(comp.configurationsMetadata.length).toEqual(16);
                    expect(comp.configurationsMetadata[0].key).toEqual('hostname');
                    expect(comp.configurationsMetadata[1].key).toEqual('port');
                    expect(comp.configurationsMetadata[2].key).toEqual('username');
                    expect(comp.configurationsMetadata[3].key).toEqual('password');
                    expect(comp.configurationsMetadata[4].key).toEqual('directoryName');
                    expect(comp.configurationsMetadata[5].key).toEqual('fileName');
                    expect(comp.configurationsMetadata[6].key).toEqual('antInclude');
                    expect(comp.configurationsMetadata[7].key).toEqual('antExclude');
                    expect(comp.configurationsMetadata[8].key).toEqual('recursive');
                    expect(comp.configurationsMetadata[9].key).toEqual('sortBy');
                    expect(comp.configurationsMetadata[10].key).toEqual('move');
                    expect(comp.configurationsMetadata[11].key).toEqual('moveFailed');
                    expect(comp.configurationsMetadata[12].key).toEqual('doneFileName');
                    expect(comp.configurationsMetadata[13].key).toEqual('delay');
                    expect(comp.configurationsMetadata[14].key).toEqual('initialDelay');
                    expect(comp.configurationsMetadata[15].key).toEqual('scheduler.cron');

                    const controls = comp.form.get('configurations')['controls'];
                    expect(controls.length).toEqual(16);
                    expect(controls[0].get('key')).toBeDefined();
                    expect(controls[1].get('key')).toBeDefined();
                    expect(controls[2].get('key')).toBeDefined();
                    expect(controls[3].get('key')).toBeDefined();
                    expect(controls[4].get('key')).toBeDefined();
                    expect(controls[5].get('key')).toBeDefined();
                    expect(controls[6].get('key')).toBeDefined();
                    expect(controls[7].get('key')).toBeDefined();
                    expect(controls[8].get('key')).toBeDefined();
                    expect(controls[9].get('key')).toBeDefined();
                    expect(controls[10].get('key')).toBeDefined();
                    expect(controls[11].get('key')).toBeDefined();
                    expect(controls[12].get('key')).toBeDefined();
                    expect(controls[13].get('key')).toBeDefined();
                    expect(controls[14].get('key')).toBeDefined();
                    expect(controls[15].get('key')).toBeDefined();
                })
            );

            it(
                'should populate metadata and configurations when SFTP is selected as destination endpoint',
                async(
                    inject([DataPipelineControlService], (dataPipelineControlService: DataPipelineControlService) => {
                        // GIVEN
                        comp.depends = dataPipelineControlService.toEndpointFormGroup();
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.SFTP);
                        comp.onTypeChange();

                        // THEN
                        expect(comp.configurationsMetadata).toBeDefined();
                        expect(comp.configurationsMetadata.length).toEqual(9);
                        expect(comp.configurationsMetadata[0].key).toEqual('hostname');
                        expect(comp.configurationsMetadata[1].key).toEqual('port');
                        expect(comp.configurationsMetadata[2].key).toEqual('username');
                        expect(comp.configurationsMetadata[3].key).toEqual('password');
                        expect(comp.configurationsMetadata[4].key).toEqual('directoryName');
                        expect(comp.configurationsMetadata[5].key).toEqual('fileName');
                        expect(comp.configurationsMetadata[6].key).toEqual('flatten');
                        expect(comp.configurationsMetadata[7].key).toEqual('doneFileName');
                        expect(comp.configurationsMetadata[8].key).toEqual('fileExist');

                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(9);
                        expect(controls[0].get('key')).toBeDefined();
                        expect(controls[1].get('key')).toBeDefined();
                        expect(controls[2].get('key')).toBeDefined();
                        expect(controls[3].get('key')).toBeDefined();
                        expect(controls[4].get('key')).toBeDefined();
                        expect(controls[5].get('key')).toBeDefined();
                        expect(controls[6].get('key')).toBeDefined();
                        expect(controls[7].get('key')).toBeDefined();
                        expect(controls[8].get('key')).toBeDefined();
                    })
                )
            );

            describe('validations', () => {
                it(
                    'should assert configuration objects validations',
                    async(() => {
                        // GIVEN
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.SFTP);
                        comp.onTypeChange();

                        // THEN
                        expect(comp.configurationsMetadata).toBeDefined();
                        expect(comp.configurationsMetadata.length).toEqual(16);
                        expect(comp.configurationsMetadata[0].key).toEqual('hostname');
                        expect(comp.configurationsMetadata[1].key).toEqual('port');
                        expect(comp.configurationsMetadata[2].key).toEqual('username');
                        expect(comp.configurationsMetadata[3].key).toEqual('password');
                        expect(comp.configurationsMetadata[4].key).toEqual('directoryName');
                        expect(comp.configurationsMetadata[5].key).toEqual('fileName');
                        expect(comp.configurationsMetadata[6].key).toEqual('antInclude');
                        expect(comp.configurationsMetadata[7].key).toEqual('antExclude');
                        expect(comp.configurationsMetadata[8].key).toEqual('recursive');
                        expect(comp.configurationsMetadata[9].key).toEqual('sortBy');
                        expect(comp.configurationsMetadata[10].key).toEqual('move');
                        expect(comp.configurationsMetadata[11].key).toEqual('moveFailed');
                        expect(comp.configurationsMetadata[12].key).toEqual('doneFileName');
                        expect(comp.configurationsMetadata[13].key).toEqual('delay');
                        expect(comp.configurationsMetadata[14].key).toEqual('initialDelay');
                        expect(comp.configurationsMetadata[15].key).toEqual('scheduler.cron');

                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(16);
                        expect(controls[0].get('value').valid).toBeFalsy();
                        expect(controls[1].get('value').valid).toBeTruthy();
                        expect(controls[2].get('value').valid).toBeFalsy();
                        expect(controls[3].get('value').valid).toBeFalsy();
                        expect(controls[4].get('value').valid).toBeFalsy();
                        expect(controls[5].get('value').valid).toBeTruthy();
                        expect(controls[6].get('value').valid).toBeTruthy();
                        expect(controls[7].get('value').valid).toBeTruthy();
                        expect(controls[8].get('value').valid).toBeTruthy();
                        expect(controls[9].get('value').valid).toBeTruthy();
                        expect(controls[10].get('value').valid).toBeTruthy();
                        expect(controls[11].get('value').valid).toBeTruthy();
                        expect(controls[12].get('value').valid).toBeTruthy();
                        expect(controls[13].get('value').valid).toBeTruthy();
                        expect(controls[14].get('value').valid).toBeTruthy();
                        expect(controls[15].get('value').valid).toBeTruthy();
                    })
                );
            });

            describe('initial state', () => {
                it(
                    'should check configurations initial state in update flow',
                    async(() => {
                        // GIVEN
                        comp.form.get('type').setValue(EndpointType.SFTP);
                        comp.endpoint = {
                            type: EndpointType.FILE,
                            name: 'destinationEndpoint',
                            inDataType: DataType.HL7_V2,
                            outDataType: DataType.HL7_V2,
                            configurations: [
                                {
                                    key: 'hostname',
                                    value: 'localhost'
                                },
                                {
                                    key: 'port',
                                    value: '1234'
                                },
                                {
                                    key: 'username',
                                    value: 'test'
                                },
                                {
                                    key: 'password',
                                    value: 'ptest'
                                },
                                {
                                    key: 'directoryName',
                                    value: '/home/test'
                                },
                                {
                                    key: 'fileName',
                                    value: 'abc.txt'
                                },
                                {
                                    key: 'delay',
                                    value: '1000'
                                }
                            ],
                            filters: [],
                            transformers: []
                        };

                        // WHEN
                        comp.ngOnInit();

                        // THEN
                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(16);
                        expect(controls[0].get('value').value).toEqual('localhost');
                        expect(controls[1].get('value').value).toEqual('1234');
                        expect(controls[2].get('value').value).toEqual('test');
                        expect(controls[3].get('value').value).toEqual('ptest');
                        expect(controls[4].get('value').value).toEqual('/home/test');
                        expect(controls[5].get('value').value).toEqual('abc.txt');
                        expect(controls[6].get('value').value).toBeNull();
                        expect(controls[7].get('value').value).toBeNull();
                        expect(controls[8].get('value').value).toBeNull();
                        expect(controls[9].get('value').value).toBeNull();
                        expect(controls[10].get('value').value).toBeNull();
                        expect(controls[11].get('value').value).toBeNull();
                        expect(controls[12].get('value').value).toBeNull();
                        expect(controls[13].get('value').value).toEqual('1000');
                        expect(controls[14].get('value').value).toBeNull();
                        expect(controls[15].get('value').value).toBeNull();
                    })
                );

                it(
                    'should check configurations initial state on type change',
                    async(
                        inject([DataPipelineControlService], (dataPipelineControlService: DataPipelineControlService) => {
                            // GIVEN
                            comp.depends = dataPipelineControlService.toEndpointFormGroup();
                            comp.ngOnInit();

                            // WHEN
                            comp.form.get('type').setValue(EndpointType.SFTP);
                            comp.onTypeChange();

                            // THEN
                            const controls = comp.form.get('configurations')['controls'];
                            expect(controls.length).toEqual(9);
                            expect(controls[0].get('value').value).toBeNull();
                            expect(controls[1].get('value').value).toEqual(22);
                            expect(controls[2].get('value').value).toBeNull();
                            expect(controls[3].get('value').value).toBeNull();
                            expect(controls[4].get('value').value).toBeNull();
                            expect(controls[5].get('value').value).toBeNull();
                            expect(controls[6].get('value').value).toBeNull();
                            expect(controls[7].get('value').value).toBeNull();
                            expect(controls[8].get('value').value).toEqual('Override');
                        })
                    )
                );
            });
        });

        describe('HTTP endpoint', () => {
            it(
                'should populate metadata and configurations when HTTP is selected as an endpoint',
                async(() => {
                    // GIVEN
                    comp.ngOnInit();

                    // WHEN
                    comp.form.get('type').setValue(EndpointType.HTTP);
                    comp.onTypeChange();

                    // THEN
                    expect(comp.configurationsMetadata).toBeDefined();
                    expect(comp.configurationsMetadata.length).toEqual(8);
                    expect(comp.configurationsMetadata[0].key).toEqual('hostname');
                    expect(comp.configurationsMetadata[1].key).toEqual('port');
                    expect(comp.configurationsMetadata[2].key).toEqual('resourceUri');
                    expect(comp.configurationsMetadata[3].key).toEqual('username');
                    expect(comp.configurationsMetadata[4].key).toEqual('password');
                    expect(comp.configurationsMetadata[5].key).toEqual('enableCORS');
                    expect(comp.configurationsMetadata[6].key).toEqual('sessionSupport');
                    expect(comp.configurationsMetadata[7].key).toEqual('isSecure');

                    const controls = comp.form.get('configurations')['controls'];
                    expect(controls.length).toEqual(8);
                    expect(controls[0].get('key')).toBeDefined();
                    expect(controls[1].get('key')).toBeDefined();
                    expect(controls[2].get('key')).toBeDefined();
                    expect(controls[3].get('key')).toBeDefined();
                    expect(controls[4].get('key')).toBeDefined();
                    expect(controls[5].get('key')).toBeDefined();
                    expect(controls[6].get('key')).toBeDefined();
                    expect(controls[7].get('key')).toBeDefined();
                })
            );

            describe('validations', () => {
                it(
                    'should assert configuration objects validations',
                    async(() => {
                        // GIVEN
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.HTTP);
                        comp.onTypeChange();

                        // THEN
                        expect(comp.configurationsMetadata).toBeDefined();
                        expect(comp.configurationsMetadata.length).toEqual(8);
                        expect(comp.configurationsMetadata[0].key).toEqual('hostname');
                        expect(comp.configurationsMetadata[1].key).toEqual('port');
                        expect(comp.configurationsMetadata[2].key).toEqual('resourceUri');
                        expect(comp.configurationsMetadata[3].key).toEqual('username');
                        expect(comp.configurationsMetadata[4].key).toEqual('password');
                        expect(comp.configurationsMetadata[5].key).toEqual('enableCORS');
                        expect(comp.configurationsMetadata[6].key).toEqual('sessionSupport');
                        expect(comp.configurationsMetadata[7].key).toEqual('isSecure');

                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(8);
                        expect(controls[0].get('value').valid).toBeFalsy();
                        expect(controls[1].get('value').valid).toBeFalsy();
                        expect(controls[2].get('value').valid).toBeFalsy();
                        expect(controls[3].get('value').valid).toBeFalsy();
                        expect(controls[4].get('value').valid).toBeFalsy();
                        expect(controls[5].get('value').valid).toBeTruthy();
                        expect(controls[6].get('value').valid).toBeTruthy();
                        expect(controls[7].get('value').valid).toBeTruthy();
                    })
                );
            });

            describe('initial state', () => {
                it(
                    'should check configurations initial state in update flow',
                    async(() => {
                        // GIVEN
                        comp.form.get('type').setValue(EndpointType.HTTP);
                        comp.endpoint = {
                            id: 13651,
                            type: EndpointType.HTTP,
                            name: 'destinationEndpoint',
                            inDataType: DataType.HL7_V2,
                            outDataType: DataType.HL7_V2,
                            configurations: [
                                {
                                    key: 'hostname',
                                    value: 'localhost'
                                },
                                {
                                    key: 'port',
                                    value: '1234'
                                },
                                {
                                    key: 'resourceUri',
                                    value: 'test'
                                },
                                {
                                    key: 'username',
                                    value: 'test'
                                },
                                {
                                    key: 'password',
                                    value: 'test'
                                }
                            ],
                            filters: [],
                            transformers: []
                        };

                        // WHEN
                        comp.ngOnInit();

                        // THEN
                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(8);
                        expect(controls[0].get('key').value).toEqual('hostname');
                        expect(controls[0].get('value').value).toEqual('localhost');
                        expect(controls[1].get('key').value).toEqual('port');
                        expect(controls[1].get('value').value).toEqual('1234');
                        expect(controls[2].get('key').value).toEqual('resourceUri');
                        expect(controls[2].get('value').value).toEqual('test');
                        expect(controls[3].get('key').value).toEqual('username');
                        expect(controls[3].get('value').value).toEqual('test');
                        expect(controls[4].get('key').value).toEqual('password');
                        expect(controls[4].get('value').value).toEqual('test');
                        expect(controls[5].get('value').value).toBeFalsy();
                        expect(controls[6].get('value').value).toBeFalsy();
                    })
                );

                it(
                    'should check configurations initial state on type change',
                    async(() => {
                        // GIVEN
                        comp.ngOnInit();

                        // WHEN
                        comp.form.get('type').setValue(EndpointType.HTTP);
                        comp.onTypeChange();

                        // THEN
                        const controls = comp.form.get('configurations')['controls'];
                        expect(controls.length).toEqual(8);
                        expect(controls[0].get('key').value).toEqual('hostname');
                        expect(controls[0].get('value').value).toBeNull();
                        expect(controls[1].get('key').value).toEqual('port');
                        expect(controls[1].get('value').value).toBeNull();
                        expect(controls[2].get('key').value).toEqual('resourceUri');
                        expect(controls[2].get('value').value).toBeNull();
                        expect(controls[3].get('key').value).toEqual('username');
                        expect(controls[3].get('value').value).toBeNull();
                        expect(controls[4].get('key').value).toEqual('password');
                        expect(controls[4].get('value').value).toBeNull();
                        expect(controls[5].get('value').value).toBeFalsy();
                        expect(controls[6].get('value').value).toBeFalsy();
                    })
                );

                it(
                    'should check destination endpoint configurations initial state on type change',
                    async(
                        inject([DataPipelineControlService], (dataPipelineControlService: DataPipelineControlService) => {
                            // GIVEN
                            comp.depends = dataPipelineControlService.toEndpointFormGroup();
                            comp.ngOnInit();

                            // WHEN
                            comp.form.get('type').setValue(EndpointType.HTTP);
                            comp.onTypeChange();

                            // THEN
                            const controls = comp.form.get('configurations')['controls'];
                            expect(controls.length).toEqual(8);
                            expect(controls[0].get('key').value).toEqual('hostname');
                            expect(controls[0].get('value').value).toBeNull();
                            expect(controls[1].get('key').value).toEqual('port');
                            expect(controls[1].get('value').value).toBeNull();
                            expect(controls[2].get('key').value).toEqual('resourceUri');
                            expect(controls[2].get('value').value).toBeNull();
                            expect(controls[3].get('key').value).toEqual('httpMethod');
                            expect(controls[3].get('value').value).toEqual('GET');
                            expect(controls[4].get('key').value).toEqual('authMethod');
                            expect(controls[4].get('value').value).toEqual('NONE');
                            expect(controls[5].get('key').value).toEqual('authUsername');
                            expect(controls[5].get('value').value).toBeNull();
                            expect(controls[6].get('key').value).toEqual('authPassword');
                            expect(controls[6].get('value').value).toBeNull();
                        })
                    )
                );
            });
        });
    });
});
