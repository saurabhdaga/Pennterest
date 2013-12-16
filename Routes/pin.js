

var connectData = { 
		  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
		  "user": "allstars", 
		  "password": "harkarsausup", 
		  "database": "PENNTR" };

		var oracle =  require("oracle");
		var crypto=require('crypto');
		var express=require('express');
		var app = express();
var setcache=require('./setcache');
function insert_pin(req,res,id,photo,source,board,callback){
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	console.log(photo);
	    	console.log(id);
	    	console.log(board);
	    	console.log(source);
		  	connection.execute("insert into pin values('"+photo+"','"+source+"','"+id+"','"+board+"')",
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	//document.alert("Cannot pin on the same board");
		  	    	console.log(err);
		  	    	connection.close();
		  	    	res.render('error.jade',{result:{total:null},boardResult:boardResult,ratingResult:null,req:req});
		  	    	callback && callback(null,null);
		  	    	
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	
		  	    	callback && callback(null,"done");
		  	    	
		  	    	
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	
}

exports.do_work = function(req, res){
	if(req.session.name!=null){
	console.log(req.body.sourceid);
	insert_pin(req,res,req.session.name,req.body.photoid,req.body.sourceid, req.body.boardSelected,setcache.do_work);
	res.redirect('index');
	}
	else
		{
		res.redirect('login');
		}
	


};