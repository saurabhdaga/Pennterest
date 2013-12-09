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
                          
                          res.render('update_profile.jade',{interests:results});
                          
                          }
                          
                      else
                          console.log("no interests");
                          res.render('update_profile.jade',{interests:results});
                      
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
              connection.execute("update users set displaypicture = '/images/"+req.files.displaypicture.name+"' where email ='"+req.session.name+"'",
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
                          res.render('update_profile.jade',{interests:results});
                          
                          }
                          
                      else
                          console.log("dp updated");
                      
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
                          res.render('update_profile.jade',{interests:results});
                          
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
                          res.render('update_profile.jade',{interests:results});
                          
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
    query_db_interests(req,res);
    //console.log(req.body.interest);
};

exports.do_upload = function(req, res){
    //console.log("ASDF" + req.files.displaypicture.path);
    //console.log(req.body);
    //console.log(req.session.name);
    //console.log(req.body.interest.length);
    query_db_update_dp(req,res);
    query_db_update_affiliation(req,res);
    query_db_update_bday(req,res);
    query_db_update_interest(req,res); 
};