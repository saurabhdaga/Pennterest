
/*
 * GET home page, which is specified in Jade.
 */
var connectData = { 
  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
  "user": "allstars", 
  "password": "harkarsausup", 
  "database": "PENNTR" };
var express = require('express');
var oracle=require('oracle');
function query_db_boards(res,id) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("SELECT * FROM board where userid="+id,
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	console.log(results);
		  	    	if(results.length >0)
		  	    		{console.log(' boards' + results.length);
		  	    		res.render('index.jade',{results:results});
		  	    		
		  	    		}
		  	    		
		  	    	else
		  	    		console.log("noboards");
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

exports.do_work = function(req, res){
	//console.log("asdfadfg"+req.session);

  query_db_boards(res,'4');
};
