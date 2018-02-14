'use strict'

var Alma = require('../../libs/Alma.js'),
	settings = require('../../config/settings'),
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

exports.createPatronLoans = function(patronID, setID, patronName, period, callback) {
	var data = [];
	return new Promise(function(fulfill, reject) {

		// Get set
		Model.getSetItems(setID, function(err, items) {
			if(err) {
				reject(err.toString());
			}
			else {

				var date = new Date(), dateStr = "";
                var hours = period * (60*60*1000);
                date.setTime(date.getTime() + hours);

				if(settings.enable_alma_connection) {
					for(var i=0; i<items.length; i++) {
						console.log("Alma checkout of item (barcode " + items[i] + ")");
						Alma.checkoutItem(patronID, items[i], function(err, response) {
							if(err) {
								console.log("Error: ", err);
								reject(err.toString());
							}
							else {
								var loanData = JSON.parse(response);
								Alma.changeLoanDueDate(patronID, loanData.loan_id, date, function(err, response) {
									if(err) {
										console.log("Error: ", err);
										reject(err.toString());
									}
								});
							}
						});
					}
				}

				Model.addLoan(patronID, setID, patronName, date, function(err, loanID) {
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

				if(settings.enable_alma_connection) {
					for(var i=0; i<items.length; i++) {
						console.log("Alma checkin of item (barcode " + items[i] + ")");
						Alma.checkinItem(items[i], function(err, response) {
							if(err) {
								console.log("Error: ", err);
								reject(err.toString());
							}
						});
					}
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