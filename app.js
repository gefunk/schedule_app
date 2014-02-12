
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
var mongo = require('mongodb');
var mongodb = new mongo.Db('schedules', new mongo.Server('localhost',27017), {safe:false});

/*
* open connection to mongo
*/
mongodb.open(function(err, mongodb){
	var app = express();

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

	console.log("Environemnt", app.get('env'));
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	  app.disable('etag');
	}

	app.get('/', routes.index);
	app.get('/users', user.list);
	
	// find ports
	app.get('/ports', ports.list(mongodb));
	app.get('/ports/id/:id', ports.find_by_id(mongodb));
	app.get('/ports/search/:search', ports.find_by_search_term(mongodb));

	// find vessels
	app.get('/vessels', vessels.list(mongodb));
	app.get('/vessels/name/:name', vessels.find_by_name(mongodb));
	
	// find schedules
	app.post('/', schedules.lookup(mongodb))

	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
});
