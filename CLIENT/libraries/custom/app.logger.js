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
 * User: sohail.alam
 * Version: 1.0.0
 * Date: 24/8/13
 * Time: 5:19 PM
 */
define('app.logger', ['app.config', 'log4js'], function (AppConfig, Log4js) {

    'use strict';

    var LOGGER = new function () {
        var that = this;

        this.LOGGER_NAME = AppConfig.app_namespace();

        // The loggers are cached and if you request a second time a
        // logger for the same category the old one is returned.
        this.LOG = new Log4js.getLogger(this.LOGGER_NAME);

        // The levels are cumulative.
        // If you for example set the logging level to WARN all warnings,
        // errors and fatals are logged:
        /*
         *   Log4js.Level            Description
         *   -----------------------------------------------------
         *   OFF                     nothing is logged
         *   FATAL                   fatal errors are logged
         *   ERROR                   errors are logged
         *   WARN                    warnings are logged
         *   INFO                    infos are logged
         *   DEBUG                   debug infos are logged
         *   TRACE                   traces are logged
         *   ALL                     everything is logged
         */

        // TODO: Change Default Log Level to FATAL for production
        this.LOG.setLevel(Log4js.Level.OFF);
        // Press ALT + D to show the console window
        this.LOG.addAppender(new Log4js.BrowserConsoleAppender(true));

        // An internal method used for formatting the log output
        function logFormatter(fileName, methodName, message) {
            var date = new Date();
            return " [" + that.LOGGER_NAME + " * " + date.toLocaleString() + " ] " + "File: <" + fileName + "> Method: <" + methodName + "> LOG: " + message;
        }

        /**
         * Trace messages
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be logged
         */
        this.trace = function (fileName, methodName, message) {
            this.LOG.trace(logFormatter(fileName, methodName, message));
            return this;
        };

        /**
         * Debug messages
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be logged
         */
        this.debug = function (fileName, methodName, message) {
            this.LOG.debug(logFormatter(fileName, methodName, message));
            return this;
        };

        /**
         * Debug messages with Throwable Exception
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object}  message to be logged
         * @param throwable {Throwable}
         */
        this.debug = function (fileName, methodName, message, throwable) {
            this.LOG.debug(logFormatter(fileName, methodName, message), throwable);
            return this;
        };

        /**
         * logging info messages
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be logged
         */
        this.info = function (fileName, methodName, message) {
            this.LOG.info(logFormatter(fileName, methodName, message));
            return this;
        };

        /**
         * logging info messages with Throwable Exception
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be logged
         * @param throwable {Throwable}
         */
        this.info = function (fileName, methodName, message, throwable) {
            this.LOG.info(logFormatter(fileName, methodName, message), throwable);
            return this;
        };

        /**
         * logging warn messages
         *
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be logged
         */
        this.warn = function (fileName, methodName, message) {
            this.LOG.warn(logFormatter(fileName, methodName, message));
            return this;
        };

        /**
         * logging warn messages with Throwable Exception
         *
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be logged
         * @param throwable {Throwable}
         */
        this.warn = function (fileName, methodName, message, throwable) {
            this.LOG.warn(logFormatter(fileName, methodName, message), throwable);
            return this;
        };

        /**
         * logging error messages
         *
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be logged
         * @param throwable {Throwable}
         */
        this.error = function (fileName, methodName, message) {
            this.LOG.error(logFormatter(fileName, methodName, message));
            return this;
        };

        /**
         * logging error messages with Throwable Exception
         *
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be logged
         * @param throwable {Throwable}
         */
        this.error = function (fileName, methodName, message, throwable) {
            this.LOG.error(logFormatter(fileName, methodName, message), throwable);
            return this;
        };

        /**
         * logging fatal message
         *
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be loggeds
         */
        this.fatal = function (fileName, methodName, message) {
            this.LOG.fatal(logFormatter(fileName, methodName, message));
            return this;
        };

        /**
         * logging fatal messages with Throwable Exception
         *
         * @param fileName {Object} the name of the file in which the logging event exists
         * @param methodName {Object} the name of the method in which the logging event exists
         * @param message {Object} message to be logged
         * @param throwable {Throwable}
         */
        this.fatal = function (fileName, methodName, message, throwable) {
            this.LOG.fatal(logFormatter(fileName, methodName, message), throwable);
            return this;
        };

        this.trace('app.logger', '', 'Logger Initialized');
    };

    var AppLogger = new function () {
        /**
         * Helper method to enable or disable the DEBUG mode
         *
         * @param boolean true to enable or false to disable
         */
        this.enableDebugMode = function (boolean) {
            boolean ? LOGGER.LOG.setLevel(Log4js.Level.DEBUG) : LOGGER.LOG.setLevel(Log4js.Level.OFF);
            return "AppLogger set to level: " + LOGGER.LOG.level.toString();
        };

        // TODO: Delete this method when in production
        /**
         * Helper method to enable or disable the TRACE mode
         *
         * @param boolean true to enable or false to disable
         */
        this.enableTraceMode = function (boolean) {
            boolean ? LOGGER.LOG.setLevel(Log4js.Level.TRACE) : LOGGER.LOG.setLevel(Log4js.Level.OFF);
            return "AppLogger set to level: " + LOGGER.LOG.level.toString();
        };
    };

    // Create a Global Variable and initialize it to Logger
    // This can be used for enabling and disabling Logger's Debug Level
    // Use the existing AppLogger or create a new one and associate a
    // New Logger Property exclusively for this application
    window.AppLogger = window.AppLogger || {};
    window.AppLogger[AppConfig.app_name] = AppLogger;

    // Return the Singleton Instance of the Logger
    return LOGGER;
});
