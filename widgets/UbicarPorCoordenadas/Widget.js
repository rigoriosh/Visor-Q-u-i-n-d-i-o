var map;
var ubicarPorCoordenadas = {};
define(['dojo/_base/declare', 'jimu/BaseWidget',
  'dojo/on',
  "dojo/query",
  "esri/SpatialReference",
  "esri/geometry/Point",
  "esri/tasks/GeometryService",
  "esri/layers/GraphicsLayer",
  "esri/InfoTemplate",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/graphic",
  "esri/layers/LayerInfo",
  "esri/symbols/TextSymbol",
  "esri/symbols/Font",
  "dojo/_base/array",
  "dojo/number",
  "esri/Color",
  "esri/request",
  "esri/geometry/Extent",
  "esri/geometry/webMercatorUtils",

  "dojo/domReady!"],
  function(declare, BaseWidget,
    on,
    query,
    SpatialReference,
    Point,
    GeometryService,
    GraphicsLayer,
    InfoTemplate,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    Graphic,
    LayerInfo,
    TextSymbol,
    Font,
    array,
    number,
    Color,
    esriRequest,
    Extent,
    webMercatorUtils
    ) {
    var capaGrafica = new GraphicsLayer();
    ubicarPorCoordenadas.webMercatorUtils = webMercatorUtils;
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {

      // Custom widget code goes here

  //    baseClass: 'jimu-widget-ubicarPorCoordenas'

      //this property is set by the framework when widget is loaded.
      name: 'UbicarPorCoordenas',


      //methods to communication with app container:

      postCreate: function() {
        this.inherited(arguments);
        console.log('postCreate');

        map = this.map;
      },

      startup: function() {

        $('#widgets_UbicarPorCoordenadas_Widget_48_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Funcionalidad para ubicar por coordenadas"></div>');

       this.inherited(arguments);
       //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
       console.log('startup');  

       query(".toolUbicarCoor").on("click", function (evt) {
           var spatialRef = new SpatialReference({ wkid: map.spatialReference.wkid });
           var spatialRef4326 = new SpatialReference(4326);
           var coorX, coorY, atributo, loc;         
           var geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
           if (mostrarCoorPlanas) {
               coorX = document.getElementById("coorX").value;
               coorY = document.getElementById("coorY").value;
               if(coorX != "" && coorY != "" && coorX != "NaN" && coorY != "NaN"){
                   coorX = parseFloat(document.getElementById("coorX").value);
                   coorY = parseFloat(document.getElementById("coorY").value);
                   atributo = { "Xcoord": coorX, "Ycoord": coorY };              
                   loc = new Point(coorX, coorY, map.spatialReference);
                   ubicarPorCoordenadas.title = "Coordenada plana";
                   ubicarPorCoordenadas.atributo = loc;
                   ubicarPorCoordenadas.fields = ["x", "y"];
                   dibujarPunto(loc, atributo);
               }else{
                   createDialogInformacionGeneral("<B> Info </B>", "Valores invalidos en X y Y");
               }
           } else {
               
           var gradosLati = document.getElementById("grados").value;              
           var minuLati = document.getElementById("minutos").value;
           var segunLati = document.getElementById("Segundos").value;
           var gradosLongi = document.getElementById("grados1").value;
           var minuLongi = document.getElementById("minutos1").value;
           var segunLongi = document.getElementById("Segundos1").value;
           if (gradosLati % 1 != 0 || minuLati % 1 != 0 || gradosLongi % 1 != 0 || minuLongi % 1 != 0) {
               createDialogInformacionGeneral("<B> Info </B>", "No se aceptan decimales en grados y minutos");
           }else{
           if(gradosLati != "" && minuLati != "" && segunLati != "" && gradosLongi != "" && minuLongi != "" && segunLongi != "" &&
           gradosLati != "NaN" && minuLati != "NaN" && segunLati != "NaN" && gradosLongi != "NaN" && minuLongi != "NaN" && segunLongi != "NaN"){
               if (gradosLongi < 0) {
                   //longitud
                   coorX = -((segunLongi / 3600) * 1) - ((minuLongi / 60) * 1) + (1 * gradosLongi);
               } else {
                   //longitud
                   coorX = (gradosLongi * 1) + ((minuLongi * 1) / 60) + ((segunLongi * 1) / 3600);
               }
               if (gradosLati < 0) {
                   //latitud
                   coorY = -((segunLati / 3600) * 1) - ((minuLati / 60) * 1) + (1 * gradosLati);
               } else {
                   //latitud
                   coorY = (gradosLati * 1) + ((minuLati * 1) / 60) + ((segunLati * 1) / 3600);
               }             
               //  var loc = new Point(longitud, latitud, spatialRef);
               var atributo = {
                   "Latitud": "° " + gradosLati + " ' " + minuLati + " '' " + segunLati,
                   "Longitud": "° " + gradosLongi + " ' " + minuLongi + " '' " + segunLongi
               };
               loc = new Point(coorX, coorY, spatialRef4326);
               geometryService.project([loc], map.spatialReference, function (projectedPoints) {
                   pt = projectedPoints[0];               
                   attr = atributo;
                   ubicarPorCoordenadas.title = "Coordenada geográfica";
                   ubicarPorCoordenadas.atributo = attr;
                   ubicarPorCoordenadas.fields = ["Latitud", "Longitud"];
                   dibujarPunto(pt, attr);
               });
           }else{createDialogInformacionGeneral("<B> Info </B>", "Valores invalidos en Latitud y longitud");}
       }
          }
        });
        query("#Borrar").on("click", function (evt) {
         // capaGrafica.clear();
          map.graphics.clear();
        
          if(mostrarCoorPlanas){
            $('#coorX').val("");
            $('#coorY').val("");
          }else{
            $('#grados').val("");
            $('#minutos').val("");
            $('#Segundos').val("");
            $('#grados1').val("");
            $('#minutos1').val("");
            $('#Segundos1').val("");
          }
          document.getElementById("planas").style.display = "none";
          document.getElementById("Geog").style.display = "none";
          document.getElementById("botonBorrar").style.display = "none";

          ajustarTamanioWidget(ubicarPorCoordenadas.panel, ubicarPorCoordenadas.widthInicial, ubicarPorCoordenadas.heightInicial);
          map.setExtent(map._initialExtent);
        });
        query("#BorrarPuntos").on("click", function (evt) {
            map.graphics.clear();
        });
        query("#xxx").on("click", function (evt) {
        });
      },

      onOpen: function(){
        var panel = this.getPanel();          
        ubicarPorCoordenadas.panel = panel;
        var width = 281;
        var height = 228;        
        ubicarPorCoordenadas.widthInicial = width;  
        ubicarPorCoordenadas.heightInicial = height;  
        ajustarTamanioWidget(panel, width, height);   
      },
      onClose: function(){       
        map.graphics.clear();
        document.getElementById("planas").style.display = "none";
        document.getElementById("Geog").style.display = "none";
        document.getElementById("botonBorrar").style.display = "none";
       },


     // methods to communication between widgets:
    });
function dibujarPunto(loc, attr) { 
  var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));
  //var symbol = new SimpleMarkerSymbol();
 
  //geometryService.simplify([loc], colocaTextoPunto);
  var newZoom = 5000;  
  map.setScale(newZoom);
  //capaGrafica.add(newPunto);
  map.centerAt(loc);
  var title = ubicarPorCoordenadas.title;
  var attributos = ubicarPorCoordenadas.atributo;
  var fields = ubicarPorCoordenadas.fields;
  var infotemplate = crearInfoTemplate(title, attributos, fields);
  console.log("loc");
  console.log(loc);
  var newPunto = new Graphic(loc, symbol, attr, infotemplate);
  console.log("newPunto");
  console.log(newPunto);
  map.graphics.add(newPunto);
  //map.graphics.add(labelPointGraphic);  
  //colocaTextoPunto(loc, attr);
};

