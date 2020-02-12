const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const Post = require('./post');

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

schema.pre('save', async function(next) {
    if(this.isNew) {
        await Post.incCommentCount(this.post);
    }
    next();
});

schema.set("toJSON", {
    virtuals: true
});

schema.plugin(autopopulate);

module.exports =  mongoose.model("Comment", schema);
