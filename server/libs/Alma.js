'use strict'

var request = require("request");
var parseString = require('xml2js').parseString;

var settings = require("../config/settings");

var host = "https://api-na.hosted.exlibrisgroup.com",
	path = "/almaws/v1/";

var library = "p",
	circDesk = "DEFAULT_CIRC_DESK";

// Get all required user data
exports.getUserData = function(userID, callback) {
	try {

		var endpoint = "users/" + userID;
		almaRequest(endpoint, "GET", {}, function(err, response) {
			if(err) {
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
		almaRequest(endpoint, "GET", {}, function(err, response) {
			if(err) {
				// TODO Logger
				callback(err, null);
			}
			else {
				var itemData = JSON.parse(response);
				// Parse out the item pid, then construct checkout url
				var item_id = itemData.item_data.pid;
				endpoint = "users/" + userID + "/loans?item_pid=" + item_id + "&item_barcode=" + barcode;

				var body = {
					"circ_desk": {
		                "value": circDesk,
		                "desc": "Main"
		            },
		            "library": {
		                "value": library,
		                "desc": "Main"
		            }
				};

				// Check out the item
				almaRequest(endpoint, "POST", body, function(err, response) {
					if(err) {
						// TODO Logger
						callback(err, null);
					}
					else {
						// TODO Logger
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
		var endpoint = "items?item_barcode=" + barcode, queryString, url;
		almaRequest(endpoint, "GET", {}, function(err, response) {
			if(err) {
				// TODO Logger
				callback(err, null);
			}
			else {
				var itemData = JSON.parse(response);

				// Parse out the item pid, then construct checkout url
				var item_id = itemData.item_data.pid,
					holding_id = itemData.holding_data.honding_id,
					mms_id = itemData.bib_data.mms_id;

				endpoint = "bibs/" + mms_id + "/holdings/" + holding_id + "/items/" + item_id;
				queryString = "?op=scan&library=" + library + "&circ_desk=" + circDesk;
				url = endpoint + queryString;

				// Check in the item
				almaRequest(url, "POST", null, function(err, response) {
					if(err) {
						callback(err, null);
					}
					else {
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

var almaRequest = function(endpoint, method, data, callback) {
 	var dataString,
  	  	apikey = 'apikey ' + settings.alma_api_key;

  	var headers = {
    	'Authorization': apikey,
    	'Accept': 'application/json'
  	};

  	if(data && method != 'GET') {
	  	dataString = JSON.stringify(data);
	    headers['Content-Type'] = 'application/json';
	    headers['Content-Length'] = dataString.length;
	}

	var options = {
	    uri: host + path + endpoint,
	    method: method,
	    headers: headers
	};

	if (data && method != 'GET') {
	  	options['body'] = dataString;
	}

	request(options, function(err, response, body) {

		if(err) {
			var errString = "Error from Alma: " + err;
			callback(errString, null);
		}
		else {
			try {
				var obj = JSON.parse(body), errorStr = "Alma error messages: ";
				if(obj.errorsExist) {
					for(var error of obj.errorList.error) {
						console.log("Alma error code: ", error.errorCode);
						console.log("Alma error message: ", error.errorMessage);
						errorStr += (" " + error.errorMessage + " ");
					}
					console.log("ERRORSTR:", errorStr);
					callback(errorStr, null);
				}
				else {
					callback(null, body);
				}
			}
			catch(e) {
				var errString = "Error from Alma: " + e;
				callback(e, null);
			}
		}
	});
}