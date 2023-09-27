/**
 * @file Widget consulta socioeconomica
 * @author Carlos Corzo <carlos.corzo@igac.gov.co>
 * @version 0.1
 * 
 * CHANGELOG
 *  0.1 - Carlos Corzo - Version incial del widget con al consulta socioeconomica funcional.
 * 
 */

var capaGeneral = "";
var config;
var LeyendaSocioeconomicaWidget;
var panelSocioeconomica;
var featuresResultPoblacion;
var simbologiaAnterior;
var idGraficaSeleccionadaSocioeconomica;
var anioSeleccionado;
var municipioSeleccionado;
var idMunicipioSeleccionado;
var posicionMunicipioSeleccionado = 0;
var datosMunicipioSeleccionado = [];
var contadorGraficas = 0;
var graficaAnterior;
var tablaAnterior;
var graficasPoblacion = [];
var tablasPoblacion = [];
var funcionClickGrafica;

define(['dojo/_base/declare',
    'jimu/BaseWidget',
    'jimu/DataSourceManager',
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/SpatialReference",
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/Color',
    "esri/layers/FeatureLayer",
    "jimu/WidgetManager",
    "jimu/PanelManager",
    "dojo/Deferred",
    'dojo/query',
    "dojo/topic",
    'dojo/_base/lang',
    "dojox/charting/Chart",
    "dojox/charting/axis2d/Default",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/plot2d/Columns",
    "dojox/charting/plot2d/ClusteredBars",
    "dojox/charting/plot2d/ClusteredColumns",
    "dojox/charting/plot2d/StackedColumns",
    "dojox/charting/plot2d/Bars",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/themes/Tufte",
    "dojo/fx/easing",
    "dojox/charting/widget/Legend",
    "dojo/ready",
    'dojox/grid/DataGrid',
    'dojo/data/ItemFileWriteStore',
    'dojo/dom',
    'dojo/dom-style',
    "dojo/domReady!"
],
    function (declare,
        BaseWidget,
        DataSourceManager,
        Query,
        QueryTask,
        SpatialReference,
        SimpleFillSymbol,
        SimpleLineSymbol,
        Color,
        FeatureLayer,
        WidgetManager,
        PanelManager,
        Deferred,
        dojoQuery,
        topic,
        lang,
        Chart,
        Default,
        Lines,
        Columns,
        ClusteredBars,
        ClusteredColumns,
        StackedColumns,
        Bars,
        Tooltip,
        Tufte,
        easing,
        Legend,
        ready,
        DataGrid,
        ItemFileWriteStore,
        dom,
        domStyle
    ) {
        return declare([BaseWidget], {

            // postCreate: function() {
            //},

            startup: function () {
                config = this.config;
                panelSocioeconomica = this.getPanel();
                registrarFunciones();
                ajustarTamanioWidget(panelSocioeconomica,410,330);
                llenarConsultaPor();
                // $('#widgets_ConsultaSocioeconomica_Widget_panel').find(".title").find(".min-icon").before('<div style"display: -webkit-inline-box;float: right;margin-top: 2px;" ><img src="/images/i_help.png"  style="" width="20" height="20"></div>');

                $('#widgets_ConsultaSocioeconomica_Widget_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza la consulta de la tematica socioeconomica"></div>');
                $('#btnGraficaAnteriorSocioeconomica').hide();
            },



            onOpen: function () {
                ajustarTamanioWidget(panelSocioeconomica,410,330);
                mostarConsulta();
            },
            // bindEvents: function () {
            // },
            // onExecute: function (featureSet) {
            // },
            onClose: function () {
                map.graphics.clear();
                limpiarSelects();
                cerrarWidgetLeyenda();

            },

            // onMinimize: function(){
            // },

            // onMaximize: function(){
            // },

            // onPositionChange: function(){
            // },

            // resize: function () {
            // },
            /**
             * Funcion para ajustar el tamanio del widget para mostrar las opciones de busqueda.
             */
            // ajustarTamanioWidget: function (width,height) {

            //     panelSocioeconomica.position.width = width;
            //     panelSocioeconomica.position.height = height;
            //     panelSocioeconomica._originalBox = {
            //         w: panelSocioeconomica.position.width,
            //         h: panelSocioeconomica.position.height,
            //         l: panelSocioeconomica.position.left || 0,
            //         t: panelSocioeconomica.position.top || 0
            //     };
            //     panelSocioeconomica.setPosition(panelSocioeconomica.position);

            //     for (var i = 0; i < (dojoQuery(".dojoxResizeHandle.dojoxResizeNW")).length; i++) {

            //         domStyle.set(dojoQuery(".dojoxResizeHandle.dojoxResizeNW")[i],
            //           'display',
            //           'none');
          
            //       }
            // }

            
        });

        /**
         * Registra las funciones temporalmente que usan jquery.
         * 
         */
        function registrarFunciones() {


            /**
             * Funcion para llenar los elementos de busqueda a partitir de la seleccion de la primera opcion de busqueda.
             */
            $('#selConsultaSocioeconomica').change(function () {
                var seleccionado = $('#selConsultaSocioeconomica').val();

                $('#btnBuscarSocioeconomica').prop('disabled', false);

                $('#selAnioSocioeconomica').prop('disabled', true);
                $('#selTipoDesplazadoSocioeconomica').prop('disabled', true);
                $('#selTipoIndicadorSocioeconomica').prop('disabled', true);
                $('#selTipoServicioSocioeconomica').prop('disabled', true);

                $("#selTipoDesplazadoSocioeconomica").prop('selectedIndex', 0);
                $("#selTipoIndicadorSocioeconomica").prop('selectedIndex', 0);
                $("#selTipoServicioSocioeconomica").prop('selectedIndex', 0);
                $("#selAnioSocioeconomica").prop('selectedIndex', 0);

                switch (seleccionado) {

                    case "Población":

                        var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + config.consultaAnioPoblacion;
                        capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                        var capaGeneral = capaCompleta;

                        var queryTask = new QueryTask(capaCompleta);
                        var query = new Query();
                        query.outFields = ["ANIO"];
                        query.where = "1=1";
                        query.returnGeometry = false;
                        queryTask.execute(query, resultadoConsultaAnio);

                        function resultadoConsultaAnio(featureSet) {
                            var anios = [];
                            var featureResultados = featureSet.features;
                            for (var i in featureResultados) {
                                anios.push(featureResultados[i].attributes.ANIO);
                            }
                            anios.sort();
                            insertarGeneral(selAnioSocioeconomica, removerDuplicadosArrayString(anios));
                            $('#selAnioSocioeconomica').prop('disabled', false)
                        }
                        break;
                    case "Desplazados":

                        $('#selTipoDesplazadoSocioeconomica').prop('disabled', false);
                        $('#selAnioSocioeconomica').prop('disabled', false);
                        $('#btnBuscarSocioeconomica').prop('disabled', true);
                        break;
                    case "Necesidades Básicas Insatisfechas (NBI)":

                        var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + config.idCapaConsultaAnioNBI;
                        capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                        var capaGeneral = capaCompleta;

                        var queryTask = new QueryTask(capaCompleta);
                        var query = new Query();
                        query.outFields = ["ANIO"];
                        query.where = "1=1";
                        query.returnGeometry = false;
                        queryTask.execute(query, resultadoConsultaAnio);

                        function resultadoConsultaAnio(featureSet) {
                            var anios = [];
                            var featureResultados = featureSet.features;
                            for (var i in featureResultados) {
                                anios.push(featureResultados[i].attributes.ANIO);
                            }
                            anios.sort();
                            insertarGeneral(selAnioSocioeconomica, removerDuplicadosArrayString(anios));
                            $('#selAnioSocioeconomica').prop('disabled', false)
                        }
                        break;
                    case "Indicadores Socieconómicos":

                        $('#selTipoIndicadorSocioeconomica').prop('disabled', false)
                        $('#selAnioSocioeconomica').prop('disabled', false)
                        break;
                    case "Cobertura de Servicios Públicos":

                        $('#selTipoServicioSocioeconomica').prop('disabled', false)
                        $('#selAnioSocioeconomica').prop('disabled', false)

                        var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + config.idCapaConsultaServiciosPublicos;
                        capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                        var capaGeneral = capaCompleta;

                        var queryTask = new QueryTask(capaCompleta);
                        var query = new Query();
                        query.outFields = ["SERVICIO_PUBLICO"];
                        query.where = "1=1";
                        query.returnGeometry = false;
                        queryTask.execute(query, resultadoConsultaServicios);

                        function resultadoConsultaServicios(featureSet) {
                            var servicios = [];
                            var featureResultados = featureSet.features;
                            for (var i in featureResultados) {
                                servicios.push(featureResultados[i].attributes.SERVICIO_PUBLICO);
                            }
                            insertarGeneral(selTipoServicioSocioeconomica, removerDuplicadosArrayString(servicios));
                            $('#selAnioSocioeconomica').prop('disabled', true)
                        }


                        break;
                    case "Seleccione...":
                    default:
                        console.log(seleccionado);
                        $('#btnBuscarSocioeconomica').prop('disabled', true);
                }
            });



            /**
             * Busca de acuerdo a las opciones seleccionadas
             */
            $('#btnBuscarSocioeconomica').click(function () {



                var seleccionado = $('#selConsultaSocioeconomica').val();
                var sWhere = "";
                switch (seleccionado) {

                    case "Población":
                        if (selAnioSocioeconomica.value != -1) {
                            var fieldQuery = "ANIO"
                            var anioSel = $('#selAnioSocioeconomica').val();
                            //  sWhere = "translate(upper(" + fieldQuery + "), 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU') LIKE translate( '%" + anioSel.toUpperCase() + "%', 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU')";

                            sWhere = fieldQuery + " LIKE " +"'%" + anioSel.toUpperCase() + "%'";
                            consultar(sWhere, config.idCapaConsultaPoblacion, seleccionado);
                        } else {
                            createDialogInformacionGeneral("Atención", "Seleccione todos los atributos de busqueda.");
                        }
                        break;


                    case "Necesidades Básicas Insatisfechas (NBI)":
                        if (selAnioSocioeconomica.value != -1) {
                            var fieldQuery = "ANIO"
                            var anioSel = $('#selAnioSocioeconomica').val();
                            //  sWhere = "translate(upper(" + fieldQuery + "), 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU') LIKE translate( '%" + anioSel.toUpperCase() + "%', 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU')";
                            sWhere = fieldQuery + " LIKE " +"'%" + anioSel.toUpperCase() + "%'";
                            consultar(sWhere, config.idCapaConsultaAnioNBI, seleccionado);
                        } else {
                            createDialogInformacionGeneral("Atención", "Seleccione todos los atributos de busqueda.");
                        }
                        break;

                    case "Desplazados":
                        if (selTipoDesplazadoSocioeconomica.value != -1 && selAnioSocioeconomica.value != -1) {
                            var idCapaDesplazado = $('#selTipoDesplazadoSocioeconomica').val();
                            var fieldQuery = "ANIO"
                            var anioSel = $('#selAnioSocioeconomica').val();
                            // sWhere = "translate(upper(" + fieldQuery + "), 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU') LIKE translate( '%" + anioSel.toUpperCase() + "%', 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU')";
                            sWhere = fieldQuery + " LIKE " +"'%" + anioSel.toUpperCase() + "%'";
                            consultar(sWhere, idCapaDesplazado, seleccionado);
                        } else {
                            createDialogInformacionGeneral("Atención", "Seleccione todos los atributos de busqueda.");
                        }
                        break;

                    case "Indicadores Socieconómicos":
                        if (selTipoIndicadorSocioeconomica.value != -1 && selAnioSocioeconomica.value != -1) {
                            var idCapaTipoIndicador = $('#selTipoIndicadorSocioeconomica').val();
                            var fieldQuery = "ANIO"
                            var anioSel = $('#selAnioSocioeconomica').val();
                            //sWhere = "translate(upper(" + fieldQuery + "), 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU') LIKE translate( '%" + anioSel.toUpperCase() + "%', 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU')";
                            sWhere = fieldQuery + " LIKE " +"'%" + anioSel.toUpperCase() + "%'";
                            consultar(sWhere, idCapaTipoIndicador, seleccionado);
                        } else {
                            createDialogInformacionGeneral("Atención", "Seleccione todos los atributos de busqueda.");
                        }
                        break;

                    case "Cobertura de Servicios Públicos":
                        if (selTipoServicioSocioeconomica.value != -1 && selAnioSocioeconomica.value != -1) {
                            var idCapaTipoIndicador = config.idCapaConsultaServiciosPublicos;
                            var anioSel = $('#selAnioSocioeconomica').val();
                            var tipoConsulta = "SERVICIO_PUBLICO";
                            var tipoServicio = $('#selTipoServicioSocioeconomica').val();

                           /* sWhere = "translate(upper(" + "ANIO" + "), 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU') = translate( '"
                                + anioSel + "', 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU') AND translate(upper("
                                + tipoConsulta + "), 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU') = translate( '"
                                + tipoServicio.toUpperCase() + "', 'ÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÂÊÎÔÛ', 'AEIOUAEIOUAEIOUAEIOU')";*/

                            //fieldQuery + " LIKE " +"'%" + anioSel.toUpperCase() + "%'";
                            sWhere = "ANIO LIKE "+"'%" +anioSel+ "%'"+ " AND "+ tipoConsulta +" LIKE '%" +tipoServicio+ "%'";
                            consultar(sWhere, idCapaTipoIndicador, seleccionado);
                        } else {
                            createDialogInformacionGeneral("Atención", "Seleccione todos los atributos de busqueda.");
                        }
                        break;
                }

            });
            /**
             * Limpia los graficos y se devuelve a las opciones de la consulta.
             */
            $('#btnLimpiarSocioeconomica, #btnLimpiarConsultaSocioeconomica').click(function () {
                map.graphics.clear();
                contadorGraficas = 0;
                posicionMunicipioSeleccionado = 0;
                $('#btnGraficaAnteriorSocioeconomica').hide();
                $('#btnGraficaSiguienteSocioeconomica').show();

                $('#tituloTablaConsulta').hide("fast");
                dojo.disconnect(funcionClickGrafica);
                limpiarSelects();
                cerrarWidgetLeyenda();
                mostarConsulta();
            });
                        /**
             * Regresa a las opciones de la consulta.
             */
            $('#btnRegresarComsultaSocioeconomica').click(function () {

                mostarConsulta();


            });
            /**
             * Carga la siguiente grafica de acuerdo al municipio seleccionado
             */
            $('#btnGraficaSiguienteSocioeconomica').click(function () {
                cargarSiguienteGraficaTabla();
            });
            /**
             * Carga la anterior grafica de acuerdo al municipio seleccionado
             */
            $('#btnGraficaAnteriorSocioeconomica').click(function () {
                cargarAnteriorGraficaTabla();
            });

            /**
             * Exporta la tabla de datos a formato csv.
             */
            $('#btnExportarSocioeconomica').click(function () {
                exportarTabla();
            });

            $('#selTipoDesplazadoSocioeconomica').change(function () {

                var idTipoDesplazado = $('#selTipoDesplazadoSocioeconomica').val()
                if (idTipoDesplazado != 0) {
                    var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + idTipoDesplazado;
                    capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    var capaGeneral = capaCompleta;

                    var queryTask = new QueryTask(capaCompleta);
                    var query = new Query();
                    query.outFields = ["ANIO"];
                    query.where = "1=1";
                    query.returnGeometry = false;
                    queryTask.execute(query, resultadoConsultaAnio);

                    function resultadoConsultaAnio(featureSet) {
                        var anios = [];
                        var featureResultados = featureSet.features;
                        for (var i in featureResultados) {
                            anios.push(featureResultados[i].attributes.ANIO);
                        }
                        anios.sort();
                        insertarGeneral(selAnioSocioeconomica, removerDuplicadosArrayString(anios));
                        $('#selAnioSocioeconomica').prop('disabled', false)
                        $('#btnBuscarSocioeconomica').prop('disabled', false);
                    }
                }

            });

            $('#selTipoIndicadorSocioeconomica').change(function () {

                var idTipoIndicador = $('#selTipoIndicadorSocioeconomica').val()
                if (idTipoIndicador != -1) {
                    var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + idTipoIndicador;
                    capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    var capaGeneral = capaCompleta;

                    var queryTask = new QueryTask(capaCompleta);
                    var query = new Query();
                    query.outFields = ["ANIO"];
                    query.where = "1=1";
                    query.returnGeometry = false;
                    queryTask.execute(query, resultadoConsultaAnio);

                    function resultadoConsultaAnio(featureSet) {
                        var anios = [];
                        var featureResultados = featureSet.features;
                        for (var i in featureResultados) {
                            anios.push(featureResultados[i].attributes.ANIO);
                        }
                        anios.sort();
                        insertarGeneral(selAnioSocioeconomica, removerDuplicadosArrayString(anios));
                        $('#selAnioSocioeconomica').prop('disabled', false)
                        $('#btnBuscarSocioeconomica').prop('disabled', false);
                    }
                }

            });


            $('#selTipoServicioSocioeconomica').change(function () {

                var idTipoIndicador = $('#selTipoServicioSocioeconomica').val()
                if (idTipoIndicador != -1) {
                    var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + config.idCapaConsultaServiciosPublicos;
                    capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    var capaGeneral = capaCompleta;

                    var queryTask = new QueryTask(capaCompleta);
                    var query = new Query();
                    query.outFields = ["ANIO"];
                    query.where = "1=1";
                    query.returnGeometry = false;
                    queryTask.execute(query, resultadoConsultaAnio);

                    function resultadoConsultaAnio(featureSet) {
                        var anios = [];
                        var featureResultados = featureSet.features;
                        for (var i in featureResultados) {
                            anios.push(featureResultados[i].attributes.ANIO);
                        }
                        anios.sort();
                        insertarGeneral(selAnioSocioeconomica, removerDuplicadosArrayString(anios));
                        $('#selAnioSocioeconomica').prop('disabled', false)
                        $('#btnBuscarSocioeconomica').prop('disabled', false);
                    }
                }

            });
        }

        /**
         * Llena el dropdown con las opciones por defecto almacenadas en el archivo config.json
         */
        function llenarConsultaPor() {
            var datosConsultaPor = this.config.opcionesConsulta;
            insertarGeneral(selConsultaSocioeconomica, datosConsultaPor)
        }
        /**
         * Inserta el arreglo en el dropdown indicado
         * 
         * @param {Select} select  - Select en el cual se van a insertar las opciones.
         * @param {Array} arreglo  - Opciones para insertar en el select.
         * 
         */
        function insertarGeneral(select, arreglo) {

            select.options.length = 0;
            var optsel = document.createElement('option');
            optsel.value = "-1";
            optsel.text = "Seleccione...";
            select.options.add(optsel);
            for (var i in arreglo) {

                var opt = document.createElement('option');
                opt.value = arreglo[i];
                opt.text = arreglo[i];
                select.options.add(opt);
            }
        }


        /**
         * Consulta en el servicio de acuerdo a las opciones seleccionadas
         * 
         * @param {string} sWhere - Clausula para la consulta
         * @param {*} idCapaConsulta  - Id de la capa a consultar del servicio.
         * @param {*} seleccionado - Opcion consulta por sleccionado.
         */
        function consultar(sWhere, idCapaConsulta, seleccionado) {

            showLoader();
            map.graphics.clear()
            switch (seleccionado) {
                case "Población":
                    var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + idCapaConsulta;
                    capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    var capaGeneral = capaCompleta;
                    var query = new Query();
                    var queryTask = new QueryTask(capaGeneral);
                    query.returnGeometry = true;
                    query.outFields = ["*"];
                    query.where = sWhere;
                    query.outSpatialReference = { wkid: map.spatialReference };
                    queryTask.execute(query, consultaPoblacioGeneral);
                    function consultaPoblacioGeneral(featureSet) {
                        featuresResultPoblacion = featureSet.features;
                        for (var i in featuresResultPoblacion) {
                            var graphic = featuresResultPoblacion[i];
                            var symbol = simbologiaFeatures(graphic, seleccionado);
                            graphic.setSymbol(symbol);
                            map.graphics.add(graphic);
                        }
                        funcionClickGrafica = dojo.connect(map.graphics, "onClick", function (e) {
                            dijit.byId("gridSocieconomica").selection.clear();
                            posicionMunicipioSeleccionado = (+e.graphic.attributes.OBJECTID - 1);
                            $('#btnGraficaAnteriorSocioeconomica').hide();
                            contadorGraficas = 0;
                            cargarTablaPoblacion(seleccionado);
                        });
                        mostrarLeyenda(this.config.tituloLeyendaPoblacion, this.config.leyendaPoblacion);
                        mostarTablaGrafica();
                        cargarTablaPoblacion(seleccionado);
                        hideLoader();
                    }
                    break;

                case "Necesidades Básicas Insatisfechas (NBI)":
                    var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + idCapaConsulta;
                    capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    var capaGeneral = capaCompleta;
                    var query = new Query();
                    var queryTask = new QueryTask(capaGeneral);
                    query.returnGeometry = true;
                    query.outFields = ["*"];
                    query.where = sWhere;
                    query.outSpatialReference = { wkid: map.spatialReference };
                    queryTask.execute(query, consultaNBI);
                    function consultaNBI(featureSet) {
                        featuresResultPoblacion = featureSet.features;
                        for (var i in featuresResultPoblacion) {
                            var graphic = featuresResultPoblacion[i];
                            var symbol = simbologiaFeatures(graphic, seleccionado);
                            graphic.setSymbol(symbol);
                            map.graphics.add(graphic);
                        }
                        funcionClickGrafica = dojo.connect(map.graphics, "onClick", function (e) {
                            dijit.byId("gridSocieconomica").selection.clear();
                            posicionMunicipioSeleccionado = buscarIndiceMunicipioTabla(e.graphic.attributes.IDMUNICIPIO);
                            contadorGraficas = 0;
                            cargarTablaPoblacion(seleccionado);
                        });
                        mostrarLeyenda(this.config.tituloLeyendaNBI, this.config.leyendaNBI);
                        mostarTablaGrafica();
                        cargarTablaPoblacion(seleccionado);
                        hideLoader();
                    }
                    break;
                case "Desplazados":

                    var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + idCapaConsulta;
                    capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    var capaGeneral = capaCompleta;
                    var query = new Query();
                    var queryTask = new QueryTask(capaGeneral);
                    query.returnGeometry = true;
                    query.outFields = ["*"];
                    query.where = sWhere;
                    query.outSpatialReference = { wkid: map.spatialReference };
                    queryTask.execute(query, consultaTipoIndicador);
                    function consultaTipoIndicador(featureSet) {
                        featuresResultPoblacion = featureSet.features;
                        for (var i in featuresResultPoblacion) {
                            var graphic = featuresResultPoblacion[i];
                            var symbol = simbologiaFeatures(graphic, seleccionado);
                            graphic.setSymbol(symbol);
                            map.graphics.add(graphic);
                        }
                        funcionClickGrafica = dojo.connect(map.graphics, "onClick", function (e) {
                            dijit.byId("gridSocieconomica").selection.clear();
                            posicionMunicipioSeleccionado = buscarIndiceMunicipioTabla(e.graphic.attributes.IDMUNICIPIO);
                            contadorGraficas = 0;
                            cargarTablaPoblacion(seleccionado);
                        });
                        mostrarLeyenda(this.config.tituloLeyendaDesplazados, this.config.leyendaDesplazados);
                        mostarSoloTabla();
                        cargarTablaPoblacion(seleccionado);
                        hideLoader();
                    }


                    break;

                case "Indicadores Socieconómicos":

                    var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + idCapaConsulta;
                    capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    var capaGeneral = capaCompleta;
                    var query = new Query();
                    var queryTask = new QueryTask(capaGeneral);
                    query.returnGeometry = true;
                    query.outFields = ["*"];
                    query.where = sWhere;
                    query.outSpatialReference = { wkid: map.spatialReference };
                    queryTask.execute(query, consultaDesplazados);
                    function consultaDesplazados(featureSet) {
                        featuresResultPoblacion = featureSet.features;
                        for (var i in featuresResultPoblacion) {
                            var graphic = featuresResultPoblacion[i];
                            var symbol = simbologiaFeatures(graphic, seleccionado);
                            graphic.setSymbol(symbol);
                            map.graphics.add(graphic);
                        }
                        funcionClickGrafica = dojo.connect(map.graphics, "onClick", function (e) {
                            dijit.byId("gridSocieconomica").selection.clear();
                            posicionMunicipioSeleccionado = buscarIndiceMunicipioTabla(e.graphic.attributes.OBJECTID);
                            contadorGraficas = 0;
                            cargarTablaPoblacion(seleccionado);
                        });
                        mostrarLeyenda(this.config.tituloLeyendaDesnutricion, this.config.leyendaDesnutricion);
                        mostarSoloTabla();
                        cargarTablaPoblacion(seleccionado);
                        hideLoader();
                    }


                    break;

                case "Cobertura de Servicios Públicos":

                    var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + idCapaConsulta;
                    capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    var capaGeneral = capaCompleta;
                    var query = new Query();
                    var queryTask = new QueryTask(capaGeneral);
                    query.returnGeometry = true;
                    query.outFields = ["*"];
                    query.where = sWhere;
                    query.outSpatialReference = { wkid: map.spatialReference };
                    queryTask.execute(query, consultaServiciosPublicos);
                    function consultaServiciosPublicos(featureSet) {
                        featuresResultPoblacion = featureSet.features;
                        for (var i in featuresResultPoblacion) {
                            var graphic = featuresResultPoblacion[i];
                            var symbol = simbologiaFeatures(graphic, seleccionado);
                            graphic.setSymbol(symbol);
                            map.graphics.add(graphic);
                        }
                        funcionClickGrafica = dojo.connect(map.graphics, "onClick", function (e) {
                            dijit.byId("gridSocieconomica").selection.clear();
                            posicionMunicipioSeleccionado = buscarIndiceMunicipioTabla(e.graphic.attributes.IDMUNICIPIO);
                            contadorGraficas = 0;
                            cargarTablaPoblacion(seleccionado);
                        });
                        mostrarLeyenda(this.config.tituloLeyendaServiciosPublicos, this.config.leyendaServiciosPublicos);
                        mostarSoloTabla();
                        cargarTablaPoblacion(seleccionado);
                        hideLoader();
                    }


                    break;

            }

        }

        function buscarIndiceMunicipioTabla(IDMUNICIPIO) {
            for (var i in dijit.byId("gridSocieconomica").store._arrayOfAllItems) {
                var row = dijit.byId("gridSocieconomica").store._arrayOfAllItems[i];
                if (IDMUNICIPIO == row.id) {
                    return i;
                }
            }

        }

        /**
         * Carga la tabla de la informacion de poblacion general.
         * 
         * @param {string} seleccionado - Opcion seleccionada de consulta por
         */
        function cargarTablaPoblacion(seleccionado) {
            $('#tituloTablaConsulta').hide("fast");
            switch (seleccionado) {
                case "Población":

                    //cargaTabla
                    var layout = [[
                        { 'name': 'Id', 'field': 'id', 'width': '0%', noresize: true },
                        { 'name': 'Municipio', 'field': 'municipio', 'width': '20%', noresize: true },
                        { 'name': 'Urbano', 'field': 'urbano', 'width': '20%', noresize: true },
                        { 'name': 'Rural', 'field': 'rural', 'width': '20%', noresize: true },
                        { 'name': 'Total', 'field': 'total', 'width': '20%', noresize: true }
                    ]];


                    var data = {
                        identifier: "id",
                        items: []
                    };


                    for (var i in featuresResultPoblacion) {
                        data.items.push(lang.mixin({ id: i }, {
                            id: featuresResultPoblacion[i].attributes.IDMUNICIPIO,
                            municipio: featuresResultPoblacion[i].attributes.NOMBRE,
                            urbano: featuresResultPoblacion[i].attributes.URBANO,
                            rural: featuresResultPoblacion[i].attributes.RURAL,
                            total: featuresResultPoblacion[i].attributes.TOTAL

                        }));
                    }
                    var store = new ItemFileWriteStore({ data: data });

                    if (dijit.byId("gridSocieconomica") != undefined) {
                        dijit.byId("gridSocieconomica").destroy();
                    }

                    var grid = new DataGrid({
                        id: 'gridSocieconomica',
                        store: store,
                        structure: layout,
                        rowSelector: '10px',
                        style: "width: 380px;",
                        selectionMode: 'single',
                        canSort: function (col) {
                            return false;
                        }
                    });

                    grid.layout.setColumnVisibility(0, false);
                    grid.placeAt("divTablaConsultaSocioeconomica");

                    grid.startup();
                    grid.set('autoHeight', false);
                    grid.set('autoWidth', true);
                    grid.update();
                    grid.set('autoWidth', false);
                    dijit.byId("gridSocieconomica").selection.setSelected(posicionMunicipioSeleccionado, true);
                    grid.on("RowClick", function (evt) {
                        selectedRowGrid();
                    }, true);
                    selectedRowGrid();
                    break;
                case "Necesidades Básicas Insatisfechas (NBI)":

                    //cargaTabla
                    var layout = [[
                        { 'name': 'Id', 'field': 'id', 'width': '0%', noresize: true },
                        { 'name': 'Municipio', 'field': 'municipio', 'width': '100px', noresize: true },
                        { 'name': 'Prop Urbano (%)', 'field': 'propUrbano', 'width': '100px', noresize: true },
                        { 'name': 'Cve Urbano (%)', 'field': 'cveUrbano', 'width': '100px', noresize: true },
                        { 'name': 'Prop Rural (%)', 'field': 'propRural', 'width': '100px', noresize: true },
                        { 'name': 'Cve Rural (%)', 'field': 'cveRural', 'width': '100px', noresize: true },
                        { 'name': 'Total Prop (%)', 'field': 'totalProp', 'width': '100px', noresize: true },
                        { 'name': 'Total Cve (%)', 'field': 'totalCve', 'width': '100px', noresize: true },

                    ]];


                    var data = {
                        identifier: "id",
                        items: []
                    };


                    for (var i in featuresResultPoblacion) {
                        data.items.push(lang.mixin({ id: i }, {
                            id: featuresResultPoblacion[i].attributes.IDMUNICIPIO,
                            municipio: featuresResultPoblacion[i].attributes.NOMBRE,
                            propUrbano: featuresResultPoblacion[i].attributes.PROPOSICIONPORCENTUALU,
                            cveUrbano: featuresResultPoblacion[i].attributes.CVEU,
                            propRural: featuresResultPoblacion[i].attributes.PROPOSICIONPORCENTUALR,
                            cveRural: featuresResultPoblacion[i].attributes.CVER,
                            totalProp: featuresResultPoblacion[i].attributes.TOTALPROPOR,
                            totalCve: featuresResultPoblacion[i].attributes.TOTALCVE
                        }));
                    }
                    var store = new ItemFileWriteStore({ data: data });

                    if (dijit.byId("gridSocieconomica") != undefined) {
                        dijit.byId("gridSocieconomica").destroy();
                    }

                    var grid = new DataGrid({
                        id: 'gridSocieconomica',
                        store: store,
                        structure: layout,
                        rowSelector: '10px',
                        style: "width: 380px;",
                        selectionMode: 'single',
                        canSort: function (col) {
                            return false;
                        }
                    });

                    grid.layout.setColumnVisibility(0, false);
                    grid.placeAt("divTablaConsultaSocioeconomica");

                    grid.startup();
                    grid.set('autoHeight', false);
                    grid.set('autoWidth', false);
                    grid.update();
                    grid.set('autoWidth', false);
                    dijit.byId("gridSocieconomica").selection.setSelected(posicionMunicipioSeleccionado, true);
                    grid.on("RowClick", function (evt) {
                        selectedRowGrid();
                    }, true);
                    selectedRowGrid();

                    break;

                case "Desplazados":

                    //cargaTabla
                    var layout = [[
                        { 'name': 'Id', 'field': 'id', 'width': '0%', noresize: true },
                        { 'name': 'Municipio', 'field': 'municipio', 'width': '80px', noresize: true },
                        { 'name': 'Personas', 'field': 'personas', 'width': '60px', noresize: true },
                        { 'name': 'Hogares', 'field': 'hogares', 'width': '55px', noresize: true },
                        { 'name': 'Fuente', 'field': 'fuente', 'width': '300px', noresize: true }

                    ]];


                    var data = {
                        identifier: "id",
                        items: []
                    };


                    for (var i in featuresResultPoblacion) {
                        data.items.push(lang.mixin({ id: i }, {
                            id: featuresResultPoblacion[i].attributes.IDMUNICIPIO,
                            municipio: featuresResultPoblacion[i].attributes.NOMBRE,
                            personas: featuresResultPoblacion[i].attributes.PERSONAS,
                            hogares: featuresResultPoblacion[i].attributes.HOGARES,
                            fuente: featuresResultPoblacion[i].attributes.FUENTE

                        }));
                    }
                    var store = new ItemFileWriteStore({ data: data });

                    if (dijit.byId("gridSocieconomica") != undefined) {
                        dijit.byId("gridSocieconomica").destroy();
                    }

                    var grid = new DataGrid({
                        id: 'gridSocieconomica',
                        store: store,
                        structure: layout,
                        rowSelector: '10px',
                        style: "width: 380px;",
                        selectionMode: 'single',
                        canSort: function (col) {
                            return false;
                        }
                    });

                    grid.layout.setColumnVisibility(0, false);
                    grid.placeAt("divTablaConsultaSocioeconomica");

                    grid.startup();
                    grid.set('autoHeight', false);
                    grid.set('autoWidth', false);
                    grid.update();
                    grid.set('autoWidth', false);
                    dijit.byId("gridSocieconomica").selection.setSelected(posicionMunicipioSeleccionado, true);

                    if (data.items.length != 0) {
                        $('#tituloTablaConsulta').text("Población desplazada tipo " + $('#selTipoDesplazadoSocioeconomica option:selected').text() + " en el año " + $('#selAnioSocioeconomica').val());
                        $('#tituloTablaConsulta').show("fast");
                        grid.on("RowClick", function (evt) {
                            selectedRowGrid();
                        }, true);
                        selectedRowGrid();
                    } else {
                        $('#tituloTablaConsulta').text("No se encontraron elementos");
                        $('#tituloTablaConsulta').show("fast");
                    }

                    break;

                case "Indicadores Socieconómicos":

                    //cargaTabla
                    var layout = [[
                        { 'name': 'Id', 'field': 'id', 'width': '0%', noresize: true },
                        { 'name': 'Municipio', 'field': 'municipio', 'width': '40%', noresize: true },
                        { 'name': 'Desnutrición (%)', 'field': 'desnutricion', 'width': '60%', noresize: true },
                    ]];


                    var data = {
                        identifier: "id",
                        items: []
                    };


                    for (var i in featuresResultPoblacion) {
                        data.items.push(lang.mixin({ id: i }, {
                            id: featuresResultPoblacion[i].attributes.OBJECTID,
                            municipio: featuresResultPoblacion[i].attributes.NOMBRE,
                            desnutricion: featuresResultPoblacion[i].attributes.PORCENTAJE
                        }));
                    }
                    var store = new ItemFileWriteStore({ data: data });

                    if (dijit.byId("gridSocieconomica") != undefined) {
                        dijit.byId("gridSocieconomica").destroy();
                    }

                    var grid = new DataGrid({
                        id: 'gridSocieconomica',

                        store: store,
                        structure: layout,
                        rowSelector: '10px',
                        style: "width: 380px;",
                        selectionMode: 'single',
                        canSort: function (col) {
                            return false;
                        }
                    });

                    grid.layout.setColumnVisibility(0, false);
                    grid.placeAt("divTablaConsultaSocioeconomica");

                    grid.startup();
                    grid.set('autoHeight', false);
                    grid.set('autoWidth', false);
                    grid.update();
                    grid.set('autoWidth', false);
                    dijit.byId("gridSocieconomica").selection.setSelected(posicionMunicipioSeleccionado, true);
                    if (data.items.length != 0) {
                        $('#tituloTablaConsulta').text( $('#selTipoIndicadorSocioeconomica option:selected').text() + " en el año " + $('#selAnioSocioeconomica').val());
                        $('#tituloTablaConsulta').show("fast");
                        grid.on("RowClick", function (evt) {
                            selectedRowGrid();
                        }, true);
                        selectedRowGrid();
                    } else {
                        $('#tituloTablaConsulta').text("No se encontraron elementos");
                        $('#tituloTablaConsulta').show("fast");
                    }

                    break;

                case "Cobertura de Servicios Públicos":

                    //cargaTabla
                    var layout = [[
                        { 'name': 'Id', 'field': 'id', 'width': '0%', noresize: true },
                        { 'name': 'Municipio', 'field': 'municipio', 'width': '40%', noresize: true },
                        { 'name': 'Cobertura (%)', 'field': 'cobertura', 'width': '60%', noresize: true },
                    ]];


                    var data = {
                        identifier: "id",
                        items: []
                    };


                    for (var i in featuresResultPoblacion) {
                        data.items.push(lang.mixin({ id: i }, {
                            id: featuresResultPoblacion[i].attributes.IDMUNICIPIO,
                            municipio: featuresResultPoblacion[i].attributes.NOMBRE,
                            cobertura: featuresResultPoblacion[i].attributes.COBERTURA
                        }));
                    }
                    var store = new ItemFileWriteStore({ data: data });

                    if (dijit.byId("gridSocieconomica") != undefined) {
                        dijit.byId("gridSocieconomica").destroy();
                    }

                    var grid = new DataGrid({
                        id: 'gridSocieconomica',
                        store: store,
                        structure: layout,
                        rowSelector: '10px',
                        style: "width: 380px;",
                        selectionMode: 'single',
                        canSort: function (col) {
                            return false;
                        }
                    });

                    grid.layout.setColumnVisibility(0, false);
                    grid.placeAt("divTablaConsultaSocioeconomica");

                    grid.startup();
                    grid.set('autoHeight', false);
                    grid.set('autoWidth', false);
                    grid.update();
                    grid.set('autoWidth', false);
                    dijit.byId("gridSocieconomica").selection.setSelected(posicionMunicipioSeleccionado, true);

                    $('#tituloTablaConsulta').text("Servicio público " + $('#selTipoServicioSocioeconomica').val() + " en el año " + $('#selAnioSocioeconomica').val());
                    $('#tituloTablaConsulta').show("fast");

                    if (data.items.length != 0) {
                        $('#tituloTablaConsulta').text("Servicio público " + $('#selTipoServicioSocioeconomica').val() + " en el año " + $('#selAnioSocioeconomica').val());
                        $('#tituloTablaConsulta').show("fast");
                        grid.on("RowClick", function (evt) {
                            selectedRowGrid();
                        }, true);
                        selectedRowGrid();
                    } else {
                        $('#tituloTablaConsulta').text("No se encontraron elementos");
                        $('#tituloTablaConsulta').show("fast");
                    }
                    break;


            }
        }

        /**
         * Cambio de seleccion en la tabla de poblacion.
         * 
         * @param {string} seleccionado - Opcion seleccionada de consulta por
         */
        function selectedRowGrid() {
            var seleccionado = $('#selConsultaSocioeconomica').val();
            switch (seleccionado) {
                case "Población":
                    posicionMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.selectedIndex;
                    anioSeleccionado = $('#selAnioSocioeconomica').val();
                    municipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].municipio[0].toString();
                    idMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].id[0].toString();
                    dojo.empty("graficaConsultaSocioeconomica");
                    var leyenda = dijit.byId("leyendaGraficaConsultaSocioeconomica");
                    if (leyenda != undefined) {
                        leyenda.destroyRecursive(true);
                    }

                    var graficaConsulta = new Chart("graficaConsultaSocioeconomica", {

                        title: "Población General de " + municipioSeleccionado + " en el año " + anioSeleccionado,
                        titlePos: "top",
                        titleGap: 5,
                        titleFont: "normal normal normal 11pt Arial",
                        titleFontColor: "black"

                    });
                    graficaConsulta.addPlot("default", {
                        type: "ClusteredColumns",
                        gap: 50,
                        animate: {
                            duration: 1000,
                            easing: easing.bounceInOut
                        }
                    })
                        .addAxis("x", {
                            title: "Año",
                            titleOrientation: "away",
                            labels: [{ value: 1, text: anioSeleccionado }],
                            minorTicks: false,
                            minorLabels: true,
                            titleGap: 5
                        })
                        .addAxis("y", {
                            vertical: true,
                            fixLower: "major",
                            fixUpper: "major",
                            title: "Cantidad",
                            minorTicks: false,
                            minorLabels: true,
                            titleGap: 5
                        })
                        .addSeries("Rural", [dijit.byId("gridSocieconomica").selection.getSelected()[0].rural[0]], {
                            stroke: { color: "white" },
                            fill: "#B19B00",
                            tooltip: dijit.byId("gridSocieconomica").selection.getSelected()[0].rural[0].toString()
                        })
                        .addSeries("Urbano", [dijit.byId("gridSocieconomica").selection.getSelected()[0].urbano[0]], {
                            stroke: { color: "white" },
                            fill: "#A31A7E",
                            tooltip: dijit.byId("gridSocieconomica").selection.getSelected()[0].urbano[0].toString()
                        })

                    var anim_c = new Tooltip(graficaConsulta, "default");
                    graficaConsulta.render();
                    var legendTwo = new Legend({ chart: graficaConsulta }, "leyendaGraficaConsultaSocioeconomica");
                    cambiarSymbolGraficaSocioeconomica();

                    break;


                case "Necesidades Básicas Insatisfechas (NBI)":

                    $('#btnGraficaAnteriorSocioeconomica').hide();
                    $('#btnGraficaSiguienteSocioeconomica').show();
                    posicionMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.selectedIndex;
                    anioSeleccionado = $('#selAnioSocioeconomica').val();
                    municipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].municipio[0].toString();
                    idMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].id[0].toString();
                    dojo.empty("graficaConsultaSocioeconomica");
                    var leyenda = dijit.byId("leyendaGraficaConsultaSocioeconomica");
                    if (leyenda != undefined) {
                        leyenda.destroyRecursive(true);
                    }

                    var graficaConsulta = new Chart("graficaConsultaSocioeconomica", {

                        title: "Proposición Porcentual de " + municipioSeleccionado + " en el año " + anioSeleccionado,
                        titlePos: "top",
                        titleGap: 5,
                        titleFont: "normal normal normal 11pt Arial",
                        titleFontColor: "black"

                    });
                    graficaConsulta.addPlot("default", {
                        type: "ClusteredColumns",
                        gap: 50,
                        animate: {
                            duration: 1000,
                            easing: easing.bounceInOut
                        }
                    })
                        .addAxis("x", {
                            title: "Año",
                            titleOrientation: "away",
                            labels: [{ value: 1, text: anioSeleccionado }],
                            minorTicks: false,
                            minorLabels: true,
                            titleGap: 5

                        })
                        .addAxis("y", {
                            vertical: true,
                            fixLower: "major",
                            fixUpper: "major",
                            title: "Cantidad",
                            minorTicks: false,
                            minorLabels: true,
                            titleGap: 5,
                            min: dijit.byId("gridSocieconomica").selection.getSelected()[0].propRural[0] < dijit.byId("gridSocieconomica").selection.getSelected()[0].propUrbano[0] ? (dijit.byId("gridSocieconomica").selection.getSelected()[0].propRural[0] - 2) : (dijit.byId("gridSocieconomica").selection.getSelected()[0].propUrbano[0] - 2)
                        })
                        .addSeries("Rural", [dijit.byId("gridSocieconomica").selection.getSelected()[0].propRural[0]], {
                            stroke: { color: "white" },
                            fill: "#B19B00",
                            tooltip: dijit.byId("gridSocieconomica").selection.getSelected()[0].propRural[0].toString()
                        })
                        .addSeries("Urbano", [dijit.byId("gridSocieconomica").selection.getSelected()[0].propUrbano[0]], {
                            stroke: { color: "white" },
                            fill: "#A31A7E",
                            tooltip: dijit.byId("gridSocieconomica").selection.getSelected()[0].propUrbano[0].toString()
                        })

                    var anim_c = new Tooltip(graficaConsulta, "default");
                    graficaConsulta.render();
                    var legendTwo = new Legend({ chart: graficaConsulta }, "leyendaGraficaConsultaSocioeconomica");
                    cambiarSymbolGraficaSocioeconomica();

                    break;

                case "Desplazados":
                    posicionMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.selectedIndex;
                    municipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].municipio[0].toString();
                    idMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].id[0].toString();
                    cambiarSymbolGraficaSocioeconomica();
                    break;

                case "Indicadores Socieconómicos":
                    posicionMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.selectedIndex;
                    municipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].municipio[0].toString();
                    idMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].id[0].toString();
                    cambiarSymbolGraficaSocioeconomica();
                    break;

                case "Cobertura de Servicios Públicos":
                    posicionMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.selectedIndex;
                    municipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].municipio[0].toString();
                    idMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].id[0].toString();
                    cambiarSymbolGraficaSocioeconomica();
                    break;
            }
        }

        /**
         * Carga la siguiente tabla y grafica de acuerdo a las opciones seleccionadas
         */
        function cargarSiguienteGraficaTabla() {
            var seleccionado = $('#selConsultaSocioeconomica').val();
            switch (seleccionado) {
                case "Población":

                    switch (contadorGraficas) {
                        case 0:
                            cargarInformacionEdadSimple();
                            $('#btnGraficaAnteriorSocioeconomica').show();
                            contadorGraficas++;
                            break;
                        case 1:
                            cargarInformacionEdadQuinquenal();
                            contadorGraficas++;
                            break;
                        case 2:
                            cargarInformacionPoblacionSisben();
                            $('#btnGraficaSiguienteSocioeconomica').hide();
                            contadorGraficas++;
                            break;
                    }
                    break;
                case "Necesidades Básicas Insatisfechas (NBI)":

                    switch (contadorGraficas) {
                        case 0:
                            cargarGraficaCve();
                            contadorGraficas++;
                            $('#btnGraficaAnteriorSocioeconomica').show();
                            $('#btnGraficaSiguienteSocioeconomica').hide();
                            break;
                    }
                    break;

            }
        }

        /**
         * Carga la anterior tabla y grafica de acuerdo a las opciones seleccionadas
         */
        function cargarAnteriorGraficaTabla() {
            var seleccionado = $('#selConsultaSocioeconomica').val();
            switch (seleccionado) {
                case "Población":

                    switch (contadorGraficas) {
                        case 1:
                            cargarTablaPoblacion(seleccionado);
                            $('#btnGraficaAnteriorSocioeconomica').hide();
                            contadorGraficas--;
                            break;
                        case 2:
                            cargarInformacionEdadSimple();
                            contadorGraficas--;
                            break;
                        case 3:
                            cargarInformacionEdadQuinquenal();
                            $('#btnGraficaSiguienteSocioeconomica').show();
                            contadorGraficas--;
                            break;

                    }
                    break;
                case "Necesidades Básicas Insatisfechas (NBI)":

                    switch (contadorGraficas) {
                        case 1:
                            selectedRowGrid();
                            contadorGraficas--;
                            $('#btnGraficaAnteriorSocioeconomica').hide();
                            $('#btnGraficaSiguienteSocioeconomica').show();
                            break;

                    }
                    break;
            }
        }

        function cargarGraficaCve() {

            posicionMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.selectedIndex;
            anioSeleccionado = $('#selAnioSocioeconomica').val();
            municipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].municipio[0].toString();
            idMunicipioSeleccionado = dijit.byId("gridSocieconomica").selection.getSelected()[0].id[0].toString();
            dojo.empty("graficaConsultaSocioeconomica");
            var leyenda = dijit.byId("leyendaGraficaConsultaSocioeconomica");
            if (leyenda != undefined) {
                leyenda.destroyRecursive(true);
            }

            var graficaConsulta = new Chart("graficaConsultaSocioeconomica", {

                title: "Coeficiente de variación estimado <br> de " + municipioSeleccionado + " en el año " + anioSeleccionado,
                titlePos: "top",
                titleGap: 5,
                titleFont: "normal normal normal 11pt Arial",
                titleFontColor: "black"

            });
            graficaConsulta.addPlot("default", {
                type: "ClusteredColumns",
                gap: 50,
                animate: {
                    duration: 1000,
                    easing: easing.bounceInOut
                }
            })
                .addAxis("x", {
                    title: "Año",
                    titleOrientation: "away",
                    labels: [{ value: 1, text: anioSeleccionado }],
                    minorTicks: false,
                    minorLabels: true,
                    titleGap: 5

                })
                .addAxis("y", {
                    vertical: true,
                    fixLower: "major",
                    fixUpper: "major",
                    title: "Cantidad",
                    minorTicks: false,
                    minorLabels: true,
                    titleGap: 5,
                    min: dijit.byId("gridSocieconomica").selection.getSelected()[0].cveRural[0] < dijit.byId("gridSocieconomica").selection.getSelected()[0].cveUrbano[0] ? (dijit.byId("gridSocieconomica").selection.getSelected()[0].cveRural[0] - 2) : (dijit.byId("gridSocieconomica").selection.getSelected()[0].cveUrbano[0] - 2)
                })
                .addSeries("Rural", [dijit.byId("gridSocieconomica").selection.getSelected()[0].cveRural[0]], {
                    stroke: { color: "white" },
                    fill: "#B19B00",
                    tooltip: dijit.byId("gridSocieconomica").selection.getSelected()[0].cveRural[0].toString()
                })
                .addSeries("Urbano", [dijit.byId("gridSocieconomica").selection.getSelected()[0].cveUrbano[0]], {
                    stroke: { color: "white" },
                    fill: "#A31A7E",
                    tooltip: dijit.byId("gridSocieconomica").selection.getSelected()[0].cveUrbano[0].toString()
                })

            var anim_c = new Tooltip(graficaConsulta, "default");
            graficaConsulta.render();
            var legendTwo = new Legend({ chart: graficaConsulta }, "leyendaGraficaConsultaSocioeconomica");

        }


        /**
         * Carga la tabla y grafica de las informacion de la capa poblacion de edad simple
         */
        function cargarInformacionEdadSimple() {

            var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + config.idCapaConsultaPoblacionEdadSimple;
            capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
            var capaGeneral = capaCompleta;
            var query = new Query();
            var queryTask = new QueryTask(capaGeneral);
            query.returnGeometry = false;
            query.outFields = ["NOMBRE,POBLACIONHOMBRES,POBLACIONMUJERES,EDAD,ANIO"];
            query.where = "IDMUNICIPIO=" + idMunicipioSeleccionado + "AND ANIO=" + anioSeleccionado;
            query.outSpatialReference = { wkid: map.spatialReference };
            queryTask.execute(query, function cargar(featureSet) {

                //Tabla
                var serieMujeres = [];
                var serieHombres = [];

                var layout = [[
                    { 'name': 'Edad', 'field': 'edad', 'width': '20%', noresize: true },
                    { 'name': 'Hombres', 'field': 'hombres', 'width': '40%', noresize: true },
                    { 'name': 'Mujeres', 'field': 'mujeres', 'width': '40%', noresize: true }
                ]];

                var data = {
                    identifier: "id",
                    items: []
                };
                var featuresResultPoblacionEdadSimple = featureSet.features;
                for (var i in featuresResultPoblacionEdadSimple) {
                    data.items.push(lang.mixin({ id: i }, {
                        edad: featuresResultPoblacionEdadSimple[i].attributes.EDAD,
                        hombres: featuresResultPoblacionEdadSimple[i].attributes.POBLACIONHOMBRES,
                        mujeres: featuresResultPoblacionEdadSimple[i].attributes.POBLACIONMUJERES
                    }));

                    serieHombres.push({ x: featuresResultPoblacionEdadSimple[i].attributes.EDAD, y: -featuresResultPoblacionEdadSimple[i].attributes.POBLACIONHOMBRES });
                    serieMujeres.push({ x: featuresResultPoblacionEdadSimple[i].attributes.EDAD, y: featuresResultPoblacionEdadSimple[i].attributes.POBLACIONMUJERES });

                }
                var store = new ItemFileWriteStore({ data: data });

                if (dijit.byId("gridSocieconomica") != undefined) {
                    dijit.byId("gridSocieconomica").destroy();
                }

                /*create a new grid*/
                var grid = new DataGrid({
                    id: 'gridSocieconomica',
                    store: store,
                    structure: layout,
                    rowSelector: '10px',
                    style: "width: 380px;",
                    selectionMode: 'single',
                    canSort: function (col) {
                        return false;
                    }
                });

                grid.placeAt("divTablaConsultaSocioeconomica");

                grid.startup();
                grid.set('autoHeight', false);
                grid.set('autoWidth', true);
                grid.update();
                grid.set('autoWidth', false);

                //Grafica

                dojo.empty("graficaConsultaSocioeconomica");
                var leyenda = dijit.byId("leyendaGraficaConsultaSocioeconomica");
                if (leyenda != undefined) {
                    leyenda.destroyRecursive(true);
                }

                var graficaConsulta = new Chart("graficaConsultaSocioeconomica", {

                    title: featuresResultPoblacionEdadSimple.length != 0 ? "Población Edad Simple de " + municipioSeleccionado + " en el año " + anioSeleccionado : "No existen datos de edad simple de <br>" + municipioSeleccionado + "en el año " + anioSeleccionado,
                    titlePos: "top",
                    titleGap: 5,
                    titleFont: "normal normal normal 11pt Arial",
                    titleFontColor: "black"

                });
                graficaConsulta.addPlot("default", {
                    type: "Bars",
                    gap: 1,
                    areas: true,
                    animate: {
                        duration: 500,
                        easing: easing.bounceInOut
                    }
                })
                    .addAxis("x", {
                        title: "Edad",
                        minorTicks: true,
                        minorLabels: true,
                        titleGap: 5,
                        natural: true,
                        vertical: true,
                        maxBarSize: 1,
                        minBarSize: 1,
                        min: -0.5
                    })
                    .addAxis("y", {

                        title: featuresResultPoblacionEdadSimple.length != 0 ? "Cantidad" : "",
                        minorTicks: true,
                        minorLabels: true,
                        titleGap: 5,
                        titleOrientation: "away",
                        natural: true,
                        fixUpper: "minor",
                        fixLower: "minor",
                        labelFunc: function (a) {
                            return Math.abs(a);
                        }
                    })
                    .addSeries("Hombres", serieHombres, {
                        stroke: { color: "#e6e6e6" },
                        fill: "#ff9933",
                    })
                    .addSeries("Mujeres", serieMujeres, {
                        stroke: { color: "#e6e6e6" },
                        fill: "#ff3300",
                    })

                var anim_c = new Tooltip(graficaConsulta, "default", {
                    text: function (chartItem) {
                        return Math.abs(chartItem.y);
                    }

                });
                graficaConsulta.render();
                var legendTwo = new Legend({ chart: graficaConsulta }, "leyendaGraficaConsultaSocioeconomica");

            });

        }
        /**
        * Carga la tabla y grafica de las informacion de la capa poblacion de edad quinquenal
        */
        function cargarInformacionEdadQuinquenal() {


            var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + config.idCapaConsultaPoblacionQuinquenal;
            capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
            var capaGeneral = capaCompleta;
            var query = new Query();
            var queryTask = new QueryTask(capaGeneral);
            query.returnGeometry = false;
            query.outFields = ["NOMBRE,POBLACIONHOMBRES,POBLACIONMUJERES,RANGO_EDAD,ANIO"];
            query.where = "IDMUNICIPIO=" + idMunicipioSeleccionado + "AND ANIO=" + anioSeleccionado;
            query.outSpatialReference = { wkid: map.spatialReference };
            queryTask.execute(query, function cargar(featureSet) {
                //Tabla
                var serieMujeres = [];
                var serieHombres = [];
                var labels = [];

                var layout = [[
                    { 'name': 'Grupos de edad', 'field': 'grupo_edad', 'width': '20%', noresize: true },
                    { 'name': 'Hombres', 'field': 'hombres', 'width': '40%', noresize: true },
                    { 'name': 'Mujeres', 'field': 'mujeres', 'width': '40%', noresize: true }
                ]];

                var data = {
                    identifier: "id",
                    items: []
                };
                var featuresResultPoblacionQuinquenal = featureSet.features;
                for (var i in featuresResultPoblacionQuinquenal) {
                    data.items.push(lang.mixin({ id: i }, {
                        grupo_edad: featuresResultPoblacionQuinquenal[i].attributes.RANGO_EDAD,
                        hombres: featuresResultPoblacionQuinquenal[i].attributes.POBLACIONHOMBRES,
                        mujeres: featuresResultPoblacionQuinquenal[i].attributes.POBLACIONMUJERES
                    }));

                    serieHombres.push(-featuresResultPoblacionQuinquenal[i].attributes.POBLACIONHOMBRES);
                    serieMujeres.push(featuresResultPoblacionQuinquenal[i].attributes.POBLACIONMUJERES);

                    labels.push({ value: (+i + 1), text: featuresResultPoblacionQuinquenal[i].attributes.RANGO_EDAD });
                }
                var store = new ItemFileWriteStore({ data: data });

                if (dijit.byId("gridSocieconomica") != undefined) {
                    dijit.byId("gridSocieconomica").destroy();
                }

                /*create a new grid*/
                var grid = new DataGrid({
                    id: 'gridSocieconomica',
                    store: store,
                    structure: layout,
                    rowSelector: '10px',
                    style: "width: 380px;",
                    selectionMode: 'single',
                    canSort: function (col) {
                        return false;
                    }
                });

                grid.placeAt("divTablaConsultaSocioeconomica");

                grid.startup();
                grid.set('autoHeight', false);
                grid.set('autoWidth', true);
                grid.update();
                grid.set('autoWidth', false);

                //Grafica

                dojo.empty("graficaConsultaSocioeconomica");
                var leyenda = dijit.byId("leyendaGraficaConsultaSocioeconomica");
                if (leyenda != undefined) {
                    leyenda.destroyRecursive(true);
                }

                var graficaConsulta = new Chart("graficaConsultaSocioeconomica", {

                    title: featuresResultPoblacionQuinquenal.length != 0 ? "Población Quinquenal de " + municipioSeleccionado + " en el año " + anioSeleccionado : "No existen datos de población quinquenal de <br>" + municipioSeleccionado + " en el año " + anioSeleccionado,
                    titlePos: "top",
                    titleGap: 5,
                    titleFont: "normal normal normal 11pt Arial",
                    titleFontColor: "black"

                });
                graficaConsulta.addPlot("default", {
                    type: "Bars",
                    gap: 1,
                    areas: true,
                    animate: {
                        duration: 500,
                        easing: easing.bounceInOut
                    }
                })
                    .addAxis("x", {
                        title: "Rango de Edad",

                        minorTicks: true,
                        minorLabels: true,
                        titleGap: 5,
                        natural: true,
                        vertical: true,
                        maxBarSize: 1,
                        minBarSize: 1,
                        min: 0,
                        labels: labels
                    })
                    .addAxis("y", {

                        title: featuresResultPoblacionQuinquenal.length != 0 ? "Cantidad" : "",
                        minorTicks: true,
                        minorLabels: true,
                        titleGap: 5,
                        titleOrientation: "away",
                        natural: true,
                        fixUpper: "minor",
                        fixLower: "minor",
                        labelFunc: function (a) {
                            return Math.abs(a);
                        }
                    })
                    .addSeries("Hombres", serieHombres, {
                        stroke: { color: "#e6e6e6" },
                        fill: "#ff9933",
                    })
                    .addSeries("Mujeres", serieMujeres, {
                        stroke: { color: "#e6e6e6" },
                        fill: "#ff3300",
                    })

                var anim_c = new Tooltip(graficaConsulta, "default", {
                    text: function (chartItem) {
                        return Math.abs(chartItem.y);
                    }

                });
                graficaConsulta.render();
                var legendTwo = new Legend({ chart: graficaConsulta }, "leyendaGraficaConsultaSocioeconomica");
            });



        }
        /**
        * Carga la tabla y grafica de las informacion de la capa poblacion sisben
        */
        function cargarInformacionPoblacionSisben() {

            var capaCompleta = SERVICIO_SOCIOECONOMICO + "/" + config.idCapaConsultaPoblacionSisben;
            capaCompleta = capaCompleta.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
            var capaGeneral = capaCompleta;
            var query = new Query();
            var queryTask = new QueryTask(capaGeneral);
            query.returnGeometry = false;
            query.outFields = ["NOMBRE,TIPOAREA,NOMBRE,PUNTAJE,DESCRIPCIONVALOR,ANIO"];
            query.where = "IDMUNICIPIO=" + idMunicipioSeleccionado + "AND ANIO=" + anioSeleccionado;
            query.outSpatialReference = { wkid: map.spatialReference };
            queryTask.execute(query, function cargar(featureSet) {
                //Tabla
                var serieUrbano = [];
                var serieRural = [];


                var layout = [[
                    { 'name': 'Nivel', 'field': 'nivel', 'width': '20%', noresize: true },
                    { 'name': 'Sector', 'field': 'sector', 'width': '40%', noresize: true },
                    { 'name': 'Total', 'field': 'total', 'width': '40%', noresize: true }
                ]];

                var data = {
                    identifier: "id",
                    items: []
                };
                var featuresResultPoblacionSisben = featureSet.features;
                for (var i in featuresResultPoblacionSisben) {
                    data.items.push(lang.mixin({ id: i }, {
                        nivel: featuresResultPoblacionSisben[i].attributes.DESCRIPCIONVALOR.slice(6),
                        sector: featuresResultPoblacionSisben[i].attributes.TIPOAREA == 'U' ? 'Urbano' : 'Rural',
                        total: featuresResultPoblacionSisben[i].attributes.PUNTAJE
                    }));
                    if (featuresResultPoblacionSisben[i].attributes.TIPOAREA == 'U') {
                        serieUrbano.push(featuresResultPoblacionSisben[i].attributes.PUNTAJE);
                    } else if (featuresResultPoblacionSisben[i].attributes.TIPOAREA == 'R') {
                        serieRural.push(featuresResultPoblacionSisben[i].attributes.PUNTAJE);
                    }


                }
                var store = new ItemFileWriteStore({ data: data });

                if (dijit.byId("gridSocieconomica") != undefined) {
                    dijit.byId("gridSocieconomica").destroy();
                }

                /*create a new grid*/
                var grid = new DataGrid({
                    id: 'gridSocieconomica',
                    store: store,
                    structure: layout,
                    rowSelector: '10px',
                    style: "width: 380px;",
                    selectionMode: 'single',
                    canSort: function (col) {
                        return false;
                    }
                });

                grid.placeAt("divTablaConsultaSocioeconomica");

                grid.startup();
                grid.set('autoHeight', false);
                grid.set('autoWidth', true);
                grid.update();
                grid.set('autoWidth', false);

                //Grafica

                dojo.empty("graficaConsultaSocioeconomica");
                var leyenda = dijit.byId("leyendaGraficaConsultaSocioeconomica");
                if (leyenda != undefined) {
                    leyenda.destroyRecursive(true);
                }

                var graficaConsulta = new Chart("graficaConsultaSocioeconomica", {

                    title: featuresResultPoblacionSisben.length != 0 ? "Población Sisben de " + municipioSeleccionado + " en el año " + anioSeleccionado : "No existen datos de población sisben de <br>" + municipioSeleccionado + " en el año " + anioSeleccionado,
                    titlePos: "top",
                    titleGap: 5,
                    titleFont: "normal normal normal 11pt Arial",
                    titleFontColor: "black"

                });
                graficaConsulta.addPlot("default", {
                    type: "StackedColumns",
                    gap: 5,
                    animate: {
                        duration: 500,
                        easing: easing.bounceInOut
                    }
                })
                    .addAxis("x", {
                        title: "Población",
                        minorTicks: true,
                        minorLabels: true,
                        titleGap: 5,
                        natural: true,
                        vertical: true,
                        maxBarSize: 1,
                        minBarSize: 1,
                        min: 0
                    })
                    .addAxis("y", {
                        title: featuresResultPoblacionSisben.length != 0 ? "Niveles" : "",
                        minorTicks: true,
                        minorLabels: true,
                        titleGap: 5,
                        titleOrientation: "away",
                        natural: true,
                        fixUpper: "minor",
                        fixLower: "minor"
                    })
                    .addSeries("Rural", serieUrbano, {
                        stroke: { color: "#e6e6e6" },
                        fill: "#248f24",
                    })
                    .addSeries("Urbano", serieRural, {
                        stroke: { color: "#e6e6e6" },
                        fill: "#8a8a5c",
                    })

                var anim_c = new Tooltip(graficaConsulta, "default", {
                    text: function (chartItem) {
                        return Math.abs(chartItem.y);
                    }

                });
                graficaConsulta.render();
                var legendTwo = new Legend({ chart: graficaConsulta }, "leyendaGraficaConsultaSocioeconomica");
            });




        }
        /**
        * Cambia la simbologia de la grafica cuando se elecciona otro municipio.
        */
        function cambiarSymbolGraficaSocioeconomica() {
            var graficasMapa = map.graphics.graphics;
            var tempIdSeleccionada;
            var tempSimbologiaSeleccionada;
            var simbologiaSeleccionado = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color([102, 255, 255, 1]), 2), Color([102, 255, 255, 0.35]));
            for (var i in graficasMapa) {
                var grafica = graficasMapa[i];
                if (grafica.attributes.IDMUNICIPIO) {
                    if (grafica.attributes.IDMUNICIPIO == idGraficaSeleccionadaSocioeconomica) {
                        grafica.setSymbol(simbologiaAnterior);
                    }
                    if (grafica.attributes.IDMUNICIPIO == dijit.byId("gridSocieconomica").selection.getSelected()[0].id) {
                        tempIdSeleccionada = grafica.attributes.IDMUNICIPIO;
                        tempSimbologiaSeleccionada = grafica.symbol;
                        simbologiaSeleccionado.color = tempSimbologiaSeleccionada.color;
                        grafica.setSymbol(simbologiaSeleccionado);

                    }

                } else {
                    if (grafica.attributes.OBJECTID) {
                        if (grafica.attributes.OBJECTID == idGraficaSeleccionadaSocioeconomica) {
                            grafica.setSymbol(simbologiaAnterior);
                        }
                        if (grafica.attributes.OBJECTID == dijit.byId("gridSocieconomica").selection.getSelected()[0].id) {
                            tempIdSeleccionada = grafica.attributes.OBJECTID;
                            tempSimbologiaSeleccionada = grafica.symbol;
                            simbologiaSeleccionado.color = tempSimbologiaSeleccionada.color;
                            grafica.setSymbol(simbologiaSeleccionado);

                        }

                    }
                }
            }
            idGraficaSeleccionadaSocioeconomica = tempIdSeleccionada;
            simbologiaAnterior = tempSimbologiaSeleccionada;
        }

        /**
        * Muestra el div de la tabla y grafica de resultados.
        */
        function mostarSoloTabla() {
            $("#divOpcionesConsultaSocioeconomica").hide("fast");

            $('#btnGraficaAnteriorSocioeconomica').hide();
            $('#btnGraficaSiguienteSocioeconomica').hide();

            $('#btnLimpiarConsultaSocioeconomica').hide();
            $('#btnRegresarComsultaSocioeconomica').show();

            $("#divGraficaConsultaSocioeconomica").hide("fast");
            // panelSocioeconomica.position.width = 410;
            // panelSocioeconomica.position.height = 370;
            // panelSocioeconomica._originalBox = {
            //     w: panelSocioeconomica.position.width,
            //     h: panelSocioeconomica.position.height,
            //     l: panelSocioeconomica.position.left || 0,
            //     t: panelSocioeconomica.position.top || 0
            // };
            // panelSocioeconomica.setPosition(panelSocioeconomica.position);


            ajustarTamanioWidget(panelSocioeconomica,410,370);
            $("#divTablaGraficaConsultaSocioeconomica").show("fast");
        }


        /**
        * Muestra el div de la tabla y grafica de resultados.
        */
        function mostarTablaGrafica() {
            $("#divOpcionesConsultaSocioeconomica").hide("fast");
            $("#divGraficaConsultaSocioeconomica").show("fast");

            $('#btnLimpiarConsultaSocioeconomica').hide();
            $('#btnRegresarComsultaSocioeconomica').show();

            // panelSocioeconomica.position.width = 410;
            // panelSocioeconomica.position.height = 710;
            // panelSocioeconomica._originalBox = {
            //     w: panelSocioeconomica.position.width,
            //     h: panelSocioeconomica.position.height,
            //     l: panelSocioeconomica.position.left || 0,
            //     t: panelSocioeconomica.position.top || 0
            // };
            // panelSocioeconomica.setPosition(panelSocioeconomica.position);


            ajustarTamanioWidget(panelSocioeconomica,410,710);
            $("#divTablaGraficaConsultaSocioeconomica").show("fast");
        }
        /**
        * Muestra el div de la consulta socioeconomica.
        */
        function mostarConsulta() {
            $("#divTablaGraficaConsultaSocioeconomica").hide("fast");
            // panelSocioeconomica.position.width = 410;
            // panelSocioeconomica.position.height = 330;
            // panelSocioeconomica._originalBox = {
            //     w: panelSocioeconomica.position.width,
            //     h: panelSocioeconomica.position.height,
            //     l: panelSocioeconomica.position.left || 0,
            //     t: panelSocioeconomica.position.top || 0
            // };

            $('#btnLimpiarConsultaSocioeconomica').show();
            $('#btnRegresarComsultaSocioeconomica').hide();

            // panelSocioeconomica.setPosition(panelSocioeconomica.position);

            ajustarTamanioWidget(panelSocioeconomica,410,330);
            $("#divOpcionesConsultaSocioeconomica").show("fast");
        }
        /**
         * Retorna la simbologia de la grafica de acuerdo a los rangos del config.json
         * 
         * @param {Feature} feature  - Grafica para determinar la simbologia.
         * @param {string} seleccionado  - Seleccionde consulta por
         */
        function simbologiaFeatures(feature, seleccionado) {

            switch (seleccionado) {
                case "Población":
                    var leyendasPoblacion = this.config.leyendaPoblacion;
                    var totalPobMunicipio = feature.attributes.TOTAL;
                    for (var i in leyendasPoblacion) {
                        var leyenda = leyendasPoblacion[i];
                        if (totalPobMunicipio >= leyendasPoblacion[i].minimo && totalPobMunicipio < leyendasPoblacion[i].maximo) {
                            return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, Color.fromString("rgb(" + leyendasPoblacion[i].colorLine.toString() + ")"), 0.1), Color.fromString("rgb(" + leyendasPoblacion[i].colorFondo.toString() + ")"));
                        }
                    }
                    break;
                case "Necesidades Básicas Insatisfechas (NBI)":
                    var leyendasNBI = this.config.leyendaNBI;
                    var totalCveMunicipio = feature.attributes.TOTALCVE;
                    for (var i in leyendasNBI) {
                        var leyenda = leyendasNBI[i];
                        if (totalCveMunicipio >= leyendasNBI[i].minimo && totalCveMunicipio < leyendasNBI[i].maximo) {
                            return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, Color.fromString("rgb(" + leyendasNBI[i].colorLine.toString() + ")"), 0.1), Color.fromString("rgb(" + leyendasNBI[i].colorFondo.toString() + ")"));
                        }
                    }
                    break;
                case "Desplazados":
                    var leyendasDesplazados = this.config.leyendaDesplazados;
                    var totalDesplazados = feature.attributes.PERSONAS;
                    for (var i in leyendasDesplazados) {
                        var leyenda = leyendasDesplazados[i];
                        if (totalDesplazados >= leyendasDesplazados[i].minimo && totalDesplazados < leyendasDesplazados[i].maximo) {
                            return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, Color.fromString("rgb(" + leyendasDesplazados[i].colorLine.toString() + ")"), 0.1), Color.fromString("rgb(" + leyendasDesplazados[i].colorFondo.toString() + ")"));
                        }
                    }
                    break;

                case "Indicadores Socieconómicos":
                    var leyendaDesnutricion = this.config.leyendaDesnutricion;
                    var totalDesnutricion = feature.attributes.PORCENTAJE;
                    for (var i in leyendaDesnutricion) {
                        var leyenda = leyendaDesnutricion[i];
                        if (totalDesnutricion >= leyendaDesnutricion[i].minimo && totalDesnutricion < leyendaDesnutricion[i].maximo) {
                            return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, Color.fromString("rgb(" + leyendaDesnutricion[i].colorLine.toString() + ")"), 0.1), Color.fromString("rgb(" + leyendaDesnutricion[i].colorFondo.toString() + ")"));
                        }
                    }
                    break;

                case "Cobertura de Servicios Públicos":
                    var leyendaServiciosPublicos = this.config.leyendaServiciosPublicos;
                    var totalCoberturaServicio = feature.attributes.COBERTURA;
                    for (var i in leyendaServiciosPublicos) {
                        var leyenda = leyendaServiciosPublicos[i];
                        if (totalCoberturaServicio >= leyendaServiciosPublicos[i].minimo && totalCoberturaServicio <= leyendaServiciosPublicos[i].maximo) {
                            return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, Color.fromString("rgb(" + leyendaServiciosPublicos[i].colorLine.toString() + ")"), 0.1), Color.fromString("rgb(" + leyendaServiciosPublicos[i].colorFondo.toString() + ")"));
                        }
                    }
                    break;
            }


        }

        /**
         * Muestra el widget de leyenda de acuerdo a la consulta seleccionada.
         * 
         * @param {string} tituloLeyenda - Titulo para el widget.
         * @param {json} propiedadesLeyenda - Configuracion de la leyenda.
         */
        function mostrarLeyenda(tituloLeyenda, propiedadesLeyenda) {

            console.log('ups');
            def = new Deferred();
            wm = WidgetManager.getInstance();
            LeyendaSocioeconomicaWidget = wm.getWidgetById('widgets_LeyendaSocioeconomica_1');
            if (LeyendaSocioeconomicaWidget == null) {
                console.log('Widget No esta cargado');
                confWidget = wm.appConfig.getConfigElementById('widgets_LeyendaSocioeconomica_1');
                console.log(confWidget);
                wm.loadWidget(confWidget).then(function () {
                    PanelManager.getInstance().showPanel(confWidget).then(function () {
                        wm.openWidget(confWidget.id);
                        topic.publish("leyendaSocioeconomica", { titulo: tituloLeyenda, configLeyenda: propiedadesLeyenda });
                        def.resolve();
                    });
                });
            } else {
                console.log('Widget ya esta Cargado');
                PanelManager.getInstance().showPanel(LeyendaSocioeconomicaWidget).then(function () {
                    wm.openWidget(LeyendaSocioeconomicaWidget);
                    topic.publish("leyendaSocioeconomica", { titulo: tituloLeyenda, configLeyenda: propiedadesLeyenda });
                    def.resolve();
                })

            }

        }

        /**
         * Exporta la tabla a CSV.
         */
        function exportarTabla() {

            //ResultadosJson
            var ReportTitle = "Resultados";
            var ShowLabel = true;
            ResultadosJson = dijit.byId("gridSocieconomica").store._arrayOfAllItems;
            if (ResultadosJson.length != 0) {
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

                alert("No  hay registros para exportar.")
            }
        }

        function cerrarWidgetLeyenda() {

            panelManager = PanelManager.getInstance();
            widgetCerrar = PanelManager.getInstance().getPanelById("widgets_LeyendaSocioeconomica_1_panel");
            for (var e in PanelManager.getInstance().panels) {
                if (PanelManager.getInstance().panels[e].id == "widgets_LeyendaSocioeconomica_1_panel") {
                    widgetCerrar = PanelManager.getInstance().panels[e].id;
                }
            }
            if (widgetCerrar != undefined) {
                panelManager.closePanel("widgets_LeyendaSocioeconomica_1_panel");
                panelManager.destroyPanel("widgets_LeyendaSocioeconomica_1_panel");
            }
        }


        function removerDuplicadosArrayString(arr) {
            let unique_array = []
            for (let i = 0; i < arr.length; i++) {
                if (unique_array.indexOf(arr[i]) == -1) {
                    unique_array.push(arr[i])
                }
            }
            return unique_array

        }

        function limpiarSelects() {

            $("#selConsultaSocioeconomica").prop('selectedIndex', 0);
            $("#selTipoDesplazadoSocioeconomica").prop('selectedIndex', 0);
            $("#selTipoIndicadorSocioeconomica").prop('selectedIndex', 0);
            $("#selTipoServicioSocioeconomica").prop('selectedIndex', 0);
            $("#selAnioSocioeconomica").prop('selectedIndex', 0);


            $("#selTipoDesplazadoSocioeconomica").prop('disabled', true);
            $("#selTipoIndicadorSocioeconomica").prop('disabled', true);
            $("#selTipoServicioSocioeconomica").prop('disabled', true);
            $("#selAnioSocioeconomica").prop('disabled', true);

        }

    });
