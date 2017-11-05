'use strict';

var async = require('async'),
    config = require('../../../config/configuration'),
    Service = require('./SetService'),
    Model = require('./SetModel.js');

exports.setAll = function(req, res) {
	var data = {
		sets: [],
		clickCheck: null
	};

	// Get all sets from the database
	Model.fetchAllSets(function(err, sets) {
			
		// Create the view model data object (does not contain list)
		var setList = Service.createSetDataList(sets);

		// Update data for view display
		for(var index of setList) {
			if(index.status == "ON_LOAN") {
				index.status = "On Loan";
			}
			else if(index.status == "AVAILABLE") {
				index.status = "Available";
			}
		}

		data.sets = setList;
		res.send(JSON.stringify(data));
	});
}

