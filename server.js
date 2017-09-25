var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var hb = require('express-handlebars');
var mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect('mongodb://localhost/front-page');
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
require('./controller/posts.js')(app);
require('./controller/comments.js')(app);
require('./controller/auth.js')(app);
var Post = require('./models/post');
var Comment = require('./models/comment');
var User = require('./models/user');

var checkAuth = function (req, res, next) {
  console.log("Checking authentication");

  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }
  next();
}

app.use(checkAuth);

app.get('/', function(req, res) {
  var currentUser = req.user;

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
