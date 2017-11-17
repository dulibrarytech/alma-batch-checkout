'use strict'

var controller = require("./Controller");

module.exports = function (app) {

	app.get('/set/all', function(req, res) {
		controller.setAll(req, res);
	});

	app.get('/set/loan', function(req, res) {
		controller.setLoan(req, res);
	});

	app.get('/set/items', function(req, res) {
		controller.setItems(req, res);
	});
}