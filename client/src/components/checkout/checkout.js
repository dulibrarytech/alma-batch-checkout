'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';

export class Checkout {
  
  constructor(systemUtils) {

    this.utils = systemUtils;

    this.setList = [];
    this.activeSet = {};
    this.selectedSets = [];
    this.activeBorrower = {};
    this.borrowerID = "";
  }

  attached() {
    // Initialize elements
    document.getElementById("borrower-id-clear").style.display = "none";

    // Initialize view members
    this.resetActiveSet();
    this.resetActiveBorrower();

    // Populate the set list table
    this.loadSets();
  }

  resetActiveSet() {
    this.activeSet = {
      name: "",
      creator: "",
      createDate: "",
      setID: "",
      loanPeriod: "",
      status: ""
    };
  }

  resetActiveBorrower() {
    this.activeBorrower = {
      id: "",
      name: ""
    };
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

    // AJAX /borrower/data/:id
    var borrowerID;
      console.log("LEN",this.borrowerID.length);
    if(this.borrowerID == "") {
      console.log("Please enter a DUID");
    }
    else if(isNaN(this.borrowerID) !== false) {
      console.log("Please enter a number");
    }
    else if(this.borrowerID.length > 9) {
      console.log("Invalid ID format, please enter a valid DUID");
    }
    else {
      document.getElementById("borrower-id-submit").style.display = "none";
      document.getElementById("borrower-id-clear").style.display = "inline-block";
    }
  }

  clearActiveBorrower() {
    document.getElementById("borrower-id-submit").style.display = "inline-block";
    document.getElementById("borrower-id-clear").style.display = "none";

    this.resetActiveBorrower();
    this.borrowerID = "";
  }

  checkInSet() {

  }

  checkOutSet() {

  }
}

Checkout.inject = [SystemUtils];