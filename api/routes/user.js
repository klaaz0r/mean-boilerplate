var express = require('express'),
    userRouter = express.Router();
//import user model
var User = require('../models/user');

// we define the /api/user in the index js not here!
userRouter.route('/')
    //create a user
    .post(function(req, res) {
        var user = new User();
        console.log(req.body);
        user.name = req.body.name;
        user.username = req.body.name;
        user.password = req.body.password;

        console.log(req.body.name);
        console.log(user);
        user.save(function(err) {
            if (err) {
                if (err.code = 11000)
                    return res.json({
                        success: false,
                        message: 'A user with that username already exists.'
                    });
                else
                    return res.send(err);
            }
            res.json({
                message: 'User created!'
            });

        })
    })
    //get all users excluding the hashed password of course.
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);
            res.json(users);
        });
    });

//get a user by id
userRouter.route('/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);
            res.json(user);
        });
    })
    .put(function(req, res) {
        //find the user
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);
            //check what values are send to be updated
            if (req.body.name) user.name = req.body.name;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;
            //save the updated user object
            user.save(function(err) {
                if (err) res.send(err);
                res.json({
                    message: 'user updated!'
                });
            });
        });
    })
    //removing a user
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) return res.send(err);
            res.json({
                message: 'Successfully deleted'
            });
        });
    });
//export
module.exports = userRouter;
