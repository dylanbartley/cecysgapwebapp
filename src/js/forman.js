const $ = require('jquery/dist/jquery.slim.min.js');

const FORM_KEYS = {
  '#placeorderForm': {
    name: 1,
    number: 1,
    details: 1,
    callme: 2
  },
  '#feedbackForm': {
    category: 3,
    rating: 3,
    feedback: 1
  },
  '#testForm': {
    name: 1,
    number: 1,
    details: 1,
    callme: 2,
    category: 3
  }
};

var ForMan = (function () {
  function ForMan () {
    this.formId = null;
    this.isInputReady = false;
    this.isRecapReady = false;
  }
  
  ForMan.prototype.open = function ( id ) {
    if (!id) { throw('Attempting to open invalid form'); }
    
    this.formId = '#' + id + 'Form';
    return this;
  };
  
  ForMan.prototype.check = function ( recapReady ) {
    if (recapReady !== null && recapReady !== void (0)) { this.isRecapReady = recapReady; }

    if (!this.formId) { return; }
    
    var form = $(this.formId);
    if (!form.length) { return; }
    
    this.isInputReady = form[0].checkValidity();
    
    if (this.isInputReady && this.isRecapReady) {
      $(this.formId + ' button').attr('disabled', null);
    } else {
      $(this.formId + ' button').attr('disabled', 'disabled');
    }
  };
  
  ForMan.prototype.get = function () {
    if (!this.formId) { return null; }
    
    var keySet = FORM_KEYS[this.formId];
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
    return Object.keys(result).length > 0 ? result : null;
  };
  
  ForMan.prototype.clear = function () {
    if (!this.formId) { return; }
    
    $(this.formId)[0].reset();
    $(this.formId + ' button').attr('disabled', 'disabled');
    $(this.formId + ' .was-validated').removeClass('was-validated');
  };
  
  return ForMan;
})();

module.exports = function ( id ) { return (new ForMan()).open(id); };