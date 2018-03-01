'use strict'


const Entities = require('html-entities').XmlEntities,
	  entities = new Entities(),
	  striptags = require('striptags');

exports.checkInput = function(value) {
	var sanitized = "";

	// Sanitize string values only
	if(typeof value == 'string') {
		sanitized = entities.encode(value);
		sanitized = striptags(sanitized);
		sanitized = striptags(sanitized, '<script>');
		sanitized = striptags(sanitized, ['a']);
		sanitized = striptags(sanitized, [], '\n');
	}
	else {
		sanitized = value;
	}

	return sanitized;
}