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
import { FormBuilder } from '@angular/forms';

import { ConfigurationControlService } from 'app/shared/service/configuration-control.service';
import { TextConfigurationMetadata } from 'app/shared';

describe('Service Tests', () => {
    let service: ConfigurationControlService;
    describe('ConfigurationControl Service', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [],
                providers: [FormBuilder, ConfigurationControlService]
            });
            service = TestBed.get(ConfigurationControlService);
        });

        describe('text configuration', () => {
            it('should create text control group', () => {
                // GIVEN
                const form = service.toFormGroup(new TextConfigurationMetadata());

                // THEN
                expect(form.get('key')).toBeDefined();
                expect(form.get('value')).toBeDefined();
            });

            it('should check text control group validations', () => {
                // GIVEN
                const form = service.toFormGroup(new TextConfigurationMetadata({ key: 'key', value: 'value' }));

                // THEN
                expect(form.get('key').valid).toBeTruthy();
                expect(form.get('value').valid).toBeTruthy();

                expect(form.get('key').value).toEqual('key');
                expect(form.get('value').value).toEqual('value');
            });

            it('should check required validation', () => {
                // GIVEN
                const form = service.toFormGroup(new TextConfigurationMetadata({ key: 'key', required: true }));

                // THEN
                expect(form.get('key').valid).toBeTruthy();
                expect(form.get('value').valid).toBeFalsy();

                expect(form.get('value').errors).toBeDefined();
                expect(form.get('value').errors.required).toBeTruthy();
            });

            it('should check minimum length validation', () => {
                // GIVEN
                const form = service.toFormGroup(new TextConfigurationMetadata({ key: 'key', value: '1', minLength: 2 }));

                // THEN
                expect(form.get('key').valid).toBeTruthy();
                expect(form.get('value').valid).toBeFalsy();

                expect(form.get('value').errors).toBeDefined();
                expect(form.get('value').errors.minlength).toBeDefined();
            });

            it('should check maximum length validation', () => {
                // GIVEN
                const form = service.toFormGroup(new TextConfigurationMetadata({ key: 'key', value: '1234', maxLength: 2 }));

                // THEN
                expect(form.get('key').valid).toBeTruthy();
                expect(form.get('value').valid).toBeFalsy();

                expect(form.get('value').errors).toBeDefined();
                expect(form.get('value').errors.maxlength).toBeDefined();
            });

            it('should check minimum value validation', () => {
                // GIVEN
                const form = service.toFormGroup(new TextConfigurationMetadata({ key: 'key', value: 12, min: 20 }));

                // THEN
                expect(form.get('key').valid).toBeTruthy();
                expect(form.get('value').valid).toBeFalsy();

                expect(form.get('value').errors).toBeDefined();
                expect(form.get('value').errors.min).toBeDefined();
            });

            it('should check maximum value validation', () => {
                // GIVEN
                const form = service.toFormGroup(new TextConfigurationMetadata({ key: 'key', value: 112, max: 20 }));

                // THEN
                expect(form.get('key').valid).toBeTruthy();
                expect(form.get('value').valid).toBeFalsy();

                expect(form.get('value').errors).toBeDefined();
                expect(form.get('value').errors.max).toBeDefined();
            });

            it('should check pattern validation', () => {
                // GIVEN
                const form = service.toFormGroup(new TextConfigurationMetadata({ key: 'key', value: '112d', pattern: '[0-9]+' }));

                // THEN
                expect(form.get('key').valid).toBeTruthy();
                expect(form.get('value').valid).toBeFalsy();

                expect(form.get('value').errors).toBeDefined();
                expect(form.get('value').errors.pattern).toBeDefined();
            });
        });
    });
});
