var express = require('express'),
  api = express.Router()

//import routes
api.use('/user', require('./routes/user'));
api.use('/authenticate', require('./routes/authenticate'));
//export
module.exports = api;
