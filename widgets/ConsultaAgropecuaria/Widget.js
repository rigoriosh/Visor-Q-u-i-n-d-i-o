var urlSel = "no tengo nada";
var capaUrl = "";
var todosGrupos = [];
var fieldsCapa = [];
var appGlobal;
var resultadosMandar
var extentInicial;
var capaGeneral = "";
var urlPDF = "";
var urlSeleccionado = "";
var infoConsultaAgp = {};
var jsonResultadosAgp;
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
            ////console.log('postCreate');

            //},

            startup: function() {





                $('#widgets_ConsultaAgropecuaria_Widget_22_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Por favor seleccione consulta por, municipio y ficha o estrato o clase de suelo para obtener la consulta."></div>');
                llenarMunicipiosAgp();

                mostrarResultados(this);
            },

            onOpen: function() {
                infoConsultaAgp.panel = "";
                var panelApg = this.getPanel();
                panelApg.position.width = 370;
                panelApg.position.height = 230;
                panelApg._originalBox = {
                    w: panelApg.position.width,
                    h: panelApg.position.height,
                    l: panelApg.position.left || 0,
                    t: panelApg.position.top || 0
                };
                panelApg.setPosition(panelApg.position);
                panelApg.panelManager.normalizePanel(panelApg);


                infoConsultaAgp = this.getPanel();
                limpiarAgp();
                document.getElementById("divResultadosConsultaAgp").style.display = "none";
                document.getElementById("divTablaAgp").style.display = "none";
                document.getElementById("divOpcionesConsultaAgp").style.display = "block";
            },
            bindEvents: function() {

                // //console.log("bindEvents")

            },
            onExecute: function(featureSet) {
                ////console.log("onExecute")
            },
            onClose: function() {
                map.graphics.clear();
                //console.log('onClose');

            },

            // onMinimize: function(){
            //   //console.log('onMinimize');
            // },

            // onMaximize: function(){
            //   //console.log('onMaximize');
            // },

            // onSignIn: function(credential){
            //   /* jshint unused:false*/
            //   //console.log('onSignIn');
            // },

            // onSignOut: function(){
            //   //console.log('onSignOut');
            // }

            // onPositionChange: function(){
            //   //console.log('onPositionChange');
            // },

            // resize: function(){
            //   //console.log('resize');
            // }

            //methods to communication between widgets:
        });
    });


/**
 *Metodo que  crea un arreglo de municip�os y llena el select selMunicipioOT
 **/
function llenarMunicipiosAgp() {

    var municipiosAgp = [
        ["63001", "Armenia"],
        ["63111", "Buenavista"],
        ["63130", "Calarcá"],
        ["63190", "Circasia"],
        ["63212", "C\u00f3rdoba"],
        ["63272", "Filandia"],
        ["63302", "Génova"],
        ["63401", "La Tebaida"],
        ["63470", "Montenegro"],
        ["63548", "Pijao"],
        ["63594", "Quimbaya"],
        ["63690", "Salento"]
    ];
    // se hace el llamado a la Metodo para insertar los municipios
    insertarGeneral(selMunicipioAgp, municipiosAgp);

}

/*
 *Metodo que administra el comportamiento de la select ConsultaPor
 *@param {select} selConsultaPor
 **/

/**
 *Metodo que  quita los espacios  y caracteres especiales de un arreglo
 *@param {array} valores
 **/
function depurarRsultado(valores) {

    var resultadosJson = JSON.stringify(valores);
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
    //Compara los valores  para  no tener valores repetidos
    var SinDuplicados = valoresCompleto.filter(function(elem, pos) {
        return valoresCompleto.indexOf(elem) == pos;
    });

    return SinDuplicados;
}

/**
 *Metodo que  compara dos variables
 **/
function comparar(a, b) {
    return a - b;
}

/**
 *Metodo que  admisnitra el comportamiento del select general de acuerdo a la seleccion de municipio realizada por el usuario
 *@param {selec} selMunicipioOT
 **/
