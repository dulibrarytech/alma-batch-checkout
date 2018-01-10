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
			console.log("Perform request ok");

			if(err) {
				console.log("Alma error: " + err);
				// Logger
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

	// GET barcode url
	var url = almaDomain + "/almaws/v1/items";
	url += "?item_barcode=" + barcode;
	url += "&apikey=" + process.env.ALMA_API_KEY;

	try {
		console.log("Barcode api on item: ", url);
		// request(url, function (error, response, body) {
		//   if(error) {
		//   	console.log("Error contacting Alma");
		//   	// Logger
		//   	callback(error, null);
		//   }
		//   else if(response.statusCode != 200) {
		//   	var err = "Alma returns status " + response.statusCode + " for barcode: " + barcode;
		//   	console.log(err);
		//   	// Logger
		//   	callback(err, null);
		//   }
		//   else {
		  	
		//   	console.log("BC response: ", body);
		// 	parseString(body, function (err, result) {

		// 		try {
		// 			// Get the item id
		// 		    console.log("BC parsed: ", result);
		// 		    var itemID = result.item.$.item_data.pid;
		// 		    console.log("item id: ", itemID);

		// 			// Send the check out request
		// 			console.log("Checking out...");
		// 			url = almaDomain + "/almaws/v1/users";

		// 		    callback(null, "12345");
		// 		}
		// 		catch (e) {
		// 			callback(e, null);
		// 		}
		// 	});
		//   }
		// });




		
	}
	catch (e) {
		callback(e, null);
	}

	//callback(null, loanID);
}

var performRequest = function (endpoint, method, data=null, callback) {
  var dataString;
  var headers = {
    'Authorization': 'apikey ' + process.env.ALMA_API_KEY,
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

  if (data && method != 'GET') {
  	options['formData'] = data;
  }

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