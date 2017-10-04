const User = require('../models/user.js');
const Comment = require('../models/comment.js');
const Post = require('../models/post.js');
const mongoose = require('mongoose');

module.exports = function(app) {
  app.post('/posts/:id/comments', function(req, res) {
    console.log("req body: ");
    console.log(req.body.userId);
    var author = User.findById(req.body.userId).exec().then(function(user) {
      var comm = new Comment({
        content: req.body.content,
        author: user,
      });
      console.log(comm.content);
      var id = req.params.id;
      Post.findById(req.params.id).exec(function(err, post) {
        comm.save(function (err, comment) {
          post.comments.unshift(comment);
          post.save();

          return res.redirect('/posts/' + id);
        })
      })
    });
  });
};
