const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = function(app) {
  // post a reply to a comment
  app.post('/posts/:postId/comments/:commentId/replies', (req, res, next) => {
    var username = "";
    var userId = 0;
    if (!req.user) {
      const author = new User({
        username: "anonymous",
        password: "none",
      });
      username = author.username;
    } else {
      // get currently logged in user
      const author = req.user;
      username = req.user.username;
      userId = req.user.id;
    }
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    // find the post in the database
    Post.findById(postId).then((post) => {

      // find comment in comments array of post
      // have to LOOP through recursively starting from TOP
      // then save to comment.comments

      const findComment = (id, comments) => {
        if (comments.length > 0) {
          for (let i = 0; i < comments.length; i++) {
            const found = comments[i];
            // if we find the comment, return it
            if (found._id == id) {
              return found;
            }
            // otherwise, loop through the replies on the current comment
            const nextLevelComment = findComment(id, comments[i].comments);
            if (nextLevelComment) {
              return nextLevelComment;
            }
          }
        }
      }

      const comment = findComment(commentId, post.comments);

      const reply = new Comment({
        content: req.body.content,
        author: username,
        authorId: userId,
        postId: postId
      });

      comment.comments.push(reply);
      post.markModified('comments');
      return post.save();

      }).then(() => {
        res.redirect('/posts/' + postId);
      }).catch((err) => {
        console.error(err);
      })
    })
}
