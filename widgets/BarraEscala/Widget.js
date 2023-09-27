var mapaBarra, xMin, yMin, xMax, yMax, extentInicial, escalas = [], item = 0, item1 = 0;
var entro = true, escala, centro, escalaAnterior, controlEscala;
var spatialRef, spatialRef3115;
var listaEscalas;

var lods = [
    {
        "level": 0,
        "resolution": 0.00118973050291514,
        "scale": 500000
    },
    {
        "level": 1,
        "resolution": 0.000713838301749084,
        "scale": 300000
    },
    {
        "level": 2,
        "resolution": 0.000356919150874542,
        "scale": 150000
    },
    {
        "level": 3,
        "resolution": 0.000237946100583028,
        "scale": 100000
    },
    {
        "level": 4,
        "resolution": 0.00011897305029151400000,
        "scale": 50000
    },
    {
        "level": 5,
        "resolution": 0.00005948652514575700000,
        "scale": 25000
    },
    {
        "level": 6,
        "resolution": 0.00002379461005830280000,
        "scale": 10000
    },
    {
        "level": 7,
        "resolution": 0.00001189730502915140000,
        "scale": 5000
    },
    {
        "level": 8,
        "resolution": 0.00000475892201166056000,
        "scale": 2000
    },
    {
        "level": 9,
        "resolution": 0.00000118973050291514000,
        "scale": 500
    }
];


define(['dojo/dom',
    'dojo/on',
    'dojo/_base/declare', 'jimu/BaseWidget',
    'dojo/_base/lang',
    'dojo/_base/html',
    'esri/map',
    'esri/geometry/Point',
    'dojo/query',
    'esri/tasks/query',
    'esri/geometry/Point',
    "esri/SpatialReference",
    "esri/tasks/GeometryService",

    "dojo/domReady!"
],
    function (dom, on,
        declare, BaseWidget,
        lang,
        html,
        Point,
        query,
        Query,
        Point,
        SpatialReference,
        GeometryService
    ) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here
            name: 'Escala',
            baseClass: 'jimu-widget-BarraScala',

            postCreate: function () {
                mapaBarra = this.map;
                this.inherited(arguments);

            },

            startup: function () {
                listaEscalas = document.getElementById("listaEscala");
                this.llenarSelectScala();
                mapaBarra.on("extent-change", this.ajustarSelectScala);
                listaEscalas.value = map.getLevel();
            },

            ajustarSelectScala: function (e) {
                var escala = mapaBarra.getLevel();
                listaEscalas.value = escala;
            },

            llenarSelectScala: function () {

                for (var i in lods) {
                    var opt = document.createElement('option');
                    var textoEscala = "1:" + lods[i].scale.toLocaleString('co');
                    opt.value = lods[i].level;
                    opt.text = textoEscala;
                    listaEscalas.options.add(opt);
                }
            }
        });
    });

function cambiarEscala(object) {
    escala = object[object.selectedIndex].value;
    map.setLevel(escala);
}
