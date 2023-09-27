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
    "esri/tasks/GeometryService",
    "esri/SpatialReference",
    "esri/geometry/Point",
     "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
     "esri/Color",
    "esri/graphic",
    'jimu/BaseWidget',
    "esri/dijit/LocateButton",
    'dojo/_base/html',
    'dojo/on',
    'dojo/_base/lang',
    'jimu/utils',
    'jimu/dijit/Message',
    'dojo/touch'

  ],
  function(declare,GeometryService,SpatialReference, Point, SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol, Color ,Graphic,BaseWidget, LocateButton, html, on, lang, jimuUtils) {
    var clazz = declare([BaseWidget], {

      name: 'MyLocation',
      baseClass: 'jimu-widget-mylocation',

      startup: function() {
        this.inherited(arguments);
        this.placehoder = html.create('div', {
          'class': 'place-holder',
          title: this.label
        }, this.domNode);

        this.isNeedHttpsButNot = jimuUtils.isNeedHttpsButNot();

        if (true === this.isNeedHttpsButNot) {
          console.log('LocateButton::navigator.geolocation requires a secure origin.');
          html.addClass(this.placehoder, "nohttps");
          html.setAttr(this.placehoder, 'title', this.nls.httpNotSupportError);
        } else if (window.navigator.geolocation) {
          this.own(on(this.placehoder, 'click', lang.hitch(this, this.onLocationClick)));
          this.own(on(this.map, 'zoom-end', lang.hitch(this, this._scaleChangeHandler)));
        } else {
          html.setAttr(this.placehoder, 'title', this.nls.browserError);
        }
      },

      onLocationClick: function () {

          var latitud , longitud;
          navigator.geolocation.getCurrentPosition(function(position) {
              let lat = position.coords.latitude;
              let long = position.coords.longitude;

              longitud = long;
              latitud = lat;
            
              var spatialRef3116 = new SpatialReference(4326);
              console.log(spatialRef3116);
              //wkid: appGlobal.map.spatialReference
              
              var puntoUbi = new Point(long, lat, spatialRef3116);

              var geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
              geometryService.project([puntoUbi], map.spatialReference, function (projectedPoints) {
                  pt = projectedPoints[0];  
                  /*
                  attr = atributo;
                  ubicarPorCoordenadas.title = "Coordenada geográfica";
                  ubicarPorCoordenadas.atributo = attr;
                  ubicarPorCoordenadas.fields = ["Latitud", "Longitud"];
                  */
                  agregarPunto(pt);
              });

              function agregarPunto(puntoUbi){


                  var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));

                  var newZoom = 50000;  
                  this.map.setScale(newZoom);
                  //capaGrafica.add(newPunto);
                  this.map.centerAt(puntoUbi);

                  var newPunto = new Graphic(puntoUbi, symbol);   
                  this.map.graphics.add(newPunto);
               
              }
          });
        

          
         

          /*

        if (html.hasClass(this.domNode, "onCenter") ||
          html.hasClass(this.domNode, "locating")) {
          html.removeClass(this.domNode, "onCenter");
          html.removeClass(this.placehoder, "tracking");
          this._destroyGeoLocate();
        } else {
          this._createGeoLocate();
          this.geoLocate.locate();
          html.addClass(this.placehoder, "locating");
        }

          */
      },
      //use current scale in Tracking
      _scaleChangeHandler: function() {
        var scale = this.map.getScale();
        if (scale && this.geoLocate && this.geoLocate.useTracking) {
          this.geoLocate.scale = scale;
        }
      },

      onLocate: function(parameters) {
        html.removeClass(this.placehoder, "locating");
        if (this.geoLocate.useTracking) {
          html.addClass(this.placehoder, "tracking");
        }

        if (parameters.error) {
          console.error(parameters.error);
          // new Message({
          //   message: this.nls.failureFinding
          // });
        } else {
          html.addClass(this.domNode, "onCenter");
          this.neverLocate = false;
        }
      },

      _createGeoLocate: function() {
        var json = this.config.locateButton;
        json.map = this.map;
        if (typeof(this.config.locateButton.useTracking) === "undefined") {
          json.useTracking = true;
        }
        json.centerAt = true;
        json.setScale = true;

        var geoOptions = {
          maximumAge: 0,
          timeout: 15000,
          enableHighAccuracy: true
        };
        if (json.geolocationOptions) {
          json.geolocationOptions = lang.mixin(geoOptions, json.geolocationOptions);
        }

        this.geoLocate = new LocateButton(json);
        this.geoLocate.startup();

        this.geoLocate.own(on(this.geoLocate, "locate", lang.hitch(this, this.onLocate)));
      },

      _destroyGeoLocate: function() {
        if (this.geoLocate) {
          this.geoLocate.clear();
          this.geoLocate.destroy();
        }

        this.geoLocate = null;
      },

      destroy: function() {
        this._destroyGeoLocate();
        this.inherited(arguments);
      }
    });
    clazz.inPanel = false;
    clazz.hasUIFile = false;
    return clazz;
  });