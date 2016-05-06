var express = require('express'),
  api = express.Router()

//import routes
api.use('/user', require('./routes/user'));

//export
module.exports = api;
