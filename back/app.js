const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const db = require('./models');
const passportConfig = require('./passport');
const app = express();

// Run sequelize and (passport config in the passport folder)
db.sequelize.sync({ force: false });
passportConfig();

app.use(morgan('dev'));
// prevent cors
app.use(cors('http://localhost:3000'));
// make req.body as to parse json from frontend, urlencode form data of frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookie('cookiesecret'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret'
}));

//implement req.logIn req.logOut 
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Hello, backend!!');
});

app.post('/user', async (req, res, next) => {
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

app.post('/user/login', (req, res) => {
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

app.listen(3085, () => {
    console.log(`backend server ${3085} port stand by...`);
});