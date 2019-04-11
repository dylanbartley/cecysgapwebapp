window.grecaptcha = { reset: function () {} };

const $ = require('jquery');
const cgapp = require('../src/js/app');

/* global expect */

describe('main app object tests', () => {
  test('it should exist', () => {
    expect(cgapp).toBeTruthy();
  });

  test('current modal should be null by default', () => {
    expect(cgapp.currentModal).toBeFalsy();
  });
  
  test('should convert object to array', () => {
    var data = JSON.parse('{"mi-001":{"description":"A normal sandwich","hasMore":true,"name":"Sandwich","type":1},"mi-100":{"description":"Awesome creamy beef soup","hasMore":false,"name":"Beef Soup","type":2},"mi-200":{"description":"sm or lg bottled water","hasMore":false,"name":"Water","type":3}}');
    var arr = [];
    
    for (var key in data) {
      arr.push(data[key]);
    }
    
    expect(arr.length).toBe(3);
  });
});

describe('dom open modal tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="placeorderModal" class="container app-modal"></div>';
    cgapp.openModal('placeorder');
  });

  afterEach(() => {
    cgapp.currentModal = null;
  });

  test('current modal should be jquery object', () => {
    expect(cgapp.currentModal).toBeTruthy();
  });

  test('current modal jquery object shold have 1 result', () => {
    expect(cgapp.currentModal.length).toBe(1);
  });

  test('current modal should have class "opened"', () => {
    expect(cgapp.currentModal.hasClass('opened')).toBeTruthy();
  });
  
  test('should only have one open modal', () => {
    document.body.innerHTML += '<div id="ordersModal" class="container app-modal"></div>';
    cgapp.openModal('orders');
    
    var modalCount = $('.app-modal.opened').length;
    expect(modalCount).toBe(1);
  });
});

describe('dom cose modal tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="placeorderModal" class="container app-modal opened"></div>';
    cgapp.currentModal = $('.app-modal.opened');
    cgapp.closeModal();
  });
  
  test('current modal should be null', () => {
      expect(cgapp.currentModal).toBeNull();
  });
});

describe('app clean string tests', () => {
  test('should transform "Snack" to "snack"', () => {
    var res = cgapp.cleanString('Snack');
    expect(res).toBe('snack');
  });
  
  test('should transform "Beef Soup" to "beefsoup"', () => {
    var res = cgapp.cleanString('Beef Soup');
    expect(res).toBe('beefsoup');
  });
  
  test('should transform "john jacob jingleheimer smith" to "johnjacobjingleheimersmith"', () => {
    var res = cgapp.cleanString('john jacob jingleheimer smith');
    expect(res).toBe('johnjacobjingleheimersmith');
  });
});
