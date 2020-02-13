const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname))
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
