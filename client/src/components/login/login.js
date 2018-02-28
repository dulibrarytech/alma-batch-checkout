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
    console.log("Login attached()");

    if(this.config.session.data) {
        console.log("TEST login: session data present, redirecting to checkout...");
        this.router.navigate("/checkout");
    }
    else {
        console.log("TEST no session.  Login here...");
    }
  }
}

Login.inject = [SystemUtils, Configuration, Router];