'use strict';

var Sanitizor = require('../../libs/Sanitize'),
	Token = require('../../libs/Token'),

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
				res.send(JSON.stringify(response));
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
						response['token'] = Token.createToken(data.user);

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