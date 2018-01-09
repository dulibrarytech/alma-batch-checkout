'use strict'

var request = require("request");
var parseString = require('xml2js').parseString;

var almaDomain = "https://api-na.hosted.exlibrisgroup.com";

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
	var name = "John User";

	var url = almaDomain + "/almaws/v1/users/";
	  	url += userID;
	  	url += "?apikey=" + process.env.ALMA_API_KEY;

	// try {
	// 	request(url, function (error, response, body) {
	// 	  if(error) {
	// 	  	console.log("Error contacting Alma");
	// 	  	callback(error, null);
	// 	  }
	// 	  else if(response.statusCode != 200) {
	// 	  	var err = "Alma returns status ", response.statusCode;
	// 	  	console.log(err);
	// 	  	callback(err, null);
	// 	  }
	// 	  else {

	// 		parseString(body, function (err, result) {
	// 		    name = result.user.last_name + ", " + result.user.first_name;
	// 		    callback(null, name);
	// 		});
	// 	  }
	// 	});
	// }
	// catch (e) {
	// 	callback(e, null);
	// }
	callback(null, "Rynhart, Jeff");
}; 

