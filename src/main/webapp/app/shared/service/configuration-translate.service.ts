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
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { ConfiguationMetadataService } from './configuration-metadata.service';
import { ConfigurationMetadata, DropdownConfigurationMetadata } from '../model';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationTranslateService {
    constructor(private configurationMetadataService: ConfiguationMetadataService, private translateService: TranslateService) {
        this.subscribeToLanguageChange();
    }

    loadTranslations(configurationMetadata: ConfigurationMetadata<any>[]) {
        const translationObject = {
            endpoint: {
                configurations: {}
            }
        };
        configurationMetadata
            .filter((configuration: ConfigurationMetadata<any>) => configuration.label !== undefined && configuration.label.length)
            .filter((configuration: ConfigurationMetadata<any>) =>
                configuration.label.find((label: { key: string; value: string }) => label.key === this.translateService.currentLang)
            )
            .forEach((configuration: ConfigurationMetadata<any>) => {
                translationObject.endpoint.configurations[configuration.key] = configuration.label.find(
                    (label: { key: string; value: string }) => label.key === this.translateService.currentLang
                ).value;

                if (configuration['options']) {
                    const options = (configuration as DropdownConfigurationMetadata<any>).options as Array<any>;
                    options.forEach((option: { key: string; value: Array<any> }) => {
                        const valueObject = option.value.find(
                            (label: { key: string; value: string }) => label.key === this.translateService.currentLang
                        );
                        if (valueObject) {
                            translationObject.endpoint.configurations[configuration.key + 'Option.' + option.key] = valueObject.value;
                        }
                    });
                }
            });
        this.translateService.setTranslation(this.translateService.currentLang, translationObject, true);
    }

    private subscribeToLanguageChange() {
        this.translateService.onLangChange.subscribe(() => {
            this.configurationMetadataService.configurations
                .pipe(take(1))
                .subscribe((configurationMetadata: ConfigurationMetadata<any>[]) => this.loadTranslations(configurationMetadata));
        });
    }
}
