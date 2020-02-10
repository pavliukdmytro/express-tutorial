const express = require('express');
const router = express.Router();

const config = require('../config');
const {Post} = require('../models');

function posts(req, res) {
    const {userId, userLogin} = req.session;
    const perPage = +config.PER_PAGE;
    const page = req.params.page || 1;
    //console.log(typeof perPage, perPage, page);
    
    Post.find({}).skip(perPage * page - perPage).limit(perPage)
    .then(posts => {
        Post.count().then(count => {
            res.render('index', {
                user: {
                    id: userId,
                    login: userLogin,
                },
                posts,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        }).catch(console.error);
    }).catch(console.error);
}

router.get("/", posts);
router.get('/archive/:page', posts);

module.exports = router;