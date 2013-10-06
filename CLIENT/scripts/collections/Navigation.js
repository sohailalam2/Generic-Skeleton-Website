/*
 * Copyright 2013 The Generic Skeleton Website
 *
 *  The Generic Skeleton Website Project licenses this file to you under the Apache License, version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at:
 *
 *               http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 *  either express or implied.
 *  See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This module is used to load up the Navigation Menu items and update the
 * Navigation Header.
 * You can easily add/remove navigation items by editing the nav.json
 * which can be found in ./scripts/json directory.
 *
 * User: Sohail Alam
 * Version: 1.0.0
 * Date: 30/9/13
 * Time: 9:42 AM
 */
define(['app.logger', 'app.config', 'underscore', 'backbone', 'localStorage'],
    function (LOGGER, AppConfig, _, Backbone, LocalStorage) {
        'use strict';

        var NavigationCollection = Backbone.Collection.extend({
            // Reference to this collection's model
            model: Backbone.Model.extend({
                // Nothing to do here - not needed
            }),

            // This is where the Navigation Menu items are kept
            url: "./scripts/json/nav.json",

            // Save all of the data under a unique namespace
//            localStorage: new LocalStorage(AppConfig.app_namespace() + "_collections"),

            // Constructor
            initialize: function () {
                LOGGER.trace('collections/Navigation', 'initialize', 'NavigationCollection Initialized');
            },

            // Do a server fetch if not locally available and update the Navigation
            populateNav: function (updateNav, scope) {
                this.fetch({
                    success: function () {
                        updateNav(scope);
                    },
                    error: function () {
                        //TODO: Show a better alert
                        alert("Could not populate the Navigation... please try again");
                    }
                });
                LOGGER.trace('collections/Navigation', 'populateNav', 'Navigation Populated');
            }
        });

        return new NavigationCollection;

    }
);