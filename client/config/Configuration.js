'use strict';

/*
 *	Application Settings
 */
export class Configuration {  
	constructor(){

		this.runtimeEnv = "production";

		// Service URL, no trailing slash
		this.serverUrl = "";

		// App settings
		this.clientIDHeader = "abc_client";
		this.mainContentDiv = "main";

		// TODO move this out of settings
		this.session = {
			data: null,
			token: null
		};

		this.settings = {

			devUserID: "",
			maxBarcodeLength: 30,
			maxPatronIDLength: 10,

			defaultLoanPeriod: {
				hours: 0,
				days: 2
			}
		}
	}
}