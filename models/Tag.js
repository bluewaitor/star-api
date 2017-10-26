const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: String,
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        default: null
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Tag', tagSchema);