'use strict'

var controller = require("./Controller");

module.exports = function (app) {

	app.post('/set/create', function(req, res) {
		controller.setItems(req, res);
	});

	app.get('/set/all', function(req, res) {
		controller.setAll(req, res);
	});

	app.get('/set/create', function(req, res) {
		controller.setCreate(req, res);
	});

	app.get('/set/data', function(req, res) {
		controller.setItems(req, res);
	});

	app.put('/set/update', function(req, res) {
		controller.setItems(req, res);
	});

	app.delete('/set/remove', function(req, res) {
		controller.setItems(req, res);
	});

	app.get('/set/items', function(req, res) {
		controller.setItems(req, res);
	});

	app.get('/set/loan/data', function(req, res) {
		controller.setLoanData(req, res);
	});

	app.post('/set/loan/create', function(req, res) {
		controller.setLoanCreate(req, res);
	});

	app.delete('/set/loan/remove', function(req, res) {
		controller.setLoanRemove(req, res);
	});
}