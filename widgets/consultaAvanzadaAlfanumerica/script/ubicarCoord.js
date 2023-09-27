var mostrarCoorPlanas = true; var spatialRef3115;
require([
    "dojo/on", "esri/SpatialReference", "dojo/dom", "esri/symbols/SimpleMarkerSymbol", "esri/graphic",
    "dojo/query", "esri/layers/GraphicsLayer", "esri/geometry/Point", "esri/geometry/webMercatorUtils",
    "esri/tasks/GeometryService", "esri/InfoTemplate"
],
  function (on, SpatialReference, dom, SimpleMarkerSymbol, Graphic, query, GraphicsLayer, Point, webMercatorUtils,
      GeometryService, InfoTemplate) {
      var capaGrafica = new GraphicsLayer();
      query(".toolUbicarCoor").on("click", function (evt) {
          var spatialRef = new SpatialReference({ wkid: 4326 });
          var spatialRef3115 = new SpatialReference(3115);
          map.addLayer(capaGrafica);
          if (mostrarCoorPlanas) {
              var coorX = parseInt(document.getElementById("coorX").value);
              var coorY = parseInt(document.getElementById("coorY").value);
               gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
              //gsvc = new GeometryService("http://200.21.93.53/ArcGIS/rest/services/Quindio_Fase_II/Geometry/GeometryServer");
               var loc = new Point(coorX, coorY, spatialRef3115);
              gsvc.project([loc], spatialRef, function (projectedPoints) {
                  pt = projectedPoints[0];               
                  attr = { "Xcoord": loc.x, "Ycoord": loc.y };
                  dibujarPunto(pt, attr);
              });
          } else {
              var gradosLati = document.getElementById("grados").value;
              var minuLati = document.getElementById("minutos").value;
              var segunLati = document.getElementById("Segundos").value;
              var gradosLongi = document.getElementById("grados1").value;
              var minuLongi = document.getElementById("minutos1").value;
              var segunLongi = document.getElementById("Segundos1").value;
              if (gradosLongi < 0) {
                  longitud = -((segunLongi / 3600) * 1) - ((minuLongi / 60) * 1) + (1 * gradosLongi);
              } else {
                  longitud = (gradosLongi * 1) + ((minuLongi * 1) / 60) + ((segunLongi * 1) / 3600);
              }
              if (gradosLati < 0) {
                  latitud = -((segunLati / 3600) * 1) - ((minuLati / 60) * 1) + (1 * gradosLati);
              } else {
                  latitud = (gradosLati * 1) + ((minuLati * 1) / 60) + ((segunLati * 1) / 3600);
              }             
              var loc = new Point(longitud, latitud, spatialRef);
              var attr = {
                  "Latitud": "° " + gradosLati + " ' " + minuLati + " '' " + segunLati,
                  "Longitud": "° " + gradosLongi + " ' " + minuLongi + " '' " + segunLongi
              };
              dibujarPunto(loc, attr);
          }
      });
      function dibujarPunto(loc, attr) {      
          var infoTemplate = new InfoTemplate("Coordenadas");
          capaGrafica.setInfoTemplate(infoTemplate);    
          var symbol = new SimpleMarkerSymbol();
          var newPunto = new Graphic(loc, symbol, attr);
          var newZoom = 750;
          map.setScale(newZoom);
          capaGrafica.add(newPunto);
          map.centerAt(loc);    
      };   
      on(dom.byId("Borrar"), "click", function () {
          capaGrafica.clear();
      });
  });
function toggle(elemento) {
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
    }
}