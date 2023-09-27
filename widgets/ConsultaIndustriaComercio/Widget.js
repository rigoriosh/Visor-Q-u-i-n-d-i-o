var urlSel = "no tengo nada";
var capaUrl = "";
var todosGrupos = [];
var fieldsCapa = [];
var appGlobal;
var theLayer;
var imagenes
var resultadosQueryIc;
var resultadosMandar
var extentInicial;
var jsonResultados;
var informacionImagen;
var capaIndustria = SERVICIO_INDUSTRIA_COMERCIO;
var capaGeneral = "";
var panelConsultaIndustriaComercio;

define(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
        "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
        "esri/layers/FeatureLayer", "jimu/PanelManager", "dojo/domReady!"
    ],
    function(declare, BaseWidget, DataSourceManager,
        Query, QueryTask, SpatialReference, FeatureLayer, PanelManager) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here

            //baseClass: 'jimu-widget-mywidget',

            // postCreate: function() {
            //   this.inherited(arguments);
            //console.log('postCreate');

            //},

            startup: function() {


                $('#widgets_ConsultaIndustriaComercio_Widget_90_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza consulta industria y comercio con par&aacute;metros de entrada"></div>');

                //  this.inherited(arguments);
                //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
                //console.log('startup');
                llenarConsultaPor();

                mostrarResultados(this);
            },

            onOpen: function() {
                // console.log('onOpen');
                llenarConsultaPor();
                document.getElementById("divResultadosConsultaIndustriaC").style.display = 'none';
                document.getElementById("divTablaIndustriaC").style.display = 'none';
                document.getElementById("btnImagen").style.display = 'none';
                document.getElementById("divOpcionesIndustriaComercio").style.display = 'block';
                panelConsultaIndustriaComercio = this.getPanel();
                panelConsultaIndustriaComercio.position.width = 410;
                panelConsultaIndustriaComercio.position.height = 280;
                panelConsultaIndustriaComercio._originalBox = {
                    w: panelConsultaIndustriaComercio.position.width,
                    h: panelConsultaIndustriaComercio.position.height,
                    l: panelConsultaIndustriaComercio.position.left || 0,
                    t: panelConsultaIndustriaComercio.position.top || 0
                };
                panelConsultaIndustriaComercio.setPosition(panelConsultaIndustriaComercio.position);
                panelConsultaIndustriaComercio.panelManager.normalizePanel(panelConsultaIndustriaComercio);

                LimpiarIc()
                document.getElementById("labelNombre").style.display = 'none';
                document.getElementById("selNombreIC").style.display = 'none';


                appGlobal.map.graphics.clear();
            },
            bindEvents: function() {

                // console.log("bindEvents")

            },
            onExecute: function(featureSet) {
                //console.log("onExecute")
            },
            onClose: function() {
                console.log('onClose');
                appGlobal.map.graphics.clear();
                map.setExtent(map._initialExtent);
                //cerrarWidgetResultados();
            },
            /* 
                 onMinimize: function(){
                   console.log('onMinimize');
                 },

                 onMaximize: function(){
                   console.log('onMaximize');
                 },

                 onSignIn: function(credential){
                   //jshint unused:false
                   console.log('onSignIn');
                 },

                 onSignOut: function(){
                   console.log('onSignOut');
                 }

                 onPositionChange: function(){
                   console.log('onPositionChange');
                 },

                 resize: function(){
                   console.log('resize');
                 }

                methods to communication between widgets:
                 */
        });
    });

function llenarConsultaPor() {
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
        var infoCapas = "";
        var lasCapas = "";
        var layer = new ArcGISDynamicMapServiceLayer(
            capaIndustria, {
                useMapImage: false
            }
        );
        showLoader();
        var requestHandle = esriRequest({
            "url": capaIndustria,
            "content": {
                "f": "json"
            },
            "callbackParamName": "callback",
        });

        requestHandle.then(requestSucceeded);

        function requestSucceeded(response, io) {
            var jsonEjemplo;
            if (response.hasOwnProperty("layers")) {

                var layerInfo = [];
                var pad;
                pad = dojo.string.pad;
                layerInfo = dojo.map(response.layers, function(f) {
                    return pad(f.id, 2, " ", true) + "/" + pad(f.name, 8, " ", true) + "/" + pad(f.subLayerIds, 25, " ", true);
                });
                lasCapas = layerInfo;
                var todo = [];
                for (var i = 0; i < lasCapas.length.toString(); i++) {
                    var capa = [];
                    capa = lasCapas[i].split("/");
                    todo.push(capa);
                }

                todosGrupos = todo;

                insertarGeneral(selConsultaIC, todo);
            }
            hideLoader();
        }

        // cerrarWidgetResultados();
    });

}

