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
                return res.json(user);
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
            return res.json(user);
        });
    })(req, res, next);
});

router.post('/logout', isSignedIn, (req, res) => {
    req.logout();
    req.session.destroy(); // Optional choice
    return res.status(200).send('You logged out.');
});

module.exports = router;