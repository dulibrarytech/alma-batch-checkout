'use strict'

module.exports = function (app) {

	require('../modules/set/Routes.js')(app);
	require('../modules/borrower/Routes.js')(app);

    app.get('/', function(req, res) {
	    res.render('index.html');
	});
};
