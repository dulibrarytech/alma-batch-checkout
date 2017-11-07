'use strict'

var controller = require("./Controller");

module.exports = function (app) {

	app.get('/set/all', function(req, res) {			// TODO remove /get from route
		controller.setAll(req, res);
	});
}