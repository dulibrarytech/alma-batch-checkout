var controller = require("./Controller");

module.exports = function (app) {

	app.get('/test/alma', function(req, res) {
		res.send("Test alma route...");
	});

	app.post('/test/alma/loan', function(req, res) {
		controller.createLoan(req, res);
	});

}