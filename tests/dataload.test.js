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