function colocaTextoPunto(geometries, attr){    
  var labelPoint = geometries;
  var font = new Font("10px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
  if (attr.Xcoord != undefined) {
    var textSymbol = new TextSymbol("X: " + attr.Xcoord + ", Y: " + attr.Ycoord, font, new Color([206, 9, 18]));
  }else{
    var textSymbol = new TextSymbol("Latitud: " + attr.Latitud + ", Longitud: " + attr.Longitud, font, new Color([206, 9, 18]));
  }    
  var labelPointGraphic = new Graphic(labelPoint, textSymbol);
  crearInfoTemplate(title, attributos, fields);    
  map.graphics.add(labelPointGraphic);  
}   

function requestSucceeded(response, io) {
  ajustarExtend(response);  
}

function ajustarExtend(response) {
  var spatialRef = new SpatialReference({ wkid: 102100 });
  var extent = response.fullExtent;
  var spatialRef1 = new SpatialReference(3115);
  gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
  var extent2 = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, spatialRef1);
  gsvc.project([extent2], spatialRef, function (projectedPoints) {        
    pt = projectedPoints[0];
    var extentconver = new Extent(pt.xmin, pt.ymin, pt.xmax, pt.ymax, spatialRef);
    map.setExtent(extentconver);
  });
}

function requestFailed(error, io) {
  console.log(error);    
}


});

function toggle(elemento) {
  var panel = ubicarPorCoordenadas.panel;
  if (elemento.value == "ingresarPlanas") {
      document.getElementById("planas").style.display = "block";
      document.getElementById("Geog").style.display = "none";
      document.getElementById("botonBorrar").style.display = "block";
      mostrarCoorPlanas = true;      
  } else if (elemento.value == "ingresarGeograficas") {
      document.getElementById("planas").style.display = "none";
      document.getElementById("Geog").style.display = "block";
      document.getElementById("botonBorrar").style.display = "block";
      mostrarCoorPlanas = false;
      document.getElementById("botonBorrar").style.marginTop = "-4px";
  }
  var width = 281;
  var height = 429;
  ajustarTamanioWidget(panel, width, height);
}