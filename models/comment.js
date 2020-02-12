const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const schema = new Schema({
    body: {
        type: String,
        require: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    createAd: {
        type: Date,
        default: Date.now
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            autopopulate: true
        }
    ]
},{
    timestamps: false
});

schema.set("toJSON", {
    virtuals: true
});

schema.plugin(autopopulate);

module.exports =  mongoose.model("Comment", schema);
