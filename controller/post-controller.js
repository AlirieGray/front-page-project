const Post = require('../models/post.js');
const User = require('../models/user.js');
const mongoose = require('mongoose');

module.exports = function(app) {
  app.post('/posts', function(req, res) {
  console.log(req.body.userId);
  var author = User.findById(req.body.userId).exec().then(function(user) {
    var post = new Post({
      title: req.body.title,
      summary: req.body.summary,
      subreddit: req.body.subreddit,
      author: user,
    });

    post.save(function(err, post) {
      if (err) {
        console.error(err);
        return res.redirect('/posts/new');
      }
      console.log('saved!');
      var id = post._id;
      return res.redirect('/posts/' + id);
    });
  })
  })
};
