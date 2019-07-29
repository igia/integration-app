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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
    Pipeline,
    DataPipeline,
    DataPipelineForm,
    DataPipelineEndpointForm,
    Endpoint,
    Script,
    DataPipelineEndpoint,
    ScriptType
} from 'app/shared';

@Injectable({
    providedIn: 'root'
})
export class DataPipelineControlService {
    constructor(private fb: FormBuilder) {}

    toFormGroup(pipeline: Pipeline = new DataPipeline()) {
        const form = new DataPipelineForm();
        form.id = this.fb.control(pipeline.id || undefined);
        form.state = this.fb.control(pipeline.state || undefined);
        form.version = this.fb.control(pipeline.version || undefined);
        form.name = this.fb.control(pipeline.name || '', [Validators.required, Validators.maxLength(255)]);
        form.description = this.fb.control(pipeline.description || '');
        form.deploy = this.fb.control(pipeline.deploy || false);
        form.workerService = this.fb.control(pipeline.workerService || undefined, [Validators.required]);
        form.auditMessages = this.fb.control(pipeline.auditMessages || []);

        form.source = this.toEndpointFormGroup(pipeline.source);

        form.destinations = this.fb.array([
            this.toEndpointFormGroup(pipeline.destinations && pipeline.destinations.length ? pipeline.destinations[0] : undefined)
        ]);

        return new FormGroup(form as any);
    }

    toEndpointFormGroup(endpoint: Endpoint = new DataPipelineEndpoint()) {
        const form = new DataPipelineEndpointForm();
        form.name = this.fb.control(endpoint.name || '', [Validators.required, Validators.maxLength(255)]);
        form.type = this.fb.control(endpoint.type || undefined, [Validators.required]);
        form.inDataType = this.fb.control(endpoint.inDataType || undefined, [Validators.required]);
        form.outDataType = this.fb.control(endpoint.outDataType || undefined, [Validators.required]);
        form.configurations = this.fb.array([]);
        form.filters = this.fb.array([]);
        form.transformers = this.fb.array([]);
        form.responseTransformers = this.fb.array([]);

        if (endpoint.filters && endpoint.filters.length) {
            endpoint.filters.sort((script1: Script, script2: Script) => script1.order - script2.order);
            endpoint.filters
                .map((script: Script) => this.toScriptFormGroup(script))
                .forEach((scriptFormGroup: FormGroup) => form.filters.push(scriptFormGroup));
        }

        if (endpoint.transformers && endpoint.transformers.length) {
            endpoint.transformers.sort((script1: Script, script2: Script) => script1.order - script2.order);
            endpoint.transformers
                .map((script: Script) => this.toScriptFormGroup(script))
                .forEach((scriptFormGroup: FormGroup) => form.transformers.push(scriptFormGroup));
        }

        if (endpoint.responseTransformers && endpoint.responseTransformers.length) {
            endpoint.responseTransformers.sort((script1: Script, script2: Script) => script1.order - script2.order);
            endpoint.responseTransformers
                .map((script: Script) => this.toScriptFormGroup(script))
                .forEach((scriptFormGroup: FormGroup) => form.responseTransformers.push(scriptFormGroup));
        }

        return this.fb.group(form);
    }

    toScriptFormGroup(script: Script = {}): FormGroup {
        return new FormGroup({
            type: this.fb.control(script.type || ScriptType.JAVASCRIPT, [Validators.required]),
            order: this.fb.control(script.order || '0', [Validators.required]),
            data: this.fb.control(script.data || '', [Validators.required]),
            description: this.fb.control(script.description || '', [Validators.maxLength(255)])
        });
    }
}
