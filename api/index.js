var express = require('express'),
    api = express.Router()

//import the auth intesepter for protected routes
var auth = require('./routes/auth');


//import routes
api.use('/user', auth, require('./routes/user'));
api.use('/authenticate', require('./routes/authenticate'));
//export
module.exports = api;
