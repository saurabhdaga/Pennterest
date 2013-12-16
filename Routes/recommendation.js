
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





function query_newsfeed_1(req,callback) {

	 oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("select photoid,sourceid,userid,url,firstname||' '||lastname as username,tag from pin natural join photo natural join tags inner join users on pin.userid=users.email where (photoid,sourceid) in (select photoid,sourceid from pin natural join tags where tag in (select tag from tags where tag in (select interest from interests where userid='"+req.session.name+"')) union select photoid,sourceid from pin where boardname in (select interest from interests where userid='"+req.session.name+"')) union all select photoid, sourceid, userid, url, firstname||' '||lastname as username,tag from pin natural join photo natural join tags inner join users on pin.userid=users.email where (photoid,sourceid) in (select p.photoid,p.sourceid from pin p inner join rating r on p.photoid=r.photoid and r.sourceid=p.sourceid and r.userid in (select friend from friends f where userid=p.userid) group by p.userid,p.boardname,p.photoid,p.sourceid having avg(r.score)>(select avg(score)from rating where userid in (select friend from friends f where userid=p.userid))) union all select photoid, sourceid, userid,url,firstname||' '||lastname as username,tag from pin natural join photo natural join tags inner join users on pin.userid=users.email where (photoid,sourceid) in (select r.photoid,r.sourceid from rating r group by r.photoid,r.sourceid,r.userid having avg(r.score)>(select avg(score)from rating))",
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
		  	    		
		  	  	else
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
		
		 
	   var str="with recomendations as (select photoid,sourceid,userid,url,firstname||' '||lastname as username,tag from pin natural join photo natural join tags inner join users on pin.userid=users.email where (photoid,sourceid) in (select photoid,sourceid from pin natural join tags where tag in (select tag from tags where tag in (select interest from interests where userid='"+req.session.name+"')) union select photoid,sourceid from pin where boardname in (select interest from interests where userid='"+req.session.name+"')) union all select photoid, sourceid, userid, url, firstname||' '||lastname as username,tag from pin natural join photo natural join tags inner join users on pin.userid=users.email where (photoid,sourceid) in (select p.photoid,p.sourceid from pin p inner join rating r on p.photoid=r.photoid and r.sourceid=p.sourceid and r.userid in (select friend from friends f where userid=p.userid) group by p.userid,p.boardname,p.photoid,p.sourceid having avg(r.score)>(select avg(score)from rating where userid in (select friend from friends f where userid=p.userid))) union all select photoid, sourceid, userid,url,firstname||' '||lastname as username,tag from pin natural join photo natural join tags inner join users on pin.userid=users.email where (photoid,sourceid) in (select r.photoid,r.sourceid from rating r group by r.photoid,r.sourceid,r.userid having avg(r.score)>(select avg(score)from rating)))"+
"select photoid,sourceid, avg(score) as avg_score from rating group by(photoid,sourceid) having (photoid,sourceid)in(select photoid,sourceid from recomendations)";
	   console.log(str);
	 	connection.execute(str,
	 	  [], 
	 	  function(err, qresults) {
	 	   if ( err ) {
	 	   	console.log(err);
	 	   } else {
	 		   
	 		  if(qresults.length >0){
	 	   	connection.close(); // done with the connection
	 	  
	 	  
	 	  
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


// query_db_boards(req,res,req.session.name);
 
  if(req.session.name!=null){
  
 
	//while(true){
		
		console.log("DDDD");
	

		query_newsfeed_1(req,function(err, resultNews){
		
			
			query_db_boards(req,req.session.name,function(err,boardResult){
				req.session.boards=boardResult;
				console.log("Printing sessions");
				var ratingOrder ={"rating":[]};
				query_db_rating(req,function(err,ratingResult){
					if(resultNews!= null   && ratingResult!= null){
					for (var k=0;k<resultNews.photoid.length;k++){
						for (var m=0; m<ratingResult.rating.length;m++){
							if((resultNews.photoid[k]+resultNews.sourceid[k]).match(ratingResult.rating[m].PHOTOID+ratingResult.rating[m].SOURCEID)!=null){
								ratingOrder.rating[k]={"PHOTOID":resultNews.photoid[k],"SOURCEID":resultNews.sourceid[k],"AVG_SCORE":ratingResult.rating[m].AVG_SCORE};
								
								console.log("blaah");
							}
									
									
									
									
							}
							
							
							
						}
						console.log("adter");
				console.log(ratingOrder);
				console.log("hello");
				console.log(resultNews);
						
						
				getcache(res,resultNews,0,function (err,resultNews){
						
					
					res.render('index.jade',{result:resultNews,boardResult:boardResult,ratingOrder:ratingOrder,req:req});
				});
					}
					else
						res.render('index.jade',{result:{total:null},boardResult:boardResult,ratingOrder:null,req:req});
				
				});
			});
			
			
		});
		
  }
  else
	  {
	  res.redirect('login');
	  }
	 
};
