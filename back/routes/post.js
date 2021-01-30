const express = require('express');
const multer = require('multer');
const path = require('path');

const { isSignedIn } = require('./middlewares');
const db = require('../models');
const { Post } = require('../models');

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext); // fifth.png, basename: fifth, ext: .png
            done(null, basename + Date.now() + ext);
        },
    }),
    limit: { fileSize: 20 * 1024 * 1024 },
})

router.post('/images', isSignedIn, upload.array('image'), (req, res, next) => {
    console.log(req.files);
    res.json(req.files.map(v => v.filename));
});

router.post('/', isSignedIn, async (req, res, next) => {
    try {
        //in post, hastags are also stored into db.
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id,
            imagePaths: req.body.imagePaths,
        });
        if (hashtags) {
            // await이 여러개 생기기 때문에 Promise.all이 더 낫다.
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: {
                    name: tag.slice(1).toLowerCase()
                },
            })));
            await newPost.addHashtags(result.map(r => r[0]));
        }
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }]
        });
        return res.json(fullPost);
    } catch(err) {
        console.error(err);
        return next(err);
    }
});

module.exports = router;