var panelTablaResultados;
var symbolExterno;
var symbolExternoPunto;
var symbolSeleccionado;
var symbolSeleccionadoPunto;
var symbolSeleccionadoLinea;
var symbolHerramienta;
var _self
var featuresTabla;

define(['dojo/_base/declare',
  'jimu/BaseWidget',
  "esri/map",
  "esri/SpatialReference",
  "esri/geometry/Extent",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
  'dojo/_base/lang',
  'dojo/data/ItemFileWriteStore',
  'dojox/grid/DataGrid',
  'dojo/query',
  'dojo/dom-style',
  "esri/tasks/Geoprocessor",
  "esri/geometry/Point",
  "dojox/grid/EnhancedGrid",
  "dojox/grid/enhanced/plugins/Pagination",
  "dojo/data/ItemFileWriteStore",
],
  function (declare, BaseWidget, Map, SpatialReference, Extent,
    SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Color, lang, ItemFileWriteStore,
    DataGrid, dojoQuery, domStyle, Geoprocessor, Point) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-tablaResultados',

      //this property is set by the framework when widget is loaded.
      name: 'Resultados',


      //methods to communication with app container:

      postCreate: function () {

      },

      startup: function () {
        _self = this;
        panelTablaResultados = this.getPanel();
        topic.subscribe("eventoTablaResultados", this.llenarTablaDibujarResultados);

        symbolExterno = new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([47, 250, 246]),
          4
        );

        symbolSeleccionado = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([47, 250, 246]), 4), new Color([255, 255, 0, 0.7])
        );

        symbolExternoPunto = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([255, 0, 0]), 1),
          new Color([255, 0, 0, 1]));

        symbolSeleccionadoPunto = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([47, 250, 246]), 1),
          new Color([0, 255, 255, 0.25]));

        symbolSeleccionadoLinea = new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([255, 255, 0]),
          4
        );


        $("#btnGenerarReporteCsv").click(function () {
          _self.exportarTabla();
        });
        $("#btnExportarShapeFile").click(function () {
          _self.exportarShapeFile();
        });


      },

      onOpen: function () {
        console.log('onOpen');
        this.ajustarTamanioWidget();

      },

      // onClose: function(){
      //   console.log('onClose');
      // },

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

      llenarTablaResultados: function (features) {
        featuresTabla = features;
        var columnas = [];
        for (var i in features.fieldAliases) {
          columnas.push({
            'name': i,
            'field': i,
            'width': "150px"
          });


        }

        var layout = [columnas];

        var data = {
          identifier: "id",
          items: []
        };

        for (var i in features.features) {

          data.items.push(lang.mixin({ id: i },
            features.features[i].attributes));
          if (i == 1) {
            symbolHerramienta = features.features[i].symbol;
          }
        }

        var store = new ItemFileWriteStore({ data: data });


        if (dijit.byId("ResultadosGrid") != undefined) {
          dijit.byId("ResultadosGrid").destroy();
        }

        var grid = new dojox.grid.EnhancedGrid({
          id: 'ResultadosGrid',
          store: store,
          structure: layout,
          rowSelector: '10px',
          style: "width: 420px;",
          selectionMode: 'single',
          autoWidth: false,
          autoHeight: false,
          selectable: true,
          plugins: {
            pagination: {
              pageSizes: ["20", "All"],
              description: true,
              sizeSwitch: true,
              pageStepper: true,
              /*page step to be displayed*/
              maxPageStep: 2,
              /*position of the pagination bar*/
              position: "bottom"
            }
          },
          canSort: function (col) {
            return true;
          }
        });

        grid.on("RowClick", function (evt) {
          _self.selectedRowGridTabla(evt);
        }, true);

        grid.placeAt("divTablaResultadosGrid");

        grid.startup();
        grid.update();


      },

      selectedRowGridTabla: function (evt) {

        for (var i in featuresTabla.features) {
          var f = featuresTabla.features[i];
          if (f.attributes[Object.keys(f.attributes)[0]] == dijit.byId("ResultadosGrid").selection.getSelected()[0][Object.keys(dijit.byId("ResultadosGrid").selection.getSelected()[0])[1]][0]) {

            if (f.geometry.type == "point") {
              f.setSymbol(symbolSeleccionadoPunto);
              map.centerAndZoom(f.geometry, 16);
            } else {
              if (f.geometry.type == "polyline") {
                f.setSymbol(symbolSeleccionadoLinea);
              } else {
                f.setSymbol(symbolSeleccionado);
              }
              var extent = f._extent;
              extent = extent.expand(1.5);
              map.setExtent(extent);
            }

          } else {
            f.setSymbol(symbolHerramienta);
          }
        }

      },

      llenarTablaDibujarResultados: function (e) {
        featuresTabla = e.featuresResultados;
        console.log(e);
        var columnas = [];
        for (var i in e.featuresResultados.fields) {
          columnas.push({
            'name': e.featuresResultados.fields[i].name,
            'field': e.featuresResultados.fields[i].name,
            'width': "150px"
          });


        }

        var layout = [columnas];

        var data = {
          identifier: "id",
          items: []
        };

        for (var i in e.featuresResultados.features) {

          data.items.push(lang.mixin({ id: i },
            e.featuresResultados.features[i].attributes));
        }

        var store = new ItemFileWriteStore({ data: data });


        if (dijit.byId("ResultadosGrid") != undefined) {
          dijit.byId("ResultadosGrid").destroy();
        }

        var grid = new dojox.grid.EnhancedGrid({
          id: 'ResultadosGrid',
          store: store,
          structure: layout,
          rowSelector: '10px',
          style: "width: 420px; height: 190px;",
          selectionMode: 'single',
          autoWidth: false,
          autoHeight: false,
          selectable: true,
          plugins: {
            pagination: {
              pageSizes: ["20", "All"],
              description: true,
              sizeSwitch: false,
              pageStepper: true,
              /*page step to be displayed*/
              maxPageStep: 3,
              /*position of the pagination bar*/
              position: "bottom"
            }
          },
          canSort: function (col) {
            return true;
          }
        });

        grid.on("RowClick", function (evt) {
          _self.selectedRowGrid(evt);
        }, true);

        grid.placeAt("divTablaResultadosGrid");

        grid.startup();
        grid.update();

        console.log(e.featuresResultados.features);
        var features = e.featuresResultados.features;
        for (var i in features) {



          var graphic = features[i];
          graphic.id = i;
          if (features[0].geometry.type == "point") {
            graphic.setSymbol(symbolExternoPunto);
          } else {
            graphic.setSymbol(symbolExterno);
          }
          map.graphics.add(graphic);

        }
        if (features.length == 1 && features[0].geometry.type == "point") {
          loc = new Point(features[i].geometry.x, features[i].geometry.y, appGlobal.map.spatialReference);
          var newZoom = 750;
          map.setScale(newZoom);
          map.centerAt(loc);
        }
        else {
          var spatialRef1 = new SpatialReference(map.spatialReference);
          var extent = esri.graphicsExtent(features);
          var extentconver = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, spatialRef1);
          extentconver = extentconver.expand(1.5);
          map.setExtent(extentconver);
        }
      },

      selectedRowGrid: function (evt) {

        var graficasMapa = map.graphics.graphics;
        for (var i in graficasMapa) {
          var grafica = graficasMapa[i];
          if (grafica.id == dijit.byId("ResultadosGrid").selection.getSelected()[0].id[0]) {
            if (grafica.geometry.type == "point") {
              grafica.setSymbol(symbolSeleccionadoPunto);
              map.centerAndZoom(grafica.geometry, 16);
            } else {
              if (grafica.geometry.type == "polyline") {
                grafica.setSymbol(symbolSeleccionadoLinea);
              } else {
                grafica.setSymbol(symbolSeleccionado);
              }
              var extent = grafica._extent;
              extent = extent.expand(1.5);
              map.setExtent(extent);
            }

          } else {

            if (grafica.geometry.type == "point") {
              grafica.setSymbol(symbolExternoPunto);
            } else {
              grafica.setSymbol(symbolExterno);
            }
          }
        }


      },

      ajustarTamanioWidget: function () {

        panelTablaResultados.position.width = 455;
        panelTablaResultados.position.height = 290;
        panelTablaResultados.position.left = 74;
        panelTablaResultados.position.top = 94;
        panelTablaResultados._originalBox = {
          w: panelTablaResultados.position.width,
          h: panelTablaResultados.position.height,
          l: panelTablaResultados.position.left || 0,
          t: panelTablaResultados.position.top || 0
        };
        panelTablaResultados.setPosition(panelTablaResultados.position);
        panelTablaResultados.panelManager.normalizePanel(panelTablaResultados);

        for (var i = 0; i < (dojoQuery(".dojoxResizeHandle.dojoxResizeNW")).length; i++) {

          domStyle.set(dojoQuery(".dojoxResizeHandle.dojoxResizeNW")[i],
            'display',
            'none');

        }

      },



      exportarShapeFile: function () {

        var urlServicioExportarShape = SERVICIO_SHAPEFILE;
        if (featuresTabla.features.length > 0) {

          var featureSet = new esri.tasks.FeatureSet(featuresTabla.features);

          var gp = new Geoprocessor(urlServicioExportarShape);
          var params = {
            "featureDataSet": featuresTabla
          };

          gp.execute(params, exportarShapeCompleto);

          function exportarShapeCompleto(e) {
            console.log(e);
          }


        }

      },


      exportarTabla: function () {

        //ResultadosJson
        var ReportTitle = "Resultados";
        var ShowLabel = true;
        ResultadosJson = dijit.byId("ResultadosGrid").store._arrayOfAllItems;
        if (ResultadosJson.length != 0) {
          //JSONData = "["+ JSONData +"]";
          var arrData = typeof ResultadosJson != 'object' ? JSON.parse(ResultadosJson) : ResultadosJson;
          if (arrData[0] == undefined) {
            ResultadosJson = "[" + ResultadosJson + "]";
            arrData = typeof ResultadosJson != 'object' ? JSON.parse(ResultadosJson) : ResultadosJson;
          }
          var CSV = '';

          //CSV += ReportTitle + '\r\n\n';

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


    });
  });