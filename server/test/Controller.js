var Alma = require("../libs/Alma");

exports.createLoan = function(req, res) {
	console.log("Creating loan...");

	var patronID = "872895198",
		item = "U186022582599";

	Alma.checkoutItem(patronID, item, function(err, response) {
		res.send(response);
	});

}