var map = null;
var jsonTOC = [];
var TOC_state = null;
var jsonOrdenCapas = [];
var ordenCapas_state = null;
var este = null;
var primeraVez = true;
var jsonTablaServicios = null;

define(['dojo/_base/declare',
  'jimu/BaseWidget',
  "esri/layers/WMSLayer",
  "esri/SpatialReference",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/FeatureLayer",
  "esri/InfoTemplate",
  "./LayerLoader",
  "./util",
  "dojo/Deferred",
  "esri/request",
"jimu/PanelManager",
"esri/layers/RasterLayer", "esri/tasks/FeatureSet"

],
  function (declare, BaseWidget,
    WMSLayer, SpatialReference,
    ArcGISDynamicMapServiceLayer, FeatureLayer,
    InfoTemplate, LayerLoader, util, Deferred, esriRequest, PanelManager, RasterLayer, FeatureSet) {
    return declare(BaseWidget, {
      /**
       * Funcion de inicializacion del widget.
       */
      startup: function () {

        map = this.map;
        este = this;
        

        $('#widgets_TablaContenido_Widget_33_panel').find(".jimu-panel-title").find(".close-btn  ").after('<div class = "help-icon jimu-float-trailing" title = "Esta funcionalidad permite agregar o quitar capas al mapa"></div>');

        var urlServicioTOC = SERVICIO_TABLA_CONTENIDO;
        var rows = "";
        /**
         * LLamado a servicio que trae el json de la tabla de contenido del administrador.
         */
           primeraVez = true;
        $.ajax({
          type: 'GET',
          url: urlServicioTOC,
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          success: function (response) {
              rows = response;
              primeraVez = true;
              debugger
            for (var i = 0; i < rows.length; i++) {
              idTematica = rows[i].IDTEMATICA + 't';
              idCapaArbol = rows[i].IDCAPA + 'c' + getRandomID();
              idCapaMapa = rows[i].IDCAPA + 'c';
              nombreTematica = rows[i].NOMBRETEMATICA;
              tituloCapa = rows[i].TITULOCAPA;
              idTematicaPadre = rows[i].IDTEMATICAPADRE;
              visible = rows[i].VISIBLE;
              url = rows[i].URL;
              idCapaDeServicio = rows[i].NOMBRECAPA
              urlMetadatoCapa = rows[i].METADATOCAPA
              urlMetadatoServicio = rows[i].METADATOSERVICIO

              if (!idTematicaPadre) {
                idTematicaPadre = "#";
              } else {
                idTematicaPadre = idTematicaPadre + 't';
              }
              existeTematica = _.where(jsonTOC, { 'id': idTematica });
              newTematica = { "id": idTematica, "text": nombreTematica, "type": "tematica", "parent": idTematicaPadre };
              //En nombre tematica va el id para agregar el wms
              if (visible) {
                newCapa = { "id": idCapaArbol, "idCapaMapa": idCapaMapa, "text": Utf8Decode(tituloCapa), "type": "capa", "parent": idTematica, "seeShape": i, "state": { checked: true }, "url": url, "idCapaDeServicio": idCapaDeServicio, "urlMetadatoCapa": urlMetadatoCapa, "urlMetadatoServicio": urlMetadatoServicio };
                if (map.getLayer(idCapaMapa) == undefined) {
                   
                    agregarCapaMapa(newCapa);
                } 

              } else {
                  newCapa = { "id": idCapaArbol, "idCapaMapa": idCapaMapa, "text": Utf8Decode(tituloCapa), "type": "capa", "parent": idTematica, "seeShape": i, "state": { checked: false }, "url": url, "idCapaDeServicio": idCapaDeServicio, "urlMetadatoCapa": urlMetadatoCapa, "urlMetadatoServicio": urlMetadatoServicio };

              }

              if (existeTematica.length !== 0) {
                //ya existe la tematica en el JSON
                jsonTOC.push(newCapa);
              } else {
                //NO existe el servicio en el JSON
                jsonTOC.push(newTematica);
                if (rows[i].IDCAPA) {
                  jsonTOC.push(newCapa);
                }
              }

              }

            jsonTablaServicios = jsonTOC;
            createJSTreeTOC(jsonTOC);
            var panelManager = PanelManager.getInstance()
            panelManager.closePanel("widgets_TablaContenido_Widget_33_panel");
            
          },
          error: function (response) {
            var arbol = document.getElementById('JSTreeTOC');
            arbol.parentNode.removeChild(arbol);
            var p = document.createElement("p");
            var mensajeNoServicio = document.createTextNode("El servicio de la tabla de contenido no se encuentra disponible.");
            p.appendChild(mensajeNoServicio);
            var divContenedorTOC = document.getElementById("divContenedorTOC");
            divContenedorTOC.appendChild(p);


          }


        });

        //----------------------Funciones--------------------------//
        //Se dejan las funciones que usan jquery dentro del function principal, ya que si se dejan fuera de este no funcionan correctamente . //TO DO

        /**
         *  Funcion donde se define la estructura del arbol (JSTree) 
         */
        function createJSTreeTOC() {
          console.log(jsonTOC);
          debugger
          $('#JSTreeTOC').jstree({
            'core': {
              "check_callback": false,
              'data': jsonTOC
            },
            "types": {
              "#": {
                "valid_children": ["tematica"]
              },
              "tematica": {
                "icon": "fa fa-folder nz_tematica",
                "valid_children": ["tematica", "capa"]
              },
              "capa": {
                "icon": "fa fa-picture-o",
                "valid_children": []
              },
              "default": {
                draggable: false
              }
            },
            checkbox: {
              three_state: false, // to avoid that fact that checking a node also check others
              // three_state1: false, // to avoid that fact that checking a node also check others
              whole_node: false, // to avoid checking the box just clicking the node 
              tie_selection: false, // for checking without selecting and selecting without checking
              show_checkboxes: (e)=>{
                console.log(e);
              },
              hide_checkboxes: function (e) {
                console.log(e);
              }
            },
            "contextmenu": {
              "items": function (node) {
                var tree = $("#JSTreeServicios").jstree(true);
                ;
                var items = {
                  "opacidad": {
                    "separator_before": false,
                    "separator_after": false,
                    "label": '',
                    "_disabled": true,
                    "title": "Transparencia",
                    "action": function (obj) {

                    }
                  },
                  "metadatocapa": {
                    "separator_before": true,
                    "separator_after": false,
                    "label": "Metadato Capa",
                    "title": "Ver metadato capa",
                    "_disabled": false,
                    "urlMetadatoCapa": "",
                    "action": function (obj) {
                      //TODO : Abrir url del json de la toc, si no hay desactivar el item.
                      debugger
                      window.open(obj.item.urlMetadatoCapa, 'name');
                    }
                  },
                  "metadatoservicio": {
                    "separator_before": true,
                    "separator_after": false,
                    "label": "Metadato Servicio",
                    "title": "Ver metadato servicio",
                    "_disabled": false,
                    "urlMetadatoServicio": "",
                    "action": function (obj) {
                      //TODO : Abrir url del json de la toc, si no hay desactivar el item.
                      debugger
                      window.open(obj.item.urlMetadatoServicio, 'name');
                    }
                  },
                  "shape": {
                    "separator_before": false,
                    "separator_after": false,
                    "label": 'Descargar Shape',
                    "_disabled": false,
                    node,
                    "title": "Shape",
                    "action": function (nodoSelected) {
                      este.preparToExportShape(nodoSelected)
                    }
                  }
                };
                if (node.type === "capa") {
                  if (node.state.checked == false) {
                    delete items.opacidad;
                  } else {
                    items.opacidad.label = '<input type="range" min="0" max="100" value="' + (map.getLayer(node.original.idCapaMapa).opacity * 100) + '" class="slider" id="rangoTransparencia" idcapa="' + node.original.idCapaMapa + '">';

                  }
                  if (node.original.urlMetadatoCapa == "") {
                    items.metadatocapa._disabled = true;
                  } else {
                    items.metadatocapa.urlMetadatoCapa = node.original.urlMetadatoCapa;
                  }
                  if (node.original.urlMetadatoServicio == "") {
                    items.metadatoservicio._disabled = true;
                  } else {
                    items.metadatoservicio.urlMetadatoServicio = node.original.urlMetadatoServicio;
                  }

                  if (node.original.seeShape == 102) { // validaciones para saber si se descarga o no
                    items.shape._disabled = true
                  }
                }
                if (node.type === "tematica") {
                  delete items.opacidad;
                  delete items.metadatocapa;
                  delete items.metadatoservicio;
                  delete items.shape;
                }
                return items;
              }
            },
            "plugins": ["search", "types", "sort", "contextmenu", "checkbox", "wholerow"]
          }).on('copy_node.jstree', function (e, data) {
            debugger
            data.instance.set_id(data.node, data.original.id);
          }).on('ready.jstree', function () {
            debugger
            loadedTOC = true;
            $('#JSTreeTOC').jstree(true).set_state(TOC_state);
            $(".nz_tematica").parent().find(".jstree-checkbox").hide();
          });
        }

        /**
         *  Funcion donde se define la estructura del arbol (JSTree) 
         */
        function createJSTreeOrdenCapas() {
          $('#JSTreeOrdenCapas').jstree({
            'core': {
              "check_callback": true,
              'data': jsonOrdenCapas,
              'multiple': false
            },
            "types": {
              "#": {
                "valid_children": ["capa"]
              },
              "capa": {
                "icon": "fa fa-picture-o",
                "valid_children": []
                // "valid_children2": []
              }
            },
            "plugins": ["types", "dnd", "wholerow"]
          }).on('ready.jstree', function () {
            ordenCapas_state = true;
            $('#JSTreeOrdenCapas').jstree(true).set_state(ordenCapas_state);
          });
        }

        $(document).on('input', 'input#rangoTransparencia.slider', function () {
          debugger
          var opacity = $('input#rangoTransparencia.slider').val();
          var idCapa = $('input#rangoTransparencia.slider').attr("idcapa")
          map.getLayer(idCapa).setOpacity(opacity / 100);
        });

        // $(document).on("change", "input rangoTransparencia", function () {
        //   var a = 1;
        // });

        /**
         * Esconde el chechbox de los nodos que son tematicas
         */
        $('#JSTreeTOC').on('open_node.jstree', function (e, data) {
          debugger
          $(".nz_tematica").parent().find(".jstree-checkbox").hide();
        });
        /**
         * Agrega una capa que ha sido seleccionada en la tabla de contenido.
         */
        $('#JSTreeTOC').on("check_node.jstree", function (e, data) {
          debugger
          //var appconfig = this.getAppConfig();
          //var widget = appconfig.getConfigElementById('widgets_Legend_Widget_18');
          //var widgetId = widget.id;
          // this.openWidgetById('widgets_Legend_Widget_18');
          console.log("Este");
          console.log(este);
          primeraVez = false;
          agregarCapaMapa(data.node);
        });
        /**
         * Remueve una capa que ha sido seleccionada en la tabla de contenido.
         */
        $('#JSTreeTOC').on("uncheck_node.jstree", function (e, data) {
          debugger
          removerCapaMapa(data.node);
        });
        /**
         * Busca los nodos dentro de la tabla de contenido que coincidan 
         * con el valor de la busqueda en el elemento #buscarTOC.
         */
        $("#buscarTOC").change(function () {
          debugger
          $('#JSTreeTOC').jstree(true).search($(this).val());
        });
        /**
         * Busca en la tabla de contenido cuando se hace click en el boton de buscar.
         */
        $('#btnBuscarCapa').on('click', function (event) {
          debugger
          $('#JSTreeTOC').jstree(true).search($('#buscarTOC').val());
        });
        /**
         * Boton para apagar todas las capas que han sido activadas en la tabla de contenido.
         */
        $('#btnApagarCapas').on('click', function (event) {
          debugger
            var capasPrendidas = $('#JSTreeTOC').jstree("get_checked", true);
            var esCapaMunicipio = false;
            for (var a in capasPrendidas) {

                if (!capasPrendidas[a].id.indexOf("631c") == 0)
                {
                    console.log(capasPrendidas[a].id);
                    removerCapaMapa(capasPrendidas[a]);
                
                }

               
            

                /*
                if (capasPrendidas.id.indexOf("596c") == 0) {
                    esCapaMunicipio = true;
                } else {


                }
                */
          }
          

         // $('#JSTreeTOC').jstree("uncheck_all", true);
        });
        $('#orden-capas-tab').on('click', function (event) {
          debugger
          jsonOrdenCapas = [];
          var capas = map.graphicsLayerIds;
          for (var i in capas) {
            if (capas[i].endsWith('c')) {
              var capa = map.getLayer(capas[i]);
              newCapa = { "id": capa.id, "text": Utf8Decode(capa.name), "type": "capa", "parent": '#' };

              jsonOrdenCapas.push(newCapa);

            }
          }
          if (!ordenCapas_state) {
            createJSTreeOrdenCapas();
          } else {
            $('#JSTreeOrdenCapas').jstree(true).settings.core.data = jsonOrdenCapas;
            $('#JSTreeOrdenCapas').jstree(true).refresh();
          }

        });
        $(document).on('dnd_stop.vakata', function (e, data) {
debugger
          var ordenCapas = $('#JSTreeOrdenCapas').jstree(true).get_json('#', { flat: true });
          for (var i in ordenCapas) {
            map.reorderLayer(map.getLayer(ordenCapas[i].id), i);
          }

        });




      },
      onOpen: function () {
          console.log(this);
          if (window.appInfo.isRunInMobile) {
              $('#widgets_OverviewMap_Widget_23').hide();
              $('#ContadorVisitas').hide();
              $('#dijit__WidgetBase_0').hide();
              $('#uniqName_10_1').hide();
              $('#uniqName_10_6').hide();
              $('#uniqName_10_10').hide();
              $('#uniqName_10_11').hide();
              $('#uniqName_10_14').hide();
              $('#uniqName_10_18').hide();
              $('#uniqName_10_21').hide();
              $('#uniqName_10_23').hide();
              $('#uniqName_10_24').hide();
              $('#uniqName_10_25').hide();
              $('#widgets_Coordinate_Widget_28').hide();
          }

      },
      bindEvents: function () {
      },
      onExecute: function (featureSet) {
      },
      onClose: function () {
      },
      preparToExportShape: function (nodoSelected) {
        console.log("export shape");
        console.log("nodoSelected",nodoSelected);
        // const myGraphics = new Graphic(geometry?, symbol?, attributes?, infoTemplate?)
        const layer = este.map.getLayer(nodoSelected.item.node.original.idCapaMapa);
        if (!layer) {
          createDialogInformacionGeneral("!Nota","Antes de descargar el shape de esta capa, primero se debe pintar en el mapa.");
          return
        }
        console.log(layer);
        console.log(11111111111111);
        loader2(true)
        var featureSet = new FeatureSet();
        featureSet.features = layer.graphics;
        exportarShape(featureSet, "loader_2");
      },
    });


    /**
     * Agrega una capa de la tabla de contenido que ha sido seleccionada al mapa.
     * 
     * @param {Nodo jstree} capa 
     */
    function agregarCapaMapa(capa) {
debugger
      var loader = new LayerLoader();

      esriConfig.defaults.io.alwaysUseProxy = true;
      esriConfig.defaults.io.corsDetection = false;

      if (capa.original != undefined) {

        var idCapaMapa = capa.original.idCapaMapa;
        var visible = capa.state.checked;
        var tituloCapa = capa.text;
        var idCapaServicio = capa.original.idCapaDeServicio;
        var urlCapa = capa.original.url;
        actualizarCheckNodesCapasRepetidas(jsonTOC, capa.original.idCapaMapa, true);

      } else {

        var idCapaMapa = capa.idCapaMapa;
        var visible = capa.state.checked;
        var tituloCapa = capa.text;
        var idCapaServicio;
        var idCapaServicio = capa.idCapaDeServicio;
        var urlCapa = capa.url;
        var capasola = urlCapa;

      }


      urlCapa = urlCapa + "/" + idCapaServicio;
      url = util.checkMixedContent(urlCapa);
      var lc = url.toLowerCase();
      var id = idCapaServicio;
      layer = null;



      if (lc.indexOf("/featureserver") > 0 || lc.indexOf("/mapserver") > 0) {
        //Se usa feature para que la capa aparezca en las herramientas del builder.

        // if (tituloCapa == "Municipios 1:100.000") {

        //   layer = new FeatureLayer(url, {
        //     id: idCapaMapa,
        //     outFields: ["*"],
        //     showLabels: true,
        //     infoTemplate: new InfoTemplate()
        //   });
        //   map.addLayer(layer);
          // } else {
        //  "Modelo de sombras"


          if (tituloCapa == "Modelo de elevaci\u00f3n ") {
              console.log("si lo coge modelo");

              var urlMDE = SERVICIO_MDE;
          
              
              layer = new RasterLayer(urlMDE, {
                  id: idCapaMapa
              });
              
              // map.addLayer(layer);


              /*
              layer = new ArcGISDynamicMapServiceLayer("http://132.255.20.184:6080/arcgis/rest/services/QUINDIO_III/Modelo_de_Elevacion/MapServer", {
                  id: idCapaMapa
              });
              console.log(idCapaServicio);
              layer.setVisibleLayers([idCapaServicio]);

              */
              map.addLayer(layer);
            
          } else if (tituloCapa == "Modelo de sombras") {

              var urlMDS = SERVICIO_MDS;
              layer = new RasterLayer(urlMDS, {
                  id: idCapaMapa
              });
              map.addLayer(layer);
          } else {
              layer = new FeatureLayer(url, {
                  id: idCapaMapa,
                  outFields: ["*"],
                  showLabels: true,
                  infoTemplate: new InfoTemplate()
              });
              loader._waitForLayer(layer).then(function (lyr) {
                  loader._setFeatureLayerInfoTemplate(lyr);
                  map.addLayer(lyr);
              });
             
          }
        
          
        if (!primeraVez) {

            var widget = este.appConfig.getConfigElementById('widgets_Legend_Widget_18');
            var widgetId = widget.id;
            este.openWidgetById(widgetId);
        }
        primeraVez = false;
          
      }
      esriConfig.defaults.io.alwaysUseProxy = false;





    }

    /**
     * Genera un numero aleatorio para el id del nodo dentro de la tabla de contenido, para poder tener capas repetidas en diferentes tematicas.
     */
    function getRandomID() {
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var stringLength = 4;
      return Array.apply(null, new Array(stringLength)).map(function () {
        return possible[Math.floor(Math.random() * possible.length)];
      }).join('');

    }
    /**
     * Remueve una capa del mapa que ha sido deselccionada de la talba de contenido.
     * 
     * @param {Nodo JSTree} capa 
     */
    function removerCapaMapa(capa) {
debugger
        var idCapa = capa.id;
        console.log(idCapa);
        console.log(idCapa.indexOf("631c"));
        //if (!idCapa.indexOf("596c") == 0) {
          
          
          if (map.getLayer(capa.original.idCapaMapa) != undefined) {
            map.removeLayer(map.getLayer(capa.original.idCapaMapa));
          }
          actualizarCheckNodesCapasRepetidas(jsonTOC, capa.original.idCapaMapa, false);
        //}
    }

    /**
     * Funcion para codificar los caracteres con tildes.
     * 
     * @param {String} strUtf 
     */
    function Utf8Decode(strUtf) {
      // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
      if (strUtf != undefined) {
        var strUni = strUtf.replace(
          /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
          function (c) {  // (note parentheses for precedence)
            var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
            return String.fromCharCode(cc);
          }
        );
        strUni = strUni.replace(
          /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
          function (c) {  // (note parentheses for precedence)
            var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
            return String.fromCharCode(cc);
          }
        );
        return strUni;
      }
      return "";
    }



    /**
     * Marca o desmarca el check box de los nodos repetidos en la tabla de contenido.
     * 
     * @param {json} obj 
     * @param {string} val 
     * @param {string} check 
     */
    function actualizarCheckNodesCapasRepetidas(obj, val, check) {
      debugger
      var objects = [];
      for (var i in obj) {
        if (obj[i].id.startsWith(val)) {
          obj[i].state.checked = check;
          // obj[i].state1.checked = check;
          // 
          if (check) {
            $('#JSTreeTOC').jstree(true).check_node([obj[i].id]);
          } else {
            $('#JSTreeTOC').jstree(true).uncheck_node([obj[i].id]);
          }
        }
      }
    }

  });



