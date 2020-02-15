const express = require('express');
const router = express.Router();
const {Post} = require('../models');
const tr = require('transliter');

//GET is add
router.get('/add', async (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    if(!userId || !userLogin) {
        res.redirect('/')
    } else {
        try {
            const post = await Post.findOne({
                owner : userId,
                status: 'draft'
            });
            if (post) {
                res.redirect(`/post/edit/${post.id}`)
            } else {
                const post = await Post.create({
                    owner : userId,
                    status: 'draft'
                });
                res.redirect(`/post/edit/${post.id}`)
            }
        } catch (err) {
            console.log(err);
        }
    }
});

router.get('/edit/:id', async (req, res, next) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const id = req.params.id.trim().replace(/  +(?=)/g, ' ');

    if(!userId || !userLogin) {
        res.redirect('/')
    } else {

        try{
            const post = await Post.findById(id).populate('uploads');

            if(!post) {
                const err = new Error('Not found');
                err.status = 404;
                next(err);
            }

            res.render("post/edit", {
                post,
                user: {
                    id: userId,
                    login: userLogin
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
});

router.post('/add', async (req, res) => {
    const userId = req.session.userId;
    const title = req.body.title.trim().replace(/  +(?=)/g, ' ');
    const body = req.body.body.trim();
    const isDraft = !!req.body.isDraft;
    const postId = req.body.postId;
    const url = `${tr.slugify(title)}-${Date.now().toString(36)}`;

    if(!title || !body) {
        let fields = [];
        if(!title ) fields.push('title');
        if(!body ) fields.push('body');

        res.json({
            ok: false,
            error: 'Все поля должны быть заполнены',
            fields
        })
    } else if(title.length < 3 || title.length > 64) {
        res.json({
            ok: false,
            error: 'Длина Заголовка от 3 до 64 символов!',
            fields: ['title']
        })
    } else if(body.length < 3) {
        res.json({
            ok: false,
            error: 'Длина поста от 3!',
            fields: ['body']
        })
    } else if(!postId) {
        res.json({
            ok: false
        })
    } else {
        try{
            const post = await Post.findOneAndUpdate(
                {
                    _id: postId,
                    owner: userId
                },
                {
                    title,
                    body,
                    status: isDraft ? 'draft' : 'published',
                    url
                },
                {new: true}
            );
            if(!post) {
                res.json({
                    ok: false,
                    error: 'Пост не твой!'
                })
            } else {
                res.json({
                    ok: true,
                    post
                })
            }
        } catch (err) {
            res.json({
                ok: false
            });
        }
    }
});

module.exports = router;
