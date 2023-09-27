var CPIA = {};
define(['dojo/_base/declare', 'jimu/BaseWidget', "dojo/query", "esri/request", "esri/tasks/QueryTask",'dojo/_base/lang','dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore',
"esri/tasks/query", "jimu/PanelManager", "jimu/WidgetManager", "dojo/Deferred", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
"esri/symbols/SimpleFillSymbol", "esri/Color"],
  function(declare, BaseWidget, query, esriRequest, QueryTask, lang, DataGrid, ItemFileWriteStore, Query, PanelManager, WidgetManager,
    Deferred, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color) {
      //To create a widget, you need to derive from BaseWidget.
      return declare([BaseWidget], {
          // Custom widget code goes here

          baseClass: 'jimu-widget-customwidget',


          startup: function() {       
              $('#widgets_primeraInfanciaAdolescencia_Widget_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Realiza consulta de la tem&aacute;tica primera infancia y adolescencia"></div>');
              console.log('startup');


              query("#selectNivelPIA").on("click", function (evt) {
                  var seleccion = this.options[this.selectedIndex].text;
                  CPIA.nivelSeleccionado = seleccion;
              });
         
                  query("#selectIndicadorPIA").on("click", function (evt) {
                      console.log('selectIndicadorPIA');
                      var seleccion = this.options[this.selectedIndex].text, existeConsulta = false;
                      console.log(seleccion);
                      CPIA.indicadorSeleccionado = seleccion;

                     
                  });
        
               
                  query("#btnBuscarPia").on("click", function (evt) {
                  console.log('btnBuscarPia');    
          
                  
                  var consulta = "";
                  if(CPIA.indicadorSeleccionado && CPIA.nivelSeleccionado){
            
                      switch(CPIA.indicadorSeleccionado) {
                          case "Cobertura Neta Educación":
                              console.log("Cobertura Neta Educación switch");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/10";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  //CPIA.url = SERVICIO_PIA +  "/1"; }
                                  CPIA.url = SERVICIO_PIA + "/2";
                              }
                              consulta = "1=1";
                             // consulta = "ANIO BETWEEN '" + CPIA.anioInicio + "' AND '" + CPIA.anioFin + "'";
                              break;
                          case "Porcentaje de niñas y niños atendidos en programas de atención integral del ICBF":
                              console.log("Porcentaje de niñas y niños atendidos en programas de atención integral del ICBF switch");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/97";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA +  "/92"; }
                              break;
                          case "Porcentaje de bajo peso al nacer a término":
                       
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/28";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA + "/23";
                              }

                              consulta = "ANIO BETWEEN '" + CPIA.anioInicio + "' AND '" + CPIA.anioFin + "'";
                              break;
                          case "Cobertura de Agua Potable":
                              console.log("Cobertura de Agua Potable switch");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/16";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA +  "/13"; }
                              break;
                          case "Porcentaje de Viviendas con Servicio de Alcantarillado":
                              console.log("Porcentaje de Viviendas con Servicio de Alcantarillado switch");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/17";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA +  "/14"; }
                              break;
                          case "Ingreso al Sistema de Responsabilidad Penal para Adolescentes":
                              console.log("Ingreso al Sistema de Responsabilidad Penal para Adolescentes switch");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/35";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA +  "/32"; }
                              break;
                          case "Porcentaje de niñas y niños atendidos en hogares de educación inicial, cuidado y nutrición ICBF":
                              console.log("Porcentaje de niñas y niños atendidos en hogares de educación inicial, cuidado y nutrición ICBF switch");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/97";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA +  "/92"; }
                              break;
                          case "Casos denunciados de maltrato en niños, niñas y adolescentes entre 0 y 17 años":
                              console.log("Casos denunciados de maltrato en niños, niñas y adolescentes entre 0 y 17 años switch");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/70";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA +  "/65"; }
                              break;
                          case "Porcentaje de menores de 10 años inscritos en el Programa de Crecimiento y Desarrollo":
                              console.log("Porcentaje de menores de 10 años inscritos en el Programa de Crecimiento y Desarrollo switch");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/79";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA +  "/75"; }
                              break;
                          case "Porcentaje de afiliados al sistema de salud":
                              console.log("Porcentaje de afiliados al sistema de salud switch");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/88";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA +  "/84"; }
                              break;
                          case "Indicador Prevalencia de Desnutrición Crónica (Baja Talla para la Edad)":
                              console.log("Indicador Prevalencia de Desnutrición Crónica (Baja Talla para la Edad)");
                              if(CPIA.nivelSeleccionado == "Departamental"){
                                  CPIA.url = SERVICIO_PIA +  "/9";}
                              else if(CPIA.nivelSeleccionado == "Municipal"){
                                  CPIA.url = SERVICIO_PIA +  "/9"; }
                              break;
                          default:
                              //code block
                      }
                      console.log(CPIA);

                      CPIA.url =  CPIA.url.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                      if(CPIA.anioFin>= CPIA.anioInicio){
                          var query = new Query();
                          var queryTask = new QueryTask(CPIA.url);
                          query.returnGeometry = true;
                          query.outFields = ["*"];
                          queryprueba = query;
                          // query.where ="1=1";
                         // query.where = "ANIO BETWEEN '" + CPIA.anioInicio + "' AND '" + CPIA.anioFin + "'";
                          query.where = consulta;
                          // ANIO BETWEEN '" + consultaAmbiental.anioBeguin + "' AND '" + consultaAmbiental.anioEnd + "'";
                          query.outSpatialReference = { wkid: map.spatialReference };
                          queryTask.execute(query, monstrarConsultaPia);

                          function monstrarConsultaPia(featureSet) {

                              showLoader();
                              map.graphics.clear();

                              if(featureSet.features.length >0){
                        
                                  var data_list_PIA = [];
                                  var data_listExportar_PIA = [];
                                  var fieldsPIA = [];
                                 // layoutPIA[0] = [];
                                  console.log("features");
                                  console.log(featureSet.features);



                                  var data_pia = {
                                      identifier: "id",
                                      items: []
                                  };
                                  document.getElementById("divConsultaPIA").style.display = "none";
                                  document.getElementById("divResultIndicadoresPIA").style.display = "block";
                                  document.getElementById("tablaIndcaPIA").style.display = "block";
                                  document.getElementById("divBtnesFormularioPIA").style.display = "block";
                                  document.getElementById("exportarPIA").style.display = "block";
                                  if(featureSet.features.length >1){
                                   
                                      document.getElementById("siguientePIA").style.display = "block";
                                      //document.getElementById("btnRegresarPIA").style.display = "block";
                                      document.getElementById("divBotonesRespuesta").style.display = "block";
                                  }else{
                                  
                                      document.getElementById("siguientePIA").style.display = "none";
                                     // document.getElementById("btnRegresarPIA").style.display = "none";
                                      //document.getElementById("exportarPIA").style.display = "none";
                                  }
                                  mostrarTablaYGraficoPIA();
                                  switch(CPIA.indicadorSeleccionado) {


                                      case "Cobertura Neta Educación":
                                          var layoutPIA = [[
                                            { 'name': 'Municipio', 'field': 'col1', 'width': '120px', noresize: true },
                                            { 'name': 'Año', 'field': 'col2', 'width': '80px', noresize: true },
                                            { 'name': 'Tasa neta', 'field': 'col3', 'width': '80px', noresize: true }
                                          ]];
                                
                                          for (var k in featureSet.features) {

                                              data_pia.items.push(lang.mixin({ id: k }, {
                                                  col1: featureSet.features[k].attributes.NOMBRE,
                                                  col2: featureSet.features[k].attributes.ANIO,
                                                  col3: featureSet.features[k].attributes.TASANETA

                                              }));

                                          }
                                          console.log(data_pia);
                                          var storePIA = new ItemFileWriteStore({ data: data_pia });
                                          console.log(storePIA);
                                          CPIA.features = featureSet.features;
                                          CPIA.featureSet = featureSet;
                                          CPIA.lists = data_pia;
                                          CPIA.layaout = layoutPIA;

                                          var gridPIA = new DataGrid({
                                              id: 'gridConsultaPIA',
                                              store: storePIA,
                                              structure: layoutPIA,
                                              rowSelector: '10px',
                                              style: "width: 350px;",
                                              selectionMode: 'single',
                                              canSort: function (col) {
                                                  return false;
                                              }
                                          });

                                          gridPIA.placeAt("tablaIndcaPIA");

                                          gridPIA.startup();
                                          gridPIA.set('autoHeight', false);
                                          gridPIA.set('autoWidth', false);
                                          gridPIA.update();
                                          gridPIA.set('autoWidth', false);
                                          gridPIA.on("RowClick", function (evt) {
                                              selectedRowGridPIAA();
                                          }, true);
                                          // selectedRowGridPIAA();

                                          console.log("gridPIA");
                                          console.log(gridPIA);


                                          mostrarResultadosIndicadorPIA();
                                          break;
                                      case "Porcentaje de niñas y niños atendidos en programas de atención integral del ICBF":
                                   
                                          break;
                                      case "Porcentaje de bajo peso al nacer a término":

                                          var layoutPIA = [[
                                           { 'name': 'Municipio', 'field': 'col1', 'width': '120px', noresize: true },
                                           { 'name': 'Año', 'field': 'col2', 'width': '80px', noresize: true },
                                           { 'name': 'Porcentaje', 'field': 'col3', 'width': '80px', noresize: true }
                                          ]];
                                    

                                          for (var k in featureSet.features){
                                          
                                              data_pia.items.push(lang.mixin({ id: k }, {
                                                  col1: featureSet.features[k].attributes.NOMBRE,
                                                  col2: featureSet.features[k].attributes.ANIO,
                                                  col3: featureSet.features[k].attributes.PORCENTAJE
                                                  
                                              }));
                                          
                                          }
                                          console.log(data_pia);
                                          var storePIA = new ItemFileWriteStore({ data: data_pia });
                                          console.log(storePIA);


                                           
                                          CPIA.features = featureSet.features;
                                          CPIA.featureSet = featureSet; 
                                          CPIA.lists= data_pia;
                                          CPIA.layaout = layoutPIA;

                                          var gridPIA = new DataGrid({
                                              id: 'gridConsultaPIA',
                                              store: storePIA,
                                              structure: layoutPIA,
                                              rowSelector: '10px',
                                              style: "width: 350px;",
                                              selectionMode: 'single',
                                              canSort: function (col) {
                                                  return false;
                                              }
                                          });

                                          gridPIA.placeAt("tablaIndcaPIA");

                                          gridPIA.startup();
                                          gridPIA.set('autoHeight', false);
                                          gridPIA.set('autoWidth', false);
                                          gridPIA.update();
                                          gridPIA.set('autoWidth', false);
                                          gridPIA.on("RowClick", function (evt) {
                                              selectedRowGridPIAA();
                                          }, true);
                                         // selectedRowGridPIAA();

                                          console.log("gridPIA");
                                          console.log(gridPIA);
                                         
                                        
                                          mostrarResultadosIndicadorPIA();

                                         dibujarDatosEnGraficaPuntoPIA("Año", "Cantidad");
                                          //}


                                          break;
                                      case "Cobertura de Agua Potable":
                                    
                                          break;
                                      case "Porcentaje de Viviendas con Servicio de Alcantarillado":
                                    
                                          break;
                                      case "Ingreso al Sistema de Responsabilidad Penal para Adolescentes":
                                   
                                          break;
                                      case "Porcentaje de niñas y niños atendidos en hogares de educación inicial, cuidado y nutrición ICBF":
                                    
                                          break;
                                      case "Casos denunciados de maltrato en niños, niñas y adolescentes entre 0 y 17 años":
                                    
                                          break;
                                      case "Porcentaje de menores de 10 años inscritos en el Programa de Crecimiento y Desarrollo":
                                   
                                          break;
                                      case "Porcentaje de afiliados al sistema de salud":
                                    
                                          break;
                                      case "Indicador Prevalencia de Desnutrición Crónica (Baja Talla para la Edad)":
                                   
                                          break;
                                      default:
                                          //code block
                                  }
                            


                              }
                          }
                      }else{
                
                          createDialogInformacionGeneral("<B> Información </B>", "La fecha fin debe ser mas actual que la fecha de inicio");
                      }
            
            
                  }else{
                  
                  
                      createDialogInformacionGeneral("<B> Información </B>", "Por favor ingrese todos los campos");
                  }
              });
            
       
                  
                  
                         query("#btnRegresarPIA").on("click", function (evt) {
                             console.log('btnRegresarPIA');
                             ocultarMostrarDivs(CPIA.divsMostar, "flex");
                             ocultarMostrarDivs(CPIA.divsResultados, "none");
                             document.getElementById("buscarPIA").style.display = "none";
                             document.getElementById("divVerMasPIA").style.display = "none";
                             document.getElementById("btnResultadosPIA").style.display = "block";
                             document.getElementById("tablaIndcaPIA").style.marginTop = "auto";
                             document.getElementById("divTitleCuposOfertados").style.display = "none";
                             document.getElementById("siguienteCE").style.display = "none";
                             document.getElementById("exportarCE").style.display = "none";
                             ajustarTamanioWidget(CPIA.panel, CPIA.widthInicial, CPIA.heightInicial);
                             CPIA.abrirVermas = true;
                             CPIA.mostrarInfrEdu = true;
                             if(CPIA.consultaPorSeleccionada == "Consulta por indicadores"){
                                 document.getElementById("divResultIndicadoresPIA").style.display = "none";
                                 document.getElementById("tablaIndcaPIA").style.display = "none";
                                 document.getElementById("btnRegresarPIA").style.display = "none";
                                 ocultarMostrarDivs(CPIA.divMostrar, "flex");            
                                 document.getElementById("divIndicadorPIA").style.display = "flex";
                                 if(CPIA.indicadorSeleccionadaText == "Cupos ofertados"){              
                                     document.getElementById("divCategoriaPIA").style.display = "none";
                                     document.getElementById("divNivelPIA").style.display = "none";
                                     document.getElementById("divSectorPIA").style.display = "none";
                                 }
                                 ajustarTamanioWidget(CPIA.panel, CPIA.widthInicial, CPIA.heightInicial);            
                                 document.getElementById("divBtnesFormularioPIA").style.marginTop = "5px";            
                             }else{
                       
                             }
                     
                         });
                         query("#btnResultadosPIA").on("click", function (evt) {
                             console.log('btnResultadosPIA');
                             if(CPIA.consultaPorSeleccionada == "Consulta por indicadores"){
                                 if(CPIA.indicadorSeleccionadaText == "Cobertura"){
                                     ocultarMostrarDivs(CPIA.divMostrar, "none");
                                     document.getElementById("divIndicadorPIA").style.display = "none";
                                     document.getElementById("btnResultadosPIA").style.display = "none";
                                     document.getElementById("divResultIndicadoresPIA").style.display = "flex";
                                     document.getElementById("tablaIndcaPIA").style.display = "flex";            
                                     document.getElementById("divIndicadorPIA").style.display = "none";
                                     document.getElementById("divAnioPIA").style.display = "none";              
                                     document.getElementById("exportarCE").style.display = "flex";
                                 }else if(CPIA.indicadorSeleccionadaText == "Eficiencia interna"){
                                     document.getElementById("divResultIndicadoresPIA").style.display = "block";
                                     ocultarMostrarDivs(CPIA.divMostrar, "none");
                                     document.getElementById("divTitleCuposOfertados").style.display = "flex";
                                     document.getElementById("divIndicadorPIA").style.display = "none";
                                     document.getElementById("btnResultadosPIA").style.display = "none";              
                                     document.getElementById("tablaIndcaPIA").style.display = "block";              
                                     document.getElementById("tablaIndcaPIA").style.marginTop = "65px";
                                     document.getElementById("divIndicadorPIA").style.display = "none";
                                     document.getElementById("divAnioPIA").style.display = "none";       
                                     document.getElementById("siguienteCE").style.display = "flex";
                                     document.getElementById("exportarCE").style.display = "flex"; 
                                     document.getElementById("gridTabInd").style.display = "contents";             
                                 }else{              
                                     ocultarMostrarDivs(CPIA.divMostrar, "none");
                                     document.getElementById("divIndicadorPIA").style.display = "none";
                                     document.getElementById("divAnioPIA").style.display = "none";     
                                     document.getElementById("divIndicadorPIA").style.display = "none";
                                     document.getElementById("btnResultadosPIA").style.display = "none";
                                     document.getElementById("divResultIndicadoresPIA").style.display = "flex";
                                     document.getElementById("divResultIndicadoresPIA").style.justifyContent = "center";
                                     document.getElementById("divTitleCuposOfertados").style.display = "flex";                
                                     document.getElementById("tablaIndcaPIA").style.display = "block";                            
                                     document.getElementById("tablaIndcaPIA").style.justifyContent = "center";
                                     document.getElementById("tablaIndcaPIA").style.width = "350";
                                     document.getElementById("tablaIndcaPIA").style.height = "223px";
                                     document.getElementById("tablaIndcaPIA").style.border = "grove";
                                     document.getElementById("tablaIndcaPIA").style.borderRadius = "10px";
                                     document.getElementById("tablaIndcaPIA").style.marginTop = "5px";
                                     document.getElementById("tablaIndcaPIA").style.overflowX = "auto";
                                     document.getElementById("exportarCE").style.display = "flex";
                                 }
           
                             }else{
                                 ocultarMostrarDivs(CPIA.divsMostar, "none");
                                 ocultarMostrarDivs(CPIA.divsResultados, "flex");
                                 if(CPIA.consultaPorSeleccionada == "Consulta educación"){
                                     CPIA.heightResultado = 190; 
                                 }  
                             }
                             document.getElementById("btnRegresarPIA").style.display = "flex";
                             ajustarTamanioWidget(CPIA.panel, CPIA.widthResultado, CPIA.heightResultado);
                         });
                       
                        
                         query("#siguienteCE").on("click", function (evt) {          
                             var labelSerieX = [], valoresSeries = [], titulo = "", c = CPIA.contadorGraficas;
                             labelSerieX[0] = {value: 0, text: 0};           
                             var atributos = ["ESTUDIANTESDESERTORES", "ESTUDIANTESAPROBADOS", "ESTUDIANTESREPROBADOS", "ESTUDIANTESMATRICULADOS"];
                             var titulos = ["desertores", "aprobados", "reprobados", "matriculados"];
                             var featureSet = CPIA.featureSetEficienciaInterna;
                             for(var i in featureSet.features){
                                 i = parseInt(i);
                                 labelSerieX[i + 1] = {};
                                 labelSerieX[i + 1].value = i + 1;
                                 labelSerieX[i + 1].text = featureSet.features[i].attributes.NOMBRE;          
                                 valoresSeries[i] = {};
                                 valoresSeries[i].nombre = featureSet.features[i].attributes.NOMBRE;
                                 valoresSeries[i].dato = featureSet.features[i].attributes[atributos[c]];
                             }  
                             document.getElementById("divTitleCuposOfertados").innerHTML = "Total de estudiantes "+ titulos[c] + " en el año " + CPIA.anioTextoSeleccionado;
                             dibujarGraficaBarrasPIA("grafIndicaCE", titulo, labelSerieX, valoresSeries);
                             CPIA.contadorGraficas++;
                             if(CPIA.contadorGraficas >= atributos.length){
                                 CPIA.contadorGraficas = 0;
                             }
                         });
                         
                  
                  
                                $('#inputFechaInicioPIA .input-group.date').datepicker({
                                    format: "dd/mm/yyyy",
                                    maxViewMode: 2,
                                    todayBtn: true,
                                    language: "es",
                                    orientation: "bottom auto",
                                    multidate: false,
                                    autoclose: true,
                                    todayHighlight: true,
                                    beforeShowMonth: function (date) {
                                        if (date.getMonth() == 8) {
                                            CPIA.anioInicio =date.getFullYear();
                                            return false;
                                        }
                                    }
                                });
                                $('#inputFechaFinPIA .input-group.date').datepicker({
                                    format: "dd/mm/yyyy",
                                    maxViewMode: 2,
                                    todayBtn: true,
                                    language: "es",
                                    orientation: "bottom auto",
                                    multidate: false,
                                    autoclose: true,
                                    todayHighlight: true,
                                    beforeShowMonth: function (date) {
                                        if (date.getMonth() == 8) {
                                            CPIA.anioFin =date.getFullYear();
                                            return false;
                                        }
                                    }
                                });
                                
              
              
          },

          onOpen: function(){
              console.log('onOpen');
              map.setExtent(map._initialExtent);         
              CPIA.indicador = undefined;         
              CPIA.panel = this.getPanel();
              CPIA.widthInicial = 360;  
              CPIA.heightInicial = 251;

              var leyendaPIA;

              leyendaPIA = [
                 {
                     colorFondo: "209,0,0,0.5",
                     colorLine: "209,0,0,1",
                     label: "0 a 60",
                     minimo: 0,
                     maximo: 60
                 }, {
                     colorFondo: "255,168,5,0.5",
                     colorLine: "255,168,5,1",
                     label: "61 a 85",
                     minimo: 61,
                     maximo: 85
                 }, {
                     colorFondo: "64,148,0,0.5",
                     colorLine: "64,148,0,1",
                     label: "86 a 100",
                     minimo: 86,
                     maximo: 100
                 }
              ];
              CPIA.leyenda = leyendaPIA;
              ajustarTamanioWidget(CPIA.panel, CPIA.widthInicial, CPIA.heightInicial);
              document.getElementById("divIndicadorPIA").style.display = "flex";
              document.getElementById("divNivelPIA").style.display = "flex";
              document.getElementById("divBtnesFormularioPIA").style.display = "flex";
              //  document.getElementById("buscarPIA").style.display = "flex";
              cargarDatos("selectIndicadorPIA", ["Cobertura Neta Educación" ,"Porcentaje de niñas y niños atendidos en programas de atención integral del ICBF","Porcentaje de bajo peso al nacer a término","Cobertura de Agua Potable","Porcentaje de Viviendas con Servicio de Alcantarillado","Ingreso al Sistema de Responsabilidad Penal para Adolescentes","Porcentaje de niñas y niños atendidos en hogares de educación inicial, cuidado y nutrición ICBF" ,"Casos denunciados de maltrato en niños, niñas y adolescentes entre 0 y 17 años" ,"Porcentaje de menores de 10 años inscritos en el Programa de Crecimiento y Desarrollo","Porcentaje de afiliados al sistema de salud","Indicador Prevalencia de Desnutrición Crónica (Baja Talla para la Edad)"]);
              cargarDatos("selectNivelPIA", ["Departamental", "Municipal"]);
                 
          },

          onClose: function(){
              console.log('onClose');
              eliminarLeyendaYgraficasPIA();
          },

      
      });
      function eliminarLeyendaYgraficasPIA(){
          if(CPIA.graficasCargadas != undefined){
              if(CPIA.graficasCargadas.length > 0){
                  map.graphics.clear();
                  CPIA.graficasCargadas.length = 0;        
              }
          }
          if(WidgetManager.getInstance() != undefined){
              if(WidgetManager.getInstance().getWidgetById('widgets_LeyendaSocioeconomica_1') != undefined){
                  cerrarWidgetLeyendaPIA();          
              }  
          }    
      }
      function cerrarWidgetLeyendaPIA() {
          panelManager = PanelManager.getInstance();
          widgetCerrar = PanelManager.getInstance().getPanelById("widgets_LeyendaSocioeconomica_1_panel");
          for (var e in PanelManager.getInstance().panels) {
              if (PanelManager.getInstance().panels[e].id == "widgets_LeyendaSocioeconomica_1_panel") {
                  widgetCerrar = PanelManager.getInstance().panels[e].id;
              }
          }
          if (widgetCerrar != undefined) {
              panelManager.closePanel("widgets_LeyendaSocioeconomica_1_panel");
              panelManager.destroyPanel("widgets_LeyendaSocioeconomica_1_panel");          
          }
      }
      //function mostrarResultadosIndicadorPIA(objetoConsulta){
      //mostrarResultadosIndicadorPIA("Porcentaje de bajo peso al nacer a término",featureSet.features[i]);
      function mostrarResultadosIndicadorPIA(){
          mostrarLeyendaPIA();
          var featureSet = CPIA.featureSet;
          graficasPoblacionPIA(featureSet);
          resaltarGraficaMunicipiosPIA(featureSet.features[0]);
          if(featureSet.features.length >= 12){
              CPIA.widthResultado = 450;      
          }
          ajustarTamanioWidget(CPIA.panel, CPIA.widthResultado, CPIA.heightResultado);
          var titulo = CPIA.indicadorSeleccionadaText + " de educación en el año " + CPIA.anioTextoSeleccionado;
          /*
    document.getElementById("grafIndicaCE").style.display = "flex";
    dibujarGraficaBarrasPIA("grafIndicaCE", titulo, objetoConsulta.labelSerieX, objetoConsulta.valoresSeries);
    document.getElementById("divResultIndicadoresPIA").style.display = "block";
    document.getElementById("tablaIndcaPIA").style.display = "flex";
    document.getElementById("tablaIndcaPIA").style.justifyContent = "center";
    document.getElementById("tablaIndcaPIA").style.width = "350";
    document.getElementById("tablaIndcaPIA").style.height = "135px";
    document.getElementById("tablaIndcaPIA").style.border = "grove";
    document.getElementById("tablaIndcaPIA").style.borderRadius = "10px";
    document.getElementById("tablaIndcaPIA").style.marginTop = "auto";
    document.getElementById("btnRegresarPIA").style.display = "block";
    divIndicadorPIAmostrarResultadosEnTablaGeneralPIA(featureSet, objetoConsulta.divTabla, 11, false, objetoConsulta.gridTabla);
    */
          //document.getElementById("divBtnesFormularioPIA").style.marginTop = "200px";
      }
      function cargarDataSelectPIA(features, atributo, select){
          var datos = [];
          for(var i in features){
              datos[i] = features[i].attributes[atributo];
          }
          datos = descriminaRepetidos(datos);  
          CPIA.datosCargados = datos;
          textoCargando(select);
          cargarDatos(select, datos);
          $("#" + select).prop('disabled', false);
      }
      function nuevaRealizarQueryPIA(seleccion, select){
          var urlServicio;
          var consultaPor = CPIA.consultaPor;
          for(var i in consultaPor){
              if(seleccion == consultaPor[i].name){
                  urlServicio = consultaPor[i].url;
                  CPIA.urlConsultaPor = urlServicio;
                  break;
              }
          }
          textoCargando(select);
          showLoader();
          realizarQueryPIA(urlServicio, select);
      }
      function realizarQueryPIA(url, select) { 
          showLoader();   
          var layersRequest = esriRequest({
              url: url,
              content: { f: "json" },
              handleAs: "json",
              callbackParamName: "callback"
          });
          layersRequest.then(
              function (response) {
                  respuestaQueryPIA(response, url, select);
              }, function (error) {           
                  disabledForm(false);
                  console.log("Error: => ", error.message);          
                  createDialogInformacionGeneral("<B> Info </B>", "Error al cargar el servicio, vuelva a cargar el servicio");                 
              });      
      }

      function respuestaQueryPIA(result, url, select) {
          var select, objetoOrdenado = result.layers, pos;
      
          for(var i in objetoOrdenado){
              if(objetoOrdenado[i].name == "SIGQ.V_INFRAEDUCATIVA"){
                  pos = i;
                  break;
              }else if(objetoOrdenado[i].name == "Educación Superior"){
                  pos = i;
                  break;
              }
          }
          objetoOrdenado.splice(pos, 1);     
          if(CPIA.consultaPorSeleccionada == CPIA.consultaPor[0].name){        
              $('#'+ select).prop('disabled', false);         
          }else{        
              $('#'+ select).prop('disabled', false);
              var names = ["Cobertura","Cupos ofertados","Eficiencia interna"];
              for(var i in objetoOrdenado){
                  objetoOrdenado[i].name = names[i];
              }
          }
                      
          CPIA.layers = result.layers;
          cargarDatos(select, objetoOrdenado);

          var i = CPIA.bdrealizarQuery.length;
          CPIA.bdrealizarQuery[i] = {};
          CPIA.bdrealizarQuery[i].name = CPIA.consultaPorSeleccionada;
          CPIA.bdrealizarQuery[i].data = result;
          CPIA.bdrealizarQuery[i].select = select;
          console.log("bdrealizarQuery", CPIA.bdrealizarQuery);
          hideLoader();     
      }          
      function consultarQueryTaskPIA(campos, url, geometry, where) {
          if(url != undefined && where != undefined){
              var queryTask = new QueryTask(url);
              var parametros = new Query();
              parametros.outFields = [campos];
              parametros.where = where;
              parametros.returnGeometry = geometry;
              parametros.outSpatialReference = map.spatialReference;
              queryTask.execute(parametros, respuestaQueryTaskPIA, function (error) {
                  console.log(error);            
                  createDialogInformacionGeneral("<B> Info </B>", "No se logró completar la operación");            
                  disabledSlects(false, CPIA.divsDeshabilitados);
                  document.getElementById("grafIndicaCE").style.display = "none";
                  document.getElementById("divResultIndicadoresPIA").style.display = "none";
                  document.getElementById("divIndicadorPIA").style.display = "flex";
                  ajustarTamanioWidget(CPIA.panel, CPIA.widthInicial, 85);
                  CPIA.consultaPorSeleccionada = undefined;
                  //eliminarLeyendaYgraficasPIA();
              });
          }        
      }
      function respuestaQueryTaskPIA(featureSet) {
      


          hideLoader();
      

      }
    
    
      function mostrarResultadosEnTablaGeneralPIA(divTabla,  ocultarTabla, gridTabla) {//result es el array q contiene los datos a mostrar          
          if (CPIA.features.length <= 0) {          
              createDialogInformacionGeneral("<B> Info </B>", "La selección no contiene resultados");        
              disabledForm(false);
          } else {                     
              require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                  function (lang, DataGrid, ItemFileWriteStore, dom) {                                           
                      //////organiza datos para cargarlo en data_list                                             
                      //CPIA.resultQuery = result.features;
                      if(CPIA.tablaResultados != undefined){
                          CPIA.tablaResultados.destroy();
                          CPIA.tablaResultados = undefined;
                      }
                  
                      var data_list = [];
                      var dataPIA = {
                          identifier: "id",
                          items: []
                      };                    
                     
                      CPIA.contadorListas = 0;             
                      
                      var features = CPIA.features;                                                                                                                                         
                      CPIA.jsonConvertido = JSON.stringify(CPIA.lists);
                      var rows = CPIA.lists.length;
                      for (var i = 0, l = CPIA.lists.length; i < rows; i++) {
                          dataPIA.items.push(lang.mixin({ id: i + 1 }, CPIA.lists[i % l]));
                      }
                      console.log("data");
                      console.log(dataPIA);
                      var store = new ItemFileWriteStore({ data: CPIA.lists });
                      console.log(store);
                      /*create a new grid*/
                      var grid = new DataGrid({
                          //id: 'gridCS',
                          id: gridTabla,                      
                          store: store,
                          structure: CPIA.layout,
                          rowSelector: '5px',
                          selectionMode: 'single',
                          width: "100%",
                          canSort: function (col) {
                              return false;
                          }
                      });
                      CPIA.tablaResultados = grid;                    
                      /*append the new grid to the div*/
                      grid.placeAt(divTabla);

                      /*Call startup() to render the grid*/
                      grid.startup();
                      grid.set('autoHeight', false);                 
                      grid.set('autoWidth', true);
                      grid.update();
                      var leyenda = dijit.byId("leyendaGraficaConsulta");                 
                      grid.on("RowClick", function (evt) {
                          selectedRowGridPIA(evt);
                      }, true);                      
                
                      if(ocultarTabla){
                          document.getElementById(divTabla).style.display = "none";
                      }
                      document.getElementById(gridTabla).style.borderRadius = "10px";
                      //disabledForm(false);  
                  });
              ///////
          }      
      }


      function selectedRowGridPIAA(seleccionado) {

          switch (CPIA.indicadorSeleccionado) {
              case "Cobertura Neta Educación":
                  
                  break;
              case "Porcentaje de niñas y niños atendidos en programas de atención integral del ICBF":
                  
                  break;
              case "Porcentaje de bajo peso al nacer a término":

                 console.log(dijit.byId("gridConsultaPIA").selection.getSelected()[0]);
                  municipioSeleccionadoPia = dijit.byId("gridConsultaPIA").selection.getSelected()[0].col1[0].toString();
                  anioseleccionadoPia = dijit.byId("gridConsultaPIA").selection.getSelected()[0].col2[0].toString();
                  porcentajeSelPia = dijit.byId("gridConsultaPIA").selection.getSelected()[0].col3[0].toString();
                  idConsultaPia = dijit.byId("gridConsultaPIA").selection.getSelected()[0].id[0];

                  console.log(idConsultaPia);


                  //prueba

                require(["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines", "dojox/charting/plot2d/MarkersOnly", "dojo/ready"],
                function (Chart, Default, Lines, MarkersOnly, ready) {
                    ready(function () {
                        // mostrarTablaYGraficoCA();   

                 
                        document.getElementById("TituloGraficoPIA").style.display = "flex";
                        document.getElementById("TituloGraficoPIA").style.justifyContent = "center";
                        var contador = 0;
                        var titulo = CPIA.indicadorSeleccionado + " Municipio " + municipioSeleccionadoPia + " en el año " + CPIA.anioInicio + " - " + CPIA.anioFin;

                        //var titulo=PIA.indicadorSeleccionado  +" "+ CPIA.nivelSeleccionado 
                        document.getElementById("TituloGraficoPIA").innerHTML = titulo;
                        dojo.empty("grafIndicaPIA");
                        var chart1 = new Chart("grafIndicaPIA", {
                            title: ""
                        });
                        chart1.addPlot("default", {
                            type: "MarkersOnly",
                            gap: 0
                        });
                        chart1.addAxis("x", {
                            labels: [{
                                value: 1,
                                text: CPIA.lists.items[idConsultaPia].col2
                            }],
                            min: 0,
                            max: 2,
                            minorTicks: true,
                            minorLabels: true,
                            title: "Año",
                            titleOrientation: "away"
                        });
                        chart1.addAxis("y", {
                            vertical: true,
                            min: (CPIA.lists.items[idConsultaPia].col3 * 1) - 1,
                            max: (CPIA.lists.items[idConsultaPia].col3 * 1) + 1,
                            title: "Cantidad"
                        });
                        chart1.addSeries("Series 1", [(CPIA.lists.items[idConsultaPia].col3 * 1)]);
                        chart1.render();
                        CPIA.graficaResultados = chart1;

                    });
                })
                  break;
              case "Cobertura de Agua Potable":
                  break;
              case "Porcentaje de Viviendas con Servicio de Alcantarillado":
                  break;
              case "Ingreso al Sistema de Responsabilidad Penal para Adolescentes":
                  
                  break;
              case "Porcentaje de niñas y niños atendidos en hogares de educación inicial, cuidado y nutrición ICBF":
                
                  break;
              case "Casos denunciados de maltrato en niños, niñas y adolescentes entre 0 y 17 años":
                 
                  break;
              case "Porcentaje de menores de 10 años inscritos en el Programa de Crecimiento y Desarrollo":
                 
                  break;
              case "Porcentaje de afiliados al sistema de salud":
                
                  break;
              case "Indicador Prevalencia de Desnutrición Crónica (Baja Talla para la Edad)":
                 
                  break;
              default:
                  //code block
          }
      }
      function selectedRowGridPIA(seleccionado) {
          showLoader();      
          map.graphics.clear();
          var graficasCargadas = CPIA.graficasCargadas;
          var grafica;
          for(var i in graficasCargadas){
              if(i == seleccionado.rowIndex.valueOf()){
                  graficasCargadas[i].grafica.symbol.outline = CPIA.outlineResaltar;
                  grafica = graficasCargadas[i].grafica;

              }else{
                  graficasCargadas[i].grafica.symbol.outline = CPIA.outlinenormal;
                  grafica = graficasCargadas[i].grafica;
              }
            

              map.graphics.add(grafica);                        
          }    
          
/*
          for(var j in CPIA.lists){
          
             if(CPIA.lists[j]== ){}
          }*/
          hideLoader();
      }    
      function mostrarLeyendaPIA(){
          CPIA.panelManager = PanelManager();
          CPIA.widgetManager = WidgetManager();
          def = new Deferred();
          wm = WidgetManager.getInstance();
          LeyendaSocioeconomicaWidget = wm.getWidgetById('widgets_LeyendaSocioeconomica_1');
          CPIA.leyendaC = LeyendaSocioeconomicaWidget;
          if (LeyendaSocioeconomicaWidget == null) {
              //   console.log('Widget No esta cargado');
              confWidget = wm.appConfig.getConfigElementById('widgets_LeyendaSocioeconomica_1');
              //   console.log(confWidget);
              wm.loadWidget(confWidget).then(function () {
                  PanelManager.getInstance().showPanel(confWidget).then(function () {
                      wm.openWidget(confWidget.id);
                      topic.publish("leyendaSocioeconomica", { titulo: CPIA.indicadorSeleccionado, configLeyenda: CPIA.leyenda });
                      def.resolve();
                  });
              });
          } 
      }
      function graficasPoblacionPIA(featureSet) {
          var fields = featureSet.fields;
          CPIA.campoCargarGrafica = fields[0].name;
          featuresResultPoblacion = featureSet.features;
          map.graphics.clear();
          CPIA.graficasCargadas = [];
          for (var i in featuresResultPoblacion) {
              var graphic = featuresResultPoblacion[i];
              var symbol = simbologiaFeaturesPIA(graphic);
              graphic.setSymbol(symbol);
              CPIA.graficasCargadas[i] = {};
              CPIA.graficasCargadas[i][fields[0].name] = featuresResultPoblacion[i].attributes[fields[0].name];
              CPIA.graficasCargadas[i]["grafica"] = graphic;
              CPIA.graficasCargadas[i]["symbol"] = symbol;
          }      
      } 
      function resaltarGraficaMunicipiosPIA(feature){
          var grafica, graficaCargada = true, r, g, b, width, extent;
          var campoCargarGrafica = CPIA.campoCargarGrafica;
          map.graphics.clear();
          var polygonSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID, 
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_DOT, 
              new Color([151, 249, 0, 0.8]),
              3
            ), 
            new Color([151, 249, 0, 0.45])
          );
          if(feature.symbol == undefined){
              feature.symbol = polygonSymbol;
          }
          for(var i in CPIA.graficasCargadas){
              if(CPIA.graficasCargadas[i][campoCargarGrafica] == feature.attributes[campoCargarGrafica]){
                  grafica = CPIA.graficasCargadas[i].grafica;
                  //r =  grafica.symbol.outline.color.r;
                  grafica.symbol.outline.color.r = 14;
                  //g = grafica.symbol.outline.color.g;
                  grafica.symbol.outline.color.g = 109;
                  //b = grafica.symbol.outline.color.b;
                  grafica.symbol.outline.color.b = 37;
                  //width = grafica.symbol.outline.width;
                  grafica.symbol.outline.width = 4;   
                  CPIA.graficasCargadas[i].grafica = grafica;
                  graficaCargada = false;           
                  extent = CPIA.graficasCargadas[i].grafica.geometry.getExtent();          
              }
          
              if(graficaCargada){
                  /*if(){
      
                  }*/
                  map.graphics.add(CPIA.graficasCargadas[i].grafica);
                  //   CPIA.outlinenormal = CPIA.graficasCargadas[i].grafica.symbol.outline;
              }else{
                  graficaCargada = true;
              
              }
          }
          map.graphics.add(grafica);     
          // CPIA.outlineResaltar = grafica.symbol.outline;
      }
      function simbologiaFeaturesPIA(feature) {
          var leyendasPoblacion;
          var totalPobMunicipio;
          var simbolo;              
          leyendasPoblacion = CPIA.leyenda;
          if(CPIA.indicadorSeleccionado == "Porcentaje de bajo peso al nacer a término"){
              totalPobMunicipio = feature.attributes.PORCENTAJE;
          }else if(CPIA.indicadorSeleccionadaText == "Eficiencia interna"){
              totalPobMunicipio = feature.attributes[CPIA.atributoEficiInter];
          }else{
              totalPobMunicipio = feature.attributes.TOTALESTUDIANTES;
          }          
              
          for (var i in leyendasPoblacion) {
              var leyenda = leyendasPoblacion[i];
              if (totalPobMunicipio >= leyenda.minimo && totalPobMunicipio <= leyenda.maximo) {
                  simbolo = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, Color("rgb(" + leyenda.colorLine + ")"), 2),
                    Color("rgb(" + leyenda.colorFondo + ")"));
                  if(simbolo.color.r == 255 && simbolo.color.g == 255 && simbolo.color.b == 255){
                      simbolo.color.r = leyenda.colorFondo.split(",")[0];
                      simbolo.color.g = leyenda.colorFondo.split(",")[1];
                      simbolo.color.b = leyenda.colorFondo.split(",")[2];
                      simbolo.color.a = leyenda.colorFondo.split(",")[3];
                 
                      simbolo.outline.color.r = leyenda.colorFondo.split(",")[0];
                      simbolo.outline.color.g = leyenda.colorFondo.split(",")[1];
                      simbolo.outline.color.b = leyenda.colorFondo.split(",")[2];
                      simbolo.outline.color.a = 1;
                  }
                  return simbolo;
                  break;
              }
          }
      }
      function dibujarGraficaBarrasPIA(div, titulo, labelSerieX, valoresSeries) {
          require(["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines",
              "dojo/fx/easing", "dojox/charting/plot2d/ClusteredColumns", "dojox/charting/plot2d/MarkersOnly", "dojox/charting/action2d/Tooltip",
              "dojox/charting/widget/Legend", "dojox/charting/Chart2D", "dojox/charting/themes/Wetland", "dojox/charting/action2d/Highlight",
              "dojo/ready"],
              function (Chart, Default, Lines, easing, ClusteredColumns, MarkersOnly, Tooltip, Legend, Chart2D, Wetland, Highlight,        
                ready) {
                  ready(function () {            
                 
                      var legendTwo, valorMin = valoresSeries[0].dato, valorMax = valoresSeries[0].dato;
                      if (CPIA.graficaResultados != undefined) {
                          CPIA.graficaResultados.destroy();
                          CPIA.graficaResultados = undefined;
                      }
                  
                      var graficaConsulta = new dojox.charting.Chart2D(div,{
                          title: titulo,
                          titlePos: "top",
                          titleGap: 15,
                          titleFont: "center normal bold 11pt Arial",
                          titleOrientation: "away"
                      });
                      graficaConsulta.addPlot("default", {
                          type: "Columns",
                          //tension: 3,
                          markers: true,
                          gap: 1,
                      
                          // stroke: {
                          ///color: "blue",
                          // width: 20
                          // }
                      });
                      graficaConsulta.addAxis("x", {
                          includeZero: false,
                          labels: labelSerieX,
                          rotation: 80,
                          fixLower: "minor",
                          //fixUpper: "major",
                          // min: 0,
                          //max: 13
    
                      });
                  
                      graficaConsulta.setTheme(dojox.charting.themes.Wetland);
                
                      for(var i in valoresSeries){
                          var a = parseInt(i) + 1, dato;
                          if(valoresSeries[i].dato == 0){
                              dato = 0.00000001;
                          }else{
                              dato = valoresSeries[i].dato;
                          }
                          graficaConsulta.addSeries(valoresSeries[i].nombre, [{
                              y: dato,
                              x: a,
                              tooltip: valoresSeries[i].dato,
                              text: valoresSeries[i].dato,
                              stroke: {
                                  color: "blue",
                                  width: 2
                              },
                              fill: "lightblue"
                          }, ]);              
                          if(valorMin > valoresSeries[i].dato){
                              valorMin = valoresSeries[i].dato;
                          }
                          if(valorMax < valoresSeries[i].dato){
                              valorMax = valoresSeries[i].dato;
                          }
                      }
                      if((valorMin -= 10) < 0){
                          valorMin = 0;
                      }
                      //valorMin -= 10;
                      valorMax += 1;
                 
                  
                      graficaConsulta.addAxis("y", {
                          vertical: true,
                          fixLower: "major",
                          //fixUpper: "major",
                          min: valorMin,
                          max: valorMax
                      });
    
                      var a1 = new dojox.charting.action2d.Tooltip(graficaConsulta, "default");
                      var a2 = new dojox.charting.action2d.Highlight(graficaConsulta, "default");
                 
                      graficaConsulta.render();
                      CPIA.graficaResultados = graficaConsulta;                               
                                                                   
                  });
              });
      }

      function mostrarTablaYGraficoPIA() {            
        //  $('#divResultIndicadoresPIA').hide("fast");
        //  $('#TituloGraficoPIA').show("fast");
          //$('#grafIndicaPIA').show("fast");                        
          var panel = CPIA.panel;
          panel.position.width = 400;
          panel.position.height = 700;
          panel._originalBox = {
              w: panel.position.width,
              h: panel.position.height,
              l: panel.position.left || 60,
              t: panel.position.top || 120
          };
          //panel.setPosition(panel.position);
          panel.panelManager.normalizePanel(panel);      

      }
      function dibujarDatosEnGraficaPIA(data_list, fechaMesAgno, title, titleX, titleY) {
           console.log("dibujarDatosEnGrafica");
          // mostrarTablaYGraficoPIA();
          document.getElementById("TituloGraficoPIA").style.display = "flex";
          document.getElementById("TituloGraficoPIA").style.justifyContent = "center";
          //  document.getElementById("subtitle").style.display = "block";
          //if (consultaAmbiental.confirCategoriaSelected == "Predios de reforestaci\u00F3n" || consultaAmbiental.confirCategoriaSelected == "Tramites ambientales") {
          document.getElementById("TituloGraficoPIA").innerHTML = title + "<br/>  Periodo: " + $('#fechaInicio').val() + " - " + $('#fechaFin').val();
          //  } else {
          // document.getElementById("TituloGraficoPIA").innerHTML = title + " estaci\u00F3n " + consultaAmbiental.confirNombreSelected +
         // "<br/>  Periodo: " + $('#fechaInicio').val() + " - " + $('#fechaFin').val();

          // }
          //document.getElementById("subtitle").innerHTML = Periodo: " + consultaAmbiental.fechaInicial + " - " + consultaAmbiental.fechaFinal;

          var serie = [], labelSerie = [];

         // if (consultaAmbiental.confirSubCategoriaSelected != "Metereol\u00F3gica" && consultaAmbiental.confirSubCategoriaSelectedValue != 2) {
          data_list = CPIA.lists;
          //}


          for (var i in data_list) {
              serie[i] = data_list[i].col2;
              labelSerie[i] = { value: (i * 1) + 1, text: data_list[i].col1 };
          }

          dojo.require("dojox.charting.Chart2D");

          makeCharts = function () {

              var chart1 = new dojox.charting.Chart2D("grafIndicaPIA");
              chart1.addPlot("default", { type: "Markers" });
              chart1.addAxis("x", {
                  labels: labelSerie, /*fixUpper: "major",*/ fixLower: "manior", includeZero: true,
                  /*natural: true, vertical: false,*/ rotation: 90,
                  title: titleX,
                  titleOrientation: "away"
              });
              chart1.addAxis("y", {
                  vertical: true,
                  min: Math.min.apply(null, serie) - 1,
                  max: Math.max.apply(null, serie) + 1,
                  includeZero: true, natural: true,
                  title: titleY
              });
              chart1.addSeries("Series 1", serie);
              chart1.render();
              CPIA.graficaResultados = chart1;
              hideLoader();
          };

          dojo.addOnLoad(makeCharts);            
      }
  });
