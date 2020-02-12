const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('ru');

const config = require('../config');
const {Post, User, Comment} = require('../models');

async function posts(req, res) {
    const {userId, userLogin} = req.session;
    const perPage = +config.PER_PAGE;
    const page = req.params.page || 1;

    try {
        const posts = await Post.find({}).skip(perPage * page - perPage)
            .limit(perPage)
            .populate('owner')
            .sort({createdAt: -1});
        //console.log(posts);

        const count = await Post.count();

        res.render('archive/index', {
            user: {
                id: userId,
                login: userLogin,
            },
            posts,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    } catch(err) {
        throw new Error('Server Error')
    }
}

router.get("/", posts);
router.get('/archive/:page', posts);
router.get('/posts/:post', async (req, res, next) => {
    const {userId, userLogin} = req.session;
    const url = req.params.post.trim().replace(/  +(?=)/g, ' ');

    if(!url) {
        const err = new Error('Not found');
        err.status = 404;
        next(err);
    } else {
        try {
            const post = await Post.findOne({ url });
            if(!post) {
                const err = new Error('Not found');
                err.status = 404;
                next(err);
            } else {
                const comments = await Comment.find({
                    post: post.id,
                    parent: {
                        $exists: false
                    }
                });

                res.render('post/post', {
                    user: {
                        id: userId,
                        login: userLogin,
                    },
                    moment,
                    post,
                    comments
                })
            }
        } catch (err) {
            throw new Error('Server Error');
        }
    }
});
//users posts
router.get('/users/:login/:page*?', async (req,res) => {
    const {userId, userLogin} = req.session;
    const perPage = +config.PER_PAGE;
    const page = req.params.page || 1;
    const login = req.params.login;

    try {
        const user = await User.findOne({ login });

        const posts = await Post.find({owner: user.id})
            .skip(perPage * page - perPage)
            .limit(perPage)
            .sort({createdAt: -1});

        const count = await Post.count({ owner: user.id });

        res.render('archive/user', {
            user: {
                id: userId,
                login: userLogin,
            },
            posts,
            current: page,
            pages: Math.ceil(count / perPage),
            _user: user
        });
    } catch (err) {
        throw new Error('Server Error');
    }
});

module.exports = router;
