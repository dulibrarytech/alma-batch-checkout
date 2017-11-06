'use strict'
import {SystemUtils} from '../../utils/SystemUtils.js';

export class Checkout {
  
  constructor(systemUtils) {

    this.utils = systemUtils;

    this.setList = [];
    this.activeSet = {
      name: "",
      creator: "",
      createDate: "",
      setID: "",
      loanPeriod: "",
      status: ""
    };
    this.selectedSets = [];

    this.activeBorrower = {

    };
  }

  attached() {
    // Initialize elements
    document.getElementById("borrower-id-clear").style.display = "none";

    // Populate the set list table
    this.loadSets();
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
          console.log("DEV: SetList:", this.setList);
    });
  }

  // Click on a row in the set list table.  Set as active set, but do not select the set.
  onSelectSetRow() {

  }

  // Select a set via the checkbox.  Set as active set, and add to selected sets array.
  onSelectSet() {

  }

  submitBorrowerID() {

  }

  clearActiveBorrower() {

  }

  checkInSet() {

  }

  checkOutSet() {

  }
}

Checkout.inject = [SystemUtils];