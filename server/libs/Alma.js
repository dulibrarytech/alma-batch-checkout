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
		almaRequest(endpoint, "GET", {}, function(err, response) {
			if(err) {
				console.log("Alma error: " + err);
				// TODO Logger
				callback(err, null);
			}
			else {
					console.log("TEST Successfully retrieved data for item barcode ", barcode, typeof response);
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

					console.log("TEST checkout pre checkout request");
				// Check out the item
				almaRequest(endpoint, "POST", body, function(err, response) {
					if(err) {
						console.log("Alma error: " + err);
						// TODO Logger
						callback(err, null);
					}
					else {
						// TODO Logger
						console.log("TEST checkout response item barcode ", barcode, " response:", response);
						callback(null, response);
					}
				});
			}
		});



		// // Skip barcode request - assign bib,holding,item ids manually here, for testing the checkout request.
		// var item_id = "23665224580002766";
		// var endpoint = "users/" + userID + "/loans?item_pid=" + item_id + "&item_barcode=" + barcode;

		// var body = {
		// 	"circ_desk": {
	 //            "value": circDesk,
	 //            "desc": "Main"
	 //        },
	 //        "library": {
	 //            "value": library,
	 //            "desc": "Main"
	 //        }
		// };

		// 	console.log("TEST checkout pre checkout request");
		// // Check out the item
		// almaRequest(endpoint, "POST", body, function(err, response) {
		// 	if(err) {
		// 		console.log("Alma error: " + err);
		// 		// TODO Logger
		// 		callback(err, null);
		// 	}
		// 	else {
		// 		// TODO Logger
		// 		console.log("TEST checkout response item barcode ", barcode, " response:", response);
		// 		callback(null, response);
		// 	}
		// });

	}
	catch (e) {
		callback(e, null);
	}
}

exports.checkinItem = function(barcode, callback) {
	try {

			console.log("TEST checkin pre barcode request");

		// Get the Alma item pid using the barcode
		var endpoint = "items?item_barcode=" + barcode, queryString, url;
		almaRequest(endpoint, "GET", {}, function(err, response) {
			if(err) {
				console.log("Alma error: " + err);
				// TODO Logger
				callback(err, null);
			}
			else {
				console.log("TEST Successfully retrieved data for item barcode ", barcode, response);
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

var almaRequest = function(endpoint, method, data=null, callback) {
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

		console.log("DEV Sending alma request: -------------------------------------------");
		console.log("METHOD:", options.method);
		console.log("URI:", options.uri);
		console.log("Headers:", options.headers);
		console.log("FD Body type:", typeof options.body);
		console.log("FD Body:", options.body);
		console.log("---------------------------------------------------------------------");

	request(options, function(err, response, body) {
		console.log("Rx response", response);
		if(err) {
			var errString = "Error from Alma: " + err;
			console.log(errString);
			callback(errString, null);
		}
		else {
			var obj = JSON.parse(body);
			if(obj.errorsExist) {
				for(var error of obj.errorList.error) {
					console.log("Alma error code: ", error.errorCode);
					console.log("Alma error message: ", error.errorMessage);
				}
				callback(error.errorMessage, null);
			}
			else {
				console.log("Alma request success.  Body: ", body);
				callback(null, body);
			}
		}
	});
}