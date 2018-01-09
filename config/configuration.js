'use strict';
require('dotenv').config();

module.exports = {
	baseUrl : process.env.APP_HOST + ":" + process.env.APP_PORT,
	environment :  process.env.NODE_ENV,
	alma_api_key : process.env.ALMA_API_KEY
}