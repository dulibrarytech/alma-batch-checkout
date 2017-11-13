'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';

export class Admin {
  
  constructor(systemUtils) {
  		console.log("U", systemUtils);
    this.utils = systemUtils;

    this.setList = [];
    this.activeSet = {};
  }

  attached() {
  	this.loadSets();
  	this.resetActiveSet();
  	this.showEditSection(false);
  }

  editSet(index) {
  	this.showEditSection(true);

    // Store active set
    this.activeSet.name = this.setList[index].name;
    this.activeSet.creator = this.setList[index].creator;
    this.activeSet.createDate = this.setList[index].createDate;
    this.activeSet.setID = this.setList[index].setID;
    this.activeSet.loanPeriod = this.setList[index].loanPeriod;
    this.activeSet.status = this.setList[index].status;
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

  showEditSection(show) {
	document.getElementById("edit-set-section").style.display = show ? "block" : "none";
  }

  closeEditSection() {
  	this.showEditSection(false);
  }

  resetActiveSet() {
    this.activeSet = {
      name: "",
      creator: "",
      createDate: "",
      setID: null,
      loanPeriod: "",
      status: ""
    };
  }
}

Admin.inject = [SystemUtils];