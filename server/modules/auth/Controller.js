'use strict';

var Model = require('./Model'),
    Service = require('./Service'),
    settings = require("../../config/settings"),

    jwt = require("jsonwebtoken");

exports.authenticate = function(req, res) {

	if(!req.body.username || !req.body.password) {
		res.sendStatus(400);
	}
	else {

		// Validate DU LDAP credentials
		Service.validateLdapBind(username, password).then(data => {
			if(data === false) {
				response['error'] = "Authentication error";
				res.setStatus(200);
			}
			else {
				// Validate ABC user
				Model.authenticateUser(username, function(err, response) {
					if(err) {
						response['error'] = err;
						res.status(200);
					}
					else {
						if(response.auth === true) {
							response['data'] = null;
						}
						else {
							// Get token
							response['token'] = 

							// Get user data
							response['data'] = response.user;

							res.send(JSON.stringify(response));
						}
					}
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

exports.createToken = function(userData) {
    return jwt.sign(userData, settings.secret, {
      expiresIn: 10000 
    });
};

exports.validateToken = function(req, res) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, settings.secret, function(err, decoded) {      
			if (err) {
				console.log("Invalid token");
				return res.sendStatus(403);
			} else {

				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    

				// TODO refresh token, then re-store in header:
				// delete decoded.iat;
				// delete decoded.exp;
				//req.headers['x-access-token'] = createToken(decoded);

				next();
			}
		});

	} else {
		console.log("No token present"); // DEV
		return res.sendStatus(403);

	}
}