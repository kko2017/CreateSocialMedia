const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const db = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const app = express();

// Run sequelize and (passport config in the passport folder)
db.sequelize.sync({ force: false });
passportConfig();

app.use(morgan('dev'));
// prevent cors
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Front can access the image in uploads folder.
app.use('/', express.static('uploads'));
// make req.body as to parse json from frontend, urlencode form data of frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookie('cookiesecret'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret',
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

//implement req.logIn req.logOut 
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Hello, backend!!');
});

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);

app.listen(3085, () => {
    console.log(`backend server ${3085} port stand by...`);
});