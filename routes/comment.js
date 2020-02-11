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
