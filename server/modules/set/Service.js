'use strict'

var config = require('../../../config/configuration'),
    Alma = require('../../libs/Alma.js'),
    Model = require('./Model');

exports.createSetDataList = function(sets) {

	var list = [];
	for(var index of sets) {
		list.push({
			id: index._id,
			title: index.data.title,
			createdBy: index.data.creator,
			loanPeriod: index.data.period,
			date: index.data.createDate,
			status: index.status
		});
	}

	return list;
};

exports.createPatronLoans = function(patronID, setID, patronName, callback) {
	var data = [];
	return new Promise(function(fulfill, reject) {

		// Get set
		Model.getSetItems(setID, function(err, items) {
			if(err) {
				reject(err.toString());
			}
			else {

				for(var i=0; i<items.length; i++) {
					console.log("Alma checkout of item (barcode " + items[i] + ")");
					Alma.checkoutItem(patronID, items[i], function(err, response) {
						if(err) {
							console.log("Error: ", err);
							reject(err.toString());
						}
					});
				}

				Model.addLoan(patronID, setID, patronName, function(err, loanID) {
					if(err) {
						reject(err.toString());
					}
					else {
						fulfill(true);
					}
				});
			}
		})
	});
}

exports.deletePatronLoans = function(setID, callback) {
	var data = [];
	return new Promise(function(fulfill, reject) {

		// Get set
		Model.getSetItems(setID, function(err, items) {
			if(err) {
				reject(err.toString());
			}
			else {

				for(var i=0; i<items.length; i++) {
					console.log("Alma checkin of item (barcode " + items[i] + ")");
					Alma.checkinItem(items[i], function(err, response) {
						if(err) {
							console.log("Error: ", err);
							reject(err.toString());
						}
					});
				}

				Model.deleteLoan(setID, function(err) {
					if(err) {
						reject(err.toString());
					}
					else {
						fulfill(true);
					}
				});
			}
		})
	});
}