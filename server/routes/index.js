'use strict'

module.exports = function (app) {

	require('../modules/set/SetRoutes.js')(app);

    app.get('/', function(req, res) {
	    res.render('index.html');
	});
};
