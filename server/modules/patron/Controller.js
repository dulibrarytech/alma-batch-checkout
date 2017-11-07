'use strict';

var async = require('async'),
    config = require('../../../config/configuration'),
    Service = require('./Service');

exports.patronData = function(req, res) {

	var id = req.query.patronID;
	var response = {
		error: null
	};
	Service.getPatronData(id).then(data => {

		if(data === false) {
			response.error = "Can't get patron data";
			res.setStatus(500);
		}
		else {
			response['data'] = data;
				console.log("TEST3 data:", data);
		}
		
		res.send(JSON.stringify(response));
	});
}

