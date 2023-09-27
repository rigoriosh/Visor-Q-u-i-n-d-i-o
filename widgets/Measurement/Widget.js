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
var cerrar = false;
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/aspect',
    'dojo/Deferred',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidget',
    'jimu/portalUtils',
    'jimu/dijit/Message',
    'esri/units',
     "dojo/i18n!esri/nls/jsapi",
    'esri/dijit/Measurement',
    "esri/symbols/jsonUtils",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/InfoTemplate",
    "esri/graphic",
    "esri/Color",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "libs/proj4js/dist/proj4-src",
    'dojo/on'
  ],
  function(
    declare,
    lang,
    aspect,
    Deferred,
    _WidgetsInTemplateMixin,
    BaseWidget,
    PortalUtils,
    Message,
    esriUnits,
    esriBundle,
    Measurement,
    jsonUtils,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    InfoTemplate,
    Graphic,
    Color,
    TextSymbol,
    Font,
    Proj4js,
    on) {
    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {

      name: 'Measurement',
      measurement: null,
      _pcDef: null,

      startup: function() {

        $('#widgets_Measurement_Widget_46_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza medici&oacute;n"></div>');

        if (this.measurement || this._pcDef) {
          return;
        }
        this.inherited(arguments);

        var json = this.config.measurement;
        json.map = this.map;
        if (json.lineSymbol) {
          json.lineSymbol = jsonUtils.fromJson(json.lineSymbol);
        }
        if (json.pointSymbol) {
          json.pointSymbol = jsonUtils.fromJson(json.pointSymbol);
        }

        this._processConfig(json).then(lang.hitch(this, function(measurementJson) {
          this.measurement = new Measurement(measurementJson, this.measurementDiv);
          this.own(aspect.after(this.measurement, 'setTool', lang.hitch(this, function() {
            if (this.measurement.activeTool) {
              this.disableWebMapPopup();
            } else {
              this.enableWebMapPopup();
            }
          })));

          this.measurement.startup();



         
         
          this.measurement._areaButton.titleNode.title = "Área -  Construya el polígono haciendo clic en la posición de sus vértices";
          this.measurement._distanceButton.titleNode.title = "Distancia - Trace en el mapa la distancia a calcular";
          this.measurement._locationButton.titleNode.title = "Ubicación - Haga clic en algún lugar del mapa para consultar sus coordenadas";
         // this.measurement._areaButton.titleNode.title = "Área";
          this.measurement._distanceUnitStrings = ["Kilometros", "Metros", "Millas"];
          this.measurement._distanceUnitStringsLong = ["esriKilometers", "esriMeters", "esriMiles"];
          this.measurement._areaUnitStrings = ["Kilometros cuadrados", "Metros cuadrados", "Hectáreas","Pies cuadrados", "Acres"];
          this.measurement._areaUnitStringsLong = ["esriSquareKilometers", "esriSquareMeters", "esriHectares", "esriSquareFeet", "esriAcres"];
          console.log(this.measurement);
          this._hideToolsByConfig();
        }), lang.hitch(this, function(err) {
          new Message({
            message: err.message || err
          });
        }));
        
      },

      _processConfig: function(configJson) {
        this._pcDef = new Deferred();
        if (configJson.defaultLengthUnit && configJson.defaultAreaUnit) {
          this._pcDef.resolve(configJson);
        } else {
          PortalUtils.getUnits(this.appConfig.portalUrl).then(lang.hitch(this, function(units) {
            configJson.defaultAreaUnit = units === 'english' ?
              esriUnits.SQUARE_MILES : esriUnits.SQUARE_KILOMETERS;
            configJson.defaultLengthUnit = units === 'english' ?
              esriUnits.MILES : esriUnits.KILOMETERS;
            this._pcDef.resolve(configJson);
          }), lang.hitch(this, function(err) {
            console.error(err);
            configJson.defaultAreaUnit = esriUnits.SQUARE_MILES;
            configJson.defaultLengthUnit = esriUnits.MILES;
            this._pcDef.resolve(configJson);
          }));
        }

        return this._pcDef.promise;
      },

      _hideToolsByConfig: function() {
        if (false === this.config.showArea) {
          this.measurement.hideTool("area");
        }
        if (false === this.config.showDistance) {
          this.measurement.hideTool("distance");
        }
        if (false === this.config.showLocation) {
          this.measurement.hideTool("location");
        }
      
      },

      disableWebMapPopup: function() {
          this.map.setInfoWindowOnClick(false);
          //this.map.graphics.clear();
          //prueba();
      },

      enableWebMapPopup: function() {
          this.map.setInfoWindowOnClick(true);
          this.map.graphics.clear();
      },

      onDeActive: function() {
        this.onClose();
      },

      onClose: function() {
        if (this.measurement && this.measurement.activeTool) {
          this.measurement.clearResult();
          this.measurement.setTool(this.measurement.activeTool, false);
        }
        this.map.setInfoWindowOnClick(false);
        this.map.graphics.clear();
        cerrar = true;
      },

      destroy: function() {
        if (this.measurement) {
          this.measurement.destroy();
        }
        this.inherited(arguments);
      },

      onOpen: function () {
          this.own(on(this.map, "click", lang.hitch(this, this.onMapClick)));
          var panel = this.getPanel();
          var width = 275;
          var height = 277;
          ajustarTamanioWidget(panel, width, height);
      },

        onMapClick: function(event) {  
            //this.mapIdNode.innerHTML = String(event.mapPoint.x);  
            if (!cerrar) {
                var punto = event.mapPoint;
                console.log(punto);/*
            var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));
            attr = { "Xcoord": event.mapPoint.x, "Ycoord": event.mapPoint.y };
            var newPunto = new Graphic(punto, symbol, attr);
            this.map.graphics.add(newPunto);*/

                var attr = { "Xcoord": event.mapPoint.x.toFixed(3), "Ycoord": event.mapPoint.y.toFixed(3) };
/*
                var x =  event.mapPoint.x.replace(/\./g,'');
                var y=  event.mapPoint.y;
                let xFix = parseFloat(x.replace(',','.'));
        
                let yFix = parseFloat(y.replace(/\./g,'').replace(',','.'));

                let source = new Proj4js.Proj('EPSG:3115');
                let dest = new Proj4js.Proj('EPSG:4326');         
                let punto2 = new Proj4js.toPoint([xFix,yFix]);  
                let gc =  Proj4js.transform(source, dest, punto2); 
                console.log(gc);
                */
                var font = new Font("15px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);

                if (attr.Xcoord != undefined) {
                    var atributo =
                      {
                          "Latitud": " " + attr.Xcoord + "",
                          "Longitud": " " + attr.Ycoord + "  "
                      };
                    var textSymbol = new TextSymbol("X: " + attr.Xcoord + ", Y: " + attr.Ycoord, font, new Color([40, 245, 255]));
                } else {
                    var atributo =
                   {
                       "Latitud": " " + attr.Latitud + "",
                       "Longitud": " " + attr.Longitud + "  "
                   };
                    
                    var textSymbol = new TextSymbol(font);
                    var font = new Font();
                    font.setSize("8pt");
                    font.setWeight(Font.WEIGHT_BOLD);
                    textSymbol.setFont(font);
                }
              
                var labelPointGraphic = new Graphic(punto, textSymbol);
                var fields = ["Latitud", "Longitud"];
                var title = "Coordenada geográfica";

                crearInfoTemplate(title, atributo, fields);
                this.map.graphics.add(labelPointGraphic);
            
               
            }
        },
    });

   

    return clazz;



  });