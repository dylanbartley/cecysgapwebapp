/* global fetch grecaptcha */

require('promise-polyfill');
require('whatwg-fetch'); // fetch api polyfill

var $ = window.jQuery = require('jquery/dist/jquery.slim.min.js');
// tweaked boostrap to use globally defined 'jQuery' as opposed to require('jquery')
require('./lib/bootstrap/bootstrap.js');

const moment = require('moment');

// database handler
const db = require('./data');

const MENU_FOOD_CONT = '#tabMenuFood';
const MENU_DRINK_CONT = '#tabMenuDrinks';
const MENU_ITEM_TEMPLATE = '<li class="list-group-item menu-item"><p>$name</p><small>$desc</small></li>';
const INFO_ITEM_TEMPLATE = '<div id="$id" class="info-item bg-white p-2 mb-3 rounded"><h5>$name</h5></div>';
const ORDER_ITEM_TEMPLATE = `<div id="$id" class="order-item bg-white p-2 mb-3 rounded">
    <div class="order-div-border mb-1 pb-1 clearfix">
        <span class="x-block order-status rounded-lg text-center"></span>
        <div class="float-md-right">
          <span class="x-block small text-right ml-md-2">Placed At: $placed</span>
          <span class="x-block small text-right ml-md-2">Held Until: $expire</span>
        </div>
    </div>
    <div class="order-div-border mb-1 p-1">
        <span class="x-block">$name</span>
        <span class="x-block">$number</span>
    </div>
    <div class="order-details"><pre>$details</pre></div>
</div>`;

const ORDER_SUBMIT_ENDPOINT = 'https://us-central1-cecysgapwebapp.cloudfunctions.net/orderSubmit';
const ORDER_SEARCH_ENDPOINT = 'https://us-central1-cecysgapwebapp.cloudfunctions.net/orderSearch';
const MENUITEMS_ENDPOINT = 'https://cecysgapwebapp.firebaseio.com/menuitems.json';
const INFOITEMS_ENDPOINT = 'https://cecysgapwebapp.firebaseio.com/infoitems.json';