function municipiosApg_selectedChanged(selMunicipioAgp) {

    appGlobal.map.graphics.clear();
    var municipio = selMunicipioAgp.value;
    var urlConsultaApg = "";
    var hacerConsulta = false;
    var outField = "";
    var where = "";
    outField = "ANIO";

    if (selMunicipioAgp.value == "Seleccione...") {
        hacerConsulta = false;
    } else {
        where = "IDMUNICIPIO  = " + selMunicipioAgp.value;
        urlConsultaApg = SERVICIO_AGROPECUARIO + "/" + selTipoAgropecuaria.value;
        if (selTipoAgropecuaria.value == "0") {
            infoConsultaAgp.tipoAgp = "Cultivos";
            hacerConsulta = true;
        } else if (selTipoAgropecuaria.value == "1") {
            infoConsultaAgp.tipoAgp = "Especies";
            hacerConsulta = true;
        } else if (selTipoAgropecuaria.value == "3") {
            infoConsultaAgp.tipoAgp = "Infomación Avicola";
            hacerConsulta = true;
        } else if (selTipoAgropecuaria.value == "4") {
            infoConsultaAgp.tipoAgp = "Producción de leche";
            hacerConsulta = true;
        }

        urlSeleccionado = urlConsultaApg;
    }
    if (hacerConsulta) {
        // se realiza la consulta para llenar la lista selGeneral
        require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/layers/FeatureLayer", "dojo/dom",
                "dojo/on", "dojo/domReady!"
            ],
            function(Query, QueryTask, SpatialReference, FeatureLayer, dom, on) {
                showLoader();
                var valores = [];
                var queryTask = new QueryTask(urlConsultaApg);
                var query = new Query();
                query.outFields = [outField];

                query.where = where;
                query.returnGeometry = false;
                queryTask.execute(query, monstrarConsulta);
                hideLoader();

                function monstrarConsulta(featureSet) {

                    var resultFeatures = featureSet.features;
                    if (resultFeatures != undefined) {
                        for (var i = 0; i < resultFeatures.length; i++) {
                            valores.push(resultFeatures[i].attributes);
                        }
                        if (valores.length > 0) {
                            var SinDuplicados = depurarRsultado(valores);
                            // insertarMunicipiosddl(municipiosAgregar);



                            insertar(selAnioAgp, SinDuplicados.sort());
                        } else {
                            insertarVacio(selAnioAgp);
                        }


                    } else {
                        //console.log(urlConsulta);
                    }
                }

            });
    }

}
/**
 *Metodo que inserta en un select  los datos de no se encontraron resultafos
 *@param {select} select
 **/
function insertarVacio(select) {

    select.options.length = 0;
    var optsel = document.createElement('option');
    optsel.value = "No se encontraron datos";
    optsel.text = "No se encontraron datos";
    select.options.add(optsel);

}

/**
 *Metodo que inserta en un select  los datos recibidos
 *@param {select} select
 *@param {array} arreglo
 **/
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
/**
 *Metodo que inserta en un select  los datos recibidos
 *@param {select} select
 *@param {array} arreglo
 **/
