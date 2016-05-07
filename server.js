var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

//port
var port = process.env.PORT || 8080;

// APP CONFIGURATION ---------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
    next();
});

app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/mean');

//serve the public folder (angular)
app.use(express.static(__dirname + '/public'));

//setup api router
app.use('/api', require('./api/index'));

//start server
app.listen(port);
