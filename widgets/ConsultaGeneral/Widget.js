
var url;
var consultarPor;


define(['dojo/_base/declare', 'jimu/BaseWidget'],
  function(declare, BaseWidget) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget'

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      // postCreate: function() {
      //   this.inherited(arguments);
      //   console.log('postCreate');
      // },

      // startup: function() {
      //  this.inherited(arguments);
      //  this.mapIdNode.innerHTML = 'map id:' + this.map.id;
      //  console.log('startup');
      // },

      // onOpen: function(){
      //   console.log('onOpen');
      // },

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

    });
  });
  
function configureDropDownListTematica(selTematica) {


		 var tematicaSeleccionada = selTematica.value;
		 console.log(tematicaSeleccionada);
		 if(tematicaSeleccionada != 0 ){
		    url =tematicaSeleccionada;
			 var tematica = [];
			 tematica =  tematicaSeleccionada.split("/");
			 console.log(tematica[7]);
			 
			 if(tematica[7] == "Educacion"){
			  
		
			   insertarCamposEducacion();
			 }
			 else if(tematica[7] == "Salud"){
			   
			   insertarCamposSalud();
			 
			 }
			 else if(tematica[7] == "CulturaTurismo_T"){
			  
			   insertarCamposCulturaTurismo();
			 }
		}else{
		 
		   selConsultaPor.options.length = 0;
		    var optsel = document.createElement('option');
			optsel.value = "Seleccione...";
			optsel.text = "Seleccione...";
			selConsultaPor.options.add(optsel);
		 
		}
}

function insertarCamposEducacion(){

   selConsultaPor.options.length = 0;
   var optsel = document.createElement('option');
	optsel.value = "Seleccione...";
	optsel.text = "Seleccione...";
	selConsultaPor.options.add(optsel);
   var opt = document.createElement('option');	
	opt.value ="Consulta educación";
	opt.text = "Consulta educación";
	selConsultaPor.options.add(opt);
	var opt2 = document.createElement('option');
	opt2.value ="Consulta por indicadores";
	opt2.text = "Consulta por indicadores";
	selConsultaPor.options.add(opt2);
}
function insertarCamposSalud(){

   selConsultaPor.options.length = 0;
   var optsel = document.createElement('option');
	optsel.value = "Seleccione...";
	optsel.text = "Seleccione...";
	selConsultaPor.options.add(optsel);
   var opt = document.createElement('option');	
	opt.value ="Consulta general de salud";
	opt.text = "Consulta general de salud";
	selConsultaPor.options.add(opt);
	var opt2 = document.createElement('option');
	opt2.value ="Consulta por indicadores";
	opt2.text = "Consulta por indicadores";
	selConsultaPor.options.add(opt2);
	var opt3 = document.createElement('option');
	opt3.value ="Consulta por temáticas";
	opt3.text = "Consulta por temáticas";
	selConsultaPor.options.add(opt3);
}
function insertarCamposCulturaTurismo(){

   selConsultaPor.options.length = 0;
   var optsel = document.createElement('option');
	optsel.value = "Seleccione...";
	optsel.text = "Seleccione...";
	selConsultaPor.options.add(optsel);
   var opt = document.createElement('option');	
	opt.value ="Cultura";
	opt.text = "Cultura";
	selConsultaPor.options.add(opt);
	var opt2 = document.createElement('option');
	opt2.value ="Turismo";
	opt2.text = "Turismo";
	selConsultaPor.options.add(opt2);
}
function configureDropDownListConsultaPor(){
	 var consultarPorSeleccionado = selConsultaPor.value;
	 consultarPor =consultarPorSeleccionado;
	 console.log(consultarPor);
	 require([
		"esri/map",
        "dojo/dom", "dojo/on",
		"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/layers/LayerInfo",
		"dojo/_base/array",
        "esri/tasks/query", "esri/tasks/QueryTask",
		"dojo/_base/json",
		"esri/request",
		"jimu/PanelManager",
		"dojo/domReady!"
      ], function (Map,dom, on,
	  ArcGISDynamicMapServiceLayer, LayerInfo,arrayUtils, Query, QueryTask,dojoJson,esriRequest,PanelManager) {
	  
	    var infoCapas = "";
		var lasCapas = "";
		var layer = new ArcGISDynamicMapServiceLayer(
			url,{
			  useMapImage: false
			}
		 );  
       
		 //dom.byId("status").innerHTML = "Cargando...";
		var requestHandle = esriRequest({
            "url": url,
          "content": {
            "f": "json"
          },
          "callbackParamName": "callback",
        });
		
	
        requestHandle.then(requestSucceeded);

		function requestSucceeded(response, io){
         
		  var jsonEjemplo;
			 if ( response.hasOwnProperty("layers") ) {

				  var layerInfo =[]; 
				  var pad;

				  pad = dojo.string.pad;
				 
				  layerInfo = dojo.map(response.layers, function(f) {
					return pad(f.id, 2, " ", true) + "/"+ pad(f.name, 8, " ", true) + "/" + pad(f.subLayerIds, 25, " ", true) ;
				  });
				  console.log(layerInfo);
                  var capas = "";
				  capas = layerInfo;
				  var todo = [];
				  for( var i= 0 ; i < capas.length.toString(); i++)
				  {
					   
					var capa = [];
					capa=capas[i].split("/");
					 
					todo.push(capa);

				  }
				  
				  console.log(todo);
				  insetarCategoria(todo);
			  
			}
		    
        }
		

      });

}
function insetarCategoria(grupos){

	selCategoria.options.length = 0;
	
	if(consultarPor !=  "Cultura" && consultarPor != "Turismo"){
	   
	   document.getElementById("selSubCategoria").style.display = 'none';
	   document.getElementById("subCategoriaLabel").style.display = 'none';
	    var optsel = document.createElement('option');
		optsel.value = "Seleccione...";
		optsel.text = "Seleccione...";
		selCategoria.options.add(optsel);

		for (var i = 0; i < grupos.length; i++) {

			var opt = document.createElement('option');
			opt.value = grupos[i][0];
			opt.text = grupos[i][1];
			selCategoria.options.add(opt);
		}
	   
	}else{
	  document.getElementById("selSubCategoria").style.display = 'inline';
	  document.getElementById("subCategoriaLabel").style.display = 'inline';
	  var optsel = document.createElement('option');
		optsel.value = "Seleccione...";
		optsel.text = "Seleccione...";
		selCategoria.options.add(optsel);
		var categorias = "";
		
		for (var i = 0; i < grupos.length; i++) {

		   if(consultarPor ==  "Cultura"){
		   
			   if( grupos[i][1] == "Cultura " ){
				categorias = grupos[i][2];
				console.log(categorias);
				
				}
			}else{
			
			  if( grupos[i][1] == "Turismo " ){
				categorias = grupos[i][2];
				console.log(categorias);
				
			  }
			   
			}
			
		}
		for (var l = 0; l < 10; l++) {
		grupos[l][0] = l;
		
		}
		console.log("grupos");
		console.log(grupos);
		var categoria = [];
		categoria=categorias.split(",");
		console.log(categoria);
	    for (var i = 0; i < grupos.length; i++) {
		 for (var j = 0; j < categoria.length; j++) {
		     
		     if(grupos[i][0] == categoria[j])
			 {
			   var opt = document.createElement('option');
				opt.value = grupos[i][0];
				opt.text = grupos[i][1];
				selCategoria.options.add(opt);
			 }
		      
		 }
		}
	}

	
	
	
	
	
}


