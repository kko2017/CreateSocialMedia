const passport = require('passport');

module.exports = () => {
    // 사용자가 1억명이 동시접속하고 있는 페이스북같은 경우, 유저 정보를 db에서 불러내면
    // 서버 메모리가 터질수 밖에 없다. 그렇기 때문에 req.logIn에 필요한 유저 id 정보만 불러내서 과부화를 막는다.
    passport.serializeUser((user, done) => { 
        return done(null, user.id);
    });

    passport.deserializeUser(() => {
        
    });
};