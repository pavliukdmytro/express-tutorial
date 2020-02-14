const express = require('express');
const router = express.Router();
const path = require('path');
const Sharp = require('sharp');
const multer = require('multer');
const config = require('../config');
const mkdirp = require('mkdirp'); //для создания директорий если их нет
const diskStorage = require('../utils/diskStorage');

const rs = () => Math.random().toString(36).slice(-3);

const storage = diskStorage({
    destination: (req, file, cb) => {
        const dir = '/' + rs() + '/' + rs();
        req.dir = dir;
        mkdirp(config.DESTINATION + dir, err => cb(err, config.DESTINATION + dir));
    },
    filename: (req, file, callback) => {
        //
        callback(null, Date.now() + path.extname(file.originalname))
    },
    sharp: (req,file, cb) => {
        const resizer = Sharp()
            .resize(1024, 768)
            // .max()
            // .withoutEnlargement()
            .toFormat('jpg')
            .jpeg({
                quality: 40,
                progressive: true
            })
        cb(null, resizer)
    }
});

const upload = multer({
    storage,
    limits: {filedSize: 2 * 1024 * 1024},
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        // console.log(ext);
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            const err = new Error('Extention');
            err.code = "EXTENTION";
            return callback(err);
        }
        callback(null, true);
    }
}).single('file');

router.post('/image', (req, res) => {
    // console.log(req.file, req.body);
    upload(req, res, err => {
        let error = '';
        if(err) {
            if(err.code === 'LIMIT_FILE_SIZE') {
                error = 'Картинка не болие 1mb'
            } else if(err.code === 'EXTENTION') {
                error = 'Только jpeg и png';
            }
        }
        // console.log(error);
        res.json({
            ok: !error,
            error,
        });
    });
});

module.exports = router;
