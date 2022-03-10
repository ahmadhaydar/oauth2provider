const express = require('express');
const R = require('ramda');

const projectMiddleware = require('../middlewares/projectMiddleware');
const { verifyAccessToken} = require('../middlewares/authenticate');
const User = require('../models/user');
const router = express.Router()

router.route('/token')
    .post(projectMiddleware, async function(req, res) {
        if (req.project.projectSecret != req.body.projectSecret) {
            return res.status(400).send({ code: 400, message: "Mismatch ProjectID and Secret" })
        }
        let user = await User.findByCredentials(req.body.username, req.body.password);
        user.generateAccessToken()
            .then(async accesstoken => {
                let refreshtoken = await user.generateRefreshToken();
                res.send({ 
                    access_token: accesstoken,
                    expires_in : 300,
                    token_type : "Bearer",
                    scope : null,
                    refresh_token: refreshtoken

                 })
            }).catch(e => {
                res.status(400).send({ message: "Error while generating access token" })
            });
    });

router.route('/resource')
    .post(verifyAccessToken, async function(req, res) {
        user = req.user;
        res.send({
            access_token: req.token,
            client_id: user.client_id,
            user_id: user.username,
            full_name: user.full_name,
            npm: user.npm,
            expires: null,
            token_type: 'Bearer',
            refresh_token: user.refresh_token,
          });
    });

module.exports = router;