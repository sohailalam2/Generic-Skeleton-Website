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
 * This is the requirejs configuration and also the starting point of the web application
 *
 * User: Sohail Alam
 * Version: 1.0.0
 * Date: 29/9/13
 * Time: 10:45 AM
 */

/* Global Require */
'use strict';

requirejs.config({

    // By Default load any module IDs from the 'scripts' directory
    baseUrl: 'scripts',

    // Explicit path definitions for libraries lying outside of the baseUrl
    paths: {
        //app.logger
        'app.logger': '../libraries/custom/app.logger',
        // Backbone
        backbone: '../libraries/backbone/backbone',
        // Twitter Bootstrap
        bootstrap: '../libraries/bootstrap/bootstrap',
        // DomReady! Require.js Plugin
        domReady: '../libraries/require/domReady',
        // Handlebars
        handlebars: '../libraries/handlebars/handlebars',
        // jQuery
        jquery: '../libraries/jquery/jquery',
        // jQuery Cookie
        jqueryCookie: '../libraries/jquery/jquery.cookie',
        // jQuery Mobile
        jqueryMobile: '../libraries/jquery/jquery.mobile',
        // jQuery UI
        jqueryUi: '../libraries/jquery/jquery.ui',
        // jQuery UI I18N
        jqueryUiI18n: '../libraries/jquery/jquery.ui.i18n',
        // JSON2
        json2: '../libraries/json2/json2',
        // Backbone Local Storage
        localStorage: '../libraries/backbone/backbone.localStorage',
        // Log4js Logger
        log4js: '../libraries/log4js/log4js',
        // Modernizr
        modernizr: '../libraries/modernizr/modernizr-min',
        // Moustache
        mustache: '../libraries/mustache/mustache',
        // QUnit
        qunit: '../libraries/qunit/qunit',
        // Regex Validation
        regexValidation: '../libraries/custom/regexValidation',
        // Require
        require: '../libraries/require/require',
        // Respond
        respond: '../libraries/respond/respond',
        // Store! Require.js Plugin
        store: '../libraries/require/store',
        // Text! Require.js Plugin
        text: '../libraries/require/text',
        // Underscore
        underscore: '../libraries/underscore/underscore',

        /* Application Specific Paths for files other than Java Scripts */

        // The path where all the documents are kept
        documents: '../documents',
        // The path where all the images are kept
        images: '../images',
        // The path where all the styles are kept
        styles: '../styles',
        // The path where all the templates are kept
        templates: '../templates',
        // The path where all the json files are kept
        jsonFile: './json'
    },

    // Using shim config for Non-AMD Scripts
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        'app.logger': {
            // The script dependencies should be loaded before loading backbone.js
            deps: ['app.config', 'log4js'],
            // Once loaded, use the global 'Backbone' as the module value
            exports: 'app.logger'
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },
        handlebars: {
            exports: 'Handlebars',
            // FIXME: Find a proper way of getting Handlebars reference
            init: function () {
                this.Handlebars = Handlebars;
                return this.Handlebars;
            }
        },
        'jquery': {
            exports: '$'
        },
        'jqueryCookie': {
            deps: ['jquery'],
            exports: '$Cookie'
        },
        'jqueryMobile': {
            deps: ['jquery'],
            exports: '$Mobile'
        },
        'jqueryUi': {
            deps: ['jquery'],
            exports: '$Ui'
        },
        'jqueryUiI18n': {
            deps: ['jqueryUi'],
            exports: '$UiI18n'
        },
        log4js: {
            exports: 'Log4js',
            // FIXME: Find a proper way of getting Log4js reference
            init: function () {
                this.Log4js = Log4js;
                return this.Log4js;
            }
        },
        'localStorage': {
            deps: ['backbone'],
            exports: 'LocalStorage'
        },
        'regexValidation': {
            exports: 'regexValidation'
        },
        'response': {
            deps: ['domReady'],
            exports: 'Response'
        },
        'underscore': {
            exports: '_'
        }
    },

    // Give a waiting period for loading all the libraries
    waitSeconds: 15
});

// Start the main app logic
requirejs(['app.logger', 'app.config', 'backbone', 'jquery', 'bootstrap', 'app.router'],
    function (LOGGER, AppConfig, Backbone, $) {
        'use strict';

        // Log the Application Specific Info
        console.log("--------------------------------------------------------------------------------------");
        console.log("Application Start Time     : " + AppConfig.current_date_time);
        console.log("Application Name           : " + AppConfig.app_name);
        console.log("Application Version        : " + AppConfig.app_version);
        console.log("Application Release Date   : " + AppConfig.app_release_date);
        console.log("Application Author         : " + AppConfig.app_author);
        console.log("Application Description    : " + AppConfig.app_description);
        console.log("Application License        : " + AppConfig.app_license);
        console.log("Application Namespace      : " + AppConfig.app_namespace());
        console.log("--------------------------------------------------------------------------------------");
        console.log("If you experience any problem whatsoever with this web application, you can enable ");
        console.log("'debug' mode using the following command: ['true' to enable and 'false' to disable] ");
        console.log("AppLogger." + AppConfig.app_name + ".enableDebugMode(true)");
        console.log("NOTE: You MUST NOT refresh your browser at any point after enabling the 'debug' mode");
        console.log("--------------------------------------------------------------------------------------\n");

        AppLogger[AppConfig.app_name].enableTraceMode(true);

        // Start the Backbone History API
        Backbone.history.start();

    }
);
