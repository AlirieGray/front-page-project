const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  content             : {  type: String, required: true }
  , author            : {  type: String, required: true }
  , authorId          : {  type: Number}
  , replies           : [this]
});

module.exports = mongoose.model('Comment', CommentSchema);
