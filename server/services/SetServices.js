'use strict'

var config = require('../config/config'),
    Alma = require('../libs/Alma.js');

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