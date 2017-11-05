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
			
		data.sets = Service.createSetDataList(sets);;
		res.send(JSON.stringify(data));
	});
}

