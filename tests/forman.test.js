window.grecaptcha = { reset: function () {} };

const forman = require('../src/js/forman');

/* global expect beforeAll */

describe('place order forman tests', () => {
  var mForm;
  beforeAll(() => {
    document.body.innerHTML = `<form id="testForm">
          <div class="mb-3">
            <label for="name">Name:</label>
            <input type="text" class="form-control form-control-sm" id="name" placeholder="Enter Your Full Name" pattern="[A-Za-z -]{6,50}" maxlength="50" required />
            <div class="invalid-feedback">Name is invalid</div>
          </div>
          <div class="mb-3">
            <label for="number">Phone Number:</label>
            <input type="text" class="form-control form-control-sm" id="number" placeholder="Enter Your Phone Number" pattern="^(1)?[- ]?([0-9]{3})?[- ]?([0-9]{3})[- ]?([0-9]{4})$" required />
            <div class="invalid-feedback">Phone is invalid</div>
          </div>
          <div class="mb-3">
            <label for="details">Order:</label>
            <textarea id="details" class="form-control form-control-sm" rows="5" required></textarea>
          </div>
          <div class="custom-control custom-checkbox mb-3">
            <input type="checkbox" class="custom-control-input" id="callme" name="callme" checked>
            <label class="custom-control-label" for="callme">Call me when it's ready</label>
          </div>
          <div class="mb-3">
            <div class="custom-control custom-radio custom-control-inline x-block">
              <input type="radio" class="custom-control-input" id="feedbackType1" name="category" value="menu" required>
              <label class="custom-control-label" for="feedbackType1">Menu Items</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline x-block">
              <input type="radio" class="custom-control-input" id="feedbackType2" name="category" value="service" required>
              <label class="custom-control-label" for="feedbackType2">Service</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline x-block">
              <input type="radio" class="custom-control-input" id="feedbackType3" name="category" value="app" required checked>
              <label class="custom-control-label" for="feedbackType3">App/Website</label>
            </div>
          </div>
        </form>`;
    
    mForm = forman('test');
  });
  
  test('mForm should exist', () => {
    expect(mForm).toBeTruthy();
  });
  
  test('should have 6 keys (name, number, details and callme, category)', () => {
    var res = mForm.get();
    expect(Object.keys(res).length).toBe(6);
  });
  
  test('callme should be true', () => {
    var res = mForm.get();
    expect(res.callme).toBe(true);
  });
  
  test('category should be "app"', () => {
    var res = mForm.get();
    expect(res.category).toBe('app');
  });
});
