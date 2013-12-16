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


exports.do_work = function(fileid){
    console.log("I'm connecting to mongodb to download the file");
    MongoClient.connect('mongodb://localhost:27017/pennterest', function(err, db) {
	    //		MongoClient.connect('mongodb://harshitha:har5kar@ds053838.mongolab.com:53838/pennterest', function(err, db) {
	if(!err) {
	    console.log("We are connected");
	}
	
//	var fileId = 'http://www.bubblews.com/assets/images/news/478069720_1384178114.jpg';
	GridStore.read(db, fileId, function(err, fileData) {
		if (err){
			
			console.log(fileid+"error");
			return null;
		}
		else
			{
	    console.log('Reading images from mongodb');
	    console.log(fileId);
	   /* 
	    res.writeHead(200,{
			'Content-Type': 'image/jpeg',
			'Content-Length':fileData.length});
	    res.write(fileData, "binary");
	    
		res.end(fileData,"binary");
		*/
		console.log('Really done');
		return fileData;
			}
	    });
	});
    
    
};


