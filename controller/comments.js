var bodyParser = require('body-parser');
var Comment = require('../models/comment');
var Post = require('../models/post');
var User = require('../models/user');

module.exports = function(app) {
  app.post('/posts/:id/comments', function(req, res) {
    // instantiate instance of model
    console.log(req.body.content);
    var comment = new Comment(req.body);
    console.log("user?");
    console.log(req.user);
    User.findById(req.user.id).exec(function (err, user) {
      Post.findById(req.params.id).exec(function (err, post) {
        comment.save(function (err, comment) {
          post.comments.unshift(comment);
          post.save();
          console.log("saved comment");
          return res.redirect('/posts/' + post.id);
        });
      })
    })
  });
};