function dibujarDatosEnGraficaPuntoPIA(titleX, titleY) {
    
    //  console.log("dibujarDatosEnGraficaPunto");
    require(["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines", "dojox/charting/plot2d/MarkersOnly", "dojo/ready"],
        function (Chart, Default, Lines, MarkersOnly, ready) {
            ready(function () {
                // mostrarTablaYGraficoCA();   
                document.getElementById("TituloGraficoPIA").style.display = "flex";
                document.getElementById("TituloGraficoPIA").style.justifyContent = "center";
                var contador = 0;                         
                var titulo = CPIA.indicadorSeleccionado + " Municipio " + CPIA.lists.items[contador].col1+" en el año "+ CPIA.anioInicio +" - " + CPIA.anioFin;

                //var titulo=PIA.indicadorSeleccionado  +" "+ CPIA.nivelSeleccionado 
                document.getElementById("TituloGraficoPIA").innerHTML = titulo;
  
                var chart1 = new Chart("grafIndicaPIA", {
                    title: ""
                });
                chart1.addPlot("default", {
                    type: "MarkersOnly",
                    gap: 0
                });
                chart1.addAxis("x", {
                    labels: [{
                        value: 1,
                        text: CPIA.lists.items[contador].col2
                    }],
                    min:  0,
                    max: 2,
                    minorTicks: true,
                    minorLabels: true,
                    title: titleX,
                    titleOrientation: "away"
                });
                chart1.addAxis("y", {
                    vertical: true,
                    min: (CPIA.lists.items[contador].col3 * 1) - 1,
                    max: (CPIA.lists.items[contador].col3 * 1) + 1,
                    title: titleY
                });
                chart1.addSeries("Series 1", [(CPIA.lists.items[contador].col3 * 1)]);
                chart1.render();
                CPIA.graficaResultados = chart1;

            });
        });

    document.getElementById("TituloGraficoPIA").style.display = "block";
    document.getElementById("divResultIndicadoresPIA").style.display = "block";
    document.getElementById("grafIndicaPIA").style.display = "block";
}
      function subirImagenPIA(urlImagen, div, width, height){  
          if(document.getElementById('id') != null){
              a = document.getElementById('id');
              a.parentNode.removeChild(a);      
          }
          var imageParent = document.getElementById(div);  
          imageParent.style.width = "100%";
          imageParent.style.height = "100%";
          var image = document.createElement("img");        
          image.id = "id";
          image.src = urlImagen;            // image.src = "IMAGE URL/PATH"
          image.style.width = width;
          image.style.height = height;
          image.style.border = "3px solid #73ad21";
          image.style.padding = "1px";
          image.alt = "Imagen no habilitada";  
          image.onclick = "imagenClickPIA()";
          imageParent.appendChild(image);  
          CPIA.imagenCargada = imageParent;
      }
      function imagenClickPIA(){
          if(CPIA.imagenCArgada){
              ajustarTamanioWidget(CPIA.panel, CPIA.widthResultado, CPIA.heightResultado);
              CPIA.imagenCArgada = false;
              document.getElementById("divBtnesFormularioPIA").style.display = "flex";    
              document.getElementById("divResult1PIA").style.display = "flex";
              document.getElementById("divVerMasPIA").style.display = "flex";
              document.getElementById("imgExpanPIA").style.display = "none";               
              var div = "divImagen", height = "auto", width = "100%";
              var urlImagen = CPIA.urlImagen;
              subirImagenPIA(urlImagen, div, width, height); 
          }else{
              CPIA.imagenCArgada = true;      
              document.getElementById("divBtnesFormularioPIA").style.display = "none";    
              document.getElementById("divResult1PIA").style.display = "none";
              document.getElementById("imgExpanPIA").style.display = "block";         
              document.getElementById("divVerMasPIA").style.display = "none";
              ajustarTamanioWidget(CPIA.panel, 500, 400);
              var div = "imgExpanPIA", height = "auto", width = "100%";
              var urlImagen = CPIA.urlImagen;
              subirImagenPIA(urlImagen, div, width, height);   
      
              CPIA.ocultarDivs = true;      
          }
          CPIA.ocultarDivs = !CPIA.ocultarDivs;
      }
      function ExportarPIA() {
          //ResultadosJson
          var ReportTitle = "Resultados";
          var ShowLabel = true;
          var ResultadosJson = CPIA.jsonConvertido;
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
                  createDialogInformacionGeneral("<B> Resultados </B>", "Invalid data");
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
              createDialogInformacionGeneral("<B> Resultados </B>", "No  hay elementos");
          }
  
}
 