'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';
import {Configuration} from '../../../config/Configuration.js';
import {Router} from 'aurelia-router';

export class Login {
  
  constructor(systemUtils, configuration, router) {
    this.utils = systemUtils;
    this.config = configuration;
    this.router = router;
  }

  attached() {
    this.userName = "";
    this.passWord = "";
  }

  canActivate() {
    if(this.config.session.data) {
        this.router.navigate("/checkout");
    }
  }

  login() {
    if(this.validateLoginForm()) {
      var data = {
        username: this.userName,
        password: this.passWord
      }
      this.utils.doAjax('/auth/authenticate', 'post', data, null).then(response => {
        //this.utils.stopSpinner();
          // Check the response params
          if(typeof response == 'undefined' || typeof response.token == 'undefined' || typeof response.data == 'undefined') {
            console.log("Server authentication error");
          }
          else if(response.token == null) {
              // clear login form
              document.getElementById('username-input').value = "";
              document.getElementById('password-input').value = "";
              this.utils.sendMessage("Invalid DUID or password");
          }
          else {
            console.log(response.data.firstname + " " + response.data.lastname + " logged in at " + new Date());
            this.config.session.data = response.data;
            this.config.session.token = response.token;
              console.log(response.token);
            this.router.navigate("checkout");
          }
      });
    }
  }

  validateLoginForm() {
    return this.validateInputValue(this.userName, 20, "User name") && 
          this.validateInputValue(this.passWord, 20, "Password");
  }

  // TODO move To view helper
  validateAlphanumeric(string) {
    var valid = true,
        temp = string.replace(/\s/g,''); // Allow spaces in the string

    // Allowed characters in name
    if( /[^a-zA-Z0-9+-]/.test( temp )) {
      valid = false;
    }

    return valid;
  }

  // TODO move To view helper
  validateInputValue(value, length, element) {

    var isValid = true, msg; 

    if(value == "") {
      isValid = false;
      msg = element + " fails validation: empty string";
      console.log(msg);
      this.utils.sendMessage("Please enter a value: " + element);
    }
    else if(value.length > length) {
      isValid = false;
      msg = element + " fails validation: max length of " + length + " exceeded";
      console.log(msg);
      this.utils.sendMessage("Maximum input length (" + length + ") exceeded: " + element);
    }
    else if(this.validateAlphanumeric(value) == false) {
      isValid = false;
      msg = element + " fails validation: value entered is not alphanumeric";
      console.log(msg);
      this.utils.sendMessage("Invalid characters entered: " + element);
    }

    return isValid;
  }
}

Login.inject = [SystemUtils, Configuration, Router];