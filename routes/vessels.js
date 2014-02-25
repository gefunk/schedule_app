
/*
 * GET a list of all vessels.
 */
exports.list = function(db){
	return function(req, res){
		var schedules = db.collection("schedules");
	  	schedules.distinct("vessel", function(e, docs){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(docs));
	  	});
	};
};

/*
* GET a vessel by name
*/
exports.find_by_name = function(db){
	return function(req, res){
		var vessels = db.collection("schedules");
		var vessel_name = decodeURIComponent(req.params.name);
		vessel_name = vessel_name.toUpperCase();
	  	vessels.find({"vessel": new RegExp(vessel_name)}).toArray(function(e, docs){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(docs));
	  	}); 
	};
}; 


