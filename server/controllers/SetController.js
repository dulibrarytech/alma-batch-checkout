'use strict';

var async = require('async'),
    config = require('../config/config'),
    Service = require('./service.js'),
    Model = require('./model.js');

exports.renderCheckoutView = function(req, res) {		// sets/all
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

		return res.render('index', data);
	});
};

