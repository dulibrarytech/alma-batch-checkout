'use strict';

var database = require('../../../config/database');
var ObjectId = require('mongodb').ObjectID;
var collection;

database.connect(function(db) {
	collection = db.collection('abcdb_set');
});

exports.fetchAllSets = function(callback) {
	var sets = [];
	try {
		var cursor = collection.find({});
                cursor.each(function(err, set) {
                	if(err) {
                		callback(err, null);
                	}
                	else if(set != null) {
                		sets.push(set);
                	}
                	else {
                		callback(null, sets);
                	}
                });
	}
	catch(e) {
		callback(e, null);
	}
};

exports.getSetItems = function(setID, callback) {
        var items = [];
        try {
                collection.findOne( {_id: ObjectId(setID)}, {items: 1}).then(set => {
                        if (set) {
                                items = set.items;
                        }
                        else {
                                console.log("No items found");

                        }
                        callback(null, items);
                });
        }
        catch(e) {
                callback(e, null);
        }
}

exports.addSet = function(callback) {

};

exports.fetchSet = function(setID, callback) {

};

exports.updateSet = function(setID, callback) {

};

exports.removeSet = function(setID, callback) {

};

