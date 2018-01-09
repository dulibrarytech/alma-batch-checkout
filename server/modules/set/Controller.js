'use strict';

var async = require('async'),
    config = require('../../../config/configuration'),
    Service = require('./Service'),
    Model = require('./Model');

exports.setAll = function(req, res) {
	var response = {};

	// Get all sets from the database
	Model.fetchAllSets(function(err, sets) {
			
		if(err) {
			response['error'] = err;
			res.status(500);
		}
		else {
			response['sets'] = Service.createSetDataList(sets);
		}

		res.send(JSON.stringify(response));
	});
}

exports.setCreate = function(req, res) {
	var response = {};

	var set = {
		title: req.body.title,
		creator: req.body.creator,
		period: req.body.period
	}

	// Get all sets from the database
	Model.addSet(set, function(err, id) {
			
		if(err) {
			response['error'] = err;
			res.status(500);
		}
		else {
			response['id'] = id;
		}

		res.send(JSON.stringify(response));
	});
}

exports.setUpdate = function(req, res) {
	var response = {};

	Model.updateSet(req.body.setID, req.body.data, function(err) {
		if(err) {
			response['error'] = err;
			res.status(500);
		}
		res.send(JSON.stringify(response));
	})
}

exports.setRemove = function(req, res) {
	var response = {};

	Model.deleteSet(req.body.setID, function(err) {
		if(err) {
			response['error'] = err;
			res.status(500);
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
			res.status(500);
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
			res.status(500);
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

	Model.addLoan(req.body.patronID, req.body.setID, req.body.patronName, function(err, loanID) {
		if(err) {
			response['error'] = err;
			res.status(500);
		}
		else {
			response['id'] = loanID;
			Service.createPatronLoans(req.body.patronID, req.body.setID).then(data => {

					console.log("TESTA createPatronLoans done: rx: ", data);
					console.log("TESTB response obj ", response);
				res.send(JSON.stringify(response));
			});
		}
	});
}

exports.setLoanRemove = function(req, res) {
	var response = {};

	Model.deleteLoan(req.body.setID, function(err) {
		if(err) {
			response['error'] = err;
			res.status(500);
		}

		res.send(JSON.stringify(response));
	});
}


