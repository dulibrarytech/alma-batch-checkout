'use strict'

var controller = require("./Controller");

module.exports = function (app) {

	app.post('/set', function(req, res) {
		controller.setCreate(req, res);
	});

	app.get('/set', function(req, res) {
		controller.fetchSet(req, res);
	});

	app.put('/set', function(req, res) {
		controller.setUpdate(req, res);
	});

	app.delete('/set', function(req, res) {
		controller.setRemove(req, res);
	});

	app.get('/set/all', function(req, res) {
		controller.setAll(req, res);
	});

	app.get('/set/items', function(req, res) {
		controller.setItems(req, res);
	});

	app.get('/set/loan', function(req, res) {
		controller.setLoanData(req, res);
	});

	app.post('/set/loan', function(req, res) {
		controller.setLoanCreate(req, res);
	});

	app.delete('/set/loan', function(req, res) {
		controller.setLoanRemove(req, res);
	});
}