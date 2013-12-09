var connectData = { 
  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
  "user": "allstars", 
  "password": "harkarsausup", 
  "database": "PENNTR" };

var oracle =  require("oracle");
var crypto=require('crypto');
var express=require('express');
var app = express();

function query_db_search(res,tag) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	username = 
		  	connection.execute("select p.photoid, p.sourceid,url from photo p, tags t where p.photoid=t.photoid and p.sourceid=t.sourceid and LOWER(t.tag) LIKE LOWER('%"+tag+"%')",
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); 
		  	    	var answer=[];
		  	    	console.log(results.length);
		  	    	console.log((answer.length)/6);
		  	    	if(results.length >0)
		  	    		{
		  	    		for( var i=0; i <23;i++){
		  	    			answer[i]='http://ndevilla.free.fr/lena/lena.jpg';
		  	    			
		  	    		}
		  	    		var rem = Math.floor(answer.length/6);
		  	    		rem= Math.floor(rem*6);
		  	    		console.log(answer);
		  	    		result={answer:answer,
		  	    				top:Math.floor((answer.length)/6) ,
		  	    				bottom:(answer.length)%6,
		  	    				total:answer.length,
		  	    				rem:rem
		  	    				};
		  	    		console.log(result.top);
		  	    		res.render('search.jade',
		  	    			   { result:result
		  	    			   		}
		  	    		  );
		  	    		
		  	    		}
		  	    		
		  	    	else
		  	    		console.log("no results");
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}










exports.do_work = function(req, res){
	query_db_search(res,'F');
	
};