
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var ports = require('./routes/ports')
var vessels = require('./routes/vessels')
var schedules = require('./routes/schedules')
var http = require('http');
var path = require('path');

// Mongodb connection
var MongoClient = require('mongodb').MongoClient
var mongourl = null;

// load express
var app = express();

// set mongo client
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
	app.disable('etag');
	mongourl = 'mongodb://127.0.0.1:27017/schedules';
}else if('production' == app.get('env')){
	mongourl = 'mongodb://schedules_scraper:T49Sq8aQ5LI8y4C@mongo.amfitir.com:27017/schedules'
}

/*
* open connection to mongo
*/
MongoClient.connect(mongourl, function(err, mongodb){
	if(err) throw err;
	
	// successfull mongo connection load app

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));


	app.get('/', routes.index);
    app.get('/docs', routes.docs);
	app.get('/users', user.list);
	
	// find ports
	app.get('/ports', ports.list(mongodb));
	app.get('/ports/id/:id', ports.find_by_id(mongodb));
	app.get('/ports/search/:search', ports.find_by_search_term(mongodb));

	// find vessels
	app.get('/vessels', vessels.list(mongodb));
	app.get('/vessels/search/:name', vessels.find_by_name(mongodb));
	
	// find schedules
	app.post('/', schedules.lookup(mongodb))

	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
});
