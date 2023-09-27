define([
    'dojo/_base/html'
], function (html) {


    var loadHtml = '<div class="map-loading">Loading...</div>';
    var loadContainer = html.toDom(loadHtml);
    html.place(loadContainer, map.root);

    function showLoader() {
        html.addClass(loadContainer, 'map-loading');
    }
    function hideLoader() {
        html.removeClass(loadContainer, 'map-loading');
    };

});