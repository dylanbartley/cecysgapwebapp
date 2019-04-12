require('./css/bootstrap.scss');
require('./css/site.css');
require('./css/theme.css');

const $ = require('jquery/dist/jquery.slim.min.js');

const NAMESPACE = '794f6dd9-43a7-3f04-916a-7e957fefc565';

$(function () {
  // main application object
  window.cgapp = require('./js/app');
  
  // show modal which are hidden by default, they are translated out of view
  // otherwise they will animate down on load
  $('.app-modal').css('display', 'block'); 
  
  // update copyright years
  const startYr = 2019;
  const thisYr = (new Date()).getFullYear();
  
  $('#copyrightYr').text(startYr === thisYr ? startYr : startYr + '-' + thisYr);
});

/**
 * Google ReCaptcha Callbacks
 */
window.recapDone = function ( token ) {
  window.cgapp.currentForm.check(token);
};
window.recapTimeout = function () {
  window.cgapp.currentForm.check(NAMESPACE);
};
