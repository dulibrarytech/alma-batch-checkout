'use strict';

var database = require('../../../config/database');
var ObjectId = require('mongodb').ObjectID;
var Alma = require('../../libs/Alma.js');
var collection;

database.connect(function(db) {
        collection = db.collection('abcdb_user');
});

exports.getUserList = function(callback) {
        var sets = [];
        try {
                var cursor = collection.find({}).sort({'lname': 1});

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