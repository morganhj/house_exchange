// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)


// ----------------------------------------------------
// Note(lewagon): ABOVE IS RAILS DEFAULT CONFIGURATION
// WRITE YOUR OWN JS STARTING FROM HERE 👇
// ----------------------------------------------------

// External imports
import "bootstrap";

// Internal imports, e.g:
// import { initSelect2 } from '../components/init_select2';

// import "@fortawesome/fontawesome-free/css/all.min.css"
import $ from "jquery"
import "popper.js"
import { initFlatpickr } from "../plugins/flatpickr";
import 'mapbox-gl/dist/mapbox-gl.css'; // <-- you need to uncomment the stylesheet_pack_tag in the layout!

import { initMapbox } from '../plugins/init_mapbox';
import { initAutocompleteLocation } from "../plugins/init_autocomplete";
import { initAutocompleteCity } from "../plugins/init_autocomplete";
// import { initChatbox } from "../plugins/init_chatbox";
// import { initCalendar } from "../plugins/init_calendar";
import { initHomesForm } from "../plugins/init_homes_form";
import "../plugins/init_nav_scroll";
import "../plugins/init_carousel";
// import { scrollLastMessageIntoView } from '../components/scroll';




// initChatbox();
// initCalendar();

document.addEventListener('turbolinks:load', () => {
  // Call your functions here, e.g:
  // initSelect2();
  	initFlatpickr();
	initAutocompleteLocation();
	initAutocompleteCity();
	initMapbox();
	initHomesForm();
});
