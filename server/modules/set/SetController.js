'use strict';

var async = require('async'),
    config = require('../../../config/configuration'),
    Service = require('./SetService'),
    Model = require('./SetModel.js');

exports.setAll = function(req, res) {
	var data = {
		sets: [],
		error: null
	};

	// Get all sets from the database
	Model.fetchAllSets(function(err, sets) {
			
		if(err) {
			console.log("Error:", err);
			data.error = err;
		}
		else {
			data.sets = Service.createSetDataList(sets);
		}

		res.send(JSON.stringify(data));
	});
}

