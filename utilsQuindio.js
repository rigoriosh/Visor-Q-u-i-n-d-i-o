var loadHtml = document.createElement('div');
loadHtml.innerHTML = '<img id="gifLoader" class="spinner" src="images/gifQuindio.gif" alt="SIG QUINDIO"/>';
municipios = [
    {
        nombre: "Armenia",
        id: 63001
    }, {
        nombre: "Buenavista",
        id: 63111
    }, {
        nombre: "Calarcá",
        id: 63130
    }, {
        nombre: "Circasia",
        id: 63190
    }, {
        nombre: "C\u00F3rdoba",
        id: 63212
    }, {
        nombre: "Filandia",
        id: 63272
    }, {
        nombre: "G\u00E9nova",
        id: 63302
    }, {
        nombre: "La Tebaida",
        id: 63401
    }, {
        nombre: "Montenegro",
        id: 63470
    }, {
        nombre: "Pijao",
        id: 63548
    }, {
        nombre: "Quimbaya",
        id: 63594
    }, {
        nombre: "Salento",
        id: 63690
    }
];
municipiosName = [{
    name: "Armenia",
    id: 63001
    }, {
        name: "Buenavista",
        id: 63111
    }, {
        name: "Calarcá",
        id: 63130
    }, {
        name: "Circasia",
        id: 63190
    }, {
        name: "C\u00F3rdoba",
        id: 63212
    }, {
        name: "Filandia",
        id: 63272
    }, {
        name: "G\u00E9nova",
        id: 63302
    }, {
        name: "La Tebaida",
        id: 63401
    }, {
        name: "Montenegro",
        id: 63470
    }, {
        name: "Pijao",
        id: 63548
    }, {
        name: "Quimbaya",
        id: 63594
    }, {
        name: "Salento",
        id: 63690
    }
];
function showLoader() {
    document.getElementById('main-page').appendChild(loadHtml);
}
function hideLoader() {
    if (document.getElementById('gifLoader') != undefined) {
        document.getElementById('main-page').removeChild(loadHtml);
    }
}
function createDialogInformacionGeneral(titulo, contenido) {
    require(["dijit/Dialog", "dojo/domReady!"], function (Dialog) {
        myDialogOT = new Dialog({
            title: titulo,
            content: contenido
            // style: "width: 400px"
        });
        myDialogOT.show();
    });
}
function ordenarDatos(datos) {
    if (typeof (datos[0]) == "string") {
        datos.sort();
    } else if (typeof (datos[0]) == "number") {
        datos.sort(function (a, b) { return a - b });
    } else if (typeof (datos) == "object") {
        var array = [];
        for (var i in datos) {
            array[i] = datos[i].name;
        }
        if (typeof (array[0]) == "string") {
            array.sort();
        } else if (typeof (array[0]) == "number") {
            array.sort(function (a, b) { return a - b });
        }
        datos = array;
    }else {
        console.log("tipo de dato no clasicaficado");
    }
    return datos;
}
function ordenarObjetoLayers(objeto) {
    var names = [], ObjetoOrdenado = [], c = 0;
    for (var i in objeto) {
        names[i] = objeto[i].name;
    }
    var dato = ordenarDatos(names);
    for (var i in dato) {
        for (var a in objeto) {
            if (dato[i] == objeto[a].name) {
                ObjetoOrdenado[c] = objeto[a];
                c++;
            }
        }
    }
    return ObjetoOrdenado;
}
function ocultarMostrarDivs(divs, /*condicion,*/ accion) {
    if (accion == undefined) {
        accion = "block";
    }
    //var accion;
    /*if (condicion) {
        accion = "none";
    } else {
        accion = "flex";
    }*/
    for (var i in divs) {
        document.getElementById(divs[i]).style.display = accion;
    }
}
function getOnlyFields(fields) {
    var onlyNameFields = [];
    for (var i in fields) {
        onlyNameFields[i] = fields[i].name;
    }
    return onlyNameFields;
}
function cargarDatos(contenedor, datos) {
    var agregarDato = document.getElementById(contenedor);
    agregarDato.length = 0;
    agregarDato.options[agregarDato.options.length] = new Option("Seleccione...", 777777);
    if (datos[0] != undefined) {
        if (datos[0].name != null) {
            for (var i in datos) {
                agregarDato.options[agregarDato.options.length] = new Option(datos[i].name, datos[i].id);
            }
        } else {
            for (var i in datos) {
                agregarDato.options[agregarDato.options.length] = new Option(datos[i], i);
            }
        }
    }
    $("#" + contenedor).prop('disabled', false);
}
function ajustarTamanioWidget(panel, width, height) {

    panel.position.width = width;
    panel.position.height = height;
    panel._originalBox = {
        w: panel.position.width,
        h: panel.position.height,
        l: panel.position.left,
        t: panel.position.top
    };
    //panel.setPosition(panel.position);
    panel.panelManager.normalizePanel(panel);

}
function limpiarContenedor(contenedor, disabled) {
    if(disabled == undefined){
        disabled = true;
    }
    document.getElementById(contenedor).length = 0;
    document.getElementById(contenedor).value = "";
    $("#" + contenedor).prop('disabled', disabled);
}
function dibujarPuntoConInfoTemplate(x, y, referenciaSpacial, mySymbol, attributos, myInfoTemplate, newZoom) {

    require(["esri/symbols/SimpleMarkerSymbol", "esri/graphic", "esri/geometry/Point", "esri/symbols/SimpleLineSymbol",
        "esri/Color"],
        function (SimpleMarkerSymbol, Graphic, Point, SimpleLineSymbol, Color) {

            if (mySymbol == undefined) {
                mySymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.5]), 10), new Color([0, 255, 0, 0.5]));
            }
            if (newZoom == undefined) {
                newPunto = 5000;
            }
            var myPunto = new Point(x, y, referenciaSpacial);

            var newPunto = new Graphic(myPunto, mySymbol, attributos, myInfoTemplate);
            map.graphics.add(newPunto);
            map.setScale(newZoom);
            map.centerAt(myPunto);

        });

}
function crearInfoTemplate(title, attributos, fields) {//atributos debe ser un objeto, y fields un array con los nombres de las propiedades del objeto atributos
    var datoInfo = "", myInfoTemplate;
    require(["esri/InfoTemplate"], function (InfoTemplate) {
        if (title == null || title == undefined) {
            title = "Sin titulo";
        }
        for (var i in fields) {
            if (typeof (fields[0]) == "object") {
                datoInfo += fields[i].name + ": " + attributos[fields[i].name] + "<br/>";
            } else if (attributos[fields[i]] != null) {
                datoInfo += fields[i] + ": " + attributos[fields[i]] + "<br/>";
            }

        }

        myInfoTemplate = new InfoTemplate(title, datoInfo);

    });

    return myInfoTemplate;
}
function crearFeatureLayer(url, opacity) {
    var myFeaturelayer;
    require(["esri/layers/FeatureLayer"], function (FeatureLayer) {
        myFeaturelayer = new FeatureLayer(url, {
            opacity: opacity
        });
    });
    return myFeaturelayer;
}
function descriminaRepetidos(arrayDatos) {
    // este codigo descrimina los string repetidos        
    var datosNoRepetidos = [], existe = false;
    datosNoRepetidos[0] = arrayDatos[0];
    for (var i in arrayDatos) {
        for (var a in datosNoRepetidos) {
            if (arrayDatos[i] == datosNoRepetidos[a]) {
                existe = true;
            }
        }
        if (!existe && arrayDatos[i] != null && arrayDatos[i] != " ") {
            datosNoRepetidos.push(arrayDatos[i]);
        }
        existe = false;
    }   
    return datosNoRepetidos;
    // fin codigo que descrimina los string repetidos
}
function disabledSlects(condition, divs) {
    if (condition) {
        showLoader();
    } else {
        hideLoader();
    }
    for (var i in divs) {
        $("#" + divs[i]).prop('disabled', condition);
        //limpiarContenedor(divs[i]);
    }
}
function habilitarSlects(condition, select) {
    $("#" + select).prop('disabled', condition);
}
function centrarYubicarPuntoEspecifico(x, y, referenciaSpacial, zoom) {
    require([
        "esri/geometry/Point", "esri/SpatialReference"
    ], function (Point, SpatialReference) {
        var loc = new Point(x, y, referenciaSpacial);
        var newZoom = zoom;
        map.setScale(newZoom);
        map.centerAt(loc);
    });
}
function convertirNumeroAfecha(datosOrdenados, agregarDato) {
    var fecha, fechaMostrar = [], existe = false;

    for (var i in datosOrdenados) {
        fecha = new Date(datosOrdenados[i]);
        fechaMostrar = (fecha.getDate() + 1) + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
        agregarDato.options[agregarDato.options.length] = new Option(fechaMostrar, i);
    }
}
function textoCargando(select) {
    var contenedor = document.getElementById(select);
    contenedor.length = 0
    contenedor.options[contenedor.options.length] = new Option("Cargando...", 777777);
    $("#" + select).prop('disabled', true);
}
function pintargrafica(tipo, symbol, features, fields, title) {
    require(["esri/geometry/Polyline", "esri/symbols/SimpleLineSymbol", "esri/graphic", "esri/Color"],
        function (Polyline, SimpleLineSymbol, Graphic, Color) {
            var graphic, polylineSymbol, polyline, infoTemplate, attributos, geometria;
            for (var i in features) {
                if (symbol == undefined) {
                    polylineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255, 0, 0, 0.25]), 3);
                } else {
                    polylineSymbol = symbol;
                }
                attributos = features[i].attributes;
                infoTemplate = crearInfoTemplate(title, attributos, fields);
                if (tipo == "polyline") {
                    geometria = new Polyline({
                        "paths":
                            features[i].geometry.paths,
                        "spatialReference": {
                            "wkid": map.spatialReference.wkid
                        }
                    });

                } else if (tipo == "polygone") {
                    geometria = features[i].geometry;
                }
                graphic = new Graphic(geometria, polylineSymbol, features[i].attributes, infoTemplate);
                map.graphics.add(graphic);
                if (features.length == 1) {
                    map.setExtent(features[0].geometry.getExtent());
                }
            }
        });
}

