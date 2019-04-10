const $ = require('jquery');
const cgapp = require('../src/js/app');

/* global expect, beforeAll */

describe('menu item loading tests with data', () => {
  beforeAll(() => {
    document.body.innerHTML = `<div id="tabMenuFood"><ul class="list-group list-group-flush">
                                <li class="list-group-item menu-item dummy">
                                  <p>Dummy</p>
                                  <small>some food</small>
                                </li></ul></div>
                              <div id="tabMenuDrinks"><ul class="list-group list-group-flush">
                                <li class="list-group-item menu-item dummy">
                                  <p>Drink</p>
                                  <small>some drink</small>
                                </li></ul></div>`;
    cgapp.loadMenu([
      { name: 'Sandwich', description: 'A normal sandwich', type: 1, hasMore: true },
      { name: 'Water', description: 'sm or lg bottled water', type: 3, hasMore: false }
    ]);
  });
  
  test('should remove default dummy items', () => {
    var items = $('.dummy');
    expect(items.length).toBe(0);
  });
  
  test('should add 1 food item', () => {
    var items = $('#tabMenuFood .menu-item');
    expect(items.length).toBe(1);
  });
  
  test('1st food item should have "Sandwich" in paragraph element', () => {
    var name = $('#tabMenuFood .menu-item:first-child p');
    expect(name.text()).toBe('Sandwich');
  });
  
  test('1st food item should have more info link', () => {
    var link = $('#tabMenuFood .menu-item:first-child a');
    expect(link.length).toBe(1);
  });
  
  test('should add 1 drink item', () => {
    var items = $('#tabMenuDrinks .menu-item');
    expect(items.length).toBe(1);
  });
});

describe('menu item loading tests without data', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="tabMenuFood"><ul class="list-group list-group-flush">
                                <li class="list-group-item menu-item dummy">
                                  <p>Dummy</p>
                                  <small>some food</small>
                                </li></ul></div>
                              <div id="tabMenuDrinks"><ul class="list-group list-group-flush">
                                <li class="list-group-item menu-item dummy">
                                  <p>Drink</p>
                                  <small>some drink</small>
                                </li></ul></div>`;
  });
  
  test('with "undefined", should not remove default dummy items', () => {
    cgapp.loadMenu();
    
    var items = $('.dummy');
    expect(items.length).toBeGreaterThan(0);
  });
  
  test('with empty array, should not remove default dummy items', () => {
    cgapp.loadMenu([]);
    
    var items = $('.dummy');
    expect(items.length).toBeGreaterThan(0);
  });
  
  test('with non array object, should not remove default dummy items', () => {
    cgapp.loadMenu({ length: 1 });
    
    var items = $('.dummy');
    expect(items.length).toBeGreaterThan(0);
  });
});

describe('info item loading tests', () => {
  beforeAll(() => {
    document.body.innerHTML = `<div id="infoItems"><div class="info-item dummy"></div></div>`;
    
    cgapp.loadInfo([
      {
        name: 'Sandwich',
        parts: [
          {
            blocks: [
              { type: 'x', text: 'White or Brown Buns.' },
              { type: 'x', text: 'Lettuce, tomato, cucumber, mustard and mayonaisse included.' }
            ]
          },
          {
            blocks: [
              { type: 'x', text: 'Choice of toppings (turkey ham, fried egg and cheddar cheese),' },
              { type: 'x', text: 'up to 3 at $1.00 EC each' }
            ]
          },
          {
            blocks: [
              { type: 'd', text: 'e.g. a sandwich with cheese only costs $5.00 EC' },
              { type: 'd', text: 'a sandwich with ham and 2 eggs costs $7.00 EC' }
            ]
          }
        ]
      }
    ]);
  });
  
  test('should remove dummy items', () => {
    var items = $('.dummy');
    expect(items.length).toBe(0);
  });
  
  test('container should have id "sandwich"', () => {
    var id = $('.info-item').attr('id');
    expect(id).toBe('sandwich');
  });
  
  test('should have 3 paragraphs', () => {
    var count = $('p').length;
    expect(count).toBe(3);
  });
  
  test('should have 4 "x-block" items', () => {
    var count = $('.x-block').length;
    expect(count).toBe(4);
  });
});

describe('order items loading tests', () => {
  beforeAll(() => {
    document.body.innerHTML = `<div id="orderItems"></div>`;
    
    cgapp.loadOrders([
      {
        uid: 'none', status: 1, timestamp: 1554898668853, name: 'john smith', number: '615 1890', details: 'some chicken'
      },
      {
        uid: 'asdfa', status: 2, timestamp: 1554898668853, name: 'joe bloe', number: '767 111 2222', details: 'sandwich \n coke'
      },
      {
        uid: 'ht232', status: 3, timestamp: 1554898668853, name: 'joe bloe', number: '767 111 2222', details: 'sandwich \n coke'
      }
    ]);
  });
  
  test('should have three order-item divs', () => {
    var count = $('.order-item').length;
    expect(count).toBe(3);
  });
  
  test('1st item should have span stating order is "order was placed"', () => {
    var span = $('.order-item:first-child .order-status');
    var text = span.text();
    expect(text).toBe('order was placed');
  });
  
  test('2nd item should have span stating order is "ready and held for you"', () => {
    var span = $('.order-item:nth-child(2) .order-status');
    var text = span.text();
    expect(text).toBe('ready and held for you');
  });
  
  test('3rd item should have span stating order is "ready but can be sold"', () => {
    var span = $('.order-item:nth-child(3) .order-status');
    var text = span.text();
    expect(text).toBe('ready but can be sold');
  });
  
  test('should show time "12:17 pm" with utc-0', () => {
    var text = cgapp.getTimeString(1554898668853, 'placed');
    expect(text).toBe('12:17 pm');
  });
  
  test('should show time "02:17 pm" with utc-0', () => {
    var text = cgapp.getTimeString(1554898668853, 'expire');
    expect(text).toBe('02:17 pm');
  });
});