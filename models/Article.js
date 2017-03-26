var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    public: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        index: true
    },
    content: {
        type: String
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    publish: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model("Article", ArticleSchema);