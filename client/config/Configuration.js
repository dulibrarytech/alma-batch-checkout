'use strict';

/*
 *	Application Settings
 */
export class Configuration {  
	constructor(){

		this.runtimeEnv = "production";

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

		// Custom settings
		this.serverUrl = "http://localhost:9010"; // no trailing slash
		this.ssoUrl = "https://authproxy.du.edu/secure";
		this.ssoResponseUrl = "http://localhost:9010/auth/sso";
		this.ssoLogoutUrl = "https://login.du.edu/_layouts/pg/signout.aspx";
	}
}
