const express = require('express');
const router = express.Router();
const {User} = require('../models');
const config = require('../config');
//console.log(User)
const bcrypt = require('bcrypt-nodejs');

//const models = require('../models');
//register
router.post('/register', (req, res) => {
    const {login, password, passwordConfirm} = req.body;

    if(!login || !password || !passwordConfirm) {
        const fields = [];
        if(!login ) fields.push('login');
        if(!password ) fields.push('password');
        if(!passwordConfirm ) fields.push('passwordConfirm');
        res.json({
            ok: false,
            error: 'Все поля должны быть заполнены',
            fields
        })
    } else if(!/^[a-zA-Z0-9]+$/.test(login)) {
        res.json({
            ok: false,
            error: 'Только латинские цифры и буквы',
            fields: ['login']
        })
    } else if(login.length < 3 || login.length > 16) {
        res.json({
            ok: false,
            error: 'Длина логина от 3 до 16 символов!',
            fields: ['login']
        })
    } else if(password !== passwordConfirm) {
        res.json({
            ok: false,
            error: 'Пароли не совпадают!',
            fields: ['password', 'passwordConfirm']
        })
    } else if(password.length < 5) {
        res.json({
            ok: false,
            error: 'Минимальная длина пароля 5 символов!',
            fields: ['password', 'passwordConfirm']
        })
    } else {
        User.findOne({login})
            .then(user => {
                if(!user) {
                    bcrypt.hash(password, null, null, (err, hash) => {
                        // Store hash in your password DB.
                        User.create({
                            login,
                            password: hash
                        }).then( user => {
                            req.session.userId = user.id;
                            req.session.userLogin = user.login;
                            res.json({
                                ok: true
                            })
                            res.redirect('/');
                        }).catch(() => {
                            res.json({
                                ok: false,
                                error: 'Ошибка попробуйте позже'
                            })
                        });
                    });
                } else {
                    res.json({
                        ok: false,
                        error: 'Имя занято!',
                        fields: ['login']
                    })
                }
        })
    }
});
//auth
router.post('/login', (req, res) => {
    const {login, password} = req.body;

    if(!login || !password) {
        const fields = [];
        if(!login ) fields.push('login');
        if(!password ) fields.push('password');

        res.json({
            ok: false,
            error: 'Все поля должны быть заполнены',
            fields
        })
    } else {
        User.findOne({login})
            .then(user => {
                if(!user) {
                    res.json({
                        ok: false,
                        error: "Логин и парольне не верны",
                        fields: ['login', 'password']
                    })
                } else {
                    bcrypt.compare(password, user.password, function(err, result) {
                        if(err) return console.error(err);
                        // res == true
                        if(!result) {
                            res.json({
                                ok: false,
                                error: "Логин и парольне не верны",
                                fields: ['login', 'password']
                            })
                        } else {
                            req.session.userId = user.id;
                            req.session.userLogin = user.login;

                            res.json({
                                ok: true
                            })
                        }
                    });
                }
            }).catch((err) => {
                console.error(err);
                res.json({
                    ok: false,
                    error: 'Ошибка, попробуйте позже!'
                })
        })
    }
    // console.log(req.body);
});
//logout
router.get('/logout', (req, res) => {
    if(req.session) {
        //delete session object
        req.session.destroy(() => {
            res.redirect('/')
        })
    } else {
        res.redirect('/');
    }
});

module.exports = router;