function esDispositivoMovil() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
function exportarACsvGeneral(JSONData, ReportTitle, ShowLabel) {

    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
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

}
function loader2(activar, load="loader_2") {
    const loader = document.getElementById(load);
    loader.style.display = activar?"flex":"none";
}
const exportarShape = (featureDataSet, load) => {

    /* 
        ejemplo featureDataSet
        featureDataSet = {
            features:[],
            geometryType:"",
            spatialReference:{}
        }
     */

    require(["esri/tasks/Geoprocessor",], function (Geoprocessor,) {
        loader2(true, load);
        var gp = new Geoprocessor(SERVICIO_SHAPEFILE);
        let parametros = {featureDataSet};
        //console.log(parametros)
        gp.execute(parametros, exportarShapeCompleto, errorExportarShapeCompleto);

        function exportarShapeCompleto(e) {
            if (e[1].value == true) {
                var link = document.createElement('a');
                link.setAttribute('href', e[0].value.url);
                link.setAttribute('download', 'Shape' + '.zip');
                link.setAttribute('type', "application/zip");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                loader2(false, load)
                createDialogInformacionGeneral("Resultado", "La descarga se realizó correctamente")
            } else {
                createDialogInformacionGeneral("Error", "No se pudo generar el archivo Shape")
                loader2(false, load)
            }
            // document.getElementById("loadingResultados").style.display = 'none';
        }

        function errorExportarShapeCompleto(e) {
            // document.getElementById("loadingResultados").style.display = 'none';
            createDialogInformacionGeneral("Error", "Fallo de comunicación con el sistema.");
            loader2(false, load)
        }

    });


}
