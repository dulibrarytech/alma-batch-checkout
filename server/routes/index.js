'use strict'

module.exports = function (app) {

	require('../test/Routes.js')(app);
	var auth = require('../modules/auth/Controller.js');
	var settings = require('../config/settings.js');

	var checkHeader = function(req, res, next) {
	  if(req.headers['client-id-header'] == settings.client_header || req.originalUrl == "/auth/sso") {
	    next();
	  }
	  else {
	  	console.log("Receive request from unidentified client");
	    res.statusCode = 403;
	    res.send();
	  }
	};

    // Open routes
    app.get('/', function(req, res) {
	    res.render('index.html');
	});

	// Client verify
	app.use(checkHeader);

	// Server modules
	require('../modules/auth/Routes.js')(app, settings);
	require('../modules/set/Routes.js')(app, settings);
	require('../modules/patron/Routes.js')(app, settings);
	require('../modules/user/Routes.js')(app, settings);

	app.post('/test', function(req, res) {
		res.send(200);
	});
};
