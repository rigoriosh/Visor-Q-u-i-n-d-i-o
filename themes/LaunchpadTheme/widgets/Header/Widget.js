///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/dom-class',
  'dojo/_base/window',
  'dojo/window',
  'dojo/query',
  'dojo/on',
  //'dojo/topic',
  'dojo/Deferred',
  'jimu/BaseWidget',
  'jimu/WidgetManager',
  'jimu/LayoutManager',
  'jimu/utils',
  'dojo/NodeList-dom',
  'dojo/NodeList-manipulate'
],
  function (declare, lang, array, html, domClass, winBase, win, query, on,
    Deferred, BaseWidget, WidgetManager, LayoutManager, utils) {
    /* global jimuConfig */
    /*jshint scripturl:true*/
    var clazz = declare([BaseWidget], {

      
      name: 'Header',

      switchableElements: {},
      _boxSizes: null,

      moveTopOnActive: false,

      constructor: function () {

      },

      postCreate: function () {
      },

      _getSearchWidgetInHeader: function () {
      },

      startup: function () {
      },

    });
    return clazz;
  });
