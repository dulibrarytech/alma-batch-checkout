'use strict'

var controller = require("./Controller");

module.exports = function (app) {
	app.post('/auth/authenticate', function(req, res) {
		controller.authenticate(req, res);
	});
}