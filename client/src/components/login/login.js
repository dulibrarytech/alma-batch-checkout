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
    if(this.config.session.data) {
        this.router.navigate("/checkout");
    }
  }

  login() {

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
            console.log(response.data.firstname + " " + response.data.lastname + " logged in successfully");
          this.config.session.data = response.data;
          this.config.session.token = response.token;
          this.router.navigate("/");
        }
    });
  }
}

Login.inject = [SystemUtils, Configuration, Router];