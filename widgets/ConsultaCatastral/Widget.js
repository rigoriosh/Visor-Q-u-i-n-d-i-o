var esmatricula = false;
var urlT = "";
var numeroPredial;
var map;
var muniNombre;
var tipo;
var tipoPredioN;
var resultado;
var appGlobalCatastral;
var extentInicial;
var jsonResultados;
var resultados;
var tipoS;
var fields = [];
var where;
define(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
        "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
        "esri/layers/FeatureLayer", "dojo/domReady!"
    ],
    function(declare, BaseWidget, DataSourceManager,
        Query, QueryTask, SpatialReference, FeatureLayer) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here

            //baseClass: 'jimu-widget-mywidget',

            //this property is set by the framework when widget is loaded.
            //name: 'CustomWidget',


            //methods to communication with app container:

            // postCreate: function() {
            //   this.inherited(arguments);
            //console.log('postCreate');

            //},

            startup: function() {
                //  this.inherited(arguments);
                //this.mapIdNode.innerHTML = 'map id:' + this.map.id;


                mostrarResultados(this);
                $('#widgets_ConsultaCatastral_Widget_37_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza la consulta catastral con par&aacute;metros de entrada"></div>');

            },

            onOpen: function() {

                $("#divTablaConsultaCatastral").hide("fast");
                $("#divTablaCc").hide("fast");
                $("#divBuscarCatastral").show("fast");
                $("#consultarPredio").show("fast");
                document.getElementById("inputNumPredial").value = "";
                var panelCatastral = this.getPanel();
                panelCatastral.position.width = 380;
                panelCatastral.position.height = 289;
                panelCatastral._originalBox = {
                    w: panelCatastral.position.width,
                    h: panelCatastral.position.height,
                    l: panelCatastral.position.left || 0,
                    t: panelCatastral.position.top || 0
                };
                panelCatastral.setPosition(panelCatastral.position);
                panelCatastral.panelManager.normalizePanel(panelCatastral);
                document.getElementById('lblConsultaCatastral').innerHTML = 'Número predial:';

            },
            bindEvents: function() {

                // console.log("bindEvents")

            },
            onExecute: function(featureSet) {
                //console.log("onExecute")
            },
            onClose: function() {
                console.log('onClose');
                LimpiarCatastral();
                var width = 380;
                var height = 289;
                // ajustarPanelCatastral(width, height);
                document.getElementById("divTablaConsultaCatastral").style.display = 'none';
                document.getElementById("divTablaCc").style.display = 'none';
                document.getElementById("divBuscarCatastral").style.display = 'block';
                document.getElementById("consultarPredio").style.display = 'block';


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
    //  var charCode = (evt.which) ? evt.which : event.keyCode
    // if (charCode > 31 && (charCode < 48 || charCode > 57))
    //  return false;
    //return true;
}

