'use strict'

var Token = require('../../middlewares/Token'),
	controller = require("./Controller");

module.exports = function (app) {

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

	app.post('/user', function(req, res) {
		controller.userCreate(req, res);
	});

	app.put('/user', function(req, res) {
		controller.userUpdate(req, res);
	});

	app.delete('/user', function(req, res) {
		controller.userRemove(req, res);
	});

	app.get('/user/all', function(req, res) {
		controller.userAll(req, res);
	});
}