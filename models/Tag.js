var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        default: null
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tag"
        }
    ]
});


module.exports = mongoose.model('Tag', tagSchema);