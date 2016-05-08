var express = require('express'),
    authenticateRouter = express.Router();
//import jwt
var jwt = require('jsonwebtoken');
//import user model
var User = require('../models/user');
//import config file
var config = require('../../server.config.json');

//auth routes
authenticateRouter.route('/')

//getting a token
.post(function(req, res) {
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({
                success: false,
                message: 'Auth failed'
            });

        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Auth failed, wrong password'
                });
            } else {
                var token = jwt.sign({
                    name: user.name,
                    username: user.username
                }, config.secret, {
                    expiresIn: '5m'
                });
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

module.exports = authenticateRouter;
