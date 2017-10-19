const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = function(app) {
  // post a reply to a comment
  app.post('/posts/:postId/comments/:commentId/replies', (req, res, next) => {
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

      var username = "";
      var userId = 0;
      if (!req.user) {
        const author = new User({
          username: "anonymous",
          password: "none",
        });
        username = author.username;
        console.log(username);

        const reply = new Comment({
          content: req.body.content,
          author: username,
          authorId: userId,
          postId: postId
        });

        comment.comments.push(reply);
        post.markModified('comments');
        return post.save();
      } else {
        // get currently logged in user
        userId = req.user.id;
        User.findById(userId).then((user) => {
          var username = user.username;

          const reply = new Comment({
            content: req.body.content,
            author: username,
            authorId: userId,
            postId: postId
          });

          comment.comments.push(reply);
          post.markModified('comments');
          return post.save();
        })
      }
}).then(() => {
  res.redirect('/posts/' + postId);
}).catch((err) => {
  console.error(err);
})
})
}
