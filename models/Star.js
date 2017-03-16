var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var starSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    url: {
        type: String,
        index: true
    },
    public: {
        type: Boolean,
        default: true
    },
    like: {
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model("Star", starSchema);