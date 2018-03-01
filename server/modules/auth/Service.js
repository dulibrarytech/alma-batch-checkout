'use strict';

var jwt = require("jsonwebtoken"),
	settings = require("../../config/settings");

exports.createToken = function(userData) {
		console.log("TEST jwt data in:", userData);
    return jwt.sign(userData, settings.secret, {
      expiresIn: 10000 
    });
};

exports.validateToken = function(token) {

	return new Promise(function(fulfill, reject) {
		// verify secret and check expiry (ABC: no expire)
		jwt.verify(token, settings.secret, function(err, decoded) {      
			if (err) {
				console.log("Invalid token");
				reject(false);
			} else {
				var data = {
					decoded: decoded
				}
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
					console.log("TEST validateToken() service: token validated : ", req.decoded);

				fulfill(data);
			}
		});
	});
}

exports.validateLdapBind = function() {
	return new Promise(function(fulfill, reject) {
		fulfill(true);
	});
}