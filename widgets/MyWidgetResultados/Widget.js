var myFeatureTable = "null";
var extentInicial, panelManager, widgetCerrar;
var operacionRealizarGlobal;
var ResultadosJson;
var resultados;
var ulrImagen = URL_ARCHIVOS_QUINDIO;
var informacionImagen = "";
var widgetResultados = {};
define(['dojo/_base/declare', 'jimu/BaseWidget', "dojo/_base/json",
    "dojo/_base/array", "dojo/string", "esri/request", "jimu/PanelManager",
    "dojo/domReady!"],
    function (declare, BaseWidget, PanelManager) {

        var widgetOpen = false;
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            startup: function () {
                extentInicial = null;
                extentInicial = this.map.extent;
                setearMapa(this);

            },

            onOpen: function () {
                window.widgetOpen = true;
                var panel = this.getPanel();

                panel.position.width = 1000;
                panel.position.height = 300;
                panel._originalBox = {
                    w: panel.position.width,
                    h: panel.position.height,
                    l: panel.position.left || 0,
                    t: panel.position.top || 0
                };
                panel.setPosition(panel.position);
                panel.panelManager.normalizePanel(panel);
                var widgetResultados = this.appConfig.getConfigElementById('widgets_MyWidgetResultados_Widget_40');

                var divCarga = document.getElementById("loadingFeatureTable");
                divCarga.style.visibility = 'visible';
                cargarTablaResultados(widgetResultados);
                divCarga.style.visibility = 'hidden';
                window.widgetOpen = true;


                document.getElementById("btnImagen").style.display = 'none';
            },

            onClose: function () {
           

                for (var i = appGlobal.widgetManager.loaded.length; i > 0; i--) {
                    var idWidgets = appGlobal.widgetManager.loaded[i - 1].id;
                
                    if (window.widgetOpen && idWidgets == "widgets_MyWidgetResultados_Widget_40") {
                        window.widgetOpen = false;
                        cerrarWidgetResultados();                                    
                        break;
                    }
                }

            },
        });
    })


function cerrarWidgetResultados() {
    require(["jimu/PanelManager"],
        function (PanelManager) {
            /////codigo q cierra el widgetResultados
            this.widgetResultados.cerradoManual = 0;
            var panelManager = PanelManager.getInstance();
            var widgetCerrar;            
            for (var e in PanelManager.getInstance().panels) {
                if (PanelManager.getInstance().panels[e].id == "widgets_MyWidgetResultados_Widget_40_panel") {
                    widgetCerrar = PanelManager.getInstance().panels[e].id;
                }

            }            
            var ajustar = true;
            if (widgetCerrar != undefined) {
                panelManager.closePanel("widgets_MyWidgetResultados_Widget_40_panel");
                panelManager.destroyPanel("widgets_MyWidgetResultados_Widget_40_panel");             
                ajustar = false;

                var currentLayer = appGlobal.map.getLayer("capaResultadoCA"); 
                console.log(currentLayer);
                if (currentLayer != null) {
                    console.log(appGlobal.map);
                    appGlobal.map.removeLayer(currentLayer);
                    appGlobal.map.graphics.clear();
                    console.log(appGlobal.map);
                }
            }
            widgetOpen = false;
        }
      )
};

