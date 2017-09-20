var express = require('express');
var app = express();
var hb = require('express-handlebars');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/front-page');
var bodyParser = require('body-parser');
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
require('./controller/posts.js')(app);


app.get('/', function(req, res) {
  res.render('home');
});

app.get('/posts/new', function(req, res) {
  res.render('new-post');
});

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
