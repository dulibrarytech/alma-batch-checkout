module.exports = {
	
	// Server settnigs from environment file
	baseUrl : 			process.env.APP_HOST + ":" + process.env.APP_PORT,
	environment :  		process.env.NODE_ENV,
	alma_api_key: 		process.env.ALMA_API_KEY,
	client_header: 		process.env.CLIENT_HEADER,
	LDAPAuthService: 	process.env.LDAP_SERVICE,
	secret: 			process.env.JWT_SECRET,

	// Application settings from admin
	enable_alma_connection: true
}