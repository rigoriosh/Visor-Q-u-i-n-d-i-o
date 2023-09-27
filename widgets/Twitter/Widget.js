

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
            name: 'Facebook',
            baseClass: 'jimu-widget-Facebook',

            postCreate: function () {


            },

            startup: function () {

            },

        });
    });

