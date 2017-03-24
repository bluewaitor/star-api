var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autopopulate = require('mongoose-autopopulate');
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
            ref: "Tag",
            autopopulate: { select: '_id name children parent' }
        }
    ]
});

tagSchema.plugin(autopopulate);
module.exports = mongoose.model('Tag', tagSchema);