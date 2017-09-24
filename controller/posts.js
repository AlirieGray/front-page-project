var Post = require('../models/post');
var bodyParser = require('body-parser');
module.exports = function(app) {

  // CREATE
  app.post('/posts', function (req, res) {
    console.log(req.body);
    // INSTANTIATE INSTANCE OF POST MODEL
    var post = new Post(req.body);

    // SAVE INSTANCE OF POST MODEL TO DB
    post.save(function (err, post) {
      // REDIRECT TO THE ROOT
      return res.redirect('/');
    })
  });
};
