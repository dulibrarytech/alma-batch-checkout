'use strict';

var jwt = require("jsonwebtoken");

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