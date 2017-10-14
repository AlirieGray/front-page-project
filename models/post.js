const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const Comment = require('./comment');

var PostSchema = new Schema({
  title             : {  type: String, required: true }
  , summary         : {  type: String, required: true }
  , subreddit       : {  type: String, required: true }
  , author          : {  type: Schema.Types.ObjectId, ref: 'User', required: false }
  , comments        : [Comment.schema]
  , downVotes       : [String]
  , upVotes         : [String]
  , voteTotal       : {  type: Number, default: 0 }
});

module.exports = mongoose.model('Post', PostSchema);
