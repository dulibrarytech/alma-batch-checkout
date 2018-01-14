'use strict'

var request = require("request");
var parseString = require('xml2js').parseString;

var host = "https://api-na.hosted.exlibrisgroup.com",
	path = "/almaws/v1/";



// Get all required user data
exports.getUserData = function(userID, callback) {
	try {

		var endpoint = "users/" + userID;
		performRequest(endpoint, "GET", {}, function(err, response) {
			if(err) {
				console.log("Alma error: " + err);
				// TODO Logger
				callback(err, null);
			}
			else {
				var userData = JSON.parse(response),
					data = {
					firstname: userData.first_name,
					lastname: userData.last_name
				}

				callback(null, data);
			}
		})
	}
	catch (e) {
		callback(e, null);
	}
}

exports.checkoutItem = function(userID, barcode, callback) {
	try {

		// Get the Alma item pid using the barcode
		var endpoint = "items?item_barcode=" + barcode;
		performRequest(endpoint, "GET", {}, function(err, response) {
			if(err) {
				console.log("Alma error: " + err);
				// TODO Logger
				callback(err, null);
			}
			else {
				console.log("TEST Successfully retrieved data for item barcode ", barcode, response);
				
				// Parse out the item pid, then construct checkout url
				var item_id = response.item_data.pid;
				endpoint = "users/" + userID + "/loans?item_pid=" + item_id + "&item_barcode=" + barcode;

				// Check out the item
				performRequest(endpoint, "POST", {}, function(err, response) {
					if(err) {
						console.log("Alma error: " + err);
						// TODO Logger
						callback(err, null);
					}
					else {
						// TODO Logger
						console.log("TEST checkout item barcode ", barcode, " response:", response);
						callback(null, response);
					}
				});
			}
		});
	}
	catch (e) {
		callback(e, null);
	}
}

exports.checkinItem = function(barcode, callback) {
	try {

		// Get the Alma item pid using the barcode
		var endpoint = "items?item_barcode=" + barcode;
		performRequest(endpoint, "GET", {}, function(err, response) {
			if(err) {
				console.log("Alma error: " + err);
				// TODO Logger
				callback(err, null);
			}
			else {
				console.log("TEST Successfully retrieved data for item barcode ", barcode, response);
				
				// Parse out the item pid, then construct checkout url
				var item_id = response.item_data.pid,
					holding_id = response.holding_data.honding_id,
					mms_id = response.bib_data.mms_id;

				endpoint = "bibs/" + mms_id + "/holdings/" + holding_id + "/items/" + item_id;
				// POST /almaws/v1/bibs/{mms_id}/holdings/{holding_id}/items/{item_pid}

				// Check in the item
				performRequest(endpoint, "POST", {}, function(err, response) {
					if(err) {
						console.log("Alma error: " + err);
						// TODO Logger
						callback(err, null);
					}
					else {
						// TODO Logger
						console.log("TEST checkin item barcode ", barcode, " response:", response);
						callback(null, response);
					}
				});
			}
		});
	}
	catch (e) {
		callback(e, null);
	}
}

var performRequest = function (endpoint, method, data=null, callback) {

  var dataString;
  var headers = {
    'Authorization': 'apikey ' + apiKey,
    'Accept': 'application/json'
  };
  if (data && method != 'GET') {
  	dataString = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = dataString.length;
  }

  var options = {
    uri: host + path + endpoint,
    method: method,
    headers: headers
  };
  	console.log("Options are:", options);

  if (data && method != 'GET') {
  	options['formData'] = data;
  }
  	console.log("TEST Alma request gets options: ", options);
  request(
    options,
    function(err, response, body) {
      if (!err && ('' + response.statusCode).match(/^[4-5]\d\d$/)) {
        console.log('Error from Alma: ' + body);
        var message;
        try {
          var obj = JSON.parse(body);
          message = obj.errorList.error[0].errorMessage + " (" + obj.errorList.error[0].errorCode + ")";
        } catch (e) {
          message = "Unknown error from Alma.";
        }
        err = new Error(message);
      }

      if(err) {
      	callback(err, null);
      }
      else {
      	callback(null, body);
      }
    });
  }