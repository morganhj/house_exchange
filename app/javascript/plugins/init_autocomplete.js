import places from 'places.js';

const initAutocompleteLocation = () => {
  const addressInput = document.getElementById('address');
  if (addressInput) {
    places({ container: addressInput });
  }
};

const initAutocompleteCity = () => {
  const addressInput = document.getElementById('city');
  if (addressInput) {
    places({ container: addressInput }).configure({
      type: 'city',
      aroundLatLngViaIP: false,
  });;
  }
};

export { initAutocompleteLocation };

export { initAutocompleteCity };