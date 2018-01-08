'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';

export class Admin {
  
  constructor(systemUtils) {
  		console.log("U", systemUtils);
    this.utils = systemUtils;

    this.setList = [];
    this.activeSet = {};
    this.activeBarcode = "";
  }

  attached() {
  	this.loadSets();
  	this.resetActiveSet();
  	this.showSetWindow(false);
  }

  editSet(index) {

    // Store active set
    this.activeSet.name = "";
    this.activeSet.creator = "";
    this.activeSet.createDate = "";
    this.activeSet.setID = null;
    this.activeSet.loanPeriod = "";
    this.activeSet.status = "";

    // Get set items
    this.utils.doAjax('/set/items', 'get', {setID: this.activeSet.setID}, null).then(response => {
      if(response.error) {
        console.log("Server error:", response.error);
      }
      else {
        this.activeSet.items = response.items;
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
        document.getElementById("edit-set-section").style.display = "none";
        document.getElementById("new-set-section").style.display = "block";
        break;
      case false:
      default:
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

  closeSetWindow() {
    this.resetActiveSet();
  	this.showSetWindow(false);
  }

  resetActiveSet() {
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

  addBarcode() {
    if(this.activeSet.setID) {
      this.activeSet.items.push(this.activeBarcode);
      this.activeBarcode = "";
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