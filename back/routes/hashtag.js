const express = require('express');
const multer = require('multer');
const path = require('path');

const { isSignedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => { // GET /hashtag/:id?lastId=1&limit=10
    try {
        let where = {};
        if (parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // less than
                },
            };
        }
        const posts = await db.Post.findAll({
            where,
            include: [{
                model: db.Hashtag,
                where: { name: decodeURIComponent(req.params.tag) },
            }, {
                model: db.User,
                attributes: ['id', 'nickname']
            }, {
                model: db.Image,
                }, {
                    model: db.User,
                    as: 'Likers',
                    attributes: ['id']
                }, {
                    model: db.Post,
                    as: 'Retweet',
                    include: [{
                        model: db.User,
                        attributes: ['id', 'nickname']
                    }, {
                        model: db.Image
                    }],
                }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit, 10) || 10
        });
        return res.json(posts);
    } catch (err) {
        console.error(err);
        return next(err);
   }
});

module.exports = router;