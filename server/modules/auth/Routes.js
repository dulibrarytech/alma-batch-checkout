'use strict'

var controller = require("./Controller");

module.exports = function (app) {
	app.post('/auth/authenticate', function(req, res) {
		controller.authenticate(req, res);
	});

	app.post('/auth/sso', function(req, res) {
		controller.authenticateSSO(req, res);
	});

	app.post('/auth/validate', function(req, res) {
		controller.validateToken(req, res);
	});
}