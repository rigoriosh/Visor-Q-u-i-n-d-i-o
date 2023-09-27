var urlSel = "no tengo nada";
var capaUrl = "";
var todosGruposCE = [];
var fieldsCapa = [];
var appGlobal;
var theLayer;
var featureCargados = [];
var resultadosMandar;
var extentInicial;
var resultadosQueryCE;
var ResultadosJson;
var consultaEspacial = {};
var extentCapaSelecionada;
var idFeatureCargado = 0;
var widgetMyResultados = "widgets_MyWidgetResultados_Widget_40";
define(["dojo/dom",
    'dojo/on',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'jimu/BaseWidget',
    'dojo/_base/html',
    "esri/toolbars/draw",
    "esri/geometry/webMercatorUtils",
    "esri/map",
    "dojo/query",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/toolbars/draw",
    "dijit/registry",
    "dojo/parser",
    "esri/graphic",
    "esri/tasks/GeometryService",
    "esri/tasks/BufferParameters",
    "esri/geometry/Point",
    "esri/SpatialReference",
    "esri/geometry/normalizeUtils",
    "esri/renderers/SimpleRenderer",
    "dojo/_base/array",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/renderers/jsonUtils",
    "esri/request",
    "dojo/_base/json",
    "esri/InfoTemplate",
    "esri/geometry/Extent",
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "jimu/PanelManager",
    "dojo/dom-class",
    "esri/dijit/Popup",
    "dojo/dom-construct",
    

    "dojo/domReady!"
],
    function (dom,
        on,
        declare,
        lang,
        BaseWidget,
        html,
        Draw,
        webMercatorUtils,
        Map,
        query,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        Color,
        Draw,
        registry,
        parser,
        Graphic,
        GeometryService,
        BufferParameters,
        Point,
        SpatialReference,
        normalizeUtils,
        SimpleRenderer,
        array,
        FeatureLayer,
        Query,
        jsonUtil,
        esriRequest,
        dojoJson,
        InfoTemplate,
        Extent,
        GeometryService,
        ProjectParameters,
        PanelManager,
        domClass,
        Popup,
        
        domConstruct

    ) {

        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here

            //baseClass: 'jimu-widget-mywidget',
            

            postCreate: function() {
                this.inherited(arguments);
                console.log('postCreate');
                this.map.infoWindow.hide();
                var panel = this.getPanel();
                this.inherited(arguments);
                // currentLayer = this.map.getLayer("capaResultadoCA");
                on = this.on;
                map = this.map;
                toolbar = new Draw(map);
               
                toolbar.on("draw-end", dibujarCE);
            },

            startup: function() {
                //  this.inherited(arguments);
                //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
                //console.log('startup');

                $('#widgets_ConsultaEspacial_Widget_50_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza una consulta espacial"></div>');
                
                var panelConsultaEspacial = this.getPanel();
                panelConsultaEspacial.position.width = 300;
                panelConsultaEspacial.position.height = 300;
                panelConsultaEspacial._originalBox = {
                    w: panelConsultaEspacial.position.width,
                    h: panelConsultaEspacial.position.height,
                    l: panelConsultaEspacial.position.left || 0,
                    t: panelConsultaEspacial.position.top || 0
                };
                panelConsultaEspacial.setPosition(panelConsultaEspacial.position);
                panelConsultaEspacial.panelManager.normalizePanel(panelConsultaEspacial);
                mostrarResultados(this);
                esriConfig.defaults.geometryService = new GeometryService(SERVICIO_GEOMETRIA);
                esriConfig.defaults.io.proxyUrl = "/proxy/";
                esriConfig.defaults.io.alwaysUseProxy = false;
                this.map.infoWindow.hide();
                query(".tool").on("click", function (evt) {

                    evento = evt;
                    console.log("entre  :) ");
                    console.log(evt.target.id);
                    //  revisarResultados();
                    if (evt.target.id == "limpiar") {
                        ajustarExtend(extentCapaSelecionada);
                    }
                    if (toolbar && evt.target.id != "limpiar") {
                        toolbar.activate(evt.target.id);
                    } 
                    if (toolbar && evt.target.id == "polyline") {
                      
                        console.log("que hacer ");
                    }
                });

            },

            onOpen: function () {
                this.map.setInfoWindowOnClick(false);
                this.map.infoWindow.hide();
                document.getElementById("divTablaCE").style.display = 'none';
                document.getElementById("divTablaConsultaEspacial").style.display = 'none';

                document.getElementById("divFormularioCE").style.display = 'block';
                document.getElementById("idDibujar").style.display = 'block';

                selServicioCE.options.length = 0;
                selGruposCE.options.length = 0;
                selCapasCE.options.length = 0;
                var panel = this.getPanel();
                panel.position.width = 300;
                panel.position.height = 300;
                panel._originalBox = {
                    w: panel.position.width,
                    h: panel.position.height,
                    l: panel.position.left || 0,
                    t: panel.position.top || 0
                };
                panel.setPosition(panel.position);
                panel.panelManager.normalizePanel(panel);
                // console.log('onOpen');
                insertarServiciosCE();
            },
            onMapClick: function (event) {
                console.log(" estoy en onMapClick");
                this.map.infoWindow.hide();
            },
            bindEvents: function() {

                console.log("bindEvents")

            },
            onExecute: function(featureSet) {
                //console.log("onExecute")
            },
            onClose: function () {
                this.map.setInfoWindowOnClick(true); 
                console.log('onClose');
                borrarFeatureCargados();
                map.graphics.clear();
                map.setExtent(map._initialExtent);
                var panelCerrarCe = this.getPanel();
                panelCerrarCe.position.width = 300;
                panelCerrarCe.position.height = 300;
                panelCerrarCe._originalBox = {
                    w: panelCerrarCe.position.width,
                    h: panelCerrarCe.position.height,
                    l: panelCerrarCe.position.left || 0,
                    t: panelCerrarCe.position.top || 0
                };
                //panelCerrarCe.setPosition(panelCerrarCe.position);
                //panelCerrarCe.panelManager.normalizePanel(panelCerrarCe);

               // ajustarPanelCE(width, height);
            },

            // onMinimize: function(){
            //   console.log('onMinimize');
            // },

            // onMaximize: function(){
            //   console.log('onMaximize');
            // },

            // onSignIn: function(credential){
            //   /* jshint unused:false*/
            //   console.log('onSignIn');
            // },

            // onSignOut: function(){
            //   console.log('onSignOut');
            // }

            // onPositionChange: function(){
            //   console.log('onPositionChange');
            // },

            // resize: function(){
            //   console.log('resize');
            // }



            

            //methods to communication between widgets:
        });

        function borrarFeatureCargados() {
            for (var i in featureCargados) {
                map.removeLayer(featureCargados[i]);
            }
            idFeatureCargado = 0;
            featureCargados.length = 0;
            map.graphics.clear();
        }
        function dibujarCE(evtObj) {
            this.map.infoWindow.hide();
            if (selCapasCE.value != "Seleccione..." && selCapasCE.value != "" && selCapasCE.value.length != 0) {
                var loc = evtObj.geometry;
                map.graphics.clear();
                toolbar.deactivate();
                var geometry = evtObj.geometry;
                console.log(geometry.getExtent());
                console.log(evtObj);
                var symbol;
                switch (geometry.type) {
                    case "polyline":
                        symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
                        break;
                    case "extent":
                        symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
                        break;
                }
                var graphic = new Graphic(geometry, symbol);

                consultarPoligonos();
                function consultarPoligonos() {
                    var featureLayer = new FeatureLayer(capaUrl, { outFields: ["*"] });
                    var query = new Query();
                    query.geometry = geometry.getExtent();
                    query.outFields = ["*"];
                    featureLayer.queryFeatures(query, pintarPoligonosConsulta);
                }

                function pintarPoligonosConsulta(response) {
 
                    var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255, 0, 0, 1]), 3), new Color([255, 128, 0, 0.15]));
                    for (var i in response.features) {
                        var geometria = response.features[i].geometry;
                        var graphic = new Graphic(geometria, symbol);
                        graphic.id = response.features[i].attributes.OBJECTID;
                        map.graphics.add(graphic);
                      
                    }
                    mostrarTablaConsultaEspacial(response);
                }
                function mostrarTablaConsultaEspacial(featureSet) {

                    if (featureSet.features.length <= 0) {

                        var titulo = "<B> Informaci&oacute;n </B>";
                        var contenido = "No se encontraron resultados";
                    
                        createDialogInformacionGeneral(titulo, contenido);
                    } else {


                        resultadosQueryCE = featureSet.features;

                        var result = [];
                        for (var i = 0, il = featureSet.features.length; i < il; i++) {
                            result.push(featureSet.features[i].attributes);
                        }
                        ResultadosJson = JSON.stringify(result);
                        document.getElementById("divTablaCE").style.display = 'block';
                        document.getElementById("divTablaConsultaEspacial").style.display = 'block';

                        document.getElementById("divFormularioCE").style.display = 'none';
                        document.getElementById("idDibujar").style.display = 'none';



                        var colorFeature = [255.0, 0, 0.0, 1];
                        for (var i in featureSet.features) {

                            dibujarFeatures([featureSet.features[i]], colorFeature);
                            break;

                        }

                        require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                                function (lang, DataGrid, ItemFileWriteStore, dom) {


                                    var width = 650;
                                    var height = 300;
                                    //ajustarPanelCatastral(width, height);
                                    ajustarPanelCE(width, height);
                                    var data_list_ConsultaE = [];
                                    var data_CE = {
                                        identifier: "id",
                                        items: []
                                    };
                                    var layout = [], fields = [];
                                    layout[0] = [];

                                    for (var i = 0; i < featureSet.fields.length; i++) {
                                        //if (!featureSet.fields[i].name == "IMAGEN") {
                                        fields[i] = featureSet.fields[i].name;
                                        //} else {

                                        //}
                                    }
                                    for (var i in featureSet.features) {
                                        data_list_ConsultaE[i] = {};
                                        for (var a in fields) {
                                            data_list_ConsultaE[i][fields[a]] = featureSet.features[i].attributes[fields[a]];
                                        }
                                    }
                                    var width = 0;
                                    for (var a in fields) {
                                        layout[0][a] = {};
                                        layout[0][a].name = fields[a];
                                        layout[0][a].field = fields[a];
                                        layout[0][a].width = fields[a].length;
                                        width += layout[0][a].width;
                                    }
                                    width *= 10.8;
                                    var height = 350;
                                    if (data_list_ConsultaE.length < 10) {
                                        height = 250;
                                    }


                                    var rows = data_list_ConsultaE.length;
                                    for (var i = 0, l = data_list_ConsultaE.length; i < rows; i++) {
                                        data_CE.items.push(lang.mixin({ id: i + 1 }, data_list_ConsultaE[i % l]));
                                    }

                                    console.log(data_CE);
                                    var store = new ItemFileWriteStore({ data: data_CE });

                                    if (dijit.byId("gridConsultaEspacial") != undefined) {
                                        dijit.byId("gridConsultaEspacial").destroy();
                                    }

                                    var grid = new DataGrid({
                                        id: 'gridConsultaEspacial',
                                        store: store,
                                        structure: layout,
                                        rowSelector: '10px',
                                        style: "width: 560px;",
                                        selectionMode: 'single',
                                        canSort: function (col) {
                                            return false;
                                        }
                                    });


                                    grid.placeAt("divTablaConsultaEspacial");

                                    grid.startup();
                                    grid.set('autoHeight', false);
                                    grid.set('autoWidth', true);
                                    grid.update();
                                    grid.set('autoWidth', false);
                                    grid.on("RowClick", function (evt) {
                                        selectedRowGrid(evt);
                                    }, true);


                                });


                    }


                }

                function dibujarFeatures(features, color) {
                    var colorFeature;
                    if (color == undefined) {
                        colorFeature = [255, 0, 0, 1];
                    } else {
                        colorFeature = color;
                    }



                    if (features[0].geometry.type == "point") {
                        for (var i in features) {
                            loc = new Point(features[i].geometry.x, features[i].geometry.y, appGlobal.map.spatialReference);
                            dibujarPunto(loc, features[i].attributes);
                            if (features.length == 1) {
                                var newZoom = 2000;
                                appGlobal.map.setScale(newZoom);
                                appGlobal.map.centerAt(loc);
                            }
                        }
                    } else {
                        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color(colorFeature), 3), new Color([255, 128, 0, 0.15]));
                        for (var i in features) {
                            var geometria = features[i].geometry;
                            var infoTemplate = new InfoTemplate(features[i].attributes);
                            var graphic = new Graphic(geometria, symbol, infoTemplate);
                            graphic.id = features[i].attributes.OBJECTID;
                            appGlobal.map.graphics.add(graphic);
                        }
                        if (features.length == 1) {
                            appGlobal.map.setExtent(features[0].geometry.getExtent());
                        }
                    }

                }
                function dibujarPunto(loc, attr) {
                    var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));
                    var infoTemplate = new InfoTemplate();
                    var newPunto = new Graphic(loc, symbol, attr, infoTemplate);
                    appGlobal.map.graphics.add(newPunto);
                }
                function selectedRowGrid(seleccionado) {
                    var colorFeature = [51, 255, 227, 1];
                    var rowSelected = dijit.byId('gridConsultaEspacial').selection.getSelected()[0].OBJECTID[0];
                    var resultQuery = resultadosQueryCE;
                    for (var i in resultQuery) {
                        if (resultQuery[i].attributes.OBJECTID == rowSelected) {
                            dibujarFeatures([resultQuery[i]], colorFeature);
                            break;
                        }
                    }
                }

            } else {
                var titulo = "<B> Informaci&oacute;n </B>";
                var contenido = "Por favor selecciona una capa ";
                toolbar.deactivate();
                createDialogInformacionCE(titulo, contenido);
            }
            this.map.infoWindow.hide();
       }
    });



