const passport = require('passport');
const bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');
const db = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
    }, async (email, password, done) => {
            try {
                const exUser = await db.User.findOne({ where: { email } });
                if (!exUser) {
                    // done(error info, success info, failure info);
                    return done(null, false, { reason: 'Unregistered user' });
                }
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    // 성공하면 사용자 정보입력
                    return done(null, exUser);
                } else {
                    return done(null, false, { reason: 'Wrong password.' });
                }   
            } catch (err) {
                console.error(err);
                return done(err);
            }
    }));
}