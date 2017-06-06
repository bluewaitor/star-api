var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
    comment: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    like: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Comment', CommentSchema);