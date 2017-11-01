'use strict'

require('dotenv').config();

var database = null;
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');

exports.connect = function(cb) {
	MongoClient.connect(url, function( err, db ) {
		if(err) {
			console.log("Error connecting to the database: ", err);
		}
		else {
			console.log("Connected to database on", url);
		}
		//assert.equal(null, err);
		cb(db);
	});
};