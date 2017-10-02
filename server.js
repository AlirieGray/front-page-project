/***** dependencies *****/
const express = require('express');
const app = express();
const hb = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

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
    console.log("no user");
  } else {
    // if the user has a JWT cookie, decode it and set the user
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    console.log("user set");
  }
  console.log(req.user);
  next();
}
app.use(checkAuth);

/***** set up mongoose *****/
mongoose.promise = global.promise;
mongoose.connect('mongodb://localhost/test');

/***** import database models *****/
var Post = require('./models/post');
var User = require('./models/user');

/***** routes *****/
app.get('/', function(req, res) {
  Post.find(function(err, posts) {
    res.render('home', { post: posts, currentUser: req.user });
  });
});

// make a new post
app.get('/posts/new', function(req, res) {
  res.render('new-post', { currentUser: req.user.id});
});

// show a particular post
app.get('/posts/:id', function(req, res) {
  Post.findById(req.params.id).populate('author').exec(function(err, post) {
    res.render('show-post', {post: post});
  })
});

// login page
app.get('/login', function(req, res) {
  res.render('login');
});

// post login
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

// logout
app.get('/logout', function(req, res) {
  res.clearCookie('nToken');
  res.redirect('/');
});

// get sign-up
app.get('/sign-up', function(req, res) {
  res.render('sign-up');
});

// post sign-up
app.post('/sign-up', function(req, res, next) {
  // Create User and JWT
  var user = new User(req.body);

  user.save(function (err) {
    if (err) { return res.status(400).send({ err: err }) }
    res.redirect('/');
  })
});

/***** import controllers for database models *****/
require('./controller/post-controller.js')(app);
require('./controller/auth.js')(app);

/***** start the server *****/
app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