function buscarPredio() {

    var infNum = "0";
    var esCorrecto = true;
    var seleccionadoM = document.getElementById("selMunicipio");
    var seleccionadoTipo = document.getElementById("selTipoSuelo");
    var dep = "63";
    var predial = document.getElementById("inputNumPredial").value;
    var tipoPredial;
    var tipoSuelo;

    var idmatricula = "";
    if (selMunicipio.value != "Seleccione..." && selTipoSuelo.value != "Seleccione...") {

        if (document.getElementById('vDigitos').checked) {
            tipoPredial = document.getElementById('vDigitos').value;
            tipoPredioN = "NUMEROPREDIAL";
        } else if (document.getElementById('tDigitos').checked) {
            tipoPredial = document.getElementById('tDigitos').value;
            tipoPredioN = "NUMEROPREDIAL1";
        } else if (document.getElementById('rmatricula').checked) {
            tipoPredioN = "MATRICULA_INMOBILIARIA";
            //tipoPredioN = "NUMEROPREDIAL";
        }

        if (seleccionadoTipo[seleccionadoTipo.selectedIndex].value == "01") {
            tipo = "Urbano";
            tipoSuelo = "01";
            tipoS = tipoSuelo;
        } else {
            tipo = "Rural";
            tipoSuelo = "00";
            tipoS = tipoSuelo;
        }
        if (document.getElementById('rmatricula').checked) {
            esCorrecto = true;
            esmatricula = true;
            if (seleccionadoM[seleccionadoM.selectedIndex].value == "0") {
                dep = dep + "001";
                muniNombre = "Armenia";

                idmatricula = "12";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "1") {
                dep = dep + "111";
                muniNombre = "Buenavista";
                idmatricula = "13";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "2") {
                dep = dep + "130";
                muniNombre = "Calarcá";
                idmatricula = "14";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "3") {
                dep = dep + "190";
                muniNombre = "Circasia";
                idmatricula = "15";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "4") {
                dep = dep + "212";
                muniNombre = "Córdoba";
                idmatricula = "16";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "5") {
                dep = dep + "272";
                muniNombre = "Filandia";
                idmatricula = "17";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "6") {
                dep = dep + "302";
                muniNombre = "Génova";
                idmatricula = "18";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "7") {
                dep = dep + "401";
                muniNombre = "Tebaida";
                idmatricula = "19";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "8") {
                dep = dep + "470";
                muniNombre = "Montenegro";
                idmatricula = "20";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "9") {
                dep = dep + "548";
                muniNombre = "Pijao";
                idmatricula = "21";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "10") {
                dep = dep + "594";
                muniNombre = "Quimbaya";
                idmatricula = "22";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "11") {
                dep = dep + "690";
                muniNombre = "Salento";
                idmatricula = "23";
            }

        } else if (document.getElementById('vDigitos').checked) {

            esmatricula = false;

            predial = document.getElementById("inputNumPredial").value;
            //predial = dep + document.getElementById("numPredial").value + "000";
            if (seleccionadoM[seleccionadoM.selectedIndex].value == "0") {
                dep = dep + "001";
                muniNombre = "Armenia";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "1") {
                dep = dep + "111";
                muniNombre = "Buenavista";
            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "2") {
                dep = dep + "130";
                muniNombre = "Calarcá";

            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "3") {
                dep = dep + "190";
                muniNombre = "Circasia";

            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "4") {
                dep = dep + "212";
                muniNombre = "Córdoba";

            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "5") {
                dep = dep + "272";
                muniNombre = "Filandia";

            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "6") {
                dep = dep + "302";
                muniNombre = "Génova";

            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "7") {
                dep = dep + "401";
                muniNombre = "Tebaida";

            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "8") {
                dep = dep + "470";
                muniNombre = "Montenegro";

            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "9") {
                dep = dep + "548";
                muniNombre = "Pijao";

            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "10") {
                dep = dep + "594";
                muniNombre = "Quimbaya";

            } else if (seleccionadoM[seleccionadoM.selectedIndex].value == "11") {
                dep = dep + "690";
                muniNombre = "Salento";

            }


            numeroPredial = predial;

            if (predial.length == 15) {
                esCorrecto = true;
            } else {
                infNum = "15";
                esCorrecto = false;
            }


        } else if (document.getElementById('tDigitos').checked) {
            esmatricula = false;
            if (predial.length == 25) {
                esCorrecto = true;
            } else {
                infNum = "25";
                esCorrecto = false;
            }
            numeroPredial = predial;
        }



        numeroPredial = predial;



        var url = SERVICIO_CATASTRO_NUEVO;
        if (esmatricula) {
            url = url + "/" + idmatricula;
            urlT = url;
        } else {
            url = url + "/" + seleccionadoM[seleccionadoM.selectedIndex].value;
            urlT = url;
        }


        if (esCorrecto) {

            consultaCatastral();
        } else {

            var titulo = "<B> Informaci&oacute;n </B>";
            var contenido = "El n&uacute;mero predial debe contener " + infNum + " d&iacute;gitos";
            createDialogInformacionConsultaCatastral(titulo, contenido);
        }

    } else {

        var titulo = "<B> Informaci&oacute;n </B>";
        var contenido = "Por favor seleccione todos los campos";
        createDialogInformacionConsultaCatastral(titulo, contenido);

    }

}

function configureDropDownListsselMunicipio(selMunicipio) {

    appGlobalCatastral.map.graphics.clear();
    //  appGlobalCatastral.map.infoWindow.hide();
    //  appGlobalCatastral.map.setExtent(extentInicial);
}

