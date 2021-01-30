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

router.get('/:id/comments', async (req, res, next) => {
    try {
        const post = await db.Post.findOnd({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('That post doesn\'t exist');
        }
        const comments = await db.Comment.findAll({
            where: { PostId: post.id },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }
            ],
            order: [['createdAt', 'ASC']],
        });
        return res.json(comments);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post('/:id/comment', isSignedIn, async (req, res, next) => { // :id is called req.params.id
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('That post doesn\'t exist');
        }
        const newComment = await db.Comment.create({
            PostId: post.id, // 이걸로 인해 포스트에도 새로운 커멘트가 등록이 된다.
            UserId: req.user.id,
            content: req.body.content,
        });
        const comment = await db.Comment.findOne({
            where: {
                id: newComment.id,
            },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'nickname']
                }
            ],
        });
        return res.json(comment);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

module.exports = router;