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
 * This is the Application Router
 *
 * User: Sohail Alam
 * Version: 1.0.0
 * Date: 29/9/13
 * Time: 11:18 AM
 */
define(['app.logger', 'jquery', 'backbone'],
    function (LOGGER, $, Backbone) {
        'use strict';

        var AppRouter = Backbone.Router.extend({
            routes: {
                '': 'navigateApp',
                'login': 'login',
                'signup': 'signup',
                '*filter': 'setFilter'
            },

            initialize: function () {
                LOGGER.trace('routers/AppRouter', 'initialize', 'Router Initialized');
            },

            navigateApp: function () {
                // Async version of require
                require(['views/App'], function (AppView) {
                    AppView.render();
                });
                LOGGER.trace('routers/Router', 'navigateHome', 'Rendering AppView');
                return this;
            },

            login: function () {
                alert("Login...");
            },

            signup: function () {
                alert('Signup...');
            },

            // Set the current filter to be used
            setFilter: function (param) {
//                this.navigateApp();
            }
        });

        return new AppRouter();
    }
);
