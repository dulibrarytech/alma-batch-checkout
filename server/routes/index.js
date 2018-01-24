'use strict'

module.exports = function (app) {

	require('../modules/set/Routes.js')(app);
	require('../modules/patron/Routes.js')(app);
	require('../test/Routes.js')(app);

    app.get('/', function(req, res) {
	    res.render('index.html');
	});
};
