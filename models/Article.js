var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    private: {
        type: Boolean,
        default: false
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    publish: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


module.exports = mongoose.model("Article", ArticleSchema);