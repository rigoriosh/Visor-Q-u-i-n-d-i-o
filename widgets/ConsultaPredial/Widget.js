
var urlT = "";
var numeroPredial;
var map;
var muniNombre;
var tipo;
var tipoPredioN;
var resultado;
var appGlobal;
var extentInicial;
var jsonResultados;
var resultados;
var tipoS;
var fields = [];
var where;
define(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
    "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
    "esri/layers/FeatureLayer", 'dojo/query','dojo/dom-style',"dojo/domReady!"],
    function (declare, BaseWidget, DataSourceManager,
        Query, QueryTask, SpatialReference, FeatureLayer,dojoQuery,domStyle) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-consultaCatastral',


            // postCreate: function() {
            //   this.inherited(arguments);
            //console.log('postCreate');

            //},

            startup: function () {
                //  this.inherited(arguments);
                //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
                appGlobal = this;
                for (var i in ConsultaPredio) {
                    console.log(ConsultaPredio[i])
                    var option = $("<option></option>");
                    option.text(ConsultaPredio[i].id);
                    option.val(ConsultaPredio[i].id);
                    $("#selAnioConPredial").append(option);
                }

            },

            onOpen: function () {
                //alert("ENTRE");
                // console.log(urlSel);
                // document.getElementById("inputNumPredial").value = "";
                var panelCatastral = this.getPanel();
                panelCatastral.position.width = 350;
                panelCatastral.position.height = 230;
                panelCatastral._originalBox = {
                    w: panelCatastral.position.width,
                    h: panelCatastral.position.height,
                    l: panelCatastral.position.left || 0,
                    t: panelCatastral.position.top || 0
                };
                panelCatastral.setPosition(panelCatastral.position);
                panelCatastral.panelManager.normalizePanel(panelCatastral);

                for (var i = 0; i < (dojoQuery(".dojoxResizeHandle.dojoxResizeNW")).length; i++) {

                    domStyle.set(dojoQuery(".dojoxResizeHandle.dojoxResizeNW")[i],
                        'display',
                        'none');

                }

            },


            onClose: function () {
                console.log('onClose');
                LimpiarCatastral();

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

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
function buscarPredio() {
    appGlobal.map.graphics.clear();
    cerrarWidgetResultados();

    var infNum;
    var esCorrecto = true;
    var url;
    var anioSeleccionado = document.getElementById("selAnioConPredial").value;
    var tipoSueloSeleccionado = document.getElementById("selTipoSueloConPredial").value;

    var predial = document.getElementById("inputNumPredial").value;
    var tipoPredial;
    var tipoSuelo;

    var objetoConsultaPredioSeleccionado;
    for (var i in ConsultaPredio) {
        if (anioSeleccionado == ConsultaPredio[i].id) {
            objetoConsultaPredioSeleccionado = ConsultaPredio[i];
        }
    }


    if (predial != "") {

        if (document.getElementById('vDigitos').checked) {

            if (predial.length == 20) {
                var campoBusqueda = objetoConsultaPredioSeleccionado.campo_consulta_anterior;
                where = campoBusqueda + " = '" + predial + "'";

            } else {
                infNum = "20";
                esCorrecto = false;
            }


        } else if (document.getElementById('tDigitos').checked) {

            if (predial.length == 30) {
                var campoBusqueda = objetoConsultaPredioSeleccionado.campo_consulta;
                where = campoBusqueda + " = '" + predial + "'";


            } else {
                infNum = "30";
                esCorrecto = false;
            }

        }



        numeroPredial = predial;


        if (esCorrecto) {

            if (tipoSueloSeleccionado == 'capa_urbano') {
                url = objetoConsultaPredioSeleccionado.url + "/" + objetoConsultaPredioSeleccionado.capa_urbano;
            } else if (tipoSueloSeleccionado == 'capa_rural') {
                url = objetoConsultaPredioSeleccionado.url + "/" + objetoConsultaPredioSeleccionado.capa_urbano;
            }


            urlT = url;

            consultaCatastral(objetoConsultaPredioSeleccionado);
        } else {

            var titulo = "<B> Informaci&oacute;n </B>";
            var contenido = "El n&uacute;mero predial debe contener " + infNum + " d&iacute;gitos";
            createDialogInformacionGeneral(titulo, contenido);
        }


    } else {

        var titulo = "<B> Informaci&oacute;n </B>";
        var contenido = "Debe ingresar un c&oacute;digo predial para ejecutar la consulta";
        createDialogInformacionGeneral(titulo, contenido);

    }

}
function configureDropDownListsselMunicipio(selMunicipio) {

    appGlobal.map.graphics.clear();
    appGlobal.map.infoWindow.hide();
    appGlobal.map.setExtent(extentInicial);
}
function consultaCatastral(objetoConsultaPredioSeleccionado) {

    require([
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/tasks/QueryTask",
        "esri/tasks/query",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/InfoTemplate",
        "dojo/_base/Color",
        "esri/SpatialReference",
        "esri/layers/FeatureLayer",
        "esri/tasks/GeometryService",
        "esri/tasks/ProjectParameters",
        "esri/geometry/Extent",
        "esri/geometry/Point",
        "dojo/dom",
        "dojo/on",
        "dojo/domReady!"
    ], function (Map, ArcGISDynamicMapServiceLayer, QueryTask, Query, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, InfoTemplate,
        Color, SpatialReference, FeatureLayer, GeometryService, ProjectParameters, Extent, Point, dom, on) {

            var fichaNormativa = false;
            var queryTask = new QueryTask(urlT);

            queryTask = new QueryTask(urlT);
            query = new Query();
            query.returnGeometry = true;
            fields = ["NUMEROPREDIAL", "DIRECCION", "TIPO", "NOMBRE", "IDMUNICIPIO", "SHAPE.AREA", "SHAPE.LEN"];
            query.outFields = ["*"];
            query.OutSpatialReference = { wkid: appGlobal.map.spatialReference };
            //var q = tipoPredioN + " = '" + numeroPredial + "'" + " AND TIPOAVALUO = '" + tipoS + "'";
            //tipoPredioN = "NUMEROPREDIAL";
            // var q = tipoPredioN + " = '" + numeroPredial + "'";
            query.where = where;
            // where = q;
            console.log(where);

            if (objetoConsultaPredioSeleccionado.id == '2014') {
                fichaNormativa = true;
            }

            queryTask.execute(query, consultaPredialEjecutada);


            function consultaPredialEjecutada(featureSet) {

                if (featureSet.features.length <= 0) {
                    var titulo = "<B> Informaci&oacute;n </B>";
                    var contenido = "No se encontraron resultados";
                    createDialogInformacionGeneral(titulo, contenido);
                } else {

                    mostrarResultados(featureSet, fichaNormativa)

                }


            }

        });
}

/**
* Muestra el widget de la tabla de resultados.
*/
function mostrarResultados(featuresResultados, fichaNormativa) {
    require([
        "esri/map",
        "dojo/Deferred",
        "jimu/WidgetManager",
        "jimu/PanelManager",

    ], function (Map, Deferred, WidgetManager, PanelManager) {

        def = new Deferred();
        wm = WidgetManager.getInstance();
        WidgetTablaResultados = wm.getWidgetById('widgets_TablaContenido_Widget_19');
        if (WidgetTablaResultados == null) {
            console.log('Widget No esta cargado');
            confWidget = wm.appConfig.getConfigElementById('widgets_TablaContenido_Widget_19');
            console.log(confWidget);
            wm.loadWidget(confWidget).then(function () {
                PanelManager.getInstance().showPanel(confWidget).then(function () {
                    wm.openWidget(confWidget.id);
                    topic.publish("eventoTablaResultados",
                        {
                            featuresResultados: featuresResultados,
                            fichaNormativa: fichaNormativa

                        });
                    def.resolve();
                });
            });
        } else {
            console.log('Widget ya esta Cargado');
            PanelManager.getInstance().showPanel(WidgetTablaResultados).then(function () {
                wm.openWidget(WidgetTablaResultados);
                topic.publish("eventoTablaResultados",
                    {
                        featuresResultados: featuresResultados,
                        fichaNormativa: fichaNormativa
                    });
                def.resolve();
            })

        }
    });

}

function radioChange() {

    if (document.getElementById('vDigitos').checked) {

        document.getElementById("inputNumPredial").value = "";
        document.getElementById("inputNumPredial").maxLength = "20";
        // tipoPredioN = "NUMEROPREDIAL";
    } else if (document.getElementById('tDigitos').checked) {

        document.getElementById("inputNumPredial").value = "";
        document.getElementById("inputNumPredial").maxLength = "30";
        //tipoPredioN = "NUMEROPR_1";
    }

}
function test() {


    JSONToCSVConvertor(jsonResultados, "Consulta_Catastral", true);
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {

    JSONData = "[" + JSONData + "]";
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

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

    console.log(CSV);

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

function ajustarPanelCatastral(width, height) {

    require(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
        "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
        "esri/layers/FeatureLayer", "dojo/domReady!"],
        function (declare, BaseWidget, DataSourceManager,
            Query, QueryTask, SpatialReference, FeatureLayer) {


            var panelConsultaCatastral = appGlobal.getPanel();
            panelConsultaCatastral.position.width = width;
            panelConsultaCatastral.position.height = height;
            panelConsultaCatastral._originalBox = {
                w: panelConsultaCatastral.position.width,
                h: panelConsultaCatastral.position.height,
                l: panelConsultaCatastral.position.left || 0,
                t: panelConsultaCatastral.position.top || 0
            };
            // panel.setPosition(panel.position);
            panelConsultaCatastral.panelManager.normalizePanel(panelConsultaCatastral);




        });
}
function volverParametrosConsulta() {
    var width = 350;
    var height = 230;
    ajustarPanelCatastral(width, height)
    $("#divTablaConsultaCatastral").hide("fast");
    $("#divTablaCc").hide("fast");
    $("#divBuscarCatastral").show("fast");
    $("#consultarPredio").show("fast");

}
function LimpiarCatastral() {

    document.getElementById("inputNumPredial").value = "";
    cerrarWidgetResultados();
    appGlobal.map.graphics.clear();

}

function cerrarWidgetResultados() {


    require([
        "esri/map",
        "dojo/Deferred",
        "jimu/WidgetManager",
        "jimu/PanelManager",

    ], function (Map, Deferred, WidgetManager, PanelManager) {


        panelManager = PanelManager.getInstance();
        widgetCerrar = PanelManager.getInstance().getPanelById("widgets_TablaContenido_Widget_19_panel");
        for (var e in PanelManager.getInstance().panels) {
            if (PanelManager.getInstance().panels[e].id == "widgets_TablaContenido_Widget_19_panel") {
                widgetCerrar = PanelManager.getInstance().panels[e].id;
            }
        }
        if (widgetCerrar != undefined) {
            panelManager.closePanel("widgets_TablaContenido_Widget_19_panel");
            panelManager.destroyPanel("widgets_TablaContenido_Widget_19_panel");
        }


    });
}