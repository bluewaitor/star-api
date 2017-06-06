var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LikeSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    contentType: {
        type: Schema.Types.String
    },
    contentId: {
        type: Schema.Types.ObjectId
    },
    isLike: {
        type: Schema.Types.Number,
        default: 0
    }
});

module.exports = mongoose.model('Like', LikeSchema);