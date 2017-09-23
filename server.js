var express = require('express');
var app = express();
var hb = require('express-handlebars');
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/front-page');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
require('./controller/posts.js')(app);
var Post = require('./models/post');

app.get('/', function(req, res) {
  Post.find(function(err, posts) {
    res.render('posts-index', {posts: posts});
  });
});

app.get('/posts/new', function(req, res) {
  res.render('new-post');
});

app.get('/posts/:id', function(req, res) {
  Post.findById(req.params.id).exec(function(err, post) {
    res.render('show-post', {post: post});
  })
})

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