function insertarServiciosCE() {
    var servicios = [[SERVICIO_CARTOGRAFIA_BASICA, "CARTOGRAF\xCDA B\xC1SICA"], [SERVICIO_AMBIENTAL, "AMBIENTAL"], [SERVICIO_EDUCACION, "EDUCACI\xD3N"], [SERVICIO_GENERAL_SALUD, "SALUD"], [SERVICIO_CULTURA_TURISMO, "CULTURA Y TURISMO"], [SERVICIO_ORDENAMIENTO_TERRITORIAL, "ORDENAMIENTO TERRITORIAL"], [SERVICIO_INDUSTRIA_COMERCIO, "INDUSTRIA Y COMERCIO"], [SERVICIO_RIESGO_CONSULTA, "GESTI\xD3N DEL RIESGO"]];

    selServicioCE.options.length = 0;
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    selServicioCE.options.add(optsel);
    for (var i = 0; i < servicios.length; i++) {

        var opt = document.createElement('option');
        opt.value = servicios[i][0];
        opt.text = servicios[i][1];
        selServicioCE.options.add(opt);
    }

}

function selCapasCE_selectedChanged() {

appGlobal.map.graphics.clear();
for (var i in featureCargados) {
    appGlobal.map.removeLayer(featureCargados[i]);
}
idFeatureCargado = 0;
featureCargados.length = 0;

var capaCompleta = "";
capaCompleta = selServicioCE.value + "/" + selCapasCE.value;
capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
capaUrl = capaCompleta;
console.log(capaCompleta);

require([
"esri/map",
"esri/layers/FeatureLayer",
"dojo/domReady!"
],
    function (Map,FeatureLayer) {

    
        if (selCapasCE.value != "Seleccione...") { 
            var featureLayer = new FeatureLayer(capaCompleta);
            appGlobal.map.addLayer(featureLayer);
            featureCargados[idFeatureCargado] = featureLayer;
            idFeatureCargado++;
            obtenerfields();
            
        }

        
    });

}


