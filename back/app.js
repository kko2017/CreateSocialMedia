const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('./models');
const app = express();

db.sequelize.sync({ force: false });

app.use(cors('http://localhost:3000'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello, backend!!');
});

app.post('/user', async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const exUser = await db.User.findOne({
            email: req.body.email,
        });
        if (exUser) {
            return res.status(403).json({
                errorCode: 1,
                message: 'Registered email.',
            });
        }
        const newUser = await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname,
        });
        // HTTP Status code
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return next(err);
    }
});

app.listen(3085, () => {
    console.log(`backend server ${3085} port stand by...`);
});