var urlSel = "no tengo nada";
var capaUrl = "";
var todosGrupos = [];
var fieldsCapa = [];
var appGlobal;
var idFeatureCargadoSimple = 0;
var theLayer;
var resultadosMandar
var extentInicial;
var panelConsultaSimple;
var featureCargadosSimple = [];
var jsonResultados;
var resultadosQuery;
var esShape;
var vacioValor;
define(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
    "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
    "esri/layers/FeatureLayer", "jimu/PanelManager", "dojo/domReady!"
],
    function (declare, BaseWidget, DataSourceManager,
        Query, QueryTask, SpatialReference, FeatureLayer, PanelManager) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here

            //baseClass: 'jimu-widget-mywidget',

            // postCreate: function() {
            //   this.inherited(arguments);
            //console.log('postCreate');

            //},

            startup: function () {
                //  this.inherited(arguments);
                //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
                //console.log('startup');

                mostrarResultados(this);

                $('#widgets_ConsultaSimple_Widget_39_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza consulta simple con par&aacute;metros de entrada"></div>');
            },


            onOpen: function () {
                // console.log('onOpen');

                document.getElementById("divResultadosConsultaSimple").style.display = 'none';
                document.getElementById("divTablaConsultaSimple").style.display = 'none';
                document.getElementById("botonesConsultaSimple").style.display = 'block';
                document.getElementById("divOpcionesConsultaSimple").style.display = 'block';

                panelConsultaSimple = this.getPanel();
                panelConsultaSimple.position.width = 350;
                panelConsultaSimple.position.height = 470;
                panelConsultaSimple._originalBox = {
                  w: panelConsultaSimple.position.width,
                  h: panelConsultaSimple.position.height,
                  l: panelConsultaSimple.position.left || 0,
                  t: panelConsultaSimple.position.top || 0
                };
                panelConsultaSimple.setPosition(panelConsultaSimple.position);
                panelConsultaSimple.panelManager.normalizePanel(panelConsultaSimple);

                limpiar();
                insertarServicios();
                esShape = false;
            },
            bindEvents: function () {

                // console.log("bindEvents")

            },
            onExecute: function (featureSet) {
                //console.log("onExecute")
            },
            onClose: function () {
                console.log('onClose');
                limpiar();
                esShape = false;
                //appGlobal.map.graphics.clear();
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
    });


