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
 * Time: 11:45 AM
 */
define(['app.logger', 'app.config', 'underscore', 'backbone', 'localStorage'],
    function (LOGGER, AppConfig, _, Backbone, LocalStorage) {
        'use strict';

        var AppModel = Backbone.Model.extend({

            // Default attributes for the User Profile
            defaults: {
                content: 'Hello World!'
            },

            // Store the Model Data into Local Storage
            localStorage: new LocalStorage(AppConfig.app_namespace()),

            // Constructor
            initialize: function () {
                LOGGER.trace('models/AppModel', 'initialize', 'Model Initialized');
                this.localStorage.create(this);
                this.localStorage.save();
            },

            // Create User Model with given array -> $('#form').serializeArray()
            create: function (formData) {
                for (var i = 0; i < formData.length; i++) {
                    var field = formData[i];
                    this.set(field.name, field.value);
                }
                this.localStorage.update(this);
                LOGGER.debug('models/AppModel', 'create', JSON.stringify(this));
                return this;
            }
        });

        return AppModel;
    }
);
