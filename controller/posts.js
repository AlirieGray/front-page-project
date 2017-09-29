var Post = require('../models/post');
var bodyParser = require('body-parser');
var User = require('../models/user');
module.exports = function(app) {

  app.post('/posts/:userid', function (req, res) {

    User.findById(req.params.id).exec(function (err, user) {
      var post = new Post(req.body);
      post.save(function (err, post) {
        return res.redirect('/');
      });
    });
    /*
    const userId = req.user.id;
    User.findById(userId).then((user)=>{
      const post = new Post(req.body);
      return post.save();
    }).then((post) => {
      res.redirect('/')
    }).catch((err)=>{
      console.log(err);
    })
    */

  });
};
