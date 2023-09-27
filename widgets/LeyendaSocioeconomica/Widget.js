var panelLeyenda;
define(['dojo/_base/declare',
  'jimu/BaseWidget',
  'dojo/topic'],
  function (declare,
    BaseWidget,
    topic) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      // postCreate: function() {
      //   this.inherited(arguments);
      //   console.log('postCreate');
      // },

      startup: function () {
        panelLeyenda = this.getPanel();
        console.log('startup');
        topic.subscribe("leyendaSocioeconomica", this.llenarWidget);
        this.ajustarTamanioWidget();
      },

      onOpen: function () {
        console.log('onOpen');

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
      llenarWidget: function (e) {
        $("#listaLeyenda").empty();
        $("#tituloListaLeyenda").text(e.titulo);
        var listaLeyenda = e.configLeyenda;
        for (var i in listaLeyenda) {
          $("#listaLeyenda").append(
            '<li>' +
            '<div class="squareLeyenda" style="background:rgb(' + listaLeyenda[i].colorLine + ');"></div><label class="textLeyenda">' + listaLeyenda[i].label + '</label>' +
            '</li>'

          );
        }

        if (e.titulo == "NBI - Total Cve" ||  e.titulo == "Cobertura del servicio público"){

          panelLeyenda.position.width = 250;
          panelLeyenda.position.height = 230;
          panelLeyenda._originalBox = {
            w: panelLeyenda.position.width,
            h: panelLeyenda.position.height,
            l: panelLeyenda.position.left || 0,
            t: panelLeyenda.position.top || 0
          };
          panelLeyenda.setPosition(panelLeyenda.position);
          panelLeyenda.panelManager.normalizePanel(panelLeyenda);

        }
      },

      ajustarTamanioWidget: function () {

        if(typeof(consultaAmbiental) != "undefined"){
          consultaAmbiental.panelLeyendaSocioEconomica = panelLeyenda;
        }        
        panelLeyenda.position.width = 180;
        panelLeyenda.position.height = 230;
        panelLeyenda._originalBox = {
          w: panelLeyenda.position.width,
          h: panelLeyenda.position.height,
          l: panelLeyenda.position.left || 0,
          t: panelLeyenda.position.top || 0
        };
        panelLeyenda.setPosition(panelLeyenda.position);
        panelLeyenda.panelManager.normalizePanel(panelLeyenda);
      }
    });
  });