'use strict';

/*
 *	Application Settings
 */
export class Configuration {  
	constructor(){

		this.runtimeEnv = "production";

		// Service URL, no trailing slash
		this.serverUrl = "http://localhost:9000";

		// App settings
		this.clientIDHeader = "abc-client";
		this.mainContentDiv = "content";

		// Runtime objects (Do not change these values)
		this.session = {
			data: null,
			token: null
		};

		this.settings = {
			devUserID: "872895198",
			maxBarcodeLength: 30
		}
	}
}