function consultaCatastral() {

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
    ], function(Map, ArcGISDynamicMapServiceLayer, QueryTask, Query, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, InfoTemplate,
        Color, SpatialReference, FeatureLayer, GeometryService, ProjectParameters, Extent, Point, dom, on) {


        var queryTask = new QueryTask(urlT);

        queryTask = new QueryTask(urlT);
        query = new Query();
        query.returnGeometry = true;
        fields = ["NUMEROPREDIAL", "DIRECCION", "TIPO", "NOMBRE", "IDMUNICIPIO", "SHAPE.AREA", "SHAPE.LEN"];
        query.outFields = ["*"];
        query.OutSpatialReference = { wkid: appGlobalCatastral.map.spatialReference };
        //var q = tipoPredioN + " = '" + numeroPredial + "'" + " AND TIPOAVALUO = '" + tipoS + "'";
        //tipoPredioN = "NUMEROPREDIAL";
        var q = tipoPredioN + " = '" + numeroPredial + "'";
        query.where = q;
        console.log(q);
        where = q;
        console.log(tipoPredioN + " = '" + numeroPredial + "'");
        infoTemplate = new InfoTemplate("Consulta Catastral");
        symbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_NULL,
            new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_DASH,
                new dojo.Color([255.0, 0.0, 0.0]), 4.0),
            new dojo.Color([255.0, 0, 0.0, 1]));






        queryTask.execute(query, mostrarTablaConsultaCatastral);




        function mostrarTablaConsultaCatastral(featureSet) {

            console.log(featureSet);
            if (featureSet.features.length <= 0) {

                var titulo = "<B> Informaci&oacute;n </B>";
                var contenido = "No se encontraron resultados";
                createDialogInformacionConsultaCatastral(titulo, contenido);
            } else {

                console.log(featureSet.features);
                appGlobalCatastral.map.graphics.clear();
                var features = featureSet.features;
                var graphic = features[0];
                console.log(features[0]);
                graphic.setSymbol(symbol);

                var spatialRef1 = new SpatialReference(3115);
                var extent = esri.graphicsExtent(features);

                var extentconver = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, spatialRef1);
                extentconver = extentconver.expand(0.0000000000001);
                console.log("prueba: ");
                console.log(features[0].geometry);
                //appGlobalCatastral.map.setExtent(extentconver);

                var puntoCatastral = new Point(extent.xmin, extent.ymin, appGlobalCatastral.map.spatialReference);

                appGlobalCatastral.map.setScale(2000);
                appGlobalCatastral.map.centerAt(puntoCatastral);

                infoTemplate.setContent("<b>Numero predial : </b>${NUMEROPREDIAL}<br/>" +
                    "<b>Dirección: </b>${DIRECCION}<br/>" +
                    "<b>Tipo: </b> " + tipo + "<br/>" +
                    "<b>Municipio: </b> " + muniNombre + "<br/>" +
                    "<b>Cód. Municipio: </b>${IDMUNICIPIO}<br/>" +
                    "<b>Área (m²): </b>${SHAPE.AREA}<br/>" +
                    "<b>Perímetro (m): </b>${SHAPE.LEN}" +
                    "<div align='right'><input type='button' value='Exportar' onclick='test()'></div>");



                graphic.setInfoTemplate(infoTemplate);
                appGlobalCatastral.map.graphics.add(graphic);

                var resultados = featureSet.features[0].attributes;
                var jsonconvertio = JSON.stringify(resultados);
                jsonResultados = jsonconvertio;

                require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                    function(lang, DataGrid, ItemFileWriteStore, dom) {

                        $("#divTablaConsultaCatastral").show("fast");
                        $("#divTablaCc").show("fast");


                        $("#divBuscarCatastral").hide("fast");
                        $("#consultarPredio").hide("fast");

                        var width = 590;
                        var height = 250;
                        ajustarPanelCatastral(width, height);


                        var layout = [
                            [
                                { 'name': 'Número predial (20)', 'field': 'col1', 'width': '120px', noresize: true },
                                { 'name': 'Número predial (30)', 'field': 'col2', 'width': '120px', noresize: true },
                                { 'name': 'Dirección', 'field': 'col3', 'width': '120px', noresize: true },
                                { 'name': 'Tipo', 'field': 'col4', 'width': '60px', noresize: true },
                                { 'name': 'Municipio', 'field': 'col5', 'width': '100px', noresize: true },
                                { 'name': 'Cód. Municipio', 'field': 'col6', 'width': '60px', noresize: true },
                                { 'name': 'Área (m²)', 'field': 'col7', 'width': '120px', noresize: true },
                                { 'name': 'Perímetro (m)', 'field': 'col8', 'width': '120px', noresize: true }
                            ]
                        ];




                        var dataCata = {
                            identifier: "id",
                            items: []
                        };
                        var data_list_catastral = [],
                            data_listExportar_Catastral = [];
                        var featuresResultConsultaCatastral = featureSet.features;
                        if (esmatricula) {

                            var layout = [
                                [
                                    { 'name': 'Número predial (20)', 'field': 'col1', 'width': '120px', noresize: true },
                                    { 'name': 'Número predial (30)', 'field': 'col2', 'width': '120px', noresize: true },
                                    { 'name': 'Matrícula inmobilaria', 'field': 'col3', 'width': '120px', noresize: true },
                                    { 'name': 'Tipo', 'field': 'col4', 'width': '60px', noresize: true },
                                    { 'name': 'Municipio', 'field': 'col5', 'width': '100px', noresize: true },
                                    { 'name': 'Cód. Municipio', 'field': 'col6', 'width': '60px', noresize: true },
                                    { 'name': 'Área (m²)', 'field': 'col7', 'width': '120px', noresize: true },
                                    { 'name': 'Perímetro (m)', 'field': 'col8', 'width': '120px', noresize: true }
                                ]
                            ];

                            for (var i = 0; i < 1; i++) {
                                dataCata.items.push(lang.mixin({ id: i }, {
                                    col1: featuresResultConsultaCatastral[i].attributes.NUMEROPREDIAL,
                                    col2: featuresResultConsultaCatastral[i].attributes.NUMEROPREDIAL1,
                                    col3: featuresResultConsultaCatastral[i].attributes.MATRICULA_INMOBILIARIA,
                                    col4: featuresResultConsultaCatastral[i].attributes.TIPO,
                                    col5: featuresResultConsultaCatastral[i].attributes.NOMBRE,
                                    col6: featuresResultConsultaCatastral[i].attributes.NPMUNICIPIO,
                                    col7: featuresResultConsultaCatastral[i].attributes.SHAPE_AREA,
                                    col8: featuresResultConsultaCatastral[i].attributes.SHAPE_PERIMETRO
                                }));
                            }
                        } else {
                            var layout = [
                                [
                                    { 'name': 'Número predial (20)', 'field': 'col1', 'width': '120px', noresize: true },
                                    { 'name': 'Número predial (30)', 'field': 'col2', 'width': '120px', noresize: true },
                                    { 'name': 'Dirección', 'field': 'col3', 'width': '120px', noresize: true },
                                    { 'name': 'Tipo', 'field': 'col4', 'width': '60px', noresize: true },
                                    { 'name': 'Municipio', 'field': 'col5', 'width': '100px', noresize: true },
                                    { 'name': 'Cód. Municipio', 'field': 'col6', 'width': '60px', noresize: true },
                                    { 'name': 'Área (m²)', 'field': 'col7', 'width': '120px', noresize: true },
                                    { 'name': 'Perímetro (m)', 'field': 'col8', 'width': '120px', noresize: true }
                                ]
                            ];


                            for (var i = 0; i < 1; i++) {
                                dataCata.items.push(lang.mixin({ id: i }, {
                                    col1: featuresResultConsultaCatastral[i].attributes.NUMEROPREDIAL,
                                    col2: featuresResultConsultaCatastral[i].attributes.NUMEROPREDIAL1,
                                    col3: featuresResultConsultaCatastral[i].attributes.DIRECCION,
                                    col4: featuresResultConsultaCatastral[i].attributes.TIPO,
                                    col5: featuresResultConsultaCatastral[i].attributes.NOMBRE,
                                    col6: featuresResultConsultaCatastral[i].attributes.NPMUNICIPIO,
                                    col7: featuresResultConsultaCatastral[i].attributes.SHAPE_AREA,
                                    col8: featuresResultConsultaCatastral[i].attributes.SHAPE_PERIMETRO
                                }));
                            }
                        }
                        console.log(dataCata);

                        var rows = data_list_catastral.length
                            //for (var i = 0, l = data_list_catastral.length; i < rows; i++) {
                            //data.items.push(lang.mixin({ id:  1 }, data_list_catastral[0]));
                            //}

                        console.log(dataCata);
                        var store = new ItemFileWriteStore({ data: dataCata });
                        console.log(store);
                        if (dijit.byId("gridConsultaCatastral") != undefined) {
                            dijit.byId("gridConsultaCatastral").destroy();
                        }

                        var gridCatastral = new DataGrid({
                            id: 'gridConsultaCatastral',
                            store: store,
                            structure: layout,
                            rowSelector: '10px',
                            style: "width: 560px;",
                            selectionMode: 'single',
                            canSort: function(col) {
                                return false;
                            }
                        });


                        gridCatastral.placeAt("divTablaCc");

                        gridCatastral.startup();
                        gridCatastral.set('autoHeight', false);
                        gridCatastral.set('autoWidth', false);
                        gridCatastral.update();
                        gridCatastral.set('autoWidth', false);

                        //console.log(grid);

                        //$("#divTablaConsultaCatastral").show("fast");
                        //document.getElementById("labelGeneral").style.display = 'inline';


                        /*
                        data_listExportar_Catastral[i] = {
                            NUMEROPREDIAL: featuresResultConsultaCatastral[i].attributes.NUMEROPREDIAL,
                            NUMEROPREDIAL1: featuresResultConsultaCatastral[i].attributes.NUMEROPREDIAL1,
                            DIRECCION: featuresResultConsultaCatastral[i].attributes.DIRECCION,
                            TIPO: featuresResultConsultaCatastral[i].attributes.TIPO,
                            NOMBRE: featuresResultConsultaCatastral[i].attributes.NOMBRE,
                            NPMUNICIPIO: featuresResultConsultaCatastral[i].attributes.NPMUNICIPIO
                            
                        };
                        */




                    });
            }


        }

    });
}

