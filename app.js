var express = require('express');
//var images = require('./images');
var routes= require('./Routes');
//var fonts=require('./fonts');
var signup= require('./Routes/signup.js');
var login= require('./Routes/login');
var update_profile= require('./Routes/update_profile');
var profile=require('./Routes/profile');

var createBoard = require('./Routes/createBoard');
var board = require('./Routes/board');
var update_profile=require('./Routes/update_profile');
var index= require('./Routes/index');
var pin= require('./Routes/pin');
var rate=require('./Routes/rate');
var http = require('http');
var path = require('path');
var stylus =  require("stylus");
var nib =     require("nib");
var url= require("url");

var crypto=require('crypto');

// Initialize express
app=express();
// .. and our app
init_app(app);
app.get('/',function(req,res){
	res.render('login.jade');
});

app.post('/signup',signup.do_work);
app.post('/login',login.do_work);
app.get('/index',index.do_work);
//app.get('/update_profile',update_profile.do_work);
//app.post('/search',search.do_work);
app.post('/pin',pin.do_work);
app.post('/rate',rate.do_work);
app.post('/createBoard',createBoard.do_work);
app.get('/board',board.do_work);
//app.get('/update_profile',update_profile.do_work);
//app.post('/update_profile',update_profile.do_upload);
//app.get('/profile',profile.do_work);






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
      app.use(express.cookieParser());
      app.use(express.session({secret:'harkarsausup'}));
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