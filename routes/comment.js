const express = require('express');
const router = express.Router();
const {Comment} = require('../models');

router.post('/add', async (req, res) => {
    const {body, id, post, parent} = req.body;
    const {userId, userLogin} = req.session;
    console.log(req.body);

    if(!userId || !userLogin) {
        res.json({
            ok: false
        })
    } else {
        try {
            if(!parent) {
                await Comment.create({
                    post,
                    body,
                    owner: userId
                })
            } else {
                const parentComment = await Comment.findById(parent);

                if(!parentComment) {
                    res.json({
                        ok: false
                    })
                } else {
                    const comment = await Comment.create({
                        post,
                        body,
                        parent,
                        owner: userId
                    })

                    const children = parentComment.children;
                    children.push(comment.id);
                    parentComment.children = children;
                    await parentComment.save();
                }
            }
        } catch (err) {
            res.json({
                ok: false
            })
        }
    }
    console.log(body);
});



module.exports = router;
