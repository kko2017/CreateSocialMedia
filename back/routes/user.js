const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { isSignedIn, isNotSignedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router();

router.get('/', isSignedIn, async (req, res) => {
    const user = req.user;
    return res.json(user);
});

router.get('/:id', async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) },
            include: [{
                model: db.Post,
                as: 'Posts',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followings',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followers',
                attributes: ['id'],
            }],
            attributes: ['id', 'nickname']
        });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post('/', isNotSignedIn, async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const exUser = await db.User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (exUser) {
            return res.status(403).json({
                errorCode: 1,
                message: 'Registered email.',
            });
        }
        await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname,
        });
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            if (info) {
                return res.status(401).send(info.reason);
            }
            return req.logIn(user, async (err) => { // input user info into session (how? serializeUser)
                if (err) {
                    console.error(err);
                    return next(err);
                }
                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    attributes: ['id', 'email', 'nickname'],
                    include: [{
                        model: db.Post,
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }],
                });
                return res.json(fullUser);
            });
        })(req, res, next);
    } catch (error) {
        console.error(error);
        return next(err);
    }
});

router.post('/signin', isNotSignedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.reason);
        }
        return req.logIn(user, async (err) => { // input user info into session (how? serializeUser)
            if (err) {
                console.error(err);
                return next(err);
            }
                  const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    attributes: ['id', 'email', 'nickname'],
                    include: [{
                        model: db.Post,
                        attributes: ['id'],
                        }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                        }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }],
                  });
            return res.json(fullUser);
        });
    })(req, res, next);
});

router.post('/logout', isSignedIn, (req, res) => {
    req.logout();
    req.session.destroy(); // Optional choice
    return res.status(200).send('You logged out.');
});

router.get('/:id/posts', async (req, res, next) => {
    try {
        let where = {
            UserId: parseInt(req.params.id, 10),
            RetweetId: null,
        };
        if (parseInt(req.query.lastId, 10)) {
            where[db.Sequelize.Op.lt] = parseInt(req.query.lastId, 10);
        }
        const posts = await db.Post.findAll({
            where,
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }, {
                model: db.Image,
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id']
            },],
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit, 10) || 10
        });
        return res.json(posts);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post('/:id/follow', isSignedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id }
        });
        await me.addFollowing(req.params.id);
        return res.send(req.params.id);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.delete('/:id/follow', isSignedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id }
        });
        await me.removeFollowing(req.params.id);
        return res.send(req.params.id);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

// use patch, when editing some parts, not whole info. 
router.patch('/nickname', isSignedIn, async (req, res, next) => {
    try {
        await db.User.update({
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id },
        });
        return res.send(req.body.nickname);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.get('/:id/followings', isSignedIn, async (req, res, next) => {
    try {
        let where = {};
        if (parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    [db.Sequelize.Op.gt]: parseInt(req.query.lastId, 10),
                }
            };
        }
        const user = await db.User.findOne({
            where: { id: req.user.id },
        });
        
        const followings = await user.getFollowings({
            where,
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit || 3, 10)
        });
        return res.json(followings);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.get('/:id/followers', isSignedIn, async (req, res, next) => {
    try {
        let where = {};
        if (parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    [db.Sequelize.Op.gt]: parseInt(req.query.lastId, 10),
                }
            };
        }
        const user = await db.User.findOne({
            where: { id: req.user.id },
        });
        const followers = await user.getFollowers({
            where,
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit || 3, 10)
        });
        return res.json(followers);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.delete('/:id/follower', isSignedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: {
                id: req.user.id
            }
        });
        await me.removeFollower(req.params.id);
        return res.send(req.params.id);
    } catch (err) {
        console.error(err);
        return next(err);
    }
})

module.exports = router;