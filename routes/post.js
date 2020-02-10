const express = require('express');
const router = express.Router();
const {Post} = require('../models');
var TurndownService = require('turndown');

var turndownService = new TurndownService();

//GET is add
router.get('/add', (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    if(!userId || !userLogin) {
        res.redirect('/')
    } else {
        res.render("post/add", {
            user: {
                id: userId,
                login: userLogin
            }
        });
    }
});

router.post('/add', (req, res) => {
    const title = req.body.title.trim().replace(/  +(?=)/g, ' ');
    const {body} = req.body;
    const userId = req.session.userId;
    // const userLogin = req.session.userLogin;
    let fields = [];
    // title = title

    // console.log(title, body);

    if(!title || !body) {
        const fields = [];
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
    } else {
        Post.create({
            title,
            body: turndownService.turndown(body),
            owner: userId
        }).then(post => {
            console.log(post);
            res.json({
                ok: true
            });
        }).catch((err) => {
            console.error(err);
            res.json({
                ok: false
            });
        });
    }
});

module.exports = router;
