/**
 * server.js
 */
var conf = require('config');
var urlParse = require('url-parse');

var fs = require('fs');
var path = require('path');
var express = require('express');
console.log('port number is '+8080);
console.log('preview server port number is '+8081);


// broccoli-html-editor app server
var app = express();
var server = require('http').Server(app);
app.use( require('body-parser')({"limit": "1024mb"}) );

app.use( '/apis/broccoli', require('./apis/broccoli.js')() );
app.use( '/broccoli-html-editor', express.static( __dirname+'/../../../../node_modules/broccoli-html-editor/client/dist/' ) );
app.use( '/jquery', express.static( __dirname+'/../../../../node_modules/jquery/dist/' ) );
app.use( express.static( __dirname+'/../htdocs/' ) );
server.listen( 8080, function(){
	console.log('server-standby');
} );


// preview server
var previewApp = express();
var previewServer = require('http').Server(previewApp);
previewApp.use( require('body-parser')({"limit": "1024mb"}) );
previewApp.use( express.static( __dirname+'/../../htdocs/' ) );
previewServer.listen(8081, function(){
	console.log('preview-server-standby');
});
