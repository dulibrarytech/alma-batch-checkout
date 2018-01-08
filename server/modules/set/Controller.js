'use strict';

var async = require('async'),
    config = require('../../../config/configuration'),
    Service = require('./Service'),
    Model = require('./Model');

exports.setAll = function(req, res) {
	var response = {
		error: null
	};

	// Get all sets from the database
	Model.fetchAllSets(function(err, sets) {
			
		if(err) {
			console.log("Error:", err);
			response.error = err;
			res.status(500);
		}
		else {
			response['sets'] = Service.createSetDataList(sets);
		}

		res.send(JSON.stringify(response));
	});
}

exports.setCreate = function(req, res) {
	var response = {
		error: null
	};

	// Get all sets from the database
	Model.addSet(function(err, id) {
			
		if(err) {
			console.log("Error:", err);
			response.error = err;
			res.status(500);
		}
		else {
			response['id'] = id;
		}

		res.send(JSON.stringify(response));
	});
}

exports.setUpdate = function(req, res) {
	var response = {
		error: null
	};
	
	Model.updateSet(req.body.setID, req.body.data, function(err) {
		if(err) {
			console.log("Error:", err);
			response.error = err;
			res.status(500);
		}
		res.send(JSON.stringify(response));
	})
}

exports.setRemove = function(req, res) {
	var response = {
		error: null
	};

		console.log("TEST setRemove controller gets:", req.body);

	Model.deleteSet(req.body.setID, function(err) {
		if(err) {
			console.log("Error:", err);
			response.error = err;
			res.status(500);
		}
		res.send(JSON.stringify(response));
	})
}

// Return an array of items in the set
exports.setItems = function(req, res) {
	var response = {
		error: null
	};

	// Get all sets from the database
	Model.getSetItems(req.query.setID, function(err, sets) {

		if(err) {
			console.log("Error:", err);
			response.error = err;
			res.status(500);
		}
		else {
			response['items'] = sets;
		}

		res.send(JSON.stringify(response));
	});
}

exports.setLoanData = function(req, res) {
	var response = {
		error: null
	};

	Model.getLoanBySetId(req.query.setID, function(err, loan) {
		if(err) {
			console.log("Error:", err);
			response.error = err;
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
	var response = {
		error: null
	};

	Model.addLoan(req.body.patronID, req.body.setID, function(err, loanID) {
		if(err) {
			console.log("Error:", err);
			response.error = err;
			res.status(500);
		}
		else {
			response['id'] = loanID;
			res.send(JSON.stringify(response));
		}
	});
}

exports.setLoanRemove = function(req, res) {
	var response = {
		error: null
	};

	Model.deleteLoan(req.body.setID, function(err) {

		if(err) {
			console.log("Error:", err);
			response.error = err;
			res.status(500);
		}

		res.send(JSON.stringify(response));
	});
}


