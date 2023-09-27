

 var loadHtml = document.createElement('div');

loadHtml.innerHTML = '<div class="spinner">        <div class="rect1"></div>        <div class="rect2"></div>        <div class="rect3"></div>        <div class="rect4"></div>        <div class="rect5"></div>      </div>';


function showLoader() {
    document.getElementById('main-page').appendChild(loadHtml);
}
function hideLoader() {
    document.getElementById('main-page').removeChild(loadHtml);
}

