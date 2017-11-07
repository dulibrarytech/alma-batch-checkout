'use strict'

var request = require("request");

exports.getUserData = function(userID, callback) {
	console.log("Alma::getUserData()", userID);

	// Gets raw data xml from Alma API


	callback(null, {data:"RAWDATA"});
};

