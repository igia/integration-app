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
import { HttpClient, HttpResponse, HttpEvent, HttpEventType, HttpRequest, HttpProgressEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, EndpointConfiguration, Pipeline, Endpoint } from 'app/shared';
import { ProgressiveResponse } from 'app/shared/model/progressive-response';

type PipelineResponseType = HttpResponse<Pipeline>;
type PipelineArrayResponseType = HttpResponse<Pipeline[]>;

@Injectable({ providedIn: 'root' })
export class DataPipelineService {
    public resourceUrl = SERVER_API_URL + 'integrationconfiguration/api/data-pipelines';
    public resourceUrl2 = SERVER_API_URL + 'integrationconfiguration/api/interfaces';

    constructor(private http: HttpClient) {}

    create(dataPipeline: Pipeline): Observable<PipelineResponseType> {
        return this.http
            .post<Pipeline>(this.resourceUrl, this.convertClientModel(dataPipeline), { observe: 'response' })
            .pipe(map((res: PipelineResponseType) => this.convertDateFromServer(res)));
    }

    update(dataPipeline: Pipeline): Observable<PipelineResponseType> {
        return this.http
            .put<Pipeline>(this.resourceUrl, this.convertClientModel(dataPipeline), { observe: 'response' })
            .pipe(map((res: PipelineResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<PipelineResponseType> {
        return this.http
            .get<Pipeline>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: PipelineResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<PipelineArrayResponseType> {
        return this.http
            .get<Pipeline[]>(this.resourceUrl, { params: createRequestOption(req), observe: 'response' })
            .pipe(map((res: PipelineArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    export(id: number): Observable<HttpResponse<Blob>> {
        return this.http.get<Blob>(`${this.resourceUrl2}/${id}/export`, {
            observe: 'response',
            responseType: 'blob' as 'json'
        });
    }

    import(file: File): Observable<ProgressiveResponse<HttpEvent<any>>> {
        let progressCounter = 0;
        return this.http
            .request<FormData>(
                new HttpRequest('POST', `${this.resourceUrl2}/import`, this.getImportRequestBody(file), {
                    reportProgress: true
                })
            )
            .pipe(
                map((event: HttpEvent<any>) => {
                    progressCounter += 10;
                    return this.processHttpEvent(event, true, progressCounter);
                })
            );
    }

    exportAll(): Observable<ProgressiveResponse<HttpEvent<Blob>>> {
        let progressCounter = 0;
        return this.http
            .request<Blob>(
                new HttpRequest('GET', `${this.resourceUrl2}/export`, undefined, {
                    responseType: 'blob' as 'json',
                    reportProgress: true
                })
            )
            .pipe(
                map((event: HttpEvent<any>) => {
                    progressCounter += 10;
                    return this.processHttpEvent(event, false, progressCounter);
                })
            );
    }

    private processHttpEvent(event: HttpEvent<any>, upload: boolean, progressCounter: number): ProgressiveResponse<any> {
        switch (event.type) {
            case HttpEventType.Sent:
                return { progress: 10, response: event };
            case HttpEventType.UploadProgress:
                return { progress: this.calculateProgress(event, 10, progressCounter), response: event };
            case HttpEventType.ResponseHeader:
                return { progress: upload ? 80 : 20, response: event };
            case HttpEventType.DownloadProgress:
                return { progress: this.calculateProgress(event, 30, progressCounter), response: event };
            case HttpEventType.Response:
                return { progress: 100, response: event };
            default:
                return { progress: -1, response: event };
        }
    }

    private calculateProgress(event: HttpProgressEvent, baseProgressCounter: number, progressCounter: number): number {
        const maxProgressCounter = 80 - baseProgressCounter;
        let progress = progressCounter >= maxProgressCounter ? maxProgressCounter : progressCounter;
        if (event.total) {
            progress = Math.round(60 * (event.loaded / event.total));
        }
        return baseProgressCounter + progress;
    }

    private convertClientModel(dataPipeline: Pipeline): Pipeline {
        const output: Pipeline = Object.assign({}, dataPipeline);
        delete output.source.responseTransformers;
        output.source.configurations = this.filterEmptyConfigurations(output.source.configurations);
        output.destinations = output.destinations.map((destination: Endpoint) => {
            destination.configurations = this.filterEmptyConfigurations(destination.configurations);
            return destination;
        });
        return output;
    }

    private filterEmptyConfigurations(configurations: EndpointConfiguration[]) {
        return configurations.filter((configuration: EndpointConfiguration) => configuration.value);
    }

    private getImportRequestBody(file: File): FormData {
        const output: FormData = new FormData();
        output.append('file', file);
        return output;
    }

    private convertDateFromServer(res: PipelineResponseType): PipelineResponseType {
        res.body.createdOn = moment(res.body.createdOn);
        res.body.modifiedOn = moment(res.body.modifiedOn);
        return res;
    }

    private convertDateArrayFromServer(res: PipelineArrayResponseType): PipelineArrayResponseType {
        res.body.forEach((dataPipeline: Pipeline) => {
            dataPipeline.createdOn = moment(dataPipeline.createdOn);
            dataPipeline.modifiedOn = moment(dataPipeline.modifiedOn);
        });
        return res;
    }
}
