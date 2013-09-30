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
 * This is a require.js plugin which is used for locally caching any data and then retrieving
 * it when requiring at a later time.
 *
 * Most of the xhr related methods have been taken from the text! plugin of require.js,
 * and modified to meet the requirements for this plugin.
 *
 * It is an independent plugin and its only dependency is require.js
 *
 * User: Sohail Alam
 * Version: 1.0.0
 * Date: 1/9/13
 * Time: 12:13 PM
 */
define(['module'], function (module) {
    'use strict';

    var logger = new function () {

        var enabled = true;

        this.info = function (message) {
            if (enabled)
                console.log("store! INFO: " + message);
        };

        this.debug = function (message) {
            if (enabled)
                console.debug("store! DEBUG: " + message);
        };

        this.error = function (message, e) {
            if (enabled) {
                console.error("store! ERROR: " + message);
                if (e)
                    console.error(e);
            }
        };
    };

    // Variables
    var store,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
    // If a config is passed for this module
        masterConfig = (module.config && module.config()) || {},
    // The default time in hours after which the module data is deleted from Storage
        defaultExpiration = 168, // 168 hours = 7 days
    // Check whether browser supports Storage (local and session)
        canStore = (function () {
            var isSupported = false;
            try {
                isSupported = typeof(Storage) !== "undefined";
            } catch (e) {
            }
            return isSupported;
        })();

    /**
     * This is a require.js plugin which is used for locally caching any data and then retrieving
     * it when requiring at a later time.
     *
     * The data is json serialized and stored in localStorage/sessionStorage.
     *
     * HOW TO CONFIGURE STORE!
     * ----------------------
     * <pre>
     requirejs.config({
            // Pass configurations to the 'store' module
            config: {
                'store': {
                    // Define the prefix with which the module data is stored in Storage
                    prefix: 'store-',
                    // Define the time after which the module is erased from the Storage
                    // and reloaded from Server
                    expiry: 5000, // In Hours
                    // Define the last updated parameters
                    lastUpdated: {
                        'test1.js': '12121'
                    },
                    // Define which modules are to be persisted
                    persist:{
                        test1.js' : false,
                        'jquery.js': true
                    },
                    // Set headers
                    headers: {
                        'Hello-World' : 'Welcome'
                    },
                    // Define a success callback in which you will get the module data that was loaded
                    successCallback: function (data) {
                        console.log("SUCCESS CALLBACK: " + data);
                    },
                    // Define an error callback in which you will get the error for you to handle
                    errorCallback: function (e) {
                        console.error("ERROR CALLBACK: " + e);
                    },
                    createXhr: function () {
                        // your logic
                    },
                    onXhr: function () {
                        // your logic
                    },
                    onXhrComplete: function () {
                        // your logic
                    },
                    useXhr: function () {
                        // your logic
                    }
                }
            }
        });
     * </pre>
     *
     * HOW TO USE STORE!
     * ----------------
     * Make sure you include the file extension, if it differs from .js
     * If you are loading javascript then file extension is optional.
     * <pre>
     * require(['store!test1.js', 'store!!fetchMeFromServer'], function(Test1){
     *      ...
     * });
     * NOTE:
     * 1.   You can use a bang (!) before the name of the module to always fetch it from the Server
     *      and never store it locally.
     *      Example: store!!module.json
     *
     * 2.   You can leave out the extension (.js) if the module is a JavaScript (it will be faster this way),
     *      however you MUST include the extension in case of other file type.
     *      Example: 'store!test1', 'store!test1.js', 'store!test1.html'
     *
     * 3.   If your module name already contains a (.) and is a JavaScript then you MUST
     *      include its (.js) extension.
     *      Example: 'store!test.one.js'
     *
     * </pre>
     *
     * @param data The actual data to store
     * @constructor
     */
    var StorageData = function (data) {
        var now = +new Date();
        // TODO: keep a key value pair of last updated date time for components
        // The date on which the specified scripts were last updated, name:date
        this.lastUpdated = masterConfig.lastUpdated || {};
        // TODO: Expire the components after timeout
        // ttl value, after which the data will be erased from the local storage
        this.expiry = now + ((masterConfig.expiry || defaultExpiration) * 60 * 60 * 1000);
        // Current Time Stamp
        this.timestamp = now;
        // The data to store
        this.data = data;
    };

    // Getters
    StorageData.prototype = {
        getLastUpdated: function () {
            return this.lastUpdated;
        },
        getExpiry: function () {
            return this.expiry;
        },
        getTimestamp: function () {
            return this.timestamp;
        },
        getData: function () {
            return this.data;
        }
    };

    /**
     * A method to on to operate Strings and check if it starts with the given prefix
     *
     * @param prefix The starting characters
     * @returns {boolean} true/false
     */
    String.prototype.startsWith = function (prefix) {
        return this.indexOf(prefix, 0) !== -1;
    };

    /**
     * A method to on to operate Strings and check if it ends with the given suffix
     *
     * @param suffix The ending characters
     * @returns {boolean} true/false
     */
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    // The Store Object
    store = {
        // The version of the store plugin
        version: '1.0.0',
        // The modules that are to be persisted in localStorage
        // if false, then only sessionStorage is used
        persist: masterConfig.persist || {},
        // The storagePrefix with which data are stored in local storage
        storagePrefix: masterConfig.prefix || 'store-',
        headers: masterConfig.headers || null,
        // User defined success callback
        successCallback: masterConfig.successCallback || function (msg) {
            logger.debug(msg);
        },
        // User defined error callback
        errorCallback: masterConfig.errorCallback || function (e) {
            logger.error("Require.js store! ERROR : " + e);
        },

        /**
         * To determine the type of storage to use for the given module.
         * This is configured in the for the module.
         * <pre>
         config:{
                   persist:{
                        test1.js' : false,   // store just for the current session
                        'jquery.js': true    // store permanently
                   }
             }
         * </pre>
         *
         * @param   name The name of module,
         *          following same naming conventions as the store!<moduleName>
         * @returns {Storage} localStorage or sessionsStorage
         */
        storageType: function (name) {
            // If persist: {} is passed in the module config
            if (store.persist != null) {
                var toPersist;
                // Parse the module name
                var parsedName = store.parseName(name);
                // Check whether the module name passed in the persist: {} config contains
                // an extension or not
                if (((toPersist = store.persist[parsedName.moduleName]) != undefined) ||
                    (toPersist = store.persist[parsedName.fullName]) != undefined) {
                    // If true then use localStorage else use sessionStorage
                    return toPersist ? localStorage : sessionStorage;
                }
            }
            return localStorage;
        },

        /**
         * Save the data into the Storage
         *
         * @param name The name of the module (irrespective of the path)
         * @param data The module content and some extra parameters
         */
        save: function (name, data) {
            try {
                // Determine the Storage type to use for this module
                var storage = store.storageType(name);
                // Convert to JSON and store it
                storage.setItem((store.storagePrefix + name),
                    JSON.stringify(new StorageData(data))
                );
                logger.debug("Data Saved for : " + name);
            } catch (e) {
                // TODO: Quota exceeded - delete older entries
                // If the data was not saved due to QuotaExceededError,
                // then delete older data and try to save the same
                if (e.name.toUpperCase().indexOf('QUOTA') >= 0) {
                    // TODO: How to iterate all stored entries
                    // Possibly, keep a separate list in storage containing the keys of
                    // the stored resources as this list's values
                    logger.error("QUOTA EXCEEDED... Could not save: " + name);
                }
                // Provide a callback if some other error occurred
                else {
                    store.errorCallback(e);
                }
            }
        },

        /**
         * Get the data back from the storage
         *
         * @param name The name of the module (irrespective of the path)
         * @param callback A user defined callback function to provide callback
         * @returns Only the module data
         */
        // TODO: destroy the data when updated data is available on the server
        retrieve: function (name, callback) {
            try {
                var now = +new Date();
                // Determine the Storage type to use for this module
                var storage = store.storageType(name);
                // Get JSON encoded data for this module
                var jsonData = storage.getItem((store.storagePrefix + name));
                // Convert JSON to object and return only the module data leaving any metadata
                if (jsonData != null) {
                    var parsedData = JSON.parse(jsonData);
                    parsedData.__proto__ = StorageData.prototype;
                    // Delete the data if it has expired and return null so as to fetch it from Server
                    if ((now - parsedData.getExpiry()) > 0) {
                        store.destroy(name);
                        logger.debug("Removing Expired Data for : " + name);
                        return null;
                    }
                    // Else return the data
                    else {
                        store.successCallback(parsedData.getData());
                        return parsedData.getData();
                    }
                }
            } catch (e) {
                store.errorCallback(e);
            }
            return null;
        },

        /**
         * Remove the data from the storage.
         *
         * @param name The name of the module (irrespective of the path)
         */
        destroy: function (name) {
            try {
                // Determine the Storage type to use for this module
                var storage = store.storageType(name);
                // Remove the data for this module
                storage.removeItem((store.storagePrefix + name));
            } catch (e) {
                store.errorCallback(e);
            }
            return null;
        },

        /**
         * Check whether the module is a JavaScript or not,
         * depending upon the .js extension in the name.
         *
         * @param name The full name of the module including its extension
         * @returns true/false
         */
        isJS: function (name) {
            return name.endsWith(".js");
        },

        /**
         * Parses a resource name into its component parts.
         * Resource names look like: module/name.ext
         *
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext"
         */
        // TODO: if a module name starts with a !
        // then we MUST always fetch it from the server and never store it locally
        parseName: function (name) {
            var bang = false,
                path = "./",
                modName = undefined,
                ext = undefined,
                index = name.lastIndexOf("."),
                isRelative = name.indexOf('./') === 0 || name.indexOf('../') === 0;

            if (name.startsWith("!")) {
                bang = true;
                name = name.substring(1);
            }

            if (index === -1) {
                modName = name;
                ext = ".js";
            } else if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index, name.length);
            } else {
                var lastPos = name.lastIndexOf("/");
                var temp = name.substring(lastPos + 1, name.length);
                var dotPos = temp.indexOf(".");
                path = name.substring(0, lastPos + 1);

                if (dotPos === -1) {
                    modName = temp;
                    ext = ".js";
                } else if (dotPos !== -1) {
                    modName = temp.substring(0, dotPos);
                    ext = temp.substring(dotPos + 1, temp.length);
                }
            }
            /*

             logger.debug("-------------------------------------------");
             logger.debug("bang: " + bang);
             logger.debug("path: " + path);
             logger.debug("moduleName: " + modName);
             logger.debug("ext: " + ext);
             logger.debug("-------------------------------------------");
             */

            return {
                bang: bang,
                path: path,
                moduleName: modName,
                ext: ext,
                fullName: modName + ext
            };
        },

        /**
         * Create XHR - Taken from text! plugin
         */
        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {
                        store.errorCallback(e);
                    }
                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }
            return xhr;
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Taken from text! plugin
         *
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         * @param hostname
         * @param port
         * @param protocol
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = store.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                ((!uPort && !uHostName) || uPort === port);
        },

        /**
         * Taken from text! plugin
         *
         * @param url
         * @param callback
         * @param headers
         */
        get: function (url, callback, headers) {

            logger.debug("Loading from Server => URL: " + url);

            var xhr = store.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }
            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }
            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        store.errorCallback(err);
                    } else {
                        store.successCallback(xhr.responseText);
                        callback(xhr.responseText);
                    }
                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        },

        /**
         * Parse the module data if it is a JavaScript and load, else simply load
         *
         * @param parsedName The parsed name of the module
         * @param onLoad The onLoad method
         * @param data The data that is to be loaded
         */
        parseAndLoad: function (parsedName, onLoad, data) {
            // If data is a javascript then try to parse it
            if (store.isJS(parsedName.fullName)) {
                logger.debug("Parsing JavaScript Module: " + parsedName.fullName);
                try {
                    onLoad.fromText(parsedName.moduleName, data);
                } catch (e) {
                    store.errorCallback(e);
                }
            }
            // If not a JavaScript, then simply load it
            else {
                onLoad(data);
            }
        },

        /**
         * Fetch the module from Server - Taken from text! plugin and modified
         *
         * @param require The Require
         * @param parsedName The parsed name of the module
         * @param onLoad onLoad method
         */
        // FIXME: If path is already defined in config then use that
        fetchFromServer: function (require, parsedName, onLoad) {
            var url,
                useXhr = (masterConfig.useXhr) || store.useXhr;

            url = require.toUrl(parsedName.path + parsedName.fullName);

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }
            //Load the text. Use XHR if possible and in a browser.
            if (useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                store.get(url, function (data) {
                    store.parseAndLoad(parsedName, onLoad, data);
                    // If Storage is possible and name does not starts with a bang (!), then store it
                    if (canStore && !parsedName.bang) {
                        store.save(parsedName.fullName, data);
                    }
                }, store.headers);
            }
        },

        /**
         * The only mandatory requirement for store! to be a require.js plugin
         *
         * @param name The module name
         * @param require
         * @param onLoad
         * @param config
         */
        load: function (name, require, onLoad, config) {

            var parsedName = store.parseName(name),
                fullName = parsedName.fullName,
                data;

            // If name starts with a bang (!) then always fetch it from the server
            if (parsedName.bang) {
                store.fetchFromServer(require, parsedName, onLoad);
                // need to return here to prevent a second
                // request being sent over the network.
                return;
            }

            // If Storage is supported, then try to load from the Storage,
            // if not already stored then get it from the Server and store it
            if (canStore) {
                // First try to retrieve the data from storage
                if ((data = store.retrieve(fullName, null)) != null) {
                    store.parseAndLoad(parsedName, onLoad, data);
                    console.debug("Retrieved from Storage: " + fullName);
                    // need to return here to prevent a second
                    // request being sent over the network.
                    return;
                }
                // If not locally stored, then get it from the server
                else {
                    store.fetchFromServer(require, parsedName, onLoad);
                    // need to return here to prevent a second
                    // request being sent over the network.
                    return;
                }
            }
            // If Storage is not supported then too we want to load the modules from Server
            else {
                store.fetchFromServer(require, parsedName, onLoad);
                // need to return here to prevent a second
                // request being sent over the network.
                return;
            }
        }
    };
    return store;
});
