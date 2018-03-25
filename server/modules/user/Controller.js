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

exports.userCreate = function(req, res) {
	var response = {}, 
		user = {};

	if(!req.body.name) {
		res.sendStatus(400);
	}
	else {
		user['fname'] = Sanitizor.checkInput(req.body.firstname);
		user['lname'] = Sanitizor.checkInput(req.body.lastname);
		user['DUID'] = Sanitizor.checkInput(req.body.duid);
		//user['role'] = Sanitizor.checkInput(req.body.role);
		user['role'] = "2";	// No superadmin or admin user at this point.  All users have equal privileges

		// Get all sets from the database
		Model.addUser(set, function(err, id) {
				
			if(err) {
				response['error'] = err;
				res.status(200);
			}
			else {
				response['id'] = id;
			}

			res.send(JSON.stringify(response));
		});
	}
}

exports.userUpdate = function(req, res) {
	var response = {};

	if(!req.body.userID) {
		res.sendStatus(400);
	}
	else {
		var	id = Sanitizor.checkInput(req.body.userID);
		
		var data = req.body.data;
		data.firstname = Sanitizor.checkInput(req.body.data.firstname);
		data.lastname = Sanitizor.checkInput(req.body.data.lastname);
		data.duid = Sanitizor.checkInput(req.body.data.duid);

		Model.updateUser(id, data, function(err) {
			if(err) {
				response['error'] = err;
				res.status(200);
			}
			res.send(JSON.stringify(response));
		});
	}
}

exports.userRemove = function(req, res) {
	var response = {};

	if(!req.body.setID) {
		res.sendStatus(400);
	}
	else {

		Model.deleteUser(req.body.userID, function(err) {
			if(err) {
				response['error'] = err;
				res.status(200);
			}
			res.send(JSON.stringify(response));
		});
	}
}