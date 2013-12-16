

var connectData = { 
		  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
		  "user": "allstars", 
		  "password": "harkarsausup", 
		  "database": "PENNTR" };

		var oracle =  require("oracle");
		var crypto=require('crypto');
		var express=require('express');
		var app = express();

function insert_rating(req,res,id,photo,source,rate){
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	console.log(photo);
	    	console.log(id);
	    	//console.log(board);
	    	console.log(rate);
		  	connection.execute("insert into rating values('"+photo+"','"+source+"','"+id+"','"+rate+"')",
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	
		  	    	console.log(err);
		  	    	connection.close();
		  	    	res.render('error.jade',{result:{total:null},boardResult:boardResult,ratingResult:null,req:req});
		  	    	
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	res.redirect('index');
		  	    	
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	
}

exports.do_work = function(req, res){
//	console.log(req.body);
	if(req.session.name!=null){
	insert_rating(req,res,req.session.name, req.body.photoid,req.body.sourceid,req.body.Rating);
	}
	else
		{
		res.redirect('login');
		}
	
	


};