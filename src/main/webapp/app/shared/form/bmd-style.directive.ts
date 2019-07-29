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
import { Directive, ElementRef, HostListener, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[igiaBmdStyle]'
})
export class BmdStyleDirective implements AfterViewInit {
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit() {
        this.toggleIsFilledStyle();
    }

    @HostListener('change')
    onchange() {
        this.toggleIsFilledStyle();
    }

    private toggleIsFilledStyle(): void {
        if (this.el.nativeElement.value) {
            this.renderer.addClass(this.el.nativeElement.parentNode, 'is-filled');
        } else {
            this.renderer.removeClass(this.el.nativeElement.parentNode, 'is-filled');
        }
    }

    @HostListener('focus')
    onFocus() {
        this.renderer.addClass(this.el.nativeElement.parentNode, 'is-focused');
    }

    @HostListener('blur')
    onBlur() {
        this.renderer.removeClass(this.el.nativeElement.parentNode, 'is-focused');
    }
}