function radioChange() {

    if (document.getElementById('vDigitos').checked) {

        document.getElementById('lblConsultaCatastral').innerHTML = 'Número predial:';
        document.getElementById("inputNumPredial").value = "";
        document.getElementById("inputNumPredial").maxLength = "15";
        document.getElementById("nota").innerHTML = "ejemplo Finlandia, Rural: 000000030326000"
        document.getElementById("inputNumPredial").type = "number";
        // tipoPredioN = "NUMEROPREDIAL";
    } else if (document.getElementById('tDigitos').checked) {
        document.getElementById('lblConsultaCatastral').innerHTML = 'Número predial:';
        document.getElementById("inputNumPredial").value = "";
        document.getElementById("inputNumPredial").maxLength = "25";
        //tipoPredioN = "NUMEROPR_1";
        document.getElementById("nota").innerHTML = "ejemplo Finlandia, Rural: 0000000000030328000000000";
        document.getElementById("inputNumPredial").type = "number";
    } else if (document.getElementById('rmatricula').checked) {
        document.getElementById("nota").innerHTML = "ejemplo Finlandia, Rural: 0002001001284-4133";
        document.getElementById("inputNumPredial").type = "text";
        document.getElementById('lblConsultaCatastral').innerHTML = 'Matrícula inmobilaria:';
        document.getElementById("inputNumPredial").maxLength = "18";
        require(["dijit/Tooltip", "dojo/dom", "dojo/on", "dojo/mouse", "dojo/domReady!"], function(Tooltip, dom, on, mouse) {
            var node = dom.byId('inputNumPredial');
            Tooltip.show("Tener en cuenta el guion(-) ", node);
            on.once(node, mouse.leave, function() {
                Tooltip.hide(node);
            })
        })
    }
    // document.getElementById("labelConsultaCatastral").style.display = 'inline';
    // document.getElementById("inputNumPredial").style.display = 'inline';
}

