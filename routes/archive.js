const express = require('express');
const router = express.Router();

const config = require('../config');
const {Post} = require('../models');

function posts(req, res) {
    const {userId, userLogin} = req.session;
    const perPage = +config.PER_PAGE;
    const page = req.params.page || 1;

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
        }).catch(() => {throw new Error('Server Error')});
    }).catch(() => {throw new Error('Server Error')});
}

router.get("/", posts);
router.get('/archive/:page', posts);
router.get('/posts/:post', (req, res, next) => {
    const {userId, userLogin} = req.session;
    const url = req.params.post.trim().replace(/  +(?=)/g, ' ');

    if(!url) {
        const err = new Error('Not found');
        err.status = 404;
        next(err);
    } else {
        Post.findOne({
            url
        }).then( post => {
            if(!post) {
                const err = new Error('Not found');
                err.status = 404;
                next(err);
            } else {
                res.render('post/post', {
                    user: {
                        id: userId,
                        login: userLogin,
                    },
                    post
                })
            }
        })
    }
});

module.exports = router;
