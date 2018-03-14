'use strict'

var Token = require('../../libs/Token'),
    controller = require("./Controller");

module.exports = function (app, settings) {

	app.use(function(req, res, next) {

		Token.validateToken(req, function(token) {
			if(token) {
				next();
			}
			else {
				console.log("No request token present");
				res.sendStatus(403);
			}
		});
	});

	app.get('/patron/data', function(req, res) {
		controller.patronData(req, res);
	});
}