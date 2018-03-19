'use strict';

var settings = require("../../config/settings"),
    request = require("request");

exports.validateLdapBind = function(username, password) {
	return new Promise(function(fulfill, reject) {
		if(settings.runtime_env == "development") {
			console.log("Dev mode login skips LDAP: ", new Date());
			fulfill(true);
		}
		else {

			try { 
				// Validate LDAP via auth-service api
				var url = settings.LDAPAuthService;

				var form = {
					"username": username,
					"password": password
				};
				var data = {
					"method": "POST", 
			        "rejectUnauthorized": false, 
			        "url": url,
			        "headers" : {"Content-Type": "application/json"},
			        "form": form
			    }; 

				request(data, function(err,httpResponse,body) {
					if(err) {
						console.log(err);
						fulfill(false);
					}
					else {
				    	var response = JSON.parse(body);
				    	fulfill(response.auth);
					}
				});
			}
			catch (err) {
				console.log(err);
				fulfill(false);
			}
		}
	});
}