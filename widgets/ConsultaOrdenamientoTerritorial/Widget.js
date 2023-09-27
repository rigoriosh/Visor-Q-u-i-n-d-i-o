var urlSel = "no tengo nada";
var capaUrl = "";
var todosGrupos = [];
var fieldsCapa = [];
var appGlobal;
var resultadosMandar
var extentInicial;
var ulrFichaGeneral = URL_ARCHIVOS_QUINDIO;
var capaGeneral = "";
var urlPDF="";

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

                
                $('#widgets_ConsultaOrdenamientoTerritorial_Widget_88_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Por favor ingrese Esta funcionalidad realiza consulta ordenamiento territorial con par&aacute;metros de entrada"></div>');

                llenarMunicipiosOT();

                mostrarResultados(this);
            },

            onOpen: function () {

                var panel = this.getPanel();
                panel.position.width = 370;
                panel.position.height = 230;
                panel._originalBox = {
                    w: panel.position.width,
                    h: panel.position.height,
                    l: panel.position.left || 0,
                    t: panel.position.top || 0
                };
                panel.setPosition(panel.position);
                panel.panelManager.normalizePanel(panel);


                document.getElementById("labelGeneral").style.display = 'none';
                document.getElementById("selGeneral").style.display = 'none';
                document.getElementById("selMunicipioOT").disabled = true;
                limpiarOT();
            },
            bindEvents: function () {

                // console.log("bindEvents")

            },
            onExecute: function (featureSet) {
                //console.log("onExecute")
            },
            onClose: function () {
                map.graphics.clear();
                console.log('onClose');

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


/**
 *Metodo que  crea un arreglo de municip�os y llena el select selMunicipioOT
**/
function llenarMunicipiosOT() {

    var municipios = [["63001", "Armenia"], ["63111", "Buenavista"], ["63130", "Calarcá"], ["63190", "Circasia"], ["63212", "C\u00f3rdoba"], ["63272", "Filandia"], ["63302", "Génova"], ["63401", "La Tebaida"],
    ["63470", "Montenegro"], ["63548", "Pijao"], ["63594", "Quimbaya"], ["63690", "Salento"]];
    // se hace el llamado a la Metodo para insertar los municipios
    insertarGeneral(selMunicipioOT, municipios);

}

/*
*Metodo que administra el comportamiento de la select ConsultaPor
*@param {select} selConsultaPor
**/
function consultaPorOT_selectedChanged(selConsultaPorOT) {
    selGeneral.options.length = 0;
    selMunicipioOT.options.length = 0;
    llenarMunicipiosOT();
    if (selConsultaPorOT.value == "0") {

        document.getElementById('labelGeneral').innerHTML = 'Ficha: ';

    } else if (selConsultaPorOT.value == "1") {
        document.getElementById('labelGeneral').innerHTML = 'Estrato:';
    } else if (selConsultaPorOT.value == "2") {
        document.getElementById('labelGeneral').innerHTML = 'Clase de suelo:';
    }

    if (selConsultaPorOT != "Seleccione...") {

        document.getElementById("labelGeneral").style.display = 'inline';
        document.getElementById("selGeneral").style.display = 'inline';
        document.getElementById("selMunicipioOT").disabled = false;
    } else {

        document.getElementById("labelGeneral").style.display = 'none';
        document.getElementById("selGeneral").style.display = 'none';
        document.getElementById("selMunicipioOT").disabled = true;
    }
}

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
    var SinDuplicados = valoresCompleto.filter(function (elem, pos) {
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
function municipios_selectedChanged(selMunicipioOT) {
    appGlobal.map.graphics.clear();
    var municipio = selMunicipioOT.value;
    console.log(municipio);
    var urlConsulta = "";
    var hacerConsulta = false;
    var outField = "";
    var where = "";
    //verifica  la opcion escogida por el usuario para el selConsultaPor y arma la condici�n de consulta para  llenar la lista selectgeneral
    if (selConsultaPorOT.value == "0") {
        urlConsulta = SERVICIO_OTA_ALFANUMERICO + "/2";
        hacerConsulta = true;
        outField = "FICHANORMT";
        where = "MUNICIPIO  = " + selMunicipioOT.value;
    } else if (selConsultaPorOT.value == "1") {
        hacerConsulta = false;
        selGeneral.options.length = 0;
        var optsel = document.createElement('option');
        optsel.value = "Seleccione...";
        optsel.text = "Seleccione...";
        selGeneral.options.add(optsel);
        for (var i = 0; i < 7; i++) {

            var opt = document.createElement('option');
            opt.value = i;
            opt.text = i;
            selGeneral.options.add(opt);

        }
        document.getElementById("selGeneral").disabled = false;
    } else if (selConsultaPorOT.value == "2") {
        urlConsulta = SERVICIO_OTA_ALFANUMERICO + "/0";
        hacerConsulta = true;
        outField = "CLASE";
        where = "1=1";

    }

    if (hacerConsulta) {
        // se realiza la consulta para llenar la lista selGeneral
        require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/layers/FeatureLayer", "dojo/dom",
            "dojo/on", "dojo/domReady!"
        ],
            function (Query, QueryTask, SpatialReference, FeatureLayer, dom, on) {
                showLoader();
                var valores = [];
                var queryTask = new QueryTask(urlConsulta);
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
                            insertar(selGeneral, SinDuplicados);
                            document.getElementById("selGeneral").disabled = false;
                        } else {

                            insertarVacio(selGeneral);
                            document.getElementById("selGeneral").disabled = true;
                        }
                       

                    } else {
                        console.log(urlConsulta);
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
function consultaOT() {
    //showLoader();
    var sWhere = "";
    var urlOT = "";
    //se realiza el where de acuerdo a la opcion escogida por el usuario en selConsultaPor
    if (selMunicipioOT.value != null && selMunicipioOT.value != "Seleccione..." && selGeneral.value != null && selGeneral.value != "Seleccione...") {
        if (selConsultaPorOT.value == "0") {

            sWhere = "MUNICIPIO  = '" + selMunicipioOT.value + "' AND FICHANORMT = '" + selGeneral.value + "'";
            urlOT = SERVICIO_OTA_ALFANUMERICO + "/2";
            consultarOT(sWhere, urlOT);
        } else if (selConsultaPorOT.value == "1") {

            sWhere = "MUNICIPIO  = '" + selMunicipioOT.value + "' AND ESTRATO  = '" + selGeneral.value + "'";
            urlOT = SERVICIO_OTA_ALFANUMERICO + "/1";
            consultarOT(sWhere, urlOT);
        } else if (selConsultaPorOT.value == "2") {

            sWhere = "IDMUNICIPIO  = '" + selMunicipioOT.value + "' AND CLASE  = '" + selGeneral.value + "'";
            urlOT = SERVICIO_OTA_ALFANUMERICO + "/0";
            consultarOT(sWhere, urlOT);
        }
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
function consultarOT(sWhere, urlOT) {

    var urlFicha = "";
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/layers/FeatureLayer", "esri/dijit/FeatureTable", "esri/geometry/Extent", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters",
        "dojo/dom", "dojo/on", "dojo/_base/lang", 'jimu/BaseWidget', "jimu/LayerInfos/LayerInfos", "jimu/PanelManager", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol", "esri/graphic", "dojo/_base/Color",  "esri/InfoTemplate","dojo/domReady!"
    ], function (Query, QueryTask, SpatialReference, FeatureLayer, FeatureTable, Extent, GeometryService, ProjectParameters, dom, on, lang, BaseWidget, LayerInfos, PanelManager, SimpleMarkerSymbol, SimpleFillSymbol,
        SimpleLineSymbol, Graphic, Color, InfoTemplate) {
            if (selMunicipioOT.value != null && selMunicipioOT.value != "Seleccione..." && selGeneral.value != null && selGeneral.value != "Seleccione...") {
                appGlobal.map.graphics.clear();
                var query = new Query();
                var queryTask = new QueryTask(urlOT);
                query.returnGeometry = true;
                query.outFields = ["*"];
                queryprueba = query;
                query.where = sWhere;
                query.outSpatialReference = { wkid: appGlobal.map.spatialReference };
                infoTemplate = new InfoTemplate("Ordenamiento territorial");
                showLoader();
                queryTask.execute(query, monstrarConsulta);


                function monstrarConsulta(featureSet) {

                    var titulo = "";
                    var contenido = "";
                    var resultados = null;
                    resultados = featureSet;
                    var info = featureSet.features;


                    var resultadosMandar = resultados;
                    var result = [];
                    var fichasNormativas = [];
                    if (info.length > 0) {

                        for (var i = 0, il = info.length; i < il; i++) {
                            result.push(info[i].attributes);

                        }

                        document.getElementById("divResultadosConsultaOT").style.display = 'block';


                        document.getElementById("divOpcionesConsultaOT").style.display = 'none';

                        var jsonconvertido = JSON.stringify(result);
                        // De acuerdo a la opcion escogida por el usuario se llama a la Metodo de fichas normativas o consultar norma
                        if (selConsultaPorOT.value == "0") {
                            infoTemplate.setContent("<b>Número predial  : </b>${NUMEROPREDIAL}<br/>");
                            obtenerFichasNormativas(jsonconvertido);
                        } else if (selConsultaPorOT.value == "2") {
                            obtenerNorma(jsonconvertido);
                            infoTemplate.setContent("<b>Municipio : </b>${IDMUNICIPIO}<br/>");
                        } else {
                            document.getElementById('btnFichaPDF').style.visibility = 'hidden';
                            infoTemplate.setContent("<b>Número predial  : </b>${NUMEROPREDIAL}<br/>");
                        }
                        console.log(info.length);

                        document.getElementById('lblFeaturesOT').innerHTML = 'Se encontraron: ' + info.length + ' registros';
                        // Se muestran los poligonos del resultado de la consulta
                        var extent = esri.graphicsExtent(info);
                        extent = extent.expand(1.5);
                        appGlobal.map.setExtent(extent);


                        var symbol = symbol = new esri.symbol.SimpleFillSymbol(
                            esri.symbol.SimpleFillSymbol.STYLE_NULL,
                            new esri.symbol.SimpleLineSymbol(
                                esri.symbol.SimpleLineSymbol.STYLE_DASH,
                                new dojo.Color([255.0, 0.0, 0.0]), 4.0),
                            new dojo.Color([255.0, 0, 0.0, 1]));

                        
                      

                        for (var i in info) {
                            var graphic = info[i];
                            graphic.setInfoTemplate(infoTemplate);
                            graphic.setSymbol(symbol);
                            appGlobal.map.graphics.add(graphic);
                        }

                        hideLoader();
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
/**
*Metodo que se llama cuando el usuario hace la consulta por clasificacion del uso del suelo para mostrar la Norma
*@param {json} jsonconvertido
**/
function obtenerNorma(jsonconvertido) {

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
        if (valorsolo[0].indexOf("NORMAPDF") > -1) {
            fichaPdf = valorsolo[0].replace(/['"]+/g, '');
            fichasPdf.push(fichaPdf);
        }
    }
    if (fichasPdf.length > 0) {

        fichasPdf.sort(comparar);
        var SinDuplicados = [];
        var SinDuplicados = fichasPdf.filter(function (elem, pos) {
            return fichasPdf.indexOf(elem) == pos;
        });
        var urlFicha = "";
        urlFicha = ulrFichaGeneral + SinDuplicados[0];
        // muestra la norma si existen registros
        document.getElementById('btnFichaPDF').style.visibility = 'visible';
        createDialogPDFClaseDeSuelo(urlFicha);
    } else {
        // muestra un dialogo si no se encuentran registros
        document.getElementById('btnFichaPDF').style.visibility = 'hidden';
        titulo = "<B> Informaci&oacute;n </B>";
        contenido = "No existen normas";
        createDialogInformacionOT(titulo, contenido);
        
    }

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
        var SinDuplicados = fichasPdf.filter(function (elem, pos) {
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
function volverConsultaOT() {

   // var width = 350;
    //var height = 450;
    //ajustarPanelSimple(width, height)


    document.getElementById("divResultadosConsultaOT").style.display = 'none';


    document.getElementById("divOpcionesConsultaOT").style.display = 'block';

}
function verInfoOT() {

    console.log(urlPDF);
    var titulo = "<B> Ficha Normativa </B>";
    var contenido = "<iframe src='" + urlPDF + "' style='width: 100%;height: 450px;'>This browser does not support PDFs. Please download the PDF to view it: <a href='" + urlPDF + "'>Download PDF</a></iframe>";
    // muestra la norma si existen registros
    createDialogPDF(titulo, contenido);
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

        require(["dijit/Dialog", "dojo/domReady!"], function (Dialog) {
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
        require(["dijit/Dialog", "dojo/domReady!"], function (Dialog) {
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
        require(["dijit/Dialog", "dojo/domReady!"], function (Dialog) {
            dialogoPDF = new Dialog({
                title: "<B> Documento Norma: " + selGeneral.value + "</B>",
                content: "<iframe src='" + urlFicha + "' style='width: 100%;height: 450px;'>This browser does not support PDFs. Please download the PDF to view it: <a href='" + urlFicha + "'>Download PDF</a></iframe>",
                style: "width: 1000px; height:500px "
            });

            dialogoPDF.show();
            hideLoader();
        });
    }

    function limpiarOT() {
        document.getElementById("selConsultaPorOT").selectedIndex = "Seleccione...";
        document.getElementById("selMunicipioOT").selectedIndex = "Seleccione...";
        document.getElementById("selGeneral").selectedIndex = "Seleccione...";
        appGlobal.map.graphics.clear();
 


    }


