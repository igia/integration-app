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
import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import locale from '@angular/common/locales/en';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from 'app/core/in-memory-data.service';
import { BUILD_PROFILE } from 'app/app.constants';

@NgModule({
    imports: [
        HttpClientModule,
        BUILD_PROFILE === 'standalone'
            ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
                  delay: 500,
                  passThruUnknownUrl: true,
                  put204: false,
                  post204: false
              })
            : []
    ],
    exports: [],
    declarations: [],
    providers: [
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
        DatePipe
    ]
})
export class IntegrationappCoreModule {
    constructor() {
        registerLocaleData(locale);
    }
}
