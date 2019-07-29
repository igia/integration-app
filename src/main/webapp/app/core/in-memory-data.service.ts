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
import {
    InMemoryDbService,
    ResponseOptions,
    RequestInfo,
    RequestInfoUtilities,
    ParsedRequestUrl,
    STATUS,
    getStatusText
} from 'angular-in-memory-web-api';
import { throwError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const dataPipelines = [
            {
                id: 11,
                name: 'A01 registration',
                description: 'This is data pipeline',
                deploy: false,
                version: '1.0.0',
                state: 'READY',
                workerService: 'INTEGRATIONWORKER-I',
                createdOn: '2018-10-19T18:50:48.514Z',
                createdBy: 'user',
                modifiedOn: '2018-10-19T18:50:48.514Z',
                modifiedBy: 'user',
                source: {
                    type: 'MLLP',
                    name: 'Sourceendpoint10',
                    inDataType: 'HL7_V2',
                    outDataType: 'HL7_V2',
                    configurations: [
                        {
                            key: 'hostname',
                            value: 'hostname'
                        },
                        {
                            key: 'port',
                            value: '9090'
                        }
                    ],
                    filters: [
                        {
                            order: 1,
                            type: 'JAVASCRIPT',
                            data: 'Add javascript code here',
                            description: 'This is filter'
                        }
                    ],
                    transformers: [
                        {
                            order: 1,
                            type: 'JAVASCRIPT',
                            data: 'Add javascript code here',
                            description: 'This is transformer'
                        }
                    ]
                },
                destinations: [
                    {
                        type: 'FILE',
                        name: 'destination10',
                        inDataType: 'HL7_V2',
                        outDataType: 'HL7_V2',
                        configurations: [
                            {
                                key: 'directoryName',
                                value: '/data'
                            },
                            {
                                key: 'fileName',
                                value: 'test'
                            }
                        ],
                        filters: [
                            {
                                order: 1,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is filter'
                            }
                        ],
                        transformers: [
                            {
                                order: 1,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is transformer'
                            }
                        ]
                    }
                ]
            },
            {
                id: 12,
                name: 'A01 registration',
                description: 'This is data pipeline',
                deploy: true,
                version: '1.0.0',
                state: 'STARTED',
                workerService: 'INTEGRATIONWORKER-I',
                createdOn: '2018-10-19T18:50:48.514Z',
                createdBy: 'user',
                modifiedOn: '2018-10-19T18:50:48.514Z',
                modifiedBy: 'user',
                source: {
                    type: 'MLLP',
                    name: 'Sourceendpoint10',
                    inDataType: 'HL7_V2',
                    outDataType: 'HL7_V2',
                    configurations: [
                        {
                            key: 'hostname',
                            value: 'hostname'
                        },
                        {
                            key: 'port',
                            value: '9090'
                        }
                    ],
                    filters: [
                        {
                            order: 1,
                            type: 'JAVASCRIPT',
                            data: 'Add javascript code here',
                            description: 'This is filter'
                        }
                    ],
                    transformers: [
                        {
                            order: 1,
                            type: 'JAVASCRIPT',
                            data: 'Add javascript code here',
                            description: 'This is transformer'
                        }
                    ]
                },
                destinations: [
                    {
                        type: 'FILE',
                        name: 'destination10',
                        inDataType: 'HL7_V2',
                        outDataType: 'HL7_V2',
                        configurations: [
                            {
                                key: 'directoryName',
                                value: '/data'
                            },
                            {
                                key: 'fileName',
                                value: 'test'
                            }
                        ],
                        filters: [
                            {
                                order: 1,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is filter 1'
                            },
                            {
                                order: 2,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is filter 2'
                            },
                            {
                                order: 5,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is filter 5'
                            },
                            {
                                order: 3,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is filter 3'
                            },
                            {
                                order: 4,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is filter 4'
                            }
                        ],
                        transformers: [
                            {
                                order: 1,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is transformer'
                            }
                        ]
                    }
                ]
            },
            {
                id: 13,
                name: 'A01 registration',
                description: 'This is data pipeline',
                deploy: false,
                version: '1.0.0',
                state: 'STOPPED',
                workerService: 'INTEGRATIONWORKER-I',
                source: {
                    type: 'MLLP',
                    name: 'Sourceendpoint10',
                    inDataType: 'HL7_V2',
                    outDataType: 'HL7_V2',
                    configurations: [
                        {
                            key: 'hostname',
                            value: 'hostname'
                        },
                        {
                            key: 'port',
                            value: '9090'
                        }
                    ],
                    filters: [
                        {
                            order: 1,
                            type: 'JAVASCRIPT',
                            data: 'Add javascript code here',
                            description: 'This is filter'
                        }
                    ],
                    transformers: [
                        {
                            order: 1,
                            type: 'JAVASCRIPT',
                            data: 'Add javascript code here',
                            description: 'This is transformer'
                        }
                    ]
                },
                destinations: [
                    {
                        type: 'FILE',
                        name: 'destination10',
                        inDataType: 'HL7_V2',
                        outDataType: 'HL7_V2',
                        configurations: [
                            {
                                key: 'directoryName',
                                value: '/data'
                            },
                            {
                                key: 'fileName',
                                value: 'test'
                            }
                        ],
                        filters: [
                            {
                                order: 1,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is filter'
                            }
                        ],
                        transformers: [
                            {
                                order: 1,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is transformer'
                            }
                        ]
                    }
                ]
            },
            {
                id: 14,
                name: 'A01 registration',
                description: 'This is data pipeline',
                deploy: false,
                version: '1.0.0',
                state: 'FAILED',
                reason: 'Port already in use',
                workerService: 'INTEGRATIONWORKER-I',
                createdOn: '2018-10-19T18:50:48.514Z',
                createdBy: 'user',
                modifiedOn: '2018-10-19T18:50:48.514Z',
                modifiedBy: 'user',
                source: {
                    type: 'MLLP',
                    name: 'Sourceendpoint10',
                    inDataType: 'HL7_V2',
                    outDataType: 'HL7_V2',
                    configurations: [
                        {
                            key: 'hostname',
                            value: 'hostname'
                        },
                        {
                            key: 'port',
                            value: '9090'
                        }
                    ],
                    filters: [
                        {
                            order: 1,
                            type: 'JAVASCRIPT',
                            data: 'Add javascript code here',
                            description: 'This is filter'
                        }
                    ],
                    transformers: [
                        {
                            order: 1,
                            type: 'JAVASCRIPT',
                            data: 'Add javascript code here',
                            description: 'This is transformer'
                        }
                    ]
                },
                destinations: [
                    {
                        type: 'FILE',
                        name: 'destination10',
                        inDataType: 'HL7_V2',
                        outDataType: 'HL7_V2',
                        configurations: [
                            {
                                key: 'directoryName',
                                value: '/data'
                            },
                            {
                                key: 'fileName',
                                value: 'test'
                            }
                        ],
                        filters: [
                            {
                                order: 1,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is filter'
                            }
                        ],
                        transformers: [
                            {
                                order: 1,
                                type: 'JAVASCRIPT',
                                data: 'Add java script code here',
                                description: 'This is transformer'
                            }
                        ]
                    }
                ]
            },
            {
                id: 15,
                name: 'A011 registration',
                description: 'data pipeline in stopping state',
                deploy: false,
                version: '1.0.0',
                state: 'STOPPING',
                reason: '',
                workerService: 'INTEGRATIONWORKER-I',
                createdOn: '2018-10-19T18:50:48.514Z',
                createdBy: 'user',
                modifiedOn: '2018-10-19T18:50:48.514Z',
                modifiedBy: 'user',
                source: {
                    type: 'MLLP',
                    name: 'Sourceendpoint10',
                    inDataType: 'HL7_V2',
                    outDataType: 'HL7_V2',
                    configurations: [
                        {
                            key: 'hostname',
                            value: 'hostname'
                        },
                        {
                            key: 'port',
                            value: '9090'
                        }
                    ],
                    filters: [],
                    transformers: []
                },
                destinations: [
                    {
                        type: 'FILE',
                        name: 'destination10',
                        inDataType: 'HL7_V2',
                        outDataType: 'HL7_V2',
                        configurations: [
                            {
                                key: 'directoryName',
                                value: '/data'
                            },
                            {
                                key: 'fileName',
                                value: 'test'
                            }
                        ],
                        filters: [],
                        transformers: []
                    }
                ]
            },
            {
                id: 16,
                name: 'A016 registration',
                description: 'data pipeline in starting state',
                deploy: false,
                version: '1.0.0',
                state: 'STARTING',
                reason: '',
                workerService: 'INTEGRATIONWORKER-I',
                createdOn: '2018-10-19T18:50:48.514Z',
                createdBy: 'user',
                modifiedOn: '2018-10-19T18:50:48.514Z',
                modifiedBy: 'user',
                source: {
                    type: 'MLLP',
                    name: 'Sourceendpoint10',
                    inDataType: 'HL7_V2',
                    outDataType: 'HL7_V2',
                    configurations: [
                        {
                            key: 'hostname',
                            value: 'hostname'
                        },
                        {
                            key: 'port',
                            value: '9090'
                        }
                    ],
                    filters: [],
                    transformers: []
                },
                destinations: [
                    {
                        type: 'FILE',
                        name: 'destination10',
                        inDataType: 'HL7_V2',
                        outDataType: 'HL7_V2',
                        configurations: [
                            {
                                key: 'directoryName',
                                value: '/data'
                            },
                            {
                                key: 'fileName',
                                value: 'test'
                            }
                        ],
                        filters: [],
                        transformers: []
                    }
                ]
            }
        ];

        const workerServices = [
            {
                name: 'INTEGRATIONWORKER-I',
                dataPipelines
            }
        ];

        const accounts = [
            {
                id: 1,
                activated: true,
                authorities: ['ROLE_USER', 'ROLE_ADMIN'],
                email: 'admin@localhost.com',
                firstName: 'Admin',
                langKey: 'en',
                lastName: 'User',
                login: 'admin',
                imageUrl: 'https://avatars1.githubusercontent.com/u/15997681?s=400&v=4'
            }
        ];

        const profileInfos = [
            {
                id: 1,
                activeProfiles: 'standalone',
                'display-ribbon-on-profiles': 'standalone'
            }
        ];

        return { dataPipelines, workerServices, accounts, profileInfos };
    }

    // parseRequestUrl override
    // Do this to manipulate the request URL or the parsed result
    // into something your data store can handle.
    parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
        let newUrl = url.replace(
            /integrationconfiguration\/api\/data-pipelines\?page=\d{1,2}&size=\d{1,2}&sort=[\w, ]+&sort=[\w, ]+/,
            'api/dataPipelines'
        );

        newUrl = newUrl.replace(/integrationconfiguration\/api\/data-pipelines/, 'api/dataPipelines');

        newUrl = newUrl.replace(/integrationconfiguration\/api\/worker-services/, 'api/workerServices');

        newUrl = this.interceptAccountUrl(newUrl);
        newUrl = this.interceptProfileInfo(newUrl);

        const parsed = utils.parseRequestUrl(newUrl);
        return parsed;
    }

    interceptAccountUrl(url: string) {
        return url.replace(/api\/account/, 'api/accounts/1');
    }

    interceptProfileInfo(url: string) {
        return url.replace(/management\/info/, 'api/profileInfos/1');
    }
    responseInterceptor(resOptions: ResponseOptions, reqInfo: RequestInfo) {
        if (reqInfo.method === 'get' && reqInfo.url.indexOf('integrationconfiguration/api/data-pipelines?') !== -1) {
            resOptions.headers = resOptions.headers.set(
                'link',
                '</api/data-pipelines?page=0&size=20>; rel="last",</api/data-pipelines?page=0&size=20>; rel="first"'
            );
            resOptions.headers = resOptions.headers.set('x-total-count', '4');
        }
        return resOptions;
    }

    // HTTP PUT interceptor
    put(reqInfo: RequestInfo) {
        const collectionName = reqInfo.collectionName;
        const body = reqInfo.utils.getJsonBody(reqInfo.req) || {};
        if (collectionName === 'dataPipelines' && body.id === 11) {
            return this.invalidDataPipelineResponse(reqInfo);
        }
        return undefined;
    }

    private invalidDataPipelineResponse(reqInfo: RequestInfo) {
        return reqInfo.utils.createResponse$(() => {
            const options = new HttpErrorResponse({
                error: {
                    type: 'https://www.jhipster.tech/problem/parameterized',
                    title: 'Parameterized Exception',
                    status: 400,
                    message: 'error.duplicate.datapipeline.name',
                    params: {
                        field: 'name',
                        message: 'Duplicate Data Pipeline Name',
                        value: 'MLLP to FILE'
                    }
                },
                status: STATUS.BAD_REQUEST
            });
            return this.finishOptions(options, reqInfo);
        });
    }
    private finishOptions(options: ResponseOptions, { headers, url }: RequestInfo) {
        options.statusText = getStatusText(options.status);
        options.headers = headers;
        options.url = url;
        return options;
    }
}
