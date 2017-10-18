const User = require('../models/user.js');
const Comment = require('../models/comment.js');
const Post = require('../models/post.js');
const mongoose = require('mongoose');

module.exports = function(app) {
  app.post('/posts/:id/comments', function(req, res) {
    // anonymous comment
    var id = req.params.id;
    console.log(req.body.userId);
    if (req.body.userId == 0) {
      var user = new User({
        username: "anonymous",
        password: "none",
      });
      var comm = new Comment({
        content: req.body.content,
        author: user.username,
        authorId: req.body.userId
      });
      Post.findById(req.params.id).exec(function(err, post) {
        post.comments.unshift(comm);
        post.save();
        console.log('content')
        console.log(comm.content);
        return res.redirect('/posts/' + id);
      });
    } else {
    var author = User.findById(req.body.userId).exec().then(function(user) {
      var comm = new Comment({
        content: req.body.content,
        author: user.username,
        authorId: req.body.userId
      });
      Post.findById(req.params.id).exec(function(err, post) {
        post.comments.unshift(comm);
        post.save();
        console.log('content')
        console.log(comm.content);
        return res.redirect('/posts/' + id);
      })
    });
    }
  });
};
