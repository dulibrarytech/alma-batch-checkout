'use strict'

var jwt = require("jsonwebtoken"),
	settings = require("../config/settings");

exports.createToken = function(data) {
    return jwt.sign(data, settings.secret, {
      expiresIn: 10000000 
    });
};

exports.validateToken = function(req, callback) {
	if(! req.headers['x-access-token']) {
		console.log("No token present");
		callback(false);
	}

	var token = req.headers['x-access-token'];
	jwt.verify(token, settings.secret, function(err, decoded) {      
		if (err) {
			console.log("Invalid token");
			callback(false);
		} else {
			var data = {
				decoded: decoded
			}
			// if everything is good, save to request for use in other routes
			req.decoded = decoded;    
			callback(data);
		}
	});
}