function obtenerfields() {

    require([
        "esri/map",
        "dojo/dom", "dojo/on",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/LayerInfo",
        "dojo/_base/array",
        "dojo/_base/array",
        "esri/tasks/query", "esri/tasks/QueryTask",
        "dojo/_base/json",
        "dojo/string",
        "esri/request",
        "jimu/PanelManager",
        "esri/tasks/GeometryService",
         "esri/tasks/ProjectParameters",
         "esri/geometry/Extent",
         "esri/SpatialReference",
        "dojo/domReady!"
    ], function (Map, dom, on,
        ArcGISDynamicMapServiceLayer, LayerInfo, arrayUtils, array, Query, QueryTask, dojoJson, dojoString, esriRequest, PanelManager, GeometryService, ProjectParameters, Extent, SpatialReference) {
        var losFields = [];
        var requestHandle = esriRequest({
            "url": capaUrl,
            "content": {
                "f": "json"
            },
            "callbackParamName": "callback",
        });
        requestHandle.then(requestSucceeded);
        function requestSucceeded(response, io) {
            var fieldInfo, pad;
            pad = dojoString.pad;
            dojoJson.toJsonIndentStr = "  ";
            if (response.hasOwnProperty("fields")) {
                fieldInfo = array.map(response.fields, function (f) {

                    return pad(f.alias, 20, " ", true);
                });
                losFields = fieldInfo;
                var todo = [];
                for (var i = 0; i < losFields.length.toString() ; i++) {
                    var field = [];
                    field = losFields[i].replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    

                    todo.push(field);
                     
                }

            }

            fieldsCapa = "";
            fieldsCapa = todo;

            if (response.extent != null) {
                console.log(response.extent);
                ajustarExtend(response.extent);
            
            }
            console.log(fieldsCapa);

        }

        function ajustarExtend(response) {
            var spatialRef = new SpatialReference({ wkid: 102100 });

            if (response != null && response.spatialReference.wkid != 102100) {

                var extent = response;


                var spatialRef1 = new SpatialReference(3115);
                gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
                var extentconver = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, spatialRef);


                var extent2 = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, spatialRef1);
                gsvc.project([extent2], spatialRef, function (projectedPoints) {
                    pt = projectedPoints[0];
                    extentconver = new Extent(pt.xmin, pt.ymin, pt.xmax, pt.ymax, spatialRef);
                    map.setExtent(extentconver);
                    extentCapaSelecionada = extentconver;
                });


            } else {
                response.expand(15);
                response.getCenter().x = loc.x;
                response.getCenter().y = loc.y;
                map.setExtent(response);
                extentCapaSelecionada = response;
            }
        }


    });
}


