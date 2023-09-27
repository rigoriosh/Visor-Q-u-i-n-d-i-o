

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
            name: 'NumeroVisitas',
            baseClass: 'jimu-widget-NumeroVisistas',

            postCreate: function () {


            },

            startup: function () {


                $.ajax({
                    type: 'GET',
                    url: window.location.origin + window.location.pathname + "/s/c/v/total",
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {

                        var jsonResponse = JSON.parse(response);
                        var totalVisitas = jsonResponse.totalVisitas;
                        $('#numeroVisitas').html(totalVisitas.toLocaleString());
                    }

                });

                /** Aumenta el numero de visitas */
                if (!document.cookie.includes("cookieContadorQuindio=visita")) {

                    var now = new Date();
                    now.setDate(now.getDate() + 1)
                    //now.setDate(now.getTime() + 1*60000);
                    document.cookie = 'cookieContadorQuindio=visita;expires=' + now.toGMTString() + ';path=/';

                    /**Llamado a servicio */

                    var dd = now.getDate();

                    var mm = now.getMonth() + 1;
                    var yyyy = now.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }

                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    var fechaFormato = dd + '/' + mm + '/' + yyyy;

                    $.ajax({
                        contentType: 'application/json; charset=utf-8',
                        method: "POST",
                        url: window.location.origin + "/s/c/v/add",
                        data: JSON.stringify({
                            "verificacion": md5(fechaFormato),
                        }),
                        success: function (response) {
                            console.log("regCount");
                        },
                        error: function (request, status, error) {
                            console.log("Error regCount");
                        }
                    });
                }


            }



        });
    });

