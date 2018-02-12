'use strict';

require('dotenv').load();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express.js');
var app = express();

app.listen(process.env.APP_PORT);

console.log("Automated Batch Checkout application running on port " + process.env.APP_PORT + " at http://" + process.env.APP_HOST + " in " + process.env.NODE_ENV + " mode.");

module.exports = app;