'use strict'

var jwt = require("jsonwebtoken"),
	settings = require("../config/settings");

exports.createToken = function(data) {
    return jwt.sign(data, settings.secret, {
      expiresIn: 10000000 
    });
};

exports.validateToken = function(token="") {
	let data = false;

	try {
		data = jwt.verify(token, settings.secret);
	} catch(err) {
		console.log(err);
	}

	return data;
}