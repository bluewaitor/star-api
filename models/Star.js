var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var starSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        index: true
    },
    url: {
        type: String,
        index: true
    },
    icon: {
        type: String,
    },
    type: {
        type: String,
        default: 'url'
    },
    text: {
        type: String,
        default: ''
    },
    public: {
        type: Boolean,
        default: true
    },
    like: {
        type: Number,
        default: 0
    },
    visits:{
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model("Star", starSchema);