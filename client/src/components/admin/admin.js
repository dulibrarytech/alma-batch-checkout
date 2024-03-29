'use strict'

import {SystemUtils} from '../../utils/SystemUtils.js';
import {Configuration} from '../../../config/Configuration.js';
import {Router} from 'aurelia-router';

export class Admin {
  
  constructor(systemUtils, configuration, router) {
    // Pointers
    this.router = router;
    this.utils = systemUtils;
    this.config = configuration;
    this.settings = configuration.settings;

    // Session data
    this.username = "";
    this.activeSession = false;

    // Interactive lists
    this.setList = [];
    this.userList = [];

    // Cache data for currently selected objects
    this.activeBarcode = "";
    this.activeSet = {};
    this.activeUser = {};

    // Form values
    this.barcode = "";
    this.setName = "";
    this.user = {
      firstname: "",
      lastname: "",
      duid: "",
      role: ""
    }
  }

  canActivate() {
    if(!this.config.session.data) {
      this.router.navigate("/login");
      return false;
    }
  }

  activate(params, navigationInstruction) {
    if(this.config.session.token) {
      this.activeSession = true;
      this.username = this.config.session.data.firstname + " " + this.config.session.data.lastname;
    }
    else {
      this.activeSession = false;
      this.username = "";
    }
  }

  attached() {
  	this.loadSets();
    this.loadUsers();
    this.showSetWindow(false);
    this.showUserWindow(false);
  }

  logout() {
    this.username = "";
    this.utils.logout();
    this.activeSession = false;
    window.location.replace(this.config.ssoLogoutUrl);
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
              status: response.sets[index].status == "ON_LOAN" ? "On Loan" : "Available"
            });
          }
        }
    });
  }

  loadUsers() {
    this.utils.doAjax('/user/all', 'get', null, null).then(response => {
        if(response.error) {
          console.log("Server error:", response.error);
        }
        else {
          this.userList = [];
          var fullname;
          for(var index of response.users) {
            fullname = index.lastname + ", " + index.firstname; 
            this.userList.push({
              userID: index.id,
              name: fullname,
              DUID: index.DUID,
              firstname: index.firstname,
              lastname: index.lastname
            });
          }
        }
    });
  }

  /* 
   * Set window logic
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

  /* 
   * User window logic
   * ["edit" | "new" | false]
   */
  showUserWindow(show) {
    switch(show) {
      case "edit":
        document.getElementById("edit-user-section").style.display = "block";
        document.getElementById("new-user-section").style.display = "none";
        break;
      case "new":
        this.resetActiveUser();
        document.getElementById("edit-user-section").style.display = "none";
        document.getElementById("new-user-section").style.display = "block";
        break;
      case false:
      default:
        this.resetActiveUser();
        document.getElementById("edit-user-section").style.display = "none";
        document.getElementById("new-user-section").style.display = "none";
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
    else {
      console.log("Invalid form entry");
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

  editUser(index) {

    this.utils.clearMessages();

    // Store active set
    this.activeUser.userID = this.userList[index].userID || null;
    this.activeUser.name = this.userList[index].name || "";
    this.activeUser.DUID = this.userList[index].DUID || "";
    this.user.firstname = this.userList[index].firstname || "";
    this.user.lastname = this.userList[index].lastname || "";
    this.user.duid = this.userList[index].DUID || "";

    this.showUserWindow("edit");
  }

  createUser() {
    if(this.validateAddUserForm()) {
      var body = {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        duid: this.user.duid
      }
      this.utils.doAjax('/user', 'post', body, null).then(response => {
        if(response.error) {
          console.log("Server error:", response.error);
        }
        else {
          this.utils.sendMessage("User added");

          this.user.firstname = "";
          this.user.lastname = "";
          this.user.duid = "";
          this.user.role = "2";
          this.loadUsers();
        }
      });
    }
    else {
      console.log("Invalid form entry");
    }
  }

  updateUser(userID) {
    if(this.validateAddUserForm()) {
      if(typeof userID == 'undefined') {
        userID = this.activeUser.userID;
      }

      var body = {
        userID: userID, 
        data: {}
      }
      body.data['firstname'] = this.user.firstname;
      body.data['lastname'] = this.user.lastname;
      body.data['duid'] = this.user.duid;
      //body.data['role'] = this.activeUser.role;

      this.utils.doAjax('/user', 'put', body, null).then(response => {
        if(response.error) {
          console.log("Server error:", response.error);
        }
        else {
          this.utils.sendMessage("User updated");
          this.loadUsers();
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

  confirmRemoveUser(userID) {
    document.getElementById("remove-user-button").style.display = "none";
    document.getElementById("remove-user-button-confirm").style.display = "block";

    setTimeout(function() { 
      document.getElementById("remove-user-button").style.display = "block";
      document.getElementById("remove-user-button-confirm").style.display = "none";
    }, 3000);
  }

  removeUser(userID) {
    if(typeof userID == 'undefined') {
      userID = this.activeUser.userID || "";
    }

    document.getElementById("remove-user-button").style.display = "block";
    document.getElementById("remove-user-button-confirm").style.display = "none";

    this.utils.doAjax('/user', 'delete', {userID: userID}, null).then(response => {
      if(response.error) {
        console.log("Server error:", response.error);
      }
      else {
        console.log("User deleted");
        //this.utils.sendMessage("Set updated");
        this.showUserWindow(false);
        this.loadUsers();
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

  resetActiveUser() {
    this.activeUser = {
      userID: null,
      name: "",
      duid: ""
    };

    this.user = {
      firstname: "",
      lastname: "",
      duid: "",
      role: ""
    }
  }

  // TODO move To view helper
  validateAlphanumeric(string) {
    var valid = true,
        temp = string.replace(/\s/g,''); // Allow spaces in the string

    // Allowed characters in name
    if( /[^a-zA-Z0-9+-]/.test( temp )) {
      valid = false;
    }

    return valid;
  }

  // TODO move To view helper
  validateInputValue(value, length, element) {

    var isValid = true, msg;

    if(value == "") {
      isValid = false;
      msg = element + " fails validation: empty string";
      console.log(msg);
      this.utils.sendMessage("Please enter a value: " + element);
    }
    else if(value.length > length) {
      isValid = false;
      msg = element + " fails validation: max length of " + length + " exceeded";
      console.log(msg);
      this.utils.sendMessage("Maximum input length (" + length + ") exceeded: " + element);
    }
    else if(this.validateAlphanumeric(value) == false) {
      isValid = false;
      msg = element + " fails validation: value entered is not alphanumeric";
      console.log(msg);
      this.utils.sendMessage("Invalid characters entered: " + element);
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

  validateAddUserForm() {
    return this.validateInputValue(this.user.firstname, 50, "Firstname") && 
            this.validateInputValue(this.user.lastname, 50, "Lastname") &&
            this.validateInputValue(this.user.duid, 50, "DUID");
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
      // TODO Implement onselect row here
      //this.activeBarcode = this.activeSet.items[index];
    }
  }

  removeBarcode(index) {
    this.activeSet.items.splice(index,1);
    this.activeBarcode = "";
  }
}

Admin.inject = [SystemUtils, Configuration, Router];