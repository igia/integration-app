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
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BmdStyleDirective } from 'app/shared';
import { By } from '@angular/platform-browser';

@Component({
    template: `
    <div class="form-group bmd-form-group-sm">
      <label class="bmd-label-floating" for="id">Id</label>
      <input type="text" class="form-control" igiaBmdStyle  id="id" />
    </div>
    `
})
class TestBmdStyleComponent {}

describe('Directive: igiaBmdStyle', () => {
    let component: TestBmdStyleComponent;
    let fixture: ComponentFixture<TestBmdStyleComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestBmdStyleComponent, BmdStyleDirective]
        });
        fixture = TestBed.createComponent(TestBmdStyleComponent);
        component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.css('.form-control'));
    });

    it('apply bmd styles when input field is focused and remove when blurred. ', () => {
        inputEl.triggerEventHandler('focus', null);
        fixture.detectChanges();
        expect(inputEl.nativeElement.parentNode.classList).toContainEqual('is-focused');

        inputEl.triggerEventHandler('blur', null);
        fixture.detectChanges();
        expect(inputEl.nativeElement.parentNode.classList).not.toContainEqual('is-focused');
    });

    it('apply bmd styles when input field contain value. ', () => {
        inputEl.nativeElement.value = 'Test';
        fixture.detectChanges();
        expect(inputEl.nativeElement.parentNode.classList).toContainEqual('is-filled');
    });

    it('remove bmd styles when input field does not contain value. ', () => {
        inputEl.nativeElement.value = '';
        fixture.detectChanges();
        expect(inputEl.nativeElement.parentNode.classList).not.toContainEqual('is-filled');
    });

    it('apply bmd styles when input field value is changed and remove when empty ', () => {
        inputEl.nativeElement.value = 'Test';
        inputEl.triggerEventHandler('change', null);
        fixture.detectChanges();
        expect(inputEl.nativeElement.parentNode.classList).toContainEqual('is-filled');

        inputEl.nativeElement.value = '';
        inputEl.triggerEventHandler('change', null);
        fixture.detectChanges();
        expect(inputEl.nativeElement.parentNode.classList).not.toContainEqual('is-filled');
    });
});
