'use strict'

var SetController = require("./SetController");

module.exports = function (app) {

	app.get('/set/all', function(req, res) {			// TODO remove /get from route
		SetController.setAll(req, res);
	});
}