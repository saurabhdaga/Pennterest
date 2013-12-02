
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
function query_db(res,name,pass) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("SELECT * FROM USERS where name='"+name+"' and password='"+pass+"'",
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	console.log(results);
		  	    	if(results.length >0)
		  	    		{console.log('Valid login');
		  	    		res.redirect('index');
		  	    		/*
		  	    		app.use(express.cookieParser());
		  	    		app.use(express.session({
		  	    		  
		  	  		    user: name
		  	  		  }));
		  	    	req.session={"loginDetails":name};
		  	    	*/
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
		   { title1: "invalid username or password"
		}
	  );
}


exports.do_work = function(req, res){
	var sha1=crypto.createHash('sha1');
	var pass=sha1.update(req.body.password).digest('hex');
	var user=query_db(res,req.body.username,pass);
	

	
};
