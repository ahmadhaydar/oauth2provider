const User = require('../models/user');

var verifyAccessToken = function(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];
    User.findByToken(token).then(function(data) {
        if (!data.user) {
            return Promise.reject({ code: 403, message: "Invalid Access Token" });
        }
        if (data.user.expires_in < Date.now()) {
            return Promise.reject({ code: 403, message: "Token Expired" });
        }
        req.user = data.user;
        req.token = token
        next();
    }).catch(function(e) {
        if (e.code) {
            res.status(e.code).send(e);
        } else {
            console.log(e);
            res.status(500).send({ code: 500, message: "Unknown Error" })
        }
    });

};
module.exports = { verifyAccessToken};