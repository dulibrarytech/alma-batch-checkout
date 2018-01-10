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

exports.createPatronLoans = function(patronID, setID) {
	var data = [];
	return new Promise(function(fulfill, reject) {

		// Get set
		Model.getSetItems(setID, function(err, items) {
			if(err) {
				reject(err.toString());
			}
			else {
				
				console.log("TEST createPatronLoans have items: ", items);

				// loop items.length
				var temp = [];
				temp.push(items[0]);
				for(var i=0; i<temp.length; i++) {
					Alma.checkoutItem(temp[i], function(err, response) {
						if(err) {
							reject("Could not check out item ", temp[i], ": Error: ", err);
						}
						else {
							console.log("Checked out item ", temp[i], ": ", response);
						}
					});
				}
					console.log("TEST fulfilling");
				fulfill(true);
			}
		})



	});
}