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

define(['dojo/_base/declare',
    'dojo/_base/html',
    'dojo/query',
    'dojo/on',
    'dojo/_base/lang',
    'dijit/_WidgetsInTemplateMixin',
    "jimu/PanelManager",
    'jimu/BaseWidget'
  ],
  function (declare, html, query, on, lang, _WidgetsInTemplateMixin, PanelManager,BaseWidget) {
    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-about',
      // clasName: 'esri.widgets.About',

      _hasContent: null,

      postCreate: function() {
        this.inherited(arguments);

        this._hasContent = this.config.about && this.config.about.aboutContent;
      },

      startup: function() {
        this.inherited(arguments);
        var panelTC = this.getPanel();
        panelTC.position.width = 272;
        panelTC.position.height = 100;
        panelTC._originalBox = {
            w: panelTC.position.width,
            h: panelTC.position.height,
            l: panelTC.position.left || 0,
            t: panelTC.position.top || 0
        };
        panelTC.setPosition(panelTC.position);
        panelTC.panelManager.normalizePanel(panelTC);
       // this.resize();
      },
      onOpen: function () {
          
          var panelTC = this.getPanel();
          panelTC.position.width = 272;
          panelTC.position.height = 100;
          panelTC._originalBox = {
              w: panelTC.position.width,
              h: panelTC.position.height,
              l: panelTC.position.left || 0,
              t: panelTC.position.top || 0
          };
          panelTC.setPosition(panelTC.position);
          panelTC.panelManager.normalizePanel(panelTC);


        
      },
     

 
    });
    return clazz;
  });