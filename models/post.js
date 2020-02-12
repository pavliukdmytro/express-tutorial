const mongoose = require("mongoose");
const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;
const tr = require('transliter');

const schema = new Schema({
    title: {
        type: String,
        required: true,
        // unique: true
    },
    body: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentCount: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

schema.statics = {
    incCommentCount(postId) {
        return this.findByIdAndUpdate(postId, {$inc: {commentCount: 1}}, {new: true})
    }
}

schema.set("toJSON", {
  virtuals: true
});

schema.plugin(URLSlugs('title', {
    field: 'url',
    regenerator: text => tr.slugify(text)
}));

module.exports = mongoose.model("Post", schema);
