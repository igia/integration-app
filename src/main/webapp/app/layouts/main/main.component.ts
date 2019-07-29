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
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';

import { JhiLanguageHelper, Principal, Account } from 'app/core';

@Component({
    selector: 'igia-main',
    templateUrl: './main.component.html'
})
export class IgiaMainComponent implements OnInit {
    constructor(
        private languageHelper: JhiLanguageHelper,
        private languageService: JhiLanguageService,
        private principal: Principal,
        private router: Router
    ) {}

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = routeSnapshot.data && routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : 'integrationappApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.languageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
            }
        });

        this.principal.identity().then((account: Account) => {
            if (account && account.langKey) {
                this.languageService.changeLanguage(account.langKey);
            }
        });
    }
}