function insertarServicios()
{
    var servicios = [[SERVICIO_CARTOGRAFIA_BASICA, "CARTOGRAF\xCDA B\xC1SICA"], [SERVICIO_AMBIENTAL, "AMBIENTAL"], [SERVICIO_EDUCACION, "EDUCACI\xD3N"], [SERVICIO_GENERAL_SALUD, "SALUD"], [SERVICIO_CULTURA_TURISMO, "CULTURA Y TURISMO"], [SERVICIO_ORDENAMIENTO_TERRITORIAL, "ORDENAMIENTO TERRITORIAL"], [SERVICIO_INDUSTRIA_COMERCIO, "INDUSTRIA Y COMERCIO"], [SERVICIO_RIESGO_CONSULTA, "GESTI\xD3N DEL RIESGO"]];

    selServicios.options.length = 0;
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    selServicios.options.add(optsel);
    for (var i = 0; i < servicios.length; i++) {

        var opt = document.createElement('option');
        opt.value = servicios[i][0];
        opt.text = servicios[i][1];
        selServicios.options.add(opt);
    }

}
function configureDropDownLists(selServicios) {

    var servicioSeleccionado = selServicios.value;
    selCapas.options.length = 0;
    selGrupos.options.length = 0;
    txtCampos.options.length = 0;
    selValores.options.length = 0;
    document.getElementById("textBusqueda").value = "";
    urlSel = selServicios.value;
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
    ], function (Map, dom, on,
        ArcGISDynamicMapServiceLayer, LayerInfo, arrayUtils, Query, QueryTask, dojoJson, esriRequest, PanelManager) {
            var infoCapas = "";
            var lasCapas = "";
            var layer = new ArcGISDynamicMapServiceLayer(
                urlSel, {
                    useMapImage: false
                }
            );
            showLoader();
            var requestHandle = esriRequest({
                "url": urlSel,
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
                    layerInfo = dojo.map(response.layers, function (f) {
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
                    var grupos = [];
                    var tieneGrupos = "false";
                    for (var i = 0; i < todo.length.toString(); i++) {
                        if (todo[i][2] != "null                     ") {
                            grupos.push(todo[i]);
                            tieneGrupos = "true";
                        }
                    }
                    if (tieneGrupos != "true") {
                        insertarCapasSinGrupos(todo);
                    } else {
                        insetarGrupos(grupos);
                    }
                }
                hideLoader();
            }

        });
}
function insetarGrupos(grupos) {
    selGrupos.options.length = 0;
    document.getElementById("grupoLabel").style.display = 'inline';
    document.getElementById("selGrupos").style.display = 'inline';
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    selGrupos.options.add(optsel);
    for (var i = 0; i < grupos.length; i++) {

        var opt = document.createElement('option');
        opt.value = grupos[i][0];
        opt.text = grupos[i][1];
        selGrupos.options.add(opt);
    }
}
function insertarCapasSinGrupos(todo) {

    selCapas.options.length = 0;
    document.getElementById("grupoLabel").style.display = 'none';
    document.getElementById("selGrupos").style.display = 'none';
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    selCapas.options.add(optsel);
    for (var i = 0; i < todo.length; i++) {

        var opt = document.createElement('option');
        opt.value = todo[i][0];
        opt.text = todo[i][1];
        selCapas.options.add(opt);
    }

}
function configureDropDownListCapas(selGrupos, selCapas, selServicios) {

    var grupoSeleccionado = selGrupos.value;
    selCapas.options.length = 0;
    txtCampos.options.length = 0;
    selValores.options.length = 0;
    document.getElementById("textBusqueda").value = "";
    var urlCapa = selServicios.value + "/" + grupoSeleccionado;
    consultarCapas(urlCapa);

}
function consultarCapas(urlCapa) {

    var grupoSeleccionado = selGrupos.value;;
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
    ], function (Map, dom, on,
        ArcGISDynamicMapServiceLayer, LayerInfo, arrayUtils, Query, QueryTask, dojoJson, esriRequest, PanelManager) {
            var capas = "";
            for (var i = 0; i < todosGrupos.length; i++) {
                if (todosGrupos[i][0] == grupoSeleccionado.toString()) {

                    capas = todosGrupos[i][2];
                }
            }

            var capasCompleta = [];
            capasCompleta = capas.split(",");
            var idCapasCompleta;
            var idTodosGrupos;
            var capasDelGrupo = [];
            for (var i = 0; i < capasCompleta.length; i++) {
                idCapasCompleta = capasCompleta[i].replace(/\D/g, '');
                for (var j = 0; j < todosGrupos.length; j++) {
                    idTodosGrupos = todosGrupos[j][0].replace(/\D/g, '');
                    if (idCapasCompleta == idTodosGrupos) {
                        capasDelGrupo.push(todosGrupos[j]);
                    }
                }

            }
            insertarCapas(capasDelGrupo);
            
        });

}
function insertarCapas(todo) {
    selCapas.options.length = 0;
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    selCapas.options.add(optsel);
    for (var i = 0; i < todo.length; i++) {

        var opt = document.createElement('option');
        opt.value = todo[i][0];
        opt.text = todo[i][1];
        selCapas.options.add(opt);
    }

}
function configureDropDownListCampos(selCapas) {
    var capaSeleccionada = selCapas.value;
    var capaCorregida = capaSeleccionada.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
    txtCampos.options.length = 0;
    selValores.options.length = 0;
    document.getElementById("textBusqueda").value = "";
    var urlCapa = urlSel + "/" + capaSeleccionada;
    capaUrl = urlCapa.replace("/ /g", '');
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
    ], function (Map, dom, on,
        ArcGISDynamicMapServiceLayer, LayerInfo, arrayUtils, array, Query, QueryTask, dojoJson, dojoString, esriRequest, PanelManager) {
            var losFields = [];
            showLoader();
            var requestHandle = esriRequest({
                "url": urlCapa,
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
                        return pad(f.name, 25, " ", true) +
                            "/" + pad(f.type, 25, " ", true);
                    });
                    losFields = fieldInfo;
                    var todo = [];
                    for (var i = 0; i < losFields.length.toString(); i++) {
                        var field = [];
                        field = losFields[i].split("/");
                        todo.push(field);

                    }
                    insertarCampos(todo);
                }
                hideLoader();
            }

           
        });
}
function insertarCampos(todo) {
    document.getElementById("txtCampos").value = "";
    var fields = "";
    var campos = [];
    var field;
    var tipo = "";
    var type = "";
    var estossonfields = [];
    //console.log(todo);
    for (var i = 0; i < todo.length; i++) {
        tipo = todo[i][1].slice(13);
        tipo = tipo.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
        type = "(" + tipo + ")";
        estossonfields.push(todo[i][0].replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, ''));
        field = todo[i][0] + type;
        field = field.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
        fields = fields + field + "\n";
    }
    fieldsCapa = estossonfields;
    insertarCamposSelect(fields);
}
function insertarCamposSelect(fields) {
    txtCampos.options.length = 0;
    var campos = [];
    campos = fields.split("\n");
    for (var i = 0; i < campos.length; i++) {
        var opt = document.createElement('option');
        opt.value = campos[i];
        opt.text = campos[i];
        txtCampos.options.add(opt);

    }

}
function configureDropDownListIngresarCampos(txtCampos) {
    document.getElementById("textBusqueda").value = "";
    var campoSeleccionado = txtCampos.value;
    var campo = campoSeleccionado.split("(");
    var field = campo[0].replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
    capaUrl = capaUrl.replace(/^\s+|\s+|\s+$/, '');


    /*

    if (capaUrl.indexOf("Educacion_T") > -1 && capaUrl.indexOf("4") > -1) {

        var fieldE = "SIGQ.V_UNIVERSIDAD.";
        field = fieldE + field;
    }
    */
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/layers/FeatureLayer", "dojo/dom",
        "dojo/on", "dojo/domReady!"
    ],
        function (Query, QueryTask, SpatialReference, FeatureLayer, dom, on) {
            showLoader();
            borrarFeatureCargadosSimple();
            var featureLayer = new FeatureLayer(capaUrl, { outFields: ["*"] });
            //appGlobal.map.addLayer(featureLayer);


            featureCargadosSimple[idFeatureCargadoSimple] = featureLayer;
            idFeatureCargadoSimple++;

            featureCargadosSimple.push(featureLayer);

            if (campoSeleccionado != null) {

                var valores = [];
                var valoressolos = [];
             
                var queryTask = new QueryTask(capaUrl);
                var query = new Query();

                query.outFields = [field];
         
                query.where = "1=1";
                query.returnGeometry = false;
                queryTask.execute(query, monstrarConsulta);

                function monstrarConsulta(featureSet) {


                    var resultFeatures = featureSet.features;
                    
                    if (resultFeatures != undefined) {
                        var resultadoPeticion = resultFeatures;
                        for (var i = 0; i < resultFeatures.length; i++) {
                            valores.push(resultFeatures[i].attributes);
                        }
                        var prueba = JSON.stringify(valores);
                        var result = [];
                        var resultado = prueba.split(",");
                        var valor;
                        var campito = campo[0].replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                        var valorsolo;
                        var valoresCompleto = [];
                        for (var j = 0; j < resultado.length; j++) {
                            valor = resultado[j].split(":");
                            if (valor.length > 1) {
                                valorsolo = valor[1].split("}");
                            } else {
                                valorsolo = valor[0].split("}");
                            }
                            valoresCompleto.push(valorsolo[0]);
                        }

                        function comparar(a, b) {
                            return a - b;
                        }
                        valoresCompleto.sort(comparar);

                        var listaGrupo02 = [];
                        var SinDuplicados = [];
                        var SinDuplicados = valoresCompleto.filter(function (elem, pos) {
                            return valoresCompleto.indexOf(elem) == pos;
                        });
                        insertarValoresSelect(SinDuplicados);
                        hideLoader();

                    } else {

                        // console.log(field);
                        console.log(capaUrl);

                    }
                }
            }
        });
}
function insertarValoresSelect(valoresCompleto) {

    selValores.options.length = 0;
    var campoSeleccionado = txtCampos.value;
    var campo = campoSeleccionado.split("(");
    var esNull = "";
    console.log(valoresCompleto);
    if (valoresCompleto.length <= 0 || valoresCompleto[0] == "null") {

        vacioValor = true;
    } else {
        vacioValor = false;

    }
    if (campo[0] != "SHAPE ") {
        esShape = false;
        for (var i = 0; i < valoresCompleto.length; i++) {

            esNull = valoresCompleto[i].replace(/['"]+/g, '')
            if (esNull != "null") {
                var opt = document.createElement('option');

                opt.value = valoresCompleto[i].replace(/['"]+/g, '');
                opt.text = valoresCompleto[i].replace(/['"]+/g, '');
                selValores.options.add(opt);
            } else {
                var opt = document.createElement('option');

                opt.value = "";
                opt.text = "";
                selValores.options.add(opt);
            }
        }
    }else {

        esShape = true;
    }
}
function configureDropDownListValores(selValores) {

    var valor = selValores.value;
    document.getElementById("textBusqueda").value = valor;
}
function limpiar() {
    document.getElementById("selServicios").selectedIndex = "Seleccione...";
    document.getElementById("selGrupos").selectedIndex = "Seleccione...";
    document.getElementById("selCapas").selectedIndex = "Seleccione...";
    document.getElementById("txtCampos").value = "";
    document.getElementById("textBusqueda").value = "";
    txtCampos.options.length = 0;
    selValores.options.length = 0;
    appGlobal.map.graphics.clear();
    borrarFeatureCargadosSimple();

   
}
function borrarFeatureCargadosSimple() {
require(["esri/map","esri/layers/FeatureLayer",
"dojo/domReady!"
],function (Map,FeatureLayer) {

    for (var i in featureCargadosSimple) {
        appGlobal.map.removeLayer(featureCargadosSimple[i]);
    }
    idFeatureCargadoSimple = 0;
    featureCargadosSimple.length = 0;
    appGlobal.map.graphics.clear();
 });
}
function consultaSimple() {
    showLoader();
    var campoSeleccionado = txtCampos.value;
    var campo = campoSeleccionado.split("(");
    console.log(campoSeleccionado);
    var valorSeleccionado = selValores.value;
    var fields = fieldsCapa;
    //console.log(fields);
    var queryprueba;
    var lids = appGlobal.map.layerIds;
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
        "esri/symbols/SimpleFillSymbol", "esri/Color","esri/InfoTemplate","esri/graphic",
        "dojo/domReady!"
    ],
        function (Query,
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
            
            if (valorSeleccionado != "null" && valorSeleccionado != "" && campoSeleccionado != "") {


                var query = new Query();
                var queryTask = new QueryTask(capaUrl);
                query.returnGeometry = true;
                query.outFields = [fieldsCapa];
                query.spatialReference = appGlobal.map.spatialReference;
                queryprueba = query;
                var where = "";
                var campoSel = txtCampos.value.split('(');
                if (campoSeleccionado.includes("String")) {

                    where = campoSel[0] + " LIKE  '" + selValores.value + "'";
                } else {
                    where = campoSel[0] + "= " + selValores.value;
                }
                query.where = where;
                //console.log(campoSel);

                queryTask.execute(query, mostrarTablaConsultaSimple);

                function mostrarTablaConsultaSimple(featureSet) {

                    if (featureSet.features.length <= 0) {

                        var titulo = "<B> Informaci&oacute;n </B>";
                        var contenido = "No se encontraron resultados";
                        createDialogInformacionConsultaSimple(titulo, contenido);
                    } else {


                        resultadosQuery = featureSet.features;

                        var result = [];
                        for (var i = 0, il = featureSet.features.length; i < il; i++) {
                            result.push(featureSet.features[i].attributes);
                        }
                        jsonResultados = JSON.stringify(result);
                        document.getElementById("divResultadosConsultaSimple").style.display = 'block';
                        document.getElementById("divTablaConsultaSimple").style.display = 'block';

                        document.getElementById("botonesConsultaSimple").style.display = 'none';
                        document.getElementById("divOpcionesConsultaSimple").style.display = 'none';



                        var colorFeature = [255.0, 0, 0.0, 1];
                        for (var i in featureSet.features) {


                            dibujarFeatures([featureSet.features[i]], colorFeature);
                            // break;

                        }

                        require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                                function (lang, DataGrid, ItemFileWriteStore, dom) {


                                    var width = 650;
                                    var height = 300;
                                    ajustarPanelSimple(width, height);
                                    var data_list_ConsultaSimple = [];
                                    var data_Simple = {
                                        identifier: "id",
                                        items: []
                                    };
                                    var layout = [], fields = [];
                                    layout[0] = [];

                                    for (var i = 0; i < featureSet.fields.length; i++) {
                                        fields[i] = featureSet.fields[i].name;
                                    }
                                    for (var i in featureSet.features) {
                                        data_list_ConsultaSimple[i] = {};
                                        for (var a in fields) {
                                            data_list_ConsultaSimple[i][fields[a]] = featureSet.features[i].attributes[fields[a]];
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
                                    if (data_list_ConsultaSimple.length < 10) {
                                        height = 250;
                                    }


                                    var rows = data_list_ConsultaSimple.length;
                                    for (var i = 0, l = data_list_ConsultaSimple.length; i < rows; i++) {
                                        data_Simple.items.push(lang.mixin({ id: i + 1 }, data_list_ConsultaSimple[i % l]));
                                    }

                                    console.log(data_Simple);
                                    var store = new ItemFileWriteStore({ data: data_Simple });

                                    if (dijit.byId("gridConsultaSimple") != undefined) {
                                        dijit.byId("gridConsultaSimple").destroy();
                                    }

                                    var gridSimple = new DataGrid({
                                        id: 'gridConsultaSimple',
                                        store: store,
                                        structure: layout,
                                        rowSelector: '10px',
                                        style: "width: 560px;",
                                        selectionMode: 'single',
                                        canSort: function (col) {
                                            return false;
                                        }
                                    });


                                    gridSimple.placeAt("divTablaConsultaSimple");

                                    gridSimple.startup();
                                    gridSimple.set('autoHeight', false);
                                    gridSimple.set('autoWidth', true);
                                    gridSimple.update();
                                    gridSimple.set('autoWidth', false);
                                    gridSimple.on("RowClick", function (evt) {
                                        selectedRowGrid(evt);
                                    }, true);


                                });


                    }


                }
                function selectedRowGrid(seleccionado) {
                    var colorFeature = [51, 255, 227, 1];
                    var rowSelected = dijit.byId('gridConsultaSimple').selection.getSelected()[0].OBJECTID[0];
                    var resultQuery = resultadosQuery;
                    for (var i in resultQuery) {
                        if (resultQuery[i].attributes.OBJECTID == rowSelected) {
                            dibujarFeatures2([resultQuery[i]], colorFeature);
                            break;
                        }
                    }
                }



                function dibujarFeatures2(features, color) {
                    var data = features, a = 0;
                    var features = [];
                    for (var i in data) {
                        if (data[i].geometry != null) {
                            features[a] = data[i];
                            a++;
                        }
                    }

                    if (features.length > 0) {
                        var colorFeature;
                        if (color == undefined) {
                            colorFeature = [255, 0, 0, 1];
                        } else {
                            colorFeature = color;
                        }
                        console.log(features[0]);
                        var spatialRef1 = new SpatialReference(3116);
                        for (var i in features) {
                            if (features[i].geometry.type == "point") {

                                //atributo = {"x": features[i].geometry.x, "y": features[i].geometry.y};
                                loc = new Point(features[i].geometry.x, features[i].geometry.y, spatialRef1);
                                dibujarPunto(loc, features[i].attributes);
                                if (features.length == 1) {
                                    var newZoom = 25000;
                                    appGlobal.map.setScale(newZoom);
                                    appGlobal.map.centerAt(loc);
                                }

                            } else if (features[i].geometry.type == "polyline") {
                                //////////////////////////////
                                var polylineSymbol1 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color(colorFeature), 3);
                                var polyline = new Polyline({
                                    "paths":
                                        features[i].geometry.paths,
                                    "spatialReference": {
                                        "wkid": spatialRef1
                                    }
                                });
                                //var infoTemplate = crearInfoTemplate(features[i].attributes);
                                var graphic = new Graphic(polyline, polylineSymbol1, features[i].attributes);
                                appGlobal.map.graphics.add(graphic);
                                var extentAcercar;
                                if (features.length == 1) {
                                    extentAcercar = esri.graphicsExtent(features);
                                    extentAcercar = extentAcercar.expand(3.5);
                                    appGlobal.map.setExtent(extentAcercar);
                                    // appGlobal.map.setExtent(features[0].geometry.getExtent());
                                }
                                //////////////////////////////
                            } else {
                                var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color(colorFeature), 3), new Color([255, 128, 0, 0.15]));
                                for (var i in features) {
                                    var geometria = features[i].geometry;
                                    //var infoTemplate = crearInfoTemplate(features[i].attributes);
                                    var graphic = new Graphic(geometria, symbol, features[i].attributes);
                                    graphic.id = features[i].attributes.OBJECTID;
                                    appGlobal.map.graphics.add(graphic);
                                }

                                if (features.length == 1) {
                                    console.log(features);
                                    extentAcercar = esri.graphicsExtent(features);
                                    extentAcercar = extentAcercar.expand(3.5);
                                    appGlobal.map.setExtent(extentAcercar);
                                    // appGlobal.map.setExtent(features[0].geometry.getExtent());
                                }
                            }
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
                                map.setScale(newZoom);
                                map.centerAt(loc);
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
                        /*  if (features.length == 1) {
                              appGlobal.map.setExtent(features[0].geometry.getExtent());
                          }*/
                    }

                }
                function dibujarPunto(loc, attr) {
                    var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));
                    var infoTemplate = new InfoTemplate();
                    var newPunto = new Graphic(loc, symbol, attr, infoTemplate);
                    appGlobal.map.graphics.add(newPunto);
                }
            } else {

                if ( esShape || vacioValor) {

                    var titulo = "<B> Informaci&oacute;n </B>";
                    var contenido = "No se encontraron resultados";
                    createDialogInformacionConsultaSimple(titulo, contenido);

                } else {

                    var titulo = "<B> Informaci&oacute;n </B>";
                    var contenido = "Por favor seleccione todos los campos";
                    createDialogInformacionConsultaSimple(titulo, contenido);
                }
            }
        });

    hideLoader();
}
function createDialogInformacionConsultaSimple(titulo, contenido) {

    require(["dijit/Dialog", "dojo/domReady!"], function (Dialog) {
        myDialogOT = new Dialog({
            title: titulo,
            content: contenido,
             style: ".claro .dijitDialogTitleBar"
        });

        myDialogOT.show();
    });

}
function mostrarResultados(aplicacion) {
    appGlobal = aplicacion;

    extentInicial = null;
    extentInicial = appGlobal.map.extent;
}
function ExportarCsvSimple() {

    JSONToCSVConvertor(jsonResultados, "Consulta_Simple", true);
}
function ajustarPanelSimple(width, height) {

require(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
"esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
"esri/layers/FeatureLayer", "dojo/domReady!"],
    function (declare, BaseWidget, DataSourceManager,
    Query, QueryTask, SpatialReference, FeatureLayer) {


        var panelConsultaSimple = appGlobal.getPanel();
        panelConsultaSimple.position.width = width;
        panelConsultaSimple.position.height = height;
        panelConsultaSimple._originalBox = {
            w: panelConsultaSimple.position.width,
            h: panelConsultaSimple.position.height,
            l: panelConsultaSimple.position.left || 0,
            t: panelConsultaSimple.position.top || 0
        };
        // panel.setPosition(panel.position);
        panelConsultaSimple.panelManager.normalizePanel(panelConsultaSimple);




    });






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
function volverParametrosConsultaSimple() {
    var width = 350;
    var height = 470;
    ajustarPanelSimple(width, height);


    document.getElementById("divResultadosConsultaSimple").style.display = 'none';
    document.getElementById("divTablaConsultaSimple").style.display = 'none';
    document.getElementById("botonesConsultaSimple").style.display = 'block';
    document.getElementById("divOpcionesConsultaSimple").style.display = 'block';
}




