'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';
import {Configuration} from '../../../config/Configuration.js';
import {Router} from 'aurelia-router';

export class Checkout {
  
  constructor(systemUtils, configuration, router) {

    if(!configuration.session.data) {
      router.navigate("login");
    }

    this.utils = systemUtils;
    this.config = configuration;
    this.router = router;

    this.setList = [];
    this.activeSet = {};
    this.selectedSets = [];
    this.activeBorrower = {};
    this.activeBorrowerDisplay = "";
    this.borrowerID = "";

    this.hours = 24;
    this.days = 31;
    this.setPeriodHours = this.config.settings.defaultLoanPeriod.hours;
    this.setPeriodDays = this.config.settings.defaultLoanPeriod.days;
  }

  attached() {
    // Initialize elements
    document.getElementById("borrower-id-clear").style.display = "none";
    document.getElementById("borrower-id-input").focus();

    this.setButtonVisibility(-1);

    // Initialize view members
    this.resetActiveSet();
    this.resetActiveBorrower();

    // Populate the set list table
    this.loadSets();
    this.setSelectedPeriodValues();
    this.showLoanDataDialog(false);
  }

  activate(params, navigationInstruction) {
      if(navigationInstruction.route == "") {
        this.router.navigate("checkout");
      }
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
      fname: "",
      lname: ""
    };
    this.activeBorrowerDisplay = "No patron selected.";
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
      this.showLoanDataDialog(false);
    }
    else if(this.activeBorrower.id) {
      this.showLoanDataDialog(true);
    }
  }

  setSelectedPeriodValues() {

    // Set default hour value in dropdown
    var hourOptions = document.getElementById("hour-select").childNodes;
    for(var index of hourOptions) {
      if(index.tagName == 'OPTION' || index.tagName == 'option') {
        if(index.value == this.setPeriodHours) {
          index.setAttribute("selected", "selected");
        }
      }
    }

    // Set default hour value in dropdown
    var dayOptions = document.getElementById("day-select").childNodes;
    for(var index of dayOptions) {
      if(index.tagName == 'OPTION' || index.tagName == 'option') {
        if(index.value == this.setPeriodDays) {
          index.setAttribute("selected", "selected");
        }
      }
    }
  }

  getLoanData() {
    this.utils.doAjax('/set/loan', 'get', {setID: this.activeSet.setID}, null).then(response => {
      if(response.error) {
        console.error("Error retrieving loan data:", response.error);
      }
      else {
        this.activeSet.loan = response.data;

        // Prettify date
        var dateLen = response.data.due.length;
        this.activeSet.loan.due = this.activeSet.loan.due.substring(0, (dateLen-15));
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

  onClickBorrowerIDInput() {
    document.getElementById("borrower-id-input").style.color = "black";
    if(this.activeBorrower.id == null) {
      this.activeBorrowerDisplay = "No patron selected.";
    }
  }

  submitBorrowerID() {

    var borrowerID;
    this.showLoanDataDialog(false);

    // Validate form
    if(this.borrowerID == "") {
      console.log("Please enter a DUID");
      this.activeBorrowerDisplay = "Please enter a DUID";
    }
    else if(isNaN(this.borrowerID) !== false) {
      console.log("Please enter a number");
      this.activeBorrowerDisplay = "Please enter a number";
    }
    else if(this.borrowerID.length > this.config.settings.maxPatronIDLength) {
      console.log("Invalid ID format, please enter a valid DUID");
      this.activeBorrowerDisplay = "Invalid ID format, please enter a valid DUID";
    }
    
    else if(this.config.runtimeEnv == "development") {
      // Set the DEV SESSION active borrower
      this.activeBorrower.id = this.config.settings.devUserID;
      console.log("Dev user loaded, ID ", this.activeBorrower.id);
      this.activeBorrower.fname = "DEV";
      this.activeBorrower.lname = "USER";
      this.activeBorrowerDisplay = this.activeBorrower.fname + ", " + this.activeBorrower.lname;

      document.getElementById("borrower-id-input").style.color = "green";
      console.log("Set color:", document.getElementById("borrower-id-input").style.color);

      // Update buttons
      this.refreshSetState();
      this.refreshPatronFormState();
    }
    else {
      this.activeBorrowerDisplay = "Please wait...";
      this.utils.doAjax('/patron/data', 'get', {patronID: this.borrowerID}, null).then(response => {

          if(response.error) {
            console.log("Server error:", response.error);
            this.activeBorrowerDisplay = "Could not select user";
            document.getElementById("borrower-id-input").style.color = "red";
          }
          else {
            // Set the active borrower
            this.activeBorrower.id = this.borrowerID;
            this.activeBorrower.fname = response.data.fname;
            this.activeBorrower.lname = response.data.lname;
            this.activeBorrowerDisplay = response.data.lname + ", " + response.data.fname;

            if(this.activeSet.setID && this.activeSet.status == "Available") {
              this.showLoanDataDialog(true);
            }

            document.getElementById("borrower-id-input").style.color = "green";
            console.log("Set color:", document.getElementById("borrower-id-input").style.color);

            // Update buttons
            this.refreshSetState();
            this.refreshPatronFormState();
          }
      });      
    }
  }

  showLoanDataDialog(show) {
    if(show) {
      document.getElementById("loan-details-form").style.display = "block";
    }
    else {
      document.getElementById("loan-details-form").style.display = "none";
    }
  }

  clearActiveBorrower() {
    document.getElementById("borrower-id-input").style.color = "black";
    this.resetActiveBorrower();
    this.borrowerID = "";
    this.refreshSetState();
    this.refreshPatronFormState();
    this.showLoanDataDialog(false);
  }

  checkInSet() {
    this.utils.doAjax('/set/loan', 'delete', {setID: this.activeSet.setID}, null).then(response => {
      if(response.error) {
        console.error("Error:", response.error);
      }
      else {

        this.activeSet.loan = null;
        this.activeSet.status = "Available";
        this.loadSets();
        this.refreshSetState();

        if(!this.activeBorrower.id) {
          this.showLoanDataDialog(false);
        }
        else {
          this.showLoanDataDialog(true);
        }
      }
    });
  }

  checkOutSet() {
    this.showLoanDataDialog(false);
    if(this.activeBorrower.id) {

      var selectedDays = document.getElementById("day-select").value,
          selectedHours = document.getElementById("hour-select").value;

      var name = this.activeBorrower.fname + " " + this.activeBorrower.lname,    
        period = (parseInt(selectedDays) * 24) + parseInt(selectedHours); // period = total hours

      this.utils.doAjax('/set/loan', 'post', {patronID: this.activeBorrower.id, setID: this.activeSet.setID, patronName: name, loanPeriod: period.toString()}, null).then(response => {
        
        if(response.error) {
          console.log("Error: ", response.error);
          this.utils.sendMessage("Can't checkout set, please contact systems support");
        }
        else {
          this.getLoanData();
          this.activeSet.status = "On Loan";
          this.loadSets();
          this.refreshSetState();

          if(this.activeBorrower.id && this.activeSet.setID) {
           
          }
        }
      });
    }
    else {
      console.log("Error: no borrower active");
    }
  }
}

Checkout.inject = [SystemUtils, Configuration, Router];