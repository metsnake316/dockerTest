var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//var session = require('express-session');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
var flash = require('connect-flash');
//var store  = new session.MemoryStore;
var router = express.Router();
var jadeStaticCache = require('jade-static-cache');
var serveStatic = require('serve-static')
i18n = require("i18n");
/*var i18next = require('i18next'),
  FilesystemBackend = require('i18next-node-fs-backend'),
  sprintf = require('i18next-sprintf-postprocessor'),
  i18nextMiddleware = require('i18next-express-middleware');

i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(FilesystemBackend)
  .use(sprintf)
  .init({
    saveMissing: true,
    debug: true
});
*/
i18n.configure({

//define how many languages we would support in our application
locales:['en', 'fr'],

//define the path to language json files, default is /locales
directory: __dirname + '/locale',

//define the default language
defaultLocale: 'en',

// define a custom cookie name to parse locale settings from 
cookie: 'i18n',

logDebugFn: function (msg) {
        console.log('debug', msg);
    }
});

app.use(cookieParser());

/*app.use(i18nextMiddleware.handle(i18next)); // expose req.t with fixed lng
app.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18next));
*/
/*app.use(session({
	secret : 'keyboard cat',
	name : 'sid',
	store: store,
	cookie : {
		secure : true, 
        path: '/',
        expires: false
	}
}));
*/

/*app.use(session({
	  cookie: {
	    path    : '/',
	    httpOnly: false,
	    maxAge  : 24*60*60*1000
	  },
	  secret: 'wearethebest'
	}));
*/

app.use(cookieSession({
  name: 'session',
  keys: ['keys1','keys2'],
  secret: 'wearethebest',
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('views', __dirname + '/views');
app.set('view options', {
	layout : false
});

app.use(require('stylus').middleware(__dirname + '/public'));
/*app.use(cacheControl({
    maxAge: 86400
}));
*/
app.use(serveStatic(path.join(__dirname, 'public'), {
  maxAge: '7d'
}))

var staticDir = path.join(__dirname, 'public');
app.use(jadeStaticCache.static(staticDir, '/cache'));


app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(i18n.init);

//app.use('/', routes);
var routes = require('./routes/index')(app);

// / catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});



//Labyoke
//179eabf1-4e28-43ef-bfb4-22159b624bcc
//whLEJQ31#!&gghhuBOO674[





var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
	console.log("Listening on " + port);
});

