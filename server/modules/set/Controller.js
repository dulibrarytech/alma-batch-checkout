'use strict';

var async = require('async'),
    Service = require('./Service'),
    Model = require('./Model');

/*
 * Depreciated
 */
exports.fetchSet = function(req, res) {
	res.sendStatus(410);
}

exports.setAll = function(req, res) {
	var response = {};

	// Get all sets from the database
	Model.fetchAllSets(function(err, sets) {
			
		if(err) {
			response['error'] = err;
			res.status(200);
		}
		else {
			response['sets'] = Service.createSetDataList(sets);
		}

		res.send(JSON.stringify(response));
	});
}

exports.setCreate = function(req, res) {
	var response = {};

	if(!req.body.title || !req.body.creator || !req.body.period) {
		res.sendStatus(400);
	}
	else {
		var set = {
			title: req.body.title,
			creator: req.body.creator,
			period: req.body.period
		}

		// Get all sets from the database
		Model.addSet(set, function(err, id) {
				
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

exports.setUpdate = function(req, res) {
	var response = {};
	Model.updateSet(req.body.setID, req.body.data, function(err) {
		if(err) {
			response['error'] = err;
			res.status(200);
		}
		res.send(JSON.stringify(response));
	})
}

exports.setRemove = function(req, res) {
	var response = {};

	Model.deleteSet(req.body.setID, function(err) {
		if(err) {
			response['error'] = err;
			res.status(200);
		}
		res.send(JSON.stringify(response));
	})
}

// Return an array of items in the set
exports.setItems = function(req, res) {
	var response = {};

	// Get all sets from the database
	Model.getSetItems(req.query.setID, function(err, sets) {
		if(err) {
			response['error'] = err;
			res.status(200);
		}
		else {
			response['items'] = sets;
		}

		res.send(JSON.stringify(response));
	});
}

exports.setLoanData = function(req, res) {
	var response = {};

	Model.getLoanBySetId(req.query.setID, function(err, loan) {
		if(err) {
			response['error'] = err;
			res.status(200);
		}
		else {
			response['data'] = loan;
			response.data.due = response.data.due.toString();

			res.send(JSON.stringify(response));
		}
	});
}

exports.setLoanCreate = function(req, res) {
	var response = {};

	Service.createPatronLoans(req.body.patronID, req.body.setID, req.body.patronName).then(data => {
		response['id'] = data.loanID;
		res.send(JSON.stringify(response));

	}).catch(error => {
		console.log(error);
		response['error'] = "Could not create user loan";
		res.status(200);
		res.send(JSON.stringify(response));
	});
	// response['error'] = "Could not create user loan";
	// 	res.status(200);
	// 	res.send(JSON.stringify(response));
}

exports.setLoanRemove = function(req, res) {
	var response = {};

	Service.deletePatronLoans(req.body.setID).then(data => {
			console.log("TEST deletePatronLoans done: rx: ", data);
		res.send(JSON.stringify(response));

	}).catch(error => {
		console.log(error);
		response['error'] = "Server error: Could not remove user loan";
		res.status(200);
		res.send(JSON.stringify(response));
	});
}

