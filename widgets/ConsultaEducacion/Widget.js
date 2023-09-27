var consultaEducacion = {};
define(['dojo/_base/declare', 'jimu/BaseWidget', "dojo/query", "esri/request", "esri/tasks/QueryTask",
        "esri/tasks/query", "jimu/PanelManager", "jimu/WidgetManager", "dojo/Deferred", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol", "esri/Color"
    ],
    function(declare, BaseWidget, query, esriRequest, QueryTask, Query, PanelManager, WidgetManager,
        Deferred, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here

            baseClass: 'jimu-widget-customwidget',

            //this property is set by the framework when widget is loaded.
            name: 'consultaEducacion',


            //methods to communication with app container:     

            startup: function() {
                $('#widgets_ConsultaEducacion_Widget_37_panel').find(".title").find(".close-icon").after('<div class = "help-icon jimu-float-trailing" title = "Realiza consulta de la tem&aacute;tica educaci\u00F3n"></div>');
                //  console.log('startup');


                query("#selectConsultaPorCE").on("click", function(evt) {
                    //   console.log('selectConsultaPorCE');
                    var select, existeConsulta = false;
                    var seleccion = this.options[this.selectedIndex].value;
                    if (seleccion != 777777 && seleccion != consultaEducacion.consultaPorSeleccionada) {
                        limpiarSelectCE(consultaEducacion.selects);
                        consultaEducacion.realizarBusqueda = false;
                        map.setExtent(map._initialExtent);
                        map.graphics.clear();
                        consultaEducacion.consultaPorSeleccionada = seleccion;
                        consultaEducacion.CategoriaSeleccionada = undefined;
                        consultaEducacion.indicadorSeleccionado = undefined;
                        consultaEducacion.municipioSeleccionado = undefined;
                        document.getElementById("btnResultadosCE").style.display = "none";
                        document.getElementById("buscarCE").style.display = "block";
                        document.getElementById("btnLimpiarCE").style.display = "block";
                        eliminarLeyendaYgraficas();
                        if (seleccion == consultaEducacion.consultaPor[0].name) {
                            document.getElementById("divNivelCE").style.display = "none";
                            document.getElementById("divSectorCE").style.display = "none";
                            divsOcultar = ["divIndicadorCE", "divAnioCE"];
                            consultaEducacion.divsOcultar = divsOcultar;
                            divsMostar = ["divCategoriaCE", "divMunicipioCE", "divAtributoCE"];
                            consultaEducacion.divsMostar = divsMostar;
                            selctDisable = ['selectMunicipioCE', 'selectAtributoCE'];
                            ocultarMostrarDivs(divsOcultar, "none");
                            ocultarMostrarDivs(divsMostar, "flex");
                            disabledSlects(true, selctDisable);
                            consultaEducacion.heightInicial = 228;
                            ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
                            select = "selectCategoriaCE";
                        } else {
                            divsMostar = ["divIndicadorCE"];
                            consultaEducacion.divsMostar = divsMostar;
                            divsOcultar = ["divCategoriaCE", "divMunicipioCE", "divAtributoCE", "divNivelCE", "divSectorCE"];
                            consultaEducacion.divsOcultar = divsOcultar;
                            selctDisable = ['selectAnioCE'];
                            ocultarMostrarDivs(divsOcultar, "none");
                            ocultarMostrarDivs(divsMostar, "flex");
                            disabledSlects(true, selctDisable);
                            document.getElementById("divAnioCE").style.marginTop = "14px";
                            if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                                consultaEducacion.heightInicial = 148;
                            } else {
                                consultaEducacion.heightInicial = 228;
                            }
                            ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
                            select = "selectIndicadorCE";
                            consultaEducacion.indicadorSeleccionado = undefined;
                        }
                        if (consultaEducacion.bdrealizarQuery.length > 0) {
                            for (var i in consultaEducacion.bdrealizarQuery) {
                                if (consultaEducacion.bdrealizarQuery[i].name == consultaEducacion.consultaPorSeleccionada) {
                                    cargarDatos(select, consultaEducacion.bdrealizarQuery[i].data.layers);
                                    existeConsulta = true;
                                }
                            }
                            if (!existeConsulta) {
                                nuevaRealizarQuery(seleccion, select);
                                existeConsulta = false;
                            }
                        } else {
                            nuevaRealizarQuery(seleccion, select);
                        }
                    }
                });
                query("#selectIndicadorCE").on("click", function(evt) {
                    // console.log('selectIndicadorCE');
                    var seleccion = this.options[this.selectedIndex].value,
                        existeConsulta = false;
                    if (seleccion != "5" && seleccion != 777777 && seleccion != consultaEducacion.indicadorSeleccionado) {
                        consultaEducacion.indicadorSeleccionado = seleccion;
                        consultaEducacion.indicadorSeleccionadaText = this.options[this.selectedIndex].text;
                        consultaEducacion.CategoriaSeleccionada = undefined;
                        consultaEducacion.anioSeleccionado = undefined;
                        consultaEducacion.realizarBusqueda = false;
                        map.setExtent(map._initialExtent);
                        document.getElementById("btnResultadosCE").style.display = "none";
                        document.getElementById("divAnioCE").style.display = "none";
                        document.getElementById("buscarCE").style.display = "block";
                        document.getElementById("btnLimpiarCE").style.display = "block";
                        idCategoria.innerText = "Categoría";
                        eliminarLeyendaYgraficas();
                        limpiarContenedor("selectAnioCE");
                        var urlCapa;
                        if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                            urlCapa = SERVICIO_EDUCACION_ALFANUMERICO + "/" + seleccion;
                        } else {
                            urlCapa = consultaEducacion.urlConsultaPor + "/" + seleccion;
                        }
                        consultaEducacion.urlCategoria = urlCapa;
                        var bd = consultaEducacion.bdconsultarQueryTask,
                            select, consultaPor, indicador;
                        consultaEducacion.heightInicial = 183;
                        consultaPor = "Consulta por indicadores";
                        select = "selectAnioCE";
                        if (consultaEducacion.indicadorSeleccionadaText == "Cobertura") {
                            cargarCobertura();
                            //document.getElementById("btnResultadosCE").style.display = "none";
                            existeConsulta = true;
                            consultaEducacion.heightInicial = 279;
                        } else if (consultaEducacion.indicadorSeleccionadaText == "Cupos ofertados") {
                            document.getElementById("divCategoriaCE").style.display = "none";
                            document.getElementById("divNivelCE").style.display = "none";
                            document.getElementById("divSectorCE").style.display = "none";
                            document.getElementById("divAnioCE").style.marginTop = "13px";
                            divAnioCE.style.display = 'flex'
                            indicador = "Cupos ofertados";
                        } else if (consultaEducacion.indicadorSeleccionadaText == "Eficiencia interna") {
                            document.getElementById("divCategoriaCE").style.display = "flex";
                            document.getElementById("divNivelCE").style.display = "none";
                            document.getElementById("divSectorCE").style.display = "none";
                            document.getElementById("divAnioCE").style.display = "flex";
                            indicador = "Eficiencia interna";
                        } else if (consultaEducacion.indicadorSeleccionadaText == "Tasa de Analfabetismo") {
                            ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, 232);
                            document.getElementById("divCategoriaCE").style.display = "flex";
                            habilitarSlects(false, "selectCategoriaCE");
                            document.getElementById("divNivelCE").style.display = "none";
                            document.getElementById("divSectorCE").style.display = "none";
                            indicador = "Tasa de Analfabetismo";
                            cargarCategoriaTasaDeAnalfabetismo();
                            consultaEducacion.heightInicial = 230;
                            idCategoria.innerText = "Región";
                        }
                        if (indicador != "Tasa de Analfabetismo") {
                            if (bd.length > 0) {
                                for (var i in bd) {
                                    if (bd[i].consultaPor == consultaPor) {
                                        if (bd[i].indicador == indicador) {
                                            if (bd[i].anios != undefined) {
                                                cargarDatos(select, bd[i].anios);
                                                existeConsulta = true;
                                                consultaEducacion.heightInicial = 179;
                                                break;
                                            }
                                        }
                                    }
                                }

                            }
                        }
                        if (!existeConsulta) {
                            if (seleccion == 1 || seleccion == 4) {
                                consultaEducacion.select = "selectCategoriaCE";
                            } else {
                                consultaEducacion.select = "selectAnioCE";
                            }
                            consultaEducacion.campo = "*";
                            consultarQueryTask(consultaEducacion.campo, urlCapa, false, "1=1");
                        }
                    } else {
                        ocultarMostrarDivs(["divCategoriaCE", "divNivelCE", "divSectorCE"], "none");
                        consultaEducacion.indicadorSeleccionado = seleccion;
                    }
                    ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
                });
                query("#selectCategoriaCE").on("click", function(evt) {
                    //   console.log('selectCategoriaCE');
                    var seleccion = this.options[this.selectedIndex].value,
                        existeConsulta = false;
                    var select, features, atributo, campo, urlCapa;
                    if (seleccion != 777777 && seleccion != consultaEducacion.CategoriaSeleccionada) {
                        consultaEducacion.categoriaSeleccionadaText = this.options[this.selectedIndex].text;
                        consultaEducacion.CategoriaSeleccionada = seleccion;
                        var bdconsultarQueryTask = consultaEducacion.bdconsultarQueryTask;
                        consultaEducacion.nivelSeleccionado = undefined;
                        consultaEducacion.municipioSeleccionado = undefined;
                        consultaEducacion.realizarBusqueda = false;
                        document.getElementById("btnResultadosCE").style.display = "none";
                        document.getElementById("buscarCE").style.display = "block";
                        document.getElementById("btnLimpiarCE").style.display = "block";
                        eliminarLeyendaYgraficas();
                        if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                            if (consultaEducacion.indicadorSeleccionadaText == "Cobertura") {
                                if (bdconsultarQueryTask.length > 0) {
                                    for (var i in bdconsultarQueryTask) {
                                        if (bdconsultarQueryTask[i].consultaPor == consultaEducacion.consultaPor[1].name) {
                                            if (bdconsultarQueryTask[i].indicador == "Cobertura") {
                                                features = bdconsultarQueryTask[i].featureSetIndicador.features;
                                                select = "selectNivelCE";
                                                atributo = bdconsultarQueryTask[i].featureSetIndicador.fields[6].name;
                                                existeConsulta = true;
                                                cargarDataSelect(features, atributo, select);
                                                break;
                                            } else {
                                                urlCapa = consultaEducacion.urlCategoria;
                                                select = "selectNivelCE";
                                                campo = "*";
                                            }
                                        }
                                    }

                                } else {
                                    urlCapa = consultaEducacion.urlCategoria;
                                    select = "selectNivelCE";
                                    campo = "*";
                                }
                            }
                        } else {
                            limpiarContenedor("selectAtributoCE");
                            consultaEducacion.MunicipioSeleccionada = undefined;
                            urlCapa = consultaEducacion.urlConsultaPor + "/" + seleccion;
                            consultaEducacion.urlCategoria = urlCapa;
                            select = "selectMunicipioCE";
                            campo = "MUNICIPIO";
                            if (bdconsultarQueryTask.length > 0) {
                                for (var i in bdconsultarQueryTask) {
                                    if (bdconsultarQueryTask[i].categoria == seleccion) {
                                        cargarDatos(bdconsultarQueryTask[i].select, bdconsultarQueryTask[i].municipios);
                                        $("#" + bdconsultarQueryTask[i].select).prop('disabled', false);
                                        existeConsulta = true;
                                        break;
                                    }
                                }
                            }

                        }
                        if (!existeConsulta) {
                            consultaEducacion.select = select;
                            consultaEducacion.campo = campo;
                            if (consultaEducacion.consultaPorSeleccionada == "Consulta educaci\u00F3n") {
                                urlCapa = SERVICIO_EDUCACION + "/" + consultaEducacion.CategoriaSeleccionada;
                            }
                            if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                                consultaEducacion.anioSeleccionado = null;
                                if (consultaEducacion.categoriaSeleccionadaText == "Municipio") {
                                    urlCapa = SERVICIO_EDUCACION_ALFANUMERICO + "/5";
                                } else {
                                    urlCapa = consultaEducacion.urlCategoria;
                                }
                                select = "selectNivelCE";
                                consultaEducacion.select = select;
                                campo = "*";
                            }
                            if (campo != undefined && urlCapa != undefined) {
                                consultarQueryTask(campo, urlCapa, false, "1=1");
                            } else {
                                consultaEducacion.CategoriaSeleccionada = undefined;
                            }

                        }
                    }
                });
                query("#selectMunicipioCE").on("click", function(evt) {
                    //console.log('selectMunicipioCE');          
                    var seleccion = this.options[this.selectedIndex].text;
                    if (seleccion != "Seleccione..." && seleccion != consultaEducacion.municipioSeleccionado) {
                        consultaEducacion.municipioSeleccionado = seleccion;
                        consultaEducacion.AtributoSeleccionada = undefined;
                        consultaEducacion.realizarBusqueda = false;
                        document.getElementById("btnResultadosCE").style.display = "none";
                        document.getElementById("buscarCE").style.display = "block";
                        var datos = [];
                        var features, existeConsulta = false;
                        var consultaPor, categoria, municipios;
                        for (var i in consultaEducacion.bdconsultarQueryTask) {
                            if (consultaEducacion.bdconsultarQueryTask[i].consultaPor != undefined) {
                                if (consultaEducacion.bdconsultarQueryTask[i].consultaPor == consultaEducacion.consultaPorSeleccionada) {
                                    consultaPor = consultaEducacion.consultaPorSeleccionada;
                                    if (consultaEducacion.bdconsultarQueryTask[i].categoria != undefined) {
                                        if (consultaEducacion.bdconsultarQueryTask[i].categoria == consultaEducacion.CategoriaSeleccionada) {
                                            categoria = consultaEducacion.CategoriaSeleccionada;
                                            municipios = consultaEducacion.bdconsultarQueryTask[i].municipios;
                                            if (consultaEducacion.bdconsultarQueryTask[i].municipio != undefined) {
                                                if (consultaEducacion.bdconsultarQueryTask[i].municipio == seleccion) {
                                                    if (consultaEducacion.bdconsultarQueryTask[i].atributosFeatureSet != undefined) {
                                                        var select = "selectAtributoCE";
                                                        textoCargando(select);
                                                        features = consultaEducacion.bdconsultarQueryTask[i].atributosFeatureSet.features;
                                                        var a = 0;
                                                        for (var c in features) {
                                                            datos[a] = features[c].attributes.NOMBREESTABLECIMIENTO;
                                                            a++;
                                                        }
                                                        datos = ordenarDatos(descriminaRepetidos(datos));
                                                        cargarDatos(select, datos);
                                                        $("#" + select).prop('disabled', false);
                                                        existeConsulta = true;
                                                        break;
                                                    }
                                                }
                                            } else {
                                                consultaEducacion.bdconsultarQueryTask[i].municipio = seleccion;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (!existeConsulta) {
                            var contadorQueryTask = consultaEducacion.bdconsultarQueryTask.length;
                            consultaEducacion.bdconsultarQueryTask[contadorQueryTask] = {};
                            consultaEducacion.bdconsultarQueryTask[contadorQueryTask].consultaPor = consultaPor;
                            consultaEducacion.bdconsultarQueryTask[contadorQueryTask].categoria = categoria;
                            consultaEducacion.bdconsultarQueryTask[contadorQueryTask].municipio = consultaEducacion.municipioSeleccionado;
                            consultaEducacion.bdconsultarQueryTask[contadorQueryTask].municipios = municipios;

                            consultaEducacion.cargarAtributo = true;
                            var myWhere = "MUNICIPIO = '" + seleccion + "'"
                            consultaEducacion.select = "selectAtributoCE";
                            consultaEducacion.camposAtributo = ["NOMBREESTABLECIMIENTO", "DIRECCION", "JORNADA", "IMAGEN"];
                            consultaEducacion.campo = "NOMBREESTABLECIMIENTO";
                            if (consultaEducacion.consultaPorSeleccionada == "Consulta educaci\u00F3n") {
                                consultaEducacion.urlCategoria = SERVICIO_EDUCACION + "/" + consultaEducacion.CategoriaSeleccionada;
                            }
                            consultarQueryTask(consultaEducacion.camposAtributo, consultaEducacion.urlCategoria, true, myWhere);
                        }


                    }
                });
                query("#selectAtributoCE").on("click", function(evt) {
                    //console.log('selectAtributoCE');          
                    var seleccion = this.options[this.selectedIndex].text;
                    if (seleccion != "Seleccione..." && seleccion != consultaEducacion.AtributoSeleccionada) {
                        consultaEducacion.AtributoSeleccionada = seleccion;
                        consultaEducacion.heightInicial = 234;
                        ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
                        document.getElementById("divBtnesFormularioCE").style.display = "flex";
                        document.getElementById("btnResultadosCE").style.display = "none";
                        document.getElementById("buscarCE").style.display = "block";
                        document.getElementById("btnLimpiarCE").style.display = "block";
                        consultaEducacion.realizarBusqueda = true;
                    }
                });

                query("#selectNivelCE").on("click", function(evt) {
                    //   console.log('selectNivelCE');
                    var seleccion = this.options[this.selectedIndex].value;
                    if (seleccion != 777777 && seleccion != consultaEducacion.nivelSeleccionado) {
                        consultaEducacion.realizarBusqueda = false;
                        consultaEducacion.nivelSeleccionado = seleccion;
                        consultaEducacion.textoNivelSeleccionado = this.options[this.selectedIndex].text;
                        consultaEducacion.sectorSeleccionada = undefined;
                        var bdconsultarQueryTask = consultaEducacion.bdconsultarQueryTask;
                        var features, atributo, select;
                        select = "selectSectorCE";
                        document.getElementById("btnResultadosCE").style.display = "none";
                        document.getElementById("buscarCE").style.display = "block";
                        document.getElementById("btnLimpiarCE").style.display = "block";
                        limpiarContenedor("selectAnioCE");
                        //eliminarLeyendaYgraficas();                                            
                        for (var i in bdconsultarQueryTask) {
                            if (bdconsultarQueryTask[i].indicador == consultaEducacion.indicadorSeleccionadaText) {
                                features = bdconsultarQueryTask[i].featureSetIndicador.features;
                                atributo = bdconsultarQueryTask[i].featureSetIndicador.fields[7].name;
                                break;
                            }
                        }
                        cargarDataSelect(features, atributo, select);

                    }
                });
                query("#selectSectorCE").on("click", function(evt) {
                    //   console.log('selectSectorCE');
                    var seleccion = this.options[this.selectedIndex].value;
                    if (seleccion != 777777 && seleccion != consultaEducacion.sectorSeleccionada) {
                        consultaEducacion.realizarBusqueda = false;
                        consultaEducacion.sectorSeleccionada = seleccion;
                        consultaEducacion.anioSeleccionado = undefined;
                        consultaEducacion.sectorTextoSeleccionado = this.options[this.selectedIndex].text;
                        var features, atributo, select;
                        var bdconsultarQueryTask = consultaEducacion.bdconsultarQueryTask;
                        select = "selectAnioCE";
                        document.getElementById("btnResultadosCE").style.display = "none";
                        document.getElementById("buscarCE").style.display = "block";
                        document.getElementById("btnLimpiarCE").style.display = "block";
                        for (var i in bdconsultarQueryTask) {
                            if (bdconsultarQueryTask[i].indicador == consultaEducacion.indicadorSeleccionadaText) {
                                if (bdconsultarQueryTask[i].nivel == consultaEducacion.textoNivelSeleccionado) {
                                    if (bdconsultarQueryTask[i].sector == undefined) {
                                        bdconsultarQueryTask[i].sector = consultaEducacion.sectorTextoSeleccionado;
                                        consultaEducacion.bdconsultarQueryTask[i].selectAnio = select;
                                        break;
                                    } else if (bdconsultarQueryTask[i].sector != consultaEducacion.sectorTextoSeleccionado) {
                                        var i = consultaEducacion.bdconsultarQueryTask.length;
                                        consultaEducacion.bdconsultarQueryTask[i] = {};
                                        consultaEducacion.bdconsultarQueryTask[i].consultaPor = consultaEducacion.consultaPorSeleccionada;
                                        consultaEducacion.bdconsultarQueryTask[i].indicador = consultaEducacion.indicadorSeleccionadaText;
                                        consultaEducacion.bdconsultarQueryTask[i].nivel = consultaEducacion.textoNivelSeleccionado;
                                        consultaEducacion.bdconsultarQueryTask[i].sector = consultaEducacion.sectorTextoSeleccionado;
                                        consultaEducacion.bdconsultarQueryTask[i].selectAnio = select;
                                        consultaEducacion.bdconsultarQueryTask[i].featureSetIndicador = consultaEducacion.featureSetIndicador;
                                        break;
                                    }
                                }
                            }
                        }
                        for (var i in bdconsultarQueryTask) {
                            if (bdconsultarQueryTask[i].consultaPor == "Consulta por indicadores") {
                                if (bdconsultarQueryTask[i].indicador == "Cobertura") {
                                    document.getElementById("divAnioCE").style.display = "flex";
                                    cargarDataSelect(bdconsultarQueryTask[i].featureSetIndicador.features, "ANIO", "selectAnioCE");
                                }
                            }
                        }

                    }
                });
                query("#selectAnioCE").on("click", function(evt) {
                    //console.log('selectAnioCE');
                    var seleccion = this.options[this.selectedIndex].value;
                    if (seleccion != 777777 && seleccion != consultaEducacion.anioSeleccionado) {
                        consultaEducacion.realizarBusqueda = true;
                        consultaEducacion.anioSeleccionado = seleccion;
                        consultaEducacion.anioTextoSeleccionado = this.options[this.selectedIndex].text;
                        document.getElementById("divBtnesFormularioCE").style.display = "flex";
                        document.getElementById("btnResultadosCE").style.display = "none";
                        document.getElementById("exportarCE").style.display = "none";
                        document.getElementById("buscarCE").style.display = "block";
                        document.getElementById("btnLimpiarCE").style.display = "block";
                        var bdconsultarQueryTask = consultaEducacion.bdconsultarQueryTask;
                        var existeConsulta = false;
                        if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                            if (consultaEducacion.indicadorSeleccionadaText != "Cobertura") {
                                for (var i in bdconsultarQueryTask) {
                                    if (bdconsultarQueryTask[i].anioSelected != undefined) {
                                        if (bdconsultarQueryTask[i].anioSelected == consultaEducacion.anioTextoSeleccionado) {
                                            existeConsulta = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            for (var i in bdconsultarQueryTask) {
                                if (bdconsultarQueryTask[i].consultaPor == consultaEducacion.consultaPor[1].name) {
                                    if (bdconsultarQueryTask[i].indicador == consultaEducacion.layers[0].name) {
                                        if (bdconsultarQueryTask[i].nivel == consultaEducacion.textoNivelSeleccionado) {
                                            if (bdconsultarQueryTask[i].sector == consultaEducacion.sectorTextoSeleccionado) {
                                                if (consultaEducacion.bdconsultarQueryTask[i].anio == undefined) {
                                                    consultaEducacion.bdconsultarQueryTask[i].anio = this.options[this.selectedIndex].text;
                                                    existeConsulta = true;
                                                    break;
                                                } else if (consultaEducacion.bdconsultarQueryTask[i].anio == consultaEducacion.anioTextoSeleccionado) {
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (!existeConsulta) {
                            var i = consultaEducacion.bdconsultarQueryTask.length;
                            //consultaEducacion.bdconsultarQueryTask[i] = {};
                            if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                                if (consultaEducacion.indicadorSeleccionadaText == "Cupos ofertados") {
                                    for (var i in bdconsultarQueryTask) {
                                        if (bdconsultarQueryTask[i].anioSelected != undefined) {
                                            if (bdconsultarQueryTask[i].anioSelected == consultaEducacion.anioTextoSeleccionado) {
                                                existeConsulta = true;
                                            }
                                        }
                                    }
                                }
                            } else {
                                consultaEducacion.bdconsultarQueryTask[i].consultaPor = consultaEducacion.consultaPorSeleccionada;
                                consultaEducacion.bdconsultarQueryTask[i].indicador = consultaEducacion.indicadorSeleccionadaText;
                                consultaEducacion.bdconsultarQueryTask[i].nivel = consultaEducacion.textoNivelSeleccionado;
                                consultaEducacion.bdconsultarQueryTask[i].anio = consultaEducacion.anioTextoSeleccionado;
                                consultaEducacion.bdconsultarQueryTask[i].sector = consultaEducacion.sectorTextoSeleccionado;
                            }
                        }
                        if (consultaEducacion.indicadorSeleccionadaText == consultaEducacion.layers[0].name) {
                            consultaEducacion.heightInicial = 315;
                        } else {
                            if (consultaEducacion.indicadorSeleccionadaText == "Cupos ofertados" || consultaEducacion.indicadorSeleccionadaText == "Eficiencia interna" || consultaEducacion.indicadorSeleccionadaText == "Tasa de Analfabetismo") {
                                consultaEducacion.heightInicial = 228;
                            } else {
                                consultaEducacion.heightInicial = 300;
                            }
                        }
                        ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
                    }
                });

                query("#buscarCE").on("click", function(evt) {
                    //console.log('buscarCE');
                    if (consultaEducacion.realizarBusqueda) {
                        document.getElementById("btnLimpiarCE").style.display = "none";
                        if (consultaEducacion.consultaPor[0].name == consultaEducacion.consultaPorSeleccionada) {
                            consultaEducacion.abrirVermas = true;
                            consultaEducacion.divsMostar.push("divConsultaPorCE");
                            consultaEducacion.divsMostar.push("buscarCE");
                            consultaEducacion.divsMostar.push("btnResultadosCE");
                            ocultarMostrarDivs(consultaEducacion.divsMostar, "none");
                            consultaEducacion.divsResultados = ["divResult1CE", "btnRegresarCE", "btnVerMasCE"];
                            ocultarMostrarDivs(consultaEducacion.divsResultados, "flex");
                            document.getElementById("pNombre").innerHTML = consultaEducacion.AtributoSeleccionada;
                            var bdconsultarQueryTask = consultaEducacion.bdconsultarQueryTask;
                            for (var i in bdconsultarQueryTask) {
                                if (bdconsultarQueryTask[i].consultaPor == consultaEducacion.consultaPorSeleccionada) {
                                    if (bdconsultarQueryTask[i].categoria == consultaEducacion.CategoriaSeleccionada) {
                                        if (bdconsultarQueryTask[i].municipio == consultaEducacion.municipioSeleccionado) {
                                            var features = bdconsultarQueryTask[i].atributosFeatureSet.features;
                                            var campos = bdconsultarQueryTask[i].atributosFeatureSet.fields;
                                            var atributos, fields = [],
                                                x, y, referenciaSpacial, mySymbol;
                                            var title = consultaEducacion.categoriaSeleccionadaText;
                                            for (var c in features) {
                                                if (features[c].attributes.NOMBREESTABLECIMIENTO == consultaEducacion.AtributoSeleccionada) {
                                                    var e = 0;
                                                    atributos = features[c].attributes;
                                                    x = features[c].geometry.x;
                                                    y = features[c].geometry.y;
                                                    referenciaSpacial = features[c].geometry.spatialReference;
                                                    for (var d in campos) {
                                                        if (atributos[campos[d].name] != " " && atributos[campos[d].name] != null && campos[d].name != "IMAGEN") {
                                                            fields[e] = campos[d].name;
                                                            e++;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                            var myInfotemplate = crearInfoTemplate(title, atributos, fields);
                                            dibujarPuntoConInfoTemplate(x, y, referenciaSpacial, mySymbol, atributos, myInfotemplate, 2000);
                                            document.getElementById("pDireccion").innerHTML = atributos.DIRECCION;
                                            document.getElementById("pHorario").innerHTML = atributos.JORNADA;
                                            var urlImagen = URL_ARCHIVOS_QUINDIO + atributos.IMAGEN;
                                            consultaEducacion.urlImagen = urlImagen;
                                            subirImagenCE(urlImagen, "divImagen", "100%", "100%");
                                            break;
                                        }
                                    }
                                }
                            }

                        } else {
                            if (consultaEducacion.indicadorSeleccionadaText == "Cobertura") {
                                consultaEducacion.heightResultado = 523;
                                consultaEducacion.widthResultado = 415;
                            } else if (consultaEducacion.indicadorSeleccionadaText == "Cupos ofertados") {
                                document.getElementById("grafIndicaCE").style.display = "none";
                                consultaEducacion.widthResultado = 350;
                                consultaEducacion.heightResultado = 350;
                            } else {
                                consultaEducacion.widthResultado = 400;
                            }
                            document.getElementById("divConsultaPorCE").style.display = "none";
                            document.getElementById("divIndicadorCE").style.display = "none";
                            document.getElementById("divCategoriaCE").style.display = "none";
                            document.getElementById("divNivelCE").style.display = "none";
                            document.getElementById("divSectorCE").style.display = "none";
                            document.getElementById("divAnioCE").style.display = "none";
                            document.getElementById("buscarCE").style.display = "none";
                            document.getElementById("divResultIndicadoresCE").style.display = "block";
                            consultaEducacion.contTitlesEficienciaInterna = 1;
                            ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthResultado, consultaEducacion.heightResultado);

                            var bdconsultarQueryTask = consultaEducacion.bdconsultarQueryTask;
                            var featureSet, existeConsulta = false;
                            for (var i in bdconsultarQueryTask) {
                                if (bdconsultarQueryTask[i].consultaPor == "Consulta por indicadores") {
                                    if (bdconsultarQueryTask[i].indicador == "Cobertura") {
                                        if (bdconsultarQueryTask[i].nivel == consultaEducacion.textoNivelSeleccionado) {
                                            if (bdconsultarQueryTask[i].sector == consultaEducacion.sectorTextoSeleccionado) {
                                                if (bdconsultarQueryTask[i].anio == consultaEducacion.anioTextoSeleccionado) {
                                                    if (bdconsultarQueryTask[i].featureSet != undefined) {
                                                        existeConsulta = true;
                                                        mostrarResultadosIndicador(bdconsultarQueryTask[i]);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if (!existeConsulta) {
                                var urlCapa;
                                var myWhere;
                                consultaEducacion.campo = "*";
                                urlCapa = consultaEducacion.urlCategoria;
                                if (consultaEducacion.indicadorSeleccionadaText == "Cupos ofertados" || consultaEducacion.indicadorSeleccionadaText == "Eficiencia interna" || consultaEducacion.indicadorSeleccionadaText == "Tasa de Analfabetismo") {
                                    myWhere = "ANIO = '" + consultaEducacion.anioTextoSeleccionado + "'";
                                } else {
                                    myWhere = "NIVEL = '" + consultaEducacion.textoNivelSeleccionado + "' AND SECTOR = '" + consultaEducacion.sectorTextoSeleccionado + "' AND ANIO = '" + consultaEducacion.anioTextoSeleccionado + "'";
                                }
                                consultaEducacion.resultadoIndicadores = true;
                                consultaEducacion.categoriaSeleccionadaText == "Municipio" ? urlCapa = SERVICIO_EDUCACION_ALFANUMERICO + "/5" : '';
                                consultarQueryTask(consultaEducacion.campo, urlCapa, true, myWhere);
                            }
                        }
                    }
                });
                query("#btnRegresarCE").on("click", function(evt) {
                    //  console.log('btnRegresarCE');
                    ocultarMostrarDivs(consultaEducacion.divsMostar, "flex");
                    ocultarMostrarDivs(consultaEducacion.divsResultados, "none");
                    document.getElementById("buscarCE").style.display = "none";
                    document.getElementById("divVerMasCE").style.display = "none";
                    document.getElementById("divTitleCuposOfertados").style.display = "none";
                    document.getElementById("siguienteCE").style.display = "none";
                    document.getElementById("exportarCE").style.display = "none";
                    document.getElementById("btnResultadosCE").style.display = "block";
                    document.getElementById("btnLimpiarCE").style.display = "block";
                    document.getElementById("tablaIndcaCE").style.marginTop = "auto";
                    consultaEducacion.abrirVermas = true;
                    consultaEducacion.mostrarInfrEdu = true;
                    if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                        document.getElementById("divResultIndicadoresCE").style.display = "none";
                        document.getElementById("tablaIndcaCE").style.display = "none";
                        document.getElementById("btnRegresarCE").style.display = "none";
                        ocultarMostrarDivs(consultaEducacion.divMostrar, "flex");
                        document.getElementById("divConsultaPorCE").style.display = "flex";
                        if (consultaEducacion.indicadorSeleccionadaText == "Cupos ofertados") {
                            document.getElementById("divCategoriaCE").style.display = "none";
                            document.getElementById("divNivelCE").style.display = "none";
                            document.getElementById("divSectorCE").style.display = "none";
                            document.getElementById("divAnioCE").style.display = "flex";
                        } else if (consultaEducacion.indicadorSeleccionadaText == "Cobertura") {
                            consultaEducacion.heightInicial = 320;
                            document.getElementById("divAnioCE").style.display = "flex";
                        } else if (consultaEducacion.indicadorSeleccionadaText == "Tasa de Analfabetismo") {
                            consultaEducacion.heightInicial = 223;
                            document.getElementById("divCategoriaCE").style.display = "flex";
                            document.getElementById("divAnioCE").style.display = "flex";
                            cerrarWidgetLeyendaCE();
                            divNivelCE.style.display = 'none';
                            divSectorCE.style.display = 'none';
                        } else if (consultaEducacion.indicadorSeleccionadaText == "Eficiencia interna") {
                            consultaEducacion.heightInicial = 198;
                        } else {
                            consultaEducacion.heightInicial = 320;
                        }
                        document.getElementById("divBtnesFormularioCE").style.marginTop = "5px";
                    } else {

                    }
                    ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
                });
                query("#btnResultadosCE").on("click", function(evt) {
                    //  console.log('btnResultadosCE');
                    document.getElementById("btnLimpiarCE").style.display = "none";
                    if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                        ocultarMostrarDivs(consultaEducacion.divMostrar, "none");
                        document.getElementById("divIndicadorCE").style.display = "none";
                        document.getElementById("divAnioCE").style.display = "none";
                        document.getElementById("divConsultaPorCE").style.display = "none";
                        btnResultadosCE.style.display = 'none';
                        if (consultaEducacion.indicadorSeleccionadaText == "Cobertura") {
                            document.getElementById("divResultIndicadoresCE").style.display = "flex";
                            document.getElementById("tablaIndcaCE").style.display = "flex";
                            btnResultadosCE.style.display = 'none';
                        } else if (consultaEducacion.indicadorSeleccionadaText == "Eficiencia interna") {
                            document.getElementById("divResultIndicadoresCE").style.display = "block";
                            document.getElementById("divTitleCuposOfertados").style.display = "flex";
                            document.getElementById("tablaIndcaCE").style.display = "block";
                            document.getElementById("tablaIndcaCE").style.marginTop = "65px";
                            document.getElementById("siguienteCE").style.display = "flex";
                            document.getElementById("gridTabInd").style.display = "contents";
                        } else if (consultaEducacion.categoriaSeleccionadaText == "Departamento" || consultaEducacion.categoriaSeleccionadaText == "Municipio") {
                            document.getElementById("btnResultadosCE").style.display = "none";
                            document.getElementById("btnLimpiarCE").style.display = "none";
                            document.getElementById("divCategoriaCE").style.display = "none";
                            document.getElementById("divResultIndicadoresCE").style.display = "block";
                            document.getElementById("divTitleCuposOfertados").style.display = "block";
                            document.getElementById("tablaIndcaCE").style.display = "block";
                            document.getElementById("tablaIndcaCE").style.marginTop = "291px";
                        } else {
                            document.getElementById("btnLimpiarCE").style.display = "none";
                            document.getElementById("divResultIndicadoresCE").style.display = "block";
                            document.getElementById("divResultIndicadoresCE").style.justifyContent = "center";
                            document.getElementById("divTitleCuposOfertados").style.display = "block";
                            document.getElementById("tablaIndcaCE").style.display = "block";
                            document.getElementById("tablaIndcaCE").style.justifyContent = "center";
                            document.getElementById("tablaIndcaCE").style.width = "350";
                            document.getElementById("tablaIndcaCE").style.height = "223px";
                            document.getElementById("tablaIndcaCE").style.border = "grove";
                            document.getElementById("tablaIndcaCE").style.borderRadius = "10px";
                            document.getElementById("tablaIndcaCE").style.marginTop = "5px";
                            document.getElementById("tablaIndcaCE").style.overflowX = "auto";
                        }
                        document.getElementById("exportarCE").style.display = "flex";
                    } else {
                        ocultarMostrarDivs(consultaEducacion.divsMostar, "none");
                        ocultarMostrarDivs(consultaEducacion.divsResultados, "flex");
                        if (consultaEducacion.consultaPorSeleccionada == "Consulta educaci\u00F3n") {
                            consultaEducacion.heightResultado = 190;
                        }
                    }
                    document.getElementById("btnRegresarCE").style.display = "flex";
                    ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthResultado, consultaEducacion.heightResultado);
                });
                query("#btnVerMasCE").on("click", function(evt) {
                    //    console.log('btnVerMasCE');
                    if (consultaEducacion.abrirVermas) {
                        consultaEducacion.mostrarInfrEdu = true;
                        document.getElementById("divVerMasCE").style.display = "flex";
                        document.getElementById("tablaCE").style.display = "none";
                        //mostrarDatosBdconsultarQueryTask("pHorario"features.length > 0, "JORNADA");
                        var bd = consultaEducacion.resultaAlfanumerico.features;
                        var nombre, primerApellido, segundoApellido, nombreCompvaro;
                        for (var i in bd) {
                            if (bd[i].attributes.NOMBREESTABLECIMIENTO == consultaEducacion.AtributoSeleccionada) {
                                primerApellido = bd[i].attributes.PRIMERAPELLIDO;
                                segundoApellido = bd[i].attributes.SEGUNDOAPELLIDO;

                                if (primerApellido == null && segundoApellido == null) {
                                    nombreCompvaro = "sin informaci\u00F3n";
                                } else if (primerApellido != null && segundoApellido == null) {
                                    nombreCompvaro = primerApellido;
                                } else if (primerApellido == null && segundoApellido != null) {
                                    nombreCompvaro = segundoApellido;
                                } else if (primerApellido != null && segundoApellido != null) {
                                    nombreCompvaro = primerApellido + " " + segundoApellido;
                                }

                                document.getElementById("pContacto").innerHTML = nombreCompvaro;
                            }
                        }
                        consultaEducacion.heightResultado = 280;
                        ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightResultado);
                        consultaEducacion.abrirVermas = false;
                    } else {
                        document.getElementById("divVerMasCE").style.display = "none";
                        ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
                        consultaEducacion.abrirVermas = true;
                    }
                });
                query("#btnInfEducativaCE").on("click", function(evt) {
                    //  console.log('btnInfEducativaCE');
                    if (consultaEducacion.mostrarInfrEdu) {
                        var resultaAlfanumerico = consultaEducacion.resultaAlfanumerico;
                        var featureSet = {},
                            fields = [],
                            c = 0;
                        for (var i in resultaAlfanumerico.features) {
                            //console.log(resultaAlfanumerico.features[i].attributes.NOMBREESTABLECIMIENTO);
                            if (resultaAlfanumerico.features[i].attributes.NOMBREESTABLECIMIENTO == consultaEducacion.AtributoSeleccionada) {
                                featureSet.features = [resultaAlfanumerico.features[i]];
                            }
                        }
                        if (consultaEducacion.tablaResultados != undefined) {
                            consultaEducacion.tablaResultados.destroy();
                            consultaEducacion.tablaResultados = undefined;
                        }
                        if (featureSet.features != undefined) {
                            for (var i in resultaAlfanumerico.fields) {
                                for (var a in featureSet.features) {
                                    if (featureSet.features[a].attributes[resultaAlfanumerico.fields[i].name] != null) {
                                        fields[c] = {};
                                        fields[c].name = resultaAlfanumerico.fields[i].name;
                                        c++;
                                    }
                                }
                            }
                            featureSet.fields = fields;

                            document.getElementById("tablaCE").style.display = "block";
                            document.getElementById("tablaCE").style.width = "350px";
                            document.getElementById("tablaCE").style.height = "135px";
                            mostrarResultadosEnTablaGeneralCE(featureSet, "tablaCE", withMaximo = 10, false, "gridCE");
                            consultaEducacion.heightResultado = 432;
                            consultaEducacion.widthResultado = 360;
                            ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthResultado, consultaEducacion.heightResultado);
                        } else {
                            document.getElementById("tablaCE").style.display = "block";
                            document.getElementById("tablaCE").style.width = "348px";
                            document.getElementById("tablaCE").style.height = "25px";
                            document.getElementById("tablaCE").innerHTML = "Sin informaci\u00F3n";
                            ajustarTamanioWidget(consultaEducacion.panel, 360, 293);
                        }
                        consultaEducacion.mostrarInfrEdu = false;
                    } else {
                        document.getElementById("tablaCE").style.display = "none";
                        consultaEducacion.mostrarInfrEdu = true;
                        ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, 295);
                    }


                });
                query("#siguienteCE").on("click", function(evt) {
                    var labelSerieX = [],
                        valoresSeries = [],
                        titulo = "",
                        c = consultaEducacion.contadorGraficas;
                    labelSerieX[0] = { value: 0, text: 0 };
                    var atributos = ["ESTUDIANTESDESERTORES", "ESTUDIANTESAPROBADOS", "ESTUDIANTESREPROBADOS", "ESTUDIANTESMATRICULADOS"];
                    var titulos = ["desertores", "aprobados", "reprobados", "matriculados"];
                    var featureSet = consultaEducacion.featureSetEficienciaInterna;
                    for (var i in featureSet.features) {
                        i = parseInt(i);
                        labelSerieX[i + 1] = {};
                        labelSerieX[i + 1].value = i + 1;
                        labelSerieX[i + 1].text = featureSet.features[i].attributes.NOMBRE;
                        valoresSeries[i] = {};
                        valoresSeries[i].nombre = featureSet.features[i].attributes.NOMBRE;
                        valoresSeries[i].dato = featureSet.features[i].attributes[atributos[c]];
                    }
                    document.getElementById("divTitleCuposOfertados").innerHTML = "Total de estudiantes " + titulos[c] + " en el a\u00F1o " + consultaEducacion.anioTextoSeleccionado;
                    dibujarGraficaBarrasCE("grafIndicaCE", titulo, labelSerieX, valoresSeries, "Municipio", "Estudiantes " + titulos[c]);
                    consultaEducacion.contadorGraficas++;
                    if (consultaEducacion.contadorGraficas >= atributos.length) {
                        consultaEducacion.contadorGraficas = 0;
                    }
                });
                query("#btnLimpiarCE").on("click", function(evt) {
                    cargarDatos("selectConsultaPorCE", consultaEducacion.consultaPor);
                    limpiarSelectCE(consultaEducacion.selects);
                    consultaEducacion.consultaPorSeleccionada = undefined;
                });


            },

            onOpen: function() {
                //console.log('onOpen');
                var selects = ["selectIndicadorCE", "selectCategoriaCE", "selectMunicipioCE", "selectAtributoCE", "selectNivelCE", "selectSectorCE", "selectAnioCE"];
                consultaEducacion.selects = selects;
                limpiarSelectCE(selects);
                consultaEducacion.realizarBusqueda = false;
                map.setExtent(map._initialExtent);
                consultaEducacion.cargarAtributo = false;
                consultaEducacion.panel = this.getPanel();
                consultaEducacion.widthInicial = 360;
                consultaEducacion.heightInicial = 122;
                ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
                document.getElementById("divIndicadorCE").style.display = "none";
                document.getElementById("divCategoriaCE").style.display = "none";
                document.getElementById("divMunicipioCE").style.display = "none";
                document.getElementById("divAtributoCE").style.display = "none";
                document.getElementById("divNivelCE").style.display = "none";
                document.getElementById("divSectorCE").style.display = "none";
                document.getElementById("divAnioCE").style.display = "none";
                document.getElementById("divResult1CE").style.display = "none";
                //document.getElementById("divBtnesFormularioCE").style.display = "none";
                document.getElementById("divVerMasCE").style.display = "none";
                document.getElementById("imgExpanCE").style.display = "none";
                document.getElementById("tablaIndcaCE").style.display = "none";
                document.getElementById("divConsultaPorCE").style.display = "flex";
                document.getElementById("divResultIndicadoresCE").style.display = "none";
                document.getElementById("btnVerMasCE").style.display = "none";
                document.getElementById("btnRegresarCE").style.display = "none";
                consultaEducacion.consultaPor = [{
                    name: "Consulta educaci\u00F3n",
                    url: SERVICIO_EDUCACION
                }, {
                    name: "Consulta por indicadores",
                    url: SERVICIO_EDUCACION_ALFANUMERICO
                }];

                cargarDatos("selectConsultaPorCE", consultaEducacion.consultaPor);
                consultaEducacion.consultaPorSeleccionada = undefined;
                consultaEducacion.bdconsultarQueryTask = [];
                consultaEducacion.bdrealizarQuery = [];
                if (consultaEducacion.resultaAlfanumerico == undefined) {
                    ///consulta alfanumeirca educaci\u00F3n
                    var urlCapa = SERVICIO_EDUCACION_ALFANUMERICO + "/0";
                    where = "1=1";
                    var campos = ["NOMBREESTABLECIMIENTO", "NIT", "LABORATORIOS", "SALONESCONFERENCIAS", "NUMEROCOMPUTADORES", "ACCESOINTERNET", "WEBSITE", "PROGRAMASESPECIALES",
                        "NUMEROESTUDIANTES", "NUMERODOCENTES", "ZONASRECREATIVAS", "ICFECS", "PRIMERAPELLIDO", "SEGUNDOAPELLIDO", "NOMBRE", "OBJECTID", "CODIGOESTABLECIMIENTO"
                    ];
                    consultaEducacion.contadorQueryTask = 0;
                    consultarQueryTask(campos, urlCapa, true, "1=1");
                    /////////////////////////////////
                }
                consultaEducacion.resultadoIndicadores = false;
            },

            onClose: function() {
                //  console.log('onClose');
                eliminarLeyendaYgraficas();
                map.graphics.clear();
            },


        });

        function limpiarSelectCE(selects) {
            for (var i in selects) {
                limpiarContenedor(selects[i], true)
            }
        }

        function eliminarLeyendaYgraficas() {
            if (consultaEducacion.graficasCargadas != undefined) {
                if (consultaEducacion.graficasCargadas.length > 0) {
                    map.graphics.clear();
                    consultaEducacion.graficasCargadas.length = 0;
                }
            }
            if (WidgetManager.getInstance() != undefined) {
                if (WidgetManager.getInstance().getWidgetById('widgets_LeyendaSocioeconomica_1') != undefined) {
                    cerrarWidgetLeyendaCE();
                    //consultaEducacion.leyenda = undefined;
                }
            }
        }

        function cerrarWidgetLeyendaCE() {
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

        function mostrarResultadosIndicador(objetoConsulta) {
            mostrarLeyendaCE("Cobertura de estudiantes", objetoConsulta.leyenda);
            var featureSet = objetoConsulta.featureSet;
            graficasPoblacionCE(featureSet);
            resaltarGraficaMunicipiosCE(featureSet.features[0]);
            if (featureSet.features.length >= 12) {
                consultaEducacion.widthResultado = 450;
            }
            ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthResultado, consultaEducacion.heightResultado);
            var titulo = consultaEducacion.indicadorSeleccionadaText + " de educaci\u00F3n en el a\u00F1o " + consultaEducacion.anioTextoSeleccionado;
            document.getElementById("grafIndicaCE").style.display = "flex";
            dibujarGraficaBarrasCE("grafIndicaCE", titulo, objetoConsulta.labelSerieX, objetoConsulta.valoresSeries);
            document.getElementById("divResultIndicadoresCE").style.display = "block";
            document.getElementById("tablaIndcaCE").style.display = "flex";
            document.getElementById("tablaIndcaCE").style.justifyContent = "center";
            document.getElementById("tablaIndcaCE").style.width = "350";
            document.getElementById("tablaIndcaCE").style.height = "135px";
            document.getElementById("tablaIndcaCE").style.border = "grove";
            document.getElementById("tablaIndcaCE").style.borderRadius = "10px";
            document.getElementById("tablaIndcaCE").style.marginTop = "auto";
            document.getElementById("btnRegresarCE").style.display = "block";
            mostrarResultadosEnTablaGeneralCE(featureSet, objetoConsulta.divTabla, 11, false, objetoConsulta.gridTabla);
            //document.getElementById("divBtnesFormularioCE").style.marginTop = "200px";
        }

        function cargarDataSelect(features, atributo, select) {
            var datos = [];
            for (var i in features) {
                datos[i] = features[i].attributes[atributo];
            }
            datos = ordenarDatos(descriminaRepetidos(datos));
            consultaEducacion.datosCargados = datos;
            textoCargando(select);
            cargarDatos(select, datos);
            $("#" + select).prop('disabled', false);
        }

        function nuevaRealizarQuery(seleccion, select) {
            var urlServicio;
            var consultaPor = consultaEducacion.consultaPor;
            for (var i in consultaPor) {
                if (seleccion == consultaPor[i].name) {
                    urlServicio = consultaPor[i].url;
                    consultaEducacion.urlConsultaPor = urlServicio;
                    break;
                }
            }
            textoCargando(select);
            showLoader();
            realizarQuery(urlServicio, select);
        }

        function realizarQuery(url, select) {
            showLoader();
            var layersRequest = esriRequest({
                url: url,
                content: { f: "json" },
                handleAs: "json",
                callbackParamName: "callback"
            });
            layersRequest.then(
                function(response) {
                    respuestaQuery(response, url, select);
                },
                function(error) {
                    disabledForm(false);
                    console.log("Error: => ", error.message);
                    createDialogInformacionGeneral("<B> Info </B>", "Error al cargar el servicio, vuelva a cargar el servicio");
                    divBtnesFormularioCE.style.display = 'none';
                    divAnioCE.style.display = 'none';
                    divCategoriaCE.style.display = 'none';
                    divSectorCE.style.display = 'none';
                    divNivelCE.style.display = 'none';
                    divAtributoCE.style.display = 'none';
                    divMunicipioCE.style.display = 'none';
                    divIndicadorCE.style.display = 'none';
                });
        }

        function respuestaQuery(result, url, select) {
            var select, objetoOrdenado = result.layers,
                pos;

            for (var i in objetoOrdenado) {
                if (objetoOrdenado[i].name == "SIGQ.V_INFRAEDUCATIVA") {
                    pos = i;
                    break;
                } else if (objetoOrdenado[i].name == "Educaci\u00F3n Superior") {
                    pos = i;
                    break;
                }
            }
            objetoOrdenado.splice(pos, 1);
            if (consultaEducacion.consultaPorSeleccionada == consultaEducacion.consultaPor[0].name) {
                $('#' + select).prop('disabled', false);
            } else {
                $('#' + select).prop('disabled', false);
                //var names = ["Cobertura", "Cupos ofertados", "Eficiencia interna", "Tasa de Analfabetismo por departamento", "Tasa de Analfabetismo por municipio"];
                var names = ["Cobertura", "Cupos ofertados", "Eficiencia interna", "Tasa de Analfabetismo"];
                for (var i in objetoOrdenado) {
                    objetoOrdenado[i].name = names[i];
                }
            }

            consultaEducacion.layers = result.layers;
            cargarDatos(select, objetoOrdenado);

            var i = consultaEducacion.bdrealizarQuery.length;
            consultaEducacion.bdrealizarQuery[i] = {};
            consultaEducacion.bdrealizarQuery[i].name = consultaEducacion.consultaPorSeleccionada;
            consultaEducacion.bdrealizarQuery[i].data = result;
            consultaEducacion.bdrealizarQuery[i].select = select;
            //  console.log("bdrealizarQuery", consultaEducacion.bdrealizarQuery);
            hideLoader();
        }

        function consultarQueryTask(campos, url, geometry, where) {
            if (url != undefined && where != undefined) {
                var queryTask = new QueryTask(url);
                var parametros = new Query();
                parametros.outFields = [campos];
                parametros.where = where;
                parametros.returnGeometry = geometry;
                parametros.outSpatialReference = map.spatialReference;
                queryTask.execute(parametros, respuestaQueryTask, function(error) {
                    console.log(error);
                    createDialogInformacionGeneral("<B> Info </B>", "No se logr\u00F3 completar la operaci\u00F3n");
                    disabledSlects(false, consultaEducacion.divsDeshabilitados);
                    document.getElementById("grafIndicaCE").style.display = "none";
                    document.getElementById("divResultIndicadoresCE").style.display = "none";
                    document.getElementById("divConsultaPorCE").style.display = "flex";
                    tablaIndcaCE.style.display = 'none';
                    ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, 85);
                    selectConsultaPorCE.value = 0;
                    cerrarWidgetLeyendaCE();
                    divBtnesFormularioCE.style.display = 'none';
                    divAnioCE.style.display = 'none';
                    divCategoriaCE.style.display = 'none';
                    divSectorCE.style.display = 'none';
                    divNivelCE.style.display = 'none';
                    divAtributoCE.style.display = 'none';
                    divMunicipioCE.style.display = 'none';
                    divIndicadorCE.style.display = 'none';
                });
            }
        }

        function respuestaQueryTask(featureSet) {
            var select = "",
                datos = [],
                atributo;
            var divsMostrar, divsOcultar, selctDisable;
            var fields = [],
                a = 0,
                titulo;
            var divTabla = "tablaIndcaCE";
            var labelSerieX = [],
                valoresSeries = [],
                gridTabla;
            if (featureSet.features.length > 0) {
                // console.log("featureSet: ", featureSet);
                if (consultaEducacion.contadorQueryTask == 0) {
                    consultaEducacion.resultaAlfanumerico = featureSet;
                    consultaEducacion.contadorQueryTask = undefined;
                } else {
                    if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                        if (consultaEducacion.resultadoIndicadores) {
                            consultaEducacion.resultadoIndicadores = false;
                            var leyenda, tituloLeyenda;
                            gridTabla = "gridTabInd1";
                            document.getElementById("divResultIndicadoresCE").style.display = "block";
                            document.getElementById("divResultIndicadoresCE").style.justifyContent = "center";
                            document.getElementById(divTabla).style.display = "block";
                            document.getElementById(divTabla).style.justifyContent = "center";
                            document.getElementById(divTabla).style.width = "350";
                            document.getElementById(divTabla).style.border = "grove";
                            document.getElementById(divTabla).style.borderRadius = "10px";
                            document.getElementById(divTabla).style.marginTop = "5px";
                            document.getElementById(divTabla).style.height = "223px";
                            if (consultaEducacion.indicadorSeleccionadaText == "Cupos ofertados") {
                                leyenda = [{
                                    colorFondo: "77,246,22,0.4",
                                    colorLine: "77,246,22,1",
                                    label: "0 a 1000",
                                    minimo: 0,
                                    maximo: 1000
                                }, {
                                    colorFondo: "246,162,60,0.4",
                                    colorLine: "246,162,60,1",
                                    label: "1001 a 5000",
                                    minimo: 1001,
                                    maximo: 5000
                                }, {
                                    colorFondo: "135,240,226,0.4",
                                    colorLine: "135,240,226,1",
                                    label: "5001 a 10000",
                                    minimo: 5001,
                                    maximo: 10000
                                }, {
                                    colorFondo: "77,133,52,0.4",
                                    colorLine: "77,133,52,1",
                                    label: "Mayor a 10000",
                                    minimo: 10001,
                                    maximo: 50000000
                                }];
                                tituloLeyenda = "Cantidad de matriculas";
                                consultaEducacion.widthResultado = 350;
                                consultaEducacion.heightResultado = 350;
                                for (var i in featureSet.fields) {
                                    if (featureSet.fields[i].name == "NOMBRE") {
                                        fields[a] = featureSet.fields[i];
                                        a++;
                                    } else if (featureSet.fields[i].name == "GENERO") {
                                        fields[a] = featureSet.fields[i];
                                        a++;
                                    } else if (featureSet.fields[i].name == "CANTIDADOFERTADOS") {
                                        fields[a] = featureSet.fields[i];
                                        a++;
                                    } else if (featureSet.fields[i].name == "CANTIDADMATRICULADOS") {
                                        fields[a] = featureSet.fields[i];
                                        a++;
                                    }
                                }
                                document.getElementById("grafIndicaCE").style.display = "none";
                                document.getElementById("divResultIndicadoresCE").style.height = "27px";
                                document.getElementById("divResultIndicadoresCE").style.marginTop = "-10px";
                                document.getElementById("divResultIndicadoresCE").style.marginBottom = "0px";
                                document.getElementById("divTitleCuposOfertados").style.display = "flex";
                                document.getElementById("divTitleCuposOfertados").innerHTML = "Cupos ofertados y matr\u00CDculas en el a\u00F1o " + consultaEducacion.anioTextoSeleccionado;
                                document.getElementById("tablaIndcaCE").style.overflowX = "auto";
                                document.getElementById("exportarCE").style.display = "flex";

                            } else if (consultaEducacion.categoriaSeleccionadaText == "Departamento" || consultaEducacion.categoriaSeleccionadaText == "Municipio") {
                                document.getElementById(divTabla).style.height = "140px";
                                for (var i in featureSet.fields) {
                                    if (consultaEducacion.categoriaSeleccionadaText == "Municipio") {
                                        if (featureSet.fields[i].name != "GENERO" && featureSet.fields[i].name != "IDMUNICIPIO" && featureSet.fields[i].name != "IDDEPARTAMENTO" && featureSet.fields[i].name != "OBJECTID" && featureSet.fields[i].name != "SHAPE.AREA" && featureSet.fields[i].name != "SHAPE.LEN") {
                                            fields.push(featureSet.fields[i]);
                                        }
                                    } else {
                                        if (featureSet.fields[i].name != "IDMUNICIPIO" && featureSet.fields[i].name != "IDDEPARTAMENTO" && featureSet.fields[i].name != "OBJECTID" && featureSet.fields[i].name != "SHAPE.AREA" && featureSet.fields[i].name != "SHAPE.LEN") {
                                            fields.push(featureSet.fields[i]);
                                        }
                                    }

                                }
                                document.getElementById("grafIndicaCE").style.display = "none";
                                document.getElementById("divResultIndicadoresCE").style.height = "27px";
                                document.getElementById("divResultIndicadoresCE").style.marginTop = "-10px";
                                document.getElementById("divResultIndicadoresCE").style.marginBottom = "0px";
                                document.getElementById("divTitleCuposOfertados").style.display = "flex";
                                let bottomText;
                                if (consultaEducacion.categoriaSeleccionadaText == "Municipio") {
                                    bottomText = "Tasa de analfabetismo por Municipio en el A\u00F1o " + consultaEducacion.anioTextoSeleccionado;
                                } else {
                                    bottomText = "Tasa de analfabetismo en el departamento del Quindío." + "<br>" + "A\u00F1o " + consultaEducacion.anioTextoSeleccionado;
                                }
                                document.getElementById("divTitleCuposOfertados").innerHTML = bottomText;
                                divTitleCuposOfertados.align = 'center';
                                document.getElementById("tablaIndcaCE").style.overflowX = "auto";
                                document.getElementById("tablaIndcaCE").style.marginTop = "291px";
                                document.getElementById("exportarCE").style.display = "flex";
                                consultaEducacion.heightResultado = 543;
                                let valorMin = featureSet.features[0].attributes.TOTALMUNICIPIO;
                                valorMax = valorMin;
                                featureSet.features.forEach(e => {
                                    if (e.attributes.TOTALMUNICIPIO < valorMin) {
                                        valorMin = e.attributes.TOTALMUNICIPIO;
                                    }
                                    if (e.attributes.TOTALMUNICIPIO > valorMax) {
                                        valorMax = e.attributes.TOTALMUNICIPIO;
                                    }
                                });
                                let valor1 = ((valorMax - valorMin) / 3) + valorMin;
                                valor1 = parseFloat(valor1.toFixed(1));
                                let valor2 = valor1 + ((valorMax - valorMin) / 3);
                                valor2 = parseFloat(valor2.toFixed(1));
                                leyenda = [{
                                    colorFondo: "252,3,3,0.4",
                                    colorLine: "252,3,3,1",
                                    label: valor2 + " al " + valorMax + "%",
                                    minimo: valor2,
                                    maximo: valorMax
                                }, {
                                    colorFondo: "246,254,6,0.4",
                                    colorLine: "246,254,6,1",
                                    label: valor1 + " al " + valor2 + "%",
                                    minimo: valor1,
                                    maximo: valor2
                                }, {
                                    colorFondo: "81,175,51,0.4",
                                    colorLine: "81,175,51,1",
                                    label: valorMin + " al " + valor1 + "%",
                                    minimo: valorMin,
                                    maximo: valor1
                                }];
                                tituloLeyenda = "Tasa de analfabetismo";
                            } else {
                                if (consultaEducacion.indicadorSeleccionadaText == "Eficiencia interna") {
                                    consultaEducacion.featureSetEficienciaInterna = featureSet;
                                    consultaEducacion.contadorGraficas = 0;
                                    leyenda = [{
                                        colorFondo: "252,3,3,0.4",
                                        colorLine: "252,3,3,1",
                                        label: "0 a 1000",
                                        minimo: 0,
                                        maximo: 1000
                                    }, {
                                        colorFondo: "246,254,6,0.4",
                                        colorLine: "246,254,6,1",
                                        label: "1001 a 10000",
                                        minimo: 1001,
                                        maximo: 10000
                                    }, {
                                        colorFondo: "81,175,51,0.4",
                                        colorLine: "81,175,51,1",
                                        label: "Mayor a 10000",
                                        minimo: 10001,
                                        maximo: 50000000
                                    }];
                                    tituloLeyenda = "\u00CDndice de eficiencia";
                                    atributo = "ESTUDIANTESMATRICULADOS";
                                    consultaEducacion.atributoEficiInter = atributo;
                                    titulo = ""; //"Total de estudiantes matriculados en el a\u00F1o " + consultaEducacion.anioTextoSeleccionado;
                                    for (var i in featureSet.fields) {
                                        if (featureSet.fields[i].name == "NOMBRE" || featureSet.fields[i].name == "ESTUDIANTESMATRICULADOS" ||
                                            featureSet.fields[i].name == "ESTUDIANTESDESERTORES" || featureSet.fields[i].name == "ESTUDIANTESAPROBADOS" ||
                                            featureSet.fields[i].name == "ESTUDIANTESREPROBADOS") {
                                            fields[a] = featureSet.fields[i];
                                            a++;
                                        }
                                    }
                                    document.getElementById("divTitleCuposOfertados").style.display = "flex";
                                    document.getElementById("siguienteCE").style.display = "flex";
                                    document.getElementById("exportarCE").style.display = "flex";
                                    document.getElementById("divTitleCuposOfertados").innerHTML = "Total de estudiantes matriculados en el a\u00F1o " + consultaEducacion.anioTextoSeleccionado;
                                    document.getElementById(divTabla).style.display = "block";
                                    document.getElementById(divTabla).style.height = "153px";
                                    document.getElementById(divTabla).style.paddingTop = "5px";
                                    document.getElementById(divTabla).style.overflowX = "auto";
                                    document.getElementById(divTabla).style.marginTop = "80px";
                                    document.getElementById("divResultIndicadoresCE").style.marginTop = "-13px";
                                    consultaEducacion.heightResultado = 563;
                                    title = "Estudiantes matriculados";
                                    consultaEducacion.widthResultado = 423;
                                } else {
                                    leyenda = [{
                                        colorFondo: "252,3,3,0.4",
                                        colorLine: "252,3,3,1",
                                        label: "0 a 1000",
                                        minimo: 0,
                                        maximo: 1000
                                    }, {
                                        colorFondo: "246,254,6,0.4",
                                        colorLine: "246,254,6,1",
                                        label: "1001 a 5000",
                                        minimo: 1001,
                                        maximo: 5000
                                    }, {
                                        colorFondo: "81,175,51,0.4",
                                        colorLine: "81,175,51,1",
                                        label: "Mayor a 5000",
                                        minimo: 5001,
                                        maximo: 50000000
                                    }];
                                    tituloLeyenda = "Cobertura de estudiantes";
                                    atributo = "TOTALESTUDIANTES";
                                    titulo = consultaEducacion.indicadorSeleccionadaText + " de educaci\u00F3n en el a\u00F1o " + consultaEducacion.anioTextoSeleccionado;
                                    for (var i in featureSet.fields) {
                                        if (featureSet.fields[i].name == "NOMBRE" || featureSet.fields[i].name == "TOTALESTUDIANTES") {
                                            fields[a] = featureSet.fields[i];
                                            a++;
                                        }
                                    }

                                }
                                ////obtiene los valores para la serie X y seria Y                                        
                                labelSerieX[0] = { value: 0, text: 0 };
                                for (var i in featureSet.features) {
                                    i = parseInt(i);
                                    labelSerieX[i + 1] = {};
                                    labelSerieX[i + 1].value = i + 1;
                                    labelSerieX[i + 1].text = featureSet.features[i].attributes.NOMBRE;
                                    valoresSeries[i] = {};
                                    valoresSeries[i].nombre = featureSet.features[i].attributes.NOMBRE;
                                    valoresSeries[i].dato = featureSet.features[i].attributes[atributo];
                                }
                                document.getElementById("divResultIndicadoresCE").style.display = "block";
                                document.getElementById("divResultIndicadoresCE").style.height = "240px";
                                document.getElementById("grafIndicaCE").style.display = "flex";
                                gridTabla = "gridTabInd";
                                var title;
                                if (consultaEducacion.indicadorSeleccionadaText == "Cobertura") {
                                    document.getElementById(divTabla).style.display = "flex";
                                    document.getElementById(divTabla).style.height = "153px";
                                    document.getElementById(divTabla).style.paddingTop = "5px";
                                    document.getElementById(divTabla).style.overflow = "unset";
                                    document.getElementById("divResultIndicadoresCE").style.marginTop = "-20px";
                                    document.getElementById("divResultIndicadoresCE").style.marginBottom = "60px";
                                    document.getElementById("exportarCE").style.display = "flex";
                                    consultaEducacion.heightResultado = 560;
                                } else {
                                    document.getElementById(divTabla).style.display = "block";
                                    document.getElementById(divTabla).style.height = "135px";
                                    title = "Cobertura";
                                }
                                document.getElementById(divTabla).style.borderRadius = "10px";
                                document.getElementById(divTabla).style.justifyContent = "center";
                                document.getElementById(divTabla).style.border = "grove";
                                document.getElementById(divTabla).style.width = "auto";
                                dibujarGraficaBarrasCE("grafIndicaCE", titulo, labelSerieX, valoresSeries, "Municipio", title);
                            }
                            ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthResultado, consultaEducacion.heightResultado);
                            featureSet.fields = fields;
                            consultaEducacion.leyendaIndicadores = leyenda;
                            if (consultaEducacion.indicadorSeleccionadaText != "Tasa de Analfabetismo" || consultaEducacion.categoriaSeleccionadaText == "Municipio") {
                                mostrarLeyendaCE(tituloLeyenda, leyenda);
                                graficasPoblacionCE(featureSet);
                                resaltarGraficaMunicipiosCE(featureSet.features[0]);
                                if (consultaEducacion.categoriaSeleccionadaText == "Municipio") {
                                    let campoVer1 = "NOMBRE";
                                    let campoVer2 = "TOTALMUNICIPIO";
                                    labelSerieX[0] = { value: 0, text: 0 };
                                    for (var i in featureSet.features) {
                                        i = parseInt(i);
                                        labelSerieX[i + 1] = {};
                                        labelSerieX[i + 1].value = i + 1;
                                        labelSerieX[i + 1].text = featureSet.features[i].attributes[campoVer1];
                                        valoresSeries[i] = {};
                                        valoresSeries[i].nombre = featureSet.features[i].attributes[campoVer1];
                                        valoresSeries[i].dato = featureSet.features[i].attributes[campoVer2];
                                    }
                                    document.getElementById("grafIndicaCE").style.display = "flex";
                                    dibujarGraficaBarrasCE("grafIndicaCE", "Municipios", labelSerieX, valoresSeries, "                    ", "%");
                                }
                            } else {
                                document.getElementById("grafIndicaCE").style.display = "flex";
                                let campoVer1, campoVer2;
                                if (consultaEducacion.categoriaSeleccionadaText == "Departamento") {
                                    campoVer1 = "GENERO";
                                    campoVer2 = "TOTALDEPTO";
                                }
                                labelSerieX[0] = { value: 0, text: 0 };
                                for (var i in featureSet.features) {
                                    i = parseInt(i);
                                    labelSerieX[i + 1] = {};
                                    labelSerieX[i + 1].value = i + 1;
                                    labelSerieX[i + 1].text = featureSet.features[i].attributes[campoVer1];
                                    valoresSeries[i] = {};
                                    valoresSeries[i].nombre = featureSet.features[i].attributes[campoVer1];
                                    valoresSeries[i].dato = featureSet.features[i].attributes[campoVer2];
                                }
                                dibujarGraficaBarrasCE("grafIndicaCE", "", labelSerieX, valoresSeries, "                    ", "%");
                            }
                            mostrarResultadosEnTablaGeneralCE(featureSet, divTabla, 11, false, gridTabla);
                            document.getElementById("btnRegresarCE").style.display = "block";
                            var bdconsultarQueryTask = consultaEducacion.bdconsultarQueryTask;
                            var featureSet, existeConsulta = false;

                            for (var i in bdconsultarQueryTask) {
                                if (bdconsultarQueryTask[i].consultaPor == consultaEducacion.consultaPor[1].name) {
                                    if (bdconsultarQueryTask[i].indicador == consultaEducacion.layers[0].name) {
                                        if (bdconsultarQueryTask[i].nivel == consultaEducacion.textoNivelSeleccionado) {
                                            if (bdconsultarQueryTask[i].sector == consultaEducacion.sectorTextoSeleccionado) {
                                                if (bdconsultarQueryTask[i].anio == consultaEducacion.anioTextoSeleccionado) {
                                                    consultaEducacion.bdconsultarQueryTask[i].leyenda = leyenda;
                                                    consultaEducacion.bdconsultarQueryTask[i].featureSet = featureSet;
                                                    consultaEducacion.bdconsultarQueryTask[i].labelSerieX = labelSerieX;
                                                    consultaEducacion.bdconsultarQueryTask[i].valoresSeries = valoresSeries;
                                                    consultaEducacion.bdconsultarQueryTask[i].fields = featureSet.fields;
                                                    consultaEducacion.bdconsultarQueryTask[i].divTabla = divTabla;
                                                    consultaEducacion.bdconsultarQueryTask[i].gridTabla = gridTabla;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }


                        } else {
                            if (consultaEducacion.indicadorSeleccionadaText == consultaEducacion.layers[0].name) {
                                //cargarCobertura();         
                                var features = featureSet.features;
                                var atributo = "NIVEL";
                                var select = consultaEducacion.select;
                                cargarDataSelect(features, atributo, select);
                            } else if (consultaEducacion.indicadorSeleccionadaText == consultaEducacion.layers[3].name) {
                                if (consultaEducacion.categoriaSeleccionadaText == "Departamento" || consultaEducacion.categoriaSeleccionadaText == "Municipio") {
                                    document.getElementById("selectAnioCE").length = 0;
                                    ocultarMostrarDivs(["divAnioCE"], "flex");
                                    let features = featureSet.features,
                                        data = [];
                                    features.forEach(e => {
                                        data.push(e.attributes.ANIO);
                                    });
                                    data = descriminaRepetidos(data);
                                    data = ordenarDatos(data);
                                    cargarDatos("selectAnioCE", data);
                                } else {
                                    divsOcultar = ["divAnioCE", "divNivelCE", "divSectorCE", "divMunicipioCE", "divAtributoCE"];
                                    ocultarMostrarDivs(divsOcultar, "none");
                                    cargarCategoriaTasaDeAnalfabetismo();
                                }


                            } else {
                                divsMostrar = ["divAnioCE"];
                                divsOcultar = ["divCategoriaCE", "divNivelCE", "divSectorCE", "divMunicipioCE", "divAtributoCE"];
                                selctDisable = ["selectAnioCE"];
                                select = "selectAnioCE";
                                document.getElementById("divAnioCE").style.marginTop = "14px";
                                cargarDataSelect(featureSet.features, "ANIO", select)
                                ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
                                consultaEducacion.divMostrar = divsMostrar;
                                consultaEducacion.divsOcultar = divsOcultar;
                                consultaEducacion.selctDisable = selctDisable;
                                ocultarMostrarDivs(divsOcultar, "none");
                                ocultarMostrarDivs(divsMostrar, "flex");
                            }
                            var i = consultaEducacion.bdconsultarQueryTask.length;
                            consultaEducacion.bdconsultarQueryTask[i] = {};
                            consultaEducacion.bdconsultarQueryTask[i].consultaPor = consultaEducacion.consultaPorSeleccionada;
                            consultaEducacion.bdconsultarQueryTask[i].indicador = consultaEducacion.indicadorSeleccionadaText;
                            //consultaEducacion.bdconsultarQueryTask[i].data = featureSet;
                            consultaEducacion.bdconsultarQueryTask[i].select = select;
                            consultaEducacion.bdconsultarQueryTask[i].featureSetIndicador = featureSet;
                            consultaEducacion.featureSetIndicador = featureSet;
                            if (consultaEducacion.consultaPorSeleccionada == "Consulta por indicadores") {
                                if (consultaEducacion.indicadorSeleccionadaText != "Cobertura") {
                                    consultaEducacion.bdconsultarQueryTask[i].anios = consultaEducacion.datosCargados;
                                }
                            }
                            //     console.log("bdconsultarQueryTask:", consultaEducacion.bdconsultarQueryTask);
                        }

                    } else {
                        select = consultaEducacion.select;
                        atributo = consultaEducacion.campo;

                        for (var cc in featureSet.features) {
                            datos[cc] = featureSet.features[cc].attributes[atributo];
                        }
                        datos = ordenarDatos(descriminaRepetidos(datos));
                        textoCargando(select);
                        cargarDatos(select, datos);
                        $("#" + select).prop('disabled', false);

                        if (consultaEducacion.cargarAtributo) {
                            for (var i in consultaEducacion.bdconsultarQueryTask) {
                                if (consultaEducacion.bdconsultarQueryTask[i].consultaPor != undefined) {
                                    if (consultaEducacion.bdconsultarQueryTask[i].consultaPor == consultaEducacion.consultaPorSeleccionada) {
                                        if (consultaEducacion.bdconsultarQueryTask[i].categoria != undefined) {
                                            if (consultaEducacion.bdconsultarQueryTask[i].categoria == consultaEducacion.CategoriaSeleccionada) {
                                                if (consultaEducacion.bdconsultarQueryTask[i].municipio != undefined) {
                                                    if (consultaEducacion.bdconsultarQueryTask[i].municipio == consultaEducacion.municipioSeleccionado) {
                                                        consultaEducacion.bdconsultarQueryTask[i].atributosFeatureSet = featureSet;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            consultaEducacion.cargarAtributo = false;

                        } else {
                            var i = consultaEducacion.bdconsultarQueryTask.length;
                            consultaEducacion.bdconsultarQueryTask[i] = {};
                            consultaEducacion.bdconsultarQueryTask[i].consultaPor = consultaEducacion.consultaPorSeleccionada;
                            consultaEducacion.bdconsultarQueryTask[i].categoria = consultaEducacion.CategoriaSeleccionada;
                            //consultaEducacion.bdconsultarQueryTask[i].data = featureSet;
                            consultaEducacion.bdconsultarQueryTask[i].select = select;
                            consultaEducacion.bdconsultarQueryTask[i].municipios = datos;
                            //  console.log("bdconsultarQueryTask:", consultaEducacion.bdconsultarQueryTask);
                        }

                    }
                }

            } else {
                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados");
                document.getElementById("divConsultaPorCE").style.display = "flex";
                ocultarMostrarDivs(consultaEducacion.divMostrar, "flex");
                ocultarMostrarDivs(consultaEducacion.divsMostar, "flex");
                document.getElementById("divResultIndicadoresCE").style.display = "none";
                consultaEducacion.sectorSeleccionada = undefined;
                document.getElementById("selectAtributoCE").length = 0;
                ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, consultaEducacion.heightInicial);
            }
            hideLoader();


        }

        function cargarCobertura() {
            var divsMostrar = ["divCategoriaCE", "divNivelCE", "divSectorCE"];
            var divsOcultar = ["divMunicipioCE", "divAtributoCE"];
            var selctDisable = ["selectNivelCE", "selectSectorCE", "selectAnioCE"];
            var datos = [];
            document.getElementById("divAnioCE").style.marginTop = "0px";
            select = "selectCategoriaCE";
            datos[0] = "Total estudiantes";
            disabledSlects(true, selctDisable);
            cargarDatos(select, datos);
            consultaEducacion.divMostrar = divsMostrar;
            consultaEducacion.divsOcultar = divsOcultar;
            consultaEducacion.selctDisable = selctDisable;
            ocultarMostrarDivs(divsOcultar, "none");
            ocultarMostrarDivs(divsMostrar, "flex");
            ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthInicial, 279);
        }

        function consultarBDQueryTask(campo1, campo2, geometry, campoQuery, idSeleccion, select) {
            var existeConsulta;
            if (consultaEducacion.bdconsultarQueryTask.length > 0) {
                for (var i in consultaEducacion.bdconsultarQueryTask) {
                    if (consultaEducacion.bdconsultarQueryTask[i].categoria == idSeleccion) {
                        cargarDatos(consultaEducacion.bdconsultarQueryTask[i].select, consultaEducacion.bdconsultarQueryTask[i].municipios);
                        $("#" + consultaEducacion.bdconsultarQueryTask[i].select).prop('disabled', false);
                        existeConsulta = true;
                    }
                }
                if (!existeConsulta) {
                    var urlCapa = consultaEducacion.urlConsultaPor + "/" + idSeleccion;
                    consultaEducacion.select = select;
                    consultaEducacion.campo = campoQuery;
                    consultarQueryTask("*", urlCapa, geometry, "1=1");
                    existeConsulta = false;
                }
            } else {
                var urlCapa = consultaEducacion.urlConsultaPor + "/" + idSeleccion;
                consultaEducacion.select = select;
                consultaEducacion.campo = campoQuery;
                consultarQueryTask("*", urlCapa, geometry, "1=1");
            }
        }

        function mostrarResultadosEnTablaGeneralCE(result, divTabla, withMaximo, ocultarTabla, gridTabla) { //result es el array q contiene los datos a mostrar          
            if (result.features.length <= 0) {
                createDialogInformacionGeneral("<B> Info </B>", "La selecci\u00F3n no contiene resultados");
                disabledForm(false);
            } else {
                require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
                    function(lang, DataGrid, ItemFileWriteStore, dom) {
                        //////organiza datos para cargarlo en data_list                                             
                        //consultaEducacion.resultQuery = result.features;
                        if (consultaEducacion.tablaResultados != undefined) {
                            consultaEducacion.tablaResultados.destroy();
                            consultaEducacion.tablaResultados = undefined;
                        }

                        var data_list = [];
                        var data = {
                            identifier: "id",
                            items: []
                        };
                        var layout = [],
                            fields = [];
                        layout[0] = [];
                        consultaEducacion.lists = [];
                        let campoModificado;
                        for (var i = 0; i < result.fields.length; i++) {
                            if (consultaEducacion.categoriaSeleccionadaText == "Departamento" && result.fields[i].name == "NOMBRE") {
                                campoModificado = "DEPTO";
                                fields[i] = campoModificado;
                                result.fields[i].name = fields[i];
                            } else if (consultaEducacion.categoriaSeleccionadaText == "Municipio" && result.fields[i].name == "NOMBRE") {
                                campoModificado = "MUNICIPIO";
                                fields[i] = campoModificado;
                                result.fields[i].name = fields[i];
                            } else {
                                fields[i] = result.fields[i].name;
                            }
                        }
                        for (var i in result.features) {
                            data_list[i] = {};
                            for (var a in fields) {
                                if (result.features[i].attributes[fields[a]] == null) {
                                    if (consultaEducacion.categoriaSeleccionadaText == "Departamento" || consultaEducacion.categoriaSeleccionadaText == "Municipio") {
                                        if (result.features[i].attributes.NOMBRE != undefined) {
                                            let b = result.features[i].attributes.NOMBRE;
                                            delete result.features[i].attributes.NOMBRE
                                            result.features[i].attributes[campoModificado] = b;
                                            data_list[i][fields[a]] = result.features[i].attributes[fields[a]];
                                        }
                                    } else {
                                        data_list[i][fields[a]] = "";
                                    }

                                } else {
                                    data_list[i][fields[a]] = result.features[i].attributes[fields[a]];
                                }
                            }
                        }
                        var width = 0,
                            c = 0;
                        for (var a in fields) {
                            layout[0][a] = {};
                            layout[0][a].name = fields[a];
                            layout[0][a].field = fields[a];
                            layout[0][a].width = fields[a].length;
                            for (var c in data_list) {
                                if (data_list[c][fields[a]].toString().length > withMaximo || layout[0][a].width > withMaximo) {
                                    layout[0][a].width = withMaximo;
                                } else if (layout[0][a].width < data_list[c][fields[a]].toString().length) {
                                    layout[0][a].width = data_list[c][fields[a]].toString().length;
                                }
                            }

                        }

                        consultaEducacion.contadorListas = 0;
                        consultaEducacion.lists = data_list;
                        var features = result.features;
                        consultaEducacion.jsonConvertido = JSON.stringify(data_list);
                        var rows = data_list.length;
                        for (var i = 0, l = data_list.length; i < rows; i++) {
                            data.items.push(lang.mixin({ id: i + 1 }, data_list[i % l]));
                        }
                        var store = new ItemFileWriteStore({ data: data });
                        /*create a new grid*/
                        var grid = new DataGrid({
                            //id: 'gridCS',
                            id: gridTabla,
                            store: store,
                            structure: layout,
                            rowSelector: '5px',
                            selectionMode: 'single',
                            width: "100%",
                            canSort: function(col) {
                                return false;
                            }
                        });
                        consultaEducacion.tablaResultados = grid;
                        /*append the new grid to the div*/
                        grid.placeAt(divTabla);

                        /*Call startup() to render the grid*/
                        grid.startup();
                        grid.set('autoHeight', true);
                        grid.set('autoWidth', true);
                        grid.update();
                        var leyenda = dijit.byId("leyendaGraficaConsulta");
                        grid.on("RowClick", function(evt) {
                            selectedRowGridCE(evt);
                        }, true);

                        if (ocultarTabla) {
                            document.getElementById(divTabla).style.display = "none";
                        }
                        if (consultaEducacion.indicadorSeleccionadaText == "Tasa de Analfabetismo") {
                            document.getElementById(gridTabla).style.height = "100px";
                            document.getElementById("gridTabInd1").style.blockSize = 'auto';

                        } else {
                            document.getElementById(gridTabla).style.borderRadius = "10px";
                        }

                        //disabledForm(false);  
                    });
                ///////
            }
        }

        function selectedRowGridCE(seleccionado) {
            showLoader();
            map.graphics.clear();
            var graficasCargadas = consultaEducacion.graficasCargadas;
            var grafica;
            for (var i in graficasCargadas) {
                if (i == seleccionado.rowIndex.valueOf()) {
                    graficasCargadas[i].grafica.symbol.outline = consultaEducacion.outlineResaltar;
                    grafica = graficasCargadas[i].grafica;
                } else {
                    graficasCargadas[i].grafica.symbol.outline = consultaEducacion.outlinenormal;
                    grafica = graficasCargadas[i].grafica;
                }

                map.graphics.add(grafica);
            }
            hideLoader();
        }

        function mostrarDatosBdconsultarQueryTask(p, campo) {
            var bdconsultarQueryTask = consultaEducacion.bdconsultarQueryTask;
            for (var i in bdconsultarQueryTask) {
                if (bdconsultarQueryTask[i].consultaPor == consultaEducacion.consultaPorSeleccionada) {
                    var features = bdconsultarQueryTask[i].atributosFeatureSet.features;
                    for (var c in features) {
                        if (features[c].attributes.MUNICIPIO == consultaEducacion.MunicipioSeleccionada) {
                            if (features[c].attributes.NOMBREESTABLECIMIENTO == consultaEducacion.AtributoSeleccionada) {
                                document.getElementById(p).innerHTML = features[c].attributes[campo];
                            }
                        }
                    }
                }
            }
        }

        function mostrarLeyendaCE(tituloLeyenda, propiedadesLeyenda) {
            consultaEducacion.panelManager = PanelManager();
            consultaEducacion.widgetManager = WidgetManager();
            def = new Deferred();
            wm = WidgetManager.getInstance();
            LeyendaSocioeconomicaWidget = wm.getWidgetById('widgets_LeyendaSocioeconomica_1');
            consultaEducacion.leyenda = LeyendaSocioeconomicaWidget;
            if (LeyendaSocioeconomicaWidget == null) {
                //   console.log('Widget No esta cargado');
                confWidget = wm.appConfig.getConfigElementById('widgets_LeyendaSocioeconomica_1');
                //   console.log(confWidget);
                wm.loadWidget(confWidget).then(function() {
                    PanelManager.getInstance().showPanel(confWidget).then(function() {
                        wm.openWidget(confWidget.id);
                        topic.publish("leyendaSocioeconomica", { titulo: tituloLeyenda, configLeyenda: propiedadesLeyenda });
                        def.resolve();
                    });
                });
            }
        }

        function graficasPoblacionCE(featureSet) {
            var fields = featureSet.fields;
            consultaEducacion.campoCargarGrafica = fields[0].name;
            featuresResultPoblacion = featureSet.features;
            map.graphics.clear();
            consultaEducacion.graficasCargadas = [];
            for (var i in featuresResultPoblacion) {
                var graphic = featuresResultPoblacion[i];
                var symbol = simbologiaFeaturesCE(graphic);
                graphic.setSymbol(symbol);
                consultaEducacion.graficasCargadas[i] = {};
                consultaEducacion.graficasCargadas[i][fields[0].name] = featuresResultPoblacion[i].attributes[fields[0].name];
                consultaEducacion.graficasCargadas[i]["grafica"] = graphic;
                consultaEducacion.graficasCargadas[i]["symbol"] = symbol;
            }
        }

        function resaltarGraficaMunicipiosCE(feature) {
            var grafica, graficaCargada = true,
                r, g, b, width, extent;
            var campoCargarGrafica = consultaEducacion.campoCargarGrafica;
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
            if (feature.symbol == undefined) {
                feature.symbol = polygonSymbol;
            }
            for (var i in consultaEducacion.graficasCargadas) {
                if (consultaEducacion.graficasCargadas[i][campoCargarGrafica] == feature.attributes[campoCargarGrafica]) {
                    grafica = consultaEducacion.graficasCargadas[i].grafica;
                    //r =  grafica.symbol.outline.color.r;
                    grafica.symbol.outline.color.r = 14;
                    //g = grafica.symbol.outline.color.g;
                    grafica.symbol.outline.color.g = 109;
                    //b = grafica.symbol.outline.color.b;
                    grafica.symbol.outline.color.b = 37;
                    //width = grafica.symbol.outline.width;
                    grafica.symbol.outline.width = 4;
                    consultaEducacion.graficasCargadas[i].grafica = grafica;
                    graficaCargada = false;
                    extent = consultaEducacion.graficasCargadas[i].grafica.geometry.getExtent();
                }

                if (graficaCargada) {
                    /*if(){
      
                  }*/
                    map.graphics.add(consultaEducacion.graficasCargadas[i].grafica);
                    if (consultaEducacion.graficasCargadas[i].grafica.symbol != undefined) {
                        consultaEducacion.outlinenormal = consultaEducacion.graficasCargadas[i].grafica.symbol.outline;
                    }
                } else {
                    graficaCargada = true;

                }
            }
            map.graphics.add(grafica);
            consultaEducacion.outlineResaltar = grafica.symbol.outline;
        }

        function simbologiaFeaturesCE(feature) {
            var leyendasPoblacion;
            var totalPobMunicipio;
            var simbolo;
            leyendasPoblacion = consultaEducacion.leyendaIndicadores;
            if (consultaEducacion.indicadorSeleccionadaText == "Cupos ofertados") {
                totalPobMunicipio = feature.attributes.CANTIDADMATRICULADOS;
            } else if (consultaEducacion.indicadorSeleccionadaText == "Eficiencia interna") {
                totalPobMunicipio = feature.attributes[consultaEducacion.atributoEficiInter];
            } else if (consultaEducacion.indicadorSeleccionadaText == "Tasa de Analfabetismo") {
                totalPobMunicipio = feature.attributes["TOTALMUNICIPIO"];
            } else {
                totalPobMunicipio = feature.attributes.TOTALESTUDIANTES;
            }

            for (var i in leyendasPoblacion) {
                var leyenda = leyendasPoblacion[i];
                if (totalPobMunicipio >= leyenda.minimo && totalPobMunicipio <= leyenda.maximo) {
                    simbolo = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, Color("rgb(" + leyenda.colorLine + ")"), 2),
                        Color("rgb(" + leyenda.colorFondo + ")"));
                    if (simbolo.color.r == 255 && simbolo.color.g == 255 && simbolo.color.b == 255) {
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

        function dibujarGraficaBarrasCE(div, titulo, labelSerieX, valoresSeries, titleX, titleY) {
            require(["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines",
                    "dojo/fx/easing", "dojox/charting/plot2d/ClusteredColumns", "dojox/charting/plot2d/MarkersOnly", "dojox/charting/action2d/Tooltip",
                    "dojox/charting/widget/Legend", "dojox/charting/Chart2D", "dojox/charting/themes/Wetland", "dojox/charting/action2d/Highlight",
                    "dojo/ready"
                ],
                function(Chart, Default, Lines, easing, ClusteredColumns, MarkersOnly, Tooltip, Legend, Chart2D, Wetland, Highlight,
                    ready) {
                    ready(function() {

                        var legendTwo;
                        let valorMin = 9999999999,
                            valorMax = -9999999999;
                        valoresSeries.forEach(e => {
                            if (e.dato < valorMin) {
                                valorMin = e.dato;
                            }
                            if (e.dato > valorMax) {
                                valorMax = e.dato;
                            }
                        });
                        if (consultaEducacion.graficaResultados != undefined) {
                            consultaEducacion.graficaResultados.destroy();
                            consultaEducacion.graficaResultados = undefined;
                        }

                        var graficaConsulta = new dojox.charting.Chart2D(div, {
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
                            rotation: 85,
                            fixLower: "minor",
                            title: titleX,
                            titleOrientation: "away",
                            //fixUpper: "minor",
                            // min: 0,
                            //max: 13

                        });

                        graficaConsulta.setTheme(dojox.charting.themes.Wetland);

                        for (var i in valoresSeries) {
                            var a = parseInt(i) + 1,
                                dato;
                            if (valoresSeries[i].dato == 0) {
                                dato = 0.00000001;
                            } else {
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
                            if (valorMin > valoresSeries[i].dato) {
                                valorMin = valoresSeries[i].dato;
                            }
                            if (valorMax < valoresSeries[i].dato) {
                                valorMax = valoresSeries[i].dato;
                            }
                        }
                        if ((valorMin -= 10) < 0) {
                            valorMin = 0;
                        }
                        //valorMin -= 10;
                        valorMax += 1;


                        graficaConsulta.addAxis("y", {
                            vertical: true,
                            fixLower: "major",
                            //fixUpper: "major",
                            min: valorMin,
                            max: valorMax,
                            title: titleY
                        });

                        var a1 = new dojox.charting.action2d.Tooltip(graficaConsulta, "default");
                        //var a2 = new dojox.charting.action2d.Highlight(graficaConsulta, "default");

                        graficaConsulta.render();
                        consultaEducacion.graficaResultados = graficaConsulta;

                    });
                });
        }

        function cargarCategoriaTasaDeAnalfabetismo() {
            let datos = ["Departamento", "Municipio"];
            cargarDatos("selectCategoriaCE", datos);
        }



    });

function subirImagenCE(urlImagen, div, width, height) {
    if (document.getElementById('idCE') != null) {
        a = document.getElementById('idCE');
        a.parentNode.removeChild(a);
    }
    var imageParent = document.getElementById(div);
    imageParent.style.width = "100%";
    imageParent.style.height = "100%";
    var image = document.createElement("img");
    image.id = "idCE";
    image.src = urlImagen; // image.src = "IMAGE URL/PATH"
    image.style.width = width;
    image.style.height = height;
    image.style.border = "3px solid #73ad21";
    image.style.padding = "1px";
    image.alt = "Imagen no habilitada";
    image.onclick = "imagenClickCE()";
    imageParent.appendChild(image);
    consultaEducacion.imagenCargada = imageParent;
}

function imagenClickCE() {
    if (consultaEducacion.imagenCArgada) {
        ajustarTamanioWidget(consultaEducacion.panel, consultaEducacion.widthResultado, consultaEducacion.heightResultado);
        consultaEducacion.imagenCArgada = false;
        document.getElementById("divBtnesFormularioCE").style.display = "flex";
        document.getElementById("divResult1CE").style.display = "flex";
        document.getElementById("divVerMasCE").style.display = "flex";
        document.getElementById("imgExpanCE").style.display = "none";
        var div = "divImagen",
            height = "auto",
            width = "100%";
        var urlImagen = consultaEducacion.urlImagen;
        subirImagenCE(urlImagen, div, width, height);
    } else {
        consultaEducacion.imagenCArgada = true;
        document.getElementById("divBtnesFormularioCE").style.display = "none";
        document.getElementById("divResult1CE").style.display = "none";
        document.getElementById("imgExpanCE").style.display = "block";
        document.getElementById("divVerMasCE").style.display = "none";
        ajustarTamanioWidget(consultaEducacion.panel, 500, 400);
        var div = "imgExpanCE",
            height = "auto",
            width = "100%";
        var urlImagen = consultaEducacion.urlImagen;
        subirImagenCE(urlImagen, div, width, height);

        consultaEducacion.ocultarDivs = true;
    }
    consultaEducacion.ocultarDivs = !consultaEducacion.ocultarDivs;
}

function ExportarCE() {
    //ResultadosJson
    var ReportTitle = "Resultados";
    var ShowLabel = true;
    var ResultadosJson = consultaEducacion.jsonConvertido;
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