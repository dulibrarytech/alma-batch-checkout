'use strict'

import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Configuration} from '../../config/Configuration';

export class SystemUtils {

	constructor(httpClient, config) {

		this.http = httpClient;
    	this.config = config;

		if(typeof httpClient != 'undefined') {
			httpClient.configure(config => {
	            config
	                .withBaseUrl(this.config.serverUrl)
	                .withDefaults({
	                    headers: {
	                        'Accept': 'application/json',
	                        'client-id-header': this.config.clientIDHeader,
	                        'x-access-token': null
	                    }
	                });
	        });
		}

        // Config spinner
        var opts = {
			  
			  zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '350px' // Top position relative to parent
			, left: '50%' // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'relative' // Element positioning
			}
		this.spinner = new Spinner(opts);
	}

	doAjax(url, method, data, callback) {

        var options = {
        	method: method
        }

        if(method == 'get' && data != null) {
        	var qString = "?";
	        for(var field in data) {
	            qString += field + "=" + data[field] + "&";
	        }
	        url += qString.slice(0, -1);
        }
        else if(method != 'get') {
        	options['body'] = json(data);
        }

        // Add headers
        this.http.defaults.headers['x-access-token'] = this.config.session.token || null;

        // Start spinner
        var target = document.getElementById(this.config.mainContentDiv);
        if(target) {
        	this.startSpinner();
        	target.appendChild(this.spinner.el);
        }

        // Run the request
        return this.http.fetch(url, options).then(response => response.json())
        .then(response => {
        	this.stopSpinner();
        	return response;
        }).catch(error => {
				console.log(error);
				return error;
			});
	}

	startSpinner() {
		this.spinner.spin();
	}

	stopSpinner() {
		this.spinner.stop();
	}

	sendMessage(message) {
		console.log(message);

		// Class message spans
		var elts = document.getElementsByClassName('message');
		for(var i=0; i<elts.length; i++) {
			elts[i].innerHTML = message;
		}
		setTimeout(function() { 
			for(var i=0; i<elts.length; i++) {
				elts[i].innerHTML = "";
			}
		}, 3000);
	}

	clearMessages() {
		var elts = document.getElementsByClassName('message');
		for(var i=0; i<elts.length; i++) {
			elts[i].innerHTML = "";
		}
	}

	logout() {
        this.config.session.data = null;
        this.config.session.token = null;
		window.location.replace(this.config.ssoLogoutUrl);
    }
}

SystemUtils.inject = [HttpClient, Configuration];
