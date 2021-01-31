const express = require('express');
const multer = require('multer');
const path = require('path');

const { isSignedIn } = require('./middlewares');
const db = require('../models');
const { route } = require('./user');

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
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                await Promise.all(req.body.image.map(image => {
                    return db.Image.create({ src: image, PostId: newPost.id });
                }));
            } else {
                await db.Image.create({ src: req.body.image, PostId: newPost.id });
            }
        }
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                    model: db.Image,
            }],
        });
        return res.json(fullPost);
    } catch(err) {
        console.error(err);
        return next(err);
    }
});

router.delete('/:id/', async (req, res, next) => {
    try {
        await db.Post.destroy({
            where: {
                id: req.params.id,
            }
        });
        return res.send('Delete it.');
    } catch (err) {
        console.error(err);
        return next(err);
   }
});

router.get('/:id/comments', async (req, res, next) => {
    try {
        console.log('hello!!!!!!');
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('That post doesn\'t exist');
        }
        const comments = await db.Comment.findAll({
            where: { PostId: req.params.id },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }
            ],
            order: [['createdAt', 'ASC']],
        });
        console.log('Comments!!!!', comments);
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

router.post('/:id/retweet', isSignedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: db.Post,
                as: 'Retweet', // 리트윗한 게시글을 리트윗한거면 원본 게시글이 됨. 
            }]
        });
        if (!post) {
            return res.status(404).send('This post doesn\'t exist');
        }
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send('You can\'t retweet your post.');
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = db.Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            }
        });
        if (exPost) {
            return res.status(403).send('You already retweet it');
        }
        // 리트윗 포스트를 생성
        const retweet = await db.Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,  // 원본글 아이디
            content: 'retweet'
        });
        // 리트윗을 원본 포스트와 함께 프론트로 보낸다
        const retweetWithOriginalPost = await db.Post.findOne({
            where: {
                id: retweet.id
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname']
                }, {
                    model: db.Image,
                }]
            }]
        });
        return res.json(retweetWithOriginalPost);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post('/:id/like', isSignedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('That post doesn\'t exist');
        }
        await post.addLiker(req.user.id);
        return res.json({ userId: req.user.id });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.delete('/:id/like', isSignedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('That post doesn\'t exist');
        }
        await post.removeLiker(req.user.id);
        return res.json({ userId: req.user.id });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

module.exports = router;