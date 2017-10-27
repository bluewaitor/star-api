const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  thing: {
    type: String,
    index: true
  },
  due: {
    type: String,
    default: Date.now() + 24 * 60 * 60 * 1000
  },
  status: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  secret: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Todo", todoSchema);
