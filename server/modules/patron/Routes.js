'use strict'

var controller = require("./Controller");

module.exports = function (app) {

	app.get('/patron/data', function(req, res) {
		controller.patronData(req, res);
	});
}