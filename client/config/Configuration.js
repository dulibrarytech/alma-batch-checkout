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
		this.clientIDHeader = "";
		this.mainContentDiv = "main";

		// Runtime objects (Do not change these values)
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