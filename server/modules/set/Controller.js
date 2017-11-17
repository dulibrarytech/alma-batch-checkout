'use strict';

var async = require('async'),
    config = require('../../../config/configuration'),
    Service = require('./Service'),
    Model = require('./Model');

exports.setAll = function(req, res) {
	var response = {
		error: null
	};

	// Get all sets from the database
	Model.fetchAllSets(function(err, sets) {
			
		if(err) {
			console.log("Error:", err);
			response.error = err;
			res.setStatus(500);
		}
		else {
			response['sets'] = Service.createSetDataList(sets);
		}

		res.send(JSON.stringify(response));
	});
}

exports.setLoan = function(req, res) {

}

