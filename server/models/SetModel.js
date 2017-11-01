'use strict';

var database = require('../config/database');
var collection;

database.connect(function(db) {
	collection = db.collection('abcdb_set');
});

exports.fetchAllSets = function(callback) {
	var sets = [];
	try {
		var cursor = collection.find({});
        cursor.each(function(err, set) {
        	if(set != null) {
        		sets.push(set);
        	}
        	else {
        		callback(null, sets);
        	}
        });
	}
	catch (e) {
		callback("Error: " + e, null);
	}
};

exports.addSet = function(callback) {

};

exports.fetchSet = function(setID, callback) {

};

exports.updateSet = function(setID, callback) {

};

exports.removeSet = function(setID, callback) {

};