var objetoMapa = null;
function cargarTablaResultados(widget) {
    require(["esri/layers/FeatureLayer",
	"esri/tasks/query",
	"esri/dijit/FeatureTable",
	"dojo/dom",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/SimpleFillSymbol",
	"esri/Color",
	"esri/symbols/SimpleMarkerSymbol",
	"dojo/parser",
	"dojo/ready",
	"esri/tasks/GeometryService",
	"esri/SpatialReference",
	"esri/tasks/ProjectParameters",
	"esri/geometry/Extent",
	"esri/geometry/Point",
    "esri/geometry/Polyline",
	"esri/graphicsUtils",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/Color",
	"esri/renderers/UniqueValueRenderer",
	"esri/graphic"],
		function (FeatureLayer, Query, FeatureTable, dom,
			SimpleLineSymbol,
            SimpleFillSymbol,
            Color, SimpleMarkerSymbol, parser, ready, GeometryService, SpatialReference, ProjectParameters, Extent, Point, Polyline, graphicsUtils, SimpleFillSymbol, SimpleLineSymbol, Color, UniqueValueRenderer, Graphic) {
		    var urlCapa = widget.urlCapa;
		    console.log(urlCapa);
		    var camposCapa = widget.camposMostrar;
		    var expresion = widget.expresionConsultar;
		    var tipoGeometria;
		    var operacionRealizar = widget.operacionRealizar;
		    operacionRealizarGlobal = operacionRealizar;
		    var resultados = widget.resultados;
		    
		    ResultadosJson = widget.resultadosJson;


		    if (operacionRealizar == "consultas") {
		        var myFeatureLayer = new FeatureLayer(urlCapa, {
		            mode: FeatureLayer.MODE_ONDEMAND,
		            outFields: camposCapa,
		            definitionExpression: expresion,
		            visible: true,
		            id: "capaResultadoCA",
		        });

		   
		        if (myFeatureLayer != null) {
		            objetoMapa.addLayer(myFeatureLayer);
		        }

		        myTable = new FeatureTable({
		            featureLayer: myFeatureLayer,
		            showGridMenu: true,
		            showAttachments: true,
		            // only allows selection from the table to the map 
		            syncSelection: true,
		            gridOptions: {
		                allowSelectAll: true,
		                allowTextSelection: true,
		            },
		            "map": objetoMapa
		        },
					"myTableNode"
				);

		        var divCarga = document.getElementById("loadingFeatureTable");
		        divCarga.style.visibility = 'hidden';

		        myTable.startup();

		        myTable.on("row-select", function (evt) {
		            myTable.getFeatureDataById(myTable.selectedRowIds).then(function (features) {

		                var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255, 1]), 3), new Color([110, 196, 174, 0.8]));
                    
		                var geometria = features.features[0].geometry;
		                var graphic = new Graphic(geometria, symbol);
		                objetoMapa.graphics.clear();
		                objetoMapa.graphics.add(graphic);
		                if (features.geometryType == "esriGeometryPoint") {
		                    tipoGeometria = "Punto";
		                } else {
		                    tipoGeometria = "Poligono";
		                }
		                var atributos = features.features[0].attributes;
		                var jsonconvertido = JSON.stringify(atributos);
		                var resultadojson = jsonconvertido.split(",");
		                console.log(resultadojson);
		                var infoImagen = "";
		                var valor;
		                var valorsolo;
		                var valoresCompleto = [];
		                for (var i = 0; i < resultadojson.length; i++) {
		                    valor = resultadojson[i].split(":");
		                    if (valor.length > 1) {
		                        valorsolo = valor[1].split("}");
		                    } else {
		                        valorsolo = valor[0].split("}");
		                    }
		                    valoresCompleto.push(valorsolo[0]);

		                    if (valorsolo[0].indexOf("IMAGENES") > -1) {
		                        infoImagen = valorsolo[0].replace(/['"]+/g, '');
		                    }
		                }
		                if (infoImagen != "") {
		                    document.getElementById("btnImagen").style.display = 'inline';
		                    informacionImagen = ulrImagen + infoImagen;
                            
		                    //informacionImagen = infoImagen;
		                }
		                console.log(informacionImagen);
		                var extentT = esri.graphicsExtent(features.features);
		                var sistemaRefSalida = { wkid: objetoMapa.spatialReference };

		                var extentConver = new Extent(extentT.xmin, extentT.ymin, extentT.xmax, extentT.ymax, sistemaRefSalida);		                

		                realizarExtent(extentT, tipoGeometria, features);

		            });
		        });
		        myFeatureTable = "tengoAlgo";
		    }
		    else if (operacionRealizar == "buffer") {
		        var arreglo = widget.myIdFeatureLayers;
		        ResultadosJson = widget.json;

		        for (var i = 0; i <= arreglo.length; i++) {
		            if (i == (arreglo.length - 1)) {
		                expresion += "OBJECTID = " + arreglo[i];
		                break;
		            } else {
		                expresion += "OBJECTID = " + arreglo[i] + " OR ";
		            }
		        }
		        var myFeatureLayer = new FeatureLayer(urlCapa, {
		            mode: FeatureLayer.MODE_ONDEMAND,
		            outFields: camposCapa,
		            definitionExpression: expresion,
		            visible: true,
		            id: "capaResultadoCA",
		        });		        
		        myTable = new FeatureTable({
		            featureLayer: myFeatureLayer,
		            showGridMenu: true,
		            "map": objetoMapa
		        },
					"myTableNode"
				);
		        var divCarga = document.getElementById("loadingFeatureTable");
		        divCarga.style.visibility = 'hidden';
		        myTable.startup();
		        var tmanoPoligonos = objetoMapa.graphics.graphics.length;
		        var poligonos = [];
		        for (var a = 0; a < tmanoPoligonos; a++) {
		            poligonos[a] = objetoMapa.graphics.graphics[a];
		        }		        
		        var symbolPoligonos = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255, 0, 0, 1]), 3), new Color([255, 128, 0, 0.15]));
		        var symbolPunto = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));
		        var symbolBuffer = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255, 128, 0, 1]), 3), new Color([255, 0, 0, 0.15]));
		        myTable.on("row-select", function (evt) {
		            myTable.getFeatureDataById(myTable.selectedRowIds).then(function (features) {
		                var IdfeatureSeleccionado = features.features[0].attributes.OBJECTID;
		                var geometriafeatureSeleccionado;
		                for (var a in poligonos) {
		                    if (IdfeatureSeleccionado == poligonos[a].id) {
		                        geometriafeatureSeleccionado = poligonos[a].geometry;
		                        break;
		                    }
		                }
		                var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255, 0.5]), 3), new Color([110, 196, 174, 0.4]));
		                var polylineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255, 0, 0, 1]), 3);
		                var polylineSymbol1 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color("green"), 5);
		                if (objetoMapa.graphics.graphics.length >= tmanoPoligonos) {
		                     objetoMapa.graphics.clear();
		                         var geometria = poligonos[0].geometry;
		                         var graphic = new Graphic(geometria, symbolPunto);
		                         objetoMapa.graphics.add(graphic);
		                         geometria = poligonos[1].geometry;
		                         var graphic = new Graphic(geometria, symbolBuffer);
		                        objetoMapa.graphics.add(graphic);
		                    for (var a = 0; a < (tmanoPoligonos - 2) ; a++) {
		                        var geometria = poligonos[a + 2].geometry;

		                        if (features.geometryType == "esriGeometryPolyline") {
		                            var polyline = new Polyline({
		                                "paths": [
                                            geometria.paths[0]
		                                ],
		                                "spatialReference": {
		                                    "wkid": objetoMapa.spatialReference.wkid
		                                }
		                            });
		                            var graphic = new Graphic(polyline, polylineSymbol);
		                        } else {
		                            var graphic = new Graphic(geometria, symbolPoligonos);
		                        }
		                        objetoMapa.graphics.add(graphic);
		                    }


		                }
		                for (var i = objetoMapa.graphics.graphics.length; i > 0; i--) {
		                    if (poligonos[i] === undefined) {		                        
		                    } else if (features.features[0].attributes.OBJECTID == poligonos[i].id) {
		                        featureA_Resaltar = poligonos[i];
		                        break;
		                    }
		                }
		                if (features.geometryType == "esriGeometryPolyline") {
		                    var polyline = new Polyline({
		                        "paths": [
                                    geometriafeatureSeleccionado.paths[0]
		                        ],
		                        "spatialReference": {
		                            "wkid": objetoMapa.spatialReference.wkid
		                        }
		                    });
		                    var graphic = new Graphic(polyline, polylineSymbol1);
		                    objetoMapa.setExtent(geometriafeatureSeleccionado.getExtent());
		                    objetoMapa.graphics.add(graphic);
		                } else if (features.geometryType == "esriGeometryPoint") {
		                    var x = geometriafeatureSeleccionado.x;
		                    var y = geometriafeatureSeleccionado.y;
		                    var referenciaEspacial = geometriafeatureSeleccionado.spatialReference;
		                    var nuevoPunto = new Point(x, y,  map.spatialReference);
		                    for (var i = 0; i <= 2; i++) {
								map.setScale(lods[9].scale);
		                        map.centerAt(nuevoPunto);
		                       
		                    }
		                } else {
		                    var geometria = featureA_Resaltar.geometry;
		                    var graphic = new Graphic(geometria, symbol);
		                    objetoMapa.graphics.add(graphic);
		                    objetoMapa.centerAt(featureA_Resaltar.geometry.getCentroid());
		                    objetoMapa.setExtent(featureA_Resaltar.geometry.getExtent());
		                }
		            });
		        });
		    }
		});
}

