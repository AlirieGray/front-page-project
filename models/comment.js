const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  content             : {  type: String, required: true }
  , author            : {  type: String, required: true }
  , authorId          : {  type: String, required: true }
  , comments           : [this]
});

module.exports = mongoose.model('Comment', CommentSchema);