var CGApp = (function () {
  this.currentModal = null;
  this.recapToken = null;
  this.isRecapReady = false;
  this.isInputReady = false;
  
  // strips white spaces and lowercases input string
  this.cleanString = function ( input ) {
    var re = /\s/g,
    res = input.toLocaleLowerCase(),
    arr;
    
    while ((arr = re.exec(input)) !== null) {
      res = res.replace(arr[0], '');
    }
    
    return res;
  };
  
  // parse and format timestamp
  this.getTimeString = function ( timestamp, type ) {
    let m = moment(timestamp);
    
    if (type === 'expire') {
      m.add(2, 'hours');
    }
    
    return m.format('hh:mm a');
  };
  
  // build menu list item html from db item
  this.createMenuItem = function ( dataItem ) {
    var item = $(MENU_ITEM_TEMPLATE
                .replace('$name', dataItem.name)
                .replace('$desc', dataItem.description));
    
    if (dataItem.hasMore) {
      item.append(`<a href="#${this.cleanString(dataItem.name)}" onclick="cgapp.openModal('info')">Tell Me More</a>`);
    }
    
    return item;
  };
  
  // build info div item html from db item
  this.createInfoItem = function ( dataItem ) {
    var item = $(INFO_ITEM_TEMPLATE
                  .replace('$id', this.cleanString(dataItem.name))
                  .replace('$name', dataItem.name));
    
    // build parts and blocks
    for (var p = 0; p < dataItem.parts.length; p++) {
      var part = $('<p></p>');

      for (var b = 0; b < dataItem.parts[p].blocks.length; b++) {
        var blk = dataItem.parts[p].blocks[b];
        part.append(`<span class="${blk.type}-block">${blk.text}</span>`);
      }
      
      item.append(part);
    }
    
    return item;
  };
  
  // build order item html from db item
  this.createOrderItem = function ( dataItem ) {
    var item = $(ORDER_ITEM_TEMPLATE
                  .replace('$id', dataItem.uid)
                  .replace('$name', dataItem.name)
                  .replace('$number', dataItem.number)
                  .replace('$details', dataItem.details)
                  .replace('$placed', this.getTimeString(dataItem.timestamp))
                  .replace('$expire', this.getTimeString(dataItem.timestamp, 'expire')));
    
    // spoof status if order ready and passed hold time
    var status =  dataItem.status === 2 && moment(dataItem.timestamp).add(2, 'hours').isBefore(moment()) ? -1 : dataItem.status;
    
    // set status text
    switch (status) {
      case 1:
        item.find('.order-status').addClass('border border-info').text('order was placed');
        break;
      case 2:
        item.find('.order-status').addClass('bg-primary text-white').text('ready and held for you');
        break;
      case -1:
        item.find('.order-status').addClass('bg-warning text-white').text('ready but can be sold');
        break;
      case 3:
        item.find('.order-status').addClass('bg-dark text-white').text('order was sold');
        break;
      default:
        // code
    }
    
    return item;
  };
  
  // open specified modal, closing any other opened ones and collapsing nav menu
  this.openModal = function ( modalName ) {
    this.currentModal = $(`#${modalName}Modal`);
    if (this.currentModal.length) {
      // close all modals
      $('.app-modal').removeClass('opened'); 
      // open this modal
      this.currentModal.addClass('opened');
      
      // close nav menu if it's opened
      $('#collapsibleNavbar').collapse("hide");
    } else {
      this.currentModal = null;
    }
  };
  
  // close opened modal
  this.closeModal = function () {
    if (this.currentModal && this.currentModal.length) {
      this.currentModal.removeClass('opened');
      this.currentModal = null;
    }
  };
  
  // load menu items from database on to page
  this.loadMenu = function ( data ) {
    if (Array.isArray(data) && data.length) {
      $('.menu-item').remove(); // remove defaults
      
      for (var i = 0; i < data.length; i++) {
        var item = this.createMenuItem(data[i]);
        var cont = data[i].type === 3 ? MENU_DRINK_CONT : MENU_FOOD_CONT;
        
        // add item to container list
        $(cont + ' ul').append(item);
      }
    }
  };
  
  // load info items from database on to page
  this.loadInfo = function ( data ) {
    if (Array.isArray(data) && data.length) {
      $('.info-item').remove(); // remove defaults
      
      for (var i = 0; i < data.length; i++) {
        var item = this.createInfoItem(data[i]);
        
        // add item to container
        $('#infoItems').append(item);
      }
    }
  };
  
  // load order items from database on to page
  this.loadOrders = function ( data ) {
    if (Array.isArray(data) && data.length) {
      $('.order-item').remove(); // remove previous
      
      for (var i = 0; i < data.length; i++) {
        var item = this.createOrderItem(data[i]);
        
        // add item to container
        $('#orderItems').append(item);
      }
    }
  };
  
  // enable order form button
  this.formReady = function () {
    if (this.isInputReady && this.isRecapReady) {
      $('#btnOrder').attr('disabled', null);
    } else {
      $('#btnOrder').attr('disabled', 'disabled');
    }
  };
  
  // get order details from html
  this.getOrder = function () {
    var name = $('#name').val();
    var number = $('#number').val();
    var details = $('#details').val();
    
    return {
      name: name,
      number: number,
      details: details,
      token: this.recapToken
    };
  };
  
  this.orderComplete = function () {
    this.closeModal();
    // reset cgapp form logic
    this.isInputReady = false;
    this.isRecapReady = false;
    this.formReady();
    // reset form html
    $('form')[0].reset();
    $('.form-control')
      .parent()
      .removeClass('was-validated');
    // reset captcha
    grecaptcha.reset();
  };
  
  // send order to backend
  this.sendOrder = function () {
    var order = this.getOrder();
    if (order) {
      var btn = $('#btnOrder');
      btn.html('<div class="spinner-border text-light"></div>');
      //
      fetch(ORDER_SUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(order)
      })
      .then(function ( res ) {
        console.log(res);
        if (res.ok) {
          this.orderComplete();
        }
        btn.html('OK');
        return res.json();
      })
      .then(data => db.writeData('orders', data))
      .catch(function ( err ) {
        console.error(err);
        btn.html('OK');
      });
    }
  };
  
  /**
   * Post Definition Tasks
   */
   var _cg = this;
   
   // retrieve menu items
  fetch(MENUITEMS_ENDPOINT)
    .then(function ( res ) { return res.json(); })
    .then(function ( data ) { _cg.loadMenu(makeItemArray(data)); })
    .catch(function ( err ) { console.error(err); });
    
  // retrieve info items
  fetch(INFOITEMS_ENDPOINT)
    .then(function ( res ) { return res.json(); })
    .then(function ( data ) { _cg.loadInfo(makeItemArray(data)); })
    .catch(function ( err ) { console.error(err); });
    
  // retrieve order items
  db.readData('orders')
    .then(function ( items ) {
      if (!items) { return; } // no storage API is available
      
      var ids = items.map(function ( i ) { return i.uid; });
      
      return fetch(ORDER_SEARCH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(ids)
      })
      .then(function ( res ) { return res.json(); })
      .then(function ( data ) { _cg.loadOrders(makeItemArray(data)); });
    })
    .catch(function ( err ) { console.error(err); });
    
  // function to build array from data object
  function makeItemArray ( data ) {
    var arr = [];
    
    if (!data) { return arr; }
    
    // sort items by object key: e.g. item001, item025 ...
    var keys = Object.keys(data);
    keys.sort();
    
    // fill array
    for (var i = 0; i < keys.length; i++) {
      arr.push(data[keys[i]]);
    }
    
    return arr;
  }
  
  // set event listeners for form inputs
  $('.form-control')
    .focus(function () {
      $(this).parent().addClass('was-validated');
    })
    .blur(function () {
      _cg.isInputReady = $('form')[0].checkValidity();
      _cg.formReady();
    });
    
  /**
   * Google ReCaptcha Callbacks
   */
  window.recapDone = function ( token ) {
    _cg.recapToken = token;
    _cg.isRecapReady = true;
    //
    _cg.formReady();
  };
  window.recapTimeout = function () {
    _cg.isRecapReady = true;
    //
    _cg.formReady();
  };
  
  return this;
})();

module.exports = CGApp;