function insertar(select, arreglo) {

    select.options.length = 0;
    var optsel = document.createElement('option');
    optsel.value = "Seleccione...";
    optsel.text = "Seleccione...";
    select.options.add(optsel);
    for (var i = 0; i < arreglo.length; i++) {

        var opt = document.createElement('option');
        if (arreglo[i].replace(/['"]+/g, '') != "null") {
            opt.value = arreglo[i].replace(/['"]+/g, '');
            opt.text = arreglo[i].replace(/['"]+/g, '');
            select.options.add(opt);
        }
    }

}
/**
 *Metodo que realiza   de acuerdo a las opciones escogidas por el usuario
 **/
function consultarApg() {
    showLoader();
    var sWhere = "";
    var urlAgp = "";
    //se realiza el where de acuerdo a la opcion escogida por el usuario en selConsultaPor
    if (selMunicipioAgp.value != null && selMunicipioAgp.value != "Seleccione..." && selAnioAgp.value != null && selAnioAgp.value != "Seleccione..." &&
        selTipoAgropecuaria.value != null && selTipoAgropecuaria.value != "Seleccione...") {
        infoConsultaAgp.anio = selAnioAgp.value;
        sWhere = "IDMUNICIPIO  = '" + selMunicipioAgp.value + "' AND ANIO = '" + selAnioAgp.value + "'";
        urlAgp = SERVICIO_AGROPECUARIO + "/" + selTipoAgropecuaria.value;
        consultarAgropecuaria(sWhere, urlSeleccionado);
    } else {
        var titulo = "<B> Informaci&oacute;n </B>";
        var contenido = "Por favor seleccione todos los campos.";
        createDialogInformacionOT(titulo, contenido);
    }

    // hideLoader();
}
/**
 *Metodo que consulta con url de la consulta y la clausula where 
 *@param {cadena} sWhere
 *@param {cadena} urlOT
 **/
function consultarAgropecuaria(sWhere, urlSeleccionado) {
    var urlFicha = "";
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/layers/FeatureLayer", "esri/dijit/FeatureTable", "esri/geometry/Extent", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters",
        "dojo/dom", "dojo/on", "dojo/_base/lang", 'jimu/BaseWidget', "jimu/LayerInfos/LayerInfos", "jimu/PanelManager", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol", "esri/graphic", "dojo/_base/Color", "esri/InfoTemplate", "dojo/domReady!"
    ], function(Query, QueryTask, SpatialReference, FeatureLayer, FeatureTable, Extent, GeometryService, ProjectParameters, dom, on, lang, BaseWidget, LayerInfos, PanelManager, SimpleMarkerSymbol, SimpleFillSymbol,
        SimpleLineSymbol, Graphic, Color, InfoTemplate) {
        if (selMunicipioAgp.value != null && selMunicipioAgp.value != "Seleccione..." && selAnioAgp.value != null && selAnioAgp.value != "Seleccione...") {
            appGlobal.map.graphics.clear();
            var query = new Query();
            var queryTask = new QueryTask(urlSeleccionado);
            query.returnGeometry = true;
            query.outFields = ["*"];
            queryprueba = query;
            query.where = sWhere;
            query.outSpatialReference = { wkid: appGlobal.map.spatialReference };
            infoTemplate = new InfoTemplate("Consulta agropecuaria");
            queryTask.execute(query, monstrarConsulta);

            function monstrarConsulta(featureSet) {

                if (infoConsultaAgp.chartPie != undefined) {
                    infoConsultaAgp.chartPie.destroy();
                    infoConsultaAgp.chartPie = undefined;
                }
                var titulo = "";
                var contenido = "";
                var resultados = null;
                resultados = featureSet;
                var info = featureSet.features;
                var resultadosMandar = resultados;
                var result = [];
                var fichasNormativas = [];
                var produccion = 0;
                var rendimiento = 0;
                var areascosechadas = 0;
                var cultivo = [];
                var tipocultivo;
                var total = 0,
                    porcentajes = [];
                if (info.length > 0) {
                    appGlobal.map.setExtent(featureSet.features[0].geometry.getExtent());
                    map.graphics.clear();
                    var width = 500;
                    var height = 670;
                    document.getElementById("divTablaAgp").style.display = "flex";
                    pintargrafica("polygone", undefined, featureSet.features, featureSet.fields, infoConsultaAgp.tipoAgp + " año " + infoConsultaAgp.anio);
                    // //console.log(info[0].attributes.TIPO_CULTIVO_PRINCIPAL);
                    var divsApg = ["divOpcionesConsultaAgp"]; //a ocultar
                    ocultarMostrarDivs(divsApg, "none");
                    divsApg = ["divResultadosConsultaAgp"];
                    ocultarMostrarDivs(divsApg, "flex");
                    var fieldsA = [];
                    var names = [];
                    var seleccionadoMAgp = selMunicipioAgp.options[selMunicipioAgp.selectedIndex].text;
                    if (infoConsultaAgp.tipoAgp == "Cultivos") {
                        width = 730;
                        for (var o in featureSet.features) {
                            total += parseFloat(featureSet.features[o].attributes.PRODUCCION);
                        }
                        for (var e in featureSet.features) {
                            porcentajes[e] = ((parseFloat(featureSet.features[e].attributes.PRODUCCION) / total) * 100).toFixed(2);
                        }
                        var cultivos = [];
                        for (var i in info) {
                            cultivos[i] = {};
                            cultivos[i].y = featureSet.features[i].attributes.PRODUCCION;
                            cultivos[i].text = "";
                            cultivos[i].stroke = "white"
                            cultivos[i].tooltip = featureSet.features[i].attributes.TIPO_CULTIVO_PRINCIPAL + " <br> " + featureSet.features[i].attributes.PRODUCCION + " <br> " + porcentajes[i] + "%";
                        }
                        var nombreMunicipio = "";
                        var titulo = "";
                        titulo = infoConsultaAgp.tipoAgp + " en el municipio de  " + seleccionadoMAgp + "<br>" + "año " + infoConsultaAgp.anio;
                        mostrarDatosPieAgp(cultivos, "graficaIndicadoresApg", titulo, 10);
                        //Agregar tabla:
                        fieldsA = ["TIPO_CULTIVO_PRINCIPAL", "PRODUCCION", "RENDIMIENTO", "AREACOSECHADA"];
                        names = ["Cultivo", "Producción", "Rendimiento", "Área cosechada"];
                    } else if (infoConsultaAgp.tipoAgp == "Especies") {
                        var totalEspecies = 0;
                        var porcentajesE = [];
                        for (var o in featureSet.features) {
                            totalEspecies += parseFloat(featureSet.features[o].attributes.TOTALESPECIE);
                        }
                        for (var e in featureSet.features) {
                            porcentajesE[e] = ((parseFloat(featureSet.features[e].attributes.TOTALESPECIE) / totalEspecies) * 100).toFixed(2);
                        }
                        var especies = [];
                        for (var i in info) {
                            especies[i] = {};
                            especies[i].y = featureSet.features[i].attributes.TOTALESPECIE;
                            especies[i].text = "";
                            especies[i].stroke = "white"
                            especies[i].tooltip = featureSet.features[i].attributes.TIPO_ESPECIE + " <br> " + featureSet.features[i].attributes.TOTALESPECIE + " <br> " + porcentajesE[i] + "%";

                        }
                        var tituloEspe = "";
                        tituloEspe = infoConsultaAgp.tipoAgp + " en el municipio de  " + seleccionadoMAgp + "<br>" + "año " + infoConsultaAgp.anio;
                        mostrarDatosPieAgp(especies, "graficaIndicadoresApg", tituloEspe, 10);
                        fieldsA = ["ANIO", "TIPO_ESPECIE", "TOTALESPECIE"];
                        names = ["Año", "Tipo especie", "Total"];
                    } else if (infoConsultaAgp.tipoAgp == "Infomación Avicola") {
                        var NUMEROPREDIOS = 0;
                        var porcentajesE = [];
                        for (var o in featureSet.features) {
                            NUMEROPREDIOS += parseFloat(featureSet.features[o].attributes.NUMEROPREDIOS);
                        }
                        for (var e in featureSet.features) {
                            porcentajesE[e] = ((parseFloat(featureSet.features[e].attributes.NUMEROPREDIOS) / NUMEROPREDIOS) * 100).toFixed(2);
                        }
                        var especies = [];
                        for (var i in info) {
                            especies[i] = {};
                            especies[i].y = featureSet.features[i].attributes.NUMEROPREDIOS;
                            especies[i].text = "";
                            especies[i].stroke = "white"
                            especies[i].tooltip = featureSet.features[i].attributes.TIPO_CAPACIDAD + " <br> " + featureSet.features[i].attributes.NUMEROPREDIOS + " <br> " + porcentajesE[i] + "%";

                        }
                        var tituloEspe = "";
                        tituloEspe = infoConsultaAgp.tipoAgp + " en el municipio de " + seleccionadoMAgp + "<br>" + "año " + infoConsultaAgp.anio;
                        mostrarDatosPieAgp(especies, "graficaIndicadoresApg", tituloEspe, 10);
                        fieldsA = ["ANIO", "TIPO_CAPACIDAD", "NUMEROPREDIOS"];
                        names = ["Año", "Tipo especie", "Total"];
                    } else if (infoConsultaAgp.tipoAgp == "Producción de leche") {
                        var TOTALVACASORDENO = 0;
                        var porcentajesE = [];
                        for (var o in featureSet.features) {
                            TOTALVACASORDENO += parseFloat(featureSet.features[o].attributes.TOTALVACASORDENO);
                        }
                        for (var e in featureSet.features) {
                            porcentajesE[e] = ((parseFloat(featureSet.features[e].attributes.TOTALVACASORDENO) / TOTALVACASORDENO) * 100).toFixed(2);
                        }
                        var especies = [];
                        for (var i in info) {
                            especies[i] = {};
                            especies[i].y = featureSet.features[i].attributes.TOTALVACASORDENO;
                            especies[i].text = "";
                            especies[i].stroke = "white"
                            especies[i].tooltip = featureSet.features[i].attributes.TIPO_LECHERIA + " <br> " + featureSet.features[i].attributes.TOTALVACASORDENO + " <br> " + porcentajesE[i] + "%";

                        }
                        var tituloEspe = "";
                        tituloEspe = infoConsultaAgp.tipoAgp + " en el municipio de " + seleccionadoMAgp + "<br>" + "año " + infoConsultaAgp.anio;
                        mostrarDatosPieAgp(especies, "graficaIndicadoresApg", tituloEspe, 10);
                        fieldsA = ["ANIO", "TIPO_LECHERIA", "TOTALVACASORDENO"];
                        names = ["Año", "Tipo especie", "Total"];
                    }
                    require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                        function(lang, DataGrid, ItemFileWriteStore, dom) {
                            //var width = 650;
                            //var height = 300;
                            //ajustarPanelCatastral(width, height);
                            //ajustarPanelSimple(width, height);
                            var data_list_ConsultaAgp = [];
                            var data_Agp = {
                                identifier: "id",
                                items: []
                            };
                            var layout = [],
                                fields = [];
                            layout[0] = [];

                            for (var i = 0; i < featureSet.fields.length; i++) {
                                fields[i] = featureSet.fields[i].name;
                            }
                            for (var i in featureSet.features) {
                                data_list_ConsultaAgp[i] = {};
                                for (var a in fieldsA) {
                                    data_list_ConsultaAgp[i][fieldsA[a]] = featureSet.features[i].attributes[fieldsA[a]];
                                    ////console.log(featureSet.features[i].attributes[fieldsA[a]]);
                                }
                            }
                            //console.log("data_list_ConsultaAgp");
                            //console.log(data_list_ConsultaAgp);

                            jsonResultadosAgp = JSON.stringify(data_list_ConsultaAgp);
                            var width = 0;
                            for (var a in fieldsA) {
                                layout[0][a] = {};
                                layout[0][a].name = names[a];
                                layout[0][a].field = fieldsA[a];
                                layout[0][a].width = fieldsA[a].length;
                                width += layout[0][a].width;
                            }
                            width *= 10.8;
                            var height = 350;
                            if (data_list_ConsultaAgp.length < 10) {
                                height = 250;
                            }


                            var rows = data_list_ConsultaAgp.length;
                            for (var i = 0, l = data_list_ConsultaAgp.length; i < rows; i++) {
                                data_Agp.items.push(lang.mixin({ id: i + 1 }, data_list_ConsultaAgp[i % l]));
                            }

                            //console.log(data_Agp);
                            var store = new ItemFileWriteStore({ data: data_Agp });
                            //console.log("data_Agp");
                            //console.log(data_Agp);
                            if (dijit.byId("gridConsultaAgp") != undefined) {
                                dijit.byId("gridConsultaAgp").destroy();
                            }

                            var grid = new DataGrid({
                                id: 'gridConsultaAgp',
                                store: store,
                                structure: layout,
                                rowSelector: '10px',
                                style: "width: 560px;",
                                selectionMode: 'single',
                                canSort: function(col) {
                                    return false;
                                }
                            });
                            grid.placeAt("divTablaAgp");

                            grid.startup();
                            grid.set('autoHeight', false);
                            grid.set('autoWidth', true);
                            grid.update();
                            grid.set('autoWidth', false);

                            //console.log("grid");
                            //console.log(grid);
                            // grid.on("RowClick", function (evt) {
                            //   selectedRowGrid(evt);
                            //}, true);


                        });

                    ajustarApgTamanio(width, height);
                } else {

                    // Se muestra un dialogo en el caso de que no tenga registros la consulta
                    titulo = "<B>Informaci&oacute;n </B>";
                    contenido = "No se encontraron registros";
                    createDialogInformacionOT(titulo, contenido);
                }

            }


        } else {


            titulo = "<B> Informaci&oacute;n </B>";
            contenido = "Por favor seleccione todos los campos.";
            createDialogInformacionOT(titulo, contenido);

        }


    });

}

function ajustarApgTamanio(width, height) {

    require(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
            "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
            "esri/layers/FeatureLayer", "dojo/domReady!"
        ],
        function(declare, BaseWidget, DataSourceManager,
            Query, QueryTask, SpatialReference, FeatureLayer) {

            var panelApg = appGlobal.getPanel();
            panelApg.position.width = width;
            panelApg.position.height = height;
            panelApg._originalBox = {
                w: panelApg.position.width,
                h: panelApg.position.height,
                l: panelApg.position.left || 0,
                t: panelApg.position.top || 0
            };
            panelApg.setPosition(panelApg.position);
            panelApg.panelManager.normalizePanel(panelApg);


        });
}
/**
 *Metodo que se llama cuando el usuario hace la consulta por clasificacion del uso del suelo para mostrar la Norma
 *@param {json} jsonconvertido
 **/

function mostrarDatosPieAgp(cultivos, divAgp, tituloAgp, ofset) {
    var chartTwo;
    require([
            "dojox/charting/Chart",
            "dojox/charting/plot2d/Pie",
            "dojox/charting/action2d/Highlight",
            "dojox/charting/action2d/MoveSlice",
            "dojox/charting/action2d/Tooltip",
            "dojox/charting/themes/MiamiNice",
            "dojox/charting/widget/Legend",
            "dojo/ready"
        ],
        function(
            Chart,
            Pie,
            Highlight,
            MoveSlice,
            Tooltip,
            MiamiNice,
            Legend,
            ready
        ) {
            ready(function() {
                chartTwo = new Chart(divAgp, {
                    title: tituloAgp,
                    titleGap: 1,
                    titleFont: "normal normal normal 15pt Arial"
                });

                chartTwo.setTheme(MiamiNice)
                    .addPlot("default", {
                        type: Pie,
                        font: "normal normal 10pt Tahoma",
                        fontColor: "black",
                        labelOffset: "5",
                        radius: 150
                    }).addSeries("Series A", cultivos);
                var anim_a = new MoveSlice(chartTwo, "default");
                var anim_b = new Highlight(chartTwo, "default");
                var anim_c = new Tooltip(chartTwo, "default");
                //var mag1 = new dojox.charting.action2d.MoveSlice(chartTwo,"default");
                chartTwo.render();
                //var legendTwo = new Legend({chart: chartTwo}, "legendTwo");
                infoConsultaAgp.chartPie = chartTwo;
                hideLoader();
            });
        });
}

/**
 *Metodo que se llama cuando el usuario hace la consulta por Normatividad de uso del suelo para mostrar la ficha normativa
 *@param {json} jsonconvertido
 **/
function obtenerFichasNormativas(jsonconvertido) {

    var resultadojson = jsonconvertido.split(",");
    var fichaPdf = "";
    var fichasPdf = [];
    var valor;

    var valorsolo;
    for (var i = 0; i < resultadojson.length; i++) {
        valor = resultadojson[i].split(":");
        if (valor.length > 1) {
            valorsolo = valor[1].split("}");
        } else {
            valorsolo = valor[0].split("}");
        }
        if (valorsolo[0].indexOf("OT") > -1) {
            fichaPdf = valorsolo[0].replace(/['"]+/g, '');
            fichasPdf.push(fichaPdf);
        }
    }
    if (fichasPdf.length > 0) {
        fichasPdf.sort(comparar);
        var SinDuplicados = [];
        var SinDuplicados = fichasPdf.filter(function(elem, pos) {
            return fichasPdf.indexOf(elem) == pos;
        });

        var urlFicha = "";
        urlFicha = ulrFichaGeneral + SinDuplicados[0];
        urlPDF = ulrFichaGeneral + SinDuplicados[0];
        document.getElementById('btnFichaPDF').style.visibility = 'visible';
        /*
        var titulo = "<B> Ficha Normativa </B>";
        var contenido = "<iframe src='" + urlFicha + "' style='width: 100%;height: 450px;'>This browser does not support PDFs. Please download the PDF to view it: <a href='" + urlFicha + "'>Download PDF</a></iframe>";
        // muestra la norma si existen registros
        createDialogPDF(titulo, contenido);
        */



    } else {
        // muestra un dialogo si no se encuentran registros
        document.getElementById('btnFichaPDF').style.visibility = 'hidden';
        titulo = "<B> Informaci&oacute;n </B>";
        contenido = "No existen normas";
        createDialogInformacionOT(titulo, contenido);
    }

}

function volverParametrosConsultaAgp() {

    var width = 370;
    var height = 230;
    //ajustarPanelSimple(width, height)

    ajustarApgTamanio(width, height);
    document.getElementById("divResultadosConsultaAgp").style.display = 'none';
    document.getElementById("divOpcionesConsultaAgp").style.display = 'block';

}



/**
 *Metodo que inicializa el extent de la aplicacion
 *@param {this} aplicacion
 **/
function mostrarResultados(aplicacion) {
    appGlobal = aplicacion;
    extentInicial = null;
    extentInicial = appGlobal.map.extent;
}
/**
 *Metodo que muestra un dialogo informativo 
 *@param {cadena} titulo
 *@param {cadena} contenido
 **/
function createDialogInformacionOT(titulo, contenido) {

    require(["dijit/Dialog", "dojo/domReady!"], function(Dialog) {
        myDialogOT = new Dialog({
            title: titulo,
            content: contenido
                // style: "width: 400px"
        });

        myDialogOT.show();
    });

}
/**
 *Metodo que muestra pdf
 *@param {cadena} titulo
 *@param {cadena} contenido
 **/
function createDialogPDF(titulo, contenido) {
    require(["dijit/Dialog", "dojo/domReady!"], function(Dialog) {
        dialogoPDF = new Dialog({
            title: titulo,
            content: contenido,
            style: "width: 1000px; height:500px "
        });

        dialogoPDF.show();
        hideLoader();
    });
}
/**
 *Metodo que muestraun dialogo que muestra pdf
 *@param {cadena} urlFicha
 **/
function createDialogPDFClaseDeSuelo(urlFicha) {
    require(["dijit/Dialog", "dojo/domReady!"], function(Dialog) {
        dialogoPDF = new Dialog({
            title: "<B> Documento Norma: " + selGeneral.value + "</B>",
            content: "<iframe src='" + urlFicha + "' style='width: 100%;height: 450px;'>This browser does not support PDFs. Please download the PDF to view it: <a href='" + urlFicha + "'>Download PDF</a></iframe>",
            style: "width: 1000px; height:500px "
        });

        dialogoPDF.show();
        hideLoader();
    });
}

function limpiarAgp() {
    document.getElementById("selTipoAgropecuaria").selectedIndex = "Seleccione...";
    document.getElementById("selMunicipioAgp").selectedIndex = "Seleccione...";
    document.getElementById("selAnioAgp").selectedIndex = "Seleccione...";
    appGlobal.map.graphics.clear();

}

function exportarAgp() {


    exportarACsvGeneral(jsonResultadosAgp, "Resultados_Consulta_Agropecuaria", true);


}