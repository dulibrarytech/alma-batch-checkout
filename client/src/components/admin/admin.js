'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';
import {Configuration} from '../../../config/Configuration.js';

export class Admin {
  
  constructor(systemUtils, configuration) {
    this.utils = systemUtils;
    this.settings = configuration.settings;

    this.setList = [];
    this.activeSet = {};
    this.activeBarcode = "";

    // Dialog variables
    this.barcode = "";
    this.setName = "";
  }

  attached() {
  	this.loadSets();
  	this.showSetWindow(false);
  }

  activate(params, navigationInstruction) {
      //console.log("TEST", navigationInstruction);
  }

  editSet(index) {

    this.utils.clearMessages();

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

  /* 
   * ["edit" | "new" | false]
   */
  showSetWindow(show) {

    switch(show) {
      case "edit":
        document.getElementById("edit-set-section").style.display = "block";
        document.getElementById("new-set-section").style.display = "none";
        document.getElementById("add-barcode").focus();
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

    if(this.validateCreateSetForm()) {
      var body = {
        title: this.setName,
        creator: "",
        period: 48
      }

      this.utils.doAjax('/set', 'post', body, null).then(response => {
        if(response.error) {
          console.log("Server error:", response.error);
        }
        else {
          console.log("Set created: ", response.id);
          this.utils.sendMessage("Set created");
          this.setName = "";
          this.loadSets();
        }
      });
    }
  }

  updateSet(setID) {
    if(this.validateSetForm()) {
      if(typeof setID == 'undefined' && this.activeSet.setID) {
        setID = this.activeSet.setID;
      }

      var body = {
        setID: setID, 
        data: {}
      }
      body.data['title'] = this.activeSet.name;
      body.data['items'] = this.activeSet.items.length === 0 ? "" : this.activeSet.items;

      this.utils.doAjax('/set', 'put', body, null).then(response => {
        if(response.error) {
          console.log("Server error:", response.error);
        }
        else {
          console.log("Set updated");
          this.utils.sendMessage("Set updated");
          this.loadSets();
        }
      });
    }
  }

  confirmRemoveSet(setID) {
    document.getElementById("remove-set-button").style.display = "none";
    document.getElementById("remove-set-button-confirm").style.display = "block";

    setTimeout(function() { 
      document.getElementById("remove-set-button").style.display = "block";
      document.getElementById("remove-set-button-confirm").style.display = "none";
    }, 3000);
  }

  removeSet(setID) {
    if(typeof setID == 'undefined' && this.activeSet.setID) {
      setID = this.activeSet.setID || "";
    }

    document.getElementById("remove-set-button").style.display = "block";
    document.getElementById("remove-set-button-confirm").style.display = "none";

    var body = {
      setID: setID
    }

    this.utils.doAjax('/set', 'delete', body, null).then(response => {
      if(response.error) {
        console.log("Server error:", response.error);
      }
      else {
        console.log("Set deleted");
        //this.utils.sendMessage("Set updated");
        this.showSetWindow(false);
        this.loadSets();
      }
    });
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
    this.setName = ""; // new set
  }

  // TODO move To view helper
  validateAlphanumeric(string) {
    var valid = true;

    if( /[^a-zA-Z0-9]/.test( string )) {
      valid = false;
    }

    return valid;
  }

  // TODO move To view helper
  validateInputValue(value, length, element) {
    var isValid = true;

    if(value == "") {
      isValid = false;
      console.log(element, "fails validation: empty string");
    }
    else if(value.length > length) {
      isValid = false;
      console.log(element, "fails validation: max length of " + length + " exceeded");
    }
    else if(this.validateAlphanumeric(value) == false) {
      isValid = false;
      console.log(element, "fails validation: value entered is not alphanumeric");
    }

    return isValid;
  }

  validateSetForm() {
    return this.validateInputValue(this.activeSet.name, 50, "Name");
  }

  validateCreateSetForm() {
    return this.validateInputValue(this.setName, 50, "Name");
  }

  validateBarcode() {
    return this.validateInputValue(this.barcode, this.settings.maxBarcodeLength, "Barcode");
  }

  addBarcode() {

    if(this.activeSet.setID && this.validateBarcode() === true) {
      if(this.activeSet.items.length === 0) {
        this.activeSet.items = [];
      }
      this.activeSet.items.push(this.barcode);
      this.barcode = "";
      document.getElementById("add-barcode").focus();
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

Admin.inject = [SystemUtils, Configuration];