function selectedCheckBox(id) {

    if (document.getElementById("cbox1").checked) {


        document.getElementById("labelNombre").style.display = 'block';
        document.getElementById("selNombreIC").style.display = 'block';

    } else {

        document.getElementById("labelNombre").style.display = 'none';
        document.getElementById("selNombreIC").style.display = 'none';
    }
}

function consultaPor_selectedChanged(selConsultaIC) {
    var consultaSeleccionada = selConsultaIC.value;
    if (consultaSeleccionada != "Seleccione...") {
        var municipios = [
            ["63690", "Salento"],
            ["63272", "Filandia"],
            ["63190", "Circasia"],
            ["63594", "Quimbaya"],
            ["63001", "Armenia"],
            ["63111", "Buenavista"],
            ["63212", "Córdoba"],
            ["63548", "Pijao"],
            ["63302", "Génova"],
            ["63401", "La Tebaida"],
            ["63470", "Montenegro"],
            ["63130", "Calarcá"]
        ];
        var capaCompleta = capaIndustria + "/" + consultaSeleccionada;
        capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
        capaGeneral = capaCompleta;

        require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/layers/FeatureLayer", "dojo/dom",
                "dojo/on", "dojo/domReady!"
            ],
            function(Query, QueryTask, SpatialReference, FeatureLayer, dom, on) {
                showLoader();
                if (consultaSeleccionada != null) {
                    var valores = [];
                    var queryTask = new QueryTask(capaCompleta);
                    var query = new Query();
                    query.outFields = ["IDMUNICIPIO"];
                    query.where = "1=1";
                    query.returnGeometry = false;

                    queryTask.execute(query, monstrarConsulta);

                    function monstrarConsulta(featureSet) {

                        var resultFeatures = featureSet.features;
                        if (resultFeatures != undefined) {

                            for (var i = 0; i < resultFeatures.length; i++) {
                                valores.push(resultFeatures[i].attributes);
                            }
                            var SinDuplicados = depurarRsultado(valores);

                            var municipiosAgregar = [];
                            if (valores.length > 0) {
                                for (var l = 0; l < SinDuplicados.length; l++) {
                                    for (var a = 0; a < municipios.length; a++) {
                                        if (SinDuplicados[l].replace(/['"]+/g, '') == municipios[a][0]) {
                                            municipiosAgregar.push(municipios[a]);
                                        }
                                    }
                                }
                                insertarGeneral(selMunicipioIC, municipiosAgregar);
                                hideLoader();
                            } else {
                                hideLoader();
                                createDialogInformacionGeneral("<B> Resultados </B>", "No  hay elementos");
                            }
                        } else {
                            console.log(capaUrl);
                        }
                    }
                }
            });

        obtenerfields();
    }
}

function depurarRsultado(valores) {

    console.log(valores);
    var resultadosJson = JSON.stringify(valores);
    if (valores.length > 1) {
        var resultado = resultadosJson.split(",");
        var valor;
        var valorsolo;
        var valoresCompleto = [];
        for (var j = 0; j < resultado.length; j++) {
            valor = resultado[j].split(":");
            if (valor.length > 1) {
                valorsolo = valor[1].split("}");
            } else {
                valorsolo = valor[0].split("}");
                valorsolo = valorsolo.replace(/['"]+/g, '');
            }
            valoresCompleto.push(valorsolo[0]);
        }
        valoresCompleto.sort(comparar);
        var SinDuplicados = [];
        var SinDuplicados = valoresCompleto.filter(function(elem, pos) {
            return valoresCompleto.indexOf(elem) == pos;
        });

        return SinDuplicados;
    }
}

function comparar(a, b) {
    return a - b;
}

function tipoEstablecimiento_selectedChanged() {

    var tipoEstablecimiento = selTipoIC.value;
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/layers/FeatureLayer", "dojo/dom",
            "dojo/on", "dojo/domReady!"
        ],
        function(Query, QueryTask, SpatialReference, FeatureLayer, dom, on) {
            showLoader();
            if (tipoEstablecimiento != null) {
                var valores = [];
                var queryTask = new QueryTask(capaGeneral);
                var query = new Query();
                query.outFields = ["NOMBRE"];

                query.where = "IDMUNICIPIO = '" + selMunicipioIC.value + "' AND TIPOESTABLECIMIENTO = '" + selTipoIC.value + "'";
                query.returnGeometry = false;
                queryTask.execute(query, monstrarConsulta);

                function monstrarConsulta(featureSet) {

                    var resultFeatures = featureSet.features;
                    if (resultFeatures != undefined) {
                        for (var i = 0; i < resultFeatures.length; i++) {
                            valores.push(resultFeatures[i].attributes);
                        }
                        var SinDuplicados = depurarRsultado(valores);
                        insertar(selNombreIC, SinDuplicados);
                        hideLoader();

                    } else {
                        console.log(capaUrl);
                    }
                }
            }
        });

}

