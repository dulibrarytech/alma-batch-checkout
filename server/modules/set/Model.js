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

var getSet = function(setID, callback) {
        var data = {};
        try {
                collection.findOne( {_id: ObjectId(setID)}).then(set => {
                        if (set) {
                                data = set;
                        }
                        else {
                                console.log("No set found");

                        }
                        callback(null, data);
                });
        }
        catch(e) {
                callback(e, null);
        }

}

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
exports.addLoan = function(patronID, setID, patronName, callback) {

        try {
                getSet(setID, function(err, set) {
                        if(err) {
                                console.log("Error: ", err);
                        }
                        else {
                                var date = new Date();
                                var hours = set.data.period * (60*60*1000);
                                date.setTime(date.getTime() + hours);
                                
                                var doc = {
                                        setID: setID,
                                        userID: patronID,
                                        userName: patronName,
                                        due: date
                                }

                                loanCollection.insertOne(doc).then(data => {
                                        setStatus(true, setID, function(err, data) {
                                                if(err) {
                                                        callback("Error setting status: " + err, null);
                                                }
                                        });
                                        callback(null, data.insertedId);
                                });
                        }
                });
        } catch (e) {
                callback(e, null);
        };
}

exports.deleteLoan = function(setID, callback) {
        try {
                loanCollection.findOne({"setID": setID}).then(loan => {

                        var loanID = loan._id;
                        loanCollection.deleteOne( { "_id" : ObjectId(loanID) } ).then(data => {
                                setStatus(false, setID, function(err, data) {
                                        if(err) {
                                                callback("Error setting status: " + err, null);
                                        }
                                });
                                callback(null, data.deletedCount);
                        });
                });

        } catch (e) {
                callback(e, null);
        }
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

exports.addSet = function(data, callback) {

    var setData = {};
    setData['createDate'] = new Date();
    setData['title'] = data.title || "";
    setData['creator'] = data.creator || "";
    setData['period'] = data.period || 48;

    var doc = {
        data: setData,
        status: "AVAILABLE",
        loanID: "",
        items: ""
    }

    try {
        collection.insertOne(doc).then(data => {
            callback(null, data.insertedId);
        });
    }
    catch(e) {
        callback(e, null);
    }
}

exports.updateSet = function(setID, data, callback) {
    try {
       collection.updateOne(
          { _id : ObjectId(setID) },
          { $set: { "data.title" : data.title, 
                    "items" : data.items
                  } }
       );
       callback(null, true);
    } catch (e) {
       callback(e, null);
    }
}

exports.deleteSet = function(setID, callback) {
    try {
       collection.deleteOne( { "_id" : ObjectId(setID) } );
       callback(null, true);
    } catch (e) {
       callback(e, null);
    }
}

