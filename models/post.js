const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const Comment = require('./comment');

var PostSchema = new Schema({
  title             : {  type: String, required: true }
  , summary         : {  type: String, required: true }
  , subreddit       : {  type: String, required: true }
  , comments        : [Comment.schema]
  , downVotes       : [String]
  , upVotes         : [String]
  , author          : {  type: Schema.Types.ObjectId, ref: 'User', required: false }
});

module.exports = mongoose.model('Post', PostSchema);
