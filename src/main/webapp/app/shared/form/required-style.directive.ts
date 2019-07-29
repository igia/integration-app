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
import { Directive, ElementRef, Renderer2, AfterViewInit, Input } from '@angular/core';

@Directive({
    selector: '[igiaRequiredStyle]'
})
export class RequiredStyleDirective implements AfterViewInit {
    @Input()
    set igiaRequiredStyle(value: any) {
        if (value !== null && value !== '') {
            this._igiaRequiredStyle = !!value;
        }
    }
    private _igiaRequiredStyle = true;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit() {
        if (this._igiaRequiredStyle) {
            const element: HTMLSpanElement = this.renderer.createElement('span');
            this.renderer.addClass(element, 'pl-1');
            this.renderer.addClass(element, 'igia-required');
            element.appendChild(this.renderer.createText('*'));
            this.renderer.appendChild(this.el.nativeElement, element);
        }
    }
}
