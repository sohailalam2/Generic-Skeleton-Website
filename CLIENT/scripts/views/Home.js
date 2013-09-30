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
 * Time: 12:39 PM
 */
define(['app.logger', 'jquery', 'underscore', 'backbone', 'handlebars', 'collections/Navigation',
    'text!templates/Header.html', 'text!templates/home/Content.html', 'text!templates/Footer.html'],
    function (LOGGER, $, _, Backbone, Handlebars, NavigationCollection, HeaderTemplate, ContentTemplate, FooterTemplate) {
        'use strict';

        var AppView = Backbone.View.extend({

            $header: $('#app_navigation'),
            $container: $('#app_container'),
            $footer: $('#app_footer'),

            // Cache the template functions
            header_template: '',
            container_template: '',
            footer_template: '',

            // The DOM events
            events: {

            },

            // Constructor
            initialize: function () {
                LOGGER.trace('views/Home', 'initialize', 'HomeView Initialized');
            },

            // Re-render the contents
            render: function () {
                if (this.header_template === '') {
                    this.header_template = Handlebars.compile(HeaderTemplate);
                }
                if (this.container_template === '') {
                    this.container_template = Handlebars.compile(ContentTemplate);
                }
                if (this.footer_template === '') {
                    this.footer_template = Handlebars.compile(FooterTemplate);
                }
                this.$header.html(this.header_template(NavigationCollection.toJSON()));
                this.$container.html(this.container_template());
                this.$footer.html(this.footer_template());

                LOGGER.trace('views/Home', 'render', 'HomeView Rendered');
                return this;
            }
        });
        return new AppView();
    }
);
