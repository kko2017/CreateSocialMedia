const express = require('express');
const multer = require('multer');
const path = require('path');

const { isSignedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts?offset=10&limit=10
    try {
        const posts = await db.Post.findAll({
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }, {
                model: db.Image,
            }],
            order: [['createdAt', 'DESC']],
            offset: parseInt(req.query.offset) || 0,
            limit: parseInt(req.query.limit) || 10
        });
        return res.json(posts);
    } catch (err) {
        
   }
});



module.exports = router;