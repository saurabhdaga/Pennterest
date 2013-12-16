
function query_db_update_friend(req,res) {
    
      oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
              // selecting rows
            username = 
              connection.execute("insert into friends values ('"+req.body.user+"','"+req.body.friend+"')",
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
                          console.log("updated friends");
                      res.redirect('profile?name='+req.session.name);
                      
                  }
        
              }); // end connection.execute
        }
      }); // end oracle.connect
    }










exports.do_upload = function(req, res){
   if(req.session.name!=null){
    
       query_db_update_friend(req,res); }
   else
	   {
	   res.redirect('login');
	   }
   
};