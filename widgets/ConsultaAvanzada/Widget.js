var consultaAvanzada = {};
define(["dojo/dom", 'dojo/on', 'dojo/_base/declare', 'dojo/_base/lang', 'jimu/BaseWidget', 'dojo/_base/html', "esri/toolbars/draw",
  "esri/geometry/webMercatorUtils", "esri/map", "dojo/query", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/toolbars/draw", "dijit/registry", "dojo/parser", "esri/graphic", "esri/tasks/GeometryService",
  "esri/tasks/BufferParameters", "esri/geometry/Point", "esri/SpatialReference", "esri/geometry/normalizeUtils", "esri/renderers/SimpleRenderer", "dojo/_base/array",
  "esri/layers/FeatureLayer", "esri/tasks/query", "esri/renderers/jsonUtils", "esri/request", "dojo/_base/json", "esri/InfoTemplate", "esri/geometry/Extent",
  "esri/tasks/GeometryService", "esri/tasks/ProjectParameters", "jimu/PanelManager", "dojo/dom-class", "esri/dijit/Popup", "dojo/dom-construct", "esri/tasks/QueryTask",
  "dijit/Calendar", "dojo/date", "dojo/Deferred", "dojo/date/locale", "dojo/_base/event", "esri/dijit/FeatureTable", "jimu/WidgetManager",
  "esri/symbols/Font", "esri/symbols/TextSymbol", "esri/geometry/Polyline",
  "dojo/domReady!"
],
  function(dom, on, declare, lang, BaseWidget, html, Draw, webMercatorUtils, Map, query, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
    Color, Draw, registry, parser, Graphic, GeometryService, BufferParameters, Point, SpatialReference, normalizeUtils,
    SimpleRenderer, array, FeatureLayer, Query, jsonUtil, esriRequest,  dojoJson, InfoTemplate, Extent, GeometryService, ProjectParameters,
    PanelManager, domClass, Popup, domConstruct, QueryTask, Calendar, date, Deferred, locale, event, FeatureTable, WidgetManager,Font, TextSymbol,
    Polyline
  ) {
   

        var clazz = declare([BaseWidget], {
        name: 'ConsultaAvanzada',

        postCreate: function() {         
         },

        startup: function() {     
          
          
            $('#widgets_ConsultaAvanzada_Widget_36_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza consulta avanzada con par&aacute;metros de entrada"></div>');

            query("#selectServiciosCA").on("click", function (evt) {            
                var seleccion = this.options[this.selectedIndex].text;
                if (seleccion != "Seleccione..." && seleccion != consultaAvanzada.servicioSeleccionado) {
                    consultaAvanzada.servicioSeleccionado = seleccion;
                    map.graphics.clear();
                    consultaAvanzada.gruposCargados = undefined;
                    consultaAvanzada.resultQuery = undefined;                          
                    consultaAvanzada.capaSeleccionada = undefined;
                    consultaAvanzada.grupoSeleccionado = undefined;
                    consultaAvanzada.campoSeleccionado = undefined;
                    var urlServicio;
                    var servicios = consultaAvanzada.servicios.urlServicios;
                    for(var i in servicios){
                        if(seleccion == servicios[i].nombreMostrar){
                            urlServicio = servicios[i].url;
                            consultaAvanzada.urlServicio = urlServicio;
                            break;
                        }
                    }
                    realizarQuery(urlServicio);                
                    document.getElementById("selectCapasCA").length = 0;
                    document.getElementById("selectCamposCA").length = 0;
                    document.getElementById("selectValoresCA").length = 0;
                    document.getElementById("textCondicionBusquedaCA").value = "";
                }
            });
            query("#selectGruposCA").on("click", function (evt) { 
                map.graphics.clear(); 
                consultaAvanzada.resultQuery = undefined;          
                var seleccion = this.options[this.selectedIndex].text;
                if (seleccion != "Seleccione ..." && seleccion != consultaAvanzada.grupoSeleccionado) {                
                    //disabledForm(true);  consultaAvanzada.disabledForm = true;
                    consultaAvanzada.grupoSeleccionado = seleccion;              
                    var urlServicios = consultaAvanzada.servicios.urlServicios;
                    var capas = [], n = 0;
                    consultaAvanzada.capas = [];
                    for(var i in urlServicios){
                        if(urlServicios[i].nombreMostrar == consultaAvanzada.servicioSeleccionado){
                            var grupos = consultaAvanzada.servicios.urlServicios[i].grupos;
                            for(var a in grupos){
                                if(grupos[a].nameCrud == consultaAvanzada.grupoSeleccionado){
                                    var subLayerIds = consultaAvanzada.servicios.urlServicios[i].grupos[a].subLayerIds;
                                    var layers = consultaAvanzada.results.layers;                        
                                    for(var e in subLayerIds){
                                        for(var u in layers){
                                            if(subLayerIds[e] == layers[u].id){
                                                consultaAvanzada.capas[n] = {};
                                                consultaAvanzada.capas[n] = layers[u];
                                                n++;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    var datos = consultaAvanzada.capas;
                    var contenedor = "selectCapasCA";
                    cargarDatos(contenedor, datos);
                    $('#selectCapasCA').prop('disabled', false);
                    //cargarCapas(consultaAvanzada.capas);
                    document.getElementById("selectCamposCA").length = 0;
                    document.getElementById("selectValoresCA").length = 0;
                    document.getElementById("textCondicionBusquedaCA").value = "";
                    consultaAvanzada.campoSeleccionado = undefined;
                }
            });
            query("#selectCapasCA").on("click", function (evt) {
                map.graphics.clear();
                consultaAvanzada.resultQuery = undefined;
                var seleccion = parseInt(this.options[this.selectedIndex].value);
                if (seleccion != 777777 && seleccion != consultaAvanzada.capaSeleccionada) {
                    consultaAvanzada.confirmarCampoSeleccionado = undefined;
                    var existeCapa = true;
                    document.getElementById("selectValoresCA").length = 0;                
                    disabledForm(true);  consultaAvanzada.disabledForm = true;                                
                    consultaAvanzada.capaSeleccionada = seleccion;
                    for(var i in consultaAvanzada.capas){
                        if(consultaAvanzada.capas[i].id == seleccion){
                            var urlCapa = consultaAvanzada.urlServicio.concat("/"+consultaAvanzada.capas[i].id);
                            consultaAvanzada.urlCapa = urlCapa;
                            var opacity = 0.7;
                            dibujarCapa(urlCapa, opacity);                   
                            realizarQuery(urlCapa);
                            existeCapa = false;
                            break;
                        }
                    }
                    if(existeCapa){                  
                        createDialogInformacionGeneral("<B> Info </B>", "No se encontro capa seleccionada, selecciona otra");
                        existeCapa != existeCapa;
                        disabledForm(false);
                    }
                    consultaAvanzada.valoresObtenidos = undefined;
                    consultaAvanzada.campoSeleccionado = undefined;
                    document.getElementById("selectValoresCA").length = 0;
                    document.getElementById("textCondicionBusquedaCA").value = "";                
                }
            });
            query("#selectCamposCA").on("click", function (evt) {
                consultaAvanzada.resultQuery = undefined;
                var seleccion = this.options[this.selectedIndex].text.split(' ');
                if (seleccion[0] != "") {  
                    map.graphics.clear();                                                                    
                    consultaAvanzada.campoSeleccionado = seleccion[0];
                    document.getElementById("textCondicionBusquedaCA").value += " " + seleccion[0];                
                    consultaAvanzada.valoresObtenidos = undefined;
                    document.getElementById("selectValoresCA").length = 0;                  
                }
            });
              
            query("#btnObtenerValoresCA").on("click", function (evt) {                                       
                var campos = consultaAvanzada.campoSeleccionado;                
                var confirmarCampoSeleccionado = consultaAvanzada.confirmarCampoSeleccionado;
                if(campos != undefined){
                  if(campos != confirmarCampoSeleccionado){
                    var where = "1=1", geometry = false;
                    consultaAvanzada.confirmarCampoSeleccionado = campos;
                    var url = consultaAvanzada.urlCapa;            
                    disabledForm(true);  consultaAvanzada.disabledForm = true;            
                    realizarConsulta(campos, url, geometry, where);                        
                    consultaAvanzada.valorSeleccionado = undefined;                    
                    }else{
                        cargarDatosOrdenados(consultaAvanzada.datosOrdenados);
                    }                        
                } else {
                    createDialogInformacionGeneral("Nota", "Primero se debe seleccionar campos");
        }
            });
          query("#selectValoresCA").on("click", function (evt) {
            consultaAvanzada.resultQuery = undefined;
            var data;
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "" ) {                                          
              var textConsulta = consultaAvanzada.textConsulta;
              if(textConsulta == undefined){                
                createDialogInformacionGeneral("<B> Info </B>", "Recuerda, primero debes seleccionar el comporador lógico");
              }else if(consultaAvanzada.typeValores == "esriFieldTypeInteger" ||
              consultaAvanzada.typeValores == "esriFieldTypeDouble" ){
                  seleccion = parseFloat(seleccion);
                  data = textConsulta.concat(" "+ seleccion );
                }else{
                data = textConsulta.concat(" "+"'"+seleccion+"'");                
              }
              consultaAvanzada.valorSeleccionado = seleccion;
              document.getElementById("textCondicionBusquedaCA").value = data;
              consultaAvanzada.where = data;
            }
          });
          query("#btnLimpiarCAv").on("click", function (evt) {
              var selects = ["selectGruposCA", "selectCapasCA", "selectCamposCA", "selectValoresCA", "textCondicionBusquedaCA"];
              cargarDatos("selectServiciosCA", consultaAvanzada.serviciosCAv);
              for (var i in selects) {
                  limpiarContenedor(selects[i], true)
              }
              consultaAvanzada.servicioSeleccionado = undefined;
          });
          query("#btnEjecutarConsultaCA").on("click", function (evt) {
            if(consultaAvanzada.where != undefined && consultaAvanzada.urlCapa != undefined){
              if(consultaAvanzada.resultQuery == undefined){
                map.graphics.clear();
                disabledForm(true);  consultaAvanzada.disabledForm = true;
                var where = consultaAvanzada.where;
                var campos = "*", geometry = true;
                var url = consultaAvanzada.urlCapa;
                if (consultaAvanzada.tablaResultados != undefined) {
                  destruirTablaResultados();              
                  }            
                realizarConsulta(campos, url, geometry, where);
                
              } else {
                  document.getElementById("botonesCA").style.display = "flex";
                  document.getElementById("divFormularioCA").style.display = "none";                  
                  document.getElementById("divGridQueryAdvancedCA").style.display = "block";                  
                  var width = consultaAvanzada.width;
                  var height = consultaAvanzada.height;          
                  ajustarTamanioWidget(consultaAvanzada.panel, width, height);
                }
              }
            });
          query("#botonRegresarCA").on("click", function (evt) {              
              document.getElementById("divGridQueryAdvancedCA").style.display = "none";
              document.getElementById("botonesCA").style.display = "none";
            document.getElementById("divFormularioCA").style.display = "block";                    
            ajustarTamanioWidget(consultaAvanzada.panel, consultaAvanzada.widthInicial, consultaAvanzada.heightInicial);           
           document.getElementById("textCondicionBusquedaCA").value = consultaAvanzada.campoSeleccionado;
              });
          query("#modeloCA").on("click", function (evt) {
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "" && seleccion != consultaAvanzada.grupoSeleccionado) {
              disabledForm(true);  consultaAvanzada.disabledForm = true;
              consultaAvanzada.grupoSeleccionado = seleccion;
            }
            });

           },

        onOpen: function() { 
          $('#selectGruposCA').prop('disabled', true);
          $('#selectCapasCA').prop('disabled', true);
          $('#selectCamposCA').prop('disabled', true);
          $('#selectValoresCA').prop('disabled', true);
          var panel = this.getPanel();          
          consultaAvanzada.panel = panel;
          var width = 355;
          var height = 475;       
          consultaAvanzada.widthInicial = width;  
          consultaAvanzada.heightInicial = height;    
          ajustarTamanioWidget(panel, width, height);
          //ocultarDivs();   
          consultaAvanzada.capaSeleccionada = null;
          consultaAvanzada.grphicsLoaded = [];   
          consultaAvanzada.campoSeleccionado = undefined;  
          consultaAvanzada.valorSeleccionado = undefined;  
          html = "";
          servicios = {
            "urlServicios": [
              {
                "url": SERVICIO_CARTOGRAFIA_BASICA,
                "nombreMostrar": "CARTOGRAFÍA BÁSICA",
                grupos:[]
              },
              {
                "url": SERVICIO_AMBIENTAL,
                "nombreMostrar": "AMBIENTAL",
                grupos:[]
              },
              {
                "url": SERVICIO_EDUCACION,
                "nombreMostrar": "EDUCACIÓN",
                grupos:[]
              },
              {
                "url": SERVICIO_SALUD,
                "nombreMostrar": "SALUD",
                grupos:[]
              },
              {
                "url": SERVICIO_CULTURA_TURISMO,
                "nombreMostrar": "CULTURA Y TURISMO",
                grupos:[]
              },
              {
                "url": SERVICIO_ORDENAMIENTO_TERRITORIAL,
                "nombreMostrar": "ORDENAMIENTO TERRITORIAL",
                grupos:[]
              },
              {
                "url": SERVICIO_INDUSTRIA_COMERCIO,
                "nombreMostrar": "INDUSTRIA Y COMERCIO",
                grupos:[]
              },
              {
                "url": SERVICIO_RIESGO_CONSULTA,
                "nombreMostrar": "GESTIÓN DEL RIESGO",
                grupos:[]
              }
            ]
            };
          consultaAvanzada.servicios = servicios;
          html += "<option value=" + 'Seleccione...' + ">" +
            'Seleccione...' + "</option>"
          var data = [];
            for (var i in servicios.urlServicios) {
              html += "<option value=" + servicios.urlServicios[i].url +
                ">" + servicios.urlServicios[i].nombreMostrar + "</option>"
              data[i] = servicios.urlServicios[i].nombreMostrar;
            }
            consultaAvanzada.serviciosCAv = data;
          document.getElementById("selectServiciosCA").innerHTML = html;    
          consultaAvanzada.disabledForm = false;     
          habilitarSlects(false, "selectServiciosCA");
          },
        onClose: function(){         
          map.graphics.clear();          
          consultaAvanzada.servicioSeleccionado = undefined;
          for(var i in consultaAvanzada.grphicsLoaded){
            map.removeLayer(consultaAvanzada.grphicsLoaded[i]);
          }          
          //ocultarDivs();
          document.getElementById("divFormularioCA").style.display = "block";
          map.setExtent(map._initialExtent);
          dojo.disconnect();
          document.getElementById("selectGruposCA").length = 0;
          document.getElementById("selectCapasCA").length = 0;
          document.getElementById("selectCamposCA").length = 0;
          document.getElementById("selectValoresCA").length = 0;
          document.getElementById("textCondicionBusquedaCA").value = "";
          document.getElementById("divGridQueryAdvancedCA").style.display = "none";
          document.getElementById("botonRegresarCA").style.display = "none";
          document.getElementById("btnExportarCA").style.display = "none";
          map.setExtent(map._initialExtent);
          }
      });
    function ajustarExtend(extent){
        var spatialRef = new SpatialReference({ wkid: extent.spatialReference.wkid });
        var spatialRef1 = new SpatialReference(3115);
        gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
        var extentconver = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, spatialRef);
        var extent2 = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, spatialRef1);
        gsvc.project([extent2], spatialRef, function (projectedPoints) {
          pt = projectedPoints[0];
          extentconver = new Extent(pt.xmin, pt.ymin, pt.xmax, pt.ymax, spatialRef);
          map.setExtent(extentconver);
          extentCapaSelecionada = extentconver;
          });
    }            
    function colocaTextoPunto(geometries, attr){    
        var labelPoint = geometries;
        var font = new Font("20px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
        if (geometries.x != undefined) {
          var textSymbol = new TextSymbol("X: " + geometries.x + ", Y: " + geometries.y, font, new Color([206, 9, 18]));
        }else{
          var textSymbol = new TextSymbol("Latitud: " + attr.Latitud + ", Longitud: " + attr.Longitud, font, new Color([206, 9, 18]));
        }    
        var labelPointGraphic = new Graphic(labelPoint, textSymbol);
        map.graphics.add(labelPointGraphic);  
      }
    function cargarValores(features){
      var seleccion = consultaAvanzada.campoSeleccionado;
      var datosOrdenados = [], existe = false;      
      for(var t in features){
        if(features[t].attributes[seleccion] != null){
          // este codigo descrimina los string repetidos        
          datosOrdenados[0] = features[t].attributes[seleccion];
      for (var i in features) {
              for (var a in datosOrdenados) {
                  if (features[i].attributes[seleccion] == datosOrdenados[a]) {
                      existe = true;
                  }
              }
              if (!existe && features[i].attributes[seleccion] != null && features[i].attributes[seleccion] != " ") {
                datosOrdenados.push(features[i].attributes[seleccion]);                
              }
              existe = false;          
          }
        // fin codigo que descrimina los string repetidos
          if (typeof(features[t].attributes[seleccion]) == "string") {            
            datosOrdenados.sort(); // ordena array de string
          } else {            
            datosOrdenados.sort(function(a, b){return a-b}); // ordena array de numeros
          }
         break; 
        }
        }        
      cargarDatosOrdenados(datosOrdenados);
      consultaAvanzada.datosOrdenados = datosOrdenados;
      
      disabledForm(false);
      }
    function cargarDatosOrdenados(datosOrdenados){
      var agregarDato = document.getElementById('selectValoresCA');
      agregarDato.length = 0;
      if(datosOrdenados.length == 0){
        agregarDato.options[agregarDato.options.length] = new Option("Campo sin datos, seleccione otro campo", 1);
      }else{
        if(consultaAvanzada.campoSeleccionado == "FECHARESOLUCION" || consultaAvanzada.campoSeleccionado == "FECHAINFRACCION"){
          convertirNumeroAfecha(datosOrdenados, agregarDato);
        }else{
      for(var i in datosOrdenados){
        agregarDato.options[agregarDato.options.length] = new Option(datosOrdenados[i], i);
      }      
        }
      }
      }
    function convertirNumeroAfecha(datosOrdenados, agregarDato){
      var fecha, fechaMostrar = [], existe = false;

      for(var i in datosOrdenados){
        fecha = new Date(datosOrdenados[i]);
        fechaMostrar = (fecha.getDate()+1) +"/"+ (fecha.getMonth()+1) +"/"+ fecha.getFullYear();
        agregarDato.options[agregarDato.options.length] = new Option(fechaMostrar, i);        
      }
      }
    function cargarCapas(capas){
      var agregarDato = document.getElementById('selectCapasCA');
      agregarDato.length = 0;      
      for (var i in capas) {
        agregarDato.options[agregarDato.options.length] = new Option(capas[i].name, capas[i].id);                
      }
      
      disabledForm(false);
     }
     function cargarCampos(fields){
      var addData = document.getElementById('selectCamposCA');
      addData.length = 0;      
      for (var i in fields) {
        if(fields[i].name != "SHAPE"){
          var type = fields[i].type.slice(13,21);
          var data = fields[i].name + " ("+type+")";
          addData.options[addData.options.length] = new Option(data, i);
        }        
      }
      
      disabledForm(false);
      consultaAvanzada.campoSeleccionado = undefined;
      }
    function cargarGrupos(datosAvisualizar) {
      var agregarDato = document.getElementById('selectGruposCA');
      agregarDato.length = 0;
      agregarDato.options[agregarDato.options.length] = new Option('Seleccione ...', 888888);
      for (var i in datosAvisualizar) {
          agregarDato.options[agregarDato.options.length] = new Option(datosAvisualizar[i].nameCrud, i + 1);
      }
      disabledForm(false);
      consultaAvanzada.capaSeleccionada = undefined;
      }
    function crearInfoTemplate(attr){
      var myInfoTemplate;
      var fields = [], datoInfo = "", title;
      for(var i in consultaAvanzada.capas){
        if(consultaAvanzada.capas[i].id == consultaAvanzada.capaSeleccionada){
          title = consultaAvanzada.capas[i].name;
          break;
        }
        }
      for(var i in consultaAvanzada.featureSet.fields){
        fields[i] = consultaAvanzada.featureSet.fields[i].name;
        }
      for(var i in fields){
        if(attr[fields[i]] != null){
          datoInfo += fields[i] + ": " + attr[fields[i]] + "<br/>";
        }
        
       }
      var myInfoTemplate = new InfoTemplate(title,datoInfo);
      return myInfoTemplate;
     }    
    
    
     return clazz;
     function dibujarFeatures(features, color) {
         console.log(features);
      var data = features, a = 0;
      var features = []; 
      for(var i in data){
        if(data[i].geometry != null){
          features[a] = data[i];
          a++;
        }        
      }
      if(features.length > 0){
          var colorFeature;
          if(color == undefined){
            colorFeature = [255, 0, 0, 1];
          }else{
            colorFeature = color;
          }
          for(var i in features){      
          if(features[i].geometry.type == "point"){
           
              //atributo = {"x": features[i].geometry.x, "y": features[i].geometry.y};
              loc = new Point(features[i].geometry.x, features[i].geometry.y, map.spatialReference);
              dibujarPunto(loc, features[i].attributes);
              if(features.length == 1){
                var newZoom = 2000;  
                map.setScale(newZoom);
                map.centerAt(loc);
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
                /////delay
                for (var c = 0; c <= 50; c++) {
                    var z = z + 1;
                }
                ////
                
            }
            if(features.length == 1){
              map.setExtent(features[0].geometry.getExtent());
            }      
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
    function dibujarCapa(capa, opacity){
      if(consultaAvanzada.grphicsLoaded.length > 0){
        map.removeLayer(consultaAvanzada.grphicsLoaded[0]);
        consultaAvanzada.grphicsLoaded.length = 0;
      }
      var capaCargada = new FeatureLayer(capa,{
        opacity : opacity
      });
      i = consultaAvanzada.grphicsLoaded.length;
      consultaAvanzada.grphicsLoaded[i] = capaCargada;   
      map.addLayer(capaCargada);
      }
    function destruirTablaResultados(){
      consultaAvanzada.tablaResultados.destroy();
      consultaAvanzada.tablaResultados = undefined;
      }
    function disabledForm(condition){
      if (condition) {
        showLoader(); 
      } else {
        hideLoader();
      }      
      var nodes = document.getElementById("divFormularioCA").getElementsByTagName('*');
      for(var i = 0; i < nodes.length; i++){
        nodes[i].disabled = condition;
        }
      }
    function monstrarConsulta(featureSet) {  
      if(featureSet.features.length > 0){    
          consultaAvanzada.featureSet = featureSet;      
          if(consultaAvanzada.valoresObtenidos == undefined){
              consultaAvanzada.valoresObtenidos = featureSet.features;
              cargarValores(featureSet.features);
              for(var i in consultaAvanzada.resultCapa.fields){
                  if(consultaAvanzada.resultCapa.fields[i].name == consultaAvanzada.campoSeleccionado){
                      consultaAvanzada.typeValores = consultaAvanzada.resultCapa.fields[i].type;
                  }
              }
          }else{
              document.getElementById("divFormularioCA").style.display = "none";
              document.getElementById("divGridQueryAdvancedCA").style.display = "block";
              if (featureSet.features.length <= 150) {
                  dibujarFeatures(featureSet.features);
                  mostrarResultadosEnTabla(featureSet);
              } else {
                  createDialogInformacionGeneral("<B> Info </B>", "El filtro seleccionado supera el límite de registros, porfavor ajustar el filtro");
                  document.getElementById("divFormularioCA").style.display = "block";
                  disabledForm(false);
              }
            
          }
        }else{          
          createDialogInformacionGeneral("<B> Info </B>", "El campo seleccionado no contiene datos");
          disabledForm(false);
          var addData = document.getElementById('selectCamposCA');
          addData.length = 0;
        }
      }
    function mostrarResultadosEnTabla(result) {//result es el array q contiene los datos a mostrar          
        if (result.features.length <= 0) {            
            createDialogInformacionGeneral("<B> Info </B>", "La selección no contiene resultados");
            disabledForm(false);
        } else {                     
            require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                function (lang, DataGrid, ItemFileWriteStore, dom) {
                  document.getElementById("divFormularioCA").style.display = "none";                    
                  document.getElementById("botonesCA").style.display = "flex";
                  document.getElementById("botonRegresarCA").style.display = "block";
                  document.getElementById("btnExportarCA").style.display = "block";
                  if (consultaAvanzada.tablaResultados == undefined) {
                    //////organiza datos para cargarlo en data_list                                           
                    consultaAvanzada.resultQuery = result.features;
                    var data_list = [];
                    var data = {
                        identifier: "id",
                        items: []
                    };                    
                    var layout = [], fields = [];
                    layout[0] = [];
                    consultaAvanzada.lists = [];
                    for (var i = 0; i < result.fields.length; i++) {
                        fields[i] = result.fields[i].name;                        
                    }
                    for (var i in result.features) {                                                     
                      data_list[i] = {};                          
                      for(var a in fields){
                        data_list[i][fields[a]] = result.features[i].attributes[fields[a]];
                      }                            
                    }
                    var width = 0;
                    for(var a in fields){
                      layout[0][a] = {};
                      layout[0][a].name = fields[a];
                      layout[0][a].field = fields[a];
                      layout[0][a].width = fields[a].length;
                      width += layout[0][a].width;
                    } 
                    width *= 10.8;     
                    if(width > 450){
                        width = 450;
                    }
                    var height = 290;          
                    if(data_list.length < 10){
                      height = 275;
                    }
                    consultaAvanzada.width = width;
                    consultaAvanzada.height = height;
                    ajustarTamanioWidget(consultaAvanzada.panel, width, height);            
                    consultaAvanzada.lists = data_list;                    
                    var features = result.features;                                                                                                                                         
                    consultaAvanzada.jsonConvertido = JSON.stringify(data_list);
                    var rows = data_list.length;
                    for (var i = 0, l = data_list.length; i < rows; i++) {
                        data.items.push(lang.mixin({ id: i + 1 }, data_list[i % l]));
                    }
                    var store = new ItemFileWriteStore({ data: data });
                    /*create a new grid*/
                    var grid = new DataGrid({
                        id: 'gridConsultaAvanzada',
                        store: store,
                        structure: layout,
                        rowSelector: '10px',
                        selectionMode: 'single',
                        canSort: function (col) {
                            return false;
                        }
                    });
                    consultaAvanzada.tablaResultados = grid;                    
                    /*append the new grid to the div*/
                    grid.placeAt("divGridQueryAdvancedCA");

                    /*Call startup() to render the grid*/
                    grid.startup();
                    grid.set('autoHeight', false);
                    grid.set('autoWidth', false);
                    grid.set('autoWidth', true);
                    grid.update();
                    var leyenda = dijit.byId("leyendaGraficaConsulta");                 
                    grid.on("RowClick", function (evt) {
                        selectedRowGrid(evt);
                    }, true);                      
                  }
                  disabledForm(false); 
                  document.getElementById("widgets_ConsultaAvanzada_Widget_36").style.width = "100%";
                  document.getElementById("widgets_ConsultaAvanzada_Widget_36").style.height = "90%";
                  //document.getElementById("divtTablaCA").style.width = "100%";
                  //document.getElementById("divtTablaCA").style.height = "90%";                  
                  document.getElementById("divGridQueryAdvancedCA").style.height = "12em"; 
                  document.getElementById("botonesCA").style.display = "flex"; 
                  document.getElementById("gridConsultaAvanzada").style.height = '"' + data_list.length * 58 + 'px"';
                  document.getElementById("gridConsultaAvanzada").style.border = "groove";
                  document.getElementById("gridConsultaAvanzada").style.borderRadius = "5px";
                  //document.getElementById("gridConsultaAvanzada").style.overflow = "auto";
                });
            ///////            
        }
       
        
      }  

    function realizarConsulta(campos, url, geometry, where) {
        var queryTask = new QueryTask(url);
        var parametros = new Query();
        parametros.outFields = [campos];
        parametros.where = where;
        parametros.returnGeometry = geometry;
        parametros.outSpatialReference = map.spatialReference;
        queryTask.execute(parametros, monstrarConsulta, function (error) {
            console.log(error);            
            createDialogInformacionGeneral("<B> Info </B>", "No se logró compvarar la operación");       
            disabledForm(false);
        });
      }
    function realizarQuery(url) {
      disabledForm(true);  consultaAvanzada.disabledForm = true;
      var layersRequest = esriRequest({
        url: url,
        content: { f: "json" },
        handleAs: "json",
        callbackParamName: "callback"
      });
      layersRequest.then(
          function (response) {
            seeResultsQuery(response, url);
          }, function (error) {           
            disabledForm(false);
            console.log("Error: => ", error.message);            
            createDialogInformacionGeneral("<B> Info </B>", "Error al cargar el servicio, vuelva a cargar el servicio");             
          });      
      }

    function seeResultsQuery(result, url) {     
      if (result.extent != null) {
        ajustarExtend(result.extent);        
      }
      if(consultaAvanzada.capaSeleccionada != undefined){
        consultaAvanzada.resultCapa = result;        
        cargarCampos(result.fields);
      }else{
        consultaAvanzada.results = result;
        var datosAvisualizar;
        var idServiciosUrlServicios;
        var contadorGrupos = 0;
        for(var i in consultaAvanzada.servicios.urlServicios){
          if(consultaAvanzada.servicios.urlServicios[i].nombreMostrar == consultaAvanzada.servicioSeleccionado){
            idServiciosUrlServicios = i;
            break;
          }
        }
        for(var i in result.layers){
          if(result.layers[i].subLayerIds != null){
            consultaAvanzada.servicios.urlServicios[idServiciosUrlServicios].grupos[contadorGrupos] = {};
            consultaAvanzada.servicios.urlServicios[idServiciosUrlServicios].grupos[contadorGrupos].nameCrud = result.layers[i].name;
            consultaAvanzada.servicios.urlServicios[idServiciosUrlServicios].grupos[contadorGrupos].subLayerIds = result.layers[i].subLayerIds;
            contadorGrupos++;
            datosAvisualizar = consultaAvanzada.servicios.urlServicios[idServiciosUrlServicios].grupos;
            consultaAvanzada.gruposCargados = datosAvisualizar;
          }
        }
        if(contadorGrupos == 0){
          capas = [];
          for(var i in result.layers){
            capas[i] = {};
            capas[i].name = result.layers[i].name;
            capas[i].id = result.layers[i].id;
          }
          cargarCapas(capas);
          consultaAvanzada.capas = capas;
          if(consultaAvanzada.gruposCargados == undefined){
            var mySelect = document.getElementById("selectGruposCA");
            mySelect.length = 0;
            mySelect.options[mySelect.options.length] = new Option("Seleccione...", 0)
            $("#selectGruposCA").prop('disabled',true)
          }
        }else{
          cargarGrupos(datosAvisualizar);     
          $("#selectGruposCA").prop('disabled',false)
        }        
      }
      if (consultaAvanzada.servicioSeleccionado == "EDUCACIÓN") {
          habilitarSlects(true, "selectGruposCA");
      }
      }
    function selectedRowGrid(seleccionado) {
      var data = consultaAvanzada.resultQuery, a = 0;
      var features = []; 
      for(var i in data){
        if(data[i].geometry != null){
          features[a] = data[i];
          a++;
        }        
      }
      if(features.length > 0){
        var colorFeature = [51, 255, 227, 1];
        var rowSelected = dijit.byId('gridConsultaAvanzada').selection.getSelected()[0].OBJECTID[0];
        for(var i in features){
          if(features[i].attributes.OBJECTID == rowSelected){
          dibujarFeatures([features[i]], colorFeature);
          break;
          }
        }         
     }else{
      createDialogInformacionGeneral("<B> Info </B>", "Este registro no contiene geometría valida");
     }
    }
});
    function obtenerBotonesConsulta(texto) {  
      var textConsulta = document.getElementById("textCondicionBusquedaCA");
      if (texto == "LIKE") {
        textConsulta.value += " " + texto;
      } else if (texto == "AND") {
        textConsulta.value += " " + texto;
      } else if (texto == "OR") {
        textConsulta.value += " " + texto;
      } else if (texto == "NOT") {
        textConsulta.value += " " + texto;
      } else if (texto == "IS") {
        textConsulta.value += " " + texto;
      } else if (texto == "NULL") {
        textConsulta.value += " " + texto;
      } else if (texto == "=") {
        textConsulta.value += " " + texto;
      } else if (texto == "<>") {
        textConsulta.value += " " + texto;
      } else if (texto == ">") {
        textConsulta.value += " " + texto;
      } else if (texto == "<") {
        textConsulta.value += " " + texto;
      } else if (texto == ">=") {
        textConsulta.value += " " + texto;
      } else if (texto == "<=") {
        textConsulta.value += " " + texto;
      }
      consultaAvanzada.textConsulta = textConsulta.value;
     }

    function Exportar() {  
      //ResultadosJson
      var ReportTitle = "Resultados";
      var ShowLabel = true;
      var ResultadosJson = consultaAvanzada.jsonConvertido;
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

    function borrarTextAreaConsulta() {      
      var textConsulta = document.getElementById("textCondicionBusquedaCA");
      textConsulta.value = "";
     }
    








 










