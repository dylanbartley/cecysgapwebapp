/* global grecaptcha */

const $ = require('jquery/dist/jquery.slim.min.js');

const FORM_KEYS = {
  placeorderForm: {
    name: 1,
    number: 1,
    details: 1,
    callme: 2
  },
  feedbackForm: {
    category: 3,
    rating: 3,
    feedback: 1
  },
  testForm: {
    name: 1,
    number: 1,
    details: 1,
    callme: 2,
    category: 3
  }
};

var ForMan = (function () {
  function ForMan () {
    this.form = null;
    this.recapId = null;
    this.isInputReady = false;
    this.isRecapReady = false;
    this.token = null;
  }
  
  ForMan.prototype.open = function ( id ) {
    if (!id) { throw('Attempting to open invalid form'); }
    
    this.form = $('#' + id + 'Form');
    this.recapId = window[id + 'Cap'];
    if (!this.form.length) {
      this.form = null;
      this.recapId = null;
    }
    
    return this;
  };
  
  ForMan.prototype.check = function ( recapToken ) {
    if (recapToken) {
      this.isRecapReady = true;
      this.token = recapToken;
    } else if (recapToken === false) {
      this.isRecapReady = false;
      grecaptcha.reset(this.recapId);
    }

    if (!this.form) { return; }
    
    this.isInputReady = this.form[0].checkValidity();
    
    if (this.isInputReady && this.isRecapReady) {
      this.form.find('button').attr('disabled', null);
    } else {
      this.form.find('button').attr('disabled', 'disabled');
    }
  };
  
  ForMan.prototype.get = function () {
    if (!this.form) { return null; }
    
    var id = this.form.attr('id');
    var keySet = FORM_KEYS[id];
    var result = {};
    
    for (var key in keySet) {
      switch (keySet[key]) {
        case 1:
          result[key] = $('#' + key).val();
          break;
        case 2:
          result[key] = $('#' + key).prop('checked');
          break;
        case 3:
          result[key] = $('[name=' + key + ']:checked').val();
      }  
    }
    
    // return null if no results
    if (Object.keys(result).length < 1) { return null; }
    
    result.token = this.token;
    return result;
  };
  
  ForMan.prototype.clear = function () {
    this.token = null;
    
    if (!this.form) { return; }
    
    grecaptcha.reset(this.recapId);
    
    this.form[0].reset();
    this.form.find('button').attr('disabled', 'disabled');
    this.form.find('.was-validated').removeClass('was-validated');
    this.form.find('.i-star:not(:first-child)').removeClass('selected');
  };
  
  return ForMan;
})();

module.exports = function ( id ) { return (new ForMan()).open(id); };