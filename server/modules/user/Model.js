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

exports.addUser = function(data, callback) {

    var userData = {};
    userData['fname'] = data.fname || "";
    userData['lname'] = data.lname || "";
    userData['DUID'] = data.DUID || "";
    userData['role'] = data.role || "";

    var doc = userData;
    try {
        collection.insertOne(doc).then(data => {
            callback(null, data.insertedId);
        });
    }
    catch(e) {
        callback(e, null);
    }
}

exports.updateUser = function(userID, data, callback) {

    try {
       collection.updateOne(
          { _id : ObjectId(userID) },
          { $set: { "fname" : data.fname, 
                    "lname" : data.lname,
                    "DUID" : data.DUID,
                    "role" : data.role
                  } }
       );
       callback(null, true);
    } catch (e) {
       callback(e, null);
    }
}

exports.deleteUser = function(userID, callback) {
    try {
       collection.deleteOne( { "_id" : ObjectId(userID) } );
       callback(null, true);
    } catch (e) {
       callback(e, null);
    }
}