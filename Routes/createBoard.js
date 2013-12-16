

var connectData = { 
		  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
		  "user": "allstars", 
		  "password": "harkarsausup", 
		  "database": "PENNTR" };

		var oracle =  require("oracle");
		var crypto=require('crypto');
		var express=require('express');
		var app = express();
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
function insert_board(req,res,id,board){
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	/*console.log(photo);
	    	console.log(id);
	    	console.log(board);
	    	console.log(source);*/
		  	connection.execute("insert into board values('"+id+"','"+board+"')",
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
	//console.log(req.body.sourceid);
	if(req.session.name!=null){
	insert_board(req,res,req.session.name,req.body.board);
	}
	else
		{
		res.redirect('login');
		}
	


};