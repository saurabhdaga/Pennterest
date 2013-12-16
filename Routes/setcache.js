var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db,
Server = require('mongodb').Server,
ReplSetServers = require('mongodb').ReplSetServers,
ObjectID = require('mongodb').ObjectID,
Binary = require('mongodb').Binary,
GridStore = require('mongodb').GridStore,
Grid = require('mongodb').Grid,
Code = require('mongodb').Code,
BSON = require('mongodb').pure().BSON,
assert = require('assert');
var MongoDB = require('mongodb');
var fs = require('fs');

var request = require('request');
var http = require('http');
var connectData = { 
		  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
		  "user": "allstars",
		  "password": "harkarsausup", 
		  "database": "PENNTR" };
var oracle =  require("oracle");

function query_db(callback) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("select * from ((select photoid,sourceid, url,cacheflag from photo where cacheflag = 0) natural join(select photoid,sourceid,count(photoid) from pin group by photoid,sourceid having count(photoid)>=4))",[], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	//console.log(results);
		  	    	if(results.length >0){
		  	    	//	console.log(results);
		  	    		
		  	    		callback&&callback(null,results);
		  	    	}

		  	    }

		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}


function query_mongo(sql_res){
	
	MongoClient.connect('mongodb://localhost:27017/pennterest', function(err, db) {
//		MongoClient.connect('mongodb://harshitha:har5kar@ds053838.mongolab.com:53838/pennterest', function(err, db) {
		if(!err) {
			console.log("We are connected");
		}
		var fileid=[];
		var url=[];
		
		for( var inx=0;inx<sql_res.length;inx++){
			
			fileid[inx]=String((sql_res[inx].PHOTOID + sql_res[inx].SOURCEID)).replace(" ","");
			url[inx]=String(sql_res[inx].URL);
			
			console.log(fileid[inx],url[inx]);
			
		
		
		var gridStore = new GridStore(db,fileid[inx],url[inx], 'w');
		// Open the file
		gridStore.open(function(err, gridStore) {
			//console.log(gridStore.filename);
			
			http.get(gridStore.filename, function (response) {

				response.setEncoding('binary');

				var image2 = '';

				console.log('reading data in chunks first');
				response.on('data', function(chunk){
					image2 += chunk;
					console.log('reading data');
				});

				response.on('end', function() {
					console.log('done reading data'+"  "+gridStore.fileId);

					image = new Buffer(image2,"binary");

					// Write some data to the file
					gridStore.write(image, function(err, gridStore) {
						assert.equal(null, err);

						// Close (Flushes the data to MongoDB)
						gridStore.close(function(err, result) {
							assert.equal(null, err);
                            
							GridStore.read(db, gridStore.filename, function(err, fileData) {
								if (err)
									console.log("errrr");
						
								assert.equal(image.toString('base64'), fileData.toString('base64'));

								console.log('Done, writing local images for testing purposes');
								console.log("File length is " +fileData.length);
							    console.log('Really done');

							});
						});
					});
				});
			});
		});
	}
	});
	
}

exports.do_work = function(){
	query_db(function(err,sql_res){
		if (sql_res.length >0)
			query_mongo(sql_res,function(err,str){
				console.log(str);
				
				
			});
	});
	
	
};
