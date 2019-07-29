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
import {
    TranslateModule,
    MissingTranslationHandler,
    TranslateParser,
    TranslateCompiler,
    TranslateLoader,
    TranslateStore,
    TranslateService,
    USE_STORE,
    USE_DEFAULT_LANG
} from '@ngx-translate/core';

import { ConfigurationTranslateService } from 'app/shared/service/configuration-translate.service';
import { ConfiguationMetadataService } from 'app/shared/service/configuration-metadata.service';
import { Observable } from 'rxjs';

describe('Service: Configuration Translate', () => {
    let service: ConfigurationTranslateService;
    let translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule],
            providers: [
                { provide: USE_DEFAULT_LANG },
                { provide: USE_STORE },
                ConfiguationMetadataService,
                ConfigurationTranslateService,
                TranslateService,
                TranslateStore,
                TranslateLoader,
                TranslateCompiler,
                TranslateParser,
                MissingTranslationHandler
            ]
        });

        service = TestBed.get(ConfigurationTranslateService);
        translateService = TestBed.get(TranslateService);
    });

    it('should load translations when configuration metadata contain language translations and user selected the language', () => {
        // GIVEN
        spyOn(translateService, 'setTranslation').and.stub();
        spyOn(translateService, 'getTranslation').and.stub();
        const translationObject = {
            endpoint: {
                configurations: {
                    antExclude: 'Exclude File pattern',
                    antInclude: 'Include File pattern',
                    authMethod: 'Authentication Method',
                    'authMethodOption.BASIC': 'BASIC',
                    'authMethodOption.NONE': 'NONE',
                    authPassword: 'Password',
                    authUsername: 'Username',
                    connectTimeout: 'Connect timeout (in milliseconds)',
                    delay: 'Delay (in milliseconds)',
                    directoryName: 'Directory Path',
                    doneFileName: 'Done file name',
                    enableCORS: 'Enable CORS',
                    fileExist: 'File exists Action',
                    'fileExistOption.Append': 'Add content to existing file',
                    'fileExistOption.Fail': 'Fail with an error',
                    'fileExistOption.Ignore': 'Silently ignore error',
                    'fileExistOption.Override': 'Replace existing file',
                    fileName: 'Filename',
                    flatten: 'Flatten directories',
                    hostname: 'Hostname',
                    httpMethod: 'HTTP Method',
                    'httpMethodOption.DELETE': 'DELETE',
                    'httpMethodOption.GET': 'GET',
                    'httpMethodOption.POST': 'POST',
                    'httpMethodOption.PUT': 'PUT',
                    idleTimeout: 'Idle timeout (in milliseconds)',
                    initialDelay: 'Initial delay (in milliseconds)',
                    move: 'Move directory',
                    moveFailed: 'Error directory',
                    password: 'Password',
                    port: 'Port',
                    recursive: 'Recursively read directories',
                    resourceUri: 'Resource URI',
                    'scheduler.cron': 'Cron expression',
                    sessionSupport: 'Enable session',
                    sortBy: 'Sort files criteria',
                    username: 'Username'
                }
            }
        };

        translateService.setDefaultLang('hi');

        // WHEN
        translateService.use('en');

        // THEN
        expect(translateService.setTranslation).toHaveBeenCalled();
        expect(translateService.setTranslation).toHaveBeenCalledWith('en', translationObject, true);
    });

    it('should load empty translations when configuration metadata doesnot contain language translations and user selected the language', () => {
        // GIVEN
        spyOn(translateService, 'setTranslation').and.stub();
        spyOn(translateService, 'getTranslation').and.stub();

        const translationObject = {
            endpoint: {
                configurations: {}
            }
        };

        translateService.setDefaultLang('en');

        // WHEN
        translateService.use('hi');

        // THEN
        expect(translateService.setTranslation).toHaveBeenCalled();
        expect(translateService.setTranslation).toHaveBeenCalledWith('hi', translationObject, true);
    });
});
