var connectData = { 
  "hostname": "cis550project.cwkds7yrl8wb.us-west-2.rds.amazonaws.com", 
  "user": "allstars", 
  "password": "harkarsausup", 
  "database": "PENNTR"};

var oracle =  require("oracle");
var crypto=require('crypto');
var express=require('express');
//var app = express();
var fs= require('fs');


function query_db_interests(req,res) {
      oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
              // selecting rows
            console.log("befor "+req.session.name);
            username = 
              connection.execute("SELECT distinct interest FROM interests minus select distinct interest from interests where userid ='"+req.session.name+"'",
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
                    	  console.log("upadte profiel");
                    	  //console.log(req.session.boards.length);
                          res.render('update_profile.jade',{interests:results,boardsResult:req.session.boards,boardsLength:req.session.boards.length,req:req});
                          
                          }
                          
                      else
                          console.log("no interests");
                          res.render('update_profile.jade',{req:req,interests:results});
                      
                  }
        
              }); // end connection.execute
        }
      }); // end oracle.connect
    }


function query_db_update_dp(req,res) {
    
    
    fs.readFile(req.files.displaypicture.path, function (err, data) {
          // ...
          var newPath =__dirname+"/displaypictures/"+req.files.displaypicture.name;
          fs.writeFile(newPath, data, function (err) {
            if( err){
                console.log("Couldnt Upload");
            }
            else{
                console.log("Uploaded!!");
            }
            
          });
        });
    
    
    
      oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
              // selecting rows
            username = 
              connection.execute("update users set displaypicture = 'Routes/displaypictures/"+req.files.displaypicture.name+"' where email ='"+req.session.name+"'",
                         [], 
                         function(err, results) {
                  if ( err ) {
                      console.log(err);
                      connection.close();
                      res.redirect('index');
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
                          console.log("dp updated");
                          res.render('update_profile.jade',{req:req,interests:results});
                          
                          }
                          
                      else{
                          console.log("dp updated");
                          
                      }
                      
                  }
        
              }); // end connection.execute
        }
      }); // end oracle.connect
    }


function query_db_update_affiliation(req,res) {
    
      oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
              // selecting rows
            username = 
              connection.execute("update users set affiliation = '"+req.body.affiliation+"' where email ='"+req.session.name+"'",
                         [], 
                         function(err, results) {
                  if ( err ) {
                      console.log(err);
                      connection.close();
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
                          console.log("dp updated");
                          res.render('update_profile.jade',{req:req,interests:results});
                          
                          }
                          
                      else
                          console.log("updated affiliations");
                      
                  }
        
              }); // end connection.execute
        }
      }); // end oracle.connect
    }

function query_db_update_bday(req,res) {
    
      oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
              // selecting rows
            username = 
              connection.execute("update users set birthday = '"+req.body.bdate+"' where email ='"+req.session.name+"'",
                         [], 
                         function(err, results) {
                  if ( err ) {
                      console.log(err);
                      connection.close();
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
                          console.log("dp updated");
                          res.render('update_profile.jade',{req:req,interests:results});
                          
                          }
                          
                      else
                          console.log("updated bdate");
                      
                  }
        
              }); // end connection.execute
        }
      }); // end oracle.connect
    }


function query_db_update_interest(req,res) {
    
      oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
              // selecting rows
            username = 
              connection.execute("insert into interests values ('"+req.session.name+"','"+req.body.interest+"')",
                         [], 
                         function(err, results) {
                  if ( err ) {
                      console.log(err);
                      connection.close();
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
                          
                          
                          }
                          
                      else
                          console.log("updated interest");
                      
                  }
        
              }); // end connection.execute
        }
      }); // end oracle.connect
    }




exports.do_work = function(req, res){
	if(req.session.name!=null)
    {query_db_interests(req,res);}
	else
		{
		res.redirect('login');
		}
    //console.log(req.body.interest);
};

exports.do_upload = function(req, res){
   if(req.session.name!=null){
    query_db_update_dp(req,res);
    query_db_update_affiliation(req,res);
    query_db_update_bday(req,res);
    if(req.body.interest!=null)
       {query_db_update_interest(req,res); }
    res.redirect('profile');}
   else
	   {
	   res.redirect('login');
	   }
   
};