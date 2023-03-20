'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';
import {Configuration} from '../../../config/Configuration.js';
import {Router} from 'aurelia-router';
import {JWTDecode} from '../../libs/jwt-decode.js';

export class Login {
  
  constructor(systemUtils, configuration, router) {
    this.utils = systemUtils;
    this.config = configuration;
    this.router = router;
  }

  canActivate(qparams) {
    this.loginSSO(qparams.token);
  }

  loginSSO(token = null) {
    if(token) {
        let userData = JWTDecode.jwtDecode(token) || {};
        this.config.session.data = userData;
        this.config.session.token = token;
        this.router.navigate("/checkout");
    }
    else {
        console.error("Token not found or invalid");
    }
  }
}

Login.inject = [SystemUtils, Configuration, Router];