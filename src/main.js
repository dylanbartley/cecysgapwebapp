require('./css/bootstrap.scss');
require('./css/site.css');
require('./css/theme.css');

const $ = require('jquery/dist/jquery.slim.min.js');

// replacement token sent when google recaptcha times out. doesn't do anything yet
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
  
  // scroll handler function
  var scrollCutoff = 75;
  var scrollTimeout = 50;
  var then = 0;
  function scrollHandler () {
    var now = Date.now();
    if (now >= (then + scrollTimeout)) {
      if (window.scrollY < scrollCutoff) {
        $('.action-container, .arrow-cont').addClass('at-top');
      } else {
        $('.action-container, .arrow-cont').removeClass('at-top');
      }
      then = now;
    }
  }
  
  // attach handler
  $(window).scroll(scrollHandler);
  // run on load
  scrollHandler();
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

// because apparently onclick="window.scroll(0, 160)" doesn't work
window.hitScroll = function () {
  window.scroll(0, 150);
};