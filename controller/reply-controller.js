const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = function(app) {
  // post a reply to a comment
  app.post('/posts/:postId/comments/:commentId/replies', (req, res, next) => {
    // get currently logged in user
    const author = req.user;
    const username = req.user.username;
    const userId = req.user.id;
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    // find the post in the database
    Post.findById(postId).then((post) => {
      // find comment in comments array of post
      Comment.findById(commentId).then((comment) => {
        console.log(comment.content);

        const reply = new Comment({
          content: req.body.content,
          author: username,
          authorId: userId,
          postId: postId
        });
        comment.replies.unshift(reply);
        console.log("replies: ");
        console.log(comment.replies);
        post.markModified('comments');
        return(post.save());
      })
      res.redirect('/posts/' + postId);
    })

  });
}
