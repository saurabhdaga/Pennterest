exports.do_work = function(req, res){

	
	var bing = require('binger');
	var answers=[];
	var b = bing({appId:"49EB4B94127F7C7836C96DEB3F2CD8A6D12BDB71"});
	b.options.sources='image';
    
	b.search(req.param('name'), function(error, response, body){
	console.log("*******");
	console.log(body);
	
	for(var i=0; i <body.SearchResponse.Image.Results.length;i++)
	    answers[i]=body.SearchResponse.Image.Results[i].MediaUrl;
	console.log(answers);
	res.render('bing.jade',{result:answers,resultLength:answers.length,req:req});
	},{limit: 20});
	
	
	
	
	
};