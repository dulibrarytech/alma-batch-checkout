'use strict'

var config = require('../../../config/configuration'),
    Alma = require('../../libs/Alma.js');

exports.getPatronData = function(patronID) {

	var data = [];
	return new Promise(function(fulfill, reject) {
		Alma.getUserData(patronID, function(err, data) {
			if(err) {
				console.log("Error retrieving user data from Alma: ", err);
				fulfill(false);
			}
			else {

				// Use local function that parses data out of xml. Return data object with user name

				fulfill({fname:"John", lname: "User"});
			}
		})
	});
};