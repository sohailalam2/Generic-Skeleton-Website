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
 * User: Sohail Alam
 * Version: 1.0.0
 * Date: 30/9/13
 * Time: 9:42 AM
 */
define(['app.logger', 'app.config', 'underscore', 'backbone', 'localStorage', 'models/Navigation'],
    function (LOGGER, AppConfig, _, Backbone, LocalStorage, NavigationModel) {
        'use strict';

        var NavigationCollection = Backbone.Collection.extend({
            // Reference to this collection's model
            model: NavigationModel,

            // Save all of the data under a unique namespace
            localStorage: new LocalStorage(AppConfig.app_namespace() + "_collections"),

            initialize: function () {
                LOGGER.trace('collections/Navigation', 'initialize', 'NavigationCollection Initialized');
            }
        });

        var nav = new NavigationCollection();

        var data = [
            // HOME - 1
            {
                id: 1,
                name: 'Home',
                href: '#home',
                tooltip: 'Navigate To Home Page',
                active: true
            },
            // NEWS - 2
            {
                id: 2,
                name: 'News',
                href: '#news',
                tooltip: 'Navigate To News Page',
                active: false
            }
        ];

        function createNavigation() {
            console.debug("Creating Nav Items");
            _.each(data, function (model) {
                nav.create(model);
            });
        }

        // Create the Navigation Menu Items

        // Populate the collection from Local Storage Data
        nav.fetch().done(function () {
            // If no data is available then create it
            if (nav.length != data.length) {
                createNavigation();
            }
        });

        return nav;

    }
);