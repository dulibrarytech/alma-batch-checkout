'use strict'

var controller = require("./Controller");

module.exports = function (app) {

	app.get('/borrower/data', function(req, res) {
		controller.borrowerData(req, res);
	});
}