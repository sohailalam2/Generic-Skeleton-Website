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
 * This file contains all the application specific information.
 *
 * Any module that requires access to application specific configurations must
 * require this app.config module.
 *
 * User: Sohail Alam
 * Version: 1.0.0
 * Date: 29/08/13
 * Time: 3:15 PM
 */
define('app.config', ['require'], {
    app_name: 'GenericSkeletonWebsite',
    app_version: '1.0.0',
    app_release_date: '29th Sep, 2013',
    app_author: 'Sohail Alam',
    app_description: 'Welcome to the world of Generic Skeleton Website',
    app_license: 'Private License', // TODO: Add a license
    current_date_time: new Date(),

    // A unique name for the Local Storage used by this App
    app_namespace: function () {
        return (this.app_name + '_' + this.app_version).toString();
    }
});
