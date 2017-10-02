const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  title             : {  type: String, required: true }
  , summary         : {  type: String, required: true }
  , subreddit       : {  type: String, required: true }
  , author          : {  type: Schema.Types.ObjectId, ref: 'User', required: false }
});

module.exports = mongoose.model('Post', PostSchema);
