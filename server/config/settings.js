module.exports = {
	
	// Server settnigs from environment file
	baseUrl : process.env.APP_HOST + ":" + process.env.APP_PORT,
	environment :  process.env.NODE_ENV,
	alma_api_key: process.env.ALMA_API_KEY,
	client_header: process.env.CLIENT_HEADER,

	// Application settings from admin
	//alma_api_key: "l7xx8c4c8578e6cc4dcc809e2443672b0e42"
	enable_alma_connection: true
}