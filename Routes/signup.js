
var connectData = { 
  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
  "user": "allstars", 
  "password": "harkarsausup", 
  "database": "PENNTR" };
var oracle =  require("oracle");
var crypto=require('crypto');


function query_db(res,name,email,pass) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("SELECT * FROM USERS where name='"+name+"' and email='"+email+"'",
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	console.log(results);
		  	    	if(results.length >0)
		  	    		user_exists(res,name,email,results);
		  	    	else
		  	    		insert_user(res,name,email,pass);
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}
function user_exists(res,name,email,results) {
	
	res.render('login.jade',
		   { title: "user already exists"
		}
	  );
}
function insert_user(res,name,email,password){
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("insert  into USERS values ( 3,'"+name+"','"+password+"',null,'"+email+"',null,'m',null,null)",
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	//console.log('DDDD'+"insert  into USERS values ( 3,'"+name+"','"+password+"',null,'"+email+"',null,'m',null,null);");
		  	    	console.log(err);
		  	    	connection.close();
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	
}

exports.do_work = function(req, res){
	var sha1=crypto.createHash('sha1');
	var pass=sha1.update(req.body.passwordsignup).digest('hex');
	
	query_db(res,req.body.usernamesignup,req.body.emailsignup,pass);
	
	


};