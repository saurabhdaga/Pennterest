
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

var mutex=0;
var sync = require('sync');
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





function query_search(req,callback) {

	 oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("select photoid,sourceid,userid,url,firstname||' '||lastname as username,tag from pin natural join photo natural join tags inner join users on pin.userid=users.email where (photoid,sourceid) in(select photoid,sourceid from tags where instr(LOWER(tag),'"+req.body.search+"')<>0 union all select photoid,sourceid from tags where instr('"+req.body.search+"',LOWER(tag))<>0 union all select photoid,sourceid from tags where LOWER(tag) in (with test as(select LOWER('"+req.body.search+"') str from dual)select regexp_substr (str, '[^[:space:],]+', 1, rownum) split from test connect by level <= length (regexp_replace (str,'[^[:space:],]*'))  + 1))",
		  			   [], 
		  			   function(err,qresults) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	
		  	    	
		  	    	
		  	    	var photoid=[];
		  	    	var sourceid=[];
		  	    	var username=[];
		  	    	var userid=[];
		  	    	var answer=[];
		  	    	var tag=[];
		  	    	var inx=0;
		  	    	var i=0;
		  	    	
		  	    	if(qresults.length >0)
		  	    		{
		  	    		while(i<qresults.length)
		  	    			{
		  	    			console.log(qresults);
		  	    			if(photoid.indexOf(qresults[i].PHOTOID) !=-1 && sourceid.indexOf(qresults[i].SOURCEID) !=-1)//found
		  	    				{
		  	    			
		  	    			     var t=	tag[photoid.indexOf(qresults[i].PHOTOID)];
		  	    			     if(t.indexOf(qresults[i].TAG) == -1){
		  
		  	    			     
		  	    			     t=t+"\n"+qresults[i].TAG;
		  	    				tag[photoid.indexOf(qresults[i].PHOTOID)]=t;
		  	    			     }
		  	    				
		  	    			var u=username[photoid.indexOf(qresults[i].PHOTOID)];
                                         if(u.indexOf(qresults[i].USERNAME) == -1){
		  
		  	    			     
		  	    			     u=u+"\n"+qresults[i].USERNAME;
		  	    				username[photoid.indexOf(qresults[i].PHOTOID)]=u;
		  	    			     }
		  	    				
		  	    				
		  	    				
		  	    				}
		  	    			else{
		  	    				photoid[inx]=qresults[i].PHOTOID;
		  	    				sourceid[inx]=qresults[i].SOURCEID;
		  	    				userid[inx]=qresults[i].USERID;
		  	    				username[inx]=qresults[i].USERNAME;
		  	    				answer[inx]=qresults[i].URL;
		  	    				tag[inx]=qresults[i].TAG;
		  	    				inx++;
		  	    				
		  	    				
		  	    				
		  	    			}
		  	    	
		  	    			
		  	    		
		  	    			i++;
		  	    			
		  	    			
		  	    			}
		  	    	   
		  	    	  var rem = Math.floor(photoid.length/6);
		  	   		rem= Math.floor(rem*6);
		  	   	
		  	   		resultNews={photoid:photoid,
		  	   				sourceid:sourceid,
		  	   				userid:userid,
		  	   				
		  	   				answer:answer,
		  	   				username:username,
		  	   				tag:tag,
		  	   				
		  	   				
		  	   				top:Math.floor((photoid.length)/6) ,
		  	   				bottom:(photoid.length)%6,
		  	   				total:photoid.length,
		  	   				rem:rem,
		  	   				
		  	   				

		  	   				};
		  	   	callback && callback(null,resultNews);
		  	   		
		  	   	//	console.log(resultNews);
		 
		  	 
		  	 console.log("newsfeed");
		  	
		  	 
		  	    		}
		  	    		
		  	    	{
		  	    		console.log("noboards");
		  	   	callback && callback(null,null);}
		  	    	
		  	    }
		
		  	}); // end connection.execute
	   
	    mutex=mutex+1;
	    }
	  }); // end oracle.connect
	
	}

function query_db_boards(req,email,callback) {
	
	 oracle.connect(connectData, function(err, connection) {
	   if ( err ) {
	   	console.log(err);
	   } else {

	   var str="select boardname from board where userid ='"+email+"'";
	  
	 	connection.execute(str,
	 	  [], 
	 	  function(err, qresults) {
	 	   if ( err ) {
	 	   	console.log(err);
	 	   } else {
	 	connection.close();
	 	   	if(qresults.length >0 )
	 	   	{
	 	   		//console.log("hahahah");
	 	   		//console.log(qresults);
	 	   		var b=[];
	 	   		for (var i=0;i<qresults.length;i++)
	 	   					b[i]=qresults[i].BOARDNAME;
	 	   		
	 	  	
	 	boardResult={boards:b,
	 				boardsLength:b.length};
	 	console.log(boardResult);
	 	console.log("board");
		 console.log(boardResult);
		 callback && callback(null,boardResult);
	 	
	 	}
	 	   	
	 		else
 	   		{
 	   	callback && callback(null,null);
 	   		
 	   		}
	 	  
	 	   	
	 	   	
	 	   }
	 	}); // end connection.execute
	  
	 	mutex=mutex+1;
	   }
	 }); // end oracle.connect
	
	}
	
