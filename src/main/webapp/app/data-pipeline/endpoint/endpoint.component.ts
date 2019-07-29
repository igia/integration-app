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
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';

import {
    ConfigurationMetadata,
    Endpoint,
    EndpointConfiguration,
    EndpointType,
    DataPipelineEndpoint,
    DataType,
    EndpointRoleType
} from 'app/shared';
import { ConfigurationControlService } from 'app/shared/service/configuration-control.service';
import { ConfiguationMetadataService } from 'app/shared/service/configuration-metadata.service';
import { ConfigurationTranslateService } from 'app/shared/service/configuration-translate.service';

@Component({
    selector: 'igia-endpoint',
    templateUrl: './endpoint.component.html',
    styleUrls: []
})
export class EndpointComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() id: string;
    @Input() endpoint: Endpoint;
    @Input() form: FormGroup;
    @Input() depends: FormGroup;
    @Input() endpointTypes: EndpointType[];
    @Input() endpointRole: EndpointRoleType;

    readonly dataTypes: DataType[];
    readonly configurationsMetadata: ConfigurationMetadata<any>[] = [];
    allConfigurationsMetadata: ConfigurationMetadata<any>[];

    private _cleanUp: Subject<any> = new Subject<any>();

    constructor(
        private configurationControlService: ConfigurationControlService,
        private configurationMetadataService: ConfiguationMetadataService,
        private configurationTranslateService: ConfigurationTranslateService
    ) {
        this.dataTypes = [DataType.HL7_V2, DataType.CSV, DataType.JSON, DataType.RAW];
    }

    ngOnInit() {
        this.subscribeToConfigurationMetadata();
        this.subscribeToDataTypeChange();
        this.subscribeToDataTypeChangeOnMaster();

        this.endpoint = this.endpoint || new DataPipelineEndpoint();
        if (this.endpoint && this.endpoint.type) {
            this.onTypeChange();
        }
    }

    ngAfterViewInit() {
        $('igia-endpoint').bootstrapMaterialDesign({});
    }

    ngOnDestroy() {
        this._cleanUp.next();
        this._cleanUp.complete();
    }

    get transformers(): FormArray {
        return this.form.get('transformers') as FormArray;
    }

    get responseTransformers(): FormArray {
        return this.form.get('responseTransformers') as FormArray;
    }

    get filters(): FormArray {
        return this.form.get('filters') as FormArray;
    }

    get inDataType(): FormControl {
        return this.form.get('inDataType') as FormControl;
    }

    get outDataType(): FormControl {
        return this.form.get('outDataType') as FormControl;
    }

    uniqueId(controlId: string): string {
        return this.id + controlId;
    }

    onTypeChange() {
        this.updateConfigurationsMetadata();
        this.updateConfigurationControls();
    }

    isDependentDataType() {
        return this.depends && this.depends.get('outDataType').value !== undefined;
    }

    isDataTypeOptionDisabled(dataType: DataType) {
        return this.isDependentDataType() && this.depends.get('outDataType').value !== dataType;
    }

    isProducer(): boolean {
        return this.endpointRole === EndpointRoleType.PRODUCER;
    }

    private subscribeToDataTypeChangeOnMaster() {
        if (this.depends) {
            this.depends.get('outDataType').valueChanges.subscribe(value => {
                this.inDataType.patchValue(value);
            });
        }
    }

    private subscribeToDataTypeChange() {
        this.inDataType.valueChanges.subscribe(value => {
            if (this.transformers.length === 0) {
                this.outDataType.patchValue(value);
            }
        });
    }

    private subscribeToConfigurationMetadata() {
        this.configurationMetadataService.configurations
            .pipe(takeUntil(this._cleanUp))
            .subscribe((configurations: ConfigurationMetadata<any>[]) => {
                this.configurationTranslateService.loadTranslations(configurations);
                this.allConfigurationsMetadata = configurations;
            });
    }

    private updateConfigurationControls(): void {
        const configurations = this.form.get('configurations') as FormArray;
        while (configurations.length) {
            configurations.removeAt(0);
        }

        this.configurationsMetadata.forEach((configuration: ConfigurationMetadata<any>) =>
            configurations.push(this.configurationControlService.toFormGroup(configuration))
        );
    }

    private updateConfigurationsMetadata(): void {
        const type: EndpointType = this.form.get('type').value;
        this.configurationsMetadata.splice(0, this.configurationsMetadata.length);

        if (this.allConfigurationsMetadata) {
            this.configurationsMetadata.push(
                ...this.allConfigurationsMetadata
                    .filter((configuration: ConfigurationMetadata<any>) => configuration.endpointType === type)
                    .filter(
                        (configuration: ConfigurationMetadata<any>) =>
                            configuration.endpointRoleType === EndpointRoleType.ALL ||
                            (this.depends === undefined && configuration.endpointRoleType === EndpointRoleType.CONSUMER) ||
                            (this.depends !== undefined && configuration.endpointRoleType === EndpointRoleType.PRODUCER)
                    )
                    .map((configuration: ConfigurationMetadata<any>) => {
                        const existingConfiguration = this.endpoint.configurations.find(
                            (endpointConfiguration: EndpointConfiguration) => endpointConfiguration.key === configuration.key
                        );
                        return existingConfiguration ? { ...configuration, value: existingConfiguration.value } : configuration;
                    })
            );
        }
        this.configurationsMetadata.sort((a, b) => a.order - b.order);
    }
}
