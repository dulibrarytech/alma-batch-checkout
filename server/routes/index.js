'use strict'

var SetController = require("../modules/set/SetController");

module.exports = function (app) {
	app.get('/', function(req, res) {
	    res.render('index.html');
	});

	app.get('sets/all', function(req, res) {			// TODO remove /get from route
		console.log("TEST ROUTE sets/all");
		res.sendStatus(200);
	});
}