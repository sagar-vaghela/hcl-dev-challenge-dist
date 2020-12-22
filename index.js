/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html');
// Apply the styles in style.css to the page.
require('./site/style.css');

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// This will initialize and manage data emitter and html renderer.This will get the data from Data emitter and will parse it to html renderer.
const TableModule = require('./site/fx_price_table_module');

// Will emit the latest data received. Anyone listening to 'data-receive' event will get the latest data.
const DataHandler = require('./site/fx_service_data_emitter');

// This will be initialized by table module. It will get data from table module and render results to UI.
const HTMLHandler = require('./site/fs_price_table_html_renderer');

// Change this to get detailed logging from the stomp library
global.DEBUG = false;

document.addEventListener('DOMContentLoaded', function () {
    initPage();
});

const initPage = () => {
    var container = document.getElementById('root');
    var config = {
        container: container,
        sortByColumn: 'lastChangeBid'
    };
    new TableModule(config, DataHandler, HTMLHandler, window.Sparkline, window.Stomp);
}



