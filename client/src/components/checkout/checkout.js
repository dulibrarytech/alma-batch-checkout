'use strict'
import {SystemUtils} from '../../utils/SystemUtils.js';

export class Checkout {
  
  constructor() {

    this.setList = [];
    this.activeSet = {

    };
    this.selectedSets = [];

    this.activeBorrower = {

    };

    // Populate the set list table
    this.loadSets();
  }

  // Get the set list from the server, populate list
  loadSets() {

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