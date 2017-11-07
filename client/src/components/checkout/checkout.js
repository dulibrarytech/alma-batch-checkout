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
    this.setButtonVisibility(-1);

    // Initialize view members
    this.resetActiveSet();
    this.resetActiveBorrower();

    // Populate the set list table
    this.loadSets();
  }

  setButtonVisibility(state) {
    if(state === 0) {
      document.getElementById("checkin-button").style.display = "none";
      document.getElementById("checkout-button").style.display = "inline-block";
    }
    else if(state === 1) {
      document.getElementById("checkin-button").style.display = "inline-block";
      document.getElementById("checkout-button").style.display = "none";
    }
    else if(state === -1) {
      document.getElementById("checkin-button").style.display = "none";
      document.getElementById("checkout-button").style.display = "none";
    }
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
    this.setButtonVisibility(-1);
  }

  resetActiveBorrower() {
    this.activeBorrower = {
      id: null,
      name: "No patron selected"
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
    });
  }

  // Click on a row in the set list table.  Set as active set, but do not select the set.
  onSelectSetRow(index) {

    this.activeSet.name = this.setList[index].name;
    this.activeSet.creator = this.setList[index].creator;
    this.activeSet.createDate = this.setList[index].createDate;
    this.activeSet.setID = this.setList[index].setID;
    this.activeSet.loanPeriod = this.setList[index].loanPeriod;
    this.activeSet.status = this.setList[index].status;
    this.refreshSetState();
  }

  // Select a set via the checkbox.  Set as active set, and add to selected sets array.
  onSelectSet(index) {
    this.onSelectSetRow(index);

    // Add id to this.selectedSets[]
  }

  refreshSetState() {
    if(this.activeSet.setID && this.activeSet.status == "On Loan") {
      this.setButtonVisibility(1);
      document.getElementById("message-display").innerHTML = "";
    }
    else if(this.activeSet.setID && this.activeSet.status == "Available") {
      if(this.activeBorrower.id) {
        this.setButtonVisibility(0);
        document.getElementById("message-display").innerHTML = "";
      }
      else {
        this.setButtonVisibility(-1);
        document.getElementById("message-display").innerHTML = "Please select a patron to check out this item.";
      }
    }
    else {
      this.setButtonVisibility(-1);
      document.getElementById("message-display").innerHTML = "";
    }
  }

  submitBorrowerID() {

    var borrowerID;

    // Validate form
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

      this.utils.doAjax('/patron/data', 'get', {patronID: borrowerID}, null).then(response => {

          if(response.error) {
            console.log("Server error:", response.error);
          }
          else {

            // Set the active borrower
            this.activeBorrower.id = this.borrowerID;
            this.activeBorrower.name = response.data.lname + ", " + response.data.fname;

            // Update buttons
            this.refreshSetState();
          }
      });      
    }
  }

  clearActiveBorrower() {
    document.getElementById("borrower-id-submit").style.display = "inline-block";
    document.getElementById("borrower-id-clear").style.display = "none";
    this.resetActiveBorrower();
    this.borrowerID = "";
    this.refreshSetState();
  }

  checkInSet() {

  }

  checkOutSet() {

  }
}

Checkout.inject = [SystemUtils];