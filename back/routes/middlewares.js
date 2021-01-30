exports.isSignedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('Sign In first, please');
};

exports.isNotSignedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('Signed-In user is unable to use it');
};