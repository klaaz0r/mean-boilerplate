var express = require('express');
var app = express();

//port
var port = process.env.PORT || 8080;

//serve the public folder (angular)
app.use(express.static(__dirname + '/public'));

//setup api router
app.use('/api', require('./api/index'));

//start server
app.listen(port);
