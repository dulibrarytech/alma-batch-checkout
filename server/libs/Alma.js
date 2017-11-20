'use strict'

var request = require("request");

exports.getUserData = function(userID, callback) {
	console.log("Alma::getUserData()", userID);

	// Gets raw data xml from Alma API


	callback(null, {data:"RAWDATA"});
};

var getRawData = function(userID, callback) {
	callback("RAWDATA");
};

// Parse out the first and last name
exports.getUserName = function(userID, callback) {
	var name = "John User"

	callback(null, name);
}; 

