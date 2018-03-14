'use strict'

import {Router} from 'aurelia-router';

export class NotFound {

  constructor(router) {
    router.navigate("login");
  }

  canActivate() {
  	return false;
  }
}

NotFound.inject = [Router];