'use strict';

var settings = require("../../config/settings");

exports.validateLdapBind = function() {
	return new Promise(function(fulfill, reject) {
		fulfill(true);
	});
}