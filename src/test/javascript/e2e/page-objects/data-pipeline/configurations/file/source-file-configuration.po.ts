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
import { FileConfigurationPage } from './file-configuration.po';
import { element, by, ElementFinder } from 'protractor';

export class SourceFileConfigurationPage extends FileConfigurationPage {
    includeFilePattern;
    excludeFilePattern;
    recursiveReadDirectory: ElementFinder;
    sortFileCriteria;
    moveDirectory;
    errorDirectory;
    delay;
    initialDelay;
    cronExpression;

    constructor(prefix: string, index?: number) {
        super(prefix);
        this.includeFilePattern = element(by.id(`${prefix}${index}cantInclude`));
        this.excludeFilePattern = element(by.id(`${prefix}${index}cantExclude`));
        this.recursiveReadDirectory = element(by.css(`#${prefix}${index}crecursive`));
        this.sortFileCriteria = element(by.id(`${prefix}${index}csortBy`));
        this.moveDirectory = element(by.id(`${prefix}${index}cmove`));
        this.errorDirectory = element(by.id(`${prefix}${index}cmoveFailed`));
        this.delay = element(by.id(`${prefix}${index}cdelay`));
        this.initialDelay = element(by.id(`${prefix}${index}cinitialDelay`));
        this.cronExpression = element(by.id(`${prefix}${index}cscheduler.cron`));
    }
}
