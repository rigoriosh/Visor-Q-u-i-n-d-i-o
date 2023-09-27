var consultaAvanzadaAlfanumerica = {};
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
        name: 'consultaAvanzadaAlfanumerica',

        postCreate: function() {         
         },

        startup: function() {         

            $('#widgets_consultaAvanzadaAlfanumerica_Widget_36_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad realiza Consulta Avanzada Alfanum\u00E9rica con par&aacute;metros de entrada"></div>');

          query("#selectServiciosCAAlfa").on("click", function (evt) {            
            var seleccion = this.options[this.selectedIndex].value;
            if (seleccion != 8888888 && seleccion != consultaAvanzadaAlfanumerica.servicioSeleccionado) {
                consultaAvanzadaAlfanumerica.servicioSeleccionado = seleccion;
                map.graphics.clear();
                borrarFiltroCAA();
                consultaAvanzadaAlfanumerica.gruposCargados = undefined;
                consultaAvanzadaAlfanumerica.resultQuery = undefined;                          
                consultaAvanzadaAlfanumerica.capaSeleccionada = undefined;
                consultaAvanzadaAlfanumerica.grupoSeleccionado = undefined;
                var urlServicio = consultaAvanzadaAlfanumerica.urlServicio;
                var servicios = consultaAvanzadaAlfanumerica.capas;
                for(var i in servicios){
                  if(seleccion == servicios[i].id){
                    var urlCapa = urlServicio + "/"+ servicios[i].id;
                    consultaAvanzadaAlfanumerica.urlCapa = urlCapa;
                    break;
                  }
                }
                realizarQueryCAA(urlCapa);
                consultaAvanzadaAlfanumerica.camposCargados = false; 
                document.getElementById("selectValoresCAAlfa").length = 0;
                document.getElementById("textCondicionBusquedaCAAlfa").value = "";
                
            }
            });
              
          query("#selectCamposCAAlfa").on("click", function (evt) {
            consultaAvanzadaAlfanumerica.resultQuery = undefined;
            var seleccion = this.options[this.selectedIndex].text.split(' ');
            if (seleccion[0] != "" ) {  
                map.graphics.clear();
                borrarFiltroCAA();
              consultaAvanzadaAlfanumerica.campoSeleccionado = seleccion[0];
              document.getElementById("textCondicionBusquedaCAAlfa").value += " " + seleccion[0];             
              consultaAvanzadaAlfanumerica.valoresObtenidos = undefined;
              document.getElementById("selectValoresCAAlfa").length = 0;
              
            }
            });
              
          query("#btnObtenerValoresCAAlfa").on("click", function (evt) {                                       
            var campos = consultaAvanzadaAlfanumerica.campoSeleccionado;                
            var confirmarCampoSeleccionado = consultaAvanzadaAlfanumerica.confirmarCampoSeleccionado;
            if(campos != confirmarCampoSeleccionado){
              var where = "1=1", geometry = false;
              consultaAvanzadaAlfanumerica.confirmarCampoSeleccionado = campos;
              var url = consultaAvanzadaAlfanumerica.urlCapa;            
              disabledFormCAA(true);            
              consultarCapaCAA(campos, url, geometry, where);                        
              consultaAvanzadaAlfanumerica.valorSeleccionado = undefined;                    
              }else{
                cargarDatosOrdenadosCAA(consultaAvanzadaAlfanumerica.datosOrdenados);
              }                        
            });
          query("#selectValoresCAAlfa").on("click", function (evt) {
            consultaAvanzadaAlfanumerica.resultQuery = undefined;
            var data;
            var seleccion = this.options[this.selectedIndex].text;
            if (seleccion != "Seleccione...") {                                          
              var textConsulta = consultaAvanzadaAlfanumerica.textConsulta;
              if(textConsulta == undefined){                
                createDialogInformacionGeneral("<B> Info </B>", "Recuerda, primero debes seleccionar el comporador lógico");             
              }else if(consultaAvanzadaAlfanumerica.typeValores == "esriFieldTypeInteger" ||
              consultaAvanzadaAlfanumerica.typeValores == "esriFieldTypeDouble" ){
                  seleccion = parseFloat(seleccion);
                  data = textConsulta.concat(" "+ seleccion );
                }else{
                data = textConsulta.concat(" "+"'"+seleccion+"'");                
              }
              consultaAvanzadaAlfanumerica.valorSeleccionado = seleccion;
              document.getElementById("textCondicionBusquedaCAAlfa").value = data;
              consultaAvanzadaAlfanumerica.where = data;
            }
            });
          query("#btnEjecutarConsultaCAAlfa").on("click", function (evt) {
            if(consultaAvanzadaAlfanumerica.where != undefined && consultaAvanzadaAlfanumerica.urlCapa != undefined){
              if(consultaAvanzadaAlfanumerica.resultQuery == undefined){
                map.graphics.clear();
                disabledFormCAA(true);
                var where = consultaAvanzadaAlfanumerica.where;
                var campos = [], geometry = true;
                //if (consultaAvanzadaAlfanumerica.servicioSeleccionado == 0) {
                    campos = consultaAvanzadaAlfanumerica.fields;
                /*} else {
                    campos = '*';
                } */
                var url = consultaAvanzadaAlfanumerica.urlCapa;
                if (consultaAvanzadaAlfanumerica.tablaResultados != undefined) {
                  destruirTablaResultadosCAA();              
                  }            
                consultarCapaCAA(campos, url, geometry, where);          
                }else{
                  document.getElementById("divFormularioCAAlfa").style.display = "none";
                  document.getElementById("divtTablaCAAlfa").style.display = "block";
                  var width = consultaAvanzadaAlfanumerica.width;
                  var height = consultaAvanzadaAlfanumerica.height;          
                  ajustarTamanioWidgetCAA(width, height);
                }
              }
            });
          query("#botonRegresarCAAlfa").on("click", function (evt) {              
               document.getElementById("divtTablaCAAlfa").style.display = "none";
               document.getElementById("divFormularioCAAlfa").style.display = "block";                            
              ajustarTamanioWidgetCAA(consultaAvanzadaAlfanumerica.widthInicial, consultaAvanzadaAlfanumerica.heightInicial);
              });
          

           },

        onOpen: function() { 
          var panel = this.getPanel();          
          consultaAvanzadaAlfanumerica.panel = panel;
          var width = 300;
          var height = 580;        
          consultaAvanzadaAlfanumerica.widthInicial = width;  
          consultaAvanzadaAlfanumerica.heightInicial = height;  
          ajustarTamanioWidgetCAA(width, height);          
          ocultarDivsCAA();                      
          consultaAvanzadaAlfanumerica.grphicsLoaded = [];   
          consultaAvanzadaAlfanumerica.campoSeleccionado = undefined;  
          consultaAvanzadaAlfanumerica.valorSeleccionado = undefined;           
          var url = SERVICIO_CONSULTA_AVANZADA_ALFANUMERICA;
          consultaAvanzadaAlfanumerica.urlServicio = url;
          consultaAvanzadaAlfanumerica.temaCargado = false;
          realizarQueryCAA(url);          
          },
        onClose: function(){
          console.log('onClose');
          map.graphics.clear();
          consultaAvanzadaAlfanumerica.servicioSeleccionado = undefined;
          for(var i in consultaAvanzadaAlfanumerica.grphicsLoaded){
            map.removeLayer(consultaAvanzadaAlfanumerica.grphicsLoaded[i]);
          }          
          ocultarDivsCAA();
          dojo.disconnect();          
          document.getElementById("selectCamposCAAlfa").length = 0;
          document.getElementById("selectValoresCAAlfa").length = 0;
          document.getElementById("textCondicionBusquedaCAAlfa").value = "";
          document.getElementById("divFormularioCAAlfa").style.display = "block";
          document.getElementById("divtTablaCAAlfa").style.display = "none";
          map.setExtent(map._initialExtent);
          }
          
      });   
     
  function ajustarTamanioWidgetCAA(width, height) {      
      var panel = consultaAvanzadaAlfanumerica.panel;       
      panel.position.width = width;
      panel.position.height = height;
      panel._originalBox = {
          w: panel.position.width,
          h: panel.position.height,
          l: panel.position.left || 5,
          t: panel.position.top || 5
      };
      panel.setPosition(panel.position);
      panel.panelManager.normalizePanel(panel);
     }

  function consultarCapaCAA(campos, url, geometry, where) {
    if(url != undefined && where != undefined){
        var queryTask = new QueryTask(url);
        var parametros = new Query();
        parametros.outFields = [campos];
        parametros.where = where;
        parametros.returnGeometry = geometry;
        parametros.outSpatialReference = map.spatialReference;
        queryTask.execute(parametros, monstrarConsultaCAA, function (error) {
            console.log(error);            
            createDialogInformacionGeneral("<B> Info </B>", "No se logró completar la operación");
            disabledFormCAA(false);
        });
      }        
    }
  function colocaTextoPuntoCAA(geometries, attr){    
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
  function cargarValoresCAA(features){
      var seleccion = consultaAvanzadaAlfanumerica.campoSeleccionado;
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
      cargarDatosOrdenadosCAA(datosOrdenados);
      consultaAvanzadaAlfanumerica.datosOrdenados = datosOrdenados;    
      disabledFormCAA(false);
      }
  function cargarDatosOrdenadosCAA(datosOrdenados){
    var agregarDato = document.getElementById('selectValoresCAAlfa');
    agregarDato.length = 0;
    if(datosOrdenados.length == 0){
      agregarDato.options[agregarDato.options.length] = new Option("Campo sin datos, seleccione otro campo", 1);
    }else{
      if(consultaAvanzadaAlfanumerica.campoSeleccionado == "FECHARESOLUCION" || consultaAvanzadaAlfanumerica.campoSeleccionado == "FECHAINFRACCION"){
        convertirNumeroAfechaCAA(datosOrdenados, agregarDato);
      }else{
    for(var i in datosOrdenados){
      agregarDato.options[agregarDato.options.length] = new Option(datosOrdenados[i], i);
    }      
      }
    }
    }
  function convertirNumeroAfechaCAA(datosOrdenados, agregarDato){
    var fecha, fechaMostrar = [], existe = false;

    for(var i in datosOrdenados){
      fecha = new Date(datosOrdenados[i]);
      fechaMostrar = (fecha.getDate()+1) +"/"+ (fecha.getMonth()+1) +"/"+ fecha.getFullYear();
      agregarDato.options[agregarDato.options.length] = new Option(fechaMostrar, i);        
    }
    }
  function cargarSelectCAA(data, idSelect){
    var agregarDato = document.getElementById(idSelect);
    agregarDato.length = 0;
    agregarDato.options[agregarDato.options.length] = new Option('Seleccione...', 8888888);
    for (var i in data) {
      agregarDato.options[agregarDato.options.length] = new Option(data[i].name, data[i].id);                
    }      
    disabledFormCAA(false);
    }
  function consultarServicioCAA(result, url) {
      //console.log("consultarServicioCAA", result);
      ////carga datos en el select Temas
      if(!consultaAvanzadaAlfanumerica.temaCargado){
        var temas = result.layers;
        var idSelect = 'selectServiciosCAAlfa';
        var nameTemas = ["Trámites","Predios reserva","Infraestructura educativa","Clasificación del suelo",
        "Servicios Salud","Capacidad instalada","Servicios hospedajes"];
        for(var i in temas){
          temas[i].nameServicio = temas[i].name;
          temas[i].name = nameTemas[i];
        }
        cargarSelectCAA(temas, idSelect);
        consultaAvanzadaAlfanumerica.capas = temas;
        consultaAvanzadaAlfanumerica.temaCargado = true;        
      }
      /////////////////////////////////////////////////////////////////////////////////
      if(!consultaAvanzadaAlfanumerica.camposCargados && consultaAvanzadaAlfanumerica.camposCargados != undefined){
        var fields = result.fields, data = [], a = 0, idSelect = 'selectCamposCAAlfa';
        consultaAvanzadaAlfanumerica.camposCargados = true;
        var myFields = [];
        for(var i in fields){
            if (result.fields[i].name != "OBJECTID" && result.fields[i].name != "SHAPE" && result.fields[i].name != "ESRI_OID") {
              data[a] = {};
              myFields[a] = result.fields[i].name;
            data[a].name = result.fields[i].name + " (" + result.fields[i].type.slice(13,21)+ ")";
            data[a].id = a;            
            a++;
          }
        }
        consultaAvanzadaAlfanumerica.fields = myFields;
        cargarSelectCAA(data, idSelect);        
      }      
      }
    
  function crearInfoTemplateCAA(attr){
      var myInfoTemplate;
      var fields = [], datoInfo = "", title;
      for(var i in consultaAvanzadaAlfanumerica.capas){
        if(consultaAvanzadaAlfanumerica.capas[i].id == consultaAvanzadaAlfanumerica.capaSeleccionada){
          title = consultaAvanzadaAlfanumerica.capas[i].name;
          break;
        }
        }
      for(var i in consultaAvanzadaAlfanumerica.featureSet.fields){
        fields[i] = consultaAvanzadaAlfanumerica.featureSet.fields[i].name;
        }
      for(var i in fields){
        if(attr[fields[i]] != null){
          datoInfo += fields[i] + ": " + attr[fields[i]] + "<br/>";
        }
        
       }
      var myInfoTemplate = new InfoTemplate(title,datoInfo);
      return myInfoTemplate;
     }
  function destruirTablaResultadosCAA(){
      consultaAvanzadaAlfanumerica.tablaResultados.destroy();
      consultaAvanzadaAlfanumerica.tablaResultados = undefined;
      }
  function dibujarFeaturesCAA(features, color){  
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
          dibujarPuntoCAA(loc, features[i].attributes);
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
      var infoTemplate = crearInfoTemplateCAA(features[i].attributes);
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
            var infoTemplate = crearInfoTemplateCAA(features[i].attributes);
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
  function dibujarPuntoCAA(loc, attr) { 
    var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));      
    var infoTemplate = crearInfoTemplateCAA(attr);
    var newPunto = new Graphic(loc, symbol, attr, infoTemplate);  
    map.graphics.add(newPunto);          
    colocaTextoPuntoCAA(loc, attr);
    }
  function disabledFormCAA(condition){
    if (condition) {
      showLoader(); 
    } else {
      hideLoader();
    }      
    var nodes =  document.getElementById("divFormularioCAAlfa").getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
      nodes[i].disabled = condition;
      }
    }
  function monstrarConsultaCAA(featureSet) {  
    if(featureSet.features.length > 0){    
        consultaAvanzadaAlfanumerica.featureSet = featureSet;      
        if(consultaAvanzadaAlfanumerica.valoresObtenidos == undefined){
          consultaAvanzadaAlfanumerica.valoresObtenidos = featureSet.features;
          cargarValoresCAA(featureSet.features);           
        }else{
          dibujarFeaturesCAA(featureSet.features);
          mostrarResultadosEnTablaCAA(featureSet);
        }
      }else{        
        createDialogInformacionGeneral("<B> Info </B>", "El campo seleccionado no contiene datos");        
        disabledFormCAA(false);
      }
    }
  function mostrarResultadosEnTablaCAA(result) {//result es el array q contiene los datos a mostrar          
      if (result.features.length <= 0) {          
          createDialogInformacionGeneral("<B> Info </B>", "La selección no contiene resultados");        
          disabledFormCAA(false);
      } else {                     
          require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
              function (lang, DataGrid, ItemFileWriteStore, dom) {
                 document.getElementById("divFormularioCAAlfa").style.display = "none";
                 document.getElementById("divtTablaCAAlfa").style.display = "block";                  
                if (consultaAvanzadaAlfanumerica.tablaResultados == undefined) {
                  //////organiza datos para cargarlo en data_list                                             
                  consultaAvanzadaAlfanumerica.resultQuery = result.features;
                  var data_list = [];
                  var data = {
                      identifier: "id",
                      items: []
                  };                    
                  var layout = [], fields = [];
                  layout[0] = [];
                  consultaAvanzadaAlfanumerica.lists = [];
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
                  var height = 350;          
                  if(data_list.length < 10){
                    height = 250;
                  }
                  if(width > 400){
                    width = 400;
                  }
                  consultaAvanzadaAlfanumerica.width = width;
                  consultaAvanzadaAlfanumerica.height = height;
                  ajustarTamanioWidgetCAA(width, height);                      
                  consultaAvanzadaAlfanumerica.lists = data_list;                    
                  var features = result.features;                                                                                                                                         
                  consultaAvanzadaAlfanumerica.jsonConvertido = JSON.stringify(data_list);
                  var rows = data_list.length;
                  for (var i = 0, l = data_list.length; i < rows; i++) {
                      data.items.push(lang.mixin({ id: i + 1 }, data_list[i % l]));
                  }
                  var store = new ItemFileWriteStore({ data: data });
                  /*create a new grid*/
                  var grid = new DataGrid({
                      id: 'grid',
                      store: store,
                      structure: layout,
                      rowSelector: '10px',
                      style: "width: 560px;",
                      selectionMode: 'single',
                      canSort: function (col) {
                          return false;
                      }
                  });
                  consultaAvanzadaAlfanumerica.tablaResultados = grid;                    
                  /*append the new grid to the div*/
                  grid.placeAt("divGridQueryAdvancedCAAlfa");

                  /*Call startup() to render the grid*/
                  grid.startup();
                  grid.set('autoHeight', false);
                  grid.set('autoWidth', false);
                  grid.set('autoWidth', true);
                  grid.update();
                  var leyenda = dijit.byId("leyendaGraficaConsulta");                 
                  grid.on("RowClick", function (evt) {
                      selectedRowGridCAA(evt);
                  }, true);                      
                }
                disabledFormCAA(false);  
              });
          ///////
      }
    }
  
  function ocultarDivsCAA(){    
    // document.getElementById("divCamposCAAlfa").style.display = "none";
    // document.getElementById("divValoresCAAlfa").style.display = "none";
    // document.getElementById("divCondicionBusquedaCAAlfa").style.display = "none";
    // document.getElementById("divBotones1CAAlfa").style.display = "none";
    // document.getElementById("divBotones2CAAlfa").style.display = "none";
    // document.getElementById("divBotones3CAAlfa").style.display = "none";
    // document.getElementById("divtTablaCAAlfa").style.display = "none";
    }

  function realizarQueryCAA(url) {
    disabledFormCAA(true);
    var layersRequest = esriRequest({
      url: url,
      content: { f: "json" },
      handleAs: "json",
      callbackParamName: "callback"
    });
    layersRequest.then(
        function (response) {
          consultarServicioCAA(response, url);
        }, function (error) {           
          disabledFormCAA(false);
          console.log("Error: => ", error.message);          
          createDialogInformacionGeneral("<B> Info </B>", "Error al cargar el servicio, vuelva a cargar el servicio");                 
        });      
    }

  function selectedRowGridCAA(seleccionado) {
      var colorFeature = [51, 255, 227, 1];
      var rowSelected = dijit.byId('grid').selection.getSelected()[0].OBJECTID[0];         
      var resultQuery = consultaAvanzadaAlfanumerica.resultQuery;
      for(var i in resultQuery){
        if(resultQuery[i].attributes.OBJECTID == rowSelected){
        dibujarFeaturesCAA([resultQuery[i]], colorFeature);
        break;
        }
      }         
     }
    
        
    
    
     return clazz;
});
    function obtenerBotonesConsultaCAA(texto) {  
      var textConsulta = document.getElementById("textCondicionBusquedaCAAlfa");
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
      consultaAvanzadaAlfanumerica.textConsulta = textConsulta.value;
     }

    function ExportarCAA() {  
      //ResultadosJson
      var ReportTitle = "Resultados";
      var ShowLabel = true;
      var ResultadosJson = consultaAvanzadaAlfanumerica.jsonConvertido;
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

    function borrarFiltroCAA() {
        document.getElementById("textCondicionBusquedaCAAlfa").value = "";
        document.getElementById("selectValoresCAAlfa").length = 0;
    }
    function borrarTextAreaConsultaCAA() {      
      document.getElementById("selectCamposCAAlfa").length = 0;
      document.getElementById("selectValoresCAAlfa").length = 0;
      document.getElementById("textCondicionBusquedaCAAlfa").value = "";
      document.getElementById("selectServiciosCAAlfa").selectedIndex = "8888888";
      consultaAvanzadaAlfanumerica.servicioSeleccionado = undefined;
  }
        