var express = require('express');
var app = express();
var hb = require('express-handlebars');

app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
  res.send('Hello world!');
});

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
