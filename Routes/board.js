
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




function query_photo_board(req,board,callback) {

	 oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("select p.photoid,p.sourceid,p.userid,pp.url,u.firstname||' '||u.lastname as username,t.tag  from users u, pin p, photo pp, tags t where p.userid=u.email and p.photoid=pp.photoid and p.sourceid=pp.sourceid and t.photoid=p.photoid and t.sourceid=p.sourceid and p.boardname='"+board+"' and p.userid='"+req.session.name+"'",
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
		  	    			
		  	    			if(photoid.indexOf(qresults[i].PHOTOID) !=-1 && sourceid.indexOf(qresults[i].SOURCEID) !=-1)//found
		  	    				{
		  	    			
		  	    			     var t=	tag[photoid.indexOf(qresults[i].PHOTOID)];
		  	
		  	    			     
		  	    			     t=t+"\n"+qresults[i].TAG;
		  	    				tag[photoid.indexOf(qresults[i].PHOTOID)]=t;
		  	    				
		  	    				
		  	    				
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
		  	    		console.log("noboards");
		  	    	
		  	    }
		
		  	}); // end connection.execute
	   
	   
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
	 	   		
	 	   		}
	 	  
	 	   	
	 	   	
	 	   }
	 	}); // end connection.execute
	  
	   }
	 }); // end oracle.connect
	
	}
	
function query_db_rating(req,callback) {

	 oracle.connect(connectData, function(err, connection) {
	   if ( err ) {
	   	console.log(err);
	   } else {
		
		 
	   var str="with rating1 as (select p1.photoid,p1.sourceid,p1.userid,p2.url,p1.username,p2.tag from ((select photoid,sourceid,p.userid,u.firstname||' ' ||u.lastname as username from pin p inner join users u on p.userid=u.email where p.userid in( select friend from friends where userid ='"+req.session.name+"')) p1 inner join (select photoid,sourceid,url,tag from photo natural join tags )p2 on p1.photoid=p2.photoid and p1.sourceid=p2.sourceid)),rating2 as (select photoid,sourceid,avg(score) as avg_score from rating group by photoid,sourceid having (photoid,sourceid)in (select photoid,sourceid from pin p where p.userid in( select friend from friends where userid = '"+req.session.name+"')))select photoid,sourceid,avg_score from rating2 union"
+" select photoid,sourceid, 0 as avg_score from(select photoid,sourceid from rating1 minus select photoid,sourceid from rating2)";
	   console.log(str);
	 	connection.execute(str,
	 	  [], 
	 	  function(err, qresults) {
	 	   if ( err ) {
	 	   	console.log(err);
	 	   } else {
	 	   	connection.close(); // done with the connection
	 	  
	 	  
	 	  
	 	  console.log(qresults);
	 	
	 	 ratingResult={rating:qresults};
	 	 
	 	 console.log("rating");
		 console.log(ratingResult);
	
		 callback && callback(null,ratingResult);
	 	
	 	   	
	 	   
	 	}
	 	});// end connection.execute
	
	   }
	 }); // end oracle.connect
	 
	 
	 
	}

exports.do_work = function(req, res){


		query_photo_board(req,req.param('name'),function(err, resultNews){
			
			query_db_boards(req,req.session.name,function(err,boardResult){
				
				query_db_rating(req,function(err,ratingResult){
					
					console.log("inside");
					console.log(resultNews);
					res.render('index.jade',{result:resultNews,boardResult:boardResult,ratingResult:ratingResult});
				});
				
				
			});
			
			
		});
		
		
	 
};
