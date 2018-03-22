'use strict';

var async = require('async'),
	Sanitizor = require('../../libs/Sanitize'),
    Service = require('./Service'),
    Model = require('./Model');

/*
 * Depreciated
 */
exports.getUserData = function(req, res) {
	res.sendStatus(410);
}

exports.userAll = function(req, res) {
	var response = {};

	// Get all sets from the database
	Model.getUserList(function(err, users) {
			
		if(err) {
			response['error'] = err;
			res.status(200);
		}
		else {
			response['users'] = Service.createUserDataList(users);
		}

		res.send(JSON.stringify(response));
	});
}