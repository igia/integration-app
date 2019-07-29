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
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { EndpointConfigurationDetailComponent } from 'app/data-pipeline/endpoint/configuration/endpoint-configuration-detail/endpoint-configuration-detail.component';
import { IntegrationappTestModule } from '../../../../../test.module';

describe('Component Tests', () => {
    describe('EndpointConfigurationDetailComponent', () => {
        let comp: EndpointConfigurationDetailComponent;
        let fixture: ComponentFixture<EndpointConfigurationDetailComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IntegrationappTestModule],
                declarations: [EndpointConfigurationDetailComponent],
                providers: []
            })
                .overrideTemplate(EndpointConfigurationDetailComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EndpointConfigurationDetailComponent);
            comp = fixture.componentInstance;
        });

        it('should get unique control id', () => {
            // GIVEN
            comp.id = 'c';
            // THEN
            expect(comp.uniqueId('test')).toEqual('ctest');
        });

        describe('validations', () => {
            it('should check configurations array validations', () => {
                // GIVEN
                comp.configuration = new FormGroup({
                    key: new FormControl('host'),
                    value: new FormControl('', [Validators.required])
                });

                // THEN
                expect(comp.configuration.get('key').valid).toBeTruthy();
                expect(comp.configurationKeyValue).toEqual('host');
                expect(comp.configurationValue.valid).toBeFalsy();
            });
        });
    });
});
