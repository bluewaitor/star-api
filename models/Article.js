const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  secret: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    index: true
  },
  content: {
    type: String
  },
  tags: [
    {
      type: String
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  publish: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Article", ArticleSchema);
