var consultaAmbiental = {};
define(["dojo/dom", 'dojo/on', 'dojo/_base/declare', 'dojo/_base/lang',
    'jimu/BaseWidget', 'dojo/_base/html', "esri/toolbars/draw",
    "esri/geometry/webMercatorUtils", "esri/map", "dojo/query",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/toolbars/draw",
    "dijit/registry", "dojo/parser", "esri/graphic", "esri/tasks/GeometryService",
    "esri/tasks/BufferParameters", "esri/geometry/Point", "esri/SpatialReference",
    "esri/geometry/normalizeUtils", "esri/renderers/SimpleRenderer", "dojo/_base/array",
    "esri/layers/FeatureLayer", "esri/tasks/query", "esri/renderers/jsonUtils",
    "esri/request", "dojo/_base/json", "esri/InfoTemplate", "esri/geometry/Extent",
    "esri/tasks/GeometryService", "esri/tasks/ProjectParameters", "jimu/PanelManager",
    "dojo/dom-class", "esri/dijit/Popup", "dojo/dom-construct", "esri/tasks/QueryTask",
    "dijit/Calendar", "dojo/date", "dojo/Deferred", "dojo/date/locale",
    "dojo/_base/event", "esri/dijit/FeatureTable", "jimu/WidgetManager",
    "dojo/domReady!"
],
    function (dom, on, declare, lang, BaseWidget, html, Draw, webMercatorUtils,
        Map, query, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
        Color, Draw, registry, parser, Graphic, GeometryService,
        BufferParameters, Point, SpatialReference, normalizeUtils,
        SimpleRenderer, array, FeatureLayer, Query, jsonUtil, esriRequest,
        dojoJson, InfoTemplate, Extent, GeometryService, ProjectParameters,
        PanelManager, domClass, Popup, domConstruct, QueryTask, Calendar, date,
        Deferred, locale, event, FeatureTable, WidgetManager

    ) {
        var widgetMyResultados = "widgets_MyWidgetResultados_Widget_40";

        var clazz = declare([BaseWidget], {
            name: 'Consulta Ambiental',

            baseClass: 'jimu-widget-ConsultaAmbiental',

            postCreate: function () {
                consultaAmbiental.self = this;
                var panel = this.getPanel();
                this.inherited(arguments);
                currentLayer = this.map.getLayer("capaResultadoCA");

            },

            startup: function () {
                $('#widgets_ConsultaAmbiental_Widget_39_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza consulta ambiental con par&aacute;metros de entrada"></div>');

                query("#selecArea").on("change", function (evt) {
                    var areaSelected = this.options[this.selectedIndex].text;
                    if (areaSelected != "Seleccione" && areaSelected != consultaAmbiental.confirAreaSelected) {
                        map.setExtent(map._initialExtent);
                        consultaAmbiental.confirAreaSelected = areaSelected;
                        consultaAmbiental.confirMunicipioSelected = undefined;
                        consultaAmbiental.confirCategoriaSelected = "";
                        consultaAmbiental.mostrarConsultaAnterior = false;
                        quitarLayersCargadosCA();
                        mostrarTematicaCA(areaSelected);           
                        $('#botonBuscar').prop('disabled', true);                        
                        limpiarContenedor("selectCategoria");
                        limpiarContenedor("selectSubCategoria");
                        limpiarContenedor("selectNombre");
                        limpiarContenedor("selectAnio");
                        limpiarContenedor("selectMunicipio");
                        $('#inputFechaInicio').prop('disabled', true);
                        $('#inputFechaFin').prop('disabled', true);
                        $('#selectTematica').prop('disabled', false);  
                       
                    }                    
                });
                query("#selectTematica").on("change", function (evt) {
                    var tematicaSelected = this.options[this.selectedIndex].text;
                    if (tematicaSelected != "" && tematicaSelected != consultaAmbiental.confirTematicaSelected) { 
                        consultaAmbiental.confirTematicaSelected = tematicaSelected;
                        mostrarCategoriaCA(tematicaSelected);
                        consultaAmbiental.confirMunicipioSelected = undefined;
                        consultaAmbiental.mostrarConsultaAnterior = false;
                        map.graphics.clear();
                        $('#botonBuscar').prop('disabled', true);              
                        document.getElementById("selectSubCategoria").length = 0;
                        $('#selectSubCategoria').prop('disabled', true);
                        document.getElementById("selectNombre").length = 0;
                        $('#selectNombre').prop('disabled', true);
                        $("#leyendaGraficaConsulta").hide();
                        $('#selectAnio').prop('disabled', true); $('#selectAnio').val(''); 
                        cerrarWidgetLeyendaCA();
                    }                    
                });
                query("#selectCategoria").on("change", function (evt) {
                    var categoriaSelected = this.options[this.selectedIndex].text;
                    if (categoriaSelected != "" && categoriaSelected != consultaAmbiental.confirCategoriaSelected) {
                        consultaAmbiental.mostrarConsultaAnterior = false;
                        consultaAmbiental.confirMunicipioSelected = undefined;
                        consultaAmbiental.confirSubCategoriaSelected = 0;                        
                        consultaAmbiental.objetoSeleccionado.trammitesAmbientales = undefined;
                        consultaAmbiental.confirCategoriaSelected = categoriaSelected;
                        document.getElementById("selectNombre").length = 0;
                        $('#selectNombre').prop('disabled', true);                                                                                                                      
                        $('#selectAnio').prop('disabled', true); $('#selectAnio').val(''); 
                        $('#botonBuscar').prop('disabled', true);                                                                                               
                        textoCargando("selectSubCategoria");   
                        mostrarSubCategoriaCA(categoriaSelected);
                        cerrarWidgetLeyendaCA();
                    }
                });
                query("#selectSubCategoria").on("change", function (evt) {
                    var selectSubCategoria = this.options[this.selectedIndex].text;
                    var selectSubCategoriaValue = this.options[this.selectedIndex].value;
                    if (selectSubCategoria != "" && selectSubCategoria != consultaAmbiental.confirSubCategoriaSelected &&
                    selectSubCategoria != "Seleccione...") { 
                        $('#botonBuscar').prop('disabled', true);                       
                        showLoader();    
                        $("#ButtonSiguiente").hide();                    
                        consultaAmbiental.mostrarConsultaAnterior = false;
                        consultaAmbiental.confirSubCategoriaSelected = selectSubCategoria;
                        consultaAmbiental.confirSubCategoriaSelectedValue = selectSubCategoriaValue;
                        consultaAmbiental.confirNombreSelected = undefined;
                        var where, url, geometry, campos, opacity = 0.7;
                        if (consultaAmbiental.confirCategoriaSelected == "Estaciones") {
                            $('#selectMunicipio').prop('disabled', true);
                            consultaAmbiental.confirMunicipioSelected = undefined;
                            textoCargando("selectNombre");                                                   
                            where = "1=1";
                            campos = ["NOMBRE", "IDESTACION"];
                            geometry = false;
                            if (selectSubCategoria == "Limnigr�fica" || selectSubCategoriaValue == 1) {
                                url = SERVICIO_AMBIENTAL + "/" + "62";
                            } else if (selectSubCategoria == "Metereol�gica" || selectSubCategoriaValue == 2) {
                                url = SERVICIO_AMBIENTAL + "/"+"63";
                            }
                        }else if (consultaAmbiental.confirCategoriaSelected == "Puntos de calidad") {
                            textoCargando("selectNombre");
                            $('#selectMunicipio').prop('disabled', true);
                            consultaAmbiental.confirMunicipioSelected = undefined;
                            if(selectSubCategoria == "Calidad de Agua" || selectSubCategoria == "Red de monitoreo de la calidad del agua"){
                                where = "1=1";
                                campos = ["NOMBRE", "IDESTACION"];
                                geometry = false;
                                url = SERVICIO_AMBIENTAL + "/64";
                            }else if(selectSubCategoria == "Calidad de Aire" || selectSubCategoria == "Estación de monitoreo de la calidad del aire"){
                                where = "1=1";
                                campos = ["NOMBRE", "IDESTACION"];
                                geometry = false;
                                url = SERVICIO_AMBIENTAL + "/65";
                            }
                            
                        }else if (consultaAmbiental.confirCategoriaSelected == "Tramites ambientales" ||
                        consultaAmbiental.confirCategoriaSelected == "Tramites ambientales predios") {
                            $('#selectMunicipio').prop('disabled', false);
                            $('#botonBuscar').prop('disabled', false);
                            if (1) {
                                document.getElementById("selectNombre").length = 0;
                                var municipios = consultaAmbiental.municipios;
                                if ($("#selectMunicipio")[0].length == 0) {
                                    for(var i in municipios){
                                        municipios[i].name = municipios[i].name;
                                    }
                                    var contenedor = "selectMunicipio";
                                    var datos = municipios;
                                    cargarDatos(contenedor, datos);   
                                    consultaAmbiental.municipiosCargados = false;
                                }    
                                hideLoader();
                            }                                                        
                        }
                        if (url != undefined) {
                            crearFeatureLayer(url, opacity);
                            consultaAmbiental.urlSubCategoria = url;                        
                            realizarQuery(campos, url, geometry, where);                            
                        }else if(consultaAmbiental.confirCategoriaSelected != "Tramites ambientales" &&
                        consultaAmbiental.confirCategoriaSelected != "Tramites ambientales predios"){
                            createDialogInformacionGeneral("<B> Nota </B>", "URL no encontrada");
                        }                                                                     
                    }
                    hideLoader();
                });
                query("#selectNombre").on("change", function (evt) {
                    var selectNombre = this.options[this.selectedIndex].text;
                    if (selectNombre != '' && selectNombre != consultaAmbiental.confirNombreSelected) {
                        consultaAmbiental.mostrarConsultaAnterior = false;
                        consultaAmbiental.confirNombreSelected = selectNombre;
                        consultaAmbiental.confirMunicipioSelected = undefined;
                        if(consultaAmbiental.confirTematicaSelected == "Ambiental"){
                            $("#fechaInicio").prop('disabled',false);
                            $("#fechaFin").prop('disabled',false);                           
                        }                        
                        $('#botonBuscar').prop('disabled', false);
                    }
                });
                query("#selectMunicipio").on("change", function (evt) {
                    var selectNombre = this.options[this.selectedIndex].text;
                    if (selectNombre != 'Seleccione...' && selectNombre != consultaAmbiental.confirMunicipioSelected) {
                        consultaAmbiental.confirMunicipioSelected = selectNombre;
                        $("#fechaInicio").prop('disabled',false);
                        $("#fechaFin").prop('disabled',false);                   
                        $('#botonBuscar').prop('disabled', false);
                        consultaAmbiental.mostrarConsultaAnterior = false;                                                
                    }else{
                        consultaAmbiental.confirMunicipioSelected = undefined;
                    }
                });
                query("#botonBuscar").on("click", function (evt) {
                    showLoader();
                    var fechaInicio = $("#fechaInicio").val().split('/');
                    var fechaFin = $("#fechaFin").val().split('/');
                    var validacionFecha = Date.parse(fechaFin[1] + '/' + fechaFin[0] + '/' + fechaFin[2]) < Date.parse(fechaInicio[1] + '/' + fechaInicio[0] + '/' + fechaInicio[2]);
                    var ejecutarConsulta = true;                                                                    
                    if((consultaAmbiental.confirCategoriaSelected == "Tramites ambientales" ||
                        consultaAmbiental.confirCategoriaSelected == "Tramites ambientales predios" ||
                        consultaAmbiental.confirCategoriaSelected == "Predios de reforestaci\u00F3n") && 
                        consultaAmbiental.confirMunicipioSelected == undefined){
                        createDialogInformacionGeneral("<B> Nota </B>", "Recuerda debes seleccionar el municipio a consultar");
                        ejecutarConsulta = false;
                    }else if(consultaAmbiental.confirTematicaSelected == "Ambiental" &&
                        ($("#fechaInicio").val() == "" || $("#fechaFin").val() == "")){
                        createDialogInformacionGeneral("<B> Nota </B>", "La fecha fin y fecha de inicio, no deben estar en blanco");
                        ejecutarConsulta = false;
                    }else if(consultaAmbiental.confirTematicaSelected == "Ambiental" && validacionFecha){
                        createDialogInformacionGeneral("<B> Nota </B>", "La fecha fin debe ser mas actual que la fecha de inicio");
                        ejecutarConsulta = false;
                    }else if(consultaAmbiental.confirTematicaSelected == "Socioecon\u00F3mico" &&
                        (consultaAmbiental.annioSelected == '' && consultaAmbiental.annioSelected == null)) {
                        createDialogInformacionGeneral("<B> Nota </B>", "Recuerda debes seleccionar el a\u00F1o a consultar");
                        ejecutarConsulta = false;                        
                    } 
                    var validadcionFecha1 = consultaAmbiental.fechaIniSelected == $("#fechaInicio").val();
                    var validadcionFecha2 = consultaAmbiental.fechaFinSelected == $("#fechaFin").val();
                    if(consultaAmbiental.mostrarConsultaAnterior && validadcionFecha1 && validadcionFecha2){
                        mostrarTablaYGraficoCA();
                    }else if(consultaAmbiental.confirTematicaSelected == "Socioecon\u00F3mico" && consultaAmbiental.mostrarConsultaAnterior){
                        mostrarTablaYGraficoCA();
                    }else if(ejecutarConsulta) {
                        if(consultaAmbiental.graficaResultados != undefined){
                            consultaAmbiental.graficaResultados.destroy();
                            consultaAmbiental.graficaResultados = undefined;
                            consultaAmbiental.existeGrafica = undefined;
                        }
                        quitarCalendarioTablaYgraficaCA();
                        formarConsultaFinal();
                        ocultarBoxServicios(true);
                    }else{
                        hideLoader();

                    }
                    document.getElementById("btnLimpiar").style.display = "none";
                });
                query("#botonRegresar").on("click", function (evt) {
                    $("#divtTablaConsultaAmbiental").hide("fast");                    
                    $("#divConsultaAmbienta").show("fast");
                    var panel = consultaAmbiental.panel;
                    panel.position.width = 350;
                    panel.position.height = 460;
                    panel._originalBox = {
                        w: panel.position.width,
                        h: panel.position.height,
                        l: panel.position.left || 60,
                        t: panel.position.top || 120
                    };
                    panel.setPosition(panel.position);
                    panel.panelManager.normalizePanel(panel);
                    ocultarBoxServicios(false);
                });                
                query("#ButtonSiguiente").on("click", function (evt) {
                    consultaAmbiental.contadorListas++;
                    showLoader();
                    var contador;
                    if (consultaAmbiental.contadorListas < consultaAmbiental.lists.length) {
                        contador = consultaAmbiental.contadorListas;
                    } else {
                        consultaAmbiental.contadorListas = 0;
                        contador = 0;
                    }
                    var chartResultado = consultaAmbiental.graficaResultados;
                    if (chartResultado != undefined) {
                        chartResultado.destroy();
                        consultaAmbiental.graficaResultados = undefined;
                    }
                    var data = consultaAmbiental.lists[contador];
                    if (consultaAmbiental.confirCategoriaSelected == "Puntos de calidad" && (
                        consultaAmbiental.confirSubCategoriaSelected == "Calidad de Agua" || consultaAmbiental.confirSubCategoriaSelected == "Red de monitoreo de la calidad del agua")) {
                        dibujarDatosEnGraficaPunto("Fecha", "Valor");
                    } else if (consultaAmbiental.confirCategoriaSelected == consultaAmbiental.categoria[1].categoria[2].nombreCategoria) {
                        consultaAmbiental.mostrarCVE = !consultaAmbiental.mostrarCVE;
                        consultaAmbiental.existeGrafica = undefined;                                       
                        dibujarGraficaBarras();
                    } else {
                        var complemento = [" \u00B0C", " (mb)", "", "", " (mm)", " (mm/a\u00F1o)"];
                        dibujarDatosEnGrafica(data, null, consultaAmbiental.fields[contador], "Fecha", consultaAmbiental.fields[contador] + complemento[contador]);
                    }                    
                });
                query("#selectAnio").on("click", function (evt) {
                    var selec = this.options[this.selectedIndex].text;                    
                    if (selec != '' && selec != consultaAmbiental.annioSelected) {
                        consultaAmbiental.annioSelected = selec;
                        consultaAmbiental.mostrarConsultaAnterior = false;                        
                    }
                });
                query("#btnLimpiarCA").on("click", function (evt) {
                    var selects = ["selectTematica", "selectCategoria", "selectSubCategoria", "selectNombre", "selectAnio", "selectMunicipio", "inputFechaInicio", "inputFechaFin"];
                    cargarDatos("selecArea", consultaAmbiental.areas);
                    for (var i in selects) {
                        limpiarContenedor(selects[i], true)
                    }
                    consultaAmbiental.confirAreaSelected = undefined;
                    
                    //ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, 96);
                });
                $('#inputFechaInicio .input-group.date').datepicker({
                    format: "dd/mm/yyyy",
                    maxViewMode: 2,
                    todayBtn: true,
                    language: "es",
                    orientation: "bottom auto",
                    multidate: false,
                    autoclose: true,
                    todayHighlight: true,
                    beforeShowMonth: function (date) {                         
                        if (date.getMonth() == 8) {
                            consultaAmbiental.anioBeguin = date.getFullYear();
                            return false;
                        }
                    }
                });
                $('#inputFechaFin .input-group.date').datepicker({
                    format: "dd/mm/yyyy",
                    maxViewMode: 2,
                    todayBtn: true,
                    language: "es",
                    orientation: "bottom auto",
                    multidate: false,
                    autoclose: true,
                    todayHighlight: true,
                    beforeShowMonth: function (date) {
                        if (date.getMonth() == 8) {
                            consultaAmbiental.anioEnd = date.getFullYear();
                            return false;
                        }
                    }
                });
            },
            onOpen: function () {
                consultaAmbiental.labelCuencaRiosLaVieja = "Cuenca del R\u00EDo La Vieja";
                consultaAmbiental.mostrarConsultaAnterior = false;
                consultaAmbiental.selects = ["selecArea","selectTematica","selectCategoria","selectSubCategoria","selectNombre","selectMunicipio","botonBuscar","selectAnio","inputFechaInicio","inputFechaFin"];
                consultaAmbiental.selectDesabilitados = [];
                consultaAmbiental.mostrarCVE = false;
                consultaAmbiental.existeGrafica = undefined;
                consultaAmbiental.configConsAmb = config = this.config;
                consultaAmbiental.extentInitial = map.extent;
                consultaAmbiental.municipiosCargados = true;
                consultaAmbiental.annioSelected = null;
                consultaAmbiental.municipios = municipiosName;
                consultaAmbiental.confirMunicipioSelected = false;
                consultaAmbiental.confirMunicipioSelected = null;
                var panel = this.getPanel();
                consultaAmbiental.panel = panel;
                panel.position.width = 350;
                panel.position.height = 460;
                panel._originalBox = {
                    w: panel.position.width,
                    h: panel.position.height,
                    l: panel.position.left || 60,
                    t: panel.position.top || 120
                };
                panel.setPosition(panel.position);
                panel.panelManager.normalizePanel(panel);

                consultaAmbiental.objetoSeleccionado = {};
                consultaAmbiental.id = 'CA';
                consultaAmbiental.idFeatures = [];
                consultaAmbiental.areas = ['Seleccione', 'Quind\u00EDo', consultaAmbiental.labelCuencaRiosLaVieja];

                consultaAmbiental.tematicas = [{
                    area: 'Quind\u00EDo',
                    tematicas: ['', 'Ambiental'],
                    url: ''
                }, {
                    area: consultaAmbiental.labelCuencaRiosLaVieja,
                    tematicas: ['', 'Ambiental'/*, 'Socioecon\u00F3mico'*/],
                    url: SERVICIO_CUENCALAVIEJA
                }
                ];
                var selectArea = document.getElementById("selecArea");
                selectArea.length = 0;
                for (var i in consultaAmbiental.areas) {
                    selectArea.options[selectArea.options.length] = new Option(consultaAmbiental.areas[i], i);
                };
                $("#fechaInicio").prop('disabled',true);
                $("#fechaFin").prop('disabled',true);
                habilitarSlects(false, "selecArea");
                if(consultaAmbiental.idFeatures == undefined){
                    consultaAmbiental.idFeatures = [];
                }
            },
            onClose: function () {
                // prenderApagarDivs("none", "none");
                mostrarConsultaAmbiental();
                quitarCalendarioTablaYgraficaCA();
                cerrarWidgetLeyendaCA();
                quitarLayersCargadosCA();
                //document.getElementById("divArea").style.display = "block";    
                consultaAmbiental.confirAreaSelected = undefined;
                //document.getElementById("divAnio").style.display = "none";    

                $('#selecArea').val(0);
                $('#selectTematica').val(0);
                $('#selectTematica').prop('disabled', true);
                $('#selectCategoria').val(0);
                $('#selectCategoria').prop('disabled', true);
                $('#selectSubCategoria').val(0);
                $('#selectSubCategoria').prop('disabled', true);  $('#selectSubCategoria').val(0);
                $('#selectNombre').val("");
                $('#selectNombre').prop('disabled', true);  
                $('#selectAnio').val(0);
                $('#selectAnio').prop('disabled', true);
                $('#selectMunicipio').val(0);
                $('#selectMunicipio').prop('disabled', true);

                $('#fechaFin').val('');
                $('#fechaInicio').val('');


                map.setExtent(map._initialExtent);
                map.graphics.clear();
                dojo.disconnect();
                hideLoader();
            }
        });
               
        function mostrarConsultaAmbiental() {
            $('#divConsultaAmbienta').show("fast");
            $('#divtTablaConsultaAmbiental').hide("fast");
            $('#gridDivConsultaAmbiental').hide("fast");

        }
        function cerrarWidgetLeyendaCA() {
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
                map.graphics.clear();
            }
        }       
        function quitarCalendarioTablaYgraficaCA() {          
            if (consultaAmbiental.tablaResultados != undefined) {
                consultaAmbiental.tablaResultados.destroy();
                consultaAmbiental.tablaResultados = undefined;
            }            
            if (consultaAmbiental.graficaResultados != undefined) {
                consultaAmbiental.graficaResultados.destroy();
                consultaAmbiental.graficaResultados = undefined;
                consultaAmbiental.existeGrafica = undefined;
            }
            
        }
        function prenderApagarDivsCA(turn1, turn2) {
            document.getElementById("divArea").style.display = turn1;
            document.getElementById("divTematica").style.display = turn1;
            document.getElementById("divCategoria").style.display = turn1;
            document.getElementById("divSubCategoria").style.display = turn1;
            document.getElementById("divNombre").style.display = turn1;
            document.getElementById("fechaInicial").style.display = turn1;         
            document.getElementById("divBotonBuscar").style.display = turn1;
            document.getElementById("divtTablaConsultaAmbiental").style.display = turn2;
            document.getElementById("divMunicipio").style.display = turn1;
        }
        function formarConsultaFinal() {         
            var donde, campos, url, retornarGeometri;
            if (consultaAmbiental.confirCategoriaSelected == "Estaciones" && (consultaAmbiental.confirSubCategoriaSelected == "Metereol\u00F3gica" ||
                consultaAmbiental.confirSubCategoriaSelectedValue == 2)) {
                donde = "NOMBRE_ESTACION = '" + consultaAmbiental.confirNombreSelected + "'";
                url = SERVICIO_AMBIENTAL_ALFANUMERICO + '/3';
                campos = ["OBJECTID","FECHA", "TEMPERATURA", "HUMEDAD", "BRILLOSOLAR", "VIENTOS", "EVAPORACION", "PRECIPITACION"];
                retornarGeometri = true;
                consultaAmbiental.fechaIniSelected = $("#fechaInicio").val();
                consultaAmbiental.fechaFinSelected = $("#fechaFin").val();
            } else if (consultaAmbiental.confirCategoriaSelected == "Puntos de calidad") {
                if (consultaAmbiental.confirSubCategoriaSelected == "Calidad de Agua" || consultaAmbiental.confirSubCategoriaSelected == "Red de monitoreo de la calidad del agua") {
                    url = SERVICIO_AMBIENTAL_ALFANUMERICO + '/0';
                    campos = ["OBJECTID", "FECHA", "VALORPARAMETRO", "PARAMETRO"];
                } else if (consultaAmbiental.confirSubCategoriaSelected == "Calidad de Aire" || consultaAmbiental.confirSubCategoriaSelected == "Estaci\u00F3n de monitoreo de la calidad del aire") {
                    url = SERVICIO_AMBIENTAL_ALFANUMERICO + '/4';
                    campos = ["OBJECTID", "FECHA", "CALIDAD"];
                }               
                donde = "NOMBREESTACION = '" + consultaAmbiental.confirNombreSelected + "'";
                retornarGeometri = true;
                consultaAmbiental.fechaIniSelected = $("#fechaInicio").val();
                consultaAmbiental.fechaFinSelected = $("#fechaFin").val();
            } else if (consultaAmbiental.confirCategoriaSelected == "Tramites ambientales") {
                var codigoMunicipio;
                for (var i in consultaAmbiental.municipios) {
                    if (consultaAmbiental.confirMunicipioSelected == consultaAmbiental.municipios[i].name) {
                        codigoMunicipio = consultaAmbiental.municipios[i].id;
                        break;
                    }
                    
                }
                url = SERVICIO_AMBIENTAL_ALFANUMERICO + '/10';
                campos = ["OBJECTID", "IDMUNICIPIO", "NUMEROPREDIAL", "RESOLUCION", "FECHARESOLUCION", "FECHAINFRACCION", "VOLUMENOTORGADO", "AREAAFECTADA", "CAUDALOTORGADO", "FUENTEAFECTADA"];
                atributo = consultaAmbiental.atributoTramitesAnbietales;
                donde =  atributo + " = '" + consultaAmbiental.confirSubCategoriaSelected + "'" + " AND IDMUNICIPIO = '" + codigoMunicipio + "'";
                retornarGeometri = true;
                consultaAmbiental.fechaIniSelected = $("#fechaInicio").val();
                consultaAmbiental.fechaFinSelected = $("#fechaFin").val();
            } else if (consultaAmbiental.confirCategoriaSelected == "Predios de reforestaci\u00F3n") {
                document.getElementById("divSubCategoria").style.display = "none";
                url = consultaAmbiental.objetoSeleccionado.urlCategoria;
                var idMunicipio;
                for (var i in consultaAmbiental.municipios) {
                    if (consultaAmbiental.municipios[i].name == consultaAmbiental.confirMunicipioSelected) {
                        idMunicipio = consultaAmbiental.municipios[i].id;
                        break;
                    }
                }
              
                campos = ["OBJECTID", "NOMBRE", "NUMEROPREDIAL", "HECTAREASREFORESTADAS", "ANIO", "TIPO_REFORESTACION"];
                donde = "IDMUNICIPIO = '" + idMunicipio + "' AND ANIO BETWEEN '" + consultaAmbiental.anioBeguin + "' AND '" + consultaAmbiental.anioEnd + "'";
                retornarGeometri = true;
            } else if (consultaAmbiental.confirCategoriaSelected == "Tramites ambientales predios") {                
                url = consultaAmbiental.objetoSeleccionado.urlCategoria;
                var idMunicipio;
                for (var i in consultaAmbiental.municipios) {
                    if (consultaAmbiental.municipios[i].name == consultaAmbiental.confirMunicipioSelected) {
                        idMunicipio = consultaAmbiental.municipios[i].id;
                        break;
                    }
                }                
                campos = ["OBJECTID", "LUGAROCURRENCIA", "NIT", "NUMEROPREDIAL", "RESOLUCION", "VOLUMENOTORGADO", "AREAAFECTADA", "FECHARESOLUCION"];
                donde = "IDMUNICIPIO = '" + idMunicipio + "' AND DESCRIPCIONVALOR =  '" + consultaAmbiental.confirSubCategoriaSelected + "'";
                retornarGeometri = true;
            } else if (consultaAmbiental.categoria[1].categoria[1].nombreCategoria == consultaAmbiental.confirCategoriaSelected) {
                donde = "ANIO = '" + consultaAmbiental.annioSelected + "'";
                url = SERVICIO_SOCIOECONOMICO + '/4';
                campos = ["OBJECTID", "IDMUNICIPIO", "URBANO", "RURAL", "TOTAL"];
                retornarGeometri = true;
            } else if (consultaAmbiental.categoria[1].categoria[2].nombreCategoria == consultaAmbiental.confirCategoriaSelected) {
                donde = "ANIO = '" + consultaAmbiental.annioSelected + "'";
                url = SERVICIO_SOCIOECONOMICO + '/1';
                campos = ["OBJECTID", "NOMBRE", "PROPOSICIONPORCENTUALU", "PROPOSICIONPORCENTUALR", "CVEU", "CVER", "TOTALPROPOR", "TOTALCVE"];
                retornarGeometri = true;
            } else {
            
                if (consultaAmbiental.confirSubCategoriaSelectedValue == 2) {
                    url = SERVICIO_AMBIENTAL_ALFANUMERICO + '/3';
                    campos = ["OBJECTID", "FECHA", "TEMPERATURA", "HUMEDAD", "BRILLOSOLAR", "VIENTOS", "EVAPORACION", "PRECIPITACION"];
                }else{
                    url = SERVICIO_AMBIENTAL_ALFANUMERICO + '/2';
                    campos = ["OBJECTID", "FECHA", "CAUDALMES", "NOMBRE_ESTACION"];
                }
                donde = "NOMBRE_ESTACION = '" + consultaAmbiental.confirNombreSelected + "'";                                
                retornarGeometri = true;
                consultaAmbiental.fechaIniSelected = $("#fechaInicio").val();
                consultaAmbiental.fechaFinSelected = $("#fechaFin").val();
            }

            consultaAmbiental.urlAlfanumerico = url;
            var queryTask = new QueryTask(url);
            var query = new Query();
            query.outFields = campos;
            query.where = donde;
            query.outSpatialReference = map.spatialReference;
            query.returnGeometry = retornarGeometri;
            queryTask.execute(query, mostrarResultadosEnTablaCA);
        }
        function mostrarResultadosEnTablaCA(result) {//result es el array q contiene los datos a mostrar          
            if (result.features.length <= 0) {
                hideLoader();
                createDialogInformacionGeneral("<B> Resultados </B>", "La selecci\u00F3n no contiene resultados");
                ocultarBoxServicios(false);
            } else {
                consultaAmbiental.features = result.features;
                consultaAmbiental.mostrarConsultaAnterior = true;
                require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                    function (lang, Datagrid, ItemFileWriteStore, dom) {
                        //////organiza datos para cargarlo en data_list                                           
                        var data_list = [], data_listExportar = [], fechaMesAgno = [], tablas = [], layout;
                        var data = {
                            identifier: "id",
                            items: []
                        };
                        var listDato1 = [], listDato2 = [], listDato3 = [], listDato4 = [],
                            listDato5 = [], listDato6 = [];
                        var layout = [], fields = [];
                        consultaAmbiental.lists = [];
                        consultaAmbiental.contadorListas = 0;
                        var configConsAmbiental = consultaAmbiental.configConsAmb;
                        for (var i = 0, a = 1; i < (result.fields.length * 1) - 1; i++) {
                            fields[i] = result.fields[a].name;
                            a++;
                        }

                        if (consultaAmbiental.confirCategoriaSelected == "Puntos de calidad" && (
                            consultaAmbiental.confirSubCategoriaSelected == "Calidad de Agua" || consultaAmbiental.confirSubCategoriaSelected == "Red de monitoreo de la calidad del agua")) {
                            for (var i in result.features) {
                                fields[i] = result.features[i].attributes.PARAMETRO;
                                if (result.features[i].attributes.VALORPARAMETRO == null) {
                                    result.features[i].attributes.VALORPARAMETRO = 0;
                                }
                                var fecha = new Date(result.features[i].attributes.FECHA);
                                data_list[i] = {
                                    col1: result.features[i].attributes.OBJECTID,
                                    col2: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    col3: result.features[i].attributes.PARAMETRO,
                                    col4: result.features[i].attributes.VALORPARAMETRO
                                };
                                data_listExportar[i] = {
                                    Fecha: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    PARAMETRO: result.features[i].attributes.PARAMETRO,
                                    VALORPARAMETRO: result.features[i].attributes.VALORPARAMETRO
                                };
                            }                            
                            if(data_list.length <= 0){
                                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                            }else{
                                mostrarTablaYGraficoCA();
                                layout = [[
                                    { 'name': 'ID', 'field': 'col1', 'width': '10%' },
                                    { 'name': 'Fecha', 'field': 'col2', 'width': '30%' },
                                    { 'name': 'Par\u00E1metro', 'field': 'col3', 'width': '30%' },
                                    { 'name': 'Valor', 'field': 'col4', 'width': '30%' }
                                ]];
                                consultaAmbiental.lists = data_list;
                                dibujarDatosEnGraficaPunto("Fecha","Valor");                            
                                $("#ButtonSiguiente").show();
                                document.getElementById("divGraficaConsultaAmbiental").style.display = "flex";
                                document.getElementById("gridDivConsultaAmbiental").style.height = "167px";
                            }
                        } else if (consultaAmbiental.confirSubCategoriaSelected == "Calidad de Aire" || consultaAmbiental.confirSubCategoriaSelected == "Estaci\u00F3n de monitoreo de la calidad del aire") {
                            //document.getElementById("ButtonSiguiente").style.display = "none";
                            $("#ButtonSiguiente").hide();
                            for (var i in result.features) {
                                var fecha = new Date(result.features[i].attributes.FECHA);
                                if (result.features[i].attributes.CALIDAD == null) {
                                    result.features[i].attributes.CALIDAD = 0;
                                }
                                data_list[i] = {
                                    col1: result.features[i].attributes.OBJECTID,
                                    col2: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    col3: result.features[i].attributes.CALIDAD
                                };
                                data_listExportar[i] = {
                                    Fecha: fecha.getUTCDay() + "/" + fecha.getDate() + "/" + fecha.getUTCFullYear(),
                                    CALIDAD: result.features[i].attributes.CALIDAD
                                };
                            }
                            layout = [[
                                { 'name': 'ID', 'field': 'col1', 'width': '60px' },
                                { 'name': 'Fecha', 'field': 'col1', 'width': '120px' },
                                { 'name': 'Calidad', 'field': 'col2', 'width': '200px' }
                            ]];
                            if(data_list.length <= 0){
                                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                            }else{
                                mostrarTablaYGraficoCA();
                                consultaAmbiental.lists = data_list;
                                dibujarDatosEnGrafica(data_list, fechaMesAgno, "Calidad de Aire punto ", "Fecha", "Calidad");
                                document.getElementById("divGraficaConsultaAmbiental").style.display = "flex";
                                document.getElementById("gridDivConsultaAmbiental").style.height = "182px";
                            }
                        } else if (consultaAmbiental.confirCategoriaSelected == "Estaciones" && (consultaAmbiental.confirSubCategoriaSelected == "Metereol\u00F3gica" ||
                            consultaAmbiental.confirSubCategoriaSelectedValue == 2)) {
                            for (var i in result.features) {
                                var fecha = new Date(result.features[i].attributes.FECHA);
                                if (result.features[i].attributes.TEMPERATURA == null) {
                                    result.features[i].attributes.TEMPERATURA = 0;
                                }
                                if (result.features[i].attributes.BRILLOSOLAR == null) {
                                    result.features[i].attributes.BRILLOSOLAR = 0;
                                }
                                if (result.features[i].attributes.EVAPORACION == null) {
                                    result.features[i].attributes.EVAPORACION = 0;
                                }
                                if (result.features[i].attributes.HUMEDAD == null) {
                                    result.features[i].attributes.HUMEDAD = 0;
                                }
                                if (result.features[i].attributes.PRECIPITACION == null) {
                                    result.features[i].attributes.PRECIPITACION = 0;
                                }
                                if (result.features[i].attributes.VIENTOS == null) {
                                    result.features[i].attributes.VIENTOS = 0;
                                }

                                data_list[i] = {
                                    col1: result.features[i].attributes.OBJECTID,
                                    col2: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    col3: result.features[i].attributes.TEMPERATURA,
                                    col4: result.features[i].attributes.HUMEDAD,
                                    col5: result.features[i].attributes.BRILLOSOLAR,
                                    col6: result.features[i].attributes.VIENTOS,
                                    col7: result.features[i].attributes.EVAPORACION,
                                    col8: result.features[i].attributes.PRECIPITACION
                                };
                                listDato1[i] = {
                                    col2: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    col3: result.features[i].attributes.TEMPERATURA,
                                };
                                listDato2[i] = {
                                    col2: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    col3: result.features[i].attributes.HUMEDAD,
                                };
                                listDato3[i] = {
                                    col2: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    col3: result.features[i].attributes.BRILLOSOLAR,
                                };
                                listDato4[i] = {
                                    col2: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    col3: result.features[i].attributes.VIENTOS,
                                };
                                listDato5[i] = {
                                    col2: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    col3: result.features[i].attributes.EVAPORACION,
                                };
                                listDato6[i] = {
                                    col2: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    col3: result.features[i].attributes.PRECIPITACION
                                };

                                data_listExportar[i] = {
                                    Fecha: fecha.getUTCDay() + "/" + fecha.getDate() + "/" + fecha.getUTCFullYear(),
                                    TEMPERATURA: result.features[i].attributes.TEMPERATURA,
                                    HUMEDAD: result.features[i].attributes.HUMEDAD,
                                    BRILLO_SOLAR: result.features[i].attributes.BRILLOSOLAR,
                                    VIENTOS: result.features[i].attributes.VIENTOS,
                                    EVAPORACION: result.features[i].attributes.EVAPORACION,
                                    PRECIPITACION: result.features[i].attributes.PRECIPITACION
                                };

                            };
                            consultaAmbiental.fields = fields;
                            consultaAmbiental.lists[0] = listDato1;
                            consultaAmbiental.lists[1] = listDato2;
                            consultaAmbiental.lists[2] = listDato3;
                            consultaAmbiental.lists[3] = listDato4;
                            consultaAmbiental.lists[4] = listDato5;
                            consultaAmbiental.lists[5] = listDato6;
                            layout = [[
                                { 'name': 'ID', 'field': 'col1', 'width': '60px' },
                                { 'name': 'Fecha', 'field': 'col2', 'width': '90px' },
                                { 'name': 'Temperatura (\u00B0C)', 'field': 'col3', 'width': '110px'},
                                { 'name': 'Humedad (mb)', 'field': 'col4', 'width': '105px'},
                                { 'name': 'Brillo solar', 'field': 'col5', 'width': '100px'},
                                { 'name': 'Viento', 'field': 'col6', 'width': '90px'},
                                { 'name': 'Evaporaci\u00F3n (mm)', 'field': 'col7', 'width': '115px'},
                                { 'name': 'Precipitaci\u00F3n (mm/a\u00F1o)', 'field': 'col8', 'width': '150px'}
                            ]];
                            if(data_list.length <= 0){
                                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                            }else{
                                mostrarTablaYGraficoCA();
                                dibujarDatosEnGrafica(listDato1, fechaMesAgno, consultaAmbiental.fields[0], "Fecha", consultaAmbiental.fields[0] + "(\u00B0C)");
                                $("#ButtonSiguiente").show();
                                document.getElementById("divGraficaConsultaAmbiental").style.display = "flex";
                            }
                        } else if (consultaAmbiental.confirCategoriaSelected == "Tramites ambientales") {
                            for (var i in result.features) {
                                if (result.features[i].attributes.FECHAINFRACCION != null) {
                                    var fecha = new Date(result.features[i].attributes.FECHAINFRACCION);
                                    result.features[i].attributes.FECHAINFRACCION = ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear();
                                } else {
                                    result.features[i].attributes.FECHAINFRACCION = "-";
                                }
                                if (result.features[i].attributes.FECHARESOLUCION != null) {
                                    var fecha = new Date(result.features[i].attributes.FECHARESOLUCION);
                                    result.features[i].attributes.FECHARESOLUCION = ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear();
                                } else {
                                    result.features[i].attributes.FECHARESOLUCION = "-";
                                }
                                if (result.features[i].attributes.FECHAVENCIMIENTO != null) {
                                    var fecha = new Date(result.features[i].attributes.FECHAVENCIMIENTO);
                                    result.features[i].attributes.FECHAVENCIMIENTO = ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear();
                                } else {
                                    result.features[i].attributes.FECHAVENCIMIENTO = "-";
                                }
                                if (result.features[i].attributes.AREAAFECTADA == null) {
                                    result.features[i].attributes.AREAAFECTADA = 0;
                                }
                                if (result.features[i].attributes.CAUDALOTORGADO == null) {
                                    result.features[i].attributes.CAUDALOTORGADO = 0;
                                }
                                if (result.features[i].attributes.FUENTEAFECTADA == null) {
                                    result.features[i].attributes.FUENTEAFECTADA = "-";
                                }
                                if (result.features[i].attributes.VOLUMENOTORGADO == null) {
                                    result.features[i].attributes.VOLUMENOTORGADO = 0;
                                }
                                if (result.features[i].attributes.LUGAROCURRENCIA == null) {
                                    result.features[i].attributes.LUGAROCURRENCIA = "-";
                                }


                                data_list[i] = {
                                    col1: result.features[i].attributes.OBJECTID,
                                    col2: result.features[i].attributes.FECHARESOLUCION, col3: result.features[i].attributes.FECHAINFRACCION,
                                    col4: result.features[i].attributes.FECHAVENCIMIENTO, col5: result.features[i].attributes.AREAAFECTADA,
                                    col6: result.features[i].attributes.CAUDALOTORGADO, col7: result.features[i].attributes.FUENTEAFECTADA,
                                    col8: result.features[i].attributes.VOLUMENOTORGADO, col9: result.features[i].attributes.LUGAROCURRENCIA,
                                };
                                data_listExportar[i] = {
                                    FECHARESOLUCION: result.features[i].attributes.FECHARESOLUCION, FECHAINFRACCION: result.features[i].attributes.FECHAINFRACCION,
                                    FECHAVENCIMIENTO: result.features[i].attributes.FECHAVENCIMIENTO, AREAAFECTADA: result.features[i].attributes.AREAAFECTADA,
                                    CAUDALOTORGADO: result.features[i].attributes.CAUDALOTORGADO, FUENTEAFECTADA: result.features[i].attributes.FUENTEAFECTADA,
                                    VOLUMENOTORGADO: result.features[i].attributes.VOLUMENOTORGADO, LUGAROCURRENCIA: result.features[i].attributes.LUGAROCURRENCIA
                                };
                            }

                            layout = [[
                                { 'name': 'ID', 'field': 'col1', 'width': '60px' },
                                { 'name': 'FECHARESOLUCION', 'field': 'col2', 'width': '130px' },
                                { 'name': 'FECHAINFRACCION', 'field': 'col3', 'width': '130px' },
                                { 'name': 'FECHAVENCIMIENTO', 'field': 'col4', 'width': '130px' },
                                { 'name': 'AREAAFECTADA', 'field': 'col5', 'width': '115px' },
                                { 'name': 'CAUDALOTORGADO', 'field': 'col6', 'width': '130px' },
                                { 'name': 'FUENTEAFECTADA', 'field': 'col7', 'width': '130px' },
                                { 'name': 'VOLUMENOTORGADO', 'field': 'col8', 'width': '135px' },
                                { 'name': 'LUGAROCURRENCIA', 'field': 'col9', 'width': '130px' }
                            ]];
                            if(data_list.length <= 0){
                                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                            }else{
                                mostrarTablaYGraficoCA();
                                consultaAmbiental.lists = data_list;                           
                                dibujarGraficaBarras();
                            }
                        } else if (consultaAmbiental.confirCategoriaSelected == "Predios de reforestaci\u00F3n") {
                            document.getElementById("titleChart").style.display = "none";
                            document.getElementById("subtitle").style.display = "none";
                            ajustarTamanioWidget(consultaAmbiental.panel, 490, 500);
                            document.getElementById("divGraficaConsultaAmbiental").style.display = "none";
                            map.graphics.clear();
                            var features = result.features;
                            pintarPoligonosConsulta(features);                            
                            for (var i in features) {
                               
                                data_list[i] = {
                                    col1: features[i].attributes.OBJECTID,
                                    col2: features[i].attributes.ANIO,
                                    col3: features[i].attributes.NOMBRE,
                                    col4: features[i].attributes.NUMEROPREDIAL,
                                    col5: features[i].attributes.HECTAREASREFORESTADAS,                                                                        
                                    col6: features[i].attributes.TIPO_REFORESTACION,                      
                                };                               
                                data_listExportar[i] = {
                                    ANIO: features[i].attributes.ANIO,
                                    NOMBRE: features[i].attributes.NOMBRE,                                    
                                    NUMEROPREDIAL: features[i].attributes.NUMEROPREDIAL,
                                    HECTAREASREFORESTADAS: features[i].attributes.HECTAREASREFORESTADAS,                                    
                                    TIPO_REFORESTACION: features[i].attributes.TIPO_REFORESTACION,                                    
                                };
                            }                           
                            layout = [[
                                { 'name': 'ID', 'field': 'col1', 'width': '60px' },
                                { 'name': 'Municipio',              'field': 'col3', 'width': '100px'},                                
                                { 'name': 'N\u00FAmero predial',         'field': 'col4', 'width': '100px'},
                                { 'name': 'Hectareas reforestadas', 'field': 'col5', 'width': '130px'},
                                { 'name': 'A\u00F1o',                    'field': 'col2', 'width': '80px'},                                
                                { 'name': 'Tipo de reforestaci\u00F3n',  'field': 'cols', 'width': '150px'},
                            ]];
                            if(data_list.length <= 0){
                                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                            }else{
                                mostrarTablaYGraficoCA();
                                consultaAmbiental.lists = data_list;
                             
                                document.getElementById("divtTablaConsultaAmbiental").style.width = "auto";
                                document.getElementById("divtTablaConsultaAmbiental").style.height = "420px";
                                document.getElementById("gridDivConsultaAmbiental").style.height = "400px";
                                document.getElementById("divSubCategoria").style.display = "none"; 
                            }
                        } else if (consultaAmbiental.confirCategoriaSelected == "Tramites ambientales predios") {
                            document.getElementById("titleChart").style.display = "none";
                            document.getElementById("subtitle").style.display = "none";
                            ajustarTamanioWidget(consultaAmbiental.panel, 490, 500);
                            document.getElementById("divGraficaConsultaAmbiental").style.display = "none";
                            map.graphics.clear();
                            var features = result.features;
                            pintarPoligonosConsulta(features);                            
                            for (var i in features) {    
                                var fecha = new Date(features[i].attributes.FECHARESOLUCION);                           
                                if(fecha.getUTCFullYear() >= consultaAmbiental.anioBeguin && fecha.getUTCFullYear() <= consultaAmbiental.anioEnd){
                                    var col5;
                                    if(features[i].attributes.VOLUMENOTORGADO != null){
                                        col5 = features[i].attributes.VOLUMENOTORGADO.toFixed(2);
                                    }else{
                                        col5 = 0;
                                    }
                                    data_list[i] = {
                                        col1: features[i].attributes.OBJECTID,
                                        col2: features[i].attributes.LUGAROCURRENCIA,
                                        col3: features[i].attributes.NIT,
                                        col4: features[i].attributes.NUMEROPREDIAL,
                                        col5: features[i].attributes.RESOLUCION,                                                                        
                                        col6: col5,
                                        col7: features[i].attributes.AREAAFECTADA,
                                        col8: ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear(),
                                    };                               
                                    data_listExportar[i] = {
                                        Lugar_ocurrencia: features[i].attributes.LUGAROCURRENCIA,
                                        Nit: features[i].attributes.NIT,                                    
                                        Numero_predial: features[i].attributes.NUMEROPREDIAL,
                                        Hectareas_reforestadas: features[i].attributes.RESOLUCION,                                    
                                        Volumen_Otorgado: features[i].attributes.VOLUMENOTORGADO,
                                        Area_afectada: features[i].attributes.AREAAFECTADA,
                                        Fecha_resolucion: features[i].attributes.FECHARESOLUCION
                                    };
                                }

                            }                           
                            layout = [[
                                { 'id': 'OBJECTID','name': 'ID', 'field': 'col1', 'width': '60px' },
                                { 'name': 'Lugar ocurrencia',       'field': 'col2', 'width': '150px'},                                
                                { 'name': 'Nit',                    'field': 'col3', 'width': '70px'},
                                { 'name': 'N\u00FAmero predial',         'field': 'col4', 'width': '150px'},
                                { 'name': 'Resoluci\u00F3n',             'field': 'col5', 'width': '90px'},
                                { 'name': 'Volumen otorgado',       'field': 'col6', 'width': '110px'},                                
                                { 'name': '\u00E1rea afectada',          'field': 'col7', 'width': '90px'},
                                { 'name': 'Fecha resoluci\u00F3n',       'field': 'col8', 'width': '120px'},
                            ]];
                            if(data_list.length <= 0){
                                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                            }else{
                                mostrarTablaYGraficoCA();
                                consultaAmbiental.lists = data_list;
                             
                                document.getElementById("divtTablaConsultaAmbiental").style.width = "auto";
                                document.getElementById("divtTablaConsultaAmbiental").style.height = "420px";
                                document.getElementById("gridDivConsultaAmbiental").style.height = "400px";
                                document.getElementById("divSubCategoria").style.display = "none";                                                        
                            }
                        } else if (consultaAmbiental.confirCategoriaSelected == consultaAmbiental.categoria[1].categoria[1].nombreCategoria) {
                            mostrarLeyenda(configConsAmbiental.tituloLeyendaPoblacion, configConsAmbiental.leyendaPoblacion);
                            consultaPoblacioGeneral(result);
                            var features = result.features;
                            var municipios = [];
                            for (var a in consultaAmbiental.municipios) {
                                for (var i in features) {
                                    if (result.features[i].attributes.IDMUNICIPIO == consultaAmbiental.municipios[a].id) {
                                        municipios[a] = consultaAmbiental.municipios[a].name;
                                    }
                                }
                            }
                            for (var i in features) {
                                data_list[i] = {
                                    col1: municipios[i],
                                    col2: features[i].attributes.RURAL,
                                    col3: features[i].attributes.URBANO,
                                    col4: features[i].attributes.TOTAL
                                };
                                data_listExportar[i] = {
                                    MUNICIPIO: municipios[i],
                                    RURAL: features[i].attributes.RURAL,
                                    URBANOL: features[i].attributes.URBANO,
                                    TOTAL: features[i].attributes.TOTAL
                                };
                            }
                            layout = [[
                                { 'name': 'MUNICIPIO', 'field': 'col1', 'width': '80px' },
                                { 'name': 'RURAL', 'field': 'col2', 'width': '80px' },
                                { 'name': 'URBANO', 'field': 'col3', 'width': '80px' },
                                { 'name': 'TOTAL', 'field': 'col4', 'width': '80px' }
                            ]];
                            consultaAmbiental.lists = data_list;          
                            if(data_list.length <= 0){
                                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                            }else{
                                mostrarTablaYGraficoCA();
                                $("#ButtonSiguiente").hide();
                                dibujarGraficaBarras();
                                var idMunicipio = "consultaAmbiental.labelCuencaRiosLaVieja001";
                                resaltarGraficaCA(idMunicipio);
                            }
                        } else if (consultaAmbiental.confirCategoriaSelected == consultaAmbiental.categoria[1].categoria[2].nombreCategoria) {
                            map.graphics.clear();
                            mostrarLeyenda(configConsAmbiental.tituloLeyendaNecesidades, configConsAmbiental.leyendaNecesidades);
                            consultaPoblacioGeneral(result);
                            var features = result.features;
                            consultaAmbiental.features = features;
                            for (var i in features) {
                                
                                data_list[i] = {
                                    col1: features[i].attributes.NOMBRE,
                                    col2: features[i].attributes.PROPOSICIONPORCENTUALU,
                                    col3: features[i].attributes.CVEU,
                                    col4: features[i].attributes.PROPOSICIONPORCENTUALR,
                                    col5: features[i].attributes.CVER,
                                    col6: features[i].attributes.TOTALPROPOR,
                                    col7: features[i].attributes.TOTALCVE
                                };
                                data_listExportar[i] = {
                                    MUNICIPIO: features[i].attributes.NOMBRE,
                                    PropUrbano: features[i].attributes.PROPOSICIONPORCENTUALU,
                                    CveUrbano: features[i].attributes.CVEU,
                                    PropRural: features[i].attributes.PROPOSICIONPORCENTUALR,
                                    CveRural: features[i].attributes.CVER,
                                    TotalPropor: features[i].attributes.TOTALPROPOR,
                                    TotalCve: features[i].attributes.TOTALCVE
                                };
                            }
                            layout = [[
                                { 'name': 'MUNICIPIO', 'field': 'col1', 'width': '80px' },
                                { 'name': 'Prop Urbano (%)', 'field': 'col2', 'width': '80px' },
                                { 'name': 'Cve Urbano (%)', 'field': 'col3', 'width': '80px' },
                                { 'name': 'Prop Rural (%)', 'field': 'col4', 'width': '80px' },
                                { 'name': 'Cve Rural (%)', 'field': 'col5', 'width': '80px' },
                                { 'name': 'Total Prop (%)', 'field': 'col6', 'width': '80px' },
                                { 'name': 'Total Cve (%)', 'field': 'col7', 'width': '80px' }
                            ]];
                            if(data_list.length <= 0){
                                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                            }else{
                                mostrarTablaYGraficoCA();
                                consultaAmbiental.lists = data_list;                           
                                dibujarGraficaBarras();                            
                                $("#ButtonSiguiente").show();
                                consultaAmbiental.fields = fields;
                                var idMunicipio = "Armenia";
                                resaltarGraficaCA(idMunicipio);
                            }
                        } else {
                            document.getElementById("gridDivConsultaAmbiental").style.height = "167px";
                            var a = 0;
                            for (var i in result.features) {
                                var fecha = new Date(result.features[i].attributes.FECHA);
                                var fecha1 = ((fecha.getUTCMonth() * 1) + 1) + "/" + fecha.getUTCFullYear();
                                if(fecha.getUTCFullYear() >= consultaAmbiental.anioBeguin && fecha.getUTCFullYear() <= consultaAmbiental.anioEnd && result.features[i].attributes.CAUDALMES != undefined){
                                    data_list[a] = { col1: result.features[i].attributes.OBJECTID, col2: fecha1, col3: parseFloat(result.features[i].attributes.CAUDALMES.toFixed(2)) };
                                    fechaMesAgno[a] = fecha1;
                                    data_listExportar[a] = {Fecha: fecha.getUTCDate() + "/" + fecha1, Caudales: parseFloat(result.features[i].attributes.CAUDALMES.toFixed(2))};
                                    a++;
                                }
                            };
                            layout = [[
                                { 'name': 'ID', 'field': 'col1', 'width': '50px' },
                                { 'name': 'Fecha', 'field': 'col2', 'width': '100px' },
                                { 'name': 'Caudal (m\u00B3/seg)', 'field': 'col3', 'width': '150px' }
                            ]];
                            if(data_list.length <= 0){
                                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                            }else{
                                mostrarTablaYGraficoCA();
                                consultaAmbiental.lists = data_list;
                                dibujarDatosEnGrafica(data_list, fechaMesAgno, "Caudales", "Fecha", "Caudal m\u00B3/seg");
                                $("#ButtonSiguiente").hide();
                                document.getElementById("divGraficaConsultaAmbiental").style.display = "flex";
                            }
                        }
                        dojo.connect(map.graphics, "onClick", function (e) {
                            showLoader();
                            if (consultaAmbiental.existeGrafica != undefined) {
                                consultaAmbiental.existeGrafica.destroy();
                                consultaAmbiental.existeGrafica = undefined;
                            }                   
                            if (e.graphic.attributes != undefined) {
                                for (var i in consultaAmbiental.municipios) {
                                    if (e.graphic.attributes.IDMUNICIPIO == consultaAmbiental.municipios[i].id) {
                                        consultaAmbiental.contadorListas = i;
                                        break;
                                    } else if (e.graphic.attributes.NOMBRE == consultaAmbiental.lists[i].col1) {
                                        consultaAmbiental.contadorListas = i;
                                        break;
                                    }
                                }
                                dibujarGraficaBarras();
                                var idMunicipio = e.graphic.attributes[consultaAmbiental.campoCargarGrafica];
                                resaltarGraficaCA(idMunicipio);
                            }

                        });
                        if(result.features[0].geometry != null && consultaAmbiental.confirCategoriaSelected != "Tramites ambientales"){
                            if (result.features[0].geometry.type == "point") {
                                ubicarYcentrarPunto(result.features[0].geometry);
                            } else if (map.getScale() < 40000) {
                                map.setExtent(consultaAmbiental.extentInitial);
                            }
                        }
                        consultaAmbiental.jsonConvertido = JSON.stringify(data_listExportar);

                        var rows = data_list.length;
                        for (var i = 0, l = data_list.length; i < rows; i++) {
                            data.items.push(lang.mixin({ id: i + 1 }, data_list[i % l]));
                        }

                        console.log("DATA consulta ambiental grafica");
                        console.log(data);
                        var store = new ItemFileWriteStore({ data: data });

                        /*create a new gridCA*/
                        var gridCA = new Datagrid({
                            id: 'gridCA',
                            store: store,
                            structure: layout,
                            rowSelector: '10px',
                            style: "width: 430px; height: 140px;",
                            selectionMode: 'single',
                            canSort: function (col) {
                                return false;
                            }
                        });
                       // gridCA.styleColumn('OBJECTID', "display: none;");
                        console.log("store consulta ambiental grafica");
                        console.log(store);
                        consultaAmbiental.tablaResultados = gridCA;
                        gridCA.placeAt("gridDivConsultaAmbiental");
                        gridCA.startup();
                        gridCA.set('autoHeight', true);
                        gridCA.set('autoWidth', true);
                        gridCA.update();
                        var leyenda = dijit.byId("leyendaGraficaConsulta");
                        gridCA.on("RowClick", function (evt) {
                            selectedRowGrid();
                        }, true);

                        if (consultaAmbiental.confirCategoriaSelected == consultaAmbiental.categoria[1].tematicas ||
                            consultaAmbiental.confirTematicaSelected == consultaAmbiental.tematicas[1].tematicas[2]) {
                            document.getElementById("titleChart").style.display = "none";
                            document.getElementById("subtitle").style.display = "none";
                        }
                        document.getElementById("gridDivConsultaAmbiental").style.display = "flex";
                        document.getElementById("gridDivConsultaAmbiental").style.justifyContent = "center"; 
                        document.getElementById("gridCA").style.overflow = "auto";
                    });
          

            }  
            hideLoader();     
        }
        function resaltarGraficaCA(idMunicipio){
            var grafica, graficaCargada = true, r, g, b, width;
            var campoCargarGrafica = consultaAmbiental.campoCargarGrafica;
            map.graphics.clear();
            for(var i in consultaAmbiental.graficasCargadas){
                if(consultaAmbiental.graficasCargadas[i][campoCargarGrafica] == idMunicipio){
                    grafica = consultaAmbiental.graficasCargadas[i].grafica;
                    r =  grafica.symbol.outline.color.r;
                    grafica.symbol.outline.color.r = 102;
                    g = grafica.symbol.outline.color.g;
                    grafica.symbol.outline.color.g = 255;
                    b = grafica.symbol.outline.color.b;
                    grafica.symbol.outline.color.b = 255;
                    width = grafica.symbol.outline.width;
                    grafica.symbol.outline.width = 3;   
                    graficaCargada = false;                 
                }
                if(graficaCargada){
                    map.graphics.add(consultaAmbiental.graficasCargadas[i].grafica);
                }else{
                    graficaCargada = true;
                }
            }
            map.graphics.add(grafica);   
            for(var i in consultaAmbiental.graficasCargadas){
                if(consultaAmbiental.graficasCargadas[i][campoCargarGrafica] == idMunicipio){
                    consultaAmbiental.graficasCargadas[i].grafica.symbol.outline.color.r = r;
                    consultaAmbiental.graficasCargadas[i].grafica.symbol.outline.color.g = g;
                    consultaAmbiental.graficasCargadas[i].grafica.symbol.outline.color.b = b;
                    consultaAmbiental.graficasCargadas[i].grafica.symbol.outline.width = width;
                }
            }
        }
        function mostrarTablaYGraficoCA() {            
            $('#divConsultaAmbienta').hide("fast");
            $('#divtTablaConsultaAmbiental').show("fast");
            $('#gridDivConsultaAmbiental').show("fast");                        
            var panel = consultaAmbiental.panel;
            panel.position.width = 490;
            panel.position.height = 669;
            panel._originalBox = {
                w: panel.position.width,
                h: panel.position.height,
                l: panel.position.left || 60,
                t: panel.position.top || 120
            };
            //panel.setPosition(panel.position);
            panel.panelManager.normalizePanel(panel);      

        }
        function quitarLayersCargadosCA() {//quitarLayersCargadosCA en esta consulta 
            if (consultaAmbiental.idFeatures.length > 0) {
                for (var i in consultaAmbiental.idFeatures) {
                    var layerAeliminar = consultaAmbiental.idFeatures[i].featureLayer;
                    //layerAeliminar = map.getLayer(layerAeliminar);
                    map.removeLayer(layerAeliminar);
                }
                consultaAmbiental.idFeatures.length = 0;
            } else if (map.graphics.graphics.length > 0) {
                map.graphics.clear();
            }
        }
        function mostrarTematicaCA(areaSelected) {
            console.log('areaSelected =>', areaSelected);
            var selectTematica = document.getElementById("selectTematica");
            selectTematica.length = 0;
            for (var i in consultaAmbiental.tematicas) {
                if (areaSelected == consultaAmbiental.tematicas[i].area) {
                    for (var a in consultaAmbiental.tematicas[i].tematicas) {
                        selectTematica.options[selectTematica.options.length] = new Option(consultaAmbiental.tematicas[i].tematicas[a], a);
                    }
                    consultaAmbiental.objetoSeleccionado = consultaAmbiental.tematicas[i];
                    break;
                }
            }
            var objetTarjet = consultaAmbiental.objetoSeleccionado;
            if (objetTarjet.url != '') {
                ejecutarConsulta(objetTarjet.url);
            }
            consultaAmbiental.categoria = [{
                tematicas: 'Ambiental',
                categoria: [{
                    nombreCategoria: '',
                    url: ''
                }, {
                    nombreCategoria: 'Estaciones',
                    url: SERVICIO_AMBIENTAL + '/61',
                    subcategoria: [
                        {
                            nombre: 'limnigraficas',
                            url: SERVICIO_AMBIENTAL_ALFANUMERICO + '/62'
                        }

                    ]
                }, {
                    nombreCategoria: 'Puntos de calidad',
                    url: SERVICIO_AMBIENTAL + '/61'
                }, {
                    nombreCategoria: 'Tramites ambientales',
                    url: SERVICIO_AMBIENTAL_ALFANUMERICO + '/10'
                }, {
                    nombreCategoria: 'Tramites ambientales predios',
                    url: SERVICIO_AMBIENTAL_ALFANUMERICO + '/8'
                }, {
                    nombreCategoria: 'Predios de reforestaci\u00F3n',
                    url: SERVICIO_AMBIENTAL_ALFANUMERICO + '/7'
                }]
            }, {
                tematicas: 'Socioecon\u00F3mico',
                categoria: [{
                    nombreCategoria: '',
                    url: ''
                }, {
                    nombreCategoria: 'Poblaci\u00F3n',
                    url: SERVICIO_SOCIOECONOMICO + '/10'
                }, {
                    nombreCategoria: 'Necesidades B\u00E1sicas Insatisfechas (NBI)',
                    url: SERVICIO_SOCIOECONOMICO + '/1'
                }]
            }
            ];
            consultaAmbiental.confirTematicaSelected = 0;

        }
        function mostrarCategoriaCA(tematicaSelected) {
            consultaAmbiental.confirTematicaSelected = tematicaSelected;
            // document.getElementById("divCategoria").style.display = "block";
            $('#selectCategoria').prop('disabled', false);
            var agregarCategoria = document.getElementById("selectCategoria");
            agregarCategoria.length = 0;
            for (var i in consultaAmbiental.categoria) {
                if (tematicaSelected == consultaAmbiental.categoria[i].tematicas) {
                    for (var a in consultaAmbiental.categoria[i].categoria) {
                        agregarCategoria.options[agregarCategoria.options.length] = new Option(consultaAmbiental.categoria[i].categoria[a].nombreCategoria, a);
                    }
                }
            }
            consultaAmbiental.confirCategoriaSelected = 0;
        }
        function mostrarSubCategoriaCA(categoriaSelected) {
            //console.log('categoriaSelected =>', categoriaSelected);

            for (var i in consultaAmbiental.categoria) {
                if (consultaAmbiental.confirTematicaSelected == consultaAmbiental.categoria[i].tematicas) {
                    for (var a in consultaAmbiental.categoria[i].categoria) {
                        if (consultaAmbiental.confirCategoriaSelected == consultaAmbiental.categoria[i].categoria[a].nombreCategoria) {
                            var url = consultaAmbiental.categoria[i].categoria[a].url;
                            //              console.log('url => ', url);
                            consultaAmbiental.objetoSeleccionado.urlCategoria = url;
                            ejecutarConsulta(url);
                        }
                    }
                }
            }
        }
        function mostrarNombreOMunicipioCA(selectSubCategoria) {
            $('#selectMunicipio').prop('disabled', false);
            if (consultaAmbiental.confirCategoriaSelected == "Tramites ambientales") {
                if (!consultaAmbiental.confirMunicipioSelected) {
                    consultaAmbiental.confirMunicipioSelected = true;
                    var agregarDato = document.getElementById('selectMunicipio');
                    agregarDato.length = 0;
                    agregarDato.options[agregarDato.options.length] = new Option('', 0);
                    for (var i in consultaAmbiental.municipios) {
                        agregarDato.options[agregarDato.options.length] = new Option(consultaAmbiental.municipios[i].name, i + 1);
                    }
                }


            }
            for (var i in consultaAmbiental.objetoSeleccionado.subLayers) {
                if (consultaAmbiental.objetoSeleccionado.subLayers[i].name == selectSubCategoria) {
                    idSubcategoria = consultaAmbiental.objetoSeleccionado.subLayers[i].id;
                    var urlLayer = consultaAmbiental.objetoSeleccionado.urlCategoria.slice(0, consultaAmbiental.objetoSeleccionado.urlCategoria.length - 2);
                    var urlSubCategoria = urlLayer.concat(idSubcategoria);
                    consultaAmbiental.confirNombreSelected = 0;
                    ejecutarConsulta(urlSubCategoria);
                    break;
                }
            }
        }
        function cargarRangoFecha(selectNombre) {
            //document.getElementById("divCalendario").style.display = "block";
            consultaAmbiental.validacionFecha = true;

            if (consultaAmbiental.calendarioCreado == null) {
                // consultaAmbiental.calendarioCreado.destroy();
                var calendario = new dijit.Calendar({
                    value: new Date(),
                    onChange: function (d) {
                        capturarFecha(d);
                    }
                }, "calendario");
                consultaAmbiental.calendarioCreado = calendario;
            }

        }
        function pintarPoligonosConsulta(features) {
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255, 0, 0, 1]), 3), new Color([255, 128, 0, 0.15]));
            for (var i in features) {
                var geometria = features[i].geometry;
                var graphic = new Graphic(geometria, symbol);
                graphic.id = features[i].attributes.OBJECTID;
                map.graphics.add(graphic);
            }
        }
        function capturarFecha(d) {
            var validacionFecha = consultaAmbiental.validacionFecha;
            var fecha = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
            if (validacionFecha) {
                //   document.getElementById('fechaInicial').innerHTML = 'Fecha inicial: ' + fecha;
                consultaAmbiental.validacionFecha = false;
                consultaAmbiental.fechaInicial = fecha;
                consultaAmbiental.numericFechaIni = d.getTime();
                consultaAmbiental.anioBeguin = d.getFullYear();
            } else {
                consultaAmbiental.validacionFecha = true;
                consultaAmbiental.fechaFinal = fecha;
                consultaAmbiental.numericFechaFin = d.getTime();
                consultaAmbiental.anioEnd = d.getFullYear();
                document.getElementById("divBotonBuscar").style.display = "block";
            }
            document.getElementById('fechaInicial').innerHTML = 'Fecha inicial: ' + consultaAmbiental.fechaInicial +
                '<br/> Fecha final: ' + consultaAmbiental.fechaFinal;
            document.getElementById("fechaInicial").style.display = "block";

        }
        function ejecutarConsulta(url) {
            //  query("#status").style("display", "block");
            var layersRequest = esriRequest({
                url: url,
                content: { f: "json" },
                handleAs: "json",
                callbackParamName: "callback"
            });
            layersRequest.then(
                function (response) {
                    requestSucceeded(response, url);
                }, function (error) {
                    // console.log("Error: => ", error.message);                   
                    var titulo = "<B> Error en la petici\u00F3n </B>";
                    var contenido = "Vuelva a cargar el servicio.";
                    createDialogInformacionGeneral(titulo, contenido);
                    //  query("#status").style("display", "none");
                });
        }
        function requestSucceeded(response, url) {
            showLoader();
            $('#selectMunicipio').prop('disabled', true); $('#selectMunicipio').val(0);
            var agregarSubCategoria = document.getElementById('selectSubCategoria');
            var campos;
            if (consultaAmbiental.confirTematicaSelected == "Socioecon\u00F3mico") {
                $('#selectMunicipio').prop('disabled', true); $('#selectMunicipio').val("");         
                $('#selectSubCategoria').prop('disabled', true);   $('#selectSubCategoria').val("");                     
                $('#fechaInicio').prop('disabled', true); $('#fechaInicio').val("");
                $('#fechaFin').prop('disabled', true); $('#fechaFin').val("");
                $('#selectAnio').prop('disabled', true); $('#selectAnio').val("");
                $('#botonBuscar').prop('disabled', true);                        
                if (consultaAmbiental.confirCategoriaSelected == "Necesidades B\u00E1sicas Insatisfechas (NBI)") {
                    var campos = "ANIO";
                    realizarQuery(campos, url);
                }

            }
            if(consultaAmbiental.confirAreaSelected == consultaAmbiental.labelCuencaRiosLaVieja){
                //var featureLayer = new FeatureLayer(url);                
                var urlLayer = url + "/54" ;

                var featureLayer = crearFeatureLayer(urlLayer, 1); 
                map.addLayer(featureLayer);
                var longitudFeaturesLayers = consultaAmbiental.idFeatures.length;
                consultaAmbiental.idFeatures[longitudFeaturesLayers] = {};
                consultaAmbiental.idFeatures[longitudFeaturesLayers].name = consultaAmbiental.labelCuencaRiosLaVieja;
                consultaAmbiental.idFeatures[longitudFeaturesLayers].featureLayer = featureLayer;
            }
            if (response.type == "Feature Layer") {
               
                if (response.name == "Calidad de Agua" || response.name == "Red de monitoreo de la calidad del agua") {
                    campos = "NOMBRE";
                    realizarQuery(campos, url);
                } else if (response.name == "Calidad de Aire" || response.name == "Estaci\u00F3n de monitoreo de la calidad del aire") {
                    campos = "NOMBRE";
                    realizarQuery(campos, url);
                }              
                if (response.name == "L\u00EDmite Cuenca") {
                    var id = consultaAmbiental.id + response.id;
                    var featureLayer = new FeatureLayer(url, { id: id });
                    map.addLayer(featureLayer);
                    var longitudFeaturesLayers = consultaAmbiental.idFeatures.length;
                    consultaAmbiental.idFeatures[longitudFeaturesLayers] = id;
                }

                switch (consultaAmbiental.confirCategoriaSelected) {
                    case "Tramites ambientales":
                        campos = "TIPO_TRAMITE";
                        realizarQuery(campos, url);
                        break;
                    case "Predios de reforestaci\u00F3n":                      
                        $('#ButtonSiguiente').prop('disabled', false);
                        $('#selectSubCategoria').prop('disabled', true);  $('#selectSubCategoria').val(0);
                        $('#selectNombre').prop('disabled', true);  $('#selectNombre').val(0);
                        if (consultaAmbiental.confirMunicipioSelected == null || consultaAmbiental.municipiosCargados == false) {
                            cargarMunicipios(consultaAmbiental.municipios);
                        } else {
                            $('#selectMunicipio').prop('disabled', false);

                        }                        
                        break;
                    case "Tramites ambientales predios":
                        campos = "DESCRIPCIONVALOR";
                        realizarQuery(campos, url);
                        break;
                }
                var nomSubCate = response.name;

                if (nomSubCate == "Estaciones Limnigr\u00E1ficas" || nomSubCate == "Metereol\u00F3gica") {
                    for (var i in response.fields) {
                        if (response.fields[i].name == "NOMBRE") {
                            campos = response.fields[i];
                            var queryTask = new QueryTask(url);
                            var query = new Query();
                            query.outFields = [response.fields[i].name];
                            query.where = "1=1";
                            query.returnGeometry = false;
                            queryTask.execute(query, monstrarConsulta, erroQuery);
                            break;
                        }
                    }

                }
            } else if (response.type == "Group Layer") {
                consultaAmbiental.objetoSeleccionado.subLayers = response.subLayers;
                document.getElementById("divSubCategoria").style.display = "block";
                agregarSubCategoria.length = 0;
                agregarSubCategoria.options[agregarSubCategoria.options.length] = new Option('', 0);
                if (consultaAmbiental.confirCategoriaSelected == "Estaciones") {
                    for (var i = 0; i < 2; i++) {
                        agregarSubCategoria.options[agregarSubCategoria.options.length] = new Option(response.subLayers[i].name, i + 1);
                    }
                    habilitarSlects(false, "selectSubCategoria");
                } else if (consultaAmbiental.confirCategoriaSelected == "Puntos de calidad") {
                    for (var i = 2; i < 4; i++) {
                        agregarSubCategoria.options[agregarSubCategoria.options.length] = new Option(response.subLayers[i].name, i + 1);
                    }
                    habilitarSlects(false, "selectSubCategoria");
                } else {
                    document.getElementById("divSubCategoria").style.display = "none";
                }
            } else if (response.type == "Table") {
                campos = response.fields, geometry = false, where = "1=1";
                realizarQuery(campos, url, geometry, where);
            }
            // query("#status").style("display", "none"); //desactiva el span*/
        }
        function realizarQuery(campos, url, geometry, where) {            
            if(campos == undefined){
                campos = "*";
            }
            if(geometry == undefined){
                geometry = false;
            }
            if(where == undefined){
                where = "1=1";
            }            
            var queryTask = new QueryTask(url);
            var parametros = new Query();
            parametros.outFields = [campos];
            parametros.where = where;
            parametros.returnGeometry = geometry;
            queryTask.execute(parametros, monstrarConsulta, function (error) {
                console.log(error);
            });
        }
        function erroQuery(error) {
            //       console.log("error => ", error);
        }
        function monstrarConsulta(featureSet) {  
            var arrayDatos = [], contenedor, datos = [];          
            if (consultaAmbiental.confirTematicaSelected == "Socioecon\u00F3mico" || consultaAmbiental.confirTematicaSelected ==
             "Necesidades B\u00E1sicas Insatisfechas (NBI)") {               
                var existe = false;
                var datos = featureSet.features;
                var anios = [];
                anios[0] = datos[0].attributes.ANIO;
                for (var i in datos) {
                    for (var a in anios) {
                        if (datos[i].attributes.ANIO == anios[a]) {
                            existe = true;
                        }
                    }
                    if (!existe) {
                        anios.push(datos[i].attributes.ANIO);
                    }
                    existe = false;
                }
                cargarAnnio(anios);
            }else if(consultaAmbiental.confirCategoriaSelected == "Puntos de calidad"){
                if(featureSet.features.length == 0){
                    createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                }else if(consultaAmbiental.confirSubCategoriaSelected == "Calidad de Agua" ||
                    consultaAmbiental.confirSubCategoriaSelected == "Calidad de Aire" || consultaAmbiental.confirSubCategoriaSelected == "Red de monitoreo de la calidad del agua" ||
                    consultaAmbiental.confirSubCategoriaSelected == "Estaci\u00F3n de monitoreo de la calidad del aire"){
                    consultaAmbiental.resultSubCategoria = featureSet.features;
                    for(var i in featureSet.features){
                        arrayDatos[i] = featureSet.features[i].attributes.NOMBRE;
                    }                    
                    datos = ordenarDatos(descriminaRepetidos(arrayDatos));        
                    contenedor = "selectNombre";     
                    cargarDatos(contenedor, datos);
                    $("#"+contenedor).prop('disabled', false);                  
                }else{
                    contenedor = "selectSubCategoria";
                    for (var i = 0; i < 2; i++){                        
                        arrayDatos[i] = featureSet.features[i].attributes.DESCRIPCIONVALOR;                        
                    }    
                    datos = ordenarDatos(descriminaRepetidos(arrayDatos));        
                    cargarDatos(contenedor, datos);
                    $("#"+contenedor).prop('disabled', false);                                                                       
                }                                
            }else if(consultaAmbiental.confirCategoriaSelected == "Estaciones"){                
                if(featureSet.features.length == 0){
                    createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados"); ocultarBoxServicios(false);
                } else if (consultaAmbiental.confirSubCategoriaSelected == "Limnigr\u00E1fica" || consultaAmbiental.confirSubCategoriaSelectedValue == 2 ||
                consultaAmbiental.confirSubCategoriaSelected == "Metereol\u00F3gica" || consultaAmbiental.confirSubCategoriaSelectedValue == 1) {
                    consultaAmbiental.resultSubCategoria = featureSet.features;
                    for(var i in featureSet.features){
                        //arrayDatos[i] = featureSet.features[i].attributes.NOMBRE_ESTACION;
                        arrayDatos[i] = featureSet.features[i].attributes.NOMBRE;
                    }
                    datos = ordenarDatos(descriminaRepetidos(arrayDatos));

                    contenedor = "selectNombre";
                    cargarDatos(contenedor, datos);
                }else{                    
                    for (var i = 2, a = 0; i < 4; i++){
                        datos[a] = {};
                        datos[a].name = featureSet.features[i].attributes.DESCRIPCIONVALOR;
                        datos[a].id = i;
                        a++;
                    }                                                     
                }                 
            }
                             
           /* if (featureSet.displayFieldName == "IDESTACION") {
                //       console.log('featureSet =>', featureSet);
                consultaAmbiental.objetoSeleccionado.features = [];
                document.getElementById("divNombre").style.display = "block";
                var agregarNombre = document.getElementById('selectNombre');
                agregarNombre.length = 0;
                agregarNombre.options[agregarNombre.options.length] = new Option('', 0);
                for (var i in featureSet.features) {
                    agregarNombre.options[agregarNombre.options.length] = new Option(featureSet.features[i].attributes.NOMBRE, i + 1);
                }
                $('#selectNombre').prop('disabled', false);
            }*/
            var subCategoria = new Array();
            var existe = false;
            var e = 0, atributo = "TIPO_TRAMITE";
            switch (consultaAmbiental.confirCategoriaSelected) {
                case "Tramites ambientales":
                    if (consultaAmbiental.objetoSeleccionado.trammitesAmbientales != undefined) {
                        if (consultaAmbiental.municipiosCargados == false) {
                            cargarMunicipios(featureSet.features);
                        } else {                          
                            $('#selectMunicipio').prop('disabled', false);
                        }
                    } else {
                        ////codigo que descrimina los elementos repetidos del array features y los coloca en el array
                        /// subCategoria sin repetir
                        if(featureSet.features[0].attributes[atributo] != undefined){
                            atributo = "TIPO_TRAMITE";                            
                        }else{
                            atributo = "DESCRIPCIONVALOR";
                        }
                        consultaAmbiental.atributoTramitesAnbietales = atributo;
                        subCategoria[0] = featureSet.features[0].attributes[atributo];
                        for (var i in featureSet.features) {
                            for (var a in subCategoria) {                                
                                if (featureSet.features[i].attributes[atributo] == subCategoria[a]) {
                                    existe = true;
                                }
                            }
                            if (!existe && featureSet.features[i].attributes[atributo] != null) {                                
                                subCategoria.push(featureSet.features[i].attributes[atributo]);
                            }
                            existe = false;
                            //////////////////////////
                        }
                        $('#selectSubCategoria').prop('disabled', false);
                        cargarDatosSubCategoria(ordenarDatos(subCategoria));
                        consultaAmbiental.objetoSeleccionado.trammitesAmbientales = subCategoria;
                    }                    
                    $('#selectAnio').prop('disabled', true);  $('#selectAnio').val(0);
                    $('#selectNombre').prop('disabled', true);  $('#selectNombre').val(0);
                    break;
                case "Tramites ambientales predios":
                    for (var i in featureSet.features) {
                        subCategoria.push(featureSet.features[i].attributes.DESCRIPCIONVALOR);
                    }
                    $('#selectSubCategoria').prop('disabled', false);                    
                    cargarDatosSubCategoria(ordenarDatos(descriminaRepetidos(subCategoria)));
                    break;
                case "Predios de reforestaci\u00F3n":                    
                    $('#selectSubCategoria').prop('disabled', true);  $('#selectSubCategoria').val(0);
                    $('#selectNombre').prop('disabled', true);  $('#selectNombre').val(0);
                    if (consultaAmbiental.municipiosCargados == false) {
                        cargarMunicipios(featureSet.features);
                    } else {                        
                        $('#selectMunicipio').prop('disabled', false);
                    }
                    break;
                case "default":
                    break;
            }
            hideLoader();
        }
        function cargarAnnio(annios) {                        
            $('#selectNombre').prop('disabled', true); $('#selectNombre').val('');
            $('#selectAnio').prop('disabled', false);
            $('#botonBuscar').prop('disabled', false);                        
            var agregarDato = document.getElementById('selectAnio');
            agregarDato.length = 0;
            agregarDato.options[agregarDato.options.length] = new Option('', 0);
            for (var i in annios) {
                agregarDato.options[agregarDato.options.length] = new Option(annios[i], i + 1);
            }
            hideLoader();
        }
        function cargarMunicipios(datos) {
            //document.getElementById("divMunicipio").style.display = "block";
            $('#selectMunicipio').prop('disabled', false);
            var agregarDato = document.getElementById('selectMunicipio');
            agregarDato.length = 0;
            agregarDato.options[agregarDato.options.length] = new Option('', 0);
            for (var i in consultaAmbiental.municipios) {
                agregarDato.options[agregarDato.options.length] = new Option(consultaAmbiental.municipios[i].name, parseInt(i) + 1);
            }
            consultaAmbiental.municipiosCargados = true;
          
        }
        function cargarDatosSubCategoria(datos) {
            document.getElementById("divSubCategoria").style.display = "block";
            var agregarSubCategoria = document.getElementById('selectSubCategoria');
            agregarSubCategoria.length = 0;
            agregarSubCategoria.options[agregarSubCategoria.options.length] = new Option('', 0);
            for (var i in datos) {
                agregarSubCategoria.options[agregarSubCategoria.options.length] = new Option(datos[i], i + 1);
            }
        }                
        function dibujarGraficaBarras() {
            require(["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines",
                "dojo/fx/easing", "dojox/charting/plot2d/ClusteredColumns", "dojox/charting/plot2d/MarkersOnly", "dojox/charting/action2d/Tooltip",
                "dojox/charting/widget/Legend",
                "dojo/ready"],
                function (Chart, Default, Lines, easing, ClusteredColumns, MarkersOnly, Tooltip, Legend, ready) {
                    ready(function () {


                        var contador = consultaAmbiental.contadorListas;
                        var anioSeleccionado = consultaAmbiental.annioSelected;
                        var municipio = consultaAmbiental.lists[contador].col1;
                        var titulo, rural, urbano, minimo, tituloEjeX = "a\u00F1o", tituloEjeY, legendTwo;
                        if (consultaAmbiental.confirCategoriaSelected == consultaAmbiental.categoria[1].categoria[2].nombreCategoria) {
                            if (consultaAmbiental.mostrarCVE) {
                                titulo = "Coeficiente de variaci\u00F3n estimado de <br/>" + municipio + " en el a\u00F1o " + anioSeleccionado;
                                rural = consultaAmbiental.lists[contador].col5;
                                urbano = consultaAmbiental.lists[contador].col3;                                
                                if (consultaAmbiental.lists[contador].col5 < consultaAmbiental.lists[contador].col3) {
                                    minimo = (consultaAmbiental.lists[contador].col5) - 1;
                                } else {
                                    minimo = (consultaAmbiental.lists[contador].col3) - 1;
                                }
                            } else {
                                titulo = "Proposici\u00F3n porcentual de " + municipio + " en el a\u00F1o " + anioSeleccionado;
                                rural = consultaAmbiental.lists[contador].col4;
                                urbano = consultaAmbiental.lists[contador].col2;
                                if (consultaAmbiental.lists[contador].col4 < consultaAmbiental.lists[contador].col2) {
                                    minimo = (consultaAmbiental.lists[contador].col4) - 1;
                                } else {
                                    minimo = (consultaAmbiental.lists[contador].col2) - 1;
                                }
                            }                            
                        } else if(consultaAmbiental.confirCategoriaSelected == "Tramites ambientales"){
                            tituloEjeX = consultaAmbiental.confirSubCategoriaSelected;
                            titulo = consultaAmbiental.confirCategoriaSelected +  " " + consultaAmbiental.confirMunicipioSelected + " Periodo " + $('#fechaInicio').val() + " - " + $('#fechaFin').val();
                            rural = consultaAmbiental.lists.length;                             
                            urbano = 0;                                
                            minimo = urbano;
                            /* if(consultaAmbiental.legendTwo != undefined){
                                 consultaAmbiental.legendTwo.destroy();
                                 consultaAmbiental.legendTwo = undefined;
                             }*/
                            document.getElementById("titleChart").style.display = "none";

                        }else {
                            titulo = "Poblaci\u00F3n General de " + municipio + " en el a\u00F1o " + anioSeleccionado;
                            rural = consultaAmbiental.lists[contador].col2;
                            urbano = consultaAmbiental.lists[contador].col3;
                            if (consultaAmbiental.lists[contador].col2 < consultaAmbiental.lists[contador].col3) {
                                minimo = (consultaAmbiental.lists[contador].col2) - 1;
                            } else {
                                minimo = (consultaAmbiental.lists[contador].col3) - 1;
                            }                            
                        }
                        if (consultaAmbiental.existeGrafica != undefined) {
                            consultaAmbiental.existeGrafica.destroy();
                            consultaAmbiental.existeGrafica = undefined;
                        }
                        var graficaConsulta = new Chart("divGraficaConsultaAmbiental", {
                            title: titulo,
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
                                title: tituloEjeX,
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
                                min: minimo,
                                titleGap: 5
                            })
                            .addSeries("Rural", [rural], {
                                stroke: { color: "white" },
                                fill: "#B19B00",
                                tooltip: rural
                            })
                            .addSeries("Urbano", [urbano], {
                                stroke: { color: "white" },
                                fill: "#A31A7E",
                                tooltip: urbano
                            })

                        var anim_c = new Tooltip(graficaConsulta, "default");
                        graficaConsulta.render();
                        consultaAmbiental.graficaResultados = graficaConsulta;
                        consultaAmbiental.existeGrafica = graficaConsulta;  
                        if(consultaAmbiental.confirCategoriaSelected != "Tramites ambientales"){
                            if(consultaAmbiental.legendTwo != undefined){
                                //consultaAmbiental.legendTwo.destroy();                                                                
                                $("#leyendaGraficaConsulta").show();
                            }else{
                                legendTwo = new Legend({ chart: graficaConsulta }, "leyendaGraficaConsulta");                     
                                consultaAmbiental.legendTwo = legendTwo;                                
                            }                     
                        }else{
                            $("#leyendaGraficaConsulta").hide();
                        }                        
                        hideLoader();
                    });
                });
        }
        function dibujarDatosEnGraficaPunto(titleX, titleY) {
            console.log("dibujarDatosEnGraficaPunto");
            console.log(consultaAmbiental);
            require(["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines", "dojox/charting/plot2d/MarkersOnly", "dojo/ready"],
                function (Chart, Default, Lines, MarkersOnly, ready) {
                    ready(function () {
                        mostrarTablaYGraficoCA();   
                        document.getElementById("titleChart").style.display = "flex";
                        document.getElementById("titleChart").style.justifyContent = "center";
                        var contador = consultaAmbiental.contadorListas;                         
                        var titulo = "Datos "+consultaAmbiental.lists[contador].col3 +
                        " punto "+ consultaAmbiental.confirNombreSelected + "<br>" + " Periodo: " + $('#fechaInicio').val() + " - " + $('#fechaFin').val();
                        document.getElementById("titleChart").innerHTML = titulo;

                        var chart1 = new Chart("divGraficaConsultaAmbiental", {
                            //title: titulo
                        });
                        chart1.addPlot("default", {
                            type: "MarkersOnly",
                            gap: 0
                        });
                        chart1.addAxis("x", {
                            labels: [{
                                value: 1,
                                text: consultaAmbiental.lists[contador].col3
                            }],
                            min: 0,
                            max: 2,
                            minorTicks: true,
                            minorLabels: true,
                            title: titleX,
                            titleOrientation: "away"
                        });
                        chart1.addAxis("y", {
                            vertical: true,
                            min: (consultaAmbiental.lists[contador].col4 * 1) - 1,
                            max: (consultaAmbiental.lists[contador].col4 * 1) + 1,
                            title: titleY
                        });
                        chart1.addSeries("Series 1", [(consultaAmbiental.lists[contador].col4 * 1)]);
                        chart1.render();
                        consultaAmbiental.graficaResultados = chart1;

                    });
                });
        } 
        function dibujarDatosEnGrafica(data_list, fechaMesAgno, title, titleX, titleY) {
             console.log("dibujarDatosEnGrafica");
            mostrarTablaYGraficoCA();
            document.getElementById("titleChart").style.display = "flex";
            document.getElementById("titleChart").style.justifyContent = "center";
            document.getElementById("subtitle").style.display = "block";
            if (consultaAmbiental.confirCategoriaSelected == "Predios de reforestaci\u00F3n" || consultaAmbiental.confirCategoriaSelected == "Tramites ambientales") {
                document.getElementById("titleChart").innerHTML = title + "<br/>  Periodo: " + $('#fechaInicio').val() + " - " + $('#fechaFin').val();
            } else {
                document.getElementById("titleChart").innerHTML = title + " estaci\u00F3n " + consultaAmbiental.confirNombreSelected +
                    "<br/>  Periodo: " + $('#fechaInicio').val() + " - " + $('#fechaFin').val();

            }
            //document.getElementById("subtitle").innerHTML = Periodo: " + consultaAmbiental.fechaInicial + " - " + consultaAmbiental.fechaFinal;

            var serie = [], labelSerie = [];

            if (consultaAmbiental.confirSubCategoriaSelected != "Metereol\u00F3gica" && consultaAmbiental.confirSubCategoriaSelectedValue != 2) {
                data_list = consultaAmbiental.lists;
            }


            for (var i in data_list) {
                serie[i] = data_list[i].col3;
                labelSerie[i] = { value: (i * 1) + 1, text: data_list[i].col2 };
            }

            dojo.require("dojox.charting.Chart2D");

            makeCharts = function () {

                var chart1 = new dojox.charting.Chart2D("divGraficaConsultaAmbiental");
                chart1.addPlot("default", { type: "Markers" });
                chart1.addAxis("x", {
                    labels: labelSerie, /*fixUpper: "major",*/ fixLower: "manior", includeZero: true,
                    /*natural: true, vertical: false,*/ rotation: 90,
                    title: titleX,
                    titleOrientation: "away"
                });
                chart1.addAxis("y", {
                    vertical: true,
                    min: Math.min.apply(null, serie) - 1,
                    max: Math.max.apply(null, serie) + 1,
                    includeZero: true, natural: true,
                    title: titleY
                });
                chart1.addSeries("Series 1", serie);
                chart1.render();
                consultaAmbiental.graficaResultados = chart1;
                hideLoader();
            };

            dojo.addOnLoad(makeCharts);            
        }
        function consultaPoblacioGeneral(featureSet) {
            var fields = featureSet.fields;
            consultaAmbiental.campoCargarGrafica = fields[0].name;
            featuresResultPoblacion = featureSet.features;
            map.graphics.clear();
            consultaAmbiental.graficasCargadas = [];
            for (var i in featuresResultPoblacion) {
                var graphic = featuresResultPoblacion[i];
                var symbol = simbologiaFeatures(graphic);
                graphic.setSymbol(symbol);
                consultaAmbiental.graficasCargadas[i] = {};
                consultaAmbiental.graficasCargadas[i][fields[0].name] = featuresResultPoblacion[i].attributes[fields[0].name];
                consultaAmbiental.graficasCargadas[i]["grafica"] = graphic;
                consultaAmbiental.graficasCargadas[i]["symbol"] = symbol;
            }
        }
        function simbologiaFeatures(feature) {
            var leyendasPoblacion;
            var totalPobMunicipio;
            if (consultaAmbiental.confirCategoriaSelected == consultaAmbiental.categoria[1].categoria[2].nombreCategoria) {
                leyendasPoblacion = this.config.leyendaNecesidades;
                totalPobMunicipio = feature.attributes.TOTALCVE;
            } else {
                leyendasPoblacion = this.config.leyendaPoblacion;
                totalPobMunicipio = feature.attributes.TOTAL;
            }
            for (var i in leyendasPoblacion) {
                var leyenda = leyendasPoblacion[i];
                if (totalPobMunicipio > leyenda.minimo && totalPobMunicipio < leyenda.maximo) {
                    return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, Color.fromString("rgb(" + leyenda.colorLine.toString() + ")"), 2),
                        Color.fromString("rgb(" + leyenda.colorFondo.toString() + ")"));
                }
            }
        }
        function mostrarLeyenda(tituloLeyenda, propiedadesLeyenda) {
            // console.log('estoy en mostrarLeyenda');
            consultaAmbiental.panelManager = PanelManager();
            consultaAmbiental.widgetManager = WidgetManager();
            def = new Deferred();
            wm = WidgetManager.getInstance();
            LeyendaSocioeconomicaWidget = wm.getWidgetById('widgets_LeyendaSocioeconomica_1');
            if (LeyendaSocioeconomicaWidget == null) {
                //   console.log('Widget No esta cargado');
                confWidget = wm.appConfig.getConfigElementById('widgets_LeyendaSocioeconomica_1');
                //   console.log(confWidget);
                wm.loadWidget(confWidget).then(function () {
                    PanelManager.getInstance().showPanel(confWidget).then(function () {
                        wm.openWidget(confWidget.id);
                        topic.publish("leyendaSocioeconomica", { titulo: tituloLeyenda, configLeyenda: propiedadesLeyenda });
                        def.resolve();
                    });
                });
            } else {
                //   console.log('Widget ya esta Cargado');
                var panelLeyendaSocieEconomica = consultaAmbiental.panelLeyendaSocioEconomica;
                PanelManager.getInstance().showPanel(LeyendaSocioeconomicaWidget).then(function () {
                    wm.openWidget(LeyendaSocioeconomicaWidget);
                    topic.publish("leyendaSocioeconomica", { titulo: tituloLeyenda, configLeyenda: propiedadesLeyenda });
                    if (consultaAmbiental.confirCategoriaSelected == consultaAmbiental.categoria[1].categoria[2].nombreCategoria) {
                        panelLeyendaSocieEconomica.position.width = 280;
                        panelLeyendaSocieEconomica.position.height = 230;
                        panelLeyendaSocieEconomica._originalBox = {
                            w: panelLeyendaSocieEconomica.position.width,
                            h: panelLeyendaSocieEconomica.position.height,
                            l: panelLeyendaSocieEconomica.position.left || 50,
                            t: panelLeyendaSocieEconomica.position.top || 50
                        };
                        panelLeyendaSocieEconomica.setPosition(panelLeyendaSocieEconomica.position);
                        panelLeyendaSocieEconomica.panelManager.normalizePanel(panelLeyendaSocieEconomica);
                    }
                    def.resolve();
                })
            }

        }
        function selectedRowGrid(seleccionado) {
            showLoader();
         
            console.log(consultaAmbiental);
            var featuresResaltar =[];
            var municipioSeleccion = dijit.byId("gridCA").selection.getSelected()[0].col1[0];
            if (consultaAmbiental.confirTematicaSelected == consultaAmbiental.tematicas[1].tematicas[1]) {
                var leyenda = dijit.byId("leyendaGraficaConsulta");
                if (leyenda != undefined) {
                    leyenda.destroyRecursive(true);
                    consultaAmbiental.legendTwo = undefined;
                }
                var municipioSeleccion = dijit.byId("gridCA").selection.getSelected()[0].col1[0];
                //   console.log(dijit.byId("grid").selection.getSelected()[0].col1[0]);
                for (var i in consultaAmbiental.lists) {
                    if (consultaAmbiental.lists[i].col1 == municipioSeleccion) {
                        console.log("es igual");
                        
                        for (var a in consultaAmbiental.features) {


                            if (municipioSeleccion == consultaAmbiental.features[a].attributes.OBJECTID) {
                               
                                featuresResaltar.push(consultaAmbiental.features[a]);
                            }
                        }

                        consultaAmbiental.contadorListas = i;
                        break;
                    }
                    //dibujarFeatures2(featuresResaltar);
                }
                dibujarFeatures2(featuresResaltar);
                //dibujarGraficaBarras();
            }
            if(consultaAmbiental.confirCategoriaSelected != "Estaciones"){
                for(var i in consultaAmbiental.municipios){
                    if(municipioSeleccion == consultaAmbiental.municipios[i].name){
                        if(consultaAmbiental.confirCategoriaSelected == "Necesidades B\u00E1sicas Insatisfechas (NBI)"){
                            resaltarGraficaCA(municipioSeleccion);
                            break;
                        }else{
                            resaltarGraficaCA(consultaAmbiental.municipios[i].id);
                            break;   
                        }                    
                    }
                }
            }
            hideLoader();
        }


        function dibujarFeatures2(featuresResaltar) {
            var geometriaAcercar;
            var data = featuresResaltar, a = 0;
            var features = [];
            for (var i in data) {
                if (data[i].geometry != null) {
                    features[a] = data[i];
                    a++;
                }
            }

            if (features.length > 0) {
                var colorFeature;
                    colorFeature = [0, 255, 238, 1];
              
                console.log(features[0]);
                var spatialRef1 = new SpatialReference(3116);
                for (var i in features) {
                    if (features[i].geometry.type == "point") {

                        //atributo = {"x": features[i].geometry.x, "y": features[i].geometry.y};
                        loc = new Point(features[i].geometry.x, features[i].geometry.y, spatialRef1);
                        dibujarPunto(loc, features[i].attributes);
                        if (features.length == 1) {
                            var newZoom = 25000;
                            map.setScale(newZoom);
                            map.centerAt(loc);
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
                        map.graphics.add(graphic);
                        var extentAcercar;
                        if (features.length == 1) {
                            extentAcercar = esri.graphicsExtent(features);
                            extentAcercar = extentAcercar.expand(3.5);
                            map.setExtent(extentAcercar);
                            // appGlobal.map.setExtent(features[0].geometry.getExtent());
                        }
                        //////////////////////////////
                    } else {
                        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color(colorFeature), 3), new Color([255, 128, 0, 0.15]));
                        for (var i in features) {
                            var geometria = features[i].geometry;
                            geometriaAcercar = geometria;
                            console.log("geometriaAcercar");
                            console.log(geometriaAcercar);
                            //var infoTemplate = crearInfoTemplate(features[i].attributes);
                            var graphic = new Graphic(geometria, symbol, features[i].attributes);
                            graphic.id = features[i].attributes.OBJECTID;
                            map.graphics.add(graphic);
                        }

                        if (features.length == 1) {
                            console.log(features);
                            extentAcercar = esri.graphicsExtent(features);
                            extentAcercar = extentAcercar.expand(3.5);
                            map.setExtent(extentAcercar);
                            // appGlobal.map.setExtent(features[0].geometry.getExtent());
                        } else {
                            extentAcercar = esri.graphicsExtent(features);
                            extentAcercar = extentAcercar.expand(3.5);
                            map.setExtent(extentAcercar);
                            //var puntoAmbiental = new Point(geometriaAcercar.xmin, extent.ymin, appGlobalCatastral.map.spatialReference);
                            /*
                            extentAcercar = esri.graphicsExtent(features[0]);
                            extentAcercar = extentAcercar.expand(3.5);
                            map.setExtent(extentAcercar);
                            */
                        }
                    }
                }
            }
        }
        function dibujarPunto(loc, attr) {
            var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));
            var infoTemplate = new InfoTemplate();
            var newPunto = new Graphic(loc, symbol, attr, infoTemplate);
            map.graphics.add(newPunto);
        }
    
        function ubicarYcentrarPunto(geometryPunto) {
            //  console.log("dibujarPunto", geometryPunto);
            if (map.graphics.graphics.length > 0) {
                map.graphics.clear();
            }
            var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));
            var newPunto = new Graphic(geometryPunto, symbol);
            map.graphics.add(newPunto);
            var newZoom = 2000;
            map.setScale(newZoom);
            map.centerAt(geometryPunto);
        }               
        function ocultarBoxServicios(condicion) {
            var contador = consultaAmbiental.selectDesabilitados.length;
            if (condicion) {
                for(var i in consultaAmbiental.selects)
                    if(!document.getElementById(consultaAmbiental.selects[i]).disabled){
                        document.getElementById(consultaAmbiental.selects[i]).disabled = true;
                        consultaAmbiental.selectDesabilitados[contador] = consultaAmbiental.selects[i];
                        contador++;
                    }
            } else {
                for(var i in consultaAmbiental.selectDesabilitados){
                    document.getElementById(consultaAmbiental.selectDesabilitados[i]).disabled = false;
                }
                consultaAmbiental.selectDesabilitados = [];
            }
           

           
        }
        function revisarResultados() {
            for (var i = appGlobal.widgetManager.loaded.length; i > 0; i--) {
                var idWidgets = appGlobal.widgetManager.loaded[i - 1].id;
                if (window.widgetOpen && idWidgets == "widgets_MyWidgetResultados_Widget_40") {
                    window.widgetOpen = false;
                    cerrarWidgetResultados();
                    abreWidgetResultados();
                    cerrarWidgetResultados();
                    break;
                }
            }
        }
        function borrarFeatureCargados() {
            for (var i in featureCargados) {
                map.removeLayer(featureCargados[i]);
            }
            idFeatureCargado = 0;
            featureCargados.length = 0;
            map.graphics.clear();
        }
        function requestFailed(error, io) {
            var jsonError = dojoJson.toJson(error, true);
            var info = new InfoTemplate(jsonError);
        }




        return clazz;

    });

function Exportar() {
    //ResultadosJson
    var ReportTitle = "Resultados";
    var ShowLabel = true;
    var ResultadosJson = consultaAmbiental.jsonConvertido;
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
            createDialogInformacionGeneral("<B> Resultados </B>", "Invalid data");
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
        createDialogInformacionGeneral("<B> Resultados </B>", "No  hay elementos");
    }

}
