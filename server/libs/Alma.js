'use strict'

var request = require("request");
var parseString = require('xml2js').parseString;

var almaDomain = "https://api-na.hosted.exlibrisgroup.com";

// Get all required user data
exports.getUserData = function(userID, callback) {

	var url = almaDomain + "/almaws/v1/users/";
	url += userID;
	url += "?apikey=" + process.env.ALMA_API_KEY;

	var data = {};
	// Gets raw data xml from Alma API
	try {
		request(url, function (error, response, body) {
		  if(error) {
		  	console.log("Error contacting Alma");
		  	callback(error, null);
		  }
		  else if(response.statusCode != 200) {
		  	var err = "Alma returns status " + response.statusCode;
		  	console.log(err);
		  	callback(err, null);
		  }
		  else {

			parseString(body, function (err, result) {
			    data['firstname'] = result.user.first_name;
			    data['lastname'] = result.user.last_name;
			    callback(null, data);
			});
		  }
		});
	}
	catch (e) {
		callback(e, null);
	}

	// data['firstname'] = "Jeff";
	// data['firstname'] = "Rynhart";
	// callback(null, data);
};

// exports.createUserLoans()

var getRawData = function(userID, callback) {
	callback("RAWDATA");
};