function test() {


    exportarACsvGeneral(jsonResultados, "Consulta_Catastral", true);
}

function createDialogInformacionConsultaCatastral(titulo, contenido) {

    require(["dijit/Dialog", "dojo/domReady!"], function(Dialog) {
        myDialogOT = new Dialog({
            title: titulo,
            content: contenido
                // style: "width: 400px"
        });

        myDialogOT.show();
    });

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

function mostrarResultados(aplicacion) {
    appGlobalCatastral = aplicacion;
    extentInicial = null;
    extentInicial = appGlobalCatastral.map.extent;

}

function ajustarPanelCatastral(width, height) {

    require(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager',
            "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference",
            "esri/layers/FeatureLayer", "dojo/domReady!"
        ],
        function(declare, BaseWidget, DataSourceManager,
            Query, QueryTask, SpatialReference, FeatureLayer) {


            var panelConsultaCatastral = appGlobalCatastral.getPanel();
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

function volverConsulta() {
    var width = 380;
    var height = 289;

    ajustarPanelCatastral(width, height)
    $("#divTablaConsultaCatastral").hide("fast");
    $("#divTablaCc").hide("fast");
    $("#divBuscarCatastral").show("fast");
    $("#consultarPredio").show("fast");

}

function LimpiarCatastral() {

    document.getElementById("inputNumPredial").value = "";
    document.getElementById("selMunicipio").selectedIndex = "Seleccione...";
    document.getElementById("selTipoSuelo").selectedIndex = "Seleccione...";
    appGlobalCatastral.map.graphics.clear();
    document.getElementById("divTablaCc").value = "";
}