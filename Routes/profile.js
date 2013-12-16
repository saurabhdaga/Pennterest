var connectData = { 
  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
  "user": "allstars", 
  "password": "harkarsausup", 
  "database": "PENNTR" };

var oracle =  require("oracle");
var crypto=require('crypto');
var express=require('express');
//var app = express();
var fs= require('fs');

function query_db_check_friend(req,callback) {
    
      oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
              // selecting rows
        	console.log("select count(*) as total from friends where userid='"+req.session.name+"' and friend='"+req.param('name')+"'");
            username = 
              connection.execute("select count(*) as total from friends where userid='"+req.session.name+"' and friend='"+req.param('name')+"'",
                         [], 
                         function(err, results) {
                  if ( err ) {
                      console.log(err);
                      connection.close();
                  } else {
                      connection.close(); // done with the connection
                      console.log(results);
                      //var interest= new Array();
                      console.log("printing first callback");
                      console.log(results[0].TOTAL);
                      callback && callback(null,results[0].TOTAL);
                      
                  }
        
              }); // end connection.execute
        }
      }); // end oracle.connect
     
    }



function query_get_data(req,callback) {
    
    oracle.connect(connectData, function(err, connection) {
      if ( err ) {
          console.log(err);
      } else {
            // selecting rows
    	  console.log("select firstname||' '||lastname as username,birthday,affiliation,displaypicture from users where email='"+req.param('name')+"'");
          username = 
            connection.execute("select firstname||' '||lastname as username,to_char(birthday,'MM-DD-YYYY') as birthday,affiliation,displaypicture from users where email='"+req.param('name')+"'",
                       [], 
                       function(err, results) {
                if ( err ) {
                    console.log(err);
                    connection.close();
                } else {
                    connection.close(); // done with the connection
                    console.log(results);
                    //var interest= new Array();
                    console.log("Printing second callback");
                    console.log(results);
                    callback && callback(null,results);
                    
                }
      
            }); // end connection.execute
      }
    }); // end oracle.connect
  
  }





exports.do_work = function(req, res){
	if(req.session.name!=null){
    query_db_check_friend(req,function(err,friendCount){
    	query_get_data(req,function(err,data){
    		console.log('sendjdjd');
    		console.log(data);
    		console.log(friendCount);
    		res.render('profile.jade',{friendCount:friendCount,data:data,boardsResult:req.session.boards,req:req});
    	});
    });}
	else
		{
		res.redirect('login');
		}
   
};