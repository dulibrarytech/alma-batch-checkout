'use strict';

/*
 *	Application Settings
 */
export class Configuration {  
	constructor(){

		this.serverUrl = "localhost:9000";

		this.clientIDHEader = "abc-client";

		this.session = {
			data: null,
			token: null
		};
	}
}