var url = require('url')

exports.lookup = function(db){
	return function(req, res){
		/** get all the parameters **/
		var carrier, vessel, voyage, start_port, end_port, start_date, end_date = undefined;
		
		var query = {};
		var projection = {};
        
        if(req.method=='POST'){
    		if(req.body.carrier != undefined) query['carrier'] =  new RegExp(req.body.carrier, 'i');
    		if(req.body.vessel != undefined) query['vessel'] = new RegExp(req.body.vessel, 'i');
    		if(req.body.voyage != undefined) {
    			query['voyages.voyage'] = req.body.voyage;
    			projection['voyages.voyage.$'] = 1;
    		};
    		if(req.body.start_port != undefined) start_port = req.body.start_port;
    		if(req.body.end_port != undefined) end_port = req.body.end_port;
    		if(req.body.start_date != undefined) query['ports.etd'] = {"$gte": date_parse(req.body.start_date)};
    		if(req.body.end_date != undefined) end_date = date_parse(req.body.end_date);
        }else if(req.method == 'GET'){
            var url_parts = url.parse(req.url, true);
            var getquery = url_parts.query;
    		if(getquery.carrier != undefined) getquery['carrier'] =  new RegExp(decodeURIComponent(getquery.carrier), 'i');
    		if(getquery.vessel != undefined) getquery['vessel'] = new RegExp(decodeURIComponent(getquery.vessel), 'i');
    		if(getquery.voyage != undefined) {
    			getquery['voyages.voyage'] = decodeURIComponent(getquery.voyage);
    			projection['voyages.voyage.$'] = 1;
    		};
    		if(getquery.start_port != undefined) start_port = decodeURIComponent(getquery.start_port).trim();
    		if(getquery.end_port != undefined) end_port = decodeURIComponent(getquery.end_port).trim();
    		if(getquery.start_date != undefined) query['ports.etd'] = {"$gte": date_parse(getquery.start_date)};
    		if(getquery.end_date != undefined) end_date = date_parse(getquery.end_date);
        }
		
		
		var schedules = db.collection("schedules");
		var ports_collection = db.collection("ports");
		
		if(start_port && end_port){

			// look up port in port collection, by search term, this will qualify name, port code, etc...
			ports_collection.findOne({"info.search_term": new RegExp(start_port, 'i')}, function(err, docs){
				if(docs != null){
                    //console.log("Start Port", docs);
					start_port = docs.info.port_code_c;
					ports_collection.findOne({"info.search_term": new RegExp(end_port, 'i')}, function(err, docs){
					if(docs != null){
						end_port = docs.info.port_code_c;
                        
						// generate schedule query - using start port, end port and query params above
						var and = [{"ports.port_info.port_code": start_port}, {"ports.port_info.port_code": end_port}];
						query["$and"] = and;
						var options = {"sort":"ports.eta"};
						schedules.find(query, options).toArray(function(err, docs){

							var response_data = [];
							// loop through all the returned schedules , arrange data in order of eta
                            
							for(var voyage in docs){
								var ports = docs[voyage]['ports'];
                                
								// sort the ports by eta
								ports.sort(function(a,b){
								    if (a.eta < b.eta)
								       return -1;
								    else if (a.eta > b.eta)
								      return 1;
								    return 0;
								});
								var route_data = [];
								var start_port_etd = null;
								var end_port_eta = null;
								var start_port_found = false;
				
								/*
								extract the start port to the end port from the full route
								*/
								for (var pindex in ports){
                                    
									if(ports[pindex]['port_info']["port_code"].toUpperCase() == start_port.toUpperCase()){
										start_port_found = true;
										start_port_etd = ports[pindex]['etd'];
									}else if(ports[pindex]['port_info']["port_code"].toUpperCase() == end_port.toUpperCase()){
										end_port_eta = ports[pindex]['eta'];
										// if we found the start port before 
										// we find the end port
										// then we want to add it to the list
										if(start_port_found && (end_port_eta > start_port_etd)
											&& (start_date == undefined || (start_date < start_port_etd))
											&& (end_date == undefined || (end_date > end_port_eta))){
											
											// assemble the route
											route_data.push(ports[pindex]);		
											// add to response
											response_data.push(
												{
													"carrier":docs[voyage]['carrier'],
													"voyage":docs[voyage]['voyage'],
													"update_date":docs[voyage]['scrape_date'],
													"source":docs[voyage]['url'],
													"vessel": docs[voyage]['vessel'],
													"route":route_data
												}
											);
									
										}// end start_port found
										/* 
										no need to continue processing rest of schedule 
										we found the start and end ports already
										*/
										break; 
									}
					
									// start port is found so add it to the collection
									if(start_port_found){
										route_data.push(ports[pindex]);
									}
                                }
							}// end for voyage in docs
			
							// sort the response data by eta
							response_data.sort(function(a,b){
								if(a.route[0].eta < b.route[0].eta)
									return -1;
								else if(a.route[0].eta > b.route[0].eta)
									return 1;
								return 0;
							});
							// respond with the header information
                            var successHeaders = {
                                'Content-Type':'application/json',
                                'Expires' : new Date(Date.now() + 900000),
                                'Cache-Control' : "public"
                            }
							res.set(successHeaders);
							res.send(JSON.stringify(response_data));
						});// end schedules.find
					}else{
						// handle end port not found error
						res.setHeader('Content-Type', 'application/json');
						res.send(JSON.stringify({"error": "Could not find end port"}));
					}
				});// end find end port
			}else{
				// handle start port not found error
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({"error": "Could not find start port"}));
			}
		}); // end find start port
		}else{
			schedules.find(query, projection).toArray(function(err, docs){
				// respond with the header information
                var successHeaders = {
                    'Content-Type':'application/json',
                    'Expires' : new Date(Date.now() + 900000),
                    'Cache-Control' : "public"
                }
				res.set(successHeaders);
				res.send(JSON.stringify(docs));
			});
		}
			
		
		
	};
};

/*
* parse a date string passed in through the url or post
*/
function date_parse(strDate){
	var dateParts = strDate.split("-");
	return new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
}