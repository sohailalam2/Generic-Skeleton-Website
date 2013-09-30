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
 * Date: 29/9/13
 * Time: 11:20 AM
 */
define(['app.logger', 'jquery', 'underscore', 'backbone', 'handlebars',
    'controllers/App', 'models/App', 'text!templates/App.html'],
    function (LOGGER, $, _, Backbone, Handlebars, AppController, AppModel, AppTemplate) {
        'use strict';

        var AppView = Backbone.View.extend({

            /*
             // Tag Name - this will generate a new element
             tagName: 'div',
             */

            // Instead of generating a new element, bind to the existing
            // skeleton of the App already present in the HTML
            el: $('body'),

            // Cache the template function
            template: '',

            // The DOM events
            events: {

            },

            // Constructor
            initialize: function () {
                LOGGER.trace('views/App', 'initialize', 'AppView Initialized');
            },

            // Re-render the contents
            render: function () {
                var that = this;
                if (this.template === '') {
                    this.template = Handlebars.compile(AppTemplate);
                }
                this.$el.html(this.template());

                // Start the Controller Actions 500 milliseconds after the rendering is complete
                setTimeout(function () {
                    AppController.start();
                }, 500);
                LOGGER.trace('views/App', 'render', 'AppView Rendered');
                return this;
            },

            // Click Event Handler
            clickHandler: function () {
                AppController.clickHandler();
                return this;
            }
        });
        return new AppView();
    }
);
