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
      status: "",
      items: [],
      loan: null
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
          this.setList = [];
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
    // Unselect all rows
    var rows = document.getElementsByClassName("set-row");
    for(var row of rows) {

      row.style.borderStyle = "none";
    }

    // Highlight selected row
    var id = "set-row-" + (index+1);
    document.getElementById(id).style.borderStyle = "solid";
    document.getElementById(id).style.borderWidth = "1px";
    document.getElementById(id).style.borderColor = "#0BB3E4";

    // Store active set
    this.activeSet.name = this.setList[index].name;
    this.activeSet.creator = this.setList[index].creator;
    this.activeSet.createDate = this.setList[index].createDate;
    this.activeSet.setID = this.setList[index].setID;
    this.activeSet.loanPeriod = this.setList[index].loanPeriod;
    this.activeSet.status = this.setList[index].status;
    this.activeSet.loan = null;
    this.refreshSetState();

    // If on loan, get the loan data
    if(this.activeSet.status == "On Loan") {
      this.getLoanData();
    }
  }

  getLoanData() {
    this.utils.doAjax('/set/loan', 'get', {setID: this.activeSet.setID}, null).then(response => {
      if(response.error) {
        console.error("Error retrieving loan data:", response.error);
      }
      else {
        this.activeSet.loan = response.data;
      }
    });
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

  refreshPatronFormState() {
    if(this.activeBorrower.id) {
      document.getElementById("borrower-id-submit").style.display = "none";
      document.getElementById("borrower-id-clear").style.display = "inline-block";
    }
    else {
      document.getElementById("borrower-id-submit").style.display = "inline-block";
      document.getElementById("borrower-id-clear").style.display = "none";
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

      this.utils.doAjax('/patron/data', 'get', {patronID: this.borrowerID}, null).then(response => {

          if(response.error) {
            console.log("Server error:", response.error);
          }
          else {

            // Set the active borrower
            this.activeBorrower.id = this.borrowerID;
            this.activeBorrower.name = response.data.lname + ", " + response.data.fname;

            // Update buttons
            this.refreshSetState();
            this.refreshPatronFormState();
          }
      });      
    }
  }

  clearActiveBorrower() {
    this.resetActiveBorrower();
    this.borrowerID = "";
    this.refreshSetState();
    this.refreshPatronFormState();
  }

  checkInSet() {
    this.utils.doAjax('/set/loan', 'delete', {setID: this.activeSet.setID}, null).then(response => {
      if(response.error) {
        console.error("Error checkin in item: ", response.error);
      }
      else {

        this.activeSet.loan = null;
        this.activeSet.status = "Available";
        this.loadSets();
        this.refreshSetState();
      }
    });
  }

  checkOutSet() {
    if(this.activeBorrower.id) {
      this.utils.doAjax('/set/loan', 'post', {patronID: this.activeBorrower.id, setID: this.activeSet.setID}, null).then(response => {

        this.getLoanData();
        this.activeSet.status = "On Loan";
        this.loadSets();
        this.refreshSetState();
      });
    }
    else {
      console.log("Error: no borrower active");
    }
  }
}

Checkout.inject = [SystemUtils];