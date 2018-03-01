'use strict';

var Sanitizor = require('../../libs/Sanitize'),
	Model = require('./Model'),
    Service = require('./Service'),

    jwt = require("jsonwebtoken");

exports.authenticate = function(req, res) {

	if(!req.body.username || !req.body.password) {
		res.sendStatus(400);
	}
	else {

		var response = {
			data: null,
			token: null
		};

		var username = Sanitizor.checkInput(req.body.username),
			password = Sanitizor.checkInput(req.body.password);

		// Validate DU LDAP credentials
		Service.validateLdapBind(username, password).then(data => {
			if(data === false) {
				response['error'] = "Authentication error";
				//res.setStatus(200);
			}
			else {
				// Validate ABC user
				Model.authenticateUser(username, function(err, data) {
					if(err) {
						response['error'] = err;
						//res.status(200);
					}
					else if(data.auth === true) {
						// Get token
						response['token'] = Service.createToken(data.user);

						// Get user data
						response['data'] = data.user;
					}
					res.send(JSON.stringify(response));
				})
			}
		}).catch(error => {
			console.log(error);
			response['error'] = "Server error: Could not get patron data";
			res.status(200);
			res.send(JSON.stringify(response));
		});
	}
}

exports.validateRequestToken = function(req, res, next) {
		console.log("TEST validating token");
	// check header or url parameters or post parameters for token
	// var token = req.body.token || req.query.token || req.headers['x-access-token'];
	// 	console.log("TEST validateRequestToken() service: token rxd: ", token);

	// if (token) {

	// 	Service.validateToken(token).then(data => {
	// 			console.log("TEST validateRequestToken() service: token validated: ", data.decoded);
	// 		next();

	// 	}).catch(error => {
	// 		console.log(error);
	// 	});

	// } else {
	// 	console.log("No token present"); // DEV
	// 	return res.sendStatus(403);

	// }
	next();
}