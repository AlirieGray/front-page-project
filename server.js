/***** dependencies *****/
const express = require('express');
const app = express();
const hb = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// TODO: fix comments on comments (adds to databse but not appearing?)
// TODO: fix style
// TODO: figure out how to serve css from public folder

// note: upvotes and downvotes are an array of *users ids*
// if your id is in the upvotes array, you can't add to it again
// similarly, if you have upvoted and then click downvote, you're removed from up and added to down

/***** set up middleware *****/
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// check that a user is logged in
var checkAuth = function (req, res, next) {
  console.log("Checking authentication");
  // make sure the user has a JWT cookie
  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null;
    //console.log("no user");
  } else {
    // if the user has a JWT cookie, decode it and set the user
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    //console.log("user set");
    //console.log(req.user);
  }
  // console.log(req.user);
  next();
}
app.use(checkAuth);

/***** set up mongoose *****/
mongoose.promise = global.promise;
mongoose.connect('mongodb://localhost/test');

/***** import database models *****/
var Post = require('./models/post');
var User = require('./models/user');
var Comment = require('./models/comment');

/***** routes *****/
app.get('/', function(req, res) {
  Post.find(function(err, posts) {
    var currentUser;
    if (req.user) {
      currentUser = req.user.id;
    } else {
      currentUser = 0;
    }
    res.render('home', { post: posts, currentUserId: currentUser });
  });
});

// make a new post
app.get('/posts/new', function(req, res) {
  var currentUser = 0;
  if (req.user) {
    currentUser = req.user.id;
  }
  res.render('new-post', { currentUserId: currentUser});
});

// show a particular post
app.get('/posts/:id', function(req, res) {
  Post.findById(req.params.id).populate('author').exec(function(err, post) {
    var currentUser = 0;
    if (req.user) {
      currentUser = req.user.id;
    }
    console.log("comments");
    console.log(post.comments);
    console.log(post.subreddit);
    res.render('show-post', {post: post, currentUserId: currentUser, comments: post.comments});
  })
});

app.get('/r/:subreddit', function(req, res) {
  Post.find({ subreddit: req.params.subreddit }).exec(function (err, posts) {
    var currentUser;
    if (req.user) {
      currentUser = req.user.id;
    } else {
      currentUser = 0;
    }
    res.render('home', { post: posts, currentUserId: currentUser });
  })
})

// login page
app.get('/login', function(req, res) {
  res.render('login');
});

// get sign-up
app.get('/sign-up', function(req, res) {
  res.render('sign-up');
});

// post sign-up
app.post('/sign-up', function(req, res, next) {
  // Create User and JWT
  var user = new User(req.body);

  // save user to database
  user.save(function (err) {
    if (err) { return res.status(400).send({ err: err }) }
    res.redirect('/');
  })
});

/***** import controllers for database models *****/
require('./controller/post-controller.js')(app);
require('./controller/auth.js')(app);
require('./controller/comment-controller.js')(app);
require('./controller/reply-controller')(app);

/***** start the server *****/
app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
