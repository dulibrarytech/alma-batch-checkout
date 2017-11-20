'use strict';

var database = require('../../../config/database');
var ObjectId = require('mongodb').ObjectID;
var Alma = require('../../libs/Alma.js');
var collection, loanCollection;

database.connect(function(db) {
	collection = db.collection('abcdb_set');
        loanCollection = db.collection('abcdb_loan');
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

exports.getLoanBySetId = function(setID, callback) {
        var data = {};
        try {
                loanCollection.findOne( {setID: setID}).then(loan => {
                        if (loan) {

                                data['due'] = loan.due;
                                data['userID'] = loan.userID;

                                Alma.getUserName(loan.userID, function(err, name) {
                                        if(err) {
                                                console.log("Error: ", err);
                                        }
                                        else {
                                                data['username'] = name;
                                        }
                                });
                        }
                        else {
                                console.log("No loan found for set", setID);
                        }
                        callback(null, data);
                });
        }
        catch(e) {
                callback(e, null);
        }
}

// Add the loan doc
exports.addLoan = function(patronID, setID, callback) {
                console.log("TEST in addLoan()");
        try {
                // var doc = {
                //         setID:
                //         userID:
                //         due:
                // }
                // db.products.insertOne(doc);
                getSet(setID, function(err, set) {
                        if(err) {
                                console.log("Error: ", err);
                        }
                        else {
                                console.log("Set: ", set);
                                console.log("Datetest: ", Date.now());
                                //var dueDate = 
                        }
                });
        } catch (e) {
                print (e);
        };
}

exports.deleteLoan = function(loanID, callback) {

}

// Set status on set
var setStatus = function(status, setID, callback) {
        var status = status == true ? "ON_LOAN" : "AVAILABLE";
        try {
           collection.updateOne(
              { _id : ObjectId(setID) },
              { $set: { "status" : status } }
           );
           callback(null, true);
        } catch (e) {
           callback(e, null);
        }
}

exports.getSet = function(setID, callback) {
        var set = {};
        try {
                collection.findOne( {_id: ObjectId(setID)}).then(set => {
                        if (set) {
                                set = set;
                        }
                        else {
                                console.log("No set found");

                        }
                        callback(null, date);
                });
        }
        catch(e) {
                callback(e, null);
        }

}

exports.addSet = function(callback) {

}

exports.updateSet = function(setID, callback) {

}

exports.removeSet = function(setID, callback) {

}

