var express = require('express'),
  userRouter = express.Router();

userRouter.use(function(req, res, next) {
  res.json({
    message: 'Hello Node'
  });

});

//export
module.exports = userRouter;
