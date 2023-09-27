// Publish project specific data
(function() {
rh = window.rh;
model = rh.model;

rh.consts('DEFAULT_TOPIC', encodeURI("#First_Topic.htm".substring(1)));
rh.consts('HOME_FILEPATH', encodeURI("index.htm"));
rh.consts('START_FILEPATH', encodeURI('index.htm'));
rh.consts('HELP_ID', '22659E70-9803-4B14-8D7D-0DB059ACE309' || 'preview');
rh.consts('LNG_STOP_WORDS', ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "aceptar", "ahí", "alguna", "algunas", "alguno", "algunos", "aquí", "aún", "cada", "como", "cómo", "con", "cuál", "cualquier", "cualquiera", "cuando", "cuándo", "de", "deber", "dentro", "desde", "después", "dónde", "el", "él", "ella", "ello", "ellos", "en", "entonces", "entre", "era", "eran", "es", "esos", "esto", "estos", "forma", "hacer", "hacia", "hecho", "igual", "junto", "la", "lo", "los", "más", "necesitar", "ninguno", "no", "nosotros", "ó", "o", "otra", "otro", "otroa", "para", "pero", "poder", "por", "porque", "puede", "qué", "que", "queremos", "re", "ser", "si", "sido", "sin", "son", "soy", "sus", "también", "tan", "tener", "tiene", "todo", "Todo", "Todos", "todos", "tu", "tus", "u", "un", "una", "uno", "usado", "usando", "usar", "usted", "ustedes", "utilizando", "utilizar", "ver", "vosotros", "y", "ya", "Yo"]);
rh.consts('LNG_SUBSTR_SEARCH', 0);

model.publish(rh.consts('KEY_DIR'), "ltr");
model.publish(rh.consts('KEY_LNG_NAME'), "es_ES");
model.publish(rh.consts('KEY_LNG'), {"SearchResultsPerScreen":"Resultados de búsqueda por página","Reset":"Restablecer","SyncToc":"Sincronizar TOC","HomeButton":"Inicio","WebSearchButton":"WebSearch","GlossaryFilterTerms":"Encontrar término","HighlightSearchResults":"Highlight search results","ApplyTip":"Aplicar","Welcome_header":"Bienvenido a nuestro Centro de ayuda","WebSearch":"WebSearch","Show":"Mostrar","ShowAll":"Mostrar todo","EnableAndSearch":"Include all words in search","Welcome_text":"¿En qué le podemos ayudar hoy?","Next":">>","PreviousLabel":"Anterior","NoScriptErrorMsg":"Active la compatibilidad con JavaScript en el explorador para ver esta página.","Print":"Imprimir","Contents":"Contenido","Search":"Búsqueda","Hide":"Ocultar","Canceled":"Cancelado","ShowHide":"Mostrar/Ocultar","Loading":"Cargando...","EndOfResults":"Fin de resultados de búsqueda.","favoritesLabel":"Favoritos","Logo":"Logotipo","ContentFilterChanged":"Se ha cambiado el filtro de contenido, vuelva a buscar","SidebarToggleTip":"Expandir/colapsar","Logo/Author":"Desarrollado por","JS_alert_LoadXmlFailed":"Error: no se pudo cargar el archivo xml.","Searching":"Buscando...","SearchTitle":"Buscar","Copyright":"© Copyright 2017. Todos los derechos reservados.","favoritesNameLabel":"Nombre","Disabled Next":">>","JS_alert_InitDatabaseFailed":"Error: no se pudo inicializar la base de datos.","Cancel":"Cancelar","unsetAsFavorite":"Quitar de favoritos","nofavoritesFound":"You have not marked any topic as favorite.","UnknownError":"Error desconocido","ResultsFoundText":"%1 resultado(s) encontrado(s) para %2","Index":"Índice","Seperate":"|","SearchPageTitle":"Resultados de búsqueda","TopicsNotFound":"No se han encontrado temas.","setAsFavorites":"Añadir a favoritos","setAsFavorite":"Establecer como favorito","Glossary":"Glosario","Filter":"Filtrar","SearchButtonTitle":"Buscar","NextLabel":"Siguiente","TableOfContents":"Tabla de contenido","HideAll":"Ocultar todo","Disabled Prev":"<<","SearchOptions":"Opciones de búsqueda","Back":"Atrás","Prev":"<<","OpenLinkInNewTab":"Abrir en nueva ficha","JS_alert_InvalidExpression_1":"Las palabras que ha escrito no son una expresión válida.","IndexFilterKewords":"Encontrar palabra clave","IeCompatibilityErrorMsg":"Esta página no se puede ver en Internet Explorer 8 o versiones anteriores.","NavTip":"Close","ToTopTip":"Ir al principio","FavoriteBoxTitle":"Favoritos","ShowTopicInContext":"Haga clic aquí para ver esta página en contexto"});

model.publish(rh.consts('KEY_HEADER_DEFAULT_TITLE_COLOR'), "#ffffff");
model.publish(rh.consts('KEY_HEADER_DEFAULT_BACKGROUND_COLOR'), "#025172");
model.publish(rh.consts('KEY_LAYOUT_DEFAULT_FONT_FAMILY'), "\"Trebuchet MS\", Arial, sans-serif");

model.publish(rh.consts('KEY_HEADER_TITLE'), "SIG_QUINDIO_III_MANUAL");
model.publish(rh.consts('KEY_HEADER_TITLE_COLOR'), "#ffffff");
model.publish(rh.consts('KEY_HEADER_BACKGROUND_COLOR'), "#509de6");
model.publish(rh.consts('KEY_HEADER_LOGO_PATH'), "template/Azure_Blue/logo.png");
model.publish(rh.consts('KEY_LAYOUT_FONT_FAMILY'), "\"Trebuchet MS\", Arial, sans-serif");
model.publish(rh.consts('KEY_HEADER_HTML'), "<div class='topic-header' onClick='rh._.goToFullLayout()'>\
  <div class='logo'>\
    <img src='#{logo}' />\
  </div>\
  <div class='nav'>\
    <div class='title' title='#{title}'>\
      <span>#{title}</span>\
    </div>\
    <div class='gotohome' title='#{tooltip}'>\
      <span>#{label}</span>\
    </div></div>\
  </div>\
<div class='topic-header-shadow'></div>\
");
model.publish(rh.consts('KEY_HEADER_CSS'), ".topic-header { background-color: #{background-color}; color: #{color}; width: calc(100%); height: 3em; position: fixed; left: 0; top: 0; font-family: #{font-family}; display: table; box-sizing: border-box; }\
.topic-header-shadow { height: 3em; width: 100%; }\
.logo { cursor: pointer; padding: 0.2em; text-align: center; display: table-cell; vertical-align: middle; }\
.logo img { width: 1.875em; display: block; }\
.nav { width: 100%; display: table-cell; }\
.title { width: 40%; height: 100%; float: left; line-height: 3em; cursor: pointer; }\
.gotohome { width: 60%; float: left; text-align: right; height: 100%; line-height: 3em; cursor: pointer; }\
.title span, .gotohome span { padding: 0em 1em; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; display: block; }");

})();