function selServicioCE_selectedChanged(selServicioCE) {
   
    var servicioSeleccionado = selServicioCE.value;
    selCapasCE.options.length = 0;
    selGruposCE.options.length = 0;
    urlSelCE = selServicioCE.value;
    require([
        "esri/map",
        "dojo/dom", "dojo/on",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/LayerInfo",
        "dojo/_base/array",
        "esri/tasks/query", "esri/tasks/QueryTask",
        "dojo/_base/json",
        "esri/request",
        "jimu/PanelManager",
         
        "dojo/domReady!"
    ], function(Map, dom, on,
        ArcGISDynamicMapServiceLayer, LayerInfo, arrayUtils, Query, QueryTask, dojoJson, esriRequest, PanelManager) {
        var infoCapasCE = "";
        var lasCapasCE = "";
      
        showLoader();

        var requestHandle = esriRequest({
            "url": urlSelCE,
            "content": {
                "f": "json"
            },
            "callbackParamName": "callback",
        });

        requestHandle.then(requestSucceeded);
        function requestSucceeded(response, io) {
            var jsonEjemplo;
            if (response.hasOwnProperty("layers")) {
                console.log("tiene layers");
                var layerInfo = [];
                var padCE;
                padCE = dojo.string.pad;
                layerInfoCE = dojo.map(response.layers, function(f) {
                    return padCE(f.id, 2, " ", true) + "/" + padCE(f.name, 8, " ", true) + "/" + padCE(f.subLayerIds, 25, " ", true);
                });
              
                lasCapasCE = layerInfoCE;
                var todoCE = [];
                for (var i = 0; i < lasCapasCE.length.toString(); i++) {
                    var capaCE = [];
                    capaCE = lasCapasCE[i].split("/");
                    todoCE.push(capaCE);
                }
               
                todosGruposCE = todoCE;
                var gruposCE = [];
                var tieneGruposCE = "false";
                for (var i = 0; i < todoCE.length.toString(); i++) {
                    if (todoCE[i][2] != "null                     ") {
                        gruposCE.push(todoCE[i]);
                        tieneGruposCE = "true";
                    }
                }
                if (tieneGruposCE != "true") {
                  
                    insertarCapasSinGruposCE(todoCE);
                } else {
                    
                    insetarGruposCE(gruposCE);
                }
            } else {

                console.log("Algo pasa");
            }
            
       
            hideLoader();
        }
     

    });
}

