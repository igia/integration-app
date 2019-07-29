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
import { Component, OnInit, ContentChild } from '@angular/core';

import { PageTitleDirective } from './page-title.directive';
import { PageBodyDirective } from './page-body.directive';

@Component({
    selector: 'igia-page',
    templateUrl: 'page.component.html',
    styleUrls: ['page.scss']
})
export class PageComponent implements OnInit {
    @ContentChild(PageTitleDirective) titleTpl: PageTitleDirective;
    @ContentChild(PageBodyDirective) bodyTpl: PageBodyDirective;

    constructor() {}

    ngOnInit() {}
}
