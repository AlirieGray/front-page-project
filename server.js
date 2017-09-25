var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var hb = require('express-handlebars');
app.use(cookieParser);
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/front-page');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
require('./controller/posts.js')(app);
require('./controller/comments.js')(app);
require('./controller/auth.js')(app);
var Post = require('./models/post');
var Comment = require('./models/comment');
var User = require('./models/user');

app.get('/', function(req, res) {
  Post.find(function(err, posts) {
    res.render('posts-index', {posts: posts});
  });
});

app.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

app.get('/posts/new', function(req, res) {
  res.render('new-post');
});

app.get('/posts/:id', function(req, res) {
  Post.findById(req.params.id).populate('comments').exec(function(err, post) {
    res.render('show-post', {post: post});
  })
})

app.get('/n/:subreddit', function(req, res) {
  Post.find({ subreddit: req.params.subreddit }).exec(function (err, posts) {
    res.render('posts-index', { posts: posts });
  })
});

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
