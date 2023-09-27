var consultaCulturaTurismo = {};
define(["dojo/dom", 'dojo/on', 'dojo/_base/declare', 'dojo/_base/lang', 'jimu/BaseWidget', 'dojo/_base/html', "esri/toolbars/draw",
  "esri/geometry/webMercatorUtils", "esri/map", "dojo/query", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/toolbars/draw", "dijit/registry", "dojo/parser", "esri/graphic", "esri/tasks/GeometryService",
  "esri/tasks/BufferParameters", "esri/geometry/Point", "esri/SpatialReference", "esri/geometry/normalizeUtils", "esri/renderers/SimpleRenderer", "dojo/_base/array",
  "esri/layers/FeatureLayer", "esri/tasks/query", "esri/renderers/jsonUtils", "esri/request", "dojo/_base/json", "esri/InfoTemplate", "esri/geometry/Extent",
  "esri/tasks/GeometryService", "esri/tasks/ProjectParameters", "jimu/PanelManager", "dojo/dom-class", "esri/dijit/Popup", "dojo/dom-construct", "esri/tasks/QueryTask",
  "dijit/Calendar", "dojo/date", "dojo/Deferred", "dojo/date/locale", "dojo/_base/event", "esri/dijit/FeatureTable", "jimu/WidgetManager",
  "esri/symbols/Font", "esri/symbols/TextSymbol",
  "dojo/domReady!"
],
  function(dom, on, declare, lang, BaseWidget, html, Draw, webMercatorUtils, Map, query, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
    Color, Draw, registry, parser, Graphic, GeometryService, BufferParameters, Point, SpatialReference, normalizeUtils,
    SimpleRenderer, array, FeatureLayer, Query, jsonUtil, esriRequest,  dojoJson, InfoTemplate, Extent, GeometryService, ProjectParameters,
    PanelManager, domClass, Popup, domConstruct, QueryTask, Calendar, date, Deferred, locale, event, FeatureTable, WidgetManager,Font, TextSymbol
  ) {
   

        var clazz = declare([BaseWidget], {
        name: 'consultaCulturaTurismo',

        postCreate: function() {      
         },

        startup: function() {     
          
          $('#widgets_ConsultaCulturaTurismo_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Realiza consulta de las tem&aacute;ticas de cultura y turismo"></div>');

          query("#selectTematicaConsultaCT").on("click", function (evt) {            
            var seleccion = this.options[this.selectedIndex].value;
            if (seleccion != 777777 && seleccion != consultaCulturaTurismo.tematicaSeleccionada) {
                consultaCulturaTurismo.tematicaSeleccionada = seleccion;
                map.graphics.clear();                
                consultaCulturaTurismo.resultQuery = undefined;                          
                consultaCulturaTurismo.categoriaSeleccionada = undefined;
                consultaCulturaTurismo.subCategoriaSeleccionada = undefined;
                var urlServicio = consultaCulturaTurismo.urlServicio;
                var tematicas = consultaCulturaTurismo.tematicas;
                for(var i in tematicas){
                  if(seleccion == tematicas[i].id){
                    var urlCapa = urlServicio + "/"+ tematicas[i].id;
                    consultaCulturaTurismo.urlCapa = urlCapa;
                    break;
                  }
                }                
                limpiarContenedor("selectCategoriaConsultaCT");
                limpiarContenedor("selectSubcategoriaConsultaCT"); $('#selectSubcategoriaConsultaCT').prop('disabled', true);
                limpiarContenedor("selectMunicipioConsultaCT"); $('#selectMunicipioConsultaCT').prop('disabled', true);
                limpiarContenedor("selectNombreConsultaCT"); $('#selectNombreConsultaCT').prop('disabled', true);                
                $('#btnEjecutarConsultaCT').prop('disabled', true);
                $('#btnResultadosConsultaCT').prop('disabled', true);
                realizarQuery(urlCapa);
                consultaCulturaTurismo.camposCargados = false;
                document.getElementById("btnResultadosConsultaCT").style.display = "none";
                consultaCulturaTurismo.ejecutarBusqueda = true;
            }
          });              
          query("#selectCategoriaConsultaCT").on("click", function (evt) {
            //console.log(52521);
            consultaCulturaTurismo.resultQuery = undefined;
            var seleccion = this.options[this.selectedIndex].value;
            if (seleccion != 777777 && seleccion != consultaCulturaTurismo.categoriaSeleccionada) {
              showLoader();
              map.setExtent(map._initialExtent);                            
              limpiarContenedor("selectSubcategoriaConsultaCT");
              limpiarContenedor("selectMunicipioConsultaCT");
              map.graphics.clear();                                                                    
              consultaCulturaTurismo.categoriaSeleccionada = seleccion;
              document.getElementById("form4CCT").style.display = "none";
              document.getElementById("form3CCT").style.display = "none";

              var urlCategoria = consultaCulturaTurismo.urlServicio + "/" + seleccion;
              consultaCulturaTurismo.urlCategoria = urlCategoria;
              realizarQuery(urlCategoria);
             /* if(consultaCulturaTurismo.featuresCargados.length > 0){
                removerLayers();
              }
              var opacity = 0.7;
              var myFeatureLayer = crearFeatureLayer(urlCategoria, opacity);              
              map.addLayer(myFeatureLayer);              
              consultaCulturaTurismo.featuresCargados[consultaCulturaTurismo.featuresCargados.length] = myFeatureLayer;*/
              $('#btnEjecutarConsultaCT').prop('disabled', true);
              $('#btnResultadosConsultaCT').prop('disabled', true);
              limpiarContenedor("selectNombreConsultaCT"); $('#selectNombreConsultaCT').prop('disabled', true);
              document.getElementById("selectServiciosCCT").length = 0;
              document.getElementById("btnResultadosConsultaCT").style.display = "none";
            }
            consultaCulturaTurismo.municipioSeleccionado = undefined;
          });
          query("#selectSubcategoriaConsultaCT").on("click", function (evt) {
            showLoader();
            consultaCulturaTurismo.resultQuery = undefined;
            var where, outFields;
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "Seleccione..." && seleccion != consultaCulturaTurismo.subCategoriaSeleccionada) {                                          
              consultaCulturaTurismo.subCategoriaSeleccionada = seleccion;
              document.getElementById("selectMunicipioConsultaCT").length = 0;
              where = "CATEGORIA = '" + seleccion+"'";
              outFields = "IDMUNICIPIO";
              geometry = false;
              consultaCulturaTurismo.where = where;
              document.getElementById("selectServiciosCCT").length = 0;
              consultarQueryTask(outFields, consultaCulturaTurismo.urlCategoria, geometry, where);
              consultaCulturaTurismo.municipioSeleccionado = undefined;
              $('#btnResultadosConsultaCT').prop('disabled', true); 
              $('#btnEjecutarConsultaCT').prop('disabled', true);
              $('#btnResultadosConsultaCT').prop('disabled', true);
              limpiarContenedor("selectNombreConsultaCT"); $('#selectNombreConsultaCT').prop('disabled', true);
              document.getElementById("btnResultadosConsultaCT").style.display = "none";
            }
          });              
          query("#selectMunicipioConsultaCT").on("click", function (evt) {
            consultaCulturaTurismo.resultQuery = undefined;
            var data, myWhere;
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "Seleccione..." && seleccion != consultaCulturaTurismo.municipioSeleccionado){                                          
              var where = consultaCulturaTurismo.where, idMunicipio, outFields;
              consultaCulturaTurismo.municipioSeleccionado = seleccion;
              for(var i in municipios){
                if(seleccion == municipios[i].nombre){
                  idMunicipio = municipios[i].id;
                  consultaCulturaTurismo.idMunicipio = idMunicipio;
                  break;
                }
              }
              if(consultaCulturaTurismo.categoriaSeleccionada == "21" || consultaCulturaTurismo.categoriaSeleccionada == "25"){
                myWhere = where + " '" + idMunicipio + "'";
                outFields = consultaCulturaTurismo.outFields;                
              }else{
                myWhere = where + " AND IDMUNICIPIO = '" + idMunicipio + "'";
                outFields = "NOMBRE";                
              }              
              consultaCulturaTurismo.Where1 = myWhere;
              geometry = false;
              //consultaCulturaTurismo.where = where;
              consultarQueryTask(outFields, consultaCulturaTurismo.urlCategoria, geometry, myWhere);
                            
              consultaCulturaTurismo.nombreSeleccionado = undefined;
              document.getElementById("selectNombreConsultaCT").length = 0;
              $('#btnResultadosConsultaCT').prop('disabled', true); 
              $('#btnEjecutarConsultaCT').prop('disabled', true);
              document.getElementById("btnResultadosConsultaCT").style.display = "none";
            }
          });      
          query("#selectNombreConsultaCT").on("click", function (evt) {            
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "Seleccione..." && consultaCulturaTurismo.nombreSeleccionado != seleccion) {                                                        
              consultaCulturaTurismo.nombreSeleccionado = seleccion;                            
              $("#btnEjecutarConsultaCT").prop('disabled', false);
              $('#btnResultadosConsultaCT').prop('disabled', true);
              document.getElementById("btnResultadosConsultaCT").style.display = "none";
            }
          });         
          query("#btnEjecutarConsultaCT").on("click", function (evt) {
              if (consultaCulturaTurismo.ejecutarBusqueda) {
                  showLoader();
                  var outFields = consultaCulturaTurismo.fieldsCategoria;
                  var geometry = true;
                  var myWhere;
                  if (consultaCulturaTurismo.categoriaSeleccionada == "21") {
                      myWhere = consultaCulturaTurismo.Where1 + " AND SIGQ.PuntoInforTuristica.UBICACION = '" + consultaCulturaTurismo.nombreSeleccionado + "'";
                  } else if (consultaCulturaTurismo.tematicaSeleccionada == 0 && consultaCulturaTurismo.categoriaSeleccionada == 6 && consultaCulturaTurismo.subCategoriaSeleccionada == "Museo" &&
                      consultaCulturaTurismo.municipioSeleccionado == "Armenia") {
                      myWhere = consultaCulturaTurismo.Where1;
                  } else {
                      myWhere = consultaCulturaTurismo.Where1 + " AND NOMBRE = '" + consultaCulturaTurismo.nombreSeleccionado + "'";
                  }
                  consultaCulturaTurismo.Where2 = myWhere;
                  consultaCulturaTurismo.serviciosCargados = undefined;
                  consultarQueryTask(outFields, consultaCulturaTurismo.urlCategoria, geometry, myWhere);
                  document.getElementById("form2CCT").style.display = "none";
                  consultaCulturaTurismo.ocultarDivs = true;
                  document.getElementById("selectServiciosCCT").length = 0;
              }
          });                             
          query("#botonRegresarConsultaCT").on("click", function (evt) {              
            document.getElementById("divtTablaConsultaCT").style.display = "none";                                        
            document.getElementById("divFormularioConsultaCT").style.display = "block"; 
            document.getElementById("form5CCT").style.display = "none";
            document.getElementById("form4CCT").style.display = "none";
            $('#btnResultadosConsultaCT').prop('disabled', false);  
            var width = consultaCulturaTurismo.widthInicial, height = consultaCulturaTurismo.heightInicial, panel = consultaCulturaTurismo.panel;                                            
            ajustarTamanioWidget(panel, width, height);                                     
          });
          query("#btnResultadosConsultaCT").on("click", function (evt) {              
            document.getElementById("divtTablaConsultaCT").style.display = "block";                                        
            document.getElementById("divFormularioConsultaCT").style.display = "none";  
            document.getElementById("form2CCT").style.display = "none"; 
            var width = consultaCulturaTurismo.widthResultado, height = consultaCulturaTurismo.heightResultado, panel = consultaCulturaTurismo.panel;                                            
            ajustarTamanioWidget(panel, width, height);       
            consultaCulturaTurismo.ocultarDivs = true;                              
          });
          query("#btnVerMasCCT").on("click", function (evt) {  
            var width = consultaCulturaTurismo.widthResultado;            
            var panel = consultaCulturaTurismo.panel, height;
            document.getElementById("form5CCT").style.display = "none";
            if(consultaCulturaTurismo.ocultarDivs){
              document.getElementById("form2CCT").style.display = "block";
              if(consultaCulturaTurismo.categoriaSeleccionada == consultaCulturaTurismo.tematicas[1].subLayerIds[0]){
                document.getElementById("form3CCT").style.display = "block";               
              }              
              height = 434;                                      
            }else{
              document.getElementById("form2CCT").style.display = "none";
              document.getElementById("form3CCT").style.display = "none";                             
              document.getElementById("form4CCT").style.display = "none";                             
              document.getElementById("form5CCT").style.display = "none";                             
              height = consultaCulturaTurismo.heightResultado;                                      
            }                  
            ajustarTamanioWidget(panel, width, height);
            consultaCulturaTurismo.ocultarDivs = !consultaCulturaTurismo.ocultarDivs;
          });
          query("#btnCapaciadInstCCT").on("click", function (evt) {
            document.getElementById("form4CCT").style.display = "block";
            document.getElementById("form5CCT").style.display = "none";
            var height = 540;
            ajustarTamanioWidget(consultaCulturaTurismo.panel, consultaCulturaTurismo.widthResultado, height);
          });
          query("#btnServiciosCCT").on("click", function (evt) {
            document.getElementById("form4CCT").style.display = "none";
            document.getElementById("form5CCT").style.display = "block";
            var width = consultaCulturaTurismo.widthResultado;            
            var panel = consultaCulturaTurismo.panel, height;
            height = consultaCulturaTurismo.panel.position.height + consultaCulturaTurismo.sizeServicios;
            ajustarTamanioWidget(panel, width, height);
          });
          query("#btnlimpiarCT").on("click", function (evt) {
              var selects = ["selectCategoriaConsultaCT", "selectSubcategoriaConsultaCT", "selectMunicipioConsultaCT",
                  "selectNombreConsultaCT"];
              cargarDatos("selectTematicaConsultaCT", ordenarDatos(descriminaRepetidos(consultaCulturaTurismo.tematicas)));
              for (var i in selects) {
                  limpiarContenedor(selects[i], true)
              }
              consultaCulturaTurismo.consultaPorSeleccionada = undefined;
              ocultarMostrarDivs(consultaCulturaTurismo.divMostrar, "none");
              ocultarMostrarDivs(consultaCulturaTurismo.divsMostar, "none");
              consultaCulturaTurismo.tematicaSeleccionada = undefined;
              consultaCulturaTurismo.categoriaSeleccionada = undefined;              
              consultaCulturaTurismo.ejecutarBusqueda = false;
          });
        },

        onOpen: function () {
            consultaCulturaTurismo.ejecutarBusqueda = true;
          consultaCulturaTurismo.featuresCargados = [];
          consultaCulturaTurismo.ocultarDivs = true;
          document.getElementById("selectTematicaConsultaCT").length = 0;
          $('#selectCategoriaConsultaCT').prop('disabled', true); $('#selectCategoriaConsultaCT').val(0);
          $('#selectSubcategoriaConsultaCT').prop('disabled', true); document.getElementById("selectSubcategoriaConsultaCT").length = 0;
          $('#selectMunicipioConsultaCT').prop('disabled', true); document.getElementById("selectMunicipioConsultaCT").length = 0;
          $('#selectNombreConsultaCT').prop('disabled', true); document.getElementById("selectNombreConsultaCT").length = 0;
          $('#btnEjecutarConsultaCT').prop('disabled', true);          
          $('#btnResultadosConsultaCT').prop('disabled', true); document.getElementById("btnResultadosConsultaCT").length = 0;
          document.getElementById("btnResultadosConsultaCT").style.display = "none";
          var panel = this.getPanel();          
          consultaCulturaTurismo.panel = panel;
          var width = 301;
          var height = 283;        
          consultaCulturaTurismo.widthInicial = width;  
          consultaCulturaTurismo.heightInicial = height;  
          ajustarTamanioWidget(panel, width, height);                              
          consultaCulturaTurismo.grphicsLoaded = [];   
          consultaCulturaTurismo.campoSeleccionado = undefined;  
          consultaCulturaTurismo.valorSeleccionado = undefined;           
          var url = SERVICIO_CULTURA_TURISMO;
          consultaCulturaTurismo.urlServicio = url;
          consultaCulturaTurismo.temaCargado = false;
          consultaCulturaTurismo.tematicas = [];
          realizarQuery(url);             
          },
        onClose: function(){
          console.log('onClose');
          map.graphics.clear();
          if(consultaCulturaTurismo.featuresCargados.length > 0){
            removerLayers();
          }
          consultaCulturaTurismo.tematicaSeleccionada = undefined;
          for(var i in consultaCulturaTurismo.grphicsLoaded){
            map.removeLayer(consultaCulturaTurismo.grphicsLoaded[i]);
          }                    
          dojo.disconnect();          
          map.setExtent(map._initialExtent);
          document.getElementById("divtTablaConsultaCT").style.display = "none";
          document.getElementById("divFormularioConsultaCT").style.display = "block";          
          }
          
      });          

  function removerLayers(){
    for(var i in consultaCulturaTurismo.featuresCargados){
      map.removeLayer(consultaCulturaTurismo.featuresCargados[i]);
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
        });
      }        
  }        
  function respuestaQuery(result, url) {
    var a = 0;
    if(document.getElementById("selectTematicaConsultaCT").length == 0){
      for(var i in result.layers){
        if(result.layers[i].subLayerIds != null && result.layers[i].id != "23"){
          consultaCulturaTurismo.tematicas[a] = {};
          consultaCulturaTurismo.tematicas[a]["id"] = result.layers[i]["id"];
          consultaCulturaTurismo.tematicas[a]["name"] = result.layers[i]["name"];        
          consultaCulturaTurismo.tematicas[a]["subLayerIds"] = result.layers[i]["subLayerIds"];        
          a++;
        }
      }    
      cargarDatos("selectTematicaConsultaCT", consultaCulturaTurismo.tematicas);
      $('#selectTematicaConsultaCT').prop('disabled', false);
    }else if(document.getElementById("selectCategoriaConsultaCT").length == 0){
        cargarDatos("selectCategoriaConsultaCT", result.subLayers);
      $('#selectCategoriaConsultaCT').prop('disabled', false);
    }else if(consultaCulturaTurismo.categoriaSeleccionada != 777777){
      var campos = [], url = consultaCulturaTurismo.urlCategoria, geometry = false, where = "1=1";
      for(var i in result.fields){
        campos[i] = result.fields[i].name
      }
      consultaCulturaTurismo.fieldsCategoria = campos;
     // campos = "CATEGORIA";
      consultaCulturaTurismo.nameCategoria = result.name;
      consultarQueryTask(campos, url, geometry, where);
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
  function disabledForm(condition){
    if (condition) {
      showLoader(); 
    } else {
      hideLoader();
    }      
    var nodes =  document.getElementById("divFormularioConsultaCT").getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
      nodes[i].disabled = condition;
      }
  }
  function limpiarCamposResultado(){
    document.getElementById("NOMBRECCT").innerHTML = "";
    document.getElementById("DIRECCIONCCT").innerHTML = "";
    document.getElementById("TELEFONOCCT").innerHTML = "";
    document.getElementById("URLCCT").innerHTML = "";
    document.getElementById("PERSONACONTACTOCCT").innerHTML = "";
    document.getElementById("NITCCT").innerHTML = "";
    document.getElementById("CIIUCCT").innerHTML = "";
    document.getElementById("RNTCCT").innerHTML = "";
    document.getElementById("REGISTROMERCANTILCCT").innerHTML = "";
  }
  function monstrarConsulta(featureSet) {
    showLoader();  
    var datos = [], datosFinales = [], contenedor, div;
    if(document.getElementById("selectSubcategoriaConsultaCT").length == 0){      
      for(var i in featureSet.features){
        if(featureSet.features[i].attributes["CATEGORIA"] != undefined){
          datos[i] = featureSet.features[i].attributes["CATEGORIA"];
          contenedor = "selectSubcategoriaConsultaCT";                              
        }else if(featureSet.features[i].attributes["SIGQ.V_MUNICIPIOS.MUNICIPIO"] != undefined){

          if(document.getElementById("selectMunicipioConsultaCT").disabled){
            datos[i] = featureSet.features[i].attributes["SIGQ.V_MUNICIPIOS.MUNICIPIO"];
            contenedor = "selectMunicipioConsultaCT";                
            consultaCulturaTurismo.where = "SIGQ.V_MUNICIPIOS.IDMUNICIPIO =";
            consultaCulturaTurismo.outFields = "SIGQ.PuntoInforTuristica.UBICACION";
          }else if(consultaCulturaTurismo.categoriaSeleccionada == "21"){
            var x = featureSet.features[0].geometry.x, y = featureSet.features[0].geometry.y, zoom = 500;            
            var referenciaSpacial = map.spatialReference;
            centrarYubicarPuntoEspecifico(x, y, referenciaSpacial, zoom);

            var title = consultaCulturaTurismo.nombreSeleccionado;
            //var attributos = featureSet.features[0].attributes;
            //var fields = featureSet.fields;
            
            var myInfoTemplate = crearInfoTemplate(title, attributos, fields);
            var mySymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.9]), 5), new Color([0, 255, 0, 0.1]));
            dibujarPuntoConInfoTemplate(x, y, referenciaSpacial, mySymbol, attributos, myInfoTemplate);
          }else{
            datos[i] = featureSet.features[i].attributes["SIGQ.CajerosAutomaticos.OPERADORES"];
            contenedor = "selectNombreConsultaCT";
          }        
        }else if(featureSet.features[i].attributes["MUNICIPIO"] != undefined){
          datos[i] = featureSet.features[i].attributes["MUNICIPIO"];
          contenedor = "selectMunicipioConsultaCT";                
        }else if(featureSet.features[i].attributes["SIGQ.Comercio.NOMBRE"] != undefined){
          datos[i] = featureSet.features[i].attributes["SIGQ.Comercio.NOMBRE"];
          contenedor = "selectNombreConsultaCT";   
          limpiarContenedor("selectMunicipioConsultaCT");                          
        }else if(featureSet.features[i].attributes["NOMBRE"] != undefined){
          datos[i] = featureSet.features[i].attributes["NOMBRE"];
          contenedor = "selectNombreConsultaCT";                             
        }else if(featureSet.features[i].attributes["SIGQ.Semaforos.DIRECCION"] != undefined){
          datos[i] = featureSet.features[i].attributes["SIGQ.Semaforos.DIRECCION"];
          contenedor = "selectNombreConsultaCT";                             
        }else if(featureSet.features[i].attributes["SIGQ.PuntoInforTuristica.UBICACION"] != undefined){
          datos[i] = featureSet.features[i].attributes["SIGQ.PuntoInforTuristica.UBICACION"];
          contenedor = "selectNombreConsultaCT";                             
        }else{
          createDialogInformacionGeneral("<B> Info </B>", "Servicio sin información");
        }
      }
      //limpiarContenedor("selectSubcategoriaConsultaCT");      
      //limpiarContenedor("selectNombreConsultaCT");
      if(featureSet.features.length == 0){
        createDialogInformacionGeneral("<B> Info </B>", "Servicio sin información");

      }
      if(!document.getElementById("selectSubcategoriaConsultaCT").disabled){
        limpiarContenedor("selectMunicipioConsultaCT");   
      }
    }else if(document.getElementById("selectMunicipioConsultaCT").length == 0){
      for(var i in featureSet.features){
        if(featureSet.features[i].attributes["IDMUNICIPIO"] != undefined){
          for(var a in municipios){
            if(featureSet.features[i].attributes.IDMUNICIPIO == municipios[a].id){
              datos[i] = municipios[a].nombre;
            }
          }          
          contenedor = "selectMunicipioConsultaCT";                              
        }
      }      
      limpiarContenedor("selectNombreConsultaCT");                
    }else if(document.getElementById("selectNombreConsultaCT").length == 0){
      for(var i in featureSet.features){
        if(featureSet.features[i].attributes["NOMBRE"] != undefined){
          datos[i] = featureSet.features[i].attributes["NOMBRE"]; 
        }                                                      
      } 
      contenedor = "selectNombreConsultaCT";
      cargarDatos(contenedor, ordenarDatos(descriminaRepetidos(datos)));
    }else if(!document.getElementById("btnEjecutarConsultaCT").disabled){
      if(featureSet.features.length > 0){
                
        if(featureSet.features[0].geometry != null){
          document.getElementById("divFormularioConsultaCT").style.display = "none";
          document.getElementById("divtTablaConsultaCT").style.display = "block";     
          document.getElementById("idResultadosCultura").style.display = "block";
          var width = 451, height = 280, panel = consultaCulturaTurismo.panel;
          consultaCulturaTurismo.heightResultado = height;
          consultaCulturaTurismo.widthResultado = width;                                            
          ajustarTamanioWidget(panel, width, height);
          limpiarCamposResultado();        
          //var campos = ["NOMBRE","DIRECCION","TELEFONO","URL","PERSONACONTACTO","NIT","HORARIO","CIIU","RNT","REGISTROMERCANTIL"];
          var campos = featureSet.fields;
          var fields = [];
          for(var i in campos){
            var miCampo = campos[i].name + "CCT";
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

          var title = consultaCulturaTurismo.nombreSeleccionado;
          var attributos = featureSet.features[0].attributes;
          var fields = featureSet.fields;
          var myInfoTemplate = crearInfoTemplate(title, attributos, fields);
          var mySymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.9]), 5), new Color([0, 255, 0, 0.1]));
          dibujarPuntoConInfoTemplate(x, y, referenciaSpacial, mySymbol, attributos, myInfoTemplate);
          
          var div = "imgCCT", urlImagen = URL_ARCHIVOS_QUINDIO + featureSet.features[0].attributes["IMAGEN"];
          console.log(urlImagen);
          console.log(featureSet.features[0].attributes["IMAGEN"]);
          consultaCulturaTurismo.urlImagen = urlImagen;
          var height = "190px", width = "100px";
          consultaCulturaTurismo.imagenCArgada = false;        
          if(consultaCulturaTurismo.imagenCargada == undefined){
            subirImagenCCT(urlImagen, div);            
          }else{
            a = document.getElementById('idCCT');
            a.parentNode.removeChild(a);
            subirImagenCCT(urlImagen, div);
          }
          var width = 451, height = 320, panel = consultaCulturaTurismo.panel;
          ajustarTamanioWidget(panel, width, height);
        }        
        
        if(consultaCulturaTurismo.categoriaSeleccionada == consultaCulturaTurismo.tematicas[1].subLayerIds[0]
          && consultaCulturaTurismo.serviciosCargados == undefined){
            var where = "OBJECTID = " + featureSet.features[0].attributes.OBJECTID;
            var url = SERVICIO_CULTURA_TURISMO_ALFANUMERICO + "/0";
            var campos = ["TIPO_SERVICIO"], geometry = false;
            consultarQueryTask(campos, url, geometry, where);          
            consultaCulturaTurismo.serviciosCargados = true;
        }else if(consultaCulturaTurismo.serviciosCargados != undefined){
          var datos = [], contenedor = "selectServiciosCCT";
          for(var i in featureSet.features){
            datos[i] = featureSet.features[i].attributes.TIPO_SERVICIO;
          }
          var agregarDato = document.getElementById(contenedor);
          agregarDato.length = 0;          
          for(var i in datos){
            agregarDato.options[agregarDato.options.length] = new Option(datos[i], i);
          }
          document.getElementById(contenedor).size = datos.length;
          consultaCulturaTurismo.sizeServicios = datos.length;
        }
        
      }else{
        var agregarDato = document.getElementById("selectServiciosCCT");
        agregarDato.options[agregarDato.options.length] = new Option("Sin datos", 0);
      }


    }else{
      createDialogInformacionGeneral("<B> Info </B>", "Servicio sin información");
    }
    
    if(contenedor != undefined && datos.length > 0 && document.getElementById("selectServiciosCCT").length == 0){
      var datosNoRepetidosYOrdenados = descriminaRepetidos(datos);
      for(var i in datosNoRepetidosYOrdenados){
        datosFinales[i] = {};
        datosFinales[i].id = i;
        datosFinales[i].name = datosNoRepetidosYOrdenados[i];
      }
      cargarDatos(contenedor, ordenarDatos(datosNoRepetidosYOrdenados));
      $("#"+contenedor).prop('disabled', false);  
    }else if(!document.getElementById("btnEjecutarConsultaCT").disabled &&
     document.getElementById("btnEjecutarConsultaCT").disabled && document.getElementById("selectServiciosCCT").length == 0){
      limpiarContenedor("selectMunicipioConsultaCT");
      createDialogInformacionGeneral("<B> Info </B>", "Servicio sin información");
    } 
    hideLoader();         
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
    
     return clazz;
});
function imagenClick(){
  if(consultaCulturaTurismo.imagenCArgada){
    document.getElementById("divtTablaConsultaCT").style.display = "block";
    document.getElementById("widgetCCT").style.display = "none";
    document.getElementById("form2CCT").style.display = "none";
    document.getElementById("form3CCT").style.display = "none";
    document.getElementById("form4CCT").style.display = "none";
    consultaCulturaTurismo.imagenCArgada = false;
    a = document.getElementById('idCCT');
    a.parentNode.removeChild(a);
    var width = consultaCulturaTurismo.widthResultado;
    var panel = consultaCulturaTurismo.panel, height;
    height = consultaCulturaTurismo.heightResultado;
    ajustarTamanioWidget(panel, width, height);
  }else{
    document.getElementById("divtTablaConsultaCT").style.display = "none";
    document.getElementById("widgetCCT").style.display = "block";
    var div = "widgetCCT", height = "auto", width = "100%";
    var urlImagen = consultaCulturaTurismo.urlImagen;
    subirImagenCCT(urlImagen, div, width, height);   
    consultaCulturaTurismo.imagenCArgada = true;
    consultaCulturaTurismo.ocultarDivs = true;
  }
  consultaCulturaTurismo.ocultarDivs = !consultaCulturaTurismo.ocultarDivs;
}
function subirImagenCCT(urlImagen, div, width, height){  
  var imageParent = document.getElementById(div);  
  imageParent.style.width = "100%";
  imageParent.style.height = "100px";
  var image = document.createElement("img");        
  image.id = "idCCT";
  image.src = urlImagen;            // image.src = "IMAGE URL/PATH"
  image.style.width = width;
  image.style.height = height;
  image.style.border = "3px solid #73ad21";
  image.style.padding = "1px";
  image.alt = "Disculpas la imagen no está habilitada";  
  image.onclick = "imagenClick()";
  imageParent.appendChild(image);  
  consultaCulturaTurismo.imagenCargada = imageParent;
}
  