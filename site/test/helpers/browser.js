require('babel-register')();

var jsdom = require('jsdom');
const { JSDOM } = jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

const { document } = (new JSDOM(`...`, {url: "http://localhost"})).window;

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};

documentRef = document;
