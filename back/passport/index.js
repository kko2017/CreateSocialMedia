const passport = require('passport');
const local = require('./local');
const db = require('../models');

module.exports = () => {
    // 사용자가 1억명이 동시접속하고 있는 페이스북같은 경우, 유저 정보를 db에서 불러내면
    // 서버 메모리가 터질수 밖에 없다. 그렇기 때문에 req.logIn에 필요한 유저 id 정보만 불러내서 과부화를 막는다.
    passport.serializeUser((user, done) => { 
        return done(null, user.id);
    });

    // 위의 메서드로부터 받은 id를 가지고 user 정보를 다 받는다.
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.User.findOne({ where: { id } });
            return done(null, user); // 로그인 후 모든 콜이 올 때마다 유저 정보를 req.user에 넣어준다. 그리고 req.authenticated() === true로 만들어 준다.
        } catch (err) {
            console.error(err);
            return done(err);
        }
    });
    local();
};