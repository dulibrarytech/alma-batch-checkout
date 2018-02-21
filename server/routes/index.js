'use strict'

module.exports = function (app) {

	require('../test/Routes.js')(app);
	var settings = require('../config/settings.js');

	var checkHeader = function(req, res, next) {
	  if(req.headers['client-id-header'] == settings.client_header) {
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
    		console.log("ACCESS Root access from host:", req.headers.host);
    		console.log("ACCESS User Agent:", req.headers['user-agent']);
	    res.render('index.html');
	});

	// Protected routes
	app.use(checkHeader);

	require('../modules/set/Routes.js')(app, settings);
	require('../modules/patron/Routes.js')(app, settings);

	app.post('/test', function(req, res) {
		res.send(200);
	});
};
