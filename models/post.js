const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const tr = require('transliter');

const schema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    url: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
       type: String,
        enum: ['published', 'draft'],
        require: true,
        default: 'published'
    },
    commentCount: {
        type: Number,
        default: 0
    },
    uploads: [
        {
            type: Schema.Types.ObjectId,
            ref: "Upload"
        }
    ]
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

// schema.pre('save', function(next) {
//     this.url = `${tr.slugify(this.title)}-${Date.now().toString(36)}`;
//     next();
// });

module.exports = mongoose.model("Post", schema);
