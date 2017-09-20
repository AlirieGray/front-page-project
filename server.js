var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/front-page');
var hb = require('express-handlebars');

app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var Post = mongoose.model('Post', {
  title: String
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/posts/:id', function (req, res) {
  Post.findById(req.params.id).exec(function (err, post) {
    res.render('show-post', {post: post});
  });
});

app.get('/posts/new', function(req, res) {
  res.render('new-post', {});
});

app.post('/posts', function (req, res) {
  Post.create(req.body, function(err, rv) {
    res.redirect('/posts/' + rv._id);
  })
});

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
