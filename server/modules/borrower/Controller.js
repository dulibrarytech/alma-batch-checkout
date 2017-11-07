'use strict';

var async = require('async'),
    config = require('../../../config/configuration'),
    Service = require('./Service');

exports.borrowerData = function(req, res) {
	console.log("BD controller: bid:", req.query.borrowerID);

	res.sendStatus(200);
}

