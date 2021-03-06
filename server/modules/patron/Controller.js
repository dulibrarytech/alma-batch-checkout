'use strict';

var async = require('async'),
	Sanitizor = require('../../libs/Sanitize'),
    Service = require('./Service');

exports.patronData = function(req, res) {

	if(!req.query.patronID) {
		res.sendStatus(400);
	}
	else {

		var id = req.query.patronID;
		var response = {
			error: null
		};

		Service.getPatronData( Sanitizor.checkInput(req.query.patronID) ).then(data => {
			if(data === false) {
				response.error = "Can't get patron data";
				res.setStatus(200);
			}
			else {
				response['data'] = data;
			}
			res.send(JSON.stringify(response));
		}).catch(error => {
			console.log(error);
			response['error'] = "Server error: Could not get patron data";
			res.status(200);
			res.send(JSON.stringify(response));
		});
	}
}

