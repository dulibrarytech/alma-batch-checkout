'use strict';

var async = require('async'),
	Sanitizor = require('../../libs/Sanitize'),
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
	var response = {}, 
		set = {};

	if(!req.body.title) {
		res.sendStatus(400);
	}
	else {

		set['title'] = Sanitizor.checkInput(req.body.title);
		set['creator'] = Sanitizor.checkInput(req.body.creator);
		set['period'] = Sanitizor.checkInput(req.body.period);

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

	if(!req.body.setID || (!req.body.data.title && !req.body.data.items)) {
		res.sendStatus(400);
	}
	else {
		var	id = Sanitizor.checkInput(req.body.setID);
		
		var data = req.body.data;
		data.title = Sanitizor.checkInput(req.body.data.title);
		for(var index in data.items) {
			data.items[index] = Sanitizor.checkInput(data.items[index]);
		}

		Model.updateSet(id, data, function(err) {
			if(err) {
				response['error'] = err;
				res.status(200);
			}
			res.send(JSON.stringify(response));
		});
	}
}

exports.setRemove = function(req, res) {
	var response = {};

	if(!req.body.setID) {
		res.sendStatus(400);
	}
	else {

		Model.deleteSet(req.body.setID, function(err) {
			if(err) {
				response['error'] = err;
				res.status(200);
			}
			res.send(JSON.stringify(response));
		});
	}
}

// Return an array of items in the set
exports.setItems = function(req, res) {
	var response = {};

	if(!req.query.setID) {
		res.sendStatus(400);
	}
	else {
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
}

exports.setLoanData = function(req, res) {
	var response = {};

	if(!req.query.setID) {
		res.sendStatus(400);
	}
	else {
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
}

exports.setLoanCreate = function(req, res) {
	var response = {};

	if(!req.body.patronID || !req.body.setID || !req.body.patronName || !req.body.loanPeriod) {
		res.sendStatus(400);
	}
	else {
		var pid = Sanitizor.checkInput(req.body.patronID),
			sid = Sanitizor.checkInput(req.body.setID),
			name = Sanitizor.checkInput(req.body.patronName),
			hrs = Sanitizor.checkInput(req.body.loanPeriod);
			
		Service.createSetLoans(pid, sid, name, hrs).then(data => {
			response['id'] = data.loanID;
			res.send(JSON.stringify(response));

		}).catch(error => {
			console.log(error);
			response['error'] = "Could not create user loan";
			res.status(200);
			res.send(JSON.stringify(response));
		});
	}
}

exports.setLoanRemove = function(req, res) {
	var response = {};

	if(!req.body.setID) {
		res.sendStatus(400);
	}
	else {
		Service.deleteSetLoans(req.body.setID).then(data => {
			res.send(JSON.stringify(response));

		}).catch(error => {
			console.log(error);
			response['error'] = "Server error: Could not remove user loan";
			res.status(200);
			res.send(JSON.stringify(response));
		});
	}
}

