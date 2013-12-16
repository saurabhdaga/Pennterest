/*
 * GET home page, which is specified in Jade.
 */
var connectData = { 
  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
  "user": "allstars", 
  "password": "harkarsausup", 
  "database": "PENNTR" };

var oracle =  require("oracle");
var crypto=require('crypto');
var express=require('express');
var app = express();
function query_db(req,res,email,pass) {
 oracle.connect(connectData, function(err, connection) {
   if ( err ) {
   	console.log(err);
   } else {

   var str="select password from users where email ='"+email+"'";
  
 	connection.execute(str,
 	  [], 
 	  function(err, results) {
 	   if ( err ) {
 	   	console.log(err);
 	   } else {
 	   	connection.close(); // done with the connection
 	  	console.log(results);

 	  	if(results.length >0 && results[0].PASSWORD == null)
 	  		insert_user(res,req,email,pass);
 	  		
 	  	else if (results.length >0 && results[0].PASSWORD.indexOf(pass) !=-1)
 	   	{
 	   		
 	   		console.log('Valid login');
 	   	req.session.name= email;
 	   	req.session.number = '1';
 	 
 	   
 	   res.redirect('index');
 	   	
 	   	
 	   	
 	   	}
 	   	
 	   	else
 	   	login_invalid(res);
 	   	
 	   }
 	}); // end connection.execute
   }
 }); // end oracle.connect
}

function login_invalid(res) {
res.render('login.jade',
  { title1: "invalid Email or password"
}
 );
}

function insert_user(res,req,email,pass){
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("update USERS set password = '"+pass+"' where email='"+email+"'",
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	//console.log('DDDD'+"insert  into USERS values ( 3,'"+name+"','"+password+"',null,'"+email+"',null,'m',null,null);");
		  	    	console.log(err);
		  	    	connection.close();
		  	    } else {
		  	    	console.log('Valid login');
		  	 	   	req.session.name= email;
		  	 	   	req.session.number = '1';
		  	 	 
		  	 	   
		  	 	   res.redirect('index');
		  	    	
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	
}

exports.do_work = function(req, res){
//	console.log(req);
var sha1=crypto.createHash('sha1');
var pass=sha1.update(req.body.password).digest('hex');
var user=query_db(req,res,req.body.email,pass);
};