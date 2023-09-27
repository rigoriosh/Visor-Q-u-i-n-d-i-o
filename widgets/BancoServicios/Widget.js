define([
    "dojo/_base/declare",
    'jimu/BaseWidget',
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/dom-class",
    'dojox/grid/DataGrid',
    'dojo/data/ItemFileWriteStore',
    'dojo/dom',
    "jimu/WidgetManager",
    'dojo/data/ItemFileReadStore',
    'dojo/domReady!'
    

],
    function (declare, BaseWidget, lang, style, domClass, DataGrid, ItemFileWriteStore, dom, WidgetManager, ItemFileReadStore) {

        /**
         * Crea un nuevo NombreWidget (Constructor)
         * @class
         * @alias module:NombreWidget     
         * @property {String} templateString - Contenido del archivo template.html
         * @property {String} baseClass - valor del atributo class del nodo traido en el template
         * @property {String} id - identificador del widget
         * 
         */
        return declare("widgetBancoServicios", [BaseWidget], {

            baseClass: "widget-BancoServicios",
            id: 'widgetBancoServicios',
            toolbar: null,
            layer: null,
            /**
             * Funcion del ciclo de vida del Widget en Dojo, se dispara cuando
             * todas las propiedades del widget son definidas y el fragmento
             * HTML es creado, pero este no ha sido incorporado en el DOM.
             * 
             * @function         
             */
            postCreate: function () {
                console.log("EN POSTCREATE...");
                this.inherited(arguments);

            },
            /**
            * Funcion del ciclo de vida del Widget en Dojo,se dispara despues
            * del postCreate, cuando el nodo ya esta insertado en el DOM.  
            * 
            * @function
            */
            startup: function () {
                this.inherited(arguments);

                var objetoServicios = [];
                var urlServicioTOC = SERVICIO_BANCO_SERVICIOS;
                $.ajax({
                    type: 'GET',
                    url: urlServicioTOC,
                    async: false,
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {

                        for (var x = 0; x < response.directorio_wfs.length; x++) {
                            var objServTemp = {
                                colDesc: response.directorio_wfs[x].descripcion,
                                colUrl: response.directorio_wfs[x].url,
                                colEnl: response.directorio_wfs[x].url
                            }
                            objetoServicios.push(objServTemp);
                        }
                    },
                    error: function (response) {
                        console.log("ERROR....");
                        console.log(response);
                    }
                });

                function formatoEnlace(dato) {
                    return ('<a target="_blank" href="' + dato + '">' + "Ir al Servicio" + '</a>');
                }

                var layout = [[
                    { 'name': 'Descripci\xF3n', 'field': 'colDesc', 'width': '200px' },
                    { 'name': 'URL', 'field': 'colUrl', 'width': '500px' },
                    { 'name': 'Enlace', 'field': 'colEnl', 'width': '80px', 'formatter': formatoEnlace }
                ]];

                var store = new ItemFileReadStore({
                    data: {
                        items: objetoServicios
                    }
                });

                var grid = new DataGrid({
                    id: 'grid',
                    store: store,
                    structure: layout,
                    rowSelector: '20px',
                    style: "width: 802px;",
                });

                grid.placeAt("gridDiv");
                grid.startup();
                grid.set('autoHeight', false);
                grid.set('autoWidth', true);
            },
            /**
            * Codigo a ejecutar antes de destruir el widget  
            * 
            * @function
            */
            onDestroy: function () {

            },

            onOpen: function () {
                var panel = this.getPanel();
                var width = 830;
                var height = 300;
                ajustarTamanioWidget(panel, width, height);
            }
        });
    });

//function setearVariable() {
//    contexto = "SETEADO...."

//    return contexto;
//}