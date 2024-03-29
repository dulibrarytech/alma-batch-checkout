'use strict';

var Sanitizor = require('../../libs/Sanitize'),
	Token = require('../../libs/Token'),

	settings = require('../../config/settings'),

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

		if(settings.environment == "development") {

			// Log the dev session instance
			console.log("Dev session active " + new Date());

			// Send the dev session token and data
			var devSession = {
				firstname: "Dev",
				lastname: "Session"
			};
			response['token'] = Token.createToken(devSession);
			response['data'] = devSession;

			res.send(JSON.stringify(response));
		}
		else {

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
}

exports.authenticateSSO = function(req, res) {
	let username = req.body.employeeID || "";
  	let host = req.body.HTTP_HOST || null; 

	try {
		if(host && host == settings.ssoHost) {
			Model.authenticateUser(username, function(err, data) {
				if(err) {
					console.error(err);
					res.sendStatus(500);
				}
				else if(data.auth === true) {
					let token = Token.createToken({...data.user, });
					let ssoClientLoginUrl = `${settings.ssoClientLoginUrl}?token=${token}`;
					res.redirect(ssoClientLoginUrl);
				}
			});
		}
		else res.send(401);
	}
	catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
}

exports.validateToken = function(req, res) {
	let isValid = false;
	let token = req.body.token || null;
	let data = Token.validateToken(token);

	if(data) isValid = true;
	res.send({isValid, data})
}