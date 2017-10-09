const User = require('../models/user.js');
const Comment = require('../models/comment.js');
const Post = require('../models/post.js');
const mongoose = require('mongoose');

module.exports = function(app) {
  app.post('/posts/:id/comments', function(req, res) {
    // anonymouse comment
    if (req.body.userId == 0) {
      var user = new User({
        username: "anonymous",
        password: "none",
      });
      var comm = new Comment({
        content: req.body.content,
        author: user.username,
      });
      console.log(req.body.content);
      console.log(comm.content);
      var id = req.params.id;
      Post.findById(req.params.id).exec(function(err, post) {
        comm.save(function (err, comment) {
          post.comments.unshift(comment);
          console.log(post.comments);
          post.save();
          return res.redirect('/posts/' + id);
        })
      });
    } else {
    var author = User.findById(req.body.userId).exec().then(function(user) {
      var comm = new Comment({
        content: req.body.content,
        author: user.username,
      });
      console.log("comment " + comm);
      console.log("user Name " + user.username);
      console.log(req.body.content);
      var id = req.params.id;
      Post.findById(req.params.id).exec(function(err, post) {
        comm.save(function (err, comment) {
          post.comments.unshift(comment);
          post.save();
          console.log(post.comments);
          return res.redirect('/posts/' + id);
        })
      })
    });
    }
  });
};