function query_db_rating(req,callback) {

	 oracle.connect(connectData, function(err, connection) {
	   if ( err ) {
	   	console.log(err);
	   } else {
		
		 
	   var str="select photoid,sourceid,userid,url,firstname||' '||lastname as username,tag from pin natural join photo natural join tags inner join users on pin.userid=users.email where (photoid,sourceid) in(select photoid,sourceid from tags where instr(LOWER(tag),'"+req.body.search+"')<>0 union all select photoid,sourceid from tags where instr('"+req.body.search+"',LOWER(tag))<>0 union all select photoid,sourceid from tags where LOWER(tag) in (with test as(select LOWER('"+req.body.search+"') str from dual)select regexp_substr (str, '[^[:space:],]+', 1, rownum) split from test connect by level <= length (regexp_replace (str,'[^[:space:],]*'))  + 1))";
	   console.log(str);
	 	connection.execute(str,
	 	  [], 
	 	  function(err, qresults) {
	 	   if ( err ) {
	 	   	console.log(err);
	 	   } else {
	 	   	connection.close(); // done with the connection
	 	  if(qresults.length >0){
	 	  
	 	  
	 	  console.log(qresults);
	 	
	 	 ratingResult={rating:qresults};
	 	 
	 	 console.log("rating");
		 console.log(ratingResult);
		// return ratingResult;
	 	// mutex++;
		 callback && callback(null,ratingResult);
	 	
	 	  }
		 else{
	 		  callback && callback(null,null);
	 		   
	 	   }
	 	}
	 	});// end connection.execute
	  
	 	mutex=mutex+1;
	   }
	 }); // end oracle.connect
	 
	 
	 
	}

function getcache(res,resultNews,ctr,callback){
	
	console.log("I'm connecting to mongodb to download the file");
    MongoClient.connect('mongodb://localhost:27017/pennterest', function(err, db) {
	    //		MongoClient.connect('mongodb://harshitha:har5kar@ds053838.mongolab.com:53838/pennterest', function(err, db) {
	if(err) {
	    console.log("We cannot connect");
	}
	else{
	
		if(ctr -1 == resultNews.photoid.length)
			return callback(null,resultNews);
	
	GridStore.read(db, resultNews.answer[ctr], function(err, fileData) {
		if(err){console.log("error"+ctr);getcache(res,resultNews,ctr+1,callback);}
		else{
			
			resultNews.answer[ctr]='data:image/png;base64,'+fileData.toString('base64');
			getcache(res,resultNews,ctr+1,callback);
		}
		
		
	});
	
	
	
	
	
	}
	    });
	
    
    
}



exports.do_work = function(req, res){


 
  if(req.session.name!=null){
  
 
		
		console.log("DDDD");
	

		query_search(req,function(err, resultNews){
			
			query_db_boards(req,req.session.name,function(err,boardResult){
				req.session.boards=boardResult;
				console.log("Printing sessions");
				
				query_db_rating(req,function(err,ratingResult){
					if(resultNews!= null   && ratingResult!= null){
					var ratingOrder ={"rating":[]};
					for (var k=0;k<resultNews.photoid.length;k++){
						for (var m=0; m<ratingResult.rating.length;m++){
							if((resultNews.photoid[k]+resultNews.sourceid[k]).match(ratingResult.rating[m].PHOTOID+ratingResult.rating[m].SOURCEID)!=null){
								ratingOrder.rating[k]={"PHOTOID":resultNews.photoid[k],"SOURCEID":resultNews.sourceid[k],"AVG_SCORE":ratingResult.rating[m].AVG_SCORE};
								
								console.log("blaah");
							}
									
									
									
									
							}
							
							
							
						}
					
					getcache(res,resultNews,0,function (err,resultNews){
					res.render('index.jade',{result:resultNews,boardResult:boardResult,ratingResult:ratingOrder,req:req});
				});
				}
					else
						res.render('index.jade',{result:{total:null},boardResult:boardResult,ratingResult:null,req:req});
				
				
				});
			});
			
			
		});

  }
  else
	  {
	  res.redirect('login');
	  }
	 
};
