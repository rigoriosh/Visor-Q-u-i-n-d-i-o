var consultaSalud = {};
define(["dojo/dom", 'dojo/on', 'dojo/_base/declare', 'dojo/_base/lang', 'jimu/BaseWidget', 'dojo/_base/html', "esri/toolbars/draw",
  "esri/geometry/webMercatorUtils", "esri/map", "dojo/query", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/toolbars/draw", "dijit/registry", "dojo/parser", "esri/graphic", "esri/tasks/GeometryService",
  "esri/tasks/BufferParameters", "esri/geometry/Point", "esri/SpatialReference", "esri/geometry/normalizeUtils", "esri/renderers/SimpleRenderer", "dojo/_base/array",
  "esri/layers/FeatureLayer", "esri/tasks/query", "esri/renderers/jsonUtils", "esri/request", "dojo/_base/json", "esri/InfoTemplate", "esri/geometry/Extent",
  "esri/tasks/GeometryService", "esri/tasks/ProjectParameters", "jimu/PanelManager", "dojo/dom-class", "esri/dijit/Popup", "dojo/dom-construct", "esri/tasks/QueryTask",
  "dijit/Calendar", "dojo/date", "dojo/Deferred", "dojo/date/locale", "dojo/_base/event", "esri/dijit/FeatureTable", "jimu/WidgetManager",
  "esri/symbols/Font", "esri/symbols/TextSymbol", "dojo/dom-geometry",
  "dojo/domReady!"
],
  function(dom, on, declare, lang, BaseWidget, html, Draw, webMercatorUtils, Map, query, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
    Color, Draw, registry, parser, Graphic, GeometryService, BufferParameters, Point, SpatialReference, normalizeUtils,
    SimpleRenderer, array, FeatureLayer, Query, jsonUtil, esriRequest,  dojoJson, InfoTemplate, Extent, GeometryService, ProjectParameters,
    PanelManager, domClass, Popup, domConstruct, QueryTask, Calendar, date, Deferred, locale, event, FeatureTable, WidgetManager,Font, TextSymbol,
    domGeom
  ) {
   
        var clazz = declare([BaseWidget], {
        name: 'consultaSalud',
      
        startup: function() {         
          $('#widgets_ConsultaSalud_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Realiza consulta de la tem&aacute;tica salud"></div>');
          domGeom.boxModel = "border-box"; 
          query("#selectConsultaPorCS").on("click", function (evt) {            
            var seleccion = this.options[this.selectedIndex].value;
            if (seleccion != 777777 && seleccion != consultaSalud.consultaPorSeleccionada) {
                consultaSalud.ejecutarBusqueda = false;
                cerrarWidgetLeyendaCS();
                consultaSalud.consultaPorSeleccionada = seleccion;
                map.graphics.clear();          
                map.setExtent(map._initialExtent);                      
                consultaSalud.categoriaSeleccionada = undefined;
                consultaSalud.municipioSeleccionada = undefined;
                consultaSalud.atributoSeleccionada = undefined;
                consultaSalud.indicadorSeleccionado = undefined;                
                consultaSalud.indicadores = undefined;
                consultaSalud.tematicas = undefined;
                consultaSalud.anioIndicadorSeleccionado = undefined;
                consultaSalud.tematicaSeleccionada = undefined;  
                document.getElementById("btnResultadosCS").style.display = "none";
                document.getElementById("buscarCS").style.display = "block";
                document.getElementById("limpiarCS").style.display = "block";
                document.getElementById("p1CS").style.display = "none";                
                consultaSalud.widthInicial = 307;
                consultaSalud.heightInicial = 235;
                ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, consultaSalud.heightInicial);
                document.getElementById("labelConsultaPorCS").style.width = "102px";
                document.getElementById("divConsGeneSaludCS").style.display = "none";
                document.getElementById("divIndicadoresCS").style.display = "none";
                document.getElementById("divConsPorTematicaCS").style.display = "none";
                if(seleccion == consultaSalud.consultaPor[0].name){                  
                  document.getElementById("divConsGeneSaludCS").style.display = "block";
                  textoCargando("selectCategoriaCS");
                  consultaSalud.divFormulario = "divConsGeneSaludCS";                                                                                          
                }else if(seleccion == consultaSalud.consultaPor[1].name){                                                      
                  textoCargando("selectIndicadorCS");
                  consultaSalud.divFormulario = "divIndicadoresCS";
                  document.getElementById("divIndicadoresCS").style.display = "block";                                                                                         
                  document.getElementById("labelConsultaPorCS").style.marginRight = "0px";                  
                  $('#selectCategoriaIndicadorCS').prop('disabled', true);
                  $('#selectAnnioIndicadorCS').prop('disabled', true);
                }else{                                    
                  textoCargando("selectTematicaCT");
                  document.getElementById("divConsPorTematicaCS").style.display = "block";
                  consultaSalud.divFormulario = "divConsPorTematicaCS";                                                  
                  $('#selectMunicipioCS1').prop('disabled', true);
                  $('#selectRangoEdadCS1').prop('disabled', true);
                  $('#selectAnnioCS1').prop('disabled', true);                  
                  ajustarTamanioWidget(consultaSalud.panel, 320, 260);
                  document.getElementById("divConsPorTematicaCS").style.marginTop = "0px";
                  document.getElementById("labelConsultaPorCS").style.width = "116px";
                  document.getElementById("selectConsultaPorCS").style.width = "166px";
                  consultaSalud.ejecutarBusqueda
                }
                  var urlServicio;
                  var consultaPor = consultaSalud.consultaPor;
                  for(var i in consultaPor){
                    if(seleccion == consultaPor[i].name){
                      urlServicio = consultaPor[i].url;
                      consultaSalud.urlConsultaPor = urlServicio;
                      break;
                    }
                  }
                  consultaSalud.numeroQuery = 1;    
                  consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length] = {};
                  consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].consultaPor = seleccion;
                  realizarQuery(urlServicio);              
                limpiarContenedor("selectAtributoCS"); $('#selectAtributoCS').prop('disabled', true);
                limpiarContenedor("selectMunicipioCS"); $('#selectMunicipioCS').prop('disabled', true);
                limpiarContenedor("selectTematicaCT"); $('#selectTematicaCT').prop('disabled', true);                
                $('#buscarCS').prop('disabled', true);
                $('#btnResultadosCS').prop('disabled', true);  
                document.getElementById("botonSiguienteCS").style.display = "none";
                document.getElementById("buscarCS").style.display = "block";
                document.getElementById("limpiarCS").style.display = "block";
            }
          });
          query("#selectCategoriaCS").on("click", function (evt) {
            consultaSalud.resultQuery = undefined;
            var seleccion = this.options[this.selectedIndex].value;
            if (seleccion != 777777 && seleccion != consultaSalud.categoriaSeleccionada) {
                consultaSalud.ejecutarBusqueda = false;
              cerrarWidgetLeyendaCS();
              showLoader();
              map.setExtent(map._initialExtent);                                                        
              limpiarContenedor("selectAtributoCS");              
              limpiarContenedor("selectMunicipioCS");                            
              limpiarContenedor("selectAtributoCS");              
              document.getElementById("btnResultadosCS").style.display = "none";
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
              limpiarContenedor("selectIndicadorCS");
              limpiarContenedor("selectCategoriaIndicadorCS");
              limpiarContenedor("selectAnnioIndicadorCS");
              var urlCategoria = consultaSalud.urlConsultaPor + "/" + seleccion;
              consultaSalud.urlCategoria = urlCategoria;
              if(consultaSalud.consultaPor[0].name == consultaSalud.consultaPorSeleccionada){
                cargarDatos("selectMunicipioCS", municipiosName);
                $('#selectMunicipioCS').prop('disabled', false);
              }
              map.graphics.clear();                                                                    
              consultaSalud.categoriaSeleccionada = seleccion;
              if(consultaSalud.featuresCargados.length > 0){
                removerLayers();
              }           
              $('#buscarCS').prop('disabled', true);
              $('#btnResultadosCS').prop('disabled', true);              
              document.getElementById("p1CS").style.display = "none";     
              consultaSalud.municipioSeleccionado = undefined;
              document.getElementById("botonSiguienteCS").style.display = "none";
            }            
          });                        
          query("#selectMunicipioCS").on("click", function (evt) {
              consultaSalud.resultQuery = undefined;
              consultaSalud.ejecutarBusqueda = false;
            var data, myWhere;
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "Seleccione..." && seleccion != consultaSalud.municipioSeleccionado){     
              consultaSalud.municipioSeleccionado = seleccion;
              textoCargando("selectAtributoCS");                                                   
              var where = consultaSalud.where, idMunicipio, outFields;
              document.getElementById("btnResultadosCS").style.display = "none";
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
              document.getElementById("p1CS").style.display = "none";
              for(var i in municipiosName){
                if(seleccion == municipiosName[i].name){
                  idMunicipio = municipiosName[i].id;
                  consultaSalud.idMunicipio = idMunicipio;
                  break;
                }
              }
        
              consultaSalud.nameField = "NOMBREEQUIPAMIENTO";
              outFields = [consultaSalud.nameField];                
              myWhere = "IDMUNICIPIO = '" + idMunicipio + "'";
              consultaSalud.Where = myWhere;
              geometry = false;
              consultaSalud.numeroQueryTask = 1;
              consultarQueryTask(outFields, consultaSalud.urlCategoria, geometry, myWhere);
                                          
              
              $('#btnResultadosCS').prop('disabled', true); 
              $('#buscarCS').prop('disabled', true);             
            }
          });
          query("#selectAtributoCS").on("click", function (evt) {
              consultaSalud.ejecutarBusqueda = true;
            showLoader();
            consultaSalud.resultQuery = undefined;
            var where, outFields;
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "Seleccione..." && seleccion != consultaSalud.atributoSeleccionada) {                                          
              consultaSalud.atributoSeleccionada = seleccion;                                                        
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
              document.getElementById("btnResultadosCS").style.display = "none";
              consultaSalud.heightInicial = 258;
              ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, consultaSalud.heightInicial);
              consultaSalud.heightForm = 258;
              consultaSalud.numeroQuery = 2;
              realizarQuery(consultaSalud.urlCategoria);             
            }
          });

          query("#selectIndicadorCS").on("click", function (evt) {
            var seleccion = this.options[this.selectedIndex].text, id;
            if (seleccion != "Seleccione..." && consultaSalud.indicadorSeleccionado != seleccion) {
                consultaSalud.ejecutarBusqueda = false;
              consultaSalud.indicadorSeleccionado = seleccion;      
              consultaSalud.anioIndicadorSeleccionado = undefined;
              cerrarWidgetLeyendaCS();                      
              for(var i in consultaSalud.objetosSeleccionados){
                if(consultaSalud.objetosSeleccionados[i].consultaPor == consultaSalud.consultaPor[1].name){
                  for(var a in consultaSalud.objetosSeleccionados[i].indicadores){
                    if(consultaSalud.objetosSeleccionados[i].indicadores[a].name == consultaSalud.indicadorSeleccionado){
                      id = consultaSalud.objetosSeleccionados[i].indicadores[a].id;
                      break;
                    }                  
                  }
                }
              }
              var url = consultaSalud.urlConsultaPor + "/" + id;
              var outFields = ["*"];
              consultaSalud.numeroQueryTask = 5;
              consultarQueryTask(outFields, url, false, "1=1");
              consultaSalud.urlIndicadores = url;
              $("#buscarCS").prop('disabled', true);
              $('#btnResultadosCS').prop('disabled', true); 
              document.getElementById("botonSiguienteCS").style.display = "none";
              document.getElementById("btnResultadosCS").style.display = "none";
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
            }
          });
          query("#selectCategoriaIndicadorCS").on("click", function (evt) {
              consultaSalud.ejecutarBusqueda = false;
            var seleccion = this.options[this.selectedIndex].text, id;
            if (seleccion != "Seleccione..." && consultaSalud.categoriaSeleccionada != seleccion) {                                                        
              consultaSalud.categoriaSeleccionada = seleccion; 
              consultaSalud.anioIndicadorSeleccionado = undefined;                           
              var datos = [], c = 0, atributo;              
                if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[0].name){
                  for(var i in consultaSalud.respuestaIndicador.features){
                    if(consultaSalud.respuestaIndicador.features[i].attributes.TIPO_AFILIACION == seleccion){                      
                        datos[c] = consultaSalud.respuestaIndicador.features[i].attributes["ANIO"];
                        c++;
                      }
                    }
                  }else if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[3].name){
                    for(var i in consultaSalud.respuestaIndicador.features){
                      if(consultaSalud.respuestaIndicador.features[i].attributes.TIPO_MORBILIDAD == seleccion){                        
                          datos[c] = consultaSalud.respuestaIndicador.features[i].attributes["ANIO"];
                          c++;
                        }
                      }                    
                  }else if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[4].name){
                    for(var a in consultaSalud.categoriaMortalidad){
                      if(consultaSalud.categoriaMortalidad[a].name == seleccion){
                        for(var i in consultaSalud.respuestaIndicador.features){
                          if(consultaSalud.respuestaIndicador.features[i].attributes[consultaSalud.categoriaMortalidad[a].campo] != undefined){
                            datos[c] = consultaSalud.respuestaIndicador.features[i].attributes["ANIO"];
                            c++;
                          }
                        }
                      }
                    }
                  }else{
                    for(var a in consultaSalud.categoriaNatalidad){
                      if(consultaSalud.categoriaNatalidad[a].name == seleccion){
                        for(var i in consultaSalud.respuestaIndicador.features){                          
                          if(consultaSalud.respuestaIndicador.features[i].attributes[consultaSalud.categoriaNatalidad[a].campo] != undefined){
                            datos[c] = consultaSalud.respuestaIndicador.features[i].attributes["ANIO"];
                            c++;
                          }
                        }
                      }
                    }
                  }                                  
                var dato = ordenarDatos(descriminaRepetidos(datos));
                cargarDatos("selectAnnioIndicadorCS", dato);
                $("#selectAnnioIndicadorCS").prop('disabled', false);
                document.getElementById("btnResultadosCS").style.display = "none";
                document.getElementById("buscarCS").style.display = "block";
                document.getElementById("limpiarCS").style.display = "block";
              }            
          });
          query("#selectAnnioIndicadorCS").on("click", function (evt) {
            var seleccion = this.options[this.selectedIndex].text, id;
            if (seleccion != "Seleccione..." && consultaSalud.anioIndicadorSeleccionado != seleccion) {
                consultaSalud.ejecutarBusqueda = true;
              consultaSalud.anioIndicadorSeleccionado = seleccion;
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
              document.getElementById("btnResultadosCS").style.display = "none";              
              consultaSalud.heightInicial = 258;
              ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, consultaSalud.heightInicial);

            }
          });

          query("#selectTematicaCT").on("click", function (evt) {
            var seleccion = this.options[this.selectedIndex].text, id;
            if (seleccion != "Seleccione..." && consultaSalud.tematicaSeleccionada != seleccion) {
                consultaSalud.ejecutarBusqueda = false;
              consultaSalud.tematicaSeleccionada = seleccion; 
              consultaSalud.rangoEdadSelecionado = undefined;
              consultaSalud.municipioSeleccionado = undefined;
              document.getElementById("btnResultadosCS").style.display = "none";
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
              cerrarWidgetLeyendaCS();                      
              if(consultaSalud.tematicas != undefined){
                if(consultaSalud.tematicaSeleccionada == consultaSalud.tematicas[0].name){
                  limpiarContenedor("selectRangoEdadCS1");
                  textoCargando("selectMunicipioCS1");                    
                  limpiarContenedor("selectAnnioCS1");
                  consultaSalud.numeroQueryTask = 8;
                }else{
                  limpiarContenedor("selectMunicipioCS1");
                  textoCargando("selectRangoEdadCS1");
                  limpiarContenedor("selectAnnioCS1");
                  consultaSalud.numeroQueryTask = 10;
                }
              }
              for(var i in consultaSalud.objetosSeleccionados){
                if(consultaSalud.objetosSeleccionados[i].consultaPor == consultaSalud.consultaPor[2].name){
                  for(var a in consultaSalud.objetosSeleccionados[i].tematicas){
                    if(consultaSalud.objetosSeleccionados[i].tematicas[a].name == consultaSalud.tematicaSeleccionada){
                      id = consultaSalud.objetosSeleccionados[i].tematicas[a].id;
                      break;
                    }                  
                  }
                }
              }
              var url = consultaSalud.urlConsultaPor + "/" + id;
              var outFields = ["*"];              
              consultarQueryTask(outFields, url, false, "1=1");
              consultaSalud.urlServicio = url;
              $("#buscarCS").prop('disabled', true);
              $('#btnResultadosCS').prop('disabled', true);
              document.getElementById("botonSiguienteCS").style.display = "none";
            }
          });
          query("#selectMunicipioCS1").on("click", function (evt) {                        
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "Seleccione..." && seleccion != consultaSalud.municipioSeleccionado) {
                consultaSalud.ejecutarBusqueda = false;
              var data, myWhere, a = 0, where = consultaSalud.where, idMunicipio, outFields, anios = [];
              consultaSalud.municipioSeleccionado = seleccion;
              consultaSalud.anioSeleccionado = undefined;                                   
             if(consultaSalud.tematicaSeleccionada == consultaSalud.tematicas[0].name){
               for(var i in consultaSalud.featureSetTematicas.features){
                 if(consultaSalud.featureSetTematicas.features[i].attributes.NOMBRE_MUNICIPIO == seleccion){
                  anios[a] = consultaSalud.featureSetTematicas.features[i].attributes.ANIO;
                  a++;
                 }
               }             
               anios = ordenarDatos(descriminaRepetidos(anios));               
               cargarDatos("selectAnnioCS1", anios);
               $('#selectAnnioCS1').prop('disabled', false);
             }else{
              document.getElementById("p1CS").style.display = "none";
              for(var i in municipiosName){
                if(seleccion == municipiosName[i].name){
                  idMunicipio = municipiosName[i].id;
                  consultaSalud.idMunicipio = idMunicipio;
                  break;
                }
              }        
              consultaSalud.nameField = "NOMBREEQUIPAMIENTO";
              outFields = [consultaSalud.nameField];                
              myWhere = "IDMUNICIPIO = '" + idMunicipio + "'";
              consultaSalud.Where = myWhere;
              geometry = false;
              consultaSalud.numeroQueryTask = 1;
              consultarQueryTask(outFields, consultaSalud.urlCategoria, geometry, myWhere);                                          
            }
              $('#btnResultadosCS').prop('disabled', true); 
              $('#buscarCS').prop('disabled', true);
              document.getElementById("btnResultadosCS").style.display = "none";
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
            }
          });
          query("#selectRangoEdadCS1").on("click", function (evt) {                        
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "Seleccione..." && seleccion != consultaSalud.rangoEdadSelecionado) {
                consultaSalud.ejecutarBusqueda = false;
              var a = 0, anios = [];
              consultaSalud.rangoEdadSelecionado = seleccion;              
              consultaSalud.anioSeleccionado = undefined;
              document.getElementById("btnResultadosCS").style.display = "none";
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
               for(var i in consultaSalud.featureSetTematicas.features){
                 if(consultaSalud.featureSetTematicas.features[i].attributes.EDAD == seleccion){
                  anios[a] = consultaSalud.featureSetTematicas.features[i].attributes.ANIO;
                  a++;
                 }
               }             
               anios = ordenarDatos(descriminaRepetidos(anios));               
               cargarDatos("selectAnnioCS1", anios);
               $('#selectAnnioCS1').prop('disabled', false);             
              $('#btnResultadosCS').prop('disabled', true); 
              $('#buscarCS').prop('disabled', true);             
            }
          });
          query("#selectAnnioCS1").on("click", function (evt) {
            var seleccion = this.options[this.selectedIndex].text, id;
            if (seleccion != "Seleccione..." && consultaSalud.anioSeleccionado != seleccion) {
                consultaSalud.ejecutarBusqueda = true;
              consultaSalud.anioSeleccionado = seleccion;
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
              document.getElementById("btnResultadosCS").style.display = "none";
              consultaSalud.heightInicial = 273;
              consultaSalud.widthInicial = 320;
              ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, consultaSalud.heightInicial);
            }
          });

          query("#buscarCS").on("click", function (evt) {
              if (consultaSalud.ejecutarBusqueda) {
                  map.setExtent(map._initialExtent);
                  document.getElementById("buscarCS").style.display = "none"; document.getElementById("limpiarCS").style.display = "none";
                  document.getElementById("form5CS").style.display = "none";
                  document.getElementById("btnCapaciadInstCS").style.display = "none";
                  document.getElementById("btnServiciosCS").style.display = "none";
                  document.getElementById("titleIndicadores").style.display = "none";
                  document.getElementById("btnVerMasCS").style.display = "none";
                  consultaSalud.pActivado = false;
                  var outFields = [], myWhere, divsDeshabilitados, url;
                  if (consultaSalud.consultaPorSeleccionada == consultaSalud.consultaPor[0].name) {
                      outFields = ["NOMBREEQUIPAMIENTO", "DIRECCION", "TELEFONO", "SITIOWEB", "GERENTE", "NIT", "HORARIOS", "FOTOS"];
                      if (consultaSalud.atributoSeleccionada == "CENTRO DE SALUD ALFONSO CORREA GRILLO") {
                          myWhere = consultaSalud.Where + " AND " + consultaSalud.nameField + " = " + "'" + "CENTRO DE  SALUD ALFONSO CORREA GRILLO" + "'";
                      } else {
                          myWhere = consultaSalud.Where + " AND " + consultaSalud.nameField + " = " + "'" + consultaSalud.atributoSeleccionada + "'";
                      }
                      consultaSalud.whereGeneral = myWhere;
                      divsDeshabilitados = ["selectConsultaPorCS", "selectCategoriaCS", "selectMunicipioCS", "selectAtributoCS"];
                      consultaSalud.numeroQueryTask = 2;
                      url = consultaSalud.urlCategoria;
                  }
                  if (consultaSalud.indicadores != undefined) {
                      if (consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[0].name) {
                          var divs = ["widgetCS", "divIndicadoresCS"];
                          ocultarMostrarDivs(divs, "none");
                          consultaSalud.DivsOcultar = divs;
                          consultaSalud.widthResultado = 459;
                          consultaSalud.heightResultado = 708;
                          ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);
                          outFields = ["NOMBRE", "COBERTURATOTAL"];
                          myWhere = consultaSalud.campoIndicadores + " = '" + consultaSalud.categoriaSeleccionada + "' AND ANIO = '" + consultaSalud.anioIndicadorSeleccionado + "'";
                          consultaSalud.numeroQueryTask = 6;
                      } else if (consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[1].name) {
                          outFields = ["NOMBRE", "PORCENTAJE"];
                          myWhere = "ANIO" + " = '" + consultaSalud.anioIndicadorSeleccionado + "'";
                          consultaSalud.numeroQueryTask = 7;
                      } else if (consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[2].name) {
                          outFields = ["NOMBRE", "FRECUENCIA", "PORCENTAJE", "TASA10000", "HOMBRES", "MUJERES"];
                          myWhere = "ANIO" + " = '" + consultaSalud.anioIndicadorSeleccionado + "'";
                          consultaSalud.numeroQueryTask = 14;
                      } else if (consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[3].name) {
                          outFields = ["NOMBRE", "NUMEROCASOS"];
                          myWhere = "TIPO_MORBILIDAD = '" + consultaSalud.categoriaSeleccionada + "' AND ANIO" + " = '" + consultaSalud.anioIndicadorSeleccionado + "'";
                          consultaSalud.numeroQueryTask = 12;
                      } else if (consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[4].name) {
                          outFields = ["NOMBRE", "TASAGENERAL", "TASAINFANTIL", "TASAPERINATAL", "TASASUICIDIO", "TASACANCER"];
                          myWhere = "ANIO = '" + consultaSalud.anioIndicadorSeleccionado + "'";
                          consultaSalud.numeroQueryTask = 13;
                          if (consultaSalud.categoriaSeleccionada == "Tasa de mortalidad general") {
                              consultaSalud.campoIndicadores = "TASAGENERAL";
                          } else if (consultaSalud.categoriaSeleccionada == "Tasa de mortalidad infantil") {
                              consultaSalud.campoIndicadores = "TASAINFANTIL";
                          } else if (consultaSalud.categoriaSeleccionada == "Tasa de mortalidad perinatal") {
                              consultaSalud.campoIndicadores = "TASAPERINATAL";
                          } else if (consultaSalud.categoriaSeleccionada == "Tasa de mortalidad por suicidio") {
                              consultaSalud.campoIndicadores = "TASASUICIDIO";
                          } else if (consultaSalud.categoriaSeleccionada == "Tasa de mortalidad por tumores malignos") {
                              consultaSalud.campoIndicadores = "TASACANCER";
                          }
                      } else if (consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[5].name) {
                          if (consultaSalud.categoriaSeleccionada == "Tasa de natalidad") {
                              consultaSalud.campoIndicadores = "TASAGENERAL";
                              outFields = ["NOMBRE", "TASAGENERAL"];
                          } else if (consultaSalud.categoriaSeleccionada == "Tasa global de fecundidad") {
                              consultaSalud.campoIndicadores = "TASAGLOBALFECUNDIDAD";
                              outFields = ["NOMBRE", "TASAGLOBALFECUNDIDAD"];
                          } else {
                              consultaSalud.campoIndicadores = "TASAFECUNDIDADADOLESCENTE";
                              outFields = ["NOMBRE", "TASAFECUNDIDADADOLESCENTE"];
                          }
                          myWhere = "ANIO = '" + consultaSalud.anioIndicadorSeleccionado + "'";
                          consultaSalud.numeroQueryTask = 13;
                      }
                      url = consultaSalud.urlIndicadores;
                      consultaSalud.whereIndicadores = myWhere;
                      divsDeshabilitados = ["selectConsultaPorCS", "selectIndicadorCS", "selectCategoriaIndicadorCS", "selectAnnioIndicadorCS", "buscarCS", "btnResultadosCS"];
                  }
                  if (consultaSalud.tematicas != undefined) {
                      if (consultaSalud.tematicaSeleccionada == consultaSalud.tematicas[0].name) {
                          myWhere = "NOMBRE_MUNICIPIO = '" + consultaSalud.municipioSeleccionado + "' AND ANIO" + " = '" + consultaSalud.anioSeleccionado + "'";
                          consultaSalud.numeroQueryTask = 9;
                          outFields = ["CAUSA", "NUMERO", "HAB10000"];
                          consultaSalud.fieldsTematicas = outFields;
                      } else {
                          var divs = ["widgetCS", "divConsPorTematicaCS"];//a ocultar
                          ocultarMostrarDivs(divs, "none");
                          consultaSalud.DivsOcultar = divs;                          
                          consultaSalud.widthResultado = 467;
                          consultaSalud.heightResultado = 792;
                          ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);
                          myWhere = consultaSalud.featureSetTematicas.fields[7].name + " = '" + consultaSalud.rangoEdadSelecionado + "' AND ANIO" + " = '" + consultaSalud.anioSeleccionado + "'";
                          consultaSalud.numeroQueryTask = 11;
                          outFields = ["NOMBRE", "CANTIDADHOMBRES", "CANTIDADMUJERES"];
                      }
                      divsDeshabilitados = ["selectConsultaPorCS", "selectTematicaCT", "selectMunicipioCS1", "selectRangoEdadCS1", "selectAnnioCS1", "buscarCS", "btnResultadosCS"];
                      url = consultaSalud.urlServicio;
                      consultaSalud.where = myWhere;
                  }
                  if (consultaSalud.tablaResultados != undefined) {
                      consultaSalud.tablaResultados.destroy();
                      consultaSalud.tablaResultados = undefined;
                  }
                  consultaSalud.ocultarDivs = true;
                  consultaSalud.divsDeshabilitados = divsDeshabilitados;
                  disabledSlects(true, divsDeshabilitados);
                  consultarQueryTask(outFields, url, true, myWhere);
              }
          });                                                          
          query("#botonRegresarCS").on("click", function (evt) {
            showLoader();         
            ocultarMostrarDivs(consultaSalud.divsMostrar, "none"); 
            ocultarMostrarDivs(consultaSalud.DivsOcultar, "block"); 
            disabledSlects(false, consultaSalud.divsDeshabilitados);          
            document.getElementById("imgExpan").style.display = "none"; 
            document.getElementById("btnResultadosCS").style.display = "block"; document.getElementById("limpiarCS").style.display = "block";
            document.getElementById("buscarCS").style.display = "none";   
            document.getElementById("btnsCS").style.display = "none";                    
            document.getElementById("pCapaciInstalada").style.display = "none";
            ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, consultaSalud.heightInicial);                                                        
            if(consultaSalud.indicadores != undefined){
              if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[1].name || consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[2].name){
                $('#selectCategoriaIndicadorCS').prop('disabled', true);
              }
            }else if(consultaSalud.tematicas != undefined){
              if(consultaSalud.tematicaSeleccionada == consultaSalud.tematicas[0].name){
                $('#selectRangoEdadCS1').prop('disabled', true);
              }else if(consultaSalud.tematicaSeleccionada == consultaSalud.tematicas[1].name){
                $('#selectMunicipioCS1').prop('disabled', true);
              }
            }
          });
          query("#btnResultadosCS").on("click", function (evt) {                                           
            if(consultaSalud.indicadorSeleccionado == undefined){
              document.getElementById("tablaIndicadores").style.display = "none";
            }
            ocultarMostrarDivs(consultaSalud.DivsOcultar, "none"); 
            ocultarMostrarDivs(consultaSalud.divsMostrar, "block"); 
            document.getElementById("pCapaciInstalada").style.display = "none";                        
            document.getElementById("form5CS").style.display = "none"; 
            document.getElementById("form2CS").style.display = "none";
            document.getElementById("btnCapaciadInstCS").style.display = "none";
            document.getElementById("btnServiciosCS").style.display = "none";             
            document.getElementById("btnResultadosCS").style.display = "none";
            document.getElementById("limpiarCS").style.display = "none";
            document.getElementById("btnsCS").style.display = "flex";
            consultaSalud.ocultarDivsCapIns = true;
            consultaSalud.ocultarDivs = true;
            if(consultaSalud.indicadores != undefined){
              if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[0].name){                
              }else{                
                document.getElementById("graficaIndicadores").style.display = "none";                                       
              }
            }        
            ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);
            if (document.getElementById("gridCS") != null) {
                document.getElementById("gridCS").style.width = "98%";
                document.getElementById("gridCS").style.height = "98%";
            }
          });
          query("#btnVerMasCS").on("click", function (evt) {  
            var width = consultaSalud.widthResultado;            
            var height;
            document.getElementById("form5CS").style.display = "none";
            if(consultaSalud.ocultarDivs){
              ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, 319);
              document.getElementById("form2CS").style.display = "block"; 
              document.getElementById("btnCapaciadInstCS").style.display = "block";
              document.getElementById("btnServiciosCS").style.display = "block"; 
              document.getElementById("idResultadosCS").style.display = "block";                              
              document.getElementById("btnsCS").style.flexDirection = "column";
            }else{
              document.getElementById("form2CS").style.display = "none";
              document.getElementById("btnCapaciadInstCS").style.display = "none";
              document.getElementById("btnServiciosCS").style.display = "none";             
              document.getElementById("tablaIndicadores").style.display = "none";                             
              document.getElementById("form5CS").style.display = "none";                             
              document.getElementById("pCapaciInstalada").style.display = "none";
              ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);                         
            }                  
            
            consultaSalud.ocultarDivs = !consultaSalud.ocultarDivs;
          });
          query("#btnCapaciadInstCS").on("click", function (evt) {
            if(consultaSalud.ocultarDivsCapIns){              
              document.getElementById("form5CS").style.display = "none";  
              if(consultaSalud.pActivado){
                ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, 362);
                //document.getElementById("tablaIndicadores").style.height = "3em";
                document.getElementById("pCapaciInstalada").style.display = "block";
              } else{
                document.getElementById("tablaIndicadores").style.display = "block";
                document.getElementById("pCapaciInstalada").style.display = "none";                
                document.getElementById("tablaIndicadores").style.marginLeft = "20px";
                document.getElementById("tablaIndicadores").style.marginBottom = "5px";
                document.getElementById("tablaIndicadores").style.width = "344px";                
                ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado,644);                
              }                      
              consultaSalud.ocultarDivsServ = true;
            }else{
              document.getElementById("tablaIndicadores").style.display = "none"; 
              document.getElementById("pCapaciInstalada").style.display = "none";
              ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, 319);
            }
            consultaSalud.ocultarDivsCapIns = !consultaSalud.ocultarDivsCapIns;
          });
          query("#btnServiciosCS").on("click", function (evt) {
            if(consultaSalud.ocultarDivsServ){
              document.getElementById("tablaIndicadores").style.display = "none";
              document.getElementById("pCapaciInstalada").style.display = "none";
              document.getElementById("form5CS").style.display = "block";   
              document.getElementById("divtTablaCS").style.display = "block";        
              ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, 364);
              consultaSalud.ocultarDivsCapIns = true;
            }else{
              document.getElementById("form5CS").style.display = "none"; 
              ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, 319);
            }
            consultaSalud.ocultarDivsServ = !consultaSalud.ocultarDivsServ;
          });
          query("#botonSiguienteCS").on("click", function (evt) {
            if(consultaSalud.countTematicas == 1){
              consultaSalud.countTematicas = 0;
            }else{
              consultaSalud.countTematicas++;
            }
            setGraphBars(consultaSalud.camposTematicas[consultaSalud.countTematicas]);
          });
          query("#limpiarCS").on("click", function (evt) {
              document.getElementById("btnResultadosCS").style.display = "none"; document.getElementById("btnResultadosCS").style.display = "none";
              document.getElementById("buscarCS").style.display = "block";
              document.getElementById("limpiarCS").style.display = "block";
              var selects = ["selectCategoriaCS", "selectMunicipioCS1", "selectRangoEdadCS1",
                "selectAnnioCS1", "selectMunicipioCS", "selectAtributoCS", "selectIndicadorCS", "selectCategoriaIndicadorCS",
              "selectAnnioIndicadorCS", "selectTematicaCT"];
              cargarDatos("selectConsultaPorCS", consultaSalud.consultaPor);
              for (var i in selects) {
                  limpiarContenedor(selects[i], true)
              }
              consultaSalud.consultaPorSeleccionada = undefined;
              consultaSalud.ejecutarBusqueda = false;
          });
        },



        onOpen: function() {
          consultaSalud.ejecutarBusqueda = true;
          $('#selectConsultaPorCS').prop('disabled', false);
          var panel = this.getPanel();                    
          var width = 320;
          var height = 132;        
          ajustarTamanioWidget(panel, width, height);
          consultaSalud.ejecutarBusqueda = false;
          document.getElementById("divConsGeneSaludCS").style.display = "none";
          document.getElementById("divIndicadoresCS").style.display = "none";
          document.getElementById("divConsPorTematicaCS").style.display = "none";          
          document.getElementById("btnResultadosCS").style.display = "none";
          document.getElementById("form4CS").style.display = "none";       
          document.getElementById("imgExpan").style.display = "none";
          document.getElementById("botonRegresarCS").style.display = "none";
          document.getElementById("btnVerMasCS").style.display = "none";
          document.getElementById("limpiarCS").style.display = "block";
          document.getElementById("buscarCS").style.display = "block";
          
          var contenedor = "selectConsultaPorCS";
          if(consultaSalud.consultaPor == undefined){
              consultaSalud.consultaPor = [{
                  name: "Consulta general de salud",
                  url: SERVICIO_GENERAL_SALUD
                },{
                  name: "Consulta por indicadores",
                  url: SERVICIO_SALUD_ALFANUMERICO
                },{
                  name: "Consulta por temáticas",
                url: SERVICIO_SALUD_ALFANUMERICO
              }];              
              var datos = consultaSalud.consultaPor;
              cargarDatos(contenedor, datos);
            //////---------------
            consultaSalud.consultaPorSeleccionada = undefined;
            consultaSalud.panel = panel;
            consultaSalud.widthInicial = width;  
            consultaSalud.heightInicial = height;  
            consultaSalud.featuresCargados = [];
            consultaSalud.ocultarDivs = true;
            consultaSalud.ocultarDivsCapIns = true;
            consultaSalud.ocultarDivsServ = true;
            consultaSalud.objetosSeleccionados = [];                                             
         }else{
          cargarDatos(contenedor, consultaSalud.consultaPor);
          document.getElementById("widgetCS").style.display = "block";
          $('#selectConsultaPorCS').prop('disabled', false);
         }                                  
          consultaSalud.grphicsLoaded = [];                                         
          consultaSalud.temaCargado = false;
          consultaSalud.tematicas = [];                              
          },
        onClose: function(){
          console.log('onClose');
          map.graphics.clear();
          if(consultaSalud.featuresCargados.length > 0){
            removerLayers();
          }
          consultaSalud.consultaPorSeleccionada = undefined;
          for(var i in consultaSalud.grphicsLoaded){
            map.removeLayer(consultaSalud.grphicsLoaded[i]);
          }                    
          dojo.disconnect();          
          map.setExtent(map._initialExtent);
          document.getElementById("divtTablaCS").style.display = "none";
            //          document.getElementById("divFormularioCS").style.display = "block";          
            cerrarWidgetLeyendaCS();
            limpiarContenedor("selectIndicadorCS");
            limpiarContenedor("selectCategoriaIndicadorCS");
            limpiarContenedor("selectAnnioIndicadorCS");            
          }
          
      });                
  function removerLayers(){
    for(var i in consultaSalud.featuresCargados){
      map.removeLayer(consultaSalud.featuresCargados[i]);
      }                
  }
  function consultarQueryTask(campos, url, geometry, where) {
    if(url != undefined && where != undefined){
        var queryTask = new QueryTask(url);
        var parametros = new Query();
        parametros.outFields = [campos];
        parametros.where = where;
        parametros.returnGeometry = geometry;
        parametros.outSpatialReference = map.spatialReference;
        queryTask.execute(parametros, monstrarConsulta, function (error) {
            console.log(error);            
            createDialogInformacionGeneral("<B> Info </B>", "No se logró completar la operación");                        
            ocultarMostrarDivs(consultaSalud.divsMostrar, "none");
            ocultarMostrarDivs(consultaSalud.DivsOcultar, "flex");
            disabledSlects(false, consultaSalud.divsDeshabilitados);
            ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, consultaSalud.heightInicial);
        });
      }        
  }        
  function respuestaQuery(result, url) {
    if(consultaSalud.numeroQuery == 1){
      var objetoOrdenado = [], select;
      if(consultaSalud.consultaPorSeleccionada == consultaSalud.consultaPor[0].name){
        consultaSalud.resultConsGeneralSalud = result;                    
        objetoOrdenado = ordenarObjetoLayers(result.layers); 
        consultaSalud.categorias = objetoOrdenado;
        consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].categorias = objetoOrdenado;
        select = "selectCategoriaCS";
        $('#selectCategoriaCS').prop('disabled', false);
      }else if (consultaSalud.consultaPorSeleccionada == consultaSalud.consultaPor[1].name){           
        consultaSalud.resultConsIndicadores = result;
        objetoOrdenado = [
          {
            name: "Cobertura de afiliación",
            id: 3
          },{
            name: "Cobertura de vacunación",
            id: 9
          },{
            name: "Violencia intrafamiliar",
            id: 1
          },{
            name: "Morbilidad",
            id: 4
          },{
            name: "Mortalidad",
            id: 5
          },{
            name: "Natalidad",
            id: 6
          }];      
        consultaSalud.indicadores = objetoOrdenado;
        consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].indicadores = objetoOrdenado;
        select = "selectIndicadorCS";
        $('#selectIndicadorCS').prop('disabled', false);
      }else if (consultaSalud.consultaPorSeleccionada == consultaSalud.consultaPor[2].name){          
        consultaSalud.resultTematicas = result;
        objetoOrdenado.push(result.layers[8]); 
        objetoOrdenado.push(result.layers[7]); 
        consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].tematicas = objetoOrdenado;
        consultaSalud.tematicas = objetoOrdenado;
        select = "selectTematicaCT";
        $('#selectTematicaCT').prop('disabled', false);
        $('#selectMunicipioCS1').prop('disabled', true);
        $('#selectRangoEdadCS1').prop('disabled', true);
        $('#selectAnnioCS1').prop('disabled', true);        
      }      
      cargarDatos(select, objetoOrdenado);      
            
    }else if(consultaSalud.numeroQuery == 2){
      var onlyNameFields = getOnlyFields(result.fields);
      consultaSalud.onlyNameFields = onlyNameFields;
      consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].atributo = consultaSalud.atributoSeleccionada;
    }
  
   
   
    hideLoader();     
  }          
  
  function dibujarFeatures(features, color){  
      var colorFeature;
      if(color == undefined){
        colorFeature = [255, 0, 0, 1];
      }else{
        colorFeature = color;
      } 
      for(var i in features){     
        if(features[i].geometry.type == "point"){
          for(var i in features){
            //atributo = {"x": features[i].geometry.x, "y": features[i].geometry.y};
            loc = new Point(features[i].geometry.x, features[i].geometry.y, map.spatialReference);
            dibujarPunto(loc, features[i].attributes);
            if(features.length == 1){
              var newZoom = 2000;  
              map.setScale(newZoom);
              map.centerAt(loc);
            }
          }        
        }else if(features[i].geometry.type == "polyline"){
          //////////////////////////////
          var polylineSymbol1 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color(colorFeature), 3);                           
          var polyline = new Polyline({
            "paths":                                   
                features[i].geometry.paths,
            "spatialReference": {
                "wkid": map.spatialReference.wkid
            }
        });           
        var infoTemplate = crearInfoTemplate(features[i].attributes);
        var graphic = new Graphic(polyline, polylineSymbol1, features[i].attributes, infoTemplate);         
        map.graphics.add(graphic);
        if(features.length == 1){
          map.setExtent(features[0].geometry.getExtent());
        } 
          //////////////////////////////
        }else{
          var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color(colorFeature), 3), new Color([255, 128, 0, 0.15]));
          for (var i in features) {
              var geometria = features[i].geometry;
                var infoTemplate = crearInfoTemplate(features[i].attributes);
                var graphic = new Graphic(geometria, symbol, features[i].attributes, infoTemplate);            
              graphic.id = features[i].attributes.OBJECTID;
              map.graphics.add(graphic);
          }
          if(features.length == 1){
            map.setExtent(features[0].geometry.getExtent());
          }      
        } 
        }
  } 
  function dibujarPunto(loc, attr) { 
    var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));      
    var infoTemplate = crearInfoTemplate(attr);
    var newPunto = new Graphic(loc, symbol, attr, infoTemplate);  
    map.graphics.add(newPunto);          
    colocaTextoPunto(loc, attr);
  }
  
  function limpiarCamposResultado(){
    document.getElementById("NOMBREEQUIPAMIENTOCS").innerHTML = "";
    document.getElementById("DIRECCIONCS").innerHTML = "";
    document.getElementById("TELEFONOCS").innerHTML = "";
    document.getElementById("SITIOWEBCS").innerHTML = "";
    document.getElementById("GERENTECS").innerHTML = "";
    document.getElementById("NITCS").innerHTML = "";
    document.getElementById("HORARIOSCS").innerHTML = "";
    /*document.getElementById("RNTCS").innerHTML = "";
    document.getElementById("REGISTROMERCANTILCS").innerHTML = "";*/
  }
  function setGraphBars(campoSeries){
    var anioSeleccionado = consultaSalud.anioSeleccionado;
    var titulo;
    if(campoSeries == "CANTIDADMUJERES"){
      titulo = consultaSalud.tematicaSeleccionada + " de mujeres en el año " + consultaSalud.anioSeleccionado + "<br>Rango de edad: " + consultaSalud.rangoEdadSelecionado + " años";    
    }else{
      titulo = consultaSalud.tematicaSeleccionada + " de hombres en el año " + consultaSalud.anioSeleccionado + "<br>Rango de edad: " + consultaSalud.rangoEdadSelecionado + " años";    
    }    
    var labelSerieX = [], valoresSeries = [];
    labelSerieX[0] = {value: 0, text: 0};        
    var features = consultaSalud.featureSetMortality.features;
    for(var i in features){
      i = parseInt(i);
      labelSerieX[i + 1] = {};
      labelSerieX[i + 1].value = i + 1;
      labelSerieX[i + 1].text = features[i].attributes.NOMBRE;          
      valoresSeries[i] = {};
      valoresSeries[i].nombre = features[i].attributes.NOMBRE;
      valoresSeries[i].dato = features[i].attributes[campoSeries];
    }      
    document.getElementById("graficaIndicadores").style.marginLeft = "-15px";
    dibujarGraficaBarrasCS("graficaIndicadores", titulo, labelSerieX, valoresSeries);
  }
  function monstrarConsulta(featureSet) {
    showLoader();  
    consultaSalud.featureSet = featureSet;
    var datos = [], datosFinales = [], contenedor, div, campo;  
      document.getElementById("pCapaciInstalada").style.display = "none";
      document.getElementById("form4CS").style.display = "none";
      document.getElementById("graficaIndicadores").style.display = "none";    
      consultaSalud.ocultarDivsCapIns = true;
      consultaSalud.ocultarDivs = true;
      if(consultaSalud.chartPie != undefined){
        consultaSalud.chartPie.destroy();
        consultaSalud.chartPie = undefined;
        document.getElementById("graficaIndicadores").style.marginLeft = "auto";  
        document.getElementById("graficaIndicadores").style.marginRight = "auto";  
        document.getElementById("graficaIndicadores").style.width = "320px";  
      }     
      if(consultaSalud.numeroQueryTask == 1){
        if(featureSet.features.length > 0){
          var dato = featureSet.features;
          for(var i in dato){
            datos[i] = dato[i].attributes[consultaSalud.nameField];
          }
          var objetoOrdenado = ordenarDatos(datos);
          consultaSalud.atributos = objetoOrdenado;
          cargarDatos("selectAtributoCS", objetoOrdenado);
          consultaSalud.heightInicial = 231;
          ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, consultaSalud.heightInicial);
          $('#selectAtributoCS').prop('disabled', false);
          consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].categoria = consultaSalud.categoriaSeleccionada;
          consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].municipio = consultaSalud.municipioSeleccionado;
        }else{        
          ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, 256);
          document.getElementById("p1CS").style.display = "block";
          document.getElementById("limpiarCS").style.display = "none";
          document.getElementById("buscarCS").style.display = "none";
        }
      }else if(consultaSalud.numeroQueryTask == 2){
        if(featureSet.features.length > 0){
          var divsOcultar = ["widgetCS", "divConsGeneSaludCS"];
          ocultarMostrarDivs(divsOcultar, "none");
          consultaSalud.DivsOcultar = divsOcultar;
          var divsMostrar = ["divtTablaCS", "idResultadosCS", "form1CS"];
          ocultarMostrarDivs(divsMostrar, "block");        
          document.getElementById("idResultadosCS").style.display = "block";
          consultaSalud.divsMostrar = divsMostrar;        
          limpiarCamposResultado();
          document.getElementById("btnsCS").style.display = "flex";
          document.getElementById("botonRegresarCS").style.display = "flex";
          consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].respuestaConsulta = featureSet;
          
          var campos = featureSet.fields;
          var fields = [];
          for(var i in campos){
            var miCampo = campos[i].name + "CS";
            fields[i] = campos[i].name;
            if(document.getElementById(miCampo) != null){
                if(featureSet.features[0].attributes[campos[i].name] != null && featureSet.features[0].attributes[campos[i].name] != " "){          
                  document.getElementById(miCampo).innerHTML = featureSet.features[0].attributes[campos[i].name];          
                }else{
                  document.getElementById(miCampo).innerHTML = "No disponible";          
                }
              }
          }

          var x = featureSet.features[0].geometry.x, y = featureSet.features[0].geometry.y, zoom = 2000;            
          var referenciaSpacial = map.spatialReference;
          centrarYubicarPuntoEspecifico(x, y, referenciaSpacial, zoom);

          var title = consultaSalud.atributoSeleccionada;
          var attributos = featureSet.features[0].attributes;
          var fields = featureSet.fields;
          var myInfoTemplate = crearInfoTemplate(title, attributos, fields);
          var mySymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.9]), 5), new Color([0, 255, 0, 0.1]));
          dibujarPuntoConInfoTemplate(x, y, referenciaSpacial, mySymbol, attributos, myInfoTemplate);
          
          var div = "imgCS", urlImagen = URL_ARCHIVOS_QUINDIO + featureSet.features[0].attributes["FOTOS"];
          consultaSalud.urlImagen = urlImagen;
          //var height = "190px", width = "100px";
          consultaSalud.imagenCArgada = false;        
          if(consultaSalud.imagenCargada == undefined){
            subirImagenCS(urlImagen, div);            
          }else{
            a = document.getElementById('idCS');
            a.parentNode.removeChild(a);
            subirImagenCS(urlImagen, div);
          }        
          document.getElementById("tablaIndicadores").style.display = "none";
          document.getElementById("botonexportarCS").style.display = "none";
          document.getElementById("btnServiciosCS").style.display = "none";
          document.getElementById("btnCapaciadInstCS").style.display = "none";
          document.getElementById("form2CS").style.display = "none";
          document.getElementById("btnVerMasCS").style.display = "block";
          consultaSalud.widthResultado = 420;
          consultaSalud.heightResultado = 217;
          ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);
          ////////Ejecua consulta capacidad instalada
          var where = consultaSalud.nameField + " = '" + consultaSalud.atributoSeleccionada + "'";
          var url = SERVICIO_SALUD_ALFANUMERICO + "/2" ;
          var campos = ["TIPO_CAPACIDAD", "VALORCAPACIDAD"], geometry = false;
          consultaSalud.numeroQueryTask = 3;
          consultarQueryTask(campos, url, geometry, where);
          consultaSalud.whereCapacInstalada = where;
          consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].urlCapacInstalada = url;
          consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].whereCapacInstalada = where;
          ///////
        }else{
          var agregarDato = document.getElementById("selectServiciosCS");
          agregarDato.options[agregarDato.options.length] = new Option("Sin datos", 0);
          disabledSlects(false, consultaSalud.divsDeshabilitados);
        }
      }else if(consultaSalud.numeroQueryTask == 3){
        if(featureSet.features.length > 0){
          document.getElementById("tablaIndicadores").style.display = "block";
          console.log("featureSet:", featureSet);        
          mostrarResultadosEnTablaGeneral(featureSet, "tablaIndicadores", withMaximo = 13, true);        
          consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].resCapcInstalada = featureSet;        
          
          document.getElementById("pCapaciInstalada").style.display = "none";        
        }else{
          consultaSalud.pActivado = true;
          var agregarDato = document.getElementById("selectServiciosCS");
          agregarDato.length = 0;                  
          agregarDato.options[agregarDato.options.length] = new Option("Sin Información", 0);  
        }
        ////////Ejecua consulta Servicios      
        var myWhere;
        if(consultaSalud.atributoSeleccionada == 'CENTRO DE SALUD ALFONSO CORREA GRILLO'){
          myWhere = "NOMBREEQUIPAMIENTO = 'CENTRO DE  SALUD ALFONSO CORREA GRILLO'";
        }else{
          myWhere = consultaSalud.whereCapacInstalada;
        }
        url = SERVICIO_SALUD_ALFANUMERICO + "/0" ;        
        campos = ["TIPO_SERVICIO"];
        consultaSalud.numeroQueryTask = 4;
        consultarQueryTask(campos, url, false, myWhere);
        ///////        
      }else if(consultaSalud.numeroQueryTask == 4){
        if(featureSet.features.length > 0){
          //console.log("featureSet:", featureSet);       
          consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].resServicios = featureSet;        
          var datos = [], contenedor = "selectServiciosCS";
          for(var i in featureSet.features){
            datos[i] = featureSet.features[i].attributes.TIPO_SERVICIO;
          }
          datos = ordenarDatos(datos);        
          var agregarDato = document.getElementById(contenedor);
          agregarDato.length = 0;          
          for(var i in datos){
            agregarDato.options[agregarDato.options.length] = new Option(datos[i], i);
          }
        }else{        
          consultaSalud.pActivado = true;
          var agregarDato = document.getElementById("selectServiciosCS");
          agregarDato.length = 0;                  
          agregarDato.options[agregarDato.options.length] = new Option("Sin Información", 0);        
        }
      }else if(consultaSalud.numeroQueryTask == 5){
        consultaSalud.respuestaIndicador = featureSet;
        var datos = [], contenedor = "selectCategoriaIndicadorCS", campo;
        limpiarContenedor(contenedor);
        limpiarContenedor("selectAnnioIndicadorCS");
        if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[0].name){  
          campo = "TIPO_AFILIACION";  
          for(var i in featureSet.features){
            datos[i] = featureSet.features[i].attributes[campo];
          }      
        }else if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[3].name){        
          campo = "TIPO_MORBILIDAD";
          for(var i in featureSet.features){
            datos[i] = featureSet.features[i].attributes[campo];
          }
        }else if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[4].name){
          datos = [
            {name: "Tasa de mortalidad general", campo: "TASAGENERAL"},
            {name: "Tasa de mortalidad infantil", campo: "TASAINFANTIL"},
            {name: "Tasa de mortalidad por tumores malignos", campo:"TASACANCER"},
            {name: "Tasa de mortalidad perinatal", campo:"TASAPERINATAL"},
            {name: "Tasa de mortalidad por suicidio", campo:"TASASUICIDIO"}];
          consultaSalud.categoriaMortalidad = datos;
        }else if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[5].name){        
          datos = [
            {name: "Tasa de natalidad", campo: "TASAFECUNDIDADADOLESCENTE"},
            {name: "Tasa global de fecundidad", campo: "TASAGLOBALFECUNDIDAD"},
            {name: "Tasa de fecundidad en adolescentes", campo:"TASAGENERAL"}];
          consultaSalud.categoriaNatalidad = datos;  
        }else{        
          for(var i in featureSet.features){
            datos[i] = featureSet.features[i].attributes["ANIO"];
          }
          contenedor = "selectAnnioIndicadorCS";
        }
        consultaSalud.campoIndicadores = campo;
        var dato = ordenarDatos(descriminaRepetidos(datos));        
        cargarDatos(contenedor, dato);
        $("#"+contenedor).prop('disabled', false);

      }else if(consultaSalud.numeroQueryTask == 6){
        console.log(featureSet);              
        document.getElementById("titleIndicadores").style.display = "none";
        document.getElementById("divtitleIndicadores").style.display = "none";
        document.getElementById("btnVerMasCS").style.display = "none";                
        divs = ["divtTablaCS","graficaIndicadores", "tablaIndicadores"];
        ocultarMostrarDivs(divs, "block");
        document.getElementById("divtTablaCS").style.display = "block";
        consultaSalud.divsMostrar = divs;
        if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[0].name){
          var leyenda = [
            {
              colorFondo: "39,247,237,0.4",
              colorLine: "39,247,237,1",
              label: "Menor a 5.000",
              minimo: 0,
              maximo: 5000
            },{
              colorFondo: "116,247,50,0.4",
              colorLine: "116,247,50,1",
              label: "5.001 a 20.000",
              minimo: 5001,
              maximo: 20000
            },{
              colorFondo: "247,177,6,0.4",
              colorLine: "247,177,6,1",
              label: "20.001 a 80.000",
              minimo: 20001,
              maximo: 80000
            },{
              colorFondo: "200, 110, 8, 0.4",
              colorLine: "200, 110, 8, 1",
              label: "Mayor a 80.000",
              minimo: 80001,
              maximo: 200000000
            }
          ];
          consultaSalud.leyendaCobertAfiliacion = leyenda;
          mostrarLeyendaCS(consultaSalud.indicadorSeleccionado, leyenda);
          graficasPoblacionCS(featureSet);
          resaltarGraficaMunicipiosCS(featureSet.features[0]);
          mostrarResultadosEnTablaGeneral(featureSet, "tablaIndicadores", withMaximo = 11, false);
                    
          ////obtiene los valores para la serie X y seria Y        
          var labelSerieX = [], valoresSeries = [];
          labelSerieX[0] = {value: 0, text: 0};        
          for(var i in featureSet.features){
            i = parseInt(i);
            labelSerieX[i + 1] = {};
            labelSerieX[i + 1].value = i + 1;
            labelSerieX[i + 1].text = featureSet.features[i].attributes.NOMBRE;          
            valoresSeries[i] = {};
            valoresSeries[i].nombre = featureSet.features[i].attributes.NOMBRE;
            valoresSeries[i].dato = featureSet.features[i].attributes.COBERTURATOTAL;
          }      
          var anioSeleccionado = consultaSalud.anioIndicadorSeleccionado;
          var titulo = consultaSalud.indicadorSeleccionado + " año " + anioSeleccionado + "<br/>Tipo " + consultaSalud.categoriaSeleccionada;                
          dibujarGraficaBarrasCS("graficaIndicadores", titulo, labelSerieX, valoresSeries, "Municipio", "Población");
          ///////////////////////////////////////////////                
          document.getElementById("tablaIndicadores").style.width = "298px";
          document.getElementById("tablaIndicadores").style.height = "300px";
          document.getElementById("tablaIndicadores").style.marginLeft = "62px";                    
          document.getElementById("botonexportarCS").style.display = "block";
          document.getElementById("btnsCS").style.display = "flex";          
          document.getElementById("btnsCS").style.flexDirection = "unset";
          document.getElementById("botonexportarCS").style.marginTop = "6px";
          document.getElementById("botonRegresarCS").style.display = "block";
        }
      }else if(consultaSalud.numeroQueryTask == 7){
        console.log(featureSet);      
        var divs = ["widgetCS","divIndicadoresCS"];
        ocultarMostrarDivs(divs, "none");
        consultaSalud.DivsOcultar = divs;
        divs = ["divtTablaCS","graficaIndicadores", "tablaIndicadores", "btnsCS"];
        ocultarMostrarDivs(divs, "block");
        consultaSalud.divsMostrar = divs;
        document.getElementById("divtTablaCS").style.display = "block";        
          var datos = [], limite = 1, limiteUno, limiteDos, promedio = 0;
          for(var i in featureSet.features){
            datos.push(featureSet.features[i].attributes.PORCENTAJE);
            promedio +=  featureSet.features[i].attributes.PORCENTAJE;
          }      
          var datosOrdenados = ordenarDatos(datos);
          promedio /=  datosOrdenados.length;
          if(datosOrdenados.length == 1){
            limiteUno = datosOrdenados[0];
            limiteDos = limiteUno + 0.1;
          }else{
            var numMaximo = Math.max.apply(null, datosOrdenados);
            var numMin = Math.min.apply(null, datosOrdenados);
            limiteUno = numMin + ((promedio - numMin)/2);
            limiteDos = promedio + ((numMaximo - promedio)/2);;             
          }
        limiteUno = parseFloat(limiteUno.toFixed(2));
        limiteDos = parseFloat(limiteDos.toFixed(2));        
        var leyenda = [
          {
            colorFondo: "252,3,3,0.4",
            colorLine: "252,3,3,1",
            label: "Alto",
            minimo: limiteDos + 0.01,
            maximo: limiteDos * 999
          },{
            colorFondo: "246,254,6,0.4",
            colorLine: "246,254,6,1",
            label: "Medio",
            minimo: limiteUno + 0.01,
            maximo: limiteDos
          },{
            colorFondo: "81,175,51,0.4",
            colorLine: "81,175,51,1",
            label: "Bajo",
            minimo: 0,
            maximo: limiteUno
          }
        ];
        consultaSalud.leyendaCobertAfiliacion = leyenda;
        mostrarLeyendaCS("Índice de " +consultaSalud.indicadorSeleccionado, leyenda);
        graficasPoblacionCS(featureSet);
        resaltarGraficaMunicipiosCS(featureSet.features[0]);      
        document.getElementById("graficaIndicadores").style.display = "none";
        if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[1].name || consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[2].name){                
          document.getElementById("divtitleIndicadores").style.display = "block"; 
          document.getElementById("divtitleIndicadores").style.display = "flex"; 
          document.getElementById("divtitleIndicadores").style.justifyContent = "center"; 
          document.getElementById("titleIndicadores").style.display = "block";
          document.getElementById("titleIndicadores").innerText = consultaSalud.indicadorSeleccionado + " en el año " + consultaSalud.anioIndicadorSeleccionado;  

          consultaSalud.widthResultado = featureSet.fields.length * 150;
          consultaSalud.heightResultado = 520;
          ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);
          document.getElementById("tablaIndicadores").style.marginLeft = "0px";
          document.getElementById("tablaIndicadores").style.width = "100%";      
          document.getElementById("tablaIndicadores").style.height = "344px";
          mostrarResultadosEnTablaGeneral(featureSet, "tablaIndicadores", withMaximo = 11, false);
          document.getElementById("btnsCS").style.display = "flex";      
          document.getElementById("botonRegresarCS").style.display = "block";
          document.getElementById("botonexportarCS").style.display = "block";
          document.getElementById("botonexportarCS").style.marginTop = "6px";
        }else{
          ajustarTamanioWidget(consultaSalud.panel, 459, 664);
        }            
      }else if(consultaSalud.numeroQueryTask == 8){
        if(featureSet.features.length > 0){
          var dato = featureSet.features;
          for(var i in dato){
            datos[i] = dato[i].attributes.NOMBRE_MUNICIPIO;
          }        
          var objetoOrdenado = ordenarDatos(descriminaRepetidos(datos));
          consultaSalud.municipiosTematica = objetoOrdenado;
          cargarDatos("selectMunicipioCS1", objetoOrdenado);        
          $('#selectMunicipioCS1').prop('disabled', false);
          consultaSalud.featureSetTematicas = featureSet;        
          consultaSalud.objetosSeleccionados[consultaSalud.objetosSeleccionados.length - 1].municipio = consultaSalud.municipioSeleccionado;
        }else{        
          ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, 256);
          document.getElementById("p1CS").style.display = "block";
          document.getElementById("limpiarCS").style.display = "none";
          document.getElementById("buscarCS").style.display = "none";
        }
      }else if(consultaSalud.numeroQueryTask == 9){      
        document.getElementById("idResultadosCS").style.display = "none";
        map.graphics.clear();
        pintargrafica("polygone", undefined, featureSet.features, featureSet.fields, consultaSalud.tematicaSeleccionada + " año " + consultaSalud.anioSeleccionado);
        map.setExtent(featureSet.features[0].geometry.getExtent()); 
        //document.getElementById("btnResultadosCS").style.display = "none";
        var divs = ["widgetCS","divConsPorTematicaCS", "btnResultadosCS"];//a ocultar
        ocultarMostrarDivs(divs, "none");
        consultaSalud.DivsOcultar = divs;
        divs = ["divtTablaCS","graficaIndicadores", "tablaIndicadores"];
        ocultarMostrarDivs(divs, "block");
        document.getElementById("divtTablaCS").style.display = "block";
        consultaSalud.divsMostrar = divs;
              document.getElementById("btnsCS").style.display = "flex";
        document.getElementById("botonexportarCS").style.display = "block";
        document.getElementById("botonRegresarCS").style.display = "block";
        if(consultaSalud.graficaResultados != undefined){
          consultaSalud.graficaResultados.destroy();
          consultaSalud.graficaResultados = undefined;
        }
        //muestra vaores en grafica tipo torta
        var arrayForGrafPie = [], total =  0, porcentajes = [];
        for(var o in featureSet.features){
          total += featureSet.features[o].attributes.HAB10000;
        }
        for(var e in featureSet.features){
          porcentajes[e] = ((featureSet.features[e].attributes.HAB10000 / total) * 100).toFixed(2);        
        }
        for(var a in featureSet.features){        
          arrayForGrafPie[a] = {};
          arrayForGrafPie[a].y = featureSet.features[a].attributes.HAB10000;
          arrayForGrafPie[a].text =  featureSet.features[a].attributes.HAB10000 + "<br>" +  porcentajes[a] + "%";
          arrayForGrafPie[a].stroke = "white";
          arrayForGrafPie[a].tooltip = featureSet.features[a].attributes.CODIGO +" <br> "+ featureSet.features[a].attributes.CAUSA;
        }
        var titulo =  consultaSalud.tematicaSeleccionada + ", " + "año " + consultaSalud.anioSeleccionado + "<br>" + consultaSalud.municipioSeleccionado;          
        mostrarDatosPie(arrayForGrafPie,"graficaIndicadores", titulo, 10);      

        /////////

        //elimino los campo q no nesecito mostrar como columna de la tabla
        for(var i = 0; i < 5; i++){
          featureSet.fields.shift();
        }
        featureSet.fields.pop();
        /////////
        if(featureSet.fields.length == 0){
          for(var i in consultaSalud.fieldsTematicas){
            featureSet.fields[i] = {};
            featureSet.fields[i].name = consultaSalud.fieldsTematicas[i];
          }
        }
        consultaSalud.widthResultado = featureSet.fields.length * 125;
        consultaSalud.heightResultado = 756;
        ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);     
        document.getElementById("tablaIndicadores").style.marginLeft = "0px";
        document.getElementById("tablaIndicadores").style.width = "100%";      
        document.getElementById("tablaIndicadores").style.height = "344px";
        mostrarResultadosEnTablaGeneral(featureSet, "tablaIndicadores", withMaximo = 13, false); 
        document.getElementById("graficaIndicadores").style.display = "flex";
        document.getElementById("graficaIndicadores").style.justifyContent = "center";      
        document.getElementById("graficaIndicadores").style.marginLeft = "18px";
        document.getElementById("botonSiguienteCS").style.display = "none";      
        document.getElementById("btnsCS").style.flexDirection = "unset";
        document.getElementById("botonexportarCS").style.marginTop = "6px";
      }else if(consultaSalud.numeroQueryTask == 10){
        consultaSalud.featureSetTematicas = featureSet;
        if(featureSet.features.length > 0){
          var dato = featureSet.features;
          for(var i in dato){
            datos[i] = dato[i].attributes.EDAD;
          }        
          var objetoOrdenado = descriminaRepetidos(datos);
          consultaSalud.rangosEdad = objetoOrdenado;
          cargarDatos("selectRangoEdadCS1", objetoOrdenado);        
          $('#selectRangoEdadCS1').prop('disabled', false);                
        }else{
          ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthInicial, 256);
          document.getElementById("p1CS").style.display = "block";
          document.getElementById("limpiarCS").style.display = "none";
          document.getElementById("buscarCS").style.display = "none";
        }
      } else if (consultaSalud.numeroQueryTask == 11) {
          divs = ["divtTablaCS", "graficaIndicadores", "tablaIndicadores"];
          ocultarMostrarDivs(divs, "block");
          consultaSalud.divsMostrar = divs;
        consultaSalud.featureSetMortality = featureSet;  
        map.graphics.clear();      
        ///ocultar y mostrar divs                          
        document.getElementById("tablaIndicadores").style.marginLeft = "0px";
        document.getElementById("tablaIndicadores").style.width = "100%";      
        document.getElementById("tablaIndicadores").style.height = "344px";
        mostrarResultadosEnTablaGeneral(featureSet, "tablaIndicadores", withMaximo = 13, false);   
        document.getElementById("botonSiguienteCS").style.display = "block";
        document.getElementById("botonRegresarCS").style.display = "flex";
        document.getElementById("btnsCS").style.flexDirection = "unset";
        document.getElementById("botonSiguienteCS").style.marginTop = "6px";
        ////////////////////////
        consultaSalud.countTematicas = 0;
        consultaSalud.camposTematicas = ["CANTIDADHOMBRES", "CANTIDADMUJERES"];      
        setGraphBars(consultaSalud.camposTematicas[consultaSalud.countTematicas]);
        //////////////////////       
        document.getElementById("btnsCS").style.display = "flex";
        document.getElementById("botonexportarCS").style.display = "block";      
        document.getElementById("botonexportarCS").style.marginTop = "6px";
      }else if(consultaSalud.numeroQueryTask == 12){
        console.log(featureSet);
        map.graphics.clear();
        var divs = ["widgetCS","divIndicadoresCS"];//a ocultar
        ocultarMostrarDivs(divs, "none");
        consultaSalud.DivsOcultar = divs;
        divs = ["divtTablaCS", "tablaIndicadores"];
        ocultarMostrarDivs(divs, "block");
        consultaSalud.divsMostrar = divs;      
        
        consultaSalud.widthResultado = featureSet.fields.length * 132;
        consultaSalud.heightResultado = 520;
        ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);
        document.getElementById("divtitleIndicadores").style.display = "block";
        document.getElementById("titleIndicadores").style.display = "block";
        document.getElementById("tablaIndicadores").style.marginLeft = "0px";
        document.getElementById("tablaIndicadores").style.width = "100%";      
        document.getElementById("tablaIndicadores").style.height = "344px";
        mostrarResultadosEnTablaGeneral(featureSet, "tablaIndicadores", withMaximo = 10, false);      
        document.getElementById("titleIndicadores").style.marginTop = "0px";
        document.getElementById("titleIndicadores").style.marginLeft = "0px";
        document.getElementById("titleIndicadores").style.width = "100%";
        document.getElementById("titleIndicadores").innerHTML = consultaSalud.indicadorSeleccionado + " en el año " + consultaSalud.anioIndicadorSeleccionado + "<br>" + consultaSalud.categoriaSeleccionada;      
        document.getElementById("btnsCS").style.display = "flex";
        var datos = [], limite = 1, limiteUno, limiteDos, total = 0;
        for(var i in featureSet.features){
          datos.push(featureSet.features[i].attributes.NUMEROCASOS);
          total += featureSet.features[i].attributes.NUMEROCASOS;
        }
        var datosOrdenados = ordenarDatos(datos);
        
        if(datosOrdenados.length == 1){
          limiteUno = datosOrdenados[0];
          limiteDos = limiteUno + 0.1;
        }else{
            var numMaximo = Math.max.apply(null, datosOrdenados);
            limiteUno = numMaximo / 2;
            limiteDos = limiteUno + (numMaximo / 4);          
        }
        var leyenda = [
          {
            colorFondo: "252,3,3,0.4",
            colorLine: "252,3,3,1",
            label: "Alto",
            minimo: limiteDos + 0.1,
            maximo: limiteDos * 999
          },{
            colorFondo: "246,254,6,0.4",
            colorLine: "246,254,6,1",
            label: "Medio",
            minimo: limiteUno + 0.1,
            maximo: limiteDos
          },{
            colorFondo: "81,175,51,0.4",
            colorLine: "81,175,51,1",
            label: "Bajo",
            minimo: 0,
            maximo: limiteUno
          }
        ];
        consultaSalud.leyendaCobertAfiliacion = leyenda;
        mostrarLeyendaCS("Índice de " +consultaSalud.indicadorSeleccionado, leyenda);
        graficasPoblacionCS(featureSet);
        resaltarGraficaMunicipiosCS(featureSet.features[0]);      
        document.getElementById("botonRegresarCS").style.display = "block";
        document.getElementById("botonexportarCS").style.display = "block";
        document.getElementById("botonexportarCS").style.marginTop = "6px";
      }else if(consultaSalud.numeroQueryTask == 13){
        map.graphics.clear();
        var divs = ["widgetCS","divIndicadoresCS"];//a ocultar
        ocultarMostrarDivs(divs, "none");
        consultaSalud.DivsOcultar = divs;
        divs = ["divtTablaCS", "tablaIndicadores"];
        ocultarMostrarDivs(divs, "block");
        consultaSalud.divsMostrar = divs;              
        if(consultaSalud.indicadorSeleccionado == "Natalidad"){
          consultaSalud.widthResultado = 277;
        }else{
          consultaSalud.widthResultado = 743;
        }        
        consultaSalud.heightResultado = 520;
        ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);        
        document.getElementById("divtitleIndicadores").style.display = "block";
        document.getElementById("titleIndicadores").style.display = "block";
        document.getElementById("tablaIndicadores").style.marginLeft = "0px";
        document.getElementById("tablaIndicadores").style.width = "100%";      
        document.getElementById("tablaIndicadores").style.height = "344px";
        mostrarResultadosEnTablaGeneral(featureSet, "tablaIndicadores", withMaximo = 10, false);      
        document.getElementById("titleIndicadores").style.marginTop = "0px";
        document.getElementById("titleIndicadores").style.marginLeft = "0px";
        document.getElementById("titleIndicadores").style.width = "100%";
        document.getElementById("titleIndicadores").innerHTML = consultaSalud.indicadorSeleccionado + " en el año " + consultaSalud.anioIndicadorSeleccionado + "<br>" + consultaSalud.categoriaSeleccionada;      
        document.getElementById("btnsCS").style.display = "flex";
        document.getElementById("btnsCS").style.flexDirection = "unset";
        var datos = [], limite = 1, limiteUno, limiteDos, total = 0;
        for(var i in featureSet.features){
          datos.push(featureSet.features[i].attributes[consultaSalud.campoIndicadores]);
          total += featureSet.features[i].attributes[consultaSalud.campoIndicadores];
        }
        var datosOrdenados = ordenarDatos(datos);
        
        if(datosOrdenados.length == 1){
          limiteUno = datosOrdenados[0];
          limiteDos = limiteUno + 0.1;
        }else{
          var numMaximo = Math.max.apply(null, datosOrdenados);
          limiteUno = numMaximo / 2;
          limiteDos = limiteUno + (numMaximo/4);               
        }
        limiteUno = parseFloat(limiteUno.toFixed(2));
        limiteDos = parseFloat(limiteDos.toFixed(2));
        if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[4].name){
          var leyenda = [
            {
              colorFondo: "252,3,3,0.4",
              colorLine: "252,3,3,1",
              label: "Alto",
              minimo: parseFloat((limiteDos + 0.01).toFixed(2)),
              maximo: parseFloat((limiteDos * 999).toFixed(2))
            },{
              colorFondo: "246,254,6,0.4",
              colorLine: "246,254,6,1",
              label: "Medio",
              minimo: parseFloat((limiteUno + 0.01).toFixed(2)),
              maximo: limiteDos
            },{
              colorFondo: "81,175,51,0.4",
              colorLine: "81,175,51,1",
              label: "Bajo",
              minimo: 0,
              maximo: limiteUno
            }
          ];
          
        }else if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[5].name){
          var leyenda = [
            {
              colorFondo: "3,234,253,0.4",
              colorLine: "3,234,253,1",
              label: "Menor a 10%",
              minimo: 0,
              maximo: 10
            },{
              colorFondo: "253,249,3,0.4",
              colorLine: "253,249,3,1",
              label: "10% a 50%",
              minimo: 10.01,
              maximo: 50
            },{
              colorFondo: "253,147,3,0.4",
              colorLine: "253,147,3,1",
              label: "50% a 75%",
              minimo: 50.01,
              maximo: 75
            },{
              colorFondo: "194,65,30,0.4",
              colorLine: "194,65,30,1",
              label: "Mayor a 75%",
              minimo: 75.01,
              maximo: 500
            }
          ];
        }      
        consultaSalud.leyendaCobertAfiliacion = leyenda;
        mostrarLeyendaCS("Índice de " +consultaSalud.indicadorSeleccionado, leyenda);
        graficasPoblacionCS(featureSet);
        resaltarGraficaMunicipiosCS(featureSet.features[0]);          
        document.getElementById("botonRegresarCS").style.display = "block";
        document.getElementById("botonexportarCS").style.display = "block";
        document.getElementById("botonexportarCS").style.marginTop = "6px";
      } else if (consultaSalud.numeroQueryTask == 14) {
          console.log(featureSet);
          var divs = ["widgetCS", "divIndicadoresCS"];
          ocultarMostrarDivs(divs, "none");
          consultaSalud.DivsOcultar = divs;
          divs = ["divtTablaCS", "graficaIndicadores", "tablaIndicadores", "btnsCS"];
          ocultarMostrarDivs(divs, "block");
          consultaSalud.divsMostrar = divs;
          document.getElementById("divtTablaCS").style.display = "block";
          var datos = [], limite = 1, limiteUno, limiteDos, promedio = 0;
          for (var i in featureSet.features) {
              datos.push(featureSet.features[i].attributes.PORCENTAJE);
              promedio += featureSet.features[i].attributes.PORCENTAJE;
          }
          var datosOrdenados = ordenarDatos(datos);
          promedio /= datosOrdenados.length;
          if (datosOrdenados.length == 1) {
              limiteUno = datosOrdenados[0];
              limiteDos = limiteUno + 0.1;
          } else {
              var numMaximo = Math.max.apply(null, datosOrdenados);
              var numMin = Math.min.apply(null, datosOrdenados);
              limiteUno = numMin + ((promedio - numMin) / 2);
              limiteDos = promedio + ((numMaximo - promedio) / 2);;
          }
          limiteUno = parseFloat(limiteUno.toFixed(2));
          limiteDos = parseFloat(limiteDos.toFixed(2));
          var leyenda = [
            {
                colorFondo: "252,3,3,0.4",
                colorLine: "252,3,3,1",
                label: "Alto",
                minimo: limiteDos + 0.01,
                maximo: limiteDos * 999
            }, {
                colorFondo: "246,254,6,0.4",
                colorLine: "246,254,6,1",
                label: "Medio",
                minimo: limiteUno + 0.01,
                maximo: limiteDos
            }, {
                colorFondo: "81,175,51,0.4",
                colorLine: "81,175,51,1",
                label: "Bajo",
                minimo: 0,
                maximo: limiteUno
            }
          ];
          consultaSalud.leyendaCobertAfiliacion = leyenda;
          mostrarLeyendaCS("Índice de " + consultaSalud.indicadorSeleccionado, leyenda);
          graficasPoblacionCS(featureSet);
          resaltarGraficaMunicipiosCS(featureSet.features[0]);
          document.getElementById("graficaIndicadores").style.display = "none";
          if (consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[1].name || consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[2].name) {
              document.getElementById("divtitleIndicadores").style.display = "block";
              document.getElementById("divtitleIndicadores").style.display = "flex";
              document.getElementById("divtitleIndicadores").style.justifyContent = "center";
              document.getElementById("titleIndicadores").style.display = "block";
              document.getElementById("titleIndicadores").innerText = consultaSalud.indicadorSeleccionado + " en el año " + consultaSalud.anioIndicadorSeleccionado;
              consultaSalud.widthResultado = 673;
              consultaSalud.heightResultado = 520;
              ajustarTamanioWidget(consultaSalud.panel, consultaSalud.widthResultado, consultaSalud.heightResultado);
              document.getElementById("tablaIndicadores").style.marginLeft = "0px";
              document.getElementById("tablaIndicadores").style.width = "100%";
              document.getElementById("tablaIndicadores").style.height = "344px";
              mostrarResultadosEnTablaGeneral(featureSet, "tablaIndicadores", withMaximo = 11, false);
              document.getElementById("btnsCS").style.display = "flex";
              document.getElementById("botonexportarCS").style.display = "block";
              document.getElementById("botonRegresarCS").style.display = "block";
          } else {
              ajustarTamanioWidget(consultaSalud.panel, 459, 664);
          }
      }else {
        consultaSalud.infoCapaciServici = true;
        document.getElementById("tablaIndicadores").innerHTML = "Sin información";
        document.getElementById("selectServiciosCS").options[document.getElementById("selectServiciosCS").options.length] = new Option("Sin información", 0);
      }
      if(document.getElementById("gridCS") != null){
        document.getElementById("gridCS").style.width = "98%";
        document.getElementById("gridCS").style.height = "98%";
      }
  
    hideLoader();         
  }
  function mostrarDatosPie(arrayForGrafPie, div, titulo, ofset){
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
      ){
      ready(function(){
        chartTwo = new Chart(div,{
        title: titulo,      
        titleGap: 2,
        titleFont: "normal normal normal 15pt Arial"
          });

          chartTwo.setTheme(MiamiNice)
          .addPlot("default", {
              type: Pie,
              font: "normal normal 10pt Tahoma",
              fontColor: "black",
              labelOffset: "5",
              radius: 150
          }).addSeries("Series A", arrayForGrafPie);
          var anim_a = new MoveSlice(chartTwo, "default");
          var anim_b = new Highlight(chartTwo, "default");
          var anim_c = new Tooltip(chartTwo, "default");
          //var mag1 = new dojox.charting.action2d.MoveSlice(chartTwo,"default");
          chartTwo.render();
          //var legendTwo = new Legend({chart: chartTwo}, "legendTwo");
          consultaSalud.chartPie = chartTwo;
        });
      });    
  }
  function mostrarLeyendaCS(tituloLeyenda, propiedadesLeyenda){
    consultaSalud.panelManager = PanelManager();
    consultaSalud.widgetManager = WidgetManager();
    def = new Deferred();
    wm = WidgetManager.getInstance();
    LeyendaSocioeconomicaWidget = wm.getWidgetById('widgets_LeyendaSocioeconomica_1');
    consultaSalud.leyenda = LeyendaSocioeconomicaWidget;
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
    } 
  }
  function graficasPoblacionCS(featureSet) {
    var fields = featureSet.fields;
    consultaSalud.campoCargarGrafica = fields[0].name;
    featuresResultPoblacion = featureSet.features;
    map.graphics.clear();
    consultaSalud.graficasCargadas = [];
    for (var i in featuresResultPoblacion) {
        var graphic = featuresResultPoblacion[i];
        var symbol = simbologiaFeaturesCS(graphic);
        graphic.setSymbol(symbol);
        consultaSalud.graficasCargadas[i] = {};
        consultaSalud.graficasCargadas[i][fields[0].name] = featuresResultPoblacion[i].attributes[fields[0].name];
        consultaSalud.graficasCargadas[i]["grafica"] = graphic;
        consultaSalud.graficasCargadas[i]["symbol"] = symbol;
    }
  }     
  function simbologiaFeaturesCS(feature) {
    var leyendasPoblacion;
    var totalPobMunicipio;
    var simbolo;
    if(consultaSalud.indicadores != undefined){
      if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[0].name){
          leyendasPoblacion = consultaSalud.leyendaCobertAfiliacion;
          totalPobMunicipio = feature.attributes.COBERTURATOTAL;
      } else if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[1].name || consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[2].name){    
          leyendasPoblacion = consultaSalud.leyendaCobertAfiliacion;
          totalPobMunicipio = feature.attributes.PORCENTAJE;      
      }else if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[3].name){
        leyendasPoblacion = consultaSalud.leyendaCobertAfiliacion;
        totalPobMunicipio = feature.attributes.NUMEROCASOS;
      }else if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[4].name || consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[5].name){
        leyendasPoblacion = consultaSalud.leyendaCobertAfiliacion;
        totalPobMunicipio = feature.attributes[consultaSalud.campoIndicadores];
      }
    }
    for (var i in leyendasPoblacion) {
        var leyenda = leyendasPoblacion[i];
        if (totalPobMunicipio >= leyenda.minimo && totalPobMunicipio <= leyenda.maximo) {
          simbolo = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, Color("rgb(" + leyenda.colorLine + ")"), 2),
            Color("rgb(" + leyenda.colorFondo + ")"));
            if(simbolo.color.r == 255 && simbolo.color.g == 255 && simbolo.color.b == 255){
              simbolo.color.r = leyenda.colorFondo.split(",")[0];
              simbolo.color.g = leyenda.colorFondo.split(",")[1];
              simbolo.color.b = leyenda.colorFondo.split(",")[2];
              simbolo.color.a = leyenda.colorFondo.split(",")[3];
              
              simbolo.outline.color.r = leyenda.colorFondo.split(",")[0];
              simbolo.outline.color.g = leyenda.colorFondo.split(",")[1];
              simbolo.outline.color.b = leyenda.colorFondo.split(",")[2];
              simbolo.outline.color.a = 1;
            }
            return simbolo;
            break;
        }
    }
  }
  function resaltarGraficaMunicipiosCS(feature){
    var grafica, graficaCargada = true, r, g, b, width, extent;
    var campoCargarGrafica = consultaSalud.campoCargarGrafica;
    map.graphics.clear();
    var polygonSymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID, 
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_DOT, 
        new Color([151, 249, 0, 0.8]),
        3
      ), 
      new Color([151, 249, 0, 0.45])
    );
    if(feature.symbol == undefined){
      feature.symbol = polygonSymbol;
    }
    for(var i in consultaSalud.graficasCargadas){
        if(consultaSalud.graficasCargadas[i][campoCargarGrafica] == feature.attributes.NOMBRE){
            grafica = consultaSalud.graficasCargadas[i].grafica;
            //r =  grafica.symbol.outline.color.r;
            grafica.symbol.outline.color.r = 14;
            //g = grafica.symbol.outline.color.g;
            grafica.symbol.outline.color.g = 109;
            //b = grafica.symbol.outline.color.b;
            grafica.symbol.outline.color.b = 37;
            //width = grafica.symbol.outline.width;
            grafica.symbol.outline.width = 3;   
            graficaCargada = false;           
            extent = consultaSalud.graficasCargadas[i].grafica.geometry.getExtent();          
        }
        
        if(graficaCargada){
            map.graphics.add(consultaSalud.graficasCargadas[i].grafica);
        }else{
            graficaCargada = true;
            
        }
    }
    map.graphics.add(grafica);     
  }
  function dibujarGraficaBarrasCS(div, titulo, labelSerieX, valoresSeries, titleX, titleY) {
    require(["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines",
        "dojo/fx/easing", "dojox/charting/plot2d/ClusteredColumns", "dojox/charting/plot2d/MarkersOnly", "dojox/charting/action2d/Tooltip",
        "dojox/charting/widget/Legend", "dojox/charting/Chart2D", "dojox/charting/themes/Wetland", "dojox/charting/action2d/Highlight",
        "dojo/ready"],
        function (Chart, Default, Lines, easing, ClusteredColumns, MarkersOnly, Tooltip, Legend, Chart2D, Wetland, Highlight,        
          ready) {
            ready(function () {            
              
                var legendTwo, valorMin = valoresSeries[0].dato, valorMax = valoresSeries[0].dato;
                if (consultaSalud.graficaResultados != undefined) {
                    consultaSalud.graficaResultados.destroy();
                    consultaSalud.graficaResultados = undefined;
                }
                
                var graficaConsulta = new dojox.charting.Chart2D(div,{
                  title: titulo,
                  titlePos: "top",
                  titleGap: 15,
                  titleFont: "center normal bold 11pt Arial",
                  titleOrientation: "away"
                });
                graficaConsulta.addPlot("default", {
                    type: "Columns",
                    //tension: 3,
                    markers: true,
                    gap: 1,
                    
                  // stroke: {
                      ///color: "blue",
                    // width: 20
                // }
                });
                graficaConsulta.addAxis("x", {
                  includeZero: false,
                    labels: labelSerieX,
                    rotation: 85,
                    fixLower: "minor",
                    //fixUpper: "minor",
                    title: titleX,
                    titleOrientation: "away"
                  // min: 0,
                    //max: (consultaSalud.lists.length + 1)
                });
                
                graficaConsulta.setTheme(dojox.charting.themes.Wetland);
              
                for(var i in valoresSeries){
                  var a = parseInt(i) + 1, dato;
                  if(valoresSeries[i].dato == 0){
                    dato = 0.00000001;
                  }else{
                    dato = valoresSeries[i].dato;
                  }
                  graficaConsulta.addSeries(valoresSeries[i].nombre, [{
                      y: dato,
                      x: a,
                      tooltip: valoresSeries[i].dato,
                      text: valoresSeries[i].dato,
                      stroke: {
                          color: "blue",
                          width: 2
                      },
                      fill: "lightblue"
                  }, ]);              
                  if(valorMin > valoresSeries[i].dato){
                    valorMin = valoresSeries[i].dato;
                  }
                  if(valorMax < valoresSeries[i].dato){
                    valorMax = valoresSeries[i].dato;
                  }
                }
                if((valorMin -= 10) < 0){
                  valorMin = 0;
                }
                  //valorMin -= 10;
                  valorMax += 1;
              
                
                graficaConsulta.addAxis("y", {
                  vertical: true,
                  fixLower: "major",
                  //fixUpper: "major",
                  min: valorMin,
                  max: valorMax,
                  title: titleY
                });

                var a1 = new dojox.charting.action2d.Tooltip(graficaConsulta, "default");
                var a2 = new dojox.charting.action2d.Highlight(graficaConsulta, "default");
              
                graficaConsulta.render();
                consultaSalud.graficaResultados = graficaConsulta;                               
                                                                
            });
        });
  }
  function realizarQuery(url) { 
      showLoader();   
      var layersRequest = esriRequest({
        url: url,
        content: { f: "json" },
        handleAs: "json",
        callbackParamName: "callback"
      });
      layersRequest.then(
          function (response) {
            respuestaQuery(response, url);
          }, function (error) {           
            disabledForm(false);
            console.log("Error: => ", error.message);          
            createDialogInformacionGeneral("<B> Info </B>", "Error al cargar el servicio, vuelva a cargar el servicio");                 
          });      
  }
  function mostrarResultadosEnTablaGeneral(result, divTabla, withMaximo, ocultarTabla) {//result es el array q contiene los datos a mostrar          
        if (result.features.length <= 0) {          
            createDialogInformacionGeneral("<B> Info </B>", "La selección no contiene resultados");        
            disabledForm(false);
        } else {                     
            require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                function (lang, DataGrid, ItemFileWriteStore, dom) {                            
                  if (consultaSalud.tablaResultados == undefined) {
                    //////organiza datos para cargarlo en data_list                                             
                    consultaSalud.resultQuery = result.features;
                    var data_list = [];
                    var data = {
                        identifier: "id",
                        items: []
                    };                    
                    var layout = [], fields = [];
                    layout[0] = [];
                    consultaSalud.lists = [];
                    for (var i = 0; i < result.fields.length; i++) {
                        fields[i] = result.fields[i].name;                        
                    }
                    for (var i in result.features) {                                                     
                      data_list[i] = {};                          
                      for(var a in fields){
                        data_list[i][fields[a]] = result.features[i].attributes[fields[a]];
                      }                            
                    }
                    var width = 0, c = 0;
                    for(var a in fields){
                      layout[0][a] = {};
                      layout[0][a].name = fields[a];
                      layout[0][a].field = fields[a];
                      layout[0][a].width = fields[a].length;
                      for(var c in data_list){
                        if(data_list[c][fields[a]] == null){
                          data_list[c][fields[a]] = 0;
                        }
                        if(data_list[c][fields[a]].toString().length > withMaximo || layout[0][a].width > withMaximo){
                          layout[0][a].width = withMaximo;                         
                        }else if(layout[0][a].width < data_list[c][fields[a]].toString().length){
                          layout[0][a].width = data_list[c][fields[a]].toString().length;
                        }
                    }          
                    }               
                    consultaSalud.contadorListas = 0;             
                    consultaSalud.lists = data_list;                    
                    var features = result.features;                                                                                                                                         
                    consultaSalud.jsonConvertido = JSON.stringify(data_list);
                    var rows = data_list.length;
                    for (var i = 0, l = data_list.length; i < rows; i++) {
                        data.items.push(lang.mixin({ id: i + 1 }, data_list[i % l]));
                    }
                    var store = new ItemFileWriteStore({ data: data });
                    /*create a new grid*/
                    var grid = new DataGrid({
                        id: 'gridCS',
                        store: store,
                        structure: layout,
                        rowSelector: '5px',
                        selectionMode: 'single',
                        width: "100%",
                        canSort: function (col) {
                            return false;
                        }
                    });
                    consultaSalud.tablaResultados = grid;                    
                    /*append the new grid to the div*/
                    grid.placeAt(divTabla);

                    /*Call startup() to render the grid*/
                    grid.startup();
                    grid.set('autoHeight', false);                 
                    grid.set('autoWidth', true);
                    grid.update();
                    var leyenda = dijit.byId("leyendaGraficaConsulta");                 
                    grid.on("RowClick", function (evt) {
                        selectedRowGridCS(evt);
                    }, true);                      
                  }
                  if(ocultarTabla){
                    document.getElementById("tablaIndicadores").style.display = "none";
                  }                
                  document.getElementById("gridCS").style.borderRadius = "10px";
                    //disabledForm(false);  
                  if (document.getElementById("gridCS") != null) {
                      document.getElementById("gridCS").style.width = "98%";
                      document.getElementById("gridCS").style.height = "98%";
                  }
                });
            ///////
        }      
  }
  function cerrarWidgetLeyendaCS() {
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
  function selectedRowGridCS(seleccionado) {
    showLoader();
    if(consultaSalud.indicadores != undefined){
      //if(consultaSalud.indicadorSeleccionado == consultaSalud.indicadores[0].name){      
        var feature = consultaSalud.featureSet.features[seleccionado.rowIndex.valueOf()];
        graficasPoblacionCS(consultaSalud.featureSet);
        resaltarGraficaMunicipiosCS(feature);
        map.setExtent(feature.geometry.getExtent());      
      //}
    }
    hideLoader();
  }    

return clazz;
});
  function imagenClickCS(){
    if(consultaSalud.imagenCArgada){
      document.getElementById("divtTablaCS").style.display = "block";
      document.getElementById("widgetCS").style.display = "none";
      document.getElementById("form2CS").style.display = "none";
      document.getElementById("btnCapaciadInstCS").style.display = "none";
      document.getElementById("btnServiciosCS").style.display = "none";
      document.getElementById("imgExpan").style.display = "none";
      document.getElementById("form5CS").style.display = "none";
      document.getElementById("btnsCS").style.display = "flex";
      consultaSalud.imagenCArgada = false;
      subirImagenCS(consultaSalud.urlImagen, "imgCS");
      ajustarTamanioWidget(consultaSalud.panel, 420, 217);
    }else{
      ajustarTamanioWidget(consultaSalud.panel, 500, 400);
      document.getElementById("imgExpan").style.display = "block";     
      document.getElementById("divtTablaCS").style.display = "none";
      document.getElementById("btnsCS").style.display = "none";
      document.getElementById("widgetCS").style.display = "none";         
      var div = "imgExpan", height = "auto", width = "100%";
      var urlImagen = consultaSalud.urlImagen;
      subirImagenCS(urlImagen, div, width, height);   
      consultaSalud.imagenCArgada = true;
      consultaSalud.ocultarDivs = true;
    }
    consultaSalud.ocultarDivs = !consultaSalud.ocultarDivs;
  }
  function subirImagenCS(urlImagen, div, width, height){  
    if(document.getElementById('idCS') != null){
      a = document.getElementById('idCS');
      a.parentNode.removeChild(a);      
    }
    var imageParent = document.getElementById(div);  
    imageParent.style.width = "100%";
    imageParent.style.height = "19px";
    var image = document.createElement("img");        
    image.id = "idCS";
    image.src = urlImagen;            // image.src = "IMAGE URL/PATH"
    image.style.width = width;
    image.style.height = height;
    image.style.border = "3px solid #73ad21";
    image.style.padding = "1px";
    image.alt = "Imagen no habilitada";  
    image.onclick = "imagenClickCS()";
    imageParent.appendChild(image);  
    consultaSalud.imagenCargada = imageParent;
  }
  function ExportarCS() {
    //ResultadosJson
    var ReportTitle = "Resultados";
    var ShowLabel = true;
    var ResultadosJson = consultaSalud.jsonConvertido;
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
    