var map, toolbar, on, tb, objetoCapas = [],
    objetoGrupos = [],
    dataServicioWeb, mostrarTabla;
var urlCapa = "",
    capaSelected1, capaSeleccionada = "",
    url = "",
    urlCapaFinal = "",
    idCapa, featureCargados = [];
var idFeatureCargado = 0,
    x = 0,
    featureLayer = 0,
    servisSelected1, gruposSelected1;
var appGlobal = "",
    loc, objetoCampos = [],
    queryGeometria = null;
var panelManager, currentLayer, extentCapaSelecionada;
var widgetCerrar, resultadoBuffer, widgetOpen = false,
    evento, tes = false,
    evtObj1;
var funcionalidadBuffer = {};
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
    function(dom,
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

        var selectServicios, servicios, flat1 = false,
            flat2 = false,
            flat3 = false;
        var widgetMyResultados = "widgets_MyWidgetResultados_Widget_40";

        var clazz = declare([BaseWidget], {
            name: 'Buffer',

            baseClass: 'jimu-widget-Buffer',

            postCreate: function() {
                var panel = this.getPanel();
                this.inherited(arguments);
                currentLayer = this.map.getLayer("capaResultadoCA");
                on = this.on;
                map = this.map;
                toolbar = new Draw(map);
                toolbar.on("draw-end", doBuffer);
            },
            startup: function() {

                $('#widgets_Buffer_Widget_44_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza consulta de &aacute;rea de influencia"></div>');

                var popup = new Popup({
                    offsetX: 10,
                    offsetY: 10,
                    zoomFactor: 2
                }, domConstruct.create("div"));

                obtenerApp(this);
                esriConfig.defaults.geometryService = new GeometryService(SERVICIO_GEOMETRIA);
                // esriConfig.defaults.geometryService = new GeometryService("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                esriConfig.defaults.io.proxyUrl = "/proxy/";
                esriConfig.defaults.io.alwaysUseProxy = false;
                query("#clearGraphics").on("click", function(evt) {
                    if (map) {
                        map.graphics.clear();
                        borrarFeatureCargados();
                        ajustarExtend(dataServicioWeb.fullExtent);
                    }
                });
                query(".tool").on("click", function(evt) {
                    evento = evt;
                    funcionalidadBuffer.tipoGepmetry = evt.currentTarget.id;
                    if (evt.target.id == "limpiar") {
                        ajustarExtend(extentCapaSelecionada);
                    }
                    if (toolbar && evt.target.id != "limpiar") {
                        toolbar.activate(evt.target.id);
                    }
                    if (funcionalidadBuffer.tablaResultados != undefined) {
                        destruirTablaResultados();
                    }
                });
                query("#servicios").on("click", function(evt) {
                    var servisSelected = this.options[this.selectedIndex].text;
                    if (servisSelected != "Seleccione" && servisSelected != servisSelected1) {
                        document.getElementById("resultadosBuffer").style.display = "none";
                        $('#point').prop('disabled', true);
                        $('#polyline').prop('disabled', true);
                        $('#resultadosBuffer').prop('disabled', true);
                        $('#capas').prop('disabled', true);
                        document.getElementById("capas").length = 0;
                        disabledForm(true);
                        funcionalidadBuffer.disabledForm = true;
                        servisSelected1 = servisSelected;
                        if (featureCargados.length != 0) {
                            borrarFeatureCargados();
                        }
                        for (var i in servicios.urlServicios) {
                            if (servicios.urlServicios[i].nombreMostrar == servisSelected) {
                                url = servicios.urlServicios[i].url;
                                formarUrlCapa(url);
                                break;
                            };
                        };
                        ejecutarConsulta(url);
                        flat1 = false;
                    } else if (servisSelected == "Seleccione") {
                        document.getElementById("resultadosBuffer").style.display = "none";
                        flat1 = true;
                        if (funcionalidadBuffer.disabledForm) {
                            disabledForm(false);
                            funcionalidadBuffer.disabledForm = false;
                        }
                    }
                    if (evento) {
                        toolbar.deactivate(evento.target.id);
                    }
                });
                query("#grupos").on("click", function(evt) {
                    var gruposSelected = this.options[this.selectedIndex].text;
                    if (gruposSelected != gruposSelected1 && gruposSelected != "Seleccione") {
                        document.getElementById("resultadosBuffer").style.display = "none";
                        $('#point').prop('disabled', true);
                        $('#polyline').prop('disabled', true);
                        $('#resultadosBuffer').prop('disabled', true);
                        disabledForm(true);
                        funcionalidadBuffer.disabledForm = true;
                        gruposSelected1 = gruposSelected;
                        getCapasGrupo(dataServicioWeb, gruposSelected);
                        if (featureCargados.length != 0) {
                            borrarFeatureCargados();
                        }
                        if (evento) {
                            toolbar.deactivate(evento.target.id);
                        }
                        capaSelected1 = undefined;
                    }
                });
                query("#botonRegresarBuffer").on("click", function(evt) {
                    document.getElementById("divtTablaBuffer").style.display = "none";
                    document.getElementById("divFormularioBuffer").style.display = "block";
                    document.getElementById("resultadosBuffer").style.display = "block";
                    var width = funcionalidadBuffer.widthInicial;
                    var height = funcionalidadBuffer.heightInicial;
                    ajustarTamanioWidget(funcionalidadBuffer.panel, width, height);
                    $('#resultadosBuffer').prop('disabled', false);
                });
                query("#capas").on("click", function(evt) {
                    var capaSelected = this.options[this.selectedIndex].text;
                    if (capaSelected != "" && capaSelected1 != capaSelected) {
                        document.getElementById("resultadosBuffer").style.display = "none";
                        disabledForm(true);
                        funcionalidadBuffer.disabledForm = true;
                        funcionalidadBuffer.capaSelected = capaSelected;
                        funcionalidadBuffer.capaSelecionada = capaSelected;
                        capaSelected1 = capaSelected;
                        if (capaSelected == "Unidades Ordenacion de Bosques") {
                            capaSelected = "Unidades Ordenacion  de Bosques";
                        } else if (capaSelected == "Infracción con Salvoconducto Vencido") {
                            capaSelected = "Infracción con  Salvoconducto Vencido";
                        } else if (capaSelected == "Suelo de Protección") {
                            capaSelected = "Suelo de  Protección";
                        }
                        var urlCapaFinal = "";
                        if (funcionalidadBuffer.idsCapasGrupos != undefined) {
                            var datos = funcionalidadBuffer.idsCapasGrupos.Capas;
                        } else {
                            var datos = dataServicioWeb.layers;                            
                        }

                        for (var c in datos) {
                            if (datos[c].name == capaSelected) {
                                urlCapaFinal = urlCapa + datos[c].id;
                                break;
                            }
                        }

                        var jsonCapaFinal = urlCapaFinal;
                        adicionarCapa(urlCapaFinal, jsonCapaFinal);
                        
                        if (evento) {
                            toolbar.deactivate(evento.target.id);
                        }
                        $('#point').prop('disabled', false);
                        $('#polyline').prop('disabled', false);
                        $('#resultadosBuffer').prop('disabled', true);
                    }
                });
                query("#resultadosBuffer").on("click", function(evt) {
                    document.getElementById("divtTablaBuffer").style.display = "block";
                    document.getElementById("divFormularioBuffer").style.display = "none";
                    var width = funcionalidadBuffer.width;
                    var height = funcionalidadBuffer.height;
                    ajustarTamanioWidget(funcionalidadBuffer.panel, width, height);
                    if (evento) {
                        toolbar.deactivate(evento.target.id);
                    }
                });
                query("#btnLimpiarBuffer").on("click", function(evt) {
                    document.getElementById("divtTablaBuffer").style.display = "none";
                    document.getElementById("divFormularioBuffer").style.display = "block";
                    var width = 260;
                    var height = 276;
                    ajustarTamanioWidget(funcionalidadBuffer.panel, width, height);
                    $('#resultadosBuffer').prop('disabled', true);
                    document.getElementById("resultadosBuffer").style.display = "none";
                    document.getElementById("servicios").selectedIndex = "0";
                    document.getElementById("grupos").selectedIndex = "0";
                    document.getElementById("capas").selectedIndex = "0";
                    map.graphics.clear();
                    map.removeLayer(featureLayer);
                    borrarFeatureCargados();
                    if (evento) {
                        toolbar.deactivate(evento.target.id);
                    }
                });

                //distance

            },

            onOpen: function() {
                map.setInfoWindowOnClick(false);
                var panel = this.getPanel();
                funcionalidadBuffer.panel = panel;
                var width = 260;
                var height = 276;
                funcionalidadBuffer.widthInicial = width;
                funcionalidadBuffer.heightInicial = height;
                funcionalidadBuffer.width = width;
                funcionalidadBuffer.height = height;
                ajustarTamanioWidget(panel, width, height);
                servicios = {
                    "urlServicios": [
                        { "url": "", "nombreMostrar": "Seleccione" },
                        { "url": SERVICIO_CARTOGRAFIA_BASICA, "nombreMostrar": "CARTOGRAFÍA BÁSICA" },
                        { "url": SERVICIO_AMBIENTAL, "nombreMostrar": "AMBIENTAL" },
                        { "url": SERVICIO_EDUCACION, "nombreMostrar": "EDUCACIÓN" },
                        { "url": SERVICIO_SALUD, "nombreMostrar": "SALUD" },
                        { "url": SERVICIO_CULTURA_TURISMO, "nombreMostrar": "CULTURA Y TURISMO" },
                        { "url": SERVICIO_ORDENAMIENTO_TERRITORIAL, "nombreMostrar": "ORDENAMIENTO TERRITORIAL" },
                        { "url": SERVICIO_INDUSTRIA_COMERCIO, "nombreMostrar": "INDUSTRIA Y COMERCIO" },
                        { "url": SERVICIO_RIESGO_CONSULTA, "nombreMostrar": "GESTIÓN DEL RIESGO" }
                    ]
                };

                selectServicios = document.getElementById("servicios");

                for (var i in servicios.urlServicios) {
                    selectServicios.options[selectServicios.options.length] = new Option(servicios.urlServicios[i].nombreMostrar, i);
                };

                funcionalidadBuffer.disabledForm = false;
                document.getElementById("divFormularioBuffer").style.display = "block";
                document.getElementById("divtTablaBuffer").style.display = "none";
                $('#point').prop('disabled', true);
                $('#polyline').prop('disabled', true);
                $('#resultadosBuffer').prop('disabled', true);
                $('#grupos').prop('disabled', true);
                $('#capas').prop('disabled', true);
                document.getElementById("resultadosBuffer").style.display = "none";
            },

            onClose: function() {
                map.setInfoWindowOnClick(true);
                if (evento) {
                    toolbar.deactivate(evento.target.id);
                }
                map.graphics.clear();
                selectServicios.length = 0;
                map.removeLayer(featureLayer);
                borrarFeatureCargados();
                if (dataServicioWeb != undefined) {
                    ajustarExtend(dataServicioWeb.fullExtent);
                }
                tes = true;
                servisSelected1 = 0;
                gruposSelected1 = 0;
                capaSelected1 = 0;
                map.setExtent(map._initialExtent);
                map.graphics.clear();
                dojo.disconnect();
            }
        });

        function borrarFeatureCargados() {
            for (var i in featureCargados) {
                map.removeLayer(featureCargados[i]);
            }
            idFeatureCargado = 0;
            featureCargados.length = 0;
            map.graphics.clear();
        }

        function abreWidgetResultados() {
            var widget = appGlobal.appConfig.getConfigElementById(widgetMyResultados);
            var widgetId = widget.id;
            appGlobal.openWidgetById(widgetId);
        }

        function formarUrlCapa(url) {
            urlCapa = url + "/";
        }

        function doBuffer(evtObj) {
            evtObj1 = evtObj;
            var loc = evtObj.geometry;
            map.graphics.clear();
            toolbar.deactivate();
            var geometry = evtObj.geometry;
            var symbol;
            switch (geometry.type) {
                case "point":
                    symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));
                    break;
                case "polyline":
                    symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
                    break;
            }

            var graphic = new Graphic(geometry, symbol);
            map.graphics.add(graphic);

            var spatialRef = new SpatialReference({ wkid: 3115 });
            var params = new BufferParameters();
            params.distances = [dom.byId("distance").value];
            params.outSpatialReference = map.spatialReference;
            params.bufferSpatialReference = spatialRef;
            params.unit = GeometryService[dom.byId("unit").value];
            params.unionResults = true;
            params.geodesic = true;

            normalizeUtils.normalizeCentralMeridian([geometry]).then(function(normalizedGeometries) {
                var normalizedGeometry = normalizedGeometries[0];
                if (normalizedGeometry.type == "polyline") {
                    esriConfig.defaults.geometryService.simplify([normalizedGeometry], function(geometries) {
                        params.geometries = geometries;
                        esriConfig.defaults.geometryService.buffer(params, showBuffer);
                    });
                } else {
                    params.geometries = [normalizedGeometry];
                    esriConfig.defaults.geometryService.buffer(params, showBuffer);
                }

            });
            var x = 0,
                y = 0;
            if (funcionalidadBuffer.tipoGepmetry == "polyline") {
                x = geometry.paths[0][1][0];
                y = geometry.paths[0][1][1];
                ubicarBuffer(x, y, params.distances, params.unit);
            } else if (geometry.type == "polyline") {
                for (var i in geometry.paths[0]) {
                    for (var e in geometry.paths[0][i]) {
                        if (e == 0) {
                            x += geometry.paths[0][i][e];
                        } else {
                            y += geometry.paths[0][i][e];
                        }

                    }
                }
                x /= 2;
                y /= 2;
                ubicarBuffer(x, y, params.distances, params.unit);
            } else {
                ubicarBuffer(geometry.x, geometry.y, params.distances, params.unit);
            }
            map.infoWindow.hide();
            map.setInfoWindowOnClick(false);
        }

        function showBuffer(bufferedGeometries) {
            var graphic;
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255, 128, 0, 1]), 3), new Color([255, 0, 0, 0.15]));
            var featureLayer = new FeatureLayer(urlCapaFinal, { outFields: ["*"] });
            featureLayer.setSelectionSymbol(symbol);
            var nullSymbol = new SimpleMarkerSymbol().setSize(0);
            featureLayer.setRenderer(new SimpleRenderer(nullSymbol));
            map.addLayer(featureLayer);
            featureCargados[idFeatureCargado] = featureLayer;
            idFeatureCargado++;
            array.forEach(bufferedGeometries, function(geometria) {
                queryGeometria = geometria;
                var query = new Query();
                query.geometry = geometria.getExtent();
                query.outFields = objetoCampos;
                featureLayer.queryFeatures(query, pintarPoligonosConsulta);
                graphic = new Graphic(geometria, symbol);
            });
            map.graphics.add(graphic);
        }

        function pintarPoligonosConsulta(response) {
            var symbol;
            if (funcionalidadBuffer.tipoGepmetry == "polyline" && response.features[0].geometry.type != "polygon") {
                symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255, 0, 0, 1]), 3);
                var tipo = response.features[0].geometry.type;
                var features = response.features;
                var fields = [];
                var title = funcionalidadBuffer.capaSelecionada;
                for (var i in response.fields) {
                    fields[i] = response.fields[i].name;
                }
                pintargrafica(tipo, symbol, features, fields, title);
            } else {
                symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255, 0, 0, 1]), 3), new Color([255, 128, 0, 0.15]));
                for (var i in response.features) {
                    var geometria = response.features[i].geometry;
                    var graphic = new Graphic(geometria, symbol);
                    graphic.id = response.features[i].attributes.OBJECTID;
                    map.graphics.add(graphic);
                }
            }
            mostrarResultadosEnTabla(response);
        }

        function ubicarBuffer(x, y, distancia, unidad) {
            var radio, zoom;
            if (unidad == 9036) { //kilometros
                radio = distancia * 1000;
            } else if (unidad == 9093) { //Millas
                radio = distancia * 1609.34;
            } else if (unidad == 9002) { //pies
                radio = distancia * 0.3048;
            } else {
                radio = distancia * 1;
            }

            if (radio <= 110) {
                zoom = 12500;
            } else if (radio <= 2130) {
                zoom = 15000;
            } else if (radio <= 2845) {
                zoom = 20000;
            } else if (radio <= 3545) {
                zoom = 25000;
            } else if (radio <= 7065) {
                zoom = 50000;
            } else if (radio <= 14170) {
                zoom = 100000;
            } else if (radio <= 28330) {
                zoom = 200000;
            } else {
                zoom = 500000;
            }

            loc = new Point(x, y, map.spatialReference);
            var newZoom = zoom;
            //map.setScale(newZoom);
            //map.centerAt(loc);
        }

        function destruirTablaResultados() {
            funcionalidadBuffer.tablaResultados.destroy();
            funcionalidadBuffer.tablaResultados = undefined;
        }

        function mostrarResultadosEnTabla(result) { //result es el array q contiene los datos a mostrar          
            if (result.features.length <= 0) {
                createDialogInformacionGeneral("<B> Info </B>", "La selección no contiene resultados");
                if (funcionalidadBuffer.disabledForm) {
                    disabledForm(false);
                    funcionalidadBuffer.disabledForm = false;
                }
            } else {
                require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                    function(lang, DataGrid, ItemFileWriteStore, dom) {
                        document.getElementById("divFormularioBuffer").style.display = "none";
                        document.getElementById("divtTablaBuffer").style.display = "block";
                        //////organiza datos para cargarlo en data_list                                             
                        funcionalidadBuffer.resultQuery = result.features;
                        var data_list = [];
                        var data = {
                            identifier: "id",
                            items: []
                        };
                        var layout = [],
                            fields = [];
                        layout[0] = [];
                        funcionalidadBuffer.lists = [];
                        for (var i = 0; i < result.fields.length; i++) {
                            fields[i] = result.fields[i].name;
                        }
                        for (var i in result.features) {
                            data_list[i] = {};
                            for (var a in fields) {
                                data_list[i][fields[a]] = result.features[i].attributes[fields[a]];
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
                        var height = 380;
                        if (width >= 508) {
                            width = 508;
                        }
                        funcionalidadBuffer.width = width;
                        funcionalidadBuffer.height = height;
                        ajustarTamanioWidget(funcionalidadBuffer.panel, width, height);
                        funcionalidadBuffer.lists = data_list;
                        var features = result.features;
                        funcionalidadBuffer.jsonConvertido = JSON.stringify(data_list);
                        var rows = data_list.length;
                        for (var i = 0, l = data_list.length; i < rows; i++) {
                            data.items.push(lang.mixin({ id: i + 1 }, data_list[i % l]));
                        }
                        var store = new ItemFileWriteStore({ data: data });
                        /*create a new grid*/
                        var grid = new DataGrid({
                            id: 'grid',
                            store: store,
                            structure: layout,
                            rowSelector: '10px',
                            selectionMode: 'single',
                            canSort: function(col) {
                                return false;
                            }
                        });
                        funcionalidadBuffer.tablaResultados = grid;
                        /*append the new grid to the div*/
                        grid.placeAt("divGridQueryAdvancedBuffer");

                        /*Call startup() to render the grid*/
                        grid.startup();
                        grid.set('autoHeight', false);
                        grid.set('autoWidth', false);
                        grid.set('autoWidth', true);
                        grid.update();
                        var leyenda = dijit.byId("leyendaGraficaConsulta");
                        grid.on("RowClick", function(evt) {
                            selectedRowGrid(evt);
                        }, true);

                        if (funcionalidadBuffer.disabledForm) {
                            disabledForm(false);
                            funcionalidadBuffer.disabledForm = false;
                            $('#resultadosBuffer').prop('disabled', false);
                        }
                        hideLoader();
                    });
                ///////
            }
        }

        function exportarCsv() {
            require([],
                function(

                ) {
                    consolo.log("exportarCsv");
                    if (resultadoBuffer.features.length <= 0) {
                        createDialogInformacionGeneral("<B> Info </B>", "recuerda, primero debes hacer buffer sobre la capa seleccionada");
                    } else {
                        var atributos = [];
                        for (var i = 0; i < resultadoBuffer.features.length; i++) {
                            atributos[i] = resultadoBuffer.features[i].attributes;
                        }

                        var csvData = "";
                        var attributes;
                        var attribute;

                        attributes = resultadoBuffer.features[0].attributes;
                        for (attribute in attributes) {
                            csvData += (csvData.length === 0 ? "" : ",") + '"' + attribute + '"';
                        }
                        csvData += "\r\n";

                        var line = "";
                        for (var i = 0; i < resultadoBuffer.features.length; i++) {
                            line = "";
                            var feature = resultadoBuffer.features[i];
                            attributes = feature.attributes;
                            for (attribute in attributes) {
                                line += (line.length === 0 ? "" : ",") + '"' + attributes[attribute] + '"';
                            }
                            csvData += line + "\r\n";
                        }
                        var filename = 'resultadoBuffer.csv';

                        csvData = "sep=,\r\n" + csvData;
                        var hiddenElement = document.createElement('a');
                        hiddenElement.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csvData);
                        hiddenElement.target = '_blank';
                        hiddenElement.download = filename;
                        hiddenElement.click();



                    }
                    //}
                    //)
                }
            )
        };

        function selectedRowGrid(seleccionado) {
            var colorFeature = [51, 255, 227, 1];
            var rowSelected = dijit.byId('grid').selection.getSelected()[0].OBJECTID[0];
            var resultQuery = funcionalidadBuffer.resultQuery;
            for (var i in resultQuery) {
                if (resultQuery[i].attributes.OBJECTID == rowSelected) {
                    dibujarFeatures([resultQuery[i]], colorFeature);
                    break;
                }
            }
        }

        function dibujarFeatures(features, color) {
            require(["esri/geometry/Polyline", "esri/symbols/SimpleLineSymbol", "esri/graphic"],
                function(Polyline, SimpleLineSymbol, Graphic) {
                    var colorFeature;
                    if (color == undefined) {
                        colorFeature = [255, 0, 0, 1];
                    } else {
                        colorFeature = color;
                    }
                    for (var i in features) {
                        if (features[i].geometry.type == "point") {
                            for (var i in features) {
                                //atributo = {"x": features[i].geometry.x, "y": features[i].geometry.y};
                                loc = new Point(features[i].geometry.x, features[i].geometry.y, map.spatialReference);
                                dibujarPunto(loc, features[i].attributes);
                                if (features.length == 1) {
                                    var newZoom = 2000;
                                    map.setScale(newZoom);
                                    map.centerAt(loc);
                                }
                            }
                        } else if (features[i].geometry.type == "polyline") {
                            //////////////////////////////
                            var polylineSymbol1 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color(colorFeature), 3);
                            var polyline = new Polyline({
                                "paths": features[i].geometry.paths,
                                "spatialReference": {
                                    "wkid": map.spatialReference.wkid
                                }
                            });
                            var infoTemplate = crearInfoTemplate(features[i].attributes);
                            var graphic = new Graphic(polyline, polylineSymbol1, features[i].attributes, infoTemplate);
                            map.graphics.add(graphic);
                            if (features.length == 1) {
                                map.setExtent(features[0].geometry.getExtent());
                            }
                            //////////////////////////////
                        } else {
                            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color(colorFeature), 3), new Color([255, 128, 0, 0.15]));
                            for (var i in features) {
                                var geometria = features[i].geometry;
                                var infoTemplate = crearInfoTemplate(features[i].attributes);
                                var graphic = new Graphic(geometria, symbol, features[i].attributes, infoTemplate);
                                graphic.id = features[i].attributes.OBJECTID;
                                map.graphics.add(graphic);
                            }
                            if (features.length == 1) {
                                //map.setExtent(features[0].geometry.getExtent());
                            }
                        }
                    }
                });
        }

        function crearInfoTemplate(attr) {
            var myInfoTemplate;
            var fields = [],
                datoInfo = "",
                title;

            title = "No predial: " + attr.NUMEROPREDIAL;

            for (var i in funcionalidadBuffer.fields) {
                if (attr[fields[i]] != null) {
                    datoInfo += fields[i] + ": " + attr[fields[i]] + "<br/>";
                }

            }
            var myInfoTemplate = new InfoTemplate(title, datoInfo);
            return myInfoTemplate;
        }

        function dibujarPunto(loc, attr) {
            var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));
            var infoTemplate = crearInfoTemplate(attr);
            var newPunto = new Graphic(loc, symbol, attr, infoTemplate);
            map.graphics.add(newPunto);
            colocaTextoPunto(loc, attr);
        }
        /* function getExtentBufferSeleccionado(buffer) {
            var i = 0, xmax = 0, xmin = 0, ymax = 0, ymin = 0;
            var extenxion = buffer.features[0].geometry.getExtent();
            for (i in buffer.features) {
                if (buffer.features[i].geometry.getExtent().xmax < xmax) {
                    xmax = buffer.features[i].geometry.getExtent().xmax;
                }
                if (buffer.features[i].geometry.getExtent().xmin < xmin) {
                    xmin = buffer.features[i].geometry.getExtent().xmin
                }
                if (buffer.features[i].geometry.getExtent().ymin > ymin) {
                    ymin = buffer.features[i].geometry.getExtent().ymin
                }
                if (buffer.features[i].geometry.getExtent().ymax > ymax) {
                    ymax = buffer.features[i].geometry.getExtent().ymax
                }
            }
            extenxion.xmax = xmax;
            extenxion.xmin = xmin;
            extenxion.ymax = ymax;
            extenxion.ymin = ymin;
            ajustarExtend(extenxion);
        } */
        function colocaTextoPunto(geometries, attr) {
            var labelPoint = geometries;
            var font = new Font("20px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
            if (geometries.x != undefined) {
                var textSymbol = new TextSymbol("X: " + geometries.x + ", Y: " + geometries.y, font, new Color([206, 9, 18]));
            } else {
                var textSymbol = new TextSymbol("Latitud: " + attr.Latitud + ", Longitud: " + attr.Longitud, font, new Color([206, 9, 18]));
            }
            var labelPointGraphic = new Graphic(labelPoint, textSymbol);
            map.graphics.add(labelPointGraphic);
        }

        function adicionarCapa(capa, jsonCapaFinal) {
            /*
             * @dateUpdated: 2023-08-17
             * @changes: Validación para adicionar capas
             * @author IGAC, Investigación y Prospectiva
             */
            
            if (jsonCapaFinal != "") {
                ejecutarConsulta(jsonCapaFinal);
            }
            if (featureCargados.length != 0) {
                borrarFeatureCargados();
            }
            
            if (capa != "") {
                var capaCargada = new FeatureLayer(capa);
                map.addLayer(capaCargada);

                featureCargados[idFeatureCargado] = capaCargada;
                idFeatureCargado++;
            }
            
            urlCapaFinal = capa;
        }

        function ejecutarConsulta(url) {
            var layersRequest = esriRequest({
                url: url,
                content: { f: "json" },
                handleAs: "json",
                callbackParamName: "callback"
            });
            layersRequest.then(
                function(response) {
                    requestSucceeded(response, null);
                },
                function(error) {
                    console.log("Error: ", error.message);
                    createDialogInformacionGeneral("<B> Info </B>", "Error, Vuelva a cargar el servicio");
                    hideLoader();
                });
        }

        function requestSucceeded(response, io) {
            if (funcionalidadBuffer.disabledForm) {
                disabledForm(false);
                funcionalidadBuffer.disabledForm = false;
            }
            if (response.layers != undefined) {
                dataServicioWeb = response;
                if (response.layers[0].subLayerIds == null) {
                    document.getElementById("grupos").length = 0;
                    $("#grupos").prop('disabled', true);
                    document.getElementById("grupos").style.background = "#c9c7c7";
                    getCapas(response);
                } else {
                    var datoGrupos = document.getElementById("grupos");
                    datoGrupos.length = 0;
                    $("#grupos").prop('disabled', false);
                    document.getElementById("grupos").style.background = "white";
                    getGrupos(response, datoGrupos);
                    $('#resultadosBuffer').prop('disabled', true);
                }
            }
            if (response.extent != null) {
                //ajustarExtend(response.extent);
                objetoCampos.length = 0;
                for (var x in response.fields) {
                    objetoCampos.push(response.fields[x].name);

                }
            }

            if (response.fields != undefined) {
                var fields = response.fields,
                    data = [];
                for (var i in fields) {
                    data[i] = response.fields[i].name;
                }
                funcionalidadBuffer.fields = data;
            }

        }

        function ajustarExtend(response) {
            var spatialRef = new SpatialReference({ wkid: response.spatialReference.wkid });

            if (response != null && response.spatialReference.wkid != 102100) {

                var extent = response;


                var spatialRef1 = new SpatialReference(3115);
                gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
                var extentconver = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, spatialRef);


                var extent2 = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, spatialRef1);
                gsvc.project([extent2], spatialRef, function(projectedPoints) {
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

        function disabledForm(condition) {
            if (condition) {
                showLoader();
            } else {
                hideLoader();
            }
            var nodes = document.getElementById("divFormularioBuffer").getElementsByTagName('*');
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].disabled = condition;
            }
        }

        function requestFailed(error, io) {
            console.log(error);
            console.log(io);
            console.log(dojoJson.toJson(error, true));
            var jsonError = dojoJson.toJson(error, true);
            var info = new InfoTemplate(jsonError);
        }

        function getCapas(response) {
            var datoCapas = document.getElementById("capas");
            datoCapas.length = 0;
            var e = 0;
            objetoCapas.length = 0;
            for (var i in response.layers) {
                if (response.layers[i].subLayerIds == null) {
                    objetoCapas[e] = response.layers[i].id;
                    e++;
                }
            }
            mostrarCapas(response, datoCapas);
        }

        function getCapasGrupo(dataServicioWeb, gruposSelected) {
            /*
             * @DateUpdated: 2023-08-18
             * @Changes: Ajuste inicialización objeto funcionalidadBuffer
             * @author IGAC, Investigación y Prospectiva
             */
            var datoCapas = document.getElementById("capas");
            datoCapas.length = 0;
            var e = 0;
            objetoCapas.length = 0;

            
            funcionalidadBuffer.idsCapasGrupos = {};
            funcionalidadBuffer.idsCapasGrupos.Capas = [];

            for (var i in dataServicioWeb.layers) {
                if (dataServicioWeb.layers[i].name == gruposSelected) {
                    var capasGrupo = dataServicioWeb.layers[i].subLayerIds;
                    visualizarCapas(dataServicioWeb, capasGrupo, datoCapas);
            
                    funcionalidadBuffer.idsCapasGrupos.grupo = gruposSelected;
            
                    for (var c in capasGrupo) {
                        funcionalidadBuffer.idsCapasGrupos.Capas[c] = {};
                        funcionalidadBuffer.idsCapasGrupos.Capas[c].name = dataServicioWeb.layers[capasGrupo[c]].name;
                        funcionalidadBuffer.idsCapasGrupos.Capas[c].id = dataServicioWeb.layers[capasGrupo[c]].id;
                    }
                }
            }

            if (funcionalidadBuffer.disabledForm) {
                disabledForm(false);
                funcionalidadBuffer.disabledForm = false;
                $('#resultadosBuffer').prop('disabled', true);
            }

        }

        function getGrupos(response, datoGrupos) {
            var e = 0;
            objetoGrupos.length = 0;
            for (var i in response.layers) {
                if (response.layers[i].subLayerIds != null) {
                    objetoGrupos[e] = response.layers[i].id;
                    e++;
                }
            }
            mostrarGrupos(response, datoGrupos);
        }

        function mostrarCapas(response, datoCapas) {
            datoCapas.options[datoCapas.options.length] = new Option("", 0);
            for (var i in objetoCapas) {
                datoCapas.options[datoCapas.options.length] = new Option(response.layers[objetoCapas[i]].name, i);
            }

        }

        function visualizarCapas(dataServicioWeb, capasGrupo, datoCapas) {
            /*
             * @dateUpdated: 2023-08-17
             * @changes: Adicionar validación para crear el item vacio con valor 0 una vez.
             * @author IGAC, Investigación y Prospectiva
             */
            if (datoCapas.options.length == 0) {
                datoCapas.options[datoCapas.options.length] = new Option("", 0);
            }
            for (var i in capasGrupo) {
                datoCapas.options[datoCapas.options.length] = new Option(dataServicioWeb.layers[capasGrupo[i]].name, i + 1);
            }
        }

        function mostrarGrupos(response, datoGrupos) {
            datoGrupos.options[datoGrupos.options.length] = new Option("Seleccione", 0);
            for (var i in objetoGrupos) {
                datoGrupos.options[datoGrupos.options.length] = new Option(response.layers[objetoGrupos[i]].name, i + 1);
            }
        }
        return clazz;
    });

function obtenerApp(app) {
    appGlobal = app;
}

function Exportar() {
    //ResultadosJson
    var ReportTitle = "Resultados";
    var ShowLabel = true;
    var ResultadosJson = funcionalidadBuffer.jsonConvertido;
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
            createDialogInformacionGeneral("<B> Info </B>", "Invalid data");
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
        createDialogInformacionGeneral("<B> Info </B>", "No  hay elementos");
    }

}