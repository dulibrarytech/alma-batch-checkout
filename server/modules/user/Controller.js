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
		console.log("TEST body into controller:", req.body);
	if(!req.body.duid || !req.body.firstname || !req.body.lastname) {
		res.status(400);
		response['error'] = "Server error";
		res.send();
	}
	else {

		try {
			user['fname'] = Sanitizor.checkInput(req.body.firstname);
			user['lname'] = Sanitizor.checkInput(req.body.lastname);
			user['DUID'] = Sanitizor.checkInput(req.body.duid);
			//user['role'] = Sanitizor.checkInput(req.body.role);
			user['role'] = "2";	// No superadmin or admin user at this point.  All users have equal privileges

			// Get all sets from the database
			Model.addUser(user, function(err, id) {
					
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
		catch (e) {
			res.status(500);
			response['error'] = e;
			res.send();
		}
	}
}

exports.userUpdate = function(req, res) {
	var response = {};

	if(!req.body.userID) {
		res.status(400);
		response['error'] = "Server error";
		res.send();
	}
	else {
		var	id = Sanitizor.checkInput(req.body.userID);
		
		try {
			var data = {};
			data['fname'] = Sanitizor.checkInput(req.body.data.firstname);
			data['lname'] = Sanitizor.checkInput(req.body.data.lastname);
			data['DUID'] = Sanitizor.checkInput(req.body.data.duid);
			data['role'] = Sanitizor.checkInput(req.body.data.role) || "2";	

			Model.updateUser(id, data, function(err) {
				if(err) {
					response['error'] = err;
					res.status(200);
				}
				res.send(JSON.stringify(response));
			});
		}
		catch (e) {
			res.status(500);
			response['error'] = e;
			res.send();
		}
 	}
}

exports.userRemove = function(req, res) {
	var response = {};

	if(!req.body.userID) {
		res.status(400);
		response['error'] = "Server error";
		res.send();
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