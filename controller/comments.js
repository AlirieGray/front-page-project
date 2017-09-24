var bodyParser = require('body-parser');
var Comment = require('../models/comment');
var Post = require('../models/post');

module.exports = function(app) {
  app.post('/posts/:id/comments', function(req, res) {
    // instantiate instance of model
    var comment = new Comment(req.body);

    Post.findById(req.params.id).exec(function (err, post) {
      comment.save(function (err, comment) {
        post.comments.unshift(comment);
        post.save();
        return res.redirect('/posts/' + post.id);
      });
    })
  });
};
