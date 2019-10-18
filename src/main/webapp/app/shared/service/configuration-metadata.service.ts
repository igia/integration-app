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
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
    EndpointType,
    TextConfigurationMetadata,
    DropdownConfigurationMetadata,
    EndpointRoleType,
    ConfigurationMetadata,
    TextFormControl,
    CheckboxConfigurationMetadata
} from '../model';

@Injectable({
    providedIn: 'root'
})
export class ConfiguationMetadataService implements OnDestroy {
    private _configurations: BehaviorSubject<ConfigurationMetadata<any> & TextFormControl<any>[]> = new BehaviorSubject<
        ConfigurationMetadata<any> & TextFormControl<any>[]
    >([]);

    constructor() {
        this.loadConfigurations();
    }

    ngOnDestroy() {
        this._configurations.complete();
        this._configurations.unsubscribe();
    }

    get configurations(): Observable<ConfigurationMetadata<any> & TextFormControl<any>[]> {
        return this._configurations.asObservable();
    }

    private loadConfigurations() {
        this._configurations.next([
            new TextConfigurationMetadata({
                key: 'hostname',
                required: true,
                order: 1,
                maxLength: 255,
                endpointType: EndpointType.MLLP,
                label: [
                    {
                        key: 'en',
                        value: 'Hostname'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'port',
                required: true,
                order: 2,
                min: 12000,
                max: 12100,
                pattern: '[0-9]+',
                endpointType: EndpointType.MLLP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Port'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'port',
                required: true,
                order: 3,
                min: 1,
                max: 65535,
                pattern: '[0-9]+',
                endpointType: EndpointType.MLLP,
                endpointRoleType: EndpointRoleType.PRODUCER,
                label: [
                    {
                        key: 'en',
                        value: 'Port'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'idleTimeout',
                required: false,
                order: 4,
                pattern: '[0-9]+',
                endpointType: EndpointType.MLLP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Idle timeout (in milliseconds)'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'connectTimeout',
                value: 30000,
                required: true,
                order: 5,
                pattern: '[0-9]+',
                endpointType: EndpointType.MLLP,
                endpointRoleType: EndpointRoleType.PRODUCER,
                label: [
                    {
                        key: 'en',
                        value: 'Connect timeout (in milliseconds)'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'directoryName',
                required: true,
                order: 1,
                maxLength: 255,
                endpointType: EndpointType.FILE,
                label: [
                    {
                        key: 'en',
                        value: 'Directory Path'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'fileName',
                required: false,
                order: 2,
                maxLength: 255,
                endpointType: EndpointType.FILE,
                label: [
                    {
                        key: 'en',
                        value: 'Filename'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'antInclude',
                order: 3,
                maxLength: 255,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Include File pattern'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'antExclude',
                order: 4,
                maxLength: 255,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Exclude File pattern'
                    }
                ]
            }),
            new CheckboxConfigurationMetadata<boolean>({
                key: 'recursive',
                order: 5,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Recursively read directories'
                    }
                ]
            }),
            new CheckboxConfigurationMetadata<boolean>({
                key: 'flatten',
                order: 6,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.PRODUCER,
                label: [
                    {
                        key: 'en',
                        value: 'Flatten directories'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'sortBy',
                order: 7,
                maxLength: 255,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Sort files criteria'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'move',
                order: 8,
                maxLength: 255,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Move directory'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'moveFailed',
                order: 9,
                maxLength: 255,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Error directory'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'doneFileName',
                order: 10,
                maxLength: 255,
                endpointType: EndpointType.FILE,
                label: [
                    {
                        key: 'en',
                        value: 'Done file name'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'delay',
                order: 11,
                min: 0,
                pattern: '[0-9]+',
                maxLength: 255,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Delay (in milliseconds)'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'initialDelay',
                order: 12,
                min: 0,
                pattern: '[0-9]+',
                maxLength: 255,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Initial delay (in milliseconds)'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'scheduler.cron',
                order: 13,
                maxLength: 255,
                endpointType: EndpointType.FILE,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Cron expression'
                    }
                ]
            }),
            new DropdownConfigurationMetadata({
                key: 'fileExist',
                value: 'Override',
                order: 14,
                endpointRoleType: EndpointRoleType.PRODUCER,
                endpointType: EndpointType.FILE,
                options: [
                    {
                        key: 'Override',
                        value: [
                            {
                                key: 'en',
                                value: 'Replace existing file'
                            }
                        ]
                    },
                    {
                        key: 'Append',
                        value: [
                            {
                                key: 'en',
                                value: 'Add content to existing file'
                            }
                        ]
                    },
                    {
                        key: 'Fail',
                        value: [
                            {
                                key: 'en',
                                value: 'Fail with an error'
                            }
                        ]
                    },
                    {
                        key: 'Ignore',
                        value: [
                            {
                                key: 'en',
                                value: 'Silently ignore error'
                            }
                        ]
                    }
                ],
                label: [
                    {
                        key: 'en',
                        value: 'File exists Action'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'hostname',
                required: true,
                order: 1,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                label: [
                    {
                        key: 'en',
                        value: 'Hostname'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'port',
                value: 22,
                required: true,
                min: 1,
                max: 65535,
                pattern: '[0-9]+',
                order: 2,
                endpointType: EndpointType.SFTP,
                label: [
                    {
                        key: 'en',
                        value: 'Port'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'username',
                required: true,
                order: 3,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                label: [
                    {
                        key: 'en',
                        value: 'Username'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'password',
                type: 'password',
                required: true,
                order: 4,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                label: [
                    {
                        key: 'en',
                        value: 'Password'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'directoryName',
                required: true,
                order: 5,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                label: [
                    {
                        key: 'en',
                        value: 'Directory Path'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'fileName',
                required: false,
                order: 6,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                label: [
                    {
                        key: 'en',
                        value: 'Filename'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'antInclude',
                order: 7,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Include File pattern'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'antExclude',
                order: 8,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Exclude File pattern'
                    }
                ]
            }),
            new CheckboxConfigurationMetadata<boolean>({
                key: 'recursive',
                order: 9,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Recursively read directories'
                    }
                ]
            }),
            new CheckboxConfigurationMetadata<boolean>({
                key: 'flatten',
                order: 10,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.PRODUCER,
                label: [
                    {
                        key: 'en',
                        value: 'Flatten directories'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'sortBy',
                order: 11,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Sort files criteria'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'move',
                order: 12,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Move directory'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'moveFailed',
                order: 13,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Error directory'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'doneFileName',
                order: 14,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                label: [
                    {
                        key: 'en',
                        value: 'Done file name'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'delay',
                order: 15,
                min: 0,
                pattern: '[0-9]+',
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Delay (in milliseconds)'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'initialDelay',
                order: 16,
                min: 0,
                pattern: '[0-9]+',
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Initial delay (in milliseconds)'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'scheduler.cron',
                order: 17,
                maxLength: 255,
                endpointType: EndpointType.SFTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Cron expression'
                    }
                ]
            }),
            new DropdownConfigurationMetadata({
                key: 'fileExist',
                value: 'Override',
                order: 18,
                endpointRoleType: EndpointRoleType.PRODUCER,
                endpointType: EndpointType.SFTP,
                options: [
                    {
                        key: 'Override',
                        value: [
                            {
                                key: 'en',
                                value: 'Replace existing file'
                            }
                        ]
                    },
                    {
                        key: 'Append',
                        value: [
                            {
                                key: 'en',
                                value: 'Add content to existing file'
                            }
                        ]
                    },
                    {
                        key: 'Fail',
                        value: [
                            {
                                key: 'en',
                                value: 'Fail with an error'
                            }
                        ]
                    },
                    {
                        key: 'Ignore',
                        value: [
                            {
                                key: 'en',
                                value: 'Silently ignore error'
                            }
                        ]
                    }
                ],
                label: [
                    {
                        key: 'en',
                        value: 'File exists Action'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'hostname',
                required: true,
                order: 1,
                maxLength: 255,
                endpointType: EndpointType.HTTP,
                label: [
                    {
                        key: 'en',
                        value: 'Hostname'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'port',
                required: true,
                order: 2,
                min: 12000,
                max: 12100,
                pattern: '[0-9]+',
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Port'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'port',
                required: true,
                order: 3,
                min: 1,
                max: 65535,
                pattern: '[0-9]+',
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.PRODUCER,
                label: [
                    {
                        key: 'en',
                        value: 'Port'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'resourceUri',
                required: true,
                order: 4,
                maxLength: 255,
                endpointType: EndpointType.HTTP,
                label: [
                    {
                        key: 'en',
                        value: 'Resource URI'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'username',
                required: true,
                order: 5,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Username'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'password',
                type: 'password',
                required: true,
                order: 6,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Password'
                    }
                ]
            }),
            new CheckboxConfigurationMetadata<boolean>({
                key: 'enableCORS',
                value: false,
                required: false,
                order: 7,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Enable CORS'
                    }
                ]
            }),
            new CheckboxConfigurationMetadata<boolean>({
                key: 'sessionSupport',
                value: false,
                required: false,
                order: 8,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Enable session'
                    }
                ]
            }),
            new DropdownConfigurationMetadata({
                key: 'httpMethod',
                value: 'GET',
                order: 9,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.PRODUCER,
                options: [
                    {
                        key: 'GET',
                        value: [
                            {
                                key: 'en',
                                value: 'GET'
                            }
                        ]
                    },
                    {
                        key: 'PUT',
                        value: [
                            {
                                key: 'en',
                                value: 'PUT'
                            }
                        ]
                    },
                    {
                        key: 'POST',
                        value: [
                            {
                                key: 'en',
                                value: 'POST'
                            }
                        ]
                    },
                    {
                        key: 'DELETE',
                        value: [
                            {
                                key: 'en',
                                value: 'DELETE'
                            }
                        ]
                    }
                ],
                label: [
                    {
                        key: 'en',
                        value: 'HTTP Method'
                    }
                ]
            }),
            new DropdownConfigurationMetadata({
                key: 'authMethod',
                value: 'NONE',
                order: 10,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.PRODUCER,
                options: [
                    {
                        key: 'NONE',
                        value: [
                            {
                                key: 'en',
                                value: 'NONE'
                            }
                        ]
                    },
                    {
                        key: 'BASIC',
                        value: [
                            {
                                key: 'en',
                                value: 'BASIC'
                            }
                        ]
                    }
                ],
                label: [
                    {
                        key: 'en',
                        value: 'Authentication Method'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'authUsername',
                required: false,
                order: 11,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.PRODUCER,
                label: [
                    {
                        key: 'en',
                        value: 'Username'
                    }
                ]
            }),
            new TextConfigurationMetadata({
                key: 'authPassword',
                type: 'password',
                required: false,
                order: 12,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.PRODUCER,
                label: [
                    {
                        key: 'en',
                        value: 'Password'
                    }
                ]
            }),
            new CheckboxConfigurationMetadata<boolean>({
                key: 'isSecure',
                value: true,
                required: true,
                readonly: true,
                order: 13,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.CONSUMER,
                label: [
                    {
                        key: 'en',
                        value: 'Secure'
                    }
                ]
            }),
            new CheckboxConfigurationMetadata<boolean>({
                key: 'isSecure',
                value: true,
                required: false,
                order: 14,
                endpointType: EndpointType.HTTP,
                endpointRoleType: EndpointRoleType.PRODUCER,
                label: [
                    {
                        key: 'en',
                        value: 'Secure'
                    }
                ]
            })
        ]);
    }
}
