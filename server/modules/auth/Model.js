'use strict';

var database = require('../../../config/database'), collection;

database.connect(function(db) {
	collection = db.collection('abcdb_user');
});

exports.authenticateUser = function(userID, callback) {
	var data = {
		auth: false,
		user: {}
	};
	try {

		var cursor = collection.find({DUID:userID});

                cursor.each(function(err, response) {
                	if(err) {
                		callback(err, null);
                	}
                	else if(response) {

            			data.auth = true;

            			data.user['firstname'] = response.fname;
            			data.user['lastname'] = response.lname;
                	}
                	else {
                		callback(null, data);
                	}
                });
	}
	catch(e) {
		callback(e, null);
	}
}