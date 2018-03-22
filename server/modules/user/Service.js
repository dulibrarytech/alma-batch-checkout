'use strict'

var settings = require('../../config/settings'),
    Model = require('./Model');

exports.createUserDataList = function(users) {

	var list = [];
	for(var index of users) {
		list.push({
			id: index._id,
			firstname: index.fname,
			lastname: index.lname,
			DUID: index.DUID
		});
	}

	return list;
};