var express = require('express');
var app = express();
require('dotenv').config();

// import database models
var Post = require('./models/post');
var Comment = require('./models/comment');
var User = require('./models/user');

// mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/front-page');

// set up handlebars
var hb = require('express-handlebars');
app.set('view engine', 'handlebars');
app.engine('handlebars', hb({
  defaultLayout: 'main',
  helpers: {
    foo: function() {
      return("foo");
    }
  }
}));

//********* MIDDLEWARE *********//

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var jwt = require('jsonwebtoken');

// check that a user is logged in
var checkAuth = function (req, res, next) {
  console.log("Checking authentication");
  // make sure the user has a JWT cookie
  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }
  console.log("user set");
  console.log(req.user);
  next();
}
app.use(checkAuth);

//********* ROUTES *********//

// home route, show index of all posts
app.get('/', function(req, res) {
  var currentUser = req.user;
  Post.find(function(err, posts) {
    res.render('posts-index', {posts: posts, currentUser: req.user});
  });
});

// sign-up page
app.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

// make a new post form
app.get('/posts/new', function(req, res) {
  console.log(req.user);
  res.render('new-post', { id: req.user.id });
});

// show a particular form by its id
app.get('/posts/:id', function(req, res) {
  Post.findById(req.params.id).populate('comments').exec(function(err, post) {
    res.render('show-post', { post: post });
  });
});

// show all posts of a given subreddit
app.get('/n/:subreddit', function(req, res) {
  Post.find({ subreddit: req.params.subreddit }).exec(function (err, posts) {
    res.render('posts-index', { posts: posts });
  });
});

// logout the current user and redirect to the home page
app.get('/logout', function(req, res, next) {
  res.clearCookie('nToken');
  res.redirect('/');
});

// show the login page
app.get('/login', function(req, res, next) {
  res.render('login');
});

/* check the user's credentials by searching for the user by the username
 * they input, then using the comparePassword function of the user model
 * if it's a match, set res.cookie with the JSON Web Token that identifies
 * the user */
app.post('/login', function(req, res, next) {
  User.findOne({ username: req.body.username }, "+password", function (err, user) {
    if (!user) { return res.status(401).send({ message: 'Wrong email or password' }) };
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong email or password' });
      }
      var token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: "60 days" });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });

      res.redirect('/');
    });
  });
});

// import controllers for database models
require('./controller/posts.js')(app);
require('./controller/comments.js')(app);
require('./controller/auth.js')(app);

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
