var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	http = require('http');

module.exports = function () {
	var app = express();
	var server = http.createServer(app);
	
	require('../server/routes/index')(app);

	var allowCrossDomain = function(req, res, next) {
	    res.header('Access-Control-Allow-Origin', '*');
	    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	    res.header('Access-Control-Allow-Headers', 'Content-Type');

	    next();
	};

	app.set('views', path.join(__dirname, '../server/views'));
	app.set('view engine', 'ejs');
	app.engine('html', require('ejs').renderFile);
	app.use(favicon('client/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(allowCrossDomain);
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, '../client')));

	app.set('port', process.env.PORT || 9000);

	return server;
};