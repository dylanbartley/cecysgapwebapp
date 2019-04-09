// const cgapp = require('../src/js/app');

/* global expect */
test('blank test so file doesnt cause failure', () => {
  expect(window).toBeTruthy();
});
// /* global expect */
// describe('text validation tests', () => {
//   // const phoneRe = /^(1)?[- ]?([0-9]{3})?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
//   // test('should remove change "j@hn# _Do!" to "jhn Do"', () => {
//   //   const res = cgapp.stripEscape('j@hn# _Do!');
//   //   expect(res).toBe('jhn Do');
//   // });
  
//   test('"1-767-615-1890" should be a valid phone number', () => {
//     let res = cgapp.isPhone("1-767-615-1890");
//     expect(res).toBe(true);
//   });
  
//   test('"767-615-1890" should be a valid phone number', () => {
//     let res = cgapp.isPhone("767-615-1890");
//     expect(res).toBe(true);
//   });
  
//   test('"7676151890" should be a valid phone number', () => {
//     let res = cgapp.isPhone("7676151890");
//     expect(res).toBe(true);
//   });
  
//   test('"767 615 1890" should be a valid phone number', () => {
//     let res = cgapp.isPhone("767 615 1890");
//     expect(res).toBe(true);
//   });
  
//   test('"615-1890" should be a valid phone number', () => {
//     let res = cgapp.isPhone("615-1890");
//     expect(res).toBe(true);
//   });
  
//   test('"6151890" should be a valid phone number', () => {
//     let res = cgapp.isPhone("6151890");
//     expect(res).toBe(true);
//   });
  
//   test('"(767)615-1890" should not be a valid phone number', () => {
//     let res = cgapp.isPhone("(767)615-1890");
//     expect(res).toBe(false);
//   });
  
//   test('"0000" should not be a valid phone number', () => {
//     let res = cgapp.isPhone("0000");
//     expect(res).toBe(false);
//   });
  
//   test('"" should not be a valid phone number', () => {
//     let res = cgapp.isPhone("");
//     expect(res).toBe(false);
//   });
  
//   test('null should not be a valid phone number', () => {
//     let res = cgapp.isPhone(null);
//     expect(res).toBe(false);
//   });
// });