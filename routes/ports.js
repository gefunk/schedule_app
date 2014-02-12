ObjectID = require('mongodb').ObjectID;
/*
 * GET a list of all ports`.
 */
exports.list = function(db){
	return function(req, res){
		var ports = db.collection("ports");
	  	ports.find().toArray(function(err, docs){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(docs));
	  	});
		
	};
};

/**
* GET find port by mongodb id
*/
exports.find_by_id = function(db){
	return function(req, res){
		var ports = db.collection("ports");
	  	ports.find({"_id": ObjectID(req.params.id)}).toArray(function(e, docs){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(docs));
	  	});
	};
};

/*
* GET by port name
*/
exports.find_by_search_term = function(db){
	return function(req, res){
		var ports = db.collection("ports");
	  	ports.find({"info.search_term": new RegExp(req.params.search, 'i')}).toArray(function(e, docs){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(docs));
	  	}); 
	};
}; 


