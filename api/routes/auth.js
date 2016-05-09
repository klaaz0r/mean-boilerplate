var express = require('express'),
    auth = express.Router();
//import jwt
var jwt = require('jsonwebtoken');

//import key
var config = require('../../server.config.json');

auth.use(function(req, res, next) {
    console.log('auth middleware!');

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to validate token'
                });

            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }
});



module.exports = auth;