function municipios_selectedChanged(selMunicipioIC) {
    var municipio = selMunicipioIC.value;
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/layers/FeatureLayer", "dojo/dom",
            "dojo/on", "dojo/domReady!"
        ],
        function(Query, QueryTask, SpatialReference, FeatureLayer, dom, on) {
            showLoader();
            if (municipio != null) {
                var valores = [];
                var queryTask = new QueryTask(capaGeneral);
                var query = new Query();
                query.outFields = ["TIPOESTABLECIMIENTO"];

                query.where = "IDMUNICIPIO = " + selMunicipioIC.value;
                query.returnGeometry = false;
                queryTask.execute(query, monstrarConsulta);

                function monstrarConsulta(featureSet) {

                    var resultFeatures = featureSet.features;
                    if (resultFeatures != undefined) {
                        for (var i = 0; i < resultFeatures.length; i++) {
                            valores.push(resultFeatures[i].attributes);
                        }
                        var SinDuplicados = depurarRsultado(valores);
                        insertar(selTipoIC, SinDuplicados);
                        hideLoader();

                    } else {
                        console.log(capaUrl);
                    }
                }
            }
        });
}

function insertarGeneral(select, arreglo) {

    select.options.length = 0;
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    select.options.add(optsel);
    for (var i = 0; i < arreglo.length; i++) {

        var opt = document.createElement('option');
        opt.value = arreglo[i][0];
        opt.text = arreglo[i][1];
        select.options.add(opt);
    }

}