function insetarGruposCE(grupos) {

    selGruposCE.options.length = 0;
    document.getElementById("grupoLabelCE").style.display = 'inline';
    document.getElementById("selGruposCE").style.display = 'inline';
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    selGruposCE.options.add(optsel);
    for (var i = 0; i < grupos.length; i++) {

        var opt = document.createElement('option');
        opt.value = grupos[i][0];
        opt.text = grupos[i][1];
        selGruposCE.options.add(opt);
    }
}

function insertarCapasSinGruposCE(todo) {

    selCapasCE.options.length = 0;
    document.getElementById("grupoLabelCE").style.display = 'none';
    document.getElementById("selGruposCE").style.display = 'none';
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    selCapasCE.options.add(optsel);
    for (var i = 0; i < todo.length; i++) {

        var opt = document.createElement('option');
        opt.value = todo[i][0];
        opt.text = todo[i][1];
        selCapasCE.options.add(opt);
    }

}

function selGruposCE_selectedChanged() {

    var grupoSeleccionado = selGruposCE.value;
    selCapasCE.options.length = 0;
    var urlCapa = selServicioCE.value + "/" + grupoSeleccionado;
    consultarCapas(urlCapa);

}

function consultarCapas(urlCapa) {

    var grupoSeleccionado = selGruposCE.value;;
    require([
        "esri/map",
        "dojo/dom", "dojo/on",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/LayerInfo",
        "dojo/_base/array",
        "esri/tasks/query", "esri/tasks/QueryTask",
        "dojo/_base/json",
        "esri/request",
        "jimu/PanelManager",
        "dojo/domReady!"
    ], function(Map, dom, on,
        ArcGISDynamicMapServiceLayer, LayerInfo, arrayUtils, Query, QueryTask, dojoJson, esriRequest, PanelManager) {
        var capas = "";
        for (var i = 0; i < todosGruposCE.length; i++) {
            if (todosGruposCE[i][0] == grupoSeleccionado.toString()) {

                capas = todosGruposCE[i][2];
            }
        }

        var capasCompleta = [];
        capasCompleta = capas.split(",");
        var idCapasCompleta;
        var idTodosGrupos;
        var capasDelGrupo = [];
        for (var i = 0; i < capasCompleta.length; i++) {
            idCapasCompleta = capasCompleta[i].replace(/\D/g, '');
            for (var j = 0; j < todosGruposCE.length; j++) {
                idTodosGrupos = todosGruposCE[j][0].replace(/\D/g, '');
                if (idCapasCompleta == idTodosGrupos) {
                    capasDelGrupo.push(todosGruposCE[j]);
                }
            }

        }
        insertarCapas(capasDelGrupo);
       

    });

}
function insertarCapas(todo) {
    selCapasCE.options.length = 0;
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    selCapasCE.options.add(optsel);
    for (var i = 0; i < todo.length; i++) {

        var opt = document.createElement('option');
        opt.value = todo[i][0];
        opt.text = todo[i][1];
        selCapasCE.options.add(opt);
    }

}
/**
*Metodo que muestra un dialogo informativo 
*@param {cadena} titulo
*@param {cadena} contenido
**/
function createDialogInformacionCE(titulo, contenido) {
    require(["dijit/Dialog", "dojo/domReady!"], function (Dialog) {
        myDialogOT = new Dialog({
            title: titulo,
            content: contenido
            // style: "width: 400px"
        });

        myDialogOT.show();
    });

}
function ajustarPanelCE(width, height) {

    require(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
    "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
    "esri/layers/FeatureLayer", "dojo/domReady!"],
        function (declare, BaseWidget, DataSourceManager,
        Query, QueryTask, SpatialReference, FeatureLayer) {


            var panelConsultaEspacial = appGlobal.getPanel();
            panelConsultaEspacial.position.width = width;
            panelConsultaEspacial.position.height = height;
            panelConsultaEspacial._originalBox = {
                w: panelConsultaEspacial.position.width,
                h: panelConsultaEspacial.position.height,
                l: panelConsultaEspacial.position.left || 0,
                t: panelConsultaEspacial.position.top || 0
            };
            // panel.setPosition(panel.position);
            panelConsultaEspacial.panelManager.normalizePanel(panelConsultaEspacial);




        });

}
function mostrarResultados(aplicacion) {
    appGlobal = aplicacion;

    extentInicial = null;
    extentInicial = appGlobal.map.extent;
}
function ExportarCsvConsultaE() {
    //ResultadosJson
    var ReportTitle = "Resultados";
    var ShowLabel = true;
    if (ResultadosJson != undefined) {
        //JSONData = "["+ JSONData +"]";
        var arrData = typeof ResultadosJson != 'object' ? JSON.parse(ResultadosJson) : ResultadosJson;
        if (arrData[0] == undefined) {
            ResultadosJson = "[" + ResultadosJson + "]";
            arrData = typeof ResultadosJson != 'object' ? JSON.parse(ResultadosJson) : ResultadosJson;
        }
        var CSV = '';

        CSV += ReportTitle + '\r\n\n';

        if (ShowLabel) {
            var row = "";
            for (var index in arrData[0]) {

                row += index + ',';

            }

            row = row.slice(0, -1);
            CSV += row + '\r\n';
        }

        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            for (var index in arrData[i]) {

                row += '"' + arrData[i][index] + '",';

            }

            row.slice(0, row.length - 1);

            CSV += row + '\r\n';
        }


        if (CSV == '') {
            alert("Invalid data");
            return;
        }
        var fileName = "Reporte_";
        fileName += ReportTitle.replace(/ /g, "_");
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        var link = document.createElement("a");
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } else {

        alert("No  hay elementos")
    }

}
function volverParametrosConsultaE() {
    var width = 300;
    var height = 300;


    ajustarPanelCE(width, height)
    document.getElementById("divTablaCE").style.display = 'none';
    document.getElementById("divTablaConsultaEspacial").style.display = 'none';

    document.getElementById("divFormularioCE").style.display = 'block';
    document.getElementById("idDibujar").style.display = 'block';



}
   