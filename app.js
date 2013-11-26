/**
 * Simple Homework 2 application for CIS 550
 * hahah whore karan
 * sup does shit
 * 
 * motherfucker
 */

/**
 * Module dependencies.
 */
var express = require('express');
//var images = require('./images');
var routes= require('./Routes');
//var fonts=require('./fonts');
var http = require('http');
var path = require('path');
var stylus =  require("stylus");
var nib =     require("nib");
var $ = require('jquery').create();

// Initialize express
var app = express();
// .. and our app
init_app(app);

app.get('/', function(req, res){
	  res.render('./index.jade', { 
		  title: 'HW2' 
	  });});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 8080);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options',{layout:true});
	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(app.router);
	app.use('/images/', express.static(__dirname + '/images/'));
	
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

}
