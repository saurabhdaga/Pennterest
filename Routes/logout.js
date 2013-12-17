exports.do_work = function(req, res){
req.session.name=null;
res.redirect('/login');
};