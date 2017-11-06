'use strict';

/*
 *	Application Settings
 */
export class Configuration {  
	constructor(){

		this.serverUrl = process.env.APP_HOST + ":" + process.env.APP_PORT;

		this.clientIDHEader = "abc-client";

		this.session = {
			data: null,
			token: null
		};
	}
}