function insertar(select, arreglo) {

    select.options.length = 0;
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    select.options.add(optsel);
    for (var i = 0; i < arreglo.length; i++) {

        var opt = document.createElement('option');
        opt.value = arreglo[i].replace(/['"]+/g, '');
        opt.text = arreglo[i].replace(/['"]+/g, '');
        select.options.add(opt);
    }

}

function consultaIndustriaComercio() {
    var sWhere = "";
    if (document.getElementById("cbox1").checked) {

        console.log(selNombreIC.value);
        if (selNombreIC.value != null && selNombreIC.value != "Seleccione...") {
            sWhere = "IDMUNICIPIO = '" + selMunicipioIC.value + "' AND TIPOESTABLECIMIENTO = '" + selTipoIC.value + "' AND NOMBRE = '" + selNombreIC.value + "'";
            consultar(sWhere);
        } else {
            createDialogInformacion();
        }
    } else {
        sWhere = "IDMUNICIPIO = '" + selMunicipioIC.value + "' AND TIPOESTABLECIMIENTO = '" + selTipoIC.value + "'";
        consultar(sWhere);
    }


}

function consultar(sWhere) {
    appGlobal.map.graphics.clear();
    require(["esri/tasks/query",
            "esri/tasks/QueryTask",
            "esri/SpatialReference",
            "esri/layers/FeatureLayer",
            "esri/dijit/FeatureTable",
            "esri/geometry/Extent",
            "esri/tasks/GeometryService",
            "esri/tasks/ProjectParameters",
            "dojo/dom",
            "dojo/on",
            "dojo/_base/lang",
            'jimu/BaseWidget',
            "jimu/LayerInfos/LayerInfos",
            "jimu/PanelManager",
            'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore',
            "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/InfoTemplate", "esri/graphic",
            "dojo/domReady!"
        ],
        function(Query,
            QueryTask,
            SpatialReference,
            FeatureLayer,
            FeatureTable,
            Extent,
            GeometryService,
            ProjectParameters,
            dom,
            on,
            lang,
            BaseWidget,
            LayerInfos,
            PanelManager,
            DataGrid,
            ItemFileWriteStore,
            Point, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
            Color, InfoTemplate, Graphic) {



            if (selMunicipioIC.value != null && selMunicipioIC.value != "Seleccione..." && selTipoIC.value != null && selTipoIC.value != "Seleccione..." &&
                selConsultaIC.value != null && selConsultaIC.value != "Seleccione...") {

                cerrarWidgetResultados();
                var query = new Query();
                var queryTask = new QueryTask(capaGeneral);
                query.returnGeometry = true;
                query.outFields = [fieldsCapa];
                queryprueba = query;
                query.where = sWhere;
                console.log(sWhere);
                queryTask.execute(query, mostrarTablaindustriaComercio);


                function mostrarTablaindustriaComercio(featureSet) {

                    if (featureSet.features.length <= 0) {

                        var titulo = "<B> Informaci&oacute;n </B>";
                        var contenido = "No se encontraron resultados";
                        console.log("No se encontraron resultados");
                        //createDialogInformacionConsultaSimple(titulo, contenido);
                    } else {


                        resultadosQueryIc = featureSet.features;

                        var result = [];
                        for (var i = 0, il = featureSet.features.length; i < il; i++) {
                            result.push(featureSet.features[i].attributes);
                        }
                        ResultadosJson = JSON.stringify(result);
                        document.getElementById("divResultadosConsultaIndustriaC").style.display = 'block';
                        document.getElementById("divTablaIndustriaC").style.display = 'block';
                        document.getElementById("btnImagen").style.display = 'none';
                        document.getElementById("divOpcionesIndustriaComercio").style.display = 'none';
                        //document.getElementById("divTablaIndustriaC").style.display = 'none';



                        var colorFeature = [255.0, 0, 0.0, 1];
                        for (var i in featureSet.features) {


                            dibujarFeatures([featureSet.features[i]], colorFeature);
                            break;

                        }

                        require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                            function(lang, DataGrid, ItemFileWriteStore, dom) {


                                var width = 650;
                                var height = 300;
                                //ajustarPanelCatastral(width, height);
                                ajustarPanelIC(width, height);
                                var data_list_ConsultaIC = [];
                                var data_IC = {
                                    identifier: "id",
                                    items: []
                                };
                                var layout = [],
                                    fields = [];
                                layout[0] = [];

                                for (var i = 0; i < featureSet.fields.length; i++) {


                                    //if (!featureSet.fields[i].name == "IMAGEN") {
                                    fields[i] = featureSet.fields[i].name;
                                    //} else {

                                    //}
                                }
                                for (var i in featureSet.features) {
                                    data_list_ConsultaIC[i] = {};
                                    for (var a in fields) {
                                        data_list_ConsultaIC[i][fields[a]] = featureSet.features[i].attributes[fields[a]];
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
                                if (data_list_ConsultaIC.length < 10) {
                                    height = 250;
                                }


                                var rows = data_list_ConsultaIC.length;
                                for (var i = 0, l = data_list_ConsultaIC.length; i < rows; i++) {
                                    data_IC.items.push(lang.mixin({ id: i + 1 }, data_list_ConsultaIC[i % l]));
                                }

                                console.log(data_IC);
                                var store = new ItemFileWriteStore({ data: data_IC });

                                if (dijit.byId("gridConsultaIC") != undefined) {
                                    dijit.byId("gridConsultaIC").destroy();
                                }

                                var grid = new DataGrid({
                                    id: 'gridConsultaIC',
                                    store: store,
                                    structure: layout,
                                    rowSelector: '10px',
                                    style: "width: 560px;",
                                    selectionMode: 'single',
                                    canSort: function(col) {
                                        return false;
                                    }
                                });


                                grid.placeAt("divTablaIndustriaC");

                                grid.startup();
                                grid.set('autoHeight', false);
                                grid.set('autoWidth', true);
                                grid.update();
                                grid.set('autoWidth', false);
                                grid.on("RowClick", function(evt) {
                                    selectedRowGrid(evt);
                                }, true);


                            });


                    }


                }

                function selectedRowGrid(seleccionado) {
                    var colorFeature = [51, 255, 227, 1];
                    var rowSelected = dijit.byId('gridConsultaIC').selection.getSelected()[0].OBJECTID[0];
                    var resultQuery = resultadosQueryIc;
                    for (var i in resultQuery) {
                        if (resultQuery[i].attributes.OBJECTID == rowSelected) {
                            console.log(resultQuery[i].attributes.IMAGEN);
                            informacionImagen = URL_ARCHIVOS_QUINDIO + resultQuery[i].attributes.IMAGEN;
                            console.log(informacionImagen);
                            if (resultQuery[i].attributes.IMAGEN != null) {
                                document.getElementById("btnImagen").style.display = 'inline';
                            }


                            dibujarFeatures([resultQuery[i]], colorFeature);
                            break;
                        }
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





            } else {

                createDialogInformacion();
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
        "dojo/domReady!"
    ], function(Map, dom, on,
        ArcGISDynamicMapServiceLayer, LayerInfo, arrayUtils, array, Query, QueryTask, dojoJson, dojoString, esriRequest, PanelManager) {
        var losFields = [];
        var requestHandle = esriRequest({
            "url": capaGeneral,
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
                fieldInfo = array.map(response.fields, function(f) {

                    return pad(f.alias, 20, " ", true);
                });
                losFields = fieldInfo;
                var todo = [];
                for (var i = 0; i < losFields.length.toString(); i++) {
                    var field = [];
                    field = losFields[i].replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    //if (field != "IMAGEN") {

                    todo.push(field);
                    //  } 
                }

            }

            fieldsCapa = "";
            fieldsCapa = todo;
        }


    });
}


function ajustarPanelIC(width, height) {

    require(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
            "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
            "esri/layers/FeatureLayer", "dojo/domReady!"
        ],
        function(declare, BaseWidget, DataSourceManager,
            Query, QueryTask, SpatialReference, FeatureLayer) {


            var panelConsultaIC = appGlobal.getPanel();
            panelConsultaIC.position.width = width;
            panelConsultaIC.position.height = height;
            panelConsultaIC._originalBox = {
                w: panelConsultaIC.position.width,
                h: panelConsultaIC.position.height,
                l: panelConsultaIC.position.left || 0,
                t: panelConsultaIC.position.top || 0
            };
            // panel.setPosition(panel.position);
            panelConsultaIC.panelManager.normalizePanel(panelConsultaIC);




        });

}

function mostrarResultados(aplicacion) {
    appGlobal = aplicacion;

    extentInicial = null;
    extentInicial = appGlobal.map.extent;
}

function cerrarWidgetResultados() {

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
        "jimu/WidgetManager",
        "dojo/domReady!"
    ], function(Map, dom, on,
        ArcGISDynamicMapServiceLayer, LayerInfo, arrayUtils, array, Query, QueryTask, dojoJson, dojoString, esriRequest, PanelManager, WidgetManager) {



        appGlobal.map.graphics.clear();
        var currentLayer = appGlobal.map.getLayer("capaResultadoCA");
        if (currentLayer != null) {
            appGlobal.map.removeLayer(currentLayer);
        }
        appGlobal.map.setExtent(extentInicial);

    });
}

function createDialogInformacion() {

    require(["dijit/Dialog", "dojo/domReady!"], function(Dialog) {
        myDialog = new Dialog({
            title: "<B> Informaci&oacute;n </B>",
            content: "Por favor seleccione todos los campos.",
            style: ".claro .dijitDialogTitleBar"
        });

        myDialog.show();
    });

}

function ExportarCsvIndustriaC() {
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

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {

    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
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
        console.log(row);
        CSV += row + '\r\n';
    }

    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
            console.log(row);
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

}

function volverParametrosIndustriaC() {
    var width = 410;
    var height = 280;


    ajustarPanelIC(width, height)
    document.getElementById("divResultadosConsultaIndustriaC").style.display = 'none';
    document.getElementById("divTablaIndustriaC").style.display = 'none';
    document.getElementById("btnImagen").style.display = 'none';
    document.getElementById("divOpcionesIndustriaComercio").style.display = 'block';


}

function createDialogImagen() {
    require(["dijit/Dialog", "dojo/domReady!"], function(Dialog) {
        dialog = new Dialog({
            title: "<B> Imagen </B>",
            content: "<img src='" + informacionImagen + "' style='width:250px;height:200px;'>",
            style: "claro .dijitDialogTitleBar"
        });

        dialog.show();
    });
}

function LimpiarIc() {

    document.getElementById("selConsultaIC").selectedIndex = "Seleccione...";
    selMunicipioIC.options.length = 0;
    selTipoIC.options.length = 0;
    selNombreIC.options.length = 0;
    appGlobal.map.graphics.clear();
    document.getElementById("cbox1").checked = false;

}