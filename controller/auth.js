var bodyParser = require('body-parser');
var User = require('../models/user');
var jwt = require('jsonwebtoken');

module.exports = function(app) {
  app.post('/sign-up', function(req, res, next) {
    // create User and JWT
    var user = new User(req.body);

    user.save(function (err) {
      if (err) {
        return res.status(400).send({ err: err });
      }
      var token = jwt.sign({ id: user.id}, process.env.SECRET, { expiresIn: "60 days"});
      // set the cookie
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true});
      res.redirect('/');
    })
  });
}
