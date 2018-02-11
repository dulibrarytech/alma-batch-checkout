'use strict'

var Alma = require('../../libs/Alma.js');

exports.getPatronData = function(patronID) {

	var data = [];
	return new Promise(function(fulfill, reject) {
		Alma.getUserData(patronID, function(err, response) {
			if(err) {
				console.log("Error retrieving user data from Alma: ", err);
				reject(false);
			}
			else {
				var data = {
					fname: response.firstname,
					lname: response.lastname
				}
				fulfill(data);
			}
		})
	});
};