function setearMapa(mapa) {
    objetoMapa = mapa.map;
}
function Exportar() {
    //ResultadosJson
    var ReportTitle = "Resultados";
    var ShowLabel = true;    
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

        alert("No  hay elementos")
    }

}
function verImagen() {

    var elem = document.createElement("img");
    elem.setAttribute("src", URL_ARCHIVOS_QUINDIO + "SIG_QUINDIO/IMAGENES/INDUSTRIA%20Y%20COMERCIO/CIRCASIA/circasia%20563.jpg");
    elem.setAttribute("height", "200");
    elem.setAttribute("width", "150");
    elem.setAttribute("alt", "Flower");
    document.getElementById("divModalcontenido").appendChild(elem);
   
}


function createDialog() {
    require(["dijit/Dialog", "dojo/domReady!"], function (Dialog) {
        dialog = new Dialog({
            title: "<B> Imagen </B>",
            content: "<img src='" + informacionImagen + "' style='width:300px;height:300px;'>"
            // style: "width: 400px"
        });

        dialog.show();
    });
}
function realizarExtent(resultado, tGeometria, geometria) {
    var nivelZoom;

    if (tGeometria == "Punto") {
        nivelZoom = objetoMapa.getMaxZoom();
      
        objetoMapa.centerAndZoom(geometria.features[0].geometry, nivelZoom - 1);
    } else {
        objetoMapa.setExtent(resultado);
    }
}
