const express = require('express');
const multer = require('multer');
const path = require('path');

const { isSignedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts?offset=10&limit=10
    try {
        where = {};
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
        
   }
});



module.exports = router;