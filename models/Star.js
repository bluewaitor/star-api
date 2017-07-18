const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const starSchema = Schema({
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
        type: String
    },
    type: {
        type: String,
        default: 'url'
    },
    text: {
        type: String,
        default: ''
    },
    secret: {
        type: Boolean,
        default: false
    },
    like: {
        type: Number,
        default: 0
    },
    visits: {
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model("Star", starSchema);