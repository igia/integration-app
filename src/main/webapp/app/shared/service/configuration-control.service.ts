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
import { Injectable } from '@angular/core';
import { Validators, FormBuilder, ValidatorFn, FormGroup } from '@angular/forms';

import { ConfigurationMetadata } from '../model/configuration/configuration-metadata.model';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationControlService {
    constructor(private fb: FormBuilder) {}

    toFormGroup(configuration: ConfigurationMetadata<any>): FormGroup {
        return this.fb.group({
            key: this.fb.control(configuration.key, [Validators.required]),
            value: this.fb.control(configuration.value, [...this.getControlValidations(configuration)])
        });
    }

    private getControlValidations(configuration: ConfigurationMetadata<any>): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (configuration.required) {
            validators.push(Validators.required);
        }

        if (configuration.minLength) {
            validators.push(Validators.minLength(configuration.minLength));
        }

        if (configuration.maxLength) {
            validators.push(Validators.maxLength(configuration.maxLength));
        }

        if (configuration.min) {
            validators.push(Validators.min(configuration.min));
        }

        if (configuration.max) {
            validators.push(Validators.max(configuration.max));
        }

        if (configuration.pattern) {
            validators.push(Validators.pattern(configuration.pattern));
        }

        return validators;
    }
}
