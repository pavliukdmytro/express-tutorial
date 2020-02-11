const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    body: {
        type: String,
        require: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
            ref: 'Comment'
        }
    ]
},{
    timestamps: false
});

schema.set("toJSON", {
    virtuals: true
});

module.exports =  mongoose.model("Comment", schema);