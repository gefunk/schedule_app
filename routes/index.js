
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {page: "home"});
};

exports.docs = function(req, res){
    res.render('docs', {page: "docs"});
}