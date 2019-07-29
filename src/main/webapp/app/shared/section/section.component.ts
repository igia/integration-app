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
import { Component, OnInit, ContentChild, Input } from '@angular/core';

import { SectionDirective } from './section.directive';

@Component({
    selector: 'igia-section',
    templateUrl: 'section.component.html',
    styleUrls: ['section.scss']
})
export class SectionComponent implements OnInit {
    @Input() titleText: string;
    @Input() count: number;
    @Input() classes: string;
    @Input() collapse = false;

    @ContentChild(SectionDirective) contentTpl: SectionDirective;

    constructor() {}

    ngOnInit() {
        this.classes = this.classes || 'igia-title-default';
    }
}
