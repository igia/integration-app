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
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

import { EndpointConfigurationComponent } from 'app/data-pipeline/endpoint/configuration/endpoint-configuration.component';
import { IntegrationappTestModule } from '../../../../test.module';

describe('Component Tests', () => {
    describe('EndpointConfigurationComponent', () => {
        let comp: EndpointConfigurationComponent;
        let fixture: ComponentFixture<EndpointConfigurationComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IntegrationappTestModule],
                declarations: [EndpointConfigurationComponent],
                providers: []
            })
                .overrideTemplate(EndpointConfigurationComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EndpointConfigurationComponent);
            comp = fixture.componentInstance;
        });

        describe('validations', () => {
            it('should check configurations array validations', () => {
                // GIVEN
                comp.configurations = new FormArray([
                    new FormGroup({
                        key: new FormControl('host'),
                        value: new FormControl('', [Validators.required])
                    })
                ]);
                // THEN
                const configuration = comp.configurations['controls'][0];
                expect(configuration.get('key').valid).toBeTruthy();
                expect(configuration.get('value').valid).toBeFalsy();
            });
        });
    });
});
