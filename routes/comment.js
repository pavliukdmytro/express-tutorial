const express = require('express');
const router = express.Router();
const {Comment} = require('../models');

router.post('/add', async (req, res) => {
    const {body, id, post, parent} = req.body;
    const {userId, userLogin} = req.session;
    //console.log(req.body);
    
    if(!body) {
        res.json({
            ok: false,
            error: 'Пустой комментарий'
        })
    }

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
                });
                res.json({
                    ok: true,
                    body,
                    login: userLogin
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
    
                    res.json({
                        ok: true,
                        body,
                        login: userLogin
                    })
                }
            }
        } catch (err) {
            res.json({
                ok: false
            })
        }
    }
});



module.exports = router;
