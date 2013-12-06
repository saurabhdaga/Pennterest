var connectData = { 
  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
  "user": "allstars", 
  "password": "harkarsausup", 
  "database": "PENNTR" };

var oracle =  require("oracle");
var crypto=require('crypto');
var express=require('express');
var app = express();

function query_db_interests(res) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	username = 
		  	connection.execute("SELECT distinct interest FROM interests",
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	console.log(results);
		  	    	//var interest= new Array();
		  	    	if(results.length >0)
		  	    		{
		  	    		/*for(var i=0;i<results.length;i++){
		  	    			console.log(' boards' + results[i].INTEREST);
		  	    			interest[i]=results[i].INTEREST;
		  	    			}*/
		  	    		
		  	    		res.render('update_profile.jade',{interests:results});
		  	    		
		  	    		}
		  	    		
		  	    	else
		  	    		console.log("no interests");
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}










module.exports.do_work = function(req, res){
	query_db_interests(res);
};