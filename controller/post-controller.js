const Post = require('../models/post.js');
const User = require('../models/user.js');
const mongoose = require('mongoose');

module.exports = function(app) {
  app.put('posts/:id/vote-up', function (req, res) {
  Post.findById(req.params.id).exec(function (err, post) {
    post.upVotes.push(req.user._id)
    post.voteScore = post.voteTotal + 1
    post.save();

    res.status(200);
  })
})

  app.put('posts/:id/vote-down', function (req, res) {
  Post.findById(req.params.id).exec(function (err, post) {
    post.downVotes.push(req.user._id)
    post.voteScore = post.voteTotal - 1
    post.save();

    res.status(200);
  })
})

  app.post('/posts', function(req, res) {
  console.log(req.body.userId);

  // anonymous post author
  if (req.body.userId == 0) {
    var user = new User({
      username: "anonymous",
      password: "none",
    });

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
  } else {

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
  }
});
}
