'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';

export class Admin {
  
  constructor(systemUtils) {
    this.utils = systemUtils;
    this.setList = [];
    this.activeSet = {};
    this.activeBarcode = "";

    // Dialog variables
    this.barcode = "";
  }

  attached() {
  	this.loadSets();
  	this.showSetWindow(false);
  }

  editSet(index) {

    // Store active set
    this.activeSet.name = this.setList[index].name || "";
    this.activeSet.creator = this.setList[index].creator || "";
    this.activeSet.createDate = this.setList[index].createDate || "";
    this.activeSet.setID = this.setList[index].setID || null;
    this.activeSet.loanPeriod = this.setList[index].loanPeriod || "";
    this.activeSet.status = this.setList[index].status || "";

    // Get set items
    this.utils.doAjax('/set/items', 'get', {setID: this.activeSet.setID}, null).then(response => {
      if(response.error) {
        console.log("Server error:", response.error);
      }
      else {
        this.activeSet.items = response.items;
          console.log("TEST active set is", this.activeSet);
          console.log("TEST setlist is", this.setList);
      }
    });

    this.showSetWindow("edit");
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

  /* 
   * ["edit" | "new" | false]
   */
  showSetWindow(show) {

    switch(show) {
      case "edit":
        document.getElementById("edit-set-section").style.display = "block";
        document.getElementById("new-set-section").style.display = "none";
        break;
      case "new":
        this.resetActiveSet();
        document.getElementById("edit-set-section").style.display = "none";
        document.getElementById("new-set-section").style.display = "block";
        break;
      case false:
      default:
        this.resetActiveSet();
        document.getElementById("edit-set-section").style.display = "none";
        document.getElementById("new-set-section").style.display = "none";
        break;
    }
  }

  createSet() {
    console.log("Create set");
  }

  updateSet(setID) {
    console.log("Update item ", setID);

    
  }

  resetActiveSet() {
      console.log("TEST Reset active set");
    this.activeSet = {
      name: "",
      creator: "",
      createDate: "",
      setID: null,
      loanPeriod: "",
      status: "",
      items: []
    };
  }

  validateBarcode(barcode) {
    var isValid = false;
    if(barcode != "" && isNaN(barcode) === false) {
      console.log("TEST barcode is valid");
      isValid = true;
    }

    return isValid;
  }

  addBarcode() {
    if(this.activeSet.setID && this.validateBarcode(this.barcode) === true) {
      this.activeSet.items.push(this.barcode);
      this.barcode = "";
    }
  }

  selectSetItem(index) {
    if(this.activeSet.setID) {
      //this.activeBarcode = this.activeSet.items[index];
    }
  }

  removeBarcode(index) {
    this.activeSet.items.splice(index,1);
    this.activeBarcode = "";
  }
}

Admin.inject = [SystemUtils];