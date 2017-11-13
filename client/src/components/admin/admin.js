'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';

export class Admin {
  
  constructor(systemUtils) {
  		console.log("U", systemUtils);
    this.utils = systemUtils;
    this.setList = [];
  }

  attached() {
  	this.loadSets();
  }

  editSet(id) {
  	console.log("Edit set ", id);
  }

  // Get the set list from the server, populate list
  loadSets() {
    this.utils.doAjax('/set/all', 'get', null, null).then(response => {

        if(response.error) {
          console.log("Server error:", response.error);
        }
        else {
          for(var index in response.sets) {

            this.setList.push({
              name: response.sets[index].title,
              creator: response.sets[index].createdBy,
              createDate: response.sets[index].date.substring(0,10),
              setID: response.sets[index].id,
              loanPeriod: response.sets[index].loanPeriod,
              status: response.sets[index].status == "ON_LOAN" ? "On Loan" : "Available",
            });
          }
        }
    });
  }
}

Admin.inject = [SystemUtils];