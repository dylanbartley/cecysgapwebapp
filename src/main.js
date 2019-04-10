require('./css/bootstrap.scss');
require('./css/site.css');
require('./css/theme.css');

const $ = require('jquery/dist/jquery.slim.min.js');

// main application object
window.cgapp = require('./js/app');

// show modal which are hidden by default, they are translated out of view
// otherwise they will animate down on load
$('.app-modal').css('display', 'block'); 

// update copyright years
const startYr = 2019;
const thisYr = (new Date()).getFullYear();

$('#copyrightYr').text(startYr === thisYr ? startYr : startYr + '-' + thisYr);
