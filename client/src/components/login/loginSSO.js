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
      this.utils.doAjax('/auth/validate', 'post', {token}, null).then(response => {
        if(response.isValid) {
          let userData = response.data || JWTDecode.jwtDecode(token) || {};
          this.config.session.data = userData;
          this.config.session.token = token;
        }
        else console.error("Invalid auth token. Chenk SSO provider response");
        this.router.navigate("checkout");
      });
    }
    else this.router.navigate("checkout");
  }
}

Login.inject = [SystemUtils, Configuration, Router];