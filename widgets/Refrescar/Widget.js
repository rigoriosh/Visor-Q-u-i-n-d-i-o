define(['dojo/_base/declare', 'jimu/BaseWidget'],
  function(declare, BaseWidget) {
    return declare([BaseWidget], {
      baseClass: 'jimu-widget-refrescar',
      name: 'Refrescar',
      /**
       * Boton para refrescar las capas del mapa.
       */
      _btnRefrescarMapaClicked: function(){
        var layersId = map.layerIds;
        for (var i in layersId){
          map.getLayer(layersId[i]).refresh();
        }
        var graphicLayers = map.graphicsLayerIds;
        for (var i in graphicLayers){
          map.getLayer(graphicLayers[i]).refresh();
        }
      }

    });
  });